import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { places } from "@/data/dalat";

const categoriesList = ["All", "Nature", "Photo Spot", "Local Culture"];
const budgetList = ["All", "low", "medium", "high"];
const suitableList = ["All", "Solo", "Couple", "Family", "Friends"];
const distanceList = [
  { label: "All", max: Infinity },
  { label: "< 5 km", max: 5 },
  { label: "< 15 km", max: 15 },
  { label: "< 30 km", max: 30 },
];

const Explore = () => {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [budget, setBudget] = useState("All");
  const [suitable, setSuitable] = useState("All");
  const [dist, setDist] = useState(distanceList[0]);

  const filtered = useMemo(() => {
    return places.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat !== "All" && p.category !== cat) return false;
      if (budget !== "All" && p.budget !== budget) return false;
      if (suitable !== "All" && !p.suitableFor?.includes(suitable)) return false;
      if ((p.distanceKm ?? 0) > dist.max) return false;
      return true;
    });
  }, [q, cat, budget, suitable, dist]);

  return (
    <PageTransition>
      <Header />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <p className="text-sm uppercase tracking-widest text-primary font-medium mb-2">Explore</p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold">All places in Da Lat</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">Search and filter across cafes, nature spots, photo corners and more.</p>

        <div className="mt-8 bg-card rounded-3xl p-5 md:p-6 shadow-soft border border-border">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search places..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-muted/50 border border-transparent focus:border-primary outline-none"
            />
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <FilterSelect label="Category" value={cat} onChange={setCat} options={categoriesList} />
            <FilterSelect label="Budget" value={budget} onChange={setBudget} options={budgetList} />
            <FilterSelect label="Suitable for" value={suitable} onChange={setSuitable} options={suitableList} />
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Distance</label>
              <select
                value={dist.label}
                onChange={(e) => setDist(distanceList.find((d) => d.label === e.target.value)!)}
                className="w-full px-4 py-2.5 rounded-full bg-muted/50 border border-transparent focus:border-primary outline-none"
              >
                {distanceList.map((d) => <option key={d.label}>{d.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">{filtered.length} place{filtered.length !== 1 && "s"} found</p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <Link key={p.id} to={`/place/${p.id}`} className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-all">
              <div className="relative h-52 overflow-hidden">
                <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 text-xs bg-white/90 backdrop-blur px-3 py-1 rounded-full font-medium">{p.category}</span>
                <span className="absolute top-4 right-4 flex items-center gap-1 text-xs bg-apricot text-white px-2.5 py-1 rounded-full font-medium">
                  <Star className="h-3 w-3 fill-white" /> {p.rating}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.distanceKm} km</span>
                  <span className="text-primary font-medium">{p.cost}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

const FilterSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[]; }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-full bg-muted/50 border border-transparent focus:border-primary outline-none capitalize"
    >
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  </div>
);

export default Explore;
