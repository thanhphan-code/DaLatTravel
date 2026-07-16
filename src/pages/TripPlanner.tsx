import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Loader2,
  MapPin,
  Sun,
  Moon,
  Coffee,
  Save,
  AlertCircle,
  RefreshCw,
  Settings2,
  Info,
  CalendarDays,
  Users,
  WalletCards,
  Heart,
  Bike,
  Clock3,
  Check,
  Utensils,
  Camera,
  CloudSun,
  Trees,
  Landmark,
  ArrowRight,
  Shuffle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { type SavedTrip } from "@/data/dalat";
import { findTrip, readTrips, writeTrips } from "@/lib/savedTrips";

const dayOptions = ["1 ngày", "2 ngày 1 đêm", "3 ngày 2 đêm", "4 ngày 3 đêm"];
const travelTypes = ["đi một mình", "cặp đôi", "bạn bè", "gia đình"];
const budgets = ["tiết kiệm", "trung bình", "cao"];
const interestsList = [
  "quán cà phê",
  "ẩm thực",
  "chụp ảnh",
  "săn mây",
  "thiên nhiên",
  "địa điểm lãng mạn",
  "văn hóa địa phương",
];
const transports = ["xe máy", "taxi", "ô tô"];

const interestIcons: Record<string, React.ElementType> = {
  "quán cà phê": Coffee,
  "ẩm thực": Utensils,
  "chụp ảnh": Camera,
  "săn mây": CloudSun,
  "thiên nhiên": Trees,
  "địa điểm lãng mạn": Heart,
  "văn hóa địa phương": Landmark,
};

type AlternativePlace = { place: string; address?: string; note: string };
type TimeSlot = { time: string; place: string; note: string; address?: string; latitude?: number; longitude?: number; alternatives?: AlternativePlace[] };
type DayPlan = {
  label: string;
  theme?: string;
  morning: TimeSlot;
  afternoon: TimeSlot;
  evening: TimeSlot;
  food: string[];
  cost: string;
  notes: string;
};
type Itinerary = { summary?: string; days: DayPlan[] };

type Prefs = {
  days: string;
  travelType: string;
  budget: string;
  interests: string[];
  transport: string;
  startTime: string;
};

const isSlot = (s: unknown): s is TimeSlot =>
  !!s &&
  typeof s === "object" &&
  typeof (s as TimeSlot).time === "string" &&
  typeof (s as TimeSlot).place === "string" &&
  typeof (s as TimeSlot).note === "string";

const validateItinerary = (data: unknown): data is Itinerary => {
  if (!data || typeof data !== "object") return false;
  const d = data as Itinerary;
  if (!Array.isArray(d.days) || d.days.length === 0) return false;
  return d.days.every(
    (day) =>
      day &&
      typeof day.label === "string" &&
      isSlot(day.morning) &&
      isSlot(day.afternoon) &&
      isSlot(day.evening) &&
      Array.isArray(day.food) &&
      typeof day.cost === "string" &&
      typeof day.notes === "string",
  );
};

