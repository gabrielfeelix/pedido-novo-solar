import { useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { useCart } from "./CartContext";
import { allProducts as catalogProducts, type Product } from "./productsData";
import { findProductBySwatch, getPrimaryProductImage, getProductHoverMedia, getProductSwatches, getVisibleCatalogProducts } from "./productPresentation";

const tags = ["Todos", "Gaming", "Streaming", "Escritório", "RGB", "Wireless"];

export function ProductsByTags() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const [activeTag, setActiveTag] = useState("Todos");
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<number, Product>>({});
  const { addItem } = useCart();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  const catalogTagProducts = getVisibleCatalogProducts(catalogProducts).slice(0, 16);
  const filtered = (activeTag === "Todos" ? catalogTagProducts : catalogTagProducts.filter((p) => p.tags.includes(activeTag))).slice(0, 8);

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section ref={ref} className="px-5 py-20 md:px-[72.5px] md:py-24" style={{ background: isDark ? "#0e0e0e" : "transparent" }}>
      <div className="max-w-[1760px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10 pt-[18.96px]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-primary tracking-[0.25em] mb-7"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", lineHeight: "19.5px", fontWeight: "var(--font-weight-medium)" }}
          >
            CATÁLOGO
          </motion.p>
          <div className="overflow-hidden mb-6">
            <motion.h2
              initial={{ y: 80 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-foreground"
              style={{ fontSize: "clamp(44px, 6vw, 74px)", lineHeight: "clamp(48px, 6vw, 74px)", letterSpacing: "-0.03em", fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-light)" }}
            >
              Produtos por tag
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-foreground/30 max-w-md mx-auto"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", lineHeight: "28.8px" }}
          >
            Filtre por interesse e encontre exatamente o que procura.
          </motion.p>
        </div>

        {/* Tag pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2.5 mb-10 pt-[39.96px]"
        >
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`relative px-[25px] py-[11px] transition-all duration-400 border ${activeTag === tag
                  ? "bg-primary border-primary text-primary-foreground shadow-[0_0_25px_rgba(255,43,46,0.2)]"
                  : "border-border/15 text-foreground/40 hover:text-foreground hover:border-foreground/30"
                }`}
              style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group"
              >
                {(() => {
                  const catalogProduct = catalogProducts.find((item) => item.id === product.id);
                  const displayProduct = selectedVariants[product.id] ?? catalogProduct ?? product;
                  const hoverMedia = getProductHoverMedia(displayProduct);
                  const swatches = catalogProduct ? getProductSwatches(displayProduct) : [];
                  const primaryImage = getPrimaryProductImage(displayProduct);

                  return (
                    <>
                <div
                  className="relative overflow-hidden mb-5 h-[340px] sm:h-[390px] lg:h-[425px]"
                  style={{
                    borderRadius: "var(--radius-card)",
                    background: isDark
                      ? "#1e1e20"
                      : "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(242,242,242,1) 100%)",
                  }}
                  onMouseEnter={() => setHoveredProductId(displayProduct.id)}
                  onMouseLeave={() => setHoveredProductId((current) => (current === displayProduct.id ? null : current))}
                >
                  <Link to={`/produto/${displayProduct.id}`} className="block h-full">
                    <ImageWithFallback
                      src={primaryImage}
                      alt={displayProduct.name}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-[900ms] ease-out ${
                        hoverMedia ? "group-hover:scale-[1.02] group-hover:opacity-0" : "group-hover:scale-105"
                      }`}
                    />

                    {hoverMedia?.type === "image" && (
                      <ImageWithFallback
                        src={hoverMedia.src}
                        alt={`${displayProduct.name} em destaque`}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 scale-[1.04] transition-all duration-[900ms] ease-out group-hover:scale-100 group-hover:opacity-100"
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
                  </Link>

                  {/* Hover overlay actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

                  {/* Like button */}
                  <button
                    onClick={(e) => toggleLike(product.id, e)}
                    className="absolute top-4 right-4 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400"
                  >
                    <Heart
                      size={14}
                      className={likedIds.has(product.id) ? "fill-primary text-primary" : "text-white/80"}
                      strokeWidth={1.5}
                    />
                  </button>

                  {/* Quick add */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    <button
                      onClick={(e) => { e.preventDefault(); addItem(displayProduct); }}
                      className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-black flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors duration-300"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-medium)" }}
                    >
                      <ShoppingBag size={13} strokeWidth={1.5} />
                      Adicionar
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    {product.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-black/30 backdrop-blur-sm text-white/80"
                        style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "9px", letterSpacing: "0.05em" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-1">
                  {swatches.length > 1 && (
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
                            if (variant) setSelectedVariants((prev) => ({ ...prev, [product.id]: variant }));
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star size={11} className="fill-primary text-primary" />
                    <span className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                      {displayProduct.rating}
                    </span>
                    <span className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                      ({displayProduct.reviews})
                    </span>
                  </div>
                  <p className="text-foreground group-hover:text-primary transition-colors duration-300 mb-1.5 truncate" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px", fontWeight: "var(--font-weight-medium)" }}>
                    {displayProduct.name}
                  </p>
                  <p className="text-foreground/90" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", lineHeight: "21px", fontWeight: "500" }}>
                    {displayProduct.price}
                  </p>
                  {displayProduct.reviews > 150 && (
                    <p className="text-foreground/25 mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>
                      {displayProduct.reviews}+ vendidos
                    </p>
                  )}
                </div>
                    </>
                  );
                })()}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load more */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link
            to="/produtos"
            className="inline-block px-10 py-4 border border-border/15 text-foreground/50 hover:text-foreground hover:border-foreground/40 transition-all duration-500"
            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
          >
            Ver todos os produtos
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
