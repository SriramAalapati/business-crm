import React from 'react';
import { Lead } from '../../types';
import { FiDollarSign, FiBriefcase } from 'react-icons/fi';

interface LeadCardProps extends React.HTMLAttributes<HTMLDivElement> {
    lead: Lead;
    isDragging?: boolean;
    isOverlay?: boolean;
}

const LeadCard = React.forwardRef<HTMLDivElement, LeadCardProps>(
  ({ lead, isDragging, isOverlay, style, ...props }, ref) => {
    const finalClassName = [
      'bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md border-l-4 border-primary-500 transition-opacity',
      isOverlay ? 'cursor-grabbing shadow-2xl ring-2 ring-primary-500/50' : 'cursor-grab active:cursor-grabbing',
      isDragging ? 'opacity-30' : ''
    ].join(' ');

    return (
        <div
            ref={ref}
            style={style}
            {...props}
            className={finalClassName}
        >
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-800 dark:text-white">{lead.name}</h4>
                <img src={lead.avatar} alt={lead.name} className="w-8 h-8 rounded-full" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                <FiBriefcase className="w-4 h-4 mr-2" />
                {lead.company}
            </p>
            <p className="text-sm text-green-500 font-semibold flex items-center mt-2">
                <FiDollarSign className="w-4 h-4 mr-1" />
                {lead.value.toLocaleString()}
            </p>
        </div>
    );
});

export default LeadCard;
