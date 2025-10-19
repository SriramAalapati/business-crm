import React, { useMemo, useState, useEffect } from 'react';
import { useLeads } from '../contexts/LeadsContext';
import { useUser } from '../contexts/UserContext';
import { Lead, LeadStatus, Priority } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiTrendingUp, FiCheckCircle, FiCalendar, FiZap, FiSettings } from 'react-icons/fi';
import { KANBAN_COLUMNS } from '../constants';
import DashboardSettingsModal from '../components/DashboardSettingsModal';

export interface WidgetConfig {
    id: 'stats' | 'charts' | 'followUps';
    title: string;
    visible: boolean;
}

const StatCard = ({ icon, title, value, colorClass }: { icon: React.ReactNode, title: string, value: string | number, colorClass: string }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
);


const StatsWidget: React.FC<{ leads: Lead[] }> = ({ leads }) => {
    const stats = useMemo(() => {
        return {
            totalLeads: leads.filter(l => l.status !== LeadStatus.WON && l.status !== LeadStatus.LOST).length,
            highPriorityLeads: leads.filter(l => l.priority === 'High' && l.status !== LeadStatus.WON && l.status !== LeadStatus.LOST).length,
            wonLeads: leads.filter(lead => lead.status === LeadStatus.WON).length,
            totalValueWon: leads.filter(lead => lead.status === LeadStatus.WON).reduce((sum, lead) => sum + lead.dealValue, 0),
        }
    }, [leads]);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<FiUsers className="w-6 h-6 text-white"/>} title="Total Active Leads" value={stats.totalLeads} colorClass="bg-blue-500"/>
            <StatCard icon={<FiZap className="w-6 h-6 text-white"/>} title="High-Priority Leads" value={stats.highPriorityLeads} colorClass="bg-red-500"/>
            <StatCard icon={<FiCheckCircle className="w-6 h-6 text-white"/>} title="Deals Won" value={stats.wonLeads} colorClass="bg-green-500"/>
            <StatCard icon={<FiTrendingUp className="w-6 h-6 text-white"/>} title="Total Value Won" value={`₹${stats.totalValueWon.toLocaleString('en-IN')}`} colorClass="bg-teal-500"/>
        </div>
    );
};

const ChartsWidget: React.FC<{ leads: Lead[] }> = ({ leads }) => {
    const priorityData = useMemo(() => {
        const priorityCounts = leads.reduce((acc, lead) => {
            acc[lead.priority] = (acc[lead.priority] || 0) + 1;
            return acc;
        }, {} as Record<Priority, number>);
        return Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));
    }, [leads]);
    
    const statusData = useMemo(() => {
      const statusCounts = KANBAN_COLUMNS.map(col => ({
        name: col.title,
        leads: leads.filter(lead => lead.status === col.id).length
      }));
      return statusCounts;
    }, [leads]);
    
    const COLORS = {'High': '#EF4444', 'Medium': '#F59E0B', 'Low': '#10B981'};

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Lead Status Pipeline</h2>
                <ResponsiveContainer width="100%" height={300}>
                     <BarChart data={statusData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: 'rgba(55, 65, 81, 1)', color: '#fff' }} />
                        <Legend />
                        <Bar dataKey="leads" fill="#3b82f6" />
                    </BarChart>
                 </ResponsiveContainer>
            </div>
             <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Leads by Priority</h2>
                <ResponsiveContainer width="100%" height={300}>
                     <PieChart>
                         <Pie data={priorityData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {priorityData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as Priority]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: 'rgba(55, 65, 81, 1)', color: '#fff' }} />
                     </PieChart>
                 </ResponsiveContainer>
            </div>
        </div>
    );
};

const UpcomingFollowUps: React.FC<{ leads: Lead[] }> = ({ leads }) => {
    const upcoming = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return leads
            .filter(lead => lead.followUpDateTime && new Date(lead.followUpDateTime) >= today)
            .sort((a, b) => new Date(a.followUpDateTime!).getTime() - new Date(b.followUpDateTime!).getTime())
            .slice(0, 5);
    }, [leads]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upcoming Follow-ups</h2>
            {upcoming.length > 0 ? (
                <ul className="space-y-4">
                    {upcoming.map(lead => (
                        <li key={lead.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <img src={lead.avatar} alt={lead.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-white">{lead.name}</p>
                                    <p className="text-sm text-gray-500">{lead.company}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-primary-500">{new Date(lead.followUpDateTime!).toLocaleDateString()}</p>
                                <p className="text-xs text-gray-400">{lead.assignedTo}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 py-8">
                     <FiCalendar className="w-12 h-12 mb-2 text-gray-400" />
                     <p>No upcoming follow-ups.</p>
                </div>
            )}
        </div>
    );
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
    { id: 'stats', title: 'Statistics Cards', visible: true },
    { id: 'charts', title: 'Charts Row', visible: true },
    { id: 'followUps', title: 'Upcoming Follow-ups', visible: true },
];

const widgetComponentMap = {
    stats: StatsWidget,
    charts: ChartsWidget,
    followUps: UpcomingFollowUps,
};

const Dashboard: React.FC = () => {
    const { leads } = useLeads();
    const { user } = useUser();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
        try {
            const saved = localStorage.getItem('dashboardWidgets');
            if (saved) {
                const parsed = JSON.parse(saved);
                const savedIds = new Set(parsed.map((w: WidgetConfig) => w.id));
                const defaultIds = new Set(DEFAULT_WIDGETS.map(w => w.id));
                if (savedIds.size === defaultIds.size && [...savedIds].every(id => defaultIds.has(id as WidgetConfig['id']))) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Failed to parse dashboard widgets from localStorage", e);
        }
        return DEFAULT_WIDGETS;
    });

    useEffect(() => {
        localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
    }, [widgets]);

    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
                    <button 
                        onClick={() => setIsSettingsOpen(true)} 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                        aria-label="Customize dashboard"
                    >
                        <FiSettings className="w-4 h-4"/>
                        <span>Customize</span>
                    </button>
                </div>

                {widgets.filter(w => w.visible).map(widget => {
                    const Component = widgetComponentMap[widget.id];
                    return <Component key={widget.id} leads={leads} />;
                })}
            </div>
            <DashboardSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                widgets={widgets}
                setWidgets={setWidgets}
            />
        </>
    );
};

export default Dashboard;