import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useCart, type NfKey, type CompletedOrder } from './CartContext';
import { formatCurrency, suggestedProducts } from './cart-data';
import { ProductCard } from './ProductCard';

/* ─── Constants ─── */
const FREE_SHIPPING_THRESHOLD = 800;

const NF_LABEL: Record<NfKey, string> = {
  PR: 'Filial PR',
  ES: 'Filial ES',
};

const FILIAL_FULL_NAME: Record<NfKey, string> = {
  PR: 'Paraná',
  ES: 'Espírito Santo',
};

/* DS Figma — NF é data-field. Aplicar APENAS como acento (badge fill, border-left, accent text).
   Surface do card permanece branco/card padrão para não competir com Brand/Blue/Default. */
const NF_ACCENT: Record<NfKey, { color: string; surfaceTint: string; fg: string }> = {
  PR: { color: 'var(--nf-pr)', surfaceTint: 'var(--nf-pr-surface)', fg: 'var(--nf-pr-fg)' },
  ES: { color: 'var(--nf-es)', surfaceTint: 'var(--nf-es-surface)', fg: 'var(--nf-es-fg)' },
};

/* ─── SVG Icons (DS Figma — stroke 1.5-2, currentColor) ─── */
function TrashIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" />
      <rect x="5" y="6" width="14" height="14" rx="1.5" />
      <line x1="10" y1="11" x2="10" y2="16" />
      <line x1="14" y1="11" x2="14" y2="16" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7H11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 2.5V11.5M2.5 7H11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ShoppingBagIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TruckIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function InfoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function NumberedDot({ n, state }: { n: number; state: 'active' | 'pending' | 'done' }) {
  const bg = state === 'active' || state === 'done' ? 'var(--primary)' : 'var(--muted)';
  const fg = state === 'active' || state === 'done' ? 'var(--primary-foreground)' : 'var(--muted-foreground)';
  return (
    <span
      className="inline-flex items-center justify-center rounded-full shrink-0"
      style={{ width: 22, height: 22, background: bg, color: fg, fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}
    >
      {state === 'done' ? <CheckIcon size={11} /> : n}
    </span>
  );
}

/* ─── NF Badge (DS Figma — square 22×22 radius 4, accent fill) ─── */
function NfBadge({ nf, size = 'sm' }: { nf: NfKey; size?: 'sm' | 'md' }) {
  const sz = size === 'md' ? { width: 28, height: 28, fontSize: 11 } : { width: 22, height: 22, fontSize: 10 };
  const accent = NF_ACCENT[nf];
  return (
    <span
      className="rounded flex items-center justify-center shrink-0"
      style={{
        ...sz,
        background: accent.color,
        color: accent.fg,
        fontWeight: 'var(--font-weight-bold)',
        fontFamily: 'var(--font-red-hat-display)',
        letterSpacing: '0.3px',
      }}
    >
      {nf}
    </span>
  );
}

/* ─── Toast notification ─── */
interface ToastItem { id: number; name: string; onUndo: () => void; }
function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{ background: 'var(--foreground)', color: 'var(--primary-foreground)', minWidth: 280, maxWidth: 360, boxShadow: 'var(--elevation-sm)', fontFamily: 'var(--font-red-hat-display)' }}
    >
      <span style={{ color: 'var(--destructive-foreground)' }}><TrashIcon /></span>
      <span className="flex-1 block" style={{ fontSize: 'var(--text-xs)', lineHeight: '1.4' }}>
        Produto removido
      </span>
      <button
        onClick={toast.onUndo}
        className="shrink-0 rounded px-2 py-1 border-none cursor-pointer"
        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)' }}
      >
        Desfazer
      </button>
      <button onClick={() => onDismiss(toast.id)} className="bg-transparent border-none cursor-pointer p-0" style={{ color: 'var(--foreground-on-dark-muted)' }}>
        <XIcon />
      </button>
    </div>
  );
}

/* ─── Quantity Stepper (DS Figma) ─── */
function QuantityStepper({ value, onChange, disabled = false }: { value: number; onChange: (v: number) => void; disabled?: boolean }) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!editing) setInputVal(String(value)); }, [value, editing]);
  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  const commit = () => {
    const n = parseInt(inputVal, 10);
    if (!isNaN(n) && n >= 1) onChange(n);
    else setInputVal(String(value));
    setEditing(false);
  };

  return (
    <div
      className="flex items-center rounded-lg overflow-hidden shrink-0"
      style={{ border: '1px solid var(--muted)', background: 'var(--card)', height: 36, opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
    >
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex items-center justify-center border-none cursor-pointer transition-all"
        style={{ width: 32, height: 36, background: 'transparent', color: value <= 1 ? 'var(--muted-foreground)' : 'var(--foreground)' }}
        aria-label="Diminuir"
      >
        <MinusIcon />
      </button>
      <div
        className="flex items-center justify-center"
        style={{ borderLeft: '1px solid var(--muted)', borderRight: '1px solid var(--muted)', width: 40, height: 36 }}
        onClick={() => setEditing(true)}
      >
        {editing ? (
          <input
            ref={inputRef}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onBlur={commit}
            onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setInputVal(String(value)); setEditing(false); } }}
            className="w-full text-center border-none outline-none bg-transparent"
            style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}
            autoFocus
          />
        ) : (
          <span
            className="block cursor-pointer select-none"
            style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}
          >
            {value}
          </span>
        )}
      </div>
      <button
        onClick={() => onChange(value + 1)}
        className="flex items-center justify-center border-none cursor-pointer transition-all"
        style={{ width: 32, height: 36, background: 'transparent', color: 'var(--primary)' }}
        aria-label="Aumentar"
      >
        <PlusIcon />
      </button>
    </div>
  );
}

