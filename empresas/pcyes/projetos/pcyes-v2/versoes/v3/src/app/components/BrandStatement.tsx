import { useRef } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export function BrandStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "#0d0d0e" }}
    >
      {/* Subtle red radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(255,43,46,0.07),transparent)]" />

      <div className="relative max-w-[1760px] mx-auto px-5 md:px-8 py-16 md:py-24">
        {/* Top rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="origin-left h-px bg-white/8 mb-12 md:mb-16"
        />

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          {/* Left — big statement */}
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-primary tracking-[0.3em] mb-6"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "11px",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              PCYES — DESDE 1999
            </motion.p>

            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 120 }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-white"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "clamp(42px, 8vw, 108px)",
                  fontWeight: "300",
                  lineHeight: "0.95",
                  letterSpacing: "-0.02em",
                }}
              >
                Tecnologia
              </motion.h2>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 120 }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="text-white/30"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "clamp(42px, 8vw, 108px)",
                  fontWeight: "300",
                  lineHeight: "0.95",
                  letterSpacing: "-0.02em",
                }}
              >
                que você sente.
              </motion.h2>
            </div>
          </div>

          {/* Right — descriptor + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="md:max-w-[280px] flex flex-col gap-8"
          >
            <p
              className="text-white/30"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "14px",
                lineHeight: "1.75",
              }}
            >
              Periféricos e componentes desenvolvidos para quem não aceita menos que o máximo desempenho.
            </p>
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white border-b border-white/15 hover:border-white/40 pb-1 transition-all duration-400 self-start"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "13px",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Explorar catálogo
              <ArrowUpRight size={13} />
            </Link>
          </motion.div>
        </div>

        {/* Bottom rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="origin-left h-px bg-white/8 mt-12 md:mt-16"
        />
      </div>
    </section>
  );
}
