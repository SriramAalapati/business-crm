import { Lead, LeadStatus, KanbanColumn, Agent, User } from './types';

export const KANBAN_COLUMNS: KanbanColumn[] = [
    { id: LeadStatus.NEW, title: 'New' },
    { id: LeadStatus.CONTACTED, title: 'Contacted' },
    { id: LeadStatus.QUALIFIED, title: 'Qualified' },
    { id: LeadStatus.WON, title: 'Closed Won' },
    { id: LeadStatus.LOST, title: 'Closed Lost' },
];

const ADMIN_USER: User = { 
  id: 'admin-1', 
  name: 'Admin', 
  email: 'admin@geminicrm.com', 
  avatar: 'https://i.pravatar.cc/150?u=Admin', 
  role: 'admin' 
};

export const INITIAL_AGENTS: Agent[] = [
  { id: 'agent-1', name: 'Alice', email: 'alice@geminicrm.com', avatar: 'https://i.pravatar.cc/150?u=Alice', role: 'Sales Executive' },
  { id: 'agent-2', name: 'Bob', email: 'bob@geminicrm.com', avatar: 'https://i.pravatar.cc/150?u=Bob', role: 'Sales Executive' },
  { id: 'agent-3', name: 'Charlie', email: 'charlie@geminicrm.com', avatar: 'https://i.pravatar.cc/150?u=Charlie', role: 'Senior Sales Executive' },
  { id: 'agent-4', name: 'Diana', email: 'diana@geminicrm.com', avatar: 'https://i.pravatar.cc/150?u=Diana', role: 'Sales Associate' },
];

export const ALL_USERS: User[] = [
  ADMIN_USER,
  ...INITIAL_AGENTS.map(agent => ({...agent, role: 'agent' as const}))
];


