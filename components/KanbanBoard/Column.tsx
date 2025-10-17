import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LeadCard from './LeadCard';
import { Lead } from '../../types';

interface ColumnProps {
    id: string;
    title: string;
    leads: Lead[];
}

const SortableLeadItem = ({ lead }: { lead: Lead }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return <LeadCard ref={setNodeRef} style={style} isDragging={isDragging} lead={lead} {...attributes} {...listeners} />;
};


const Column: React.FC<ColumnProps> = ({ id, title, leads }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="flex flex-col w-80 min-w-[320px] bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm max-h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                    {title} <span className="text-sm text-gray-500">{leads.length}</span>
                </h3>
            </div>
            <div ref={setNodeRef} className="flex-1 p-2 space-y-2 overflow-y-auto">
                <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    {leads.map(lead => (
                        <SortableLeadItem key={lead.id} lead={lead} />
                    ))}
                    {leads.length === 0 && (
                        <div className="flex items-center justify-center h-24 text-sm text-gray-400 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                            Drag leads here
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};

export default Column;
