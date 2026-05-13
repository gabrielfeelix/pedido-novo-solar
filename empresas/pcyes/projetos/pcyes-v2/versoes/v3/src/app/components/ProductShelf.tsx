import { useMemo, useRef } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { Heart, ShoppingBag, Star, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";
import { allProducts, type Product } from "./productsData";
import {
  getPrimaryProductImage,
  getVisibleCatalogProducts,
} from "./productPresentation";

interface ProductShelfProps {
  label: string;
  title: string;
  productIds: number[];
  showRanking?: boolean;
  emphasizeDiscount?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
}

export function ProductShelf({
  label,
  title,
  productIds,
  showRanking = false,
  emphasizeDiscount = false,
  ctaHref = "/produtos",
  ctaLabel = "Ver mais",
}: ProductShelfProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { addItem } = useCart();
  const { addFavorite } = useFavorites();

  const products = useMemo(() => {
    const visible = getVisibleCatalogProducts(allProducts);
    const resolved = productIds
      .map((id) => visible.find((p) => p.id === id))
      .filter(Boolean) as Product[];
    return resolved.length > 0 ? resolved : visible.slice(0, 6);
  }, [productIds]);

  return (
    <section
      ref={ref}
      className="px-5 py-16 md:px-[72px] md:py-20"
      style={{ background: "#0e0e0e" }}
    >
      <div className="mx-auto max-w-[1760px]">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-3 text-primary"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.25em",
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
          <Link
            to={ctaHref}
            className="hidden items-center gap-1.5 text-white/55 hover:text-white transition-colors md:inline-flex"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {ctaLabel}
            <ArrowRight size={14} strokeWidth={1.8} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4 xl:grid-cols-6">
          {products.map((product, i) => {
            const oldPriceNum =
              product.oldPriceNum ??
              (emphasizeDiscount ? product.priceNum * 1.18 : 0);
            const discount =
              oldPriceNum > product.priceNum
                ? Math.round(((oldPriceNum - product.priceNum) / oldPriceNum) * 100)
                : 0;
            const pixPrice = product.priceNum * 0.92;
            const installment = product.priceNum / 10;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.04 * i }}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-white/8 bg-white/[0.015] transition-all hover:border-white/20 hover:bg-white/[0.03]"
              >
                {/* Ranking badge */}
                {showRanking && (
                  <span
                    className="absolute left-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                )}

                {/* Discount badge */}
                {discount > 0 && (
                  <span
                    className={`absolute z-20 rounded-full bg-primary px-2.5 py-1 text-white ${
                      showRanking ? "left-12 top-3" : "left-3 top-3"
                    }`}
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                    }}
                  >
                    -{discount}%
                  </span>
                )}

                {/* Favorite button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addFavorite({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: getPrimaryProductImage(product),
                    });
                  }}
                  className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:border-primary/60 hover:text-primary"
                  aria-label="Favoritar"
                >
                  <Heart size={13} strokeWidth={1.6} />
                </button>

                <Link to={`/produto/${product.id}`} className="flex flex-1 flex-col">
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-white/[0.04] to-white/[0.01]">
                    <ImageWithFallback
                      src={getPrimaryProductImage(product)}
                      alt={product.name}
                      className="h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-1.5 p-4">
                    <div className="flex items-center gap-1.5">
                      <Star size={11} className="fill-primary text-primary" />
                      <span
                        className="text-white/65"
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "11px",
                        }}
                      >
                        {product.rating}
                      </span>
                      <span
                        className="text-white/30"
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "11px",
                        }}
                      >
                        ({product.reviews})
                      </span>
                    </div>

                    <p
                      className="line-clamp-2 text-white/90 transition-colors group-hover:text-primary"
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "13px",
                        fontWeight: 500,
                        lineHeight: 1.35,
                        minHeight: 36,
                      }}
                    >
                      {product.name}
                    </p>

                    <div className="mt-auto pt-2">
                      {oldPriceNum > product.priceNum && (
                        <p
                          className="text-white/30 line-through"
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "11px",
                          }}
                        >
                          {product.oldPrice ??
                            `R$ ${oldPriceNum.toFixed(2).replace(".", ",")}`}
                        </p>
                      )}
                      <p
                        className="text-white"
                        style={{
                          fontFamily: "var(--font-family-figtree)",
                          fontSize: "20px",
                          fontWeight: 700,
                          lineHeight: 1.1,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {product.price}
                      </p>
                      <p
                        className="text-white/50"
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "11px",
                          lineHeight: 1.4,
                        }}
                      >
                        ou 10x de R$ {installment.toFixed(2).replace(".", ",")}
                      </p>
                      <p
                        className="text-primary"
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        R$ {pixPrice.toFixed(2).replace(".", ",")} no Pix
                      </p>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => addItem(product)}
                  className="flex items-center justify-center gap-2 border-t border-white/8 bg-white/[0.02] py-2.5 text-white/75 transition-colors hover:bg-primary hover:text-white"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  <ShoppingBag size={13} strokeWidth={1.6} />
                  Adicionar
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Link
            to={ctaHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-white/80 transition-all hover:border-white/40 hover:text-white"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {ctaLabel}
            <ArrowRight size={14} strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </section>
  );
}
