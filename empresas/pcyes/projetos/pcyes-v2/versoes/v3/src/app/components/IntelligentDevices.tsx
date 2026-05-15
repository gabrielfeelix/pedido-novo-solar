"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Headphones, Heart, Keyboard, Mouse, Monitor, ShoppingBag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";
import { allProducts, type Product } from "./productsData";
import { getPrimaryProductImage, getVisibleCatalogProducts } from "./productPresentation";

interface CategoryDef {
  label: string;
  Icon: typeof Headphones;
  href: string;
  match: (p: Product) => boolean;
}

const CATEGORIES: CategoryDef[] = [
  {
    label: "Headsets",
    Icon: Headphones,
    href: "/produtos?search=headset",
    match: (p) => /headset|fone/i.test(p.name),
  },
  {
    label: "Teclados",
    Icon: Keyboard,
    href: "/produtos?search=teclado",
    match: (p) => /teclado|keyboard/i.test(p.name),
  },
  {
    label: "Mouses",
    Icon: Mouse,
    href: "/produtos?search=mouse",
    match: (p) => /mouse/i.test(p.name) && !/microfone/i.test(p.name),
  },
  {
    label: "Monitores",
    Icon: Monitor,
    href: "/produtos?category=Monitores",
    match: (p) => p.category === "Monitores" || /monitor/i.test(p.name),
  },
];

const GLITCH_WORDS = ["Gamers", "Streamers", "Escritório", "Performance"];
const GLITCH_INTERVAL = 1500;

function GlitchWord({ word }: { word: string }) {
  return (
    <span className="glitch-word" key={word}>
      <span className="glitch-word-base">{word}</span>
      <span className="glitch-word-r" aria-hidden>{word}</span>
    </span>
  );
}

