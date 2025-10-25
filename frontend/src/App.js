/**
 * Main App Component
 */
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import useAuthStore from "./store/authStore";
import LandingPage from "./pages/LandingPage";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthCallback from "./pages/OAuthCallback";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import WorkflowEditorPage from "./pages/WorkflowEditorPage";
import Pricing from "./pages/Pricing";
import Templates from "./pages/Templates";
import MyAgents from "./pages/MyAgents";
import Settings from "./pages/Settings";
import Integrations from "./pages/Integrations";
import HRAutomationTemplate from "./pages/HRAutomationTemplate";
import Navbar from "./components/Navbar";
import "./App.css";

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Layout wrapper for authenticated pages
const AuthenticatedLayout = ({ children }) => {
  const { user, logout } = useAuthStore();
  return (
    <div>
      <Navbar isAuthenticated={true} user={user} onLogout={logout} />
      {children}
    </div>
  );
};

function App() {
  const { fetchUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, fetchUser]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/hr-automation" element={<HRAutomationTemplate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-agents"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <MyAgents />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/integrations"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Integrations />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Settings />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workflows/:workflowId"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <WorkflowEditorPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect authenticated users from landing page to dashboard */}
          <Route
            path="/landing"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
            }
          />

          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
