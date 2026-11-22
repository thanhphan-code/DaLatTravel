import type { Place, FoodItem, Homestay } from "./dalat";
import banhCan from "@/assets/food/banhcan.jpg";
import catalogPhotos from "./catalogPhotos.json";
import lauGa from "@/assets/food/lauga.jpg";

const commonPlace = { image: "/images/photo-pending.svg", rating: 0, cost: "Xác nhận tại điểm đến", bestTime: "Ban ngày", suitableFor: ["Đi một mình", "Cặp đôi", "Gia đình", "Bạn bè"] };
export const additionalPlaces: Place[] = [
  { ...commonPlace, id: "lam-vien-square", name: "Quảng trường Lâm Viên", category: "Điểm chụp ảnh", description: "Không gian dạo bộ bên hồ Xuân Hương với công trình kính hình nụ atisô và hoa dã quỳ. Phù hợp ghé cuối chiều.", address: "Trần Quốc Toản, khu vực hồ Xuân Hương, Đà Lạt", cost: "Miễn phí khu vực công cộng", budget: "low", distanceKm: 1, latitude: 11.9387, longitude: 108.4455, sourceUrl: "https://visitlamdong.vn/vi/quangtruonglamvien" },
  { ...commonPlace, id: "bao-dai-palace", name: "Dinh III Bảo Đại", category: "Kiến trúc", description: "Biệt điện nằm trên đồi thông, gợi mở câu chuyện về đời sống và kiến trúc Đà Lạt thế kỷ XX.", address: "1 Triệu Việt Vương, Đà Lạt", budget: "medium", distanceKm: 2.5, latitude: 11.9291, longitude: 108.4293, sourceUrl: "https://visitlamdong.vn/vi/dinhiii" },
  { ...commonPlace, id: "dalat-cathedral", name: "Nhà thờ Con Gà", category: "Kiến trúc", description: "Nhà thờ chính tòa trên đường Trần Phú, nổi bật với tháp chuông và những ô kính màu. Tôn trọng giờ lễ và khu vực hành lễ.", address: "15 Trần Phú, Đà Lạt", cost: "Không thu vé tham quan bên ngoài", budget: "low", distanceKm: 1, latitude: 11.9364, longitude: 108.4373, sourceUrl: "https://giaophandalat.com/nha-tho-chinh-toa.html" },
  { ...commonPlace, id: "lam-dong-museum", name: "Bảo tàng Lâm Đồng", category: "Văn hóa địa phương", description: "Tìm hiểu lịch sử, thiên nhiên và đời sống văn hóa địa phương qua các khu trưng bày và hiện vật.", address: "4 Hùng Vương, Đà Lạt", budget: "low", distanceKm: 3, latitude: 11.9413, longitude: 108.4648, sourceUrl: "https://baotanglamdong.com.vn/" },
];
export const additionalFoods: FoodItem[] = [
  { id: "banh-can-thy", name: "Bánh căn Thy", category: "Món địa phương", description: "Bánh căn nóng trên phố Tăng Bạt Hổ, ăn cùng nước chấm xíu mại. Hợp một buổi sáng khám phá trung tâm.", image: banhCan, price: "Xem menu tại quán", address: "22 Tăng Bạt Hổ, Đà Lạt", sourceUrl: "https://vinpearl.com/vi/banh-can-da-lat" },
  { id: "banh-can-07", name: "Bánh căn 07 Tăng Bạt Hổ", category: "Món địa phương", description: "Thêm một lựa chọn bánh căn trong khu trung tâm. Hỏi giờ phục vụ trước khi ghé để tránh lúc quán nghỉ.", image: banhCan, price: "Xem menu tại quán", address: "7 Tăng Bạt Hổ, Đà Lạt", sourceUrl: "https://dalatdiary.com/vn/banh-can-da-lat/" },
  { id: "banh-uot-trang", name: "Bánh ướt lòng gà Trang", category: "Món địa phương", description: "Bánh ướt mềm kết hợp thịt gà, lòng gà và nước mắm. Một lựa chọn đổi vị cho bữa sáng hoặc bữa xế.", image: "/images/photo-pending.svg", price: "Xem menu tại quán", address: "15F Tăng Bạt Hổ, Đà Lạt", sourceUrl: "https://visitlamdong.vn/vi/banhuottrang" },
  { id: "lau-ga-89", name: "Lẩu gà lá é Tao Ngộ · Hai Bà Trưng", category: "Lẩu", description: "Nồi lẩu gà và lá é cho bữa tối se lạnh. Chọn kích cỡ nồi và hỏi giá theo số người trước khi gọi.", image: lauGa, price: "Xem menu tại quán", address: "89 Hai Bà Trưng, Đà Lạt", sourceUrl: "https://www.laugalaedalat.net/" },
];
const stayBase = { price: "Liên hệ theo ngày ở", rating: 0, image: "", suitableFor: "Cặp đôi, Gia đình, Bạn bè" };
const stayEntries: Homestay[] = [
  { ...stayBase, id: "dalat-palace", name: "Dalat Palace Heritage Hotel", kind: "Khách sạn", location: "Bên hồ Xuân Hương", address: "2 Trần Phú, Đà Lạt", description: "Khách sạn di sản nhìn ra hồ Xuân Hương, phù hợp kỳ nghỉ trong khu trung tâm. Kiểm tra giá phòng theo ngày và hạng phòng.", imageSource: "https://www.dalatpalacehotel.com/en/engwelcome/" },
  { ...stayBase, id: "ana-mandara", name: "Ana Mandara Villas Dalat", kind: "Resort", location: "Khu Lê Lai", address: "10 Lê Lai, Đà Lạt", description: "Khu biệt thự nghỉ dưỡng giữa đồi thông, dành cho những ngày muốn nghỉ ngơi trong không gian nhiều cây xanh.", imageSource: "https://www.anamandara-resort.com/" },
  { ...stayBase, id: "cu-tren-cay", name: "Cú Trên Cây Homestay", kind: "Homestay", location: "Đặng Thái Thân", address: "37 Đặng Thái Thân, Đà Lạt", description: "Những căn nhà gỗ theo triền đồi, phù hợp người thích không gian gần thiên nhiên. Hỏi về lối đi và bậc thang nếu có người lớn tuổi.", imageSource: "https://visitlamdong.vn/vi/csltcutrencay" },
  { ...stayBase, id: "legume", name: "Légume Homestay", kind: "Homestay", location: "Phía Bắc Đà Lạt", address: "29 Bạch Đằng, Đà Lạt", description: "Một lựa chọn homestay để tham khảo cho nhóm bạn. Liên hệ xác nhận địa chỉ nhận phòng, tiện nghi và giá theo ngày.", imageSource: "https://visitlamdong.vn/vi/legume" },
];

export const additionalStays = stayEntries.map((stay) => ({ ...stay, image: (catalogPhotos as Record<string, { path: string }>)[stay.id]?.path ?? "/images/photo-pending.svg" }));
