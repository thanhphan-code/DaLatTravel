export type ReviewEvidence = {
  platform: string;
  url: string;
  rating: number;
  count: number;
  checkedAt: string;
};
export type PlanningInfo = {
  duration: number;
  open: number;
  close: number;
  area: string;
  interests: string[];
  hoursSource?: string;
  review?: ReviewEvidence;
  note?: string;
};
const operator = "https://dalattourist.com.vn/diem-den/";
// Unsourced windows are conservative planning windows, not verified business hours.
export const planningInfo: Record<string, PlanningInfo> = {
  "lam-vien-square": { duration: 45, open: 360, close: 1260, area: "Trung tâm", interests: ["chụp ảnh", "địa điểm lãng mạn"] },
  "bao-dai-palace": { duration: 90, open: 480, close: 990, area: "Trung tâm", interests: ["văn hóa địa phương", "chụp ảnh"] },
  "dalat-cathedral": { duration: 45, open: 480, close: 1020, area: "Trung tâm", interests: ["văn hóa địa phương", "chụp ảnh"], note: "Lịch tính tham quan bên ngoài. Không vào thánh đường khi đang hành lễ; hỏi giờ đón khách trước khi đi." },
  "lam-dong-museum": { duration: 90, open: 450, close: 1050, area: "Trung tâm", interests: ["văn hóa địa phương"], hoursSource: "https://baotanglamdong.com.vn/" },
  "xuan-huong-lake": {
    duration: 60,
    open: 360,
    close: 1200,
    area: "Trung tâm",
    interests: ["thiên nhiên", "địa điểm lãng mạn"],
  },
  langbiang: {
    duration: 150,
    open: 450,
    close: 1020,
    area: "Lạc Dương",
    interests: ["thiên nhiên", "chụp ảnh"],
    hoursSource: operator,
    note: "Giờ mở cửa 07:30; không xếp săn mây trước bình minh tại đây. Thời lượng gồm chờ xe jeep, chưa gồm trekking lên đỉnh.",
  },
  "cau-dat": {
    duration: 90,
    open: 300,
    close: 1020,
    area: "Cầu Đất – Trại Mát",
    interests: ["săn mây", "chụp ảnh", "thiên nhiên"],
    note: "Muốn săn mây cần tới khoảng 05:00–06:30; kiểm tra điểm đón, thời tiết và quyền vào khu vực trước chuyến đi.",
  },
  datanla: {
    duration: 120,
    open: 450,
    close: 990,
    area: "Tuyền Lâm – Prenn",
    interests: ["thiên nhiên"],
    hoursSource: operator,
    note: "07:30–16:30 theo đơn vị vận hành. Chưa gồm thời gian chơi zipline hoặc canyoning; đặt riêng nếu tham gia.",
  },
  "night-market": {
    duration: 75,
    open: 1080,
    close: 1290,
    area: "Trung tâm",
    interests: ["ẩm thực", "văn hóa địa phương"],
  },
  "domaine-de-marie": {
    duration: 60,
    open: 480,
    close: 1020,
    area: "Trung tâm",
    interests: ["chụp ảnh", "văn hóa địa phương"],
  },
  "tuyen-lam-lake": {
    duration: 90,
    open: 360,
    close: 1050,
    area: "Tuyền Lâm – Prenn",
    interests: ["thiên nhiên", "địa điểm lãng mạn"],
  },
  "truc-lam-pagoda": {
    duration: 60,
    open: 450,
    close: 990,
    area: "Tuyền Lâm – Prenn",
    interests: ["văn hóa địa phương", "thiên nhiên"],
  },
  "crazy-house": {
    duration: 90,
    open: 510,
    close: 1020,
    area: "Trung tâm",
    interests: ["chụp ảnh", "văn hóa địa phương"],
  },
  "dalat-railway-station": {
    duration: 60,
    open: 420,
    close: 1020,
    area: "Trung tâm",
    interests: ["chụp ảnh", "văn hóa địa phương"],
    hoursSource:
      "https://www.trip.com/travel-guide/attraction/dalat/dalat-railway-station-84874/",
    review: {
      platform: "Trip.com",
      url: "https://www.trip.com/travel-guide/attraction/dalat/dalat-railway-station-84874/",
      rating: 4.2,
      count: 265,
      checkedAt: "2026-11-21",
    },
    note: "Chỉ tính tham quan ga; đi tàu Trại Mát cần kiểm tra chuyến và thêm thời gian riêng.",
  },
  "valley-of-love": {
    duration: 180,
    open: 480,
    close: 1020,
    area: "Phía Bắc",
    interests: ["địa điểm lãng mạn", "thiên nhiên"],
  },
  "van-thanh-flower-village": {
    duration: 75,
    open: 480,
    close: 990,
    area: "Tà Nung – Vạn Thành",
    interests: ["chụp ảnh", "thiên nhiên"],
  },
  "elephant-waterfall": {
    duration: 90,
    open: 480,
    close: 990,
    area: "Nam Ban",
    interests: ["thiên nhiên"],
    note: "Cần xác nhận tình trạng mở cửa và lối xuống thác trước khi đi; không tự động đưa vào lịch.",
  },
  traimat: {
    duration: 60,
    open: 420,
    close: 1020,
    area: "Cầu Đất – Trại Mát",
    interests: ["văn hóa địa phương", "chụp ảnh"],
  },
  "linh-phuoc-pagoda": {
    duration: 75,
    open: 480,
    close: 990,
    area: "Cầu Đất – Trại Mát",
    interests: ["văn hóa địa phương", "chụp ảnh"],
  },
  "dalat-flower-garden": {
    duration: 90,
    open: 480,
    close: 1020,
    area: "Trung tâm",
    interests: ["chụp ảnh", "địa điểm lãng mạn"],
  },
  "clay-tunnel": {
    duration: 90,
    open: 480,
    close: 990,
    area: "Tuyền Lâm – Prenn",
    interests: ["chụp ảnh"],
  },
  "pongour-waterfall": {
    duration: 120,
    open: 480,
    close: 990,
    area: "Đức Trọng",
    interests: ["thiên nhiên"],
  },
  "me-linh-coffee": {
    duration: 75,
    open: 480,
    close: 1020,
    area: "Tà Nung – Vạn Thành",
    interests: ["quán cà phê", "chụp ảnh"],
  },
  "fresh-garden": {
    duration: 90,
    open: 480,
    close: 990,
    area: "Tà Nung – Vạn Thành",
    interests: ["chụp ảnh", "thiên nhiên"],
  },
  "tui-mo-to": {
    duration: 90,
    open: 480,
    close: 1260,
    area: "Cầu Đất – Trại Mát",
    interests: ["quán cà phê", "địa điểm lãng mạn", "chụp ảnh"],
    review: {
      platform: "Tripadvisor",
      url: "https://www.tripadvisor.com.vn/Restaurant_Review-g293922-d21141976-Reviews-Tiem_Ca_Phe_Tui_Mo_To-Da_Lat_Lam_Dong_Province.html",
      rating: 4.6,
      count: 49,
      checkedAt: "2026-11-21",
    },
    note: "Hồ sơ Tripadvisor ghi đóng cửa 21:30; cửa sổ lập lịch giới hạn đến 21:00. Kiểm tra lại giờ mở và đường vào hẻm.",
  },
};
