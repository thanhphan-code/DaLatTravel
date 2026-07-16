import { useEffect, useState } from "react";
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, Coffee, Flame, Mountain, RefreshCw, ShieldAlert, Sun, Umbrella, Wind } from "lucide-react";
import { getWeather, type WeatherData, weatherLabel } from "@/lib/weather";

const WeatherIcon = ({ code, className = "h-6 w-6" }: { code: number; className?: string }) => {
  if (code === 0) return <Sun className={className} />;
  if (code <= 3) return <CloudSun className={className} />;
  if (code <= 48) return <CloudFog className={className} />;
  if (code <= 82) return <CloudRain className={className} />;
  if (code > 82) return <CloudLightning className={className} />;
  return <Cloud className={className} />;
};

export default function WeatherWidget({ latitude = 11.9404, longitude = 108.4583, compact = false, sidebar = false }: { latitude?: number; longitude?: number; compact?: boolean; sidebar?: boolean }) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const load = () => {
    setError(false);
    setRefreshing(true);
    getWeather(latitude, longitude).then(setData).catch(() => setError(true)).finally(() => setRefreshing(false));
  };
  useEffect(load, [latitude, longitude]);

  if (error) return <div className="rounded-2xl border border-destructive/20 bg-card p-5 text-sm"><p className="font-medium text-destructive">Không tải được dự báo thời tiết</p><button onClick={load} className="mt-2 inline-flex items-center gap-1.5 font-medium text-primary hover:underline"><RefreshCw className="h-3.5 w-3.5" /> Thử lại</button></div>;
  if (!data) return <div className={`animate-pulse rounded-3xl border border-border bg-card ${compact ? "h-52" : sidebar ? "h-[520px]" : "h-80"}`}><div className="h-full rounded-3xl bg-muted/45" /></div>;

  const current = data.current;
  const rainChance = data.daily.precipitation_probability_max[0] || 0;
  const rainy = current.weather_code >= 51 || rainChance >= 60;
  const heavyRain = current.weather_code >= 80 || rainChance >= 85;
  const cold = current.apparent_temperature <= 16;
  const advice = heavyRain
    ? { icon: ShieldAlert, title: "Mưa lớn, không nên đi thác", text: "Ưu tiên quán cà phê, bảo tàng, nhà thờ hoặc điểm tham quan trong nhà." }
    : rainy
      ? { icon: Umbrella, title: "Chọn điểm có mái che", text: "Quán cà phê, nhà thờ Domaine de Marie và khu trung tâm sẽ phù hợp hơn." }
      : { icon: Mountain, title: "Một ngày đẹp để khám phá", text: "Phù hợp săn mây, đi đồi chè Cầu Đất, Langbiang hoặc hồ Tuyền Lâm." };
  const AdviceIcon = advice.icon;

  if (sidebar) return <aside className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
    <div className="bg-primary p-6 text-primary-foreground">
      <div className="flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.17em] text-white/65">Thời tiết Đà Lạt</p><p className="mt-1 text-sm text-white/80">Cập nhật hiện tại</p></div><button onClick={load} disabled={refreshing} className="rounded-xl bg-white/10 p-2.5 transition hover:bg-white/20" aria-label="Cập nhật thời tiết"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /></button></div>
      <div className="mt-6 flex items-end justify-between gap-4"><div><p className="font-serif text-6xl font-semibold tabular-nums">{Math.round(current.temperature_2m)}°</p><p className="mt-1 font-medium">{weatherLabel(current.weather_code)}</p></div><WeatherIcon code={current.weather_code} className="h-14 w-14 text-apricot" /></div>
      <div className="mt-5 flex gap-5 border-t border-white/15 pt-4 text-xs text-white/75"><span>Cảm giác {Math.round(current.apparent_temperature)}°</span><span className="flex items-center gap-1"><Wind className="h-3.5 w-3.5" /> {current.wind_speed_10m} km/h</span></div>
    </div>
    <div className="flex-1 p-5">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">5 ngày tới</p>
      <div className="mt-3 divide-y divide-border">{data.daily.time.map((date, index) => <div key={date} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2.5"><p className="text-sm font-medium capitalize">{index === 0 ? "Hôm nay" : new Intl.DateTimeFormat("vi-VN", { weekday: "short" }).format(new Date(date))}</p><span className="flex items-center gap-1 text-xs text-sky-700"><CloudRain className="h-3.5 w-3.5" />{data.daily.precipitation_probability_max[index]}%</span><span className="w-16 text-right text-sm tabular-nums"><b>{Math.round(data.daily.temperature_2m_max[index])}°</b> <span className="text-muted-foreground">{Math.round(data.daily.temperature_2m_min[index])}°</span></span></div>)}</div>
    </div>
    <div className="flex items-start gap-3 border-t border-border bg-mist/35 p-5"><AdviceIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><p className="text-sm font-semibold">{advice.title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{advice.text}</p></div></div>
  </aside>;

  if (compact) return <section className="overflow-hidden rounded-2xl border border-border bg-background">
    <div className="flex items-start justify-between gap-3 p-5">
      <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Thời tiết hiện tại</p><div className="mt-3 flex items-end gap-3"><span className="font-serif text-4xl font-semibold tabular-nums">{Math.round(current.temperature_2m)}°</span><div className="pb-1"><p className="text-sm font-medium">{weatherLabel(current.weather_code)}</p><p className="text-xs text-muted-foreground">Cảm giác {Math.round(current.apparent_temperature)}°</p></div></div></div>
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-mist text-primary"><WeatherIcon code={current.weather_code} /></div>
    </div>
    <div className="flex items-start gap-3 border-t border-border bg-mist/35 p-4"><AdviceIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><p className="text-sm leading-relaxed"><b>{advice.title}.</b> {advice.text}</p></div>
  </section>;

  return <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4 md:px-8">
      <div className="flex items-center gap-3"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-30" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" /></span><div><p className="text-sm font-semibold">Dự báo thời tiết Đà Lạt</p><p className="text-xs text-muted-foreground">Cập nhật trực tiếp từ Open-Meteo</p></div></div>
      <button onClick={load} disabled={refreshing} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-primary disabled:opacity-50"><RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} /> Cập nhật</button>
    </div>

    <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
      <div className="relative overflow-hidden bg-primary p-6 text-primary-foreground md:p-8">
        <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative flex items-start justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-white/65">Hiện tại · Đà Lạt</p><p className="mt-3 font-serif text-6xl font-semibold tabular-nums md:text-7xl">{Math.round(current.temperature_2m)}°</p><p className="mt-1 text-lg font-medium">{weatherLabel(current.weather_code)}</p></div><WeatherIcon code={current.weather_code} className="h-14 w-14 text-apricot" /></div>
        <div className="relative mt-7 grid grid-cols-2 gap-3 border-t border-white/15 pt-5 text-sm"><div><p className="text-xs text-white/60">Cảm giác như</p><p className="mt-1 font-medium tabular-nums">{Math.round(current.apparent_temperature)}°C</p></div><div><p className="text-xs text-white/60">Tốc độ gió</p><p className="mt-1 flex items-center gap-1.5 font-medium"><Wind className="h-4 w-4" /> {current.wind_speed_10m} km/h</p></div></div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">5 ngày tới</p><h3 className="mt-1 font-serif text-2xl font-semibold">Lên kế hoạch theo thời tiết</h3></div><p className="hidden text-xs text-muted-foreground sm:block">Cao nhất / thấp nhất</p></div>
        <div className="mt-5 divide-y divide-border">
          {data.daily.time.map((date, index) => {
            const day = index === 0 ? "Hôm nay" : new Intl.DateTimeFormat("vi-VN", { weekday: "long" }).format(new Date(date));
            const probability = data.daily.precipitation_probability_max[index];
            return <div key={date} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 first:pt-0 last:pb-0"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-mist text-primary"><WeatherIcon code={data.daily.weather_code[index]} className="h-[18px] w-[18px]" /></span><div><p className="text-sm font-medium capitalize">{day}</p><p className="text-xs text-muted-foreground">{weatherLabel(data.daily.weather_code[index])}</p></div></div><p className="flex items-center gap-1 text-xs text-sky-700"><CloudRain className="h-3.5 w-3.5" /> {probability}%</p><p className="w-16 text-right text-sm tabular-nums"><b>{Math.round(data.daily.temperature_2m_max[index])}°</b> <span className="text-muted-foreground">{Math.round(data.daily.temperature_2m_min[index])}°</span></p></div>;
          })}
        </div>
      </div>
    </div>

    <div className="grid gap-3 border-t border-border bg-mist/25 p-5 md:grid-cols-[1fr_auto] md:items-center md:px-8">
      <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-background text-primary shadow-sm"><AdviceIcon className="h-5 w-5" /></span><div><p className="font-semibold">{advice.title}</p><p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{advice.text}</p></div></div>
      <div className="flex flex-wrap gap-2 md:justify-end">{cold && <span className="inline-flex items-center gap-1.5 rounded-lg bg-background px-3 py-2 text-xs font-medium"><Flame className="h-3.5 w-3.5 text-apricot" /> Mang áo khoác, ăn món nóng</span>}{rainy && <span className="inline-flex items-center gap-1.5 rounded-lg bg-background px-3 py-2 text-xs font-medium"><Coffee className="h-3.5 w-3.5 text-apricot" /> Mang ô hoặc áo mưa</span>}</div>
    </div>
  </section>;
}
