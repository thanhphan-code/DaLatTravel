import type { ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Index from "@/pages/Index";
import Explore from "@/pages/Explore";
import Header from "@/components/Header";

vi.mock("@/components/PageTransition", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/ScrollReveal", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/WeatherWidget", () => ({
  default: () => <div>Thời tiết</div>,
}));
vi.mock("@/components/PlacesMap", () => ({ default: () => <div>Bản đồ</div> }));
afterEach(cleanup);

const renderTravel = (path = "/") =>
  render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </MemoryRouter>,
  );

describe("Travel discovery", () => {
  it("carries a trimmed homepage search into the destination results", () => {
    renderTravel();
    fireEvent.change(screen.getByLabelText("Tìm địa điểm ở Đà Lạt"), {
      target: { value: "  Cầu Đất  " },
    });
    fireEvent.submit(screen.getByRole("search"));
    expect(screen.getByLabelText("Tìm kiếm địa điểm")).toHaveValue("Cầu Đất");
    expect(screen.getByText("1 địa điểm được tìm thấy")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Đồi chè Cầu Đất" }),
    ).toBeInTheDocument();
  });

  it("opens the nature category with its filter selected", () => {
    renderTravel();
    fireEvent.click(
      screen.getByRole("link", { name: /TRẢI NGHIỆM Thiên nhiên/ }),
    );
    expect(screen.getByDisplayValue("Thiên nhiên")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Ga Đà Lạt" }),
    ).not.toBeInTheDocument();
  });

  it("allows clearing the cloud-hunting filter", () => {
    renderTravel("/explore?experience=cloud-hunting");
    expect(screen.getByText("2 địa điểm được tìm thấy")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Bỏ lọc săn mây" }));
    expect(
      screen.getByRole("heading", { name: "Ga Đà Lạt" }),
    ).toBeInTheDocument();
  });

  it("recovers from an empty search by clearing filters", () => {
    renderTravel("/explore?q=zzzz-no-place");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Chưa tìm thấy địa điểm phù hợp",
    );
    fireEvent.click(screen.getByRole("button", { name: "Xóa bộ lọc" }));
    expect(screen.getByLabelText("Tìm kiếm địa điểm")).toHaveValue("");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("closes mobile navigation with Escape and returns keyboard focus", () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Header />
      </MemoryRouter>,
    );
    const trigger = screen.getByRole("button", { name: "Mở menu" });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
    expect(
      screen.queryByRole("navigation", { name: "Điều hướng di động" }),
    ).not.toBeInTheDocument();
  });
});
