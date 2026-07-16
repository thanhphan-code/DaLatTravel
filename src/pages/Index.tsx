import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Star, Coffee, Camera, Mountain, Utensils, Home, Cloud, Flower2, TreePine, Waves } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";
import heroImg from "@/assets/hero-dalat.jpg";
import { categories, places, foods } from "@/data/dalat";
import WeatherWidget from "@/components/WeatherWidget";

const catIcons: Record<string, React.ElementType> = {
  "cloud-hunting": Cloud,
  cafes: Coffee,
  "photo-spots": Camera,
  nature: Mountain,
  "local-food": Utensils,
  homestays: Home,
};

const Index = () => {
  return (
    <PageTransition>
      <Header transparent />

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Da Lat pine forest and sea of clouds at sunrise"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight"
          >
            Khám phá Đà Lạt theo cách của bạn
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-5 text-lg md:text-xl text-white/85 max-w-2xl mx-auto"
          >
            Lên kế hoạch cho chuyến đi Đà Lạt với địa điểm đẹp, món ngon, quán cà phê và những kinh nghiệm hữu ích.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-apricot text-white font-medium shadow-card hover:brightness-105 transition"
            >
              Tạo lịch trình <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white font-medium hover:bg-white/25 transition"
            >
              Khám phá địa điểm
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Intro and weather */}
      <section className="relative z-20 mx-auto -mt-12 max-w-7xl px-6 md:px-12">
        <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)]">
          <ScrollReveal>
            <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-soft md:p-10">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Chào Đà Lạt</p>
              <h2 className="mt-3 max-w-2xl font-serif text-4xl font-semibold leading-tight md:text-5xl">Thành phố của sương sớm, rừng thông và những nhịp đi chậm.</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                Nằm trên cao nguyên Lâm Viên, Đà Lạt níu chân du khách bằng khí hậu mát lành, những triền đồi xanh và dấu ấn kiến trúc cổ. Mỗi buổi trong ngày mang một sắc thái riêng: sáng săn mây, trưa dạo hồ, chiều ngồi cà phê và tối thưởng thức món nóng giữa phố núi.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <IntroPoint icon={TreePine} title="Thiên nhiên" text="Rừng thông, thác và đồi chè" />
                <IntroPoint icon={Flower2} title="Nhịp sống" text="Chậm rãi, dịu dàng và mến khách" />
                <IntroPoint icon={Waves} title="Trải nghiệm" text="Hồ nước, cà phê và ẩm thực" />
              </div>
              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                <Link to="/explore" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">Bắt đầu khám phá <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/about" className="inline-flex items-center rounded-xl border border-border px-5 py-3 text-sm font-medium transition hover:bg-muted">Câu chuyện dự án</Link>
              </div>
            </article>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <WeatherWidget sidebar />
          </ScrollReveal>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <ScrollReveal>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-sm uppercase tracking-widest text-primary font-medium mb-2">Khám phá</p>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold">Danh mục nổi bật</h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Từ buổi sáng săn mây đến chiều thư thả ở quán cà phê sườn đồi — hãy chọn trải nghiệm bạn yêu thích.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c, i) => {
            const Icon = catIcons[c.slug] ?? Mountain;
            return (
              <ScrollReveal key={c.slug} delay={i * 0.05}>
                <div className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-all">
                  <div className="relative h-52 overflow-hidden">
                    <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur grid place-items-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold">{c.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{c.description}</p>
                    <Link to="/explore" className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary hover:gap-2.5 transition-all">
                      Xem thêm <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Popular Places */}
      <section className="bg-mist/40 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest text-primary font-medium mb-2">Nên ghé</p>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold">Địa điểm nổi tiếng tại Đà Lạt</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.slice(0, 6).map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 0.05}>
                <Link to={`/place/${p.id}`} className="block group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-all">
                  <div className="relative h-56 overflow-hidden">
                    <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-4 left-4 text-xs bg-white/90 backdrop-blur px-3 py-1 rounded-full text-foreground font-medium">
                      {p.category}
                    </span>
                    <span className="absolute top-4 right-4 flex items-center gap-1 text-xs bg-apricot text-white px-2.5 py-1 rounded-full font-medium">
                      <Star className="h-3 w-3 fill-white" /> {p.rating}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold">{p.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{p.description}</p>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <span>🕒 {p.bestTime}</span>
                      <span className="text-primary font-medium">{p.cost}</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trip Planner Preview */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-2">Lập lịch trình</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold leading-tight">
              Lịch trình Đà Lạt dành riêng cho bạn.
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Chọn thời gian, ngân sách và sở thích để nhận lịch trình Đà Lạt phù hợp với riêng bạn.
            </p>
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-soft hover:bg-primary/90 transition"
            >
              Bắt đầu lập kế hoạch <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { n: "01", t: "Chọn số ngày", d: "Từ 1 đến 4 ngày, chuyến ngắn hoặc kỳ nghỉ cuối tuần." },
              { n: "02", t: "Phong cách và ngân sách", d: "Đi một mình, cặp đôi, bạn bè hoặc gia đình." },
              { n: "03", t: "Chọn sở thích", d: "Cà phê, ẩm thực, chụp ảnh, săn mây..." },
              { n: "04", t: "Nhận lịch trình", d: "Kế hoạch cá nhân từ sáng đến tối." },
            ].map((s, i) => (
              <ScrollReveal key={s.n} delay={i * 0.08}>
                <div className="bg-card rounded-2xl p-6 shadow-soft h-full">
                  <div className="text-apricot font-serif text-2xl font-semibold">{s.n}</div>
                  <h4 className="font-semibold mt-2">{s.t}</h4>
                  <p className="text-sm text-muted-foreground mt-1.5">{s.d}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Food preview */}
      <section className="bg-cream py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
              <div>
                <p className="text-sm uppercase tracking-widest text-primary font-medium mb-2">Hương vị Đà Lạt</p>
                <h2 className="font-serif text-4xl md:text-5xl font-semibold">Món ăn và cà phê đáng thử</h2>
              </div>
              <Link to="/food" className="text-sm font-medium text-primary hover:underline">Xem tất cả →</Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {foods.map((f, i) => (
              <ScrollReveal key={f.id} delay={i * 0.04}>
                <div className="group text-center">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-soft mb-3">
                    <img src={f.image} alt={f.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="font-medium text-sm">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.category}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 py-24 text-center">
        <ScrollReveal>
          <div className="rounded-3xl bg-gradient-to-br from-primary to-pine-dark p-12 md:p-16 text-white shadow-card">
            <MapPin className="h-8 w-8 mx-auto text-apricot" />
            <h3 className="font-serif text-3xl md:text-4xl font-semibold mt-4">Sẵn sàng khám phá Đà Lạt?</h3>
            <p className="mt-3 text-white/80 max-w-xl mx-auto">
              Tạo chuyến đi Đà Lạt đáng nhớ với quán cà phê, điểm chụp ảnh, món ngon và homestay.
            </p>
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-full bg-apricot text-white font-medium hover:brightness-110 transition"
            >
              Tạo lịch trình <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </PageTransition>
  );
};

export default Index;

const IntroPoint = ({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) => <div className="rounded-2xl bg-mist/35 p-4"><Icon className="h-5 w-5 text-primary" /><p className="mt-3 text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p></div>;
