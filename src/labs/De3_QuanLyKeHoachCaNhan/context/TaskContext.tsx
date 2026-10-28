import React, { createContext, useContext, useEffect, useState } from 'react';
import { Task } from '../types/task';
import { loadTasksFromStorage, saveTasksToStorage } from '../storage/taskStorage';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (newTaskData: Omit<Task, 'id' | 'done'>) => Promise<void>;
  updateTask: (updatedTask: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  deleteCompletedTasks: () => Promise<number>;
  toggleTaskDone: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const stored = await loadTasksFromStorage();
        setTasks(stored);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (newTaskData: Omit<Task, 'id' | 'done'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now().toString(),
      done: false,
    };
    const updatedList = [newTask, ...tasks];
    setTasks(updatedList);
    await saveTasksToStorage(updatedList);
  };

  const updateTask = async (updatedTask: Task) => {
    const updatedList = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(updatedList);
    await saveTasksToStorage(updatedList);
  };

  const deleteTask = async (id: string) => {
    const updatedList = tasks.filter((t) => t.id !== id);
    setTasks(updatedList);
    await saveTasksToStorage(updatedList);
  };

  const deleteCompletedTasks = async (): Promise<number> => {
    const completedCount = tasks.filter((t) => t.done).length;
    if (completedCount === 0) return 0;

    const remainingTasks = tasks.filter((t) => !t.done);
    setTasks(remainingTasks);
    await saveTasksToStorage(remainingTasks);
    return completedCount;
  };

  const toggleTaskDone = async (id: string) => {
    const updatedList = tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTasks(updatedList);
    await saveTasksToStorage(updatedList);
  };

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find((t) => t.id === id);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        deleteCompletedTasks,
        toggleTaskDone,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks phải được sử dụng bên trong TaskProvider');
  }
  return context;
};
