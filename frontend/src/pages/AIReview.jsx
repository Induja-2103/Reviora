import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { analysisService } from '../services/api';
import { 
  Play, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  FileCode2, 
  Sparkles, 
  Bug, 
  ShieldAlert, 
  Wind 
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

const TEMPLATES = {
  python_vuln: {
    name: 'user_auth.py',
    language: 'python',
    code: `import sqlite3\nimport hashlib\n\ndef check_login(username, password):\n    # CRITICAL: Vulnerable to SQL injection\n    query = f"SELECT * FROM users WHERE user = '{username}' AND pass = '{password}'"\n    conn = sqlite3.connect("db.sqlite")\n    cursor = conn.cursor()\n    \n    # VULN: Weak cryptographic usage\n    hashed_pass = hashlib.md5(password.encode()).hexdigest()\n    \n    try:\n        cursor.execute(query)\n        user = cursor.fetchone()\n        return user\n    except:\n        # BUG: Exception swallowed silently\n        pass\n`
  },
  js_secret: {
    name: 'config.js',
    language: 'javascript',
    code: `// Configuration options\nconst API_SECRET = "ak_live_a8f94cb3d18e592f7c001aef";\n\nfunction initializeService() {\n  console.log("Configuring service with token: " + API_SECRET);\n  \n  try {\n    const response = setupConnection(API_SECRET);\n    return response;\n  } catch (error) {\n    // swallowed\n  }\n}\n`
  },
  python_smell: {
    name: 'matrix_calc.py',
    language: 'python',
    code: `def process_grid_metrics(grid):\n    # SMELL: Nested loop structure (O(N^3) complexity)\n    for row in grid:\n        for col in row:\n            for val in col:\n                temp = val * 2 # SMELL: Non-descriptive name\n                print("Grid Cell Metrics processed: ", temp)\n                \n    return True\n`
  }
};

const AIReview = () => {
  const location = useLocation();
  const initialRepoName = location.state?.repoName || null;

  const [activeTemplateKey, setActiveTemplateKey] = useState('python_vuln');
  const [editorCode, setEditorCode] = useState(TEMPLATES['python_vuln'].code);
  const [editorLanguage, setEditorLanguage] = useState(TEMPLATES['python_vuln'].language);
  const [editorFilename, setEditorFilename] = useState(TEMPLATES['python_vuln'].name);
  
  // Scan UI States
  const [scanning, setScanning] = useState(false);
  const [findings, setFindings] = useState([]);
  const [scanComplete, setScanComplete] = useState(false);

  // Sync state if template selection changes
  const handleTemplateChange = (key) => {
    setActiveTemplateKey(key);
    setEditorCode(TEMPLATES[key].code);
    setEditorLanguage(TEMPLATES[key].language);
    setEditorFilename(TEMPLATES[key].name);
    setScanComplete(false);
    setFindings([]);
  };

  const handleEditorChange = (value) => {
    setEditorCode(value || '');
  };

  const triggerScan = async () => {
    setScanning(true);
    setScanComplete(false);
    setFindings([]);

    try {
      // Execute parallel scanning pipelines
      const [bugRes, vulnRes, smellRes] = await Promise.all([
        analysisService.scanBugs(editorCode, editorFilename),
        analysisService.scanVulnerabilities(editorCode, editorFilename),
        analysisService.scanCodeSmells(editorCode, editorFilename)
      ]);

      const mergedFindings = [
        ...bugRes.findings,
        ...vulnRes.findings,
        ...smellRes.findings
      ];

      setFindings(mergedFindings);
      setScanComplete(true);
    } catch (err) {
      console.error("Scan analysis failed", err);
      alert("Failed to analyze code snippet.");
    } finally {
      setScanning(false);
    }
  };

  const getSeverityBadgeColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'bug': return <Bug className="w-4 h-4 text-rose-400" />;
      case 'vulnerability': return <ShieldAlert className="w-4 h-4 text-yellow-400" />;
      default: return <Wind className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2 select-none">
            <span>AI Review Workspace</span>
            {initialRepoName && (
              <span className="text-xs font-bold bg-accent-primary/20 text-accent-light px-2.5 py-0.5 rounded-full border border-accent-primary/25">
                Project: {initialRepoName}
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-xs font-semibold mt-1">Write, edit, and review source files with real-time AI security scans.</p>
        </div>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Preset Selects */}
          <select
            value={activeTemplateKey}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-dark-900 border border-white/10 hover:border-white/20 text-slate-300 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-accent-primary transition-colors cursor-pointer"
          >
            <option value="python_vuln">Python: Auth Injection</option>
            <option value="js_secret">JavaScript: Secret Token</option>
            <option value="python_smell">Python: Deep Loops</option>
          </select>

          <GlowButton
            onClick={triggerScan}
            variant="primary"
            className="flex items-center space-x-2 text-xs py-2 shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
            isLoading={scanning}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Scan Editor Code</span>
          </GlowButton>
        </div>
      </div>

      {/* Editor & Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Monaco Editor Container */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <GlassCard className="p-0 border border-white/10 relative overflow-hidden flex-1 min-h-[480px]">
            {/* Window header */}
            <div className="flex items-center justify-between px-4 py-3 bg-dark-900 border-b border-white/5">
              <div className="flex items-center space-x-2.5">
                <FileCode2 className="w-4 h-4 text-accent-neon" />
                <span className="text-xs font-mono text-slate-300 font-semibold">{editorFilename}</span>
              </div>
              <span className="text-xxs font-mono text-slate-500 uppercase tracking-widest">{editorLanguage}</span>
            </div>

            {/* Monaco Component */}
            <div className="py-4 h-[440px]">
              <Editor
                height="100%"
                language={editorLanguage}
                theme="vs-dark"
                value={editorCode}
                onChange={handleEditorChange}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                  lineNumbersMinChars: 3,
                  cursorBlinking: 'smooth',
                  padding: { top: 10, bottom: 10 },
                  fontFamily: 'Fira Code, Menlo, Monaco, Consolas, Courier New, monospace',
                  background: 'transparent'
                }}
              />
            </div>
          </GlassCard>
        </div>

        {/* Audit Panel Container */}
        <div className="lg:col-span-5">
          <GlassCard className="h-full border border-white/5 flex flex-col justify-between max-h-[530px] overflow-hidden p-6">
            <div className="flex-1 flex flex-col min-h-0">
              <h2 className="text-base font-bold text-slate-400 uppercase tracking-widest mb-6">Review Findings</h2>
              
              {scanning ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-20 text-center">
                  <div className="w-10 h-10 border-2 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
                  <span className="text-xs font-mono text-accent-light uppercase tracking-widest animate-pulse">Running AI inspection engines...</span>
                </div>
              ) : !scanComplete ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-20 text-center text-slate-500">
                  <Terminal className="h-10 w-10 text-slate-600 mb-2 animate-float" />
                  <p className="text-sm font-medium">Click "Scan Editor Code" to launch analysis checks.</p>
                </div>
              ) : findings.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-20 text-center text-emerald-400">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
                  <p className="text-sm font-bold text-white">Code Review Clean!</p>
                  <p className="text-xs text-slate-400 leading-normal max-w-xs">No bugs, vulnerabilities, or smells matching our rule files were triggered in this scan.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                  {findings.map((fnd) => (
                    <div
                      key={fnd.id}
                      className="p-4 rounded-xl bg-white/5 hover:bg-white/8 border border-white/5 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(fnd.type)}
                          <span className="text-sm font-extrabold text-white">{fnd.title}</span>
                        </div>
                        <span className={`text-xxs font-bold uppercase px-2 py-0.5 rounded-md border ${getSeverityBadgeColor(fnd.severity)}`}>
                          {fnd.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-normal font-medium">{fnd.description}</p>
                      
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xxs font-mono text-slate-500">
                        <span>Line {fnd.line}</span>
                        <span className="text-accent-neon font-semibold">Type: {fnd.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {scanComplete && findings.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-400">
                <span>Summary: {findings.length} findings flagged</span>
                <span className="text-yellow-400 font-semibold flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Fix Recommended</span>
                </span>
              </div>
            )}
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default AIReview;
