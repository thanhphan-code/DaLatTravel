export type AlternativePlace = {
  place: string;
  address?: string;
  note: string;
};
export type TripSlot = {
  time: string;
  place: string;
  note: string;
  placeId?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  alternatives?: AlternativePlace[];
  kind?: "visit" | "meal";
  startMinutes?: number;
  endMinutes?: number;
  durationMinutes?: number;
  travelMinutes?: number;
};
export type PlannerPreferences = {
  days: string;
  travelType: string;
  budget: string;
  interests: string[];
  transport: string;
  startTime: string;
  endTime: string;
  pace: number;
  selectedIds: string[];
  preferReviewed: boolean;
};
export type TripDay = {
  label: string;
  theme?: string;
  morning: TripSlot;
  afternoon: TripSlot;
  evening: TripSlot;
  stops?: TripSlot[];
  returnTime?: string;
  returnMinutes?: number;
  food: string[];
  cost: string;
  notes: string;
};
export type TripItinerary = {
  version?: 2;
  summary?: string;
  days: TripDay[];
  preferences?: PlannerPreferences;
  warnings?: string[];
  unscheduledIds?: string[];
};
export type DayPeriod = "morning" | "afternoon" | "evening";
export const getDayStops = (day: TripDay): TripSlot[] =>
  day.stops ??
  [day.morning, day.afternoon, day.evening].filter(
    (slot) => slot.place !== "Chưa có địa điểm",
  );
