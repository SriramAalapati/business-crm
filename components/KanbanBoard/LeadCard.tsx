import React from 'react';
import { Lead, Priority } from '../../types';
import { FiBriefcase, FiTrash2, FiEdit2, FiFlag, FiEye, FiDollarSign, FiUser, FiCalendar } from 'react-icons/fi';
import { useLeads } from '../../contexts/LeadsContext';

interface LeadCardProps extends React.HTMLAttributes<HTMLDivElement> {
    lead: Lead;
    isDragging?: boolean;
    isOverlay?: boolean;
}

const priorityClasses: Record<Priority, { border: string, text: string, bg: string }> = {
    'High': { border: 'border-red-500', text: 'text-red-500', bg: 'bg-red-500' },
    'Medium': { border: 'border-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500' },
    'Low': { border: 'border-green-500', text: 'text-green-500', bg: 'bg-green-500' },
};

const LeadCard = React.forwardRef<HTMLDivElement, LeadCardProps>(
  ({ lead, isDragging, isOverlay, style, ...props }, ref) => {
    const { setLeadToDelete, openModal, openViewModal } = useLeads();

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation(); 
        action();
    }
    
    const priorityStyle = priorityClasses[lead.priority];

    const finalClassName = [
      'bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md border-l-4 transition-all duration-200 group relative',
      priorityStyle.border,
      isOverlay ? 'cursor-grabbing shadow-2xl ring-2 ring-primary-500/50' : 'cursor-grab active:cursor-grabbing',
      isDragging ? 'opacity-0' : 'opacity-100'
    ].join(' ');

    return (
        <div
            ref={ref}
            style={style}
            {...props}
            className={finalClassName}
        >
            <div className="absolute top-2 right-2 flex gap-1 transition-opacity opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                <button 
                    onClick={(e) => handleActionClick(e, () => openViewModal(lead))}
                    className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-500 dark:hover:text-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 z-10"
                    aria-label={`View lead ${lead.name}`}
                >
                    <FiEye className="w-4 h-4" />
                </button>
                 <button 
                    onClick={(e) => handleActionClick(e, () => openModal(lead))}
                    className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
                    aria-label={`Edit lead ${lead.name}`}
                >
                    <FiEdit2 className="w-4 h-4" />
                </button>
                <button 
                    onClick={(e) => handleActionClick(e, () => setLeadToDelete(lead.id))}
                    className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 z-10"
                    aria-label={`Delete lead ${lead.name}`}
                >
                    <FiTrash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800 dark:text-white pr-4 flex-1">{lead.name}</h4>
                <div className="text-sm font-semibold text-primary-600 dark:text-primary-400 flex items-center flex-shrink-0">
                    <FiDollarSign className="w-4 h-4 mr-1"/>
                    <span>{lead.dealValue.toLocaleString('en-IN')}</span>
                </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-3">
                <FiBriefcase className="w-4 h-4 mr-2" />
                {lead.company}
            </p>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1.5">
                 <p className="flex items-center">
                    <FiUser className="w-3.5 h-3.5 mr-2" /> Assigned to: <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">{lead.assignedTo}</span>
                </p>
                {lead.followUpDate && <p className="flex items-center">
                    <FiCalendar className="w-3.5 h-3.5 mr-2" /> Follow-up: <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">{new Date(lead.followUpDate).toLocaleDateString()}</span>
                </p>}
            </div>

            <p className={`text-sm font-semibold flex items-center mt-3 ${priorityStyle.text}`}>
                <FiFlag className="w-4 h-4 mr-1" />
                {lead.priority} Priority
            </p>
        </div>
    );
});

export default LeadCard;