export function IntelligentDevices() {
  const [wordIdx, setWordIdx] = useState(0);
  const [activeCat, setActiveCat] = useState(0);
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());
  const { addItem } = useCart();
  const { addFavorite } = useFavorites();

  useEffect(() => {
    const id = setInterval(() => {
      setWordIdx((i) => (i + 1) % GLITCH_WORDS.length);
    }, GLITCH_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const visibleCatalog = useMemo(() => getVisibleCatalogProducts(allProducts), []);

  const products = useMemo(() => {
    const cat = CATEGORIES[activeCat];
    return visibleCatalog.filter(cat.match).slice(0, 5);
  }, [visibleCatalog, activeCat]);

  return (
    <section
      className="relative px-5 md:px-[72px]"
      style={{
        paddingTop: "var(--space-section-sm)",
        paddingBottom: "var(--space-section-lg)",
        background: "#0a0a0a",
        overflow: "hidden",
      }}
    >
      {/* Matrix-style backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(0deg, transparent 24%, rgba(225, 6, 0, 0.4) 25%, rgba(225, 6, 0, 0.4) 26%, transparent 27%, transparent 74%, rgba(225, 6, 0, 0.4) 75%, rgba(225, 6, 0, 0.4) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(225, 6, 0, 0.4) 25%, rgba(225, 6, 0, 0.4) 26%, transparent 27%, transparent 74%, rgba(225, 6, 0, 0.4) 75%, rgba(225, 6, 0, 0.4) 76%, transparent 77%, transparent)",
          backgroundSize: "60px 60px",
        }}
      />

      <div
        className="relative mx-auto w-full"
        style={{ maxWidth: "1600px" }}
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <p
            className="mb-4"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "var(--primary)",
            }}
          >
            // BUILT FOR PERFORMANCE
          </p>
          <h2
            className="text-white"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(32px, 4vw, 56px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
            }}
          >
            Tecnologia para{" "}
            <GlitchWord word={GLITCH_WORDS[wordIdx]} />
          </h2>
        </div>

        {/* Category circles */}
        <div className="mb-14 flex flex-wrap items-start justify-center gap-8 md:gap-12">
          {CATEGORIES.map((cat, i) => {
            const isActive = i === activeCat;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCat(i)}
                className="group flex flex-col items-center gap-3 focus:outline-none cursor-pointer"
                aria-pressed={isActive}
              >
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 md:h-24 md:w-24"
                  style={{
                    background: isActive
                      ? "radial-gradient(circle at 50% 50%, rgba(225, 6, 0, 0.22) 0%, rgba(225, 6, 0, 0.05) 70%, transparent 100%)"
                      : "rgba(255, 255, 255, 0.04)",
                    border: isActive
                      ? "1.5px solid rgba(225, 6, 0, 0.7)"
                      : "1px solid rgba(255, 255, 255, 0.10)",
                    boxShadow: isActive
                      ? "0 0 0 5px rgba(225, 6, 0, 0.06), 0 0 28px -2px rgba(225, 6, 0, 0.55)"
                      : "none",
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  <cat.Icon
                    size={isActive ? 34 : 30}
                    strokeWidth={1.5}
                    style={{
                      color: isActive ? "#ff2419" : "rgba(255, 255, 255, 0.6)",
                      filter: isActive
                        ? "drop-shadow(0 0 8px rgba(225, 6, 0, 0.5))"
                        : "none",
                      transition: "color 280ms ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "13px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.55)",
                    letterSpacing: "0.02em",
                    transition: "color 280ms ease, font-weight 280ms ease",
                  }}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products row */}
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => {
            const image = getPrimaryProductImage(product);
            const isFav = favoritedIds.has(product.id);
            return (
              <div key={product.id} className="group block">
                <Link to={`/produto/${product.id}`} className="block">
                  <div
                    className="relative aspect-square overflow-hidden transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(140deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
                      borderRadius: "20px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.06) 0%, transparent 55%)",
                        borderRadius: "20px",
                      }}
                    />
                    <ImageWithFallback
                      src={image}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-contain p-7 transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                    {/* Hover actions */}
                    {/* Favorite */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setFavoritedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(product.id)) next.delete(product.id);
                          else next.add(product.id);
                          return next;
                        });
                        addFavorite({ id: product.id, name: product.name, price: product.price, image });
                      }}
                      className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border opacity-0 transition-all duration-200 group-hover:opacity-100 cursor-pointer"
                      style={{
                        background: isFav ? "rgba(225, 6, 0, 0.2)" : "rgba(0, 0, 0, 0.55)",
                        border: isFav ? "1px solid rgba(225, 6, 0, 0.8)" : "1px solid rgba(255, 255, 255, 0.15)",
                        color: isFav ? "#ff2419" : "rgba(255, 255, 255, 0.85)",
                        backdropFilter: "blur(8px)",
                      }}
                      aria-label="Favoritar"
                    >
                      <Heart size={13} strokeWidth={isFav ? 0 : 1.8} fill={isFav ? "#ff2419" : "none"} />
                    </button>

                    {/* Quick add — floating pill */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem({ id: product.id, name: product.name, price: product.price, image });
                      }}
                      className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 translate-y-2 whitespace-nowrap rounded-full px-5 py-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
                      style={{
                        background: "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
                        color: "white",
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        boxShadow: "0 10px 26px -6px rgba(225,6,0,0.6)",
                      }}
                    >
                      <span className="inline-flex items-center gap-1.5"><ShoppingBag size={12} strokeWidth={2} /> Comprar</span>
                    </button>
                  </div>
                  <div className="mt-4 px-1">
                    <h3
                      className="line-clamp-1 text-white"
                      style={{
                        fontFamily: "var(--font-family-figtree)",
                        fontSize: "14px",
                        fontWeight: 600,
                        lineHeight: 1.25,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="mt-2 text-white"
                      style={{
                        fontFamily: "var(--font-family-figtree)",
                        fontSize: "16px",
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {product.price}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* See-all link */}
        <div className="mt-10 text-center">
          <Link
            to={CATEGORIES[activeCat].href}
            className="inline-flex items-center gap-2 rounded-full border px-6 py-2.5 transition-all hover:scale-[1.03] cursor-pointer"
            style={{
              border: "1px solid rgba(225, 6, 0, 0.5)",
              color: "rgba(255, 80, 70, 0.95)",
              fontFamily: "var(--font-family-inter)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Ver mais em {CATEGORIES[activeCat].label}
          </Link>
        </div>
      </div>
    </section>
  );
}
