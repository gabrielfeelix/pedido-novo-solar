import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Truck, Shield, CreditCard, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Frete grátis", desc: "Compras acima de R$ 299" },
  { icon: Shield, title: "Garantia estendida", desc: "Até 3 anos de cobertura" },
  { icon: CreditCard, title: "12x sem juros", desc: "Em todos os cartões" },
  { icon: Headphones, title: "Suporte 24/7", desc: "Atendimento especializado" },
];

export function FeaturesStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="border-y border-black/8 px-5 py-[39px] md:px-[72.5px]" style={{ background: "#0e0e0e" }}>
      <div className="mx-auto flex min-h-[166px] max-w-[1760px] flex-wrap items-center justify-center gap-[64px] px-0 md:px-12">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group w-[212px] text-center"
          >
            <div className="w-14 h-14 mx-auto mb-5 border border-white/10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:border-primary/50">
              <f.icon size={20} strokeWidth={1} className="text-white/40 group-hover:text-primary transition-colors duration-500" />
            </div>
            <p className="text-white mb-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px", lineHeight: "24px", fontWeight: "var(--font-weight-medium)" }}>
              {f.title}
            </p>
            <p className="text-white/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: "18px" }}>
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
