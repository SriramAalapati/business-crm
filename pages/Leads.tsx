
import React from 'react';
import KanbanBoard from '../components/KanbanBoard/KanbanBoard';

const Leads: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Leads Pipeline</h1>
                <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">
                    Add Lead
                </button>
            </div>
            <KanbanBoard />
        </div>
    );
};

export default Leads;
