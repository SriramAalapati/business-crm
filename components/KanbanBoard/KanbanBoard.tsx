import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay, DropAnimation, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useLeads } from '../../contexts/LeadsContext';
import { KANBAN_COLUMNS } from '../../constants';
import Column from './Column';
import { Lead } from '../../types';
import LeadCard from './LeadCard';

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

const KanbanBoard: React.FC = () => {
    const { handleLeadDragEnd, filteredLeads } = useLeads();
    const [activeLead, setActiveLead] = useState<Lead | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.type === 'Lead') {
            setActiveLead(active.data.current.lead as Lead);
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveLead(null);

        if (!over) return;
        
        handleLeadDragEnd(active, over);
    };

    return (
        <div className="flex overflow-x-auto gap-4 p-1 pb-4 -mx-1">
            <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {KANBAN_COLUMNS.map(column => {
                    const leadsInColumn = filteredLeads.filter(lead => lead.status === column.id);
                    return <Column key={column.id} id={column.id} title={column.title} leads={leadsInColumn} activeLead={activeLead} />;
                })}
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeLead ? <LeadCard lead={activeLead} isOverlay /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default KanbanBoard;