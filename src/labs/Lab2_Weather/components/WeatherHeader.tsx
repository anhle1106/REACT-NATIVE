import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LocationInfo } from '../types/weather';

interface WeatherHeaderProps {
  location: LocationInfo;
  lastUpdated: string;
  onRefresh: () => void;
  onOpenSearch: () => void;
  onRequestGPS: () => void;
  warningMessage?: string;
  onDismissWarning?: () => void;
}

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  location,
  lastUpdated,
  onRefresh,
  onOpenSearch,
  onRequestGPS,
  warningMessage,
  onDismissWarning,
}) => {
  return (
    <View style={styles.container}>
      {warningMessage && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>⚠️ {warningMessage}</Text>
          <View style={styles.warningActions}>
            <TouchableOpacity
              style={styles.permissionBtn}
              onPress={onRequestGPS}
              activeOpacity={0.8}
            >
              <Text style={styles.permissionBtnText}>Cấp quyền GPS</Text>
            </TouchableOpacity>
            {onDismissWarning && (
              <TouchableOpacity
                style={styles.closeWarningBtn}
                onPress={onDismissWarning}
              >
                <Text style={styles.closeWarningText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <View style={styles.topRow}>
        <View style={styles.locationContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.cityName} numberOfLines={1}>
              {location.name}
            </Text>
            {location.isCurrentLocation && (
              <View style={styles.gpsBadge}>
                <Text style={styles.gpsBadgeText}>📍 GPS</Text>
              </View>
            )}
          </View>
          <Text style={styles.subText}>
            {location.admin1 && location.admin1 !== location.name
              ? `${location.admin1}, `
              : ''}
            {location.country} • Cập nhật {lastUpdated}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onRequestGPS}
            activeOpacity={0.7}
            accessibilityLabel="Định vị GPS"
          >
            <Text style={styles.btnIcon}>🎯</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onOpenSearch}
            activeOpacity={0.7}
            accessibilityLabel="Tìm kiếm thành phố"
          >
            <Text style={styles.btnIcon}>🔍</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onRefresh}
            activeOpacity={0.7}
            accessibilityLabel="Làm mới thời tiết"
          >
            <Text style={styles.btnIcon}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  warningBanner: {
    backgroundColor: 'rgba(245, 158, 11, 0.92)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'column',
    gap: 8,
  },
  warningText: {
    color: '#78350F',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  warningActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  permissionBtn: {
    backgroundColor: '#78350F',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  permissionBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  closeWarningBtn: {
    padding: 4,
  },
  closeWarningText: {
    color: '#78350F',
    fontSize: 14,
    fontWeight: '700',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationContainer: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cityName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  gpsBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  gpsBadgeText: {
    color: '#A7F3D0',
    fontSize: 10,
    fontWeight: '700',
  },
  subText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  btnIcon: {
    fontSize: 16,
  },
});
