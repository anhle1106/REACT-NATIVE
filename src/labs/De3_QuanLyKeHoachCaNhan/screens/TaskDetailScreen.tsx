import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/task';
import { useTasks } from '../context/TaskContext';
import { getDueStatusText, isTaskOverdue } from '../utils/dateUtils';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { getTaskById, toggleTaskDone, deleteTask } = useTasks();

  const task = getTaskById(taskId);

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Không tìm thấy công việc này!</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Quay lại danh sách</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isOverdue = isTaskOverdue(task.dueDate, task.done);
  const remainingText = getDueStatusText(task.dueDate);

  // Xoá công việc từ màn hình chi tiết
  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc chắn muốn xoá công việc "${task.title}" không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const getPriorityColor = (p: string) => {
    if (p === 'Cao') return colors.priorityHigh;
    if (p === 'Trung bình') return colors.priorityMedium;
    return colors.priorityLow;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{task.title}</Text>

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.statusBadge,
                task.done ? styles.statusDone : styles.statusPending,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  task.done ? styles.statusDoneText : styles.statusPendingText,
                ]}
              >
                {task.done ? '✓ Đã hoàn thành' : 'Chưa hoàn thành'}
              </Text>
            </View>

            {isOverdue && (
              <View style={styles.overdueBadge}>
                <Text style={styles.overdueBadgeText}>Quá hạn</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Danh mục:</Text>
            <Text style={styles.infoValue}>{task.category}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mức độ ưu tiên:</Text>
            <Text
              style={[
                styles.infoValue,
                { color: getPriorityColor(task.priority), fontWeight: 'bold' },
              ]}
            >
              {task.priority}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hạn hoàn thành:</Text>
            <Text style={styles.infoValue}>{task.dueDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Thời gian:</Text>
            <Text
              style={[
                styles.infoValue,
                isOverdue
                  ? { color: colors.overdue, fontWeight: 'bold' }
                  : { color: colors.primary, fontWeight: '600' },
              ]}
            >
              {remainingText}
            </Text>
          </View>

          <View style={styles.noteSection}>
            <Text style={styles.noteLabel}>Ghi chú:</Text>
            <Text style={styles.noteContent}>
              {task.note && task.note.trim()
                ? task.note
                : '(Không có ghi chú thêm)'}
            </Text>
          </View>
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              task.done ? styles.btnUndo : styles.btnComplete,
            ]}
            activeOpacity={0.8}
            onPress={() => toggleTaskDone(task.id)}
          >
            <Text style={styles.actionBtnText}>
              {task.done ? 'Đánh dấu Chưa hoàn thành' : '✓ Đánh dấu Hoàn thành'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('TaskForm', { task })}
          >
            <Text style={styles.editBtnText}>Chỉnh sửa công việc</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.8}
            onPress={handleDelete}
          >
            <Text style={styles.deleteBtnText}>Xoá công việc này</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    lineHeight: 26,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  statusBadgeText: {
    fontSize: 12,
  },
  statusDone: {
    backgroundColor: colors.completedBg,
  },
  statusDoneText: {
    color: colors.completed,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusPending: {
    backgroundColor: '#F1F5F9',
  },
  statusPendingText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  overdueBadge: {
    backgroundColor: colors.overdueBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.overdue,
  },
  overdueBadgeText: {
    color: colors.overdue,
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  noteSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  noteContent: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  // Nút hành động
  actionsCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },
  actionBtn: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnComplete: {
    backgroundColor: colors.completed,
  },
  btnUndo: {
    backgroundColor: colors.primary,
  },
  actionBtnText: {
    color: colors.textWhite,
    fontSize: 15,
    fontWeight: 'bold',
  },
  editBtn: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  editBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: colors.textWhite,
    fontWeight: 'bold',
  },
});
