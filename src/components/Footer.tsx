import { Link } from "react-router-dom";
import { Mountain, Github, Facebook, Mail } from "lucide-react";

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
          Cẩm nang khám phá Đà Lạt với lịch trình cá nhân, quán cà phê, địa điểm
          chụp ảnh, món ăn và homestay được tuyển chọn.
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-cream/60 mb-3">Liên kết nhanh</p>
        <div className="space-y-2 text-sm">
          <Link to="/explore" className="block hover:text-apricot transition-colors">Khám phá Đà Lạt</Link>
          <Link to="/planner" className="block hover:text-apricot transition-colors">Lập lịch trình</Link>
          <Link to="/food" className="block hover:text-apricot transition-colors">Ẩm thực và cà phê</Link>
          <Link to="/homestays" className="block hover:text-apricot transition-colors">Lưu trú</Link>
          <Link to="/saved" className="block hover:text-apricot transition-colors">Chuyến đã lưu</Link>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-cream/60 mb-3">Liên hệ</p>
        <a href="mailto:phanvanthanhk149@gmail.com" className="flex items-center gap-2 text-sm hover:text-apricot transition-colors">
          <Mail className="h-4 w-4" /> phanvanthanhk149@gmail.com
        </a>
        <p className="text-sm text-cream/70 mt-2">Đà Lạt, Lâm Đồng, Việt Nam</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-cream/60 mb-3">Theo dõi</p>
        <div className="flex gap-3">
          <a href="https://github.com/thanhphan-code" target="_blank" rel="noreferrer" aria-label="GitHub" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-apricot transition-colors"><Github className="h-4 w-4" /></a>
          <a href="#" aria-label="Facebook" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-apricot transition-colors"><Facebook className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
    <div className="border-t border-white/10 py-5 text-center text-xs text-cream/60">
      © 2026 TravelDaLat2026 · Phát triển bởi Phan Văn Thành
    </div>
  </footer>
);

export default Footer;
