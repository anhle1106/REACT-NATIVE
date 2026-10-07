export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  isCurrentLocation?: boolean;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  isDay: boolean;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  surfacePressure: number;
  precipitation: number;
  visibilityKm: number;
  uvIndex: number;
  time: string;
}

export interface HourlyForecastItem {
  time: string; // ISO string
  displayTime: string; // e.g. "14:00" or "Bây giờ"
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  uvIndex: number;
}

export interface DailyForecastItem {
  date: string; // "2026-10-07"
  dayName: string; // "Hôm nay", "Thứ 5", "T6", ...
  displayDate: string; // "07/10"
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  location: LocationInfo;
  current: CurrentWeather;
  hourly: HourlyForecastItem[]; // 24 hours
  daily: DailyForecastItem[];   // 7 days
  lastUpdated: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'ms';

export interface AppSettings {
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  autoRefresh: boolean;
}

export type WeatherTab = 'forecast' | 'search' | 'metrics' | 'settings';
