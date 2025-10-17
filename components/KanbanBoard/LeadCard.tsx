
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead } from '../../types';
import { FiDollarSign, FiBriefcase } from 'react-icons/fi';

interface LeadCardProps {
    lead: Lead;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing border-l-4 border-primary-500"
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
};

export default LeadCard;
