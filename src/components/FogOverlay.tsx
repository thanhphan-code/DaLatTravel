import { useEffect, useRef } from "react";

/** Decorative atmosphere; animation runs only while the section is visible. */
export default function FogOverlay({ variant = "landscape" }: {
  variant?: "landscape" | "footer";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    let inView = false;
    const update = () => {
      element.dataset.moving = String(inView && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return <div ref={ref} className={`ambient-fog ambient-fog--${variant}`} aria-hidden="true" data-moving="false">
    <span className="ambient-fog-bank ambient-fog-bank--far" />
    <span className="ambient-fog-bank ambient-fog-bank--near" />
    <span className="ambient-fog-bank ambient-fog-bank--wisp" />
  </div>;
}
