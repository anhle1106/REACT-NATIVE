import React from 'react';
import { Lab1Screen } from './Lab1_StudentHome';
import { WeatherScreen } from './Lab2_Weather';
import { ChatApp } from './Lab3_Chat';
import { PlannerApp } from './De3_QuanLyKeHoachCaNhan';

export interface LabDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  component: React.ComponentType;
}

export const LABS: LabDefinition[] = [
  {
    id: 'de3_planner',
    code: 'Đề 3',
    title: 'Ứng dụng Quản lý Kế hoạch Cá nhân',
    description: 'Quản lý công việc, tiến độ, lọc trạng thái, sắp xếp, cảnh báo quá hạn',
    component: PlannerApp,
  },
  {
    id: 'lab_chat',
    code: 'Lab 3',
    title: 'Ứng dụng Chat (3 Màn hình)',
    description: 'Đăng nhập, danh sách tin nhắn Messenger, chi tiết cuộc trò chuyện 2 bên',
    component: ChatApp,
  },
  {
    id: 'lab_weather',
    code: 'Lab 2',
    title: 'Ứng dụng Dự báo Thời tiết',
    description: 'Dữ liệu API thực tế, GPS, dự báo 24 giờ & 7 ngày, 8 chỉ số chi tiết, Radar',
    component: WeatherScreen,
  },
  {
    id: 'lab1',
    code: 'Lab 1',
    title: 'Trang chủ Quản lý Sinh viên',
    description: 'Màn hình chính ứng dụng quản lý sinh viên',
    component: Lab1Screen,
  },
];

export { Lab1Screen, WeatherScreen, ChatApp, PlannerApp };

