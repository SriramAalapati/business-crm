import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay, DropAnimation, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useOpportunities } from '../../contexts/OpportunitiesContext';
import { OPPORTUNITY_STAGES_CONFIG } from '../../constants';
import OpportunityColumn from './OpportunityColumn';
import { Opportunity } from '../../types';
import OpportunityCard from './OpportunityCard';

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

const OpportunityKanbanBoard: React.FC = () => {
    const { handleDragEnd, filteredOpportunities } = useOpportunities();
    const [activeOpp, setActiveOpp] = useState<Opportunity | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.type === 'Opportunity') {
            setActiveOpp(active.data.current.opportunity as Opportunity);
        }
    }

    const handleDragEndEvent = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveOpp(null);

        if (!over) return;
        
        handleDragEnd(active, over);
    };

    return (
        <div className="flex overflow-x-auto gap-4 p-1 pb-4 -mx-1">
            <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEndEvent}
            >
                {OPPORTUNITY_STAGES_CONFIG.map(column => {
                    const oppsInColumn = filteredOpportunities.filter(opp => opp.stage === column.id);
                    return <OpportunityColumn key={column.id} id={column.id} title={column.title} opportunities={oppsInColumn} activeOpp={activeOpp} />;
                })}
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeOpp ? <OpportunityCard opportunity={activeOpp} isOverlay /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default OpportunityKanbanBoard;