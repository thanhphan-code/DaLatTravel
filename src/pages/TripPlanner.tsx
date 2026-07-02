import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { SAVED_TRIPS_KEY, type SavedTrip } from "@/data/dalat";

const dayOptions = ["1 day", "2 days 1 night", "3 days 2 nights", "4 days 3 nights"];
const travelTypes = ["solo", "couple", "friends", "family"];
const budgets = ["low", "medium", "high"];
const interestsList = [
  "cafes",
  "food",
  "photography",
  "cloud hunting",
  "nature",
  "romantic places",
  "local culture",
];
const transports = ["motorbike", "taxi", "car"];

type TimeSlot = { time: string; place: string; note: string };
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
  const [prefs, setPrefs] = useState<Prefs>({
    days: dayOptions[2],
    travelType: "couple",
    budget: "medium",
    interests: ["cafes", "cloud hunting"],
    transport: "motorbike",
    startTime: "08:00",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Prefs, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Itinerary | null>(null);
  const [editing, setEditing] = useState(true);

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
    if (!prefs.days) e.days = "Please choose a duration";
    if (!prefs.travelType) e.travelType = "Please choose a travel type";
    if (!prefs.budget) e.budget = "Please choose a budget";
    if (!prefs.transport) e.transport = "Please choose transportation";
    if (prefs.interests.length === 0) e.interests = "Pick at least one interest";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Please complete the form before generating");
      return false;
    }
    return true;
  };

  const runGenerate = async (isRegenerate = false) => {
    setLoading(true);
    setError(null);
    if (!isRegenerate) setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-trip-planner", { body: prefs });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!validateItinerary(data)) {
        throw new Error("AI returned an incomplete itinerary. Try regenerating.");
      }
      setResult(data);
      setEditing(false);
      toast.success(isRegenerate ? "New itinerary ready" : "Your itinerary is ready");
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
    const trip: SavedTrip = {
      id: `trip-${Date.now()}`,
      name: result.summary?.slice(0, 60) || `${prefs.travelType} trip · ${prefs.days}`,
      days: result.days.length,
      budget: prefs.budget,
      travelType: prefs.travelType,
      createdAt: new Date().toISOString().slice(0, 10),
      itinerary: result,
    };
    const existing: SavedTrip[] = JSON.parse(localStorage.getItem(SAVED_TRIPS_KEY) || "[]");
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify([trip, ...existing]));
    toast.success("Itinerary saved to Saved Trips");
  };

  return (
    <PageTransition>
      <Header />
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-14">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mist text-primary text-sm mb-4">
            <Sparkles className="h-3.5 w-3.5" /> AI Trip Planner · Powered by Lovable AI
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold">Design your Da Lat trip</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Tell us how you like to travel — our AI crafts a personalized day-by-day itinerary in seconds.
          </p>
        </div>

        {editing && (
          <div className="mt-10 bg-card rounded-3xl p-6 md:p-10 shadow-soft border border-border space-y-8">
            <Field label="Number of days" error={errors.days}>
              <ChipGroup options={dayOptions} value={prefs.days} onChange={(v) => update("days", v)} />
            </Field>
            <div className="grid md:grid-cols-2 gap-8">
              <Field label="Travel type" error={errors.travelType}>
                <ChipGroup options={travelTypes} value={prefs.travelType} onChange={(v) => update("travelType", v)} />
              </Field>
              <Field label="Budget" error={errors.budget}>
                <ChipGroup options={budgets} value={prefs.budget} onChange={(v) => update("budget", v)} />
              </Field>
            </div>
            <Field label="Interests (pick at least one)" error={errors.interests}>
              <div className="flex flex-wrap gap-2">
                {interestsList.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleInterest(i)}
                    className={`px-4 py-2 rounded-full text-sm capitalize border transition ${
                      prefs.interests.includes(i)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 border-border hover:border-primary/50"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </Field>
            <div className="grid md:grid-cols-2 gap-8">
              <Field label="Transportation" error={errors.transport}>
                <ChipGroup options={transports} value={prefs.transport} onChange={(v) => update("transport", v)} />
              </Field>
              <Field label="Start time">
                <input
                  type="time"
                  value={prefs.startTime}
                  onChange={(e) => update("startTime", e.target.value)}
                  className="px-4 py-2.5 rounded-full bg-muted/50 border border-transparent focus:border-primary outline-none"
                />
              </Field>
            </div>
            <div className="pt-4 border-t border-border flex flex-wrap gap-3">
              <button
                onClick={generate}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-apricot text-white font-medium shadow-soft hover:brightness-110 transition disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {loading ? "AI is crafting your trip..." : "Generate Itinerary"}
              </button>
              {result && (
                <button
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-border hover:bg-muted transition"
                >
                  Back to itinerary
                </button>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 flex items-start gap-3 p-5 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Couldn't generate itinerary</p>
              <p className="text-sm mt-1 opacity-90">{error}</p>
              <button
                onClick={regenerate}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium underline"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Try again
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
                <h2 className="font-serif text-3xl font-semibold">Your AI itinerary</h2>
                {result.summary && <p className="text-muted-foreground mt-1">{result.summary}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border hover:bg-muted transition text-sm font-medium"
                >
                  <Settings2 className="h-4 w-4" /> Edit preferences
                </button>
                <button
                  onClick={regenerate}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-primary text-primary hover:bg-primary/5 transition text-sm font-medium disabled:opacity-60"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Regenerate
                </button>
                <button
                  onClick={save}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition text-sm"
                >
                  <Save className="h-4 w-4" /> Save trip
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-5 rounded-2xl bg-mist/60 border border-primary/10">
              <Info className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
              <div className="text-sm">
                <p className="font-semibold text-primary">Why this itinerary?</p>
                <p className="mt-1 text-foreground/80">
                  AI selected these places for a <b>{prefs.travelType}</b> trip over <b>{prefs.days}</b> on a{" "}
                  <b>{prefs.budget}</b> budget, matching your interests ({prefs.interests.join(", ")}) and{" "}
                  <b>{prefs.transport}</b> transport. It sequences stops to fit Da Lat's best visiting hours (cloud
                  hunting at sunrise, cafes mid-morning, night market in the evening) and minimizes back-and-forth
                  travel between areas.
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
                    <TimeBlock icon={Sun} tint="bg-apricot/15 text-apricot" title="Morning" {...day.morning} />
                    <TimeBlock icon={Coffee} tint="bg-mist text-primary" title="Afternoon" {...day.afternoon} />
                    <TimeBlock icon={Moon} tint="bg-pine-dark/10 text-pine-dark" title="Evening" {...day.evening} />
                  </div>
                  <div className="mt-6 grid md:grid-cols-3 gap-4 pt-6 border-t border-border text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Food recommendations</p>
                      <ul className="mt-1 space-y-0.5">{day.food?.map((f) => <li key={f}>• {f}</li>)}</ul>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Estimated cost</p>
                      <p className="mt-1 font-medium text-primary">{day.cost}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Travel notes</p>
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
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2.5">{label}</label>
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
        onClick={() => onChange(o)}
        className={`px-4 py-2 rounded-full text-sm capitalize border transition ${
          value === o ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 border-border hover:border-primary/50"
        }`}
      >
        {o}
      </button>
    ))}
  </div>
);

const TimeBlock = ({
  icon: Icon,
  tint,
  title,
  time,
  place,
  note,
}: {
  icon: React.ElementType;
  tint: string;
  title: string;
  time: string;
  place: string;
  note: string;
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
    </div>
  </div>
);

export default TripPlanner;
