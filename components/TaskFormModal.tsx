import React, { useState, useEffect, FormEvent } from 'react';
import { FiX } from 'react-icons/fi';
import { useTasks } from '../contexts/TasksContext';
import { Task, TaskStatus, Priority } from '../types';
import { ASSIGNEES } from '../constants';
import CustomDatePicker from './CustomDatePicker';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, task }) => {
  const { addTask, editTask } = useTasks();
  const [formData, setFormData] = useState({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium' as Priority,
    status: TaskStatus.TODO,
    assignedTo: ASSIGNEES[0],
    notes: '',
  });
  
  const isEditMode = !!task;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo,
        notes: task.notes || '',
      });
    } else {
      setFormData({
        title: '',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'Medium' as Priority,
        status: TaskStatus.TODO,
        assignedTo: ASSIGNEES[0],
        notes: '',
      });
    }
  }, [task, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      editTask({ ...task!, ...formData });
    } else {
      addTask(formData);
    }
    onClose();
  };
  
  const inputClass = "w-full px-3 py-2 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{isEditMode ? 'Edit Task' : 'Add New Task'}</h2>
            <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close dialog"><FiX className="w-5 h-5" /></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={inputClass} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                <CustomDatePicker selectedDate={formData.dueDate} onDateChange={(date) => setFormData(p => ({...p, dueDate: date}))} />
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className={inputClass}>
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                  {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned To</label>
                <select id="assignedTo" name="assignedTo" value={formData.assignedTo} onChange={handleChange} className={inputClass}>
                  {ASSIGNEES.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
            </div>
             <div>
               <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
               <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} className={inputClass}></textarea>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm">{isEditMode ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TaskFormModal;