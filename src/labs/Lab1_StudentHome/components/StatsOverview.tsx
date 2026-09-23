import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeColors } from '../constants/colors';
import { StatItem } from '../types';

interface StatsOverviewProps {
  stats: StatItem[];
  colors: ThemeColors;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, colors }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Tổng quan học tập
      </Text>
      <View style={styles.grid}>
        {stats.map((stat) => (
          <View
            key={stat.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: stat.backgroundColor },
              ]}
            >
              <Text style={styles.iconText}>{stat.icon}</Text>
            </View>

            <View style={styles.valueRow}>
              <Text style={[styles.valueText, { color: colors.textPrimary }]}>
                {stat.value}
              </Text>
              {stat.unit && (
                <Text style={[styles.unitText, { color: colors.textSecondary }]}>
                  {' '}{stat.unit}
                </Text>
              )}
            </View>

            <Text
              style={[styles.titleText, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {stat.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.1,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 22,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  valueText: {
    fontSize: 20,
    fontWeight: '800',
  },
  unitText: {
    fontSize: 12,
    fontWeight: '500',
  },
  titleText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
