import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DailyForecastItem, TemperatureUnit } from '../types/weather';
import { getWeatherCodeInfo } from '../constants/weatherCodes';
import { formatTemperature } from '../utils/formatters';

interface DailyForecastListProps {
  dailyList: DailyForecastItem[];
  tempUnit: TemperatureUnit;
  onSelectDay: (day: DailyForecastItem) => void;
}

export const DailyForecastList: React.FC<DailyForecastListProps> = ({
  dailyList,
  tempUnit,
  onSelectDay,
}) => {
  if (!dailyList || dailyList.length === 0) {
    return null;
  }

  // Calculate global min and max across all days for normalized temperature bar
  const globalMin = Math.min(...dailyList.map((d) => d.tempMin));
  const globalMax = Math.max(...dailyList.map((d) => d.tempMax));
  const tempRange = Math.max(globalMax - globalMin, 1);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>📅 Dự báo 7 ngày tới</Text>
        <Text style={styles.hint}>Chạm để xem chi tiết</Text>
      </View>

      <View style={styles.card}>
        {dailyList.map((item, index) => {
          const codeInfo = getWeatherCodeInfo(item.weatherCode);
          const isToday = index === 0;

          // Normalized width percentages for min-max bar
          const leftPercent = ((item.tempMin - globalMin) / tempRange) * 100;
          const barWidthPercent =
            ((item.tempMax - item.tempMin) / tempRange) * 100;

          return (
            <TouchableOpacity
              key={`${item.date}-${index}`}
              style={[
                styles.dayRow,
                index < dailyList.length - 1 && styles.dayRowBorder,
              ]}
              onPress={() => onSelectDay(item)}
              activeOpacity={0.7}
            >
              {/* Day info */}
              <View style={styles.dayCol}>
                <Text style={[styles.dayName, isToday && styles.todayText]}>
                  {item.dayName}
                </Text>
                <Text style={styles.displayDate}>{item.displayDate}</Text>
              </View>

              {/* Weather icon & condition description */}
              <View style={styles.conditionCol}>
                <Text style={styles.weatherIcon}>{codeInfo.iconDay}</Text>
                <Text style={styles.conditionText} numberOfLines={1}>
                  {codeInfo.description}
                </Text>
              </View>

              {/* Rain prob */}
              <View style={styles.rainCol}>
                {item.precipitationProbability > 0 ? (
                  <Text style={styles.rainPercent}>
                    💧{item.precipitationProbability}%
                  </Text>
                ) : (
                  <Text style={styles.rainNone}>--</Text>
                )}
              </View>

              {/* Min Temp */}
              <Text style={styles.tempMinText}>
                {formatTemperature(item.tempMin, tempUnit, false)}
              </Text>

              {/* Temperature Bar */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      left: `${Math.max(0, Math.min(85, leftPercent))}%`,
                      width: `${Math.max(15, Math.min(100, barWidthPercent))}%`,
                    },
                  ]}
                />
              </View>

              {/* Max Temp */}
              <Text style={styles.tempMaxText}>
                {formatTemperature(item.tempMax, tempUnit, false)}
              </Text>

              {/* Arrow */}
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  hint: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 22,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dayRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayCol: {
    width: 74,
  },
  dayName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  todayText: {
    color: '#FDE047',
    fontWeight: '800',
  },
  displayDate: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 1,
  },
  conditionCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
    gap: 6,
  },
  weatherIcon: {
    fontSize: 20,
  },
  conditionText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    flex: 1,
  },
  rainCol: {
    width: 44,
    alignItems: 'center',
  },
  rainPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#93C5FD',
  },
  rainNone: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  tempMinText: {
    fontSize: 13,
    color: '#93C5FD',
    fontWeight: '600',
    width: 28,
    textAlign: 'right',
  },
  barTrack: {
    width: 48,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
    marginHorizontal: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  barFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 2,
    backgroundColor: '#F59E0B',
  },
  tempMaxText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
    width: 28,
    textAlign: 'left',
  },
  arrowIcon: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.45)',
    marginLeft: 4,
    fontWeight: '700',
  },
});
