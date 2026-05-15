"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "./CartContext";
import { allProducts, type Product } from "./productsData";
import { getPrimaryProductImage, getProductSwatches } from "./productPresentation";

const ESSENTIAL_IDS = [128, 173, 72, 436, 329] as const;

interface EssentialCardProps {
  product: Product;
}

function EssentialCard({ product }: EssentialCardProps) {
  const { addItem } = useCart();
  const [selectedSwatchId, setSelectedSwatchId] = useState<number | null>(null);

  const swatches = getProductSwatches(product);
  const selectedProduct = selectedSwatchId
    ? allProducts.find((p) => p.id === selectedSwatchId) ?? product
    : product;
  const image = getPrimaryProductImage(selectedProduct);
  const productHref = `/produto/${product.id}`;

  const shortDescription = useMemo(() => {
    const raw = product.description ?? "";
    const firstParagraph = raw.split("\n").find((line) => line.trim().length > 0) ?? "";
    return firstParagraph.length > 160
      ? `${firstParagraph.slice(0, 157).trim()}...`
      : firstParagraph;
  }, [product.description]);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image,
    });
  };

  return (
    <article
      className="essential-card group relative grid grid-cols-1 md:grid-cols-[2fr_3fr] overflow-hidden transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "22px",
        minHeight: "460px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -24px rgba(0,0,0,0.7)",
      }}
    >
      {/* Inner shine */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.06) 0%, transparent 55%)",
          borderRadius: "22px",
        }}
      />
      {/* Image side */}
      <Link
        to={productHref}
        className="relative flex items-center justify-start pl-8 pr-4 py-8 md:pl-10 md:pr-4 md:py-10 group"
      >
        <ImageWithFallback
          src={image}
          alt={product.name}
          className="relative z-10 max-h-[280px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
          style={{ filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.55))" }}
        />
      </Link>

      {/* Info side */}
      <div className="relative flex flex-col pl-4 pr-7 py-7 md:pl-4 md:pr-8 md:py-8 gap-5">
        <div className="flex flex-col gap-2">
          <Link
            to={productHref}
            className="text-white"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(20px, 1.9vw, 24px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              maxWidth: "85%",
            }}
          >
            {product.name}
          </Link>
        </div>

        {shortDescription && (
          <p
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "13px",
              lineHeight: 1.55,
              color: "rgba(255, 255, 255, 0.55)",
            }}
          >
            {shortDescription}
          </p>
        )}

        {swatches.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            <span
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              Cores:
            </span>
            <div className="flex items-center gap-2">
            {swatches.map((s) => (
              <button
                key={s.productId}
                type="button"
                onClick={() => setSelectedSwatchId(s.productId === selectedSwatchId ? null : s.productId)}
                className="h-4 w-4 rounded-full cursor-pointer transition-all hover:scale-110"
                style={{
                  background: s.color,
                  border: selectedSwatchId === s.productId
                    ? "2px solid rgba(225, 6, 0, 0.9)"
                    : "1px solid rgba(255, 255, 255, 0.22)",
                  boxShadow: selectedSwatchId === s.productId
                    ? "0 0 10px rgba(225, 6, 0, 0.5)"
                    : "none",
                }}
                aria-label={s.label}
              />
            ))}
            </div>
          </div>
        )}

        {product.tags?.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            <span
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              Destaques:
            </span>
            <div className="flex flex-wrap gap-2">
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold"
                  style={{
                    background: "rgba(225, 6, 0, 0.12)",
                    border: "1px solid rgba(225, 6, 0, 0.35)",
                    color: "rgba(255, 90, 80, 0.95)",
                    fontFamily: "var(--font-family-inter)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price + qty + CTA */}
        <div
          className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-xl px-5 py-3.5"
          style={{
            background: "rgba(0, 0, 0, 0.45)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <span
            className="text-white whitespace-nowrap"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            {product.price}
          </span>

          <button
            onClick={handleAdd}
            className="whitespace-nowrap rounded-full px-7 py-2.5 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
              color: "white",
              fontFamily: "var(--font-family-inter)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              boxShadow: "0 8px 22px -8px rgba(225, 6, 0, 0.65)",
            }}
          >
            Comprar
          </button>
        </div>
      </div>
    </article>
  );
}

export function EssentialsSection() {
  const products = useMemo(() => {
    const byId = new Map(allProducts.map((p) => [p.id, p]));
    return ESSENTIAL_IDS.map((id) => byId.get(id)).filter(
      (p): p is Product => Boolean(p),
    );
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 8);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [products]);

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-essential-card]");
    const cardW = card?.offsetWidth ?? 720;
    el.scrollBy({ left: dir * (cardW + 24), behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section
      className="px-5 md:px-[72px]"
      style={{
        paddingTop: "var(--space-section-lg)",
        paddingBottom: "var(--space-section-sm)",
        background: "#0a0a0a",
      }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: "1600px" }}>
        <div className="mb-10">
          <p
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "var(--primary)",
              marginBottom: "10px",
            }}
          >
            // ITENS EM DESTAQUE
          </p>
          <h2
            className="text-white"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(28px, 3.4vw, 44px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: "640px",
            }}
          >
            Essenciais para começar seu setup
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Anterior"
            className="absolute left-3 md:left-6 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/85 backdrop-blur-md transition-all hover:border-[var(--primary)]/60 hover:bg-[var(--primary)]/15 hover:text-white hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>

          <button
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Próximo"
            className="absolute right-3 md:right-6 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/85 backdrop-blur-md transition-all hover:border-[var(--primary)]/60 hover:bg-[var(--primary)]/15 hover:text-white hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight size={18} strokeWidth={2.2} />
          </button>

          <div
            ref={scrollRef}
            className="essentials-track flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                data-essential-card
                className="snap-start flex-shrink-0"
                style={{ width: "min(940px, 90vw)" }}
              >
                <EssentialCard product={product} />
              </div>
            ))}
          </div>

          {/* Gradient fade right */}
          {canNext && (
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 md:w-40"
              style={{
                background:
                  "linear-gradient(to left, #0a0a0a 0%, rgba(10,10,10,0.85) 35%, rgba(10,10,10,0) 100%)",
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
