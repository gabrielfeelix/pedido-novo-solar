import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Truck, CreditCard, ShieldCheck, RefreshCcw } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Frete grátis",
    desc: "Acima de R$ 299 pra todo Brasil",
  },
  {
    icon: CreditCard,
    title: "Até 12x sem juros",
    desc: "Em todos os cartões",
  },
  {
    icon: ShieldCheck,
    title: "Compra 100% segura",
    desc: "Pagamento criptografado",
  },
  {
    icon: RefreshCcw,
    title: "Troca grátis",
    desc: "7 dias para devolver",
  },
];

export function TrustStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section
      ref={ref}
      className="border-y border-white/5 px-5 py-8 md:px-[72px] md:py-10"
      style={{ background: "#0a0a0a" }}
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.06 * i }}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/10">
              <f.icon
                size={18}
                strokeWidth={1.6}
                className="text-white/55 transition-colors duration-300 group-hover:text-primary"
              />
            </div>
            <div className="min-w-0">
              <p
                className="text-white"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "13px",
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                {f.title}
              </p>
              <p
                className="text-white/45"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "11px",
                  lineHeight: 1.35,
                }}
              >
                {f.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
