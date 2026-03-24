import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Scale, CheckCircle, ShieldCheck } from 'lucide-react';

const LawyerDirectory = () => {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLawyers = async () => {
            try {
                // Assuming an endpoint that returns all lawyers
                const response = await axios.get('/api/directory/lawyers');
                setLawyers(response.data);
            } catch (error) {
                console.error('Error fetching lawyers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLawyers();
    }, []);

    const filteredLawyers = lawyers.filter(lawyer => 
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2 italic">LAWYER DIRECTORY</h1>
                    <p className="text-gray-500 font-medium">Connect with verified legal professionals across the country.</p>
                </div>
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name, expertise, or city..."
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-3xl focus:border-indigo-500 transition-all outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredLawyers.map((lawyer) => (
                        <div key={lawyer.id} className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                    <Scale size={32} />
                                </div>
                                {lawyer.verified && (
                                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold ring-1 ring-green-100">
                                        <ShieldCheck size={14} /> VERIFIED
                                    </div>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{lawyer.name}</h3>
                            <p className="text-indigo-600 font-bold text-sm uppercase tracking-wider mb-6">{lawyer.expertise}</p>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-gray-500 font-medium">
                                    <MapPin size={18} className="text-gray-400" />
                                    {lawyer.location}
                                </div>
                                <div className="text-sm text-gray-400 italic">
                                    {lawyer.organizationDetails || "No additional details available."}
                                </div>
                            </div>

                            <button className="w-full py-4 bg-gray-50 text-gray-700 font-bold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
                                View Profile
                            </button>
                        </div>
                    ))}
                    {filteredLawyers.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">No lawyers matched your search criteria.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LawyerDirectory;