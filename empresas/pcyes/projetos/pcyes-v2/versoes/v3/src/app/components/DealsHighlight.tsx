"use client";

import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { ArrowRight, Heart, ShoppingBag, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";
import { allProducts, type Product } from "./productsData";
import {
  getPrimaryProductImage,
  getVisibleCatalogProducts,
} from "./productPresentation";

interface DealsHighlightProps {
  label?: string;
  title?: string;
  productIds: number[];
}

interface SmallCardProps {
  product: Product;
  onAdd: (p: Product) => void;
  onFavorite: (p: Product) => void;
}

function SmallProductCard({ product, onAdd, onFavorite }: SmallCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const image = getPrimaryProductImage(product);

  const oldPriceNum = product.oldPriceNum ?? product.priceNum * 1.18;
  const discount = oldPriceNum > product.priceNum
    ? Math.round(((oldPriceNum - product.priceNum) / oldPriceNum) * 100)
    : 0;

  const installment = (product.priceNum / 10).toFixed(2).replace(".", ",");

  return (
    <div className="group">
      <Link to={`/produto/${product.id}`} className="block">
        <div
          className="relative aspect-square overflow-hidden transition-all duration-300 neon-hover-red"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.06) 0%, transparent 55%)",
              borderRadius: "20px",
            }}
          />

          <ImageWithFallback
            src={image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.05]"
          />

          {/* Discount pill */}
          {discount > 0 && (
            <span
              className="absolute top-3 left-3 z-20 inline-flex items-center rounded-md px-2 py-0.5 leading-none"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "11px",
                fontWeight: 800,
                color: "#0a0a0a",
                background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                boxShadow: "0 4px 14px -4px rgba(16,185,129,0.6)",
                letterSpacing: "-0.01em",
              }}
            >
              -{discount}%
            </span>
          )}

          {/* Favorite (hover) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorited(!isFavorited);
              onFavorite(product);
            }}
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border opacity-0 transition-all duration-200 group-hover:opacity-100 cursor-pointer"
            style={{
              background: isFavorited ? "rgba(225,6,0,0.2)" : "rgba(0,0,0,0.55)",
              border: isFavorited ? "1px solid rgba(225,6,0,0.8)" : "1px solid rgba(255,255,255,0.15)",
              color: isFavorited ? "#ff2419" : "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
            }}
            aria-label="Favoritar"
          >
            <Heart size={13} strokeWidth={isFavorited ? 0 : 1.8} fill={isFavorited ? "#ff2419" : "none"} />
          </button>

          {/* Quick add pill */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAdd(product);
            }}
            className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 translate-y-2 whitespace-nowrap rounded-full px-4 py-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
              color: "white",
              fontFamily: "var(--font-family-inter)",
              fontSize: "10.5px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              boxShadow: "0 10px 26px -6px rgba(225,6,0,0.6)",
            }}
          >
            <span className="inline-flex items-center gap-1.5"><ShoppingBag size={11} strokeWidth={2} /> Adicionar</span>
          </button>
        </div>

        <div className="mt-3 px-1">
          <h3
            className="line-clamp-2 text-white"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "13px",
              fontWeight: 600,
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
              minHeight: "34px",
            }}
          >
            {product.name}
          </h3>

          <div className="mt-2">
            {oldPriceNum > product.priceNum && (
              <p
                className="line-through leading-none mb-0.5"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", color: "rgba(255,255,255,0.32)" }}
              >
                R$ {oldPriceNum.toFixed(2).replace(".", ",")}
              </p>
            )}
            <p
              className="text-white leading-none"
              style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              {product.price}
            </p>
            <p
              className="mt-1 leading-tight"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", color: "rgba(255,255,255,0.5)" }}
            >
              10x de R$ {installment}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function DealsHighlight({
  label = "OFERTAS",
  title = "Promoções imperdíveis",
  productIds,
}: DealsHighlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { addItem } = useCart();
  const { addFavorite } = useFavorites();

  const products = useMemo(() => {
    const visible = getVisibleCatalogProducts(allProducts);
    const resolved = productIds
      .map((id) => visible.find((p) => p.id === id))
      .filter(Boolean) as Product[];
    return resolved.slice(0, 8);
  }, [productIds]);

  const featured = products[0];
  const rest = products.slice(1, 7); // 6 products (3 cols × 2 rows)

  const handleAdd = (p: Product) =>
    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      image: getPrimaryProductImage(p),
    });
  const handleFavorite = (p: Product) =>
    addFavorite({
      id: p.id,
      name: p.name,
      price: p.price,
      image: getPrimaryProductImage(p),
    });

  return (
    <section
      ref={ref}
      className="px-5 md:px-[72px]"
      style={{
        paddingTop: "var(--space-section-md)",
        paddingBottom: "var(--space-section-lg)",
        background: "#0a0a0a",
      }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: "1600px" }}>
        {/* Header */}
        <div className="mb-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-3 text-primary"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.3em",
            }}
          >
            {label}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-white"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(28px, 3vw, 36px)",
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </motion.h2>
        </div>

        {/* Grid: products (left) + featured (right) */}
        <div className="grid gap-5 md:gap-6 lg:grid-cols-[2fr_1fr]">
          {/* LEFT: 6 products in 3 cols × 2 rows */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {rest.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.05 * i }}
              >
                <SmallProductCard
                  product={product}
                  onAdd={handleAdd}
                  onFavorite={handleFavorite}
                />
              </motion.div>
            ))}
          </div>

          {/* RIGHT: Featured promo card */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="relative overflow-hidden flex flex-col justify-between p-7 md:p-8"
              style={{
                background: "#000000",
                borderRadius: "24px",
                border: "1.5px solid rgba(225, 6, 0, 0.55)",
                boxShadow: "0 0 0 1px rgba(225, 6, 0, 0.15), 0 30px 80px -20px rgba(0,0,0,0.8), 0 0 40px -8px rgba(225, 6, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.04)",
                minHeight: "460px",
              }}
            >
              {/* Faint grid texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
              />

              <div className="relative">
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 mb-5"
                  style={{
                    background: "rgba(225,6,0,0.12)",
                    border: "1px solid rgba(225,6,0,0.4)",
                  }}
                >
                  <Zap size={11} strokeWidth={2.4} className="text-primary" />
                  <span
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: "rgba(255,90,80,0.95)",
                      textTransform: "uppercase",
                    }}
                  >
                    Top da semana
                  </span>
                </div>

                <h3
                  className="text-white mb-3"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "clamp(28px, 2.6vw, 36px)",
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {featured.name.split(" ").slice(0, 4).join(" ")}
                </h3>

                <p
                  className="mb-1.5"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.5,
                  }}
                >
                  Maior desconto da semana, até durar o estoque.
                </p>
              </div>

              {/* Product image */}
              <div className="relative flex-1 flex items-center justify-center my-6">
                <div
                  className="absolute inset-0 rounded-full opacity-50"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(225,6,0,0.4) 0%, transparent 60%)",
                    filter: "blur(40px)",
                  }}
                />
                <ImageWithFallback
                  src={getPrimaryProductImage(featured)}
                  alt={featured.name}
                  className="relative z-10 max-h-[200px] w-auto object-contain"
                  style={{ filter: "drop-shadow(0 24px 36px rgba(0,0,0,0.7))" }}
                />
              </div>

              <div className="relative">
                <div className="flex items-baseline gap-2 mb-1">
                  {featured.oldPrice && (
                    <p
                      className="line-through"
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      {featured.oldPrice}
                    </p>
                  )}
                  <span
                    className="inline-flex items-center rounded-md px-1.5 py-0.5 leading-none"
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#0a0a0a",
                      background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                    }}
                  >
                    -{featured.oldPriceNum
                      ? Math.round(((featured.oldPriceNum - featured.priceNum) / featured.oldPriceNum) * 100)
                      : 18}%
                  </span>
                </div>
                <p
                  className="text-white mb-5"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "32px",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {featured.price}
                </p>

                <Link
                  to={`/produto/${featured.id}`}
                  className="group/cta inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3.5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
                    color: "white",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    boxShadow: "0 14px 32px -8px rgba(225,6,0,0.6)",
                  }}
                >
                  Aproveitar oferta
                  <ArrowRight size={14} strokeWidth={2.4} className="transition-transform group-hover/cta:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
