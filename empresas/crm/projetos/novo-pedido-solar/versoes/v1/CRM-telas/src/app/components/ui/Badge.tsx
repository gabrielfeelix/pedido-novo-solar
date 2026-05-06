import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
export type BadgeRounded = 'default' | 'full';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  rounded?: BadgeRounded;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function Badge({
  children,
  variant = 'primary',
  rounded = 'default',
  icon,
  iconPosition = 'left',
  className = '',
  style = {},
  onClick,
  onMouseEnter,
  onMouseLeave,
}: BadgeProps) {
  // Base styles from Figma import
  const baseStyles = 'inline-flex items-center justify-center gap-[4px] px-[8px] py-[2px] relative shrink-0';
  
  // Variant styles based on Figma design system
  const variantStyles: Record<BadgeVariant, string> = {
    primary: 'bg-[#001233] text-white',
    secondary: 'bg-[#f5f5f5] text-[#171717]',
    destructive: 'bg-[#dc2626] text-white',
    outline: 'bg-[rgba(255,255,255,0.1)] text-[#0a0a0a] border border-[#e5e5e5] border-solid',
    ghost: 'bg-[rgba(255,255,255,0)] text-[#0a0a0a]',
  };

  // Rounded styles
  const roundedStyles: Record<BadgeRounded, string> = {
    default: 'rounded-[8px]',
    full: 'rounded-[9999px]',
  };

  // Text styles using Inter font (from theme) instead of Geist
  const textStyles = "font-['Inter',sans-serif] text-[12px] leading-[16px] text-center whitespace-nowrap";

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${roundedStyles[rounded]} ${className}`}
      style={{ 
        fontWeight: 'var(--font-weight-semibold)',
        ...style 
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-name="Badge"
    >
      {icon && iconPosition === 'left' && (
        <div className="relative shrink-0 size-[12px]">
          {icon}
        </div>
      )}
      <div className={`flex flex-col justify-center leading-[0] not-italic relative shrink-0 ${textStyles}`}>
        {typeof children === 'string' ? <p className="leading-[16px]" style={{ fontSize: '12px' }}>{children}</p> : children}
      </div>
      {icon && iconPosition === 'right' && (
        <div className="relative shrink-0 size-[12px]">
          {icon}
        </div>
      )}
    </div>
  );
}
