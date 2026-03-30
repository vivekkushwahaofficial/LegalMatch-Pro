import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import LandingPage from "./pages/LandingPage";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import LawyerDirectory from "./pages/directory/LawyerDirectory";
import NgoDirectory from "./pages/directory/NgoDirectory";

import CitizenDashboard from "./pages/dashboard/CitizenDashboard";
import LawyerDashboard from "./pages/dashboard/LawyerDashboard";
import NGODashboard from "./pages/dashboard/NGODashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

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
import NotificationsPage from "./pages/notifications/NotificationsPage";

const ChatAliasRedirect = () => {
  const role = (localStorage.getItem("role") || "").toUpperCase();
  if (role === "LAWYER") return <Navigate to="/lawyer/chat" replace />;
  if (role === "NGO") return <Navigate to="/ngo/chat" replace />;
  return <Navigate to="/citizen/chat" replace />;
};

const NotificationsAliasRedirect = () => {
  const role = (localStorage.getItem("role") || "").toUpperCase();
  if (role === "ADMIN") return <Navigate to="/admin/notifications" replace />;
  if (role === "LAWYER") return <Navigate to="/lawyer/notifications" replace />;
  if (role === "NGO") return <Navigate to="/ngo/notifications" replace />;
  return <Navigate to="/citizen/notifications" replace />;
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
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationsAliasRedirect />
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
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
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
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<NotificationsPage />} />
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
          <Route path="profile" element={<Profile />} />
          <Route path="requests" element={<RequestsInbox />} />
          <Route path="directory" element={<LawyerDirectory />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
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
          <Route path="notifications" element={<NotificationsPage />} />
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
          <Route path="profile" element={<Profile />} />
          <Route path="requests" element={<RequestsInbox />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Other */}
        <Route path="/lawyer-profile/:id" element={<LawyerProfile />} />
        <Route path="/assigned-cases" element={<AssignedCases />} />

      </Routes>
    </Router>
  );
}

export default App;