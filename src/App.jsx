import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CaseProvider } from './context/CaseContext';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import LawyerDashboard from './pages/LawyerDashboard';
import CitizenDashboard from './pages/CitizenDashboard';
import NGODashboard from './pages/NGODashboard';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CaseSubmission from './pages/CaseSubmission';
import Directory from './pages/Directory';
import Matches from './pages/Matches';
import SystemLogs from './pages/SystemLogs';

function App() {
  return (
    <AuthProvider>
      <CaseProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<DashboardLayout role="admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="logs" element={<SystemLogs />} />
            </Route>

            {/* Lawyer Routes */}
            <Route path="/lawyer" element={<DashboardLayout role="lawyer" />}>
              <Route index element={<LawyerDashboard />} />
            </Route>

            {/* Citizen Routes */}
            <Route path="/citizen" element={<DashboardLayout role="citizen" />}>
              <Route index element={<CitizenDashboard />} />
              <Route path="profile" element={<div className="p-8">Profile Management (Placeholder)</div>} />
              <Route path="cases" element={<CaseSubmission />} />
              <Route path="directory" element={<Directory />} />
              <Route path="matches" element={<Matches />} />
              <Route path="impact" element={<div className="p-8">Impact Dashboard (Placeholder)</div>} />
            </Route>

            {/* NGO Routes */}
            <Route path="/ngo" element={<DashboardLayout role="ngo" />}>
              <Route index element={<NGODashboard />} />
            </Route>
          </Routes>
        </Router>
      </CaseProvider>
    </AuthProvider>
  );
}

export default App;
