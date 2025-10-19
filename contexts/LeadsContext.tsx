import React, { createContext, useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { Lead, LeadStatus, AppProviderProps, SortOption, Priority, LeadActivity } from '../types';
import { KANBAN_COLUMNS } from '../constants';
import { arrayMove } from '@dnd-kit/sortable';
import { useUser } from './UserContext';
import { useToast } from './ToastContext';
import { api } from '../apiCaller';
import { Active, Over } from '@dnd-kit/core';

interface LeadsContextType {
  leads: Lead[];
  loading: boolean;
  fetchLeads: () => Promise<void>;
  deleteLead: (leadId: string) => Promise<void>;
  addLead: (newLeadData: Omit<Lead, 'id' | 'avatar' | 'activity'>) => Promise<void>;
  editLead: (updatedLead: Lead) => Promise<void>;
  addNoteToLead: (leadId: string, noteText: string) => Promise<void>;
  handleLeadDragEnd: (active: Active, over: Over | null) => void;
  
  filteredLeads: Lead[];
  setSearchTerm: (term: string) => void;
  searchTerm: string;

  recentSearches: string[];
  addRecentSearch: (term: string) => void;

  leadToDelete: string | null;
  setLeadToDelete: (id: string | null) => void;

  editingLead: Lead | null;
  isModalOpen: boolean;
  openModal: (lead?: Lead) => void;
  closeModal: () => void;
  
  viewingLead: Lead | null;
  isViewModalOpen: boolean;
  openViewModal: (lead: Lead) => void;
  closeViewModal: () => void;

  filterAssignee: string;
  setFilterAssignee: (assignee: string) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

const priorityOrder: Record<Priority, number> = {
    'High': 3,
    'Medium': 2,
    'Low': 1
};

export const LeadsProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useUser();
  const { addToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  const [filterAssignee, setFilterAssignee] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('priority-desc');

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const item = window.localStorage.getItem('recentSearches');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });
  
  const fetchLeads = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const path = `/leads?role=${user.role}&name=${user.name}`;
      const response = await api.get<{ leads: Lead[] }>(path);
      setLeads(response.leads);
    } catch (error) {
      addToast('Failed to fetch leads.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user, addToast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    try {
      window.localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    } catch (error) {
      console.error(error);
    }
  }, [recentSearches]);

  const addRecentSearch = (term: string) => {
    if (!term || term.trim() === '') return;
    setRecentSearches(prev => {
      const lowerCaseTerm = term.toLowerCase();
      const filtered = prev.filter(t => t.toLowerCase() !== lowerCaseTerm);
      const newSearches = [term, ...filtered];
      return newSearches.slice(0, 5);
    });
  };

  const handleLeadDragEnd = async (active: Active, over: Over | null) => {
      if (!over || active.id === over.id) return;

      const activeId = String(active.id);
      const overId = String(over.id);
      const activeLead = leads.find((l) => l.id === activeId);

      if (!activeLead) return;
      
      const overIsAColumn = KANBAN_COLUMNS.some((c) => c.id === overId);
      const newStatus = overIsAColumn ? (overId as LeadStatus) : leads.find(l => l.id === overId)?.status;

      if (!newStatus || newStatus === activeLead.status) {
          const activeIndex = leads.findIndex((l) => l.id === activeId);
          const overIndex = leads.findIndex((l) => l.id === overId);
          if (overIndex === -1) return;
          setLeads(arrayMove(leads, activeIndex, overIndex));
          return;
      }
      
       const updatedLead = { ...activeLead, status: newStatus };
      
      const originalLeads = [...leads];
      const activeIndex = originalLeads.findIndex((l) => l.id === activeId);
      const overIndex = originalLeads.findIndex((l) => l.id === overId);
      const updatedOptimisticLeads = originalLeads.filter(l => l.id !== activeId);
      const insertionIndex = overIsAColumn ? updatedOptimisticLeads.length : overIndex;
      updatedOptimisticLeads.splice(insertionIndex, 0, updatedLead);
      setLeads(updatedOptimisticLeads);

      try {
          await editLead(updatedLead);
          addToast(`Lead moved to ${newStatus}`, 'info');
      } catch (error) {
          setLeads(originalLeads);
      }
  };

  const deleteLead = async (leadId: string) => {
    const originalLeads = [...leads];
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
    try {
        await api.delete(`/leads/${leadId}`);
        addToast('Lead deleted successfully', 'success');
    } catch (error) {
        setLeads(originalLeads);
        addToast('Failed to delete lead.', 'error');
    }
  };
  
  const addLead = async (newLeadData: Omit<Lead, 'id' | 'avatar' | 'activity'>) => {
    try {
        const { lead } = await api.post<{ lead: Lead }>('/leads', newLeadData);
        setLeads(prev => [lead, ...prev]);
        addToast('Lead added successfully!', 'success');
    } catch (error) {
        addToast('Failed to add lead.', 'error');
    }
  }
  
  const editLead = async (updatedLead: Lead) => {
    try {
        const { lead } = await api.put<{ lead: Lead }>(`/leads/${updatedLead.id}`, updatedLead);
        setLeads(prev => prev.map(l => (l.id === lead.id ? lead : l)));
        addToast(`Lead "${lead.name}" updated successfully!`, 'success');
    } catch (error) {
        addToast('Failed to update lead.', 'error');
    }
  }

  const addNoteToLead = async (leadId: string, noteText: string) => {
    if (!noteText.trim()) return;
    try {
        const { lead } = await api.post<{ lead: Lead }>(`/leads/${leadId}/note`, { noteText });
        setLeads(prevLeads => prevLeads.map(l => (l.id === lead.id ? lead : l)));
        addToast('Note added successfully!', 'success');
    } catch (error) {
        addToast('Failed to add note.', 'error');
    }
  };
  
  const openModal = (lead?: Lead) => { setEditingLead(lead || null); setIsModalOpen(true); }
  const closeModal = () => { setIsModalOpen(false); setEditingLead(null); }
  const openViewModal = (lead: Lead) => { setViewingLead(lead); setIsViewModalOpen(true); }
  const closeViewModal = () => { setIsViewModalOpen(false); setViewingLead(null); }

  useEffect(() => {
    if (viewingLead) {
      const updatedLeadInList = leads.find(l => l.id === viewingLead.id);
      if (updatedLeadInList && JSON.stringify(updatedLeadInList) !== JSON.stringify(viewingLead)) {
        setViewingLead(updatedLeadInList);
      }
    }
  }, [leads, viewingLead]);

  const filteredLeads = useMemo(() => {
    let processLeads = [...leads];
    
    if (searchTerm) {
      processLeads = processLeads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (user?.role === 'admin' && filterAssignee !== 'All') {
      processLeads = processLeads.filter(lead => lead.assignedTo === filterAssignee);
    }

    processLeads.sort((a, b) => {
        switch(sortBy) {
            case 'priority-desc': return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'name-asc': return a.name.localeCompare(b.name);
            case 'date-asc': {
                const dateA = a.followUpDateTime ? new Date(a.followUpDateTime).getTime() : Infinity;
                const dateB = b.followUpDateTime ? new Date(b.followUpDateTime).getTime() : Infinity;
                return dateA - dateB;
            }
            default: return 0;
        }
    });

    return processLeads;
  }, [leads, searchTerm, filterAssignee, sortBy, user]);

  return (
    <LeadsContext.Provider value={{ 
        leads, 
        loading,
        fetchLeads,
        deleteLead,
        addLead,
        editLead,
        addNoteToLead,
        handleLeadDragEnd,
        filteredLeads, 
        setSearchTerm, 
        searchTerm, 
        recentSearches, 
        addRecentSearch,
        leadToDelete,
        setLeadToDelete,
        editingLead,
        isModalOpen,
        openModal,
        closeModal,
        viewingLead,
        isViewModalOpen,
        openViewModal,
        closeViewModal,
        filterAssignee,
        setFilterAssignee,
        sortBy,
        setSortBy
    }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};