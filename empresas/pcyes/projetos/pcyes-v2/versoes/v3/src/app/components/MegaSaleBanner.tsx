"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Zap, ArrowRight, Timer } from "lucide-react";

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
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

export function MegaSaleBanner() {
  const target = useState(() => {
    const t = new Date();
    t.setDate(t.getDate() + 3);
    t.setHours(23, 59, 59, 0);
    return t.getTime();
  })[0];
  const time = useCountdown(target);

  return (
    <section className="px-5 md:px-[72px]" style={{ background: "#0a0a0a", paddingTop: "20px", paddingBottom: "20px" }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1600px" }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden"
          style={{
            borderRadius: "26px",
            background:
              "radial-gradient(circle at 18% 20%, rgba(255,90,80,0.4) 0%, transparent 55%), radial-gradient(circle at 85% 80%, rgba(225,6,0,0.45) 0%, transparent 55%), linear-gradient(135deg, #b00500 0%, #6e0200 50%, #2a0000 100%)",
            border: "1.5px solid rgba(255,90,80,0.45)",
            boxShadow:
              "0 36px 100px -32px rgba(0,0,0,0.7), 0 0 60px -12px rgba(225,6,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
            minHeight: "320px",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          <span
            aria-hidden
            className="pointer-events-none absolute select-none"
            style={{
              right: "-30px",
              bottom: "-90px",
              fontFamily: "var(--font-family-figtree)",
              fontSize: "420px",
              fontWeight: 900,
              lineHeight: 1,
              color: "rgba(255,255,255,0.06)",
              letterSpacing: "-0.06em",
            }}
          >
            %
          </span>

          <div className="relative flex flex-col gap-6 px-7 py-10 md:flex-row md:items-center md:justify-between md:gap-10 md:px-12 md:py-14">
            <div className="flex flex-col gap-5">
              <span
                className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <Zap size={11} strokeWidth={2.4} className="text-white" />
                <span
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "10.5px",
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                    color: "#fff",
                    textTransform: "uppercase",
                  }}
                >
                  // MEGA SEMANA
                </span>
              </span>

              <h2
                className="text-white"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "clamp(38px, 6vw, 76px)",
                  fontWeight: 900,
                  lineHeight: 0.92,
                  letterSpacing: "-0.04em",
                  textShadow: "0 6px 30px rgba(0,0,0,0.4)",
                }}
              >
                ATÉ 60% OFF
                <br />
                <span style={{ color: "rgba(255,255,255,0.78)", fontWeight: 600, fontSize: "0.4em" }}>
                  Use cupom <span style={{ color: "#fff", fontWeight: 800 }}>MEGA10</span> pra 10% extra no PIX
                </span>
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/produtos?onlyDiscount=true"
                  className="group/cta inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-6 py-3.5 transition-transform hover:scale-[1.04] active:scale-[0.98]"
                  style={{
                    color: "#1a0000",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "13px",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    boxShadow: "0 14px 36px -10px rgba(0,0,0,0.55)",
                  }}
                >
                  Ver ofertas
                  <ArrowRight size={15} strokeWidth={2.6} className="transition-transform group-hover/cta:translate-x-1" />
                </Link>

                <div
                  className="inline-flex items-center gap-3 rounded-full px-4 py-2.5"
                  style={{
                    background: "rgba(0,0,0,0.45)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <Timer size={15} strokeWidth={2.4} className="text-white" />
                  <span
                    className="text-white tabular-nums"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "15px",
                      fontWeight: 800,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {pad(time.days)}d : {pad(time.hours)}h : {pad(time.minutes)}m : {pad(time.seconds)}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
