import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Calendar from './pages/Calendar';
import UserDetails from './pages/UserDetails';
import Login from './pages/Login';
import ManageAgents from './pages/ManageAgents';

const App: React.FC = () => {
  const { user } = useUser();

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
            <Route path="leads" element={<Leads />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="user-details" element={<UserDetails />} />
            {user.role === 'admin' && <Route path="manage-agents" element={<ManageAgents />} />}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;