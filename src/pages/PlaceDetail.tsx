import { useParams, Link } from "react-router-dom";
import { MapPin, Clock, Wallet, Star, ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { places } from "@/data/dalat";

const PlaceDetail = () => {
  const { id } = useParams();
  const place = places.find((p) => p.id === id);

  if (!place) {
    return (
      <PageTransition>
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="font-serif text-3xl">Place not found</h1>
          <Link to="/explore" className="text-primary underline mt-4 inline-block">Back to Explore</Link>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  const nearby = places.filter((p) => p.id !== place.id).slice(0, 3);

  return (
    <PageTransition>
      <Header />
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>

        <div className="mt-6 rounded-3xl overflow-hidden shadow-card">
          <img src={place.image} alt={place.name} className="w-full h-[420px] object-cover" />
        </div>

        <div className="grid lg:grid-cols-3 gap-10 mt-10">
          <div className="lg:col-span-2">
            <span className="text-xs bg-mist text-primary px-3 py-1 rounded-full font-medium">{place.category}</span>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold mt-3">{place.name}</h1>
            <div className="flex items-center gap-1 text-apricot mt-2">
              <Star className="h-4 w-4 fill-apricot" /> <span className="font-medium">{place.rating}</span>
              <span className="text-muted-foreground text-sm ml-2">· {place.suitableFor?.join(", ")}</span>
            </div>
            <p className="mt-6 text-lg text-foreground/80 leading-relaxed">{place.longDescription ?? place.description}</p>

            {place.tips && (
              <div className="mt-8">
                <h3 className="font-serif text-2xl font-semibold">Travel tips</h3>
                <ul className="mt-4 space-y-2">
                  {place.tips.map((t) => (
                    <li key={t} className="flex gap-3 text-foreground/80">
                      <span className="text-apricot mt-1">✦</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10">
              <h3 className="font-serif text-2xl font-semibold">Nearby places</h3>
              <div className="mt-4 grid sm:grid-cols-3 gap-4">
                {nearby.map((n) => (
                  <Link key={n.id} to={`/place/${n.id}`} className="group bg-card rounded-2xl overflow-hidden shadow-soft">
                    <img src={n.image} alt={n.name} loading="lazy" className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="p-3">
                      <p className="font-medium text-sm">{n.name}</p>
                      <p className="text-xs text-muted-foreground">{n.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="bg-card rounded-3xl p-6 shadow-soft h-fit lg:sticky lg:top-24 space-y-4">
            <InfoRow icon={Clock} label="Best time" value={place.bestTime} />
            <InfoRow icon={Wallet} label="Estimated cost" value={place.cost} />
            <InfoRow icon={MapPin} label="Address" value={place.address ?? "—"} />
            <button
              onClick={() => toast.success(`${place.name} added to your itinerary`)}
              className="w-full inline-flex items-center justify-center gap-2 mt-2 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
            >
              <Plus className="h-4 w-4" /> Add to itinerary
            </button>
          </aside>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <div className="h-9 w-9 rounded-full bg-mist grid place-items-center text-primary shrink-0">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default PlaceDetail;
