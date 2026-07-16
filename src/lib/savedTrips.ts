import { initialSavedTrips, SAVED_TRIPS_KEY, type SavedTrip } from "@/data/dalat";

export type AlternativePlace = { place: string; address?: string; note: string };
export type TripSlot = { time: string; place: string; note: string; placeId?: string; address?: string; latitude?: number; longitude?: number; alternatives?: AlternativePlace[] };
export type TripDay = {
  label: string;
  theme?: string;
  morning: TripSlot;
  afternoon: TripSlot;
  evening: TripSlot;
  food: string[];
  cost: string;
  notes: string;
};
export type TripItinerary = { summary?: string; days: TripDay[] };
export type DayPeriod = "morning" | "afternoon" | "evening";

const INITIALIZED_KEY = `${SAVED_TRIPS_KEY}_initialized`;
const emptySlot = (time: string): TripSlot => ({ time, place: "Chưa có địa điểm", note: "Thêm địa điểm phù hợp vào buổi này." });

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
  return Array.isArray(days) && days.every((day) => day && day.morning && day.afternoon && day.evening);
};

export const readTrips = (): SavedTrip[] => {
  try {
    const stored = JSON.parse(localStorage.getItem(SAVED_TRIPS_KEY) || "[]") as SavedTrip[];
    if (!localStorage.getItem(INITIALIZED_KEY)) {
      const ids = new Set(stored.map((trip) => trip.id));
      const seeded = [...stored, ...initialSavedTrips.filter((trip) => !ids.has(trip.id))];
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

export const findTrip = (id: string) => readTrips().find((trip) => trip.id === id);

export const encodeSharedTrip = (trip: SavedTrip) => {
  const bytes = new TextEncoder().encode(JSON.stringify(trip));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

export const decodeSharedTrip = (value: string | null): SavedTrip | undefined => {
  if (!value) return undefined;
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const trip = JSON.parse(new TextDecoder().decode(bytes)) as SavedTrip;
    return trip?.id && trip?.name && typeof trip.days === "number" ? trip : undefined;
  } catch { return undefined; }
};

export const removeTrip = (id: string) => writeTrips(readTrips().filter((trip) => trip.id !== id));

export const renameTrip = (id: string, name: string) => {
  const nextName = name.trim();
  if (!nextName) return false;
  writeTrips(readTrips().map((trip) => trip.id === id ? { ...trip, name: nextName } : trip));
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
    const existing = isItinerary(trip.itinerary) ? trip.itinerary : { summary: trip.name, days: [] };
    const days = Array.from({ length: Math.max(trip.days, dayIndex + 1) }, (_, index) => existing.days[index] || emptyDay(index));
    const current = days[dayIndex];
    days[dayIndex] = {
      ...current,
      [period]: {
        ...current[period],
        place: place.name,
        placeId: place.id,
        note: place.address ? `Địa chỉ: ${place.address}` : "Đã thêm từ trang địa điểm.",
      },
    };
    changed = true;
    return { ...trip, itinerary: { ...existing, days } };
  });
  if (changed) writeTrips(trips);
  return changed;
};
