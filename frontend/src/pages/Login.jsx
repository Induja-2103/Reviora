import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Login = () => {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // If already authenticated, redirect
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to authenticate. Please check your credentials.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate registering/logging in via GitHub
      login("demo@reviora.ai", "demopass123")
        .then(() => navigate('/dashboard'))
        .catch(() => setError('GitHub authentication failed.'))
        .finally(() => setLoading(false));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] flex items-center justify-center px-4 py-20 relative overflow-hidden font-sans">
      
      {/* Subtle Animated Background Elements (mesh gradient waves/orbs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-violet-600/15 to-blue-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-fuchsia-600/10 to-violet-600/5 rounded-full blur-[140px] pointer-events-none animate-float"></div>
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Floating Login Card */}
      <div className="premium-card">
        
        {/* Glow effect that tracks hover/focus conceptually */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[24px]"></div>

        <div className="flex flex-col items-center space-y-3 mb-8 text-center relative z-10">
          <div className="sparkle-icon-container">
            <Sparkles className="h-6 w-6 text-violet-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome to Reviora
          </h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Analyze and audit your application code paths
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-start space-x-2.5 animate-fade-in shadow-sm relative z-10">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-1 relative z-10">
          
          {/* Email Address Input with Floating Label */}
          <div className="premium-input-container">
            <input
              id="login-email"
              type="email"
              required
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="premium-input"
            />
            <Mail className="premium-input-icon" />
            <label className="premium-input-label">
              Email Address
            </label>
          </div>

          {/* Password Input with Floating Label */}
          <div className="premium-input-container">
            <div className="absolute right-3.5 top-1.5 z-20">
              <Link to="/forgot-password" className="text-xxs font-bold text-sky-400 hover:text-sky-300 transition-colors uppercase tracking-wider">
                Forgot?
              </Link>
            </div>
            <input
              id="login-password"
              type="password"
              required
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="premium-input"
            />
            <Lock className="premium-input-icon" />
            <label className="premium-input-label">
              Password
            </label>
          </div>

          {/* Premium Gradient Button */}
          <button
            type="submit"
            disabled={loading}
            className="premium-btn mt-2"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing In...</span>
              </div>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6 relative z-10 select-none">
          <div className="absolute inset-0 w-full border-t border-neutral-800"></div>
          <span className="relative px-3 bg-[#111625] text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest">or continue with</span>
        </div>

        {/* GitHub Login Button */}
        <button
          id="github-oauth-btn"
          type="button"
          onClick={handleGithubLogin}
          className="premium-btn-secondary relative z-10"
          disabled={loading}
        >
          <GithubIcon className="w-4.5 h-4.5 text-slate-300 mr-2" />
          <span>Connect GitHub Account</span>
        </button>

        {/* Footer soft link */}
        <div className="mt-8 text-center text-xs font-semibold text-slate-400 relative z-10">
          New to Reviora?{' '}
          <Link to="/register" className="text-sky-400 hover:text-sky-300 hover:underline transition-colors font-bold pl-0.5">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
