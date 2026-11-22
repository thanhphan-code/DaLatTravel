import { places, type Place } from "@/data/dalat";
import { planningInfo } from "@/data/planning";
import {
  getDayStops,
  type PlannerPreferences,
  type TripDay,
  type TripItinerary,
  type TripSlot,
} from "./itinerary";

export const defaultPreferences: PlannerPreferences = {
  days: "3 ngày 2 đêm",
  travelType: "cặp đôi",
  budget: "trung bình",
  interests: ["quán cà phê", "thiên nhiên"],
  transport: "xe máy",
  startTime: "08:00",
  endTime: "20:30",
  pace: 4,
  selectedIds: [],
  preferReviewed: true,
};
export const basePoint = { latitude: 11.9403, longitude: 108.4368 };
export const formatTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
export const parseTime = (value: string) => {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value))
    throw new Error("Giờ phải có định dạng HH:MM hợp lệ.");
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};
export function distanceKm(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) {
  const rad = Math.PI / 180;
  const value =
    Math.sin(((b.latitude - a.latitude) * rad) / 2) ** 2 +
    Math.cos(a.latitude * rad) *
      Math.cos(b.latitude * rad) *
      Math.sin(((b.longitude - a.longitude) * rad) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, value)));
}
export function estimateTravel(
  a: typeof basePoint,
  b: typeof basePoint,
  transport: string,
) {
  const roadKm = distanceKm(a, b) * 1.45;
  const speed = transport === "xe máy" ? 22 : 25;
  return Math.max(10, Math.ceil(((roadKm / speed) * 60 + 10) / 5) * 5);
}
export function validatePreferences(prefs: PlannerPreferences) {
  const count = Number.parseInt(prefs.days, 10);
  if (!Number.isInteger(count) || count < 1 || count > 4)
    throw new Error("Chuyến đi hỗ trợ từ 1 đến 4 ngày.");
  const start = parseTime(prefs.startTime),
    end = parseTime(prefs.endTime);
  if (start < 240 || end > 1320 || end - start < 180)
    throw new Error("Chọn khung giờ từ 04:00 đến 22:00, dài ít nhất 3 giờ.");
  if (![3, 4, 5, 6].includes(prefs.pace))
    throw new Error("Chọn từ 3 đến 6 điểm mỗi ngày.");
  if (!["xe máy", "taxi", "ô tô"].includes(prefs.transport))
    throw new Error("Phương tiện không hợp lệ.");
  if (!prefs.interests.length) throw new Error("Chọn ít nhất một sở thích.");
  if (
    prefs.selectedIds.some(
      (id) => !places.some((place) => place.id === id) || !planningInfo[id],
    )
  )
    throw new Error("Một địa điểm đã chọn không còn trong danh mục.");
}

