import { useNavigate, useLocation } from 'react-router';
import { formatCurrency } from './cart-data';
import { useCart } from './CartContext';
import imgBancoSantanderLogotipo1 from "figma:asset/e004b4681aa6a3775718294c331f7aebd730e9db.png";
import imgSicoobLogo111 from "figma:asset/7b23b01492bedbff494f9792dab32a8b69befa0b.png";
import imgQrCode from "figma:asset/1fd4434e6862372e3f6b94b2b3fa9640ca2daf70.png";
import { useState, useMemo, useEffect } from 'react';

/* ─── Bank data ─── */
const BANK_ACCOUNTS = [
  { name: 'Santander',       logo: imgBancoSantanderLogotipo1, logoType: 'img' as const,  agencia: '0163',   conta: '13016592',         color: '#EC0000' },
  { name: 'CAIXA',           logo: null,                       logoType: 'text' as const, agencia: '4208',   conta: 'O/P 003.800034-8', color: '#005CA9' },
  { name: 'Banco do Brasil', logo: null,                       logoType: 'text' as const, agencia: '3409-6', conta: '21507-4',          color: '#FCBA03' },
  { name: 'Itaú',            logo: null,                       logoType: 'text' as const, agencia: '0.932',  conta: '48352-2',          color: '#003DA5' },
  { name: 'Bradesco',        logo: null,                       logoType: 'text' as const, agencia: '3509-2', conta: '000496-0',         color: '#CC092F' },
  { name: 'SICOOB',          logo: imgSicoobLogo111,           logoType: 'img' as const,  agencia: '4340',   conta: '99088-4',          color: '#003641' },
];

const FAVORECIDO = { nome: 'Oderço Distribuidora Ltda', cnpj: '09.301.845/0001-91' };

const NF_COLORS  = { PR: 'var(--nf-pr)',         ES: 'var(--nf-es)' } as const;
const NF_SURFACE = { PR: 'var(--nf-pr-surface)', ES: 'var(--nf-es-surface)' } as const;

function generateOrderNumber() {
  return `#${Math.floor(10000000 + Math.random() * 90000000)}`;
}

function getValidityDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function formatTimeNow() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

interface NfData {
  paymentMethod: string;
  condicaoPgto: string;
  shippingPrice: number;
  total: number;
  totalBeforeCredit?: number;
  creditApplied?: number;
  pixPaid: boolean;
  subtotal: number;
  logisticsType?: 'cif' | 'fob' | 'retirada';
}

type NfStatus = 'paid' | 'pending-pix' | 'pending-async';

interface NfInfo {
  abbr: 'PR' | 'ES';
  label: string;
  total: number;
  totalBeforeCredit?: number;
  creditApplied?: number;
  orderNumber: string;
  paymentMethod: string;
  status: NfStatus;
}

