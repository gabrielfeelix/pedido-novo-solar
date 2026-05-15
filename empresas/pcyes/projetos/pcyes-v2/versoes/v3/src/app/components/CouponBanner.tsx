"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, Ticket } from "lucide-react";

export function CouponBanner() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText("SETUP10");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="px-5 md:px-[72px]" style={{ background: "#0e0e0e", paddingTop: "16px", paddingBottom: "16px" }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1600px" }}>
        <motion.button
          onClick={copy}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-[16px] px-5 py-4 md:px-7 md:py-5 cursor-pointer"
          style={{
            background:
              "linear-gradient(110deg, rgba(225,6,0,0.18) 0%, rgba(255,90,80,0.08) 50%, rgba(225,6,0,0.18) 100%)",
            border: "1px solid rgba(255,90,80,0.35)",
            boxShadow: "0 14px 40px -16px rgba(225,6,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <motion.span
            className="pointer-events-none absolute inset-y-0 w-[140px]"
            style={{
              background: "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
            }}
            initial={{ x: "-50%" }}
            animate={{ x: "180%" }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 1.2 }}
          />

          <div className="relative flex items-center gap-3 md:gap-4">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white"
              style={{
                background: "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
                boxShadow: "0 8px 24px -6px rgba(225,6,0,0.6)",
              }}
            >
              <Ticket size={18} strokeWidth={2.2} />
            </div>
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-3 text-left">
              <span
                className="text-white"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "clamp(14px, 2.4vw, 18px)",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                }}
              >
                CUPOM SETUP10
              </span>
              <span
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.3,
                }}
              >
                10% extra no PIX em toda a loja
              </span>
            </div>
          </div>

          <div
            className="relative inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white/95 px-4 py-2 text-[#1a0000] transition-transform group-hover:scale-[1.04]"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              boxShadow: "0 8px 22px -8px rgba(0,0,0,0.5)",
            }}
          >
            {copied ? <Check size={14} strokeWidth={2.4} /> : <Copy size={13} strokeWidth={2.2} />}
            {copied ? "COPIADO" : "COPIAR"}
          </div>
        </motion.button>
      </div>
    </section>
  );
}
