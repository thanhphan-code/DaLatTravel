import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Copy,
  FileDown,
  MapPin,
  Pencil,
  Printer,
  Save,
  Share2,
  Trash2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import {
  decodeSharedTrip,
  encodeSharedTrip,
  findTrip,
  isItinerary,
  removeTrip,
  renameTrip,
  emptyDay,
} from "@/lib/savedTrips";
import TripTimeline from "@/components/TripTimeline";
import TripCostCalculator from "@/components/TripCostCalculator";

const SavedTripDetail = () => {
  const { id = "" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(
    () => findTrip(id) || decodeSharedTrip(searchParams.get("share")),
  );
  const isShared = id === "shared" && Boolean(searchParams.get("share"));
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(trip?.name || "");

  if (!trip) {
    return (
      <PageTransition>
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-serif text-3xl">Không tìm thấy chuyến đi</h1>
          <Link
            to="/saved"
            className="mt-4 inline-block text-primary underline"
          >
            Quay lại chuyến đã lưu
          </Link>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  const itinerary = isItinerary(trip.itinerary)
    ? trip.itinerary
    : {
        summary:
          "Lịch trình này chưa có địa điểm chi tiết. Bạn có thể thêm địa điểm từ trang Khám phá.",
        days: Array.from({ length: trip.days }, (_, index) => emptyDay(index)),
      };

  const saveName = () => {
    if (!renameTrip(trip.id, name))
      return toast.error("Tên chuyến đi không được để trống");
    const updated = findTrip(trip.id);
    setTrip(updated);
    setRenaming(false);
    toast.success("Đã đổi tên chuyến đi");
  };

  const remove = () => {
    removeTrip(trip.id);
    toast.success("Đã xóa chuyến đi");
    navigate("/saved");
  };
  const shareUrl = `${window.location.origin}/saved/shared?share=${encodeSharedTrip(trip)}`;
  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Đã sao chép link lịch trình");
  };
  const share = async () => {
    if (navigator.share)
      await navigator.share({
        title: trip.name,
        text: itinerary.summary,
        url: shareUrl,
      });
    else await copyLink();
  };
  const print = (pdf = false) => {
    if (pdf) toast.info("Trong cửa sổ in, chọn “Lưu dưới dạng PDF”");
    window.print();
  };

  return (
    <PageTransition>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-10 md:px-12 md:py-14">
        <Link
          to="/saved"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Chuyến đã lưu
        </Link>
        <header className="mt-7 flex flex-wrap items-end justify-between gap-5 border-b border-border pb-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              {trip.days} ngày tại Đà Lạt
            </p>
            {renaming ? (
              <div className="mt-3 flex max-w-xl gap-2">
                <input
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && saveName()}
                  className="min-w-0 flex-1 rounded-xl border border-primary bg-background px-4 py-2 font-serif text-2xl outline-none ring-2 ring-primary/10"
                />
                <button
                  onClick={saveName}
                  className="rounded-xl bg-primary px-4 text-primary-foreground"
                >
                  <Save className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <h1 className="mt-2 font-serif text-4xl font-semibold md:text-5xl">
                {trip.name}
              </h1>
            )}
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              {itinerary.summary}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!isShared && (
              <>
                <button
                  onClick={() => setRenaming(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" /> Sửa tên
                </button>
                <button
                  onClick={remove}
                  className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 px-4 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" /> Xóa
                </button>
                <Link
                  to={`/planner?trip=${trip.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  <Pencil className="h-4 w-4" /> Tiếp tục chỉnh sửa
                </Link>
              </>
            )}
          </div>
        </header>

        <div className="mt-5 flex flex-wrap gap-2 print:hidden">
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2 text-sm font-medium hover:bg-muted"
          >
            <Copy className="h-4 w-4" /> Sao chép link
          </button>
          <button
            onClick={() => print(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2 text-sm font-medium hover:bg-muted"
          >
            <FileDown className="h-4 w-4" /> Xuất PDF
          </button>
          <button
            onClick={() => print()}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2 text-sm font-medium hover:bg-muted"
          >
            <Printer className="h-4 w-4" /> In lịch trình
          </button>
          <button
            onClick={share}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2 text-sm font-medium hover:bg-muted"
          >
            <Share2 className="h-4 w-4" /> Gửi bạn bè
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Meta
            icon={CalendarDays}
            label="Thời lượng"
            value={`${trip.days} ngày`}
          />
          <Meta icon={Wallet} label="Ngân sách" value={trip.budget} />
          <Meta icon={MapPin} label="Hình thức" value={trip.travelType} />
        </div>

        <div className="mt-10">
          <TripTimeline itinerary={itinerary} />
        </div>
        <TripCostCalculator
          initialDays={trip.days}
          initialBudget={trip.budget}
        />
      </main>
      <Footer />
    </PageTransition>
  );
};

const Meta = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 rounded-2xl bg-mist/50 p-4">
    <Icon className="h-5 w-5 text-primary" />
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium capitalize">{value}</p>
    </div>
  </div>
);

export default SavedTripDetail;
