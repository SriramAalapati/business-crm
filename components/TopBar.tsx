
import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiBell, FiSun, FiMoon, FiLogOut } from 'react-icons/fi';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLeads } from '../contexts/LeadsContext';
import { useLocation } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';

const TopBar: React.FC = () => {
  const { user, signOut } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { setSearchTerm, searchTerm } = useLeads();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
      setSearchTerm(debouncedSearch);
  }, [debouncedSearch, setSearchTerm]);

  useEffect(() => {
    // Clear search when navigating away from leads page
    if (location.pathname !== '/leads') {
      setLocalSearch('');
      setSearchTerm('');
    }
  }, [location.pathname, setSearchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearch(e.target.value);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        {location.pathname === '/leads' && (
          <div className="relative">
            <FiSearch className="absolute w-5 h-5 text-gray-400 top-1/2 left-3 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads..."
              value={localSearch}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-64 text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
          {theme === 'light' ? <FiMoon className="w-6 h-6" /> : <FiSun className="w-6 h-6" />}
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 relative">
          <FiBell className="w-6 h-6" />
          <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(!isMenuOpen)} className="flex items-center space-x-2">
            <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full" />
            <div className="text-left hidden md:block">
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
            </div>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700">
              <button
                onClick={signOut}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiLogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
