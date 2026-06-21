import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

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

const TitleManager = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "LegalMatch Pro | Legal Aid Matching Platform";

    if (path === "/") {
      title = "LegalMatch Pro | Home";
    } else if (path.startsWith("/signin") || path.startsWith("/login")) {
      title = "Sign In | LegalMatch Pro";
    } else if (path.startsWith("/register")) {
      title = "Sign Up | LegalMatch Pro";
    } else if (path.startsWith("/admin")) {
      if (path.includes("/users")) title = "Manage Users | Admin | LegalMatch Pro";
      else if (path.includes("/cases")) title = "Manage Cases | Admin | LegalMatch Pro";
      else if (path.includes("/logs")) title = "System Logs | Admin | LegalMatch Pro";
      else if (path.includes("/verification")) title = "Verification | Admin | LegalMatch Pro";
      else title = "Dashboard | Admin | LegalMatch Pro";
    } else if (path.startsWith("/lawyer")) {
      if (path.includes("/requests")) title = "Requests | Lawyer | LegalMatch Pro";
      else if (path.includes("/directory")) title = "Directory | Lawyer | LegalMatch Pro";
      else if (path.includes("/chat")) title = "Chat | Lawyer | LegalMatch Pro";
      else if (path.includes("/appointments")) title = "Appointments | Lawyer | LegalMatch Pro";
      else if (path.includes("/profile")) title = "Profile | Lawyer | LegalMatch Pro";
      else if (path.includes("/cases")) title = "Assigned Cases | Lawyer | LegalMatch Pro";
      else title = "Dashboard | Lawyer | LegalMatch Pro";
    } else if (path.startsWith("/citizen")) {
      if (path.includes("/profile")) title = "Profile | Citizen | LegalMatch Pro";
      else if (path.includes("/submit-case")) title = "Submit Case | Citizen | LegalMatch Pro";
      else if (path.includes("/cases")) title = "My Cases | Citizen | LegalMatch Pro";
      else if (path.includes("/lawyers")) title = "Lawyers Directory | Citizen | LegalMatch Pro";
      else if (path.includes("/ngos")) title = "NGOs Directory | Citizen | LegalMatch Pro";
      else if (path.includes("/chat")) title = "Chat | Citizen | LegalMatch Pro";
      else if (path.includes("/matches")) title = "Matches | Citizen | LegalMatch Pro";
      else if (path.includes("/appointments")) title = "Appointments | Citizen | LegalMatch Pro";
      else title = "Dashboard | Citizen | LegalMatch Pro";
    } else if (path.startsWith("/ngo")) {
      if (path.includes("/requests")) title = "Requests | NGO | LegalMatch Pro";
      else if (path.includes("/chat")) title = "Chat | NGO | LegalMatch Pro";
      else if (path.includes("/appointments")) title = "Appointments | NGO | LegalMatch Pro";
      else title = "Dashboard | NGO | LegalMatch Pro";
    } else if (path.startsWith("/directories/lawyers")) {
      title = "Lawyer Directory | LegalMatch Pro";
    } else if (path.startsWith("/directories/ngos")) {
      title = "NGO Directory | LegalMatch Pro";
    }

    document.title = title;
  }, [location]);

  return null;
};

const ChatAliasRedirect = () => {
  const role = (localStorage.getItem("role") || "").toUpperCase();
  if (role === "LAWYER") return <Navigate to="/lawyer/chat" replace />;
  if (role === "NGO") return <Navigate to="/ngo/chat" replace />;
  return <Navigate to="/citizen/chat" replace />;
};

function App() {
  return (
    <Router>
      <TitleManager />
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
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout role="admin" />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="cases" element={<AdminCases />} />
          <Route path="logs" element={<SystemLogs />} />
          <Route path="verification" element={<VerificationPage />} />
        </Route>

        {/* Lawyer */}
        <Route
          path="/lawyer"
          element={
            <PrivateRoute allowedRoles={["LAWYER"]}>
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
            <PrivateRoute allowedRoles={["CITIZEN"]}>
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
            <PrivateRoute allowedRoles={["NGO"]}>
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
        <Route
          path="/lawyer/:id"
          element={
            <PrivateRoute allowedRoles={["CITIZEN", "LAWYER", "NGO", "ADMIN"]}>
              <LawyerProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/ngo/:id"
          element={
            <PrivateRoute allowedRoles={["CITIZEN", "LAWYER", "NGO", "ADMIN"]}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/lawyer-profile/:id"
          element={
            <PrivateRoute allowedRoles={["CITIZEN", "LAWYER", "NGO", "ADMIN"]}>
              <LawyerProfile />
            </PrivateRoute>
          }
        />
        {/*<Route path="/assigned-cases" element={<AssignedCases />} />
*/}
      </Routes>
    </Router>
  );
}

export default App;
