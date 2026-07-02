import { Link } from "react-router-dom";
import { Mountain, Instagram, Facebook, Youtube, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-pine-dark text-cream mt-24">
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-serif text-xl font-semibold">
          <span className="h-8 w-8 rounded-full grid place-items-center bg-white/10">
            <Mountain className="h-4 w-4" />
          </span>
          TravelDaLat<span className="text-apricot">2026</span>
        </div>
        <p className="text-sm text-cream/70 leading-relaxed">
          Discover Da Lat with AI-powered itineraries, curated cafes, hidden
          photo spots and cozy homestays in Vietnam's city of eternal spring.
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-cream/60 mb-3">Quick Links</p>
        <div className="space-y-2 text-sm">
          <Link to="/explore" className="block hover:text-apricot transition-colors">Explore Da Lat</Link>
          <Link to="/planner" className="block hover:text-apricot transition-colors">AI Trip Planner</Link>
          <Link to="/food" className="block hover:text-apricot transition-colors">Food & Cafes</Link>
          <Link to="/homestays" className="block hover:text-apricot transition-colors">Homestays</Link>
          <Link to="/saved" className="block hover:text-apricot transition-colors">Saved Trips</Link>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-cream/60 mb-3">Contact</p>
        <a href="mailto:hello@traveldalat2026.com" className="flex items-center gap-2 text-sm hover:text-apricot transition-colors">
          <Mail className="h-4 w-4" /> hello@traveldalat2026.com
        </a>
        <p className="text-sm text-cream/70 mt-2">Da Lat, Lam Dong, Vietnam</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-cream/60 mb-3">Follow</p>
        <div className="flex gap-3">
          <a href="#" aria-label="Instagram" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-apricot transition-colors"><Instagram className="h-4 w-4" /></a>
          <a href="#" aria-label="Facebook" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-apricot transition-colors"><Facebook className="h-4 w-4" /></a>
          <a href="#" aria-label="YouTube" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-apricot transition-colors"><Youtube className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
    <div className="border-t border-white/10 py-5 text-center text-xs text-cream/60">
      © 2026 TravelDaLat2026 · Made for travelers who love the mountains
    </div>
  </footer>
);

export default Footer;
