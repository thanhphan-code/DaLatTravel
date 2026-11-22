import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TileLayer, useMap } from "react-leaflet";
import { ExternalLink, RefreshCw } from "lucide-react";

const providers = [
  { url: "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attribution/">CARTO</a>' },
  { url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
];

function TileAttempt({ provider, onFail, onReady }: {
  provider: typeof providers[number]; onFail: () => void; onReady: () => void;
}) {
  const loaded = useRef(false);
  const active = useRef(true);
  const failed = useRef(false);
  useEffect(() => {
    active.current = true;
    const timer = window.setTimeout(() => {
      if (!loaded.current && active.current) onFail();
    }, 8000);
    return () => { active.current = false; window.clearTimeout(timer); };
  }, [onFail]);
  return <TileLayer {...provider} maxZoom={19} eventHandlers={{
    tileload: () => { if (active.current) { loaded.current = true; onReady(); } },
    tileerror: () => { failed.current = true; },
    load: () => { if (active.current && failed.current && !loaded.current) onFail(); },
  }} />;
}

export default function ResilientMapTiles() {
  const map = useMap();
  const [attempt, setAttempt] = useState(0);
  const [providerIndex, setProviderIndex] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const fail = useCallback(() => {
    if (providerIndex < providers.length - 1) {
      setProviderIndex(providerIndex + 1);
      setStatus("loading");
    } else setStatus("error");
  }, [providerIndex]);
  const ready = useCallback(() => setStatus("ready"), []);
  useEffect(() => {
    map.invalidateSize({ pan: false });
    if (typeof ResizeObserver === "undefined") return;
    const resize = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    resize.observe(map.getContainer());
    return () => resize.disconnect();
  }, [map]);
  const retry = () => { setStatus("loading"); setProviderIndex(0); setAttempt((value) => value + 1); };
  return <>
    <TileAttempt key={`${attempt}-${providerIndex}`} provider={providers[providerIndex]} onFail={fail} onReady={ready} />
    {status !== "ready" && createPortal(<div className="map-feedback" role="status" onClick={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()}>
      {status === "loading" ? <p className="flex items-center gap-2"><RefreshCw size={16} className="animate-spin" />{providerIndex ? "Đang thử nguồn bản đồ khác…" : "Đang tải bản đồ nền…"}</p> : <><p className="font-semibold">Chưa tải được bản đồ nền</p><p className="mt-1 text-xs leading-5">Không kết nối được các nguồn bản đồ. Bạn vẫn có thể mở chỉ đường bằng Google Maps.</p><div className="mt-3 flex flex-wrap gap-3"><button onClick={retry} className="inline-flex items-center gap-2 text-primary underline"><RefreshCw size={14} />Thử lại</button><a href="https://www.google.com/maps/search/?api=1&query=Da+Lat+Vietnam" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary underline">Mở Google Maps <ExternalLink size={14} /></a></div></>}
    </div>, map.getContainer())}
  </>;
}
