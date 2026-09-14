import React, { useState, useRef, useCallback } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  maxTiltDeg?: number;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: React.CSSProperties;
}

export const TiltCard: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  maxTiltDeg = 2.0,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });

    // Subtle 3D tilt calculation (strictly clamped to maxTiltDeg, max 2 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = Math.max(-maxTiltDeg, Math.min(maxTiltDeg, ((y - centerY) / centerY) * -maxTiltDeg));
    const rotateY = Math.max(-maxTiltDeg, Math.min(maxTiltDeg, ((x - centerX) / centerX) * maxTiltDeg));
    
    setTilt({ x: rotateX, y: rotateY });
  }, [maxTiltDeg]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    if (onMouseLeave) onMouseLeave();
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transition: isHovered
          ? 'transform 0.14s ease-out'
          : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
      className={`group relative rounded-2xl ${
        hoverEffect
          ? 'shadow-[0_1px_3px_0_rgba(15,23,42,0.04),inset_0_1px_0_0_rgba(255,255,255,0.85)] hover:shadow-[0_16px_36px_-10px_rgba(15,23,42,0.07)]'
          : 'shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]'
      } ${className}`}
    >
      {/* 1. Dynamic 1px Border Spotlight: illuminates the 1px perimeter border closest to cursor */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] transition-opacity duration-200 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(260px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.50), rgba(6, 182, 212, 0.28) 40%, transparent 75%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
        aria-hidden="true"
      />

      {/* 2. Restrained Ambient Surface Spotlight Overlay on Hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 -z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(360px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.04), transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* 3. 1px Crisp Top-Edge Light Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/85 to-transparent rounded-t-2xl -z-10" />

      <div className="h-full relative z-10">{children}</div>
    </div>
  );
};

export default TiltCard;
