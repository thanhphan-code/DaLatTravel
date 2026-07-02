import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { homestays } from "@/data/dalat";
import { MapPin, Star, Users } from "lucide-react";

const Homestays = () => (
  <PageTransition>
    <Header />
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
      <p className="text-sm uppercase tracking-widest text-primary font-medium mb-2">Stay</p>
      <h1 className="font-serif text-4xl md:text-5xl font-semibold">Homestays in Da Lat</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        Wooden A-frame cabins, panoramic villas above the tea hills, and cozy garden houses.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homestays.map((h) => (
          <div key={h.id} className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-all">
            <div className="relative h-56 overflow-hidden">
              <img src={h.image} alt={h.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-4 right-4 flex items-center gap-1 text-xs bg-apricot text-white px-2.5 py-1 rounded-full font-medium">
                <Star className="h-3 w-3 fill-white" /> {h.rating}
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold">{h.name}</h3>
                <span className="text-primary font-semibold">{h.price}</span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {h.location}</span>
                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {h.suitableFor}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">{h.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </PageTransition>
);

export default Homestays;
