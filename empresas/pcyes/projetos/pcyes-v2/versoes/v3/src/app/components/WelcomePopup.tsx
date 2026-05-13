import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, ArrowRight, Check } from "lucide-react";

export function WelcomePopup() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const seen = sessionStorage.getItem("pcyes-welcome");
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 4000);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    sessionStorage.setItem("pcyes-welcome", "seen");
    setTimeout(() => setVisible(false), 2500);
  };

  const dismiss = () => { sessionStorage.setItem("pcyes-welcome", "seen"); setVisible(false); };

  return (
    <AnimatePresence>
      {mounted && visible && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[75] bg-black/60 backdrop-blur-sm" onClick={dismiss} />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[76] flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-[400px] overflow-hidden relative bg-card border border-border"
              style={{ borderRadius: "16px" }}
            >
              <button onClick={dismiss} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-foreground/30 hover:text-foreground hover:bg-foreground/5 transition-all cursor-pointer">
                <X size={16} />
              </button>

              {/* Top accent */}
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

              <div className="px-8 pt-8 pb-8 text-center">
                {!submitted ? (
                  <>
                    <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles size={22} className="text-primary" />
                    </div>
                    <h3 className="text-foreground mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: "var(--font-weight-medium)" }}>
                      Bem-vindo à PCYES
                    </h3>
                    <p className="text-foreground/35 mb-6 max-w-xs mx-auto" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", lineHeight: "1.7" }}>
                      Cadastre-se para receber novidades, promoções exclusivas e <span className="text-primary">10% de desconto</span> na primeira compra.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input type="email" placeholder="Seu melhor e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required
                        className="w-full px-4 py-3 bg-foreground/[0.03] border border-foreground/8 text-foreground placeholder:text-foreground/20 focus:border-foreground/20 focus:outline-none transition-colors text-center"
                        style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }} />
                      <button type="submit"
                        className="w-full py-3.5 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                        style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
                      >Quero meu desconto <ArrowRight size={15} /></button>
                    </form>

                    <button onClick={dismiss} className="mt-4 text-foreground/20 hover:text-foreground/40 transition-colors cursor-pointer"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                    >Não, obrigado</button>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Check size={22} className="text-green-500" />
                    </div>
                    <h3 className="text-foreground mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>
                      Cadastro realizado!
                    </h3>
                    <p className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", lineHeight: "1.7" }}>
                      Use o cupom <span className="text-primary font-medium">BEMVINDO</span> na sua primeira compra.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
