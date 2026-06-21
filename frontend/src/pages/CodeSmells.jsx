import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import { Wind, Code, Check, Copy, RefreshCw, BarChart2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

const CodeSmells = () => {
  const [smells, setSmells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSmell, setSelectedSmell] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSmells = async () => {
      try {
        const reports = await reportService.list();
        const allSmells = [];
        reports.forEach(r => {
          if (r.findings) {
            r.findings.forEach(f => {
              if (f.type === 'smell') {
                allSmells.push({
                  ...f,
                  repoId: r.repository_id
                });
              }
            });
          }
        });

        // Mock smells if none exist
        if (allSmells.length === 0) {
          allSmells.push(
            {
              id: 'SMELL-001-mock',
              file_path: 'components/DataGrid.jsx',
              line: 85,
              severity: 'medium',
              type: 'smell',
              title: 'Deeply Nested Loops (O(N^3))',
              description: 'Multiple nested loop structures detected in React rendering routines, bottlenecking runtime operations. High cognitive complexity (8/10).',
              code_snippet: 'for (let i = 0; i < len; i++) {\n  for (let j = 0; j < len; j++) {\n    for (let k = 0; k < len; k++) {\n      compare(items[i], items[j], items[k]);\n    }\n  }\n}',
              suggested_fix: '// Map indices or run lookup hashes instead of cubic loops\nconst itemMap = new Map(items.map(x => [x.id, x]));\nitems.forEach(item => {\n  const match = itemMap.get(item.targetId);\n  if (match) reconcile(item, match);\n});',
              impact: 'Cognitive Complexity',
              repoId: 1
            },
            {
              id: 'SMELL-002-mock',
              file_path: 'controllers/authController.py',
              line: 12,
              severity: 'low',
              type: 'smell',
              title: 'Long Method Complexity',
              description: 'The check_user_token function is 72 lines long. Methods longer than 50 lines break single responsibility and decrease test coverage clarity.',
              code_snippet: 'def check_user_token(req, res):\n    # 72 lines of nested validations, DB updates,\n    # formatting, logging, and response writing...',
              suggested_fix: '# Segregate validations and logic handlers into modular utilities\ndef check_user_token(req, res):\n    validate_headers(req)\n    user = fetch_db_user(req)\n    update_audit_log(user)\n    return format_response(user)',
              impact: 'Maintainability',
              repoId: 1
            },
            {
              id: 'SMELL-003-mock',
              file_path: 'utils/helpers.js',
              line: 140,
              severity: 'low',
              type: 'smell',
              title: 'Non-Descriptive Variable Naming',
              description: 'Short variable names like "temp" or "x" reduce logical semantics, making collaborative reviews harder.',
              code_snippet: 'const temp = fetchSessionData(x);',
              suggested_fix: 'const activeSessionPayload = fetchSessionData(userId);',
              impact: 'Readability',
              repoId: 2
            }
          );
        }

        setSmells(allSmells);
        setSelectedSmell(allSmells[0]);
      } catch (err) {
        console.error("Failed to load code smells", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSmells();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSmellBadgeColor = (sev) => {
    switch (sev) {
      case 'high': return 'text-red-400 border-red-500/20 bg-red-500/10';
      case 'medium': return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10';
      default: return 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10';
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
      
      {/* Header */}
      <div className="border-b border-white/5 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white select-none">Code Smells & Refactoring</h1>
        <p className="text-slate-400 text-xs font-semibold mt-1">Review maintainability index ratings, method lengths, and cognitive loops.</p>
      </div>

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="border border-white/5 p-4 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-accent-primary/10 border border-accent-primary/20 text-accent-light">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Maintainability Score</p>
            <p className="text-2xl font-extrabold text-white">84%</p>
          </div>
        </GlassCard>

        <GlassCard className="border border-white/5 p-4 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Smells Flagged</p>
            <p className="text-2xl font-extrabold text-white">{smells.length}</p>
          </div>
        </GlassCard>

        <GlassCard className="border border-white/5 p-4 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Duplication Metric</p>
            <p className="text-2xl font-extrabold text-white">4.2%</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Smell alerts list */}
        <div className="lg:col-span-5 space-y-4 max-h-[500px] overflow-y-auto pr-1">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Maintainability Alerts</h2>
          
          {smells.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSmell(s)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedSmell?.id === s.id
                  ? 'bg-accent-primary/10 border-accent-primary shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                  : 'bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Wind className={`w-4.5 h-4.5 ${selectedSmell?.id === s.id ? 'text-accent-neon animate-pulse' : 'text-cyan-400'}`} />
                  <span className="font-extrabold text-sm text-white">{s.title}</span>
                </div>
                <span className={`text-xxs font-bold uppercase border px-2 py-0.5 rounded-md ${getSmellBadgeColor(s.severity)}`}>
                  {s.severity}
                </span>
              </div>
              <p className="text-xxs font-mono text-slate-500 mt-2 truncate max-w-full">
                {s.file_path}:L{s.line}
              </p>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-7">
          {selectedSmell ? (
            <GlassCard className="border border-white/5 space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xxs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                      Code Cleanliness
                    </span>
                    <span className="text-xxs font-mono text-slate-500">
                      Impact: {selectedSmell.impact}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-3">{selectedSmell.title}</h2>
                  <p className="text-xs font-mono text-slate-500 mt-1">{selectedSmell.file_path} - Line {selectedSmell.line}</p>
                </div>
                <span className={`text-xs font-bold uppercase border px-3 py-1 rounded-lg ${getSmellBadgeColor(selectedSmell.severity)}`}>
                  {selectedSmell.severity} Severity
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-300">Analysis Description</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">{selectedSmell.description}</p>
              </div>

              {/* Bad smell snippet */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Before: Target Code Smell</span>
                </span>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-slate-400 whitespace-pre overflow-x-auto min-h-[100px] flex items-center">
                  <code>{selectedSmell.code_snippet}</code>
                </div>
              </div>

              {/* Refactored Snippet */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                  <span>After: Clean Refactoring suggestion</span>
                </span>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 font-mono text-xs text-emerald-300 whitespace-pre overflow-x-auto min-h-[100px] flex items-center">
                  <code>{selectedSmell.suggested_fix}</code>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Refactor code to decrease maintenance technical debt
                </span>
                
                <GlowButton
                  onClick={() => handleCopyCode(selectedSmell.suggested_fix)}
                  variant="primary"
                  className="text-xs py-2 flex items-center space-x-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-4.5 h-4.5" />
                      <span>Copied Refactor!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4.5 h-4.5" />
                      <span>Copy Refactored Code</span>
                    </>
                  )}
                </GlowButton>
              </div>

            </GlassCard>
          ) : (
            <GlassCard className="border border-white/5 h-60 flex items-center justify-center text-slate-500">
              <p className="text-sm font-medium">Select an alert from the maintainability list.</p>
            </GlassCard>
          )}
        </div>

      </div>

    </div>
  );
};

export default CodeSmells;
