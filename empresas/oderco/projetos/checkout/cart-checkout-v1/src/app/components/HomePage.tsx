import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ProductCard, type ProductCardProps } from './ProductCard';
import { PRODUCT_CATALOG } from './cart-data';
import svgPaths from '../../imports/svg-r4oquq50dm';

/* ──────────── Figma assets ──────────── */
import imgBanner from "figma:asset/c009d737b3d3f3ccbd3981964f32117a77a23f5c.png";
import imgImage13 from "figma:asset/ed79d0598414c685f5b801ef040fc004f3eecea4.png";
import imgImage14 from "figma:asset/4d4ea1b60fd9ca8ec0bc30f6193822f23a96574c.png";
import imgImage15 from "figma:asset/a9b7df9206b6d0dccf0f58fda3fe81348601a427.png";
import imgImage16 from "figma:asset/a6ab84d91fda070c0cec2082b28f19cc64a62c96.png";
import imgImage17 from "figma:asset/cdb14565c44fe5ed6a3e3c39d670edf4038b88ce.png";
import imgImage18 from "figma:asset/e9e401aa57820aac03da5e71769d2d8229e8fb90.png";
import imgImage19 from "figma:asset/2a343442b22fec47e6484f3ddbce3062f231414b.png";
import imgImage20 from "figma:asset/5c298640989b81161b495dd51abcc82ffe305a6f.png";
import imgImage21 from "figma:asset/dbde0dea1a0ed58cf565a1891e5b318aa242d744.png";
import imgImage40 from "figma:asset/72fb23868abb0d3108999bc5ddf35e3e75b76da9.png";
import imgImage41 from "figma:asset/b433a9b15b7770d24d94a73aaa58683a44952953.png";
import imgRectangle117 from "figma:asset/453fd038908cf8cd56f17a4a960ad93de7e39cfa.png";
import imgRectangle118 from "figma:asset/3d413add729cf5bb1b80a82d2dc981a048ab91df.png";
import imgRectangle225 from "figma:asset/a1e2ae1a6404fc8c4a0f6b55a8e2e37f06ddff69.png";
import imgRectangle226 from "figma:asset/1cb24e9c865fc9abc487864e1ed5552836f131a1.png";
import imgRectangle227 from "figma:asset/26e9b7c84b677d7027cda3f09426006f1624c004.png";
import imgPcyes from "figma:asset/837c33710ad1e89bf66593ea11b908fcbd936595.png";
import imgVinik from "figma:asset/a685d7fbca11720cda854b5ee404d7d108a8777e.png";
import imgSkul from "figma:asset/3b20ff8a7b242ede3b0cd58c393e6f164b12c28a.png";
import imgTonante from "figma:asset/5ebc8c7a95afe3aa22e99763a7125dcbff3f558d.png";
import imgQuati from "figma:asset/3128529bda2748f72636578ccb35a7d37b842952.png";
import imgOdex from "figma:asset/f0764ece8243087d45145996ab644288cb7e8102.png";

/* ──────────── Reusable small icons ──────────── */

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

function SectionDropdownArrow() {
  return (
    <div
      className="w-[24px] h-[24px] rounded-full flex items-center justify-center cursor-pointer -rotate-90 shrink-0"
      style={{ background: 'var(--primary-surface-md)' }}
    >
      <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
        <path
          d="M6 7.5L12 13.5L18 7.5"
          stroke="var(--primary)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          transform="translate(-3,-3)"
        />
      </svg>
    </div>
  );
}

/* ──────────── Carousel component ──────────── */

