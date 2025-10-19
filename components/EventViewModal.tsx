import React from 'react';
import { FiX, FiBriefcase, FiFlag, FiCheckSquare, FiCalendar, FiUser, FiDollarSign, FiAlignLeft, FiExternalLink } from 'react-icons/fi';
import { Event } from '@fullcalendar/core';
import { Lead, Task, Priority } from '../types';
import { useLeads } from '../contexts/LeadsContext';

interface EventViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

const priorityClasses: Record<Priority, { text: string, bg: string }> = {
    'High': { text: 'text-red-800 dark:text-red-200', bg: 'bg-red-100 dark:bg-red-900/50' },
    'Medium': { text: 'text-yellow-800 dark:text-yellow-200', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
    'Low': { text: 'text-green-800 dark:text-green-200', bg: 'bg-green-100 dark:bg-green-900/50' },
};

const EventViewModal: React.FC<EventViewModalProps> = ({ isOpen, onClose, event }) => {
  const { openViewModal } = useLeads();
  if (!isOpen) return null;

  const { type, lead, task } = event.extendedProps as { type: string, lead?: Lead, task?: Task };

  const formatDateTime = (date: Date | null | undefined) => {
    if (!date) return 'Not set';
    return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  }

  const handleViewLead = () => {
    if (lead) {
      onClose();
      openViewModal(lead);
    }
  }

  const DetailItem: React.FC<{icon: React.ReactNode, label: string, children: React.ReactNode}> = ({ icon, label, children }) => (
    <div className="flex">
        <div className="text-gray-400 mt-1">{icon}</div>
        <div className="ml-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <div className="font-medium text-gray-800 dark:text-gray-200">{children}</div>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b dark:border-gray-700 flex items-start justify-between">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{event.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{type} Event</p>
            </div>
            <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close dialog"><FiX className="w-5 h-5" /></button>
          </div>
          <div className="p-6 space-y-5">
            <DetailItem icon={<FiCalendar/>} label="Date & Time">
                {formatDateTime(event.start)}
            </DetailItem>

            {lead && (
                <>
                    <DetailItem icon={<FiBriefcase/>} label="Company">{lead.company}</DetailItem>
                    <DetailItem icon={<FiDollarSign/>} label="Deal Value">₹{lead.dealValue.toLocaleString('en-IN')}</DetailItem>
                    <DetailItem icon={<FiUser/>} label="Assigned To">{lead.assignedTo}</DetailItem>
                </>
            )}

            {task && (
                 <>
                    <DetailItem icon={<FiFlag/>} label="Priority">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${priorityClasses[task.priority].bg} ${priorityClasses[task.priority].text}`}>
                            {task.priority}
                        </span>
                    </DetailItem>
                    <DetailItem icon={<FiUser/>} label="Assigned To">{task.assignedTo}</DetailItem>
                    {task.notes && <DetailItem icon={<FiAlignLeft/>} label="Notes">{task.notes}</DetailItem>}
                </>
            )}
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
             {lead && (
                <button
                    onClick={handleViewLead}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm flex items-center gap-2"
                >
                    <FiExternalLink /> View Full Lead
                </button>
             )}
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">Close</button>
          </div>
      </div>
    </div>
  );
};

export default EventViewModal;