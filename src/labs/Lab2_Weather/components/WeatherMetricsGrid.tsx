import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CurrentWeather, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import {
  formatTemperature,
  formatWindSpeed,
  getUVLevelInfo,
  getWindDirectionText,
} from '../utils/formatters';

interface WeatherMetricsGridProps {
  current: CurrentWeather;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({
  current,
  tempUnit,
  windUnit,
}) => {
  const uvInfo = getUVLevelInfo(current.uvIndex);
  const windDirText = getWindDirectionText(current.windDirection);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Các chỉ số thời tiết chi tiết</Text>

      <View style={styles.grid}>
        {/* 1. Nhiệt độ & Cảm nhận */}
        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🌡️</Text>
            <Text style={styles.cardLabel}>NHIỆT ĐỘ</Text>
          </View>
          <Text style={styles.cardMainValue}>
            {formatTemperature(current.temperature, tempUnit)}
          </Text>
          <Text style={styles.cardSubText}>
            Cảm nhận như {formatTemperature(current.apparentTemperature, tempUnit)}
          </Text>
        </View>

        {/* 2. Độ ẩm */}
        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>💧</Text>
            <Text style={styles.cardLabel}>ĐỘ ẨM</Text>
          </View>
          <Text style={styles.cardMainValue}>{current.humidity}%</Text>
          {/* Mini progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.min(100, Math.max(5, current.humidity))}%` },
              ]}
            />
          </View>
          <Text style={styles.cardSubText}>
            {current.humidity > 70
              ? 'Độ ẩm cao, ngột ngạt'
              : current.humidity < 40
              ? 'Không khí khô hanh'
              : 'Độ ẩm dễ chịu'}
          </Text>
        </View>

        {/* 3. Tốc độ gió */}
        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>💨</Text>
            <Text style={styles.cardLabel}>TỐC ĐỘ GIÓ</Text>
          </View>
          <Text style={styles.cardMainValue}>
            {formatWindSpeed(current.windSpeed, windUnit)}
          </Text>
          <Text style={styles.cardSubText}>
            {current.windSpeed > 25
              ? 'Gió mạnh, có giật'
              : current.windSpeed > 10
              ? 'Gió nhẹ vừa phải'
              : 'Gió thoảng lặng'}
          </Text>
        </View>

        {/* 4. Hướng gió */}
        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🧭</Text>
            <Text style={styles.cardLabel}>HƯỚNG GIÓ</Text>
          </View>
          <Text style={styles.cardMainValue}>{windDirText}</Text>
          <Text style={styles.cardSubText}>Góc toạ độ: {current.windDirection}°</Text>
        </View>

        {/* 5. Chỉ số UV */}
        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>☀️</Text>
            <Text style={styles.cardLabel}>CHỈ SỐ UV</Text>
          </View>
          <View style={styles.uvRow}>
            <Text style={styles.cardMainValue}>{current.uvIndex}</Text>
            <View style={[styles.uvBadge, { backgroundColor: uvInfo.color }]}>
              <Text style={styles.uvBadgeText}>{uvInfo.label}</Text>
            </View>
          </View>
          <Text style={styles.cardSubText}>{uvInfo.advice}</Text>
        </View>

        {/* 6. Lượng mưa */}
        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🌧️</Text>
            <Text style={styles.cardLabel}>LƯỢNG MƯA</Text>
          </View>
          <Text style={styles.cardMainValue}>{current.precipitation} mm</Text>
          <Text style={styles.cardSubText}>
            {current.precipitation > 0
              ? 'Đang có mưa rơi'
              : 'Không có mưa lúc này'}
          </Text>
        </View>

        {/* 7. Áp suất khí quyển */}
        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>⏲️</Text>
            <Text style={styles.cardLabel}>ÁP SUẤT</Text>
          </View>
          <Text style={styles.cardMainValue}>{current.surfacePressure} hPa</Text>
          <Text style={styles.cardSubText}>
            {current.surfacePressure >= 1013 ? 'Áp suất cao ổn định' : 'Áp suất thấp'}
          </Text>
        </View>

        {/* 8. Tầm nhìn xa */}
        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>👁️</Text>
            <Text style={styles.cardLabel}>TẦM NHÌN</Text>
          </View>
          <Text style={styles.cardMainValue}>{current.visibilityKm} km</Text>
          <Text style={styles.cardSubText}>
            {current.visibilityKm >= 10
              ? 'Tầm nhìn rất rõ ràng'
              : current.visibilityKm >= 5
              ? 'Tầm nhìn trung bình'
              : 'Sương mờ cản trở'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  metricCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  cardIcon: {
    fontSize: 14,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
  },
  cardMainValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 2,
  },
  cardSubText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    lineHeight: 15,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginVertical: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  uvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uvBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  uvBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
