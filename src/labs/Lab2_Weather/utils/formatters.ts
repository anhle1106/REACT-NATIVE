import { TemperatureUnit, WindSpeedUnit } from '../types/weather';

export const formatTemperature = (
  tempC: number | undefined | null,
  unit: TemperatureUnit = 'celsius',
  includeUnit = true,
): string => {
  if (tempC === undefined || tempC === null || isNaN(tempC)) {
    return '--°';
  }
  const val = unit === 'fahrenheit' ? Math.round((tempC * 9) / 5 + 32) : Math.round(tempC);
  return includeUnit ? `${val}°${unit === 'fahrenheit' ? 'F' : 'C'}` : `${val}°`;
};

export const formatWindSpeed = (
  speedKmh: number | undefined | null,
  unit: WindSpeedUnit = 'kmh',
): string => {
  if (speedKmh === undefined || speedKmh === null || isNaN(speedKmh)) {
    return '--';
  }
  if (unit === 'ms') {
    const ms = (speedKmh / 3.6).toFixed(1);
    return `${ms} m/s`;
  }
  return `${Math.round(speedKmh)} km/h`;
};

export const getWindDirectionText = (degrees: number | undefined | null): string => {
  if (degrees === undefined || degrees === null || isNaN(degrees)) {
    return '--';
  }
  const deg = (degrees % 360 + 360) % 360;
  const directions = [
    { label: 'Bắc (N)', min: 337.5, max: 360 },
    { label: 'Bắc (N)', min: 0, max: 22.5 },
    { label: 'Đông Bắc (NE)', min: 22.5, max: 67.5 },
    { label: 'Đông (E)', min: 67.5, max: 112.5 },
    { label: 'Đông Nam (SE)', min: 112.5, max: 157.5 },
    { label: 'Nam (S)', min: 157.5, max: 202.5 },
    { label: 'Tây Nam (SW)', min: 202.5, max: 247.5 },
    { label: 'Tây (W)', min: 247.5, max: 292.5 },
    { label: 'Tây Bắc (NW)', min: 292.5, max: 337.5 },
  ];
  const found = directions.find((d) => deg >= d.min && deg < d.max);
  return found ? found.label : `${deg}°`;
};

export interface UVLevel {
  label: string;
  level: 'low' | 'moderate' | 'high' | 'very_high' | 'extreme';
  color: string;
  advice: string;
}

export const getUVLevelInfo = (uv: number | undefined | null): UVLevel => {
  const val = uv ?? 0;
  if (val <= 2) {
    return {
      label: 'Thấp',
      level: 'low',
      color: '#10B981', // green
      advice: 'An toàn khi ở ngoài trời',
    };
  } else if (val <= 5) {
    return {
      label: 'Trung bình',
      level: 'moderate',
      color: '#F59E0B', // yellow/amber
      advice: 'Nên đội mũ & che chắn',
    };
  } else if (val <= 7) {
    return {
      label: 'Cao',
      level: 'high',
      color: '#F97316', // orange
      advice: 'Cần bôi kem chống nắng',
    };
  } else if (val <= 10) {
    return {
      label: 'Rất cao',
      level: 'very_high',
      color: '#EF4444', // red
      advice: 'Hạn chế ra ngoài giữa trưa',
    };
  } else {
    return {
      label: 'Cực độ',
      level: 'extreme',
      color: '#8B5CF6', // purple
      advice: 'Nguy hiểm, tránh ánh nắng trực tiếp',
    };
  }
};

export const formatIsoHour = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    const hours = d.getHours().toString().padStart(2, '0');
    return `${hours}:00`;
  } catch {
    return isoString;
  }
};

export const formatDayOfWeek = (isoDateStr: string, isFirstDay = false): { dayName: string; displayDate: string } => {
  try {
    const d = new Date(isoDateStr);
    const dayOfWeek = d.getDay(); // 0 is Sunday
    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dateNum = d.getDate().toString().padStart(2, '0');
    const monthNum = (d.getMonth() + 1).toString().padStart(2, '0');
    
    return {
      dayName: isFirstDay ? 'Hôm nay' : dayNames[dayOfWeek],
      displayDate: `${dateNum}/${monthNum}`,
    };
  } catch {
    return {
      dayName: isoDateStr,
      displayDate: '',
    };
  }
};
