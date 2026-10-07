import {
  Coordinates,
  CurrentWeather,
  DailyForecastItem,
  HourlyForecastItem,
  LocationInfo,
  WeatherData,
} from '../types/weather';
import { formatDayOfWeek, formatIsoHour } from '../utils/formatters';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Gọi API Open-Meteo để lấy dự báo thời tiết thực tế
 */
export const fetchWeatherData = async (
  location: LocationInfo,
): Promise<WeatherData> => {
  const { latitude, longitude } = location;

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'uv_index',
      'visibility',
      'surface_pressure',
      'wind_speed_10m',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
  });

  const url = `${BASE_URL}?${params.toString()}`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(
      `Không thể tải dữ liệu thời tiết (Mã lỗi HTTP: ${response.status})`,
    );
  }

  const data = await response.json();

  // 1. Phân tích dữ liệu hiện tại
  const cur = data.current || {};
  const daily = data.daily || {};
  const hourly = data.hourly || {};

  // Tìm vị trí giờ hiện tại trong mảng hourly để lấy uv_index và visibility
  const currentTimeIso = cur.time || new Date().toISOString();
  let currentHourIdx = 0;
  if (Array.isArray(hourly.time)) {
    const targetPrefix = currentTimeIso.substring(0, 13); // "YYYY-MM-DDTHH"
    const foundIdx = hourly.time.findIndex((t: string) =>
      t.startsWith(targetPrefix),
    );
    if (foundIdx !== -1) {
      currentHourIdx = foundIdx;
    }
  }

  const uvNow =
    hourly.uv_index && hourly.uv_index[currentHourIdx] !== undefined
      ? hourly.uv_index[currentHourIdx]
      : daily.uv_index_max && daily.uv_index_max[0] !== undefined
      ? daily.uv_index_max[0]
      : 3;

  const rawVisibility =
    hourly.visibility && hourly.visibility[currentHourIdx] !== undefined
      ? hourly.visibility[currentHourIdx]
      : 10000;
  const visibilityKm = Math.round((rawVisibility / 1000) * 10) / 10;

  const currentWeather: CurrentWeather = {
    temperature: Math.round((cur.temperature_2m ?? 25) * 10) / 10,
    apparentTemperature:
      Math.round((cur.apparent_temperature ?? cur.temperature_2m ?? 25) * 10) /
      10,
    tempMax:
      daily.temperature_2m_max && daily.temperature_2m_max[0] !== undefined
        ? Math.round(daily.temperature_2m_max[0])
        : Math.round(cur.temperature_2m ?? 25),
    tempMin:
      daily.temperature_2m_min && daily.temperature_2m_min[0] !== undefined
        ? Math.round(daily.temperature_2m_min[0])
        : Math.round((cur.temperature_2m ?? 25) - 3),
    weatherCode: cur.weather_code ?? 0,
    isDay: cur.is_day === 1,
    humidity: Math.round(cur.relative_humidity_2m ?? 65),
    windSpeed: Math.round((cur.wind_speed_10m ?? 10) * 10) / 10,
    windDirection: Math.round(cur.wind_direction_10m ?? 0),
    surfacePressure: Math.round(cur.surface_pressure ?? 1013),
    precipitation: Math.round((cur.precipitation ?? 0) * 10) / 10,
    visibilityKm,
    uvIndex: Math.round(uvNow * 10) / 10,
    time: cur.time || new Date().toISOString(),
  };

  // 2. Phân tích dự báo 24 giờ tiếp theo
  const hourlyList: HourlyForecastItem[] = [];
  if (Array.isArray(hourly.time)) {
    const startIndex = currentHourIdx;
    const endIndex = Math.min(startIndex + 24, hourly.time.length);

    for (let i = startIndex; i < endIndex; i++) {
      const isFirst = i === startIndex;
      const timeIso = hourly.time[i];
      hourlyList.push({
        time: timeIso,
        displayTime: isFirst ? 'Bây giờ' : formatIsoHour(timeIso),
        temperature: Math.round(hourly.temperature_2m?.[i] ?? 0),
        weatherCode: hourly.weather_code?.[i] ?? 0,
        precipitationProbability: Math.round(
          hourly.precipitation_probability?.[i] ?? 0,
        ),
        precipitation: Math.round((hourly.precipitation?.[i] ?? 0) * 10) / 10,
        humidity: Math.round(hourly.relative_humidity_2m?.[i] ?? 60),
        windSpeed: Math.round(hourly.wind_speed_10m?.[i] ?? 0),
        isDay: hourly.is_day?.[i] === 1,
        uvIndex: Math.round(hourly.uv_index?.[i] ?? 0),
      });
    }
  }

  // 3. Phân tích dự báo 7 ngày tiếp theo
  const dailyList: DailyForecastItem[] = [];
  if (Array.isArray(daily.time)) {
    for (let i = 0; i < daily.time.length && i < 7; i++) {
      const dateIso = daily.time[i];
      const { dayName, displayDate } = formatDayOfWeek(dateIso, i === 0);

      dailyList.push({
        date: dateIso,
        dayName,
        displayDate,
        weatherCode: daily.weather_code?.[i] ?? 0,
        tempMax: Math.round(daily.temperature_2m_max?.[i] ?? 30),
        tempMin: Math.round(daily.temperature_2m_min?.[i] ?? 22),
        apparentTempMax: Math.round(daily.apparent_temperature_max?.[i] ?? 32),
        apparentTempMin: Math.round(daily.apparent_temperature_min?.[i] ?? 23),
        precipitationProbability: Math.round(
          daily.precipitation_probability_max?.[i] ?? 0,
        ),
        precipitationSum:
          Math.round((daily.precipitation_sum?.[i] ?? 0) * 10) / 10,
        windSpeedMax: Math.round(daily.wind_speed_10m_max?.[i] ?? 12),
        uvIndexMax: Math.round(daily.uv_index_max?.[i] ?? 5),
        sunrise: daily.sunrise?.[i] ? formatIsoHour(daily.sunrise[i]) : '05:45',
        sunset: daily.sunset?.[i] ? formatIsoHour(daily.sunset[i]) : '18:15',
      });
    }
  }

  return {
    location,
    current: currentWeather,
    hourly: hourlyList,
    daily: dailyList,
    lastUpdated: new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};
