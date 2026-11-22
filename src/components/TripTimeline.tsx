import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Clock3,
  ExternalLink,
  MapPin,
  Plus,
  Route,
  Trash2,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";
import { places } from "@/data/dalat";
import { planningInfo } from "@/data/planning";
import { editItinerary } from "@/lib/tripPlanner";
import {
  getDayStops,
  type TripItinerary,
  type TripSlot,
} from "@/lib/itinerary";
import DayRouteMap from "./DayRouteMap";

export default function TripTimeline({
  itinerary,
  onChange,
}: {
  itinerary: TripItinerary;
  onChange?: (value: TripItinerary) => void;
}) {
  const [additions, setAdditions] = useState<Record<number, string>>({});
  const [mapDay, setMapDay] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const usedIds = new Set(
    itinerary.days.flatMap((day) =>
      getDayStops(day).map((stop) => stop.placeId),
    ),
  );
  const available = places.filter(
    (place) => !usedIds.has(place.id) && planningInfo[place.id],
  );
  const editable = Boolean(onChange && itinerary.version === 2);
  const updateDay = (index: number, visits: TripSlot[]) => {
    try {
      onChange?.(editItinerary(itinerary, index, visits));
      toast.success("Đã cập nhật và tính lại thời gian");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể thay đổi lịch trình",
      );
    }
  };
  return (
    <div className="space-y-7">
      {itinerary.warnings?.length ? (
        <div
          role="status"
          className="rounded-2xl border border-primary/20 bg-mist/50 p-5 text-sm leading-6"
        >
          <ul className="space-y-2">
            {itinerary.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
          {Boolean(itinerary.unscheduledIds?.length) && (
            <p className="mt-3 font-medium">
              Chưa xếp được:{" "}
              {itinerary
                .unscheduledIds!.map(
                  (id) => places.find((place) => place.id === id)?.name,
                )
                .join(", ")}
            </p>
          )}
        </div>
      ) : null}
      {itinerary.days.map((day, dayIndex) => {
        const stops = getDayStops(day);
        const visits = stops.filter((stop) => stop.kind !== "meal");
        const move = (index: number, offset: number) => {
          const reordered = [...visits];
          [reordered[index], reordered[index + offset]] = [
            reordered[index + offset],
            reordered[index],
          ];
          updateDay(dayIndex, reordered);
        };
        return (
          <motion.article
            layout={!reduced}
            key={day.label}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: Math.min(dayIndex * 0.07, 0.2),
            }}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-mist/30 p-5 md:p-7">
              <div>
                <p className="eyebrow mb-1">
                  {visits.length} điểm dừng · {day.label}
                </p>
                <h2 className="font-serif text-xl md:text-2xl">
                  {day.theme || "Hành trình của bạn"}
                </h2>
              </div>
              <button
                onClick={() => setMapDay(mapDay === dayIndex ? null : dayIndex)}
                aria-expanded={mapDay === dayIndex}
                className="text-link min-h-11"
              >
                <Route size={17} />
                {mapDay === dayIndex ? "Đóng bản đồ" : "Xem tuyến đường"}
              </button>
            </div>
            <div className="p-5 md:p-7">
              <AnimatePresence initial={false}>
                {stops.map((stop, index) => {
                  const info = stop.placeId
                    ? planningInfo[stop.placeId]
                    : undefined;
                  const visitIndex = visits.indexOf(stop);
                  return (
                    <motion.div
                      layout={!reduced}
                      key={stop.placeId ?? `${stop.place}-${index}`}
                      initial={reduced ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
                      className="relative grid gap-3 border-l-2 border-primary/15 pb-7 pl-5 md:grid-cols-[125px_1fr] md:gap-5 md:pl-7"
                    >
                      <span
                        className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full ring-4 ring-card ${stop.kind === "meal" ? "bg-border" : "bg-primary"}`}
                      />
                      <div className="text-sm font-semibold tabular-nums text-primary">
                        {stop.time}
                        {Boolean(stop.travelMinutes) && (
                          <p className="mt-2 text-[11px] font-normal text-muted-foreground">
                            Di chuyển ~{stop.travelMinutes} phút
                          </p>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="flex items-center gap-2 text-lg font-semibold">
                            {stop.kind === "meal" ? (
                              <Utensils className="shrink-0" size={17} />
                            ) : (
                              <MapPin
                                className="shrink-0 text-primary"
                                size={17}
                              />
                            )}
                            {stop.place}
                          </h3>
                          {editable && stop.kind !== "meal" && (
                            <button
                              aria-label={`Xóa ${stop.place}`}
                              onClick={() =>
                                updateDay(
                                  dayIndex,
                                  visits.filter((_, i) => i !== visitIndex),
                                )
                              }
                              className="shrink-0 rounded-lg p-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {stop.note}
                        </p>
                        {info && (
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                            <span>{info.area}</span>
                            {info.hoursSource ? (
                              <a
                                className="text-primary underline"
                                href={info.hoursSource}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Nguồn giờ mở cửa
                              </a>
                            ) : (
                              <span>Giờ hoạt động cần xác nhận</span>
                            )}
                            {info.review && (
                              <a
                                href={info.review.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary underline"
                              >
                                {info.review.platform}: {info.review.rating}/5 ·{" "}
                                {info.review.count} đánh giá · kiểm tra
                                21/11/2026
                              </a>
                            )}
                          </div>
                        )}
                        {stop.placeId && (
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <Link
                              to={`/place/${stop.placeId}`}
                              className="text-link text-xs"
                            >
                              Xem địa điểm <ExternalLink size={13} />
                            </Link>
                            {editable && (
                              <>
                                <label className="flex items-center gap-2 text-xs">
                                  <Clock3 size={14} />
                                  Tham quan
                                  <select
                                    aria-label={`Thời lượng ${stop.place}`}
                                    value={stop.durationMinutes}
                                    onChange={(event) =>
                                      updateDay(
                                        dayIndex,
                                        visits.map((item, i) =>
                                          i === visitIndex
                                            ? {
                                                ...item,
                                                durationMinutes: Number(
                                                  event.target.value,
                                                ),
                                              }
                                            : item,
                                        ),
                                      )
                                    }
                                    className="min-h-10 rounded-lg border border-border bg-background px-2"
                                  >
                                    {Array.from(
                                      { length: 15 },
                                      (_, i) => (i + 2) * 15,
                                    ).map((minutes) => (
                                      <option value={minutes} key={minutes}>
                                        {minutes} phút
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <div className="flex gap-1">
                                  <button
                                    aria-label={`Đưa ${stop.place} lên trước`}
                                    disabled={visitIndex === 0}
                                    onClick={() => move(visitIndex, -1)}
                                    className="rounded-lg border border-border p-2.5 disabled:opacity-30"
                                  >
                                    <ArrowUp size={16} />
                                  </button>
                                  <button
                                    aria-label={`Đưa ${stop.place} xuống sau`}
                                    disabled={visitIndex === visits.length - 1}
                                    onClick={() => move(visitIndex, 1)}
                                    className="rounded-lg border border-border p-2.5 disabled:opacity-30"
                                  >
                                    <ArrowDown size={16} />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {!stops.length && (
                <p className="py-5 text-sm text-muted-foreground">
                  Ngày này chưa có điểm dừng. Thêm một điểm để bắt đầu.
                </p>
              )}
              {day.returnTime && (
                <p className="rounded-xl bg-muted/60 p-4 text-sm">
                  <b>{day.returnTime}</b> · Dự kiến về khu chợ Đà Lạt
                  {day.returnMinutes
                    ? ` (di chuyển ~${day.returnMinutes} phút từ điểm cuối).`
                    : "."}
                </p>
              )}
              {editable && (
                <div className="mt-5 flex flex-col gap-3 sm:flex-row print:hidden">
                  <select
                    aria-label={`Thêm địa điểm ngày ${dayIndex + 1}`}
                    value={additions[dayIndex] ?? ""}
                    onChange={(event) =>
                      setAdditions((current) => ({
                        ...current,
                        [dayIndex]: event.target.value,
                      }))
                    }
                    className="min-h-12 min-w-0 flex-1 rounded-xl border border-border bg-background px-4 text-sm"
                  >
                    <option value="">
                      Chọn thêm địa điểm chưa có trong chuyến đi
                    </option>
                    {available.map((place) => (
                      <option value={place.id} key={place.id}>
                        {place.name} · {planningInfo[place.id].duration} phút
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={
                      !additions[dayIndex] || usedIds.has(additions[dayIndex])
                    }
                    onClick={() => {
                      const id = additions[dayIndex];
                      updateDay(dayIndex, [
                        ...visits,
                        { placeId: id, place: "", time: "", note: "" },
                      ]);
                    }}
                    className="home-button disabled:opacity-40"
                  >
                    <Plus size={17} />
                    Thêm & tính lại giờ
                  </button>
                </div>
              )}
              {mapDay === dayIndex && (
                <div className="mt-6">
                  <DayRouteMap day={day} />
                </div>
              )}
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
