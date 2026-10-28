import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TaskCategory,
  TaskPriority,
} from '../types/task';
import { useTasks } from '../context/TaskContext';
import { validateDueDate } from '../utils/dateUtils';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;

export const TaskFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { addTask, updateTask } = useTasks();

  const existingTask = route.params?.task;
  const isEditing = !!existingTask;

  const [title, setTitle] = useState<string>(existingTask?.title || '');
  const [note, setNote] = useState<string>(existingTask?.note || '');
  const [category, setCategory] = useState<TaskCategory>(
    (existingTask?.category as TaskCategory) || 'Học tập'
  );
  const [priority, setPriority] = useState<TaskPriority>(
    (existingTask?.priority as TaskPriority) || 'Trung bình'
  );
  const [dueDate, setDueDate] = useState<string>(existingTask?.dueDate || '');

  const [errors, setErrors] = useState<{
    title?: string;
    dueDate?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: { title?: string; dueDate?: string } = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Tên công việc không được để trống';
    } else if (trimmedTitle.length > 50) {
      newErrors.title = `Tên công việc không được quá 50 ký tự (hiện có ${trimmedTitle.length} ký tự)`;
    }

    const dateError = validateDueDate(dueDate, isEditing);
    if (dateError) {
      newErrors.dueDate = dateError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý lưu công việc
  const handleSave = async () => {
    if (!validateForm()) return;

    if (isEditing && existingTask) {
      await updateTask({
        ...existingTask,
        title: title.trim(),
        note: note.trim(),
        category,
        priority,
        dueDate: dueDate.trim(),
      });
      Alert.alert('Thành công', 'Cập nhật công việc thành công!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      await addTask({
        title: title.trim(),
        note: note.trim(),
        category,
        priority,
        dueDate: dueDate.trim(),
      });
      Alert.alert('Thành công', 'Thêm công việc mới thành công!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Tên công việc <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Text style={styles.charCount}>
                {title.length}/50 ký tự
              </Text>
            </View>
            <TextInput
              style={[styles.input, errors.title ? styles.inputError : null]}
              placeholder="Ví dụ: Nộp bài tập lớn..."
              placeholderTextColor={colors.textMuted}
              value={title}
              maxLength={50}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Danh mục công việc</Text>
            <View style={styles.buttonGroup}>
              {TASK_CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.choiceButton,
                      isSelected && styles.choiceButtonActive,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.choiceText,
                        isSelected && styles.choiceTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mức độ ưu tiên</Text>
            <View style={styles.buttonGroup}>
              {TASK_PRIORITIES.map((p) => {
                const isSelected = priority === p;
                let activeColor = colors.primary;
                if (p === 'Cao') activeColor = colors.priorityHigh;
                if (p === 'Trung bình') activeColor = colors.priorityMedium;
                if (p === 'Thấp') activeColor = colors.priorityLow;

                return (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.choiceButton,
                      isSelected && {
                        backgroundColor: activeColor,
                        borderColor: activeColor,
                      },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => setPriority(p)}
                  >
                    <Text
                      style={[
                        styles.choiceText,
                        isSelected && styles.choiceTextActive,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Hạn hoàn thành (dd/mm/yyyy){' '}
              <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.dueDate ? styles.inputError : null]}
              placeholder="Ví dụ: 30/11/2026"
              placeholderTextColor={colors.textMuted}
              value={dueDate}
              keyboardType="numbers-and-punctuation"
              maxLength={10}
              onChangeText={(text) => {
                setDueDate(text);
                if (errors.dueDate) setErrors({ ...errors, dueDate: undefined });
              }}
            />
            {errors.dueDate && (
              <Text style={styles.errorText}>{errors.dueDate}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ghi chú thêm (không bắt buộc)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Nhập ghi chú chi tiết công việc..."
              placeholderTextColor={colors.textMuted}
              value={note}
              multiline
              numberOfLines={3}
              onChangeText={setNote}
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.saveBtn}
              activeOpacity={0.8}
              onPress={handleSave}
            >
              <Text style={styles.saveBtnText}>
                {isEditing ? 'Lưu thay đổi' : 'Tạo công việc'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelBtnText}>Huỷ bỏ</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  formGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  charCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
  requiredStar: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingVertical: 10,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  // Nút bấm chọn danh mục và mức ưu tiên (Câu 2)
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  choiceButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    marginRight: 8,
    marginBottom: 8,
  },
  choiceButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  choiceText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  choiceTextActive: {
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 16,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveBtnText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
