import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

/* ═══════════════════════════════════════════════════════
   SHARED TOKEN HELPERS
   All sizing / color values come from CSS variables so
   the design system owner can update theme.css and see
   every card reflect the change automatically.
═══════════════════════════════════════════════════════ */

/** Pixel literal for the card's inner section padding.
 *  Matches the Figma's consistent 24px gutter. */
const CARD_PADDING = '24px';

/** Shared card-border style (matches `#e5e5e5` at 30% opacity against white). */
const CARD_BORDER = '1px solid color-mix(in srgb, var(--border) 30%, transparent)';

/* ═══════════════════════════════════════════════════════
   CARD  –  Root wrapper
═══════════════════════════════════════════════════════ */
export interface CardProps {
  children: React.ReactNode;
  /** Extra classes for width / margin overrides */
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Base card wrapper.
 * Provides the white background, border, shadow and rounded corners defined
 * by `--card`, `--border`, `--elevation-sm` and `--radius-card`.
 *
 * Compose with CardHeader / CardContent / CardImage / CardFooter.
 */
export function Card({ children, className = '', style }: CardProps) {
  return (
    <div
      className={`relative flex flex-col items-start overflow-hidden ${className}`}
      data-name="Card"
      style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius-card)',
        border: CARD_BORDER,
        boxShadow: 'var(--elevation-sm)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CARD HEADER
═══════════════════════════════════════════════════════ */
export interface CardHeaderProps {
  /** Main title — rendered in Red Hat Display semibold */
  title: string;
  /** Optional subtitle / description — rendered in Inter regular */
  description?: string;
  /** Optional node placed to the right of the title (e.g. a Badge or Button) */
  action?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Standard card header with title, optional description and optional right-aligned action.
 * Padding: 24px on all sides. No bottom padding — CardContent starts with its own top padding.
 */
export function CardHeader({ title, description, action, className = '', style }: CardHeaderProps) {
  return (
    <div
      className={`flex flex-col w-full shrink-0 ${className}`}
      data-name=".Card Header"
      style={{ padding: CARD_PADDING, paddingBottom: 0, gap: 4, ...style }}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <p
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            fontSize: '16px',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: '24px',
            color: 'var(--foreground)',
          }}
        >
          {title}
        </p>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Description */}
      {description && (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            fontWeight: 'var(--font-weight-normal)',
            lineHeight: '20px',
            color: 'var(--muted-foreground)',
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CARD CONTENT
═══════════════════════════════════════════════════════ */
export interface CardContentProps {
  children: React.ReactNode;
  /** Remove the built-in 24px padding (e.g. for full-bleed sub-sections) */
  noPadding?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Main body area of a card.
 * By default applies the 24px gutter on all sides (top respects sibling spacing).
 */
export function CardContent({ children, noPadding = false, className = '', style }: CardContentProps) {
  return (
    <div
      className={`w-full ${className}`}
      data-name=".Card Content"
      style={noPadding ? style : { padding: CARD_PADDING, ...style }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CARD IMAGE
═══════════════════════════════════════════════════════ */
export interface CardImageProps {
  src: string;
  alt?: string;
  /** CSS aspect-ratio value, e.g. "16/9" | "4/3" | "391/261". Default "16/9" */
  aspectRatio?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Full-bleed image section — no horizontal padding.
 * Preserves the Figma card's `overflow: hidden` clip via the parent Card.
 */
export function CardImage({ src, alt = '', aspectRatio = '16/9', className = '', style }: CardImageProps) {
  return (
    <div
      className={`relative w-full shrink-0 ${className}`}
      data-name=".Card Image"
      style={{ aspectRatio, ...style }}
    >
      <ImageWithFallback
        src={src}
        alt={alt}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CARD FOOTER
═══════════════════════════════════════════════════════ */
export interface CardFooterProps {
  children: React.ReactNode;
  /** Draw a separator line above the footer. Default true */
  bordered?: boolean;
  /** Horizontal alignment of footer items. Default "between" */
  justify?: 'start' | 'end' | 'center' | 'between';
  className?: string;
  style?: React.CSSProperties;
}

const JUSTIFY_MAP: Record<NonNullable<CardFooterProps['justify']>, string> = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
};

/**
 * Footer bar — flex row, items-center, optional top border.
 * Padding: 16px top/bottom, 24px left/right (tighter than content to feel lighter).
 */
export function CardFooter({
  children,
  bordered = false,
  justify = 'between',
  className = '',
  style,
}: CardFooterProps) {
  return (
    <div
      className={`flex items-center w-full shrink-0 ${JUSTIFY_MAP[justify]} ${className}`}
      data-name=".Card Footer"
      style={{
        padding: `16px ${CARD_PADDING}`,
        borderTop: bordered ? CARD_BORDER : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CARD SEPARATOR  –  thin rule between arbitrary sections
═══════════════════════════════════════════════════════ */
export function CardSeparator({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-full shrink-0 ${className}`}
      data-name=".Card Separator"
      style={{ height: 1, background: 'color-mix(in srgb, var(--border) 20%, transparent)' }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   AVATAR  &  AVATAR STACK  (used in card content)
═══════════════════════════════════════════════════════ */
export interface AvatarProps {
  src?: string;
  /** Fallback initials when no src is provided */
  initials?: string;
  /** Diameter in px. Default 32 */
  size?: number;
  alt?: string;
  className?: string;
}

/**
 * Circular avatar with image or initials fallback.
 * Renders a thin white ring border matching the Figma `border-[#f5f5f5]` spec.
 */
export function Avatar({ src, initials, size = 32, alt = '', className = '' }: AvatarProps) {
  return (
    <div
      className={`relative rounded-full shrink-0 overflow-hidden ${className}`}
      data-name="Avatar"
      style={{
        width: size,
        height: size,
        border: '1.5px solid var(--card)',
        background: src ? 'transparent' : 'color-mix(in srgb, var(--muted) 60%, var(--card))',
        flexShrink: 0,
      }}
    >
      {src ? (
        <ImageWithFallback
          src={src}
          alt={alt}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: `${Math.round(size * 0.35)}px`,
              fontWeight: 'var(--font-weight-semibold)',
              lineHeight: 1,
              color: 'var(--muted-foreground)',
            }}
          >
            {initials ?? '?'}
          </span>
        </div>
      )}
    </div>
  );
}

export interface AvatarStackProps {
  /** Array of avatar data. Max 5 shown by default before "+N" overflow */
  avatars: Array<{ src?: string; initials?: string; alt?: string }>;
  /** Diameter in px. Default 32 */
  size?: number;
  /** Negative overlap in px. Default 8 */
  overlap?: number;
  /** Maximum avatars shown before collapsing to "+N". Default 5 */
  max?: number;
  className?: string;
}

/**
 * Overlapping avatar stack matching the Figma `mr-[-8px]` pattern.
 */
export function AvatarStack({ avatars, size = 32, overlap = 8, max = 5, className = '' }: AvatarStackProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - visible.length;

  return (
    <div
      className={`flex items-center ${className}`}
      data-name="Avatar Stack"
      style={{ paddingRight: overlap }}
    >
      {visible.map((av, i) => (
        <div key={i} style={{ marginRight: -overlap }}>
          <Avatar src={av.src} initials={av.initials} alt={av.alt} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            border: '1.5px solid var(--card)',
            background: 'color-mix(in srgb, var(--muted) 60%, var(--card))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: -overlap,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: `${Math.round(size * 0.3)}px`,
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--muted-foreground)',
              lineHeight: 1,
            }}
          >
            +{overflow}
          </span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CARD TITLE / DESCRIPTION  –  standalone text primitives
   For inline use inside CardContent without a full CardHeader
═══════════════════════════════════════════════════════ */
export function CardTitle({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <p
      className={className}
      style={{
        fontFamily: "'Red Hat Display', sans-serif",
        fontSize: '16px',
        fontWeight: 'var(--font-weight-semibold)',
        lineHeight: '24px',
        color: 'var(--foreground)',
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export function CardDescription({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <p
      className={className}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '14px',
        fontWeight: 'var(--font-weight-normal)',
        lineHeight: '20px',
        color: 'var(--muted-foreground)',
        ...style,
      }}
    >
      {children}
    </p>
  );
}
