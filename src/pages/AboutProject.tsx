import { Compass, MapPinned, CloudSun, Route } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const features = [
  { icon: MapPinned, title: "Địa điểm được tuyển chọn", text: "Thông tin điểm tham quan, món ăn và homestay kèm địa chỉ Google Maps." },
  { icon: Route, title: "Lịch trình cá nhân", text: "Tạo kế hoạch từng ngày theo thời gian, ngân sách, sở thích và phương tiện của bạn." },
  { icon: CloudSun, title: "Thông tin hữu ích", text: "Theo dõi dự báo thời tiết, chi phí tham khảo và các lưu ý thực tế trước chuyến đi." },
];

export default function AboutProject() {
  return <PageTransition><Header /><main className="max-w-5xl mx-auto px-6 md:px-12 py-16">
    <div className="text-center max-w-3xl mx-auto"><Compass className="h-10 w-10 text-primary mx-auto" /><p className="text-sm uppercase tracking-widest text-primary font-medium mt-4">Giới thiệu TravelDaLat2026</p><h1 className="font-serif text-4xl md:text-5xl font-semibold mt-2">Một cẩm nang Đà Lạt được xây dựng bằng sự tò mò và tình yêu du lịch.</h1><p className="text-muted-foreground mt-5 leading-relaxed">TravelDaLat2026 là sản phẩm do Phan Văn Thành phát triển, giúp du khách tìm địa điểm, món ngon, nơi lưu trú và chuẩn bị lịch trình Đà Lạt thuận tiện hơn.</p></div>
    <div className="grid md:grid-cols-3 gap-5 mt-12">{features.map(({ icon: Icon, title, text }) => <section key={title} className="rounded-3xl bg-card border border-border p-6 shadow-soft"><span className="h-11 w-11 rounded-full bg-mist text-primary grid place-items-center"><Icon className="h-5 w-5" /></span><h2 className="font-serif text-xl font-semibold mt-5">{title}</h2><p className="text-sm text-muted-foreground mt-2 leading-relaxed">{text}</p></section>)}</div>
  </main><Footer /></PageTransition>;
}
