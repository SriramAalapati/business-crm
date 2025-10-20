import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import OpportunityCard from './OpportunityCard';
import { Opportunity } from '../../types';
import { FiMove } from 'react-icons/fi';

interface ColumnProps {
    id: string;
    title: string;
    opportunities: Opportunity[];
    activeOpp: Opportunity | null;
}

interface SortableOppItemProps {
    opportunity: Opportunity;
}

const SortableOppItem: React.FC<SortableOppItemProps> = ({ opportunity }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
        id: opportunity.id,
        data: {
            type: 'Opportunity',
            opportunity,
        }
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return <OpportunityCard ref={setNodeRef} style={style} isDragging={isDragging} opportunity={opportunity} {...attributes} {...listeners} />;
};


const OpportunityColumn: React.FC<ColumnProps> = ({ id, title, opportunities, activeOpp }) => {
    const { setNodeRef } = useDroppable({ id });

    const showDropZone = activeOpp && activeOpp.stage !== id;

    return (
        <div className="flex flex-col w-80 min-w-[320px] bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm max-h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                    {title} <span className="text-sm text-gray-500">{opportunities.length}</span>
                </h3>
            </div>
            <div ref={setNodeRef} className="flex-1 p-2 space-y-2 overflow-y-auto relative">
                <SortableContext items={opportunities.map(o => o.id)} strategy={verticalListSortingStrategy}>
                    {opportunities.map(opp => (
                        <SortableOppItem key={opp.id} opportunity={opp} />
                    ))}
                </SortableContext>
                
                {opportunities.length === 0 && !showDropZone && (
                    <div className="flex items-center justify-center h-24 text-sm text-gray-400 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        Drag deals here
                    </div>
                )}

                {showDropZone && (
                    <div className="absolute inset-2 flex flex-col items-center justify-center bg-primary-500/10 dark:bg-primary-500/20 border-2 border-dashed border-primary-500 rounded-lg transition-opacity pointer-events-none">
                        <FiMove className="w-8 h-8 text-primary-500 mb-2" />
                        <span className="font-semibold text-primary-700 dark:text-primary-300">Move to {title}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OpportunityColumn;