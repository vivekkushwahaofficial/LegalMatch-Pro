import React, { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, Heart, ShieldCheck } from 'lucide-react';
import { apiCall } from '../../api/apiConfig';

const NgoDirectory = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expertise, setExpertise] = useState('');
  const [location, setLocation] = useState('');
  const [verified, setVerified] = useState('');
  const [sortBy, setSortBy] = useState('ngoName');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [size] = useState(12);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (expertise.trim()) params.set('expertise', expertise.trim());
    if (location.trim()) params.set('location', location.trim());
    if (verified !== '') params.set('verified', verified);
    params.set('sortBy', sortBy);
    params.set('sortDir', sortDir);
    params.set('page', String(page));
    params.set('size', String(size));
    return params.toString();
  }, [expertise, location, verified, sortBy, sortDir, page, size]);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const response = await apiCall(`/directory/ngos?${queryString}`, 'GET');
        setNgos(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching NGOs:', error);
        setNgos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNgos();
  }, [queryString]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 italic">NGO DIRECTORY</h1>
          <p className="text-gray-500 font-medium">Find and collaborate with impact-driven NGOs nationwide.</p>
        </div>

        {/* Filters + sorting + pagination controls aligned with lawyer directory UX. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 w-full lg:max-w-5xl">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Filter by expertise..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-3xl focus:border-pink-500 transition-all outline-none shadow-sm"
              value={expertise}
              onChange={(e) => {
                setPage(0);
                setExpertise(e.target.value);
              }}
            />
          </div>

          <input
            type="text"
            placeholder="Location"
            className="w-full px-4 py-4 bg-white border-2 border-gray-100 rounded-3xl focus:border-pink-500 transition-all outline-none shadow-sm"
            value={location}
            onChange={(e) => {
              setPage(0);
              setLocation(e.target.value);
            }}
          />

          <select
            className="w-full px-4 py-4 bg-white border-2 border-gray-100 rounded-3xl focus:border-pink-500 transition-all outline-none shadow-sm"
            value={verified}
            onChange={(e) => {
              setPage(0);
              setVerified(e.target.value);
            }}
          >
            <option value="">All</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>

          <select
            className="w-full px-4 py-4 bg-white border-2 border-gray-100 rounded-3xl focus:border-pink-500 transition-all outline-none shadow-sm"
            value={`${sortBy}:${sortDir}`}
            onChange={(e) => {
              setPage(0);
              const [nextSortBy, nextSortDir] = e.target.value.split(':');
              setSortBy(nextSortBy);
              setSortDir(nextSortDir);
            }}
          >
            <option value="ngoName:asc">Name A-Z</option>
            <option value="ngoName:desc">Name Z-A</option>
            <option value="location:asc">Location A-Z</option>
            <option value="verified:desc">Verified First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ngos.map((ngo, index) => (
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
            {ngos.length === 0 && (
              <div className="col-span-full text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No NGOs matched your filters.</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-50"
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={page === 0}
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page + 1}</span>
            <button
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-50"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={ngos.length < size}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NgoDirectory;