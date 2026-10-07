import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  AppSettings,
  DailyForecastItem,
  HourlyForecastItem,
  LocationInfo,
  WeatherData,
  WeatherTab,
} from './types/weather';
import { DEFAULT_CITY } from './constants/defaultCities';
import { getWeatherCodeInfo } from './constants/weatherCodes';
import { fetchWeatherData } from './services/weatherApi';
import { resolveCurrentLocation } from './services/locationService';

// Components
import { WeatherHeader } from './components/WeatherHeader';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecastList } from './components/HourlyForecastList';
import { DailyForecastList } from './components/DailyForecastList';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { DayDetailModal } from './components/DayDetailModal';
import { SearchLocationsModal } from './components/SearchLocationsModal';
import { WeatherRadarScreen } from './components/WeatherRadarScreen';
import { SettingsModal } from './components/SettingsModal';
import { WeatherNavBar } from './components/WeatherNavBar';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorStateView } from './components/ErrorStateView';

export const WeatherScreen: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(DEFAULT_CITY);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | undefined>(undefined);

  // Tabs & Navigation
  const [activeTab, setActiveTab] = useState<WeatherTab>('forecast');

  // Modals
  const [selectedDay, setSelectedDay] = useState<DailyForecastItem | null>(null);
  const [searchModalVisible, setSearchModalVisible] = useState<boolean>(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState<boolean>(false);

  // Settings
  const [settings, setSettings] = useState<AppSettings>({
    tempUnit: 'celsius',
    windUnit: 'kmh',
    autoRefresh: true,
  });

  // Tải dữ liệu thời tiết theo địa điểm
  const loadWeatherForLocation = useCallback(async (loc: LocationInfo, isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(loc);
      setWeatherData(data);
      setCurrentLocation(loc);
    } catch (err: any) {
      console.error('Lỗi khi tải thời tiết:', err);
      setError(
        err?.message ||
          'Không thể kết nối đến máy chủ thời tiết Open-Meteo. Vui lòng kiểm tra lại kết nối mạng.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Xử lý lấy vị trí hiện tại (GPS & quyền)
  const handleGetDeviceLocation = useCallback(async () => {
    setLoading(true);
    try {
      const result = await resolveCurrentLocation();
      if (result.warningMessage) {
        setWarningMessage(result.warningMessage);
      } else {
        setWarningMessage(undefined);
      }
      await loadWeatherForLocation(result.location, true);
    } catch (err: any) {
      console.warn('Lỗi định vị:', err);
      setWarningMessage('Không thể lấy vị trí GPS. Đang dùng địa điểm mặc định.');
      await loadWeatherForLocation(DEFAULT_CITY, true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loadWeatherForLocation]);

  // Khởi động lần đầu
  useEffect(() => {
    handleGetDeviceLocation();
  }, [handleGetDeviceLocation]);

  // Kéo để làm mới
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadWeatherForLocation(currentLocation, true);
  }, [currentLocation, loadWeatherForLocation]);

  // Chọn thành phố mới từ tìm kiếm
  const handleSelectLocation = (newLoc: LocationInfo) => {
    setWarningMessage(undefined);
    loadWeatherForLocation(newLoc);
  };

  // Chọn xem chi tiết 1 giờ trong dự báo 24 giờ
  const handleSelectHour = (hour: HourlyForecastItem) => {
    // Chuyển đổi thành daily item tạm thời để hiển thị chi tiết
    if (!weatherData) return;
    const tempDailyItem: DailyForecastItem = {
      date: hour.time,
      dayName: `Giờ: ${hour.displayTime}`,
      displayDate: hour.time.substring(5, 10).replace('-', '/'),
      weatherCode: hour.weatherCode,
      tempMax: hour.temperature,
      tempMin: hour.temperature,
      apparentTempMax: hour.temperature,
      apparentTempMin: hour.temperature,
      precipitationProbability: hour.precipitationProbability,
      precipitationSum: hour.precipitation,
      windSpeedMax: hour.windSpeed,
      uvIndexMax: hour.uvIndex,
      sunrise: weatherData.daily[0]?.sunrise || '05:30',
      sunset: weatherData.daily[0]?.sunset || '18:15',
    };
    setSelectedDay(tempDailyItem);
  };

  // Màu nền gradient thích ứng theo thời tiết & ngày/đêm
  const codeInfo = weatherData
    ? getWeatherCodeInfo(weatherData.current.weatherCode)
    : getWeatherCodeInfo(0);
  const isDay = weatherData ? weatherData.current.isDay : true;
  const gradientColors = isDay ? codeInfo.gradientDay : codeInfo.gradientNight;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: gradientColors[0] || '#0F172A' },
      ]}
    >
      <StatusBar barStyle="light-content" />

      <View
        style={[
          styles.mainBackground,
          { backgroundColor: gradientColors[0] || '#0F172A' },
        ]}
      >
        {/* Loading State */}
        {loading && !weatherData ? (
          <LoadingSkeleton />
        ) : error && !weatherData ? (
          /* Error State */
          <ErrorStateView
            errorMessage={error}
            onRetry={() => loadWeatherForLocation(currentLocation)}
            onUseDefaultCity={() => loadWeatherForLocation(DEFAULT_CITY)}
          />
        ) : (
          /* Main Content */
          <>
            {/* Header */}
            {weatherData && (
              <WeatherHeader
                location={weatherData.location}
                lastUpdated={weatherData.lastUpdated}
                onRefresh={onRefresh}
                onOpenSearch={() => setSearchModalVisible(true)}
                onRequestGPS={handleGetDeviceLocation}
                warningMessage={warningMessage}
                onDismissWarning={() => setWarningMessage(undefined)}
              />
            )}

            {/* TAB 1: DỰ BÁO CHÍNH (FORECAST) */}
            {activeTab === 'forecast' && weatherData && (
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#FFFFFF"
                    colors={['#2563EB']}
                  />
                }
              >
                {/* 1. Thẻ thời tiết hiện tại */}
                <CurrentWeatherCard
                  current={weatherData.current}
                  tempUnit={settings.tempUnit}
                />

                {/* 2. Dự báo theo giờ (24 giờ tiếp theo) */}
                <HourlyForecastList
                  hourlyList={weatherData.hourly}
                  tempUnit={settings.tempUnit}
                  onSelectHour={handleSelectHour}
                />

                {/* 3. Dự báo 7 ngày tiếp theo */}
                <DailyForecastList
                  dailyList={weatherData.daily}
                  tempUnit={settings.tempUnit}
                  onSelectDay={(day) => setSelectedDay(day)}
                />

                {/* 4. Lưới 8 chỉ số thời tiết chi tiết */}
                <WeatherMetricsGrid
                  current={weatherData.current}
                  tempUnit={settings.tempUnit}
                  windUnit={settings.windUnit}
                />

                <View style={{ height: 20 }} />
              </ScrollView>
            )}

            {/* TAB 2: TÌM KIẾM ĐỊA ĐIỂM (SEARCH) */}
            {activeTab === 'search' && (
              <View style={styles.tabPlaceholderView}>
                <SearchLocationsModal
                  visible={true}
                  onClose={() => setActiveTab('forecast')}
                  onSelectLocation={(loc) => {
                    handleSelectLocation(loc);
                    setActiveTab('forecast');
                  }}
                  onSelectCurrentLocation={() => {
                    handleGetDeviceLocation();
                    setActiveTab('forecast');
                  }}
                />
              </View>
            )}

            {/* TAB 3: RADAR & KHÍ TƯỢNG (RADAR) */}
            {activeTab === 'metrics' && weatherData && (
              <WeatherRadarScreen weatherData={weatherData} />
            )}

            {/* TAB 4: CÀI ĐẶT (SETTINGS) */}
            {activeTab === 'settings' && (
              <View style={styles.tabPlaceholderView}>
                <SettingsModal
                  visible={true}
                  settings={settings}
                  onUpdateSettings={setSettings}
                  onClose={() => setActiveTab('forecast')}
                />
              </View>
            )}

            {/* Bottom Navigation */}
            <WeatherNavBar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                if (tab === 'search') {
                  setSearchModalVisible(true);
                } else if (tab === 'settings') {
                  setSettingsModalVisible(true);
                } else {
                  setActiveTab(tab);
                }
              }}
            />
          </>
        )}

        {/* Modal Xem chi tiết ngày */}
        <DayDetailModal
          visible={selectedDay !== null}
          item={selectedDay}
          tempUnit={settings.tempUnit}
          onClose={() => setSelectedDay(null)}
        />

        {/* Modal Tìm kiếm địa điểm */}
        <SearchLocationsModal
          visible={searchModalVisible}
          onClose={() => setSearchModalVisible(false)}
          onSelectLocation={handleSelectLocation}
          onSelectCurrentLocation={handleGetDeviceLocation}
        />

        {/* Modal Cài đặt */}
        <SettingsModal
          visible={settingsModalVisible}
          settings={settings}
          onUpdateSettings={setSettings}
          onClose={() => setSettingsModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  tabPlaceholderView: {
    flex: 1,
  },
});
