import { useMemo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from './CartContext';
import { formatCurrency } from './cart-data';

const FREE_SHIPPING_THRESHOLD = 800;

/* ── NF badge colours (data fields, not DS tokens) ── */
const NF_COLOR: Record<'PR' | 'ES', { bg: string; fg: string }> = {
  PR: { bg: 'var(--nf-pr)', fg: 'var(--nf-pr-fg)' },
  ES: { bg: 'var(--nf-es)', fg: 'var(--nf-es-fg)' },
};

/* ── Helpers ── */
function getFilialKey(filial: string): 'PR' | 'ES' {
  if (filial.includes('ES')) return 'ES';
  return 'PR';
}

/* ── Icons ── */
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M14 3h7v7" />
      <path d="M21 3L9 15" />
    </svg>
  );
}

/* ── Per-filial free-shipping progress (sits adjacent to each filial group) ── */
function ShippingProgress({ filial, subtotal }: { filial: 'PR' | 'ES'; subtotal: number }) {
  const color = filial === 'PR' ? 'var(--nf-pr)' : 'var(--nf-es)';
  const achieved = subtotal >= FREE_SHIPPING_THRESHOLD;
  const prog = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const left = FREE_SHIPPING_THRESHOLD - subtotal;

  if (achieved) {
    return (
      <div className="px-5 pt-2.5 pb-2 flex items-center gap-1.5"
        style={{ background: 'var(--success-surface)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
          Frete grátis nesta filial
        </span>
      </div>
    );
  }

  return (
    <div className="px-5 pt-2.5 pb-2.5" style={{ background: 'var(--background)' }}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}>
          Faltam <span style={{ color, fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(left)}</span> para frete grátis
        </span>
        <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
          {Math.round(prog)}%
        </span>
      </div>
      <div className="w-full h-[5px] rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${prog}%` }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

/* ── NF Badge ── */
function NfBadge({ filial }: { filial: 'PR' | 'ES' }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded shrink-0"
      style={{
        width: 22,
        height: 22,
        background: NF_COLOR[filial].bg,
        color: NF_COLOR[filial].fg,
        fontSize: '9px',
        fontWeight: 'var(--font-weight-bold)',
        fontFamily: 'var(--font-red-hat-display)',
        letterSpacing: '0.2px',
      }}
    >
      {filial}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, subtotal } = useCart();
  const navigate = useNavigate();

  /* ── Group items by filial ── */
  const itemsPR = useMemo(() => items.filter(i => getFilialKey(i.filial) === 'PR'), [items]);
  const itemsES = useMemo(() => items.filter(i => getFilialKey(i.filial) === 'ES'), [items]);
  const hasMultipleNFs = itemsPR.length > 0 && itemsES.length > 0;

  /* ── Subtotals per NF ── */
  const subtotalPR = useMemo(() => itemsPR.reduce((s, i) => s + i.price * i.quantity, 0), [itemsPR]);
  const subtotalES = useMemo(() => itemsES.reduce((s, i) => s + i.price * i.quantity, 0), [itemsES]);

  /* ── Handlers ── */
  const handleCheckout = useCallback(() => {
    closeCart();
    navigate('/carrinho');
  }, [closeCart, navigate]);

  const handleContinue = useCallback(() => {
    closeCart();
  }, [closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50"
            style={{ background: 'var(--overlay-backdrop)' }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed top-0 right-0 h-full z-50 flex flex-col"
            style={{
              width: 'min(420px, calc(100vw - 20px))',
              background: 'var(--card)',
              boxShadow: 'var(--overlay-shadow-lg)',
              fontFamily: 'var(--font-red-hat-display)',
            }}
          >

            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: '1px solid var(--muted)' }}
            >
              <div className="flex items-center gap-3">
                <span style={{ color: 'var(--foreground)' }}><CartIcon /></span>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
                  CARRINHO
                </span>
                {totalItems > 0 && (
                  <span
                    className="rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-bold)',
                      fontFamily: 'var(--font-red-hat-display)',
                      width: 22,
                      height: 22,
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
            </div>

            {/* ── Items list ── */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {items.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center h-full gap-5 px-6 py-10">
                  <div style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <span className="block" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      Seu carrinho está vazio
                    </span>
                    <span className="block mt-1" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      Adicione produtos para continuar
                    </span>
                  </div>
                  <button
                    onClick={handleContinue}
                    className="h-10 px-6 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}
                  >
                    Ver produtos
                  </button>
                </div>
              ) : (
                /* Grouped items */
                <div>
                  {/* ── Group: NF Paraná ── */}
                  {itemsPR.length > 0 && (
                    <div>
                      {hasMultipleNFs && (
                        <div className="flex items-center gap-2.5 px-5 pt-4 pb-3"
                          style={{ borderBottom: '1px solid var(--muted)' }}>
                          <NfBadge filial="PR" />
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--nf-pr)', fontFamily: 'var(--font-red-hat-display)' }}>
                            Filial PR
                          </span>
                          <span className="ml-auto" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                            {itemsPR.length} {itemsPR.length === 1 ? 'item' : 'itens'}
                          </span>
                        </div>
                      )}
                      <ShippingProgress filial="PR" subtotal={subtotalPR} />
                      {/* Items */}
                      {itemsPR.map((item, idx) => (
                        <CartItemRow
                          key={item.id}
                          item={item}
                          filialKey="PR"
                          showBadge={!hasMultipleNFs}
                          hasDivider={idx < itemsPR.length - 1 || itemsES.length > 0}
                          onRemove={removeItem}
                          onQtyChange={updateQuantity}
                        />
                      ))}
                    </div>
                  )}

                  {/* ── Group: NF Espírito Santo ── */}
                  {itemsES.length > 0 && (
                    <div>
                      {/* Group header */}
                      {hasMultipleNFs && (
                        <div className="flex items-center gap-2.5 px-5 pt-5 pb-3 mt-2"
                          style={{ borderBottom: '1px solid var(--muted)', borderTop: '6px solid var(--background)' }}>
                          <NfBadge filial="ES" />
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--nf-es)', fontFamily: 'var(--font-red-hat-display)' }}>
                            Filial ES
                          </span>
                          <span className="ml-auto" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                            {itemsES.length} {itemsES.length === 1 ? 'item' : 'itens'}
                          </span>
                        </div>
                      )}
                      <ShippingProgress filial="ES" subtotal={subtotalES} />
                      {/* Items */}
                      {itemsES.map((item, idx) => (
                        <CartItemRow
                          key={item.id}
                          item={item}
                          filialKey="ES"
                          showBadge={!hasMultipleNFs}
                          hasDivider={idx < itemsES.length - 1}
                          onRemove={removeItem}
                          onQtyChange={updateQuantity}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Bottom section — total único + CTA ── */}
            {items.length > 0 && (
              <div className="shrink-0" style={{ borderTop: '1px solid var(--muted)' }}>
                <div className="px-5 pt-5 pb-3">
                  <div className="flex items-baseline justify-between">
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      {hasMultipleNFs ? 'Total dos pedidos' : 'Total'}
                    </span>
                    <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <span className="block mt-1.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                    {hasMultipleNFs
                      ? `${[itemsPR.length > 0, itemsES.length > 0].filter(Boolean).length} filiais · pago separadamente · frete no checkout`
                      : 'Frete calculado no checkout'}
                  </span>
                </div>

                <div className="px-5 pt-2 pb-6 flex flex-col items-center gap-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full h-12 rounded-xl border-none cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                      background: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      fontFamily: 'var(--font-red-hat-display)',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Ir para o carrinho
                  </button>
                  <button
                    onClick={handleContinue}
                    className="bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity"
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--muted-foreground)',
                      fontFamily: 'var(--font-red-hat-display)',
                    }}
                  >
                    Continuar comprando
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════
   CART ITEM ROW
═══════════════════════════════════════════════════════════ */
interface CartItemRowProps {
  item: {
    id: string;
    name: string;
    price: number;
    oldPrice?: number | null;
    quantity: number;
    image: string;
    filial: string;
    unitType: string;
  };
  filialKey: 'PR' | 'ES';
  showBadge: boolean;
  hasDivider: boolean;
  onRemove: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
}

function CartItemRow({ item, filialKey, showBadge, hasDivider, onRemove, onQtyChange }: CartItemRowProps) {
  return (
    <>
      <div className="flex items-start gap-4 px-5 py-5">
        {/* Product image — 64x64 com respiro melhor */}
        <div
          className="w-[64px] h-[64px] rounded-xl overflow-hidden flex items-center justify-center shrink-0"
          style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}
        >
          {item.image
            ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
            : <PackageIcon />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name + delete */}
          <div className="flex items-start gap-2 justify-between">
            <span
              className="block"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--foreground)',
                fontFamily: 'var(--font-red-hat-display)',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {item.name}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="bg-transparent border-none cursor-pointer p-1 shrink-0 hover:opacity-60 transition-opacity -mt-0.5"
              style={{ color: 'var(--muted-foreground)' }}
              aria-label="Remover"
            >
              <TrashIcon />
            </button>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 mt-1.5">
            {showBadge && <NfBadge filial={filialKey} />}
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
              {item.unitType}
            </span>
          </div>

          {/* Qty controls + price */}
          <div className="flex items-center justify-between mt-3.5 gap-3">
            <div
              className="flex items-center rounded-lg overflow-hidden"
              style={{ border: '1px solid var(--muted)' }}
            >
              <button
                onClick={() => onQtyChange(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-9 h-9 flex items-center justify-center bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity disabled:opacity-30"
                style={{ color: 'var(--foreground)' }}
              >
                <MinusIcon />
              </button>
              <span
                className="w-9 h-9 flex items-center justify-center"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--foreground)',
                  borderLeft: '1px solid var(--muted)',
                  borderRight: '1px solid var(--muted)',
                  fontFamily: 'var(--font-red-hat-display)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {item.quantity}
              </span>
              <button
                onClick={() => onQtyChange(item.id, item.quantity + 1)}
                className="w-9 h-9 flex items-center justify-center bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity"
                style={{ color: 'var(--primary)' }}
              >
                <PlusIcon />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              {item.oldPrice && (
                <span
                  className="block"
                  style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}
                >
                  {formatCurrency(item.oldPrice * item.quantity)}
                </span>
              )}
              <span
                className="block"
                style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}
              >
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {hasDivider && (
        <div className="mx-5 h-px" style={{ background: 'var(--muted)' }} />
      )}
    </>
  );
}