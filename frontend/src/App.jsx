import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Import Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import RepoManagement from './pages/RepoManagement';
import AIReview from './pages/AIReview';
import BugDetection from './pages/BugDetection';
import Vulnerabilities from './pages/Vulnerabilities';
import CodeSmells from './pages/CodeSmells';
import DocGenerator from './pages/DocGenerator';
import Reports from './pages/Reports';
import ChatAssistant from './pages/ChatAssistant';
import Settings from './pages/Settings';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#07070a] flex relative overflow-hidden">
      {/* Background blueprint grid lines */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0"></div>
      
      {/* Ambient background glow orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-violet-600/10 to-blue-600/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-gradient-to-tr from-fuchsia-600/5 to-violet-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <Sidebar />
      <main className="flex-1 pl-64 min-h-screen text-slate-100 overflow-x-hidden relative z-10">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  const location = useLocation();
  const isDashboardView = [
    '/dashboard',
    '/repositories',
    '/review',
    '/bugs',
    '/vulnerabilities',
    '/smells',
    '/docs-gen',
    '/analytics',
    '/chat',
    '/settings'
  ].some(path => location.pathname.startsWith(path));

  return (
    <AuthProvider>
      <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        
        {isDashboardView ? (
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/repositories" element={<ProtectedRoute><DashboardLayout><RepoManagement /></DashboardLayout></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute><DashboardLayout><AIReview /></DashboardLayout></ProtectedRoute>} />
            <Route path="/bugs" element={<ProtectedRoute><DashboardLayout><BugDetection /></DashboardLayout></ProtectedRoute>} />
            <Route path="/vulnerabilities" element={<ProtectedRoute><DashboardLayout><Vulnerabilities /></DashboardLayout></ProtectedRoute>} />
            <Route path="/smells" element={<ProtectedRoute><DashboardLayout><CodeSmells /></DashboardLayout></ProtectedRoute>} />
            <Route path="/docs-gen" element={<ProtectedRoute><DashboardLayout><DocGenerator /></DashboardLayout></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><DashboardLayout><Reports /></DashboardLayout></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><DashboardLayout><ChatAssistant /></DashboardLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        ) : (
          <div className="flex-1 pt-16">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
