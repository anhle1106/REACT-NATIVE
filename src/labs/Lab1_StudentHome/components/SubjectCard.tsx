import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeColors } from '../constants/colors';
import { SubjectItem } from '../types';

interface SubjectCardProps {
  subject: SubjectItem;
  colors: ThemeColors;
  onPress: (subject: SubjectItem) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  colors,
  onPress,
}) => {
  const isCompleted = subject.progressPercent >= 100;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        },
      ]}
      onPress={() => onPress(subject)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: subject.imageUrl }}
            style={styles.subjectImage}
            resizeMode="cover"
          />
          <View style={styles.iconOverlay}>
            <Text style={styles.iconText}>{subject.icon}</Text>
          </View>
        </View>

        <View style={styles.infoWrapper}>
          <View style={styles.categoryRow}>
            <Text
              style={[
                styles.categoryBadge,
                {
                  color: colors.primary,
                  backgroundColor: colors.primaryLight,
                },
              ]}
            >
              {subject.category} • {subject.code}
            </Text>

            {isCompleted && (
              <View
                style={[
                  styles.completedBadge,
                  { backgroundColor: colors.badgeSuccessBg },
                ]}
              >
                <Text
                  style={[
                    styles.completedBadgeText,
                    { color: colors.badgeSuccessText },
                  ]}
                >
                  ✓ Đã hoàn thành
                </Text>
              </View>
            )}
          </View>

          <Text
            style={[styles.subjectName, { color: colors.textPrimary }]}
            numberOfLines={2}
          >
            {subject.name}
          </Text>

          <Text style={[styles.instructorText, { color: colors.textSecondary }]}>
            Giảng viên: {subject.instructor}
          </Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressMeta}>
          <Text style={[styles.lessonsText, { color: colors.textSecondary }]}>
            📖 {subject.completedLessons}/{subject.lessonCount} bài học
          </Text>
          <Text
            style={[
              styles.percentText,
              {
                color: isCompleted
                  ? colors.progressCompleted
                  : colors.primary,
              },
            ]}
          >
            {subject.progressPercent}%
          </Text>
        </View>

        <View
          style={[
            styles.progressTrack,
            { backgroundColor: colors.progressTrack },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(subject.progressPercent, 100)}%`,
                backgroundColor: isCompleted
                  ? colors.progressCompleted
                  : colors.progressFill,
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 14,
    backgroundColor: '#E2E8F0',
  },
  subjectImage: {
    width: '100%',
    height: '100%',
  },
  iconOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 6,
    paddingHorizontal: 2,
  },
  iconText: {
    fontSize: 12,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 4,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    textTransform: 'uppercase',
  },
  completedBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 3,
  },
  instructorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  lessonsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  percentText: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
