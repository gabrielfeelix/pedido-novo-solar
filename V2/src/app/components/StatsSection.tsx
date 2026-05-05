import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";

const stats = [
  { value: 500, suffix: "K+", label: "Clientes ativos" },
  { value: 2, suffix: "M+", label: "Produtos vendidos" },
  { value: 4.9, suffix: "", label: "Avaliação média", decimal: true },
  { value: 12, suffix: "", label: "Anos de mercado" },
];

function AnimatedNumber({ value, suffix, decimal, trigger }: { value: number; suffix: string; decimal?: boolean; trigger: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const duration = 2000;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(decimal ? parseFloat((eased * value).toFixed(1)) : Math.floor(eased * value));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, value, decimal]);

  return (
    <span>
      {decimal ? display.toFixed(1) : display}{suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section ref={ref} className="py-32 md:py-48 px-5 md:px-8">
      <div className="max-w-[1760px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="text-center md:text-left"
            >
              <p className="text-foreground mb-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: "var(--font-weight-light)", lineHeight: "1" }}>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} decimal={stat.decimal} trigger={isInView} />
              </p>
              <p className="text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-label)" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