export const ASSIGNEES = INITIAL_AGENTS.map(agent => agent.name);

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'John Doe',
    company: 'Acme Inc.',
    priority: 'High',
    dealValue: 500000,
    status: LeadStatus.NEW,
    contactedDate: '2023-10-01',
    followUpDate: '2023-10-15',
    assignedTo: 'Alice',
    avatar: 'https://picsum.photos/seed/lead-1/40/40',
    notes: 'Initial contact made. Interested in our premium package.',
    activity: [
      { id: 'act-1-1', type: 'Created', user: 'Admin', timestamp: '2023-10-01T10:00:00Z', details: 'Lead was created.'}
    ]
  },
  {
    id: 'lead-2',
    name: 'Jane Smith',
    company: 'Globex Corp.',
    priority: 'Medium',
    dealValue: 1200000,
    status: LeadStatus.CONTACTED,
    contactedDate: '2023-09-28',
    followUpDate: '2023-10-12',
    assignedTo: 'Bob',
    avatar: 'https://picsum.photos/seed/lead-2/40/40',
    activity: [
      { id: 'act-2-1', type: 'Created', user: 'Admin', timestamp: '2023-09-28T11:30:00Z', details: 'Lead was created.'},
      { id: 'act-2-2', type: 'Status Change', user: 'Bob', timestamp: '2023-09-29T15:00:00Z', details: 'Status changed from New to Contacted.'},
    ]
  },
  {
    id: 'lead-3',
    name: 'Peter Jones',
    company: 'Stark Industries',
    priority: 'High',
    dealValue: 750000,
    status: LeadStatus.QUALIFIED,
    contactedDate: '2023-09-25',
    followUpDate: '2023-10-10',
    assignedTo: 'Alice',
    avatar: 'https://picsum.photos/seed/lead-3/40/40',
    notes: 'Demo scheduled for next week. Key decision maker will be present.',
    activity: [
        { id: 'act-3-1', type: 'Created', user: 'Admin', timestamp: '2023-09-25T09:00:00Z', details: 'Lead was created.'},
        { id: 'act-3-2', type: 'Status Change', user: 'Alice', timestamp: '2023-09-26T14:20:00Z', details: 'Status changed from New to Contacted.'},
        { id: 'act-3-3', type: 'Status Change', user: 'Alice', timestamp: '2023-09-30T10:00:00Z', details: 'Status changed from Contacted to Qualified.'},
    ]
  },
   {
    id: 'lead-4',
    name: 'Mary Williams',
    company: 'Wayne Enterprises',
    priority: 'Low',
    dealValue: 2500000,
    status: LeadStatus.QUALIFIED,
    contactedDate: '2023-09-20',
    assignedTo: 'Charlie',
    avatar: 'https://picsum.photos/seed/lead-4/40/40',
     activity: [
        { id: 'act-4-1', type: 'Created', user: 'Admin', timestamp: '2023-09-20T16:00:00Z', details: 'Lead was created.'},
     ]
  },
  {
    id: 'lead-5',
    name: 'David Brown',
    company: 'Cyberdyne Systems',
    priority: 'Medium',
    dealValue: 1500000,
    status: LeadStatus.WON,
    contactedDate: '2023-08-15',
    assignedTo: 'Bob',
    avatar: 'https://picsum.photos/seed/lead-5/40/40',
    activity: [
        { id: 'act-5-1', type: 'Created', user: 'Admin', timestamp: '2023-08-15T12:00:00Z', details: 'Lead was created.'},
        { id: 'act-5-2', type: 'Status Change', user: 'Bob', timestamp: '2023-09-01T18:00:00Z', details: 'Status changed from Qualified to Closed Won.'},
    ]
  },
    {
    id: 'lead-6',
    name: 'Susan Miller',
    company: 'Ollivanders',
    priority: 'Low',
    dealValue: 300000,
    status: LeadStatus.LOST,
    contactedDate: '2023-09-18',
    assignedTo: 'Alice',
    avatar: 'https://picsum.photos/seed/lead-6/40/40',
    notes: 'Chose a competitor based on price.',
    activity: [
        { id: 'act-6-1', type: 'Created', user: 'Admin', timestamp: '2023-09-18T13:45:00Z', details: 'Lead was created.'},
        { id: 'act-6-2', type: 'Status Change', user: 'Alice', timestamp: '2023-09-22T11:00:00Z', details: 'Status changed from Contacted to Closed Lost.'},
    ]
  },
    {
    id: 'lead-7',
    name: 'Michael Clark',
    company: 'Buy n Large',
    priority: 'High',
    dealValue: 900000,
    status: LeadStatus.NEW,
    contactedDate: '2023-10-02',
    followUpDate: '2023-10-17',
    assignedTo: 'Charlie',
    avatar: 'https://picsum.photos/seed/lead-7/40/40',
    activity: [
        { id: 'act-7-1', type: 'Created', user: 'Admin', timestamp: '2023-10-02T09:30:00Z', details: 'Lead was created.'},
    ]
  },
  {
    id: 'lead-8',
    name: 'Linda Martinez',
    company: 'Gekko & Co',
    priority: 'Medium',
    dealValue: 1800000,
    status: LeadStatus.QUALIFIED,
    contactedDate: '2023-09-30',
    followUpDate: '2023-10-14',
    assignedTo: 'Bob',
    avatar: 'https://picsum.photos/seed/lead-8/40/40',
    notes: 'Needs a custom solution. Engineering team has been looped in.',
    activity: [
      { id: 'act-8-1', type: 'Created', user: 'Admin', timestamp: '2023-09-30T14:00:00Z', details: 'Lead was created.'},
      { id: 'act-8-2', type: 'Note Added', user: 'Bob', timestamp: '2023-10-01T16:00:00Z', details: 'Added a note.'},
    ]
  },
  {
    id: 'lead-9',
    name: 'Robert Garcia',
    company: 'Soylent Corp',
    priority: 'Low',
    dealValue: 650000,
    status: LeadStatus.CONTACTED,
    contactedDate: '2023-10-03',
    followUpDate: '2023-10-18',
    assignedTo: 'Diana',
    avatar: 'https://picsum.photos/seed/lead-9/40/40',
    activity: [
        { id: 'act-9-1', type: 'Created', user: 'Admin', timestamp: '2023-10-03T10:15:00Z', details: 'Lead was created.'},
    ]
  },
  {
    id: 'lead-10',
    name: 'Patricia Rodriguez',
    company: 'InGen',
    priority: 'High',
    dealValue: 2200000,
    status: LeadStatus.NEW,
    contactedDate: '2023-10-05',
    followUpDate: '2023-10-20',
    assignedTo: 'Diana',
    avatar: 'https://picsum.photos/seed/lead-10/40/40',
    activity: [
        { id: 'act-10-1', type: 'Created', user: 'Admin', timestamp: '2023-10-05T11:00:00Z', details: 'Lead was created.'},
    ]
  },
  {
    id: 'lead-11',
    name: 'James Wilson',
    company: 'Tyrell Corporation',
    priority: 'Medium',
    dealValue: 1350000,
    status: LeadStatus.NEW,
    contactedDate: '2023-10-06',
    followUpDate: '2023-10-21',
    assignedTo: 'Alice',
    avatar: 'https://picsum.photos/seed/lead-11/40/40',
    activity: [
      { id: 'act-11-1', type: 'Created', user: 'Admin', timestamp: '2023-10-06T14:00:00Z', details: 'Lead was created.' }
    ]
  },
  {
    id: 'lead-12',
    name: 'Barbara Anderson',
    company: 'Monsters, Inc.',
    priority: 'High',
    dealValue: 3000000,
    status: LeadStatus.CONTACTED,
    contactedDate: '2023-10-07',
    followUpDate: '2023-10-22',
    assignedTo: 'Charlie',
    avatar: 'https://picsum.photos/seed/lead-12/40/40',
    activity: [
      { id: 'act-12-1', type: 'Created', user: 'Admin', timestamp: '2023-10-07T09:00:00Z', details: 'Lead was created.' },
      { id: 'act-12-2', type: 'Status Change', user: 'Charlie', timestamp: '2023-10-08T11:00:00Z', details: 'Status changed from New to Contacted.' }
    ]
  },
  {
    id: 'lead-13',
    name: 'Thomas Taylor',
    company: 'CHOAM',
    priority: 'Low',
    dealValue: 450000,
    status: LeadStatus.WON,
    contactedDate: '2023-09-05',
    assignedTo: 'Diana',
    avatar: 'https://picsum.photos/seed/lead-13/40/40',
    activity: [
      { id: 'act-13-1', type: 'Created', user: 'Admin', timestamp: '2023-09-05T13:00:00Z', details: 'Lead was created.' },
      { id: 'act-13-2', type: 'Status Change', user: 'Diana', timestamp: '2023-09-25T17:00:00Z', details: 'Status changed from Qualified to Closed Won.' }
    ]
  },
  {
    id: 'lead-14',
    name: 'Karen Moore',
    company: 'Weyland-Yutani',
    priority: 'High',
    dealValue: 5500000,
    status: LeadStatus.QUALIFIED,
    contactedDate: '2023-10-01',
    followUpDate: '2023-10-16',
    assignedTo: 'Admin',
    avatar: 'https://picsum.photos/seed/lead-14/40/40',
    activity: [
      { id: 'act-14-1', type: 'Created', user: 'Admin', timestamp: '2023-10-01T18:00:00Z', details: 'Lead was created.' },
      { id: 'act-14-2', type: 'Status Change', user: 'Admin', timestamp: '2023-10-04T10:00:00Z', details: 'Status changed from Contacted to Qualified.' }
    ]
  },
  {
    id: 'lead-15',
    name: 'Richard Jackson',
    company: 'Blue Sun Corp',
    priority: 'Medium',
    dealValue: 1100000,
    status: LeadStatus.NEW,
    contactedDate: '2023-10-10',
    followUpDate: '2023-10-25',
    assignedTo: 'Bob',
    avatar: 'https://picsum.photos/seed/lead-15/40/40',
    activity: [
      { id: 'act-15-1', type: 'Created', user: 'Admin', timestamp: '2023-10-10T12:30:00Z', details: 'Lead was created.' }
    ]
  },
  {
    id: 'lead-16',
    name: 'Nancy Lee',
    company: 'VersaLife',
    priority: 'Low',
    dealValue: 800000,
    status: LeadStatus.NEW,
    contactedDate: '2023-10-11',
    followUpDate: '2023-10-26',
    assignedTo: 'Diana',
    avatar: 'https://picsum.photos/seed/lead-16/40/40',
    activity: [{ id: 'act-16-1', type: 'Created', user: 'Admin', timestamp: '2023-10-11T11:00:00Z', details: 'Lead was created.' }]
  },
  {
    id: 'lead-17',
    name: 'Paul Harris',
    company: 'Massive Dynamic',
    priority: 'Medium',
    dealValue: 1750000,
    status: LeadStatus.CONTACTED,
    contactedDate: '2023-10-12',
    followUpDate: '2023-10-27',
    assignedTo: 'Charlie',
    avatar: 'https://picsum.photos/seed/lead-17/40/40',
    activity: [{ id: 'act-17-1', type: 'Created', user: 'Admin', timestamp: '2023-10-12T15:00:00Z', details: 'Lead was created.' }]
  },
  {
    id: 'lead-18',
    name: 'Sandra Clark',
    company: 'Omni Corp',
    priority: 'High',
    dealValue: 4200000,
    status: LeadStatus.QUALIFIED,
    contactedDate: '2023-10-09',
    followUpDate: '2023-10-24',
    assignedTo: 'Alice',
    avatar: 'https://picsum.photos/seed/lead-18/40/40',
    activity: [{ id: 'act-18-1', type: 'Created', user: 'Admin', timestamp: '2023-10-09T16:30:00Z', details: 'Lead was created.' }]
  },
  {
    id: 'lead-19',
    name: 'Mark Allen',
    company: 'Virtucon',
    priority: 'Low',
    dealValue: 550000,
    status: LeadStatus.LOST,
    contactedDate: '2023-09-15',
    assignedTo: 'Bob',
    avatar: 'https://picsum.photos/seed/lead-19/40/40',
    activity: [{ id: 'act-19-1', type: 'Created', user: 'Admin', timestamp: '2023-09-15T10:00:00Z', details: 'Lead was created.' }]
  },
  {
    id: 'lead-20',
    name: 'Betty Wright',
    company: 'Spacely Sprockets',
    priority: 'Medium',
    dealValue: 950000,
    status: LeadStatus.NEW,
    contactedDate: '2023-10-13',
    followUpDate: '2023-10-28',
    assignedTo: 'Admin',
    avatar: 'https://picsum.photos/seed/lead-20/40/40',
    activity: [{ id: 'act-20-1', type: 'Created', user: 'Admin', timestamp: '2023-10-13T14:45:00Z', details: 'Lead was created.' }]
  }
];
