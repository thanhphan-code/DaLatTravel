import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X, Mountain } from "lucide-react";

const links = [
  { to: "/", label: "Trang chủ" },
  { to: "/explore", label: "Khám phá" },
  { to: "/food", label: "Ẩm thực" },
  { to: "/homestays", label: "Lưu trú" },
  { to: "/saved", label: "Chuyến đã lưu" },
  { to: "/about", label: "Giới thiệu" },
];

export default function Header({
  transparent = false,
}: {
  transparent?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);
  return (
    <header
      className={`${transparent ? "absolute inset-x-0 text-white" : "sticky text-foreground bg-background/95 backdrop-blur-xl border-b border-border/60"} top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 min-h-20 flex items-center justify-between gap-5">
        <Link
          to="/"
          aria-label="TravelDaLat — Trang chủ"
          className="flex shrink-0 items-center gap-2.5"
        >
          <span
            className={`h-10 w-10 rounded-xl grid place-items-center ${transparent ? "bg-white/15" : "bg-primary text-white"}`}
          >
            <Mountain size={22} strokeWidth={1.5} />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight">
            TravelDaLat
            <span
              className={`block font-sans text-[9px] tracking-[.24em] font-medium ${transparent ? "text-white/75" : "text-muted-foreground"}`}
            >
              CHẠM MỘT ĐÀ LẠT RẤT RIÊNG
            </span>
          </span>
        </Link>
        <nav
          aria-label="Điều hướng chính"
          className="hidden xl:flex items-center gap-6"
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              aria-current={isActive(link.to) ? "page" : undefined}
              className={`relative py-7 text-[13px] font-medium transition-colors ${isActive(link.to) ? "after:absolute after:bottom-4 after:left-0 after:right-0 after:h-0.5 after:bg-current" : "opacity-70 hover:opacity-100"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link to="/planner" className="hidden xl:inline-flex home-button">
          Lên lịch trình <ArrowUpRight size={17} />
        </Link>
        <button
          ref={menuButton}
          type="button"
          className="xl:hidden grid h-11 w-11 place-items-center rounded-xl border border-current/20"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Điều hướng di động"
          className="xl:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border bg-background px-5 py-4 text-foreground shadow-card"
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              aria-current={isActive(link.to) ? "page" : undefined}
              className={`block rounded-lg px-4 py-3 text-sm font-medium ${isActive(link.to) ? "bg-muted text-primary" : "hover:bg-muted"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/planner"
            onClick={() => setMobileOpen(false)}
            className="home-button mt-3 w-full"
          >
            Lên lịch trình <ArrowUpRight size={17} />
          </Link>
        </nav>
      )}
    </header>
  );
}
