"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Rocket, Clock, Zap, ShieldCheck, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Footer } from "./Footer";
import { allProducts } from "./productsData";
import { getPrimaryProductImage } from "./productPresentation";
import { PRE_ORDER_ITEMS } from "./PreOrderData";
import type { PreOrderInfo } from "./PreOrderData";

const pad = (n: number) => String(n).padStart(2, "0");

function useCountdown(targetIso: string) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const delta = Math.max(0, target - now);
  return {
    days: Math.floor(delta / 86_400_000),
    hours: Math.floor((delta % 86_400_000) / 3_600_000),
    minutes: Math.floor((delta % 3_600_000) / 60_000),
    seconds: Math.floor((delta % 60_000) / 1000),
  };
}

function formatReleaseDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function PreOrderCard({ info }: { info: PreOrderInfo }) {
  const navigate = useNavigate();
  const product = allProducts.find((p) => p.id === info.productId);
  const { days, hours, minutes, seconds } = useCountdown(info.releaseDate);
  if (!product) return null;

  const reservedPct = Math.min(100, Math.round((info.reservedUnits / info.totalUnits) * 100));
  const image = getPrimaryProductImage(product);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/produto/${product.id}`)}
      style={{
        borderRadius: "22px",
        background: "linear-gradient(135deg, #1a0608 0%, #2a0a0d 45%, #1a0608 100%)",
        border: "1px solid rgba(255,36,25,0.25)",
        boxShadow: "0 24px 60px -20px rgba(255,36,25,0.35)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 80% 0%, rgba(255,36,25,0.2) 0%, transparent 55%), radial-gradient(circle at 10% 100%, rgba(255,200,90,0.1) 0%, transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 32%, #fff 0.5px, transparent 1px), radial-gradient(circle at 62% 68%, #fde68a 0.5px, transparent 1px), radial-gradient(circle at 84% 22%, #fff 0.5px, transparent 1px)",
        }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-[300px_1fr] gap-0">
        {/* image */}
        <div
          className="relative h-[260px] md:h-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <ImageWithFallback
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span
            className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{
              background: "linear-gradient(135deg, #ff2419 0%, #b91c1c 100%)",
              color: "#fff",
              fontFamily: "var(--font-family-inter)",
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              boxShadow: "0 6px 16px -4px rgba(255,36,25,0.6)",
            }}
          >
            <Rocket size={11} strokeWidth={2.6} />
            Pré-venda
          </span>
        </div>

        {/* details */}
        <div className="p-5 md:p-6 flex flex-col">
          <p
            className="text-white/45 mb-1.5"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "10.5px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            // {product.category}
          </p>
          <h3
            className="text-white mb-3 line-clamp-2"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </h3>

          <p
            className="text-white/65 mb-4"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "12.5px",
              lineHeight: 1.45,
            }}
          >
            <Zap size={12} className="inline mr-1.5 -mt-0.5 text-[#facc15]" strokeWidth={2.4} />
            {info.highlight}
          </p>

          {/* countdown row */}
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {[
              { v: days, l: "D" },
              { v: hours, l: "H" },
              { v: minutes, l: "M" },
              { v: seconds, l: "S" },
            ].map((unit) => (
              <div
                key={unit.l}
                className="flex items-baseline justify-center gap-1 py-2"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                }}
              >
                <span
                  className="text-white tabular-nums"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  {pad(unit.v)}
                </span>
                <span
                  className="text-white/40"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "9.5px",
                    fontWeight: 700,
                  }}
                >
                  {unit.l}
                </span>
              </div>
            ))}
          </div>

          {/* progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="text-white/55"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "10px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Reservas
              </span>
              <span
                className="text-white tabular-nums"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "11.5px",
                  fontWeight: 700,
                }}
              >
                {reservedPct}%
              </span>
            </div>
            <div
              className="relative h-1.5 w-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)", borderRadius: "999px" }}
            >
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${reservedPct}%`,
                  background: "linear-gradient(90deg, #ff2419 0%, #facc15 100%)",
                  borderRadius: "999px",
                  boxShadow: "0 0 14px rgba(255,36,25,0.55)",
                }}
              />
            </div>
          </div>

          {/* footer row */}
          <div className="flex items-end justify-between gap-3 mt-auto">
            <div>
              <p
                className="text-white/45 mb-0.5"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "10px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Entrega · {formatReleaseDate(info.releaseDate)}
              </p>
              <p
                className="text-white leading-none"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "22px",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                {info.preOrderPrice ?? product.price}
              </p>
            </div>
            <span
              className="inline-flex items-center gap-1 h-10 px-4 rounded-full text-white"
              style={{
                background: "linear-gradient(135deg, #ff2419 0%, #b91c1c 100%)",
                fontFamily: "var(--font-family-inter)",
                fontSize: "12.5px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                boxShadow: "0 12px 28px -8px rgba(255,36,25,0.6)",
              }}
            >
              Reservar
              <ChevronRight size={13} strokeWidth={2.6} />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function PreOrderPage() {
  return (
    <div className="pt-[80px] md:pt-[110px] min-h-screen bg-background">
      {/* hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #050505 0%, #0e0e0e 70%, var(--color-background) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 30%, #fff 0.5px, transparent 1px), radial-gradient(circle at 30% 70%, #fde68a 0.5px, transparent 1px), radial-gradient(circle at 55% 20%, #fff 0.5px, transparent 1px), radial-gradient(circle at 78% 65%, #fde68a 0.5px, transparent 1px), radial-gradient(circle at 92% 32%, #fff 0.5px, transparent 1px)",
          }}
        />
        <div className="relative max-w-[1760px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <div className="flex items-center gap-2 mb-4">
            <Link
              to="/"
              className="text-white/40 hover:text-white/70 transition-colors"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
            >
              Home
            </Link>
            <span className="text-white/20" style={{ fontSize: "10px" }}>›</span>
            <span
              className="text-white/70"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 600 }}
            >
              Pré-venda
            </span>
          </div>

          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 mb-5"
            style={{
              background: "linear-gradient(135deg, #ff2419 0%, #b91c1c 100%)",
              color: "#fff",
              fontFamily: "var(--font-family-inter)",
              fontSize: "11px",
              fontWeight: 900,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              boxShadow: "0 10px 28px -8px rgba(255,36,25,0.6)",
            }}
          >
            <Rocket size={12} strokeWidth={2.6} />
            Pré-venda PCYES
          </span>

          <h1
            className="text-white mb-4"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(34px, 5vw, 56px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Garanta o seu antes <br /> de chegar nas prateleiras.
          </h1>
          <p
            className="text-white/65 max-w-[640px]"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "15px",
              lineHeight: 1.6,
            }}
          >
            Produtos exclusivos, edições limitadas e lançamentos de tecnologia em
            primeira mão. Reserve sem custo e pague só quando despacharmos.
          </p>

          {/* feature row */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[820px]">
            {[
              { icon: ShieldCheck, label: "Cancelamento livre", sub: "antes do envio" },
              { icon: Clock, label: "Sem cobrança", sub: "até o despacho" },
              { icon: Zap, label: "Entrega prioritária", sub: "no lançamento" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 p-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px",
                }}
              >
                <span
                  className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    background: "rgba(255,36,25,0.14)",
                    color: "#ff2419",
                  }}
                >
                  <f.icon size={15} strokeWidth={2.2} />
                </span>
                <div>
                  <p
                    className="text-white leading-none"
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "12.5px",
                      fontWeight: 700,
                    }}
                  >
                    {f.label}
                  </p>
                  <p
                    className="text-white/50 mt-1"
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "11px",
                    }}
                  >
                    {f.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* grid */}
      <section className="max-w-[1760px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="flex items-end justify-between mb-6">
          <h2
            className="text-foreground"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(22px, 2.6vw, 32px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Lançamentos em pré-venda
          </h2>
          <span
            className="text-foreground/45"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "11.5px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            // {PRE_ORDER_ITEMS.length} produtos
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {PRE_ORDER_ITEMS.map((info) => (
            <PreOrderCard key={info.productId} info={info} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
