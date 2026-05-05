import React from 'react';
import svgPaths from '../../../imports/svg-k7vot8na8r';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  style?: React.CSSProperties;
}

export function Breadcrumb({ items, className = '', style = {} }: BreadcrumbProps) {
  return (
    <div 
      className={`content-stretch flex gap-[4px] items-center relative ${className}`} 
      data-name="Breadcrumb"
      style={style}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const isClickable = !!item.onClick && !isLast;

        return (
          <div key={idx} style={{ display: 'contents' }}>
            {/* Breadcrumb item */}
            <div 
              className={`content-stretch flex gap-[4px] items-center relative shrink-0 ${
                isClickable ? 'cursor-pointer hover:opacity-70 transition-opacity' : ''
              }`}
              data-name=".Breadcrumb item"
              onClick={isClickable ? item.onClick : undefined}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={isClickable ? (e) => e.key === 'Enter' && item.onClick?.() : undefined}
            >
              <p 
                className="font-['Inter',sans-serif] leading-[20px] relative shrink-0 text-[14px]"
                style={{
                  fontWeight: 'var(--font-weight-normal)',
                  color: isLast ? '#0a0a0a' : '#737373',
                }}
              >
                {item.label}
              </p>
            </div>
            
            {/* Breadcrumb separator */}
            {!isLast && (
              <div 
                className="content-stretch flex items-center relative shrink-0 size-[14px]" 
                data-name=".Breadcrumb separator"
              >
                <div className="overflow-clip relative shrink-0 size-[14px]" data-name="Icon / chevron-right">
                  <div className="absolute inset-[21.88%_34.38%]" data-name="Vector">
                    <svg 
                      className="absolute block size-full" 
                      fill="none" 
                      preserveAspectRatio="none" 
                      viewBox="0 0 4.37493 7.87493"
                    >
                      <path 
                        d={svgPaths.p3c4e2e00} 
                        fill="#525252" 
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}