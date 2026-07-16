import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Mountain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  transparent?: boolean;
}

const links = [
  { to: "/", label: "Trang chủ" },
  { to: "/explore", label: "Khám phá" },
  { to: "/planner", label: "Lập lịch trình" },
  { to: "/food", label: "Ẩm thực" },
  { to: "/homestays", label: "Lưu trú" },
  { to: "/saved", label: "Chuyến đã lưu" },
  { to: "/about", label: "Giới thiệu" },
];

const Header = ({ transparent = false }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <header
      className={`${transparent ? "absolute" : "sticky"} top-0 left-0 right-0 z-50 ${
        transparent ? "bg-transparent" : "bg-card/90 backdrop-blur-md border-b border-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-4 flex items-center justify-between gap-6">
        <Link
          to="/"
          className={`flex items-center gap-2 font-serif text-lg md:text-xl tracking-tight font-semibold ${
            transparent ? "text-white" : "text-foreground"
          }`}
        >
          <span className={`h-8 w-8 rounded-full grid place-items-center ${transparent ? "bg-white/20" : "bg-primary/10"}`}>
            <Mountain className={`h-4 w-4 ${transparent ? "text-white" : "text-primary"}`} />
          </span>
          TravelDaLat<span className="text-accent">2026</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors ${
                transparent
                  ? `${isActive(link.to) ? "text-white" : "text-white/75"} hover:text-white`
                  : `${isActive(link.to) ? "text-primary" : "text-muted-foreground"} hover:text-primary`
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/planner"
            className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-soft"
          >
            Lập kế hoạch
          </Link>
        </div>

        <button
          className={`lg:hidden ${transparent ? "text-white" : "text-foreground"}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden bg-card border-t border-border px-6 py-6 space-y-3 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block text-base font-medium ${
                  isActive(link.to) ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/planner"
              onClick={() => setMobileOpen(false)}
              className="block text-center bg-primary text-primary-foreground rounded-full py-2.5 text-sm font-medium"
            >
              Lập kế hoạch
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
