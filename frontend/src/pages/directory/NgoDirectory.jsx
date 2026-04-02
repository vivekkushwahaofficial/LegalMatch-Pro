import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { apiCall } from '../../api/apiConfig';
import DirectoryCard from '../../components/shared/DirectoryCard';
import FilterPanel from '../../components/shared/FilterPanel';
import EmptyState from '../../components/shared/EmptyState';
import ErrorState from '../../components/shared/ErrorState';

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
  const [error, setError] = useState('');
  const [debouncedExpertise, setDebouncedExpertise] = useState('');
  const [debouncedLocation, setDebouncedLocation] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedExpertise(expertise.trim());
      setDebouncedLocation(location.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [expertise, location]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedExpertise) params.set('expertise', debouncedExpertise);
    if (debouncedLocation) params.set('location', debouncedLocation);
    if (verified !== '') params.set('verified', verified);
    params.set('sortBy', sortBy);
    params.set('sortDir', sortDir);
    params.set('page', String(page));
    params.set('size', String(size));
    return params.toString();
  }, [debouncedExpertise, debouncedLocation, verified, sortBy, sortDir, page, size]);

  useEffect(() => {
    let isActive = true;
    const fetchNgos = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiCall(`/directory/ngos?${queryString}`, 'GET');
        if (isActive) {
          const normalized = Array.isArray(response)
            ? response
              .filter((item) => item && typeof item === 'object')
              .map((item) => ({
                ...item,
                ngoName: (item.ngoName || '').toString().trim(),
                location: (item.location || '').toString().trim(),
              }))
              .filter((item) => item.ngoName && item.location)
            : [];
          setNgos(normalized);
        }
      } catch (error) {
        console.error('Error fetching NGOs:', error);
        if (isActive) {
          setNgos([]);
          setError('Unable to load NGO directory right now.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };
    fetchNgos();
    return () => {
      isActive = false;
    };
  }, [queryString]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 italic">NGO DIRECTORY</h1>
          <p className="text-gray-500 font-medium">Find and collaborate with impact-driven NGOs nationwide.</p>
        </div>

        {/* Filters + sorting + pagination controls aligned with lawyer directory UX. */}
        <FilterPanel>
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
        </FilterPanel>
      </div>

      {error && <ErrorState message={error} className="mb-6" />}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ngos.map((ngo, index) => {
              const ngoId = ngo.userId || ngo.id;
              const profileUrl = ngoId ? `/ngo/${ngoId}` : null;
              return (
                <DirectoryCard
                  key={ngo.id ?? `${ngo.ngoName}-${ngo.location}-${index}`}
                  title={ngo.ngoName || ngo.name || 'Unnamed NGO'}
                  subtitle={ngo.expertise || 'NGO'}
                  location={ngo.location}
                  details={ngo.organizationDetails || 'Impact-driven organization focused on social justice.'}
                  verified={ngo.verified}
                  profileUrl={profileUrl}
                  ctaLabel="View NGO"
                  accent="pink"
                />
              );
            })}
            {ngos.length === 0 && (
              <EmptyState title="No NGOs found" message="No NGOs matched your filters." />
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