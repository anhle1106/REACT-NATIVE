import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HourlyForecastItem, TemperatureUnit } from '../types/weather';
import { getWeatherCodeInfo } from '../constants/weatherCodes';
import { formatTemperature } from '../utils/formatters';

interface HourlyForecastListProps {
  hourlyList: HourlyForecastItem[];
  tempUnit: TemperatureUnit;
  onSelectHour?: (hour: HourlyForecastItem) => void;
}

export const HourlyForecastList: React.FC<HourlyForecastListProps> = ({
  hourlyList,
  tempUnit,
  onSelectHour,
}) => {
  if (!hourlyList || hourlyList.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🕒 Dự báo 24 giờ tiếp theo</Text>
        <Text style={styles.subtitle}>Vuốt ngang để xem</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hourlyList.map((item, index) => {
          const codeInfo = getWeatherCodeInfo(item.weatherCode);
          const icon = item.isDay ? codeInfo.iconDay : codeInfo.iconNight;
          const isFirst = index === 0;

          return (
            <TouchableOpacity
              key={`${item.time}-${index}`}
              style={[styles.hourCard, isFirst && styles.activeHourCard]}
              onPress={() => onSelectHour && onSelectHour(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.timeText, isFirst && styles.activeTimeText]}>
                {item.displayTime}
              </Text>

              <Text style={styles.icon}>{icon}</Text>

              <Text
                style={[styles.tempText, isFirst && styles.activeTempText]}
              >
                {formatTemperature(item.temperature, tempUnit, false)}
              </Text>

              {/* Khả năng mưa */}
              <View
                style={[
                  styles.rainBadge,
                  item.precipitationProbability > 0
                    ? styles.rainBadgeActive
                    : styles.rainBadgeZero,
                ]}
              >
                <Text style={styles.rainDrop}>💧</Text>
                <Text style={styles.rainText}>
                  {item.precipitationProbability}%
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  hourCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 70,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  activeHourCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderColor: 'rgba(255, 255, 255, 0.55)',
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
    marginBottom: 6,
  },
  activeTimeText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  icon: {
    fontSize: 26,
    marginVertical: 4,
  },
  tempText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  activeTempText: {
    fontWeight: '900',
    color: '#FFFFFF',
  },
  rainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rainBadgeActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.35)',
  },
  rainBadgeZero: {
    backgroundColor: 'transparent',
    opacity: 0.5,
  },
  rainDrop: {
    fontSize: 9,
    marginRight: 2,
  },
  rainText: {
    fontSize: 10,
    color: '#BAE6FD',
    fontWeight: '700',
  },
});
