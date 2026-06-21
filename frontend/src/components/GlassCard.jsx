import React, { useState, useRef } from 'react';

const GlassCard = ({ children, className = '', hoverEffect = false, tiltEffect = true, ...props }) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !tiltEffect) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Get mouse position relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    // Calculate rotation angles
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 10; // Max 10 degrees tilt
    const rotateY = ((x - centerX) / centerX) * 10;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const cardStyle = (tiltEffect && isHovered) ? {
    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`,
    transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out, border-color 0.3s ease',
    boxShadow: `0 20px 45px -12px rgba(124, 58, 237, 0.25), 0 0 25px rgba(124, 58, 237, 0.08)`,
    borderColor: 'rgba(124, 58, 237, 0.4)',
  } : {
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease, border-color 0.5s ease',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden transition-colors duration-300 ${
        hoverEffect ? 'glass-panel-hover cursor-pointer' : ''
      } ${className}`}
      style={{ ...cardStyle, ...props.style }}
      {...props}
    >
      {/* Dynamic 3D lighting/radial glow follow-mouse overlay */}
      {tiltEffect && isHovered && (
        <div
          className="absolute pointer-events-none rounded-full blur-[80px] opacity-40 transition-opacity duration-300"
          style={{
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(59,130,246,0.08) 60%, transparent 100%)',
            left: `${coords.x - 90}px`,
            top: `${coords.y - 90}px`,
          }}
        />
      )}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
