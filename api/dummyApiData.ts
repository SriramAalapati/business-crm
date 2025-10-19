// api/dummyApiData.ts
import { ALL_USERS, INITIAL_LEADS, INITIAL_TASKS, INITIAL_AGENTS } from '../constants';
import { User, Lead, Task, Agent } from '../types';

let leads: Lead[] = JSON.parse(JSON.stringify(INITIAL_LEADS));
let tasks: Task[] = JSON.parse(JSON.stringify(INITIAL_TASKS));
let agents: Agent[] = JSON.parse(JSON.stringify(INITIAL_AGENTS));

const createApiResponse = (data: any, status = 200) => ({
    data,
    status,
});

/**
 * This function simulates a backend API.
 * It intercepts requests and returns mock data based on the method and path.
 */
export const DUMMY_API_RESPONSE = (
    method: string,
    path: string,
    body?: Record<string, any> | FormData
): { data: any; status: number } => {
    
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
        const token = "dummy-jwt-for-admin"; // Hardcoded for session persistence demo
        const userName = token.replace('dummy-jwt-for-', '');
        const user = ALL_USERS.find(u => u.name.toLowerCase() === userName);
        if (user) {
            return createApiResponse({ user });
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
                  user: 'API User',
                  timestamp: new Date().toISOString()
              }]
            };
            leads = [newLead, ...leads];
            return createApiResponse({ lead: newLead }, 201);
        }
    }
    
    if (path.match(/^\/leads\/lead-\d+$/) && method === 'PUT') {
        const updatedLeadData = body as Lead;
        let foundLead: Lead | undefined;
        leads = leads.map(lead => {
            if (lead.id === updatedLeadData.id) {
                foundLead = { ...updatedLeadData, activity: [
                     {
                        id: `act-${Date.now()}`,
                        type: 'Edited',
                        details: 'Lead details were updated.',
                        user: 'API User',
                        timestamp: new Date().toISOString()
                    },
                    ...updatedLeadData.activity
                ]};
                return foundLead;
            }
            return lead;
        });
        if(foundLead) {
             return createApiResponse({ lead: foundLead });
        }
        return createApiResponse({ message: "Lead not found" }, 404);
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
                    user: 'API User',
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