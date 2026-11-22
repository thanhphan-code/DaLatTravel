import type { ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Homestays from "@/pages/Homestays";
import { dalatMoods, getMoodPreferences } from "@/data/moods";
import { defaultPreferences, generateItinerary } from "@/lib/tripPlanner";
import { getDayStops } from "@/lib/itinerary";
import { foods, homestays, places } from "@/data/dalat";
import { planningInfo } from "@/data/planning";

vi.mock("@/components/PageTransition", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
afterEach(cleanup);

describe("expanded discovery", () => {
  it("can schedule every signature mood with its selected places", () => {
    for (const mood of dalatMoods) {
      const plan = generateItinerary({ ...defaultPreferences, ...getMoodPreferences(mood.id) });
      const ids = plan.days.flatMap((day) => getDayStops(day).map((stop) => stop.placeId).filter(Boolean));
      expect(ids).toEqual(expect.arrayContaining(mood.placeIds));
      expect(new Set(ids).size).toBe(ids.length);
      expect(plan.unscheduledIds ?? []).toEqual([]);
    }
    expect(getMoodPreferences("unknown")).toEqual({});
  });

  it("has unique catalog IDs, usable images and planning metadata", () => {
    for (const list of [places, foods, homestays]) {
      expect(new Set(list.map((item) => item.id)).size).toBe(list.length);
      expect(list.every((item) => Boolean(item.image))).toBe(true);
    }
    for (const place of places) expect(planningInfo[place.id]).toBeDefined();
  });

  it("filters hotel types and excludes unknown prices from capped budgets", () => {
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Homestays /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Khách sạn" }));
    expect(screen.getByRole("heading", { name: "Dalat Palace Heritage Hotel" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Ana Mandara Villas Dalat" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Mức giá mỗi đêm"), { target: { value: "300000" } });
    expect(screen.getByText("Chưa có nơi lưu trú phù hợp bộ lọc.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Xóa bộ lọc" }));
    expect(screen.getByRole("heading", { name: "Ana Mandara Villas Dalat" })).toBeInTheDocument();
  });
});
