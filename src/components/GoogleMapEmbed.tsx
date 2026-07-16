import { ExternalLink, MapPinned } from "lucide-react";

export default function GoogleMapEmbed({ name, latitude, longitude, address }: { name: string; latitude: number; longitude: number; address?: string }) {
  const query = encodeURIComponent(`${name}, ${address || `${latitude},${longitude}`}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  return <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-soft">
    <iframe title={`Google Maps - ${name}`} src={`https://www.google.com/maps?q=${query}&output=embed`} className="w-full h-[360px] border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
    <div className="p-4 flex items-center justify-between gap-4">
      <div className="flex items-start gap-2 min-w-0"><MapPinned className="h-5 w-5 text-primary shrink-0 mt-0.5" /><div><p className="font-medium">{name}</p><p className="text-sm text-muted-foreground">{address}</p></div></div>
      <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">Mở Google Maps <ExternalLink className="h-4 w-4" /></a>
    </div>
  </div>;
}
