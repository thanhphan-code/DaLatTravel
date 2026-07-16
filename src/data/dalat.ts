// Mock data for TravelDaLat2026. Replace calls with FastAPI endpoints later.
import xuanHuong from "@/assets/places/xuan-huong.jpg";
import langbiang from "@/assets/places/langbiang.jpg";
import cauDat from "@/assets/places/cau-dat.jpg";
import datanla from "@/assets/places/datanla.jpg";
import nightMarket from "@/assets/places/night-market.jpg";
import domaineMarie from "@/assets/places/domaine-marie.jpg";
import catCafes from "@/assets/categories/cafes.jpg";
import catPhoto from "@/assets/categories/photo-spots.jpg";
import foodLauga from "@/assets/food/lauga.jpg";
import foodBanhcan from "@/assets/food/banhcan.jpg";
import foodNemnuong from "@/assets/food/nemnuong.jpg";
import foodSuadau from "@/assets/food/suadau.jpg";
import foodGrilled from "@/assets/food/grilled.jpg";
import foodCoffee from "@/assets/food/coffee.jpg";
import foodNemNuongV2 from "@/assets/food/nem-nuong-ba-hung-v2.jpg";
import foodBanhMiXiuMai from "@/assets/food/banh-mi-xiu-mai.jpg";
import foodLauBo from "@/assets/food/lau-bo-ba-toa.jpg";
import foodBanhBeo from "@/assets/food/banh-beo.jpg";
import foodKemBo from "@/assets/food/kem-bo.jpg";
import foodBanhTrangNuong from "@/assets/food/banh-trang-nuong.jpg";
import foodTraAtiso from "@/assets/food/tra-atiso.jpg";
import hsPine from "@/assets/homestays/pine-cabin.jpg";
import hsCloud from "@/assets/homestays/cloud-house.jpg";
import hsGarden from "@/assets/homestays/garden-villa.jpg";
import hsMoss from "@/assets/homestays/moss-studio.jpg";
import hsTheKupid from "@/assets/homestays/the-kupid.webp";
import hsLacasa from "@/assets/homestays/dalat-lacasa.jpg";
import hsDoiMotNguoi from "@/assets/homestays/doi-mot-nguoi.png";
import hsLaNha from "@/assets/homestays/la-nha.jpg";
import hsCui from "@/assets/homestays/cui-homestay.jpg";
import hsNhaGio from "@/assets/homestays/nha-gio.jpg";
import hsHomefarm from "@/assets/homestays/homefarm.jpg";
import hsLengkeng from "@/assets/homestays/lengkeng.jpg";
import hsTheCircle from "@/assets/homestays/the-circle.jpg";
import hsTeepee from "@/assets/homestays/teepee.jpeg";

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type Place = {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription?: string;
  image: string;
  bestTime: string;
  cost: string;
  rating: number;
  address?: string;
  tips?: string[];
  budget?: "low" | "medium" | "high";
  suitableFor?: string[];
  distanceKm?: number;
  latitude: number;
  longitude: number;
};

export type FoodItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: string;
  venue?: string;
  address?: string;
};

export type Homestay = {
  id: string;
  name: string;
  price: string;
  location: string;
  suitableFor: string;
  rating: number;
  description: string;
  image: string;
  address: string;
  reviewCount?: number;
  imageSource: string;
};

export type SavedTrip = {
  id: string;
  name: string;
  days: number;
  budget: string;
  travelType: string;
  createdAt: string;
  itinerary?: unknown;
};

export const categories: Category[] = [
  { slug: "cloud-hunting", name: "Săn mây", description: "Đón biển mây lúc bình minh từ những đỉnh cao nổi tiếng quanh Đà Lạt.", image: langbiang },
  { slug: "cafes", name: "Quán cà phê", description: "Những quán cà phê sườn đồi nhìn ra rừng thông, hồ nước và thung lũng.", image: catCafes },
  { slug: "photo-spots", name: "Điểm chụp ảnh", description: "Vườn hoa, đồi chè và những góc màu sắc lý tưởng để lưu lại kỷ niệm.", image: catPhoto },
  { slug: "nature", name: "Thiên nhiên", description: "Thác nước, hồ và rừng thông bao quanh thành phố cao nguyên.", image: datanla },
  { slug: "local-food", name: "Ẩm thực địa phương", description: "Lẩu, bánh căn, nem nướng và nhiều món đặc trưng của Đà Lạt.", image: foodLauga },
  { slug: "homestays", name: "Homestay", description: "Nhà gỗ, villa nhỏ và những nơi lưu trú ấm cúng giữa đồi thông.", image: hsPine },
];