/* ─── Unit Type Selector ─── */
const UNIT_TYPES = ['Item', 'Caixa mãe', 'Caixa', 'Pack', 'Unidade'];
function UnitTypeSelector({ value, onChange, disabled = false }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0" style={{ minWidth: 110, opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 h-9 border-none cursor-pointer w-full"
        style={{ background: 'var(--background)', border: '1px solid var(--muted)', color: 'var(--foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)' }}
      >
        <span className="flex-1 text-left truncate">{value}</span>
        <ChevronDownIcon size={14} />
      </button>
      {open && (
        <div
          className="absolute z-20 left-0 mt-1 rounded-lg overflow-hidden"
          style={{ top: '100%', background: 'var(--card)', border: '1px solid var(--muted)', boxShadow: 'var(--dropdown-shadow)', minWidth: '100%' }}
        >
          {UNIT_TYPES.map(u => (
            <button
              key={u}
              onClick={() => { onChange(u); setOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 border-none cursor-pointer text-left transition-colors hover:bg-muted"
              style={{ background: u === value ? 'var(--primary-surface-sm)' : 'transparent', color: 'var(--foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)' }}
            >
              {u === value && <span style={{ color: 'var(--primary)' }}><CheckIcon /></span>}
              {u !== value && <span style={{ width: 14 }} />}
              {u}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Coupon Input ─── */
const VALID_COUPONS: Record<string, { discount: number; label: string }> = {
  'ODERÇO10':       { discount: 0.10, label: '−10%' },
  'PRIMEIRACOMPRA': { discount: 0.07, label: '−7%' },
};

interface CouponSectionProps {
  appliedCode: string;
  onApply: (code: string) => void;
  onRemove: () => void;
}

function CouponSection({ appliedCode, onApply, onRemove }: CouponSectionProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const apply = () => {
    const upper = code.trim().toUpperCase();
    if (VALID_COUPONS[upper]) {
      onApply(upper);
      setError('');
    } else {
      setError('Cupom inválido ou expirado');
    }
  };

  const handleRemove = () => { onRemove(); setCode(''); };

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 w-full border-none bg-transparent cursor-pointer py-1"
        style={{ color: 'var(--primary)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}
      >
        <TagIcon />
        <span>Adicionar cupom de desconto</span>
        <span className="ml-auto" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <ChevronDownIcon size={14} />
        </span>
      </button>

      {open && (
        <div className="mt-2">
          {appliedCode ? (
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ background: 'var(--success-surface)', border: '1px solid var(--success)' }}
            >
              <span style={{ color: 'var(--success)' }}><CheckIcon /></span>
              <span className="flex-1 block" style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)', color: 'var(--success)' }}>
                {appliedCode} aplicado — {VALID_COUPONS[appliedCode]?.label}
              </span>
              <button onClick={handleRemove} className="bg-transparent border-none cursor-pointer p-0" style={{ color: 'var(--muted-foreground)' }}>
                <XIcon />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
                placeholder="Código do cupom"
                onKeyDown={e => e.key === 'Enter' && apply()}
                className="flex-1 rounded-lg px-3 h-9 outline-none"
                style={{
                  background: 'var(--input-background)',
                  border: `1px solid ${error ? 'var(--destructive-foreground)' : 'var(--muted)'}`,
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-red-hat-display)',
                }}
              />
              <button
                onClick={apply}
                disabled={!code.trim()}
                className="rounded-lg px-3 h-9 border-none cursor-pointer transition-opacity disabled:opacity-40"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}
              >
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
      )}
    </div>
  );
}

/* ─── Product Row ─── */
interface ProductRowProps {
  product: ReturnType<typeof useCart>['items'][0];
  onRemove: (id: string, name: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onUpdateUnit: (id: string, unit: string) => void;
  locked: boolean;
}

function ProductRow({ product, onRemove, onUpdateQty, onUpdateUnit, locked }: ProductRowProps) {
  const [hovered, setHovered] = useState(false);
  const hasDiscountPrice = !!product.oldPrice && product.oldPrice > product.price;
  const lineSubtotal = product.price * product.quantity;
  const lineOriginalSubtotal = hasDiscountPrice ? (product.oldPrice || 0) * product.quantity : 0;
  const lineIpi = lineSubtotal * 0.07;
  const lineSt = lineSubtotal * 0.13;
  const discountPercent = hasDiscountPrice
    ? Math.round((((product.oldPrice || product.price) - product.price) / (product.oldPrice || product.price)) * 100)
    : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col sm:flex-row items-start gap-4 px-5 py-4 transition-colors relative"
      style={{
        background: hovered && !locked ? 'var(--primary-surface-xs)' : 'transparent',
      }}
    >
      {/* Image */}
      <div
        className="relative w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] shrink-0 rounded-xl overflow-hidden"
        style={{
          background: 'var(--background)',
          border: '1px solid var(--muted)',
          boxShadow: hovered && !locked ? '0 6px 16px rgba(13,29,82,0.10)' : 'none',
          transition: 'box-shadow 0.2s',
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
          style={{ transform: hovered && !locked ? 'scale(1.06)' : 'scale(1)' }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {/* Name + meta */}
        <div>
          <span
            className="block leading-snug"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--foreground)',
              fontFamily: 'var(--font-red-hat-display)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </span>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span
              className="inline-flex items-center rounded px-2 py-0.5"
              style={{ background: 'var(--muted)', color: 'var(--foreground)', fontSize: 9, fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '0.6px' }}
            >
              {product.brand}
            </span>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
              SKU <span style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-bold)', fontVariantNumeric: 'tabular-nums' }}>{product.sku}</span>
            </span>
            {hasDiscountPrice ? (
              <span className="inline-flex items-center gap-1.5 flex-wrap" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                <span style={{ textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>
                  De {formatCurrency(product.oldPrice || 0)}
                </span>
                <span style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-bold)', fontVariantNumeric: 'tabular-nums' }}>
                  por {formatCurrency(product.price)}
                </span>
                <span className="rounded px-1.5 py-0.5" style={{ background: 'var(--success-surface)', color: 'var(--success)', fontSize: 9, fontWeight: 'var(--font-weight-bold)' }}>
                  -{discountPercent}%
                </span>
              </span>
            ) : (
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-bold)', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(product.price)}</span> / un
              </span>
            )}
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2 flex-wrap">
          <QuantityStepper value={product.quantity} onChange={v => onUpdateQty(product.id, v)} disabled={locked} />
          <UnitTypeSelector value={product.unitType} onChange={v => onUpdateUnit(product.id, v)} disabled={locked} />
          {!locked && (
            <button
              onClick={() => onRemove(product.id, product.name)}
              className="flex items-center justify-center rounded-lg h-9 w-9 border-none cursor-pointer transition-all"
              style={{
                background: hovered ? 'var(--destructive-foreground)' : 'transparent',
                color: hovered ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                border: hovered ? 'none' : '1px solid var(--muted)',
              }}
              title="Remover produto"
              aria-label="Remover produto"
            >
              <TrashIcon size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Right: line total + per-item IPI/ST inline */}
      <div className="flex flex-col items-end gap-0.5 shrink-0 w-full sm:w-auto sm:min-w-[120px] text-right">
        {hasDiscountPrice && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums', textDecoration: 'line-through', lineHeight: 1.1 }}>
            {formatCurrency(lineOriginalSubtotal)}
          </span>
        )}
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
          {formatCurrency(lineSubtotal)}
        </span>
        <span className="block mt-1" style={{ fontSize: 9, color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.4, letterSpacing: '0.2px' }}>
          IPI: <span style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-bold)' }}>{formatCurrency(lineIpi)}</span>
        </span>
        <span style={{ fontSize: 9, color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.4, letterSpacing: '0.2px' }}>
          ST: <span style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-bold)' }}>{formatCurrency(lineSt)}</span>
        </span>
      </div>

      {/* Bottom dotted divider */}
      <div className="absolute left-5 right-5 bottom-0 pointer-events-none"
        style={{ height: 1, background: 'repeating-linear-gradient(to right, var(--muted) 0 4px, transparent 4px 8px)' }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ORDER CARD — pedido por NF, modelo seletor
   - User escolhe qual NF ativar (radio)
   - Sidebar reflete a NF selecionada
   - Sem total/CTA dentro do card (só sidebar)
   - IPI/ST inline por produto
══════════════════════════════════════════════ */
type OrderState = 'pending' | 'completed';

interface OrderCardProps {
  index: number;
  total: number;
  nf: NfKey;
  state: OrderState;
  isSelected: boolean;
  items: ReturnType<typeof useCart>['items'];
  completedOrder?: CompletedOrder;
  onSelect: () => void;
  onRemove: (id: string, name: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onUpdateUnit: (id: string, unit: string) => void;
  onAddMore: () => void;
}

function OrderCard({
  index, total, nf, state, isSelected, items, completedOrder,
  onSelect, onRemove, onUpdateQty, onUpdateUnit, onAddMore,
}: OrderCardProps) {
  const [collapsed, setCollapsed] = useState(state === 'completed');
  const accent = NF_ACCENT[nf];
  const isCompleted = state === 'completed';

  useEffect(() => {
    if (state === 'completed') setCollapsed(true);
  }, [state]);

  const itemsCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const hasFreeship = subtotal >= FREE_SHIPPING_THRESHOLD;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountLeft = FREE_SHIPPING_THRESHOLD - subtotal;

  /* Visual tokens — minimal, neutro. Selected = primary thin border + soft surface
     (sem strip 4px lateral, sem glow saturado). Hierarquia: selecionado destaca por
     surface tinta sutil + check radio, não por cores fortes. */
  const cardBorder =
    isSelected && !isCompleted ? 'var(--primary)' :
                                 'var(--muted)';
  const cardShadow = 'var(--elevation-sm)';

  return (
    <div
      className="rounded-2xl overflow-hidden relative transition-all"
      style={{
        background: 'var(--card)',
        border: `1px solid ${cardBorder}`,
        boxShadow: cardShadow,
      }}
    >
      {/* ═══ Card header — clickable selector ═══ */}
      <button
        type="button"
        onClick={isCompleted ? () => setCollapsed(c => !c) : onSelect}
        className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors border-none"
        style={{
          background: isSelected && !isCompleted
            ? 'var(--primary-surface-xs)'
            : 'transparent',
          textAlign: 'left',
        }}
      >
        {/* Radio removido — cada OrderCard tem CTA próprio no summary lateral, seleção perdeu papel. */}

        {/* NF badge */}
        <NfBadge nf={nf} size="md" />

        {/* Title block */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.6px', textTransform: 'uppercase', lineHeight: 1 }}>
              Pedido {index} de {total}
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
                style={{ background: 'var(--success-surface)', color: 'var(--success)', fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
                <CheckIcon size={10} /> CONCLUÍDO
              </span>
            )}
          </div>
          <span className="block mt-1" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.1 }}>
            {NF_LABEL[nf]}
            {isCompleted && completedOrder && (
              <span className="ml-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)' }}>
                {completedOrder.orderNumber}
              </span>
            )}
          </span>
          <span className="block mt-0.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            {isCompleted && completedOrder
              ? <>Pago {formatCurrency(completedOrder.total)} via {completedOrder.paymentMethod}</>
              : <>{itemsCount} {itemsCount === 1 ? 'item' : 'itens'}</>}
          </span>
        </div>

        {/* Right-side affordance */}
        {isCompleted && (
          <div className="shrink-0"
            style={{ color: 'var(--muted-foreground)', transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}>
            <ChevronDownIcon />
          </div>
        )}
      </button>

      {/* ═══ Body ═══ */}
      {!collapsed && !isCompleted && (
        <>
          {/* Free-shipping band — neutro/warning quando pendente, success quando ok.
               Sem NF accent (azul/roxo escuro polui hierarquia). */}
          {items.length > 0 && (
            <div className="px-5 pt-3">
              <div className="rounded-xl flex items-center gap-3 px-4 py-2.5"
                style={{
                  background: hasFreeship ? 'var(--success-surface)' : 'var(--background)',
                  border: `1px solid ${hasFreeship ? 'var(--success)' : 'var(--muted)'}`,
                }}>
                <span className="rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    width: 30, height: 30,
                    background: hasFreeship ? 'var(--success)' : 'var(--muted)',
                    color: hasFreeship ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  }}>
                  <TruckIcon size={15} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span style={{ fontSize: 'var(--text-2xs)', color: hasFreeship ? 'var(--success)' : 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}>
                      {hasFreeship
                        ? 'Frete grátis garantido nesta filial'
                        : <>Faltam <span style={{ color: 'var(--warning-foreground)', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(amountLeft)}</span> para frete grátis</>}
                    </span>
                    <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full h-[5px] rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        background: hasFreeship ? 'var(--success)' : 'var(--warning)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products list */}
          <div className="pt-2 pb-2">
            {items.map(product => (
              <ProductRow
                key={product.id}
                product={product}
                onRemove={onRemove}
                onUpdateQty={onUpdateQty}
                onUpdateUnit={onUpdateUnit}
                locked={false}
              />
            ))}
          </div>
        </>
      )}

      {/* ═══ Completed: recap row ═══ */}
      {isCompleted && completedOrder && !collapsed && (
        <div className="px-5 py-4 flex items-center gap-3"
          style={{ borderTop: '1px solid var(--muted)', background: 'var(--card)' }}>
          <span className="rounded-lg flex items-center justify-center shrink-0"
            style={{ width: 36, height: 36, background: 'var(--success)', color: 'var(--primary-foreground)' }}>
            <CheckIcon size={18} />
          </span>
          <div className="flex-1 min-w-0">
            <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)' }}>
              Pedido confirmado
            </span>
            <span className="block" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
              {completedOrder.orderNumber} · {completedOrder.paymentMethod} · Total <strong style={{ color: 'var(--foreground)' }}>{formatCurrency(completedOrder.total)}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Suggested Products Carousel ─── */
function SuggestedCarousel() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();
    return () => el.removeEventListener('scroll', updateArrows);
  }, [updateArrows]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {canLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-4 flex items-center justify-center rounded-full border-none cursor-pointer transition-opacity hover:opacity-90"
          style={{ width: 36, height: 36, background: 'var(--card)', border: '1px solid var(--muted)', color: 'var(--foreground)', boxShadow: 'var(--elevation-sm)' }}
        >
          <ChevronLeftIcon />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {suggestedProducts.map(product => (
          <div key={product.id} style={{ minWidth: 220, maxWidth: 240 }}>
            <ProductCard
              {...product}
              showHeart
              onNavigate={() => navigate('/produto/' + product.id)}
            />
          </div>
        ))}
      </div>

      {canRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 flex items-center justify-center rounded-full border-none cursor-pointer transition-opacity hover:opacity-90"
          style={{ width: 36, height: 36, background: 'var(--card)', border: '1px solid var(--muted)', color: 'var(--foreground)', boxShadow: 'var(--elevation-sm)' }}
        >
          <ChevronRightIcon />
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   VARIANT SWITCHER — toggle discreto entre layouts
═══════════════════════════════════════════════ */
type CartVariant = 'classic' | 'choice';

function VariantSwitcher({ value, onChange, disabled }: { value: CartVariant; onChange: (v: CartVariant) => void; disabled?: boolean }) {
  const groupLabel = disabled
    ? 'Alternar layout do carrinho — desativado, apenas 1 filial neste carrinho'
    : 'Alternar layout do carrinho';
  return (
    <div
      role="group"
      aria-label={groupLabel}
      aria-disabled={disabled || undefined}
      className="inline-flex items-center rounded-full p-0.5 shrink-0"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--muted)',
        boxShadow: 'var(--elevation-sm)',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 9, fontFamily: 'var(--font-red-hat-display)', color: 'var(--muted-foreground)', letterSpacing: '0.5px', padding: '0 8px' }}>
        LAYOUT
      </span>
      {(['classic', 'choice'] as const).map((opt) => {
        const isActive = value === opt;
        const variantName = opt === 'classic' ? 'V1 clássico' : 'V2 escolha';
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            aria-pressed={isActive}
            aria-label={`Layout ${variantName}${isActive ? ' — ativo' : ''}`}
            onClick={() => onChange(opt)}
            className="rounded-full border-none cursor-pointer transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              fontSize: 10,
              fontWeight: 'var(--font-weight-bold)',
              fontFamily: 'var(--font-red-hat-display)',
              letterSpacing: '0.4px',
              padding: '4px 10px',
              height: 22,
              outlineColor: 'var(--primary)',
            }}
          >
            {opt === 'classic' ? 'V1' : 'V2'}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════
   CHOICE CARD — V2: cards grandes lado-a-lado pra
   o usuário escolher qual filial finalizar primeiro.
═══════════════════════════════════════════════ */
interface ChoiceCardProps {
  nf: NfKey;
  items: ReturnType<typeof useCart>['items'];
  subtotal: number;
  onSelect: () => void;
}

function ChoiceCard({ nf, items, subtotal, onSelect }: ChoiceCardProps) {
  const [hovered, setHovered] = useState(false);
  const accent = NF_ACCENT[nf];
  const ipi = subtotal * 0.07;
  const stx = subtotal * 0.13;
  const total = subtotal + ipi + stx;
  const itemsCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-3xl transition-all flex flex-col overflow-hidden"
      style={{
        background: 'var(--card)',
        border: `1px solid ${hovered ? accent.color : 'var(--muted)'}`,
        boxShadow: hovered
          ? `0 30px 70px ${nf === 'PR' ? 'rgba(26,60,110,0.22)' : 'rgba(91,45,142,0.22)'}, 0 0 0 1px ${accent.color}`
          : 'var(--elevation-sm)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {/* Decorative gradient band — só visível ao hover, sutil */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none transition-opacity"
        style={{
          height: 140,
          background: `linear-gradient(180deg, ${accent.surfaceTint} 0%, transparent 100%)`,
          opacity: hovered ? 1 : 0.5,
        }}
      />

      {/* Header — filial chip */}
      <div className="relative px-7 pt-7 pb-5 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="rounded-lg flex items-center justify-center"
              style={{ width: 44, height: 44, background: accent.color, color: 'var(--primary-foreground)', fontSize: 14, fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.5px' }}
            >
              {nf}
            </span>
            <div>
              <span className="block" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                Pedido da
              </span>
              <span className="block" style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1 }}>
                {NF_LABEL[nf]}
              </span>
              <span className="block mt-0.5" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                {FILIAL_FULL_NAME[nf]}
              </span>
            </div>
          </div>
        </div>

        {/* Items count chip */}
        <span
          className="rounded-full px-3 py-1.5 shrink-0"
          style={{ background: accent.surfaceTint, border: `1px solid ${accent.color}40`, fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: accent.color, fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}
        >
          {itemsCount} {itemsCount === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {/* Items list — todos itens visíveis, scroll interno se > 4 linhas (~232px).
          Cada linha: thumb 36×36 + nome truncado + qty/preço unitário + subtotal linha. */}
      <div className="relative px-7 pb-5">
        <div className="flex items-center justify-between mb-2.5">
          <span style={{ fontSize: 11, fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '1.2px' }}>
            ITENS DESTE PEDIDO
          </span>
          <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            {items.length} {items.length === 1 ? 'produto' : 'produtos'}
          </span>
        </div>
        <ul
          className="m-0 p-0 flex flex-col"
          style={{
            listStyle: 'none',
            maxHeight: items.length > 4 ? 232 : 'none',
            overflowY: items.length > 4 ? 'auto' : 'visible',
            scrollbarWidth: 'thin',
            scrollbarColor: `${accent.color}55 transparent`,
          }}
        >
          {items.map((p, idx) => (
            <li
              key={p.id}
              className="flex items-center gap-3 py-2"
              style={{
                borderBottom: idx < items.length - 1 ? '1px solid var(--muted)' : 'none',
              }}
            >
              <span
                className="rounded-lg overflow-hidden shrink-0"
                style={{ width: 36, height: 36, border: '1px solid var(--muted)', background: 'var(--background)' }}
              >
                <img src={p.image} alt="" className="w-full h-full object-cover" />
              </span>
              <div className="flex-1 min-w-0">
                <span
                  className="block truncate"
                  style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.3 }}
                  title={p.name}
                >
                  {p.name}
                </span>
                <span
                  className="block"
                  style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums', marginTop: 1 }}
                >
                  {p.quantity} {p.unitType.toLowerCase()}{p.quantity > 1 ? 's' : ''} × {formatCurrency(p.price)}
                </span>
              </div>
              <span
                className="shrink-0"
                style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}
              >
                {formatCurrency(p.price * p.quantity)}
              </span>
            </li>
          ))}
        </ul>
        {items.length > 4 && (
          <span
            className="block mt-2 text-center"
            style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontStyle: 'italic' }}
          >
            ↕ role a lista para ver todos
          </span>
        )}
      </div>

      {/* Breakdown — boa prática AA: 12px+ pra texto financeiro */}
      <div className="relative px-7 py-4" style={{ borderTop: '1px dashed var(--muted)', borderBottom: '1px dashed var(--muted)', background: 'var(--background)' }}>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            <span>Subtotal</span><span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--foreground)', fontWeight: 'var(--font-weight-bold)' }}>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            <span>IPI (7%)</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(ipi)}</span>
          </div>
          <div className="flex justify-between" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            <span>ST (13%)</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(stx)}</span>
          </div>
        </div>
      </div>

      {/* Big total + CTA */}
      <div className="relative px-7 pt-5 pb-7 flex flex-col gap-4 flex-1">
        <div>
          <span className="block" style={{ fontSize: 11, fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '1.5px' }}>
            TOTAL COM IMPOSTOS
          </span>
          <span className="block mt-1" style={{ fontSize: 36, fontWeight: 'var(--font-weight-bold)', color: accent.color, fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {formatCurrency(total)}
          </span>
          <span className="block mt-1.5" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            Frete calculado na próxima etapa
          </span>
        </div>

        <button
          type="button"
          onClick={onSelect}
          aria-label={`Prosseguir para o pagamento da Filial ${nf} — ${FILIAL_FULL_NAME[nf]}, total ${formatCurrency(total)}`}
          className="w-full h-14 rounded-2xl border-none cursor-pointer hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            background: accent.color,
            color: 'var(--primary-foreground)',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-weight-bold)',
            fontFamily: 'var(--font-red-hat-display)',
            letterSpacing: '0.2px',
            outlineColor: accent.color,
            boxShadow: hovered
              ? `0 20px 40px ${nf === 'PR' ? 'rgba(26,60,110,0.45)' : 'rgba(91,45,142,0.45)'}`
              : `0 10px 24px ${nf === 'PR' ? 'rgba(26,60,110,0.30)' : 'rgba(91,45,142,0.30)'}`,
          }}
        >
          Prosseguir com Filial {nf}
          <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN CART PAGE
══════════════════════════════════════════════ */
export function CartPage() {
  const navigate = useNavigate();
  const {
    items, removeItem, updateQuantity, addItem,
    completedOrders, activeNf, nfsInCart, resetCompleted,
  } = useCart();

  const [unitTypes, setUnitTypes] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [appliedCode, setAppliedCode] = useState('');

  /* ── Layout variant (V1 classic | V2 choice) — persistido em localStorage. Switcher
       só faz diferença visual quando há 2 filiais no carrinho. ── */
  const [variant, setVariant] = useState<CartVariant>(() => {
    if (typeof window === 'undefined') return 'classic';
    return (window.localStorage.getItem('cart-variant') as CartVariant) || 'classic';
  });
  useEffect(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem('cart-variant', variant);
  }, [variant]);

  /* ── Selected NF (drives sidebar + CTA) — defaults to activeNf ── */
  const [selectedNf, setSelectedNf] = useState<NfKey | null>(activeNf);

  /* Keep selectedNf valid: if user finalizes selected NF or it disappears, fall back to activeNf */
  useEffect(() => {
    if (!selectedNf || !nfsInCart.includes(selectedNf)) {
      setSelectedNf(activeNf);
    }
  }, [activeNf, nfsInCart, selectedNf]);

  /* ── Scroll to top on mount ── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const onApplyCoupon = (code: string) => setAppliedCode(code);
  const onRemoveCoupon = () => setAppliedCode('');

  /* Group items by filial */
  const itemsByNf = useMemo<Record<NfKey, ReturnType<typeof useCart>['items']>>(() => ({
    PR: items.filter(i => i.filial.includes('PR')),
    ES: items.filter(i => i.filial.includes('ES')),
  }), [items]);

  const subtotalByNf = useMemo<Record<NfKey, number>>(() => ({
    PR: itemsByNf.PR.reduce((s, i) => s + i.price * i.quantity, 0),
    ES: itemsByNf.ES.reduce((s, i) => s + i.price * i.quantity, 0),
  }), [itemsByNf]);

  /* ── Build the ordered list of orders shown on the page ── */
  type OrderRow = {
    nf: NfKey;
    state: OrderState;
    items: ReturnType<typeof useCart>['items'];
    subtotal: number;
    completedOrder?: CompletedOrder;
  };

  const orderRows = useMemo<OrderRow[]>(() => {
    const completedRows: OrderRow[] = completedOrders.map((o) => ({
      nf: o.nf,
      state: 'completed' as OrderState,
      items: [],
      subtotal: 0,
      completedOrder: o,
    }));

    const pendingRows: OrderRow[] = nfsInCart.map((nf) => ({
      nf,
      state: 'pending' as OrderState,
      items: itemsByNf[nf],
      subtotal: subtotalByNf[nf],
    }));

    return [...completedRows, ...pendingRows];
  }, [completedOrders, nfsInCart, activeNf, itemsByNf, subtotalByNf]);

  const totalOrders = orderRows.length;

  /* Aggregated total across pending NFs (informativo, NÃO de pagamento) */
  const aggregatedReference = useMemo(() => {
    return nfsInCart.reduce((sum, nf) => {
      const sub = subtotalByNf[nf];
      return sum + sub + sub * 0.07 + sub * 0.13;
    }, 0);
  }, [nfsInCart, subtotalByNf]);

  const couponDiscount = appliedCode && VALID_COUPONS[appliedCode] && activeNf
    ? (subtotalByNf[activeNf] * 1.20) * VALID_COUPONS[appliedCode].discount
    : 0;

  /* Total items for header pill */
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  /* ── Handlers ── */
  const handleStartCheckout = useCallback((nf: NfKey) => {
    navigate(`/checkout?nf=${nf}`);
  }, [navigate]);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleRemove = useCallback((id: string, name: string) => {
    const idx = items.findIndex(i => i.id === id);
    const item = items[idx];
    if (!item) return;

    removeItem(id);

    const toastId = Date.now();
    setToasts(prev => [
      ...prev,
      {
        id: toastId,
        name: name,
        onUndo: () => {
          addItem({
            id: item.id,
            sku: item.sku,
            name: item.name,
            brand: item.brand,
            price: item.price,
            oldPrice: item.oldPrice,
            image: item.image,
            filial: item.filial,
            quantity: item.quantity,
            unitType: item.unitType,
          });
          dismissToast(toastId);
        },
      },
    ]);
  }, [items, removeItem, addItem, dismissToast]);

  const handleUpdateUnit = (id: string, unit: string) => {
    setUnitTypes(prev => ({ ...prev, [id]: unit }));
  };

  /* ── Empty cart (no items AND no completed orders) ── */
  if (items.length === 0 && completedOrders.length === 0) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-6" style={{ background: 'var(--background)' }}>
        <div style={{ color: 'var(--muted-foreground)' }}>
          <ShoppingBagIcon />
        </div>
        <div className="text-center">
          <span className="block" style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            Seu carrinho está vazio
          </span>
          <span className="block mt-1" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            Explore o catálogo e adicione produtos
          </span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="h-11 px-8 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}
        >
          Explorar catálogo
        </button>
      </div>
    );
  }

  /* ── All orders completed ── */
  const allCompleted = items.length === 0 && completedOrders.length > 0;

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      {/* Toast stack */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} onDismiss={dismissToast} />
          </div>
        ))}
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 pt-6 pb-2">
          <button
            onClick={() => navigate('/')}
            className="bg-transparent border-none cursor-pointer p-0 flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)' }}
          >
            Início
          </button>
          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>/</span>
          <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}>
            Carrinho
          </span>
        </div>

        {/* Title row */}
        <div className="flex items-center gap-3 pt-3 pb-4 flex-wrap">
          <h2 className="m-0" style={{ color: 'var(--foreground)', fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.1 }}>
            Carrinho
          </h2>
          {totalItems > 0 && (
            <span
              className="rounded-full px-2.5 py-0.5"
              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}
            >
              {totalItems} {totalItems === 1 ? 'item' : 'itens'}
            </span>
          )}
          <div className="ml-auto">
            <VariantSwitcher value={variant} onChange={setVariant} disabled={nfsInCart.length < 2} />
          </div>
        </div>

        {/* ─── Multi-filial intro banner — só em V1, pois V2 já tem hero próprio ─── */}
        {totalOrders > 1 && !allCompleted && !(variant === 'choice' && nfsInCart.length === 2) && (
          <div
            className="rounded-xl px-5 py-4 mb-5 flex items-start gap-3"
            style={{ background: 'var(--primary-surface-md)', border: '1px solid var(--primary-border-sm)' }}
          >
            <div
              className="rounded-full flex items-center justify-center shrink-0"
              style={{ width: 32, height: 32, background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              <InfoIcon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                Você tem {totalOrders} pedidos independentes neste carrinho
              </span>
              <span className="block mt-0.5" style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.5 }}>
                Cada filial gera um pedido próprio — frete, imposto e pagamento são <strong>separados por filial</strong>.
                Você vai finalizar um, voltar aqui, e seguir com o próximo.
              </span>
            </div>
          </div>
        )}

        {/* ─── V2 CHOICE LAYOUT — só ativa quando há 2 filiais ─── */}
        {variant === 'choice' && nfsInCart.length === 2 && !allCompleted ? (
          <div className="pb-12 flex flex-col gap-6">
            {/* Completed orders preview (caso tenha algum já finalizado mistura raro mas seguro) */}
            {completedOrders.length > 0 && (
              <div className="flex flex-col gap-3">
                {completedOrders.map((co) => (
                  <div key={co.nf} className="rounded-xl px-5 py-3 flex items-center gap-3"
                    style={{ background: 'var(--success-surface)', border: '1px solid var(--success)' }}>
                    <span className="rounded-lg flex items-center justify-center shrink-0"
                      style={{ width: 32, height: 32, background: 'var(--success)', color: 'var(--primary-foreground)' }}>
                      <CheckIcon size={14} />
                    </span>
                    <span className="flex-1 min-w-0" style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      <strong>{NF_LABEL[co.nf]}</strong> · {co.orderNumber} · Pago {formatCurrency(co.total)} via {co.paymentMethod}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Intro */}
            <div className="text-center max-w-[720px] mx-auto pt-2">
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4"
                style={{ background: 'var(--primary-surface-md)', border: '1px solid var(--primary-border-sm)' }}>
                <span aria-hidden="true" className="rounded-full" style={{ width: 6, height: 6, background: 'var(--primary)' }} />
                <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.8px' }}>
                  DUAS FILIAIS · ESCOLHA UMA PARA COMEÇAR
                </span>
              </span>
              <h3 className="m-0" style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.15 }}>
                Você tem duas filiais no seu carrinho.
                <br />
                <span style={{ color: 'var(--primary)' }}>Qual quer finalizar primeiro?</span>
              </h3>
            </div>

            {/* Two big choice cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mt-2">
              {nfsInCart.map((nf) => (
                <ChoiceCard
                  key={nf}
                  nf={nf}
                  items={itemsByNf[nf]}
                  subtotal={subtotalByNf[nf]}
                  onSelect={() => handleStartCheckout(nf)}
                />
              ))}
            </div>

            {/* Footer — escape hatches.
                "Editar carrinho" volta pra V1 (V2 é momento de DECISÃO, não edição → mantém foco). */}
            <div className="flex items-center justify-center gap-4 mt-2 pb-2 flex-wrap">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm"
                style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)', outlineColor: 'var(--primary)' }}
              >
                <span aria-hidden="true">←</span> Continuar comprando
              </button>
              <span aria-hidden="true" style={{ color: 'var(--muted)' }}>·</span>
              <button
                type="button"
                onClick={() => setVariant('classic')}
                className="bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm"
                style={{ color: 'var(--primary)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)', outlineColor: 'var(--primary)' }}
              >
                Editar carrinho
              </button>
              <span aria-hidden="true" style={{ color: 'var(--muted)' }}>·</span>
              <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)' }}>
                <LockIcon size={12} /> Compra 100% segura e protegida
              </span>
            </div>
          </div>
        ) : (
        /* ─── V1 CLASSIC LAYOUT — padrão e fallback ─── */
        <div className="flex flex-col lg:flex-row gap-6 pb-12 lg:items-start">
          {/* Left column: Order Cards */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            {orderRows.map((row, i) => (
              <OrderCard
                key={row.nf}
                index={i + 1}
                total={totalOrders}
                nf={row.nf}
                state={row.state}
                isSelected={
                  /* No modo multi-summary cada card tem CTA próprio — selectedNf perde papel.
                     Em modo single (1 filial), preserva o realce. */
                  nfsInCart.length === 1 && selectedNf === row.nf && row.state === 'pending'
                }
                items={row.items}
                completedOrder={row.completedOrder}
                onSelect={() => setSelectedNf(row.nf)}
                onRemove={handleRemove}
                onUpdateQty={updateQuantity}
                onUpdateUnit={handleUpdateUnit}
                onAddMore={() => navigate('/')}
              />
            ))}

            {/* All completed banner */}
            {allCompleted && (
              <div
                className="rounded-2xl px-6 py-5 flex items-center gap-4"
                style={{ background: 'var(--success-surface)', border: '1px solid var(--success)' }}
              >
                <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: 40, height: 40, background: 'var(--success)', color: 'var(--primary-foreground)' }}>
                  <CheckIcon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                    Todos os pedidos foram finalizados
                  </span>
                  <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                    {completedOrders.length} {completedOrders.length === 1 ? 'pedido confirmado' : 'pedidos confirmados'}
                  </span>
                </div>
                <button
                  onClick={() => { resetCompleted(); navigate('/'); }}
                  className="h-10 px-4 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}
                >
                  Voltar ao catálogo
                </button>
              </div>
            )}
          </div>

          {/* Right column — dois modos:
              · 2 filiais pendentes: 2 summaries empilhados, sem sticky, cada um com CTA próprio
              · 1 filial / all completed: card único sticky (igual antes) */}
          <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-4">
            {nfsInCart.length === 2 && !allCompleted ? (
              <>
                {nfsInCart.map((nf) => {
                  const accent = NF_ACCENT[nf];
                  const sub = subtotalByNf[nf];
                  const ipi = sub * 0.07;
                  const stx = sub * 0.13;
                  const total = sub + ipi + stx;
                  const itemsCount = itemsByNf[nf].reduce((s, i) => s + i.quantity, 0);
                  const sIndex = nfsInCart.indexOf(nf) + 1 + completedOrders.length;
                  return (
                    <div
                      key={nf}
                      className="rounded-2xl overflow-hidden flex flex-col"
                      style={{ background: 'var(--card)', border: '1px solid var(--muted)', boxShadow: 'var(--elevation-sm)' }}
                    >
                      {/* Header com border-top accent */}
                      <div className="px-5 pt-5 pb-4 flex items-start gap-3"
                        style={{ borderBottom: '1px solid var(--muted)', borderTop: `3px solid ${accent.color}` }}>
                        <span
                          className="rounded flex items-center justify-center shrink-0 mt-0.5"
                          style={{ width: 28, height: 28, background: accent.color, color: 'var(--primary-foreground)', fontSize: 10, fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.4px' }}>
                          {nf}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="block" style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                            Pedido {sIndex} de {totalOrders}
                          </span>
                          <span className="block mt-0.5" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.1 }}>
                            {NF_LABEL[nf]}
                          </span>
                          <span className="block mt-0.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                            {itemsCount} {itemsCount === 1 ? 'item' : 'itens'} · {FILIAL_FULL_NAME[nf]}
                          </span>
                        </div>
                      </div>

                      <div className="px-5 py-4 flex flex-col gap-2">
                        <div className="flex justify-between" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                          <span>Subtotal</span><span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--foreground)', fontWeight: 'var(--font-weight-bold)' }}>{formatCurrency(sub)}</span>
                        </div>
                        <div className="flex justify-between" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                          <span>IPI (7%)</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(ipi)}</span>
                        </div>
                        <div className="flex justify-between" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                          <span>ST (13%)</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(stx)}</span>
                        </div>
                        <div className="flex justify-between items-center" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                          <span>Frete</span>
                          <span style={{ color: 'var(--muted-foreground)' }}>a calcular</span>
                        </div>
                      </div>

                      <div className="px-5 pt-3 pb-4 flex items-baseline justify-between"
                        style={{ borderTop: '1px solid var(--muted)' }}>
                        <div>
                          <span className="block" style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                            Total
                          </span>
                          <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                            sem frete
                          </span>
                        </div>
                        <span style={{ fontSize: 24, fontWeight: 'var(--font-weight-bold)', color: accent.color, fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                          {formatCurrency(total)}
                        </span>
                      </div>

                      <div className="px-5 pb-5">
                        <button
                          onClick={() => handleStartCheckout(nf)}
                          className="w-full h-11 rounded-xl border-none cursor-pointer hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                          style={{
                            background: accent.color,
                            color: 'var(--primary-foreground)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-bold)',
                            fontFamily: 'var(--font-red-hat-display)',
                            letterSpacing: '0.3px',
                            boxShadow: `0 8px 20px ${nf === 'PR' ? 'rgba(26,60,110,0.30)' : 'rgba(91,45,142,0.30)'}`,
                          }}
                        >
                          Iniciar Filial {nf}
                          <ArrowRightIcon size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Soma das filiais — chip leve embaixo */}
                <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-2"
                  style={{ background: 'var(--card)', border: '1px dashed var(--muted)' }}>
                  <div>
                    <span className="block" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.4px', textTransform: 'uppercase', fontWeight: 'var(--font-weight-bold)' }}>
                      Soma das {nfsInCart.length} filiais
                    </span>
                    <span className="block" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      pago separadamente
                    </span>
                  </div>
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
                    {formatCurrency(aggregatedReference)}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/')}
                  className="w-full h-10 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}
                >
                  Continuar comprando
                </button>

                <div className="flex items-center justify-center gap-1.5">
                  <span style={{ color: 'var(--muted-foreground)' }}>
                    <LockIcon size={12} />
                  </span>
                  <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                    Compra 100% segura e protegida
                  </span>
                </div>
              </>
            ) : (
            <div
              className="rounded-2xl lg:sticky lg:top-5 overflow-hidden flex flex-col"
              style={{ background: 'var(--card)', border: '1px solid var(--muted)', boxShadow: 'var(--elevation-sm)' }}
            >
              {(() => {
                const sNf = selectedNf;
                if (!sNf) {
                  return (
                    <>
                      <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid var(--muted)' }}>
                        <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                          Resumo
                        </span>
                        <span className="block mt-1" style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.2 }}>
                          Compra finalizada
                        </span>
                      </div>
                      <div className="px-6 py-6 flex items-center justify-center" style={{ minHeight: 80 }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                          Todos os pedidos foram finalizados.
                        </span>
                      </div>
                    </>
                  );
                }

                const accent = NF_ACCENT[sNf];
                const sub = subtotalByNf[sNf];
                const ipi = sub * 0.07;
                const stx = sub * 0.13;
                const couponDisc = appliedCode && VALID_COUPONS[appliedCode]
                  ? (sub * 1.20) * VALID_COUPONS[appliedCode].discount
                  : 0;
                const total = sub + ipi + stx - couponDisc;
                const itemsCount = itemsByNf[sNf].reduce((s, i) => s + i.quantity, 0);
                const sIndex = nfsInCart.indexOf(sNf) + 1 + completedOrders.length;
                return (
                  <>
                    {/* Header — card bg, accent top border + NF badge */}
                    <div className="px-5 pt-5 pb-4 flex items-start gap-3"
                      style={{ borderBottom: '1px solid var(--muted)', borderTop: `3px solid ${accent.color}` }}>
                      <span
                        className="rounded flex items-center justify-center shrink-0 mt-0.5"
                        style={{ width: 28, height: 28, background: accent.color, color: 'var(--primary-foreground)', fontSize: 10, fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.4px' }}>
                        {sNf}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="block" style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                          Você está finalizando
                        </span>
                        <span className="block mt-0.5" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.1 }}>
                          {NF_LABEL[sNf]}
                        </span>
                        <span className="block mt-0.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                          Pedido {sIndex} de {totalOrders} · {itemsCount} {itemsCount === 1 ? 'item' : 'itens'}
                        </span>
                      </div>
                    </div>

                    <div className="px-6 py-5 flex flex-col gap-4">
                      {/* Switch hint when 2+ NFs */}
                      {nfsInCart.length > 1 && (
                        <span className="block" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.4 }}>
                          Para mudar de pedido, selecione no card ao lado.
                        </span>
                      )}

                      {/* Cost breakdown */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                          <span>Subtotal</span><span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--foreground)', fontWeight: 'var(--font-weight-bold)' }}>{formatCurrency(sub)}</span>
                        </div>
                        <div className="flex justify-between" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                          <span>IPI (7%)</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(ipi)}</span>
                        </div>
                        <div className="flex justify-between" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                          <span>ST (13%)</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(stx)}</span>
                        </div>
                        <div className="flex justify-between items-center" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                          <span>Frete</span>
                          <span style={{ color: 'var(--muted-foreground)' }}>a calcular</span>
                        </div>
                        {couponDisc > 0 && (
                          <div className="flex justify-between" style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}>
                            <span>Cupom {appliedCode}</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>−{formatCurrency(couponDisc)}</span>
                          </div>
                        )}
                      </div>

                      {/* Coupon */}
                      <CouponSection
                        appliedCode={appliedCode}
                        onApply={onApplyCoupon}
                        onRemove={onRemoveCoupon}
                      />

                      {/* Total deste pedido — destaque accent NF */}
                      <div className="flex items-baseline justify-between pt-2"
                        style={{ borderTop: '1px solid var(--muted)' }}>
                        <div>
                          <span className="block" style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                            Total deste pedido
                          </span>
                          <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                            sem frete
                          </span>
                        </div>
                        <span style={{ fontSize: 28, fontWeight: 'var(--font-weight-bold)', color: accent.color, fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                          {formatCurrency(total)}
                        </span>
                      </div>

                      {/* Multi-NF reference total — only when 2+ pending orders */}
                      {nfsInCart.length > 1 && !allCompleted && (
                        <div
                          className="rounded-lg px-3 py-2"
                          style={{ background: 'var(--background)', border: '1px dashed var(--muted)' }}
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                              Soma dos {nfsInCart.length} pedidos
                            </span>
                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
                              {formatCurrency(aggregatedReference)}
                            </span>
                          </div>
                          <span className="block mt-0.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.4 }}>
                            Pago separadamente.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="px-6 pb-5 flex flex-col gap-2.5">
                      <button
                        onClick={() => handleStartCheckout(sNf)}
                        className="w-full h-12 rounded-xl border-none cursor-pointer hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                        style={{
                          background: 'var(--primary)',
                          color: 'var(--primary-foreground)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-bold)',
                          fontFamily: 'var(--font-red-hat-display)',
                          letterSpacing: '0.3px',
                          boxShadow: '0 10px 24px rgba(0,90,255,0.32)',
                        }}
                      >
                        Iniciar pedido — {NF_LABEL[sNf]}
                        <ArrowRightIcon size={16} />
                      </button>

                      <button
                        onClick={() => navigate('/')}
                        className="w-full h-10 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}
                      >
                        Continuar comprando
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 pb-5">
                      <span style={{ color: 'var(--muted-foreground)' }}>
                        <LockIcon size={12} />
                      </span>
                      <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                        Compra 100% segura e protegida
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
            )}
          </div>
        </div>
        )}

        {/* Suggested products — esconde no V2 (foco total na escolha de filial) */}
        {!allCompleted && !(variant === 'choice' && nfsInCart.length === 2) && (
          <div className="pb-16">
            <span className="block mb-6" style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
              Frequentemente comprados juntos
            </span>
            <SuggestedCarousel />
          </div>
        )}
      </div>
    </div>
  );
}
