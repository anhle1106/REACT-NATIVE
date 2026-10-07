import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WeatherData } from '../types/weather';
import { getWeatherCodeInfo } from '../constants/weatherCodes';

interface WeatherRadarScreenProps {
  weatherData: WeatherData;
}

type RadarLayer = 'precipitation' | 'clouds' | 'wind' | 'temp';

export const WeatherRadarScreen: React.FC<WeatherRadarScreenProps> = ({
  weatherData,
}) => {
  const [activeLayer, setActiveLayer] = useState<RadarLayer>('precipitation');
  const [isPlaying, setIsPlaying] = useState(true);
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animLoop: Animated.CompositeAnimation | null = null;
    if (isPlaying) {
      scanAnim.setValue(0);
      animLoop = Animated.loop(
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 3500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      animLoop.start();
    } else {
      scanAnim.stopAnimation();
    }

    return () => {
      if (animLoop) animLoop.stop();
    };
  }, [isPlaying, scanAnim]);

  const rotateInterpolation = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const codeInfo = getWeatherCodeInfo(weatherData.current.weatherCode);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Radar & Bản đồ khí tượng</Text>
        <Text style={styles.headerSub}>
          Khu vực: {weatherData.location.name} ({weatherData.location.latitude.toFixed(2)}°,{' '}
          {weatherData.location.longitude.toFixed(2)}°)
        </Text>
      </View>

      {/* Layer selector tabs */}
      <View style={styles.layerTabs}>
        <TouchableOpacity
          style={[
            styles.layerTab,
            activeLayer === 'precipitation' && styles.activeLayerTab,
          ]}
          onPress={() => setActiveLayer('precipitation')}
        >
          <Text
            style={[
              styles.layerTabText,
              activeLayer === 'precipitation' && styles.activeLayerTabText,
            ]}
          >
            🌧️ Mưa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.layerTab,
            activeLayer === 'clouds' && styles.activeLayerTab,
          ]}
          onPress={() => setActiveLayer('clouds')}
        >
          <Text
            style={[
              styles.layerTabText,
              activeLayer === 'clouds' && styles.activeLayerTabText,
            ]}
          >
            ☁️ Mây
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.layerTab,
            activeLayer === 'wind' && styles.activeLayerTab,
          ]}
          onPress={() => setActiveLayer('wind')}
        >
          <Text
            style={[
              styles.layerTabText,
              activeLayer === 'wind' && styles.activeLayerTabText,
            ]}
          >
            💨 Gió
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.layerTab,
            activeLayer === 'temp' && styles.activeLayerTab,
          ]}
          onPress={() => setActiveLayer('temp')}
        >
          <Text
            style={[
              styles.layerTabText,
              activeLayer === 'temp' && styles.activeLayerTabText,
            ]}
          >
            🌡️ Nhiệt độ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Radar Map Visual Simulation Box */}
      <View style={styles.radarCard}>
        <View style={styles.radarMapArea}>
          {/* Radar Circles */}
          <View style={styles.radarCircleOuter} />
          <View style={styles.radarCircleMiddle} />
          <View style={styles.radarCircleInner} />
          <View style={styles.radarCrosshairH} />
          <View style={styles.radarCrosshairV} />

          {/* Animated Scanning Sweep Beam */}
          <Animated.View
            style={[
              styles.radarBeam,
              { transform: [{ rotate: rotateInterpolation }] },
            ]}
          />

          {/* Center Location Pin */}
          <View style={styles.centerPin}>
            <View style={styles.pulsePoint} />
            <Text style={styles.centerPinText}>📍 {weatherData.location.name}</Text>
          </View>

          {/* Cloud / Precipitation blobs based on active layer */}
          <View
            style={[
              styles.weatherBlob1,
              activeLayer === 'precipitation'
                ? styles.blobRain
                : activeLayer === 'clouds'
                ? styles.blobClouds
                : activeLayer === 'wind'
                ? styles.blobWind
                : styles.blobTemp,
            ]}
          />
          <View
            style={[
              styles.weatherBlob2,
              activeLayer === 'precipitation'
                ? styles.blobRain
                : activeLayer === 'clouds'
                ? styles.blobClouds
                : activeLayer === 'wind'
                ? styles.blobWind
                : styles.blobTemp,
            ]}
          />

          {/* Play/Pause control overlay */}
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => setIsPlaying(!isPlaying)}
            activeOpacity={0.8}
          >
            <Text style={styles.playBtnText}>{isPlaying ? '⏸ Tạm dừng' : '▶ Quét Radar'}</Text>
          </TouchableOpacity>

          <View style={styles.liveTag}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>TRỰC TIẾP</Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <Text style={styles.legendLabel}>Thang đo:</Text>
          <View style={styles.legendBar}>
            <View style={[styles.legendStep, { backgroundColor: '#38BDF8' }]} />
            <View style={[styles.legendStep, { backgroundColor: '#34D399' }]} />
            <View style={[styles.legendStep, { backgroundColor: '#FBBF24' }]} />
            <View style={[styles.legendStep, { backgroundColor: '#F87171' }]} />
            <View style={[styles.legendStep, { backgroundColor: '#C084FC' }]} />
          </View>
          <Text style={styles.legendText}>Nhẹ → Dữ dội</Text>
        </View>
      </View>

      {/* Atmospheric Insights */}
      <View style={styles.insightSection}>
        <Text style={styles.insightTitle}>🔍 Phân tích vi khí hậu</Text>

        <View style={styles.insightCard}>
          <Text style={styles.insightItemTitle}>Tình trạng tầng đối lưu</Text>
          <Text style={styles.insightItemDesc}>
            Hiện tại khu vực {weatherData.location.name} có thời tiết {codeInfo.description.toLowerCase()}. Áp suất bề mặt đo được {weatherData.current.surfacePressure} hPa với độ ẩm {weatherData.current.humidity}%. Tầm nhìn xa duy trì ở mức {weatherData.current.visibilityKm} km.
          </Text>
        </View>

        <View style={styles.twoColumn}>
          <View style={styles.insightColCard}>
            <Text style={styles.colTitle}>Khả năng giông lốc</Text>
            <Text style={styles.colValue}>
              {weatherData.current.weatherCode >= 95
                ? 'Rất cao ⚠️'
                : weatherData.current.precipitation > 2
                ? 'Trung bình'
                : 'Thấp (An toàn)'}
            </Text>
            <Text style={styles.colSub}>Dựa trên WMO code {weatherData.current.weatherCode}</Text>
          </View>

          <View style={styles.insightColCard}>
            <Text style={styles.colTitle}>Nhiệt độ điểm sương</Text>
            <Text style={styles.colValue}>
              ~{(weatherData.current.temperature - ((100 - weatherData.current.humidity) / 5)).toFixed(1)}°C
            </Text>
            <Text style={styles.colSub}>Ngưỡng ngưng tụ hơi ẩm</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  layerTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  layerTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeLayerTab: {
    backgroundColor: '#2563EB',
  },
  layerTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activeLayerTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  radarCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 16,
  },
  radarMapArea: {
    height: 280,
    backgroundColor: '#020617',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  radarCircleOuter: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  radarCircleMiddle: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  radarCircleInner: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  radarCrosshairH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
  },
  radarCrosshairV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
  },
  radarBeam: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderTopWidth: 2,
    borderTopColor: 'rgba(56, 189, 248, 0.8)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(56, 189, 248, 0.3)',
  },
  centerPin: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  pulsePoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#38BDF8',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: 4,
  },
  centerPinText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  weatherBlob1: {
    position: 'absolute',
    width: 90,
    height: 70,
    top: 40,
    left: 40,
    borderRadius: 35,
    opacity: 0.5,
  },
  weatherBlob2: {
    position: 'absolute',
    width: 120,
    height: 80,
    bottom: 40,
    right: 30,
    borderRadius: 40,
    opacity: 0.55,
  },
  blobRain: {
    backgroundColor: '#2563EB',
  },
  blobClouds: {
    backgroundColor: '#94A3B8',
  },
  blobWind: {
    backgroundColor: '#10B981',
  },
  blobTemp: {
    backgroundColor: '#F59E0B',
  },
  playBtn: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 20,
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  liveTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
    zIndex: 20,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  liveText: {
    color: '#FCA5A5',
    fontSize: 10,
    fontWeight: '800',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  legendLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  legendBar: {
    flexDirection: 'row',
    width: 140,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  legendStep: {
    flex: 1,
    height: '100%',
  },
  legendText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  insightSection: {
    marginBottom: 20,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  insightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
  },
  insightItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 6,
  },
  insightItemDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 10,
  },
  insightColCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 14,
  },
  colTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  colValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  colSub: {
    fontSize: 10,
    color: '#64748B',
  },
});
