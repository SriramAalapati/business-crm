import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { LeadsProvider } from './contexts/LeadsContext';
import { ToastProvider } from './contexts/ToastContext';
import { TasksProvider } from './contexts/TasksContext';
import { AgentsProvider } from './contexts/AgentsContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <UserProvider>
        <ToastProvider>
          <LeadsProvider>
            <TasksProvider>
              <AgentsProvider>
                <App />
              </AgentsProvider>
            </TasksProvider>
          </LeadsProvider>
        </ToastProvider>
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>
);