import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { Lead, LeadStatus, AppProviderProps, SortOption, Priority, LeadActivity } from '../types';
import { INITIAL_LEADS, KANBAN_COLUMNS } from '../constants';
import { arrayMove } from '@dnd-kit/sortable';
import { useUser } from './UserContext';
import { useToast } from './ToastContext';

interface LeadsContextType {
  leads: Lead[];
  deleteLead: (leadId: string) => void;
  addLead: (newLeadData: Omit<Lead, 'id' | 'avatar' | 'activity'>) => void;
  editLead: (updatedLead: Lead) => void;
  addNoteToLead: (leadId: string, noteText: string) => void;
  handleLeadDragEnd: (active: { id: string, data: React.MutableRefObject<any> }, over: { id: string, data: React.MutableRefObject<any> } | null) => void;
  
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
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
        const item = window.localStorage.getItem('crm-leads');
        return item ? JSON.parse(item) : INITIAL_LEADS;
    } catch (error) {
        console.error("Error reading leads from localStorage", error);
        return INITIAL_LEADS;
    }
  });
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

  useEffect(() => {
    try {
        window.localStorage.setItem('crm-leads', JSON.stringify(leads));
    } catch (error) {
        console.error("Error saving leads to localStorage", error);
    }
  }, [leads]);

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

    const handleLeadDragEnd = (active: { id: string }, over: { id: string } | null) => {
        if (!over || active.id === over.id) {
            return;
        }

        setLeads((prevLeads) => {
            const activeId = String(active.id);
            const overId = String(over.id);

            const activeIndex = prevLeads.findIndex((l) => l.id === activeId);
            const overIndex = prevLeads.findIndex((l) => l.id === overId);

            const activeLead = prevLeads[activeIndex];
            if (!activeLead) return prevLeads;

            const overIsAColumn = KANBAN_COLUMNS.some((c) => c.id === overId);
            const newStatus = overIsAColumn
                ? (overId as LeadStatus)
                : overIndex !== -1
                ? prevLeads[overIndex].status
                : null;

            if (!newStatus) return prevLeads;

            // CASE 1: Reordering within the same column.
            if (newStatus === activeLead.status) {
                if (overIndex === -1) return prevLeads;
                return arrayMove(prevLeads, activeIndex, overIndex);
            }

            // CASE 2: Moving to a new column.
            const updatedLead = {
                ...activeLead,
                status: newStatus,
                activity: [
                    createActivity(
                        'Status Change',
                        `Status changed from ${activeLead.status} to ${newStatus}`
                    ),
                    ...activeLead.activity,
                ],
            };
            addToast(`Lead moved to ${newStatus}`, 'info');

            const remainingLeads = prevLeads.filter((l) => l.id !== activeId);
            
            let insertionIndex;

            if (overIsAColumn) {
                 // Dropped on an empty column. Place it logically based on column order.
                const columnOrder = KANBAN_COLUMNS.map(c => c.id);
                const newStatusOrderIndex = columnOrder.indexOf(newStatus);
                
                let lastRelevantIndex = -1;
                 // Find the last item that is in the new column's preceding columns.
                for (let i = remainingLeads.length - 1; i >= 0; i--) {
                    const currentStatusOrderIndex = columnOrder.indexOf(remainingLeads[i].status);
                    if (currentStatusOrderIndex < newStatusOrderIndex) {
                        lastRelevantIndex = i;
                        break;
                    }
                }
                insertionIndex = lastRelevantIndex + 1;
            } else {
                // Dropped on another lead card. Find its new index in the filtered array.
                const overLeadInRemaining = remainingLeads.findIndex((l) => l.id === overId);
                insertionIndex = overLeadInRemaining;
            }

            remainingLeads.splice(insertionIndex, 0, updatedLead);
            return remainingLeads;
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
    let leadName = '';
    setLeads(prev => prev.map(lead => {
        if (lead.id === updatedLead.id) {
            leadName = updatedLead.name;
            const activity = createActivity('Edited', 'Lead details were updated.');
            return {...updatedLead, activity: [activity, ...updatedLead.activity]};
        }
        return lead;
    }));
    addToast(`Lead "${leadName}" updated successfully!`, 'success');
  }

  const addNoteToLead = (leadId: string, noteText: string) => {
    if (!noteText.trim()) return;
    setLeads(prevLeads =>
      prevLeads.map(lead => {
        if (lead.id === leadId) {
          const newActivity = createActivity('Note Added', noteText);
          return { ...lead, activity: [newActivity, ...lead.activity] };
        }
        return lead;
      })
    );
    addToast('Note added successfully!', 'success');
  };
  
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