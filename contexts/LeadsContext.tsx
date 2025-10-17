import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { Lead, LeadStatus } from '../types';
import { INITIAL_LEADS } from '../constants';

interface LeadsContextType {
  leads: Lead[];
  updateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  filteredLeads: Lead[];
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
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
      return newSearches.slice(0, 5); // Keep last 5 searches
    });
  };

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
    <LeadsContext.Provider value={{ leads, updateLeadStatus, filteredLeads, setSearchTerm, searchTerm, recentSearches, addRecentSearch }}>
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
