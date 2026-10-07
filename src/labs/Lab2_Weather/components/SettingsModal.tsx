import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { AppSettings, TemperatureUnit, WindSpeedUnit } from '../types/weather';

interface SettingsModalProps {
  visible: boolean;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const setTempUnit = (unit: TemperatureUnit) => {
    onUpdateSettings({ ...settings, tempUnit: unit });
  };

  const setWindUnit = (unit: WindSpeedUnit) => {
    onUpdateSettings({ ...settings, windUnit: unit });
  };

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
              <View style={styles.dragIndicator} />

              <View style={styles.header}>
                <Text style={styles.title}>Cài đặt ứng dụng</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scrollBody}
                showsVerticalScrollIndicator={false}
              >
                {/* 1. Đơn vị nhiệt độ */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>ĐƠN VỊ NHIỆT ĐỘ</Text>
                  <View style={styles.segmentedControl}>
                    <TouchableOpacity
                      style={[
                        styles.segmentBtn,
                        settings.tempUnit === 'celsius' &&
                          styles.segmentBtnActive,
                      ]}
                      onPress={() => setTempUnit('celsius')}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          settings.tempUnit === 'celsius' &&
                            styles.segmentTextActive,
                        ]}
                      >
                        Độ C (°C)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.segmentBtn,
                        settings.tempUnit === 'fahrenheit' &&
                          styles.segmentBtnActive,
                      ]}
                      onPress={() => setTempUnit('fahrenheit')}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          settings.tempUnit === 'fahrenheit' &&
                            styles.segmentTextActive,
                        ]}
                      >
                        Độ F (°F)
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 2. Đơn vị gió */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>ĐƠN VỊ TỐC ĐỘ GIÓ</Text>
                  <View style={styles.segmentedControl}>
                    <TouchableOpacity
                      style={[
                        styles.segmentBtn,
                        settings.windUnit === 'kmh' && styles.segmentBtnActive,
                      ]}
                      onPress={() => setWindUnit('kmh')}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          settings.windUnit === 'kmh' &&
                            styles.segmentTextActive,
                        ]}
                      >
                        km/h
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.segmentBtn,
                        settings.windUnit === 'ms' && styles.segmentBtnActive,
                      ]}
                      onPress={() => setWindUnit('ms')}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          settings.windUnit === 'ms' &&
                            styles.segmentTextActive,
                        ]}
                      >
                        m/s
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 3. Nguồn dữ liệu & Thông tin API */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>NGUỒN DỮ LIỆU & API</Text>
                  <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Nguồn API:</Text>
                      <Text style={styles.infoValue}>Open-Meteo WMO Live</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Địa lý Geocoding:</Text>
                      <Text style={styles.infoValue}>Open-Meteo Geocoding</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Vị trí GPS:</Text>
                      <Text style={styles.infoValue}>Định vị chuẩn thiết bị</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Thời gian thực:</Text>
                      <Text style={styles.infoValue}>Có (Hỗ trợ 24h & 7 ngày)</Text>
                    </View>
                  </View>
                </View>

                {/* 4. Giới thiệu bài tập */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>THÔNG TIN ỨNG DỤNG</Text>
                  <View style={styles.infoCard}>
                    <Text style={styles.appName}>
                      Ứng Dụng Dự Báo Thời Tiết (Lab 2)
                    </Text>
                    <Text style={styles.appDesc}>
                      Dự án thực hành môn Lập trình Thiết bị Di động (React Native). Hỗ trợ xem thời tiết thực tế theo vị trí hiện tại, dự báo 24 giờ, dự báo 7 ngày, theo dõi 8 chỉ số thời tiết chi tiết, tìm kiếm mọi thành phố và radar khí tượng.
                    </Text>
                  </View>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.doneBtn}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.doneBtnText}>Lưu & Đóng</Text>
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
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
    maxHeight: '85%',
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
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollBody: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#2563EB',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoLabel: {
    fontSize: 13,
    color: '#94A3B8',
  },
  infoValue: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  appName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 6,
  },
  appDesc: {
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
