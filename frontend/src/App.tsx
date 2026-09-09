import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import "./App.css";

import InterviewPage from "./pages/InterviewPage";

import Profile from "./components/Profile";
import InterviewModes from "./components/InterviewModes";
import History from "./components/History";
import Auth from "./components/Auth";
import UserDashboard from "./components/UserDashboard";
import HistoryReportPage from "./components/HistoryReportPage";

import RecruiterLayout from "./components/RecruiterLayout";
import RecruiterDashboard from "./components/RecruiterDashboard";
import RecruiterCandidates from "./components/RecruiterCandidates";
import RecruiterReports from "./components/RecruiterReports";
import RecruiterProfile from "./components/RecruiterProfile";
import CandidateDetails from "./components/CandidateDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Unauthorized from "./components/Unauthorized ";
import NotFound from "./components/NotFound";

import UserLayout from "./components/UserLayout";

import { Toaster } from "react-hot-toast";
import { useCommonStore } from "./store/CommonStore";
import { useEffect } from "react";
import InterviewInvite from "./components/InterviewInvite";
import RecruiterInterviews from "./components/RecruiterInterviews";
import RecruiterInvites from "./components/RecruiterInvites";

function App() {
  const { me } = useCommonStore();

  useEffect(() => {
    me();
  }, [me]);

  return (
    <div className="app-container">
      <BrowserRouter>

        <Routes>

          {/* PUBLIC */}
          <Route element={<PublicRoute />}>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Auth />} />
          </Route>

          <Route path="/invite/:token" element={<InterviewInvite />} />

          {/* USER */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route element={<UserLayout />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/start-interview" element={<InterviewPage />} />
              <Route path="/interview/:sessionId" element={<InterviewPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/interview-modes" element={<InterviewModes />} />
              <Route path="/history" element={<History />} />
              <Route path="/history/:sessionId" element={<HistoryReportPage />} />
            </Route>
          </Route>

          {/* RECRUITER */}
          <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
            <Route path="/recruiter" element={<RecruiterLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<RecruiterDashboard />} />
              <Route path="candidates" element={<RecruiterCandidates />} />
              <Route path="invites" element={<RecruiterInvites />} />
              <Route path="candidates/:candidateId" element={<CandidateDetails />} />
              <Route path="reports/:sessionId" element={<RecruiterReports />} />
              <Route path="profile" element={<RecruiterProfile />} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />

      </BrowserRouter>
    </div>
  );
}

export default App;