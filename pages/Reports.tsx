import React, { useMemo } from 'react';
import { useLeads } from '../contexts/LeadsContext';
import { Lead, LeadStatus, LeadSource } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FiTrendingUp, FiTarget, FiUsers, FiPieChart } from 'react-icons/fi';
import { INITIAL_AGENTS } from '../constants';

const Reports: React.FC = () => {
    const { leads } = useLeads();
    
    const salesPerformanceData = useMemo(() => {
        const salesByMonth: { [key: string]: number } = {};
        leads
            .filter(l => l.status === LeadStatus.WON)
            .forEach(l => {
                const month = new Date(l.contactedDate).toLocaleString('default', { month: 'short', year: 'numeric' });
                salesByMonth[month] = (salesByMonth[month] || 0) + l.dealValue;
            });
        
        return Object.entries(salesByMonth)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    }, [leads]);

    const leadSourceData = useMemo(() => {
        const sourceCounts = leads.reduce((acc, lead) => {
            acc[lead.source] = (acc[lead.source] || 0) + 1;
            return acc;
        }, {} as Record<LeadSource, number>);
        return Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));
    }, [leads]);
    
    const agentPerformanceData = useMemo(() => {
        const performance = INITIAL_AGENTS.map(agent => {
            const wonLeads = leads.filter(l => l.assignedTo === agent.name && l.status === LeadStatus.WON);
            return {
                name: agent.name,
                dealsWon: wonLeads.length,
                totalValue: wonLeads.reduce((sum, l) => sum + l.dealValue, 0)
            }
        });
        return performance.sort((a,b) => b.totalValue - a.totalValue);
    }, [leads]);

    const conversionRates = useMemo(() => {
        const total = leads.length;
        if (total === 0) return [];
        const contacted = leads.filter(l => [LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.WON, LeadStatus.LOST].includes(l.status)).length;
        const qualified = leads.filter(l => [LeadStatus.QUALIFIED, LeadStatus.WON, LeadStatus.LOST].includes(l.status)).length;
        const won = leads.filter(l => l.status === LeadStatus.WON).length;
        
        return [
            { stage: 'New', count: total, rate: 100 },
            { stage: 'Contacted', count: contacted, rate: parseFloat(((contacted / total) * 100).toFixed(1)) },
            { stage: 'Qualified', count: qualified, rate: parseFloat(((qualified / total) * 100).toFixed(1)) },
            { stage: 'Won', count: won, rate: parseFloat(((won / total) * 100).toFixed(1)) },
        ]
    }, [leads]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const ReportCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
                <div className="text-primary-500">{icon}</div>
                <h2 className="text-xl font-semibold ml-3">{title}</h2>
            </div>
            {children}
        </div>
    );
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            
            <ReportCard title="Sales Performance Over Time" icon={<FiTrendingUp className="w-6 h-6"/>}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: 'rgba(55, 65, 81, 1)', color: '#fff' }} formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                        <Legend />
                        <Line type="monotone" dataKey="value" name="Sales Value" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </ReportCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ReportCard title="Lead Conversion Funnel" icon={<FiTarget className="w-6 h-6"/>}>
                    <div className="space-y-4 p-4">
                        {conversionRates.map((item, index) => (
                            <div key={item.stage}>
                                <div className="flex justify-between text-sm font-medium">
                                    <span>{item.stage} ({item.count})</span>
                                    <span>{item.rate}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${item.rate}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ReportCard>
                <ReportCard title="Leads by Source" icon={<FiPieChart className="w-6 h-6"/>}>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={leadSourceData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {leadSourceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: 'rgba(55, 65, 81, 1)', color: '#fff' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </ReportCard>
            </div>

            <ReportCard title="Agent Performance" icon={<FiUsers className="w-6 h-6"/>}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Agent</th>
                                <th scope="col" className="px-6 py-3">Deals Won</th>
                                <th scope="col" className="px-6 py-3">Total Value Won</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agentPerformanceData.map(agent => (
                                <tr key={agent.name} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{agent.name}</td>
                                    <td className="px-6 py-4">{agent.dealsWon}</td>
                                    <td className="px-6 py-4">₹{agent.totalValue.toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ReportCard>
        </div>
    );
};

export default Reports;