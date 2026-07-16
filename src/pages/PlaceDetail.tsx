import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Clock, Wallet, Star, ArrowLeft, Plus, X, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { places } from "@/data/dalat";
import WeatherWidget from "@/components/WeatherWidget";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";
import { addPlaceToTrip, readTrips, type DayPeriod } from "@/lib/savedTrips";

const PlaceDetail = () => {
  const { id } = useParams();
  const place = places.find((p) => p.id === id);
  const [adding, setAdding] = useState(false);
  const [tripId, setTripId] = useState("");
  const [dayIndex, setDayIndex] = useState(0);
  const [period, setPeriod] = useState<DayPeriod>("morning");
  const trips = readTrips();

  if (!place) {
    return (
      <PageTransition>
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="font-serif text-3xl">Không tìm thấy địa điểm</h1>
          <Link to="/explore" className="text-primary underline mt-4 inline-block">Quay lại trang khám phá</Link>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  const nearby = places.filter((p) => p.id !== place.id).slice(0, 3);

  const openAdd = () => {
    setTripId((current) => current || trips[0]?.id || "");
    setAdding(true);
  };

  const confirmAdd = () => {
    if (!tripId) return toast.error("Hãy tạo hoặc chọn một chuyến đi trước");
    if (!addPlaceToTrip(tripId, dayIndex, period, place)) return toast.error("Không thể cập nhật chuyến đi");
    setAdding(false);
    toast.success(`Đã thêm ${place.name} vào lịch trình`);
  };

  return (
    <PageTransition>
      <Header />
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Quay lại trang khám phá
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
                <h3 className="font-serif text-2xl font-semibold">Kinh nghiệm tham quan</h3>
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
              <h3 className="font-serif text-2xl font-semibold mb-4">Vị trí trên bản đồ</h3>
              <GoogleMapEmbed name={place.name} latitude={place.latitude} longitude={place.longitude} address={place.address} />
            </div>

            <div className="mt-10">
              <h3 className="font-serif text-2xl font-semibold">Địa điểm gần đây</h3>
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
            <InfoRow icon={Clock} label="Thời gian phù hợp" value={place.bestTime} />
            <InfoRow icon={Wallet} label="Chi phí dự kiến" value={place.cost} />
            <InfoRow icon={MapPin} label="Địa chỉ" value={place.address ?? "—"} />
            <button
              onClick={openAdd}
              className="w-full inline-flex items-center justify-center gap-2 mt-2 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Plus className="h-4 w-4" /> Thêm vào lịch trình
            </button>
            {adding && (
              <div className="rounded-2xl border border-primary/20 bg-mist/45 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 font-semibold"><CalendarDays className="h-4 w-4 text-primary" /> Chọn vị trí trong lịch</p>
                  <button onClick={() => setAdding(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-background" aria-label="Đóng"><X className="h-4 w-4" /></button>
                </div>
                {trips.length === 0 ? (
                  <div className="mt-4 text-sm">
                    <p className="text-muted-foreground">Bạn chưa có chuyến đi nào để thêm địa điểm.</p>
                    <Link to="/planner" className="mt-3 inline-block font-medium text-primary underline">Tạo lịch trình mới</Link>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    <label className="block text-xs font-medium text-muted-foreground">Chuyến đi
                      <select value={tripId} onChange={(event) => { setTripId(event.target.value); setDayIndex(0); }} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary">
                        {trips.map((trip) => <option key={trip.id} value={trip.id}>{trip.name}</option>)}
                      </select>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-xs font-medium text-muted-foreground">Ngày
                        <select value={dayIndex} onChange={(event) => setDayIndex(Number(event.target.value))} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary">
                          {Array.from({ length: trips.find((trip) => trip.id === tripId)?.days || 1 }, (_, index) => <option key={index} value={index}>Ngày {index + 1}</option>)}
                        </select>
                      </label>
                      <label className="text-xs font-medium text-muted-foreground">Buổi
                        <select value={period} onChange={(event) => setPeriod(event.target.value as DayPeriod)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary">
                          <option value="morning">Buổi sáng</option><option value="afternoon">Buổi chiều</option><option value="evening">Buổi tối</option>
                        </select>
                      </label>
                    </div>
                    <button onClick={confirmAdd} className="w-full rounded-xl bg-apricot px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-105">Xác nhận thêm</button>
                  </div>
                )}
              </div>
            )}
            <div className="pt-3"><WeatherWidget latitude={place.latitude} longitude={place.longitude} compact /></div>
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
