import React from 'react';
import { Lab1Screen } from './Lab1_StudentHome';

export interface LabDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  component: React.ComponentType;
}

export const LABS: LabDefinition[] = [
  {
    id: 'lab1',
    code: 'Lab 1',
    title: 'Trang chủ Quản lý Sinh viên',
    description: 'Màn hình chính ứng dụng quản lý sinh viên',
    component: Lab1Screen,
  },
];

export { Lab1Screen };
