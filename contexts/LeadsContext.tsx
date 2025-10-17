
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Lead, LeadStatus } from '../types';
import { INITIAL_LEADS } from '../constants';

interface LeadsContextType {
  leads: Lead[];
  updateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  filteredLeads: Lead[];
  setSearchTerm: (term: string) => void;
  searchTerm: string;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [searchTerm, setSearchTerm] = useState('');

  const updateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  const filteredLeads = useMemo(() => {
    if (!searchTerm) return leads;
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  return (
    <LeadsContext.Provider value={{ leads, updateLeadStatus, filteredLeads, setSearchTerm, searchTerm }}>
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
