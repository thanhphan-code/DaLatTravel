import { Sparkles, Cog, Package, AlertTriangle, Rocket } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Section = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="bg-card rounded-3xl p-6 md:p-8 shadow-soft border border-border">
    <div className="flex items-center gap-3">
      <span className="h-10 w-10 rounded-full grid place-items-center bg-mist text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="font-serif text-2xl font-semibold">{title}</h2>
    </div>
    <div className="mt-4 text-foreground/85 leading-relaxed space-y-2">{children}</div>
  </section>
);

const AboutAI = () => {
  return (
    <PageTransition>
      <Header />
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-14">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mist text-primary text-sm mb-4">
            <Sparkles className="h-3.5 w-3.5" /> About the AI
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold">How the AI Trip Planner works</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            TravelDaLat2026 uses AI to turn your preferences into a realistic day-by-day plan for Da Lat.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <Section icon={Sparkles} title="1. What the AI does">
            <ul className="list-disc pl-5 space-y-1">
              <li>Generates a personalized Da Lat itinerary tailored to your inputs.</li>
              <li>Suggests places, food, cafes, timing, cost, and practical travel notes.</li>
              <li>Balances nature, food, cafes and photo spots to match your travel style.</li>
            </ul>
          </Section>

          <Section icon={Cog} title="2. What inputs are used">
            <ul className="list-disc pl-5 space-y-1">
              <li>Number of days (1–4)</li>
              <li>Travel type: solo, couple, friends, family</li>
              <li>Budget: low, medium, high</li>
              <li>Interests: cafes, food, photography, cloud hunting, nature, romantic places, local culture</li>
              <li>Transportation: motorbike, taxi, car</li>
              <li>Start time each day</li>
            </ul>
          </Section>

          <Section icon={Package} title="3. What the AI returns">
            <ul className="list-disc pl-5 space-y-1">
              <li>Day-by-day itinerary with a short theme per day</li>
              <li>Morning, afternoon and evening timeline with times and places</li>
              <li>Food and cafe recommendations for each day</li>
              <li>Estimated cost range (VND) per day</li>
              <li>Practical travel notes (weather, timing, transport tips)</li>
            </ul>
          </Section>

          <Section icon={AlertTriangle} title="4. Limitations">
            <ul className="list-disc pl-5 space-y-1">
              <li>Suggestions may not reflect real-time opening hours, weather or traffic.</li>
              <li>Ticket prices and menus can change — verify before you go.</li>
              <li>The AI can occasionally repeat popular places; use Regenerate for a fresh plan.</li>
              <li>Always cross-check important stops on Google Maps and recent reviews.</li>
            </ul>
          </Section>

          <Section icon={Rocket} title="5. Future improvements">
            <ul className="list-disc pl-5 space-y-1">
              <li>Connect to a Python FastAPI backend for richer planning logic.</li>
              <li>Integrate a live weather API for daily conditions.</li>
              <li>Embed Google Maps for routing and travel time between stops.</li>
              <li>Ground suggestions in a real, curated Da Lat place database.</li>
            </ul>
          </Section>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default AboutAI;
