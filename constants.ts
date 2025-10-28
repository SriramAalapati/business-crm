import { Lead, LeadStatus, KanbanColumn, Agent, User, Task, TaskStatus, LeadSource, Opportunity, OpportunityStage } from './types';

export const KANBAN_COLUMNS: KanbanColumn[] = [
    { id: LeadStatus.NEW, title: 'New' },
    { id: LeadStatus.CONTACTED, title: 'Contacted' },
    { id: LeadStatus.QUALIFIED, title: 'Qualified' },
    { id: LeadStatus.WON, title: 'Closed Won' },
    { id: LeadStatus.LOST, title: 'Closed Lost' },
];

export const OPPORTUNITY_STAGES_CONFIG: { id: OpportunityStage, title: string, probability: number }[] = [
    { id: OpportunityStage.PROSPECTING, title: 'Prospecting', probability: 10 },
    { id: OpportunityStage.QUALIFICATION, title: 'Qualification', probability: 25 },
    { id: OpportunityStage.NEEDS_ANALYSIS, title: 'Needs Analysis', probability: 40 },
    { id: OpportunityStage.PROPOSAL, title: 'Value Proposition', probability: 60 },
    { id: OpportunityStage.NEGOTIATION, title: 'Negotiation/Review', probability: 80 },
    { id: OpportunityStage.WON, title: 'Closed Won', probability: 100 },
    { id: OpportunityStage.LOST, title: 'Closed Lost', probability: 0 },
];

const ADMIN_USER: User = { 
  id: 'admin-1', 
  name: 'Admin', 
  email: 'admin@businesscrm.com', 
  avatar: 'https://i.pravatar.cc/150?u=Admin', 
  role: 'admin' 
};

export const INITIAL_AGENTS: Agent[] = [
  { id: 'agent-1', name: 'Alice', email: 'alice@businesscrm.com', avatar: 'https://i.pravatar.cc/150?u=Alice', role: 'Sales Executive' },
  { id: 'agent-2', name: 'Bob', email: 'bob@businesscrm.com', avatar: 'https://i.pravatar.cc/150?u=Bob', role: 'Sales Executive' },
  { id: 'agent-3', name: 'Charlie', email: 'charlie@businesscrm.com', avatar: 'https://i.pravatar.cc/150?u=Charlie', role: 'Senior Sales Executive' },
  { id: 'agent-4', name: 'Diana', email: 'diana@businesscrm.com', avatar: 'https://i.pravatar.cc/150?u=Diana', role: 'Sales Associate' },
];

export const ALL_USERS: User[] = [
  ADMIN_USER,
  ...INITIAL_AGENTS.map(agent => ({...agent, role: 'agent' as const}))
];


export const ASSIGNEES = [...INITIAL_AGENTS.map(agent => agent.name), 'Admin'];

