import React, { createContext, useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { Task, AppProviderProps, TaskStatus } from '../types';
import { useUser } from './UserContext';
import { useToast } from './ToastContext';
import { api } from '../apiCaller';

interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (newTaskData: Omit<Task, 'id'>) => Promise<void>;
  editTask: (updatedTask: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  filteredTasks: Task[];
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useUser();
  const { addToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const path = `/tasks?role=${user.role}&name=${user.name}`;
      const response = await api.get<{ tasks: Task[] }>(path);
      setTasks(response.tasks);
    } catch (error) {
      addToast('Failed to fetch tasks.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user, addToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (newTaskData: Omit<Task, 'id'>) => {
    try {
      const { task } = await api.post<{ task: Task }>('/tasks', newTaskData);
      setTasks(prev => [task, ...prev]);
      addToast('Task added successfully!', 'success');
    } catch (error) {
      addToast('Failed to add task.', 'error');
    }
  };
  
  const editTask = async (updatedTask: Task) => {
    try {
      const { task } = await api.put<{ task: Task }>(`/tasks/${updatedTask.id}`, updatedTask);
      setTasks(prev => prev.map(t => (t.id === task.id ? task : t)));
      addToast('Task updated!', 'info');
    } catch (error) {
      addToast('Failed to update task.', 'error');
    }
  };

  const deleteTask = async (taskId: string) => {
    const originalTasks = [...tasks];
    setTasks(prev => prev.filter(task => task.id !== taskId));
    try {
      await api.delete(`/tasks/${taskId}`);
      addToast('Task deleted.', 'error');
    } catch (error) {
      setTasks(originalTasks);
      addToast('Failed to delete task.', 'error');
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) return;
      
      const updatedTask = { ...taskToUpdate, status: newStatus };
      await editTask(updatedTask);
  };
  
  const filteredTasks = useMemo(() => {
    let processTasks = [...tasks];
    // Filtering is handled by the API, but sort chronologically on the client
    processTasks.sort((a, b) => new Date(a.dueDateTime).getTime() - new Date(b.dueDateTime).getTime());
    return processTasks;
  }, [tasks]);

  return (
    <TasksContext.Provider value={{ 
        tasks,
        loading,
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