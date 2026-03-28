import React, { useEffect, useState } from 'react';
import { Search, MapPin, Heart, ShieldCheck } from 'lucide-react';
import { apiCall } from '../../api/apiConfig';

const NgoDirectory = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const response = await apiCall('/directory/ngos', 'GET');
        setNgos(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching NGOs:', error);
        setNgos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNgos();
  }, []);

  const filteredNgos = ngos.filter(ngo =>
    String(ngo.ngoName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(ngo.organizationDetails || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(ngo.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 italic">NGO DIRECTORY</h1>
          <p className="text-gray-500 font-medium">Find and collaborate with impact-driven NGOs nationwide.</p>
        </div>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, cause, or city..."
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-3xl focus:border-pink-500 transition-all outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNgos.map((ngo, index) => (
            <div key={ngo.id ?? `${ngo.ngoName}-${ngo.location}-${index}`} className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                  <Heart size={32} />
                </div>
                {ngo.verified && (
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold ring-1 ring-green-100">
                    <ShieldCheck size={14} /> REGISTERED
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{ngo.ngoName}</h3>
              <p className="text-pink-600 font-bold text-sm uppercase tracking-wider mb-6">NGO</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-500 font-medium">
                  <MapPin size={18} className="text-gray-400" />
                  {ngo.location}
                </div>
                <div className="text-sm text-gray-400 italic">
                  {ngo.organizationDetails || "Impact-driven organization focused on social justice."}
                </div>
              </div>

              <button className="w-full py-4 bg-gray-50 text-gray-700 font-bold rounded-2xl hover:bg-pink-600 hover:text-white transition-all">
                View NGO
              </button>
            </div>
          ))}
          {filteredNgos.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No NGOs matched your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NgoDirectory;