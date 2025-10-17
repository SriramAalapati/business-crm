
import React, { useMemo } from 'react';
import { useLeads } from '../contexts/LeadsContext';
import { useUser } from '../contexts/UserContext';
import { LeadStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiTrendingUp, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Dashboard: React.FC = () => {
    const { leads } = useLeads();
    const { user } = useUser();

    const stats = useMemo(() => {
        return {
            totalLeads: leads.length,
            wonLeads: leads.filter(lead => lead.status === LeadStatus.WON).length,
            lostLeads: leads.filter(lead => lead.status === LeadStatus.LOST).length,
            totalValueWon: leads.filter(lead => lead.status === LeadStatus.WON).reduce((sum, lead) => sum + lead.value, 0),
        }
    }, [leads]);

    const leadStatusData = useMemo(() => {
        const statusCounts = leads.reduce((acc, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + 1;
            return acc;
        }, {} as Record<LeadStatus, number>);

        return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    }, [leads]);
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

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

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<FiUsers className="w-6 h-6 text-white"/>} title="Total Leads" value={stats.totalLeads} colorClass="bg-blue-500"/>
                <StatCard icon={<FiTrendingUp className="w-6 h-6 text-white"/>} title="Total Value Won" value={`$${stats.totalValueWon.toLocaleString()}`} colorClass="bg-green-500"/>
                <StatCard icon={<FiCheckCircle className="w-6 h-6 text-white"/>} title="Leads Won" value={stats.wonLeads} colorClass="bg-teal-500"/>
                <StatCard icon={<FiXCircle className="w-6 h-6 text-white"/>} title="Leads Lost" value={stats.lostLeads} colorClass="bg-red-500"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Leads by Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={leadStatusData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} />
                            <YAxis tick={{ fill: 'currentColor' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                    borderColor: 'rgba(55, 65, 81, 1)',
                                    color: '#fff'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                     <h2 className="text-xl font-semibold mb-4">Lead Distribution</h2>
                     <ResponsiveContainer width="100%" height={300}>
                         <PieChart>
                             <Pie
                                data={leadStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {leadStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                    borderColor: 'rgba(55, 65, 81, 1)',
                                    color: '#fff'
                                }}
                            />
                         </PieChart>
                     </ResponsiveContainer>
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;
