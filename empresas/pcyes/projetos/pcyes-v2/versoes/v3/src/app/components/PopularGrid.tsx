import { useRef } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShoppingBag, Star, TrendingUp, ArrowRight, Heart } from "lucide-react";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";
import { allProducts } from "./productsData";

export function PopularGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const { addItem } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  // Show 12 products sorted by reviews (popularity proxy)
  const popular = [...allProducts].sort((a, b) => b.reviews - a.reviews).slice(0, 12);

  return (
    <section ref={ref} className="py-32 md:py-48 px-5 md:px-8">
      <div className="max-w-[1760px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <TrendingUp size={14} className="text-primary" />
              <span
                className="text-primary tracking-[0.25em]"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-label)", fontWeight: "var(--font-weight-medium)" }}
              >
                POPULARES DA SEMANA
              </span>
            </motion.div>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 80 }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-foreground"
                style={{ fontSize: "clamp(36px, 5vw, var(--text-h2))", fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-light)" }}
              >
                Os mais procurados
              </motion.h2>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/produtos"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300"
              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
            >
              Ver catálogo completo
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Grid — 4 cols on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
          {popular.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.5) }}
              className="group"
            >
              <Link to={`/produto/${product.id}`} className="block">
                <div
                  className="relative overflow-hidden aspect-square mb-4"
                  style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1a1a1c" : "#f5f5f5" }}
                >
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />

                  {/* Ranking badge */}
                  {i < 3 && (
                    <span
                      className="absolute top-4 left-4 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}
                    >
                      {i + 1}
                    </span>
                  )}

                  {product.badge && (
                    <span
                      className={`absolute left-4 px-2.5 py-1 rounded-full ${i < 3 ? 'top-12' : 'top-4'} ${product.badge.toUpperCase().includes('BLUE') ? 'bg-blue-500 text-white' : product.badge.toUpperCase().includes('RED') ? 'bg-red-500 text-white' : product.badge.toUpperCase().includes('BROWN') ? 'bg-amber-700 text-white' : 'bg-primary text-primary-foreground'}`}
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.05em" }}
                    >
                      {product.badge}
                    </span>
                  )}

                  {/* Category */}
                  <span
                    className="absolute top-4 right-4 px-2.5 py-1 bg-black/25 backdrop-blur-sm text-white/70"
                    style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "9px", letterSpacing: "0.05em" }}
                  >
                    {product.category}
                  </span>

                  {/* Favorite button */}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product.id); }}
                    className="absolute top-4 left-4 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 z-10 cursor-pointer"
                  >
                    <Heart
                      size={14}
                      className={favorites.has(product.id) ? "fill-primary text-primary" : "text-white/80"}
                      strokeWidth={1.5}
                    />
                  </button>

                  {/* Quick add */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }}
                      className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-black flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-medium)" }}
                    >
                      <ShoppingBag size={13} strokeWidth={1.5} /> Adicionar <span className="hidden sm:inline">ao carrinho</span>
                    </button>
                  </div>
                </div>
              </Link>

              <div className="px-0.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Star size={11} className="fill-primary text-primary" />
                  <span className="text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                    {product.rating}
                  </span>
                  <span className="text-foreground/15" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                    ({product.reviews})
                  </span>
                </div>
                <Link to={`/produto/${product.id}`}>
                  <p
                    className="text-foreground group-hover:text-primary transition-colors duration-300 mb-1 truncate"
                    style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px", fontWeight: "var(--font-weight-medium)" }}
                  >
                    {product.name}
                  </p>
                </Link>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px" }}>
                      {product.price}
                    </p>
                    {product.oldPrice && (
                      <p className="text-foreground/25 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                        {product.oldPrice}
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/produto/${product.id}`}
                    className="text-foreground/20 hover:text-primary transition-colors duration-300"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
                  >
                    Ver detalhes →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-foreground/20 mb-5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
            Mais de 200 produtos disponíveis no catálogo PCYES
          </p>
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 px-10 py-4 border border-foreground/15 text-foreground/50 hover:text-foreground hover:border-foreground/40 transition-all duration-500"
            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
          >
            Explorar catálogo completo
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}