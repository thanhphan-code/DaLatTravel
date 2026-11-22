import DalatMoodPicker from "@/components/DalatMoodPicker";
import FogOverlay from "@/components/FogOverlay";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Search,
  Clock,
  TreePine,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";
import WeatherWidget from "@/components/WeatherWidget";
import { categories, places, foods } from "@/data/dalat";
import heroImg from "@/assets/dalat-hero.jpg";
const cafeImg = "/images/verified/tuyen-lam-lake.jpg";

const categoryDestination = (slug: string) => {
  if (slug === "homestays") return "/homestays";
  if (slug === "local-food") return "/food";
  return `/explore?experience=${encodeURIComponent(slug)}`;
};

export default function Index() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(
      `/explore${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`,
    );
  };
  return (
    <PageTransition>
      <Header />
      <a href="#main-content" className="skip-link">
        Đến nội dung chính
      </a>
      <main id="main-content" tabIndex={-1}>
        <section className="home-hero" aria-labelledby="hero-title">
          <img
            src={heroImg}
            alt="Khung cảnh minh họa rừng thông và biển mây trong ánh bình minh"
            className="home-hero-image"
            loading="eager"
            width={1920}
            height={1280}
          />
          <FogOverlay />
          <div className="home-hero-shade" />
          <div className="home-hero-content">
            <p className="hero-eyebrow">
              <span /> CẨM NANG DU LỊCH ĐÀ LẠT
            </p>
            <h1 id="hero-title">
              Một chút bình yên.
              <br />
              <em>Một trời Đà Lạt.</em>
            </h1>
            <p className="hero-description">
              Rời những ngày vội vã. Tìm một góc cà phê, một con dốc nhỏ và
              chuyến đi mang dấu ấn của riêng bạn.
            </p>
            <Link to="/planner" className="hero-button">
              Lên lịch trình của bạn <ArrowUpRight size={19} />
            </Link>
          </div>
          <div className="hero-caption">
            <MapPin size={15} />
            <span>Đà Lạt, Lâm Đồng</span>
            <span className="ml-auto hidden sm:block">
              Những hành trình bắt đầu từ cảm hứng.
            </span>
          </div>
        </section>
        <div className="home-container">
          <form onSubmit={search} className="home-search" role="search">
            <div className="hidden md:block border-r border-border pr-7">
              <p className="text-xs text-muted-foreground mb-1">
                Một chuyến đi mới
              </p>
              <p className="font-semibold">Bạn muốn đi đâu?</p>
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Search className="shrink-0 text-primary" size={21} />
              <label htmlFor="destination-search" className="sr-only">
                Tìm địa điểm ở Đà Lạt
              </label>
              <input
                id="destination-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Hồ Xuân Hương, Cầu Đất…"
                className="min-w-0 w-full bg-transparent py-3 text-sm outline-none"
              />
            </div>
            <button type="submit" className="home-button">
              <span className="hidden sm:inline">Khám phá</span>
              <ArrowRight size={18} />
              <span className="sr-only sm:hidden">Tìm địa điểm</span>
            </button>
          </form>
          <DalatMoodPicker />
          <section className="home-section" aria-labelledby="experience-title">
            <ScrollReveal className="section-heading">
              <div>
                <p className="eyebrow">Đi theo cảm hứng</p>
                <h2 id="experience-title">Đà Lạt, theo cách bạn thích.</h2>
              </div>
              <p>
                Sáng săn mây, chiều nhâm nhi cà phê.
                <br />
                Mỗi ngày là một trải nghiệm mới.
              </p>
            </ScrollReveal>
            <div className="experience-grid">
              {categories.map((category, index) => (
                <ScrollReveal key={category.slug} delay={index * 0.04}>
                  <Link
                    to={categoryDestination(category.slug)}
                    className="experience-card"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                    />
                    <div className="experience-caption">
                      <span className="text-xs text-white/80">
                        0{index + 1} / TRẢI NGHIỆM
                      </span>
                      <div className="flex items-center justify-between gap-3 mt-2">
                        <h3>{category.name}</h3>
                        <ArrowUpRight size={21} />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
          <section
            className="home-section border-t border-border"
            aria-labelledby="places-title"
          >
            <ScrollReveal className="section-heading">
              <div>
                <p className="eyebrow">Những điểm dừng đáng nhớ</p>
                <h2 id="places-title">Đi để thấy, ở để thương.</h2>
              </div>
              <Link to="/explore" className="text-link">
                Tất cả địa điểm <ArrowUpRight size={18} />
              </Link>
            </ScrollReveal>
            <div className="grid gap-x-7 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {places.slice(0, 6).map((place, index) => (
                <ScrollReveal key={place.id} delay={index * 0.04}>
                  <Link
                    to={`/place/${place.id}`}
                    className="place-editorial group"
                  >
                    <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                      <img
                        src={place.image}
                        alt={place.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-medium text-foreground">
                        {place.category}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3 mt-5">
                      <h3 className="text-xl font-semibold">{place.name}</h3>
                      <ArrowUpRight
                        size={20}
                        className="mt-1 shrink-0 text-primary"
                      />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">
                      {place.description}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-xs border-t border-border pt-4">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <Clock size={13} />
                        {place.bestTime}
                      </span>
                      <span className="font-medium text-primary">
                        {place.cost}
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
          <section className="planner-feature" aria-labelledby="planner-title">
            <div className="planner-photo">
              <img
                src={cafeImg}
                alt="Ảnh chụp thật hồ Tuyền Lâm, Đà Lạt"
                loading="lazy"
              />
              <FogOverlay />
              <span>
                <TreePine size={18} /> Chậm lại, tận hưởng nhiều hơn.
              </span>
            </div>
            <div className="planner-copy">
              <p className="eyebrow">Ít lo kế hoạch, nhiều thêm kỷ niệm</p>
              <h2 id="planner-title">
                Chuyến đi của bạn.
                <br />
                <em>Nhịp điệu của bạn.</em>
              </h2>
              <p className="text-muted-foreground leading-7 mt-5">
                Một mình tìm bình yên hay cùng bạn bè gom kỷ niệm? Chọn số ngày,
                ngân sách và sở thích để tạo lịch trình phù hợp.
              </p>
              <ol className="planner-steps">
                <li>
                  <span>01</span>Chọn thời gian & ngân sách
                </li>
                <li>
                  <span>02</span>Thêm những điều bạn thích
                </li>
                <li>
                  <span>03</span>Nhận và lưu lịch trình của bạn
                </li>
              </ol>
              <Link to="/planner" className="home-button w-fit">
                Tạo lịch trình <ArrowUpRight size={18} />
              </Link>
            </div>
          </section>
          <section className="home-section" aria-labelledby="food-title">
            <ScrollReveal className="section-heading">
              <div>
                <p className="eyebrow">Một chút hương vị phố núi</p>
                <h2 id="food-title">Ăn ngon. Ngồi lâu. Nhớ mãi.</h2>
              </div>
              <Link to="/food" className="text-link">
                Khám phá ẩm thực <ArrowUpRight size={18} />
              </Link>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
              {foods
                .filter((food) => !food.image.includes("photo-pending"))
                .slice(0, 4)
                .map((food) => (
                  <Link to="/food" key={food.id} className="group">
                    <div className="aspect-square overflow-hidden rounded-2xl">
                      <img
                        src={food.image}
                        alt={food.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      {food.category}
                    </p>
                    <h3 className="text-lg font-semibold mt-1">{food.name}</h3>
                    <p className="text-sm text-primary mt-2">{food.price}</p>
                  </Link>
                ))}
            </div>
          </section>
          <section
            className="home-section border-t border-border grid gap-9 lg:grid-cols-[1fr_1.1fr] items-center"
            aria-labelledby="weather-title"
          >
            <div>
              <p className="eyebrow">Trước khi xách ba lô</p>
              <h2 id="weather-title" className="section-title">
                Đón một ngày
                <br />ở thành phố sương.
              </h2>
              <p className="max-w-md mt-5 text-muted-foreground leading-7">
                Xem thời tiết để chọn giờ đi dạo, chuẩn bị một chiếc áo ấm và
                dành chỗ cho những cuộc hẹn bất chợt với Đà Lạt.
              </p>
              <Link to="/about" className="text-link mt-6">
                Câu chuyện TravelDaLat <ArrowUpRight size={18} />
              </Link>
            </div>
            <WeatherWidget />
          </section>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
