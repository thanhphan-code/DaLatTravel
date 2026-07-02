import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, MapPin, Sun, Moon, Coffee, Save } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const dayOptions = ["1 day", "2 days 1 night", "3 days 2 nights", "4 days 3 nights"];
const travelTypes = ["solo", "couple", "friends", "family"];
const budgets = ["low", "medium", "high"];
const interestsList = ["cafes", "food", "photography", "cloud hunting", "nature", "romantic places", "local culture"];
const transports = ["motorbike", "taxi", "car"];

type Itinerary = {
  days: {
    label: string;
    morning: { time: string; place: string; note: string };
    afternoon: { time: string; place: string; note: string };
    evening: { time: string; place: string; note: string };
    food: string[];
    cost: string;
    notes: string;
  }[];
};

const mockItinerary = (numDays: number, style: string): Itinerary => {
  const template = [
    {
      morning: { time: "06:00", place: "Lang Biang Mountain — sunrise cloud hunting", note: "Take a jeep to Radar Peak, bring a warm jacket." },
      afternoon: { time: "13:00", place: "Cau Dat Tea Hill", note: "Explore the endless tea rows and old French factory." },
      evening: { time: "18:30", place: "Da Lat Night Market", note: "Grilled skewers + hot soy milk are a must." },
      food: ["Bánh căn breakfast", "Lẩu gà lá é dinner"],
      cost: "600,000 - 900,000 VND",
      notes: "Book jeep the night before. Roads can be foggy — ride carefully.",
    },
    {
      morning: { time: "07:30", place: "Xuan Huong Lake stroll + cafe", note: "Coffee at a lakeside cafe, then pedal boat." },
      afternoon: { time: "14:00", place: "Domaine de Marie Church + Datanla Waterfall", note: "Alpine coaster is worth it." },
      evening: { time: "19:00", place: "Nem nướng dinner + rooftop dessert cafe", note: "End with warm soy milk." },
      food: ["Nem nướng", "Hot soy milk", "Bánh tráng nướng"],
      cost: "500,000 - 800,000 VND",
      notes: "Bring a light raincoat, afternoon showers are common.",
    },
    {
      morning: { time: "08:00", place: "Flower gardens + hidden pine forest cafe", note: "Perfect for photos and slow mornings." },
      afternoon: { time: "13:30", place: "Trai Mat + Linh Phuoc Pagoda", note: "Colorful mosaic temple, half day trip." },
      evening: { time: "19:30", place: "Craft beer at a converted villa", note: "Great way to wrap up the trip." },
      food: ["Local hotpot", "Artisan coffee"],
      cost: "450,000 - 700,000 VND",
      notes: "Save receipts for expense splits.",
    },
    {
      morning: { time: "07:00", place: "Sunrise at Cau Dat + breakfast picnic", note: "Bring a blanket and hot drinks." },
      afternoon: { time: "12:30", place: "Local market lunch + strawberry farm", note: "Pick strawberries and try fresh jam." },
      evening: { time: "19:00", place: "Farewell dinner + acoustic cafe", note: "Slow Da Lat evening." },
      food: ["Strawberries", "Chicken hotpot"],
      cost: "500,000 - 750,000 VND",
      notes: `Style: ${style}. Adjust pace to your energy.`,
    },
  ];
  return {
    days: template.slice(0, numDays).map((d, i) => ({ label: `Day ${i + 1}`, ...d })),
  };
};

const TripPlanner = () => {
  const [days, setDays] = useState(dayOptions[2]);
  const [travelType, setTravelType] = useState("couple");
  const [budget, setBudget] = useState("medium");
  const [interests, setInterests] = useState<string[]>(["cafes", "cloud hunting"]);
  const [transport, setTransport] = useState("motorbike");
  const [startTime, setStartTime] = useState("08:00");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Itinerary | null>(null);

  const toggle = (v: string) =>
    setInterests((prev) => (prev.includes(v) ? prev.filter((i) => i !== v) : [...prev, v]));

  const generate = () => {
    setLoading(true);
    setResult(null);
    // TODO: replace with POST /api/trip-plan to FastAPI backend
    setTimeout(() => {
      const numDays = parseInt(days) || 1;
      setResult(mockItinerary(numDays, travelType));
      setLoading(false);
    }, 900);
  };

  const save = () => {
    // TODO: persist via API. For now local toast.
    toast.success("Itinerary saved to your Saved Trips");
  };

  return (
    <PageTransition>
      <Header />
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-14">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mist text-primary text-sm mb-4">
            <Sparkles className="h-3.5 w-3.5" /> AI Trip Planner
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold">Design your Da Lat trip</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Tell us how you like to travel — our AI will craft a personalized day-by-day itinerary.
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
              {loading ? "Generating itinerary..." : "Generate Itinerary"}
            </button>
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-3xl font-semibold">Your AI itinerary</h2>
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
                  <h3 className="font-serif text-2xl font-semibold text-primary">{day.label}</h3>
                  <div className="mt-5 space-y-4">
                    <TimeBlock icon={Sun} tint="bg-apricot/15 text-apricot" title="Morning" time={day.morning.time} place={day.morning.place} note={day.morning.note} />
                    <TimeBlock icon={Coffee} tint="bg-mist text-primary" title="Afternoon" time={day.afternoon.time} place={day.afternoon.place} note={day.afternoon.note} />
                    <TimeBlock icon={Moon} tint="bg-pine-dark/10 text-pine-dark" title="Evening" time={day.evening.time} place={day.evening.place} note={day.evening.note} />
                  </div>
                  <div className="mt-6 grid md:grid-cols-3 gap-4 pt-6 border-t border-border text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Food recommendations</p>
                      <ul className="mt-1 space-y-0.5">{day.food.map((f) => <li key={f}>• {f}</li>)}</ul>
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

const TimeBlock = ({ icon: Icon, tint, title, time, place, note }: any) => (
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
