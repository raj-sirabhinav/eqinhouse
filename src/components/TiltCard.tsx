import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: React.CSSProperties;
}

export const TiltCard: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
}) => {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
      className={`rounded-2xl transition-all duration-200 ${
        hoverEffect 
          ? 'hover:border-[#d6cbbf] hover:shadow-[0_12px_30px_-8px_rgba(28,25,23,0.08)] shadow-[0_1px_3px_0_rgba(28,25,23,0.04)]' 
          : 'shadow-[0_1px_3px_0_rgba(28,25,23,0.04)]'
      } ${className}`}
    >
      <div className="h-full">{children}</div>
    </div>
  );
};
