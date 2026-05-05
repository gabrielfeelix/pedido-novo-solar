import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, Check, Gift, Zap, Bell } from "lucide-react";

const perks = [
  { icon: Zap, text: "Acesso antecipado a lançamentos" },
  { icon: Gift, text: "Cupons exclusivos de até 20% off" },
  { icon: Bell, text: "Notificações de restock em tempo real" },
];

export function Newsletter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <section ref={ref} className="bg-[#0e0e0e] px-6 py-[72px] md:px-12 md:pb-10" style={{ background: "#0e0e0e" }}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-[1474px]"
      >
        <div className="relative overflow-hidden border border-border/10 bg-[#040404] p-10 md:rounded-[8px] md:border md:px-[81px] md:py-[81px]" style={{ borderRadius: "8px" }}>
          <div className="relative z-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-[531px_481px] lg:justify-center lg:gap-[50px]">
            {/* Left: Content */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-primary tracking-[0.25em] mb-6"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-label)", fontWeight: "var(--font-weight-medium)" }}
              >
                NEWSLETTER
              </motion.p>
              <div className="overflow-hidden mb-6">
                <motion.h2
                  initial={{ y: 80 }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-foreground"
                  style={{ fontSize: "clamp(32px, 4vw, 40px)", fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-light)", lineHeight: 1 }}
                >
                  Junte-se ao
                </motion.h2>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-foreground/30 mb-10"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", lineHeight: "1.8" }}
              >
                Mais de 50.000 entusiastas já fazem parte. Receba conteúdo exclusivo direto no seu e-mail.
              </motion.p>

              {/* Perks */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col gap-4"
              >
                {perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/8 rounded-full flex items-center justify-center flex-shrink-0">
                      <perk.icon size={13} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <span className="text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>
                      {perk.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {!submitted ? (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <label className="text-foreground/30 mb-2 block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.05em" }}>
                      NOME
                    </label>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      className="w-full px-[21px] py-[17px] bg-foreground/[0.03] border border-border/10 text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-primary/40 transition-all duration-500"
                      style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                    />
                  </div>
                  <div>
                    <label className="text-foreground/30 mb-2 block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.05em" }}>
                      E-MAIL
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-[21px] py-[17px] bg-foreground/[0.03] border border-border/10 text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-primary/40 transition-all duration-500"
                      style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="group relative w-full mt-2 flex items-center justify-center gap-2 overflow-hidden bg-primary px-8 py-4 text-primary-foreground transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,43,46,0.25)]"
                    style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Inscrever-se <ArrowRight size={15} />
                    </span>
                    <span className="absolute inset-0 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </button>
                  <p className="text-foreground/15 text-center mt-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                    Sem spam. Cancele a qualquer momento.
                  </p>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={24} className="text-primary" />
                  </div>
                  <p className="text-foreground mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: "var(--font-weight-medium)" }}>
                    Bem-vindo ao clube!
                  </p>
                  <p className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>
                    Fique de olho no seu inbox para novidades exclusivas.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
