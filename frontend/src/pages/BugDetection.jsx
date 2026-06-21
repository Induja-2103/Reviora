import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import { Bug, AlertCircle, Check, Copy, Code, HelpCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

const BugDetection = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBug, setSelectedBug] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const reports = await reportService.list();
        // Extract all findings with type 'bug'
        const allBugs = [];
        reports.forEach(r => {
          if (r.findings) {
            r.findings.forEach(f => {
              if (f.type === 'bug') {
                allBugs.push({
                  ...f,
                  repoId: r.repository_id
                });
              }
            });
          }
        });

        // Fallback mock bugs if none exist in reports yet
        if (allBugs.length === 0) {
          allBugs.push(
            {
              id: 'BUG-001-mock',
              file_path: 'utils/math_helpers.py',
              line: 45,
              severity: 'medium',
              type: 'bug',
              title: 'Potential Division by Zero',
              description: 'Expression does not check if the divisor variable is zero before calculating ratios, which will cause runtime exception crashes.',
              code_snippet: 'return numerator / divisor',
              suggested_fix: 'if divisor == 0:\n    return 0\nreturn numerator / divisor',
              repoId: 1
            },
            {
              id: 'BUG-002-mock',
              file_path: 'auth/session.py',
              line: 120,
              severity: 'medium',
              type: 'bug',
              title: 'Silent Exception Swallowing',
              description: 'Catching standard exceptions with "except: pass" or without logs prevents runtime tracking of execution path crashes.',
              code_snippet: 'except Exception:\n    pass',
              suggested_fix: 'except Exception as err:\n    logger.error(f"Failed session: {err}")\n    return None',
              repoId: 1
            },
            {
              id: 'BUG-003-mock',
              file_path: 'components/UserDropdown.jsx',
              line: 18,
              severity: 'high',
              type: 'bug',
              title: 'Null Pointer Reference',
              description: 'Object key user.avatar is accessed directly without validating whether user is null or undefined.',
              code_snippet: 'const url = user.avatar.url;',
              suggested_fix: 'const url = user?.avatar?.url || "/default-avatar.png";',
              repoId: 2
            }
          );
        }

        setBugs(allBugs);
        setSelectedBug(allBugs[0]);
      } catch (err) {
        console.error("Failed to load bugs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBugs();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-2 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      
      <div className="border-b border-white/5 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white select-none">Bugs & Logic Risks</h1>
        <p className="text-slate-400 text-xs font-semibold mt-1">Review syntax errors, exceptions, and pointer failures detected by scan pipelines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Bugs Checklist */}
        <div className="lg:col-span-5 space-y-4 max-h-[550px] overflow-y-auto pr-1">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Alerts ({bugs.length})</h2>
          
          {bugs.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelectedBug(b)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedBug?.id === b.id
                  ? 'bg-accent-primary/10 border-accent-primary shadow-[0_0_15px_rgba(124,58,237,0.1)]'
                  : 'bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Bug className={`w-4.5 h-4.5 ${selectedBug?.id === b.id ? 'text-accent-neon animate-pulse' : 'text-rose-400'}`} />
                  <span className="font-extrabold text-sm text-white">{b.title}</span>
                </div>
                <span className={`text-xxs font-bold uppercase border px-2 py-0.5 rounded-md ${getSeverityColor(b.severity)}`}>
                  {b.severity}
                </span>
              </div>
              <p className="text-xxs font-mono text-slate-500 mt-2 truncate max-w-full">
                {b.file_path}:L{b.line}
              </p>
            </div>
          ))}
        </div>

        {/* Selected Bug Inspector */}
        <div className="lg:col-span-7">
          {selectedBug ? (
            <GlassCard className="border border-white/5 space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="text-xxs font-bold uppercase tracking-widest text-accent-neon bg-accent-primary/10 px-2.5 py-1 rounded-md border border-accent-primary/20">
                    Bug Diagnostics
                  </span>
                  <h2 className="text-xl font-extrabold text-white mt-3">{selectedBug.title}</h2>
                  <p className="text-xs font-mono text-slate-500 mt-1">{selectedBug.file_path} - Line {selectedBug.line}</p>
                </div>
                <span className={`text-xs font-bold uppercase border px-3 py-1 rounded-lg ${getSeverityColor(selectedBug.severity)}`}>
                  {selectedBug.severity} Severity
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-300">Description</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">{selectedBug.description}</p>
              </div>

              {/* Code comparison (Before / After suggested) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Bug Snippet */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    <span>Current Line</span>
                  </span>
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 font-mono text-xs text-red-300 whitespace-pre overflow-x-auto min-h-[100px] flex items-center">
                    <code>{selectedBug.code_snippet}</code>
                  </div>
                </div>

                {/* Suggested Fix */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                    <Code className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Suggested Fix</span>
                  </span>
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 font-mono text-xs text-emerald-300 whitespace-pre overflow-x-auto min-h-[100px] flex items-center">
                    <code>{selectedBug.suggested_fix}</code>
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 flex items-center space-x-1.5">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>Verify code logic passes before deploying</span>
                </span>
                
                <GlowButton
                  onClick={() => handleCopyCode(selectedBug.suggested_fix)}
                  variant="primary"
                  className="text-xs py-2 flex items-center space-x-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-4.5 h-4.5" />
                      <span>Copied Fix!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4.5 h-4.5" />
                      <span>Copy Suggested Fix</span>
                    </>
                  )}
                </GlowButton>
              </div>

            </GlassCard>
          ) : (
            <GlassCard className="border border-white/5 h-60 flex items-center justify-center text-slate-500">
              <p className="text-sm font-medium">Select an alert from the list to inspect.</p>
            </GlassCard>
          )}
        </div>

      </div>

    </div>
  );
};

export default BugDetection;
