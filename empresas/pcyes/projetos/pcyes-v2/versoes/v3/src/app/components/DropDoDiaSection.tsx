"use client";

import { useMemo } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Flame, ShoppingBag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "./CartContext";
import { allProducts, type Product } from "./productsData";
import { getPrimaryProductImage, getVisibleCatalogProducts } from "./productPresentation";
import { getPixPrice, formatBRL } from "./productEnhancements";

const DROP_IDS = [446, 433, 30];

function withGuaranteedDiscount(p: Product): Product {
  if (p.oldPriceNum && p.oldPriceNum > p.priceNum) return p;
  const pct = 15 + (p.id % 10);
  const oldPriceNum = Math.round((p.priceNum / (1 - pct / 100)) * 100) / 100;
  return {
    ...p,
    oldPriceNum,
    oldPrice: `R$ ${oldPriceNum.toFixed(2).replace(".", ",")}`,
  };
}

export function DropDoDiaSection() {
  const { addItem } = useCart();
  const picks = useMemo(() => {
    const visible = getVisibleCatalogProducts(allProducts);
    return DROP_IDS
      .map((id) => visible.find((p) => p.id === id))
      .filter(Boolean)
      .map(withGuaranteedDiscount) as Product[];
  }, []);

  if (picks.length === 0) return null;

  return (
    <section className="px-5 py-14 md:px-[72px] md:py-16" style={{ background: "#0a0a0a" }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1600px" }}>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p
              className="mb-3 inline-flex items-center gap-1.5 text-primary"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.3em",
              }}
            >
              <Flame size={12} strokeWidth={2.4} />
              // DROP DO DIA
            </p>
            <h2
              className="text-white"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(28px, 3vw, 38px)",
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: "-0.02em",
              }}
            >
              3 deals selecionados só pra hoje
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {picks.map((product, i) => {
            const discount =
              product.oldPriceNum && product.oldPriceNum > product.priceNum
                ? Math.round(((product.oldPriceNum - product.priceNum) / product.oldPriceNum) * 100)
                : 0;
            const economy =
              product.oldPriceNum && product.oldPriceNum > product.priceNum
                ? Math.round((product.oldPriceNum - product.priceNum) * 100) / 100
                : 0;
            const pix = getPixPrice(product);
            const handleAdd = (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: getPrimaryProductImage(product),
              });
            };
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="flex"
              >
                <div
                  className="group relative flex w-full flex-col overflow-hidden"
                  style={{
                    borderRadius: "24px",
                    background:
                      "radial-gradient(circle at 18% 20%, rgba(255,90,80,0.18) 0%, transparent 55%), linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(255,90,80,0.25)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 60px -24px rgba(0,0,0,0.5)",
                  }}
                >
                  <Link to={`/produto/${product.id}`} className="block">
                    <div className="relative h-[260px] overflow-hidden md:h-[280px]">
                      <ImageWithFallback
                        src={getPrimaryProductImage(product)}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                      {discount > 0 && (
                        <span
                          className="absolute z-20 inline-flex items-center text-white"
                          style={{
                            top: "16px",
                            left: "16px",
                            padding: "6px 12px",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
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
                      <span
                        className="absolute z-20 inline-flex items-center gap-1 text-white"
                        style={{
                          top: "16px",
                          right: "16px",
                          padding: "5px 10px",
                          borderRadius: "999px",
                          background: "rgba(0,0,0,0.55)",
                          border: "1px solid rgba(255,90,80,0.5)",
                          backdropFilter: "blur(6px)",
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "10.5px",
                          fontWeight: 800,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        <Flame size={11} strokeWidth={2.4} className="text-primary" />
                        Prêmio do dia
                      </span>
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col px-6 pb-6 pt-2">
                    <Link to={`/produto/${product.id}`} className="block">
                      <h3
                        className="line-clamp-2 text-white"
                        style={{
                          fontFamily: "var(--font-family-figtree)",
                          fontSize: "17px",
                          fontWeight: 700,
                          lineHeight: 1.18,
                          letterSpacing: "-0.015em",
                          minHeight: "44px",
                        }}
                      >
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-4 flex-1">
                      {product.oldPrice && (
                        <p
                          className="line-through leading-none mb-1"
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "13px",
                            color: "rgba(255,255,255,0.38)",
                          }}
                        >
                          {product.oldPrice}
                        </p>
                      )}
                      <p
                        className="text-white"
                        style={{
                          fontFamily: "var(--font-family-figtree)",
                          fontSize: "30px",
                          fontWeight: 800,
                          lineHeight: 1,
                          letterSpacing: "-0.025em",
                        }}
                      >
                        {formatBRL(pix)}{" "}
                        <span
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.55)",
                            letterSpacing: "0.04em",
                          }}
                        >
                          NO PIX
                        </span>
                      </p>
                      <p
                        className="mt-1"
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "12.5px",
                          color: "rgba(255,255,255,0.55)",
                        }}
                      >
                        ou {product.price} em 10x sem juros
                      </p>
                      {economy > 0 && (
                        <p
                          className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1"
                          style={{
                            background: "rgba(34,197,94,0.12)",
                            border: "1px solid rgba(34,197,94,0.3)",
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "11.5px",
                            fontWeight: 700,
                            color: "#22c55e",
                            letterSpacing: "0.02em",
                          }}
                        >
                          ↓ Economize {formatBRL(economy)}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleAdd}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      style={{
                        background: "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
                        color: "white",
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "13px",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        boxShadow: "0 14px 32px -8px rgba(225,6,0,0.55)",
                      }}
                    >
                      <ShoppingBag size={14} strokeWidth={2.2} />
                      Comprar
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