const sources: LeadSource[] = ['Website', 'Referral', 'Cold Call', 'Event'];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'John Doe',
    company: 'Acme Inc.',
    priority: 'High',
    dealValue: 500000,
    status: LeadStatus.NEW,
    contactedDate: '2023-10-01',
    followUpDateTime: '2023-10-15T14:00:00.000Z',
    assignedTo: 'Alice',
    avatar: 'https://picsum.photos/seed/lead-1/40/40',
    notes: 'Initial contact made. Interested in our premium package.',
    source: sources[0],
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
    followUpDateTime: '2023-10-12T10:30:00.000Z',
    assignedTo: 'Bob',
    avatar: 'https://picsum.photos/seed/lead-2/40/40',
    source: sources[1],
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
    followUpDateTime: '2023-10-10T11:00:00.000Z',
    assignedTo: 'Alice',
    avatar: 'https://picsum.photos/seed/lead-3/40/40',
    notes: 'Demo scheduled for next week. Key decision maker will be present.',
    source: sources[2],
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
    source: sources[3],
     activity: [
        { id: 'act-4-1', type: 'Created', user: 'Admin', timestamp: '2023-09-20T16:00:00Z', details: 'Lead was created.'},
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
    source: sources[1],
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
    followUpDateTime: '2023-10-17T09:00:00.000Z',
    assignedTo: 'Charlie',
    avatar: 'https://picsum.photos/seed/lead-7/40/40',
    source: sources[2],
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
    followUpDateTime: '2023-10-14T16:00:00.000Z',
    assignedTo: 'Bob',
    avatar: 'https://picsum.photos/seed/lead-8/40/40',
    notes: 'Needs a custom solution. Engineering team has been looped in.',
    source: sources[3],
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
    followUpDateTime: '2023-10-18T13:00:00.000Z',
    assignedTo: 'Diana',
    avatar: 'https://picsum.photos/seed/lead-9/40/40',
    source: sources[0],
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
    followUpDateTime: '2023-10-20T10:00:00.000Z',
    assignedTo: 'Diana',
    avatar: 'https://picsum.photos/seed/lead-10/40/40',
    source: sources[1],
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
    followUpDateTime: '2023-10-21T14:30:00.000Z',
    assignedTo: 'Alice',
    avatar: 'https://picsum.photos/seed/lead-11/40/40',
    source: sources[2],
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
    followUpDateTime: '2023-10-22T11:30:00.000Z',
    assignedTo: 'Charlie',
    avatar: 'https://picsum.photos/seed/lead-12/40/40',
    source: sources[3],
    activity: [
      { id: 'act-12-1', type: 'Created', user: 'Admin', timestamp: '2023-10-07T09:00:00Z', details: 'Lead was created.' },
      { id: 'act-12-2', type: 'Status Change', user: 'Charlie', timestamp: '2023-10-08T11:00:00Z', details: 'Status changed from New to Contacted.' }
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
    followUpDateTime: '2023-10-16T15:00:00.000Z',
    assignedTo: 'Admin',
    avatar: 'https://picsum.photos/seed/lead-14/40/40',
    source: sources[1],
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
    followUpDateTime: '2023-10-25T09:30:00.000Z',
    assignedTo: 'Bob',
    avatar: 'https://picsum.photos/seed/lead-15/40/40',
    source: sources[2],
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
    followUpDateTime: '2023-10-26T16:00:00.000Z',
    assignedTo: 'Diana',
    avatar: 'https://picsum.photos/seed/lead-16/40/40',
    source: sources[3],
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
    followUpDateTime: '2023-10-27T10:30:00.000Z',
    assignedTo: 'Charlie',
    avatar: 'https://picsum.photos/seed/lead-17/40/40',
    source: sources[0],
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
    followUpDateTime: '2023-10-24T12:00:00.000Z',
    assignedTo: 'Alice',
    avatar: 'https://picsum.photos/seed/lead-18/40/40',
    source: sources[1],
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
    source: sources[2],
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
    followUpDateTime: '2023-10-28T11:00:00.000Z',
    assignedTo: 'Admin',
    avatar: 'https://picsum.photos/seed/lead-20/40/40',
    source: sources[3],
    activity: [{ id: 'act-20-1', type: 'Created', user: 'Admin', timestamp: '2023-10-13T14:45:00Z', details: 'Lead was created.' }]
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    name: 'Cyberdyne Integration',
    company: 'Cyberdyne Systems',
    dealValue: 1500000,
    stage: OpportunityStage.WON,
    probability: 100,
    expectedCloseDate: '2023-09-30',
    assignedTo: 'Bob',
    avatar: 'https://picsum.photos/seed/lead-5/40/40',
    activity: [
      { id: 'act-opp-1-1', type: 'Created', user: 'Bob', timestamp: '2023-08-20T10:00:00Z', details: 'Opportunity created from qualified lead.'},
      { id: 'act-opp-1-2', type: 'Status Change', user: 'Bob', timestamp: '2023-09-15T10:00:00Z', details: 'Stage changed to Closed Won.'},
    ],
  },
  {
    id: 'opp-2',
    name: 'Wayne Tower Security Upgrade',
    company: 'Wayne Enterprises',
    dealValue: 2500000,
    stage: OpportunityStage.NEGOTIATION,
    probability: 80,
    expectedCloseDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
    assignedTo: 'Charlie',
    avatar: 'https://picsum.photos/seed/lead-4/40/40',
    activity: [
      { id: 'act-opp-2-1', type: 'Created', user: 'Charlie', timestamp: '2023-09-22T10:00:00Z', details: 'Opportunity created from qualified lead.'},
    ],
  },
  {
    id: 'opp-3',
    name: 'Stark Expo Presentation System',
    company: 'Stark Industries',
    dealValue: 750000,
    stage: OpportunityStage.PROPOSAL,
    probability: 60,
    expectedCloseDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString().split('T')[0],
    assignedTo: 'Alice',
    avatar: 'https://picsum.photos/seed/lead-3/40/40',
    activity: [
      { id: 'act-opp-3-1', type: 'Created', user: 'Alice', timestamp: '2023-10-01T10:00:00Z', details: 'Opportunity created from qualified lead.'},
    ],
  },
  {
    id: 'opp-4',
    name: 'Weyland-Yutani Terraforming Contract',
    company: 'Weyland-Yutani',
    dealValue: 5500000,
    stage: OpportunityStage.QUALIFICATION,
    probability: 25,
    expectedCloseDate: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString().split('T')[0],
    assignedTo: 'Admin',
    avatar: 'https://picsum.photos/seed/lead-14/40/40',
    activity: [
      { id: 'act-opp-4-1', type: 'Created', user: 'Admin', timestamp: '2023-10-05T10:00:00Z', details: 'Opportunity created from qualified lead.'},
    ],
  },
  {
    id: 'opp-5',
    name: 'CHOAM Spice Mining Fleet',
    company: 'CHOAM',
    dealValue: 450000,
    stage: OpportunityStage.WON,
    probability: 100,
    expectedCloseDate: '2023-10-01',
    assignedTo: 'Diana',
    avatar: 'https://picsum.photos/seed/lead-13/40/40',
    activity: [
        { id: 'act-opp-5-1', type: 'Created', user: 'Diana', timestamp: '2023-09-10T10:00:00Z', details: 'Opportunity created from qualified lead.'},
    ]
  },
  {
    id: 'opp-6',
    name: 'Gekko & Co Trading Platform',
    company: 'Gekko & Co',
    dealValue: 1800000,
    stage: OpportunityStage.PROSPECTING,
    probability: 10,
    expectedCloseDate: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString().split('T')[0],
    assignedTo: 'Bob',
    avatar: 'https://picsum.photos/seed/lead-8/40/40',
    activity: [
        { id: 'act-opp-6-1', type: 'Created', user: 'Bob', timestamp: '2023-10-10T10:00:00Z', details: 'New opportunity added.'},
    ]
  },
   {
    id: 'opp-7',
    name: 'Omni Corp Security Robots',
    company: 'Omni Corp',
    dealValue: 4200000,
    stage: OpportunityStage.NEEDS_ANALYSIS,
    probability: 40,
    expectedCloseDate: new Date(new Date().setDate(new Date().getDate() + 35)).toISOString().split('T')[0],
    assignedTo: 'Alice',
    avatar: 'https://picsum.photos/seed/lead-18/40/40',
    activity: [
        { id: 'act-opp-7-1', type: 'Created', user: 'Alice', timestamp: '2023-10-11T10:00:00Z', details: 'New opportunity added.'},
    ]
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Prepare demo for Stark Industries',
    dueDateTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    priority: 'High',
    status: TaskStatus.IN_PROGRESS,
    assignedTo: 'Alice',
    relatedLeadId: 'lead-3',
    notes: 'Focus on the custom integration capabilities.'
  },
  {
    id: 'task-2',
    title: 'Follow up call with Globex Corp.',
    dueDateTime: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    priority: 'Medium',
    status: TaskStatus.TODO,
    assignedTo: 'Bob',
    relatedLeadId: 'lead-2',
  },
  {
    id: 'task-3',
    title: 'Send proposal to Wayne Enterprises',
    dueDateTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    priority: 'High',
    status: TaskStatus.DONE,
    assignedTo: 'Charlie',
    relatedLeadId: 'lead-4'
  },
  {
    id: 'task-4',
    title: 'Schedule initial contact with InGen',
    dueDateTime: new Date(new Date().setDate(new Date().getDate() + 8)).toISOString(),
    priority: 'Low',
    status: TaskStatus.TODO,
    assignedTo: 'Diana',
    relatedLeadId: 'lead-10'
  },
  {
    id: 'task-5',
    title: 'Finalize contract with Monsters, Inc.',
    dueDateTime: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    priority: 'High',
    status: TaskStatus.TODO,
    assignedTo: 'Charlie',
    relatedLeadId: 'lead-12'
  }
];