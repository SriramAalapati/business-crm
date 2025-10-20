import React from 'react';
import { Opportunity } from '../../types';
import { FiBriefcase, FiTrash2, FiEdit2, FiEye, FiDollarSign, FiUser, FiCalendar, FiTrendingUp } from 'react-icons/fi';

interface OpportunityCardProps extends React.HTMLAttributes<HTMLDivElement> {
    opportunity: Opportunity;
    isDragging?: boolean;
    isOverlay?: boolean;
}

const getProbabilityColor = (prob: number): string => {
    if (prob >= 80) return 'border-green-500';
    if (prob >= 40) return 'border-blue-500';
    if (prob >= 20) return 'border-yellow-500';
    return 'border-gray-400';
};

const OpportunityCard = React.forwardRef<HTMLDivElement, OpportunityCardProps>(
  ({ opportunity, isDragging, isOverlay, style, ...props }, ref) => {

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation(); 
        action();
    }
    
    const finalClassName = [
      'bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md border-l-4 transition-all duration-200 group relative',
      getProbabilityColor(opportunity.probability),
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
                    onClick={(e) => handleActionClick(e, () => alert('View details not implemented'))}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-500 dark:hover:text-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 z-10"
                    aria-label={`View opportunity ${opportunity.name}`}
                >
                    <FiEye className="w-5 h-5" />
                </button>
                 <button 
                    onClick={(e) => handleActionClick(e, () => alert('Edit form not implemented'))}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
                    aria-label={`Edit opportunity ${opportunity.name}`}
                >
                    <FiEdit2 className="w-5 h-5" />
                </button>
                <button 
                    onClick={(e) => handleActionClick(e, () => alert('Delete not implemented'))}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 z-10"
                    aria-label={`Delete opportunity ${opportunity.name}`}
                >
                    <FiTrash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800 dark:text-white pr-4 flex-1">{opportunity.name}</h4>
                <div className="text-sm font-semibold text-primary-600 dark:text-primary-400 flex items-center flex-shrink-0">
                    <FiDollarSign className="w-4 h-4 mr-1"/>
                    <span>{opportunity.dealValue.toLocaleString('en-IN')}</span>
                </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-3">
                <FiBriefcase className="w-4 h-4 mr-2" />
                {opportunity.company}
            </p>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1.5">
                 <p className="flex items-center">
                    <FiUser className="w-3.5 h-3.5 mr-2" /> Assigned to: <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">{opportunity.assignedTo}</span>
                </p>
                <p className="flex items-center">
                    <FiCalendar className="w-3.5 h-3.5 mr-2" /> Closes: <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">{new Date(opportunity.expectedCloseDate).toLocaleDateString()}</span>
                </p>
            </div>

            <p className={`text-sm font-semibold flex items-center mt-3 text-gray-600 dark:text-gray-300`}>
                <FiTrendingUp className="w-4 h-4 mr-1" />
                Probability: {opportunity.probability}%
            </p>
        </div>
    );
});

export default OpportunityCard;