import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { ExternalLink, MapPinned, Route } from "lucide-react";
import { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import { places, type Place } from "@/data/dalat";
import type { TripDay, TripSlot } from "@/lib/savedTrips";

type RoutePoint = Pick<Place, "id" | "name" | "address" | "latitude" | "longitude">;

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/đ/g, "d");
const aliases: Record<string, string[]> = {
  "xuan-huong-lake": ["ho xuan huong", "quang truong lam vien"],
  langbiang: ["langbiang", "lang biang"],
  "cau-dat": ["cau dat", "doi che cau dat"],
  datanla: ["datanla", "thac datanla"],
  "night-market": ["cho dem", "cho da lat", "khu hoa binh"],
  "tuyen-lam-lake": ["ho tuyen lam"],
  "truc-lam-pagoda": ["thien vien truc lam"],
  "dalat-railway-station": ["ga da lat"],
  "linh-phuoc-pagoda": ["chua linh phuoc"],
  "clay-tunnel": ["duong ham dat set", "dat set"],
  "dalat-flower-garden": ["vuon hoa da lat", "vuon hoa cam tu cau"],
};

const placesInSlot = (slot: TripSlot) => {
  const source = normalize(slot.place);
  return places.filter((place) => {
    if (slot.placeId === place.id) return true;
    const names = [normalize(place.name), ...(aliases[place.id] || [])];
    return names.some((name) => source.includes(name) || name.includes(source));
  });
};

const distanceKm = (a: RoutePoint, b: RoutePoint) => {
  const radius = 6371;
  const radians = (value: number) => value * Math.PI / 180;
  const dLat = radians(b.latitude - a.latitude);
  const dLon = radians(b.longitude - a.longitude);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.latitude)) * Math.cos(radians(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

const FitRoute = ({ points }: { points: RoutePoint[] }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) map.fitBounds(new LatLngBounds(points.map((point) => [point.latitude, point.longitude])), { padding: [35, 35] });
  }, [map, points]);
  return null;
};

export default function DayRouteMap({ day }: { day: TripDay }) {
  const slots = [day.morning, day.afternoon, day.evening];
  const points = useMemo(() => {
    const found: RoutePoint[] = slots.flatMap((slot, index) => {
      if (typeof slot.latitude === "number" && typeof slot.longitude === "number") {
        return [{ id: slot.placeId || `generated-${index}-${slot.place}`, name: slot.place, address: slot.address, latitude: slot.latitude, longitude: slot.longitude }];
      }
      return placesInSlot(slot);
    });
    return found.filter((place, index) => found.findIndex((item) => item.id === place.id) === index);
  }, [day]);
  const distance = points.slice(1).reduce((sum, point, index) => sum + distanceKm(points[index], point), 0);
  const routeLabel = points.length < 2 ? "Chưa đủ tọa độ để ước tính khoảng cách" : distance < 12 ? `Các điểm khá gần nhau, khoảng ${distance.toFixed(1)} km` : distance < 30 ? `Tuyến đi vừa phải, khoảng ${distance.toFixed(1)} km` : `Các điểm khá xa nhau, khoảng ${distance.toFixed(1)} km`;
  const routeNames = slots.map((slot) => slot.place).filter((name) => name !== "Chưa có địa điểm");
  const mapsUrl = routeNames.length > 1
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(routeNames[0] + ", Đà Lạt")}&destination=${encodeURIComponent(routeNames.at(-1)! + ", Đà Lạt")}${routeNames.length > 2 ? `&waypoints=${encodeURIComponent(routeNames.slice(1, -1).join("|"))}` : ""}&travelmode=driving`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((routeNames[0] || "Đà Lạt") + ", Đà Lạt")}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-primary/15 bg-background">
      {points.length ? (
        <div className="h-72">
          <MapContainer center={[points[0].latitude, points[0].longitude]} zoom={12} scrollWheelZoom={false} className="h-full w-full" aria-label={`Tuyến đường ${day.label}`}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FitRoute points={points} />
            {points.length > 1 && <Polyline positions={points.map((point) => [point.latitude, point.longitude])} pathOptions={{ color: "#3f8668", weight: 4, opacity: 0.8, dashArray: "8 8" }} />}
            {points.map((point, index) => <CircleMarker key={point.id} center={[point.latitude, point.longitude]} radius={13} pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#3f8668", fillOpacity: 1 }}><Popup><strong>{index + 1}. {point.name}</strong><br />{point.address}</Popup></CircleMarker>)}
          </MapContainer>
        </div>
      ) : (
        <div className="grid h-44 place-items-center px-6 text-center"><div><MapPinned className="mx-auto h-7 w-7 text-primary" /><p className="mt-2 font-medium">Chưa xác định được tọa độ</p><p className="mt-1 text-sm text-muted-foreground">Google Maps vẫn có thể tìm tuyến theo tên địa điểm.</p></div></div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4">
        <p className="flex items-center gap-2 text-sm"><Route className="h-4 w-4 text-primary" /> {routeLabel}</p>
        <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">Mở chỉ đường <ExternalLink className="h-4 w-4" /></a>
      </div>
    </div>
  );
}
