import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { foods } from "@/data/dalat";

const categories = ["All", "Local Food", "Hotpot", "Grilled Food", "Coffee Shops", "Dessert"];

const Food = () => {
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? foods : foods.filter((f) => f.category === cat);

  return (
    <PageTransition>
      <Header />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <p className="text-sm uppercase tracking-widest text-primary font-medium mb-2">Taste</p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold">Food & cafes in Da Lat</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          A handpicked guide to Da Lat's most beloved dishes, hotpots and hillside cafes.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((f) => (
            <div key={f.id} className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-all">
              <div className="relative h-56 overflow-hidden">
                <img src={f.image} alt={f.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 text-xs bg-white/90 backdrop-blur px-3 py-1 rounded-full font-medium">{f.category}</span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-xl font-semibold">{f.name}</h3>
                  <span className="text-primary font-medium text-sm shrink-0">{f.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1.5">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default Food;
