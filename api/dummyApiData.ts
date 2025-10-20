// api/dummyApiData.ts
import { ALL_USERS, INITIAL_LEADS, INITIAL_TASKS, INITIAL_AGENTS, INITIAL_OPPORTUNITIES, OPPORTUNITY_STAGES_CONFIG } from '../constants';
import { User, Lead, Task, Agent, LeadActivity, Opportunity, OpportunityStage } from '../types';

let leads: Lead[] = JSON.parse(JSON.stringify(INITIAL_LEADS));
let tasks: Task[] = JSON.parse(JSON.stringify(INITIAL_TASKS));
let agents: Agent[] = JSON.parse(JSON.stringify(INITIAL_AGENTS));
let opportunities: Opportunity[] = JSON.parse(JSON.stringify(INITIAL_OPPORTUNITIES));

const createApiResponse = (data: any, status = 200) => ({
    data,
    status,
});

const getUserFromToken = (headers?: Headers): string => {
    if (!headers) return 'System';
    const authHeader = headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer dummy-jwt-for-')) {
        const userName = authHeader.replace('Bearer dummy-jwt-for-', '');
        const user = ALL_USERS.find(u => u.name.toLowerCase() === userName.toLowerCase());
        return user ? user.name : 'System';
    }
    const adminUser = ALL_USERS.find(u => u.role === 'admin');
    return adminUser ? adminUser.name : 'System';
};


/**
 * This function simulates a backend API.
 * It intercepts requests and returns mock data based on the method and path.
 */
