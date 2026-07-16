import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import { Place } from "@/data/dalat";

const icon = new Icon({ iconUrl: marker, iconRetinaUrl: marker2x, shadowUrl: shadow, iconSize: [25, 41], iconAnchor: [12, 41] });

export default function PlacesMap({ places, height = "480px", zoom = 12 }: { places: Place[]; height?: string; zoom?: number }) {
  const center: [number, number] = places.length === 1 ? [places[0].latitude, places[0].longitude] : [11.9404, 108.4583];
  return <div className="overflow-hidden rounded-3xl border border-border shadow-soft" style={{ height }}>
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full" aria-label="Bản đồ địa điểm Đà Lạt">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {places.map((place) => <Marker key={place.id} position={[place.latitude, place.longitude]} icon={icon} title={place.name}><Popup><div className="min-w-40"><strong>{place.name}</strong><br /><span>{place.category} · {place.rating}★</span><br /><Link className="text-primary font-medium" to={`/place/${place.id}`}>Xem chi tiết →</Link></div></Popup></Marker>)}
    </MapContainer>
  </div>;
}
