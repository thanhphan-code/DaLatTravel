import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, MapPin, Sun, Moon, Coffee, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { SAVED_TRIPS_KEY, type SavedTrip } from "@/data/dalat";

const dayOptions = ["1 day", "2 days 1 night", "3 days 2 nights", "4 days 3 nights"];
const travelTypes = ["solo", "couple", "friends", "family"];
const budgets = ["low", "medium", "high"];
const interestsList = ["cafes", "food", "photography", "cloud hunting", "nature", "romantic places", "local culture"];
const transports = ["motorbike", "taxi", "car"];

type DayPlan = {
  label: string;
  theme?: string;
  morning: { time: string; place: string; note: string };
  afternoon: { time: string; place: string; note: string };
  evening: { time: string; place: string; note: string };
  food: string[];
  cost: string;
  notes: string;
};

type Itinerary = { summary?: string; days: DayPlan[] };

const TripPlanner = () => {
  const [days, setDays] = useState(dayOptions[2]);
  const [travelType, setTravelType] = useState("couple");
  const [budget, setBudget] = useState("medium");
  const [interests, setInterests] = useState<string[]>(["cafes", "cloud hunting"]);
  const [transport, setTransport] = useState("motorbike");
  const [startTime, setStartTime] = useState("08:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Itinerary | null>(null);

  const toggle = (v: string) =>
    setInterests((prev) => (prev.includes(v) ? prev.filter((i) => i !== v) : [...prev, v]));

  const generate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-trip-planner", {
        body: { days, travelType, budget, interests, transport, startTime },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.days?.length) throw new Error("AI didn't return an itinerary");
      setResult(data as Itinerary);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const save = () => {
    if (!result) return;
    const trip: SavedTrip = {
      id: `trip-${Date.now()}`,
      name: result.summary?.slice(0, 60) || `${travelType} trip · ${days}`,
      days: result.days.length,
      budget,
      travelType,
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
            <Sparkles className="h-3.5 w-3.5" /> AI Trip Planner · Powered by Gemini
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold">Design your Da Lat trip</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Tell us how you like to travel — our AI crafts a personalized day-by-day itinerary in seconds.
          </p>
        </div>

        <div className="mt-10 bg-card rounded-3xl p-6 md:p-10 shadow-soft border border-border space-y-8">
          <Field label="Number of days">
            <ChipGroup options={dayOptions} value={days} onChange={setDays} />
          </Field>
          <div className="grid md:grid-cols-2 gap-8">
            <Field label="Travel type"><ChipGroup options={travelTypes} value={travelType} onChange={setTravelType} /></Field>
            <Field label="Budget"><ChipGroup options={budgets} value={budget} onChange={setBudget} /></Field>
          </div>
          <Field label="Interests (pick any)">
            <div className="flex flex-wrap gap-2">
              {interestsList.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(i)}
                  className={`px-4 py-2 rounded-full text-sm capitalize border transition ${
                    interests.includes(i)
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
            <Field label="Transportation"><ChipGroup options={transports} value={transport} onChange={setTransport} /></Field>
            <Field label="Start time">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="px-4 py-2.5 rounded-full bg-muted/50 border border-transparent focus:border-primary outline-none"
              />
            </Field>
          </div>
          <div className="pt-4 border-t border-border">
            <button
              onClick={generate}
              disabled={loading}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-apricot text-white font-medium shadow-soft hover:brightness-110 transition disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "AI is crafting your trip..." : "Generate Itinerary"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-8 flex items-start gap-3 p-5 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Couldn't generate itinerary</p>
              <p className="text-sm mt-1 opacity-90">{error}</p>
            </div>
          </div>
        )}

        {loading && !result && (
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

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-3xl font-semibold">Your AI itinerary</h2>
                {result.summary && <p className="text-muted-foreground mt-1">{result.summary}</p>}
              </div>
              <button
                onClick={save}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
              >
                <Save className="h-4 w-4" /> Save itinerary
              </button>
            </div>

            <div className="grid gap-6">
              {result.days.map((day) => (
                <div key={day.label} className="bg-card rounded-3xl p-6 md:p-8 shadow-soft border border-border">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-serif text-2xl font-semibold text-primary">{day.label}</h3>
                    {day.theme && <span className="text-sm text-apricot font-medium">{day.theme}</span>}
                  </div>
                  <div className="mt-5 space-y-4">
                    <TimeBlock icon={Sun} tint="bg-apricot/15 text-apricot" title="Morning" time={day.morning.time} place={day.morning.place} note={day.morning.note} />
                    <TimeBlock icon={Coffee} tint="bg-mist text-primary" title="Afternoon" time={day.afternoon.time} place={day.afternoon.place} note={day.afternoon.note} />
                    <TimeBlock icon={Moon} tint="bg-pine-dark/10 text-pine-dark" title="Evening" time={day.evening.time} place={day.evening.place} note={day.evening.note} />
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

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2.5">{label}</label>
    {children}
  </div>
);

const ChipGroup = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
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

const TimeBlock = ({ icon: Icon, tint, title, time, place, note }: {
  icon: React.ElementType; tint: string; title: string; time: string; place: string; note: string;
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
      <p className="text-foreground/90 mt-0.5"><MapPin className="inline h-3.5 w-3.5 text-primary mr-1" />{place}</p>
      <p className="text-sm text-muted-foreground mt-1">{note}</p>
    </div>
  </div>
);

export default TripPlanner;
