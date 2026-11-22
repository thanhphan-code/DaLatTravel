import { useEffect } from "react";
import ResilientMapTiles from "./ResilientMapTiles";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Place } from "@/data/dalat";

const icon = divIcon({ className: "destination-map-marker", html: '<span aria-hidden="true"></span>', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });

export default function PlacesMap({ places, height = "480px", zoom = 12 }: { places: Place[]; height?: string; zoom?: number }) {
  const center: [number, number] = places.length === 1 ? [places[0].latitude, places[0].longitude] : [11.9404, 108.4583];
  return <div className="relative isolate overflow-hidden rounded-3xl border border-border shadow-soft" style={{ height }}>
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full" aria-label="Bản đồ địa điểm Đà Lạt">
      <ResilientMapTiles /><FitPlaces places={places} />
      {places.map((place) => <Marker key={place.id} position={[place.latitude, place.longitude]} icon={icon} title={place.name}><Popup><div className="min-w-40"><strong>{place.name}</strong><br /><span>{place.category}</span><br /><Link className="text-primary font-medium" to={`/place/${place.id}`}>Xem chi tiết →</Link></div></Popup></Marker>)}
    </MapContainer>
  </div>;
}

function FitPlaces({ places }: { places: Place[] }) {
 const map = useMap();
 useEffect(() => {
  if (places.length === 1) map.setView([places[0].latitude, places[0].longitude], 14);
  else if (places.length > 1) map.fitBounds(places.map((place) => [place.latitude, place.longitude] as [number, number]), { padding: [45, 45], maxZoom: 14 });
 }, [map, places]);
 return null;
}
