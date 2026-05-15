import { useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Clock, Flame, ShoppingBag, ArrowUpRight, Heart } from "lucide-react";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";

const releases = [
  {
    id: 9, name: "Cadeira Titan Elite", category: "Cadeiras Gaming", price: "R$ 1.899,90", oldPrice: "R$ 2.199,90",
    image: "/home/release-chair-context.png",
    tag: "Pré-venda", daysAgo: 2,
  },
  {
    id: 7, name: "Deskpad RGB Pro", category: "Acessórios", price: "R$ 149,90",
    image: "/home/release-deskpad-context.png",
    tag: "Novo", daysAgo: 5,
  },
  {
    id: 5, name: "Controle Vortex Wireless", category: "Controles", price: "R$ 329,90",
    image: "/home/release-controller-context.png",
    tag: "Novo", daysAgo: 7,
  },
  {
    id: 6, name: "Mic Studio X", category: "Streaming", price: "R$ 489,90",
    image: "/home/release-mic-context.png",
    tag: "Hot", daysAgo: 3,
  },
  {
    id: 1, name: "Cobra V2 Mouse", category: "Periféricos", price: "R$ 189,90",
    image: "/home/release-mouse-context.png",
    tag: "Best Seller", daysAgo: 1,
  },
  {
    id: 8, name: "Electra 750W Fonte", category: "Fontes", price: "R$ 449,90",
    image: "/home/release-psu-context.png",
    tag: "Novo", daysAgo: 4,
  },
  {
    id: 2, name: "Mancer Pro Teclado", category: "Periféricos", price: "R$ 349,90",
    image: "/home/release-keyboard-context.png",
    tag: "Novo", daysAgo: 6,
  },
];

export function NewReleasesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [selectedIdx, setSelectedIdx] = useState(0);
  const { addItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  const selected = releases[selectedIdx];
  const others = releases.filter((_, i) => i !== selectedIdx);

  return (
    <section ref={ref} className="px-5 py-20 md:px-[72.5px] md:py-24" style={{ background: isDark ? "#0e0e0e" : "transparent" }}>
      <div className="max-w-[1760px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-5">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <Flame size={14} className="text-primary" />
              <span
                className="text-primary tracking-[0.25em]"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-label)", fontWeight: "var(--font-weight-medium)" }}
              >
                LANÇAMENTOS & NOVIDADES
              </span>
            </motion.div>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 80 }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-foreground"
                style={{ fontSize: "clamp(40px, 5vw, 64px)", lineHeight: "clamp(46px, 5.5vw, 74px)", letterSpacing: "-0.03em", fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-light)" }}
              >
                Em alta agora
              </motion.h2>
            </div>
          </div>
          <motion.a
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            href="/produtos"
            className="text-foreground/40 hover:text-foreground border-b border-foreground/20 hover:border-foreground/60 pb-1 transition-all duration-300 self-start md:self-auto"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
          >
            Ver todos lançamentos
          </motion.a>
        </div>

        {/* Layout: featured left + single column list right */}
        <div className="grid grid-cols-1 gap-[45px] lg:grid-cols-[minmax(0,997px)_minmax(0,1fr)] lg:px-8">
          {/* Featured card left */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden group"
            style={{ borderRadius: "var(--radius-card)" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative h-full min-h-[532px]"
              >
                <ImageWithFallback
                  src={selected.image}
                  alt={selected.name}
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <button
                  className="absolute top-6 right-6 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 transition-all duration-300 cursor-pointer z-10"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); isFavorite(selected.id) ? removeFavorite(selected.id) : addFavorite({ id: selected.id, name: selected.name, price: selected.price, image: selected.image }); }}
                >
                  <Heart size={16} strokeWidth={1.5} className={isFavorite(selected.id) ? "fill-primary text-primary" : ""} />
                </button>

                {/* Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <span
                    className="px-3 py-1 bg-primary text-primary-foreground"
                    style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.1em" }}
                  >
                    {selected.tag.toUpperCase()}
                  </span>
                  <span
                    className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm text-white/70"
                    style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "10px" }}
                  >
                    <Clock size={10} /> {selected.daysAgo} dias atrás
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <p className="text-white/40 tracking-wide mb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                    {selected.category.toUpperCase()}
                  </p>
                  <h3 className="text-white mb-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "var(--font-weight-medium)" }}>
                    {selected.name}
                  </h3>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-white" style={{ fontFamily: "var(--font-family-inter)", fontSize: "18px", fontWeight: "var(--font-weight-medium)" }}>
                      {selected.price}
                    </span>
                    {selected.oldPrice && (
                      <span className="text-white/30 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>
                        {selected.oldPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => addItem({ id: selected.id, name: selected.name, price: selected.price, image: selected.image })}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-primary hover:text-white transition-colors duration-500 cursor-pointer"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
                    >
                      <ShoppingBag size={14} strokeWidth={1.5} />
                      Comprar
                    </button>
                    <Link
                      to={`/produto/${selected.id}`}
                      className="flex items-center gap-2 px-5 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-all duration-300"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
                    >
                      Ver produto
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right column: stacked list */}
          <div className="flex flex-col gap-2 lg:h-[552px] lg:pt-5">
            {others.slice(0, 6).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
                onClick={() => setSelectedIdx(releases.findIndex((r) => r.id === item.id))}
                className="group relative overflow-hidden text-left cursor-pointer transition-all duration-500 border border-border/5 hover:border-border/15 flex"
                style={{ borderRadius: "var(--radius-card)", background: "rgba(255,255,255,0.02)" }}
              >
                {/* Thumbnail */}
                <Link to={`/produto/${item.id}`} className="w-[120px] h-[80px] flex-shrink-0 overflow-hidden relative" style={{ borderRadius: "var(--radius-card) 0 0 var(--radius-card)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                </Link>

                {/* Info */}
                <div className="flex-1 flex items-center justify-between px-5 py-3 min-w-0 bg-foreground/[0.02] group-hover:bg-foreground/[0.04] transition-colors duration-300">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 ${item.tag === "Hot" || item.tag === "Best Seller" ? "bg-primary/15 text-primary" : "bg-foreground/5 text-foreground/30"}`}
                        style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "8px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.08em" }}
                      >
                        {item.tag.toUpperCase()}
                      </span>
                      <span className="text-foreground/15" style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px" }}>
                        {item.category.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-foreground/70 group-hover:text-foreground transition-colors duration-300 truncate" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "15px", fontWeight: "var(--font-weight-medium)" }}>
                      {item.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <span className="text-foreground/85" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>
                      {item.price}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); addItem({ id: item.id, name: item.name, price: item.price, image: item.image }); }}
                      className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-primary text-foreground/30 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <ShoppingBag size={12} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); addFavorite({ id: item.id, name: item.name, price: item.price, image: item.image }); }}
                      className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-primary text-foreground/30 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <Heart size={12} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
