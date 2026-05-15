import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";
import { useAuth } from "./AuthContext";
import { Link } from "react-router";
import { allProducts, type Product } from "./productsData";
import { findProductBySwatch, getPrimaryProductImage, getProductHoverMedia, getProductSwatches, getVisibleCatalogProducts } from "./productPresentation";

interface ProductCarouselProps {
  label?: string;
  title?: string;
  subtitle?: string;
  productIds?: number[];
  compactTop?: boolean;
}

const curatedIds = [436, 72, 329, 433, 446, 199];
const latestIds = [375, 295, 128, 30, 199, 433];

export function ProductCarousel({
  label = "MAIS VENDIDOS",
  title = "Escolhidos para você",
  subtitle,
  productIds = curatedIds,
  compactTop = false,
}: ProductCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, Product>>({});
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { addItem } = useCart();
  const { addFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  const products = useMemo(() => {
    const visibleProducts = getVisibleCatalogProducts(allProducts);
    const resolved = productIds
      .map((id) => visibleProducts.find((product) => product.id === id))
      .filter(Boolean) as Product[];

    const latest = latestIds.map((id) => visibleProducts.find((product) => product.id === id)).filter(Boolean) as Product[];
    return resolved.length > 0 ? resolved : latest.length > 0 ? latest : visibleProducts.slice(0, 6);
  }, [productIds]);

  const repeatedProducts = useMemo(
    () => [...products, ...products, ...products].map((product, index) => ({
      product,
      key: `${product.id}-${index}`,
    })),
    [products],
  );

  const showNoveltyTag = useMemo(() => {
    const tone = `${label} ${title}`.toLowerCase();
    return tone.includes("novidad") || tone.includes("recém");
  }, [label, title]);

  const getDiscountBadge = (product: Product) => {
    if (product.badge) return product.badge.toUpperCase();
    if (!product.oldPriceNum || !product.priceNum || product.oldPriceNum <= product.priceNum) return null;

    const percentage = Math.round(((product.oldPriceNum - product.priceNum) / product.oldPriceNum) * 100);
    return `-${percentage}%`;
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || products.length === 0) return;

    const firstCard = container.querySelector<HTMLElement>("[data-carousel-card='true']");
    if (!firstCard) return;

    const computed = window.getComputedStyle(container);
    const gap = Number.parseFloat(computed.columnGap || computed.gap || "24") || 24;
    const cardWidth = firstCard.offsetWidth + gap;
    const setWidth = cardWidth * products.length;

    container.scrollLeft = setWidth;
  }, [products.length]);

  const normalizeInfiniteScroll = () => {
    const container = scrollRef.current;
    if (!container || products.length === 0) return;

    const firstCard = container.querySelector<HTMLElement>("[data-carousel-card='true']");
    if (!firstCard) return;

    const computed = window.getComputedStyle(container);
    const gap = Number.parseFloat(computed.columnGap || computed.gap || "24") || 24;
    const cardWidth = firstCard.offsetWidth + gap;
    const setWidth = cardWidth * products.length;
    const leftBoundary = cardWidth * 0.5;
    const rightBoundary = setWidth * 2 - container.clientWidth * 0.5;

    if (container.scrollLeft <= leftBoundary) {
      container.scrollLeft += setWidth;
    } else if (container.scrollLeft >= rightBoundary) {
      container.scrollLeft -= setWidth;
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let timeoutId: number | null = null;

    const handleScroll = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        normalizeInfiniteScroll();
      }, 120);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [products.length]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>("[data-carousel-card='true']");
    const computed = window.getComputedStyle(container);
    const gap = Number.parseFloat(computed.columnGap || computed.gap || "24") || 24;
    const step = firstCard ? firstCard.offsetWidth + gap : container.clientWidth * 0.82;

    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });

    window.setTimeout(normalizeInfiniteScroll, 420);
  };

  return (
    <section
      ref={ref}
      className={compactTop ? "pt-4 pb-16 md:pt-8 md:pb-20" : "py-20"}
      style={{ background: isDark ? "#0e0e0e" : "transparent" }}
    >
      <div className="max-w-[1696px] mx-auto px-5 md:px-0 mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-primary tracking-[0.25em] mb-5"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-label)", fontWeight: "var(--font-weight-medium)" }}
            >
              {label}
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 80 }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-foreground"
                style={{ fontSize: "clamp(36px, 5vw, 48px)", lineHeight: "48px", fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-light)" }}
              >
                {title}
              </motion.h2>
            </div>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-4 max-w-[620px] text-foreground/35"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", lineHeight: 1.6 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <p className="text-foreground/30 md:hidden" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
              Arraste para navegar →
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative"
      >
        <button
          onClick={() => scroll("left")}
          aria-label="Anterior"
          className="absolute left-0 top-[264px] z-30 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/85 backdrop-blur-md transition-all hover:border-[var(--primary)]/60 hover:bg-[var(--primary)]/15 hover:text-white hover:scale-105 active:scale-95 cursor-pointer md:flex"
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label="Próximo"
          className="absolute right-0 top-[264px] z-30 hidden h-12 w-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/85 backdrop-blur-md transition-all hover:border-[var(--primary)]/60 hover:bg-[var(--primary)]/15 hover:text-white hover:scale-105 active:scale-95 cursor-pointer md:flex"
        >
          <ChevronRight size={20} strokeWidth={2.2} />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-5 md:px-0 pb-4 scrollbar-hide snap-x md:snap-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollSnapType: "x mandatory" }}
        >
          {repeatedProducts.map(({ product, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.08 * i }}
              className="group relative block w-[300px] flex-shrink-0 cursor-pointer snap-center md:w-[440px]"
              data-carousel-card="true"
            >
              {(() => {
                const displayProduct = selectedVariants[key] ?? product;
                const discountBadge = getDiscountBadge(displayProduct);
                const hoverMedia = getProductHoverMedia(displayProduct);

                return (
              <Link to={`/produto/${displayProduct.id}`} className="block">
                <div
                  className="relative mb-4 aspect-[5/6] overflow-hidden"
                  style={{
                    borderRadius: "var(--radius-card)",
                    background: isDark
                      ? "linear-gradient(180deg, rgba(33,33,36,0.1) 0%, rgba(82,82,83,0.1) 100%)"
                      : "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(242,242,242,1) 100%)",
                  }}
                  onMouseEnter={() => setHoveredProductId(displayProduct.id)}
                  onMouseLeave={() => setHoveredProductId((current) => (current === displayProduct.id ? null : current))}
                >
                  <ImageWithFallback
                    src={getPrimaryProductImage(displayProduct)}
                    alt={displayProduct.name}
                    className={`absolute inset-0 w-full h-full object-contain p-7 transition-all duration-[900ms] ease-out ${
                      hoverMedia ? "group-hover:scale-[1.02] group-hover:opacity-0" : "group-hover:scale-105"
                    }`}
                  />

                  {hoverMedia?.type === "image" && (
                    <ImageWithFallback
                        src={hoverMedia.src}
                      alt={`${displayProduct.name} em destaque`}
                      className="absolute inset-0 h-full w-full object-contain p-7 opacity-0 scale-[1.04] transition-all duration-[900ms] ease-out group-hover:scale-100 group-hover:opacity-100"
                    />
                  )}

                  {hoverMedia?.type === "video" && hoveredProductId === displayProduct.id && (
                    <iframe
                      src={`${hoverMedia.src}${hoverMedia.src.includes("?") ? "&" : "?"}autoplay=1&mute=1&loop=1&controls=0&playsinline=1`}
                      title={`${displayProduct.name} video`}
                      className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ border: "none" }}
                      allow="autoplay; encrypted-media"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/18 transition-colors duration-500" />

                  {(discountBadge || showNoveltyTag) && (
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {discountBadge && (
                        <span
                          className="inline-flex items-center text-white"
                          style={{
                            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                            padding: "6px 12px",
                            borderRadius: "10px",
                            fontFamily: "var(--font-family-figtree)",
                            fontSize: "15px",
                            fontWeight: 900,
                            letterSpacing: "-0.02em",
                            boxShadow: "0 12px 28px -8px rgba(34,197,94,0.55)",
                          }}
                        >
                          {discountBadge}
                        </span>
                      )}
                      {showNoveltyTag && (
                        <span
                          className="border border-white/12 bg-black/40 text-white/90 px-3 py-1 backdrop-blur-sm"
                          style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.1em" }}
                        >
                          NOVIDADE
                        </span>
                      )}
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    <button
                      className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-black flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors duration-300"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-medium)" }}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(displayProduct); }}
                    >
                      <ShoppingBag size={13} strokeWidth={1.5} />
                      Adicionar
                    </button>
                  </div>

                  {isLoggedIn && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        className="w-9 h-9 bg-black/35 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white/85 hover:text-white hover:bg-black/50 transition-all duration-300"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addFavorite({ id: displayProduct.id, name: displayProduct.name, price: displayProduct.price, image: getPrimaryProductImage(displayProduct) }); }}
                        aria-label="Favoritar"
                      >
                        <Heart size={14} className="text-current" strokeWidth={1.6} />
                      </button>
                    </div>
                  )}
                </div>
              </Link>
                );
              })()}

              <div className="px-1">
                {(() => {
                  const displayProduct = selectedVariants[key] ?? product;
                  const swatches = getProductSwatches(displayProduct);
                  return swatches.length > 1 ? (
                    <div className="mb-2.5 flex items-center gap-1.5">
                      {swatches.map((swatch) => (
                        <button
                          key={`${product.id}-${swatch.label}`}
                          className={`h-3.5 w-3.5 rounded-full border border-foreground/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] transition-transform hover:scale-125 ${
                            swatch.productId === displayProduct.id ? "ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : ""
                          }`}
                          style={{ backgroundColor: swatch.color }}
                          title={swatch.label}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const variant = findProductBySwatch(swatch);
                            if (variant) setSelectedVariants((prev) => ({ ...prev, [key]: variant }));
                          }}
                        />
                      ))}
                    </div>
                  ) : null;
                })()}
                <Link to={`/produto/${(selectedVariants[key] ?? product).id}`}>
                  <p className="text-foreground group-hover:text-primary transition-colors duration-300 mb-2 truncate" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px", fontWeight: "var(--font-weight-medium)" }}>
                    {(selectedVariants[key] ?? product).name}
                  </p>
                </Link>
                {(() => {
                  const dp = selectedVariants[key] ?? product;
                  const discount = dp.oldPriceNum && dp.priceNum && dp.oldPriceNum > dp.priceNum
                    ? Math.round(((dp.oldPriceNum - dp.priceNum) / dp.oldPriceNum) * 100)
                    : 0;
                  const installment = `R$ ${(dp.priceNum / 10).toFixed(2).replace(".", ",")}`;
                  return (
                    <>
                      {dp.oldPrice && (
                        <p className="line-through leading-none mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "rgba(255,255,255,0.38)" }}>
                          {dp.oldPrice}
                        </p>
                      )}
                      <p className="text-foreground leading-none" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: 700, letterSpacing: "-0.015em" }}>
                        {dp.price}
                      </p>
                      <p className="mt-1.5 leading-tight" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>
                        No PIX ou 10x de {installment}
                      </p>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export const recentArrivalIds = latestIds;
