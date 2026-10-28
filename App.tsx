import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlannerApp } from './src/labs/De3_QuanLyKeHoachCaNhan';

export default function App() {
  return (
    <SafeAreaProvider>
      <PlannerApp />
    </SafeAreaProvider>
  );
}
