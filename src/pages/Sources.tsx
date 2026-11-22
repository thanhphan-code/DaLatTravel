import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import catalogPhotos from "@/data/catalogPhotos.json";
import credits from "@/data/photoCredits.json";
import { places, homestays, foods } from "@/data/dalat";
import { planningInfo } from "@/data/planning";

export default function Sources() {
  return (
    <PageTransition>
      <Header />
      <main className="home-container py-14">
        <p className="eyebrow">Minh bạch nguồn thông tin</p>
        <h1 className="font-serif text-4xl md:text-5xl">
          Ảnh thật. Nguồn rõ ràng.
        </h1>
        <p className="mt-5 max-w-3xl leading-7 text-muted-foreground">
          Ảnh dưới đây là ảnh chụp được công bố trên Wikimedia Commons, không
          phải ảnh tạo bằng AI. Mỗi ảnh có tác giả, trang gốc và giấy phép. Ảnh
          có thể được chụp từ nhiều năm trước; cảnh quan, giá và giờ hoạt động
          hiện tại có thể thay đổi. Giao diện cắt khung ảnh để phù hợp bố cục.
        </p>
        <section className="mt-10 rounded-2xl bg-mist/50 p-6">
          <p className="mb-5 text-sm leading-7">
            Ảnh mở đầu trang chủ và một số ảnh món ăn sử dụng tài nguyên minh họa
            có sẵn trong dự án, chưa xác minh tác giả hoặc nguồn gốc. Các ảnh này
            không thuộc bộ ảnh Wikimedia được ghi nguồn bên dưới và không đại diện
            cho ảnh chụp tại một quán cụ thể.
          </p>
          <h2 className="font-serif text-2xl">Gợi ý có căn cứ</h2>
          <p className="mt-3 text-sm leading-7">
            Đánh giá chỉ được hiển thị khi có nền tảng và ngày kiểm tra. Chúng
            tôi chưa xác minh được video TikTok cụ thể nên chưa gắn nhãn “viral
            TikTok”. Thời gian tham quan là gợi ý; thời gian di chuyển được ước
            tính từ tọa độ và phương tiện, có cộng thời gian đệm, không phải dữ
            liệu giao thông trực tiếp.
          </p>
          <ul className="mt-4 space-y-3">
            {Object.entries(planningInfo)
              .filter(([, info]) => info.review || info.hoursSource)
              .map(([id, info]) => (
                <li key={id} className="text-sm">
                  <Link to={`/place/${id}`} className="font-semibold">
                    {places.find((place) => place.id === id)?.name}
                  </Link>
                  {info.review && (
                    <span>
                      {" "}
                      ·{" "}
                      <a
                        className="text-primary underline"
                        href={info.review.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {info.review.platform}: {info.review.rating}/5,{" "}
                        {info.review.count} đánh giá
                      </a>{" "}
                      (kiểm tra 21/11/2026)
                    </span>
                  )}
                  {info.hoursSource && (
                    <span>
                      {" "}
                      ·{" "}
                      <a
                        className="text-primary underline"
                        href={info.hoursSource}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Nguồn giờ mở cửa
                      </a>
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </section>
        <section className="mt-12">
          <h2 className="font-serif text-3xl">Ảnh từ điểm đến & cơ sở lưu trú</h2>
          <p className="mt-3 text-sm text-muted-foreground">Ảnh công bố trên trang của cơ sở và cổng du lịch Lâm Đồng. Quyền ảnh thuộc chủ sở hữu tại nguồn; không thuộc bộ ảnh Wikimedia bên dưới.</p>
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(catalogPhotos).map(([id, photo]) => <article key={id} className="overflow-hidden rounded-2xl border border-border"><img src={photo.path} alt={[...places, ...homestays, ...foods].find((item) => item.id === id)?.name ?? id} loading="lazy" className="aspect-[4/3] w-full object-cover" /><div className="p-4"><h3 className="font-semibold">{[...places, ...homestays, ...foods].find((item) => item.id === id)?.name ?? id}</h3><a href={photo.source} target="_blank" rel="noreferrer" className="mt-2 block text-sm text-primary underline">{photo.publisher}</a></div></article>)}</div>
        </section>
        <section className="mt-12">
          <h2 className="font-serif text-3xl">Tác giả & giấy phép ảnh</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Ảnh món ăn chỉ minh họa loại món, không được coi là ảnh chụp tại nhà
            hàng được gợi ý. Ảnh Trại Mát chụp nhà ga, ảnh vườn hoa chụp xe ngựa
            trong khuôn viên.
          </p>
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(credits).map(([id, photo]) => (
              <article
                key={id}
                className="overflow-hidden rounded-2xl border border-border"
              >
                <img
                  src={photo.path}
                  alt={photo.description}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-4 text-sm">
                  <h3 className="font-semibold">
                    {places.find((place) => place.id === id)?.name ?? id}
                  </h3>
                  <p className="mt-2 break-words text-muted-foreground">
                    Ảnh: {photo.author || "Xem tác giả tại trang nguồn"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ngày chụp theo nguồn: {photo.date || "Không ghi rõ"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <a
                      href={photo.source}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      Ảnh gốc
                    </a>
                    {photo.licenseUrl ? (
                      <a
                        href={photo.licenseUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline"
                      >
                        {photo.license}
                      </a>
                    ) : (
                      <span>{photo.license}</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
