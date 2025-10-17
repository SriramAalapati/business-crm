
export interface User {
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
  PROPOSAL = 'Proposal Sent',
  WON = 'Closed Won',
  LOST = 'Closed Lost'
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  value: number;
  status: LeadStatus;
  contactedDate: string;
  followUpDate?: string;
  assignedTo: string;
  avatar: string;
}

export interface KanbanColumn {
    id: LeadStatus;
    title: string;
}
