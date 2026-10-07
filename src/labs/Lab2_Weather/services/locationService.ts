import { PermissionsAndroid, Platform } from 'react-native';
import { Coordinates, LocationInfo } from '../types/weather';
import { DEFAULT_CITY } from '../constants/defaultCities';
import { getIpLocation, reverseGeocode } from './geocodingApi';

export interface LocationPermissionResult {
  granted: boolean;
  message?: string;
}

/**
 * Xin quyền vị trí trên Android / iOS
 */
export const requestLocationPermission =
  async (): Promise<LocationPermissionResult> => {
    if (Platform.OS === 'android') {
      try {
        const checkGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (checkGranted) {
          return { granted: true };
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Quyền truy cập vị trí thiết bị',
            message:
              'Ứng dụng Thời tiết cần quyền vị trí để dự báo thời tiết chính xác tại nơi bạn đang đứng.',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Từ chối',
            buttonPositive: 'Cho phép',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return { granted: true };
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
          return {
            granted: false,
            message: 'Bạn đã từ chối cấp quyền vị trí. Ứng dụng sẽ dùng địa điểm mặc định.',
          };
        } else {
          return {
            granted: false,
            message:
              'Quyền vị trí bị chặn vĩnh viễn. Bạn có thể chọn thủ công trong mục Tìm kiếm.',
          };
        }
      } catch (err) {
        console.warn('requestLocationPermission Android error:', err);
        return { granted: false, message: 'Lỗi khi yêu cầu cấp quyền vị trí.' };
      }
    }

    // Default to true for iOS or other platforms
    return { granted: true };
  };

/**
 * Lấy toạ độ GPS của thiết bị
 */
export const getCurrentCoordinates = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    const geo = (globalThis as any).navigator?.geolocation;

    if (geo && typeof geo.getCurrentPosition === 'function') {
      geo.getCurrentPosition(
        (position: any) => {
          if (position?.coords) {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          } else {
            reject(new Error('Dữ liệu toạ độ không hợp lệ'));
          }
        },
        (error: any) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } else {
      reject(new Error('Trình định vị GPS không được hỗ trợ trực tiếp'));
    }
  });
};

/**
 * Quy trình lấy toàn bộ vị trí hiện tại (GPS -> Reverse Geocode -> Fallback IP -> Fallback mặc định)
 */
export const resolveCurrentLocation = async (): Promise<{
  location: LocationInfo;
  permissionGranted: boolean;
  source: 'gps' | 'ip' | 'default';
  warningMessage?: string;
}> => {
  // 1. Kiểm tra / xin quyền vị trí
  const perm = await requestLocationPermission();

  if (!perm.granted) {
    // Trường hợp người dùng không cấp quyền vị trí:
    // Thử fallback IP hoặc trả về mặc định Hà Nội
    const ipLoc = await getIpLocation();
    if (ipLoc) {
      return {
        location: ipLoc,
        permissionGranted: false,
        source: 'ip',
        warningMessage:
          'Chưa cấp quyền vị trí: Ứng dụng đang hiển thị theo vị trí mạng ước lượng.',
      };
    }

    return {
      location: DEFAULT_CITY,
      permissionGranted: false,
      source: 'default',
      warningMessage:
        'Chưa cấp quyền vị trí: Đang hiển thị thời tiết tại Hà Nội.',
    };
  }

  // 2. Nếu đã có quyền, thử đọc toạ độ GPS
  try {
    const coords = await getCurrentCoordinates();
    const loc = await reverseGeocode(coords);
    return {
      location: loc,
      permissionGranted: true,
      source: 'gps',
    };
  } catch (gpsErr) {
    console.warn('GPS reading failed, attempting IP location fallback:', gpsErr);

    // 3. Fallback IP nếu GPS không phản hồi (ví dụ trên máy ảo chưa set toạ độ giả lập)
    const ipLoc = await getIpLocation();
    if (ipLoc) {
      return {
        location: ipLoc,
        permissionGranted: true,
        source: 'ip',
        warningMessage:
          'Đã cấp quyền nhưng không nhận được tín hiệu GPS: Sử dụng vị trí mạng.',
      };
    }

    return {
      location: DEFAULT_CITY,
      permissionGranted: true,
      source: 'default',
      warningMessage:
        'Không thể lấy toạ độ GPS lúc này: Đang hiển thị theo Hà Nội.',
    };
  }
};
