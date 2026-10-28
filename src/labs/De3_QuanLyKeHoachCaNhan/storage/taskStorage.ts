import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

const STORAGE_KEY = '@personal_tasks_v3';

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Nộp báo cáo bài tập lớn Lập trình di động',
    note: 'Nộp file nén mã nguồn lên hệ thống của trường trước thời hạn',
    category: 'Học tập',
    priority: 'Cao',
    dueDate: '15/10/2026',
    done: false,
  },
  {
    id: '2',
    title: 'Đi chạy bộ 5km công viên',
    note: 'Rèn luyện sức khoẻ buổi sáng cùng câu lạc bộ',
    category: 'Sức khoẻ',
    priority: 'Trung bình',
    dueDate: '20/10/2026',
    done: true,
  },
  {
    id: '3',
    title: 'Ôn tập thi vấn đáp môn React Native',
    note: 'Đọc kỹ tài liệu các thẻ View, Text, FlatList, Context và AsyncStorage',
    category: 'Học tập',
    priority: 'Cao',
    dueDate: '30/10/2026',
    done: false,
  },
  {
    id: '4',
    title: 'Gửi email báo cáo tiến độ tuần cho quản lý',
    note: 'Tổng hợp các tính năng đã hoàn thiện trong tuần này',
    category: 'Công việc',
    priority: 'Cao',
    dueDate: '28/10/2026',
    done: false,
  },
  {
    id: '5',
    title: 'Mua sách kỹ thuật lập trình TypeScript',
    note: 'Mua tại nhà sách hoặc đặt online',
    category: 'Cá nhân',
    priority: 'Thấp',
    dueDate: '05/11/2026',
    done: false,
  },
  {
    id: '6',
    title: 'Khám sức khoẻ định kỳ tại bệnh viện',
    note: 'Khám tổng quát và kiểm tra mắt',
    category: 'Sức khoẻ',
    priority: 'Trung bình',
    dueDate: '12/11/2026',
    done: false,
  },
];

export const loadTasksFromStorage = async (): Promise<Task[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue !== null) {
      const parsed = JSON.parse(jsonValue);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    await saveTasksToStorage(INITIAL_TASKS);
    return INITIAL_TASKS;
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu công việc:', error);
    return INITIAL_TASKS;
  }
};

export const saveTasksToStorage = async (tasks: Task[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu công việc:', error);
  }
};
