import React, { createContext, useState, useContext, useMemo } from 'react';
import { Task, AppProviderProps, Priority, TaskStatus } from '../types';
import { INITIAL_TASKS } from '../constants';
import { useUser } from './UserContext';
import { useToast } from './ToastContext';

interface TasksContextType {
  tasks: Task[];
  addTask: (newTaskData: Omit<Task, 'id'>) => void;
  editTask: (updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;

  filteredTasks: Task[];
  // Add filters and sorting later if needed
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useUser();
  const { addToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const addTask = (newTaskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
    };
    setTasks(prev => [newTask, ...prev]);
    addToast('Task added successfully!', 'success');
  };
  
  const editTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    addToast('Task updated!', 'info');
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    addToast('Task deleted.', 'error');
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
  };
  
  const filteredTasks = useMemo(() => {
    let processTasks = [...tasks];
    if (user?.role === 'agent') {
      processTasks = processTasks.filter(task => task.assignedTo === user.name);
    }
    // Simple sort by due date
    processTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    return processTasks;
  }, [tasks, user]);

  return (
    <TasksContext.Provider value={{ 
        tasks,
        addTask,
        editTask,
        deleteTask,
        updateTaskStatus,
        filteredTasks
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};