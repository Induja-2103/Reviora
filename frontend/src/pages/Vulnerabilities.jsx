import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import { ShieldAlert, AlertCircle, Check, Copy, Key, Terminal } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

const Vulnerabilities = () => {
  const [vulns, setVulns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVuln, setSelectedVuln] = useState(null);
  const [copied, setCopied] = useState(false);
  const [riskScore, setRiskScore] = useState(0);

  useEffect(() => {
    const fetchVulns = async () => {
      try {
        const reports = await reportService.list();
        const allVulns = [];
        reports.forEach(r => {
          if (r.findings) {
            r.findings.forEach(f => {
              if (f.type === 'vulnerability') {
                allVulns.push({
                  ...f,
                  repoId: r.repository_id
                });
              }
            });
          }
        });

        // Mock vulnerabilities if empty
        if (allVulns.length === 0) {
          allVulns.push(
            {
              id: 'VULN-001-mock',
              file_path: 'config/database.js',
              line: 8,
              severity: 'high',
              type: 'vulnerability',
              title: 'Hardcoded Secret / API Token',
              description: 'A cleartext secret/API credential key was detected committed inside configuration objects. This exposes APIs and resources to external credential harvesting attacks.',
              code_snippet: 'const ACCESS_TOKEN = "ak_live_a7f8e9102bc0d49f87b8d0";',
              suggested_fix: 'const ACCESS_TOKEN = process.env.ACCESS_TOKEN;',
              classification: 'A02:2021-Cryptographic Failures',
              cvss: 8.9,
              repoId: 1
            },
            {
              id: 'VULN-002-mock',
              file_path: 'controllers/user.py',
              line: 34,
              severity: 'high',
              type: 'vulnerability',
              title: 'Potential SQL Injection',
              description: 'Concatenating query inputs directly into SQL execution string leaves backend databases vulnerable to malicious payload overrides, causing data leaks or deletions.',
              code_snippet: 'query = f"SELECT * FROM users WHERE email = \'{email_input}\'"',
              suggested_fix: 'cursor.execute("SELECT * FROM users WHERE email = %s", (email_input,))',
              classification: 'A03:2021-Injection',
              cvss: 9.8,
              repoId: 1
            },
            {
              id: 'VULN-003-mock',
              file_path: 'services/system.py',
              line: 52,
              severity: 'medium',
              type: 'vulnerability',
              title: 'Command Execution Risk',
              description: 'Using `os.system` with dynamically formatted string parameters can allow external system hijack commands to run in root shells.',
              code_snippet: 'os.system(f"zip -r archive.zip {target_path}")',
              suggested_fix: 'import subprocess\nsubprocess.run(["zip", "-r", "archive.zip", target_path], shell=False)',
              classification: 'A03:2021-Injection',
              cvss: 7.2,
              repoId: 2
            }
          );
        }

        setVulns(allVulns);
        setSelectedVuln(allVulns[0]);

        // Risk score formula (average of CVSS or weighted by count)
        const avgCvss = allVulns.reduce((acc, curr) => acc + (curr.cvss || 5.0), 0) / allVulns.length;
        setRiskScore(Math.round(avgCvss * 10)); // Convert to out of 100
      } catch (err) {
        console.error("Failed to load vulnerabilities", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVulns();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCvssColor = (cvss) => {
    if (cvss >= 9.0) return 'text-red-500 border-red-500/20 bg-red-500/10';
    if (cvss >= 7.0) return 'text-orange-400 border-orange-500/20 bg-orange-500/10';
    return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10';
  };

  const getRiskScoreLabel = (score) => {
    if (score >= 80) return { label: 'CRITICAL SHIELD BREACH', color: 'text-red-500 bg-red-500/10 border-red-500/20' };
    if (score >= 60) return { label: 'ELEVATED THREAT VECTOR', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
    return { label: 'STABLE ENVELOPE', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-2 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const riskLabelInfo = getRiskScoreLabel(riskScore);

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2 select-none">
            <span>Security Audits</span>
          </h1>
          <p className="text-slate-400 text-xs font-semibold mt-1">Inspecting code paths against standard OWASP security benchmarks.</p>
        </div>

        {/* Global risk indicator */}
        <div className={`px-3 py-1.5 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider ${riskLabelInfo.color}`}>
          {riskLabelInfo.label} (Threat Score: {riskScore}/100)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Vulnerabilities List */}
        <div className="lg:col-span-5 space-y-4 max-h-[550px] overflow-y-auto pr-1">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">OWASP Flagged Risks ({vulns.length})</h2>
          
          {vulns.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelectedVuln(v)}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                selectedVuln?.id === v.id
                  ? 'bg-accent-primary/10 border-accent-primary shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                  : 'bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className={`w-4.5 h-4.5 ${selectedVuln?.id === v.id ? 'text-accent-neon animate-pulse' : 'text-yellow-400'}`} />
                  <span className="font-extrabold text-sm text-white">{v.title}</span>
                </div>
                <span className={`text-xxs font-mono font-bold px-2 py-0.5 border rounded-md ${getCvssColor(v.cvss || 6.0)}`}>
                  CVSS {v.cvss || '6.0'}
                </span>
              </div>
              <p className="text-xxs font-mono text-slate-500 truncate max-w-full">
                {v.file_path}:L{v.line}
              </p>
            </div>
          ))}
        </div>

        {/* Vulnerability Inspector */}
        <div className="lg:col-span-7">
          {selectedVuln ? (
            <GlassCard className="border border-white/5 space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xxs font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                      OWASP Threat
                    </span>
                    <span className="text-xxs font-mono text-slate-500">
                      {selectedVuln.classification}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-3">{selectedVuln.title}</h2>
                  <p className="text-xs font-mono text-slate-500 mt-1">{selectedVuln.file_path} - Line {selectedVuln.line}</p>
                </div>
                <div className={`flex flex-col items-center justify-center p-3 border rounded-xl ${getCvssColor(selectedVuln.cvss || 6.0)}`}>
                  <span className="text-2xl font-extrabold">{selectedVuln.cvss || '6.0'}</span>
                  <span className="text-xxs font-bold uppercase tracking-widest mt-0.5">CVSS</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-300">Exploit Risk & Impact</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">{selectedVuln.description}</p>
              </div>

              {/* Vulnerable code snippet */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Vulnerable Code Snippet</span>
                </span>
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 font-mono text-xs text-red-300 whitespace-pre overflow-x-auto">
                  <code>{selectedVuln.code_snippet}</code>
                </div>
              </div>

              {/* Mitigation guide */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Security Remediation Plan</span>
                </span>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 font-mono text-xs text-emerald-300 whitespace-pre overflow-x-auto">
                  <code>{selectedVuln.suggested_fix}</code>
                </div>
              </div>

              {/* Patch Actions */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 flex items-center space-x-1.5">
                  <Terminal className="w-4 h-4" />
                  <span>Implement patch and re-run scanning checks</span>
                </span>
                
                <GlowButton
                  onClick={() => handleCopyCode(selectedVuln.suggested_fix)}
                  variant="primary"
                  className="text-xs py-2 flex items-center space-x-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-4.5 h-4.5" />
                      <span>Copied Patch!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4.5 h-4.5" />
                      <span>Copy Remediation Patch</span>
                    </>
                  )}
                </GlowButton>
              </div>

            </GlassCard>
          ) : (
            <GlassCard className="border border-white/5 h-60 flex items-center justify-center text-slate-500">
              <p className="text-sm font-medium">Select an alert from the checklist to review.</p>
            </GlassCard>
          )}
        </div>

      </div>

    </div>
  );
};

export default Vulnerabilities;
