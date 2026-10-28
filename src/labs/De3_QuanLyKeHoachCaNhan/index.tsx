import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TaskProvider } from './context/TaskContext';
import { AppNavigator } from './navigation/AppNavigator';

export const PlannerApp: React.FC = () => {
  return (
    <TaskProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </TaskProvider>
  );
};

export default PlannerApp;
