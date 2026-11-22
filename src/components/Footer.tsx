import { Link } from "react-router-dom";
import { Mountain, Github, ArrowUpRight } from "lucide-react";
import FogOverlay from "./FogOverlay";

export default function Footer() {
  return (
    <footer className="site-footer relative isolate overflow-hidden border-t border-border bg-muted/50">
      <FogOverlay variant="footer" />
      <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-12 md:py-16 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-3 font-serif text-2xl font-semibold"
          >
            <Mountain className="text-primary" />
            TravelDaLat
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
            Một cuốn cẩm nang nhỏ, dành cho những chuyến đi nhiều kỷ niệm. Khám
            phá một Đà Lạt rất riêng, theo cách của bạn.
          </p>
          <Link to="/about" className="text-link mt-5">
            Về dự án <ArrowUpRight size={16} />
          </Link>
        </div>
        <nav aria-label="Khám phá thêm">
          <p className="eyebrow">Hẹn bạn ở Đà Lạt</p>
          <div className="grid gap-3 text-sm">
            <Link to="/sources" className="hover:text-primary hover:underline">
              Nguồn ảnh & dữ liệu
            </Link>
            <Link to="/explore" className="hover:text-primary hover:underline">
              Địa điểm & trải nghiệm
            </Link>
            <Link to="/food" className="hover:text-primary hover:underline">
              Ẩm thực & cà phê
            </Link>
            <Link
              to="/homestays"
              className="hover:text-primary hover:underline"
            >
              Một nơi để nghỉ
            </Link>
            <Link to="/planner" className="hover:text-primary hover:underline">
              Lên lịch trình
            </Link>
            <Link to="/saved" className="hover:text-primary hover:underline">
              Chuyến đi đã lưu
            </Link>
          </div>
        </nav>
        <div>
          <p className="eyebrow">Giữ kết nối</p>
          <a
            href="mailto:phanvanthanhk149@gmail.com"
            className="text-sm break-all hover:underline"
          >
            phanvanthanhk149@gmail.com
          </a>
          <p className="text-sm text-muted-foreground mt-3">
            Đà Lạt, Lâm Đồng, Việt Nam
          </p>
          <a
            href="https://github.com/thanhphan-code"
            target="_blank"
            rel="noreferrer"
            className="inline-flex gap-2 items-center mt-5 text-sm text-primary hover:underline"
          >
            <Github size={17} /> GitHub <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
      <div className="relative max-w-7xl mx-auto border-t border-border px-5 md:px-10 py-6 flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
        <span>© TravelDaLat · Phan Văn Thành</span>
        <span>Được tạo nên từ tình yêu với phố núi.</span>
      </div>
    </footer>
  );
}
