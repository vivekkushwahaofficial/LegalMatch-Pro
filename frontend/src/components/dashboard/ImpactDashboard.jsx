import React, { useEffect, useState } from 'react';
import { apiCall } from '../../api/apiConfig';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, CheckCircle, Activity } from 'lucide-react';

const ImpactDashboard = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await apiCall('/impact/stats', 'GET');
                setStats(data);
            } catch (error) {
                console.error('Error fetching impact stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const totalCases = stats.reduce((acc, curr) => acc + curr.casesTaken, 0);
    const totalResolved = stats.reduce((acc, curr) => acc + curr.casesResolved, 0);

    const chartData = stats.map(s => ({
        name: s.provider.name,
        taken: s.casesTaken,
        resolved: s.casesResolved
    }));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Matches</p>
                        <h3 className="text-2xl font-black text-gray-900">{totalCases}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Resolved Cases</p>
                        <h3 className="text-2xl font-black text-gray-900">{totalResolved}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Active rate</p>
                        <h3 className="text-2xl font-black text-gray-900">
                            {totalCases > 0 ? Math.round((totalResolved / totalCases) * 100) : 0}%
                        </h3>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-8">Provider Performance</h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <Tooltip 
                                cursor={{fill: '#F9FAFB'}}
                                contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                            />
                            <Legend iconType="circle" wrapperStyle={{paddingTop: '2rem'}} />
                            <Bar dataKey="taken" name="Cases Taken" fill="#6366F1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="resolved" name="Cases Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ImpactDashboard;
