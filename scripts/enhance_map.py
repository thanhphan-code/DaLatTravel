from pathlib import Path
p=Path('src/components/PlacesMap.tsx');s=p.read_text(encoding='utf-8');s='import { useEffect } from "react";\nimport ResilientMapTiles from "./ResilientMapTiles";\n'+s;s=s.replace('Popup, TileLayer','Popup, useMap');s=s.replace('  const center:', '  const center:');a=s.index('      <TileLayer');b=s.index('\n',a);s=s[:a]+'      <ResilientMapTiles /><FitPlaces places={places} />'+s[b:];s=s.replace('className="overflow-hidden rounded-3xl', 'className="relative isolate overflow-hidden rounded-3xl');s += '''
function FitPlaces({ places }: { places: Place[] }) {
 const map = useMap();
 useEffect(() => {
  if (places.length === 1) map.setView([places[0].latitude, places[0].longitude], 14);
  else if (places.length > 1) map.fitBounds(places.map((place) => [place.latitude, place.longitude] as [number, number]), { padding: [45, 45], maxZoom: 14 });
 }, [map, places]);
 return null;
}
''';p.write_text(s,encoding='utf-8')
p=Path('src/components/DayRouteMap.tsx');s=p.read_text(encoding='utf-8');s='import ResilientMapTiles from "./ResilientMapTiles";\n'+s;s=s.replace('  TileLayer,\n','');a=s.index('            <TileLayer');b=s.index('/>',a)+2;s=s[:a]+'            <ResilientMapTiles />'+s[b:];s=s.replace('className="h-72"','className="relative isolate h-72"');p.write_text(s,encoding='utf-8')
p=Path('src/components/PageTransition.tsx');s=p.read_text(encoding='utf-8');s=s.replace('duration: 0.28','duration: 0.42').replace('duration: 0.65','duration: 1.05');s=s.replace('x: "-9%"','x: "-38%"').replace('x: "12%"','x: "38%"');s=s.replace('opacity: 0,\n                transition: { duration: 1.05', 'opacity: 0,\n                transition: { duration: 1.05');s=s.replace('<motion.div\n              className="route-mist-layer route-mist-layer-back"','<div className="route-mist-wordmark"><span>Đà Lạt</span><small>Qua một miền mây</small></div>\n            <motion.div\n              className="route-mist-layer route-mist-layer-back"');p.write_text(s,encoding='utf-8')
