import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import LawyerDashboard from './pages/LawyerDashboard';
import CitizenDashboard from './pages/CitizenDashboard';
import NGODashboard from './pages/NGODashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/citizen" replace />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          {/* Add more admin sub-routes here */}
        </Route>

        {/* Lawyer Routes */}
        <Route path="/lawyer" element={<DashboardLayout role="lawyer" />}>
          <Route index element={<LawyerDashboard />} />
        </Route>

        {/* Citizen Routes */}
        <Route path="/citizen" element={<DashboardLayout role="citizen" />}>
          <Route index element={<CitizenDashboard />} />
          <Route path="profile" element={<div className="p-8">Profile Management (Placeholder)</div>} />
          <Route path="cases" element={<div className="p-8">Case Submission (Placeholder)</div>} />
          <Route path="directory" element={<div className="p-8">Directory (Placeholder)</div>} />
          <Route path="matches" element={<div className="p-8">Matches (Placeholder)</div>} />
          <Route path="impact" element={<div className="p-8">Impact Dashboard (Placeholder)</div>} />
        </Route>

        {/* NGO Routes */}
        <Route path="/ngo" element={<DashboardLayout role="ngo" />}>
          <Route index element={<NGODashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
