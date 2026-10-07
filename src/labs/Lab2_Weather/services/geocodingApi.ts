import { Coordinates, LocationInfo } from '../types/weather';

/**
 * Tìm kiếm thành phố bằng Open-Meteo Geocoding API
 */
export const searchCities = async (query: string): Promise<LocationInfo[]> => {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  try {
    const encoded = encodeURIComponent(trimmed);
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encoded}&count=10&language=vi&format=json`;
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Geocoding HTTP error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      name: item.name || trimmed,
      country: item.country || '',
      admin1: item.admin1 || item.admin2 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      isCurrentLocation: false,
    }));
  } catch (error) {
    console.warn('searchCities error:', error);
    return [];
  }
};

/**
 * Lấy tên địa điểm từ toạ độ (Reverse Geocoding)
 */
export const reverseGeocode = async (coords: Coordinates): Promise<LocationInfo> => {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=vi`;
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      const cityName =
        data.locality ||
        data.city ||
        data.principalSubdivision ||
        'Vị trí hiện tại';
      const countryName = data.countryName || 'Việt Nam';
      const admin1 = data.principalSubdivision || '';

      return {
        name: cityName,
        country: countryName,
        admin1: admin1 !== cityName ? admin1 : undefined,
        latitude: coords.latitude,
        longitude: coords.longitude,
        isCurrentLocation: true,
      };
    }
  } catch (e) {
    console.warn('reverseGeocode error, fallback to coordinates:', e);
  }

  return {
    name: `Vị trí (${coords.latitude.toFixed(2)}°, ${coords.longitude.toFixed(2)}°)`,
    country: 'GPS',
    latitude: coords.latitude,
    longitude: coords.longitude,
    isCurrentLocation: true,
  };
};

/**
 * Fallback lấy toạ độ gần đúng qua IP nếu GPS bị từ chối
 */
export const getIpLocation = async (): Promise<LocationInfo | null> => {
  try {
    const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
    if (response.ok) {
      const data = await response.json();
      if (data.latitude && data.longitude) {
        return {
          name: data.city || 'Vị trí mạng',
          country: data.country || 'Việt Nam',
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          isCurrentLocation: true,
        };
      }
    }
  } catch (err) {
    console.warn('getIpLocation error:', err);
  }
  return null;
};
