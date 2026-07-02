import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Wallet, Users, ArrowRight, Sparkles, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { initialSavedTrips, SAVED_TRIPS_KEY, type SavedTrip } from "@/data/dalat";
import { toast } from "sonner";

const SavedTrips = () => {
  const [trips, setTrips] = useState<SavedTrip[]>([]);

  useEffect(() => {
    const stored: SavedTrip[] = JSON.parse(localStorage.getItem(SAVED_TRIPS_KEY) || "[]");
    setTrips([...stored, ...initialSavedTrips]);
  }, []);

  const remove = (id: string) => {
    const stored: SavedTrip[] = JSON.parse(localStorage.getItem(SAVED_TRIPS_KEY) || "[]");
    const next = stored.filter((t) => t.id !== id);
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(next));
    setTrips([...next, ...initialSavedTrips]);
    toast.success("Trip removed");
  };

  const isLocal = (id: string) => !initialSavedTrips.find((t) => t.id === id);

  return (
    <PageTransition>
      <Header />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-2">Your trips</p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold">Saved itineraries</h1>
          </div>
          <Link to="/planner" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium">
            <Sparkles className="h-4 w-4" /> New AI plan
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="mt-16 text-center bg-card rounded-3xl py-16 border border-dashed border-border">
            <p className="text-muted-foreground">No saved trips yet.</p>
            <Link to="/planner" className="text-primary underline mt-3 inline-block">Create your first AI trip</Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((t) => (
              <div key={t.id} className="bg-card rounded-3xl p-6 shadow-soft border border-border relative group">
                {isLocal(t.id) && (
                  <button
                    onClick={() => remove(t.id)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition p-2 rounded-full hover:bg-destructive/10 text-destructive"
                    aria-label="Delete trip"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <p className="text-xs text-muted-foreground">Saved {t.createdAt}</p>
                <h3 className="font-serif text-2xl font-semibold mt-1 pr-8">{t.name}</h3>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4 text-primary" /> {t.days} days</div>
                  <div className="flex items-center gap-2 text-muted-foreground capitalize"><Wallet className="h-4 w-4 text-primary" /> {t.budget} budget</div>
                  <div className="flex items-center gap-2 text-muted-foreground capitalize"><Users className="h-4 w-4 text-primary" /> {t.travelType}</div>
                </div>
                <Link to="/planner" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">
                  Plan another <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </PageTransition>
  );
};

export default SavedTrips;
