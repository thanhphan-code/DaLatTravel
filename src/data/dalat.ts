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
import hsPine from "@/assets/homestays/pine-cabin.jpg";
import hsCloud from "@/assets/homestays/cloud-house.jpg";
import hsGarden from "@/assets/homestays/garden-villa.jpg";
import hsMoss from "@/assets/homestays/moss-studio.jpg";

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
};

export type FoodItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: string;
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
  { slug: "cloud-hunting", name: "Cloud Hunting", description: "Chase the famous sea of clouds at sunrise from Da Lat's highest peaks.", image: langbiang },
  { slug: "cafes", name: "Cafes", description: "Cozy hillside cafes with pine forest and lake views.", image: catCafes },
  { slug: "photo-spots", name: "Photo Spots", description: "Flower gardens, tea hills, and pastel corners perfect for your camera.", image: catPhoto },
  { slug: "nature", name: "Nature Attractions", description: "Waterfalls, lakes, and pine forests surrounding the city.", image: datanla },
  { slug: "local-food", name: "Local Food", description: "Signature Da Lat dishes: hotpot, bánh căn, nem nướng and more.", image: foodLauga },
  { slug: "homestays", name: "Homestays", description: "Charming wooden cabins and boutique stays in the pines.", image: hsPine },
];

export const places: Place[] = [
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
  },
];

export const foods: FoodItem[] = [
  { id: "lau-ga-la-e", name: "Lẩu gà lá é", category: "Hotpot", description: "Signature Da Lat chicken hotpot with fragrant basil leaves.", image: foodLauga, price: "180k / pot" },
  { id: "banh-can", name: "Bánh căn", category: "Local Food", description: "Mini rice cakes topped with egg, served with fish sauce.", image: foodBanhcan, price: "40k" },
  { id: "nem-nuong", name: "Nem nướng", category: "Grilled Food", description: "Grilled pork sausage rolls with fresh herbs and rice paper.", image: foodNemnuong, price: "60k" },
  { id: "sua-dau-nanh", name: "Sữa đậu nành nóng", category: "Dessert", description: "Warm soy milk perfect for cold Da Lat nights.", image: foodSuadau, price: "15k" },
  { id: "grilled", name: "Grilled Skewers", category: "Grilled Food", description: "Sizzling street-side grilled meats and rice paper snacks.", image: foodGrilled, price: "50k" },
  { id: "mountain-coffee", name: "Coffee with Mountain View", category: "Coffee Shops", description: "Slow drip coffee on a hillside terrace above the clouds.", image: foodCoffee, price: "55k" },
];

export const homestays: Homestay[] = [
  { id: "pine-cabin", name: "Pine Cabin Retreat", price: "$$", location: "Trai Mat", suitableFor: "Couple", rating: 4.8, description: "Wooden A-frame cabin tucked in the pine forest with a private balcony.", image: hsPine },
  { id: "cloud-house", name: "Cloud House Da Lat", price: "$$$", location: "Cau Dat", suitableFor: "Friends", rating: 4.7, description: "Panoramic glass villa above the tea hills, sunrise cloud sea guaranteed.", image: hsCloud },
  { id: "garden-villa", name: "Flower Garden Villa", price: "$$", location: "Central", suitableFor: "Family", rating: 4.6, description: "Colorful family homestay with hydrangea garden and breakfast included.", image: hsGarden },
  { id: "moss-studio", name: "Moss Studio", price: "$", location: "Ward 4", suitableFor: "Solo", rating: 4.5, description: "Minimal, plant-filled studio ideal for a quiet solo retreat.", image: hsMoss },
];

export const initialSavedTrips: SavedTrip[] = [
  { id: "trip-1", name: "Cloud Hunting Weekend", days: 3, budget: "Medium", travelType: "Couple", createdAt: "2026-05-18" },
  { id: "trip-2", name: "Foodie Escape", days: 2, budget: "Low", travelType: "Friends", createdAt: "2026-06-01" },
];

// Local storage key for saved trips (replace with API later)
export const SAVED_TRIPS_KEY = "traveldalat_saved_trips";
