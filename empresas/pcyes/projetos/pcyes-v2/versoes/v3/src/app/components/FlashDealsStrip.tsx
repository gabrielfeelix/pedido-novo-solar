"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { ChevronLeft, ChevronRight, Flame, Heart, ShoppingBag, Timer } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts, type Product } from "./productsData";
import {
  getPrimaryProductImage,
  getProductSwatches,
  getVisibleCatalogProducts,
} from "./productPresentation";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useFavorites } from "./FavoritesContext";

const DEAL_IDS = [436, 72, 199, 329, 446, 433, 30, 295, 375];

function getDealEnd() {
  const end = new Date();
  end.setDate(end.getDate() + 1);
  end.setHours(23, 59, 59, 999);
  return end.getTime();
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(target - now, 0);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

function CountdownChip({ days, hours, minutes, seconds }: { days: number; hours: number; minutes: number; seconds: number }) {
  const units = [
    { label: "D", value: pad(days) },
    { label: "H", value: pad(hours) },
    { label: "M", value: pad(minutes) },
    { label: "S", value: pad(seconds) },
  ];
  return (
    <div
      className="inline-flex items-center gap-3 rounded-full px-4 py-2.5"
      style={{
        background: "rgba(0, 0, 0, 0.6)",
        border: "1px solid rgba(225, 6, 0, 0.5)",
        boxShadow: "0 0 28px -4px rgba(225, 6, 0, 0.55), inset 0 0 0 1px rgba(225, 6, 0, 0.08)",
      }}
    >
      <Timer size={18} strokeWidth={2.2} style={{ color: "var(--primary)" }} />
      <div className="flex items-center gap-2">
        {units.map((u, i) => (
          <span key={u.label} className="flex items-center gap-2">
            <span
              className="text-white tabular-nums"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              {u.value}
            </span>
            <span
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "10px",
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.45)",
                letterSpacing: "0.06em",
              }}
            >
              {u.label}
            </span>
            {i < units.length - 1 && (
              <span style={{ color: "rgba(255, 255, 255, 0.25)" }}>:</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

interface DealCardProps {
  product: Product;
  emphasize: boolean;
  onAdd: (product: Product) => void;
}

function DealCard({ product, emphasize, onAdd }: DealCardProps) {
  const swatches = getProductSwatches(product);
  const [selectedSwatchId, setSelectedSwatchId] = useState<number | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const { isLoggedIn } = useAuth();
  const { addFavorite } = useFavorites();
  const displayProduct = (selectedSwatchId ? allProducts.find((p) => p.id === selectedSwatchId) : null) ?? product;
  const image = getPrimaryProductImage(displayProduct);
  const oldPriceNum = product.oldPriceNum ?? (emphasize ? product.priceNum * 1.22 : 0);
  const discount =
    oldPriceNum > product.priceNum
      ? Math.round(((oldPriceNum - product.priceNum) / oldPriceNum) * 100)
      : 0;

  return (
    <div
      className="snap-start flex-shrink-0 group"
      style={{ width: "380px" }}
    >
      <Link to={`/produto/${product.id}`} className="block">
        <div
          className="deal-card-img relative aspect-[5/6] overflow-hidden transition-all duration-300"
          style={{
            background:
              "linear-gradient(140deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)",
            borderRadius: "22px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.06) 0%, transparent 55%)",
              borderRadius: "22px",
            }}
          />

          {discount > 0 && (
            <span
              className="absolute z-20 inline-flex items-center text-white"
              style={{
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                top: "14px",
                left: "14px",
                padding: "6px 12px",
                borderRadius: "10px",
                fontFamily: "var(--font-family-figtree)",
                fontSize: "15px",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                boxShadow: "0 12px 28px -8px rgba(34,197,94,0.55)",
              }}
            >
              -{discount}%
            </span>
          )}

          <ImageWithFallback
            src={image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-contain p-9 transition-transform duration-500 group-hover:scale-[1.06]"
          />

          {/* Favorite (top-right, on hover) — only when logged in */}
          {isLoggedIn && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFavorited(!isFavorited);
                addFavorite({ id: product.id, name: product.name, price: product.price, image });
              }}
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border opacity-0 transition-all duration-200 group-hover:opacity-100 cursor-pointer"
              style={{
                background: isFavorited ? "rgba(225, 6, 0, 0.2)" : "rgba(0, 0, 0, 0.55)",
                border: isFavorited ? "1px solid rgba(225, 6, 0, 0.8)" : "1px solid rgba(255, 255, 255, 0.15)",
                color: isFavorited ? "#ff2419" : "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(8px)",
              }}
              aria-label="Favoritar"
            >
              <Heart size={13} strokeWidth={isFavorited ? 0 : 1.8} fill={isFavorited ? "#ff2419" : "none"} />
            </button>
          )}

          {/* Quick add on hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onAdd(product);
            }}
            className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 translate-y-2 whitespace-nowrap rounded-full px-10 py-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
              color: "white",
              fontFamily: "var(--font-family-inter)",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              boxShadow: "0 10px 24px -8px rgba(225, 6, 0, 0.7)",
            }}
          >
            <span className="inline-flex items-center gap-2"><ShoppingBag size={14} strokeWidth={2} /> Comprar</span>
          </button>
        </div>

        <div className="mt-4 px-1">
          <h3
            className="line-clamp-1 text-white"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "15px",
              fontWeight: 600,
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
            }}
          >
            {product.name}
          </h3>

          <div className="mt-3">
            {oldPriceNum > product.priceNum && (
              <p
                className="line-through leading-none mb-1"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.38)",
                }}
              >
                {product.oldPrice ?? `R$ ${oldPriceNum.toFixed(2).replace(".", ",")}`}
              </p>
            )}
            <p
              className="text-white whitespace-nowrap leading-none"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "-0.015em",
              }}
            >
              {product.price}
            </p>
            <p className="mt-1.5 leading-tight" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>
              No PIX ou 10x de R$ {(product.priceNum / 10).toFixed(2).replace(".", ",")}
            </p>
          </div>

        </div>
      </Link>
      {swatches.length > 0 && (
        <div className="mt-2.5 px-1 flex items-center gap-1.5">
          {swatches.slice(0, 5).map((s) => {
            const active = s.productId === displayProduct.id;
            return (
              <button
                key={s.productId}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSwatchId(active ? null : s.productId);
                }}
                className="inline-block h-3 w-3 rounded-full cursor-pointer transition-all hover:scale-110"
                style={{
                  background: s.color,
                  border: active ? "2px solid rgba(225,6,0,0.9)" : "1px solid rgba(255, 255, 255, 0.18)",
                  boxShadow: active ? "0 0 8px rgba(225,6,0,0.5)" : "none",
                }}
                aria-label={s.label}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FlashDealsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { addItem } = useCart();
  const endRef = useRef(getDealEnd());
  const time = useCountdown(endRef.current);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const products = useMemo(() => {
    const visible = getVisibleCatalogProducts(allProducts);
    const picked = DEAL_IDS
      .map((id) => visible.find((p) => p.id === id))
      .filter(Boolean) as Product[];
    return picked.length > 0 ? picked : visible.slice(0, 9);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [products]);

  const scrollByCards = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (380 + 24) * 2, behavior: "smooth" });
  };

  const navBtn = (onClick: () => void, disabled: boolean, label: string, icon: React.ReactNode, side: "left" | "right") => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-[228px] z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/85 backdrop-blur-md transition-all hover:border-[var(--primary)]/60 hover:bg-[var(--primary)]/15 hover:text-white hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer md:flex ${side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"}`}
      aria-label={label}
    >
      {icon}
    </button>
  );

  return (
    <section
      ref={ref}
      className="px-5 md:px-[72px]"
      style={{
        paddingTop: "var(--space-section-sm)",
        paddingBottom: "var(--space-section-md)",
        background: "#0a0a0a",
      }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: "1600px" }}>
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="flex flex-col"
          >
            <span
              className="mb-3 inline-flex items-center gap-1.5"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.3em",
                color: "var(--primary)",
              }}
            >
              <Flame size={13} strokeWidth={2.2} />
              // PROMOÇÕES DA SEMANA
            </span>
            <h2
              className="text-white"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(28px, 3vw, 38px)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Os deals que estão dominando
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <CountdownChip {...time} />
          </motion.div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="deals-track flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.04 * i }}
              >
                <DealCard product={product} emphasize onAdd={(p) =>
                  addItem({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    image: getPrimaryProductImage(p),
                  })
                } />
              </motion.div>
            ))}
          </div>

          {navBtn(() => scrollByCards(-1), !canPrev, "Anterior", <ChevronLeft size={20} strokeWidth={2.2} />, "left")}
          {navBtn(() => scrollByCards(1), !canNext, "Próximo", <ChevronRight size={20} strokeWidth={2.2} />, "right")}
        </div>
      </div>
    </section>
  );
}
