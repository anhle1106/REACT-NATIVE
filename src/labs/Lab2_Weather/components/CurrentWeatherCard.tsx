import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CurrentWeather, TemperatureUnit } from '../types/weather';
import { getWeatherCodeInfo } from '../constants/weatherCodes';
import { formatTemperature } from '../utils/formatters';

interface CurrentWeatherCardProps {
  current: CurrentWeather;
  tempUnit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  current,
  tempUnit,
}) => {
  const codeInfo = getWeatherCodeInfo(current.weatherCode);
  const icon = current.isDay ? codeInfo.iconDay : codeInfo.iconNight;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.badgeCondition}>
            <Text style={styles.badgeText}>{codeInfo.description}</Text>
          </View>
          <Text style={styles.weatherIconLarge}>{icon}</Text>
        </View>

        <View style={styles.tempSection}>
          <Text style={styles.tempNumber}>
            {formatTemperature(current.temperature, tempUnit, false)}
          </Text>
          <Text style={styles.degreeSymbol}>
            °{tempUnit === 'fahrenheit' ? 'F' : 'C'}
          </Text>
        </View>

        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Cảm nhận</Text>
            <Text style={styles.summaryValue}>
              {formatTemperature(current.apparentTemperature, tempUnit)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Cao nhất</Text>
            <Text style={[styles.summaryValue, styles.highTemp]}>
              ↑ {formatTemperature(current.tempMax, tempUnit)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Thấp nhất</Text>
            <Text style={[styles.summaryValue, styles.lowTemp]}>
              ↓ {formatTemperature(current.tempMin, tempUnit)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeCondition: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  weatherIconLarge: {
    fontSize: 54,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  tempSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    marginBottom: 16,
  },
  tempNumber: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2,
    lineHeight: 76,
  },
  degreeSymbol: {
    fontSize: 26,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 8,
    marginLeft: 4,
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  highTemp: {
    color: '#FCA5A5',
  },
  lowTemp: {
    color: '#93C5FD',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
