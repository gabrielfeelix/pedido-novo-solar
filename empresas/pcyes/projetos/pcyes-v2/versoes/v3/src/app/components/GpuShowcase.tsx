"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, GripVertical } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts, type Product } from "./productsData";
import { getPrimaryProductImage } from "./productPresentation";

interface Comparison {
  id: string;
  productId: number;
  newName: string;
  previousName: string;
  tagline: string;
  metric: string;
  scene: string;
}

const COMPARISONS: Comparison[] = [
  {
    id: "rtx-3070",
    productId: 500,
    newName: "RTX 3070",
    previousName: "RTX 2060",
    tagline: "Ray Tracing + DLSS 3 em 4K",
    metric: "+85% FPS",
    scene: "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=2000&q=90&auto=format&fit=crop",
  },
  {
    id: "rtx-3060",
    productId: 433,
    newName: "RTX 3060",
    previousName: "GTX 1660",
    tagline: "12GB GDDR6 + Ampere Cores",
    metric: "+60% FPS",
    scene: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=2000&q=90&auto=format&fit=crop",
  },
  {
    id: "rtx-3050",
    productId: 434,
    newName: "RTX 3050",
    previousName: "GTX 1050 Ti",
    tagline: "Ray Tracing acessível em Full HD",
    metric: "+72% FPS",
    scene: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=2000&q=90&auto=format&fit=crop",
  },
  {
    id: "rtx-3060-w",
    productId: 435,
    newName: "RTX 3060 White",
    previousName: "RTX 2060",
    tagline: "Build clean + Ray Tracing",
    metric: "+45% FPS",
    scene: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=2000&q=90&auto=format&fit=crop",
  },
];

const BEFORE_FILTER = "saturate(0.2) brightness(0.55) contrast(0.85) blur(0.5px)";
const AFTER_FILTER = "saturate(1.6) contrast(1.18) brightness(1.05)";
const ACCENT = "#ff2419";
const ACCENT_GLOW = "rgba(225, 6, 0, 0.55)";
const ACCENT_BG = "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)";

