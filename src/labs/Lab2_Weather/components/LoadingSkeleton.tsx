import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export const LoadingSkeleton: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Animated.View style={[styles.skeletonLine, { width: 140, height: 26, opacity: pulseAnim }]} />
          <Animated.View style={[styles.skeletonLine, { width: 90, height: 14, marginTop: 6, opacity: pulseAnim }]} />
        </View>
        <Animated.View style={[styles.skeletonCircle, { opacity: pulseAnim }]} />
      </View>

      {/* Main Card Skeleton */}
      <Animated.View style={[styles.mainCard, { opacity: pulseAnim }]}>
        <View style={styles.cardHeader}>
          <View style={styles.badgePlaceholder} />
          <View style={styles.iconPlaceholder} />
        </View>
        <View style={styles.tempPlaceholder} />
        <View style={styles.summaryBarPlaceholder} />
      </Animated.View>

      {/* Hourly Skeleton */}
      <View style={styles.sectionHeader}>
        <Animated.View style={[styles.skeletonLine, { width: 150, height: 18, opacity: pulseAnim }]} />
      </View>
      <View style={styles.hourlyRow}>
        {[1, 2, 3, 4, 5].map((key) => (
          <Animated.View
            key={key}
            style={[styles.hourlyBox, { opacity: pulseAnim }]}
          />
        ))}
      </View>

      {/* Daily Skeleton */}
      <View style={styles.sectionHeader}>
        <Animated.View style={[styles.skeletonLine, { width: 130, height: 18, opacity: pulseAnim }]} />
      </View>
      <Animated.View style={[styles.dailyBox, { opacity: pulseAnim }]} />

      <Text style={styles.statusText}>Đang tải dữ liệu thời tiết thực tế từ Open-Meteo API...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  skeletonLine: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  skeletonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    padding: 20,
    height: 190,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgePlaceholder: {
    width: 100,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tempPlaceholder: {
    width: 120,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryBarPlaceholder: {
    width: '100%',
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  sectionHeader: {
    marginVertical: 10,
  },
  hourlyRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  hourlyBox: {
    width: 65,
    height: 100,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  dailyBox: {
    width: '100%',
    height: 140,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  statusText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 20,
  },
});
