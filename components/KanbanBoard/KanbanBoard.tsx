import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay, DropAnimation, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useLeads } from '../../contexts/LeadsContext';
import { KANBAN_COLUMNS } from '../../constants';
import Column from './Column';
import { Lead, LeadStatus } from '../../types';
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
    const { filteredLeads, updateLeadStatus, reorderLeads } = useLeads();
    const [activeLead, setActiveLead] = useState<Lead | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const lead = filteredLeads.find(l => l.id === active.id);
        if (lead) {
            setActiveLead(lead);
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveLead(null);

        if (!over || active.id === over.id) {
            return;
        }

        const activeId = String(active.id);
        const overId = String(over.id);
        
        const activeContainer = active.data.current?.sortable.containerId as LeadStatus;
        const overIsAColumn = KANBAN_COLUMNS.some(c => c.id === overId);
        const overContainer = overIsAColumn 
            ? overId as LeadStatus 
            : over.data.current?.sortable.containerId as LeadStatus;

        if (!activeContainer || !overContainer) {
            return;
        }
        
        // Handle reordering within the same column or moving to a new column
        if (activeContainer === overContainer) {
             if (!overIsAColumn) {
                // Reorder leads in the same column
                reorderLeads(activeId, overId);
             }
        } else {
            // Move lead to a new column (new status)
            updateLeadStatus(activeId, overContainer);
        }
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
                    return <Column key={column.id} id={column.id} title={column.title} leads={leadsInColumn} />;
                })}
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeLead ? <LeadCard lead={activeLead} isOverlay /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default KanbanBoard;
