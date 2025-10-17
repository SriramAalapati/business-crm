import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { Lead, LeadStatus, AppProviderProps, SortOption, Priority, LeadActivity } from '../types';
import { INITIAL_LEADS } from '../constants';
import { arrayMove } from '@dnd-kit/sortable';
import { useUser } from './UserContext';

interface LeadsContextType {
  leads: Lead[];
  updateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  deleteLead: (leadId: string) => void;
  addLead: (newLeadData: Omit<Lead, 'id' | 'avatar' | 'activity'>) => void;
  editLead: (updatedLead: Lead) => void;
  reorderLeads: (activeId: string, overId: string) => void;
  
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
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
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

  const createActivity = (type: LeadActivity['type'], details: string): LeadActivity => ({
    id: `act-${Date.now()}`,
    type,
    details,
    user: user?.name || 'System',
    timestamp: new Date().toISOString(),
  });

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

  const updateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prevLeads =>
      prevLeads.map(lead => {
        if (lead.id === leadId) {
          const activity = createActivity('Status Change', `Status changed from ${lead.status} to ${newStatus}.`);
          return { ...lead, status: newStatus, activity: [activity, ...lead.activity] };
        }
        return lead;
      })
    );
  };
  
  const reorderLeads = (activeId: string, overId: string) => {
    setLeads(prevLeads => {
        const activeIndex = prevLeads.findIndex(l => l.id === activeId);
        const overIndex = prevLeads.findIndex(l => l.id === overId);
        if (activeIndex === -1 || overIndex === -1) return prevLeads;
        return arrayMove(prevLeads, activeIndex, overIndex);
    });
  };

  const deleteLead = (leadId: string) => {
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
  };
  
  const addLead = (newLeadData: Omit<Lead, 'id' | 'avatar' | 'activity'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      avatar: `https://picsum.photos/seed/lead-${Date.now()}/40/40`,
      activity: [createActivity('Created', 'Lead was created.')]
    };
    setLeads(prev => [newLead, ...prev]);
  }
  
  const editLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(lead => {
        if (lead.id === updatedLead.id) {
            const activity = createActivity('Edited', 'Lead details were updated.');
            return {...updatedLead, activity: [activity, ...updatedLead.activity]};
        }
        return lead;
    }));
  }
  
  const openModal = (lead?: Lead) => {
    setEditingLead(lead || null);
    setIsModalOpen(true);
  }
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  }

  const openViewModal = (lead: Lead) => {
    setViewingLead(lead);
    setIsViewModalOpen(true);
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingLead(null);
  }

  const filteredLeads = useMemo(() => {
    let processLeads = [...leads];

    if (user?.role === 'agent') {
      processLeads = processLeads.filter(lead => lead.assignedTo === user.name);
    }
    
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
            case 'priority-desc':
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'date-asc': {
                const dateA = a.followUpDate ? new Date(a.followUpDate).getTime() : Infinity;
                const dateB = b.followUpDate ? new Date(b.followUpDate).getTime() : Infinity;
                return dateA - dateB;
            }
            default:
                return 0;
        }
    });

    return processLeads;
  }, [leads, searchTerm, filterAssignee, sortBy, user]);

  return (
    <LeadsContext.Provider value={{ 
        leads, 
        updateLeadStatus, 
        deleteLead,
        addLead,
        editLead,
        reorderLeads,
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