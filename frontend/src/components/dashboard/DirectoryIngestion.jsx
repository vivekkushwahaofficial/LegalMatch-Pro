import { useState } from 'react';
import { apiCall } from '../../api/apiConfig';

const DirectoryIngestion = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDirectorySync = async () => {
    try {
      setLoading(true);
      const lawyers = await apiCall('/directory/lawyers', 'GET');
      const ngos = await apiCall('/directory/ngos', 'GET');

      const lawyerCount = Array.isArray(lawyers) ? lawyers.length : 0;
      const ngoCount = Array.isArray(ngos) ? ngos.length : 0;
      setMessage(`Directory data available: ${lawyerCount} lawyers, ${ngoCount} NGOs.`);
    } catch (error) {
      setMessage('Unable to fetch directory data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
      <h3 className="font-semibold text-slate-900">Directory Ingestion</h3>
      <button
        type="button"
        onClick={handleDirectorySync}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? 'Loading...' : 'Load Directory Data'}
      </button>
      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
    </div>
  );
};

export default DirectoryIngestion;