/* ═══════════════════════════════════════════════════════════
   ICON SET — DS Figma filled-square style + ghost variants
═══════════════════════════════════════════════════════════ */
function IconCheck({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
}
function IconClock({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
function IconCopy({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>;
}
function IconDownload({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
}
function IconArrowRight({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
}
/* DS filled-square outlined icons (40×40 primary bg, white stroke) */
function IconNfDoc({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" /></svg>;
}
function IconTruck({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
}
function IconShield({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>;
}
function IconChat({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>;
}
function IconBox({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
}
function IconRoute({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15" /><circle cx="18" cy="5" r="3" /></svg>;
}
function IconHome({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
}
function IconWhatsapp({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>;
}
function IconStore({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1-5h16l1 5" /><path d="M5 9v11a1 1 0 001 1h12a1 1 0 001-1V9" /><path d="M9 22V12h6v10" /></svg>;
}

/* ─── Filled-square icon container (DS Figma — 40×40 primary fill, white glyph) ─── */
function FilledSquareIcon({ children, color = 'var(--primary)', size = 40 }: { children: React.ReactNode; color?: string; size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size, borderRadius: 8, background: color, color: 'var(--primary-foreground)' }}
    >
      {children}
    </span>
  );
}

/* ─── PIX brand mark ─── */
function PixIcon({ color = '#32BCAD', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill={color} aria-label="PIX">
      <path d="M398.07,338.45c-19.34,0-37.52-7.53-51.18-21.2L301.27,272a13.61,13.61,0,0,0-17.65,0l-46.06,46.06c-13.66,13.66-31.84,21.2-51.18,21.2H170.7l58.5,58.5a45.85,45.85,0,0,0,64.86,0l58.66-58.66ZM186.38,167.61c19.34,0,37.52,7.53,51.18,21.2l46.06,46.06a12.85,12.85,0,0,0,17.79,0L347.05,189c13.66-13.66,31.84-21.2,51.18-21.2h6.69L346.26,109.13a45.85,45.85,0,0,0-64.86,0L222.85,167.61Z"/>
      <path d="M438.62,217.86,403,182.23a13,13,0,0,1-2.49.49H385.16a36.21,36.21,0,0,0-25.46,10.54l-46.06,46.06a35.27,35.27,0,0,1-49.93,0L217.5,193.11A36.22,36.22,0,0,0,192,182.57H173.09a13.07,13.07,0,0,1-2.36-.45l-35.85,35.85a51.55,51.55,0,0,0,0,72.91l35.85,35.85a13.07,13.07,0,0,1,2.36-.45h18.86a36.22,36.22,0,0,0,25.51-10.54l46.21-46.21a35.27,35.27,0,0,1,49.93,0l46.06,46.06A36.21,36.21,0,0,0,385.16,326h15.32a13,13,0,0,1,2.49.49l35.65-35.62A51.59,51.59,0,0,0,438.62,217.86Z"/>
    </svg>
  );
}

function NfBadge({ filial, size = 22 }: { filial: 'PR' | 'ES'; size?: number }) {
  return (
    <span className="rounded flex items-center justify-center shrink-0"
      style={{ width: size, height: size, background: NF_COLORS[filial], color: 'var(--primary-foreground)', fontSize: size <= 18 ? 8 : 10, fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.4px' }}>
      {filial}
    </span>
  );
}

function getPaymentLabel(pm: string) {
  if (pm === 'credito')      return 'Crédito Depósito';
  if (pm === 'transferencia') return 'Depósito / Transferência';
  if (pm === 'boleto')        return 'Boleto Bancário';
  if (pm === 'pix' || pm === 'PIX') return 'PIX';
  return pm;
}

function deriveStatus(pm: string, pixPaid: boolean, total = 0): NfStatus {
  if (pm === 'credito' || total === 0) return 'paid';
  if (pm === 'pix') return pixPaid ? 'paid' : 'pending-pix';
  return 'pending-async';
}

function StatusPill({ status }: { status: NfStatus }) {
  if (status === 'paid') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{ background: 'var(--success-surface)', color: 'var(--success)', fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px' }}>
        <IconCheck size={11} />
        PAGO
      </span>
    );
  }
  if (status === 'pending-pix') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{ background: 'var(--warning-surface)', color: 'var(--warning-foreground)', fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', border: '1px solid var(--warning-border)' }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--warning)', animation: 'pulse 2s ease-in-out infinite' }} />
        AGUARDANDO PAGAMENTO
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ background: 'var(--primary-surface-md)', color: 'var(--primary)', fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px' }}>
      <IconClock size={11} />
      EM ANÁLISE DE CRÉDITO
    </span>
  );
}

function formatTimer(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ═══════════════════════════════════════════════════════════
   ORDER TIMELINE — horizontal stages with DS-aligned iconic dots
═══════════════════════════════════════════════════════════ */
type TimelineStage = { key: string; label: string; sub?: string; icon: React.ReactNode };

function OrderTimeline({ stages, currentIdx }: { stages: TimelineStage[]; currentIdx: number }) {
  return (
    <div className="flex items-stretch gap-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
      {stages.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const pending = i > currentIdx;
        const dotBg = done ? 'var(--success)' : active ? 'var(--primary)' : 'var(--card)';
        const dotBorder = done ? 'var(--success)' : active ? 'var(--primary)' : 'var(--muted)';
        const dotFg = done || active ? 'var(--primary-foreground)' : 'var(--muted-foreground)';
        const labelColor = done ? 'var(--success)' : active ? 'var(--foreground)' : 'var(--muted-foreground)';
        return (
          <div key={s.key} className="flex-1 min-w-[110px] flex flex-col items-center text-center px-1 relative">
            {/* Connector behind dot */}
            {i > 0 && (
              <div className="absolute top-[19px] right-1/2 left-0 h-[2px]"
                style={{ background: done || active ? 'var(--success)' : 'var(--muted)' }} />
            )}
            {i < stages.length - 1 && (
              <div className="absolute top-[19px] left-1/2 right-0 h-[2px]"
                style={{ background: done ? 'var(--success)' : 'var(--muted)' }} />
            )}
            {/* Dot */}
            <div
              className="relative inline-flex items-center justify-center rounded-full z-[1]"
              style={{ width: 40, height: 40, background: dotBg, border: `2px solid ${dotBorder}`, color: dotFg, boxShadow: active ? '0 6px 16px rgba(0,90,255,0.25)' : 'none' }}
            >
              {done ? <IconCheck size={18} /> : s.icon}
              {active && (
                <span
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ border: '2px solid var(--primary)', animation: 'pingRing 1.6s cubic-bezier(0,0,.2,1) infinite' }}
                />
              )}
            </div>
            {/* Label */}
            <span className="block mt-3" style={{ fontSize: 'var(--text-xs)', fontWeight: active || done ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)', color: labelColor, fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.2 }}>
              {s.label}
            </span>
            {s.sub && (
              <span className="block mt-0.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.3 }}>
                {s.sub}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NEXT-STEPS RAIL — 4 iconic action rows (DS filled-square)
═══════════════════════════════════════════════════════════ */
/* Vertical card pra grid 4-col abaixo do receipt — bloco autônomo */
function NextStepCard({ icon, iconBg, title, sub, cta }: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  sub: string;
  cta?: { label: string; onClick: () => void };
}) {
  return (
    <div
      className="rounded-xl px-4 py-4 flex flex-col gap-2 transition-colors hover:bg-[var(--primary-surface-xs)]"
      style={{ background: 'var(--card)', border: '1px solid var(--muted)' }}
    >
      <FilledSquareIcon color={iconBg} size={36}>{icon}</FilledSquareIcon>
      <span className="block mt-1" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.2 }}>
        {title}
      </span>
      <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.4 }}>
        {sub}
      </span>
      {cta && (
        <button
          onClick={cta.onClick}
          className="mt-1 inline-flex items-center gap-1 bg-transparent border-none cursor-pointer p-0 hover:opacity-70 transition-opacity self-start"
          style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}
        >
          {cta.label}
          <IconArrowRight size={12} />
        </button>
      )}
    </div>
  );
}

function NextStepsRail({ items }: { items: { icon: React.ReactNode; iconBg: string; title: string; sub: string; cta?: { label: string; onClick: () => void } }[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((it, i) => (
        <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3.5 transition-colors hover:bg-[var(--primary-surface-xs)]"
          style={{ background: 'var(--card)', border: '1px solid var(--muted)' }}
        >
          <FilledSquareIcon color={it.iconBg}>{it.icon}</FilledSquareIcon>
          <div className="flex-1 min-w-0">
            <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
              {it.title}
            </span>
            <span className="block mt-0.5" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.4 }}>
              {it.sub}
            </span>
            {it.cta && (
              <button
                onClick={it.cta.onClick}
                className="mt-1.5 inline-flex items-center gap-1 bg-transparent border-none cursor-pointer p-0 hover:opacity-70 transition-opacity"
                style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}
              >
                {it.cta.label}
                <IconArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RECEIPT-STYLE ORDER CARD — solid navy header + white body,
   no soft tinted bg with floating card inside.
═══════════════════════════════════════════════════════════ */
function ReceiptCard({
  nf,
  isOpen,
  isBlocked,
  onToggle,
  validityDate,
  pixTimer,
  isActivePix,
}: {
  nf: NfInfo;
  isOpen: boolean;
  isBlocked: boolean;
  onToggle: () => void;
  validityDate: string;
  pixTimer: number;
  isActivePix: boolean;
}) {
  const isPaid = nf.status === 'paid';
  const accent = NF_COLORS[nf.abbr];

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        background: 'var(--card)',
        border: `1px solid ${isPaid ? 'var(--muted)' : 'var(--muted)'}`,
        boxShadow: isActivePix ? '0 12px 30px rgba(0,90,255,0.10)' : 'var(--elevation-sm)',
        opacity: isBlocked ? 0.55 : 1,
      }}
    >
      {/* Header — solid bg by NF accent (NOT tinted surface) */}
      <button
        onClick={() => !isBlocked && onToggle()}
        disabled={isBlocked}
        className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer disabled:cursor-not-allowed border-none"
        style={{
          background: isPaid ? 'var(--foreground)' : accent,
          color: 'var(--primary-foreground)',
          textAlign: 'left',
        }}
      >
        <span
          className="rounded flex items-center justify-center shrink-0"
          style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.18)', color: 'var(--primary-foreground)', fontSize: 12, fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.4px' }}
        >
          {nf.abbr}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              {isPaid ? 'PEDIDO PAGO' : 'PEDIDO RECEBIDO'}
            </span>
          </div>
          <span className="block mt-0.5" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.2 }}>
            {nf.label}
            <span className="ml-2" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-normal)', color: 'rgba(255,255,255,0.7)' }}>
              {nf.orderNumber}
            </span>
          </span>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 shrink-0"
          style={{ background: 'rgba(255,255,255,0.2)', color: 'var(--primary-foreground)', fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.4px' }}>
          {isPaid && <IconCheck size={11} />}
          {!isPaid && <IconClock size={11} />}
          {isPaid ? 'PAGO' : (nf.paymentMethod === 'pix' ? 'AGUARDANDO PIX' : 'EM ANÁLISE')}
        </span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s', color: 'var(--primary-foreground)', opacity: 0.85 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Body */}
      {isOpen && !isBlocked && (
        <div className="px-5 py-5">
          {isPaid && <PaidReceiptBody nf={nf} />}
          {!isPaid && nf.paymentMethod === 'pix' && (
            <PixPendingBody nf={nf} pixTimer={pixTimer} isActivePix={isActivePix} />
          )}
          {!isPaid && nf.status === 'pending-async' && <CreditAnalysisBody nf={nf} validityDate={validityDate} />}
        </div>
      )}

      {isBlocked && (
        <div className="px-5 py-3" style={{ background: 'var(--background)' }}>
          <span className="block" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontStyle: 'italic' }}>
            Disponível após finalizar o pagamento da nota anterior.
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── PAID body — receipt-style with dotted divider ─── */
function PaidReceiptBody({ nf }: { nf: NfInfo }) {
  const isCreditPayment = nf.paymentMethod === 'credito';
  const receiptAmount = isCreditPayment ? (nf.creditApplied || nf.totalBeforeCredit || nf.total) : nf.total;
  return (
    <div>
      {/* Confirmation row — solid success badge, NOT tinted bg */}
      <div className="flex items-center gap-3 mb-4">
        <FilledSquareIcon color="var(--success)" size={44}>
          <IconCheck size={22} />
        </FilledSquareIcon>
        <div className="flex-1 min-w-0">
          <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)' }}>
            Pagamento confirmado via {getPaymentLabel(nf.paymentMethod)}
          </span>
          <span className="block mt-0.5" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            {isCreditPayment ? 'Pedido quitado com o limite disponível' : `Recebido às ${formatTimeNow()} de hoje`}
          </span>
        </div>
      </div>

      {/* Receipt detail — dotted ticket-style separator */}
      <div className="rounded-xl px-4 py-4" style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="block mb-1" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {isCreditPayment ? 'Crédito utilizado' : 'Valor pago'}
            </span>
            <span className="block" style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', color: NF_COLORS[nf.abbr], fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {formatCurrency(receiptAmount)}
            </span>
          </div>
          <div>
            <span className="block mb-1" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Nº pedido
            </span>
            <span className="inline-flex items-center gap-1.5" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
              {nf.orderNumber}
              <button
                onClick={() => navigator.clipboard?.writeText(nf.orderNumber)}
                className="bg-transparent border-none cursor-pointer p-1 rounded hover:bg-[var(--muted)] transition-colors"
                aria-label="Copiar número"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <IconCopy size={13} />
              </button>
            </span>
          </div>
        </div>

        {/* Dotted divider — receipt vibe */}
        <div className="my-3" style={{ height: 1, background: 'repeating-linear-gradient(to right, var(--muted) 0 4px, transparent 4px 8px)' }} />

        <div className="flex items-center justify-between">
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            Comprovante disponível
          </span>
          <button
            className="inline-flex items-center gap-1.5 rounded-md px-3 h-8 border-none cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: 'var(--success)', color: 'var(--primary-foreground)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}
          >
            <IconDownload size={13} /> Baixar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── PIX pending body — high-fidelity QR + countdown ─── */
function PixPendingBody({ nf, pixTimer, isActivePix }: { nf: NfInfo; pixTimer: number; isActivePix: boolean }) {
  const isExpiringSoon = pixTimer <= 60;
  return (
    <div>
      {/* Header strip with brand + timer */}
      <div className="rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3"
        style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
        <div className="flex items-center gap-2">
          <PixIcon size={20} />
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            Pagamento via PIX
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
          style={{ background: isExpiringSoon ? 'var(--destructive-surface)' : 'var(--warning-surface)', border: `1px solid ${isExpiringSoon ? 'var(--destructive-foreground)' : 'var(--warning-border)'}` }}>
          <IconClock size={13} color={isExpiringSoon ? 'var(--destructive-foreground)' : 'var(--warning-foreground)'} />
          <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: isExpiringSoon ? 'var(--destructive-foreground)' : 'var(--warning-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', fontVariantNumeric: 'tabular-nums' }}>
            EXPIRA EM {formatTimer(pixTimer)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 items-start">
        {/* QR */}
        <div className="rounded-xl p-2 flex items-center justify-center" style={{ background: 'var(--card)', border: '1px solid var(--muted)' }}>
          <img src={imgQrCode} alt="QR Code PIX" className="w-full h-auto" />
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <span className="block mb-1" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Valor</span>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', color: NF_COLORS[nf.abbr], fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(nf.total)}
            </span>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.5 }}>
            Aponte a câmera do seu app bancário para o QR ou copie o código abaixo.
          </span>
          <button
            onClick={() => navigator.clipboard?.writeText('00020126580014BR.GOV.BCB.PIX...')}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}
          >
            <IconCopy size={13} /> Copiar código PIX
          </button>
        </div>
      </div>

      <div className="rounded-xl px-4 py-3 mt-4 flex items-center gap-3"
        style={{ background: isActivePix ? 'var(--primary-surface-md)' : 'var(--background)', border: `1px solid ${isActivePix ? 'var(--primary-border-sm)' : 'var(--muted)'}` }}>
        {isActivePix ? (
          <span className="inline-block w-4 h-4 rounded-full shrink-0"
            style={{ border: '2px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
        ) : (
          <IconClock size={16} color="var(--muted-foreground)" />
        )}
        <div className="flex-1 min-w-0">
          <span className="block" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: isActivePix ? 'var(--primary)' : 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            {isActivePix ? 'Aguardando confirmação automática' : 'Aguardando sua vez'}
          </span>
          <span className="block mt-0.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.4 }}>
            {isActivePix
              ? 'Assim que o PIX for compensado, o pedido será confirmado automaticamente.'
              : 'Esta nota será processada após a anterior ser paga.'}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Credit analysis pending ─── */
function CreditAnalysisBody({ nf, validityDate }: { nf: NfInfo; validityDate: string }) {
  const accent = NF_COLORS[nf.abbr];
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <FilledSquareIcon color={accent} size={44}>
          <IconClock size={22} />
        </FilledSquareIcon>
        <div className="flex-1 min-w-0">
          <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            Pedido em análise de crédito
          </span>
          <span className="block mt-0.5" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.5 }}>
            A cobrança será liberada após a aprovação da análise.
          </span>
        </div>
      </div>

      <div className="rounded-xl px-4 py-4" style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block mb-1" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Valor em análise</span>
            <span className="block" style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', color: accent, fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(nf.total)}
            </span>
          </div>
          <div>
            <span className="block mb-1" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Forma escolhida</span>
            <span className="block" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
              {getPaymentLabel(nf.paymentMethod)}
            </span>
          </div>
        </div>
        <div className="my-3" style={{ height: 1, background: 'repeating-linear-gradient(to right, var(--muted) 0 4px, transparent 4px 8px)' }} />
        <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.5 }}>
          Previsão de retorno até {validityDate}.
        </span>
      </div>
    </div>
  );
}

/* ─── Boleto pending ─── */
function BoletoPendingBody({ nf, validityDate }: { nf: NfInfo; validityDate: string }) {
  const accent = NF_COLORS[nf.abbr];
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="block mb-1" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Valor</span>
          <span className="block" style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', color: accent, fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(nf.total)}
          </span>
        </div>
        <div>
          <span className="block mb-1" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Vencimento</span>
          <span className="block" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary)', fontFamily: 'var(--font-red-hat-display)' }}>
            {validityDate}
          </span>
        </div>
      </div>
      <div className="rounded-xl px-4 py-3" style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
        <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.6 }}>
          Favorecido: <strong>{FAVORECIDO.nome}</strong>
        </span>
        <span className="block" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
          CNPJ {FAVORECIDO.cnpj}
        </span>
      </div>
      <div className="flex gap-2 mt-3">
        <button className="flex-1 h-11 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          style={{ background: accent, color: 'var(--primary-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
          <IconDownload size={15} /> Baixar boleto
        </button>
        <button className="flex-1 h-11 rounded-lg cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
          style={{ background: 'transparent', border: `1px solid ${accent}`, color: accent, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>
          <IconCopy size={15} /> Copiar linha digitável
        </button>
      </div>
    </div>
  );
}

/* ─── Transferência pending ─── */
function TransferenciaPendingBody({ nf, validityDate }: { nf: NfInfo; validityDate: string }) {
  const accent = NF_COLORS[nf.abbr];
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="block mb-1" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Valor</span>
          <span className="block" style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', color: accent, fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(nf.total)}
          </span>
        </div>
        <div>
          <span className="block mb-1" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Validade do depósito</span>
          <span className="block" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary)', fontFamily: 'var(--font-red-hat-display)' }}>
            {validityDate}
          </span>
        </div>
      </div>

      <div className="rounded-xl px-4 py-3 mb-3" style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}>
        <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.6 }}>
          Favorecido: <strong>{FAVORECIDO.nome}</strong>
        </span>
        <span className="block" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
          CNPJ {FAVORECIDO.cnpj}
        </span>
      </div>

      <span className="block mb-2" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', fontWeight: 'var(--font-weight-bold)', textTransform: 'uppercase' }}>
        Contas para depósito
      </span>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--muted)' }}>
        <div className="grid grid-cols-[1fr_70px_140px] sm:grid-cols-[1fr_90px_170px] px-4 py-2.5"
          style={{ background: 'var(--background)', borderBottom: '1px solid var(--muted)' }}>
          <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Banco</span>
          <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Agência</span>
          <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Conta</span>
        </div>
        {BANK_ACCOUNTS.map((bank, idx) => (
          <div key={bank.name}
            className="grid grid-cols-[1fr_70px_140px] sm:grid-cols-[1fr_90px_170px] items-center px-4 py-3"
            style={{ background: 'var(--card)', borderBottom: idx < BANK_ACCOUNTS.length - 1 ? '1px solid var(--muted)' : 'none' }}>
            <div className="flex items-center gap-2 min-w-0">
              {bank.logoType === 'img' && bank.logo
                ? <img src={bank.logo} alt={bank.name} className="h-[18px] sm:h-[20px] w-auto object-contain" />
                : <BankLabel bank={bank} />}
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>{bank.agencia}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>{bank.conta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BankLabel({ bank }: { bank: { name: string; color: string } }) {
  if (bank.name === 'CAIXA')
    return <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: bank.color, letterSpacing: '1px', fontFamily: 'var(--font-red-hat-display)' }}>CAIXA</span>;
  if (bank.name === 'Banco do Brasil')
    return <span className="inline-block rounded-sm px-1.5 py-0.5" style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: '#2360A5', background: '#FFF22D', fontFamily: 'var(--font-red-hat-display)' }}>BANCO DO BRASIL</span>;
  if (bank.name === 'Itaú')
    return <span className="inline-flex items-center justify-center rounded px-1.5 py-0.5" style={{ background: '#003DA5', color: 'var(--primary-foreground)', fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}>Itaú</span>;
  if (bank.name === 'Bradesco')
    return (
      <span className="flex items-center gap-1">
        <span className="inline-block w-[6px] h-[14px] rounded-sm" style={{ background: '#CC092F' }} />
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: '#CC092F', fontFamily: 'var(--font-red-hat-display)' }}>Bradesco</span>
      </span>
    );
  return <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: bank.color, fontFamily: 'var(--font-red-hat-display)' }}>{bank.name}</span>;
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeNf, nfsInCart, completedOrders, resetCompleted } = useCart();
  const hasPendingOrder = nfsInCart.length > 0 && activeNf !== null;

  const state = (location.state as {
    hasMultipleOrigins?: boolean;
    grandTotal?: number;
    nfPR?: NfData | null;
    nfES?: NfData | null;
    paymentMethod?: string;
    total?: number;
    pixPaid?: boolean;
    wantConsultor?: boolean;
    finalizedOrders?: { nf: 'PR' | 'ES'; orderNumber: string; total: number; paymentLabel: string }[];
  }) || {};

  const validityDate = getValidityDate();

  /* SuccessPage é dedicada à filial RECÉM-finalizada — uma por vez.
     Se o usuário pagou PR e ES no mesmo checkout (review step legado),
     mostramos só a mais recente em completedOrders. Pendente seguinte
     vira CTA no bottom banner. */
  const focusedNf: 'PR' | 'ES' | null = completedOrders.length > 0
    ? completedOrders[completedOrders.length - 1].nf
    : null;

  const initialNfs = useMemo<NfInfo[]>(() => {
    const infos: NfInfo[] = [];
    if (state.nfPR) {
      const finalized = state.finalizedOrders?.find(o => o.nf === 'PR');
      infos.push({
        abbr: 'PR', label: 'Filial PR', total: state.nfPR.total, totalBeforeCredit: state.nfPR.totalBeforeCredit, creditApplied: state.nfPR.creditApplied,
        orderNumber: finalized?.orderNumber || generateOrderNumber(), paymentMethod: state.nfPR.paymentMethod || 'transferencia',
        status: deriveStatus(state.nfPR.paymentMethod || 'transferencia', state.nfPR.pixPaid ?? false, state.nfPR.total),
      });
    }
    if (state.nfES) {
      const finalized = state.finalizedOrders?.find(o => o.nf === 'ES');
      infos.push({
        abbr: 'ES', label: 'Filial ES', total: state.nfES.total, totalBeforeCredit: state.nfES.totalBeforeCredit, creditApplied: state.nfES.creditApplied,
        orderNumber: finalized?.orderNumber || generateOrderNumber(), paymentMethod: state.nfES.paymentMethod || 'transferencia',
        status: deriveStatus(state.nfES.paymentMethod || 'transferencia', state.nfES.pixPaid ?? false, state.nfES.total),
      });
    }
    if (infos.length === 0) {
      const legacyTotal = state.grandTotal || state.total || 8008.98;
      const pm = state.paymentMethod || 'transferencia';
      infos.push({
        abbr: 'PR', label: 'Filial PR', total: legacyTotal,
        orderNumber: generateOrderNumber(), paymentMethod: pm,
        status: deriveStatus(pm, state.pixPaid ?? false, legacyTotal),
      });
    }
    /* Filtra pra apenas a filial recém-finalizada. Fallback: tudo. */
    if (focusedNf && infos.some(i => i.abbr === focusedNf)) {
      return infos.filter(i => i.abbr === focusedNf);
    }
    return infos;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [nfs, setNfs] = useState<NfInfo[]>(initialNfs);
  const grandTotal = state.grandTotal || nfs.reduce((s, n) => s + n.total, 0);

  const pendingPixNfs = nfs.filter(n => n.status === 'pending-pix');
  const pendingAsyncNfs = nfs.filter(n => n.status === 'pending-async');
  const paidNfs = nfs.filter(n => n.status === 'paid');
  const allPaid = nfs.every(n => n.status === 'paid');
  const hasBlockingPix = pendingPixNfs.length > 0;
  const totalNfs = nfs.length;

  const activePixIndex = hasBlockingPix
    ? nfs.findIndex(n => n.status === 'pending-pix')
    : -1;

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    nfs.forEach((n, idx) => {
      if (hasBlockingPix) {
        init[n.abbr] = idx === activePixIndex;
      } else {
        init[n.abbr] = n.status !== 'paid' || nfs.length === 1;
      }
    });
    return init;
  });

  /* PIX countdown logic — preserved from previous version */
  const PIX_VALIDITY_SECONDS = 15 * 60;
  const PIX_AUTO_CONFIRM_SECONDS = 12;
  const [pixTimers, setPixTimers] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    nfs.forEach(n => { if (n.status === 'pending-pix') init[n.abbr] = PIX_VALIDITY_SECONDS; });
    return init;
  });

  useEffect(() => {
    if (!hasBlockingPix || activePixIndex < 0) return;
    const activeAbbr = nfs[activePixIndex].abbr;
    if (pixTimers[activeAbbr] === undefined || pixTimers[activeAbbr] <= 0) return;
    const id = setInterval(() => {
      setPixTimers(prev => ({ ...prev, [activeAbbr]: Math.max(0, (prev[activeAbbr] ?? 0) - 1) }));
    }, 1000);
    return () => clearInterval(id);
  }, [hasBlockingPix, activePixIndex, nfs, pixTimers]);

  useEffect(() => {
    if (!hasBlockingPix || activePixIndex < 0) return;
    const activeAbbr = nfs[activePixIndex].abbr;
    const elapsed = PIX_VALIDITY_SECONDS - (pixTimers[activeAbbr] ?? PIX_VALIDITY_SECONDS);
    if (elapsed >= PIX_AUTO_CONFIRM_SECONDS) {
      setNfs(prev => prev.map(n => n.abbr === activeAbbr ? { ...n, status: 'paid' as NfStatus } : n));
      setExpanded(prev => {
        const next = { ...prev, [activeAbbr]: false };
        const remaining = nfs.find(n => n.abbr !== activeAbbr && n.status === 'pending-pix');
        if (remaining) next[remaining.abbr] = true;
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixTimers, activePixIndex, hasBlockingPix]);

  /* Inject keyframes once */
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('success-pulse-kf')) return;
    const style = document.createElement('style');
    style.id = 'success-pulse-kf';
    style.textContent = `
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pingRing {
        0%   { transform: scale(1);   opacity: 0.7; }
        80%  { transform: scale(1.5); opacity: 0;   }
        100% { transform: scale(1.5); opacity: 0;   }
      }
      @keyframes successPop {
        0%   { transform: scale(0.6); opacity: 0; }
        60%  { transform: scale(1.08); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes ringOrbit {
        0%   { transform: rotate(0deg);   opacity: 1; }
        100% { transform: rotate(360deg); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const toggleExpand = (abbr: 'PR' | 'ES') => {
    setExpanded(prev => ({ ...prev, [abbr]: !prev[abbr] }));
  };

  /* ── Hero copy ── */
  const heroText = (() => {
    if (allPaid) return {
      kicker: totalNfs > 1 ? `${totalNfs} PEDIDOS · CONFIRMADOS` : 'PEDIDO · CONFIRMADO',
      title:  totalNfs > 1 ? 'Pedidos confirmados!' : 'Pedido confirmado!',
      sub:    totalNfs > 1 ? 'Os pedidos seguem para separação.' : 'Seu pedido segue para separação.',
      tone: 'success' as const,
    };
    if (hasBlockingPix) return {
      kicker: 'PEDIDO · AGUARDANDO PIX',
      title:  totalNfs > 1 ? 'Falta pouco para concluir' : 'Aguardando seu PIX',
      sub:    pendingPixNfs.length === 1 && totalNfs > 1
        ? `Finalize o pagamento da ${pendingPixNfs[0].label} para concluir.`
        : pendingPixNfs.length > 1
          ? `Finalize o pagamento das ${pendingPixNfs.length} filiais para concluir.`
          : 'Escaneie o QR Code abaixo no seu app bancário.',
      tone: 'warning' as const,
    };
    return {
      kicker: 'PEDIDO · EM ANÁLISE',
      title:  totalNfs > 1 ? 'Pedidos em análise de crédito' : 'Pedido em análise de crédito',
      sub:    'Assim que a análise for aprovada, o pedido segue para separação.',
      tone: 'primary' as const,
    };
  })();

  const heroBg =
    heroText.tone === 'success' ? 'var(--success)' :
    heroText.tone === 'warning' ? 'var(--warning)' :
    'var(--primary)';

  /* ── Timeline current stage — adapta entre entrega (CIF/FOB) vs retirada.
        Wellington (UAT): cliente precisa acompanhar "confirmado → separado → pronto pra retirada"
        sem ligar pra perguntar. Quando todas as NFs são retirada, troca "Em rota" por
        "Pronto para retirada" e "Entregue" por "Retirado". ── */
  const allRetirada = (() => {
    const types = [state.nfPR?.logisticsType, state.nfES?.logisticsType].filter(Boolean);
    return types.length > 0 && types.every(t => t === 'retirada');
  })();

  const stages: TimelineStage[] = useMemo(() => allRetirada ? ([
    { key: 'recebido',     label: 'Pedido recebido',      icon: <IconCheck size={18} /> },
    { key: 'separacao',    label: 'Em separação',         icon: <IconBox size={18} /> },
    { key: 'nf',           label: 'NF emitida',           sub: 'após separação', icon: <IconNfDoc size={18} /> },
    { key: 'pronto',       label: 'Pronto para retirada', sub: 'aguardando você', icon: <IconBox size={18} /> },
    { key: 'retirado',     label: 'Retirado',             icon: <IconHome size={18} /> },
  ]) : ([
    { key: 'recebido',  label: 'Pedido recebido',  icon: <IconCheck size={18} /> },
    { key: 'separacao', label: 'Em separação',     icon: <IconBox size={18} /> },
    { key: 'nf',        label: 'NF emitida',       sub: 'após separação', icon: <IconNfDoc size={18} /> },
    { key: 'rota',      label: 'Em rota',          sub: '3–5 dias úteis', icon: <IconRoute size={18} /> },
    { key: 'entregue',  label: 'Entregue',         icon: <IconHome size={18} /> },
  ]), [allRetirada]);

  const pendingStage: TimelineStage = hasBlockingPix
    ? { key: 'pagamento', label: 'Pagamento', sub: 'aguardando', icon: <IconClock size={18} /> }
    : { key: 'analise', label: 'Análise de crédito', sub: 'em andamento', icon: <IconClock size={18} /> };

  const timelineStages = allPaid
    ? stages
    : [stages[0], pendingStage, ...stages.slice(1)];

  const currentTimelineIdx = allPaid ? 1 : 1;

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', fontFamily: 'var(--font-red-hat-display)' }}>
      {/* ═════════ HERO BAND ═════════ */}
      <div className="relative overflow-hidden" style={{ background: 'var(--foreground)' }}>
        {/* Decorative dotted pattern (subtle, not the typical AI tinted card) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at center, var(--primary-foreground) 1px, transparent 1.5px)',
            backgroundSize: '22px 22px',
          }} />
        <div className="max-w-[960px] mx-auto px-4 md:px-6 pt-8 pb-14 md:pt-10 md:pb-16 flex flex-col items-center text-center relative">
          {/* Big icon hero — solid colored circle, double ring orbit */}
          <div className="relative mb-6" style={{ width: 96, height: 96, animation: 'successPop 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
            {/* Outer ring */}
            <span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: `2px dashed ${heroBg}`, opacity: 0.35, animation: 'ringOrbit 14s linear infinite' }}
            />
            {/* Inner solid circle */}
            <span
              className="absolute inset-[8px] rounded-full flex items-center justify-center"
              style={{ background: heroBg, color: 'var(--primary-foreground)', boxShadow: `0 14px 40px ${heroBg === 'var(--success)' ? 'rgba(76,217,100,0.4)' : heroBg === 'var(--warning)' ? 'rgba(255,164,0,0.4)' : 'rgba(0,90,255,0.4)'}` }}
            >
              {allPaid && <IconCheck size={42} />}
              {!allPaid && hasBlockingPix && <PixIcon size={36} color="var(--primary-foreground)" />}
              {!allPaid && !hasBlockingPix && <IconClock size={42} />}
            </span>
          </div>

          <span className="block mb-1.5" style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '2px' }}>
            {heroText.kicker}
          </span>

          <h1 className="m-0 mb-3" style={{ fontSize: 'clamp(28px, 5vw, var(--text-4xl))', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.1 }}>
            {heroText.title}
          </h1>

          <p className="m-0 max-w-[520px]" style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.5 }}>
            {heroText.sub}
          </p>

          {/* Order chip(s) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {nfs.map(nf => (
              <span key={nf.abbr}
                className="inline-flex items-center gap-2 rounded-full pl-1.5 pr-3 h-8"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                <NfBadge filial={nf.abbr} size={20} />
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', fontVariantNumeric: 'tabular-nums' }}>
                  {nf.orderNumber}
                </span>
                <button
                  onClick={() => navigator.clipboard?.writeText(nf.orderNumber)}
                  className="bg-transparent border-none cursor-pointer p-0 -mr-1 hover:opacity-70 transition-opacity"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                  aria-label={`Copiar ${nf.orderNumber}`}
                >
                  <IconCopy size={12} />
                </button>
              </span>
            ))}
          </div>

          {pendingPixNfs.length > 1 && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,164,0,0.15)', border: '1px solid rgba(255,164,0,0.4)' }}>
              <IconClock size={12} color="var(--warning)" />
              <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--warning)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px' }}>
                ETAPA {paidNfs.length + 1} DE {totalNfs} · PAGUE A {pendingPixNfs[0].label.toUpperCase()} PARA CONTINUAR
              </span>
            </div>
          )}

          {/* Hero CTA removido — banner "Próximo passo" abaixo do hero cumpre o papel. */}
        </div>
      </div>

      {/* ═════════ NEXT-STEP BANNER — logo após hero, prioriza fechamento da outra filial.
            Posicionado aqui (não no rodapé) pra ser o 1º elemento que o usuário vê após
            ler "pedido pago". Usa cor da filial pendente pra reforçar identidade. ═════════ */}
      {hasPendingOrder && activeNf && (
        <div className="max-w-[960px] mx-auto px-4 md:px-6 -mt-8 relative z-[2]">
          <div className="rounded-2xl px-5 md:px-7 py-5 md:py-6 flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-5"
            style={{
              background: NF_COLORS[activeNf],
              boxShadow: `0 24px 50px ${activeNf === 'PR' ? 'rgba(26,60,110,0.35)' : 'rgba(91,45,142,0.35)'}`,
            }}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="rounded-xl flex items-center justify-center shrink-0"
                style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.18)', color: 'var(--primary-foreground)' }}>
                <IconBox size={22} />
              </span>
              <div className="flex-1 min-w-0">
                <span className="block" style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'rgba(255,255,255,0.78)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '1.2px' }}>
                  PRÓXIMO PASSO
                </span>
                <span className="block mt-0.5" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.2 }}>
                  Finalize o pedido da Filial {activeNf}
                </span>
                <span className="block mt-0.5" style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.82)', fontFamily: 'var(--font-red-hat-display)' }}>
                  Os itens restantes seguem aguardando seu pagamento.
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/carrinho')}
              className="h-12 px-6 rounded-xl border-none cursor-pointer hover:opacity-95 hover:translate-y-[-1px] transition-all inline-flex items-center justify-center gap-2 shrink-0"
              style={{ background: 'var(--primary-foreground)', color: NF_COLORS[activeNf], fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.2px', boxShadow: '0 12px 28px rgba(0,0,0,0.18)' }}>
              Fechar pedido agora
              <IconArrowRight size={16} color={NF_COLORS[activeNf]} />
            </button>
          </div>
        </div>
      )}

      {/* ═════════ TIMELINE STRIP — overlapping hero edge ═════════ */}
      <div className={`max-w-[960px] mx-auto px-4 md:px-6 relative z-[1] ${hasPendingOrder && activeNf ? 'mt-6' : '-mt-12'}`}>
        <div className="rounded-2xl px-5 md:px-8 py-6"
          style={{ background: 'var(--card)', border: '1px solid var(--muted)', boxShadow: '0 18px 40px rgba(13,29,82,0.12)' }}>
          <div className="flex items-center gap-2 mb-5">
            <FilledSquareIcon color="var(--primary)" size={28}>
              <IconRoute size={14} />
            </FilledSquareIcon>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
              Acompanhe seu pedido
            </span>
            <span className="ml-auto" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Etapa {currentTimelineIdx + 1} de {timelineStages.length}
            </span>
          </div>
          <OrderTimeline stages={timelineStages} currentIdx={currentTimelineIdx} />

          {/* Consultor info — integrado ao card de timeline como footer row.
              Slim, 1 linha + sub, chip de status "ATIVO" pra destaque sutil. */}
          {state.wantConsultor && (
            <div className="mt-5 pt-4 flex items-center gap-3"
              style={{ borderTop: '1px solid var(--muted)' }}>
              <span className="rounded-lg flex items-center justify-center shrink-0"
                style={{ width: 34, height: 34, background: 'var(--primary-surface-md)', color: 'var(--primary)' }}>
                <IconChat size={16} />
              </span>
              <div className="flex-1 min-w-0">
                <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                  Seu consultor entrará em contato
                </span>
                <span className="block" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.4 }}>
                  Notificação enviada — fala com você em breve sobre este pedido.
                </span>
              </div>
              <span className="rounded-full px-2.5 py-1 shrink-0 inline-flex items-center gap-1.5"
                style={{ background: 'var(--primary-surface-sm)', color: 'var(--primary)' }}>
                <span aria-hidden="true" className="rounded-full" style={{ width: 6, height: 6, background: 'var(--primary)', animation: 'pulse 1.8s ease-in-out infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px' }}>
                  ATIVO
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ═════════ DETALHES DO PEDIDO — full width ═════════ */}
      <div className="max-w-[960px] mx-auto px-4 md:px-6 mt-8 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <FilledSquareIcon color="var(--foreground)" size={28}>
            <IconNfDoc size={14} />
          </FilledSquareIcon>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
            Detalhes {totalNfs > 1 ? 'dos pedidos' : 'do pedido'}
          </span>
          {totalNfs > 1 && (
            <span className="ml-auto" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
              Total: <strong style={{ color: 'var(--foreground)' }}>{formatCurrency(grandTotal)}</strong>
            </span>
          )}
        </div>
        <div className="flex flex-col gap-4">
          {nfs.map((nf, idx) => {
            const isOpen = expanded[nf.abbr];
            const isBlocked = hasBlockingPix && nf.status === 'pending-pix' && idx !== activePixIndex;
            const isActivePix = hasBlockingPix && idx === activePixIndex;
            return (
              <ReceiptCard
                key={nf.abbr}
                nf={nf}
                isOpen={isOpen}
                isBlocked={isBlocked}
                onToggle={() => toggleExpand(nf.abbr)}
                validityDate={validityDate}
                pixTimer={pixTimers[nf.abbr] ?? PIX_VALIDITY_SECONDS}
                isActivePix={isActivePix}
              />
            );
          })}
        </div>
      </div>

      {/* ═════════ PRÓXIMOS PASSOS — row horizontal abaixo ═════════ */}
      <div className="max-w-[960px] mx-auto px-4 md:px-6 mt-10 pb-2">
        <div className="flex items-center gap-2 mb-4">
          <FilledSquareIcon color="var(--foreground)" size={28}>
            <IconBox size={14} />
          </FilledSquareIcon>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
            Próximos passos
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <NextStepCard
            icon={<IconNfDoc size={18} />} iconBg="var(--primary)"
            title="NF chega por email"
            sub="Em até 24h após pagamento confirmado."
          />
          <NextStepCard
            icon={<IconTruck size={18} />} iconBg="var(--accent)"
            title="Acompanhe a entrega"
            sub="Código de rastreio assim que sair da filial."
            cta={{ label: 'Rastrear', onClick: () => {} }}
          />
          <NextStepCard
            icon={<IconShield size={18} />} iconBg="var(--success)"
            title="Garantia 12 meses"
            sub="Cobertura de fábrica para todos os itens."
          />
          <NextStepCard
            icon={<IconWhatsapp size={18} />} iconBg="#25D366"
            title="Suporte WhatsApp"
            sub="Time Oderço em horário comercial."
            cta={{ label: 'Falar agora', onClick: () => {} }}
          />
        </div>
      </div>

      {/* Banner "Próximo passo" foi movido pra logo após o hero band — fica acima da timeline,
            pra que seja o 1º elemento de ação visível após o usuário ler "pedido pago". */}

      <div className="max-w-[960px] mx-auto px-4 md:px-6 pb-14 pt-6 flex justify-center gap-3">
        {hasPendingOrder ? (
          <button
            className="h-10 px-4 rounded-lg cursor-pointer hover:opacity-70 transition-opacity inline-flex items-center justify-center gap-2"
            style={{ background: 'transparent', border: 'none', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}
            onClick={() => navigate('/')}>
            <IconStore size={13} /> Voltar à loja sem finalizar Filial {activeNf}
          </button>
        ) : (
          <>
            <button
              className="h-11 px-5 rounded-lg cursor-pointer hover:opacity-80 transition-opacity inline-flex items-center justify-center gap-2"
              style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-red-hat-display)' }}
              onClick={() => { resetCompleted(); navigate('/'); }}>
              <IconStore size={15} /> Voltar à loja
            </button>
            <button
              className="h-11 px-5 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-red-hat-display)' }}>
              <IconNfDoc size={15} /> Visualizar pedido completo
            </button>
          </>
        )}
      </div>

      {hasBlockingPix && (
        <span className="block text-center pb-8 px-4" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontStyle: 'italic' }}>
          Você pode sair desta página e retornar pelo menu "Meus Pedidos" para finalizar os pagamentos pendentes.
        </span>
      )}
    </div>
  );
}
