import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { repoService } from '../services/api';
import { 
  Upload, 
  FolderArchive, 
  Trash2, 
  Play, 
  GitBranch, 
  Calendar, 
  AlertCircle, 
  FileCode, 
  Clock, 
  Shield, 
  BarChart3, 
  Rocket, 
  FileText,
  GitFork,
  FlaskConical,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const RepoManagement = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [repoName, setRepoName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // UI states
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const loadRepos = async () => {
    try {
      const list = await repoService.list();
      setRepos(list);
    } catch (err) {
      console.error("Failed to load repositories list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepos();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');
    setSuccessMsg('');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e) => {
    setError('');
    setSuccessMsg('');
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    if (file.name.endsWith('.zip')) {
      setSelectedFile(file);
      if (!repoName) {
        setRepoName(file.name.replace('.zip', ''));
      }
    } else {
      setError('Only .zip files are allowed.');
      setSelectedFile(null);
    }
  };

  const handleSubmitZip = async () => {
    setError('');
    setSuccessMsg('');

    if (!selectedFile) {
      setError('Please drag & drop or select a ZIP file to upload.');
      return;
    }

    const nameToSubmit = repoName || selectedFile.name.replace('.zip', '');
    setSubmitting(true);
    try {
      await repoService.uploadZip(nameToSubmit, selectedFile);
      setSuccessMsg('Repository uploaded successfully!');
      setRepoName('');
      setSelectedFile(null);
      await loadRepos();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to submit ZIP archive. Try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitGithub = async () => {
    setError('');
    setSuccessMsg('');

    if (!githubUrl) {
      setError('Please provide a valid GitHub repository URL.');
      return;
    }

    // Extract repository name from GitHub URL
    let inferredName = '';
    try {
      const parts = githubUrl.split('/');
      inferredName = parts[parts.length - 1] || parts[parts.length - 2] || 'github-repo';
    } catch (err) {
      inferredName = 'github-repo';
    }

    const nameToSubmit = repoName || inferredName;
    setSubmitting(true);
    try {
      await repoService.connectGithub(nameToSubmit, githubUrl);
      setSuccessMsg('GitHub repository connected and scanned!');
      setRepoName('');
      setGithubUrl('');
      await loadRepos();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to connect GitHub repository.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this repository and all related reports?')) {
      try {
        await repoService.delete(id);
        setRepos(repos.filter(r => r.id !== id));
      } catch (err) {
        alert('Failed to delete repository.');
      }
    }
  };

  const triggerScanReview = (repo) => {
    navigate('/review', { state: { repoId: repo.id, repoName: repo.name } });
  };

  const triggerMainAnalysis = () => {
    if (selectedFile) {
      handleSubmitZip();
    } else if (githubUrl) {
      handleSubmitGithub();
    } else {
      setError('Please upload a ZIP file or provide a GitHub repository link first.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      
      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-start space-x-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm flex items-start space-x-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Connection Layout */}
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Drop Zone File Uploader */}
        <div 
          onDragEnter={handleDrag} 
          onDragOver={handleDrag} 
          onDragLeave={handleDrag} 
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative min-h-[200px] ${
            dragActive 
              ? 'border-sky-500 bg-sky-500/5 shadow-[0_0_30px_rgba(14,165,233,0.1)] scale-[0.99]' 
              : selectedFile
                ? 'border-sky-400 bg-neutral-900/50'
                : 'border-neutral-800 bg-neutral-900/20 hover:border-neutral-700 hover:bg-neutral-900/40'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".zip"
            className="hidden"
          />

          <div className={`p-4 rounded-full bg-neutral-900/60 border border-neutral-800 mb-4 transition-colors ${
            selectedFile ? 'text-sky-400 border-sky-500/20' : 'text-neutral-500'
          }`}>
            <Upload className="h-7 w-7" />
          </div>

          {selectedFile ? (
            <div className="space-y-1">
              <span className="text-base font-bold text-white block">File Selected</span>
              <span className="text-sm font-semibold text-sky-400 font-mono truncate max-w-md block">
                {selectedFile.name}
              </span>
              <span className="text-xxs text-neutral-500 block">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-base font-bold text-white block">Drop your GitHub repo or paste code</span>
              <span className="text-sm font-medium text-neutral-400 block max-w-sm">
                Supports any language — Python, JS, Java, Go, Rust, C++ and more
              </span>
            </div>
          )}
        </div>

        {/* Info & History Toggle Row */}
        <div className="flex justify-between items-center text-xs text-neutral-400 px-1">
          <span>Upload a ZIP archive to analyze local source folders.</span>
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="text-sky-400 hover:text-sky-300 font-bold transition-colors flex items-center space-x-1"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{showHistory ? 'Hide History' : 'View History'}</span>
          </button>
        </div>

        {/* Separator */}
        <div className="relative flex items-center justify-center py-2 select-none">
          <div className="absolute inset-0 w-full flex items-center">
            <div className="w-full border-t border-neutral-800"></div>
          </div>
          <span className="relative px-4 bg-[#121212] text-[10px] font-extrabold text-[#71717a] uppercase tracking-widest">
            or connect via GitHub
          </span>
        </div>

        {/* GitHub URL Entry Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <GithubIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#18181b] border border-neutral-800 focus:border-neutral-700 text-slate-100 text-sm font-semibold placeholder-neutral-500 focus:outline-none transition-colors"
              placeholder="https://github.com/user/rep"
            />
          </div>
          <button 
            onClick={handleSubmitGithub}
            className="py-3 px-6 rounded-xl text-sm flex items-center justify-center space-x-2 bg-neutral-950 border border-neutral-700 hover:bg-neutral-900 text-white font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            disabled={submitting && githubUrl !== ''}
          >
            <GithubIcon className="w-4 h-4 text-white" />
            <span>Fetch & Analyze</span>
          </button>
        </div>

        {/* Optional Project Name field */}
        {(selectedFile || githubUrl) && (
          <div className="space-y-1.5 max-w-md mx-auto p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 animate-fade-in">
            <label className="text-xxs font-bold uppercase tracking-wider text-neutral-400 block">Project Custom Name (Optional)</label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-slate-100 text-xs font-semibold focus:outline-none focus:border-neutral-700"
              placeholder="Custom project identifier"
            />
          </div>
        )}

        {/* 2x3 Services Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          
          <GlassCard className="flex flex-col justify-between min-h-[140px] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] border-white/5 transition-all duration-300">
            <div className="text-violet-400">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-1 mt-4">
              <h4 className="text-sm font-extrabold text-white leading-tight">Security scan</h4>
              <p className="text-xs text-neutral-400 font-semibold leading-normal">OWASP Top 10, injection risks</p>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between min-h-[140px] hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] border-white/5 transition-all duration-300">
            <div className="text-cyan-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="space-y-1 mt-4">
              <h4 className="text-sm font-extrabold text-white leading-tight">Code quality</h4>
              <p className="text-xs text-neutral-400 font-semibold leading-normal">Complexity, duplication, smells</p>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between min-h-[140px] hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] border-white/5 transition-all duration-300">
            <div className="text-amber-400">
              <Rocket className="w-6 h-6" />
            </div>
            <div className="space-y-1 mt-4">
              <h4 className="text-sm font-extrabold text-white leading-tight">Performance</h4>
              <p className="text-xs text-neutral-400 font-semibold leading-normal">Bottlenecks & optimizations</p>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between min-h-[140px] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] border-white/5 transition-all duration-300">
            <div className="text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1 mt-4">
              <h4 className="text-sm font-extrabold text-white leading-tight">Auto docs</h4>
              <p className="text-xs text-neutral-400 font-semibold leading-normal">JSDoc, docstrings, README</p>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between min-h-[140px] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] border-white/5 transition-all duration-300">
            <div className="text-indigo-400">
              <GitFork className="w-6 h-6" />
            </div>
            <div className="space-y-1 mt-4">
              <h4 className="text-sm font-extrabold text-white leading-tight">Best practices</h4>
              <p className="text-xs text-neutral-400 font-semibold leading-normal">Design patterns, SOLID principles</p>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between min-h-[140px] hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] border-white/5 transition-all duration-300">
            <div className="text-rose-400">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div className="space-y-1 mt-4">
              <h4 className="text-sm font-extrabold text-white leading-tight">Test coverage</h4>
              <p className="text-xs text-neutral-400 font-semibold leading-normal">Missing tests, coverage logs</p>
            </div>
          </GlassCard>

        </div>

        {/* Gemini Info Banner Footer */}
        <div className="w-full bg-[#18181b] border border-neutral-800 rounded-2xl p-4 flex items-center space-x-3 text-xs text-neutral-400 pt-4 shadow-sm">
          <Info className="w-4.5 h-4.5 text-sky-400 shrink-0" />
          <span>
            Your code is sent to <strong className="text-slate-100 font-extrabold">Gemini 1.5 Pro</strong> for analysis. No code is stored after the session ends.
          </span>
        </div>

      </div>

      {/* History Slide-down panel */}
      {showHistory && (
        <div className="border-t border-neutral-850 pt-8 mt-12 animate-fade-in max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-400 uppercase tracking-widest">Connected Sources History</h2>
            <span className="text-xxs font-mono text-neutral-500">{repos.length} records connected</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-neutral-800 border-t-sky-400 rounded-full animate-spin"></div>
            </div>
          ) : repos.length === 0 ? (
            <div className="border border-neutral-800 bg-neutral-900/20 rounded-2xl p-10 text-center flex flex-col items-center justify-center text-neutral-500">
              <FileCode className="h-8 w-8 text-neutral-600 mb-2" />
              <p className="text-sm font-medium">No reviews triggered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.map((repo) => (
                <div key={repo.id} className="bg-neutral-900/40 border border-neutral-800 rounded-2xl flex flex-col justify-between p-5 hover:border-neutral-700 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-extrabold text-white text-base truncate max-w-[80%]">{repo.name}</h3>
                      {repo.source_type === 'github' ? (
                        <div className="p-1.5 bg-sky-950/20 rounded-lg text-sky-400 border border-sky-500/20">
                          <GithubIcon className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-1.5 bg-neutral-850 rounded-lg text-neutral-400 border border-neutral-800">
                          <FolderArchive className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1.5 text-xs text-neutral-400 font-medium">
                      <div className="flex items-center space-x-1.5">
                        <GitBranch className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Owner: {repo.owner_name}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Connected: {new Date(repo.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-6">
                    <button
                      onClick={() => triggerScanReview(repo)}
                      className="flex-1 text-xs py-2 px-4 rounded-xl font-bold bg-[#EAF2FF] text-[#0284c7] border border-[#d0e1fd]/50 hover:bg-[#dbeafe] flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Review Workspace</span>
                    </button>
                    <button
                      onClick={() => handleDelete(repo.id)}
                      className="p-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-colors"
                      title="Remove Repository"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default RepoManagement;
