import React, { useState, useEffect, FormEvent, useCallback } from 'react';
import { FiX, FiLoader } from 'react-icons/fi';
import { useTasks } from '../contexts/TasksContext';
import { useUser } from '../contexts/UserContext';
import { Task, TaskStatus, Priority } from '../types';
import { ALL_USERS } from '../constants';
import CustomDatePicker from './CustomDatePicker';
import AgentSelector from './AgentSelector';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, task }) => {
  const { addTask, editTask } = useTasks();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const getInitialFormState = useCallback(() => {
    const now = new Date();
    return {
      title: '',
      dueDate: now.toISOString().split('T')[0],
      dueTime: now.toTimeString().slice(0, 5),
      priority: 'Medium' as Priority,
      status: TaskStatus.TODO,
      assignedTo: user?.name || ALL_USERS[0]?.name || '',
      notes: '',
    };
  }, [user]);

  const [formData, setFormData] = useState(getInitialFormState());
  
  const isEditMode = !!task;

  useEffect(() => {
    if (isOpen) {
        if (task) {
            const dueDate = new Date(task.dueDateTime);
            setFormData({
                title: task.title,
                dueDate: dueDate.toISOString().split('T')[0],
                dueTime: dueDate.toTimeString().slice(0, 5),
                priority: task.priority,
                status: task.status,
                assignedTo: task.assignedTo,
                notes: task.notes || '',
            });
        } else {
            setFormData(getInitialFormState());
        }
    }
  }, [task, isOpen, getInitialFormState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { dueDate, dueTime, ...rest } = formData;
    const dueDateTime = new Date(`${dueDate}T${dueTime}:00`).toISOString();

    const submissionData = { ...rest, dueDateTime };

    if (isEditMode) {
      await editTask({ ...task!, ...submissionData });
    } else {
      await addTask(submissionData);
    }
    setLoading(false);
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
                <div className="flex gap-2">
                    <div className="flex-grow">
                        <CustomDatePicker selectedDate={formData.dueDate} onDateChange={(date) => setFormData(p => ({...p, dueDate: date}))} />
                    </div>
                     <input type="time" name="dueTime" value={formData.dueTime} onChange={handleChange} className={`${inputClass} w-32`} />
                </div>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned To</label>
                <AgentSelector
                  users={ALL_USERS}
                  selectedValue={formData.assignedTo}
                  onChange={(value) => setFormData(p => ({...p, assignedTo: value}))}
                />
              </div>
            </div>
             <div>
               <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
               <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} className={inputClass}></textarea>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm disabled:bg-primary-400 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />}
              {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TaskFormModal;