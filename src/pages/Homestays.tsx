import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { homestays, type Homestay } from "@/data/dalat";
import { ArrowUpDown, Check, ExternalLink, MapPin, Scale, Users, X } from "lucide-react";

const priceOf = (price: string) => Number(price.replace(/\D/g, "")) || null;

const Homestays = () => {
  const [maxPrice, setMaxPrice] = useState("all");
  const [audience, setAudience] = useState("all");
  const [sort, setSort] = useState("recommended");
  const [kind, setKind] = useState("all");
  const [query, setQuery] = useState("");
  const [compare, setCompare] = useState<string[]>([]);
  const filtered = useMemo(() => homestays
    .filter((item) => kind === "all" || (item.kind ?? "Homestay") === kind)
    .filter((item) => `${item.name} ${item.address}`.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi")))
    .filter((item) => maxPrice === "all" || (priceOf(item.price) !== null && priceOf(item.price)! <= Number(maxPrice)))
    .filter((item) => audience === "all" || item.suitableFor.toLocaleLowerCase("vi").includes(audience))
    .sort((a, b) => {
      if (sort === "recommended") return 0;
      const first = priceOf(a.price), second = priceOf(b.price);
      if (first === null) return second === null ? 0 : 1;
      if (second === null) return -1;
      return sort === "price-asc" ? first - second : second - first;
    }), [audience, maxPrice, sort, kind, query]);
  const compared = compare.map((id) => homestays.find((item) => item.id === id)).filter(Boolean) as Homestay[];
  const toggleCompare = (id: string) => setCompare((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);

  return <PageTransition><Header /><main className="max-w-7xl mx-auto px-6 md:px-12 py-14">
    <p className="text-sm uppercase tracking-widest text-primary font-medium mb-2">Lưu trú</p>
    <h1 className="font-serif text-4xl md:text-5xl font-semibold">Một nơi để ở. Một miền để nhớ.</h1>
    <p className="text-muted-foreground mt-3 max-w-2xl">Khách sạn bên hồ, resort giữa đồi thông hay một căn homestay nhỏ. So sánh tối đa ba nơi để tìm chỗ ở hợp chuyến đi của bạn.</p>

    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2" role="group" aria-label="Loại lưu trú">{["all", "Khách sạn", "Homestay", "Resort"].map((value) => <button key={value} onClick={() => setKind(value)} aria-pressed={kind === value} className={`rounded-full border px-4 py-2 text-sm transition ${kind === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary"}`}>{value === "all" ? "Tất cả" : value}</button>)}</div><input aria-label="Tìm nơi lưu trú" placeholder="Tên nơi ở, đường phố…" value={query} onChange={(event) => setQuery(event.target.value)} className="rounded-xl border border-border bg-card px-4 py-3 text-sm sm:w-72" /></div>
    <section className="mt-5 grid gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft sm:grid-cols-3">
      <Filter label="Mức giá mỗi đêm" value={maxPrice} onChange={setMaxPrice}><option value="all">Tất cả mức giá</option><option value="300000">Đến 300.000đ</option><option value="500000">Đến 500.000đ</option><option value="800000">Đến 800.000đ</option></Filter>
      <Filter label="Phù hợp với" value={audience} onChange={setAudience}><option value="all">Tất cả nhóm khách</option><option value="cặp đôi">Cặp đôi</option><option value="bạn bè">Bạn bè</option><option value="gia đình">Gia đình</option><option value="một mình">Đi một mình</option></Filter>
      <Filter label="Sắp xếp" value={sort} onChange={setSort}><option value="recommended">Gợi ý khám phá</option><option value="price-asc">Giá thấp đến cao</option><option value="price-desc">Giá cao đến thấp</option></Filter>
    </section>

    {compared.length > 0 && <Comparison items={compared} onRemove={toggleCompare} />}

    <p className="mt-4 text-xs leading-6 text-muted-foreground">Giá có sẵn là mức tham khảo, cần xác nhận theo ngày và loại phòng. Nơi chưa công bố giá chỉ xuất hiện khi chọn tất cả mức giá.</p>
    <div className="mt-8 flex items-center justify-between"><p className="text-sm text-muted-foreground">Tìm thấy <b className="text-foreground">{filtered.length}</b> nơi lưu trú</p>{compare.length > 0 && <p className="flex items-center gap-2 text-sm font-medium text-primary"><Scale className="h-4 w-4" /> Đang so sánh {compare.length}/3</p>}</div>
    {filtered.length === 0 && <div className="my-10 rounded-2xl bg-mist/40 p-8 text-center"><p>Chưa có nơi lưu trú phù hợp bộ lọc.</p><button onClick={() => { setKind("all"); setQuery(""); setAudience("all"); setMaxPrice("all"); }} className="mt-3 text-primary underline">Xóa bộ lọc</button></div>}
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((item) => {
        const selected = compare.includes(item.id);
        return <article key={item.id} className={`group overflow-hidden rounded-3xl bg-card shadow-soft transition-all hover:shadow-card ${selected ? "ring-2 ring-primary" : ""}`}>
          <div className="relative h-56 overflow-hidden"><img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-primary">{item.kind ?? "Homestay"}</span><button onClick={() => toggleCompare(item.id)} disabled={!selected && compare.length >= 3} className={`absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium shadow-soft transition disabled:opacity-50 ${selected ? "bg-primary text-primary-foreground" : "bg-background/95 text-foreground"}`}>{selected ? <Check className="h-3.5 w-3.5" /> : <Scale className="h-3.5 w-3.5" />}{selected ? "Đã chọn" : "So sánh"}</button></div>
          <div className="p-6"><a href={item.imageSource} target="_blank" rel="noreferrer" className="mb-3 inline-block text-xs text-muted-foreground underline">Ảnh & thông tin nguồn</a><div className="flex items-start justify-between gap-3"><h2 className="font-serif text-xl font-semibold">{item.name}</h2><span className="text-primary font-semibold text-sm text-right">{item.price}</span></div><div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {item.location}</span><span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {item.suitableFor}</span></div><p className="text-sm text-muted-foreground mt-3">{item.description}</p><div className="mt-4 pt-4 border-t border-border"><p className="text-xs text-muted-foreground flex items-start gap-1.5"><MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {item.address}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name}, ${item.address}`)}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">Google Maps <ExternalLink className="h-3.5 w-3.5" /></a></div></div>
        </article>;
      })}
    </div>
  </main><Footer /></PageTransition>;
};

