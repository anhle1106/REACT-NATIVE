import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  RootStackParamList,
  Task,
  FilterStatus,
  SortOption,
} from '../types/task';
import { useTasks } from '../context/TaskContext';
import { isTaskOverdue, parseDate } from '../utils/dateUtils';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

export const TaskListScreen: React.FC<Props> = ({ navigation }) => {
  const { tasks, toggleTaskDone, deleteTask, deleteCompletedTasks } = useTasks();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('Tất cả');
  const [sortOption, setSortOption] = useState<SortOption>('dueDate');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.done).length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredAndSortedTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        task.title.toLowerCase().includes(searchQuery.trim().toLowerCase());

      let matchFilter = true;
      if (filterStatus === 'Chưa xong') {
        matchFilter = !task.done;
      } else if (filterStatus === 'Đã xong') {
        matchFilter = task.done;
      } else if (filterStatus === 'Quá hạn') {
        matchFilter = isTaskOverdue(task.dueDate, task.done);
      }

      return matchSearch && matchFilter;
    });

    result.sort((a, b) => {
      if (sortOption === 'dueDate') {
        const dateA = parseDate(a.dueDate)?.getTime() || 0;
        const dateB = parseDate(b.dueDate)?.getTime() || 0;
        return dateA - dateB;
      } else {
        // Trọng số mức ưu tiên: Cao (3) > Trung bình (2) > Thấp (1)
        const priorityWeight: Record<string, number> = {
          Cao: 3,
          'Trung bình': 2,
          Thấp: 1,
        };
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        return weightB - weightA;
      }
    });

    return result;
  }, [tasks, searchQuery, filterStatus, sortOption]);

  const handleLongPressTask = (task: Task) => {
    Alert.alert(
      'Xác nhận xoá công việc',
      `Bạn có chắc chắn muốn xoá công việc "${task.title}" không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
            Alert.alert('Thành công', 'Đã xoá công việc thành công!');
          },
        },
      ]
    );
  };

  const handleDeleteCompleted = () => {
    if (completedTasks === 0) return;

    Alert.alert(
      'Xoá việc đã hoàn thành',
      `Bạn có chắc chắn muốn xoá toàn bộ ${completedTasks} công việc đã hoàn thành không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá tất cả',
          style: 'destructive',
          onPress: async () => {
            const count = await deleteCompletedTasks();
            Alert.alert('Thành công', `Đã xoá ${count} công việc hoàn thành!`);
          },
        },
      ]
    );
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Cao':
        return { color: colors.priorityHigh, bg: colors.priorityHighBg };
      case 'Trung bình':
        return { color: colors.priorityMedium, bg: colors.priorityMediumBg };
      default:
        return { color: colors.priorityLow, bg: colors.priorityLowBg };
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => {
    const isOverdue = isTaskOverdue(item.dueDate, item.done);
    const pStyle = getPriorityStyle(item.priority);

    return (
      <TouchableOpacity
        style={[styles.taskCard, item.done && styles.taskCardDone]}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
        onLongPress={() => handleLongPressTask(item)}
      >
        <View style={styles.cardMainRow}>
          <TouchableOpacity
            style={[styles.checkbox, item.done && styles.checkboxChecked]}
            activeOpacity={0.8}
            onPress={() => toggleTaskDone(item.id)}
          >
            {item.done && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>

          <View style={styles.taskContent}>
            <Text
              style={[
                styles.taskTitle,
                item.done && styles.taskTitleDone,
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>

            <View style={styles.subInfoRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>

              <Text style={styles.dueDateText}>Hạn: {item.dueDate}</Text>
            </View>
          </View>

          <View style={styles.badgeColumn}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: pStyle.bg },
              ]}
            >
              <Text style={[styles.priorityBadgeText, { color: pStyle.color }]}>
                {item.priority}
              </Text>
            </View>

            {isOverdue && (
              <View style={styles.overdueBadge}>
                <Text style={styles.overdueBadgeText}>Quá hạn</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const statusFilters: FilterStatus[] = [
    'Tất cả',
    'Chưa xong',
    'Đã xong',
    'Quá hạn',
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Tiến độ công việc</Text>
          <Text style={styles.progressCount}>
            Đã hoàn thành {completedTasks}/{totalTasks} công việc ({progressPercent}%)
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm công việc theo tên..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearSearchBtn}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterAndSortSection}>
        <View style={styles.filterRow}>
          {statusFilters.map((status) => {
            const isSelected = filterStatus === status;
            return (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterBtn,
                  isSelected && styles.filterBtnActive,
                ]}
                activeOpacity={0.7}
                onPress={() => setFilterStatus(status)}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    isSelected && styles.filterBtnTextActive,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sắp xếp:</Text>
          <TouchableOpacity
            style={[
              styles.sortBtn,
              sortOption === 'dueDate' && styles.sortBtnActive,
            ]}
            onPress={() => setSortOption('dueDate')}
          >
            <Text
              style={[
                styles.sortBtnText,
                sortOption === 'dueDate' && styles.sortBtnTextActive,
              ]}
            >
              Hạn gần nhất
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortBtn,
              sortOption === 'priority' && styles.sortBtnActive,
            ]}
            onPress={() => setSortOption('priority')}
          >
            <Text
              style={[
                styles.sortBtnText,
                sortOption === 'priority' && styles.sortBtnTextActive,
              ]}
            >
              Mức ưu tiên
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.hintBar}>
        <Text style={styles.hintText}>
          * Chạm checkbox để hoàn thành • Chạm vào thẻ xem chi tiết • Nhấn giữ để xoá
        </Text>
      </View>

      <FlatList
        data={filteredAndSortedTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Không có công việc nào</Text>
            <Text style={styles.emptySubtitle}>
              Danh sách hiện tại trống hoặc không khớp với bộ lọc tìm kiếm.
            </Text>
          </View>
        }
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.deleteCompletedBtn,
            completedTasks === 0 && styles.btnDisabled,
          ]}
          disabled={completedTasks === 0}
          activeOpacity={0.7}
          onPress={handleDeleteCompleted}
        >
          <Text
            style={[
              styles.deleteCompletedText,
              completedTasks === 0 && styles.btnTextDisabled,
            ]}
          >
            Xoá việc đã xong ({completedTasks})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addTaskBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('TaskForm', {})}
        >
          <Text style={styles.addTaskText}>+ Thêm việc</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Thẻ tiến độ
  progressCard: {
    backgroundColor: colors.cardBackground,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  progressCount: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  // Ô tìm kiếm
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: colors.textPrimary,
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchText: {
    color: colors.textMuted,
    fontWeight: 'bold',
  },
  // Lọc và Sắp xếp
  filterAndSortSection: {
    marginHorizontal: 16,
    marginBottom: 6,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 2,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterBtnText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterBtnTextActive: {
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 6,
  },
  sortBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
  },
  sortBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  sortBtnText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  sortBtnTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  // Gợi ý
  hintBar: {
    paddingHorizontal: 18,
    marginBottom: 6,
  },
  hintText: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  // Danh sách
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 85,
  },
  taskCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  taskCardDone: {
    backgroundColor: '#F1F5F9',
    opacity: 0.75,
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  // Checkbox tự vẽ (Câu 1)
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
    backgroundColor: colors.cardBackground,
  },
  checkboxChecked: {
    backgroundColor: colors.completed,
    borderColor: colors.completed,
  },
  checkmark: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dueDateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  badgeColumn: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  priorityBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  overdueBadge: {
    backgroundColor: colors.overdueBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.overdue,
  },
  overdueBadgeText: {
    color: colors.overdue,
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8,
  },
  deleteCompletedBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  deleteCompletedText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: 'bold',
  },
  addTaskBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addTaskText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnDisabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  btnTextDisabled: {
    color: colors.disabledText,
  },
});
