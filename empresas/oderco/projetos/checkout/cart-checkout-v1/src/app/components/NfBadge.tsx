/**
 * NfBadge — componente compartilhado para identificação visual de filiais.
 *
 * PR → azul  (#1A3C6E) — var(--nf-pr)
 * ES → roxo  (#5B2D8E) — var(--nf-es)
 *
 * Tokens definidos em /src/styles/theme.css sob a seção "NF DESIGN SYSTEM".
 * Nunca use hex ou rgba direto aqui — altere apenas os tokens no theme.css.
 */

export type Filial = 'PR' | 'ES';

/** Tokens de cor por filial — consumidos dos CSS vars do design system */
export const NF_TOKEN = {
  PR: {
    color:      'var(--nf-pr)',
    fg:         'var(--nf-pr-fg)',
    surface:    'var(--nf-pr-surface)',
    surfaceMd:  'var(--nf-pr-surface-md)',
    border:     'var(--nf-pr-border)',
    borderSm:   'var(--nf-pr-border-sm)',
  },
  ES: {
    color:      'var(--nf-es)',
    fg:         'var(--nf-es-fg)',
    surface:    'var(--nf-es-surface)',
    surfaceMd:  'var(--nf-es-surface-md)',
    border:     'var(--nf-es-border)',
    borderSm:   'var(--nf-es-border-sm)',
  },
} as const;

interface NfBadgeProps {
  filial: Filial;
  /** Tamanho em px do quadrado do badge (default 20) */
  size?: number;
  /** Variante pill: cantos arredondados maiores */
  pill?: boolean;
}

/**
 * Badge compacto quadrado com sigla da filial.
 * Usado em: Carrinho, Checkout, Revisão, Confirmação.
 */
export function NfBadge({ filial, size = 20, pill = false }: NfBadgeProps) {
  const token = NF_TOKEN[filial];
  const fs = size <= 18 ? 'var(--text-2xs)' : size <= 22 ? '10px' : 'var(--text-xs)';

  return (
    <span
      className="flex items-center justify-center shrink-0 select-none"
      style={{
        width: size,
        height: size,
        background: token.color,
        color: token.fg,
        fontSize: fs,
        fontWeight: 'var(--font-weight-bold)',
        fontFamily: 'var(--font-inter)',
        borderRadius: pill ? 999 : 4,
        letterSpacing: '0.02em',
      }}
    >
      {filial}
    </span>
  );
}

/**
 * Chip horizontal com label completo da NF.
 * Ex.: "NF Paraná" com badge colorido à esquerda.
 */
export function NfChip({ filial, label }: { filial: Filial; label?: string }) {
  const token = NF_TOKEN[filial];
  const defaultLabel = filial === 'PR' ? 'Filial PR' : 'Filial ES';

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{
        background: token.surface,
        border: `1px solid ${token.border}`,
      }}
    >
      <NfBadge filial={filial} size={16} pill />
      <span
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-weight-semibold)',
          fontFamily: 'var(--font-inter)',
          color: token.color,
        }}
      >
        {label ?? defaultLabel}
      </span>
    </span>
  );
}