const rawPlaces: Place[] = [
  {
    id: "xuan-huong-lake",
    name: "Xuan Huong Lake",
    category: "Nature",
    description: "The scenic heart of Da Lat, perfect for pedal boats and lazy strolls at dawn.",
    longDescription: "A crescent-shaped lake in the center of Da Lat, surrounded by pine trees, flower gardens and cafes. Best enjoyed on foot at sunrise or on a swan pedal boat at sunset.",
    image: xuanHuong,
    bestTime: "Sunrise / Sunset",
    cost: "Free",
    rating: 4.7,
    address: "Central Da Lat",
    tips: ["Rent a swan pedal boat at sunset", "Nearby cafes open from 6am", "Great for a morning jog"],
    budget: "low",
    suitableFor: ["Solo", "Couple", "Family"],
    distanceKm: 0.2,
    latitude: 11.9416,
    longitude: 108.4383,
  },
  {
    id: "langbiang",
    name: "Lang Biang Mountain",
    category: "Nature",
    description: "Da Lat's iconic twin peak with sweeping views over pine forests and clouds.",
    longDescription: "Rising to 2,167m, Lang Biang is the highest peak near Da Lat and the most famous cloud-hunting spot. Take a jeep to Radar Peak before sunrise for the iconic sea of clouds.",
    image: langbiang,
    bestTime: "Early morning",
    cost: "80,000 VND",
    rating: 4.6,
    address: "Lac Duong, ~12km from center",
    tips: ["Take a jeep to Radar Peak", "Bring a jacket, it's windy", "Sunrise cloud hunting is unreal"],
    budget: "medium",
    suitableFor: ["Friends", "Couple", "Family"],
    distanceKm: 12,
    latitude: 12.0504,
    longitude: 108.4424,
  },
  {
    id: "cau-dat",
    name: "Cau Dat Tea Hill",
    category: "Photo Spot",
    description: "Endless rolling tea plantations and a century-old tea factory.",
    longDescription: "Cau Dat's rolling green tea rows and morning mist make it one of Vietnam's most photographed landscapes. The century-old French tea factory is still in operation.",
    image: cauDat,
    bestTime: "Morning",
    cost: "50,000 VND",
    rating: 4.5,
    address: "Xuan Truong, ~25km from center",
    tips: ["Go early to beat the crowds", "Great for portrait photography", "Try the fresh oolong tea"],
    budget: "medium",
    suitableFor: ["Couple", "Friends"],
    distanceKm: 25,
    latitude: 11.8728,
    longitude: 108.6767,
  },
  {
    id: "datanla",
    name: "Datanla Waterfall",
    category: "Nature",
    description: "A lively waterfall with an alpine coaster ride through the pine forest.",
    longDescription: "A multi-tiered waterfall accessible by alpine coaster through the pine forest — one of Da Lat's most fun family activities.",
    image: datanla,
    bestTime: "Late morning",
    cost: "50,000 VND",
    rating: 4.4,
    address: "Deo Prenn, ~7km from center",
    tips: ["Ride the alpine coaster", "Wear grippy shoes", "Avoid weekends if possible"],
    budget: "medium",
    suitableFor: ["Family", "Friends"],
    distanceKm: 7,
    latitude: 11.9009,
    longitude: 108.4482,
  },
  {
    id: "night-market",
    name: "Da Lat Night Market",
    category: "Local Culture",
    description: "Street food, soy milk, grilled skewers, and a lively evening crowd.",
    longDescription: "Da Lat's iconic night market wakes up after dark with lantern-lit food stalls, hot soy milk, grilled skewers and endless people-watching in the cool mountain air.",
    image: nightMarket,
    bestTime: "Evening",
    cost: "Free entry",
    rating: 4.3,
    address: "Nguyen Thi Minh Khai, center",
    tips: ["Try hot soy milk & bánh tráng nướng", "Bargain politely for souvenirs", "Busiest on weekends"],
    budget: "low",
    suitableFor: ["Solo", "Friends", "Family"],
    distanceKm: 0.5,
    latitude: 11.9403,
    longitude: 108.4368,
  },
  {
    id: "domaine-de-marie",
    name: "Domaine de Marie Church",
    category: "Photo Spot",
    description: "A pink-hued French colonial church surrounded by gardens and pines.",
    longDescription: "A striking pink French colonial church from the 1940s, set in tranquil gardens. A favorite golden-hour photo spot for couples.",
    image: domaineMarie,
    bestTime: "Late afternoon",
    cost: "Free",
    rating: 4.5,
    address: "Ngo Quyen, ~2km from center",
    tips: ["Golden hour light is best", "Respect quiet during services", "Combine with nearby cafes"],
    budget: "low",
    suitableFor: ["Couple", "Solo"],
    distanceKm: 2,
    latitude: 11.9468,
    longitude: 108.4266,
  },
  {
    id: "tuyen-lam-lake", name: "Tuyen Lam Lake", category: "Nature",
    description: "A peaceful highland lake wrapped in pine forest, ideal for kayaking and picnics.",
    longDescription: "Da Lat's largest freshwater lake offers quiet coves, pine-covered hills and a calm escape just south of the city.",
    image: xuanHuong, bestTime: "Early morning", cost: "Free", rating: 4.7,
    address: "Ward 4, about 6 km from center", tips: ["Kayak before 9am", "Pack a light picnic", "Combine with Truc Lam Pagoda"],
    budget: "low", suitableFor: ["Couple", "Family", "Friends"], distanceKm: 6, latitude: 11.9035, longitude: 108.4317,
  },
  {
    id: "truc-lam-pagoda", name: "Truc Lam Zen Monastery", category: "Local Culture",
    description: "A serene hilltop monastery overlooking Tuyen Lam Lake and manicured gardens.",
    image: domaineMarie, bestTime: "Morning", cost: "Free", rating: 4.6,
    address: "Truc Lam Yen Tu Street", tips: ["Dress respectfully", "Keep voices low", "Take the cable car for panoramic views"],
    budget: "low", suitableFor: ["Solo", "Couple", "Family"], distanceKm: 5, latitude: 11.9038, longitude: 108.4382,
  },
  {
    id: "crazy-house", name: "Crazy House", category: "Architecture",
    description: "A surreal maze of sculpted rooms, tree-like staircases and whimsical bridges.",
    image: nightMarket, bestTime: "Late morning", cost: "80,000 VND", rating: 4.4,
    address: "3 Huynh Thuc Khang", tips: ["Allow at least one hour", "Some stairways are narrow", "Visit early for cleaner photos"],
    budget: "medium", suitableFor: ["Solo", "Couple", "Family", "Friends"], distanceKm: 1.5, latitude: 11.9346, longitude: 108.4302,
  },
  {
    id: "dalat-railway-station", name: "Da Lat Railway Station", category: "Architecture",
    description: "An iconic Art Deco station with colorful glass windows and vintage rail cars.",
    image: cauDat, bestTime: "Morning", cost: "10,000 VND", rating: 4.4,
    address: "1 Quang Trung", tips: ["Check the Trai Mat train schedule", "Best facade light is before noon"],
    budget: "low", suitableFor: ["Solo", "Couple", "Family"], distanceKm: 2.5, latitude: 11.9417, longitude: 108.4545,
  },
  {
    id: "valley-of-love", name: "Valley of Love", category: "Nature",
    description: "Flower gardens, pine hills and lakeside paths designed for an easy half-day outing.",
    image: langbiang, bestTime: "Morning", cost: "250,000 VND", rating: 4.3,
    address: "7 Mai Anh Dao", tips: ["Weekdays are quieter", "Wear comfortable shoes", "Ticket includes several attractions"],
    budget: "high", suitableFor: ["Couple", "Family"], distanceKm: 5, latitude: 11.9793, longitude: 108.4499,
  },
  {
    id: "van-thanh-flower-village", name: "Van Thanh Flower Village", category: "Photo Spot",
    description: "Working greenhouses filled with roses, hydrangeas and seasonal Da Lat blooms.",
    image: domaineMarie, bestTime: "Early morning", cost: "40,000 VND", rating: 4.5,
    address: "Van Thanh, Ward 5", tips: ["Ask before entering working greenhouses", "Flowers change by season"],
    budget: "low", suitableFor: ["Solo", "Couple", "Friends"], distanceKm: 4, latitude: 11.9382, longitude: 108.4079,
  },
  {
    id: "elephant-waterfall", name: "Elephant Waterfall", category: "Nature",
    description: "A powerful waterfall reached by a rugged path through dramatic volcanic rock.",
    image: datanla, bestTime: "Late morning", cost: "20,000 VND", rating: 4.5,
    address: "Nam Ban, Lam Ha", tips: ["Paths can be slippery", "Bring rain protection", "Pair with Linh An Pagoda"],
    budget: "medium", suitableFor: ["Friends", "Couple"], distanceKm: 28, latitude: 11.8234, longitude: 108.3346,
  },
  {
    id: "traimat", name: "Trai Mat Village", category: "Local Culture",
    description: "A quiet farming village known for vegetable terraces, greenhouses and morning mist.",
    image: cauDat, bestTime: "Sunrise", cost: "Free", rating: 4.5,
    address: "Ward 11, Da Lat", tips: ["Take the heritage train", "Respect private farms", "Continue to Linh Phuoc Pagoda"],
    budget: "low", suitableFor: ["Solo", "Couple", "Friends"], distanceKm: 8, latitude: 11.9441, longitude: 108.5037,
  },
  {
    id: "linh-phuoc-pagoda", name: "Linh Phuoc Pagoda", category: "Local Culture",
    description: "Ngôi chùa khảm sành độc đáo với tháp chuông cao và các công trình mosaic tinh xảo.",
    image: domaineMarie, bestTime: "Buổi sáng", cost: "Miễn phí", rating: 4.7,
    address: "120 Tự Phước, Phường 11, Đà Lạt, Lâm Đồng", tips: ["Đi tàu cổ đến Trại Mát", "Ăn mặc lịch sự", "Dành khoảng 60–90 phút tham quan"],
    budget: "low", suitableFor: ["Solo", "Couple", "Family"], distanceKm: 8, latitude: 11.9445, longitude: 108.5206,
  },
  {
    id: "dalat-flower-garden", name: "Da Lat Flower Garden", category: "Photo Spot",
    description: "Vườn hoa lâu đời bên hồ Xuân Hương với nhiều giống hoa đặc trưng của cao nguyên.",
    image: cauDat, bestTime: "07:30–10:00", cost: "Khoảng 100,000 VND", rating: 4.3,
    address: "Trần Quốc Toản, Phường 8, Đà Lạt, Lâm Đồng", tips: ["Đi sớm để có ánh sáng đẹp", "Kiểm tra mùa hoa trước khi đi"],
    budget: "medium", suitableFor: ["Couple", "Family", "Friends"], distanceKm: 2, latitude: 11.9489, longitude: 108.4442,
  },
  {
    id: "clay-tunnel", name: "Da Lat Clay Tunnel", category: "Photo Spot",
    description: "Không gian điêu khắc đất sét ngoài trời kể câu chuyện hình thành và kiến trúc Đà Lạt.",
    image: catPhoto, bestTime: "Buổi sáng", cost: "Khoảng 120,000 VND", rating: 4.3,
    address: "Phường 4, Đà Lạt, Lâm Đồng", tips: ["Kết hợp tham quan hồ Tuyền Lâm", "Mang nón vì khu vực ngoài trời"],
    budget: "medium", suitableFor: ["Couple", "Family", "Friends"], distanceKm: 13, latitude: 11.8873, longitude: 108.4145,
  },
  {
    id: "pongour-waterfall", name: "Pongour Waterfall", category: "Nature",
    description: "Thác nước nhiều tầng hùng vĩ giữa rừng và những khối đá bazan rộng lớn.",
    image: datanla, bestTime: "09:00–14:00", cost: "Khoảng 20,000 VND", rating: 4.6,
    address: "Thôn Tân Nghĩa, xã Ninh Gia, Đức Trọng, Lâm Đồng", tips: ["Cách trung tâm khoảng 50 km", "Tránh đứng sát mép đá khi trời mưa", "Chuẩn bị nước uống"],
    budget: "medium", suitableFor: ["Couple", "Friends", "Family"], distanceKm: 50, latitude: 11.6694, longitude: 108.3652,
  },
  {
    id: "me-linh-coffee", name: "Me Linh Coffee Garden", category: "Cafe",
    description: "Quán cà phê nhìn xuống thung lũng và vườn cà phê, phù hợp cho một buổi sáng chậm rãi.",
    image: catCafes, bestTime: "07:00–10:00", cost: "Từ 60,000 VND", rating: 4.3,
    address: "Tổ 20, thôn 4, xã Tà Nung, Đà Lạt, Lâm Đồng", tips: ["Đi ngày trời quang để ngắm thung lũng", "Đường khá xa trung tâm"],
    budget: "medium", suitableFor: ["Solo", "Couple", "Friends"], distanceKm: 20, latitude: 11.9009, longitude: 108.3265,
  },
  {
    id: "fresh-garden", name: "Fresh Garden Da Lat", category: "Photo Spot",
    description: "Khu tham quan nhiều tiểu cảnh, vườn hoa và góc chụp ảnh trên sườn đồi.",
    image: catPhoto, bestTime: "Buổi sáng", cost: "Khoảng 120,000 VND", rating: 4.4,
    address: "90B Vạn Thành, Phường 5, Đà Lạt, Lâm Đồng", tips: ["Dành 1–2 giờ", "Đi ngày thường để tránh đông"],
    budget: "medium", suitableFor: ["Couple", "Family", "Friends"], distanceKm: 4, latitude: 11.9371, longitude: 108.3978,
  },
];

