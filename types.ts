import { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'agent';
}

export interface Agent {
  id:string;
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

export type LeadSource = 'Website' | 'Referral' | 'Cold Call' | 'Event';

export interface Lead {
  id: string;
  name: string;
  company: string;
  priority: Priority;
  status: LeadStatus;
  contactedDate: string;
  followUpDateTime?: string;
  assignedTo: string;
  avatar: string;
  notes?: string;
  dealValue: number;
  activity: LeadActivity[];
  source: LeadSource;
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
  start: string;
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export interface Task {
  id: string;
  title: string;
  dueDateTime: string;
  priority: Priority;
  status: TaskStatus;
  assignedTo: string;
  relatedLeadId?: string;
  notes?: string;
}