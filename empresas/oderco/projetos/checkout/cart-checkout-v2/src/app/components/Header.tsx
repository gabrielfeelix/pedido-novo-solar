import { useNavigate } from 'react-router';
import Logo from '../../imports/Logo';
import svgPaths from '../../imports/svg-xd215l8b8f';
import { useCart } from './CartContext';
import { formatCurrency } from './cart-data';

export function Header() {
  const navigate = useNavigate();
  const { totalItems, subtotal, openCart } = useCart();

  const cartCount = totalItems || 0;
  const cartTotal = formatCurrency(subtotal);

  const navItems = [
    'Todos os Departamentos',
    'Violões',
    'Placas de Vídeo',
    'Monitores',
    'Fontes',
    'Gabinetes',
    'Teclados',
    'Mouses',
    'Promoções',
  ];

  return (
    <header className="w-full" style={{ fontFamily: 'var(--font-red-hat-display)' }}>
      {/* ── Top bar ── */}
      <div style={{ background: 'var(--card)' }} className="flex items-center justify-center px-4 py-4 md:py-0" >
        <div className="w-full max-w-[1120px] flex items-center" style={{ minHeight: 80 }}>
          {/* Logo */}
          <div
            className="cursor-pointer w-[140px] md:w-[192px] h-[24px] md:h-[30px] relative shrink-0"
            onClick={() => navigate('/')}
          >
            <Logo />
          </div>

          {/* Search bar - hidden on mobile */}
          <div
            className="h-[42px] rounded-lg hidden md:flex items-center justify-between pl-[16px] pr-[21px] py-[10px] ml-[64px] w-[416px] relative"
            style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
          >
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
              O que você deseja?
            </span>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" className="shrink-0">
              <g clipPath="url(#clip_search_header)">
                <path d={svgPaths.p234575c0} stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M20.4313 18.8063L16.625 15" stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </g>
              <defs>
                <clipPath id="clip_search_header"><rect fill="white" height="21" width="21" /></clipPath>
              </defs>
            </svg>
          </div>

          {/* User area - hidden on mobile */}
          <div className="hidden md:flex items-start gap-[8px] ml-[37px] leading-[0]">
            {/* Avatar icon with badge */}
            <div className="relative inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start shrink-0">
              <div className="col-start-1 row-start-1 ml-[6px] relative w-[23px] h-[28px]">
                <svg className="absolute block w-full h-full" fill="none" viewBox="0 0 22.98 28.1924">
                  <path d={svgPaths.p1de65000} fill="var(--foreground)" />
                  <path d={svgPaths.p93c86f0} fill="var(--foreground)" />
                </svg>
              </div>
              <div className="col-start-1 row-start-1 mt-[21px] relative w-[15px] h-[15px]">
                <svg className="absolute block w-full h-full" fill="none" viewBox="0 0 15 15">
                  <circle cx="7.5" cy="7.5" r="7.5" fill="var(--primary)" />
                </svg>
              </div>
              <span
                className="col-start-1 row-start-1 mt-[21px] ml-[4px] relative"
                style={{ fontSize: 'var(--text-xs)', color: 'var(--primary-foreground)', lineHeight: 'normal' }}
              >
                3
              </span>
            </div>

            {/* Text */}
            <div className="shrink-0 w-[113px]" style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)' }}>
              <p className="m-0" style={{ fontWeight: 'var(--font-weight-bold)', lineHeight: 'normal' }}>Acesse sua conta</p>
              <p className="m-0" style={{ lineHeight: 'normal' }}>
                ou <span style={{ fontWeight: 'var(--font-weight-bold)' }}>Se cadastre</span>
              </p>
            </div>
          </div>

          {/* Cart button */}
          <div
            className="h-[36px] md:h-[41px] rounded-lg flex items-center justify-center px-3 md:px-5 py-[10px] ml-auto cursor-pointer hover:opacity-90 transition-opacity gap-2.5"
            style={{ background: 'var(--primary-surface-md)' }}
            onClick={openCart}
          >
            <svg width="22" height="22" viewBox="0 0 23.3316 23.3316" fill="none" className="shrink-0">
              <path d={svgPaths.p36ebc5c0} fill="var(--primary)" />
            </svg>
            <span className="hidden md:inline" style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', lineHeight: 'normal', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>
              {cartCount} {cartCount === 1 ? 'Item' : 'Itens'} ({cartTotal})
            </span>
            {cartCount > 0 && (
              <span
                className="md:hidden rounded-full flex items-center justify-center"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  fontSize: 'var(--text-2xs)',
                  fontWeight: 'var(--font-weight-bold)',
                  width: 18,
                  height: 18,
                }}
              >
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Navigation bar ── */}
      <div
        style={{ background: 'var(--foreground)' }}
        className="hidden md:flex items-center justify-center"
      >
        <div className="w-[1120px] flex items-center gap-[32px]" style={{ height: 48 }}>
          {navItems.map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-[8px] cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                if (item === 'Promoções') navigate('/lista');
              }}
            >
              {i === 0 && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d={svgPaths.p1bfa6400} fill="var(--primary-foreground)" />
                  <path d={svgPaths.p2b18f80} fill="var(--primary-foreground)" />
                  <path d={svgPaths.p393b0e00} fill="var(--primary-foreground)" />
                </svg>
              )}
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--primary-foreground)', lineHeight: 'normal', whiteSpace: 'nowrap' }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}