const Filter = ({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) => <label className="text-xs font-medium text-muted-foreground">{label}<div className="relative mt-1.5"><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full appearance-none rounded-xl border border-border bg-background px-3 py-2.5 pr-9 text-sm text-foreground outline-none focus:border-primary">{children}</select><ArrowUpDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" /></div></label>;
const Comparison = ({ items, onRemove }: { items: Homestay[]; onRemove: (id: string) => void }) => <section className="mt-6 overflow-x-auto rounded-3xl border border-primary/20 bg-mist/35 p-5"><div className="flex min-w-[620px] gap-4"><div className="w-28 shrink-0 space-y-4 pt-12 text-xs font-medium text-muted-foreground"><p>Giá/đêm</p><p>Loại lưu trú</p><p>Phù hợp</p><p>Địa chỉ</p></div>{items.map((item) => <div key={item.id} className="min-w-0 flex-1"><div className="flex h-10 items-start justify-between gap-2"><p className="font-serif font-semibold">{item.name}</p><button onClick={() => onRemove(item.id)} className="rounded-lg p-1 hover:bg-background" aria-label={`Bỏ ${item.name}`}><X className="h-4 w-4" /></button></div><div className="space-y-4 text-sm"><p className="font-medium text-primary">{item.price}</p><p>{item.kind ?? "Homestay"}</p><p>{item.suitableFor}</p><p className="text-xs text-muted-foreground">{item.address}</p></div></div>)}</div></section>;

export default Homestays;
