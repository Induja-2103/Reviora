import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, Shield, LogOut, LayoutDashboard, User } from 'lucide-react';
import GlowButton from './GlowButton';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
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

  if (isAuthPage || isDashboardView) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-dark-950/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="p-2 bg-accent-primary/10 rounded-lg border border-accent-primary/30 group-hover:border-accent-neon group-hover:shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all">
            <Terminal className="h-5 w-5 text-accent-neon" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-accent-light bg-clip-text text-transparent group-hover:text-white transition-all">
            Reviora
          </span>
        </Link>

        {/* Action Controls / Status */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {location.pathname === '/' && (
                <Link to="/dashboard">
                  <GlowButton variant="secondary" className="flex items-center space-x-2 text-sm">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </GlowButton>
                </Link>
              )}
              
              <div className="flex items-center space-x-3 pl-3 border-l border-white/10">
                <Link to="/settings" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-accent-primary/20 border border-accent-primary/40 flex items-center justify-center">
                    <User className="h-4 w-4 text-accent-light" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-all"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/register">
                <GlowButton variant="primary" className="text-sm">
                  Get Started
                </GlowButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
