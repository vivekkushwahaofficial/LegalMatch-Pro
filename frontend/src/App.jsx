import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CaseProvider } from "./context/CaseContext";

import PrivateRoute from "./routes/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";

import CitizenDashboard from "./pages/dashboard/CitizenDashboard";
import LawyerDashboard from "./pages/dashboard/LawyerDashboard";
import NGODashboard from "./pages/dashboard/NGODashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

import CaseSubmission from "./pages/cases/CaseSubmission";
import CaseList from "./pages/cases/CaseList";
import CaseDetail from "./pages/cases/CaseDetail";

import LawyerDirectory from "./pages/directory/LawyerDirectory";
import NgoDirectory from "./pages/directory/NgoDirectory";
import Matching from "./pages/matching/Matches";
import LawyerProfile from "./pages/profiles/LawyerProfile";
import AssignedCases from "./components/cases/AssignedCases";
import Profile from "./pages/profiles/Profile";
import ChatPage from "./pages/chat/ChatPage";


function App() {
  return (
    <Router>

      <Routes>

        <Route path="/" element={<Signin />} />
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
          <Route path="directory" element={<LawyerDirectory />} />
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
          <Route path="submit-case" element={<CaseSubmission />} />
          <Route path="cases" element={<CaseList />} />
          <Route path="case/:id" element={<CaseDetail />} />
          <Route path="lawyers" element={<LawyerDirectory />} />
          <Route path="ngos" element={<NgoDirectory />} />
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
        </Route>
        <Route
          path="/citizen"
          element={
            <PrivateRoute>
              <DashboardLayout role="citizen" />
            </PrivateRoute>
          }
        >
          <Route index element={<CitizenDashboard />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
        <Route
          path="/matches"
          element={
            <PrivateRoute>
              <Matching />
            </PrivateRoute>
          }
        />
        <Route path="/lawyer-profile" element={<LawyerProfile />} />
        <Route path="/assigned-cases" element={<AssignedCases />} />

      </Routes>
    </Router>
  );
}

export default App;

