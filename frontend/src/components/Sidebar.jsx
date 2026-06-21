import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Upload,
  LayoutGrid,
  FileText,
  MessageSquare,
  Sparkles
} from 'lucide-react';

// Custom Issues icon matching the screenshot (circle with spokes/rays)
const IssuesIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="7" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

const Sidebar = () => {
  const workspaceItems = [
    { name: 'New Review', path: '/repositories', icon: Upload },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
  ];

  const analysisItems = [
    { name: 'Issues', path: '/bugs', icon: IssuesIcon },
    { name: 'Docs', path: '/docs-gen', icon: FileText },
    { name: 'AI Chat', path: '/chat', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 border-r border-[#262626] bg-[#161616] flex flex-col justify-between fixed top-0 bottom-0 left-0 z-40 select-none font-sans">
      
      <div className="flex-1 flex flex-col min-h-0 pt-8">
        {/* WORKSPACE SECTION */}
        <div className="space-y-2.5 px-4 mb-6">
          <h3 className="px-4 text-[10px] font-extrabold tracking-widest text-[#71717a] uppercase">
            Workspace
          </h3>
          <div className="space-y-1">
            {workspaceItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all group border ${
                      isActive
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/25 shadow-[0_0_15px_rgba(14,165,233,0.1)]'
                        : 'text-[#a1a1aa] hover:bg-neutral-800/40 hover:text-neutral-250 border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`h-4.5 w-4.5 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-[#0284c7]' : 'text-[#71717a] group-hover:text-neutral-200'
                      }`} />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* ANALYSIS SECTION */}
        <div className="space-y-2.5 px-4">
          <h3 className="px-4 text-[10px] font-extrabold tracking-widest text-[#71717a] uppercase">
            Analysis
          </h3>
          <div className="space-y-1">
            {analysisItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all group border ${
                      isActive
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/25 shadow-[0_0_15px_rgba(14,165,233,0.1)]'
                        : 'text-[#a1a1aa] hover:bg-neutral-800/40 hover:text-neutral-250 border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`h-4.5 w-4.5 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-[#0284c7]' : 'text-[#71717a] group-hover:text-neutral-200'
                      }`} />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

      </div>

      {/* Powered by Gemini Badge Footer */}
      <div className="p-6 border-t border-[#262626] flex items-center justify-center bg-[#141414]">
        <div className="flex items-center justify-center space-x-1.5 py-1.5 px-4 bg-neutral-900 border border-sky-500/25 rounded-full shadow-[0_0_12px_rgba(14,165,233,0.06)]">
          <Sparkles className="w-3.5 h-3.5 text-sky-500 fill-sky-500/10" />
          <span className="text-[10px] font-extrabold tracking-wider text-sky-400 uppercase">
            Powered by Gemini
          </span>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
