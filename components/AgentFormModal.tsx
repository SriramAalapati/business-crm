import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { FiX, FiLoader } from 'react-icons/fi';
import { Agent } from '../types';
import { useAgents } from '../contexts/AgentsContext';

interface AgentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
}

const getInitialFormState = () => ({
    name: '',
    email: '',
    role: '',
    avatar: '',
});

const AgentFormModal: React.FC<AgentFormModalProps> = ({ isOpen, onClose, agent }) => {
  const { addAgent, editAgent } = useAgents();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(getInitialFormState());
  const modalRef = useRef<HTMLDivElement>(null);
  
  const isEditMode = !!agent;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      if (agent) {
        setFormData({
          name: agent.name,
          email: agent.email,
          role: agent.role,
          avatar: agent.avatar,
        });
      } else {
        setFormData(getInitialFormState());
      }
    }
  }, [agent, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isEditMode) {
      await editAgent({ ...agent!, ...formData });
    } else {
      await addAgent(formData);
    }
    setLoading(false);
    onClose();
  };
  
  const inputClass = "w-full px-3 py-2 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div ref={modalRef} tabIndex={-1} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4 outline-none" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{isEditMode ? 'Edit Agent' : 'Add New Agent'}</h2>
            <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close dialog"><FiX className="w-5 h-5" /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title / Role</label>
              <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} className={inputClass} required placeholder="e.g., Sales Executive"/>
            </div>
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar URL (Optional)</label>
              <input type="text" id="avatar" name="avatar" value={formData.avatar} onChange={handleChange} className={inputClass} placeholder="https://..." />
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
              {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Agent')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentFormModal;
