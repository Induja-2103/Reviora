import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Settings as SettingsIcon, User, Bell, Key, Copy, Check, Eye, EyeOff, CheckCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

const Settings = () => {
  const { user, refreshUser } = useAuth();
  
  // States
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const handleCopyKey = () => {
    if (user?.api_key) {
      navigator.clipboard.writeText(user.api_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRotateKey = async () => {
    if (window.confirm('Are you sure you want to rotate your developer API Key? Current API calls using the old key will break.')) {
      setRotating(true);
      setSuccessMsg('');
      try {
        await authService.rotateApiKey();
        await refreshUser();
        setSuccessMsg('Developer API Key has been rotated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
        alert('Failed to rotate API Key.');
      } finally {
        setRotating(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2 select-none">
          <span>Profile Settings</span>
        </h1>
        <p className="text-slate-400 text-xs font-semibold mt-1">Configure security profiles, notification parameters, and API integrations.</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center space-x-2.5">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Profile & Notifications */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* User Details */}
          <GlassCard className="border border-white/5 space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
              <User className="w-4 h-4 text-accent-neon" />
              <span>User Profile</span>
            </h2>
            
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Username</span>
                  <p className="text-sm font-extrabold text-white">{user?.username}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Email Address</span>
                  <p className="text-sm font-extrabold text-white">{user?.email}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Registered Since</span>
                <p className="text-sm font-medium text-slate-400">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Notifications Toggles */}
          <GlassCard className="border border-white/5 space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
              <Bell className="w-4 h-4 text-accent-neon" />
              <span>Preferences & Alerts</span>
            </h2>
            
            <div className="space-y-4 pt-2">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">Email Security Alerts</p>
                  <p className="text-xs text-slate-500 leading-normal font-medium">Receive message details instantly when high vulnerabilities are flagged.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4.5 h-4.5 rounded bg-dark-900 border-white/10 text-accent-primary focus:ring-accent-primary focus:ring-offset-dark-950"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">Weekly Audit digest</p>
                  <p className="text-xs text-slate-500 leading-normal font-medium">Get summary tables of historical codebase health index scores.</p>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="w-4.5 h-4.5 rounded bg-dark-900 border-white/10 text-accent-primary focus:ring-accent-primary focus:ring-offset-dark-950"
                />
              </label>
            </div>
          </GlassCard>

        </div>

        {/* Right Side: Security / Developer API Keys */}
        <GlassCard className="lg:col-span-6 border border-white/5 space-y-6 h-fit">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
            <Key className="w-4 h-4 text-accent-neon" />
            <span>Developer API Integrations</span>
          </h2>
          
          <div className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Authenticate automated scan queries on continuous deployment pipelines (CI/CD workflows) using secure header keys:
            </p>
            
            <div className="relative flex items-center bg-dark-900 border border-white/10 rounded-xl px-4 py-3">
              <span className="font-mono text-xs text-slate-300 flex-1 truncate select-all">
                {showKey ? user?.api_key : '••••••••••••••••••••••••••••••••'}
              </span>
              
              <div className="flex items-center space-x-2 shrink-0 ml-3">
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title={showKey ? "Hide API Key" : "Reveal API Key"}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleCopyKey}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Copy Key"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <GlowButton
              onClick={handleRotateKey}
              variant="glow"
              className="w-full text-xs py-2.5 flex items-center justify-center space-x-1.5"
              isLoading={rotating}
            >
              <span>Rotate Access Token</span>
            </GlowButton>
          </div>
        </GlassCard>

      </div>

    </div>
  );
};

export default Settings;
