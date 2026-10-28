
export type TaskCategory = 'Học tập' | 'Công việc' | 'Sức khoẻ' | 'Cá nhân';
export const TASK_CATEGORIES: TaskCategory[] = [
  'Học tập',
  'Công việc',
  'Sức khoẻ',
  'Cá nhân',
];

export type TaskPriority = 'Cao' | 'Trung bình' | 'Thấp';
export const TASK_PRIORITIES: TaskPriority[] = ['Cao', 'Trung bình', 'Thấp'];

export interface Task {
  id: string;
  title: string;
  note: string;
  category: string;
  priority: string;
  dueDate: string;
  done: boolean;
}

export type FilterStatus = 'Tất cả' | 'Chưa xong' | 'Đã xong' | 'Quá hạn';

export type SortOption = 'dueDate' | 'priority';

export type RootStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId: string };
  TaskForm: { task?: Task };
};
