import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { User } from '../types';

interface AgentSelectorProps {
  users: User[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ users, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  
  const selectedUser = users.find(u => u.name === selectedValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (userName: string) => {
    onChange(userName);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={selectorRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {selectedUser ? (
          <div className="flex items-center gap-2">
            <img src={selectedUser.avatar} alt={selectedUser.name} className="w-6 h-6 rounded-full" />
            <span className="text-sm font-medium">{selectedUser.name}</span>
          </div>
        ) : (
          <span className="text-sm">Select Assignee</span>
        )}
        <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
          <ul>
            {users.map(user => (
              <li
                key={user.id}
                onClick={() => handleSelect(user.name)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AgentSelector;