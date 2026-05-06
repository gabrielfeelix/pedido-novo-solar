import React from 'react';
import svgPaths from '../../../imports/svg-d827ugvxav';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
export type ButtonSize = 'regular' | 'small' | 'mini';
export type ButtonRounded = 'default' | 'full';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'primary',
  size = 'regular',
  rounded = 'default',
  icon,
  iconPosition = 'left',
  className = '',
  style = {},
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  // Base styles from Figma import
  const baseStyles = 'content-stretch flex items-center justify-center relative shrink-0 transition-colors';
  
  // Variant styles based on Figma design system
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-80',
    outline: 'bg-card text-foreground border border-border border-solid hover:bg-secondary',
    destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
    ghost: 'bg-transparent text-foreground hover:bg-secondary',
  };

  // Size styles (gap, min-height, padding)
  const sizeStyles: Record<ButtonSize, string> = {
    regular: 'gap-[8px] min-h-[36px] px-[16px] py-[8px]',
    small: 'gap-[6px] min-h-[32px] px-[12px] py-[6px]',
    mini: 'gap-[6px] min-h-[24px] px-[8px] py-[3px]',
  };

  // Icon size styles
  const iconSizeStyles: Record<ButtonSize, string> = {
    regular: 'size-[16px]',
    small: 'size-[16px]',
    mini: 'size-[12px]',
  };

  // Rounded styles
  const roundedStyles: Record<ButtonRounded, string> = {
    default: 'rounded-[8px]',
    full: 'rounded-[9999px]',
  };

  // Text size styles using Inter font
  const textSizeStyles: Record<ButtonSize, string> = {
    regular: "font-['Inter',sans-serif] text-[14px] leading-[20px]",
    small: "font-['Inter',sans-serif] text-[14px] leading-[20px]",
    mini: "font-['Inter',sans-serif] text-[12px] leading-[16px]",
  };

  // Disabled styles
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles[rounded]} ${disabledStyles} ${className}`}
      style={{ 
        fontWeight: 'var(--font-weight-medium)',
        ...style 
      }}
      onClick={onClick}
      disabled={disabled}
      data-name="Button"
    >
      {icon && iconPosition === 'left' && (
        <div className={`overflow-clip relative shrink-0 ${iconSizeStyles[size]}`} data-name="Left icon">
          {icon}
        </div>
      )}
      <div className={`flex flex-col justify-center leading-[0] relative shrink-0 text-center whitespace-nowrap ${textSizeStyles[size]}`}>
        {typeof children === 'string' ? (
          <p className={size === 'mini' ? 'leading-[16px]' : 'leading-[20px]'} style={{ fontSize: size === 'mini' ? '12px' : '14px' }}>
            {children}
          </p>
        ) : (
          children
        )}
      </div>
      {icon && iconPosition === 'right' && (
        <div className={`overflow-clip relative shrink-0 ${iconSizeStyles[size]}`} data-name="Right icon">
          {icon}
        </div>
      )}
    </button>
  );
}

// Export common icon components for convenience
export function ChevronDownIcon({ className = '', fill = 'currentColor' }: { className?: string; fill?: string }) {
  return (
    <div className={`absolute inset-[34.38%_21.88%] ${className}`} data-name="Vector">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.99992 4.99992">
        <path d={svgPaths.p2a326440} fill={fill} />
      </svg>
    </div>
  );
}

export function ChevronUpIcon({ className = '', fill = 'currentColor' }: { className?: string; fill?: string }) {
  return (
    <div className={`absolute inset-[34.37%_21.88%_34.38%_21.88%] ${className}`} data-name="Vector">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.99992 5.00004">
        <path d={svgPaths.pc6cf80} fill={fill} />
      </svg>
    </div>
  );
}

export function ChevronLeftIcon({ className = '', fill = 'currentColor' }: { className?: string; fill?: string }) {
  return (
    <div className={`absolute inset-[17.71%] ${className}`} data-name="Vector">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3333 10.3333">
        <g>
          <path d={svgPaths.p36b34e80} fill={fill} />
          <path d={svgPaths.p1c890480} fill={fill} />
        </g>
      </svg>
    </div>
  );
}

export function ChevronRightIcon({ className = '', fill = 'currentColor' }: { className?: string; fill?: string }) {
  return (
    <div className={`absolute inset-[17.71%] ${className}`} data-name="Vector">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3333 10.3333">
        <g>
          <path d={svgPaths.p1c890480} fill={fill} />
          <path d={svgPaths.p3dc1e00} fill={fill} />
        </g>
      </svg>
    </div>
  );
}

export function PlusIcon({ className = '', fill = 'currentColor' }: { className?: string; fill?: string }) {
  return (
    <div className={`absolute inset-[17.71%] ${className}`} data-name="Vector">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3333 10.3333">
        <g>
          <path d={svgPaths.p289a6d00} fill={fill} />
          <path d={svgPaths.p200e1200} fill={fill} />
        </g>
      </svg>
    </div>
  );
}

export function EditIcon({ className = '', fill = 'currentColor' }: { className?: string; fill?: string }) {
  return (
    <div className={`absolute inset-[5.21%] ${className}`} data-name="Vector">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.3333 14.3329">
        <g>
          <path d={svgPaths.p295a2a80} fill={fill} />
          <path d={svgPaths.p15a4cb80} fill={fill} />
        </g>
      </svg>
    </div>
  );
}

export function DeleteIcon({ className = '', fill = 'currentColor' }: { className?: string; fill?: string }) {
  return (
    <div className={`absolute inset-[5.21%_9.38%] ${className}`} data-name="Vector">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 14.3333">
        <g>
          <path d={svgPaths.p33abc100} fill={fill} />
          <path d={svgPaths.p2ac4a80} fill={fill} />
          <path d={svgPaths.p3249e80} fill={fill} />
        </g>
      </svg>
    </div>
  );
}

export function SearchIcon({ className = '', fill = 'currentColor' }: { className?: string; fill?: string }) {
  return (
    <div className={`absolute inset-[9.38%] ${className}`} data-name="Vector">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.9999 12.9999">
        <g>
          <path d={svgPaths.p236d3680} fill={fill} />
          <path d={svgPaths.p21e32300} fill={fill} />
        </g>
      </svg>
    </div>
  );
}

export function BookmarkIcon({ className = '', fill = 'currentColor' }: { className?: string; fill?: string }) {
  return (
    <div className={`absolute inset-[9.38%_17.71%] ${className}`} data-name="Vector">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3333 12.9999">
        <path d={svgPaths.p1c595800} fill={fill} />
      </svg>
    </div>
  );
}