const placeTranslations: Record<string, Partial<Place>> = {
  "xuan-huong-lake": { name: "Hồ Xuân Hương", category: "Thiên nhiên", description: "Trái tim thơ mộng của Đà Lạt, lý tưởng để đi dạo và đạp vịt lúc bình minh.", longDescription: "Hồ nước hình lưỡi liềm giữa trung tâm Đà Lạt, bao quanh bởi hàng thông, vườn hoa và quán cà phê. Bạn có thể đi bộ buổi sáng hoặc đạp vịt khi hoàng hôn.", bestTime: "Bình minh / Hoàng hôn", cost: "Miễn phí", address: "Trung tâm Đà Lạt", tips: ["Đạp vịt vào lúc hoàng hôn", "Các quán cà phê gần hồ mở từ sáng sớm", "Phù hợp để chạy bộ buổi sáng"], suitableFor: ["Đi một mình", "Cặp đôi", "Gia đình"] },
  langbiang: { name: "Núi Langbiang", category: "Thiên nhiên", description: "Đỉnh núi biểu tượng với tầm nhìn rộng ra rừng thông và biển mây.", longDescription: "Langbiang cao 2.167 m, là một trong những nơi săn mây nổi tiếng gần Đà Lạt. Bạn có thể đi xe jeep lên đỉnh Radar để ngắm cảnh.", bestTime: "Sáng sớm", address: "Lạc Dương, cách trung tâm khoảng 12 km", tips: ["Có thể đi xe jeep lên đỉnh Radar", "Mang áo khoác vì trên đỉnh nhiều gió", "Kiểm tra thời tiết trước khi săn mây"], suitableFor: ["Bạn bè", "Cặp đôi", "Gia đình"] },
  "cau-dat": { name: "Đồi chè Cầu Đất", category: "Điểm chụp ảnh", description: "Những luống chè xanh trải dài bên nhà máy chè hơn trăm năm tuổi.", longDescription: "Các đồi chè xanh và sương sớm biến Cầu Đất thành một trong những cảnh quan được yêu thích nhất Đà Lạt.", bestTime: "Buổi sáng", address: "Xuân Trường, cách trung tâm khoảng 25 km", tips: ["Đi sớm để tránh đông", "Phù hợp chụp ảnh chân dung", "Thử trà ô long tại địa phương"], suitableFor: ["Cặp đôi", "Bạn bè"] },
  datanla: { name: "Thác Datanla", category: "Thiên nhiên", description: "Thác nước nhiều tầng với máng trượt xuyên rừng thông.", longDescription: "Datanla là cụm thác nhiều tầng, nổi bật với hệ thống máng trượt và các hoạt động ngoài trời phù hợp gia đình.", bestTime: "Cuối buổi sáng", address: "Đèo Prenn, cách trung tâm khoảng 7 km", tips: ["Thử máng trượt xuyên rừng", "Mang giày có độ bám tốt", "Nên tránh cuối tuần nếu có thể"], suitableFor: ["Gia đình", "Bạn bè"] },
  "night-market": { name: "Chợ đêm Đà Lạt", category: "Văn hóa địa phương", description: "Ẩm thực đường phố, sữa đậu nành, đồ nướng và không khí nhộn nhịp về đêm.", longDescription: "Chợ đêm Đà Lạt sôi động với các quầy đồ ăn, sữa đậu nành nóng, món nướng và khu mua sắm trong tiết trời se lạnh.", bestTime: "Buổi tối", cost: "Vào cửa miễn phí", address: "Nguyễn Thị Minh Khai, trung tâm Đà Lạt", tips: ["Thử sữa đậu nành nóng và bánh tráng nướng", "Hỏi giá trước khi mua", "Cuối tuần thường rất đông"], suitableFor: ["Đi một mình", "Bạn bè", "Gia đình"] },
  "domaine-de-marie": { name: "Nhà thờ Domaine de Marie", category: "Điểm chụp ảnh", description: "Nhà thờ màu hồng mang kiến trúc Pháp giữa khu vườn và rừng thông.", longDescription: "Công trình kiến trúc Pháp từ thập niên 1940 nổi bật với sắc hồng và khuôn viên yên tĩnh.", bestTime: "Cuối buổi chiều", cost: "Miễn phí", address: "Ngô Quyền, cách trung tâm khoảng 2 km", tips: ["Ánh sáng cuối chiều đẹp nhất", "Giữ yên lặng trong giờ lễ", "Có thể kết hợp ghé các quán cà phê gần đó"], suitableFor: ["Cặp đôi", "Đi một mình"] },
  "tuyen-lam-lake": { name: "Hồ Tuyền Lâm", category: "Thiên nhiên", description: "Hồ nước yên bình giữa rừng thông, phù hợp chèo thuyền và dã ngoại.", longDescription: "Hồ nước ngọt lớn với những vịnh nhỏ, đồi thông và không gian tách biệt phía nam thành phố.", bestTime: "Sáng sớm", cost: "Miễn phí", address: "Phường 4, cách trung tâm khoảng 6 km", tips: ["Chèo thuyền trước 9 giờ", "Chuẩn bị đồ ăn nhẹ", "Kết hợp ghé Thiền viện Trúc Lâm"], suitableFor: ["Cặp đôi", "Gia đình", "Bạn bè"] },
  "truc-lam-pagoda": { name: "Thiền viện Trúc Lâm", category: "Văn hóa địa phương", description: "Thiền viện yên tĩnh trên đồi nhìn xuống hồ Tuyền Lâm và những khu vườn xanh.", bestTime: "Buổi sáng", cost: "Miễn phí", address: "Đường Trúc Lâm Yên Tử", tips: ["Ăn mặc lịch sự", "Giữ giọng nói nhỏ", "Có thể đi cáp treo để ngắm toàn cảnh"], suitableFor: ["Đi một mình", "Cặp đôi", "Gia đình"] },
  "crazy-house": { name: "Biệt thự Hằng Nga", category: "Kiến trúc", description: "Mê cung kiến trúc siêu thực với cầu nhỏ, cầu thang và những căn phòng độc đáo.", bestTime: "Cuối buổi sáng", address: "3 Huỳnh Thúc Kháng", tips: ["Dành ít nhất một giờ tham quan", "Một số cầu thang khá hẹp", "Đi sớm để dễ chụp ảnh"], suitableFor: ["Đi một mình", "Cặp đôi", "Gia đình", "Bạn bè"] },
  "dalat-railway-station": { name: "Ga Đà Lạt", category: "Kiến trúc", description: "Nhà ga Art Deco nổi tiếng với kính màu và những toa tàu cổ.", bestTime: "Buổi sáng", address: "1 Quang Trung", tips: ["Kiểm tra lịch tàu đi Trại Mát", "Mặt tiền có ánh sáng đẹp trước buổi trưa"], suitableFor: ["Đi một mình", "Cặp đôi", "Gia đình"] },
  "valley-of-love": { name: "Thung lũng Tình Yêu", category: "Thiên nhiên", description: "Vườn hoa, đồi thông và lối đi ven hồ phù hợp cho chuyến tham quan nửa ngày.", bestTime: "Buổi sáng", address: "7 Mai Anh Đào", tips: ["Ngày thường ít đông hơn", "Mang giày thoải mái", "Kiểm tra các dịch vụ bao gồm trong vé"], suitableFor: ["Cặp đôi", "Gia đình"] },
  "van-thanh-flower-village": { name: "Làng hoa Vạn Thành", category: "Điểm chụp ảnh", description: "Những nhà kính trồng hoa hồng, cẩm tú cầu và nhiều giống hoa theo mùa.", bestTime: "Sáng sớm", address: "Vạn Thành, Phường 5", tips: ["Xin phép trước khi vào nhà kính sản xuất", "Các loại hoa thay đổi theo mùa"], suitableFor: ["Đi một mình", "Cặp đôi", "Bạn bè"] },
  "elephant-waterfall": { name: "Thác Voi", category: "Thiên nhiên", description: "Thác nước mạnh giữa những khối đá bazan và lối đi khá thử thách.", bestTime: "Cuối buổi sáng", address: "Nam Ban, Lâm Hà", tips: ["Lối đi có thể trơn", "Chuẩn bị áo mưa", "Kết hợp ghé chùa Linh Ẩn"], suitableFor: ["Bạn bè", "Cặp đôi"] },
  traimat: { name: "Làng Trại Mát", category: "Văn hóa địa phương", description: "Khu làng nông nghiệp yên bình với ruộng rau, nhà kính và sương sớm.", bestTime: "Bình minh", cost: "Miễn phí", address: "Phường 11, Đà Lạt", tips: ["Đi tàu cổ từ ga Đà Lạt", "Tôn trọng khu vực canh tác riêng", "Kết hợp ghé chùa Linh Phước"], suitableFor: ["Đi một mình", "Cặp đôi", "Bạn bè"] },
};

