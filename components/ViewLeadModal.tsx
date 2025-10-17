import React from 'react';
import { FiX, FiUser, FiBriefcase, FiFlag, FiDollarSign, FiCalendar, FiEdit3, FiGitCommit, FiPlusCircle, FiCheckCircle } from 'react-icons/fi';
import { Lead, LeadActivity, Priority } from '../types';

interface ViewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
}

const priorityClasses: Record<Priority, { text: string, bg: string }> = {
    'High': { text: 'text-red-800 dark:text-red-200', bg: 'bg-red-100 dark:bg-red-900/50' },
    'Medium': { text: 'text-yellow-800 dark:text-yellow-200', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
    'Low': { text: 'text-green-800 dark:text-green-200', bg: 'bg-green-100 dark:bg-green-900/50' },
};

const activityIcons: Record<LeadActivity['type'], React.ReactElement> = {
    'Created': <FiPlusCircle className="w-5 h-5 text-green-500" />,
    'Status Change': <FiGitCommit className="w-5 h-5 text-blue-500" />,
    'Edited': <FiEdit3 className="w-5 h-5 text-yellow-500" />,
    'Note Added': <FiCheckCircle className="w-5 h-5 text-purple-500" />,
};

const InfoItem: React.FC<{ icon: React.ReactElement, label: string, value?: string | number | React.ReactElement }> = ({ icon, label, value }) => (
    <div className="flex items-start">
        <div className="text-gray-400 mt-1">{icon}</div>
        <div className="ml-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    </div>
);


const ViewLeadModal: React.FC<ViewLeadModalProps> = ({ isOpen, onClose, lead }) => {
  if (!isOpen) return null;

  const priorityStyle = priorityClasses[lead.priority];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl m-4 transform transition-all max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b dark:border-gray-700 flex items-start justify-between">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{lead.company}</p>
            </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Close dialog"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Left Panel: Details */}
                <div className="lg:col-span-1 p-6 border-r dark:border-gray-700">
                    <h3 className="font-semibold text-lg mb-4">Lead Details</h3>
                    <div className="space-y-5">
                        <InfoItem icon={<FiUser />} label="Assigned To" value={lead.assignedTo} />
                        <InfoItem icon={<FiDollarSign />} label="Deal Value" value={`₹${lead.dealValue.toLocaleString('en-IN')}`} />
                        <InfoItem icon={<FiFlag />} label="Priority" value={<span className={`px-2 py-1 text-sm font-semibold rounded-md ${priorityStyle.bg} ${priorityStyle.text}`}>{lead.priority}</span>} />
                        <InfoItem icon={<FiBriefcase />} label="Status" value={lead.status} />
                        <InfoItem icon={<FiCalendar />} label="Follow-up Date" value={lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'Not set'} />
                    </div>
                     <h3 className="font-semibold text-lg mt-8 mb-4">Notes</h3>
                     <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md whitespace-pre-wrap">
                        {lead.notes || 'No notes for this lead.'}
                     </p>
                </div>
                {/* Right Panel: Activity */}
                <div className="lg:col-span-2 p-6">
                    <h3 className="font-semibold text-lg mb-4">Activity Timeline</h3>
                    <div className="relative">
                        <div className="absolute left-3.5 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
                        <ul className="space-y-6">
                            {lead.activity.map(act => (
                                <li key={act.id} className="relative flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 z-10">
                                        {activityIcons[act.type]}
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{act.details}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            By {act.user} on {new Date(act.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLeadModal;
