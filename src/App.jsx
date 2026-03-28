import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";

// Directories
import LawyerDirectory from "./pages/directory/LawyerDirectory";
import NgoDirectory from "./pages/directory/NgoDirectory";

// Dashboards
import CitizenDashboard from "./pages/dashboard/CitizenDashboard";
import LawyerDashboard from "./pages/dashboard/LawyerDashboard";
import NGODashboard from "./pages/dashboard/NGODashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

// Cases
import CaseSubmission from "./pages/cases/CaseSubmission";
import CaseList from "./pages/cases/CaseList";
import CaseDetail from "./pages/cases/CaseDetail";
import AssignedCases from "./components/cases/AssignedCases";

// Matching
import Matching from "./pages/matching/Matches";

// Profiles
import LawyerProfile from "./pages/profiles/LawyerProfile";
import Profile from "./pages/profiles/Profile";

// Chat
import ChatPage from "./pages/chat/ChatPage";
import RequestsInbox from "./pages/chat/RequestsInbox";

// Admin Logs
import AdminLogs from "./AdminLogs";
import ForgotPassword from "./pages/auth/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Directories */}
        <Route path="/directories/lawyers" element={<LawyerDirectory />} />
        <Route path="/directories/ngos" element={<NgoDirectory />} />

        {/* Case detail */}
        <Route path="/case/:id" element={<CaseDetail />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <DashboardLayout role="admin" />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="logs" element={<AdminLogs />} />
        </Route>

        {/* ================= LAWYER ================= */}
        <Route
          path="/lawyer"
          element={
            <PrivateRoute>
              <DashboardLayout role="lawyer" />
            </PrivateRoute>
          }
        >
          <Route index element={<LawyerDashboard />} />
          <Route path="requests" element={<RequestsInbox />} />
          <Route path="directory" element={<LawyerDirectory />} />
          <Route path="profile" element={<LawyerProfile />} />
        </Route>

        {/* ================= CITIZEN ================= */}
        <Route
          path="/citizen"
          element={
            <PrivateRoute>
              <DashboardLayout role="citizen" />
            </PrivateRoute>
          }
        >
          <Route index element={<CitizenDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="submit-case" element={<CaseSubmission />} />
          <Route path="cases" element={<CaseList />} />
          <Route path="case/:id" element={<CaseDetail />} />
          <Route path="lawyers" element={<LawyerDirectory />} />
          <Route path="ngos" element={<NgoDirectory />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="matches" element={<Matching />} />
        </Route>

        {/* ================= NGO ================= */}
        <Route
          path="/ngo"
          element={
            <PrivateRoute>
              <DashboardLayout role="ngo" />
            </PrivateRoute>
          }
        >
          <Route index element={<NGODashboard />} />
          <Route path="requests" element={<RequestsInbox />} />
        </Route>

        {/* ================= EXTRA ROUTES ================= */}
        <Route path="/lawyer-profile/:id" element={<LawyerProfile />} />
        <Route path="/assigned-cases" element={<AssignedCases />} />

      </Routes>
    </Router>
  );
}

export default App;