const TripPlanner = () => {
  const [searchParams] = useSearchParams();
  const editingTripId = searchParams.get("trip");
  const [prefs, setPrefs] = useState<Prefs>({
    days: dayOptions[2],
    travelType: "cặp đôi",
    budget: "trung bình",
    interests: ["quán cà phê", "săn mây"],
    transport: "xe máy",
    startTime: "08:00",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Prefs, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Itinerary | null>(null);
  const [editing, setEditing] = useState(true);

  useEffect(() => {
    if (!editingTripId) return;
    const trip = findTrip(editingTripId);
    if (!trip) return;
    const matchingDays = dayOptions.find((option) => Number.parseInt(option, 10) === trip.days) || dayOptions[0];
    const matchingType = travelTypes.find((option) => option === trip.travelType.toLowerCase()) || travelTypes[0];
    const matchingBudget = budgets.find((option) => option === trip.budget.toLowerCase()) || budgets[1];
    setPrefs((current) => ({ ...current, days: matchingDays, travelType: matchingType, budget: matchingBudget }));
    if (validateItinerary(trip.itinerary)) setResult(trip.itinerary);
    setEditing(true);
  }, [editingTripId]);

  const update = <K extends keyof Prefs>(k: K, v: Prefs[K]) => {
    setPrefs((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const toggleInterest = (v: string) =>
    update(
      "interests",
      prefs.interests.includes(v) ? prefs.interests.filter((i) => i !== v) : [...prefs.interests, v],
    );

  const validate = (): boolean => {
    const e: Partial<Record<keyof Prefs, string>> = {};
    if (!prefs.days) e.days = "Vui lòng chọn thời lượng";
    if (!prefs.travelType) e.travelType = "Vui lòng chọn hình thức du lịch";
    if (!prefs.budget) e.budget = "Vui lòng chọn ngân sách";
    if (!prefs.transport) e.transport = "Vui lòng chọn phương tiện";
    if (prefs.interests.length === 0) e.interests = "Chọn ít nhất một sở thích";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Vui lòng hoàn thành thông tin trước khi tạo lịch trình");
      return false;
    }
    return true;
  };

  const runGenerate = async (isRegenerate = false) => {
    setLoading(true);
    setError(null);
    if (!isRegenerate) setResult(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-trip-planner`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        body: JSON.stringify(prefs),
      });
      const data = await response.json();
      if (!response.ok || data?.error) throw new Error(data?.error || `Không thể tạo lịch trình (${response.status})`);
      if (!validateItinerary(data)) {
        throw new Error("Lịch trình chưa hoàn chỉnh. Vui lòng tạo lại.");
      }
      setResult(data);
      setEditing(false);
      toast.success(isRegenerate ? "Đã tạo lịch trình mới" : "Lịch trình của bạn đã sẵn sàng");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const generate = () => {
    if (!validate()) return;
    runGenerate(false);
  };
  const regenerate = () => runGenerate(true);

  const save = () => {
    if (!result) return;
    if (editingTripId) {
      const trips = readTrips();
      const existing = trips.find((item) => item.id === editingTripId);
      if (existing) {
        writeTrips(trips.map((item) => item.id === editingTripId ? {
          ...item,
          days: result.days.length,
          budget: prefs.budget,
          travelType: prefs.travelType,
          itinerary: result,
        } : item));
        toast.success("Đã cập nhật lịch trình");
        return;
      }
    }
    const trip: SavedTrip = {
      id: `trip-${Date.now()}`,
      name: result.summary?.slice(0, 60) || `${prefs.travelType} trip · ${prefs.days}`,
      days: result.days.length,
      budget: prefs.budget,
      travelType: prefs.travelType,
      createdAt: new Date().toISOString().slice(0, 10),
      itinerary: result,
    };
    const existing: SavedTrip[] = readTrips();
    writeTrips([trip, ...existing]);
    toast.success("Đã lưu lịch trình");
  };

  return (
    <PageTransition>
      <Header />
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-14">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mist text-primary text-sm mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Công cụ lập lịch TravelDaLat2026
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold">Thiết kế chuyến đi Đà Lạt</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Chọn phong cách du lịch để tạo kế hoạch từng ngày phù hợp với bạn.
          </p>
        </div>

        {editing && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-8 p-6 md:p-10">
                <Field icon={CalendarDays} label="Số ngày" hint="Chọn thời lượng phù hợp với chuyến đi" error={errors.days}>
                  <ChipGroup options={dayOptions} value={prefs.days} onChange={(v) => update("days", v)} />
                </Field>
                <div className="grid md:grid-cols-2 gap-8">
                  <Field icon={Users} label="Hình thức du lịch" error={errors.travelType}>
                    <ChipGroup options={travelTypes} value={prefs.travelType} onChange={(v) => update("travelType", v)} />
                  </Field>
                  <Field icon={WalletCards} label="Ngân sách" error={errors.budget}>
                    <ChipGroup options={budgets} value={prefs.budget} onChange={(v) => update("budget", v)} />
                  </Field>
                </div>
                <Field icon={Heart} label="Bạn muốn trải nghiệm gì?" hint="Có thể chọn nhiều sở thích" error={errors.interests}>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {interestsList.map((interest) => {
                      const selected = prefs.interests.includes(interest);
                      const Icon = interestIcons[interest];
                      return (
                        <button
                          key={interest}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleInterest(interest)}
                          className={`flex min-h-12 items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm capitalize transition-colors ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/50 hover:bg-mist/40"}`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="flex-1">{interest}</span>
                          {selected && <Check className="h-3.5 w-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <div className="grid md:grid-cols-2 gap-8">
                  <Field icon={Bike} label="Phương tiện" error={errors.transport}>
                    <ChipGroup options={transports} value={prefs.transport} onChange={(v) => update("transport", v)} />
                  </Field>
                  <Field icon={Clock3} label="Giờ bắt đầu" hint="Dùng cho ngày đầu tiên">
                    <input
                      type="time"
                      aria-label="Giờ bắt đầu"
                      value={prefs.startTime}
                      onChange={(e) => update("startTime", e.target.value)}
                      className="h-11 rounded-xl border border-border bg-background px-4 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </Field>
                </div>
              </div>

              <aside className="flex flex-col border-t border-border bg-mist/35 p-6 lg:border-l lg:border-t-0 lg:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Chuyến đi của bạn</p>
                <h2 className="mt-3 font-serif text-2xl font-semibold capitalize">{prefs.days} tại Đà Lạt</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Bản xem trước tự cập nhật theo lựa chọn của bạn.</p>
                <div className="mt-6 divide-y divide-primary/10 border-y border-primary/10">
                  <SummaryRow icon={Users} label="Đồng hành" value={prefs.travelType} />
                  <SummaryRow icon={WalletCards} label="Ngân sách" value={prefs.budget} />
                  <SummaryRow icon={Bike} label="Di chuyển" value={prefs.transport} />
                  <SummaryRow icon={Clock3} label="Khởi hành" value={prefs.startTime} />
                  <SummaryRow icon={Heart} label="Sở thích" value={`${prefs.interests.length} lựa chọn`} />
                </div>
                <div className="mt-auto pt-7">
                  <button
                    onClick={generate}
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-apricot px-5 py-3.5 font-medium text-white shadow-soft transition hover:brightness-105 disabled:cursor-wait disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {loading ? "Đang sắp xếp..." : "Tạo lịch trình"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </button>
                  {result && (
                    <button onClick={() => setEditing(false)} className="mt-3 w-full text-sm font-medium text-primary hover:underline">
                      Quay lại lịch trình đã tạo
                    </button>
                  )}
                </div>
              </aside>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 flex items-start gap-3 p-5 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Không thể tạo lịch trình</p>
              <p className="text-sm mt-1 opacity-90">{error}</p>
              <button
                onClick={regenerate}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium underline"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Thử lại
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-12 grid gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-3xl p-8 shadow-soft border border-border animate-pulse">
                <div className="h-6 w-32 bg-muted rounded" />
                <div className="mt-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {result && !editing && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-3xl font-semibold">Lịch trình của bạn</h2>
                {result.summary && <p className="text-muted-foreground mt-1">{result.summary}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border hover:bg-muted transition text-sm font-medium"
                >
                  <Settings2 className="h-4 w-4" /> Sửa lựa chọn
                </button>
                <button
                  onClick={regenerate}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-primary text-primary hover:bg-primary/5 transition text-sm font-medium disabled:opacity-60"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Tạo lại
                </button>
                <button
                  onClick={save}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition text-sm"
                >
                  <Save className="h-4 w-4" /> Lưu chuyến đi
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-5 rounded-2xl bg-mist/60 border border-primary/10">
              <Info className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
              <div className="text-sm">
                <p className="font-semibold text-primary">Vì sao lịch trình này phù hợp?</p>
                <p className="mt-1 text-foreground/80">
                  Các địa điểm này phù hợp với chuyến đi <b>{prefs.travelType}</b> trong <b>{prefs.days}</b>, ngân sách{" "}
                  <b>{prefs.budget}</b>, sở thích ({prefs.interests.join(", ")}) và phương tiện <b>{prefs.transport}</b>.
                  Các điểm dừng được sắp xếp theo thời gian tham quan phù hợp và hạn chế di chuyển vòng lại.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {result.days.map((day) => (
                <div key={day.label} className="bg-card rounded-3xl p-6 md:p-8 shadow-soft border border-border">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-serif text-2xl font-semibold text-primary">{day.label}</h3>
                    {day.theme && <span className="text-sm text-apricot font-medium">{day.theme}</span>}
                  </div>
                  <div className="mt-5 space-y-4">
                    <TimeBlock icon={Sun} tint="bg-apricot/15 text-apricot" title="Buổi sáng" {...day.morning} />
                    <TimeBlock icon={Coffee} tint="bg-mist text-primary" title="Buổi chiều" {...day.afternoon} />
                    <TimeBlock icon={Moon} tint="bg-pine-dark/10 text-pine-dark" title="Buổi tối" {...day.evening} />
                  </div>
                  <div className="mt-6 grid md:grid-cols-3 gap-4 pt-6 border-t border-border text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Gợi ý ẩm thực</p>
                      <ul className="mt-1 space-y-0.5">{day.food?.map((f) => <li key={f}>• {f}</li>)}</ul>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Chi phí dự kiến</p>
                      <p className="mt-1 font-medium text-primary">{day.cost}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Lưu ý chuyến đi</p>
                      <p className="mt-1">{day.notes}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </PageTransition>
  );
};

const Field = ({
  icon: Icon,
  label,
  hint,
  children,
  error,
}: {
  icon?: React.ElementType;
  label: string;
  hint?: string;
  children: React.ReactNode;
  error?: string;
}) => (
  <div>
    <div className="mb-3 flex items-start gap-2.5">
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
    {children}
    {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
  </div>
);

const ChipGroup = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((o) => (
      <button
        key={o}
        type="button"
        aria-pressed={value === o}
        onClick={() => onChange(o)}
        className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm capitalize transition-colors ${
          value === o ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/50 hover:bg-mist/40"
        }`}
      >
        {value === o && <Check className="h-3.5 w-3.5" />}
        {o}
      </button>
    ))}
  </div>
);

const SummaryRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-center gap-3 py-3.5">
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-background text-primary">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-medium capitalize">{value}</p>
    </div>
  </div>
);

const TimeBlock = ({
  icon: Icon,
  tint,
  title,
  time,
  place,
  note,
  alternatives,
}: {
  icon: React.ElementType;
  tint: string;
  title: string;
  time: string;
  place: string;
  note: string;
  alternatives?: AlternativePlace[];
}) => (
  <div className="flex gap-4">
    <div className={`h-10 w-10 rounded-full grid place-items-center shrink-0 ${tint}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1">
      <div className="flex items-baseline gap-3">
        <p className="font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <p className="text-foreground/90 mt-0.5">
        <MapPin className="inline h-3.5 w-3.5 text-primary mr-1" />
        {place}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{note}</p>
      {alternatives && alternatives.length > 0 && <div className="mt-3 rounded-xl border border-dashed border-primary/25 bg-mist/25 p-3"><p className="flex items-center gap-1.5 text-xs font-semibold text-primary"><Shuffle className="h-3.5 w-3.5" /> Lựa chọn thay thế</p>{alternatives.slice(0, 2).map((alternative) => <div key={alternative.place} className="mt-2 text-sm"><div className="flex items-start justify-between gap-2"><p className="font-medium">{alternative.place}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${alternative.place}, ${alternative.address || "Đà Lạt"}`)}`} target="_blank" rel="noreferrer" className="text-primary" aria-label={`Mở ${alternative.place} trên Google Maps`}><ExternalLink className="h-3.5 w-3.5" /></a></div><p className="mt-0.5 text-xs text-muted-foreground">{alternative.note}</p></div>)}</div>}
    </div>
  </div>
);

export default TripPlanner;
