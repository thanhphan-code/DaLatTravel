import { Link } from "react-router-dom";
import { Calendar, Wallet, Users, ArrowRight, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { initialSavedTrips } from "@/data/dalat";

const SavedTrips = () => {
  const trips = initialSavedTrips; // TODO: fetch from backend

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
              <div key={t.id} className="bg-card rounded-3xl p-6 shadow-soft border border-border">
                <p className="text-xs text-muted-foreground">Saved {t.createdAt}</p>
                <h3 className="font-serif text-2xl font-semibold mt-1">{t.name}</h3>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4 text-primary" /> {t.days} days</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Wallet className="h-4 w-4 text-primary" /> {t.budget} budget</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4 text-primary" /> {t.travelType}</div>
                </div>
                <button className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">
                  View detail <ArrowRight className="h-4 w-4" />
                </button>
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
