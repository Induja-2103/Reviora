import React from 'react';

const GlowButton = ({
  children,
  className = '',
  variant = 'primary', // 'primary', 'secondary', 'danger', 'glow'
  isLoading = false,
  ...props
}) => {
  const baseStyle = "relative inline-flex items-center justify-center font-semibold rounded-xl px-5 py-2.5 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-accent-primary to-accent-dim text-white hover:from-accent-hover hover:to-accent-primary hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] border border-accent-primary/20",
    secondary: "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20",
    glow: "bg-transparent text-accent-neon border border-accent-primary/50 hover:bg-accent-primary/10 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
};

export default GlowButton;
