
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useLeads } from '../../contexts/LeadsContext';
import { KANBAN_COLUMNS } from '../../constants';
import Column from './Column';
import { LeadStatus, Lead } from '../../types';

const KanbanBoard: React.FC = () => {
    const { filteredLeads, updateLeadStatus } = useLeads();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const activeContainer = active.data.current?.sortable.containerId;
            const overContainer = over.data.current?.sortable.containerId;

            if (activeContainer !== overContainer) {
                updateLeadStatus(active.id as string, overContainer as LeadStatus);
            }
        }
    };

    return (
        <div className="flex overflow-x-auto gap-4 p-1 pb-4 -mx-1">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={KANBAN_COLUMNS.map(c => c.id)} strategy={rectSortingStrategy}>
                    {KANBAN_COLUMNS.map(column => {
                        const leadsInColumn = filteredLeads.filter(lead => lead.status === column.id);
                        return <Column key={column.id} id={column.id} title={column.title} leads={leadsInColumn} />;
                    })}
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default KanbanBoard;
