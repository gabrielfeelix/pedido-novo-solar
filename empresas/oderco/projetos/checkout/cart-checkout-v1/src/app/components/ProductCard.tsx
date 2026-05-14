import { useState, useRef, useEffect } from 'react';
import svgPaths from '../../imports/svg-r4oquq50dm';
import { useCart } from './CartContext';

/* ────────────────────────── Inline SVG Icons ────────────────────────── */

function CartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19.0028 19" fill="none" className="shrink-0">
      <path d={svgPaths.p318c7a80} fill="white" />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg width="25" height="24" viewBox="0 0 24.96 24" fill="none" className="shrink-0">
      <path d={svgPaths.p26f88b00} fill="var(--primary-foreground)" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'var(--primary)' : 'none'} stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ────────────────────────── Types ────────────────────────── */

export interface ProductCardProps {
  id: string;
  sku: string;
  name: string;
  brand: string;
  pricePR: number;
  priceES: number | null;
  oldPrice?: number | null;
  image: string;
  filial: string;
  unitInfo?: string;
  hasTimer?: boolean;
  discount?: string | null;
  showHeart?: boolean;
  onAddToCart?: () => void;
  onNavigate?: () => void;
}

/* ────────────────────────── Component ────────────────────────── */

export function ProductCard({
  id,
  sku,
  name,
  brand,
  pricePR,
  priceES,
  oldPrice,
  image,
  filial,
  unitInfo,
  hasTimer,
  discount,
  showHeart,
  onAddToCart,
  onNavigate,
}: ProductCardProps) {
  const [favorited, setFavorited] = useState(false);
  const [selectedFilial, setSelectedFilial] = useState<'PR' | 'ES'>('PR');
  const [qty, setQty] = useState(1);
  const [unitType, setUnitType] = useState<'Item' | 'Caixa mãe'>('Item');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCart();

  const fmt = (n: number) =>
    n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const isDual = priceES !== null;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  return (
    <div
      className="bg-card rounded-lg border border-[color:var(--muted)] relative flex flex-col w-[256px] shrink-0 overflow-visible"
      style={{ fontFamily: 'var(--font-red-hat-display)', height: 588 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Discount badge ── */}
      {discount && (
        <div
          className="absolute top-[12px] left-[16px] z-10 rounded-sm px-2 py-[8px]"
          style={{
            background: 'var(--success-surface)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--foreground)',
            lineHeight: 'normal',
          }}
        >
          {discount}
        </div>
      )}

      {/* ── Favorite ── */}
      {showHeart && (
        <button
          onClick={(e) => { e.stopPropagation(); setFavorited(!favorited); }}
          className="absolute top-[12px] right-[12px] z-10 bg-transparent border-none cursor-pointer p-0"
          aria-label="Favoritar"
        >
          <HeartIcon filled={favorited} />
        </button>
      )}

      {/* ── Product Image (clickable) ── */}
      <div
        className="cursor-pointer flex items-center justify-center mx-[26px] mt-[29px] h-[200px] shrink-0"
        onClick={onNavigate}
      >
        <img
          src={image}
          alt={name}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* ── Content area (flex-1 with min-h-0 to prevent overflow) ── */}
      <div className="flex-1 flex flex-col px-[24px] pt-[10px] min-h-0 overflow-hidden">
        {/* SKU / Filial */}
        <div className="flex justify-between mb-[4px] shrink-0" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
          <span>SKU: {sku}</span>
          <span>{filial}</span>
        </div>

        {/* Separator */}
        <div className="w-full h-px mb-[8px] shrink-0" style={{ background: 'var(--muted)' }} />

        {/* Name */}
        <p
          className="m-0 mb-[6px] overflow-hidden text-ellipsis shrink-0"
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--foreground)',
            lineHeight: 'normal',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '28px',
          }}
        >
          {name}
        </p>

        {/* Brand badge */}
        <span
          className="inline-block w-fit rounded-sm px-[10px] py-[2px] mb-[8px] shrink-0"
          style={{
            background: 'var(--background)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--foreground)',
            lineHeight: 'normal',
          }}
        >
          {brand}
        </span>

        {/* ── Pricing ── */}
        <div className="shrink-0">
          {isDual ? (
            <div className="flex flex-col gap-[2px]">
              {oldPrice && (
                <span
                  className="line-through"
                  style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', lineHeight: 'normal' }}
                >
                  De: R${oldPrice.toFixed(2).replace('.', ',')} por
                </span>
              )}
              {/* PR row */}
              <div className="flex items-center gap-[4px]">
                <button
                  onClick={() => setSelectedFilial('PR')}
                  className="w-[14px] h-[14px] rounded-full border-2 flex items-center justify-center p-0 bg-card cursor-pointer shrink-0"
                  style={{ borderColor: 'var(--nf-pr)' }}
                >
                  {selectedFilial === 'PR' && (
                    <div className="w-[8px] h-[8px] rounded-full" style={{ background: 'var(--nf-pr)' }} />
                  )}
                </button>
                <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', lineHeight: 'normal' }}>
                  {fmt(pricePR)}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--nf-pr)', lineHeight: 'normal', marginLeft: '2px', fontWeight: 'var(--font-weight-semibold)' }}>
                  PR
                </span>
              </div>
              {/* ES row */}
              <div className="flex items-center gap-[4px]">
                <button
                  onClick={() => setSelectedFilial('ES')}
                  className="w-[14px] h-[14px] rounded-full border-2 flex items-center justify-center p-0 bg-card cursor-pointer shrink-0"
                  style={{ borderColor: 'var(--nf-es)' }}
                >
                  {selectedFilial === 'ES' && (
                    <div className="w-[8px] h-[8px] rounded-full" style={{ background: 'var(--nf-es)' }} />
                  )}
                </button>
                <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', lineHeight: 'normal' }}>
                  {fmt(priceES!)}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--nf-es)', lineHeight: 'normal', marginLeft: '2px', fontWeight: 'var(--font-weight-semibold)' }}>
                  ES
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {oldPrice && (
                <span
                  className="line-through mb-[2px]"
                  style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', lineHeight: 'normal' }}
                >
                  De: R${oldPrice.toFixed(2).replace('.', ',')} por
                </span>
              )}
              <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', lineHeight: 'normal' }}>
                {fmt(pricePR)}
              </span>
            </div>
          )}
        </div>

        {/* IPI+ST info */}
        <p
          className="m-0 mt-[4px] overflow-hidden text-ellipsis whitespace-nowrap shrink-0"
          style={{ fontSize: 'var(--text-xs)', color: '#747474', lineHeight: 'normal', minHeight: '14px' }}
        >
          {unitInfo || '\u00A0'}
        </p>
      </div>

      {/* ── Bottom controls (always at bottom) ── */}
      <div className="px-[24px] pb-[20px] pt-[8px] shrink-0">
        {/* Qty + Unit type row */}
        <div className="flex items-center gap-[8px] mb-[8px]">
          {/* Quantity spinner */}
          <div
            className="h-[41px] w-[70px] rounded-lg flex items-center shrink-0"
            style={{ background: 'var(--background)' }}
          >
            <div
              className="h-[32px] w-[34px] rounded-lg flex items-center justify-center ml-[3px]"
              style={{ background: 'var(--card)' }}
            >
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)' }}>{qty}</span>
            </div>
            <div className="flex flex-col items-center ml-auto mr-[3px]">
              <button
                onClick={() => setQty((q) => q + 1)}
                className="bg-transparent border-none cursor-pointer p-0 leading-[0] rotate-180"
                style={{ color: 'var(--foreground)' }}
              >
                <svg width="18" height="18" viewBox="0 0 18.2634 18" fill="none">
                  <path d={svgPaths.p29ffabc0} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="bg-transparent border-none cursor-pointer p-0 leading-[0]"
                style={{ color: 'var(--foreground)' }}
              >
                <svg width="18" height="18" viewBox="0 0 18.2634 18" fill="none">
                  <path d={svgPaths.p29ffabc0} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Unit type dropdown */}
          <div className="flex-1 relative" ref={dropdownRef}>
            <button
              className="w-full h-[41px] bg-card rounded-sm flex items-center justify-between px-[9px] cursor-pointer"
              style={{ border: '1px solid var(--muted)' }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', lineHeight: 'normal' }}>
                {unitType}
              </span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>
                <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="var(--foreground)" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {dropdownOpen && (
              <div
                className="absolute top-full left-0 w-full bg-card rounded-sm shadow-lg z-20 mt-[2px] overflow-hidden"
                style={{ border: '1px solid var(--muted)' }}
              >
                {(['Item', 'Caixa mãe'] as const).map((opt) => (
                  <button
                    key={opt}
                    className="w-full px-[9px] py-[8px] bg-transparent border-none cursor-pointer text-left hover:bg-[var(--background)] transition-colors"
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--foreground)',
                      fontFamily: 'var(--font-red-hat-display)',
                      fontWeight: unitType === opt ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)',
                    }}
                    onClick={() => { setUnitType(opt); setDropdownOpen(false); }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action button */}
        {!isHovered ? (
          <div
            className="h-[41px] rounded-lg flex items-center overflow-hidden"
            style={{ border: '1px solid var(--primary)' }}
          >
            <div
              className="h-full w-[43px] flex items-center justify-center shrink-0"
              style={{ background: 'var(--primary)' }}
            >
              <TimerIcon />
            </div>
            <div className="flex-1 flex items-center justify-center bg-card">
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary)' }}>
                5 dias 7:20:47
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              // Para produtos duais (PR + ES), usa a filial selecionada pelo usuário.
              // Para produtos de filial única, usa o `filial` prop diretamente,
              // garantindo que o item vá para a NF correta (PR ou ES) no checkout.
              const cartFilial = isDual ? `FILIAL ${selectedFilial}` : filial;
              const cartFilialKey = isDual ? selectedFilial : filial.replace('FILIAL ', '');
              const price = isDual
                ? (selectedFilial === 'PR' ? pricePR : (priceES ?? pricePR))
                : pricePR;
              addItem({
                id: `${id}-${cartFilialKey}`,
                sku,
                name,
                brand,
                price,
                oldPrice,
                image,
                filial: cartFilial,
                unitType,
              });
              onAddToCart?.();
            }}
            className="w-full h-[41px] rounded-lg border-none cursor-pointer flex items-center gap-[33px] px-[32px] py-[11px] hover:opacity-90 transition-opacity"
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 'normal',
            }}
          >
            <CartIcon />
            <span>Adicionar</span>
          </button>
        )}
      </div>
    </div>
  );
}