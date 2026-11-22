import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import TripPlanner from "@/pages/TripPlanner";
import { readTrips, writeTrips } from "@/lib/savedTrips";
vi.mock("@/components/DayRouteMap", () => ({
  default: () => <div>Bản đồ tuyến</div>,
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
afterEach(cleanup);
beforeEach(() => {
  localStorage.clear();
  writeTrips([]);
});
it("generates a detailed itinerary and updates the same saved trip without duplicates", async () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <TripPlanner />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Tạo lịch trình" }));
  fireEvent.click(await screen.findByRole("button", { name: "Lưu chuyến đi" }));
  expect(readTrips()).toHaveLength(1);
  fireEvent.click(screen.getByRole("button", { name: "Lưu chuyến đi" }));
  expect(readTrips()).toHaveLength(1);
  expect(
    screen.getAllByRole("button", { name: "Thêm & tính lại giờ" }),
  ).toHaveLength(3);
  const remove = screen.getAllByRole("button", { name: /^Xóa / })[0];
  fireEvent.click(remove);
  fireEvent.click(screen.getByRole("button", { name: "Lưu chuyến đi" }));
  expect(readTrips()).toHaveLength(1);
});
