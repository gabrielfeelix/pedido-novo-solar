import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { Flame, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts } from "./productsData";
import { getPrimaryProductImage, getVisibleCatalogProducts } from "./productPresentation";
import { useCart } from "./CartContext";

const DEAL_IDS = [436, 72, 199];

function getDealEnd() {
  const end = new Date();
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
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { hours, minutes, seconds };
}

export function FlashDealsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const { addItem } = useCart();
  const endRef = useRef(getDealEnd());
  const { hours, minutes, seconds } = useCountdown(endRef.current);

  const products = useMemo(() => {
    const visible = getVisibleCatalogProducts(allProducts);
    const picked = DEAL_IDS
      .map((id) => visible.find((p) => p.id === id))
      .filter(Boolean) as typeof allProducts;
    return picked.length === 3 ? picked : visible.slice(0, 3);
  }, []);

  return (
    <section ref={ref} className="px-5 py-16 md:px-[72px] md:py-20" style={{ background: "#0e0e0e" }}>
      <div className="mx-auto max-w-[1760px]">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[420px_1fr]">
          {/* Left — Flash banner */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(220,20,20,0.95) 0%, rgba(140,10,10,1) 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.4) 0%, transparent 40%)",
            }} />
            <div className="relative flex h-full flex-col justify-between p-7 lg:p-8 min-h-[280px]">
              <div>
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm">
                  <Flame size={13} strokeWidth={2} className="text-white" />
                  <span
                    className="text-white"
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.18em",
                    }}
                  >
                    OFERTA RELÂMPAGO
                  </span>
                </div>
                <h3
                  className="mb-2 text-white"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "clamp(28px, 3.5vw, 38px)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Até 40% OFF<br />em periféricos
                </h3>
                <p
                  className="max-w-[260px] text-white/85"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "13px",
                    lineHeight: 1.5,
                  }}
                >
                  Descontos que duram só hoje. Aproveite antes do tempo acabar.
                </p>
              </div>

              <div className="mt-6">
                <div className="mb-4 flex items-center gap-2">
                  {[
                    { label: "HRS", value: pad(hours) },
                    { label: "MIN", value: pad(minutes) },
                    { label: "SEG", value: pad(seconds) },
                  ].map((unit, i) => (
                    <div key={unit.label} className="flex items-center gap-2">
                      <div className="flex flex-col items-center rounded-md bg-black/40 px-2.5 py-1.5 backdrop-blur-sm" style={{ minWidth: 46 }}>
                        <span
                          className="text-white tabular-nums"
                          style={{
                            fontFamily: "var(--font-family-figtree)",
                            fontSize: "20px",
                            fontWeight: 600,
                            lineHeight: 1,
                          }}
                        >
                          {unit.value}
                        </span>
                        <span
                          className="mt-0.5 text-white/55"
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "9px",
                            fontWeight: 500,
                            letterSpacing: "0.15em",
                          }}
                        >
                          {unit.label}
                        </span>
                      </div>
                      {i < 2 && <span className="text-white/40">:</span>}
                    </div>
                  ))}
                </div>
                <Link
                  to="/produtos"
                  className="inline-flex items-center gap-2 rounded bg-white px-5 py-2.5 text-black transition-all hover:bg-black hover:text-white"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "13px",
                    fontWeight: 600,
                    borderRadius: "var(--radius-button)",
                  }}
                >
                  Ver todas as ofertas
                  <ArrowRight size={14} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right — 3 deal products in a row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {products.map((product, i) => {
              const oldPriceNum = product.oldPriceNum ?? product.priceNum * 1.25;
              const discount = Math.round(((oldPriceNum - product.priceNum) / oldPriceNum) * 100);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                  className="neon-hover-red group relative flex flex-col overflow-hidden rounded-lg border border-white/8 bg-white/[0.02] transition-colors hover:border-white/20"
                >
                  <Link to={`/produto/${product.id}`} className="flex flex-1 flex-col">
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-white/[0.04] to-white/[0.01]">
                      <span
                        className="absolute left-3 top-3 z-10 rounded-full bg-primary px-2.5 py-1 text-white"
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                        }}
                      >
                        -{discount}%
                      </span>
                      <ImageWithFallback
                        src={getPrimaryProductImage(product)}
                        alt={product.name}
                        className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 p-4">
                      <p
                        className="line-clamp-2 text-white/90 group-hover:text-primary transition-colors"
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
                        <p
                          className="text-white/35 line-through"
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "11px",
                          }}
                        >
                          {product.oldPrice ?? `R$ ${oldPriceNum.toFixed(2).replace(".", ",")}`}
                        </p>
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
                          className="text-white/55"
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "11px",
                          }}
                        >
                          10x de R$ {(product.priceNum / 10).toFixed(2).replace(".", ",")} sem juros
                        </p>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => addItem(product)}
                    className="border-t border-white/8 bg-white/[0.02] py-2.5 text-white/70 transition-colors hover:bg-primary hover:text-white"
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Adicionar ao carrinho
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
