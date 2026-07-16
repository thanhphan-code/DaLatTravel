export type WeatherData = {
  current: { temperature_2m: number; apparent_temperature: number; weather_code: number; wind_speed_10m: number };
  daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max: number[] };
};

export async function getWeather(latitude = 11.9404, longitude = 108.4583): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(latitude), longitude: String(longitude),
    current: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "Asia/Bangkok", forecast_days: "5",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error("Không thể tải dữ liệu thời tiết");
  return response.json();
}

export function weatherLabel(code: number) {
  if (code === 0) return "Trời quang";
  if (code <= 3) return "Có mây";
  if (code <= 48) return "Có sương mù";
  if (code <= 67) return "Có mưa";
  if (code <= 77) return "Mưa tuyết";
  if (code <= 82) return "Mưa rào";
  return "Có dông";
}
