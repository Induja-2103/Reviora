import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock send reset instruction
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1200);
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
            Recover Password
          </h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            We'll email you instructions to reset your password
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6 text-center animate-fade-in relative z-10">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex flex-col items-center space-y-3">
              <CheckCircle className="w-8 h-8 text-emerald-400 animate-bounce" />
              <p className="font-extrabold text-white text-sm">Reset Link Emailed</p>
              <p className="leading-relaxed">
                If the email address <strong className="text-slate-100">{email}</strong> exists in our database, you will receive a recovery message shortly.
              </p>
            </div>
            
            <Link to="/login" className="inline-flex items-center space-x-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-1 relative z-10">
            
            {/* Email Address Input with Floating Label */}
            <div className="premium-input-container">
              <input
                id="forgot-email"
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
                  <span>Sending instructions...</span>
                </div>
              ) : (
                <span>Send Recovery Email</span>
              )}
            </button>

            <div className="text-center pt-6">
              <Link to="/login" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-wider">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