export const DUMMY_API_RESPONSE = (
    method: string,
    path: string,
    body?: Record<string, any> | FormData,
    headers?: Headers,
): { data: any; status: number } => {
    
    const user = getUserFromToken(headers);

    // --- AUTH ---
    if (path.startsWith('/auth/login') && method === 'POST') {
        const email = (body as Record<string, any>)?.email?.toLowerCase();
        const user = ALL_USERS.find(u => u.email.toLowerCase() === email);
        if (user) {
            return createApiResponse({
                message: 'Login successful',
                token: `dummy-jwt-for-${user.name.toLowerCase()}`,
                user: user,
            });
        }
        return createApiResponse({ message: 'User not found' }, 404);
    }
    
    if (path.startsWith('/auth/verify') && method === 'GET') {
        const tokenHeader = headers?.get('Authorization');
        let tokenUser: User | undefined;
        if(tokenHeader) {
            const token = tokenHeader.replace('Bearer ', '');
            const userName = token.replace('dummy-jwt-for-', '');
            tokenUser = ALL_USERS.find(u => u.name.toLowerCase() === userName);
        }
        
        if (tokenUser) {
            return createApiResponse({ user: tokenUser });
        }
        return createApiResponse({ message: 'Invalid token' }, 401);
    }


    // --- LEADS ---
    if (path.startsWith('/leads')) {
        const url = new URL(`http://localhost:3000${path}`);
        const role = url.searchParams.get('role');
        const userName = url.searchParams.get('name');

        if (method === 'GET') {
            if (role === 'agent' && userName) {
                const agentLeads = leads.filter(l => l.assignedTo === userName);
                return createApiResponse({ leads: agentLeads });
            }
            return createApiResponse({ leads }); // Admin gets all leads
        }
        
        if (method === 'POST') {
            const newLeadData = body as Omit<Lead, 'id' | 'avatar' | 'activity'>;
            const newLead: Lead = {
              ...newLeadData,
              id: `lead-${Date.now()}`,
              avatar: `https://picsum.photos/seed/lead-${Date.now()}/40/40`,
              activity: [{
                  id: `act-${Date.now()}`,
                  type: 'Created',
                  details: 'Lead was created.',
                  user: user,
                  timestamp: new Date().toISOString()
              }]
            };
            leads = [newLead, ...leads];
            return createApiResponse({ lead: newLead }, 201);
        }
    }
    
    if (path.match(/^\/leads\/lead-\d+$/) && method === 'PUT') {
        const updatedLeadData = body as Lead;
        const leadIndex = leads.findIndex(l => l.id === updatedLeadData.id);

        if (leadIndex === -1) {
            return createApiResponse({ message: "Lead not found" }, 404);
        }

        const originalLead = leads[leadIndex];
        const newActivities: LeadActivity[] = [];
        const now = new Date().toISOString();

        const createActivity = (type: LeadActivity['type'], details: string): LeadActivity => ({
            id: `act-${Date.now()}-${Math.random()}`,
            type,
            user,
            timestamp: now,
            details
        });

        if (originalLead.name !== updatedLeadData.name) {
            newActivities.push(createActivity('Edited', `Name changed from "${originalLead.name}" to "${updatedLeadData.name}".`));
        }
        if (originalLead.company !== updatedLeadData.company) {
            newActivities.push(createActivity('Edited', `Company changed from "${originalLead.company}" to "${updatedLeadData.company}".`));
        }
        if (originalLead.status !== updatedLeadData.status) {
            newActivities.push(createActivity('Status Change', `Status changed from "${originalLead.status}" to "${updatedLeadData.status}".`));
        }
        if (originalLead.priority !== updatedLeadData.priority) {
            newActivities.push(createActivity('Edited', `Priority changed from "${originalLead.priority}" to "${updatedLeadData.priority}".`));
        }
        if (originalLead.dealValue !== updatedLeadData.dealValue) {
            newActivities.push(createActivity('Edited', `Deal Value changed from ₹${originalLead.dealValue.toLocaleString('en-IN')} to ₹${updatedLeadData.dealValue.toLocaleString('en-IN')}.`));
        }
        if (originalLead.assignedTo !== updatedLeadData.assignedTo) {
            newActivities.push(createActivity('Edited', `Assignee changed from "${originalLead.assignedTo}" to "${updatedLeadData.assignedTo}".`));
        }
        if (originalLead.source !== updatedLeadData.source) {
            newActivities.push(createActivity('Edited', `Source changed from "${originalLead.source}" to "${updatedLeadData.source}".`));
        }
        if (originalLead.followUpDateTime !== updatedLeadData.followUpDateTime) {
            const oldDate = originalLead.followUpDateTime ? new Date(originalLead.followUpDateTime).toLocaleString() : 'Not set';
            const newDate = updatedLeadData.followUpDateTime ? new Date(updatedLeadData.followUpDateTime).toLocaleString() : 'Not set';
            if (oldDate !== newDate) {
                 newActivities.push(createActivity('Edited', `Follow-up changed from "${oldDate}" to "${newDate}".`));
            }
        }
        if (originalLead.notes !== updatedLeadData.notes) {
            newActivities.push(createActivity('Edited', `Notes were updated.`));
        }

        const finalUpdatedLead = { ...updatedLeadData, activity: [...newActivities, ...originalLead.activity] };
        leads[leadIndex] = finalUpdatedLead;

        return createApiResponse({ lead: finalUpdatedLead });
    }

    if (path.match(/^\/leads\/lead-\d+\/note$/) && method === 'POST') {
        const leadId = path.split('/')[2];
        const { noteText } = body as { noteText: string };
        let foundLead: Lead | undefined;
        leads = leads.map(lead => {
            if (lead.id === leadId) {
                 const newActivity = {
                    id: `act-${Date.now()}`,
                    type: 'Note Added' as const,
                    details: noteText,
                    user: user,
                    timestamp: new Date().toISOString()
                };
                foundLead = { ...lead, activity: [newActivity, ...lead.activity] };
                return foundLead;
            }
            return lead;
        });
        if(foundLead) {
             return createApiResponse({ lead: foundLead });
        }
        return createApiResponse({ message: "Lead not found" }, 404);
    }
    
    if (path.match(/^\/leads\/lead-\d+$/) && method === 'DELETE') {
        const leadId = path.split('/')[2];
        const initialLength = leads.length;
        leads = leads.filter(lead => lead.id !== leadId);
        if (leads.length < initialLength) {
            return createApiResponse({ message: 'Lead deleted successfully' });
        }
        return createApiResponse({ message: "Lead not found" }, 404);
    }

    // --- OPPORTUNITIES ---
    if (path.startsWith('/opportunities')) {
        const url = new URL(`http://localhost:3000${path}`);
        const role = url.searchParams.get('role');
        const userName = url.searchParams.get('name');

        if (method === 'GET') {
            if (role === 'agent' && userName) {
                const agentOpps = opportunities.filter(o => o.assignedTo === userName);
                return createApiResponse({ opportunities: agentOpps });
            }
            return createApiResponse({ opportunities });
        }

        if (method === 'POST') {
            const newOppData = body as Omit<Opportunity, 'id' | 'avatar' | 'activity'>;
            const newOpp: Opportunity = {
                ...newOppData,
                id: `opp-${Date.now()}`,
                avatar: `https://picsum.photos/seed/opp-${Date.now()}/40/40`,
                activity: [{
                    id: `act-opp-${Date.now()}`,
                    type: 'Created',
                    details: 'Opportunity was created.',
                    user: user,
                    timestamp: new Date().toISOString()
                }]
            };
            opportunities = [newOpp, ...opportunities];
            return createApiResponse({ opportunity: newOpp }, 201);
        }
    }

    if (path.match(/^\/opportunities\/opp-\d+$/) && method === 'PUT') {
        const updatedOppData = body as Opportunity;
        const oppIndex = opportunities.findIndex(o => o.id === updatedOppData.id);
        if (oppIndex === -1) {
            return createApiResponse({ message: "Opportunity not found" }, 404);
        }

        const originalOpp = opportunities[oppIndex];
        const newActivities: LeadActivity[] = [];
        const now = new Date().toISOString();

        if (originalOpp.stage !== updatedOppData.stage) {
            newActivities.push({
                id: `act-${Date.now()}`,
                type: 'Status Change',
                user,
                timestamp: now,
                details: `Stage changed from "${originalOpp.stage}" to "${updatedOppData.stage}".`
            });
            // Auto-update probability based on new stage
            const stageConfig = OPPORTUNITY_STAGES_CONFIG.find(s => s.id === updatedOppData.stage);
            if (stageConfig) {
                updatedOppData.probability = stageConfig.probability;
            }
        }
        // Add more detailed activity tracking if needed...

        const finalUpdatedOpp = { ...updatedOppData, activity: [...newActivities, ...originalOpp.activity] };
        opportunities[oppIndex] = finalUpdatedOpp;
        return createApiResponse({ opportunity: finalUpdatedOpp });
    }

    if (path.match(/^\/opportunities\/opp-\d+$/) && method === 'DELETE') {
        const oppId = path.split('/')[2];
        const initialLength = opportunities.length;
        opportunities = opportunities.filter(opp => opp.id !== oppId);
        if (opportunities.length < initialLength) {
            return createApiResponse({ message: 'Opportunity deleted successfully' });
        }
        return createApiResponse({ message: "Opportunity not found" }, 404);
    }


    // --- TASKS ---
     if (path.startsWith('/tasks')) {
        const url = new URL(`http://localhost:3000${path}`);
        const role = url.searchParams.get('role');
        const userName = url.searchParams.get('name');

        if (method === 'GET') {
            if (role === 'agent' && userName) {
                const agentTasks = tasks.filter(t => t.assignedTo === userName);
                return createApiResponse({ tasks: agentTasks });
            }
            return createApiResponse({ tasks }); // Admin gets all tasks
        }
        
        if (method === 'POST') {
            const newTaskData = body as Omit<Task, 'id'>;
            const newTask: Task = {
              ...newTaskData,
              id: `task-${Date.now()}`,
            };
            tasks = [newTask, ...tasks];
            return createApiResponse({ task: newTask }, 201);
        }
    }

     if (path.match(/^\/tasks\/task-\d+$/) && method === 'PUT') {
        const updatedTaskData = body as Task;
        let foundTask: Task | undefined;
        tasks = tasks.map(task => {
            if (task.id === updatedTaskData.id) {
                foundTask = updatedTaskData;
                return foundTask;
            }
            return task;
        });
        if(foundTask) {
             return createApiResponse({ task: foundTask });
        }
        return createApiResponse({ message: "Task not found" }, 404);
    }

    if (path.match(/^\/tasks\/task-\d+$/) && method === 'DELETE') {
        const taskId = path.split('/')[2];
        const initialLength = tasks.length;
        tasks = tasks.filter(task => task.id !== taskId);
        if (tasks.length < initialLength) {
            return createApiResponse({ message: 'Task deleted successfully' });
        }
        return createApiResponse({ message: "Task not found" }, 404);
    }

    // --- AGENTS ---
    if (path.startsWith('/agents')) {
      if (method === 'GET') {
          return createApiResponse({ agents });
      }
      if (method === 'POST') {
          const newAgentData = body as Omit<Agent, 'id'>;
          const newAgent: Agent = {
              id: `agent-${Date.now()}`,
              ...newAgentData,
              avatar: newAgentData.avatar || `https://i.pravatar.cc/150?u=${newAgentData.name}`
          };
          agents.push(newAgent);
          return createApiResponse({ agent: newAgent }, 201);
      }
    }

    if (path.match(/^\/agents\/agent-\d+$/)) {
      const agentId = path.split('/')[2];
      if (method === 'PUT') {
        const updatedAgentData = body as Agent;
        let foundAgent: Agent | undefined;
        agents = agents.map(agent => {
            if (agent.id === agentId) {
                foundAgent = { ...agent, ...updatedAgentData };
                return foundAgent;
            }
            return agent;
        });
        if (foundAgent) return createApiResponse({ agent: foundAgent });
        return createApiResponse({ message: "Agent not found" }, 404);
      }
      if (method === 'DELETE') {
        const initialLength = agents.length;
        agents = agents.filter(agent => agent.id !== agentId);
        if (agents.length < initialLength) {
            return createApiResponse({ message: 'Agent deleted successfully' });
        }
        return createApiResponse({ message: "Agent not found" }, 404);
      }
    }

    // Default response for unhandled paths
    return createApiResponse({ message: `Endpoint ${method} ${path} not found.` }, 404);
};