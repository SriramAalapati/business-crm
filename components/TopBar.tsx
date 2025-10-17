import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiBell, FiSun, FiMoon, FiLogOut, FiBriefcase, FiClock } from 'react-icons/fi';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLeads } from '../contexts/LeadsContext';
import { useLocation } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';

const TopBar: React.FC = () => {
  const { user, signOut } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { setSearchTerm, searchTerm, filteredLeads, recentSearches, addRecentSearch } = useLeads();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchFocused, setSearchFocused] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
      setSearchTerm(debouncedSearch);
      if (debouncedSearch) {
        addRecentSearch(debouncedSearch);
      }
  }, [debouncedSearch, setSearchTerm, addRecentSearch]);

  useEffect(() => {
    if (location.pathname !== '/leads') {
      setLocalSearch('');
      setSearchTerm('');
      setSearchFocused(false);
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
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (text: string) => {
    setLocalSearch(text);
    setSearchFocused(false);
  }

  const showSuggestions = isSearchFocused && location.pathname === '/leads';

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="flex items-center">
        {location.pathname === '/leads' && (
          <div className="relative" ref={searchContainerRef}>
            <div className="relative">
                <FiSearch className="absolute w-5 h-5 text-gray-400 top-1/2 left-3 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={localSearch}
                  onChange={handleSearchChange}
                  onFocus={() => setSearchFocused(true)}
                  className="pl-10 pr-4 py-2 w-64 text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            {showSuggestions && (
                <div className="absolute top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {localSearch.length > 0 ? (
                        <>
                            <h3 className="text-xs font-semibold uppercase text-gray-400 px-4 py-2">Suggestions</h3>
                            {filteredLeads.length > 0 ? (
                                <ul>
                                    {filteredLeads.slice(0, 5).map(lead => (
                                        <li key={lead.id} onClick={() => handleSuggestionClick(lead.name)} className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                            <img src={lead.avatar} alt={lead.name} className="w-8 h-8 rounded-full mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{lead.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><FiBriefcase className="w-3 h-3 mr-1"/>{lead.company}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 px-4 py-3">No results found.</p>
                            )}
                        </>
                    ) : (
                        <>
                            <h3 className="text-xs font-semibold uppercase text-gray-400 px-4 py-2">Recent Searches</h3>
                            {recentSearches.length > 0 ? (
                                <ul>
                                    {recentSearches.map((term, index) => (
                                        <li key={index} onClick={() => handleSuggestionClick(term)} className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                            <FiClock className="w-4 h-4 mr-3 text-gray-400" />
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{term}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 px-4 py-3">No recent searches.</p>
                            )}
                        </>
                    )}
                </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
              {theme === 'light' ? <FiMoon className="w-6 h-6" /> : <FiSun className="w-6 h-6" />}
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 relative">
              <FiBell className="w-6 h-6" />
              <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button onClick={signOut} title="Sign Out" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                <FiLogOut className="w-6 h-6" />
            </button>
        </div>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>

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