export function GpuShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [pos, setPos] = useState(52);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const active = COMPARISONS[activeIdx];
  const productById = useMemo(() => new Map(allProducts.map((p) => [p.id, p])), []);
  const product = productById.get(active.productId) as Product | undefined;

  const updatePosition = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, pct)));
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      const x = "touches" in e ? e.touches[0]?.clientX : e.clientX;
      if (typeof x === "number") updatePosition(x);
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const startDrag = () => {
    draggingRef.current = true;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
  };

  const handleAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingRef.current) return;
    updatePosition(e.clientX);
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: "var(--space-section-lg)",
        paddingBottom: "var(--space-section-lg)",
        background: "#080808",
      }}
    >
      {/* Backdrop glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(800px 500px at 50% 0%, rgba(225, 6, 0, 0.12) 0%, transparent 60%), radial-gradient(600px 400px at 50% 100%, rgba(225, 6, 0, 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative w-full">
        {/* Header (contained) */}
        <div className="mb-10 md:mb-14 text-center px-5 md:px-[72px] mx-auto" style={{ maxWidth: "1600px" }}>
          <p
            className="mb-3"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "var(--primary)",
            }}
          >
            BEFORE / AFTER
          </p>
          <h2
            className="text-white mx-auto"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(32px, 4.4vw, 56px)",
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              maxWidth: "900px",
            }}
          >
            Sinta o salto visual com a{" "}
            <span style={{ color: ACCENT }}>nova geração</span>
          </h2>
          <p
            className="mx-auto mt-4"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "15px",
              color: "rgba(255, 255, 255, 0.55)",
              maxWidth: "560px",
              lineHeight: 1.5,
            }}
          >
            Escolha uma placa e arraste para comparar a renderização entre gerações.
          </p>
        </div>

        {/* GPU pill selector (contained) */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 md:gap-3 px-5 md:px-[72px]">
          {COMPARISONS.map((c, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveIdx(i);
                  setPos(52);
                }}
                className="relative rounded-full px-5 py-2.5 transition-all duration-300 cursor-pointer"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, rgba(225,6,0,0.18) 0%, rgba(225,6,0,0.06) 100%)"
                    : "rgba(255,255,255,0.04)",
                  border: isActive
                    ? "1px solid rgba(225,6,0,0.65)"
                    : "1px solid rgba(255,255,255,0.10)",
                  boxShadow: isActive
                    ? "0 0 0 4px rgba(225,6,0,0.06), 0 8px 24px -8px rgba(225,6,0,0.5)"
                    : "none",
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.65)",
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: "0.02em",
                }}
              >
                {c.newName}
              </button>
            );
          })}
        </div>

        {/* Comparison area — full width */}
        <div
          ref={containerRef}
          onClick={handleAreaClick}
          className="relative w-full select-none overflow-hidden cursor-ew-resize"
          style={{
            aspectRatio: "21 / 9",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              {/* "Before" — full image with degraded filter */}
              <div className="absolute inset-0">
                <ImageWithFallback
                  src={active.scene}
                  alt="Antes"
                  className="h-full w-full object-cover"
                  style={{ filter: BEFORE_FILTER }}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.6) 100%)",
                  }}
                />
              </div>

              {/* "After" — clipped from slider to right edge */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
              >
                <ImageWithFallback
                  src={active.scene}
                  alt="Depois"
                  className="h-full w-full object-cover"
                  style={{ filter: AFTER_FILTER }}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.0) 55%, rgba(0,0,0,0.55) 100%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(225,6,0,0.08) 0%, transparent 60%)",
                    mixBlendMode: "screen",
                  }}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Badges */}
          <div className="pointer-events-none absolute left-4 bottom-4 md:left-6 md:bottom-6 z-20">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 backdrop-blur-md"
              style={{
                background: "rgba(20, 20, 22, 0.65)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "10.5px",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                }}
              >
                Geração anterior
              </span>
              <span
                className="text-white"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                {active.previousName}
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute right-4 bottom-4 md:right-6 md:bottom-6 z-20">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 backdrop-blur-md"
              style={{
                background: "rgba(20, 20, 22, 0.7)",
                border: "1px solid rgba(225, 6, 0, 0.45)",
                boxShadow: "0 0 24px -6px rgba(225, 6, 0, 0.5)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "10.5px",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                }}
              >
                Nova geração
              </span>
              <span
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: ACCENT,
                }}
              >
                {active.newName}
              </span>
            </div>
          </div>

          {/* Metric badge top-center */}
          <div className="pointer-events-none absolute top-5 left-1/2 z-20 -translate-x-1/2">
            <div
              className="rounded-full px-3.5 py-1.5 backdrop-blur-md"
              style={{
                background: "rgba(0, 0, 0, 0.55)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: ACCENT,
                }}
              >
                {active.metric} · {active.tagline}
              </span>
            </div>
          </div>

          {/* Slider line + handle */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 z-30"
            style={{
              left: `${pos}%`,
              width: "2px",
              transform: "translateX(-50%)",
              background: `linear-gradient(180deg, transparent 0%, ${ACCENT} 12%, ${ACCENT} 88%, transparent 100%)`,
              boxShadow: `0 0 24px ${ACCENT}, 0 0 60px ${ACCENT_GLOW}`,
            }}
          />
          <button
            onMouseDown={(e) => {
              e.stopPropagation();
              startDrag();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              startDrag();
            }}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-1/2 z-40 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
            style={{
              left: `${pos}%`,
              background: ACCENT_BG,
              boxShadow: `0 0 0 6px rgba(225, 6, 0, 0.18), 0 14px 32px -8px ${ACCENT_GLOW}`,
              cursor: "ew-resize",
            }}
            aria-label="Arrastar para comparar"
          >
            <GripVertical size={20} strokeWidth={2.6} color="#ffffff" />
          </button>
        </div>

        {/* Featured product card */}
        {product && (
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.35 }}
              className="mx-auto mt-8 md:mt-10 max-w-[680px] px-5 md:px-8"
            >
              <div
                className="flex items-center gap-4 md:gap-5 rounded-2xl p-3 md:p-4"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <div
                  className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 overflow-hidden"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <ImageWithFallback
                    src={getPrimaryProductImage(product)}
                    alt={product.name}
                    className="h-full w-full object-contain p-1.5"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      color: "rgba(255,255,255,0.45)",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Featured Build
                  </p>
                  <h3
                    className="line-clamp-1 text-white"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "clamp(14px, 1.5vw, 16px)",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {active.newName} · {active.tagline}
                  </h3>
                  <p
                    className="mt-1 text-white"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "15px",
                      fontWeight: 700,
                    }}
                  >
                    {product.price}
                  </p>
                </div>

                <Link
                  to={`/produto/${product.id}`}
                  className="flex-shrink-0 inline-flex items-center gap-2 whitespace-nowrap rounded-full px-10 py-3 transition-transform hover:scale-[1.04] active:scale-[0.97]"
                  style={{
                    background: ACCENT_BG,
                    color: "#ffffff",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    boxShadow: `0 10px 28px -8px ${ACCENT_GLOW}`,
                  }}
                >
                  Comprar <ArrowRight size={15} strokeWidth={2.4} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
