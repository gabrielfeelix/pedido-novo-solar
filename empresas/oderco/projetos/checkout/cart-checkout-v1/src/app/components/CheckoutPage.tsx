import { useState, useCallback, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router';
import { useCart } from './CartContext';
import { formatCurrency } from './cart-data';

function generateOrderNumber() {
  return `#${Math.floor(10000000 + Math.random() * 90000000)}`;
}

/* ═══════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════ */
interface ContactData { name: string; email: string; phone: string; cpfCnpj: string; }
interface AddressData { cep: string; street: string; number: string; complement: string; neighborhood: string; city: string; state: string; }
interface ShippingOption { id: string; carrier: string; method: string; price: number; days: number; code?: string; }
type LogisticsType = 'cif' | 'fob' | 'retirada';
type PaymentMethod = 'transferencia' | 'boleto' | 'pix' | null;
type NfStep = 'PR' | 'ES' | 'review';

interface NfCheckoutState {
  logisticsType: LogisticsType;
  selectedShipping: string | null;
  showMoreCif: boolean;
  showMoreFob: boolean;
  fobSearch: string;
  paymentMethod: PaymentMethod;
  condicaoPgto: string;
  obsVenda: string;
  obsNF: string;
  pixPaid: boolean;
  pixTimer: number;
  useCredit: boolean;
}

const DEFAULT_NF_STATE: NfCheckoutState = {
  logisticsType: 'cif',
  selectedShipping: null,
  showMoreCif: false,
  showMoreFob: false,
  fobSearch: '',
  paymentMethod: null,
  condicaoPgto: '',
  obsVenda: '',
  obsNF: '',
  pixPaid: false,
  pixTimer: 900,
  useCredit: false,
};

/* ═══════════════════════════════════════════════════════════
   PAYMENT CONDITIONS
═══════════════════════════════════════════════════════════ */
const CONDICOES_PGTO = [
  'A Vista', '7 Dias', '7/14', '7/14/21', '7/14/21/28', '7/14/21/28/35',
  '14 Dias', '14/21 Dias', '14/21/28', '14/21/28/35', '14/21/28/35/42',
  '14/28 Dias', '14/28/42 Dias', '14/35 Dias',
  '21 Dias', '21/28 Dias', '21/28/35', '21/28/35/42', '21/28/35/42/49',
  '21/35 Dias', '21/35/49 Dias',
  '28 Dias', '28/35/42', '28/35/42/49', '28/35/42/49/56',
  '28/42', '28/42/56', '28/56',
  '35/42/49/56',
  'A VISTA/28/35/42/49 Dias',
];

function getCondicoesByValue(subtotal: number): string[] {
  if (subtotal < 1000) {
    return CONDICOES_PGTO.filter(c => {
      if (c === 'A Vista') return true;
      const nums = c.replace(/[^\d/]/g, '').split('/').map(Number).filter(Boolean);
      return nums.length <= 2 && Math.max(...nums) <= 14;
    });
  }
  if (subtotal < 5000) {
    return CONDICOES_PGTO.filter(c => {
      if (c === 'A Vista') return true;
      const nums = c.replace(/[^\d/]/g, '').split('/').map(Number).filter(Boolean);
      return Math.max(...nums) <= 35;
    });
  }
  if (subtotal < 20000) {
    return CONDICOES_PGTO.filter(c => {
      if (c === 'A Vista') return true;
      const nums = c.replace(/[^\d/]/g, '').split('/').map(Number).filter(Boolean);
      return Math.max(...nums) <= 56;
    });
  }
  return CONDICOES_PGTO;
}

function getCondicoesByPayment(method: PaymentMethod, allConditions: string[]): string[] {
  if (method === 'transferencia' || method === 'pix') return ['A Vista'];
  if (method === 'boleto') return allConditions.filter(c => c !== 'A Vista');
  return allConditions;
}


/* ════════ COUPON INLINE COMPONENT ════════ */
function CouponInline({ appliedCode, onApply, onRemove, validCoupons }: {
  appliedCode: string;
  onApply: (code: string) => void;
  onRemove: () => void;
  validCoupons: Record<string, { discount: number; label: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const apply = () => {
    const upper = code.trim().toUpperCase();
    if (validCoupons[upper]) {
      onApply(upper);
      setCode('');
      setError('');
      setOpen(false);
    } else {
      setError('Cupom inválido ou expirado');
    }
  };

  if (appliedCode) {
    return (
      <div className="flex items-center gap-2 rounded-lg px-3 py-2"
        style={{ background: 'var(--success-surface)', border: '1px solid var(--success)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
        <span className="flex-1 block" style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
          {appliedCode} aplicado — {validCoupons[appliedCode]?.label}
        </span>
        <button onClick={onRemove}
          aria-label={`Remover cupom ${appliedCode}`}
          className="bg-transparent border-none cursor-pointer p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm"
          style={{ color: 'var(--muted-foreground)', outlineColor: 'var(--success)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setOpen(o => !o)}
        type="button"
        aria-expanded={open}
        className="flex items-center gap-2 w-full border-none bg-transparent cursor-pointer py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm"
        style={{ color: 'var(--primary)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)', outlineColor: 'var(--primary)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
        <span>Adicionar cupom de desconto</span>
        <span className="ml-auto" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </button>
      {open && (
        <div className="mt-2 flex gap-2">
          <input value={code} onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
            placeholder="Código do cupom"
            onKeyDown={e => e.key === 'Enter' && apply()}
            aria-label="Código do cupom"
            className="flex-1 rounded-lg px-3 h-9 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
            style={{ background: 'var(--input-background)', border: `1px solid ${error ? 'var(--destructive-foreground)' : 'var(--muted)'}`, color: 'var(--foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)', outlineColor: 'var(--primary)' }} />
          <button onClick={apply}
            type="button"
            disabled={!code.trim()}
            className="rounded-lg px-3 h-9 border-none cursor-pointer disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)', outlineColor: 'var(--primary)' }}>
            Aplicar
          </button>
        </div>
      )}
      {error && (
        <span className="block mt-1" style={{ fontSize: 'var(--text-2xs)', color: 'var(--destructive-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
          {error}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FORMATTERS
═══════════════════════════════════════════════════════════ */
function formatCep(v: string) { const d = v.replace(/\D/g, '').slice(0, 8); return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d; }
function formatPhone(v: string) { const d = v.replace(/\D/g, '').slice(0, 11); if (d.length > 10) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`; if (d.length > 6) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`; if (d.length > 2) return `(${d.slice(0,2)}) ${d.slice(2)}`; return d; }
function formatCpfCnpj(v: string) { const d = v.replace(/\D/g, '').slice(0, 14); if (d.length > 12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12)}`; if (d.length > 11) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`; if (d.length > 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`; if (d.length > 6) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`; if (d.length > 3) return `${d.slice(0,3)}.${d.slice(3)}`; return d; }

const FREE_SHIPPING_THRESHOLD = 800;

/* ═══════════════════════════════════════════════════════════
   NF DESIGN SYSTEM — all CSS variables, zero hex/rgba
═══════════════════════════════════════════════════════════ */
const NF_STYLE = {
  PR: {
    color:     'var(--nf-pr)',
    surface:   'var(--nf-pr-surface)',
    surfaceMd: 'var(--nf-pr-surface-md)',
    border:    'var(--nf-pr-border)',
    borderSm:  'var(--nf-pr-border-sm)',
    badgeBg:   'var(--nf-pr)',
    badgeFg:   'var(--nf-pr-fg)',
  },
  ES: {
    color:     'var(--nf-es)',
    surface:   'var(--nf-es-surface)',
    surfaceMd: 'var(--nf-es-surface-md)',
    border:    'var(--nf-es-border)',
    borderSm:  'var(--nf-es-border-sm)',
    badgeBg:   'var(--nf-es)',
    badgeFg:   'var(--nf-es-fg)',
  },
} as const;

/* ═══════════════════════════════════════════════════════════
   SHIPPING DATA
═══════════════════════════════════════════════════════════ */
function getCifOptions(cep: string, filial: 'PR' | 'ES'): ShippingOption[] {
  const r = cep.substring(0, 1);
  const baseMultiplier = filial === 'ES' ? 1.45 : 1;
  const b = (r === '8' ? 12.9 : r === '0' || r === '1' ? 24.5 : 18.7) * baseMultiplier;
  const extraDays = filial === 'ES' ? 2 : 0;

  return [
    { id: 'cif-express', carrier: 'Oderço Express', method: 'Entrega rápida Oderço', price: b * 2.2, days: (r === '8' ? 2 : 4) + extraDays, code: 'ODE01' },
    { id: 'cif-economico', carrier: 'Oderço Econômico', method: 'Entrega econômica Oderço', price: b, days: (r === '8' ? 6 : 10) + extraDays, code: 'ODE02' },
    { id: 'cif-pac', carrier: 'PAC', method: 'Correios - Econômico', price: b * 0.9, days: (r === '8' ? 8 : 12) + extraDays, code: 'PAC01' },
    { id: 'cif-sedex', carrier: 'SEDEX', method: 'Correios - Rápido', price: b * 2.5, days: (r === '8' ? 2 : 5) + extraDays, code: 'SDX01' },
    { id: 'cif-jadlog', carrier: 'JadLog', method: 'Transportadora parceira', price: b * 1.8, days: (r === '8' ? 3 : 6) + extraDays, code: 'JAD01' },
  ];
}

const FOB_OPTIONS_PR: ShippingOption[] = [
  { id: 'fob-pr-1', carrier: 'TRANS LOPES ENCOMENDAS', method: 'Transportadora', price: 0, days: 0, code: '44703' },
  { id: 'fob-pr-2', carrier: 'DISTRIBUIDORA E TRANSPORTES RODO-MACHO', method: 'Transportadora', price: 0, days: 0, code: '64600' },
  { id: 'fob-pr-3', carrier: 'ANDORINHA TRANSPORTES', method: 'Transportadora', price: 0, days: 0, code: '11191' },
  { id: 'fob-pr-4', carrier: 'APEX TRANSPORTE DE CARGAS', method: 'Transportadora', price: 0, days: 0, code: '15541' },
  { id: 'fob-pr-5', carrier: 'ATUAL CARGAS TRANSPORTES LTDA', method: 'Transportadora', price: 0, days: 0, code: '27015' },
  { id: 'fob-pr-6', carrier: 'AZUL CARGO', method: 'Aéreo', price: 0, days: 0, code: '30509' },
  { id: 'fob-pr-7', carrier: 'BAUER TRANSPORTES', method: 'Transportadora', price: 0, days: 0, code: '36469' },
  { id: 'fob-pr-8', carrier: 'EXPRESSO VIP', method: 'Transportadora', price: 0, days: 0, code: '11141' },
  { id: 'fob-pr-9', carrier: 'BRASIL SUL', method: 'Transportadora', price: 0, days: 0, code: '19484' },
  { id: 'fob-pr-10', carrier: 'BRASPRESS - MARINGÁ', method: 'Transportadora', price: 0, days: 0, code: '11064' },
  { id: 'fob-pr-11', carrier: 'CRUZEIRO DO SUL TRANSPORTES', method: 'Transportadora', price: 0, days: 0, code: '22130' },
  { id: 'fob-pr-12', carrier: 'EUCATUR ENCOMENDAS', method: 'Transportadora', price: 0, days: 0, code: '18700' },
  { id: 'fob-pr-13', carrier: 'FEDEX BRASIL', method: 'Courier', price: 0, days: 0, code: '50001' },
  { id: 'fob-pr-14', carrier: 'GOLLOG - GOL LINHAS AEREAS', method: 'Aéreo', price: 0, days: 0, code: '41200' },
  { id: 'fob-pr-15', carrier: 'JAMEF TRANSPORTES LTDA', method: 'Transportadora', price: 0, days: 0, code: '33100' },
  { id: 'fob-pr-16', carrier: 'LATAM CARGO BRASIL', method: 'Aéreo', price: 0, days: 0, code: '45600' },
  { id: 'fob-pr-17', carrier: 'MIRA TRANSPORTES', method: 'Transportadora', price: 0, days: 0, code: '17800' },
  { id: 'fob-pr-18', carrier: 'PLIMOR TRANSPORTES', method: 'Transportadora', price: 0, days: 0, code: '24500' },
  { id: 'fob-pr-19', carrier: 'RODONAVES TRANSPORTES', method: 'Transportadora', price: 0, days: 0, code: '28900' },
  { id: 'fob-pr-20', carrier: 'RAPIDÃO COMETA', method: 'Transportadora', price: 0, days: 0, code: '31200' },
  { id: 'fob-pr-21', carrier: 'SETA TRANSPORTES', method: 'Transportadora', price: 0, days: 0, code: '19200' },
  { id: 'fob-pr-22', carrier: 'TNT MERCÚRIO', method: 'Transportadora', price: 0, days: 0, code: '35400' },
  { id: 'fob-pr-23', carrier: 'TOTAL EXPRESS', method: 'Courier', price: 0, days: 0, code: '52100' },
  { id: 'fob-pr-24', carrier: 'TRANSLOVATO', method: 'Transportadora', price: 0, days: 0, code: '14300' },
  { id: 'fob-pr-25', carrier: 'VIA EXPRESSA TRANSPORTES', method: 'Transportadora', price: 0, days: 0, code: '21600' },
];

const FOB_OPTIONS_ES: ShippingOption[] = [
  { id: 'fob-es-1', carrier: 'AGUIA BRANCA ENCOMENDAS LTDA', method: 'Transportadora', price: 0, days: 0, code: '36439' },
  { id: 'fob-es-2', carrier: 'EXPRESSO SÃO MIGUEL', method: 'Transportadora', price: 0, days: 0, code: '28450' },
  { id: 'fob-es-3', carrier: 'VIAÇÃO SUDESTE', method: 'Transportadora', price: 0, days: 0, code: '19760' },
  { id: 'fob-es-4', carrier: 'PÁSSARO MARRON ENCOMENDAS', method: 'Transportadora', price: 0, days: 0, code: '52890' },
  { id: 'fob-es-5', carrier: 'TRANSNORDESTINA LOGÍSTICA', method: 'Transportadora', price: 0, days: 0, code: '67320' },
  { id: 'fob-es-6', carrier: 'AZUL CARGO', method: 'Aéreo', price: 0, days: 0, code: '30509' },
  { id: 'fob-es-7', carrier: 'LATAM CARGO BRASIL', method: 'Aéreo', price: 0, days: 0, code: '45600' },
  { id: 'fob-es-8', carrier: 'PRONTO ENCOMENDAS', method: 'Transportadora', price: 0, days: 0, code: '41270' },
  { id: 'fob-es-9', carrier: 'TRANSERRAS LOGÍSTICA', method: 'Transportadora', price: 0, days: 0, code: '33450' },
  { id: 'fob-es-10', carrier: 'CONTINENTAL CARGO', method: 'Transportadora', price: 0, days: 0, code: '58190' },
  { id: 'fob-es-11', carrier: 'FEDEX BRASIL', method: 'Courier', price: 0, days: 0, code: '50001' },
  { id: 'fob-es-12', carrier: 'DHL EXPRESS', method: 'Courier', price: 0, days: 0, code: '51200' },
  { id: 'fob-es-13', carrier: 'TRANSPORTES BERTOLINI', method: 'Transportadora', price: 0, days: 0, code: '24780' },
  { id: 'fob-es-14', carrier: 'JAMEF TRANSPORTES LTDA', method: 'Transportadora', price: 0, days: 0, code: '33100' },
  { id: 'fob-es-15', carrier: 'RODONAVES TRANSPORTES', method: 'Transportadora', price: 0, days: 0, code: '28900' },
  { id: 'fob-es-16', carrier: 'TNT MERCÚRIO', method: 'Transportadora', price: 0, days: 0, code: '35400' },
  { id: 'fob-es-17', carrier: 'TOTAL EXPRESS', method: 'Courier', price: 0, days: 0, code: '52100' },
  { id: 'fob-es-18', carrier: 'EXPRESSLOG VITÓRIA', method: 'Transportadora', price: 0, days: 0, code: '62340' },
  { id: 'fob-es-19', carrier: 'TRANSBRASILIANA', method: 'Transportadora', price: 0, days: 0, code: '39870' },
  { id: 'fob-es-20', carrier: 'GOLLOG - GOL LINHAS AEREAS', method: 'Aéreo', price: 0, days: 0, code: '41200' },
];

function getFobOptions(filial: 'PR' | 'ES'): ShippingOption[] {
  return filial === 'PR' ? FOB_OPTIONS_PR : FOB_OPTIONS_ES;
}

/* ═══════════════════════════════════════════════════════════
   SVG ICONS (all using CSS variables)
═══════════════════════════════════════════════════════════ */
function CheckIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
}
function TruckIcon({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
}

/* ── Logistics & Freight block header — semi-truck + route pin ── */
function LogisticsBlockIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="13" height="10" rx="1" />
      <path d="M14 9h4l3 4v3h-7V9z" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
      <path d="M18.5 1C17.12 1 16 2.12 16 3.5c0 1.9 2.5 4.5 2.5 4.5S21 5.4 21 3.5C21 2.12 19.88 1 18.5 1z" />
      <circle cx="18.5" cy="3.5" r="0.8" fill="var(--primary)" stroke="none" />
    </svg>
  );
}

/* ── Free-shipping nudge icon — gift / present ── */
function GiftNudgeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
    </svg>
  );
}

/* ── CIF — Oderço's store pays freight ── */
function CifStoreIcon({ size = 18, color = 'var(--primary)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V11" />
      <path d="M19 21V11" />
      <path d="M1 11l11-8 11 8" />
      <rect x="9" y="14" width="6" height="7" />
    </svg>
  );
}

/* ── Oderço Express — lightning bolt ── */
function ExpressCarrierIcon({ size = 20, color = 'var(--primary)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

/* ── Oderço Econômico — leaf / eco ── */
function EconomicoCarrierIcon({ size = 20, color = 'var(--primary)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 22" />
      <path d="M3.82 22C9 15 17 12 22 9" />
      <path d="M22 2C17 7 11 9 4 10" />
      <path d="M4 10c2-5 8-8 18-8" />
    </svg>
  );
}

/* ── PAC (Correios Econômico) — envelope ── */
function PacCarrierIcon({ size = 20, color = 'var(--primary)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

/* ── SEDEX (Correios Rápido) — rocket ── */
function SedexCarrierIcon({ size = 20, color = 'var(--primary)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

/* ── JadLog (parceira) — articulated truck / 18-wheeler ── */
function JadlogCarrierIcon({ size = 20, color = 'var(--primary)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="12" height="9" rx="1" />
      <line x1="13" y1="10.5" x2="15" y2="10.5" />
      <path d="M15 8h4l3 4v4h-7V8z" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="10.5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
    </svg>
  );
}

/* ── Generic FOB carrier — delivery van ── */
function FobCarrierIcon({ size = 20, color = 'var(--primary)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11v13H5" />
      <polygon points="12 3 12 17 19 17 22 11 19 5 12 3" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

/* ── Carrier icon router — picks the right icon per option id ── */
function CarrierIcon({ id, size = 20 }: { id: string; size?: number }) {
  const c = 'var(--primary)';
  if (id.includes('express'))   return <ExpressCarrierIcon size={size} color={c} />;
  if (id.includes('economico')) return <EconomicoCarrierIcon size={size} color={c} />;
  if (id.includes('pac'))       return <PacCarrierIcon size={size} color={c} />;
  if (id.includes('sedex'))     return <SedexCarrierIcon size={size} color={c} />;
  if (id.includes('jadlog'))    return <JadlogCarrierIcon size={size} color={c} />;
  if (id.startsWith('fob'))     return <FobCarrierIcon size={size} color={c} />;
  return <TruckIcon size={size} />;
}

function WarehouseIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-4h6v4" /><path d="M9 9h6" /><path d="M9 13h6" /></svg>;
}
function FobIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
}
function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
}
function TransferenciaIcon({ color = 'var(--primary)' }: { color?: string }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h5l3-9 4 18 3-9h5" /></svg>;
}
function BoletoIcon({ color = 'var(--primary)' }: { color?: string }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="3" y1="4" x2="3" y2="20" /><line x1="6" y1="4" x2="6" y2="20" strokeWidth="1" /><line x1="8" y1="4" x2="8" y2="20" strokeWidth="3" /><line x1="12" y1="4" x2="12" y2="20" strokeWidth="1" /><line x1="14" y1="4" x2="14" y2="20" /><line x1="17" y1="4" x2="17" y2="20" strokeWidth="1" /><line x1="19" y1="4" x2="19" y2="20" strokeWidth="3" /><line x1="22" y1="4" x2="22" y2="20" /></svg>;
}
function PixIcon({ color = '#32BCAD', size = 24 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill={color} aria-label="PIX">
      <path d="M398.07,338.45c-19.34,0-37.52-7.53-51.18-21.2L301.27,272a13.61,13.61,0,0,0-17.65,0l-46.06,46.06c-13.66,13.66-31.84,21.2-51.18,21.2H170.7l58.5,58.5a45.85,45.85,0,0,0,64.86,0l58.66-58.66ZM186.38,167.61c19.34,0,37.52,7.53,51.18,21.2l46.06,46.06a12.85,12.85,0,0,0,17.79,0L347.05,189c13.66-13.66,31.84-21.2,51.18-21.2h6.69L346.26,109.13a45.85,45.85,0,0,0-64.86,0L222.85,167.61Z"/>
      <path d="M438.62,217.86,403,182.23a13,13,0,0,1-2.49.49H385.16a36.21,36.21,0,0,0-25.46,10.54l-46.06,46.06a35.27,35.27,0,0,1-49.93,0L217.5,193.11A36.22,36.22,0,0,0,192,182.57H173.09a13.07,13.07,0,0,1-2.36-.45l-35.85,35.85a51.55,51.55,0,0,0,0,72.91l35.85,35.85a13.07,13.07,0,0,1,2.36-.45h18.86a36.22,36.22,0,0,0,25.51-10.54l46.21-46.21a35.27,35.27,0,0,1,49.93,0l46.06,46.06A36.21,36.21,0,0,0,385.16,326h15.32a13,13,0,0,1,2.49.49l35.65-35.62A51.59,51.59,0,0,0,438.62,217.86Z"/>
    </svg>
  );
}
function AlertTriangleIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--destructive-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
}
function CalendarIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function InfoIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
}
function LockIcon() {
  return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginLeft: 4, verticalAlign: 'middle' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>;
}
function EditIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}
function UserIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function MapPinIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function NoteIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>;
}
function PackageIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 8v4l3 3" /></svg>;
}

/* ═══════════════════════════════════════════════════════════
   SHARED UI COMPONENTS
═══════════════════════════════════════════════════════════ */

function NfBadge({ filial, small = false }: { filial: 'PR' | 'ES'; small?: boolean }) {
  const size = small ? 16 : 20;
  const fs = small ? '8px' : '9px';
  const style = NF_STYLE[filial];
  return (
    <span className="rounded flex items-center justify-center shrink-0"
      style={{ width: size, height: size, background: style.badgeBg, color: style.badgeFg, fontSize: fs, fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
      {filial}
    </span>
  );
}

function FormInput({
  label, placeholder, value, onChange, type = 'text', required = false, className = '', disabled = false
}: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; className?: string; disabled?: boolean;
}) {
  return (
    <div className={className}>
      <label className="block mb-1.5" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: disabled ? 'var(--muted-foreground)' : 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
        {label} {required && !disabled && <span style={{ color: 'var(--destructive-foreground)' }}>*</span>}
        {disabled && <LockIcon />}
      </label>
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-[44px] rounded-lg px-3.5 outline-none transition-colors duration-150"
        style={{ border: '1px solid var(--muted)', background: disabled ? 'var(--background)' : 'var(--input-background)', fontSize: 'var(--text-sm)', color: disabled ? 'var(--muted-foreground)' : 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', cursor: disabled ? 'not-allowed' : undefined }}
        onFocus={(e) => { if (!disabled) e.currentTarget.style.borderColor = 'var(--primary)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--muted)'; }}
      />
    </div>
  );
}

function SingleSelectDropdown({ value, options, onChange, placeholder = 'Selecione uma opção' }: {
  value: string; options: string[]; onChange: (v: string) => void; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropRect, setDropRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Recalculate fixed position on open / scroll / resize */
  useEffect(() => {
    if (!open || !btnRef.current) return;
    const calc = () => {
      const r = btnRef.current!.getBoundingClientRect();
      setDropRect({ top: r.bottom + 4, left: r.left, width: r.width });
    };
    calc();
    window.addEventListener('scroll', calc, true);
    window.addEventListener('resize', calc);
    return () => { window.removeEventListener('scroll', calc, true); window.removeEventListener('resize', calc); };
  }, [open]);

  const filtered = search ? options.filter(o => o.toLowerCase().includes(search.toLowerCase())) : options;

  return (
    <div ref={ref} className="relative w-full sm:w-[340px]">
      <button ref={btnRef} type="button" onClick={() => setOpen(o => !o)}
        className="w-full h-[44px] flex items-center justify-between px-4 cursor-pointer bg-transparent"
        style={{ border: open ? '1.5px solid var(--primary)' : '1px solid var(--muted)', borderRadius: 'var(--radius)', background: 'var(--input-background)', fontFamily: 'var(--font-red-hat-display)', fontSize: 'var(--text-sm)', color: value ? 'var(--foreground)' : 'var(--muted-foreground)', transition: 'border-color 150ms' }}>
        <span className="truncate">{value || placeholder}</span>
        <ChevronDownIcon open={open} />
      </button>

      {/* position:fixed — escapes any overflow:hidden ancestor */}
      {open && dropRect && (
        <div
          style={{
            position: 'fixed',
            top: dropRect.top,
            left: dropRect.left,
            width: dropRect.width,
            zIndex: 9999,
            background: 'var(--popover)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--dropdown-shadow)',
            border: '1px solid var(--muted)',
          }}
        >
          <div className="px-2 pt-2 pb-1">
            <input type="text" placeholder="Buscar condição..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus
              className="w-full h-[32px] rounded-md px-3 outline-none"
              style={{ border: '1px solid var(--muted)', background: 'var(--background)', fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--muted)'; }} />
          </div>
          <div className="max-h-[220px] overflow-y-auto py-1 px-1">
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-center" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>Nenhuma condição encontrada</div>
            )}
            {filtered.map((option) => {
              const isSelected = option === value;
              return (
                <button key={option} type="button"
                  onClick={() => { onChange(option); setOpen(false); setSearch(''); }}
                  className="w-full flex items-center px-4 py-[9px] cursor-pointer border-none text-left transition-colors duration-100"
                  style={{ background: isSelected ? 'var(--primary-surface-md)' : 'transparent', borderRadius: 'calc(var(--radius) - 2px)', fontFamily: 'var(--font-red-hat-display)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--background)'; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}>
                  <span className="truncate">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ShippingCard({ option, isSelected, onClick, showPrice = true, hasFreeShipping = false }: {
  option: ShippingOption; isSelected: boolean; onClick: () => void; showPrice?: boolean; hasFreeShipping?: boolean;
  nfColor?: string; nfSurface?: string; nfBorderSm?: string;
}) {
  const isFreeOption = hasFreeShipping && option.id === 'cif-economico';
  const displayPrice = isFreeOption ? 0 : option.price;
  /* DS-aligned: primary blue como única cor de seleção. Card sempre branco,
     border + radio mudam quando selected. Sem tinted bg. */
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 sm:gap-4 rounded-lg cursor-pointer transition-all duration-150 text-left"
      style={{ border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--muted)', background: 'var(--card)', fontFamily: 'var(--font-red-hat-display)', padding: isSelected ? '11.5px' : '12px' }}>
      <div className="w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: isSelected ? 'var(--primary)' : 'var(--muted-foreground)' }}>
        {isSelected && <div className="w-[10px] h-[10px] rounded-full" style={{ background: 'var(--primary)' }} />}
      </div>
      <div className="shrink-0"><CarrierIcon id={option.id} size={20} /></div>
      <div className="flex-1 min-w-0">
        <span className="block truncate" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>{option.carrier}</span>
        <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
          {option.method}{option.days > 0 ? ` · até ${option.days} dias úteis` : ''}{option.code ? ` · Cód. ${option.code}` : ''}
        </span>
      </div>
      {showPrice && option.price > 0 && (
        <div className="text-right shrink-0">
          {displayPrice === 0
            ? (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-[3px]"
                style={{ background: 'var(--success-surface)', border: '1px solid var(--success)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--success)' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                GRÁTIS
              </span>
            )
            : <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>{formatCurrency(displayPrice)}</span>}
        </div>
      )}
      {!showPrice && (
        <span className="shrink-0 inline-block rounded-sm px-2 py-[2px]" style={{ background: 'var(--background)', fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
          Frete por conta do comprador
        </span>
      )}
    </button>
  );
}

/** Inline per-block reapply hint — shown at top of each block on ES step */
function BlockReapplyHint({ label, onApply, applied }: { label: string; onApply: () => void; applied: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, ease: 'easeOut' }}
      className="flex items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 mb-5"
      style={{ background: 'var(--primary-surface-xs)', border: '1px solid var(--primary-border-xs)' }}>
      <div className="flex items-center gap-2 min-w-0">
        {applied ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        )}
        <span className="min-w-0" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: '1.4' }}>
          {applied ? (
            <span style={{ color: 'var(--success)', fontWeight: 'var(--font-weight-semibold)' }}>Configuração da Filial PR aplicada</span>
          ) : (
            <>Usar mesma configuração da Filial PR?{' '}<span style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{label}</span></>
          )}
        </span>
      </div>
      {!applied && (
        <button onClick={onApply}
          className="shrink-0 h-7 px-3.5 rounded-md border-none cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', whiteSpace: 'nowrap' }}>
          Aplicar
        </button>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN STEP INDICATOR  —  Carrinho → Pedido → Revisão
   Filial agora é UMA POR VEZ — não divide steps.
   Identificação visual da filial ativa fica no badge abaixo.
═══════════════════════════════════════════════════════════ */
function MainStepIndicator({ currentNfStep }: { currentNfStep: NfStep }) {
  const isPR = currentNfStep === 'PR';
  const isES = currentNfStep === 'ES';
  const isReview = currentNfStep === 'review';
  const isPedido = isPR || isES;

  const steps = [
    { key: 'carrinho', label: 'Carrinho', done: true,             active: false },
    { key: 'pedido',   label: 'Pedido',   done: isReview,         active: isPedido },
    { key: 'revisao',  label: 'Revisão',  done: false,            active: isReview },
  ];

  return (
    <div className="flex items-center justify-center">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            {/* Circle */}
            <div
              className="flex items-center justify-center rounded-full transition-all duration-300 shrink-0"
              style={{
                width: 28, height: 28,
                background: step.done || step.active ? 'var(--primary)' : 'var(--muted)',
                color: step.done || step.active ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              }}
            >
              {step.done ? (
                <CheckIcon />
              ) : (
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
                  {i + 1}
                </span>
              )}
            </div>
            {/* Label */}
            <span
              className="whitespace-nowrap"
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: step.active ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)',
                color: step.active || step.done ? 'var(--foreground)' : 'var(--muted-foreground)',
                fontFamily: 'var(--font-red-hat-display)',
              }}
            >
              {step.label}
            </span>
          </div>
          {/* Connector */}
          {i < steps.length - 1 && (
            <div
              className="h-[2px] mx-3 mb-[18px] rounded-full transition-colors duration-300"
              style={{ width: 52, background: step.done ? 'var(--primary)' : 'var(--muted)' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NF SUB-INDICATOR  —  ● NF Paraná  →  ○ NF Espírito Santo
   Three distinct states per filial:
     active  → filled dot  + NF color  + semibold
     done    → check mark  + NF color  + normal  + underline + clickable
     pending → open circle + muted     + normal
   Only rendered inside Checkout step when there are 2 NFs.
═══════════════════════════════════════════════════════════ */

function NfDotFilled({ color }: { color: string }) {
  return (
    <span style={{
      display: 'inline-block', width: 9, height: 9, borderRadius: '50%',
      background: color, flexShrink: 0, transition: 'background 0.2s',
    }} />
  );
}
function NfDotEmpty() {
  return (
    <span style={{
      display: 'inline-block', width: 9, height: 9, borderRadius: '50%',
      border: '1.5px solid var(--muted-foreground)', flexShrink: 0,
      background: 'transparent',
    }} />
  );
}
function NfCheckMark({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="6" r="5.25" stroke={color} strokeWidth="1.4" fill="none" />
      <polyline points="3.2,6 5,7.8 8.8,4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function NfArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NfSubIndicator({
  activeFiliaisInCart, currentNfStep, onGoToStep,
}: {
  activeFiliaisInCart: ('PR' | 'ES')[];
  currentNfStep: NfStep;
  onGoToStep: (step: NfStep) => void;
}) {
  if (activeFiliaisInCart.length < 2) return null;

  const orderedKeys: NfStep[] = [...activeFiliaisInCart, 'review'];
  const currentIdx = orderedKeys.indexOf(currentNfStep);

  return (
    <div className="flex items-center justify-center mt-4">
      <div
        className="inline-flex items-center gap-4 rounded-full px-5 py-2"
        style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}
      >
        {activeFiliaisInCart.map((filial, i) => {
          const filialIdx = orderedKeys.indexOf(filial);
          const isDone    = filialIdx < currentIdx;
          const isActive  = filial === currentNfStep;
          const isPending = !isDone && !isActive;
          const nfColor   = NF_STYLE[filial].color;
          const label     = filial === 'PR' ? 'Filial PR' : 'Filial ES';

          return (
            <div key={filial} className="flex items-center gap-4">
              <button
                onClick={() => isDone ? onGoToStep(filial) : undefined}
                className="flex items-center gap-1.5 bg-transparent border-none p-0 transition-opacity"
                style={{ cursor: isDone ? 'pointer' : 'default', opacity: isPending ? 0.5 : 1 }}
                title={isDone ? `Voltar para ${label}` : undefined}
              >
                {isDone    && <NfCheckMark color={nfColor} />}
                {isActive  && <NfDotFilled color={nfColor} />}
                {isPending && <NfDotEmpty />}

                <span style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                  color: isActive || isDone ? nfColor : 'var(--muted-foreground)',
                  fontFamily: 'var(--font-red-hat-display)',
                  whiteSpace: 'nowrap',
                  textDecoration: isDone ? 'underline' : 'none',
                  textUnderlineOffset: '2px',
                  letterSpacing: '-0.01em',
                }}>
                  {label}
                </span>
              </button>

              {i < activeFiliaisInCart.length - 1 && <NfArrow />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BLOCK HEADING
═══════════════════════════════════════════════════════════ */
function BlockHeading({ icon, title, subtitle, action }: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-5">
      <div className="flex items-center gap-3">
        <div className="w-[38px] h-[38px] rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'var(--primary-surface-md)' }}>
          {icon}
        </div>
        <div>
          <span className="block" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            {title}
          </span>
          {subtitle && (
            <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN CHECKOUT PAGE
═══════════════════════════════════════════════════════════ */
export function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, removeFilial, markNfCompleted, completedOrders } = useCart();

  /* ── Single-NF scope (driven by ?nf=PR|ES from CartPage) ──
     If param present, this checkout session handles ONLY that NF — exact UX
     spec: 1 pedido por vez, retorna ao /carrinho ao concluir. */
  const nfParam = searchParams.get('nf');
  const scopedNf: ('PR' | 'ES') | null = nfParam === 'PR' || nfParam === 'ES' ? nfParam : null;

  /* ── Initial step ── */
  const initialStep: NfStep = scopedNf
    ? scopedNf
    : items.some(i => i.filial.includes('PR')) ? 'PR' : 'ES';
  const [nfStep, setNfStep] = useState<NfStep>(initialStep);

  /* ── Contact & Address (read-only — pre-loaded from account) ── */
  const contact: ContactData = { name: 'Distribuidora Nova Era Ltda', email: 'compras@novaera.com.br', phone: '44999887766', cpfCnpj: '12345678000199' };
  const address: AddressData = { cep: '87020100', street: 'Av. Brasil', number: '4500', complement: 'Galpão 3', neighborhood: 'Zona 07', city: 'Maringá', state: 'PR' };

  /* ── Per-NF state ── */
  const [nfState, setNfState] = useState<Record<'PR' | 'ES', NfCheckoutState>>({
    PR: { ...DEFAULT_NF_STATE },
    ES: { ...DEFAULT_NF_STATE },
  });

  const updateNf = useCallback((filial: 'PR' | 'ES', updates: Partial<NfCheckoutState>) => {
    setNfState(prev => ({ ...prev, [filial]: { ...prev[filial], ...updates } }));
  }, []);

  /* ── Obs collapsed state per NF ── */
  const [obsExpanded, setObsExpanded] = useState<Record<'PR' | 'ES', boolean>>({ PR: false, ES: false });

  /* ── Sidebar: PR completed card expanded state (shown on ES step) ── */
  const [prCardExpanded, setPrCardExpanded] = useState(false);

  /* ── CIF Shipping ── */
  const [cifOptionsPR, setCifOptionsPR] = useState<ShippingOption[]>([]);
  const [cifOptionsES, setCifOptionsES] = useState<ShippingOption[]>([]);
  const [isLoadingCif, setIsLoadingCif] = useState(false);

  /* ── Credit — 2 fontes combináveis: usuário pode aplicar RMA, Depósito ou AMBAS.
       Cada fonte contribui seu valor TOTAL disponível. ── */
  const mockDeposito = 300.00;
  const mockRMA = 750.00;
  const [creditSources, setCreditSources] = useState<{ rma: boolean; deposito: boolean }>({ rma: false, deposito: false });
  const useCredit = creditSources.rma || creditSources.deposito;
  const mockCredit = (creditSources.rma ? mockRMA : 0) + (creditSources.deposito ? mockDeposito : 0);
  const creditLabel = creditSources.rma && creditSources.deposito
    ? 'RMA + Crédito Depósito'
    : creditSources.rma ? 'RMA'
    : creditSources.deposito ? 'Crédito Depósito'
    : 'Crédito';

  /* ── Coupon — cumulativo com crédito. Aplica em cima do total após crédito. ── */
  const VALID_COUPONS: Record<string, { discount: number; label: string }> = {
    'ODERÇO10':       { discount: 0.10, label: '−10%' },
    'PRIMEIRACOMPRA': { discount: 0.07, label: '−7%' },
  };
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const couponPct = appliedCoupon && VALID_COUPONS[appliedCoupon] ? VALID_COUPONS[appliedCoupon].discount : 0;

  /* ── Consultor contact request ── */
  const [wantConsultor, setWantConsultor] = useState(true);

  /* ── PIX Modal ── */
  const [showPixModal, setShowPixModal] = useState(false);
  const [activePixTab, setActivePixTab] = useState<'PR' | 'ES'>('PR');

  /* ── Active obs tab for review ── */
  const [activeObsTab, setActiveObsTab] = useState<'PR' | 'ES'>('PR');

  /* ── Delete NF confirmation modal ── */
  const [deleteNfTarget, setDeleteNfTarget] = useState<'PR' | 'ES' | null>(null);

  /* ── Derived items + subtotals ── */
  const itemsPR = useMemo(() => items.filter(i => i.filial.includes('PR')), [items]);
  const itemsES = useMemo(() => items.filter(i => i.filial.includes('ES')), [items]);
  const subtotalPR = useMemo(() => itemsPR.reduce((s, i) => s + i.price * i.quantity, 0), [itemsPR]);
  const subtotalES = useMemo(() => itemsES.reduce((s, i) => s + i.price * i.quantity, 0), [itemsES]);

  const activeFiliaisInCart = useMemo<('PR' | 'ES')[]>(() => {
    /* Single-NF mode (?nf=PR|ES): scope this checkout to ONE filial only.
       Cart Page now drives the multi-NF flow — checkout finalizes one at a time. */
    if (scopedNf) {
      const present = scopedNf === 'PR' ? itemsPR.length > 0 : itemsES.length > 0;
      if (present) return [scopedNf];
    }
    const f: ('PR' | 'ES')[] = [];
    if (itemsPR.length > 0) f.push('PR');
    if (itemsES.length > 0) f.push('ES');
    return f;
  }, [itemsPR.length, itemsES.length, scopedNf]);

  /* hasMultipleOrigins now follows the SCOPED filiais — when ?nf=PR is set,
     the checkout behaves as a single-NF flow even if the cart has more. */
  const hasMultipleOrigins = activeFiliaisInCart.length > 1;

  /* ── Shipping prices per NF ── */
  const getShippingPriceForNf = useCallback((filial: 'PR' | 'ES'): number => {
    const state = nfState[filial];
    if (state.logisticsType !== 'cif') return 0;
    const cifOpts = filial === 'PR' ? cifOptionsPR : cifOptionsES;
    const opt = cifOpts.find(o => o.id === state.selectedShipping);
    if (!opt) return 0;
    const nfSub = filial === 'PR' ? subtotalPR : subtotalES;
    const hasFree = nfSub >= FREE_SHIPPING_THRESHOLD;
    return hasFree && opt.id === 'cif-economico' ? 0 : opt.price;
  }, [nfState, cifOptionsPR, cifOptionsES, subtotalPR, subtotalES]);

  const shippingPricePR = getShippingPriceForNf('PR');
  const shippingPriceES = getShippingPriceForNf('ES');
  const totalPR = subtotalPR + shippingPricePR;
  const totalES = subtotalES + shippingPriceES;
  const grandTotal = totalPR + totalES;

  // Credit application — varia por fluxo:
  //  · Single-NF (scopedNf set): credito TODO vai pra filial ativa. R$ 300 credito + R$ 760 total = −R$ 300 abatimento.
  //  · Multi-NF legado (sem scope): split proporcional entre PR e ES, capado pelo grandTotal.
  const effectiveTotalForCredit = scopedNf === 'PR' ? totalPR : scopedNf === 'ES' ? totalES : grandTotal;
  const totalCreditApplied = useCredit ? Math.min(mockCredit, effectiveTotalForCredit) : 0;
  const creditRemaining = mockCredit - totalCreditApplied;
  const creditAmountPR = scopedNf === 'ES'
    ? 0
    : scopedNf === 'PR'
      ? totalCreditApplied
      : (grandTotal > 0 ? totalCreditApplied * (totalPR / grandTotal) : 0);
  const creditAmountES = scopedNf === 'PR'
    ? 0
    : scopedNf === 'ES'
      ? totalCreditApplied
      : (grandTotal > 0 ? totalCreditApplied * (totalES / grandTotal) : 0);
  const totalPRAfterCredit = Math.max(0, totalPR - creditAmountPR);
  const totalESAfterCredit = Math.max(0, totalES - creditAmountES);
  const grandTotalAfterCredit = totalPRAfterCredit + totalESAfterCredit;
  const creditAmount = totalCreditApplied; // legacy compat

  /* ── NF helpers ── */
  const getSelectedOptionForNf = (filial: 'PR' | 'ES'): ShippingOption | null => {
    const s = nfState[filial];
    if (s.logisticsType === 'retirada') return { id: 'retirada', carrier: 'Retirada na Oderço', method: 'Maringá-PR', price: 0, days: 0 };
    if (s.logisticsType === 'fob') return getFobOptions(filial).find(o => o.id === s.selectedShipping) || null;
    const cifOpts = filial === 'PR' ? cifOptionsPR : cifOptionsES;
    return cifOpts.find(o => o.id === s.selectedShipping) || null;
  };

  const getLogisticsLabelForNf = (filial: 'PR' | 'ES'): string => {
    const t = nfState[filial].logisticsType;
    if (t === 'cif') return 'CIF';
    if (t === 'fob') return 'FOB';
    return 'Retirada';
  };

  const getPaymentLabelForNf = (filial: 'PR' | 'ES'): string => {
    const m = nfState[filial].paymentMethod;
    if (m === 'transferencia') return 'Transferência / Depósito';
    if (m === 'boleto') return 'Boleto Bancário';
    if (m === 'pix') return 'PIX';
    return '';
  };

  /* ── Validation ── */
  const canProceedFromNf = (filial: 'PR' | 'ES'): boolean => {
    const s = nfState[filial];
    const nfTotalAfter = filial === 'PR' ? totalPRAfterCredit : totalESAfterCredit;
    const creditCoversNf = nfTotalAfter === 0;
    if (creditCoversNf) return s.selectedShipping !== null;
    return s.selectedShipping !== null && s.paymentMethod !== null && s.condicaoPgto !== '';
  };

  /* ── PIX timer ── */
  useEffect(() => {
    if (!showPixModal) return;
    const interval = setInterval(() => {
      setNfState(prev => {
        const pList = (['PR', 'ES'] as const).filter(f => prev[f].paymentMethod === 'pix' && !prev[f].pixPaid && prev[f].pixTimer > 0);
        if (pList.length === 0) return prev;
        const next = { ...prev };
        pList.forEach(f => { next[f] = { ...prev[f], pixTimer: prev[f].pixTimer - 1 }; });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showPixModal]);

  /* ── Shipping load ── */
  const loadShipping = useCallback(() => {
    setIsLoadingCif(true);
    const digits = address.cep.replace(/\D/g, '');
    setTimeout(() => {
      const optsPR = getCifOptions(digits, 'PR');
      const optsES = getCifOptions(digits, 'ES');
      setCifOptionsPR(optsPR);
      setCifOptionsES(optsES);
      setNfState(prev => {
        const next = { ...prev };
        if (prev.PR.logisticsType === 'cif' && (!prev.PR.selectedShipping || !optsPR.find(o => o.id === prev.PR.selectedShipping))) {
          // If PR qualifies for free shipping, default to econômico; otherwise express
          const prFree = subtotalPR >= FREE_SHIPPING_THRESHOLD;
          const prDefault = prFree ? 'cif-economico' : optsPR[0].id;
          next.PR = { ...prev.PR, selectedShipping: prDefault };
        }
        if (prev.ES.logisticsType === 'cif' && (!prev.ES.selectedShipping || !optsES.find(o => o.id === prev.ES.selectedShipping))) {
          const esFree = subtotalES >= FREE_SHIPPING_THRESHOLD;
          const esDefault = esFree ? 'cif-economico' : optsES[0].id;
          next.ES = { ...prev.ES, selectedShipping: esDefault };
        }
        return next;
      });
      setIsLoadingCif(false);
    }, 600);
  }, [address.cep, subtotalPR, subtotalES]);

  useEffect(() => { if (cifOptionsPR.length === 0) loadShipping(); }, []);

  /* ── Scroll to top on every NF step change (after React commits the new render) ── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [nfStep]);

  /* ── Handlers ── */
  const handleLogisticsChange = (filial: 'PR' | 'ES', type: LogisticsType) => {
    let defaultShipping: string | null = null;
    const cifOpts = filial === 'PR' ? cifOptionsPR : cifOptionsES;
    const fobOpts = getFobOptions(filial);
    const nfSub = filial === 'PR' ? subtotalPR : subtotalES;
    const nfFree = nfSub >= FREE_SHIPPING_THRESHOLD;
    if (type === 'cif' && cifOpts.length > 0) {
      // Default to econômico when free shipping is available, otherwise express
      defaultShipping = nfFree ? 'cif-economico' : cifOpts[0].id;
    } else if (type === 'fob') defaultShipping = fobOpts[0].id;
    else if (type === 'retirada') defaultShipping = 'retirada';
    updateNf(filial, { logisticsType: type, selectedShipping: defaultShipping, showMoreCif: false, showMoreFob: false, fobSearch: '' });
  };

  const handlePaymentChange = (filial: 'PR' | 'ES', method: PaymentMethod) => {
    const nfSub = filial === 'PR' ? subtotalPR : subtotalES;
    const valueFiltered = getCondicoesByValue(nfSub);
    let newCond = '';
    if (method === 'transferencia' || method === 'pix') {
      newCond = 'A Vista';
    } else if (method === 'boleto') {
      const opts = valueFiltered.filter(c => c !== 'A Vista');
      const cur = nfState[filial].condicaoPgto;
      newCond = (cur !== 'A Vista' && opts.includes(cur)) ? cur : (opts[0] || '');
    }
    updateNf(filial, { paymentMethod: method, condicaoPgto: newCond });
  };

  /* ── Navigation ── */
  const handleSaveAndContinue = () => {
    if (nfStep === 'review') return;
    const currentFilialIdx = activeFiliaisInCart.indexOf(nfStep as 'PR' | 'ES');
    const nextFilial = activeFiliaisInCart[currentFilialIdx + 1];

    if (nextFilial) {
      // Pre-fill ES with PR defaults if untouched
      if (nfStep === 'PR' && nfState.ES.selectedShipping === null) {
        const valueFilteredES = getCondicoesByValue(subtotalES);
        const availableES = getCondicoesByPayment(nfState.PR.paymentMethod, valueFilteredES);
        const condForES = availableES.includes(nfState.PR.condicaoPgto) ? nfState.PR.condicaoPgto : (availableES[0] || '');
        updateNf('ES', {
          logisticsType: nfState.PR.logisticsType,
          selectedShipping: nfState.PR.selectedShipping,
          paymentMethod: nfState.PR.paymentMethod,
          condicaoPgto: condForES,
        });
      }
      setNfStep(nextFilial as NfStep);
    } else {
      setNfStep('review');
    }
  };

  const handleBack = () => {
    if (nfStep === 'review') {
      const lastFilial = activeFiliaisInCart[activeFiliaisInCart.length - 1];
      setNfStep(lastFilial);
      return;
    }
    const currentFilialIdx = activeFiliaisInCart.indexOf(nfStep as 'PR' | 'ES');
    if (currentFilialIdx <= 0) {
      navigate('/carrinho');
    } else {
      setNfStep(activeFiliaisInCart[currentFilialIdx - 1] as NfStep);
    }
  };

  const handleGoToStep = (step: NfStep) => {
    setNfStep(step);
  };

  /* ── Finalize ── */
  const getFinalPaymentMethodForNf = (filial: 'PR' | 'ES') => {
    const nfTotalAfterCredit = filial === 'PR' ? totalPRAfterCredit : totalESAfterCredit;
    const selectedMethod = nfState[filial].paymentMethod || 'transferencia';
    return useCredit && nfTotalAfterCredit === 0 ? 'credito' : selectedMethod;
  };

  const buildSuccessState = () => ({
    hasMultipleOrigins,
    useCreditEnabled: useCredit,
    creditAmount,
    grandTotal: grandTotalAfterCredit,
    subtotalPR, subtotalES,
    wantConsultor,
    nfPR: itemsPR.length > 0 ? { paymentMethod: getFinalPaymentMethodForNf('PR'), condicaoPgto: nfState.PR.condicaoPgto, shippingPrice: shippingPricePR, total: totalPRAfterCredit, totalBeforeCredit: totalPR, creditApplied: creditAmountPR, pixPaid: nfState.PR.pixPaid, subtotal: subtotalPR } : null,
    nfES: itemsES.length > 0 ? { paymentMethod: getFinalPaymentMethodForNf('ES'), condicaoPgto: nfState.ES.condicaoPgto, shippingPrice: shippingPriceES, total: totalESAfterCredit, totalBeforeCredit: totalES, creditApplied: creditAmountES, pixPaid: nfState.ES.pixPaid, subtotal: subtotalES } : null,
  });

  const handleFinalize = () => {
    // Reset pixPaid so the SuccessPage shows PIX-pending NFs as "aguardando pagamento"
    setNfState(prev => {
      const next = { ...prev };
      activeFiliaisInCart.filter(f => prev[f].paymentMethod === 'pix').forEach(f => {
        next[f] = { ...prev[f], pixPaid: false, pixTimer: 900 };
      });
      return next;
    });

    /* Build success state, mark NF(s) completed in cart context, navigate.
       markNfCompleted strips the NF's items from the cart — when user returns
       to /carrinho, only the still-pending NFs remain. */
    const successState = buildSuccessState();
    const finalizedOrders: { nf: 'PR' | 'ES'; orderNumber: string; total: number; paymentLabel: string }[] = [];

    activeFiliaisInCart.forEach(f => {
      const nfData = f === 'PR' ? successState.nfPR : successState.nfES;
      if (!nfData) return;
      const orderNumber = generateOrderNumber();
      const paymentLabel =
        nfData.paymentMethod === 'credito' ? 'Crédito Depósito' :
        nfData.paymentMethod === 'pix' ? 'PIX' :
        nfData.paymentMethod === 'boleto' ? 'Boleto' :
        nfData.paymentMethod === 'transferencia' ? 'Transferência' : 'Pagamento';
      markNfCompleted({
        nf: f,
        orderNumber,
        total: nfData.total,
        paymentMethod: paymentLabel,
      });
      finalizedOrders.push({ nf: f, orderNumber, total: nfData.total, paymentLabel });
    });

    navigate('/sucesso', { state: { ...successState, scopedNf, finalizedOrders } });
  };

  /* ── Empty cart ── */
  if (items.length === 0) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-6" style={{ background: 'var(--background)' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
        <span className="block" style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)' }}>Seu carrinho está vazio</span>
        <button onClick={() => navigate('/')} className="h-11 px-8 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
          Continuar Comprando
        </button>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     RENDER: INFO BLOCK (read-only)
  ═══════════════════════════════════════════════════════════ */
  const renderInfoBlock = () => (
    <div className="rounded-xl px-5 py-4 flex items-start gap-4"
      style={{ background: 'var(--card)', border: '1px solid var(--muted)' }}>
      {/* Icon */}
      <div className="w-[38px] h-[38px] rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: 'var(--primary-surface-md)' }}>
        <UserIcon />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="block" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            Informações
          </span>
          <button
            className="bg-transparent border-none cursor-pointer p-0 hover:opacity-70 transition-opacity"
            style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-semibold)', textDecoration: 'underline' }}
          >
            Editar
          </button>
        </div>
        <span className="block mb-3" style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-semibold)' }}>
          {contact.name}
        </span>
        <div className="flex flex-wrap gap-x-5 gap-y-0.5 mb-1.5">
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            CNPJ: {formatCpfCnpj(contact.cpfCnpj)}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            {contact.email}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            {formatPhone(contact.phone)}
          </span>
        </div>
        <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: '1.5' }}>
          {address.street}{address.number ? `, ${address.number}` : ''}{address.complement ? ` – ${address.complement}` : ''}{address.neighborhood ? `, ${address.neighborhood}` : ''}{address.city ? ` · ${address.city}` : ''} – {address.state} · CEP {formatCep(address.cep)}
        </span>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════
     RENDER: SHIPPING BLOCK (Bloco 2)
  ═══════════════════════════════════════════════════════════ */
  const renderShippingBlock = (filial: 'PR' | 'ES') => {
    const s = nfState[filial];
    const nfStyle = NF_STYLE[filial];
    const nfSub = filial === 'PR' ? subtotalPR : subtotalES;
    const freeShip = nfSub >= FREE_SHIPPING_THRESHOLD;
    // When free shipping is active, put econômico first so it's highlighted at the top
    const rawCifOptions = filial === 'PR' ? cifOptionsPR : cifOptionsES;
    const cifOptions = freeShip
      ? [...rawCifOptions].sort((a, b) =>
          a.id === 'cif-economico' ? -1 : b.id === 'cif-economico' ? 1 : 0
        )
      : rawCifOptions;
    const fobOptions = getFobOptions(filial);
    const filteredFob = s.fobSearch.trim()
      ? fobOptions.filter(o => o.carrier.toLowerCase().includes(s.fobSearch.toLowerCase()) || (o.code || '').includes(s.fobSearch))
      : fobOptions;

    return (
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--muted)' }}>
        <div className="p-5 md:p-6">
        <BlockHeading
          icon={<LogisticsBlockIcon size={18} />}
          title="Logística e Frete"
          subtitle={`Entrega para CEP ${formatCep(address.cep)} — ${address.city}, ${address.state}`}
        />

        {/* Logistics type selector */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          {([
            { id: 'cif' as const, label: 'CIF', desc: 'Frete por nossa conta', icon: <CifStoreIcon size={18} /> },
            { id: 'fob' as const, label: 'FOB', desc: 'Frete por sua conta', icon: <FobIcon /> },
            { id: 'retirada' as const, label: 'Retirada', desc: 'No CD Maringá', icon: <WarehouseIcon /> },
          ]).map((t) => {
            const active = s.logisticsType === t.id;
            return (
              <button key={t.id} onClick={() => handleLogisticsChange(filial, t.id)}
                className="relative flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-150"
                style={{
                  border: active ? '1.5px solid var(--primary)' : '1px solid var(--muted)',
                  background: 'var(--card)',
                  fontFamily: 'var(--font-red-hat-display)',
                }}>
                {active && (
                  <span className="absolute top-2 right-2 rounded-full flex items-center justify-center"
                    style={{ width: 16, height: 16, background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                )}
                {t.icon}
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: active ? 'var(--primary)' : 'var(--foreground)' }}>{t.label}</span>
                <span className="hidden sm:inline" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', textAlign: 'center' }}>{t.desc}</span>
              </button>
            );
          })}
        </div>

        {/* CIF options */}
        {s.logisticsType === 'cif' && (
          isLoadingCif ? (
            <div className="flex items-center justify-center py-10 gap-3">
              <div className="w-6 h-6 rounded-full animate-spin" style={{ border: '2px solid var(--muted)', borderTopColor: nfStyle.color }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Calculando opções de frete...</span>
            </div>
          ) : (
            <div>
              <span className="block mb-3" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Opções recomendadas
              </span>
              <div className="flex flex-col gap-2.5">
                {cifOptions.slice(0, 2).map(opt => (
                  <ShippingCard key={opt.id} option={opt} isSelected={s.selectedShipping === opt.id}
                    onClick={() => updateNf(filial, { selectedShipping: opt.id })} hasFreeShipping={freeShip}
                    nfColor={nfStyle.color} nfSurface={nfStyle.surface} nfBorderSm={nfStyle.borderSm} />
                ))}
              </div>
              {cifOptions.length > 2 && !s.showMoreCif && (
                <button onClick={() => updateNf(filial, { showMoreCif: true })} className="mt-3 bg-transparent border-none cursor-pointer p-0 flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                  style={{ color: nfStyle.color, fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  Ver mais {cifOptions.length - 2} opções
                </button>
              )}
              {s.showMoreCif && (
                <div className="mt-3 flex flex-col gap-2.5">
                  <div className="h-px w-full" style={{ background: 'var(--muted)' }} />
                  <span className="block mb-1" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>Outras opções</span>
                  {cifOptions.slice(2).map(opt => (
                    <ShippingCard key={opt.id} option={opt} isSelected={s.selectedShipping === opt.id}
                      onClick={() => updateNf(filial, { selectedShipping: opt.id })} hasFreeShipping={freeShip}
                      nfColor={nfStyle.color} nfSurface={nfStyle.surface} nfBorderSm={nfStyle.borderSm} />
                  ))}
                  <button onClick={() => updateNf(filial, { showMoreCif: false })} className="mt-1 bg-transparent border-none cursor-pointer p-0 flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                    style={{ color: nfStyle.color, fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                    Ver menos
                  </button>
                </div>
              )}
            </div>
          )
        )}

        {/* FOB options */}
        {s.logisticsType === 'fob' && (
          <div>
            <div className="rounded-lg p-3.5 mb-4" style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
              <div className="flex items-start gap-2.5">
                <InfoIcon />
                <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: '1.6' }}>
                  No frete <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>FOB</span>, você escolhe a transportadora e o frete é por sua conta.
                </span>
              </div>
            </div>
            <span className="block mb-3" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Principais transportadoras</span>
            <div className="flex flex-col gap-2.5">
              {fobOptions.slice(0, 3).map(opt => (
                <ShippingCard key={opt.id} option={opt} isSelected={s.selectedShipping === opt.id}
                  onClick={() => updateNf(filial, { selectedShipping: opt.id })} showPrice={false}
                  nfColor={nfStyle.color} nfSurface={nfStyle.surface} nfBorderSm={nfStyle.borderSm} />
              ))}
            </div>
            {!s.showMoreFob && (
              <button onClick={() => updateNf(filial, { showMoreFob: true })} className="mt-3 bg-transparent border-none cursor-pointer p-0 flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                style={{ color: nfStyle.color, fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                Ver mais {fobOptions.length - 3} transportadoras
              </button>
            )}
            {s.showMoreFob && (
              <div className="mt-4">
                <div className="h-px w-full mb-4" style={{ background: 'var(--muted)' }} />
                <span className="block mb-3" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                  Todas as transportadoras ({fobOptions.length})
                </span>
                <div className="relative mb-3">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }}><SearchIcon /></div>
                  <input type="text" placeholder="Buscar por nome ou código..." value={s.fobSearch}
                    onChange={(e) => updateNf(filial, { fobSearch: e.target.value })}
                    className="w-full h-[40px] rounded-lg pl-10 pr-3 outline-none"
                    style={{ border: '1px solid var(--muted)', background: 'var(--input-background)', fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--muted)'; }} />
                </div>
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto rounded-lg p-1">
                  {filteredFob.length === 0 ? (
                    <span className="block py-6 text-center" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>Nenhuma transportadora encontrada</span>
                  ) : filteredFob.map(opt => (
                    <ShippingCard key={opt.id} option={opt} isSelected={s.selectedShipping === opt.id}
                      onClick={() => updateNf(filial, { selectedShipping: opt.id })} showPrice={false}
                      nfColor={nfStyle.color} nfSurface={nfStyle.surface} nfBorderSm={nfStyle.borderSm} />
                  ))}
                </div>
                <button onClick={() => updateNf(filial, { showMoreFob: false, fobSearch: '' })} className="mt-3 bg-transparent border-none cursor-pointer p-0 flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                  style={{ color: nfStyle.color, fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                  Ver menos
                </button>
              </div>
            )}
          </div>
        )}

        {/* Retirada */}
        {s.logisticsType === 'retirada' && (
          <div className="rounded-xl p-5" style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
            <div className="flex items-start gap-4">
              <div className="w-[48px] h-[48px] rounded-xl flex items-center justify-center shrink-0" style={{ background: nfStyle.surfaceMd }}>
                <WarehouseIcon />
              </div>
              <div>
                <span className="block mb-1" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>Centro de Distribuição Oderço</span>
                <span className="block mb-2" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: '1.6' }}>
                  Av. Paranavaí, 1906 - Parque Industrial Bandeirantes<br />Maringá - PR · CEP 87070-130
                </span>
                <span className="block mb-3" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                  Seg a Sex: 08h - 18h · Sáb: 08h - 12h
                </span>
                <span className="inline-block rounded-md px-2.5 py-1" style={{ background: 'var(--primary-surface-lg)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary)' }}>
                  GRÁTIS
                </span>
              </div>
            </div>
          </div>
        )}
        </div>{/* end p-5 md:p-6 */}
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER: CREDIT BLOCK (above Payment)
     Duas fontes combináveis: usuário marca uma ou ambas (checkboxes).
     Cada fonte usa o valor TOTAL disponível quando ativada.
  ═══════════════════════════════════════════════════════════ */
  const renderCreditBlock = () => {
    const creditCoversAll = grandTotalAfterCredit === 0 && useCredit;
    const bothSelected = creditSources.rma && creditSources.deposito;

    type CreditOption = { key: 'rma' | 'deposito'; label: string; sub: string; amount: number };
    const options: CreditOption[] = [
      { key: 'rma',      label: 'RMA',              sub: 'Devolução de mercadoria', amount: mockRMA },
      { key: 'deposito', label: 'Crédito Depósito', sub: 'Saldo em conta',          amount: mockDeposito },
    ];

    const toggleSource = (key: 'rma' | 'deposito') => {
      setCreditSources(prev => ({ ...prev, [key]: !prev[key] }));
    };
    const clearAll = () => setCreditSources({ rma: false, deposito: false });

    return (
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: useCredit ? 'var(--primary-surface-xs)' : 'var(--card)',
          border: useCredit ? '1px solid var(--primary-border-sm)' : '1px solid var(--muted)',
          transition: 'all 0.22s',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3">
          <div
            className="w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0"
            style={{ background: useCredit ? 'var(--primary-surface-lg)' : 'var(--primary-surface-md)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="var(--primary)"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
              Usar crédito disponível
            </span>
            <span className="block" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
              Selecione uma ou ambas as fontes — somam-se ao desconto
            </span>
          </div>
          {useCredit && (
            <button
              onClick={clearAll}
              className="bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm"
              style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px', outlineColor: 'var(--primary)' }}
              aria-label="Remover todos os créditos aplicados"
            >
              LIMPAR
            </button>
          )}
        </div>

        {/* Options — 2 cards checkbox-style (multi-select) */}
        <div
          role="group"
          aria-label="Fontes de crédito"
          className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        >
          {options.map((opt) => {
            const isSelected = creditSources[opt.key];
            return (
              <button
                key={opt.key}
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                onClick={() => toggleSource(opt.key)}
                className="rounded-lg cursor-pointer transition-all text-left flex items-start gap-2.5 p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  background: isSelected ? 'var(--primary-surface-md)' : 'var(--card)',
                  border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--muted)'}`,
                  outlineColor: 'var(--primary)',
                }}
              >
                <span
                  className="flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                  style={{
                    width: 18, height: 18,
                    borderRadius: 4,
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--muted-foreground)'}`,
                    background: isSelected ? 'var(--primary)' : 'var(--card)',
                  }}
                  aria-hidden="true"
                >
                  {isSelected && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="block" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px', textTransform: 'uppercase', fontWeight: 'var(--font-weight-bold)' }}>
                    {opt.label}
                  </span>
                  <span className="block mt-0.5" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: isSelected ? 'var(--primary)' : 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
                    {formatCurrency(opt.amount)}
                  </span>
                  <span className="block mt-0.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                    {opt.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Expanded: applied details */}
        <AnimatePresence>
          {useCredit && (
            <motion.div
              key="credit-expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div className="px-5 pb-4 flex flex-col gap-1.5" style={{ borderTop: '1px solid var(--primary-border-xs)' }}>
                {/* Breakdown por fonte quando ambas ativas */}
                {bothSelected && (
                  <>
                    <div className="flex items-center justify-between pt-3" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      <span>· RMA</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>− {formatCurrency(Math.min(mockRMA, grandTotal))}</span>
                    </div>
                    <div className="flex items-center justify-between" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      <span>· Crédito Depósito</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>− {formatCurrency(Math.max(0, totalCreditApplied - Math.min(mockRMA, grandTotal)))}</span>
                    </div>
                  </>
                )}
                <div className={`flex items-center justify-between ${bothSelected ? 'pt-1.5 mt-1' : 'pt-3'}`}
                  style={bothSelected ? { borderTop: '1px dashed var(--primary-border-xs)' } : {}}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-semibold)' }}>
                    {creditLabel} aplicado
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)' }}>
                    − {formatCurrency(totalCreditApplied)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                    Saldo restante
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-semibold)' }}>
                    {formatCurrency(creditRemaining)}
                  </span>
                </div>
                {creditCoversAll && (
                  <div className="mt-1 rounded-lg px-3 py-2.5 flex items-center gap-2"
                    style={{ background: 'var(--success-surface)', border: '1px solid color-mix(in srgb, var(--success) 25%, transparent)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-semibold)' }}>
                      Crédito cobre o valor total — pagamento não necessário
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER: PAYMENT BLOCK (Bloco 3)
  ═══════════════════════════════════════════════════════════ */
  const renderPaymentBlock = (filial: 'PR' | 'ES') => {
    const s = nfState[filial];
    const nfStyle = NF_STYLE[filial];
    const nfSub = filial === 'PR' ? subtotalPR : subtotalES;
    const nfTotalAfter = filial === 'PR' ? totalPRAfterCredit : totalESAfterCredit;
    const creditCoversNf = useCredit && nfTotalAfter === 0;
    const valueFiltered = getCondicoesByValue(nfSub);
    const available = getCondicoesByPayment(s.paymentMethod, valueFiltered);
    const locked = s.paymentMethod === 'transferencia' || s.paymentMethod === 'pix';

    // Credit covers this NF entirely — no payment needed
    if (creditCoversNf) return null;

    return (
      <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: 'var(--card)', border: '1px solid var(--muted)' }}>
      <div className="p-5 md:p-6 flex flex-col gap-5">
        <BlockHeading
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>}
          title="Forma de Pagamento"
          subtitle="Selecione como este pedido será pago"
        />

        {/* Payment method cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {([
            { id: 'transferencia' as const, label: 'Transferência / Depósito', icon: <TransferenciaIcon />, desc: 'TED ou DOC' },
            { id: 'boleto' as const, label: 'Boleto Bancário', icon: <BoletoIcon />, desc: 'Compensação em 3 dias' },
            { id: 'pix' as const, label: 'PIX', icon: <PixIcon />, desc: 'Pagamento instantâneo' },
          ]).map(m => {
            const sel = s.paymentMethod === m.id;
            return (
              <button key={m.id} onClick={() => handlePaymentChange(filial, m.id)}
                className="relative flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all duration-150"
                style={{
                  border: sel ? '1.5px solid var(--primary)' : '1px solid var(--muted)',
                  background: 'var(--card)',
                  fontFamily: 'var(--font-red-hat-display)',
                }}>
                {sel && (
                  <span className="absolute top-2 right-2 rounded-full flex items-center justify-center"
                    style={{ width: 16, height: 16, background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                )}
                {m.icon}
                <span className="text-center" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: sel ? 'var(--primary)' : 'var(--foreground)' }}>{m.label}</span>
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>{m.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Payment detail expansion */}
        <AnimatePresence mode="wait">
          {s.paymentMethod && (
            <motion.div key={s.paymentMethod}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex flex-col gap-4">

              {/* Transferência details */}
              {s.paymentMethod === 'transferencia' && (
                <div className="rounded-xl p-4" style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-[40px] h-[40px] rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--primary-surface-md)' }}>
                      <TransferenciaIcon />
                    </div>
                    <div className="flex-1">
                      <span className="block mb-3" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>Dados para Transferência / Depósito</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { label: 'Banco', value: 'Banco do Brasil (001)' },
                          { label: 'Agência / Conta', value: 'Ag. 3476-2 · CC 12.345-6' },
                        ].map(row => (
                          <div key={row.label} className="rounded-lg p-3" style={{ background: 'var(--card)', border: '1px solid var(--muted)' }}>
                            <span className="block mb-0.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>{row.label}</span>
                            <span className="block" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>{row.value}</span>
                          </div>
                        ))}
                        <div className="rounded-lg p-3 sm:col-span-2" style={{ background: 'var(--card)', border: '1px solid var(--muted)' }}>
                          <span className="block mb-0.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>Favorecido / CNPJ</span>
                          <span className="block" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>Oderço Distribuidora Ltda · 09.301.845/0001-91</span>
                        </div>
                      </div>
                      <span className="block mt-3 flex items-center gap-1.5" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                        <InfoIcon /> Envie o comprovante para contato@oderco.com.br
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Boleto details */}
              {s.paymentMethod === 'boleto' && (
                <div className="rounded-xl p-4" style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-[40px] h-[40px] rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--primary-surface-md)' }}>
                      <BoletoIcon />
                    </div>
                    <div>
                      <span className="block mb-2" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>Boleto Bancário</span>
                      <span className="block mb-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: '1.6' }}>
                        O boleto será gerado após a confirmação do pedido. Compensação em até 3 dias úteis.
                      </span>
                      <span className="block mb-2" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                        Email: <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{contact.email || 'não informado'}</span>
                      </span>
                      {hasMultipleOrigins && (
                        <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--warning)', fontFamily: 'var(--font-red-hat-display)', lineHeight: '1.5' }}>
                          · Serão gerados 2 boletos separados — um por NF (Paraná e Espírito Santo).
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PIX details */}
              {s.paymentMethod === 'pix' && (
                <div className="rounded-xl p-4" style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-[40px] h-[40px] rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--primary-surface-md)' }}>
                      <PixIcon />
                    </div>
                    <div>
                      <span className="block mb-2" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>Pagamento via PIX</span>
                      <span className="block mb-2" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: '1.6' }}>
                        Ao finalizar a compra, um QR Code será gerado para pagamento imediato. O pedido é confirmado automaticamente após a compensação.
                      </span>
                      <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--warning)', fontFamily: 'var(--font-red-hat-display)', lineHeight: '1.5' }}>
                        · Após o pagamento, o pedido <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>não poderá ser reaberto ou modificado</span>.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Condição de Pagamento */}
              <div className="rounded-xl p-5" style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <CalendarIcon />
                  <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                    Condição de Pagamento
                  </span>
                </div>
                {locked ? (
                  <>
                    <label className="block mb-1.5" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      Condição Pgto <LockIcon />
                    </label>
                    <div className="w-full sm:w-[340px] h-[44px] flex items-center px-4 rounded-lg"
                      style={{ border: '1px solid var(--muted)', background: 'var(--background)', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', cursor: 'not-allowed' }}>
                      A Vista
                    </div>
                    <span className="block mt-2" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      {s.paymentMethod === 'pix' ? 'PIX é sempre à vista' : 'Transferência/Depósito é sempre à vista'}
                    </span>
                  </>
                ) : (
                  <>
                    <label className="block mb-1.5" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      Condição Pgto <span style={{ color: 'var(--destructive-foreground)' }}>*</span>
                    </label>
                    <SingleSelectDropdown value={s.condicaoPgto} options={available}
                      onChange={(v) => updateNf(filial, { condicaoPgto: v })} placeholder="Selecione a condição de pagamento" />
                    {s.condicaoPgto && s.condicaoPgto.includes('/') && (
                      <span className="block mt-2" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                        Parcelas em {s.condicaoPgto.split('/').length}x
                      </span>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* (credit block is now rendered separately, above payment) */}
      </div>{/* end p-5 md:p-6 */}
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER: OBSERVATIONS BLOCK (Bloco 4 — collapsed)
  ═══════════════════════════════════════════════════════════ */
  const renderObsBlock = (filial: 'PR' | 'ES') => {
    const isOpen = obsExpanded[filial];
    const s = nfState[filial];

    return (
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--muted)' }}>
        <button
          onClick={() => setObsExpanded(prev => ({ ...prev, [filial]: !prev[filial] }))}
          className="w-full flex items-center justify-between px-5 py-4 bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
          style={{ fontFamily: 'var(--font-red-hat-display)' }}>
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'var(--primary-surface-sm)' }}>
              <NoteIcon />
            </div>
            <div className="text-left">
              {s.obsVenda || s.obsNF ? (
                <span className="block" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                  Observações
                  <span className="ml-2 inline-flex items-center justify-center rounded-full px-2"
                    style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', background: 'var(--primary)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-red-hat-display)', verticalAlign: 'middle' }}>
                    preenchidas
                  </span>
                </span>
              ) : (
                <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: isOpen ? 'var(--foreground)' : 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                  {isOpen ? 'Observações' : '+ Adicionar observações (opcional)'}
                </span>
              )}
              {!isOpen && (s.obsVenda || s.obsNF) && (
                <span className="block mt-0.5" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                  Clique para editar
                </span>
              )}
            </div>
          </div>
          <div style={{ color: 'var(--muted-foreground)' }}>
            <ChevronDownIcon open={isOpen} />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="obs-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}>
              <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--muted)' }}>
                <div className="pt-5 flex flex-col gap-5">
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      Observação do Pedido de Venda
                      <span className="ml-1" style={{ fontWeight: 'var(--font-weight-normal)', color: 'var(--muted-foreground)' }}>(interno)</span>
                    </label>
                    <textarea
                      value={s.obsVenda}
                      onChange={(e) => updateNf(filial, { obsVenda: e.target.value })}
                      placeholder="Observações internas que não aparecerão na nota fiscal..."
                      className="w-full rounded-xl px-3.5 py-3 outline-none resize-y"
                      style={{ border: '1px solid var(--muted)', background: 'var(--input-background)', fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', minHeight: 80 }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--muted)'; }}
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      Observação para a Nota Fiscal
                    </label>
                    <textarea
                      value={s.obsNF}
                      onChange={(e) => updateNf(filial, { obsNF: e.target.value })}
                      placeholder="Texto que aparecerá impresso na Nota Fiscal..."
                      className="w-full rounded-xl px-3.5 py-3 outline-none resize-y"
                      style={{ border: '1px solid var(--muted)', background: 'var(--input-background)', fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', minHeight: 80 }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--muted)'; }}
                    />
                    <span className="block mt-1.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      Este texto será impresso no campo de observações da Nota Fiscal eletrônica (NF-e).
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER: NF SIDEBAR
  ═══════════════════════════════════════════════════════════ */
  const renderNfSidebar = (filial: 'PR' | 'ES') => {
    const sidebarItems = filial === 'PR' ? itemsPR : itemsES;
    const sidebarSubtotal = filial === 'PR' ? subtotalPR : subtotalES;
    const sidebarShipping = getShippingPriceForNf(filial);
    const sidebarRawTotal = sidebarSubtotal + sidebarShipping;
    const sidebarCreditApplied = filial === 'PR' ? creditAmountPR : creditAmountES;
    const sidebarTotal = filial === 'PR' ? totalPRAfterCredit : totalESAfterCredit;
    const nfStyle = NF_STYLE[filial];
    const nfLabel = filial === 'PR' ? 'Filial PR' : 'Filial ES';
    const otherFilial = filial === 'PR' ? 'ES' : 'PR';
    const otherLabel = filial === 'PR' ? 'Filial ES' : 'Filial PR';

    return (
      <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 order-first lg:order-last">
        <div className="lg:sticky lg:top-5 flex flex-col gap-3">

          {/* Completed NF PR — collapsible summary card (shown on ES step) */}
          {hasMultipleOrigins && filial === 'ES' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
              className="rounded-xl overflow-hidden"
              style={{ background: 'var(--card)', border: '1px solid var(--muted)' }}>

              {/* Header row — always visible */}
              <button
                className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setPrCardExpanded(v => !v)}
                style={{ fontFamily: 'var(--font-red-hat-display)' }}>
                <div className="flex items-center gap-2 min-w-0">
                  {/* Check badge */}
                  <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'var(--success)', color: 'var(--success-foreground)' }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                    Filial PR — configurada
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}>
                    · {formatCurrency(totalPRAfterCredit)}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleGoToStep('PR'); }}
                    className="bg-transparent border-none cursor-pointer p-0 hover:opacity-70 transition-opacity"
                    style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary)', fontFamily: 'var(--font-red-hat-display)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                    Editar
                  </button>
                  <ChevronDownIcon open={prCardExpanded} />
                </div>
              </button>

              {/* Expandable detail */}
              <AnimatePresence>
                {prCardExpanded && (
                  <motion.div
                    key="pr-card-detail"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{ overflow: 'hidden' }}>
                    <div className="px-4 pb-4 pt-1 flex flex-col gap-1.5" style={{ borderTop: '1px solid var(--muted)' }}>
                      <div className="flex items-center gap-2 pt-2">
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', minWidth: 60 }}>Frete</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-semibold)' }}>
                          {getLogisticsLabelForNf('PR')} · {getSelectedOptionForNf('PR')?.carrier || '—'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', minWidth: 60 }}>Pagamento</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-semibold)' }}>
                          {getPaymentLabelForNf('PR')}{nfState.PR.condicaoPgto ? ` · ${nfState.PR.condicaoPgto}` : ''}
                        </span>
                      </div>
                      {shippingPricePR > 0 && (
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', minWidth: 60 }}>Frete valor</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>{formatCurrency(shippingPricePR)}</span>
                        </div>
                      )}
                      {creditAmountPR > 0 && (
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', minWidth: 60 }}>Crédito</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-semibold)' }}>
                            − {formatCurrency(creditAmountPR)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-1.5 mt-0.5" style={{ borderTop: '1px solid var(--muted)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>Total Filial PR</span>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: creditAmountPR > 0 ? 'var(--success)' : 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                          {formatCurrency(totalPRAfterCredit)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Current NF order summary — clean white card, sem tinted bg */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--muted)', boxShadow: 'var(--elevation-sm)' }}>
            {/* Header */}
            <div className="px-4 py-3.5 flex items-center gap-2.5" style={{ borderBottom: '1px solid var(--muted)' }}>
              <NfBadge filial={filial} />
              <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                Resumo {nfLabel}
              </span>
              <span className="ml-auto" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                {sidebarItems.length} {sidebarItems.length === 1 ? 'item' : 'itens'}
              </span>
            </div>

            {/* Items list */}
            <div className="max-h-[320px] overflow-y-auto">
              {sidebarItems.map(item => (
                <div key={item.id} className="px-4 py-3.5 flex items-start gap-3.5" style={{ borderBottom: `1px solid ${nfStyle.border}` }}>
                  {/* Product image — fills the card */}
                  <div className="w-[52px] h-[52px] rounded-xl overflow-hidden shrink-0"
                    style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><PackageIcon /></div>
                    )}
                  </div>

                  {/* Info + price */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between" style={{ minHeight: 52 }}>
                    <span className="block" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.name}
                    </span>
                    <div className="flex items-end justify-between gap-2 mt-1.5">
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                        {item.quantity} {item.unitType} × {formatCurrency(item.price)}
                      </span>
                      <span className="shrink-0" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-4 pt-3.5 pb-4 flex flex-col gap-2.5" style={{ borderTop: `1px solid ${nfStyle.border}` }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>Subtotal</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>{formatCurrency(sidebarSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>Frete</span>
                {nfState[filial].selectedShipping === null ? (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontStyle: 'italic' }}>A calcular</span>
                ) : nfState[filial].logisticsType === 'fob' ? (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>Por conta do comprador</span>
                ) : sidebarShipping === 0 ? (
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary)', fontFamily: 'var(--font-red-hat-display)' }}>GRÁTIS</span>
                ) : (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>{formatCurrency(sidebarShipping)}</span>
                )}
              </div>
              <div className="h-px w-full" style={{ background: 'var(--muted)' }} />
              {sidebarCreditApplied > 0 && (
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Crédito Depósito
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)' }}>
                    − {formatCurrency(sidebarCreditApplied)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-0.5">
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                  Total {nfLabel}
                </span>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: sidebarCreditApplied > 0 ? 'var(--success)' : nfStyle.color, fontFamily: 'var(--font-red-hat-display)' }}>
                  {formatCurrency(sidebarTotal)}
                </span>
              </div>
            </div>

            {/* Next NF hint (only on PR step when multiple origins) */}
            {hasMultipleOrigins && filial === 'PR' && (() => {
              const otherItems = itemsES;
              const otherQty = otherItems.reduce((s, i) => s + i.quantity, 0);
              const otherSubtotal = subtotalES;
              return (
                <div className="px-4 py-3.5" style={{ borderTop: `1px solid ${nfStyle.border}`, background: 'var(--background)' }}>
                  <div className="flex items-start gap-2.5">
                    <div className="w-[20px] h-[20px] rounded flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'var(--nf-es)', opacity: 0.55 }}>
                      <span style={{ fontSize: '9px', color: 'var(--nf-es-fg)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>ES</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--nf-es)', fontFamily: 'var(--font-red-hat-display)', opacity: 0.7 }}>
                        Filial ES
                      </span>
                      <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: '1.4' }}>
                        {otherQty} {otherQty === 1 ? 'item' : 'itens'} · {formatCurrency(otherSubtotal)} · será configurada no próximo passo
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Progress checklist */}
          <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: `1px solid ${nfStyle.border}` }}>
            {/* Title row with NF badge */}
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                {hasMultipleOrigins ? 'Progresso' : 'Progresso do pedido'}
              </span>
              {hasMultipleOrigins && (
                <>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>·</span>
                  <NfBadge filial={filial} small />
                </>
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Logística e Frete', done: nfState[filial].selectedShipping !== null },
                { label: 'Forma de Pagamento', done: nfState[filial].paymentMethod !== null },
                { label: 'Condição de Pagamento', done: nfState[filial].condicaoPgto !== '' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  {item.done ? (
                    /* Filled check — NF color */
                    <div
                      className="w-[16px] h-[16px] rounded-full flex items-center justify-center shrink-0"
                      style={{ background: nfStyle.color }}
                    >
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : (
                    /* Empty ring */
                    <div
                      className="w-[16px] h-[16px] rounded-full border-2 shrink-0"
                      style={{ borderColor: 'var(--muted)' }}
                    />
                  )}
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    color: item.done ? nfStyle.color : 'var(--muted-foreground)',
                    fontFamily: 'var(--font-red-hat-display)',
                    fontWeight: item.done ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER: REVIEW STEP
  ═══════════════════════════════════════════════════════════ */
  const renderReviewStep = () => {
    /* Scoped totals — review screen finalizes ONLY activeFiliaisInCart NFs.
       In single-NF mode (?nf=PR), all sidebar values must reflect that scope only. */
    const scopedSubtotal       = activeFiliaisInCart.reduce((s, f) => s + (f === 'PR' ? subtotalPR : subtotalES), 0);
    const scopedShipping       = activeFiliaisInCart.reduce((s, f) => s + (f === 'PR' ? shippingPricePR : shippingPriceES), 0);
    const scopedCreditApplied  = activeFiliaisInCart.reduce((s, f) => s + (f === 'PR' ? creditAmountPR  : creditAmountES),  0);
    const scopedTotal          = activeFiliaisInCart.reduce((s, f) => s + (f === 'PR' ? totalPR        : totalES),        0);
    const scopedTotalAfterCred = activeFiliaisInCart.reduce((s, f) => s + (f === 'PR' ? totalPRAfterCredit : totalESAfterCredit), 0);
  const couponDiscount = scopedTotalAfterCred * couponPct;
  const finalTotalAfterAll = Math.max(0, scopedTotalAfterCred - couponDiscount);

    return (
    <div style={{ background: 'var(--background)', fontFamily: 'var(--font-red-hat-display)' }}>
      {/* Page header — compact navy band */}
      <div className="relative overflow-hidden" style={{ background: 'var(--foreground)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at center, var(--primary-foreground) 1px, transparent 1.5px)', backgroundSize: '22px 22px' }} />
        <div className="relative max-w-[1200px] mx-auto px-4 md:px-6 pt-7 pb-10 text-center">
          <MainStepIndicator currentNfStep="review" />
          <div className="mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1"
            style={{ background: 'rgba(255,255,255,0.12)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--success)' }} />
            <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '1.5px' }}>
              REVISÃO · ÚLTIMO PASSO
            </span>
          </div>
          <h2 className="m-0 mt-2" style={{ fontSize: 'clamp(22px, 3.4vw, 28px)', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.15 }}>
            Confirme seu pedido
          </h2>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8 pt-8 pb-16 px-4 md:px-6">

        {/* Left column: NF cards + footer */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* Consultor notice — visible only when requested */}
          {wantConsultor && (
            <div className="rounded-xl px-5 py-4 flex items-start gap-3"
              style={{ background: 'var(--primary-surface-md)', border: '1px solid var(--primary-border-sm)' }}>
              <span className="rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ width: 36, height: 36, background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                  Seu consultor entrará em contato
                </span>
                <span className="block mt-0.5" style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.5 }}>
                  Após o envio, seu consultor receberá uma notificação e entrará em contato para conversar sobre este pedido antes de processá-lo.
                </span>
              </div>
            </div>
          )}

          {/* NF cards — side by side on lg; centered when single NF */}
          <div className={`grid gap-5 ${activeFiliaisInCart.length > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 w-full'}`}>
            {activeFiliaisInCart.map((f) => {
              const nfItems = f === 'PR' ? itemsPR : itemsES;
              const nfQty = nfItems.reduce((s, i) => s + i.quantity, 0);
              const opt = getSelectedOptionForNf(f);
              const shippingPrice = getShippingPriceForNf(f);
              const nfRawTotal = f === 'PR' ? totalPR : totalES;
              const nfCreditApplied = f === 'PR' ? creditAmountPR : creditAmountES;
              const nfTotal = f === 'PR' ? totalPRAfterCredit : totalESAfterCredit;
              const payLabel = getPaymentLabelForNf(f);
              const ns = NF_STYLE[f];
              const creditCoversThisNf = useCredit && nfTotal === 0;

              const cepFmt = address.cep.replace(/(\d{5})(\d{3})/, '$1-$2');
              const isFreeShip = shippingPrice === 0 && nfState[f].logisticsType !== 'fob';
              const isPickup = nfState[f].logisticsType === 'retirada';
              return (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut', delay: f === 'ES' ? 0.06 : 0 }}
                  className="flex flex-col gap-4"
                >
                  {/* ═══ CARD 1 — Endereço & Frete ═══ */}
                  <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--muted)', boxShadow: 'var(--elevation-sm)' }}>
                    <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid var(--muted)' }}>
                      <span className="rounded-lg flex items-center justify-center shrink-0"
                        style={{ width: 32, height: 32, background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                          <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                      </span>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
                        {isPickup ? 'Retirada' : 'Entrega'}
                      </span>
                      <button
                        onClick={() => handleGoToStep(f)}
                        className="ml-auto flex items-center gap-1 rounded-md px-2.5 h-7 border-none cursor-pointer hover:bg-[var(--primary-surface-xs)] transition-colors"
                        style={{ background: 'transparent', color: 'var(--primary)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
                        <EditIcon /> Editar
                      </button>
                    </div>

                    {/* Endereço / retirada */}
                    <div className="px-5 pt-4 pb-3">
                      <span className="block mb-1" style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        {isPickup ? 'Local de retirada' : 'Endereço de entrega'}
                      </span>
                      <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.4 }}>
                        {isPickup ? 'Centro de Distribuição Oderço' : `${address.street}, ${address.number}${address.complement ? ` — ${address.complement}` : ''}`}
                      </span>
                      <span className="block mt-0.5" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                        {isPickup ? (
                          <>
                            Av. Paranavaí, 1906 · Maringá/PR · CEP <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--foreground)', fontWeight: 'var(--font-weight-bold)' }}>87070-130</span>
                          </>
                        ) : (
                          <>
                            {address.neighborhood} · {address.city}/{address.state} · CEP <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--foreground)', fontWeight: 'var(--font-weight-bold)' }}>{cepFmt}</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Dotted divider */}
                    <div className="mx-5" style={{ height: 1, background: 'repeating-linear-gradient(to right, var(--muted) 0 4px, transparent 4px 8px)' }} />

                    {/* Frete */}
                    <div className="px-5 py-4 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="block mb-0.5" style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                          Modalidade
                        </span>
                        <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                          {isPickup ? 'Retirada no CD Maringá' : `${getLogisticsLabelForNf(f)}${opt ? ` · ${opt.carrier}` : ''}`}
                        </span>
                        {isPickup && (
                          <span className="block mt-0.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                            Seg a Sex: 08h - 18h · Sáb: 08h - 12h
                          </span>
                        )}
                        {!isPickup && opt && opt.days > 0 && (
                          <span className="block mt-0.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                            Entrega em até {opt.days} dias úteis
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 inline-flex items-center rounded-full px-3 py-1"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-bold)',
                          fontFamily: 'var(--font-red-hat-display)',
                          letterSpacing: '0.4px',
                          background: isFreeShip ? 'var(--success-surface)' : 'var(--background)',
                          color: isFreeShip ? 'var(--success)' : 'var(--foreground)',
                          border: `1px solid ${isFreeShip ? 'var(--success)' : 'var(--muted)'}`,
                        }}>
                        {isPickup ? 'RETIRADA' : nfState[f].logisticsType === 'fob' ? 'FOB' : isFreeShip ? 'GRÁTIS' : formatCurrency(shippingPrice)}
                      </span>
                    </div>
                  </div>

                  {/* ═══ CARD 2 — Pagamento ═══ */}
                  <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--muted)', boxShadow: 'var(--elevation-sm)' }}>
                    <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid var(--muted)' }}>
                      <span className="rounded-lg flex items-center justify-center shrink-0"
                        style={{ width: 32, height: 32, background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                      </span>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
                        Pagamento
                      </span>
                      <button
                        onClick={() => handleGoToStep(f)}
                        className="ml-auto flex items-center gap-1 rounded-md px-2.5 h-7 border-none cursor-pointer hover:bg-[var(--primary-surface-xs)] transition-colors"
                        style={{ background: 'transparent', color: 'var(--primary)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
                        <EditIcon /> Editar
                      </button>
                    </div>

                    {creditCoversThisNf ? (
                      <div className="m-5 flex items-center gap-3 rounded-lg px-3 py-2.5"
                        style={{ background: 'var(--success)', color: 'var(--primary-foreground)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}>
                          Pago integralmente por Crédito Depósito
                        </span>
                      </div>
                    ) : (
                      <div className="px-5 py-4 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <span className="block mb-0.5" style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                            Método
                          </span>
                          <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                            {payLabel}
                          </span>
                        </div>
                        <span className="shrink-0 inline-flex items-center rounded-full px-3 py-1"
                          style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '0.4px', background: 'var(--background)', border: '1px solid var(--muted)' }}>
                          {nfState[f].condicaoPgto}
                        </span>
                      </div>
                    )}

                    {/* Obs */}
                    {(nfState[f].obsVenda || nfState[f].obsNF) && (
                      <div className="px-5 pb-4 pt-2" style={{ borderTop: '1px solid var(--muted)' }}>
                        <span className="block mb-1.5" style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                          Observações
                        </span>
                        {nfState[f].obsVenda && (
                          <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.5 }}>
                            <strong>Pedido:</strong> {nfState[f].obsVenda}
                          </span>
                        )}
                        {nfState[f].obsNF && (
                          <span className="block mt-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.5 }}>
                            <strong>NF:</strong> {nfState[f].obsNF}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ═══ CARD 3 — Produtos ═══ */}
                  <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--muted)', boxShadow: 'var(--elevation-sm)' }}>
                    <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid var(--muted)' }}>
                      <span className="rounded-lg flex items-center justify-center shrink-0"
                        style={{ width: 32, height: 32, background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                      </span>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
                        {nfQty} {nfQty === 1 ? 'produto' : 'produtos'}
                      </span>
                      {hasMultipleOrigins && (
                        <span className="inline-flex items-center gap-1.5">
                          <NfBadge filial={f} small />
                          <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                            {f === 'PR' ? 'Filial PR' : 'Filial ES'}
                          </span>
                        </span>
                      )}
                      <button
                        onClick={() => setDeleteNfTarget(f)}
                        title="Excluir nota fiscal"
                        aria-label="Excluir nota fiscal"
                        className="ml-auto flex items-center justify-center w-7 h-7 rounded-md bg-transparent border-none cursor-pointer hover:bg-[var(--muted)] transition-colors"
                        style={{ color: 'var(--muted-foreground)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-col" style={{ maxHeight: 380, overflowY: 'auto' }}>
                      {nfItems.map((item, idx) => (
                        <div key={item.id} className="flex items-start gap-3 px-5 py-4"
                          style={{ borderBottom: idx < nfItems.length - 1 ? '1px solid var(--muted)' : 'none' }}>
                          <div className="w-[60px] h-[60px] rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                            style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
                            {item.image
                              ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              : <PackageIcon />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block" style={{
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-bold)',
                              color: 'var(--foreground)',
                              fontFamily: 'var(--font-red-hat-display)',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: 1.3,
                            }}>
                              {item.name}
                            </span>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="inline-flex items-center rounded-full px-2 py-0.5"
                                style={{ background: 'var(--background)', border: '1px solid var(--muted)', fontSize: 9, color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '0.4px' }}>
                                {item.quantity} {item.unitType.toUpperCase()}
                              </span>
                              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                                <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(item.price)}</span> / un
                              </span>
                            </div>
                          </div>
                          <span className="shrink-0 text-right" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer buttons — back to previous step */}
          <div className="flex items-center">
            <button onClick={handleBack}
              className="h-11 px-5 rounded-lg cursor-pointer hover:bg-[var(--primary-surface-xs)] transition-colors inline-flex items-center gap-2"
              style={{ background: 'transparent', border: '1px solid var(--muted)', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Voltar
            </button>
          </div>
        </div>

        {/* Right sidebar — "Pronto para finalizar" */}
        <div className="w-full lg:w-[340px] shrink-0 order-first lg:order-last">
          <div className="lg:sticky lg:top-5 rounded-2xl overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--muted)', boxShadow: 'var(--elevation-sm)' }}>

            {/* Sidebar header — DS filled-square + kicker */}
            <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--muted)' }}>
              <span className="rounded-lg flex items-center justify-center shrink-0"
                style={{ width: 36, height: 36, background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
                </svg>
              </span>
              <div className="min-w-0">
                <span className="block" style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.6px', textTransform: 'uppercase', lineHeight: 1 }}>
                  Pronto para finalizar
                </span>
                <span className="block mt-1" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.1 }}>
                  {hasMultipleOrigins ? `${activeFiliaisInCart.length} pedidos` : 'Resumo do pedido'}
                </span>
              </div>
            </div>

            {/* Line items */}
            <div className="px-5 py-4 flex flex-col gap-2.5">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  Subtotal dos produtos
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(scopedSubtotal)}</span>
              </div>

              {/* Freight per NF */}
              {activeFiliaisInCart.map(f => {
                const fp = getShippingPriceForNf(f);
                const lt = nfState[f].logisticsType;
                const free = fp === 0 && lt !== 'fob';
                return (
                  <div key={`frete-${f}`} className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                      {hasMultipleOrigins ? `Frete ${f === 'PR' ? 'Filial PR' : 'Filial ES'}` : 'Frete'}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: free ? 'var(--success)' : 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: free ? '0.4px' : 0, fontVariantNumeric: 'tabular-nums' }}>
                      {lt === 'fob' ? 'FOB' : free ? 'GRÁTIS' : formatCurrency(fp)}
                    </span>
                  </div>
                );
              })}

              {/* Credit applied — scoped (label varia conforme fontes ativas) */}
              {useCredit && scopedCreditApplied > 0 && (
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2" style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    Desconto ({creditLabel})
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
                    − {formatCurrency(scopedCreditApplied)}
                  </span>
                </div>
              )}

              {/* Coupon applied */}
              {couponDiscount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2" style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                    Cupom {appliedCoupon}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
                    − {formatCurrency(couponDiscount)}
                  </span>
                </div>
              )}

              {/* Dotted ticket divider */}
              <div className="my-1" style={{ height: 1, background: 'repeating-linear-gradient(to right, var(--muted) 0 4px, transparent 4px 8px)' }} />

              {/* Per-NF totals */}
              {activeFiliaisInCart.map(f => {
                const ns = NF_STYLE[f];
                const nfFinal = f === 'PR' ? totalPRAfterCredit : totalESAfterCredit;
                return (
                  <div key={`total-${f}`} className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2">
                      {hasMultipleOrigins && <NfBadge filial={f} small />}
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}>
                        {hasMultipleOrigins ? `Total ${f === 'PR' ? 'Filial PR' : 'Filial ES'}` : 'Total deste pedido'}
                      </span>
                    </div>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: ns.color, fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrency(nfFinal)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Coupon input */}
            <div className="px-5 pb-3">
              <CouponInline appliedCode={appliedCoupon} onApply={setAppliedCoupon} onRemove={() => setAppliedCoupon('')} validCoupons={VALID_COUPONS} />
            </div>

            {/* Grand total */}
            <div className="px-5 pt-1 pb-4">
              <div className="rounded-xl px-4 py-4 flex items-end justify-between gap-3"
                style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
                <div>
                  <span className="block" style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                    {hasMultipleOrigins ? 'Total das NFs' : 'Você vai pagar'}
                  </span>
                  {hasMultipleOrigins && (
                    <span className="block mt-0.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      pago separadamente · {activeFiliaisInCart.length} pedidos
                    </span>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {scopedCreditApplied > 0 && (
                    <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrency(scopedTotal)}
                    </span>
                  )}
                  <span style={{ fontSize: 28, fontWeight: 'var(--font-weight-bold)', color: scopedCreditApplied > 0 ? 'var(--success)' : 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                    {formatCurrency(finalTotalAfterAll)}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA in sidebar */}
            <div className="px-5 pb-5 pt-0 flex flex-col gap-3">
              <button onClick={handleFinalize}
                className="w-full h-12 rounded-xl border-none cursor-pointer hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', boxShadow: '0 8px 22px rgba(0,90,255,0.28)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                FINALIZAR PEDIDO
              </button>

              {/* Trust micro-row */}
              <div className="flex items-center justify-center gap-4">
                <span className="inline-flex items-center gap-1" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Compra segura
                </span>
                <span style={{ color: 'var(--muted)' }}>·</span>
                <span className="inline-flex items-center gap-1" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  Suporte 8h–18h
                </span>
              </div>

              <span className="block text-center" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.5 }}>
                Ao finalizar, você confirma os dados acima e autoriza o processamento.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER: PIX MODAL
  ═══════════════════════════════════════════════════════════ */
  const pixNfsList = activeFiliaisInCart.filter(f => nfState[f].paymentMethod === 'pix');
  const allPixPaid = pixNfsList.length > 0 && pixNfsList.every(f => nfState[f].pixPaid);

  const formatTimer = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  /* ═══════════════════════════════════════════════════════════
     MAIN RENDER
  ═══════════════════════════════════════════════════════════ */
  /* ═══════════════════════════════════════════════════════════
     RENDER: DELETE NF CONFIRMATION MODAL
  ═══════════════════════════════════════════════════════════ */
  const deleteModal = deleteNfTarget && (() => {
    const f = deleteNfTarget;
    const ns = NF_STYLE[f];
    const fName = f === 'PR' ? 'Paraná' : 'Espírito Santo';
    const nfItems = f === 'PR' ? itemsPR : itemsES;
    const nfQty = nfItems.reduce((s, i) => s + i.quantity, 0);
    const handleConfirm = () => {
      const remaining = activeFiliaisInCart.filter(x => x !== f);
      removeFilial(f);
      setDeleteNfTarget(null);
      if (remaining.length === 0) navigate('/carrinho');
    };
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'var(--overlay-backdrop)' }}
        onClick={() => setDeleteNfTarget(null)}>
        <div className="w-full max-w-[440px] rounded-2xl overflow-hidden"
          style={{ background: 'var(--card)', boxShadow: 'var(--overlay-shadow-lg)' }}
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-start gap-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'var(--destructive-surface)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--destructive-foreground)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              </svg>
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <span className="block" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                Excluir NF {fName}?
              </span>
              <span className="block mt-1.5" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.5 }}>
                {nfQty} {nfQty === 1 ? 'item será removido' : 'itens serão removidos'} do seu carrinho. Esta ação não pode ser desfeita.
              </span>
            </div>
            <button onClick={() => setDeleteNfTarget(null)} aria-label="Fechar"
              className="bg-transparent border-none cursor-pointer p-1 rounded-lg hover:opacity-70 transition-opacity shrink-0"
              style={{ color: 'var(--muted-foreground)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* NF preview chip */}
          <div className="mx-6 mb-5 rounded-lg px-3 py-2.5 flex items-center gap-2"
            style={{ background: ns.surface, border: `1px solid ${ns.border}` }}>
            <NfBadge filial={f} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: ns.color, fontFamily: 'var(--font-red-hat-display)' }}>
              NF {fName}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
              · {nfQty} {nfQty === 1 ? 'item' : 'itens'}
            </span>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex flex-col-reverse sm:flex-row gap-2.5">
            <button onClick={() => setDeleteNfTarget(null)}
              className="flex-1 h-11 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: 'transparent', border: '1px solid var(--muted)', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
              Cancelar
            </button>
            <button onClick={handleConfirm}
              className="flex-1 h-11 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              style={{ background: 'var(--destructive-foreground)', color: 'var(--primary-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              </svg>
              Excluir NF
            </button>
          </div>
        </div>
      </div>
    );
  })();

  if (nfStep === 'review') {
    return (
      <div className="min-h-screen" style={{ background: 'var(--background)', fontFamily: 'var(--font-red-hat-display)' }}>
        {renderReviewStep()}
        {deleteModal}

        {/* PIX Modal */}
        {showPixModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'var(--overlay-backdrop)' }}>
            <div className="w-full max-w-[480px] rounded-2xl overflow-hidden"
              style={{ background: 'var(--card)', boxShadow: 'var(--overlay-shadow-lg)' }}>
              <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--muted)' }}>
                <div className="flex items-center gap-2.5">
                  <PixIcon />
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>Pagamento PIX</span>
                </div>
                <button onClick={() => setShowPixModal(false)} className="bg-transparent border-none cursor-pointer p-1 rounded-lg hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--muted-foreground)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>

              {pixNfsList.length > 1 && (
                <div className="flex" style={{ borderBottom: '1px solid var(--muted)' }}>
                  {pixNfsList.map(f => (
                    <button key={f} onClick={() => setActivePixTab(f)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-transparent border-none cursor-pointer transition-all duration-150"
                      style={{ borderBottom: activePixTab === f ? `2px solid ${NF_STYLE[f].color}` : '2px solid transparent', fontFamily: 'var(--font-red-hat-display)' }}>
                      <NfBadge filial={f} />
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: activePixTab === f ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)', color: activePixTab === f ? NF_STYLE[f].color : 'var(--muted-foreground)' }}>
                        NF {f}
                      </span>
                      {nfState[f].pixPaid && <span className="w-[14px] h-[14px] rounded-full flex items-center justify-center" style={{ background: 'var(--success)', color: 'var(--success-foreground)' }}><CheckIcon /></span>}
                    </button>
                  ))}
                </div>
              )}

              {(() => {
                const f = activePixTab;
                const s = nfState[f];
                const nfTotal = f === 'PR' ? totalPRAfterCredit : totalESAfterCredit;
                return (
                  <div className="p-6">
                    {s.pixPaid ? (
                      <div className="flex flex-col items-center gap-4 py-4">
                        <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center" style={{ background: 'var(--success-surface)' }}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <span className="block" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', textAlign: 'center' }}>PIX confirmado — NF {f}!</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>Valor</span>
                          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>{formatCurrency(nfTotal)}</span>
                        </div>
                        <div className="rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--background)', border: '1px solid var(--muted)', height: 200 }}>
                          <div className="text-center">
                            <div className="grid grid-cols-5 gap-0.5 mb-2 opacity-60">
                              {Array.from({ length: 25 }).map((_, i) => (
                                <div key={i} className="w-4 h-4 rounded-sm" style={{ background: (i % 3 === 0 || i % 7 === 0) ? 'var(--foreground)' : 'transparent' }} />
                              ))}
                            </div>
                            <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>QR Code simulado</span>
                          </div>
                        </div>
                        <div className="rounded-lg p-3 mb-4 flex items-center justify-between" style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>Expira em</span>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: s.pixTimer < 60 ? 'var(--destructive-foreground)' : 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                            {formatTimer(s.pixTimer)}
                          </span>
                        </div>
                        <button onClick={() => updateNf(f, { pixPaid: true })}
                          className="w-full h-12 rounded-xl border-none cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
                          Simular confirmação do PIX
                        </button>
                      </>
                    )}
                  </div>
                );
              })()}

              {allPixPaid && (
                <div className="px-6 pb-6">
                  <button onClick={() => { setShowPixModal(false); navigate('/sucesso', { state: buildSuccessState() }); }}
                    className="w-full h-12 rounded-xl border-none cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ background: 'var(--success)', color: 'var(--success-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
                    Finalizar Pedido
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── NF Configuration step (PR or ES) ── */
  const activeFilial = nfStep as 'PR' | 'ES';
  const nfStyle = NF_STYLE[activeFilial];
  const currentIdx = activeFiliaisInCart.indexOf(activeFilial);
  const isLastNf = currentIdx === activeFiliaisInCart.length - 1;
  const canProceed = canProceedFromNf(activeFilial);

  /* ── Title data ── */
  const activeItems = activeFilial === 'PR' ? itemsPR : itemsES;
  const activeSubtotal = activeFilial === 'PR' ? subtotalPR : subtotalES;
  const activeTotalQty = activeItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', fontFamily: 'var(--font-red-hat-display)' }}>

      {/* ── Page Header — band navy + NF identity inline ── */}
      <div className="relative overflow-hidden" style={{ background: 'var(--foreground)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at center, var(--primary-foreground) 1px, transparent 1.5px)', backgroundSize: '22px 22px' }} />
        <div className="relative max-w-[1120px] mx-auto px-4 md:px-6 pt-6 pb-7 text-center">
          <MainStepIndicator currentNfStep={nfStep} />
          <div className="mt-5 inline-flex items-center gap-2.5 rounded-lg px-3 py-1.5"
            style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)' }}>
            <span
              className="rounded flex items-center justify-center shrink-0"
              style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.18)', color: 'var(--primary-foreground)', fontSize: 10, fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.4px' }}>
              {activeFilial}
            </span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
              Checkout Filial {activeFilial === 'PR' ? 'PR · Paraná' : 'ES · Espírito Santo'}
            </span>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-red-hat-display)' }}>
              · {activeTotalQty} {activeTotalQty === 1 ? 'item' : 'itens'}
            </span>
          </div>
        </div>
      </div>

      {/* Smart default hints are now inline within each block (see BlockReapplyHint in renderShippingBlock / renderPaymentBlock) */}

      {/* ── Main 2-column layout ── */}
      <div className="max-w-[1120px] mx-auto flex flex-col lg:flex-row gap-8 pt-6 pb-16 px-4 md:px-6">

        {/* Left column — all 4 blocks */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Block 2 — Logística e Frete */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`shipping-${activeFilial}`}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}>
              {renderShippingBlock(activeFilial)}
            </motion.div>
          </AnimatePresence>

          {/* Block 3 — Crédito Depósito (above payment) */}
          {renderCreditBlock()}

          {/* Block 4 — Forma de Pagamento (hidden when credit covers NF) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`payment-${activeFilial}-${useCredit}`}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22, ease: 'easeOut', delay: 0.04 }}>
              {renderPaymentBlock(activeFilial)}
            </motion.div>
          </AnimatePresence>

          {/* Block 5 — Consultor contact */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: wantConsultor ? 'var(--primary-surface-xs)' : 'var(--card)',
              border: wantConsultor ? '1px solid var(--primary-border-sm)' : '1px solid var(--muted)',
              transition: 'all 0.22s',
            }}
          >
            <div
              className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
              onClick={() => setWantConsultor(v => !v)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setWantConsultor(v => !v);
                }
              }}
            >
              <div
                className="w-[38px] h-[38px] rounded-lg flex items-center justify-center shrink-0"
                style={{ background: wantConsultor ? 'var(--primary-surface-lg)' : 'var(--primary-surface-md)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: wantConsultor ? 'var(--primary)' : 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.3 }}>
                  Desejo contato com meu Consultor antes de fechar o pedido
                </span>
                <span className="block mt-0.5" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.4 }}>
                  Seu consultor receberá uma notificação e entrará em contato antes de processar o pedido.
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span style={{ fontSize: 'var(--text-xs)', color: wantConsultor ? 'var(--primary)' : 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: wantConsultor ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)' }}>
                  {wantConsultor ? 'Contato ativado' : 'Ativar contato'}
                </span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setWantConsultor(v => !v);
                  }}
                  className="relative bg-transparent border-none cursor-pointer p-0 shrink-0"
                  style={{ width: 44, height: 24 }}
                  aria-label="Ativar contato com consultor"
                  role="switch"
                  aria-checked={wantConsultor}
                >
                  <div className="w-full h-full rounded-full transition-colors duration-200"
                    style={{ background: wantConsultor ? 'var(--primary)' : 'var(--muted)' }} />
                  <div className="absolute top-[2px] rounded-full transition-all duration-200"
                    style={{ width: 20, height: 20, background: 'var(--primary-foreground)', boxShadow: 'var(--toggle-knob-shadow)', left: wantConsultor ? 22 : 2 }} />
                </button>
              </div>
            </div>
          </div>

          {/* Block 6 — Observações (collapsed) */}
          {renderObsBlock(activeFilial)}

          {/* ── Footer navigation ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <button onClick={handleBack}
              className="h-12 px-8 rounded-xl cursor-pointer hover:opacity-80 transition-opacity order-2 sm:order-1"
              style={{ background: 'transparent', border: '1px solid var(--muted)', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
              {currentIdx === 0
                ? '← Voltar ao Carrinho'
                : `← Editar NF ${activeFiliaisInCart[currentIdx - 1] === 'PR' ? 'Paraná' : 'Espírito Santo'}`}
            </button>

            <button
              onClick={handleSaveAndContinue}
              disabled={!canProceed}
              className="h-12 px-8 rounded-xl border-none cursor-pointer hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed order-1 sm:order-2"
              style={{ background: nfStyle.color, color: 'var(--primary-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
              {isLastNf
                ? 'Revisar e Finalizar →'
                : `Salvar e configurar NF ${activeFiliaisInCart[currentIdx + 1] === 'ES' ? 'Espírito Santo' : activeFiliaisInCart[currentIdx + 1]} →`}
            </button>
          </div>

          {/* Validation hint */}
          {!canProceed && (() => {
            const nfTotalAfter = activeFilial === 'PR' ? totalPRAfterCredit : totalESAfterCredit;
            const creditCoversNf = useCredit && nfTotalAfter === 0;
            return (
              <div className="flex items-start gap-2 -mt-1">
                <InfoIcon />
                <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: '1.5' }}>
                  {creditCoversNf
                    ? 'Para continuar, selecione uma opção de frete.'
                    : 'Para continuar, selecione uma opção de frete, forma de pagamento e condição de pagamento.'}
                </span>
              </div>
            );
          })()}
        </div>

        {/* Right column — NF sidebar */}
        {renderNfSidebar(activeFilial)}
      </div>
    </div>
  );
}
