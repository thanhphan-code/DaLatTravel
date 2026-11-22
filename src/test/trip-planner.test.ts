import { describe, expect, it, beforeEach } from "vitest";
import {
  defaultPreferences,
  editItinerary,
  generateItinerary,
  parseTime,
} from "@/lib/tripPlanner";
import { planningInfo } from "@/data/planning";
import { getDayStops } from "@/lib/itinerary";
import {
  addPlaceToTrip,
  decodeSharedTrip,
  encodeSharedTrip,
  readTrips,
  writeTrips,
} from "@/lib/savedTrips";
import { places, SAVED_TRIPS_KEY } from "@/data/dalat";

describe("schedule constraints", () => {
  it("keeps visits unique, ordered, within windows and back before the deadline across preferences", () => {
    for (const startTime of ["04:00", "08:00", "14:00"])
      for (const days of ["1", "3", "4"])
        for (const pace of [3, 6]) {
          const prefs = { ...defaultPreferences, startTime, days, pace };
          const plan = generateItinerary(prefs);
          const ids = plan.days.flatMap((day) =>
            getDayStops(day)
              .filter((stop) => stop.kind === "visit")
              .map((stop) => stop.placeId),
          );
          expect(new Set(ids).size).toBe(ids.length);
          expect(plan.days).toHaveLength(Number(days));
          for (const day of plan.days) {
            let end = parseTime(startTime);
            for (const stop of getDayStops(day)) {
              expect(stop.startMinutes).toBeGreaterThanOrEqual(
                end + (stop.travelMinutes ?? 0),
              );
              expect(stop.endMinutes! - stop.startMinutes!).toBe(
                stop.durationMinutes,
              );
              if (stop.placeId) {
                expect(stop.startMinutes).toBeGreaterThanOrEqual(
                  planningInfo[stop.placeId].open,
                );
                expect(stop.endMinutes).toBeLessThanOrEqual(
                  planningInfo[stop.placeId].close,
                );
              }
              end = stop.endMinutes!;
            }
            expect(parseTime(day.returnTime!)).toBeLessThanOrEqual(
              parseTime(prefs.endTime),
            );
          }
        }
  });
  it("rejects invalid hours", () => {
    for (const startTime of ["", "25:00", "03:00", "20:00"])
      expect(() =>
        generateItinerary({ ...defaultPreferences, startTime }),
      ).toThrow();
  });
  it("prefers daytime visits before the selected night market", () => {
    const plan = generateItinerary({
      ...defaultPreferences,
      days: "1",
      endTime: "21:30",
      selectedIds: ["night-market", "dalat-railway-station"],
    });
    const ids = getDayStops(plan.days[0]).map((stop) => stop.placeId);
    expect(ids.indexOf("dalat-railway-station")).toBeLessThan(
      ids.indexOf("night-market"),
    );
  });
  it("does not lose selected but unscheduled places when editing another day", () => {
    const plan = generateItinerary({
      ...defaultPreferences,
      days: "1",
      startTime: "14:00",
      endTime: "17:00",
      selectedIds: ["night-market"],
    });
    expect(plan.unscheduledIds).toContain("night-market");
    const edited = editItinerary(
      plan,
      0,
      getDayStops(plan.days[0]).filter((stop) => stop.kind === "visit"),
    );
    expect(edited.unscheduledIds).toContain("night-market");
  });
  it("rejects duplicates and infeasible edits without mutating the original", () => {
    const plan = generateItinerary(defaultPreferences);
    const original = JSON.stringify(plan);
    const visits = getDayStops(plan.days[0]).filter(
      (stop) => stop.kind === "visit",
    );
    expect(() => editItinerary(plan, 0, [visits[0], visits[0]])).toThrow(
      /chỉ ghé một lần/,
    );
    expect(() =>
      editItinerary(plan, 0, [{ ...visits[0], durationMinutes: 1000 }]),
    ).toThrow();
    expect(JSON.stringify(plan)).toBe(original);
  });
  it("recalculates after removing a stop and offers another selection", () => {
    const plan = generateItinerary({ ...defaultPreferences, days: "1" });
    const visits = getDayStops(plan.days[0]).filter(
      (stop) => stop.kind === "visit",
    );
    const next = editItinerary(plan, 0, visits.slice(1));
    expect(
      getDayStops(next.days[0]).filter((stop) => stop.kind === "visit"),
    ).toHaveLength(visits.length - 1);
    const alternative = generateItinerary(
      { ...defaultPreferences, days: "1" },
      visits.map((stop) => stop.placeId!),
      1,
    );
    expect(
      getDayStops(alternative.days[0])
        .filter((stop) => stop.placeId)
        .map((stop) => stop.placeId),
    ).not.toEqual(visits.map((stop) => stop.placeId));
  });
});
describe("saved itinerary compatibility", () => {
  beforeEach(() => localStorage.clear());
  it("saves and shares all stops and preferences", () => {
    const trip = {
      id: "test",
      name: "Đà Lạt",
      days: 3,
      budget: "trung bình",
      travelType: "cặp đôi",
      createdAt: "2026-11-21",
      itinerary: generateItinerary(defaultPreferences),
    };
    writeTrips([trip]);
    expect(readTrips()[0]).toEqual(trip);
    expect(decodeSharedTrip(encodeSharedTrip(trip))).toEqual(trip);
    const visit = getDayStops(trip.itinerary.days[0]).find(
      (stop) => stop.placeId,
    )!;
    expect(() =>
      addPlaceToTrip(
        "test",
        0,
        "morning",
        places.find((place) => place.id === visit.placeId)!,
      ),
    ).toThrow();
    expect(readTrips()[0]).toEqual(trip);
    expect(addPlaceToTrip("test", Infinity, "morning", places[0])).toBe(false);
  });
  it("rejects malformed shared data and handles a non-array storage value", () => {
    expect(
      decodeSharedTrip(
        btoa(JSON.stringify({ id: "x", name: "x", days: 1000000 })),
      ),
    ).toBeUndefined();
    localStorage.setItem(SAVED_TRIPS_KEY, "{}");
    expect(Array.isArray(readTrips())).toBe(true);
  });
});