const categoryVi: Record<string, string> = { Nature: "Thiên nhiên", "Photo Spot": "Điểm chụp ảnh", "Local Culture": "Văn hóa địa phương", Architecture: "Kiến trúc", Cafe: "Quán cà phê" };
const suitableVi: Record<string, string> = { Solo: "Đi một mình", Couple: "Cặp đôi", Family: "Gia đình", Friends: "Bạn bè" };
export const places: Place[] = rawPlaces.map((place) => {
  const translated = { ...place, ...placeTranslations[place.id] };
  return { ...translated, category: categoryVi[translated.category] || translated.category, suitableFor: translated.suitableFor?.map((item) => suitableVi[item] || item) };
});

const rawFoods: FoodItem[] = [
  { id: "lau-ga-la-e", name: "Lẩu gà lá é Tao Ngộ", category: "Hotpot", description: "Lẩu gà nước dùng thanh, lá é thơm cay nhẹ, phù hợp cho nhóm 2–4 người.", image: foodLauga, price: "250k–400k", venue: "Lẩu gà lá é Tao Ngộ", address: "10 Bis Đường 3 Tháng 4, Phường 3, Đà Lạt" },
  { id: "banh-can", name: "Bánh căn Lệ", category: "Local Food", description: "Bánh căn nóng với trứng, xíu mại và nước chấm hành mỡ.", image: foodBanhcan, price: "35k–65k", venue: "Bánh căn Lệ", address: "27/44 Yersin, Phường 10, Đà Lạt" },
  { id: "sua-dau-nanh", name: "Sữa đậu nành Hoa Sữa", category: "Dessert", description: "Sữa đậu nành nóng dùng cùng bánh ngọt trong tiết trời se lạnh.", image: foodSuadau, price: "15k–30k", venue: "Sữa đậu nành Hoa Sữa", address: "64 Tăng Bạt Hổ, Phường 1, Đà Lạt" },
  { id: "grilled", name: "Khu đồ nướng Chợ đêm", category: "Grilled Food", description: "Xiên nướng, bắp nướng và nhiều món ăn đường phố phục vụ buổi tối.", image: foodGrilled, price: "20k–80k", venue: "Chợ đêm Đà Lạt", address: "Nguyễn Thị Minh Khai, Phường 1, Đà Lạt" },
  { id: "mountain-coffee", name: "Mê Linh Coffee Garden", category: "Coffee Shops", description: "Cà phê nhìn xuống thung lũng và vườn cà phê ở khu vực Tà Nung.", image: foodCoffee, price: "50k–90k", venue: "Mê Linh Coffee Garden", address: "Tổ 20, Thôn 4, Xã Tà Nung, Đà Lạt" },
  { id: "nem-nuong-ba-hung", name: "Nem nướng Bà Hùng", category: "Local Food", description: "Nem nướng cuốn bánh tráng, rau tươi và nước chấm đậu phộng đặc trưng.", image: foodNemNuongV2, price: "50k–70k", venue: "Nem nướng Bà Hùng", address: "328 Phan Đình Phùng, Phường 2, Đà Lạt" },
  { id: "banh-can-nha-chung", name: "Bánh căn Nhà Chung", category: "Local Food", description: "Bánh căn nóng với trứng, xíu mại và chén nước chấm hành mỡ.", image: foodBanhcan, price: "35k–60k", venue: "Bánh căn Nhà Chung", address: "Khu Nhà Chung, Phường 3, Đà Lạt" },
  { id: "lau-bo-ba-toa", name: "Lẩu bò Quán Gỗ Ba Toa", category: "Hotpot", description: "Nồi lẩu bò nóng với thịt, gân, rau và mì, hợp với buổi tối se lạnh.", image: foodLauBo, price: "250k–400k", venue: "Lẩu bò Quán Gỗ Ba Toa", address: "1/29 Hoàng Diệu, Phường 5, Đà Lạt" },
  { id: "banh-mi-xiu-mai", name: "Bánh mì xíu mại Bé Linh", category: "Local Food", description: "Bánh mì giòn dùng cùng chén xíu mại nóng, da heo và nước dùng thanh.", image: foodBanhMiXiuMai, price: "25k–45k", venue: "Bánh mì xíu mại Bé Linh", address: "37 Hoàng Diệu, Phường 5, Đà Lạt" },
  { id: "banh-beo-so-4", name: "Bánh bèo số 4 Bà Hường", category: "Local Food", description: "Bánh bèo mềm phủ tôm thịt, da heo giòn và nước mắm pha.", image: foodBanhBeo, price: "35k–55k", venue: "Bánh bèo số 4 Bà Hường", address: "282 Phan Đình Phùng, Phường 2, Đà Lạt" },
  { id: "kem-bo-thanh-thao", name: "Kem bơ Thanh Thảo", category: "Dessert", description: "Bơ xay béo mịn kết hợp viên kem dừa mát lạnh.", image: foodKemBo, price: "25k–40k", venue: "Kem bơ Thanh Thảo", address: "76 Nguyễn Văn Trỗi, Phường 2, Đà Lạt" },
  { id: "banh-trang-nuong", name: "Bánh tráng nướng Dì Đinh", category: "Grilled Food", description: "Bánh tráng nướng giòn với trứng, hành và nhiều loại topping.", image: foodBanhTrangNuong, price: "20k–40k", venue: "Bánh tráng nướng Dì Đinh", address: "26 Hoàng Diệu, Phường 5, Đà Lạt" },
  { id: "artichoke-tea", name: "Trà atisô L'angfarm", category: "Coffee Shops", description: "Thức uống thanh nhẹ từ đặc sản atisô của vùng cao nguyên.", image: foodTraAtiso, price: "30k–60k", venue: "L'angfarm Store", address: "6 Nguyễn Thị Minh Khai, Phường 1, Đà Lạt" },
];

