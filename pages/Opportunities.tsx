import React, { useState } from 'react';
import OpportunityKanbanBoard from '../components/OpportunityKanbanBoard/OpportunityKanbanBoard';
import ConfirmationDialog from '../components/ConfirmationDialog';
// import OpportunityFormModal from '../components/OpportunityFormModal';
// import ViewOpportunityModal from '../components/ViewOpportunityModal';
import { useOpportunities } from '../contexts/OpportunitiesContext';
import { useUser } from '../contexts/UserContext';
import { OPPORTUNITY_STAGES_CONFIG } from '../constants';
import { FiPlus } from 'react-icons/fi';

const KanbanSkeleton: React.FC = () => (
    <div className="flex overflow-x-auto gap-4 p-1 pb-4 -mx-1">
        {OPPORTUNITY_STAGES_CONFIG.map(column => (
            <div key={column.id} className="flex flex-col w-80 min-w-[320px] bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                 <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </div>
                <div className="p-2 space-y-2">
                    {[...Array(2)].map((_, i) => (
                         <div key={i} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6 mb-3"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                         </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const Opportunities: React.FC = () => {
    const { loading } = useOpportunities();
    const { user } = useUser();
    
    // NOTE: Modals for Opportunity are not yet created. This is a placeholder.
    const openModal = () => alert("Add Opportunity form not implemented yet.");
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold">{user?.role === 'admin' ? 'Sales Pipeline' : 'My Opportunities'}</h1>
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    <button 
                        onClick={() => openModal()} 
                        className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>Add Opportunity</span>
                    </button>
                </div>
            </div>
            {loading ? <KanbanSkeleton /> : <OpportunityKanbanBoard />}
            {/* 
            Placeholder for modals and dialogs
            <ConfirmationDialog />
            <OpportunityFormModal />
            <ViewOpportunityModal /> 
            */}
        </div>
    );
};

export default Opportunities;