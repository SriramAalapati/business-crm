import React, { createContext, useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { Opportunity, OpportunityStage, AppProviderProps, SortOption } from '../types';
import { OPPORTUNITY_STAGES_CONFIG } from '../constants';
import { arrayMove } from '@dnd-kit/sortable';
import { useUser } from './UserContext';
import { useToast } from './ToastContext';
import { api } from '../apiCaller';
import { Active, Over } from '@dnd-kit/core';

interface OpportunitiesContextType {
  opportunities: Opportunity[];
  loading: boolean;
  addOpportunity: (newOppData: Omit<Opportunity, 'id' | 'avatar' | 'activity'>) => Promise<void>;
  editOpportunity: (updatedOpp: Opportunity) => Promise<void>;
  deleteOpportunity: (oppId: string) => Promise<void>;
  handleDragEnd: (active: Active, over: Over | null) => void;
  filteredOpportunities: Opportunity[];
}

const OpportunitiesContext = createContext<OpportunitiesContextType | undefined>(undefined);

export const OpportunitiesProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useUser();
  const { addToast } = useToast();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOpportunities = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const path = `/opportunities?role=${user.role}&name=${user.name}`;
      const response = await api.get<{ opportunities: Opportunity[] }>(path);
      setOpportunities(response.opportunities);
    } catch (error) {
      addToast('Failed to fetch opportunities.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user, addToast]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleDragEnd = async (active: Active, over: Over | null) => {
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const activeOpportunity = opportunities.find((o) => o.id === activeId);

    if (!activeOpportunity) return;
    
    const overIsAColumn = OPPORTUNITY_STAGES_CONFIG.some((c) => c.id === overId);
    const newStage = overIsAColumn ? (overId as OpportunityStage) : opportunities.find(o => o.id === overId)?.stage;

    if (!newStage || newStage === activeOpportunity.stage) {
        const activeIndex = opportunities.findIndex((o) => o.id === activeId);
        const overIndex = opportunities.findIndex((o) => o.id === overId);
        if (overIndex === -1) return;
        setOpportunities(arrayMove(opportunities, activeIndex, overIndex));
        return;
    }

    const stageConfig = OPPORTUNITY_STAGES_CONFIG.find(s => s.id === newStage);
    const newProbability = stageConfig ? stageConfig.probability : activeOpportunity.probability;
     
    const updatedOpportunity = { ...activeOpportunity, stage: newStage, probability: newProbability };
    
    // Optimistic UI update
    const originalOpps = [...opportunities];
    const activeIndex = originalOpps.findIndex((l) => l.id === activeId);
    const overIndex = originalOpps.findIndex((l) => l.id === overId);
    const updatedOptimisticOpps = originalOpps.filter(l => l.id !== activeId);
    const insertionIndex = overIsAColumn ? updatedOptimisticOpps.length : overIndex;
    updatedOptimisticOpps.splice(insertionIndex, 0, updatedOpportunity);
    setOpportunities(updatedOptimisticOpps);

    try {
        await editOpportunity(updatedOpportunity);
        addToast(`Deal moved to ${newStage}`, 'info');
    } catch (error) {
        setOpportunities(originalOpps); // Revert on error
    }
  };

  const deleteOpportunity = async (oppId: string) => {
    const originalOpps = [...opportunities];
    setOpportunities(prev => prev.filter(opp => opp.id !== oppId));
    try {
        await api.delete(`/opportunities/${oppId}`);
        addToast('Opportunity deleted successfully', 'success');
    } catch (error) {
        setOpportunities(originalOpps);
        addToast('Failed to delete opportunity.', 'error');
    }
  };
  
  const addOpportunity = async (newOppData: Omit<Opportunity, 'id' | 'avatar' | 'activity'>) => {
    try {
        const { opportunity } = await api.post<{ opportunity: Opportunity }>('/opportunities', newOppData);
        setOpportunities(prev => [opportunity, ...prev]);
        addToast('Opportunity added successfully!', 'success');
    } catch (error) {
        addToast('Failed to add opportunity.', 'error');
    }
  }
  
  const editOpportunity = async (updatedOpp: Opportunity) => {
    try {
        const { opportunity } = await api.put<{ opportunity: Opportunity }>(`/opportunities/${updatedOpp.id}`, updatedOpp);
        setOpportunities(prev => prev.map(o => (o.id === opportunity.id ? opportunity : o)));
        addToast(`Deal "${opportunity.name}" updated successfully!`, 'success');
    } catch (error) {
        addToast('Failed to update opportunity.', 'error');
        throw error; // Re-throw to be caught by drag-and-drop handler
    }
  }

  const filteredOpportunities = useMemo(() => {
    // For now, just return all. Add search/filter later if needed.
    return [...opportunities];
  }, [opportunities]);

  return (
    <OpportunitiesContext.Provider value={{ 
        opportunities, 
        loading,
        deleteOpportunity,
        addOpportunity,
        editOpportunity,
        handleDragEnd,
        filteredOpportunities,
    }}>
      {children}
    </OpportunitiesContext.Provider>
  );
};

export const useOpportunities = () => {
  const context = useContext(OpportunitiesContext);
  if (context === undefined) {
    throw new Error('useOpportunities must be used within a OpportunitiesProvider');
  }
  return context;
};