import type { PlannerPreferences } from "@/lib/itinerary";
export type DalatMood = { id: string; title: string; subtitle: string; description: string; image: string; placeIds: string[]; preferences: Partial<PlannerPreferences> };
export const dalatMoods: DalatMood[] = [
  { id: "slow", title: "Một ngày đi chậm", subtitle: "Hồ xanh · cà phê · không vội", description: "Dành thời gian ngắm hồ, ngồi cà phê và thảnh thơi giữa thiên nhiên. Ít điểm dừng để có nhiều khoảng nghỉ.", image: "/images/verified/tuyen-lam-lake.jpg", placeIds: ["tuyen-lam-lake", "tui-mo-to"], preferences: { days: "2 ngày", pace: 3, startTime: "08:00", endTime: "20:30", interests: ["quán cà phê", "thiên nhiên", "địa điểm lãng mạn"] } },
  { id: "heritage", title: "Hẹn với Đà Lạt xưa", subtitle: "Nhà ga · kiến trúc · câu chuyện", description: "Theo dấu những công trình quen thuộc, ghé nhà ga và khám phá nét kiến trúc riêng của phố núi.", image: "/images/verified/dalat-railway-station.jpg", placeIds: ["dalat-railway-station", "bao-dai-palace", "dalat-cathedral"], preferences: { days: "1 ngày", pace: 4, startTime: "08:00", endTime: "20:30", interests: ["văn hóa địa phương", "chụp ảnh"] } },
  { id: "clouds", title: "Đi tìm bình minh", subtitle: "Dậy sớm · Cầu Đất · Trại Mát", description: "Khởi hành trước khi phố thức giấc, hướng về Cầu Đất rồi trở lại Trại Mát. Kiểm tra thời tiết trước chuyến đi; không phải sáng nào cũng có mây.", image: "/images/verified/cau-dat.jpg", placeIds: ["cau-dat", "linh-phuoc-pagoda"], preferences: { days: "1 ngày", pace: 3, startTime: "04:00", endTime: "18:00", interests: ["săn mây", "thiên nhiên", "chụp ảnh"] } },
];
export const getMoodPreferences = (id: string | null): Partial<PlannerPreferences> => {
  const mood = dalatMoods.find((item) => item.id === id);
  return mood ? { ...mood.preferences, selectedIds: [...mood.placeIds] } : {};
};
