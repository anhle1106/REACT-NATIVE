import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WeatherTab } from '../types/weather';

interface WeatherNavBarProps {
  activeTab: WeatherTab;
  onSelectTab: (tab: WeatherTab) => void;
}

export const WeatherNavBar: React.FC<WeatherNavBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs: { key: WeatherTab; label: string; icon: string }[] = [
    { key: 'forecast', label: 'Dự báo', icon: '☀️' },
    { key: 'search', label: 'Địa điểm', icon: '🔍' },
    { key: 'metrics', label: 'Radar', icon: '📡' },
    { key: 'settings', label: 'Cài đặt', icon: '⚙️' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onSelectTab(tab.key)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconWrap,
                isActive && styles.iconWrapActive,
              ]}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
            </View>
            <Text
              style={[
                styles.tabLabel,
                isActive ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={styles.indicatorDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 68,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 4,
    paddingTop: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 36,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.35)',
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  tabLabelInactive: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  indicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#38BDF8',
    marginTop: 2,
  },
});
