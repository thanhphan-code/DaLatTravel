import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import TravelChat from "@/components/TravelChat";
import { addPlaceToTrip, readTrips } from "@/lib/savedTrips";
import { toast } from "sonner";
import { chatCatalog } from "@/lib/travelChat";

vi.mock("@/lib/savedTrips", () => ({ addPlaceToTrip: vi.fn(), readTrips: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
  Object.defineProperty(Element.prototype, "scrollIntoView", { configurable: true, value: vi.fn() });
  vi.mocked(readTrips).mockReturnValue([
    { id: "trip", name: "Chuyến đi", days: 1, budget: "", travelType: "", createdAt: "" },
  ]);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true, json: async () => ({ reply: "Bạn có thể thêm địa điểm bên dưới." }),
  }));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

async function addFromChat() {
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><TravelChat /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: "Mở trợ lý du lịch" }));
  fireEvent.change(screen.getByPlaceholderText("Hỏi Mây về Đà Lạt..."), {
    target: { value: "Thêm Langbiang vào lịch trình" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Gửi tin nhắn" }));
  fireEvent.click(await screen.findByRole("button", { name: /Thêm .* vào chuyến/ }));
}

it("reports rejected itinerary edits without claiming success", async () => {
  vi.mocked(addPlaceToTrip).mockImplementation(() => { throw new Error("Địa điểm này đã có trong chuyến đi."); });
  await addFromChat();
  expect(toast.error).toHaveBeenCalledWith("Địa điểm này đã có trong chuyến đi.");
  expect(toast.success).not.toHaveBeenCalled();
});

it("does not claim success when the trip was not changed", async () => {
  vi.mocked(addPlaceToTrip).mockReturnValue(false);
  await addFromChat();
  expect(toast.error).toHaveBeenCalled();
  expect(toast.success).not.toHaveBeenCalled();
});

it("confirms a saved edit without assuming the scheduled period", async () => {
  vi.mocked(addPlaceToTrip).mockReturnValue(true);
  await addFromChat();
  expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("vào Ngày 1"));
  expect(screen.getByText(/Mây đã thêm/)).not.toHaveTextContent("buổi sáng");
});

it("shows an honest offline state and retries the same question without duplicating it", async () => {
  vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Failed to fetch"));
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><TravelChat /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: "Mở trợ lý du lịch" }));
  fireEvent.change(screen.getByLabelText("Tin nhắn cho Mây"), { target: { value: "Gợi ý quán ăn" } });
  fireEvent.click(screen.getByRole("button", { name: "Gửi tin nhắn" }));
  const retry = await screen.findByRole("button", { name: "Thử kết nối AI lại" });
  expect(screen.getByText(/AI chưa kết nối/)).toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: "Mở Google Maps" }).length).toBeGreaterThan(0);
  fireEvent.click(retry);
  await screen.findByText("Bạn có thể thêm địa điểm bên dưới.");
  expect(screen.getAllByText("Gợi ý quán ăn")).toHaveLength(1);
  expect(screen.queryByText(/AI chưa kết nối/)).not.toBeInTheDocument();
});

it("renders food links from the trusted catalog", async () => {
  const food = chatCatalog.find((entry) => entry.kind === "food")!;
  vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({ reply: "Một món ăn phù hợp", recommendations: [{ id: food.id, reason: "Hợp bữa tối" }] }) } as Response);
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><TravelChat /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: "Mở trợ lý du lịch" }));
  fireEvent.change(screen.getByLabelText("Tin nhắn cho Mây"), { target: { value: "Gợi ý quán ăn" } });
  fireEvent.click(screen.getByRole("button", { name: "Gửi tin nhắn" }));
  expect(await screen.findByRole("link", { name: food.name })).toHaveAttribute("href", food.url);
  expect(screen.getByRole("link", { name: "Mở Google Maps" })).toHaveAttribute("href", food.mapsUrl);
});
