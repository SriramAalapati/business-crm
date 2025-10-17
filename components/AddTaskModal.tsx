import React, { useState, FormEvent, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { PersonalEvent } from '../types';
import CustomDatePicker from './CustomDatePicker';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: PersonalEvent) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim() && date) {
      onAddTask({ title, date });
    }
  };

  if (!isOpen) return null;
  
  const inputClass = "w-full px-3 py-2 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Personal Task
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Close dialog"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
              <input 
                type="text" 
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                required
                placeholder="e.g., Doctor's Appointment"
              />
            </div>
            <div>
              <label htmlFor="task-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <CustomDatePicker selectedDate={date} onDateChange={setDate} />
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
