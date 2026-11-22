import {
  initialSavedTrips,
  SAVED_TRIPS_KEY,
  type SavedTrip,
} from "@/data/dalat";

import { editItinerary } from "./tripPlanner";
import {
  getDayStops,
  type TripSlot,
  type TripDay,
  type TripItinerary,
  type DayPeriod,
} from "./itinerary";
export type {
  AlternativePlace,
  TripSlot,
  TripDay,
  TripItinerary,
  DayPeriod,
} from "./itinerary";
export { getDayStops } from "./itinerary";

const INITIALIZED_KEY = `${SAVED_TRIPS_KEY}_initialized`;
const emptySlot = (time: string): TripSlot => ({
  time,
  place: "Chưa có địa điểm",
  note: "Thêm địa điểm phù hợp vào buổi này.",
});

export const emptyDay = (index: number): TripDay => ({
  label: `Ngày ${index + 1}`,
  theme: "Tự do khám phá",
  morning: emptySlot("08:00"),
  afternoon: emptySlot("14:00"),
  evening: emptySlot("18:30"),
  food: [],
  cost: "Chưa dự tính",
  notes: "",
});

export const isItinerary = (value: unknown): value is TripItinerary => {
  if (!value || typeof value !== "object") return false;
  const days = (value as TripItinerary).days;
  const isSlot = (slot: unknown): slot is TripSlot =>
    Boolean(
      slot &&
        typeof slot === "object" &&
        ["time", "place", "note"].every(
          (key) => typeof (slot as Record<string, unknown>)[key] === "string",
        ),
    );
  return (
    Array.isArray(days) &&
    days.length > 0 &&
    days.length <= 14 &&
    days.every(
      (day) =>
        day &&
        typeof day.label === "string" &&
        isSlot(day.morning) &&
        isSlot(day.afternoon) &&
        isSlot(day.evening) &&
        Array.isArray(day.food) &&
        typeof day.cost === "string" &&
        typeof day.notes === "string" &&
        (day.stops === undefined ||
          (Array.isArray(day.stops) &&
            day.stops.length <= 20 &&
            day.stops.every(isSlot))),
    )
  );
};

export const readTrips = (): SavedTrip[] => {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(SAVED_TRIPS_KEY) || "[]",
    );
    const stored = Array.isArray(parsed)
      ? parsed.filter(
          (trip): trip is SavedTrip =>
            trip &&
            typeof trip.id === "string" &&
            typeof trip.name === "string" &&
            Number.isInteger(trip.days) &&
            trip.days > 0 &&
            trip.days <= 14,
        )
      : [];
    if (!localStorage.getItem(INITIALIZED_KEY)) {
      const ids = new Set(stored.map((trip) => trip.id));
      const seeded = [
        ...stored,
        ...initialSavedTrips.filter((trip) => !ids.has(trip.id)),
      ];
      localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(seeded));
      localStorage.setItem(INITIALIZED_KEY, "1");
      return seeded;
    }
    return stored;
  } catch {
    return [];
  }
};

export const writeTrips = (trips: SavedTrip[]) => {
  localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips));
  localStorage.setItem(INITIALIZED_KEY, "1");
};

export const findTrip = (id: string) =>
  readTrips().find((trip) => trip.id === id);

export const encodeSharedTrip = (trip: SavedTrip) => {
  const bytes = new TextEncoder().encode(JSON.stringify(trip));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
};

export const decodeSharedTrip = (
  value: string | null,
): SavedTrip | undefined => {
  if (!value || value.length > 250000) return undefined;
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(
      normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="),
    );
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const trip = JSON.parse(new TextDecoder().decode(bytes)) as SavedTrip;
    return typeof trip?.id === "string" &&
      typeof trip.name === "string" &&
      Number.isInteger(trip.days) &&
      trip.days > 0 &&
      trip.days <= 14 &&
      typeof trip.budget === "string" &&
      typeof trip.travelType === "string" &&
      typeof trip.createdAt === "string" &&
      (trip.itinerary === undefined || isItinerary(trip.itinerary))
      ? trip
      : undefined;
  } catch {
    return undefined;
  }
};

export const removeTrip = (id: string) =>
  writeTrips(readTrips().filter((trip) => trip.id !== id));

export const renameTrip = (id: string, name: string) => {
  const nextName = name.trim();
  if (!nextName) return false;
  writeTrips(
    readTrips().map((trip) =>
      trip.id === id ? { ...trip, name: nextName } : trip,
    ),
  );
  return true;
};

export const addPlaceToTrip = (
  tripId: string,
  dayIndex: number,
  period: DayPeriod,
  place: { id: string; name: string; address?: string },
) => {
  let changed = false;
  const trips = readTrips().map((trip) => {
    if (trip.id !== tripId) return trip;
    const existing: TripItinerary = isItinerary(trip.itinerary)
      ? trip.itinerary
      : { summary: trip.name, days: [] };
    if (!Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex >= trip.days)
      return trip;
    const days = Array.from(
      { length: Math.max(trip.days, dayIndex + 1) },
      (_, index) => existing.days[index] || emptyDay(index),
    );

    if (existing.version === 2) {
      const visits = getDayStops(days[dayIndex]).filter(
        (slot) => slot.kind !== "meal",
      );
      const itinerary = editItinerary(existing, dayIndex, [
        ...visits,
        { placeId: place.id, place: place.name, time: "", note: "" },
      ]);
      changed = true;
      return { ...trip, itinerary };
    }
    if (
      days.some((day) =>
        getDayStops(day).some(
          (slot) => slot.placeId === place.id || slot.place === place.name,
        ),
      )
    )
      throw new Error("Địa điểm này đã có trong chuyến đi.");
    const current = days[dayIndex];
    if (current[period].place !== "Chưa có địa điểm")
      throw new Error(
        "Buổi này đã có địa điểm. Mở chỉnh sửa chuyến đi để tạo lịch mới có nhiều điểm và tính giờ tự động.",
      );
    days[dayIndex] = {
      ...current,
      [period]: {
        ...current[period],
        place: place.name,
        placeId: place.id,
        address: place.address,
        note: place.address
          ? `Địa chỉ: ${place.address}`
          : "Đã thêm từ trang địa điểm.",
      },
    };
    changed = true;
    return { ...trip, itinerary: { ...existing, days } };
  });
  if (changed) writeTrips(trips);
  return changed;
};
