import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ProductCard, type ProductCardProps } from './ProductCard';

/* ──────── Figma assets ──────── */
import imgImage7 from "figma:asset/c43f80881077b18717d00a7c7b7a14972dcb1059.png";
import imgImage26 from "figma:asset/7f9aefcab2b0a5963cda2345c31d564063561d21.png";
import imgImage27 from "figma:asset/b2f675b227ae8673655f4ea54fcaef7f7e5a2019.png";
import imgImage28 from "figma:asset/759174035800d6e9b21b1b86831034cbc3378590.png";
import imgImage29 from "figma:asset/814e10152ece1b3ab27d6843813b936d6d1fedcd.png";
import imgImage30 from "figma:asset/c66781ff28408446ef6bfa27201183b79db912d3.png";
import imgImage31 from "figma:asset/3c206a3f9fb3ed36b422272b5d5eea1097e7655c.png";

const imgMouse = imgImage7;
/* ──────── Carousel Arrow ──────── */
function CircleArrowBtn({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 bg-transparent border-none cursor-pointer p-0 hover:opacity-70 transition-opacity"
      aria-label={direction === 'left' ? 'Anterior' : 'Próximo'}
    >
      <svg
        width="27"
        height="27"
        viewBox="0 0 27 27"
        fill="none"
        className={direction === 'left' ? 'rotate-180' : ''}
      >
        <circle cx="13.5" cy="13.5" r="13" stroke="var(--primary)" />
        <path
          d="M11 20L17 14L11 8"
          stroke="var(--primary)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}

/* ──────── Related products ──────── */
const relatedProducts: ProductCardProps[] = [
  {
    id: 'rp-1', sku: '12345', name: 'MOUSE DASH GREY SEM FIO MULTI DEVICE SILENT CLICK 1500 DPI PMDWMDSCG - CINZA',
    brand: 'PCYES', pricePR: 47.52, priceES: 47.52, image: imgMouse, filial: 'FILIAL PR',
    unitInfo: 'Valores com IPI + ST (Caso Houver)',
  },
  {
    id: 'rp-2', sku: '12345', name: 'MOUSE DASH GREY SEM FIO MULTI DEVICE SILENT CLICK 1500 DPI PMDWMDSCG - CINZA',
    brand: 'PCYES', pricePR: 47.52, priceES: 47.52, oldPrice: 154.81, image: imgMouse,
    filial: 'FILIAL PR', unitInfo: 'Valores com IPI + ST (Caso Houver)', hasTimer: true, discount: '-10%',
  },
  {
    id: 'rp-3', sku: '12345', name: 'MOUSE DASH GREY SEM FIO MULTI DEVICE SILENT CLICK 1500 DPI PMDWMDSCG - CINZA',
    brand: 'PCYES', pricePR: 47.52, priceES: null, image: imgMouse, filial: 'FILIAL PR',
    unitInfo: 'Valor com IPI + ST (Caso Houver)',
  },
  {
    id: 'rp-4', sku: '12345', name: 'MOUSE DASH GREY SEM FIO MULTI DEVICE SILENT CLICK 1500 DPI PMDWMDSCG - CINZA',
    brand: 'PCYES', pricePR: 47.52, priceES: 47.52, image: imgMouse, filial: 'FILIAL PR',
    unitInfo: 'Valores com IPI + ST (Caso Houver)',
  },
];

/* ──────── Ficha Técnica data ──────── */
const specs = [
  { label: 'Marca', value: 'PCYES' },
  { label: 'Modelo', value: 'PMDWMDSCG' },
  { label: 'Cor', value: 'CINZA' },
  { label: 'Produto', value: 'MOUSE' },
  { label: 'DPI', value: '1500' },
  { label: 'Tipo Sensor', value: 'ÓPTICO' },
  { label: 'Botões', value: '3' },
  { label: 'Conexões', value: 'HÍBRIDO' },
  { label: 'Alimentação', value: 'PILHA' },
  { label: 'Formato', value: 'ERGONOMICO' },
  { label: 'Ajuste De Peso', value: 'NÃO' },
];

/* ──────── Page ──────── */
export function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mainImage, setMainImage] = useState(0);
  const [carouselPage, setCarouselPage] = useState(0);

  const thumbnails = [imgMouse, imgMouse, imgMouse, imgMouse, imgMouse];
  const showcaseImages = [imgImage26, imgImage27, imgImage28, imgImage29, imgImage30, imgImage31];

  const visibleCount = 4;
  const totalPages = Math.max(1, Math.ceil(relatedProducts.length / visibleCount));

  const goNext = useCallback(() => setCarouselPage((p) => (p + 1) % totalPages), [totalPages]);
  const goPrev = useCallback(() => setCarouselPage((p) => (p - 1 + totalPages) % totalPages), [totalPages]);

  const start = carouselPage * visibleCount;
  const visibleProducts = relatedProducts.slice(start, start + visibleCount);

  return (
    <div style={{ background: 'var(--card)', fontFamily: 'var(--font-red-hat-display)' }}>
      {/* ══════ Breadcrumb ══════ */}
      <div className="max-w-[1120px] mx-auto pt-[24px] pb-[16px] px-4">
        <div className="flex items-center gap-[8px]">
          <span
            className="cursor-pointer hover:underline"
            style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}
            onClick={() => navigate('/')}
          >
            Home
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>/</span>
          <span
            className="cursor-pointer hover:underline"
            style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}
            onClick={() => navigate('/lista')}
          >
            Mouses
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>/</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)' }}>
            Mouse Dash Grey
          </span>
        </div>
      </div>

      {/* ══════ Main Product Area ══════ */}
      <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row gap-8 md:gap-[64px] pb-[48px] px-4">
        {/* Left: Image Gallery */}
        <div className="w-full md:w-[479px] shrink-0">
          {/* Main image */}
          <div
            className="w-full h-[300px] md:h-[482px] rounded-lg flex items-center justify-center overflow-hidden"
            style={{ border: '1px solid var(--muted)' }}
          >
            <img
              src={thumbnails[mainImage]}
              alt="Product"
              className="max-w-[90%] max-h-[90%] object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-[8px] mt-[16px]">
            {/* Left arrow */}
            <button
              onClick={() => setMainImage((m) => (m - 1 + thumbnails.length) % thumbnails.length)}
              className="bg-transparent border-none cursor-pointer p-0 shrink-0"
            >
              <svg width="26" height="26" viewBox="0 0 26.068 26.068" fill="none" className="rotate-180">
                <path d="M9.77 21.72L17.42 13.034L9.77 4.348" stroke="var(--foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>

            {thumbnails.map((thumb, i) => (
              <button
                key={i}
                onClick={() => setMainImage(i)}
                className="w-[92px] h-[92px] rounded-lg flex items-center justify-center overflow-hidden p-0 bg-transparent cursor-pointer shrink-0"
                style={{
                  border: i === mainImage ? '2px solid var(--primary)' : '1px solid var(--muted)',
                }}
              >
                <img src={thumb} alt="" className="max-w-[80%] max-h-[80%] object-contain" />
              </button>
            ))}

            {/* Right arrow */}
            <button
              onClick={() => setMainImage((m) => (m + 1) % thumbnails.length)}
              className="bg-transparent border-none cursor-pointer p-0 shrink-0"
            >
              <svg width="26" height="26" viewBox="0 0 26.068 26.068" fill="none">
                <path d="M9.77 21.72L17.42 13.034L9.77 4.348" stroke="var(--foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex-1">
          <h1
            className="m-0 mb-[12px]"
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--foreground)',
              lineHeight: '1.3',
            }}
          >
            Mouse Dash Grey Sem Fio Multi Device Silent Click 1500 DPI PMDWMDSCG - Cinza
          </h1>
          <p
            className="m-0 mb-[24px]"
            style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', lineHeight: 'normal' }}
          >
            SKU: 111314 | Marca: PCYES
          </p>

          {/* Filial PR section */}
          <div className="mb-[24px]">
            <div className="flex items-center gap-[16px] mb-[8px]">
              <button
                className="w-[14px] h-[14px] rounded-full flex items-center justify-center p-0 bg-card cursor-pointer shrink-0"
                style={{ border: '1px solid var(--muted-foreground)' }}
              >
                <div className="w-[6px] h-[6px] rounded-full" style={{ background: 'transparent' }} />
              </button>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--foreground)', lineHeight: 'normal' }}>
                Filial PR
              </span>
            </div>
            <div className="flex items-center gap-[16px]">
              {/* Unit dropdown (disabled) */}
              <button
                className="h-[41px] w-[132px] bg-[var(--background)] rounded-sm flex items-center justify-between px-[9px] cursor-pointer"
                style={{ border: '1px solid var(--muted)' }}
              >
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', lineHeight: 'normal' }}>
                  Item
                </span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="var(--foreground)" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Sem estoque button */}
              <div
                className="h-[33px] rounded-lg flex items-center gap-[16px] px-[24px] py-[12px]"
                style={{ background: 'var(--muted-foreground)' }}
              >
                <svg width="16" height="16" viewBox="0 0 12.8 12.8" fill="none" className="shrink-0">
                  <path
                    d="M6.4 12.8C9.93462 12.8 12.8 9.93462 12.8 6.4C12.8 2.86538 9.93462 0 6.4 0C2.86538 0 0 2.86538 0 6.4C0 9.93462 2.86538 12.8 6.4 12.8ZM4.24853 4.24853C4.44379 4.05327 4.76037 4.05327 4.95564 4.24853L6.4 5.69289L7.84436 4.24853C8.03963 4.05327 8.35621 4.05327 8.55147 4.24853C8.74674 4.44379 8.74674 4.76037 8.55147 4.95564L7.10711 6.4L8.55147 7.84436C8.74674 8.03963 8.74674 8.35621 8.55147 8.55147C8.35621 8.74674 8.03963 8.74674 7.84436 8.55147L6.4 7.10711L4.95564 8.55147C4.76037 8.74674 4.44379 8.74674 4.24853 8.55147C4.05327 8.35621 4.05327 8.03963 4.24853 7.84436L5.69289 6.4L4.24853 4.95564C4.05327 4.76037 4.05327 4.44379 4.24853 4.24853Z"
                    fill="white"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'white', lineHeight: 'normal' }}>
                  Sem estoque
                </span>
              </div>
            </div>
          </div>

          {/* Filial ES section */}
          <div className="mb-[24px]">
            <div className="flex items-center gap-[16px] mb-[8px]">
              <button
                className="w-[14px] h-[14px] rounded-full flex items-center justify-center p-0 bg-card cursor-pointer shrink-0"
                style={{ border: '1px solid var(--muted-foreground)' }}
              >
                <div className="w-[6px] h-[6px] rounded-full" style={{ background: 'transparent' }} />
              </button>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--foreground)', lineHeight: 'normal' }}>
                Filial ES
              </span>
            </div>
            <div className="flex items-center gap-[16px]">
              <button
                className="h-[41px] w-[132px] bg-[var(--background)] rounded-sm flex items-center justify-between px-[9px] cursor-pointer"
                style={{ border: '1px solid var(--muted)' }}
              >
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', lineHeight: 'normal' }}>
                  Item
                </span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="var(--foreground)" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div
                className="h-[33px] rounded-lg flex items-center gap-[16px] px-[24px] py-[12px]"
                style={{ background: 'var(--muted-foreground)' }}
              >
                <svg width="16" height="16" viewBox="0 0 12.8 12.8" fill="none" className="shrink-0">
                  <path
                    d="M6.4 12.8C9.93462 12.8 12.8 9.93462 12.8 6.4C12.8 2.86538 9.93462 0 6.4 0C2.86538 0 0 2.86538 0 6.4C0 9.93462 2.86538 12.8 6.4 12.8ZM4.24853 4.24853C4.44379 4.05327 4.76037 4.05327 4.95564 4.24853L6.4 5.69289L7.84436 4.24853C8.03963 4.05327 8.35621 4.05327 8.55147 4.24853C8.74674 4.44379 8.74674 4.76037 8.55147 4.95564L7.10711 6.4L8.55147 7.84436C8.74674 8.03963 8.74674 8.35621 8.55147 8.55147C8.35621 8.74674 8.03963 8.74674 7.84436 8.55147L6.4 7.10711L4.95564 8.55147C4.76037 8.74674 4.44379 8.74674 4.24853 8.55147C4.05327 8.35621 4.05327 8.03963 4.24853 7.84436L5.69289 6.4L4.24853 4.95564C4.05327 4.76037 4.05327 4.44379 4.24853 4.24853Z"
                    fill="white"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'white', lineHeight: 'normal' }}>
                  Sem estoque
                </span>
              </div>
            </div>
          </div>

          {/* Avise-me button */}
          <button
            className="h-[41px] w-[255px] rounded-lg flex items-center justify-center gap-[16px] cursor-pointer hover:opacity-90 transition-opacity"
            style={{
              background: 'transparent',
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-bold)',
              fontFamily: 'var(--font-red-hat-display)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 5.33333C12 4.27247 11.5786 3.25505 10.8284 2.50491C10.0783 1.75476 9.06087 1.33333 8 1.33333C6.93913 1.33333 5.92172 1.75476 5.17157 2.50491C4.42143 3.25505 4 4.27247 4 5.33333C4 10 2 11.3333 2 11.3333H14C14 11.3333 12 10 12 5.33333Z"
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.15335 13.3333C9.03614 13.5361 8.8688 13.7047 8.66693 13.8234C8.46506 13.9422 8.23532 14.0069 8.00068 14.0069C7.76604 14.0069 7.5363 13.9422 7.33443 13.8234C7.13256 13.7047 6.96522 13.5361 6.84802 13.3333"
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Avise-me quando chegar
          </button>
        </div>
      </div>

      {/* ══════ Frequentemente comprados juntos ══════ */}
      <section className="max-w-[1120px] mx-auto pb-[48px] px-4 overflow-visible">
        <h2
          className="m-0 mb-[24px]"
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--foreground)',
            lineHeight: 'normal',
          }}
        >
          Frequentemente comprados juntos
        </h2>

        <div className="hidden md:flex items-center gap-[16px]">
          <CircleArrowBtn direction="left" onClick={goPrev} />
          <div className="flex-1 flex gap-[16px] overflow-hidden">
            {visibleProducts.map((p) => (
              <ProductCard
                key={p.id}
                {...p}
                showHeart
                onNavigate={() => navigate('/produto/' + p.id)}
              />
            ))}
          </div>
          <CircleArrowBtn direction="right" onClick={goNext} />
        </div>

        {/* Mobile scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
          {relatedProducts.map((p) => (
            <ProductCard
              key={p.id}
              {...p}
              showHeart
              onNavigate={() => navigate('/produto/' + p.id)}
            />
          ))}
        </div>

        <div className="flex justify-center gap-[19px] mt-[16px]">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselPage(i)}
              className="border-none p-0 cursor-pointer rounded-full transition-colors"
              style={{
                width: 11,
                height: 11,
                background: i === carouselPage ? 'var(--primary)' : 'var(--muted)',
              }}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ══════ Product Showcase Images ══════ */}
      <section className="max-w-[1120px] mx-auto pb-[48px] px-4">
        {showcaseImages.map((img, i) => (
          <div key={i} className="mb-[0px]">
            <img
              src={img}
              alt={`Destaque do produto ${i + 1}`}
              className="w-full h-auto block rounded-lg"
            />
          </div>
        ))}
      </section>

      {/* ══════ Ficha Técnica ══════ */}
      <section className="max-w-[1120px] mx-auto pb-[48px] px-4">
        <div className="rounded-lg overflow-hidden" style={{ background: 'var(--background)' }}>
          <div className="px-4 md:px-[48px] pt-[32px] pb-[24px]">
            <h2
              className="m-0"
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--foreground)',
                lineHeight: 'normal',
              }}
            >
              Ficha Técnica
            </h2>
          </div>

          {/* Separator */}
          <div className="w-full h-px" style={{ background: 'var(--muted)' }} />

          {/* Specs rows */}
          <div className="px-4 md:px-[48px] py-[16px]">
            {specs.map((spec, i) => (
              <div key={spec.label}>
                <div className="flex py-[12px]">
                  <span
                    className="w-[200px] shrink-0"
                    style={{ fontSize: 'var(--text-base)', color: 'var(--foreground)', lineHeight: 'normal' }}
                  >
                    {spec.label}:
                  </span>
                  <span
                    style={{ fontSize: 'var(--text-base)', color: 'var(--foreground)', lineHeight: 'normal' }}
                  >
                    {spec.value}
                  </span>
                </div>
                {i < specs.length - 1 && (
                  <div className="w-full h-px" style={{ background: 'var(--muted)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}