const emptySlot = (): TripSlot => ({
  time: "—",
  place: "Chưa có địa điểm",
  note: "Thời gian tự do.",
});
function finishDay(
  stops: TripSlot[],
  index: number,
  prefs: PlannerPreferences,
): TripDay {
  const visits = stops.filter((stop) => stop.kind === "visit");
  const last = visits.at(-1);
  const returnMinutes = last
    ? estimateTravel(
        last as Required<typeof basePoint>,
        basePoint,
        prefs.transport,
      )
    : 0;
  const periodSlot = (from: number, to: number) =>
    visits.find(
      (stop) => stop.startMinutes! >= from && stop.startMinutes! < to,
    ) ?? emptySlot();
  return {
    label: `Ngày ${index + 1}`,
    theme:
      [...new Set(visits.map((stop) => planningInfo[stop.placeId!]?.area))]
        .filter(Boolean)
        .join(" · ") || "Thời gian tự do",
    stops,
    morning: periodSlot(0, 720),
    afternoon: periodSlot(720, 1080),
    evening: periodSlot(1080, 1440),
    returnMinutes,
    returnTime: formatTime(
      (last?.endMinutes ?? parseTime(prefs.startTime)) + returnMinutes,
    ),
    food: [],
    cost: "Xem giá từng điểm; chưa gồm ăn uống, lưu trú và di chuyển",
    notes:
      "Thời gian di chuyển là ước tính có đệm 10 phút, xuất phát và kết thúc tại khu chợ Đà Lạt. Xác nhận giờ mở cửa và thời tiết trước ngày đi.",
  };
}
function tryVisit(
  place: Place,
  stops: TripSlot[],
  prefs: PlannerPreferences,
  durationOverride?: number,
): TripSlot[] | null {
  const info = planningInfo[place.id];
  if (!info) return null;
  const duration =
    durationOverride ??
    info.duration + (prefs.travelType === "gia đình" ? 15 : 0);
  if (!Number.isInteger(duration) || duration < 30 || duration > 240)
    throw new Error("Thời gian tham quan phải từ 30 đến 240 phút.");
  const last = stops.at(-1);
  let clock = last?.endMinutes ?? parseTime(prefs.startTime);
  const lastVisit = stops.filter((stop) => stop.kind === "visit").at(-1);
  const origin = lastVisit
    ? { latitude: lastVisit.latitude!, longitude: lastVisit.longitude! }
    : basePoint;
  const travel = estimateTravel(origin, place, prefs.transport);
  const next = [...stops];
  for (const meal of [
    { start: 720, name: "Nghỉ trưa & ăn trưa" },
    { start: 1080, name: "Nghỉ & ăn tối" },
  ]) {
    const arrival = Math.max(clock + travel, info.open);
    if (
      clock < meal.start + 60 &&
      arrival + duration > meal.start &&
      !next.some((stop) => stop.kind === "meal" && stop.place === meal.name)
    ) {
      const mealStart = Math.max(clock, meal.start);
      next.push({
        kind: "meal",
        place: meal.name,
        time: `${formatTime(mealStart)} – ${formatTime(mealStart + 60)}`,
        startMinutes: mealStart,
        endMinutes: mealStart + 60,
        durationMinutes: 60,
        travelMinutes: 0,
        note: "Khoảng nghỉ gần điểm trước đó; chọn quán thực tế tại chỗ, chưa tính một nhà hàng cụ thể.",
      });
      clock = mealStart + 60;
    }
  }
  const start = Math.max(clock + travel, info.open),
    end = start + duration;
  const returnMinutes = estimateTravel(place, basePoint, prefs.transport);
  if (end > info.close || end + returnMinutes > parseTime(prefs.endTime))
    return null;
  next.push({
    kind: "visit",
    placeId: place.id,
    place: place.name,
    address: place.address,
    latitude: place.latitude,
    longitude: place.longitude,
    startMinutes: start,
    endMinutes: end,
    durationMinutes: duration,
    travelMinutes: travel,
    time: `${formatTime(start)} – ${formatTime(end)}`,
    note:
      info.note ??
      `Dành ${duration} phút tham quan; ${info.hoursSource ? "có nguồn giờ mở cửa" : "khung giờ gợi ý, cần xác nhận giờ mở cửa"}.`,
  });
  return next;
}

// Scores influence selection only. Time-window, return-time and duplicate checks remain hard constraints.
export function generateItinerary(
  prefs: PlannerPreferences,
  previousIds: string[] = [],
  seed = 0,
): TripItinerary {
  validatePreferences(prefs);
  const selected = new Set(prefs.selectedIds),
    used = new Set<string>();
  const days: TripDay[] = [];
  const count = Number.parseInt(prefs.days, 10);
  for (let day = 0; day < count; day++) {
    let stops: TripSlot[] = [];
    while (stops.filter((stop) => stop.kind === "visit").length < prefs.pace) {
      const last = stops.filter((stop) => stop.kind === "visit").at(-1);
      const origin = last
        ? { latitude: last.latitude!, longitude: last.longitude! }
        : basePoint;
      const candidates = places
        .filter(
          (place) =>
            !used.has(place.id) &&
            planningInfo[place.id] &&
            (place.id !== "elephant-waterfall" || selected.has(place.id)) &&
            (prefs.budget !== "tiết kiệm" ||
              place.budget !== "high" ||
              selected.has(place.id)),
        )
        .map((place, index) => {
          const info = planningInfo[place.id];
          const interest =
            info.interests.filter((tag) => prefs.interests.includes(tag))
              .length * 20;
          const reviewed =
            prefs.preferReviewed && info.review
              ? Math.min(18, Math.log10(info.review.count + 1) * 6)
              : 0;
          const area =
            last && planningInfo[last.placeId!]?.area === info.area ? 20 : 0;
          const variation = seed
            ? Math.sin((index + 1) * 97 + seed * 13 + day) * 18
            : 0;
          const wait = Math.max(
            0,
            info.open -
              ((stops.at(-1)?.endMinutes ?? parseTime(prefs.startTime)) +
                estimateTravel(origin, place, prefs.transport)),
          );
          const remainingSlots =
            prefs.pace - stops.filter((stop) => stop.kind === "visit").length;
          const pendingSelected = [...selected].filter(
            (id) => !used.has(id),
          ).length;
          const reserve =
            selected.has(place.id) && remainingSlots <= pendingSelected
              ? 100000
              : 0;
          const score =
            reserve +
            (selected.has(place.id) ? 10000 : 0) -
            wait * 30 +
            interest +
            reviewed +
            area +
            variation -
            estimateTravel(origin, place, prefs.transport) * 0.7 -
            (previousIds.includes(place.id) && !selected.has(place.id)
              ? 90
              : 0);
          return { place, score };
        })
        .sort((a, b) => b.score - a.score);
      let added = false;
      for (const { place } of candidates) {
        const next = tryVisit(place, stops, prefs);
        if (next && !selected.has(place.id)) {
          const blocksSelected = places.some(
            (pending) =>
              selected.has(pending.id) &&
              !used.has(pending.id) &&
              tryVisit(pending, stops, prefs) &&
              !tryVisit(pending, next, prefs),
          );
          if (blocksSelected) continue;
        }
        if (next) {
          stops = next;
          used.add(place.id);
          added = true;
          break;
        }
      }
      if (!added) break;
    }
    days.push(finishDay(stops, day, prefs));
  }
  const unscheduledIds = [...selected].filter((id) => !used.has(id));
  const warnings = [
    "Lịch dự kiến, không phải giờ di chuyển trực tiếp. Khung giờ chưa có nguồn được ghi rõ tại từng điểm.",
  ];
  if (unscheduledIds.length)
    warnings.push(
      `${unscheduledIds.length} điểm bạn chọn chưa xếp vừa lịch. Tăng số ngày, giảm thời lượng hoặc đổi khung giờ; các điểm này chưa được thêm.`,
    );
  if (
    prefs.interests.includes("săn mây") &&
    !days.some((day) =>
      day.stops?.some(
        (stop) => stop.placeId === "cau-dat" && stop.startMinutes! <= 390,
      ),
    )
  )
    warnings.push(
      "Chưa có điểm săn mây trước 06:30. Cần khởi hành sớm hơn và kiểm tra thời tiết; không bảo đảm có mây.",
    );
  if (previousIds.length && [...used].every((id) => previousIds.includes(id)))
    warnings.push(
      "Các điểm khả thi đã trùng với phương án trước. Thử đổi sở thích, số ngày hoặc điểm bắt buộc để có phương án khác.",
    );
  return {
    version: 2,
    preferences: { ...prefs, selectedIds: [...selected] },
    summary: `${count} ngày · ${used.size} điểm không trùng · ${prefs.startTime}–${prefs.endTime} mỗi ngày`,
    days,
    unscheduledIds,
    warnings,
  };
}

