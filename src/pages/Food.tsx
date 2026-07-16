import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { foods } from "@/data/dalat";
import { ExternalLink, MapPin } from "lucide-react";

const categories = ["Tất cả", ...Array.from(new Set(foods.map((food) => food.category)))];

const Food = () => {
  const [cat, setCat] = useState("Tất cả");
  const list = cat === "Tất cả" ? foods : foods.filter((f) => f.category === cat);

  return (
    <PageTransition>
      <Header />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <p className="text-sm uppercase tracking-widest text-primary font-medium mb-2">Hương vị Đà Lạt</p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold">Ẩm thực và cà phê Đà Lạt</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Những món ăn, nồi lẩu ấm nóng và quán cà phê sườn đồi được tuyển chọn cho chuyến đi của bạn.
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
                {f.address && <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground flex items-start gap-1.5"><MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {f.address}</p>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${f.venue || f.name}, ${f.address}`)}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">Xem trên Google Maps <ExternalLink className="h-3.5 w-3.5" /></a>
                </div>}
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
