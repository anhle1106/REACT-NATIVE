import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { DailyForecastItem, TemperatureUnit } from '../types/weather';
import { getWeatherCodeInfo } from '../constants/weatherCodes';
import {
  formatTemperature,
  getUVLevelInfo,
} from '../utils/formatters';

interface DayDetailModalProps {
  visible: boolean;
  item: DailyForecastItem | null;
  tempUnit: TemperatureUnit;
  onClose: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  visible,
  item,
  tempUnit,
  onClose,
}) => {
  if (!item) {
    return null;
  }

  const codeInfo = getWeatherCodeInfo(item.weatherCode);
  const uvInfo = getUVLevelInfo(item.uvIndexMax);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Drag Indicator */}
              <View style={styles.dragIndicator} />

              <View style={styles.header}>
                <View>
                  <Text style={styles.dayTitle}>
                    {item.dayName} ({item.displayDate})
                  </Text>
                  <Text style={styles.dateIso}>{item.date}</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scrollBody}
                showsVerticalScrollIndicator={false}
              >
                {/* Hero Condition Section */}
                <View style={styles.heroSection}>
                  <Text style={styles.weatherIconLarge}>{codeInfo.iconDay}</Text>
                  <Text style={styles.weatherDesc}>{codeInfo.description}</Text>
                  <View style={styles.tempRangeRow}>
                    <Text style={styles.tempMaxBig}>
                      ↑ {formatTemperature(item.tempMax, tempUnit)}
                    </Text>
                    <Text style={styles.tempDivider}>/</Text>
                    <Text style={styles.tempMinBig}>
                      ↓ {formatTemperature(item.tempMin, tempUnit)}
                    </Text>
                  </View>
                  <Text style={styles.apparentText}>
                    Cảm nhận: {formatTemperature(item.apparentTempMin, tempUnit)} -{' '}
                    {formatTemperature(item.apparentTempMax, tempUnit)}
                  </Text>
                </View>

                {/* Sun Info (Sunrise / Sunset) */}
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>🌅 Mặt trời mọc & lặn</Text>
                  <View style={styles.sunRow}>
                    <View style={styles.sunItem}>
                      <Text style={styles.sunIcon}>🌅</Text>
                      <Text style={styles.sunLabel}>Bình minh</Text>
                      <Text style={styles.sunTime}>{item.sunrise}</Text>
                    </View>
                    <View style={styles.sunDivider} />
                    <View style={styles.sunItem}>
                      <Text style={styles.sunIcon}>🌇</Text>
                      <Text style={styles.sunLabel}>Hoàng hôn</Text>
                      <Text style={styles.sunTime}>{item.sunset}</Text>
                    </View>
                  </View>
                </View>

                {/* Rain & Wind */}
                <View style={styles.detailGrid}>
                  <View style={styles.smallCard}>
                    <Text style={styles.smallCardIcon}>💧</Text>
                    <Text style={styles.smallCardLabel}>Xác suất mưa</Text>
                    <Text style={styles.smallCardValue}>
                      {item.precipitationProbability}%
                    </Text>
                    <Text style={styles.smallCardSub}>
                      Tổng lượng: {item.precipitationSum} mm
                    </Text>
                  </View>

                  <View style={styles.smallCard}>
                    <Text style={styles.smallCardIcon}>💨</Text>
                    <Text style={styles.smallCardLabel}>Gió giật cực đại</Text>
                    <Text style={styles.smallCardValue}>
                      {item.windSpeedMax} km/h
                    </Text>
                    <Text style={styles.smallCardSub}>
                      {item.windSpeedMax > 25 ? 'Gió khá mạnh' : 'Gió bình thường'}
                    </Text>
                  </View>
                </View>

                {/* UV Level & Advisory */}
                <View style={styles.sectionCard}>
                  <View style={styles.uvHeader}>
                    <Text style={styles.sectionTitle}>☀️ Bức xạ tia cực tím (UV)</Text>
                    <View
                      style={[styles.uvBadge, { backgroundColor: uvInfo.color }]}
                    >
                      <Text style={styles.uvBadgeText}>
                        {uvInfo.label} (Cực đại {item.uvIndexMax})
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.uvAdviceText}>💡 Lời khuyên: {uvInfo.advice}</Text>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.doneBtn}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.doneBtnText}>Đóng chi tiết</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dragIndicator: {
    width: 44,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dateIso: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  scrollBody: {
    marginBottom: 16,
  },
  heroSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
  },
  weatherIconLarge: {
    fontSize: 56,
    marginBottom: 6,
  },
  weatherDesc: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tempRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tempMaxBig: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FCA5A5',
  },
  tempDivider: {
    fontSize: 18,
    color: '#64748B',
  },
  tempMinBig: {
    fontSize: 22,
    fontWeight: '800',
    color: '#93C5FD',
  },
  apparentText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 10,
  },
  sunRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  sunItem: {
    alignItems: 'center',
    flex: 1,
  },
  sunIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  sunLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
  },
  sunTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FDE047',
  },
  sunDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  smallCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 14,
  },
  smallCardIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  smallCardLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  smallCardValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  smallCardSub: {
    fontSize: 10,
    color: '#CBD5E1',
  },
  uvHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  uvBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  uvBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  uvAdviceText: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  doneBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
