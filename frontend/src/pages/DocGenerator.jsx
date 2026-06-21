import React, { useState } from 'react';
import { analysisService } from '../services/api';
import { Sparkles, FileText, Download, Copy, Check, FileCode2, Terminal } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

const SAMPLE_CODE = `class UserController:\n    """\n    Handles user registration and session profiles.\n    """\n    \n    def register_user(self, username, email, password):\n        \"\"\"\n        POST /auth/register\n        Registers user into the system database.\n        \"\"\"\n        pass\n        \n    def login_user(self, email, password):\n        \"\"\"\n        POST /auth/login\n        Authenticates email/password credentials returning secure access token.\n        \"\"\"\n        pass\n        \n    def get_user_profile(self, user_id):\n        \"\"\"\n        GET /auth/me\n        Fetches details of logged-in developer profile.\n        \"\"\"\n        pass`;

const DocGenerator = () => {
  const [codeInput, setCodeInput] = useState(SAMPLE_CODE);
  const [generating, setGenerating] = useState(false);
  const [readmeDoc, setReadmeDoc] = useState('');
  const [apiDoc, setApiDoc] = useState('');
  const [activeTab, setActiveTab] = useState('readme'); // 'readme' or 'api'
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await analysisService.generateDocs(codeInput, 'user_controller.py');
      setReadmeDoc(response.readme);
      setApiDoc(response.api_docs);
    } catch (err) {
      alert('Failed to generate documentation.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content, filename) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white select-none">AI Documentation Generator</h1>
        <p className="text-slate-400 text-xs font-semibold mt-1">Extract docstrings and signatures to build beautiful markdowns and API references.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Code Input */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Source Script Input</h2>
          <GlassCard className="p-0 border border-white/15 relative flex-1 min-h-[350px] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-dark-900 border-b border-white/5">
              <span className="text-xs font-mono text-slate-300 font-semibold">controllers.py</span>
              <span className="text-xxs font-mono text-slate-500 uppercase tracking-widest">python</span>
            </div>
            <textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="flex-1 w-full p-4 bg-dark-950/20 text-slate-300 font-mono text-xs focus:outline-none resize-none leading-relaxed border-none"
              placeholder="Paste code blocks here..."
            />
            <div className="p-4 border-t border-white/5 bg-dark-900 flex justify-end">
              <GlowButton
                onClick={handleGenerate}
                variant="primary"
                className="text-xs py-2 flex items-center space-x-1.5"
                isLoading={generating}
              >
                <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>Build Documentation</span>
              </GlowButton>
            </div>
          </GlassCard>
        </div>

        {/* Documentation Output Panel */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Documentation Output</h2>
          
          <GlassCard className="p-0 border border-white/10 flex-1 min-h-[350px] flex flex-col justify-between overflow-hidden">
            
            {/* Nav Tabs */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-dark-900 border-b border-white/5">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('readme')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'readme' ? 'bg-accent-primary/20 text-accent-neon' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  README.md
                </button>
                <button
                  onClick={() => setActiveTab('api')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'api' ? 'bg-accent-primary/20 text-accent-neon' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  API Reference
                </button>
              </div>

              {/* Action shortcuts */}
              {(readmeDoc || apiDoc) && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(activeTab === 'readme' ? readmeDoc : apiDoc)}
                    className="p-1.5 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Copy to Clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDownload(
                      activeTab === 'readme' ? readmeDoc : apiDoc, 
                      activeTab === 'readme' ? 'README.md' : 'API_DOCS.md'
                    )}
                    className="p-1.5 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Document body text */}
            <div className="flex-1 p-6 font-mono text-xs text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed max-h-[350px]">
              {activeTab === 'readme' ? (
                readmeDoc ? (
                  <div className="prose prose-invert max-w-none font-sans space-y-4">
                    {/* Render basic preview blocks */}
                    <div className="border border-white/5 bg-white/2 p-4 rounded-xl font-mono text-xs whitespace-pre select-all text-slate-300 leading-relaxed">
                      {readmeDoc}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-2 text-slate-500 text-center py-20">
                    <FileText className="h-10 w-10 text-slate-600 mb-2" />
                    <p className="text-sm font-medium font-sans">No README generated yet.</p>
                  </div>
                )
              ) : (
                apiDoc ? (
                  <div className="border border-white/5 bg-white/2 p-4 rounded-xl font-mono text-xs whitespace-pre select-all text-slate-300 leading-relaxed">
                    {apiDoc}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-2 text-slate-500 text-center py-20">
                    <FileCode2 className="h-10 w-10 text-slate-600 mb-2" />
                    <p className="text-sm font-medium font-sans">No API specifications generated yet.</p>
                  </div>
                )
              )}
            </div>

          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default DocGenerator;
