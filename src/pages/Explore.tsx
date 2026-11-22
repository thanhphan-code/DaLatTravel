import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, Star, Map, LayoutGrid } from "lucide-react";
import { planningInfo } from "@/data/planning";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { places } from "@/data/dalat";
import PlacesMap from "@/components/PlacesMap";
import WeatherWidget from "@/components/WeatherWidget";

const categoriesList = [
  "Tất cả",
  ...Array.from(new Set(places.map((place) => place.category))),
];
const budgetList = ["Tất cả", "low", "medium", "high"];
const suitableList = ["Tất cả", "Đi một mình", "Cặp đôi", "Gia đình", "Bạn bè"];
const distanceList = [
  { label: "Tất cả", max: Infinity },
  { label: "< 5 km", max: 5 },
  { label: "< 15 km", max: 15 },
  { label: "< 30 km", max: 30 },
];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const experience = searchParams.get("experience");
  const experienceCategories: Record<string, string> = {
    nature: "Thiên nhiên",
    "photo-spots": "Điểm chụp ảnh",
    cafes: "Quán cà phê",
  };
  const requestedCategory =
    searchParams.get("category") ?? experienceCategories[experience ?? ""];
  const cat = categoriesList.includes(requestedCategory)
    ? requestedCategory
    : "Tất cả";
  const setQ = (value: string) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set("q", value);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  const setCat = (value: string) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete("experience");
        if (value !== "Tất cả") next.set("category", value);
        else next.delete("category");
        return next;
      },
      { replace: true },
    );
  const [budget, setBudget] = useState("Tất cả");
  const [suitable, setSuitable] = useState("Tất cả");
  const [dist, setDist] = useState(distanceList[0]);
  const [view, setView] = useState<"grid" | "map">("grid");

  const filtered = useMemo(() => {
    return places.filter((p) => {
      if (
        q.trim() &&
        !p.name
          .toLocaleLowerCase("vi")
          .includes(q.trim().toLocaleLowerCase("vi"))
      )
        return false;
      if (
        experience === "cloud-hunting" &&
        !["langbiang", "cau-dat"].includes(p.id)
      )
        return false;
      if (cat !== "Tất cả" && p.category !== cat) return false;
      if (budget !== "Tất cả" && p.budget !== budget) return false;
      if (suitable !== "Tất cả" && !p.suitableFor?.includes(suitable))
        return false;
      if ((p.distanceKm ?? 0) > dist.max) return false;
      return true;
    });
  }, [q, cat, budget, suitable, dist, experience]);

  return (
    <PageTransition>
      <Header />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <p className="text-sm uppercase tracking-widest text-primary font-medium mb-2">
          Khám phá
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold">
          Địa điểm tại Đà Lạt
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Tìm kiếm và lọc quán cà phê, cảnh thiên nhiên, điểm chụp ảnh và nhiều
          nơi thú vị.
        </p>

        <div className="mt-8 bg-card rounded-3xl p-5 md:p-6 shadow-soft border border-border">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              aria-label="Tìm kiếm địa điểm"
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm địa điểm..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-muted/50 border border-transparent focus:border-primary outline-none"
            />
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <FilterSelect
              label="Danh mục"
              value={cat}
              onChange={setCat}
              options={categoriesList}
            />
            <FilterSelect
              label="Ngân sách"
              value={budget}
              onChange={setBudget}
              options={budgetList}
            />
            <FilterSelect
              label="Phù hợp với"
              value={suitable}
              onChange={setSuitable}
              options={suitableList}
            />
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                Khoảng cách
              </label>
              <select
                value={dist.label}
                onChange={(e) =>
                  setDist(distanceList.find((d) => d.label === e.target.value)!)
                }
                className="w-full px-4 py-2.5 rounded-full bg-muted/50 border border-transparent focus:border-primary outline-none"
              >
                {distanceList.map((d) => (
                  <option key={d.label}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {experience === "cloud-hunting" && (
          <div className="mt-5 flex items-center gap-3 text-sm">
            <span className="rounded-lg bg-muted px-3 py-2">
              Trải nghiệm: Săn mây
            </span>
            <button
              onClick={() => setCat("Tất cả")}
              className="text-primary underline underline-offset-4"
            >
              Bỏ lọc săn mây
            </button>
          </div>
        )}
        {filtered.length === 0 && (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-border bg-card p-8 text-center"
          >
            <h2 className="text-xl">Chưa tìm thấy địa điểm phù hợp</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thử một từ khóa khác hoặc xóa bộ lọc để khám phá thêm.
            </p>
            <button
              className="home-button mt-5"
              onClick={() => {
                setSearchParams({});
                setBudget("Tất cả");
                setSuitable("Tất cả");
                setDist(distanceList[0]);
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-6 items-stretch">
          <div className="rounded-3xl bg-mist/50 p-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {filtered.length} địa điểm được tìm thấy
              </p>
              <p className="font-serif text-2xl font-semibold mt-1">
                Chọn cách bạn muốn khám phá
              </p>
            </div>
            <div className="flex rounded-full bg-card p-1 border border-border shrink-0">
              <button
                onClick={() => setView("grid")}
                className={`p-2.5 rounded-full ${view === "grid" ? "bg-primary text-white" : "text-muted-foreground"}`}
                aria-label="Xem dạng lưới"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("map")}
                className={`p-2.5 rounded-full ${view === "map" ? "bg-primary text-white" : "text-muted-foreground"}`}
                aria-label="Xem bản đồ"
              >
                <Map className="h-4 w-4" />
              </button>
            </div>
          </div>
          <WeatherWidget compact />
        </div>

        {view === "map" ? (
          <div className="mt-6">
            <PlacesMap places={filtered} height="620px" />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to={`/place/${p.id}`}
                className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-all"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 text-xs bg-white/90 backdrop-blur px-3 py-1 rounded-full font-medium">
                    {p.category}
                  </span>
                  <span className="absolute top-4 right-4 flex items-center gap-1 text-xs bg-apricot text-white px-2.5 py-1 rounded-full font-medium">
                    {planningInfo[p.id]?.review ? (
                      <>
                        {planningInfo[p.id].review!.rating}/5 ·{" "}
                        {planningInfo[p.id].review!.platform}
                      </>
                    ) : (
                      "Khám phá"
                    )}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {p.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {p.distanceKm} km
                    </span>
                    <span className="text-primary font-medium">{p.cost}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </PageTransition>
  );
};

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-full bg-muted/50 border border-transparent focus:border-primary outline-none capitalize"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {(
            { low: "Tiết kiệm", medium: "Trung bình", high: "Cao" } as Record<
              string,
              string
            >
          )[o] || o}
        </option>
      ))}
    </select>
  </div>
);

export default Explore;
