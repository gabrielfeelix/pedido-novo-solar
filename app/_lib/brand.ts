import type { CSSProperties } from 'react';
import type { Company } from './types';

const COLORED_LOGO_BACKGROUNDS: Record<string, string> = {
  azux: '#1D4ED8',
  oderco: '#1D4ED8',
  quati: '#6BA319',
  skul: '#2F0A46',
  vinik: '#004C3B',
};

const FORCE_WHITE_LOGO = new Set(['azux']);

export function logoFrameStyle(company: Pick<Company, 'slug' | 'brandColor' | 'logo'>): CSSProperties {
  return {
    color: company.brandColor,
    background: COLORED_LOGO_BACKGROUNDS[company.slug] ?? '#fff',
  };
}

export function logoImageStyle(company: Pick<Company, 'slug'>): CSSProperties {
  return FORCE_WHITE_LOGO.has(company.slug) ? { filter: 'brightness(0) invert(1)' } : {};
}
