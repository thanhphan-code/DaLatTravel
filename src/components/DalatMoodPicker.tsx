import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Compass, MapPin } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { dalatMoods } from "@/data/moods";
import { places } from "@/data/dalat";
export default function DalatMoodPicker() {
  const [active, setActive] = useState(dalatMoods[0].id);
  const reduced = useReducedMotion();
  const mood = dalatMoods.find((item) => item.id === active)!;
  return <section className="home-section" aria-labelledby="mood-title"><div className="section-heading"><div><p className="eyebrow flex items-center gap-2"><Compass size={15} /> Chỉ riêng hành trình của bạn</p><h2 id="mood-title">Hôm nay, bạn muốn<br />một Đà Lạt thế nào?</h2></div><p>Chọn một cảm hứng.<br />Biến thành chuyến đi của riêng mình.</p></div>
    <div className="mood-layout"><div className="mood-options" role="group" aria-label="Chọn cảm hứng Đà Lạt">{dalatMoods.map((item, index) => <button key={item.id} aria-pressed={item.id === active} onClick={() => setActive(item.id)} className={`mood-option ${item.id === active ? "is-active" : ""}`}><span className="text-xs tabular-nums opacity-60">0{index + 1}</span><span><strong className="block font-serif text-xl md:text-2xl">{item.title}</strong><small className="mt-2 block text-xs opacity-75">{item.subtitle}</small></span><ArrowUpRight size={20} /></button>)}</div>
    <div className="mood-preview"><AnimatePresence mode="wait" initial={false}><motion.div key={mood.id} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }}><img src={mood.image} alt={mood.title} loading="lazy" className="mood-photo" /><div className="mood-copy"><p className="eyebrow">{mood.preferences.days} · Nhịp đi do bạn chọn</p><h3 className="font-serif text-3xl">{mood.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{mood.description}</p><div className="mt-4 flex flex-wrap gap-2">{mood.placeIds.map((id) => <Link to={`/place/${id}`} key={id} className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-2 text-xs hover:bg-mist"><MapPin size={12} />{places.find((place) => place.id === id)?.name}</Link>)}</div><Link to={`/planner?mood=${mood.id}`} className="home-button mt-6">Thiết kế chuyến đi này <ArrowUpRight size={17} /></Link></div></motion.div></AnimatePresence></div></div>
  </section>;
}
