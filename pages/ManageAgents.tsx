import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import { INITIAL_AGENTS } from '../constants';
import { Agent } from '../types';

// Mock context/state management for agents
const useAgents = () => {
    const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return { agents: filteredAgents, setSearchTerm };
};


const ManageAgents: React.FC = () => {
    const { agents, setSearchTerm } = useAgents();

    // In a real app, modals would be used for add/edit
    const handleAddAgent = () => alert("Functionality to add an agent would be here.");
    const handleEditAgent = (agent: Agent) => alert(`Functionality to edit ${agent.name} would be here.`);
    const handleDeleteAgent = (agent: Agent) => alert(`Functionality to delete ${agent.name} would be here.`);

    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold">Manage Agents</h1>
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    <div className="relative">
                        <FiSearch className="absolute w-5 h-5 text-gray-400 top-1/2 left-3 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search agents..."
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 w-64 text-sm text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                     <button 
                        onClick={handleAddAgent}
                        className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>Add Agent</span>
                    </button>
                </div>
            </div>

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
                            {agents.map((agent) => (
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
                                    <td className="px-6 py-4">
                                        {agent.role}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEditAgent(agent)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" aria-label="Edit">
                                                <FiEdit className="w-5 h-5"/>
                                            </button>
                                            <button onClick={() => handleDeleteAgent(agent)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400" aria-label="Delete">
                                                <FiTrash2 className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageAgents;