function ProductCarousel({
  products,
  navigate,
}: {
  products: ProductCardProps[];
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [page, setPage] = useState(0);
  const visibleCount = 4;
  const totalPages = Math.max(1, Math.ceil(products.length / visibleCount));

  const goNext = useCallback(() => {
    setPage((p) => (p + 1) % totalPages);
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setPage((p) => (p - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const start = page * visibleCount;
  const visible = products.slice(start, start + visibleCount);

  return (
    <div>
      {/* Desktop carousel with arrows */}
      <div className="relative hidden md:block">
        <button
          onClick={goPrev}
          className="absolute -left-[40px] top-1/2 -translate-y-1/2 z-10 shrink-0 bg-transparent border-none cursor-pointer p-0 hover:opacity-70 transition-opacity"
          aria-label="Anterior"
        >
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none" className="rotate-180">
            <circle cx="13.5" cy="13.5" r="13" stroke="var(--primary)" />
            <path d="M11 20L17 14L11 8" stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>

        <div className="flex gap-[16px] overflow-hidden w-full">
          {visible.map((p) => (
            <ProductCard
              key={p.id}
              {...p}
              showHeart
              onNavigate={() => navigate('/produto/' + p.id)}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="absolute -right-[40px] top-1/2 -translate-y-1/2 z-10 shrink-0 bg-transparent border-none cursor-pointer p-0 hover:opacity-70 transition-opacity"
          aria-label="Próximo"
        >
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
            <circle cx="13.5" cy="13.5" r="13" stroke="var(--primary)" />
            <path d="M11 20L17 14L11 8" stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Mobile horizontal scroll */}
      <div className="md:hidden flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            {...p}
            showHeart
            onNavigate={() => navigate('/produto/' + p.id)}
          />
        ))}
      </div>

      {/* Pagination dots - desktop only */}
      <div className="hidden md:flex justify-center gap-[19px] mt-[16px]">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className="border-none p-0 cursor-pointer rounded-full transition-colors"
            style={{
              width: 11,
              height: 11,
              background: i === page ? 'var(--primary)' : 'var(--muted)',
            }}
            aria-label={`Página ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ──────────── Data ──────────── */

// Pcyes Week: todos os 10 produtos do catálogo
const pcyesWeekProducts: ProductCardProps[] = PRODUCT_CATALOG.map((p) => ({ ...p }));

// Destaques: seleção com destaque para promoções e timers
const destaquesProducts: ProductCardProps[] = [
  { ...PRODUCT_CATALOG[3], hasTimer: true },   // Fonte ATX 500W — desconto + timer
  { ...PRODUCT_CATALOG[8], hasTimer: false },  // GPU GTX 1650 — desconto
  { ...PRODUCT_CATALOG[6], hasTimer: true },   // Cadeira Gamer — timer
  { ...PRODUCT_CATALOG[7] },                   // Gabinete dual PR+ES
  { ...PRODUCT_CATALOG[1], discount: '-8%' },  // Teclado Gamer
  { ...PRODUCT_CATALOG[5] },                   // Monitor 24" ES
  { ...PRODUCT_CATALOG[2] },                   // Headset 7.1
  { ...PRODUCT_CATALOG[9] },                   // Mouse Wireless dual
];

const categories = [
  { name: 'Informática', image: imgImage13 },
  { name: 'Computadores', image: imgImage14 },
  { name: 'Musical', image: imgImage15 },
  { name: 'Cabos', image: imgImage16 },
  { name: 'Figures', image: imgImage17 },
  { name: 'Eletrônicos, TV e Áudio', image: imgImage18 },
  { name: 'Ferramentas', image: imgImage19 },
  { name: 'Casa e Construção', image: imgImage20 },
  { name: 'Energia Solar', image: imgImage21 },
];

const blogPosts = [
  {
    title: '3 Dicas para melhorar sua instalação solar',
    desc: 'Já pensou em otimizar seu tempo de instalação em até 30%?',
    image: imgRectangle225,
  },
  {
    title: '3 Dicas para melhorar sua instalação de som',
    desc: 'Já pensou em otimizar seu tempo de instalação em até 30%?',
    image: imgRectangle226,
  },
  {
    title: '3 Dicas para melhorar sua instalação elétrica',
    desc: 'Já pensou em otimizar seu tempo de instalação em até 30%?',
    image: imgRectangle227,
  },
];

/* ──────────── Page ──────────── */

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--background)' }}>
      {/* ═══════════ 1. Hero Banner ═══════════ */}
      <div
        className="w-full cursor-pointer"
        onClick={() => navigate('/lista')}
      >
        <img
          src={imgBanner}
          alt="PCYES MOVER Mouse Office"
          className="w-full h-auto block object-cover"
          style={{ maxHeight: 460 }}
        />
      </div>

      {/* ═══════════ 2. Promo Banners (two side‐by‐side) ═══════════ */}
      <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row gap-[16px] mt-[32px] px-4">
        <div
          className="flex-1 h-[200px] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => navigate('/lista')}
        >
          <img
            src={imgImage40}
            alt="Promoções"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="flex-1 h-[200px] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => navigate('/lista')}
        >
          <img
            src={imgImage41}
            alt="Outlet"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ═══════════ 3. Pcyes Week ═══════════ */}
      <section className="max-w-[1120px] mx-auto mt-[40px] md:mt-[56px] overflow-visible px-4">
        <div className="flex items-center gap-[8px] mb-[24px]">
          <h2
            className="m-0"
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--foreground)',
              lineHeight: 'normal',
            }}
          >
            Pcyes Week
          </h2>
          <SectionDropdownArrow />
        </div>
        <ProductCarousel products={pcyesWeekProducts} navigate={navigate} />
      </section>

      {/* ═══════════ 4. #NaOderçoTem ═══════════ */}
      <section className="max-w-[1120px] mx-auto mt-[40px] md:mt-[64px] px-4">
        <h2
          className="m-0 mb-[24px] md:mb-[32px]"
          style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--foreground)',
            lineHeight: 'normal',
          }}
        >
          #NaOderçoTem
        </h2>
        <div className="flex gap-[32px] overflow-x-auto pb-[8px]">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex flex-col items-center cursor-pointer group shrink-0"
              onClick={() => navigate('/lista')}
            >
              <div
                className="w-[128px] h-[128px] rounded-full overflow-hidden flex items-center justify-center group-hover:shadow-elevation-sm transition-shadow"
                style={{ background: 'var(--background)' }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-[90%] h-[90%] object-contain"
                />
              </div>
              <p
                className="m-0 mt-[12px] text-center whitespace-nowrap"
                style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--foreground)',
                  lineHeight: 'normal',
                }}
              >
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ 5. Horizontal banner strip ═══════════ */}
      <div
        className="max-w-[1120px] mx-auto mt-[40px] md:mt-[56px] rounded-lg overflow-hidden h-[60px] md:h-[100px] cursor-pointer hover:opacity-90 transition-opacity px-4"
        onClick={() => navigate('/lista')}
      >
        <img
          src={imgRectangle118}
          alt="Alcance o EXTRAORDINÁRIO"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ═══════════ 6. Destaques ═══════════ */}
      <section className="max-w-[1120px] mx-auto mt-[40px] md:mt-[56px] overflow-visible px-4">
        <div className="flex items-center gap-[8px] mb-[24px]">
          <h2
            className="m-0"
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--foreground)',
              lineHeight: 'normal',
            }}
          >
            Destaques
          </h2>
          <SectionDropdownArrow />
        </div>
        <ProductCarousel products={destaquesProducts} navigate={navigate} />
      </section>

      {/* ═══════════ 7. Funko banner ═══════════ */}
      <div
        className="max-w-[1120px] mx-auto mt-[40px] md:mt-[56px] rounded-lg overflow-hidden h-[140px] md:h-[250px] cursor-pointer hover:opacity-90 transition-opacity px-4"
        onClick={() => navigate('/lista')}
      >
        <img
          src={imgRectangle117}
          alt="Funko"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* ═══════════ 8. Nossas Marcas ═══════════ */}
      <section className="max-w-[1120px] mx-auto mt-[40px] md:mt-[56px] px-4">
        <h2
          className="m-0 mb-[24px]"
          style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--foreground)',
            lineHeight: 'normal',
          }}
        >
          Nossas Marcas
        </h2>
        <div className="flex items-center gap-6 md:gap-[48px] flex-wrap">
          {[
            { src: imgPcyes, alt: 'PCYES', h: 39 },
            { src: imgVinik, alt: 'Vinik', h: 45 },
            { src: imgSkul, alt: 'Skul', h: 35 },
            { src: imgTonante, alt: 'Tonante', h: 51 },
            { src: imgQuati, alt: 'Quati', h: 58 },
            { src: imgOdex, alt: 'Odex', h: 34 },
          ].map((b) => (
            <img
              key={b.alt}
              src={b.src}
              alt={b.alt}
              className="object-contain cursor-pointer hover:opacity-70 transition-opacity"
              style={{ height: b.h, width: 110 }}
              onClick={() => navigate('/lista')}
            />
          ))}
        </div>
      </section>

      {/* ═══════════ 9. Nosso blog ═══════════ */}
      <section className="max-w-[1120px] mx-auto mt-[40px] md:mt-[56px] px-4">
        <div className="flex items-center gap-[8px] mb-[24px]">
          <h2
            className="m-0"
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--foreground)',
              lineHeight: 'normal',
            }}
          >
            Nosso blog
          </h2>
          <SectionDropdownArrow />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[16px]">
          {blogPosts.map((post, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => navigate('/lista')}
            >
              {/* Thumbnail */}
              <div className="h-[229px] overflow-hidden rounded-lg">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Text */}
              <div className="pt-[16px]">
                <p
                  className="m-0 mb-[4px]"
                  style={{ fontSize: 'var(--text-xs)', color: 'var(--warning)', lineHeight: 'normal' }}
                >
                  5 Minutos de leitura
                </p>
                <h3
                  className="m-0 mb-[8px]"
                  style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--primary)',
                    lineHeight: '1.2',
                  }}
                >
                  {post.title}
                </h3>
                <p
                  className="m-0"
                  style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--muted-foreground)',
                    lineHeight: '1.5',
                  }}
                >
                  {post.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ 10. Newsletter ═══════════ */}
      <section className="max-w-[1120px] mx-auto mt-[40px] md:mt-[56px] mb-[40px] md:mb-[56px] px-4">
        <div
          className="rounded-[24px] px-6 md:px-[68px] py-8 md:py-[56px] flex flex-col md:flex-row gap-8 md:gap-[80px]"
          style={{ background: 'var(--background)' }}
        >
          {/* Left: text + benefits */}
          <div className="flex-1">
            <h2
              className="m-0 mb-[12px]"
              style={{
                fontSize: 'var(--text-4xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--primary)',
                lineHeight: 'normal',
              }}
            >
              Cadastre-se na nossa newsletter!
            </h2>

            <p
              className="m-0 mb-[16px]"
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--foreground)',
                lineHeight: 'normal',
              }}
            >
              Benefícios de ser um assinante:
            </p>

            <div className="flex gap-[24px]">
              {/* Benefit 1 */}
              <div className="flex items-start gap-[8px]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-[2px]">
                  <path d={svgPaths.p13970000} stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d="M7 7H7.01" stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', lineHeight: '1.4' }}>
                  Receba em primeira mão nossas novidades
                </span>
              </div>
              {/* Benefit 2 */}
              <div className="flex items-start gap-[8px]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-[2px]">
                  <path d={svgPaths.p86b1500} stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d="M17 6H23V12" stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', lineHeight: '1.4' }}>
                  Esteja por dentro do que há de novo no mercado
                </span>
              </div>
              {/* Benefit 3 */}
              <div className="flex items-start gap-[8px]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-[2px]">
                  <path d={svgPaths.p1d50cd00} stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d="M22 6L12 13L2 6" stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', lineHeight: '1.4' }}>
                  Não enviamos spam
                </span>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="w-full md:w-[350px] shrink-0 flex flex-col gap-[16px]">
            <input
              type="text"
              placeholder="Nome"
              className="h-[46px] rounded-lg px-[14px] outline-none"
              style={{
                background: 'var(--background)',
                border: '1px solid var(--muted)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-red-hat-display)',
                color: 'var(--foreground)',
              }}
            />
            <input
              type="email"
              placeholder="Email"
              className="h-[46px] rounded-lg px-[14px] outline-none"
              style={{
                background: 'var(--background)',
                border: '1px solid var(--muted)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-red-hat-display)',
                color: 'var(--foreground)',
              }}
            />
            <button
              className="h-[46px] w-full md:w-[233px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              style={{
                background: 'transparent',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-bold)',
                fontFamily: 'var(--font-red-hat-display)',
              }}
            >
              Cadastrar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}