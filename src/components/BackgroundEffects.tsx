import React, { useState, useEffect } from 'react';

export const BackgroundEffects: React.FC = () => {
  // Very subtle mouse parallax offset
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 12;
      const y = (e.clientY / innerHeight - 0.5) * 12;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base Canvas: Warm Oatmeal Linen (#FAF8F5) */}
      <div className="absolute inset-0 bg-[#FAF8F5]" />

      {/* 2. Blueprint Grid: Semi-transparent subtle blueprint grid pattern (#E6DFD5 at 0.1 opacity) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(230, 223, 213, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(230, 223, 213, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          opacity: 0.25,
        }}
      />

      {/* Secondary Major Alignment Grid (Every 120px) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
        }}
      />

      {/* 3. Subtle Central Architectural Conduits (Ultra-faint Electric Indigo #6366F1 pulses) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 0.2}px, ${mouseOffset.y * 0.2}px, 0)`,
        }}
      >
        <svg viewBox="0 0 1200 800" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] pointer-events-none opacity-[0.05]">
          <g stroke="#6366F1" strokeWidth="1" fill="none">
            <circle cx="600" cy="400" r="280" strokeDasharray="4 8" />
            <circle cx="600" cy="400" r="420" strokeDasharray="8 12" />
            <line x1="600" y1="40" x2="600" y2="760" strokeDasharray="6 6" />
            <line x1="120" y1="400" x2="1080" y2="400" strokeDasharray="6 6" />
          </g>
        </svg>
      </div>

      {/* 4. Soft Edge Vignette to keep canvas clean & content fully readable */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#FAF8F5]/30 to-[#FAF8F5]/80 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#FAF8F5] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FAF8F5] to-transparent pointer-events-none" />
    </div>
  );
};
