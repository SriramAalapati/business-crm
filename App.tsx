import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Calendar from './pages/Calendar';
import UserDetails from './pages/UserDetails';
import Login from './pages/Login';
import ManageAgents from './pages/ManageAgents';
import Reports from './pages/Reports';
import Tasks from './pages/Tasks';
import Opportunities from './pages/Opportunities';
import { FiLoader } from 'react-icons/fi';
import './app.css';
const App: React.FC = () => {
  const { user, verifyUser, loading } = useUser();
  
  useEffect(() => {
    verifyUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <FiLoader className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="leads" element={<Leads />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="user-details" element={<UserDetails />} />

            {/* Admin-only routes */}
            {user.role === 'admin' && (
              <>
                <Route path="reports" element={<Reports />} />
                <Route path="manage-agents" element={<ManageAgents />} />
              </>
            )}
            
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;