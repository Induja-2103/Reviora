import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../services/api';
import { 
  ShieldAlert, 
  Bug, 
  FolderGit2, 
  TrendingDown, 
  Zap, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Activity,
  CheckCircle2
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    repos: 0,
    bugs: 0,
    vulns: 0,
    smells: 0,
    avgHealth: 100
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await reportService.list();
        setReports(data);
        
        // Compute statistics based on scan reports
        if (data.length > 0) {
          const uniqueRepos = new Set(data.map(r => r.repository_id)).size;
          const totalBugs = data.reduce((acc, curr) => acc + curr.bug_count, 0);
          const totalVulns = data.reduce((acc, curr) => acc + curr.vulnerability_count, 0);
          const totalSmells = data.reduce((acc, curr) => acc + curr.smell_count, 0);
          const avgHealth = Math.round(data.reduce((acc, curr) => acc + curr.health_score, 0) / data.length);
          
          setStats({
            repos: uniqueRepos,
            bugs: totalBugs,
            vulns: totalVulns,
            smells: totalSmells,
            avgHealth
          });
        }
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Simple mock data for area charts (vulnerabilities trend)
  const chartData = [
    { name: 'Scan 1', vulns: 8, bugs: 12 },
    { name: 'Scan 2', vulns: 6, bugs: 9 },
    { name: 'Scan 3', vulns: 5, bugs: 10 },
    { name: 'Scan 4', vulns: 3, bugs: 5 },
    { name: 'Scan 5', vulns: stats.vulns || 2, bugs: stats.bugs || 4 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-2 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Determine health description
  const getHealthLevel = (score) => {
    if (score >= 90) return { label: 'Optimal', color: 'text-emerald-400', stroke: '#10b981', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)] border-emerald-500/20' };
    if (score >= 70) return { label: 'Moderate Risk', color: 'text-yellow-400', stroke: '#eab308', glow: 'shadow-[0_0_30px_rgba(234,179,8,0.15)] border-yellow-500/20' };
    return { label: 'Severe Risk', color: 'text-red-400', stroke: '#ef4444', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)] border-red-500/20' };
  };
  const healthInfo = getHealthLevel(stats.avgHealth);

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white select-none">Console Overview</h1>
          <p className="text-slate-400 text-xs font-semibold mt-1">Continuous static analysis dashboard metrics.</p>
        </div>
        <Link to="/repositories">
          <GlowButton variant="primary" className="flex items-center space-x-2 text-xs py-2 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <Zap className="h-3.5 w-3.5" />
            <span>Trigger New Scan</span>
          </GlowButton>
        </Link>
      </div>

      {/* STATS TILES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <GlassCard className="border border-white/5 flex items-center space-x-4 p-5 hover:shadow-[0_0_25px_rgba(124,58,237,0.1)] hover:border-accent-primary/20 transition-all duration-300">
          <div className="p-3 bg-accent-primary/10 rounded-xl border border-accent-primary/25 text-accent-light">
            <FolderGit2 className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">Active Projects</p>
            <p className="text-2xl font-extrabold text-white mt-1.5 leading-none">{stats.repos}</p>
          </div>
        </GlassCard>

        <GlassCard className="border border-white/5 flex items-center space-x-4 p-5 hover:shadow-[0_0_25px_rgba(244,63,94,0.1)] hover:border-red-500/20 transition-all duration-300">
          <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400">
            <Bug className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">Detected Bugs</p>
            <p className="text-2xl font-extrabold text-white mt-1.5 leading-none">{stats.bugs}</p>
          </div>
        </GlassCard>

        <GlassCard className="border border-white/5 flex items-center space-x-4 p-5 hover:shadow-[0_0_25px_rgba(234,179,8,0.1)] hover:border-yellow-500/20 transition-all duration-300">
          <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-400">
            <ShieldAlert className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">Vulnerabilities</p>
            <p className="text-2xl font-extrabold text-white mt-1.5 leading-none">{stats.vulns}</p>
          </div>
        </GlassCard>

        <GlassCard className="border border-white/5 flex items-center space-x-4 p-5 hover:shadow-[0_0_25px_rgba(59,130,246,0.1)] hover:border-blue-500/20 transition-all duration-300">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
            <Activity className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">Code Smells</p>
            <p className="text-2xl font-extrabold text-white mt-1.5 leading-none">{stats.smells}</p>
          </div>
        </GlassCard>
      </div>

      {/* HEALTH DIAL & CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Radial Health score dial */}
        <GlassCard className={`lg:col-span-4 border flex flex-col items-center justify-center text-center p-8 bg-dark-900/10 transition-all duration-500 ${healthInfo.glow}`}>
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6">Global Health Index</h2>
          
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* SVG circle stroke representation */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-dark-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={healthInfo.stroke}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="440"
                strokeDashoffset={440 - (440 * (stats.avgHealth || 100)) / 100}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-white">{stats.avgHealth}%</span>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider mt-1.5 ${healthInfo.color}`}>
                {healthInfo.label}
              </span>
            </div>
          </div>

          <div className="mt-8 flex items-center space-x-2 text-[10px] font-bold text-slate-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <Clock className="w-3.5 h-3.5 text-accent-light" />
            <span>Updated: Just Now</span>
          </div>
        </GlassCard>

        {/* Charts area */}
        <GlassCard className="lg:col-span-8 border border-white/5 p-6 flex flex-col justify-between bg-dark-900/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Findings Trend</h2>
            <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Fixes Rising</span>
            </div>
          </div>
          
          <div className="h-60 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVulns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBugs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.03} />
                <XAxis dataKey="name" stroke="#475569" tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d0d14', borderColor: 'rgba(255,255,255,0.06)', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="vulns" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#colorVulns)" name="Vulnerabilities" />
                <Area type="monotone" dataKey="bugs" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBugs)" name="Bugs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* RECENT SCANS & AI INSIGHTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent scans list */}
        <GlassCard className="lg:col-span-7 border border-white/5 p-6 bg-dark-900/10">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6">Recent Scans</h2>
          {reports.length === 0 ? (
            <div className="text-center py-10 space-y-4">
              <p className="text-slate-500 text-sm font-semibold">No code scans triggered yet.</p>
              <Link to="/repositories" className="inline-block">
                <GlowButton variant="secondary" className="text-xs">Upload Repository</GlowButton>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs custom-table">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">
                    <th className="pb-3">Repository</th>
                    <th className="pb-3">Health Score</th>
                    <th className="pb-3">Vulnerabilities</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reports.slice(0, 5).map((rep) => (
                    <tr key={rep.id} className="hover:bg-white/2 transition-colors group">
                      <td className="py-3.5 font-bold text-white">Repository #{rep.repository_id}</td>
                      <td className="py-3.5">
                        <span className={`font-extrabold ${rep.health_score >= 80 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                          {rep.health_score}%
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                          {rep.vulnerability_count} Vulns
                        </span>
                      </td>
                      <td className="py-3.5">
                        <Link to="/review" className="text-accent-light group-hover:text-accent-neon hover:underline font-bold flex items-center space-x-1">
                          <span>Inspect Editor</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>

        {/* AI Insights panel */}
        <GlassCard className="lg:col-span-5 border border-white/5 p-6 flex flex-col justify-between bg-dark-900/10">
          <div>
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6">AI Insights</h2>
            
            <div className="space-y-4">
              {stats.vulns > 0 ? (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-red-400">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <p className="font-bold text-white">Hardcoded Secret Alert</p>
                    <p className="mt-1 text-slate-400 font-semibold">
                      One or more credentials committed inside configurations. Move keys to `.env` variables immediately.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start space-x-3 text-emerald-400">
                  <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <p className="font-bold text-white">Optimal Configurations</p>
                    <p className="mt-1 text-slate-400 font-semibold">
                      Security scans verified no plaintext credentials committed. Keep security practices robust!
                    </p>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/25 flex items-start space-x-3 text-accent-light">
                <Zap className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold text-white">Optimize Nesting Loops</p>
                  <p className="mt-1 text-slate-400 font-semibold">
                    Code quality logs flagged cognitive complexity issues. Consider refactoring loop algorithms.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link to="/chat" className="mt-6">
            <GlowButton variant="secondary" className="w-full text-xs py-2.5 font-bold border border-white/10 hover:bg-white/5">
              Chat with AI Assistant
            </GlowButton>
          </Link>
        </GlassCard>
      </div>

    </div>
  );
};

export default Dashboard;
