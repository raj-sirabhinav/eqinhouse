import React, { useState, useEffect } from 'react';

export const BackgroundEffects: React.FC = () => {
  // Ultra-subtle mouse parallax offset for architectural conduit watermark
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 8;
      const y = (e.clientY / innerHeight - 0.5) * 8;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* 1. Base Canvas is #FAF8F5 on body */}

      {/* 2. Ultra-Subtle Cinematographic Film Grain / Noise Overlay (2.5% opacity, mix-blend-overlay) */}
      <div 
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
          mixBlendMode: 'overlay',
        }}
        aria-hidden="true"
      />

      {/* 3. Micro Blueprint Architectural Grid: Attenuated at 12% */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(230, 223, 213, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(230, 223, 213, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          opacity: 0.12,
        }}
        aria-hidden="true"
      />

      {/* 4. Major Telemetry Alignment Grid (120px): Strictly 2.5% opacity */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
        }}
        aria-hidden="true"
      />

      {/* 5. Precision Technical Crosshairs at Grid Corners: Attenuated at 12% */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.12]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="crosshairs" width="240" height="240" patternUnits="userSpaceOnUse">
              <path d="M 120,116 L 120,124 M 116,120 L 124,120" stroke="#6366F1" strokeWidth="1" strokeLinecap="round" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#crosshairs)" />
        </svg>
      </div>

      {/* 6. Subtle Central Architectural Conduits (Faint pulses at 3.5%) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 0.15}px, ${mouseOffset.y * 0.15}px, 0)`,
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 1200 800" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] pointer-events-none opacity-[0.035]">
          <g stroke="#6366F1" strokeWidth="1" fill="none">
            <circle cx="600" cy="400" r="280" strokeDasharray="4 8" />
            <circle cx="600" cy="400" r="440" strokeDasharray="8 12" />
            <line x1="600" y1="40" x2="600" y2="760" strokeDasharray="6 6" />
            <line x1="120" y1="400" x2="1080" y2="400" strokeDasharray="6 6" />
          </g>
        </svg>
      </div>

      {/* 7. Soft Edge Vignette ensuring 100% center reading contrast */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#FAF8F5]/20 to-[#FAF8F5]/85 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAF8F5] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FAF8F5] to-transparent pointer-events-none" />
    </div>
  );
};

export default BackgroundEffects;
