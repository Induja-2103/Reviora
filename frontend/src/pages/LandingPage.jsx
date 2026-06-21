import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Sparkles, BarChart3, ArrowRight, Zap, Code, CheckCircle, Bug } from 'lucide-react';
import GlowButton from '../components/GlowButton';
import GlassCard from '../components/GlassCard';

const LandingPage = () => {
  const [typingText, setTypingText] = useState('');
  const [activeStep, setActiveStep] = useState(0); // 0 = typing, 1 = scanning, 2 = review complete
  const codeSnippet = `def upload_avatar(request):
    user = request.user
    file = request.FILES['avatar']
    
    # Vulnerability: Hardcoded API Key
    API_KEY = "ak_live_8f3a1f9e2b4c8d"
    
    # Bug: Swallowing exceptions
    try:
        save_to_s3(file, api_key=API_KEY)
    except:
        pass`;

  // Typing simulator for hero code editor mockup
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypingText((prev) => prev + codeSnippet[index]);
      index++;
      if (index >= codeSnippet.length) {
        clearInterval(interval);
        // Transition to scanning state
        setTimeout(() => {
          setActiveStep(1);
          // Transition to complete state
          setTimeout(() => {
            setActiveStep(2);
          }, 3000);
        }, 1500);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: 'AI Code Review',
      desc: 'Automatic detection of syntax flaws, complex structural loops, and coding anti-patterns.',
      icon: Code,
      color: 'text-violet-400',
      bgGlow: 'hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.25)] border-violet-500/10 hover:border-violet-500/30'
    },
    {
      title: 'OWASP Security Audit',
      desc: 'Scan code paths for direct SQL injection risks, leaked system keys, and unsafe execution scopes.',
      icon: Shield,
      color: 'text-emerald-400',
      bgGlow: 'hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.25)] border-emerald-500/10 hover:border-emerald-500/30'
    },
    {
      title: 'Bug & Log Diagnostics',
      desc: 'Pinpoint potential runtime crashes, silent swallowed exceptions, and leftover console print lines.',
      icon: Bug,
      color: 'text-rose-400',
      bgGlow: 'hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.25)] border-rose-500/10 hover:border-rose-500/30'
    },
    {
      title: 'Doc Generator',
      desc: 'Generate complete README markdowns and dynamic API specs extracted straight from source signatures.',
      icon: Sparkles,
      color: 'text-cyan-400',
      bgGlow: 'hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.25)] border-cyan-500/10 hover:border-cyan-500/30'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#050508] overflow-hidden pt-12 pb-20">
      
      {/* Dynamic Floating Background Gradients */}
      <div className="absolute top-[-10%] left-[5%] w-[600px] h-[600px] bg-gradient-to-tr from-accent-primary/15 to-transparent rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[700px] h-[700px] bg-gradient-to-bl from-accent-neon/10 to-transparent rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center py-16 md:py-28">
          
          {/* Hero text */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/25 text-accent-light text-xs font-semibold uppercase tracking-wider"
            >
              <Zap className="w-3.5 h-3.5 text-accent-neon animate-pulse" />
              <span>Version 2.0 Dev Suite Active</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              Secure & Optimize <br />
              <span className="bg-gradient-to-r from-accent-light via-accent-neon to-fuchsia-400 bg-clip-text text-transparent glow-text">
                Your Code in Seconds
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-400 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              Reviora automatically reviews security vulnerabilities, bug patterns, and code smells while generating instant document signatures. Connect your repo and audit now.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link to="/register" className="w-full sm:w-auto">
                <GlowButton variant="primary" className="w-full px-8 py-3.5 text-sm flex items-center justify-center space-x-2">
                  <span>Start Scanning Free</span>
                  <ArrowRight className="w-4 h-4" />
                </GlowButton>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <GlowButton variant="secondary" className="w-full px-8 py-3.5 text-sm">
                  See Demo Reports
                </GlowButton>
              </Link>
            </motion.div>
          </div>

          {/* Hero Mock Editor Canvas */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <GlassCard className="relative p-0 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden">
              {/* Header Window bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0f] border-b border-white/5">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center space-x-2 select-none">
                  <Code className="w-3.5 h-3.5 text-accent-neon" />
                  <span>avatar_uploader.py</span>
                </div>
                <div className="w-10"></div>
              </div>

              {/* Coding canvas */}
              <div className="p-6 font-mono text-xs sm:text-sm min-h-[300px] bg-[#07070a]/40 text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-none">
                {typingText}
                {typingText.length < codeSnippet.length && (
                  <span className="w-1.5 h-4 bg-accent-neon inline-block animate-pulse ml-0.5 align-middle"></span>
                )}
              </div>

              {/* Status overlay */}
              <AnimatePresence>
                {activeStep === 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#050508]/85 backdrop-blur-md flex flex-col items-center justify-center space-y-4"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-accent-primary/20 border-t-accent-primary animate-spin"></div>
                    <div className="text-accent-light font-bold font-mono text-xs tracking-widest animate-pulse">
                      REVIORA AI SCANDETECT ACTIVE...
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-5 left-5 right-5 bg-[#0c0c14]/95 border border-red-500/35 rounded-xl p-4 shadow-[0_0_30px_rgba(239,68,68,0.15)] backdrop-blur-lg"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="p-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 mt-0.5">
                        <Bug className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xxs font-extrabold text-red-400 uppercase tracking-widest">CRITICAL FINDING</span>
                          <span className="text-xxs font-mono text-slate-500">Line 6</span>
                        </div>
                        <p className="text-sm font-bold text-white">Hardcoded Secrets / Credentials</p>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          Do not embed plain credential tokens. Load keys from host environment parameters.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </div>

        {/* FEATURES SECTION */}
        <div className="py-24 border-t border-white/5 relative">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Complete Static Code Analysis
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium">
              We inspect source lines across languages, providing targeted vulnerability mitigations and code smell refactors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="h-full"
                >
                  <GlassCard 
                    className={`h-full border transition-all duration-300 flex flex-col justify-between ${feat.bgGlow}`} 
                    hoverEffect={true}
                  >
                    <div className="space-y-4">
                      <div className={`p-3 w-fit rounded-xl bg-white/5 border border-white/10 ${feat.color} shadow-sm`}>
                        <Icon className="w-5.5 h-5.5" />
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight">{feat.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* HOW IT WORKS SECTION */}
        <div className="py-24 border-t border-white/5">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              How Reviora Works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium">
              A structured and automated three-step workflow to audit and refactor your projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center space-y-5 group">
              <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 border border-accent-primary/25 flex items-center justify-center text-accent-neon font-extrabold text-xl group-hover:border-accent-neon group-hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all">
                1
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Submit Repository</h3>
              <p className="text-sm text-slate-400 font-medium max-w-xs leading-relaxed">
                Connect your GitHub account or upload a local directory ZIP archive directly to the dashboard.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-5 group">
              <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 border border-accent-primary/25 flex items-center justify-center text-accent-neon font-extrabold text-xl group-hover:border-accent-neon group-hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all">
                2
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Reviora AI Auditing</h3>
              <p className="text-sm text-slate-400 font-medium max-w-xs leading-relaxed">
                Our rule compile engines flag security flaws, potential memory risks, swallowed exceptions, and deep loops.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-5 group">
              <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 border border-accent-primary/25 flex items-center justify-center text-accent-neon font-extrabold text-xl group-hover:border-accent-neon group-hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all">
                3
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Refactor & Export</h3>
              <p className="text-sm text-slate-400 font-medium max-w-xs leading-relaxed">
                Inspect lines inside the workspace, apply immediate patches, and download customized markdown reports.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
          <span>&copy; {new Date().getFullYear()} Reviora AI. All rights reserved.</span>
          <div className="flex space-x-6 mt-4 md:mt-0 font-medium">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact Support</a>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;
