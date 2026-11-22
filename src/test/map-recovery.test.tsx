import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import ResilientMapTiles from "@/components/ResilientMapTiles";

const tiles = vi.hoisted(() => ({ handlers: {} as Record<string, () => void>, url: "" }));
const map = { getContainer: () => document.body, invalidateSize: vi.fn() };
vi.mock("react-leaflet", () => ({
  useMap: () => map,
  TileLayer: ({ eventHandlers, url }: { eventHandlers: Record<string, () => void>; url: string }) => { tiles.handlers = eventHandlers; tiles.url = url; return null; },
}));
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });

it("recovers a tile failure on retry and gives a usable fallback", () => {
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  render(<ResilientMapTiles />);
  expect(tiles.url).toContain("cartocdn.com");
  act(() => { tiles.handlers.tileerror(); tiles.handlers.load(); });
  expect(tiles.url).toContain("openstreetmap.org");
  act(() => { tiles.handlers.tileerror(); tiles.handlers.load(); });
  expect(screen.getByText("Chưa tải được bản đồ nền")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Mở Google Maps/ })).toHaveAttribute("href", expect.stringContaining("google.com/maps"));
  fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
  act(() => tiles.handlers.tileload());
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

it("does not leave a hung tile request loading forever", () => {
  vi.useFakeTimers();
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  render(<ResilientMapTiles />);
  act(() => vi.advanceTimersByTime(8000));
  expect(screen.getByText("Đang thử nguồn bản đồ khác…")).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(8000));
  expect(screen.getByText("Chưa tải được bản đồ nền")).toBeInTheDocument();
});

it("recovers when tiles arrive after the timeout and ignores an isolated failed tile", () => {
  vi.useFakeTimers();
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  render(<ResilientMapTiles />);
  act(() => vi.advanceTimersByTime(8000));
  act(() => vi.advanceTimersByTime(8000));
  act(() => tiles.handlers.tileload());
  act(() => { tiles.handlers.tileerror(); tiles.handlers.load(); });
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
