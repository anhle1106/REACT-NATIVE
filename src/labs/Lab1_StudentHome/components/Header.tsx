import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeColors } from '../constants/colors';
import { StudentProfile } from '../types';

interface HeaderProps {
  student: StudentProfile;
  colors: ThemeColors;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onPressNotification?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  colors,
  isDarkMode,
  onToggleDarkMode,
  onPressNotification,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={[styles.avatarWrapper, { borderColor: colors.primary }]}>
          <Image
            source={{ uri: student.avatarUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
        <View style={styles.infoWrapper}>
          <Text style={[styles.greetingText, { color: colors.textSecondary }]}>
            {student.greeting}
          </Text>
          <Text style={[styles.nameText, { color: colors.textPrimary }]}>
            {student.name}
          </Text>
          <Text style={[styles.codeBadge, { color: colors.primary, backgroundColor: colors.primaryLight }]}>
            {student.studentCode}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.inputBackground }]}
          onPress={onToggleDarkMode}
          activeOpacity={0.7}
        >
          <Text style={styles.actionEmoji}>{isDarkMode ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.inputBackground }]}
          onPress={onPressNotification}
          activeOpacity={0.7}
        >
          <Text style={styles.actionEmoji}>🔔</Text>
          {student.unreadNotifications > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>
                {student.unreadNotifications > 9 ? '9+' : student.unreadNotifications}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    padding: 2,
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  codeBadge: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 3,
    overflow: 'hidden',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  actionEmoji: {
    fontSize: 18,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
