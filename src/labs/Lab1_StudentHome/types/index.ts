export interface StudentProfile {
  id: string;
  name: string;
  studentCode: string;
  greeting: string;
  avatarUrl: string;
  unreadNotifications: number;
}

export interface StatItem {
  id: string;
  title: string;
  value: number | string;
  unit?: string;
  icon: string;
  backgroundColor: string;
  iconColor: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  instructor: string;
  lessonCount: number;
  completedLessons: number;
  progressPercent: number;
  imageUrl: string;
  icon: string;
  category: string;
}

export type BottomTabKey = 'home' | 'subjects' | 'assignments' | 'profile';

export interface BottomTabItem {
  key: BottomTabKey;
  label: string;
  icon: string;
  activeIcon: string;
}