export function editItinerary(
  plan: TripItinerary,
  dayIndex: number,
  visits: TripSlot[],
): TripItinerary {
  if (!plan.preferences || plan.version !== 2)
    throw new Error(
      "Hãy tạo lại lịch cũ để dùng tính năng sắp xếp giờ tự động.",
    );
  if (!plan.days[dayIndex]) throw new Error("Ngày không hợp lệ.");
  if (visits.length > 8)
    throw new Error("Tối đa 8 điểm một ngày; hãy chuyển điểm sang ngày khác.");
  const used = new Set(
    plan.days.flatMap((day, index) =>
      index === dayIndex
        ? []
        : getDayStops(day)
            .map((stop) => stop.placeId)
            .filter(Boolean),
    ),
  );
  let stops: TripSlot[] = [];
  for (const visit of visits) {
    const place = places.find((item) => item.id === visit.placeId);
    if (!place) throw new Error("Điểm đến chưa có dữ liệu để tính lịch.");
    if (used.has(place.id))
      throw new Error(
        `${place.name} đã có trong chuyến đi. Mỗi điểm chỉ ghé một lần.`,
      );
    const next = tryVisit(
      place,
      stops,
      plan.preferences,
      visit.durationMinutes,
    );
    if (!next)
      throw new Error(
        `${place.name} không vừa khung giờ hoặc làm quá giờ về. Thử đổi thứ tự, rút ngắn thời lượng hoặc chọn ngày khác.`,
      );
    stops = next;
    used.add(place.id);
  }
  const days = plan.days.map((day, index) =>
    index === dayIndex ? finishDay(stops, index, plan.preferences!) : day,
  );
  const scheduledIds = [
    ...new Set(
      days.flatMap((day) =>
        getDayStops(day)
          .map((stop) => stop.placeId)
          .filter((id): id is string => Boolean(id)),
      ),
    ),
  ];
  const removedIds = new Set(
    getDayStops(plan.days[dayIndex])
      .map((stop) => stop.placeId)
      .filter((id) => id && !visits.some((stop) => stop.placeId === id)),
  );
  const selectedIds = [
    ...new Set([
      ...plan.preferences.selectedIds.filter((id) => !removedIds.has(id)),
      ...visits.map((stop) => stop.placeId!),
    ]),
  ];
  const unscheduledIds = selectedIds.filter((id) => !scheduledIds.includes(id));
  return {
    ...plan,
    days,
    summary: `${days.length} ngày · ${scheduledIds.length} điểm không trùng · Đã điều chỉnh lịch`,
    preferences: { ...plan.preferences, selectedIds },
    unscheduledIds,
    warnings: [
      "Đã tính lại giờ, thời gian nghỉ và giờ về. Di chuyển vẫn là ước tính; kiểm tra giờ mở cửa trước chuyến đi.",
    ],
  };
}