const foodCategoryVi: Record<string, string> = { Hotpot: "Lẩu", "Local Food": "Món địa phương", Dessert: "Tráng miệng", "Grilled Food": "Món nướng", "Coffee Shops": "Quán cà phê" };
export const foods: FoodItem[] = rawFoods.map((food) => ({ ...food, category: foodCategoryVi[food.category] || food.category }));

export const homestays: Homestay[] = [
  { id: "the-kupid", name: "The Kupid Homestay", price: "Từ 400.000đ/đêm", location: "Phường 3", suitableFor: "Cặp đôi", rating: 4.5, description: "Phòng kính nhìn đồi thông, không gian lãng mạn và cách trung tâm khoảng 3 km.", image: hsTheKupid, address: "47 Đặng Thái Thân, Phường 3, Đà Lạt", imageSource: "https://lamdongtours.com/khach-san-da-lat/the-kupid-dalat-no-single/" },
  { id: "dalat-lacasa", name: "Dalat Lacasa Homestay", price: "Từ 350.000đ/đêm", location: "Phường 10", suitableFor: "Cặp đôi", rating: 4.6, description: "Không gian ấm cúng, thiết kế nhẹ nhàng và thuận tiện di chuyển vào trung tâm.", image: hsLacasa, address: "10 Khe Sanh, Phường 10, Đà Lạt", imageSource: "https://focusasiatravel.com/review-dalat-lacasa-homestay/" },
  { id: "doi-mot-nguoi", name: "Đợi Một Người Homestay", price: "Từ 850.000đ/đêm", location: "Đèo Prenn", suitableFor: "Cặp đôi", rating: 4.5, description: "Nổi bật với quán cà phê nhà kính giữa hồ và không gian yên tĩnh bên sườn đồi.", image: hsDoiMotNguoi, address: "Tổ 65, Đường Đèo Prenn, Phường 3, Đà Lạt", imageSource: "https://hdvlocal.com/products/doi-mot-nguoi-homestay-da-lat" },
  { id: "la-nha", name: "Là Nhà Homestay", price: "Từ 300.000đ/đêm", location: "Phường 5", suitableFor: "Bạn bè", rating: 4.4, description: "Ngôi nhà phong cách vintage với sân vườn chung, phù hợp nhóm bạn và khách thích giao lưu.", image: hsLaNha, address: "77 Hoàng Diệu, Phường 5, Đà Lạt", imageSource: "https://kenhhomestay.com/la-nha-homestay/" },
  { id: "cui-homestay", name: "Củi Homestay", price: "Từ 300.000đ/đêm", location: "Phường 3", suitableFor: "Cặp đôi", rating: 4.4, description: "Những căn phòng gỗ mộc mạc nằm trong khu vườn xanh, không gian gần gũi và riêng tư.", image: hsCui, address: "79 Triệu Việt Vương, Phường 3, Đà Lạt", imageSource: "https://mia.vn/cam-nang-du-lich/da-lat-cui-homestay-tha-hon-vao-nhung-mau-sac-thuan-khiet-nhat-cua-thien-nhien-5856" },
  { id: "nha-gio", name: "Nhà Gió Homestay", price: "Từ 180.000đ/đêm", location: "Phường 6", suitableFor: "Đi một mình", rating: 4.3, description: "Lựa chọn tiết kiệm với phòng riêng và phòng dorm, phù hợp khách trẻ và nhóm nhỏ.", image: hsNhaGio, address: "50 Nguyễn An Ninh, Phường 6, Đà Lạt", imageSource: "https://kenhhomestay.com/nha-gio-homestay/" },
  { id: "homefarm", name: "HomeFarm Homestay", price: "Từ 300.000đ/đêm", location: "Phường 4", suitableFor: "Gia đình", rating: 4.4, description: "Nhà gỗ giữa vườn cây, có khu sinh hoạt chung và không gian nghỉ ngơi yên tĩnh.", image: hsHomefarm, address: "12A/17 Triệu Việt Vương, Phường 4, Đà Lạt", imageSource: "https://agotourist.com/homestay-homefarm-da-lat/" },
  { id: "leng-keng", name: "LengKeng Da Lat Homestay", price: "Từ 500.000đ/đêm", location: "Phường 10", suitableFor: "Cặp đôi", rating: 4.6, description: "Phòng nhìn thung lũng, nhiều góc ngắm bình minh và không gian cà phê thư giãn.", image: hsLengkeng, address: "57/4 Hoàng Hoa Thám, Phường 10, Đà Lạt", imageSource: "https://agotourist.com/lengkeng-homestay-da-lat/" },
  { id: "the-circle", name: "The Circle Vietnam Homestay", price: "Từ 250.000đ/đêm", location: "Phường 3", suitableFor: "Bạn bè", rating: 4.3, description: "Khu lưu trú trẻ trung với nhiều loại phòng, sân chung và tầm nhìn thoáng về phía thành phố.", image: hsTheCircle, address: "233 Đặng Thái Thân, Phường 3, Đà Lạt", imageSource: "https://dalatreview.vn/the-circle-vietnam-homestay-thien-nhien-da-lat.html" },
  { id: "teepee", name: "Dalat Teepee Homestay", price: "Từ 400.000đ/đêm", location: "Phường 4", suitableFor: "Bạn bè", rating: 4.4, description: "Không gian xanh, phòng nghỉ mang phong cách cắm trại và phù hợp nhóm khách trẻ.", image: hsTeepee, address: "54 Ngô Thì Sỹ, Phường 4, Đà Lạt", imageSource: "https://homestay.review/ghe-tham-dalat-teepee-homestay-khu-nha-leu-go-doc-dao-day-tho-mong.html" },
];

export const initialSavedTrips: SavedTrip[] = [
  { id: "trip-1", name: "Cuối tuần săn mây", days: 3, budget: "Trung bình", travelType: "Cặp đôi", createdAt: "2026-05-18" },
  { id: "trip-2", name: "Hành trình ẩm thực", days: 2, budget: "Tiết kiệm", travelType: "Bạn bè", createdAt: "2026-06-01" },
];

// Local storage key for saved trips (replace with API later)
export const SAVED_TRIPS_KEY = "traveldalat_saved_trips";
