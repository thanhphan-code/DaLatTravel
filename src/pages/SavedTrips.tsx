import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Wallet, Users, ArrowRight, Sparkles, Trash2, Pencil, Check, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import type { SavedTrip } from "@/data/dalat";
import { readTrips, removeTrip, renameTrip } from "@/lib/savedTrips";
import { toast } from "sonner";

const SavedTrips = () => {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  useEffect(() => setTrips(readTrips()), []);

  const remove = (id: string) => {
    removeTrip(id);
    setTrips(readTrips());
    toast.success("Đã xóa chuyến đi");
  };

  const startRename = (trip: SavedTrip) => {
    setEditingId(trip.id);
    setDraftName(trip.name);
  };

  const saveName = (id: string) => {
    if (!renameTrip(id, draftName)) return toast.error("Tên chuyến đi không được để trống");
    setTrips(readTrips());
    setEditingId(null);
    toast.success("Đã đổi tên chuyến đi");
  };

  return (
    <PageTransition>
      <Header />
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-2">Chuyến đi của bạn</p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold">Lịch trình đã lưu</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">Mở lại kế hoạch, đổi tên hoặc tiếp tục hoàn thiện từng ngày.</p>
          </div>
          <Link to="/planner" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium transition hover:bg-primary/90 active:scale-[.98]">
            <Sparkles className="h-4 w-4" /> Tạo lịch trình mới
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="mt-16 text-center bg-card rounded-3xl py-16 border border-dashed border-border">
            <Calendar className="mx-auto h-9 w-9 text-primary" />
            <p className="mt-4 font-medium">Bạn chưa lưu chuyến đi nào</p>
            <Link to="/planner" className="text-primary underline mt-3 inline-block">Tạo chuyến đi đầu tiên</Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <article key={trip.id} className="group flex min-h-72 flex-col rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-muted-foreground">Đã lưu ngày {trip.createdAt}</p>
                  <div className="flex gap-1">
                    <button onClick={() => startRename(trip)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-mist hover:text-primary" aria-label={`Đổi tên ${trip.name}`}><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(trip.id)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive" aria-label={`Xóa ${trip.name}`}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>

                {editingId === trip.id ? (
                  <div className="mt-2 flex gap-2">
                    <input autoFocus value={draftName} onChange={(event) => setDraftName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && saveName(trip.id)} className="min-w-0 flex-1 rounded-xl border border-primary bg-background px-3 py-2 font-serif text-lg outline-none ring-2 ring-primary/10" aria-label="Tên chuyến đi" />
                    <button onClick={() => saveName(trip.id)} className="rounded-xl bg-primary p-2.5 text-primary-foreground" aria-label="Lưu tên"><Check className="h-4 w-4" /></button>
                    <button onClick={() => setEditingId(null)} className="rounded-xl border border-border p-2.5" aria-label="Hủy"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <h2 className="font-serif text-2xl font-semibold mt-2 text-wrap-balance">{trip.name}</h2>
                )}

                <div className="mt-5 grid grid-cols-3 gap-2 border-y border-border py-4 text-sm">
                  <TripStat icon={Calendar} value={`${trip.days} ngày`} />
                  <TripStat icon={Wallet} value={trip.budget} />
                  <TripStat icon={Users} value={trip.travelType} />
                </div>
                <Link to={`/saved/${trip.id}`} className="mt-auto inline-flex items-center justify-between pt-6 font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  Xem chi tiết lịch trình <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </PageTransition>
  );
};

const TripStat = ({ icon: Icon, value }: { icon: React.ElementType; value: string }) => (
  <div className="min-w-0 text-center text-muted-foreground capitalize">
    <Icon className="mx-auto mb-1.5 h-4 w-4 text-primary" />
    <span className="block truncate text-xs">{value}</span>
  </div>
);

export default SavedTrips;
