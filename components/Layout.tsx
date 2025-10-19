import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ToastContainer from './ToastContainer';
import { useTasks } from '../contexts/TasksContext';
import { TaskStatus } from '../types';

const Layout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const { filteredTasks } = useTasks();

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    // 1. Request notification permission on component mount
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // 2. Set up an interval to check for task notifications
    const checkTasks = () => {
      if ('Notification' in window && Notification.permission === 'granted') {
        const todayStr = new Date().toISOString().split('T')[0];
        const notifiedTasks = JSON.parse(sessionStorage.getItem('notifiedTasks') || '[]');

        filteredTasks.forEach(task => {
          // FIX: The property is `dueDateTime`, not `dueDate`. Compare just the date part.
          if (task.dueDateTime.split('T')[0] === todayStr && task.status !== TaskStatus.DONE && !notifiedTasks.includes(task.id)) {
            new Notification('CRM Task Reminder', {
              body: `Task due today: "${task.title}"`,
              icon: '/vite.svg', // You can use a more specific icon
            });
            // Add to session storage to prevent re-notifying in the same session
            sessionStorage.setItem('notifiedTasks', JSON.stringify([...notifiedTasks, task.id]));
          }
        });
      }
    };

    const intervalId = setInterval(checkTasks, 60000); // Check every 60 seconds

    // Initial check
    checkTasks();

    // 3. Clean up the interval on component unmount
    return () => clearInterval(intervalId);

  }, [filteredTasks]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Layout;