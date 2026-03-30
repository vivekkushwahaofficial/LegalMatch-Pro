import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import LandingPage from "./pages/LandingPage";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import LawyerDirectory from "./pages/directory/LawyerDirectory";
import NgoDirectory from "./pages/directory/NgoDirectory";

import CitizenDashboard from "./pages/dashboard/CitizenDashboard";
import LawyerDashboard from "./pages/dashboard/LawyerDashboard";
import NGODashboard from "./pages/dashboard/NGODashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import VerificationPage from "./pages/admin/VerificationPage";
import AdminCases from "./pages/admin/AdminCases";
import SystemLogs from "./pages/admin/SystemLogs";

import CaseSubmission from "./pages/cases/CaseSubmission";
import CaseList from "./pages/cases/CaseList";
import CaseDetail from "./pages/cases/CaseDetail";

import Matching from "./pages/matching/Matches";

import LawyerProfile from "./pages/profiles/LawyerProfile";
import AssignedCases from "./components/cases/AssignedCases";
import ChatPage from "./pages/chat/ChatPage";
import RequestsInbox from "./pages/chat/RequestsInbox";
import Profile from "./pages/profiles/Profile";
import AppointmentsPage from "./pages/appointments/AppointmentsPage";

const ChatAliasRedirect = () => {
  const role = (localStorage.getItem("role") || "").toUpperCase();
  if (role === "LAWYER") return <Navigate to="/lawyer/chat" replace />;
  if (role === "NGO") return <Navigate to="/ngo/chat" replace />;
  return <Navigate to="/citizen/chat" replace />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Route aliases (legacy links) */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatAliasRedirect />
            </PrivateRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/directories/lawyers" element={<LawyerDirectory />} />
        <Route path="/directories/ngos" element={<NgoDirectory />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/case/:id" element={<CaseDetail />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <DashboardLayout role="admin" />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Lawyer */}
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
          <Route path="chat" element={<ChatPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="profile" element={<LawyerProfile />} />
          <Route path="cases" element={<AssignedCases />} />
        </Route>

        {/* Citizen */}
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
          <Route path="appointments" element={<AppointmentsPage />} />
        </Route>

        {/* NGO */}
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
          <Route path="chat" element={<ChatPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
        </Route>

        {/* Other */}
        <Route path="/lawyer-profile/:id" element={<LawyerProfile />} />
        {/*<Route path="/assigned-cases" element={<AssignedCases />} />
*/}
      </Routes>
    </Router>
  );
}

export default App;
