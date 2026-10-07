export interface WeatherCodeInfo {
  description: string;
  iconDay: string;
  iconNight: string;
  gradientDay: [string, string];
  gradientNight: [string, string];
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunder';
}

export const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: {
    description: 'Trời quang đãng',
    iconDay: '☀️',
    iconNight: '🌙',
    gradientDay: ['#1E88E5', '#64B5F6'],
    gradientNight: ['#0D1B2A', '#1B263B'],
    category: 'clear',
  },
  1: {
    description: 'Chủ yếu nắng đẹp',
    iconDay: '🌤️',
    iconNight: '🌤️',
    gradientDay: ['#2196F3', '#90CAF9'],
    gradientNight: ['#111D35', '#203354'],
    category: 'clear',
  },
  2: {
    description: 'Có mây rải rác',
    iconDay: '⛅',
    iconNight: '☁️',
    gradientDay: ['#3F51B5', '#64B5F6'],
    gradientNight: ['#162238', '#253555'],
    category: 'cloudy',
  },
  3: {
    description: 'Trời nhiều mây u ám',
    iconDay: '☁️',
    iconNight: '☁️',
    gradientDay: ['#455A64', '#78909C'],
    gradientNight: ['#1C2329', '#37474F'],
    category: 'cloudy',
  },
  45: {
    description: 'Có sương mù',
    iconDay: '🌫️',
    iconNight: '🌫️',
    gradientDay: ['#546E7A', '#90A4AE'],
    gradientNight: ['#263238', '#455A64'],
    category: 'fog',
  },
  48: {
    description: 'Sương mù đóng băng',
    iconDay: '🌫️',
    iconNight: '🌫️',
    gradientDay: ['#607D8B', '#B0BEC5'],
    gradientNight: ['#21282D', '#37474F'],
    category: 'fog',
  },
  51: {
    description: 'Mưa phùn nhẹ',
    iconDay: '🌦️',
    iconNight: '🌧️',
    gradientDay: ['#3949AB', '#5C6BC0'],
    gradientNight: ['#181F38', '#2B3864'],
    category: 'drizzle',
  },
  53: {
    description: 'Mưa phùn vừa',
    iconDay: '🌦️',
    iconNight: '🌧️',
    gradientDay: ['#303F9F', '#3F51B5'],
    gradientNight: ['#141A30', '#20294C'],
    category: 'drizzle',
  },
  55: {
    description: 'Mưa phùn hạt dày',
    iconDay: '🌧️',
    iconNight: '🌧️',
    gradientDay: ['#283593', '#3949AB'],
    gradientNight: ['#0E1428', '#1A2342'],
    category: 'drizzle',
  },
  61: {
    description: 'Mưa nhỏ',
    iconDay: '🌧️',
    iconNight: '🌧️',
    gradientDay: ['#1E3A8A', '#3B82F6'],
    gradientNight: ['#0F172A', '#1E293B'],
    category: 'rain',
  },
  63: {
    description: 'Mưa vừa',
    iconDay: '🌧️',
    iconNight: '🌧️',
    gradientDay: ['#1E3A8A', '#2563EB'],
    gradientNight: ['#0A0F1D', '#162035'],
    category: 'rain',
  },
  65: {
    description: 'Mưa to nặng hạt',
    iconDay: '🌧️',
    iconNight: '🌧️',
    gradientDay: ['#172554', '#1D4ED8'],
    gradientNight: ['#080C17', '#111827'],
    category: 'rain',
  },
  71: {
    description: 'Tuyết rơi nhẹ',
    iconDay: '🌨️',
    iconNight: '🌨️',
    gradientDay: ['#5C6BC0', '#9FA8DA'],
    gradientNight: ['#1E2442', '#333D70'],
    category: 'snow',
  },
  73: {
    description: 'Tuyết rơi vừa',
    iconDay: '❄️',
    iconNight: '❄️',
    gradientDay: ['#49599A', '#7986CB'],
    gradientNight: ['#151A30', '#252F56'],
    category: 'snow',
  },
  75: {
    description: 'Tuyết rơi dày',
    iconDay: '❄️',
    iconNight: '❄️',
    gradientDay: ['#3949AB', '#5C6BC0'],
    gradientNight: ['#101426', '#1C2344'],
    category: 'snow',
  },
  80: {
    description: 'Mưa rào nhẹ',
    iconDay: '🌦️',
    iconNight: '🌧️',
    gradientDay: ['#1D4ED8', '#60A5FA'],
    gradientNight: ['#0B132B', '#1C2541'],
    category: 'rain',
  },
  81: {
    description: 'Mưa rào vừa',
    iconDay: '🌧️',
    iconNight: '🌧️',
    gradientDay: ['#1E40AF', '#3B82F6'],
    gradientNight: ['#080F22', '#141D35'],
    category: 'rain',
  },
  82: {
    description: 'Mưa rào dữ dội',
    iconDay: '⛈️',
    iconNight: '⛈️',
    gradientDay: ['#111827', '#1E3A8A'],
    gradientNight: ['#030712', '#0F172A'],
    category: 'rain',
  },
  95: {
    description: 'Dông sét',
    iconDay: '⛈️',
    iconNight: '⛈️',
    gradientDay: ['#1F2937', '#4B5563'],
    gradientNight: ['#111827', '#1F2937'],
    category: 'thunder',
  },
  96: {
    description: 'Dông bão có mưa đá nhẹ',
    iconDay: '⛈️',
    iconNight: '⛈️',
    gradientDay: ['#18181B', '#3F3F46'],
    gradientNight: ['#09090B', '#18181B'],
    category: 'thunder',
  },
  99: {
    description: 'Dông bão mưa đá nghiêm trọng',
    iconDay: '⛈️',
    iconNight: '⛈️',
    gradientDay: ['#0F172A', '#334155'],
    gradientNight: ['#020617', '#0F172A'],
    category: 'thunder',
  },
};

export const DEFAULT_WEATHER_INFO: WeatherCodeInfo = {
  description: 'Trời quang đãng',
  iconDay: '☀️',
  iconNight: '🌙',
  gradientDay: ['#1E88E5', '#64B5F6'],
  gradientNight: ['#0D1B2A', '#1B263B'],
  category: 'clear',
};

export const getWeatherCodeInfo = (code: number): WeatherCodeInfo => {
  return WEATHER_CODE_MAP[code] || DEFAULT_WEATHER_INFO;
};
