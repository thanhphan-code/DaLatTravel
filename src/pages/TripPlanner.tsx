import { getMoodPreferences } from "@/data/moods";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock3,
  Compass,
  MapPin,
  RefreshCw,
  Save,
  Search,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import TripTimeline from "@/components/TripTimeline";
import { places, type SavedTrip } from "@/data/dalat";
import { planningInfo } from "@/data/planning";
import { findTrip, isItinerary, readTrips, writeTrips } from "@/lib/savedTrips";
import {
  defaultPreferences,
  generateItinerary,
  validatePreferences,
} from "@/lib/tripPlanner";
import {
  getDayStops,
  type PlannerPreferences,
  type TripItinerary,
} from "@/lib/itinerary";

const interests = [
  "quán cà phê",
  "ẩm thực",
  "chụp ảnh",
  "săn mây",
  "thiên nhiên",
  "địa điểm lãng mạn",
  "văn hóa địa phương",
];
export default function TripPlanner() {
  const [params] = useSearchParams();
  const editingId = params.get("trip");
  const [prefs, setPrefs] = useState<PlannerPreferences>(() => ({ ...defaultPreferences, ...getMoodPreferences(params.get("mood")) }));
  const [result, setResult] = useState<TripItinerary | null>(null);
  const [editing, setEditing] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [savedId, setSavedId] = useState<string | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!editingId) return;
    const trip = findTrip(editingId);
    if (!trip) {
      setError("Không tìm thấy chuyến đi đã lưu.");
      return;
    }
    setSavedId(trip.id);
    if (isItinerary(trip.itinerary)) {
      setResult(trip.itinerary);
      setPrefs({
        ...defaultPreferences,
        ...trip.itinerary.preferences,
        days: `${trip.days} ngày`,
      });
    }
  }, [editingId]);
  const update = <K extends keyof PlannerPreferences>(
    key: K,
    value: PlannerPreferences[K],
  ) => setPrefs((current) => ({ ...current, [key]: value }));
  const toggle = (key: "interests" | "selectedIds", value: string) =>
    update(
      key,
      prefs[key].includes(value)
        ? prefs[key].filter((item) => item !== value)
        : [...prefs[key], value],
    );
  const catalog = useMemo(
    () =>
      places
        .filter(
          (place) =>
            planningInfo[place.id] &&
            place.name
              .toLocaleLowerCase("vi")
              .includes(query.trim().toLocaleLowerCase("vi")),
        )
        .sort((a, b) =>
          prefs.preferReviewed
            ? (planningInfo[b.id].review?.count ?? 0) -
              (planningInfo[a.id].review?.count ?? 0)
            : 0,
        ),
    [query, prefs.preferReviewed],
  );
  const generate = (alternative = false) => {
    try {
      validatePreferences(prefs);
      const previous =
        alternative && result
          ? result.days.flatMap((day) =>
              getDayStops(day)
                .map((stop) => stop.placeId)
                .filter((id): id is string => Boolean(id)),
            )
          : [];
      const next = generateItinerary(
        prefs,
        previous,
        alternative ? revision + 1 : 0,
      );
      setResult(next);
      setRevision((current) => current + 1);
      setEditing(false);
      setError("");
      toast.success("Đã xếp lịch và kiểm tra thời gian");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Không thể tạo lịch trình.",
      );
    }
  };
  const save = () => {
    if (!result) return;
    try {
      const activePrefs = result.preferences ?? prefs;
      const trips = readTrips();
      const existing = trips.find((trip) => trip.id === savedId);
      const id = existing?.id ?? crypto.randomUUID();
      const trip: SavedTrip = {
        id,
        name:
          existing?.name ??
          `Đà Lạt · ${result.days.length} ngày theo cách của bạn`,
        days: result.days.length,
        budget: activePrefs.budget,
        travelType: activePrefs.travelType,
        createdAt: existing?.createdAt ?? new Date().toISOString().slice(0, 10),
        itinerary: result,
      };
      writeTrips(
        existing
          ? trips.map((item) => (item.id === id ? trip : item))
          : [trip, ...trips],
      );
      setSavedId(id);
      toast.success(
        existing
          ? "Đã cập nhật chuyến đi"
          : "Đã lưu chuyến đi trên thiết bị này",
      );
    } catch {
      toast.error(
        "Không lưu được trên thiết bị. Kiểm tra dung lượng hoặc quyền lưu trữ của trình duyệt.",
      );
    }
  };
  return (
    <PageTransition>
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-12 md:px-10 md:py-16">
        <div className="max-w-3xl">
          <p className="eyebrow flex items-center gap-2">
            <Compass size={16} /> Hành trình có nhịp điệu riêng
          </p>
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">
            Thiết kế chuyến đi Đà Lạt
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Chọn nơi muốn đến. Chúng tôi sắp xếp các điểm gần nhau, chừa giờ
            nghỉ và kiểm tra thời gian để bạn tận hưởng từng chặng.
          </p>
        </div>
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            {error}
          </div>
        )}
        <AnimatePresence mode="wait">
          {editing ? (
            <motion.section
              key="preferences"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-9 grid gap-7 lg:grid-cols-[1fr_290px]"
            >
              <div className="space-y-8 rounded-3xl border border-border bg-card p-5 md:p-8">
                <fieldset>
                  <legend className="planner-legend">
                    01 / Chuyến đi của bạn
                  </legend>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Select
                      label="Số ngày"
                      value={String(Number.parseInt(prefs.days, 10))}
                      onChange={(value) => update("days", `${value} ngày`)}
                      options={["1", "2", "3", "4"]}
                    />
                    <Select
                      label="Đồng hành"
                      value={prefs.travelType}
                      onChange={(value) => update("travelType", value)}
                      options={["đi một mình", "cặp đôi", "bạn bè", "gia đình"]}
                    />
                    <Select
                      label="Ngân sách"
                      value={prefs.budget}
                      onChange={(value) => update("budget", value)}
                      options={["tiết kiệm", "trung bình", "cao"]}
                    />
                    <Select
                      label="Phương tiện"
                      value={prefs.transport}
                      onChange={(value) => update("transport", value)}
                      options={["xe máy", "taxi", "ô tô"]}
                    />
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="planner-legend">
                    02 / Chọn nhịp khám phá
                  </legend>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="planner-label">
                      Giờ khởi hành mỗi ngày
                      <input
                        aria-label="Giờ khởi hành mỗi ngày"
                        type="time"
                        min="04:00"
                        max="19:00"
                        value={prefs.startTime}
                        onChange={(event) =>
                          update("startTime", event.target.value)
                        }
                        className="planner-input"
                      />
                    </label>
                    <label className="planner-label">
                      Về trước mỗi ngày
                      <input
                        aria-label="Về trước mỗi ngày"
                        type="time"
                        min="07:00"
                        max="22:00"
                        value={prefs.endTime}
                        onChange={(event) =>
                          update("endTime", event.target.value)
                        }
                        className="planner-input"
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { value: 3, label: "Thảnh thơi · 3 điểm" },
                      { value: 4, label: "Vừa đủ · 4 điểm" },
                      { value: 5, label: "Năng động · 5 điểm" },
                      { value: 6, label: "Khám phá nhiều · 6 điểm" },
                    ].map((pace) => (
                      <button
                        type="button"
                        aria-pressed={prefs.pace === pace.value}
                        key={pace.value}
                        onClick={() => update("pace", pace.value)}
                        className={`planner-chip ${prefs.pace === pace.value ? "planner-chip-selected" : ""}`}
                      >
                        {pace.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    Số điểm là mục tiêu tối đa, có thể ít hơn nếu không đủ thời
                    gian. Xuất phát và kết thúc tại khu chợ Đà Lạt. Nghỉ
                    trưa/tối được chừa khi hành trình đi qua khung giờ ăn.
                  </p>
                </fieldset>
                <fieldset>
                  <legend className="planner-legend">
                    03 / Những điều bạn thích
                  </legend>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        aria-pressed={prefs.interests.includes(interest)}
                        onClick={() => toggle("interests", interest)}
                        className={`planner-chip capitalize ${prefs.interests.includes(interest) ? "planner-chip-selected" : ""}`}
                      >
                        {prefs.interests.includes(interest) && (
                          <Check size={14} />
                        )}
                        {interest}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="planner-legend">
                    04 / Những điểm bạn muốn ghé
                  </legend>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Chọn nhiều điểm để ưu tiên. Lịch sẽ bổ sung gợi ý phù hợp và
                    báo rõ nếu điểm đã chọn không vừa thời gian.
                  </p>
                  <label className="mt-4 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={prefs.preferReviewed}
                      onChange={(event) =>
                        update("preferReviewed", event.target.checked)
                      }
                      className="h-4 w-4 accent-primary"
                    />
                    Ưu tiên nơi có đánh giá kèm nguồn
                  </label>
                  <div className="relative mt-4">
                    <Search
                      size={17}
                      className="absolute left-3 top-4 text-muted-foreground"
                    />
                    <input
                      aria-label="Tìm điểm muốn ghé"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Tìm ga Đà Lạt, Túi Mơ To…"
                      className="planner-input pl-10"
                    />
                  </div>
                  <div className="mt-3 max-h-[420px] overflow-y-auto rounded-xl border border-border divide-y divide-border">
                    {catalog.map((place) => {
                      const info = planningInfo[place.id];
                      return (
                        <div key={place.id} className="p-4">
                          <label className="flex cursor-pointer items-start gap-3">
                            <input
                              type="checkbox"
                              aria-label={`Chọn ${place.name}`}
                              checked={prefs.selectedIds.includes(place.id)}
                              onChange={() => toggle("selectedIds", place.id)}
                              className="mt-1 h-4 w-4 accent-primary"
                            />
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold">
                                {place.name}
                              </span>
                              <span className="mt-1 block text-xs text-muted-foreground">
                                {info.area} · khoảng {info.duration} phút
                              </span>
                            </span>
                          </label>
                          {info.review && (
                            <a
                              href={info.review.url}
                              target="_blank"
                              rel="noreferrer"
                              className="ml-7 mt-2 block text-xs text-primary underline"
                            >
                              {info.review.platform}: {info.review.rating}/5 ·{" "}
                              {info.review.count} đánh giá · kiểm tra 21/11/2026
                            </a>
                          )}
                        </div>
                      );
                    })}
                    {!catalog.length && (
                      <p className="p-5 text-sm text-muted-foreground">
                        Không tìm thấy địa điểm. Thử từ khóa khác.
                      </p>
                    )}
                  </div>
                </fieldset>
              </div>
              <aside className="h-fit rounded-3xl bg-mist/60 p-6 lg:sticky lg:top-28">
                <p className="eyebrow">Đã sẵn sàng cho chuyến đi?</p>
                <h2 className="font-serif text-2xl">
                  {Number.parseInt(prefs.days, 10)} ngày ở Đà Lạt
                </h2>
                <div className="my-6 space-y-4 text-sm">
                  <p className="flex gap-2">
                    <Clock3 size={17} />
                    {prefs.startTime}–{prefs.endTime} mỗi ngày
                  </p>
                  <p className="flex gap-2">
                    <MapPin size={17} />
                    {prefs.selectedIds.length} điểm muốn ghé
                  </p>
                  <p>
                    Tối đa {prefs.pace} điểm/ngày · {prefs.transport}
                  </p>
                </div>
                <button
                  onClick={() => generate()}
                  className="home-button w-full"
                >
                  Tạo lịch trình <ArrowRight size={18} />
                </button>
                {result && (
                  <button
                    onClick={() => setEditing(false)}
                    className="mt-4 w-full text-sm text-primary underline"
                  >
                    Quay lại lịch trình
                  </button>
                )}
                <p className="mt-5 text-xs leading-6 text-muted-foreground">
                  Không trùng địa điểm. Kiểm tra khung giờ và thời gian về. Bạn
                  có thể thêm, bỏ, đổi thứ tự và chỉnh thời lượng sau khi tạo.
                </p>
              </aside>
            </motion.section>
          ) : (
            result && (
              <motion.section
                key="result"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-9"
              >
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    {result.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setEditing(true)}
                      className="planner-chip"
                    >
                      <Settings2 size={16} />
                      Sửa lựa chọn
                    </button>
                    <button
                      onClick={() => generate(true)}
                      className="planner-chip"
                    >
                      <RefreshCw size={16} />
                      Phương án khác
                    </button>
                    <button onClick={save} className="home-button">
                      <Save size={16} />
                      Lưu chuyến đi
                    </button>
                    {savedId && (
                      <Link to={`/saved/${savedId}`} className="planner-chip">
                        Xem bản đã lưu
                      </Link>
                    )}
                  </div>
                </div>
                <TripTimeline
                  itinerary={result}
                  onChange={(next) => {
                    setResult(next);
                    if (next.preferences) setPrefs(next.preferences);
                  }}
                />
                {result.version !== 2 && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Đây là lịch cũ. Chọn “Sửa lựa chọn” rồi tạo lại để thêm
                    nhiều điểm và tính giờ tự động.
                  </p>
                )}
              </motion.section>
            )
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </PageTransition>
  );
}
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="planner-label">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="planner-input capitalize"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
