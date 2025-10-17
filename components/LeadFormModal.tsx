import React, { useState, useEffect, FormEvent } from 'react';
import { FiX } from 'react-icons/fi';
import { useLeads } from '../contexts/LeadsContext';
import { Lead, LeadStatus, Priority } from '../types';
import { KANBAN_COLUMNS, ASSIGNEES } from '../constants';
import CustomDatePicker from './CustomDatePicker';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose, lead }) => {
  const { addLead, editLead } = useLeads();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    priority: 'Medium' as Priority,
    dealValue: 0,
    status: LeadStatus.NEW,
    assignedTo: ASSIGNEES[0],
    contactedDate: new Date().toISOString().split('T')[0],
    followUpDate: '',
    notes: '',
  });
  
  const isEditMode = !!lead;

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        company: lead.company,
        priority: lead.priority,
        dealValue: lead.dealValue,
        status: lead.status,
        assignedTo: lead.assignedTo,
        contactedDate: lead.contactedDate,
        followUpDate: lead.followUpDate || '',
        notes: lead.notes || '',
      });
    } else {
      // Reset form for new lead
      setFormData({
        name: '',
        company: '',
        priority: 'Medium' as Priority,
        dealValue: 0,
        status: LeadStatus.NEW,
        assignedTo: ASSIGNEES[0],
        contactedDate: new Date().toISOString().split('T')[0],
        followUpDate: '',
        notes: '',
      });
    }
  }, [lead, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'dealValue' ? parseInt(value) || 0 : value }));
  };
  
  const handleDateChange = (name: 'contactedDate' | 'followUpDate', date: string) => {
    setFormData(prev => ({...prev, [name]: date}));
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      editLead({ ...lead!, ...formData });
    } else {
      addLead(formData);
    }
    onClose();
  };
  
  const inputClass = "w-full px-3 py-2 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500";


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4 transform transition-all max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Lead' : 'Add New Lead'}
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
            
          <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
              </div>
               <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className={inputClass} required />
              </div>
               <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className={inputClass}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label htmlFor="dealValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deal Value (₹)</label>
                <input type="number" id="dealValue" name="dealValue" value={formData.dealValue} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                  {KANBAN_COLUMNS.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned To</label>
                <select id="assignedTo" name="assignedTo" value={formData.assignedTo} onChange={handleChange} className={inputClass}>
                  {ASSIGNEES.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Follow-up Date</label>
                <CustomDatePicker 
                    selectedDate={formData.followUpDate}
                    onDateChange={(date) => handleDateChange('followUpDate', date)}
                />
              </div>
               <div>
                <label htmlFor="contactedDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contacted Date</label>
                 <CustomDatePicker 
                    selectedDate={formData.contactedDate}
                    onDateChange={(date) => handleDateChange('contactedDate', date)}
                />
              </div>
              <div className="md:col-span-2">
                 <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                 <textarea id="notes" name="notes" rows={4} value={formData.notes} onChange={handleChange} className={inputClass}></textarea>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3 rounded-b-lg mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isEditMode ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;