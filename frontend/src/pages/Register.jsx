import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react';

const Register = () => {
  const { user, register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(username, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Registration failed. Try using a different email/username.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] flex items-center justify-center px-4 py-20 relative overflow-hidden font-sans">
      
      {/* Subtle Animated Background Elements (mesh gradient waves/orbs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-violet-600/15 to-blue-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-fuchsia-600/10 to-violet-600/5 rounded-full blur-[140px] pointer-events-none animate-float"></div>
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Floating signup card */}
      <div className="premium-card">
        
        {/* Glow effect that tracks hover/focus conceptually */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[24px]"></div>

        <div className="flex flex-col items-center space-y-3 mb-8 text-center relative z-10">
          <div className="sparkle-icon-container">
            <Sparkles className="h-6 w-6 text-violet-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Create Dev Account
          </h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Access professional AI code analysis tools
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-start space-x-2.5 animate-fade-in shadow-sm relative z-10">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-1 relative z-10">
          
          {/* Username Input with Floating Label */}
          <div className="premium-input-container">
            <input
              id="register-username"
              type="text"
              required
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="premium-input"
            />
            <User className="premium-input-icon" />
            <label className="premium-input-label">
              Username
            </label>
          </div>

          {/* Email Address Input with Floating Label */}
          <div className="premium-input-container">
            <input
              id="register-email"
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
            <input
              id="register-password"
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

          {/* Premium Gradient Button with 3D press and hover glow */}
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
                <span>Creating Account...</span>
              </div>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Footer soft link */}
        <div className="mt-8 text-center text-xs font-semibold text-slate-400 relative z-10">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-400 hover:text-sky-300 hover:underline transition-colors font-bold pl-0.5">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
