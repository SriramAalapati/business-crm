import React, { useState, useMemo } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import { Agent } from '../types';
import { useAgents } from '../contexts/AgentsContext';
import AgentFormModal from '../components/AgentFormModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import Pagination from '../components/Pagination';

const AGENTS_PER_PAGE = 5;

const AgentTableSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-3">Agent</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(AGENTS_PER_PAGE)].map((_, i) => (
                        <tr key={i} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 animate-pulse">
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                    <div className="pl-3">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div></td>
                            <td className="px-6 py-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


const ManageAgents: React.FC = () => {
    const { agents, loading, deleteAgent } = useAgents();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
    const [agentToDelete, setAgentToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const filteredAgents = useMemo(() => agents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [agents, searchTerm]);

    const totalPages = Math.ceil(filteredAgents.length / AGENTS_PER_PAGE);
    const paginatedAgents = useMemo(() => {
        const startIndex = (currentPage - 1) * AGENTS_PER_PAGE;
        return filteredAgents.slice(startIndex, startIndex + AGENTS_PER_PAGE);
    }, [filteredAgents, currentPage]);


    const openModal = (agent?: Agent) => {
        setEditingAgent(agent || null);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAgent(null);
    };

    const handleConfirmDelete = async () => {
        if (agentToDelete) {
            await deleteAgent(agentToDelete);
        }
        setAgentToDelete(null);
    };

    const agentBeingDeleted = agents.find(a => a.id === agentToDelete);

    return (
        <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold">Manage Agents</h1>
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    <div className="relative">
                        <FiSearch className="absolute w-5 h-5 text-gray-400 top-1/2 left-3 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search agents..."
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                          }}
                          className="pl-10 pr-4 py-2 w-64 text-sm text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                     <button 
                        onClick={() => openModal()}
                        className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>Add Agent</span>
                    </button>
                </div>
            </div>

            {loading ? <AgentTableSkeleton /> : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Agent</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedAgents.map((agent) => (
                                    <tr key={agent.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <div className="flex items-center">
                                                <img className="w-10 h-10 rounded-full" src={agent.avatar} alt={agent.name} />
                                                <div className="pl-3">
                                                    <div className="text-base font-semibold">{agent.name}</div>
                                                    <div className="font-normal text-gray-500">{agent.email}</div>
                                                </div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">{agent.role}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openModal(agent)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" aria-label="Edit"><FiEdit className="w-5 h-5"/></button>
                                                <button onClick={() => setAgentToDelete(agent.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400" aria-label="Delete"><FiTrash2 className="w-5 h-5"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {paginatedAgents.length === 0 && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">No agents found.</div>
                        )}
                    </div>
                     {totalPages > 1 && (
                        <div className="p-4 border-t dark:border-gray-700">
                             <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </div>
                    )}
                </div>
            )}
             {isModalOpen && <AgentFormModal isOpen={isModalOpen} onClose={closeModal} agent={editingAgent} />}
             {agentBeingDeleted && (
                <ConfirmationDialog
                    isOpen={!!agentBeingDeleted}
                    title="Delete Agent"
                    onClose={() => setAgentToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                    confirmText="Confirm Delete"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to permanently delete the agent: <strong>{agentBeingDeleted.name}</strong>? This action cannot be undone.
                    </p>
                </ConfirmationDialog>
            )}
        </>
    );
};

export default ManageAgents;