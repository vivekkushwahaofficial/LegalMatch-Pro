import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CaseProvider } from "./context/CaseContext";
import DashboardLayout from "./layouts/DashboardLayout";

import AdminDashboard from "./pages/AdminDashboard";
import LawyerDashboard from "./pages/LawyerDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import NGODashboard from "./pages/NGODashboard";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import CaseSubmission from "./pages/CaseSubmission";
import CaseList from "./pages/CaseList";
import CaseDetail from "./pages/CaseDetail";
import LawyerDirectory from "./pages/LawyerDirectory";
import NgoDirectory from "./pages/NgoDirectory";

function App() {
  return (
    <AuthProvider>
      <CaseProvider>
        <Router>

          <Routes>

            {/* Redirect dashboard */}
            <Route path="/dashboard" element={<Navigate to="/citizen" />} />

            {/* Public Routes */}
            <Route path="/" element={<Signin />} />
            <Route path="/login" element={<Signin />} />
            <Route path="/register" element={<Signup />} />

            {/* Admin */}
            <Route path="/admin" element={<DashboardLayout role="admin" />}>
              <Route index element={<AdminDashboard />} />
            </Route>

            {/* Lawyer */}
            <Route path="/lawyer" element={<DashboardLayout role="lawyer" />}>
              <Route index element={<LawyerDashboard />} />
              <Route path="directory" element={<LawyerDirectory />} />
            </Route>

            {/* Citizen */}
            <Route path="/citizen" element={<DashboardLayout role="citizen" />}>
              <Route index element={<CitizenDashboard />} />
              <Route path="submit-case" element={<CaseSubmission />} />
              <Route path="cases" element={<CaseList />} />
              <Route path="case/:id" element={<CaseDetail />} />
              <Route path="lawyers" element={<LawyerDirectory />} />
              <Route path="ngos" element={<NgoDirectory />} />
            </Route>

            {/* NGO */}
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