import { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'agent';
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  WON = 'Closed Won',
  LOST = 'Closed Lost'
}

export type Priority = 'High' | 'Medium' | 'Low';

export interface LeadActivity {
  id: string;
  type: 'Created' | 'Status Change' | 'Edited' | 'Note Added';
  timestamp: string;
  user: string;
  details: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  priority: Priority;
  status: LeadStatus;
  contactedDate: string;
  followUpDate?: string;
  assignedTo: string;
  avatar: string;
  notes?: string;
  dealValue: number;
  activity: LeadActivity[];
}

export interface KanbanColumn {
    id: LeadStatus;
    title: string;
}

export type SortOption = 'priority-desc' | 'name-asc' | 'date-asc';

export interface AppProviderProps {
  children: ReactNode;
}

export interface PersonalEvent {
  title: string;
  date: string;
}
