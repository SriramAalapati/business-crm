import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Agent, AppProviderProps } from '../types';
import { useToast } from './ToastContext';
import { api } from '../apiCaller';

interface AgentsContextType {
  agents: Agent[];
  loading: boolean;
  fetchAgents: () => Promise<void>;
  addAgent: (newAgentData: Omit<Agent, 'id'>) => Promise<void>;
  editAgent: (updatedAgent: Agent) => Promise<void>;
  deleteAgent: (agentId: string) => Promise<void>;
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

export const AgentsProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { addToast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<{ agents: Agent[] }>('/agents');
      setAgents(response.agents);
    } catch (error) {
      addToast('Failed to fetch agents.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const addAgent = async (newAgentData: Omit<Agent, 'id'>) => {
    try {
      const { agent } = await api.post<{ agent: Agent }>('/agents', newAgentData);
      setAgents(prev => [...prev, agent]);
      addToast('Agent added successfully!', 'success');
    } catch (error) {
      addToast('Failed to add agent.', 'error');
    }
  };

  const editAgent = async (updatedAgent: Agent) => {
    try {
      const { agent } = await api.put<{ agent: Agent }>(`/agents/${updatedAgent.id}`, updatedAgent);
      setAgents(prev => prev.map(a => (a.id === agent.id ? agent : a)));
      addToast('Agent updated successfully!', 'info');
    } catch (error) {
      addToast('Failed to update agent.', 'error');
    }
  };

  const deleteAgent = async (agentId: string) => {
    const originalAgents = [...agents];
    setAgents(prev => prev.filter(agent => agent.id !== agentId));
    try {
      await api.delete(`/agents/${agentId}`);
      addToast('Agent deleted successfully.', 'error');
    } catch (error) {
      setAgents(originalAgents);
      addToast('Failed to delete agent.', 'error');
    }
  };

  return (
    <AgentsContext.Provider value={{ agents, loading, fetchAgents, addAgent, editAgent, deleteAgent }}>
      {children}
    </AgentsContext.Provider>
  );
};

export const useAgents = () => {
  const context = useContext(AgentsContext);
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentsProvider');
  }
  return context;
};