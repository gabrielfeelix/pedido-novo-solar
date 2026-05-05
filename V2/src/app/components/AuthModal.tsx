import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "./AuthContext";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab, login, socialLogin, register } = useAuth();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [authModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authModalTab === "login") await login(email, password);
      else await register(name, email, password);
    } finally { setLoading(false); }
  };

  const handleSocial = async (provider: string) => {
    setSocialLoading(provider);
    try { await socialLogin(provider); }
    finally { setSocialLoading(null); }
  };

  const reset = () => { setEmail(""); setPassword(""); setName(""); setShowPassword(false); };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md" onClick={() => { setAuthModalOpen(false); reset(); }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[71] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-[420px] overflow-hidden" style={{ borderRadius: "16px", background: isDark ? "#161617" : "white", border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.08)" }}>
              {/* Header */}
              <div className="relative px-8 pt-8 pb-6 text-center">
                <button onClick={() => { setAuthModalOpen(false); reset(); }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-foreground/30 hover:text-foreground hover:bg-foreground/5 transition-all cursor-pointer"
                ><X size={16} /></button>

                <div className="mb-5">
                  <img src="https://pcyes-cdn.oderco.com.br/Logotipos/PCYES/Simbolo-Logo-Horiz-Vermelho.png" alt="PCYES" className="h-[28px] w-auto mx-auto object-contain" />
                </div>
                <p className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>
                  {authModalTab === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
                </p>
              </div>

              {/* Social login */}
              <div className="px-8 space-y-2.5">
                <button onClick={() => handleSocial("google")} disabled={!!socialLoading}
                  className={`w-full flex items-center justify-center gap-3 py-3 hover:bg-white/90 transition-all duration-300 cursor-pointer disabled:opacity-50 ${isDark ? "bg-white text-black" : "bg-white text-black border border-foreground/10"}`}
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
                >
                  {socialLoading === "google" ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
                  Continuar com Google
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button onClick={() => handleSocial("apple")} disabled={!!socialLoading}
                    className={`flex items-center justify-center gap-2.5 py-3 transition-all duration-300 cursor-pointer disabled:opacity-50 ${isDark ? "bg-foreground/5 text-foreground/70 hover:bg-foreground/10" : "bg-foreground/5 text-foreground hover:bg-foreground/10 border border-foreground/10"}`}
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-medium)" }}
                  >
                    {socialLoading === "apple" ? <Loader2 size={15} className="animate-spin" /> : <AppleIcon />}
                    Apple
                  </button>
                  <button onClick={() => handleSocial("discord")} disabled={!!socialLoading}
                    className={`flex items-center justify-center gap-2.5 py-3 transition-all duration-300 cursor-pointer disabled:opacity-50 ${isDark ? "bg-foreground/5 text-foreground/70 hover:bg-foreground/10" : "bg-foreground/5 text-foreground hover:bg-foreground/10 border border-foreground/10"}`}
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-medium)" }}
                  >
                    {socialLoading === "discord" ? <Loader2 size={15} className="animate-spin" /> : <DiscordIcon />}
                    Discord
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="px-8 py-5 flex items-center gap-4">
                <div className="flex-1 h-px bg-foreground/5" />
                <span className="text-foreground/20" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>ou</span>
                <div className="flex-1 h-px bg-foreground/5" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-3">
                {authModalTab === "register" && (
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/20" />
                    <input type="text" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 bg-foreground/[0.03] border border-foreground/8 text-foreground placeholder:text-foreground/20 focus:border-foreground/20 focus:outline-none transition-colors"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }} />
                  </div>
                )}
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/20" />
                  <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full pl-10 pr-4 py-3 bg-foreground/[0.03] border border-foreground/8 text-foreground placeholder:text-foreground/20 focus:border-foreground/20 focus:outline-none transition-colors"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }} />
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/20" />
                  <input type={showPassword ? "text" : "password"} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="w-full pl-10 pr-10 py-3 bg-foreground/[0.03] border border-foreground/8 text-foreground placeholder:text-foreground/20 focus:border-foreground/20 focus:outline-none transition-colors"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-foreground/50 transition-colors cursor-pointer"
                  >{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                </div>

                {authModalTab === "login" && (
                  <div className="text-right">
                    <button type="button" className="text-foreground/30 hover:text-primary transition-colors cursor-pointer"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                    >Esqueceu a senha?</button>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : (
                    <>{authModalTab === "login" ? "Entrar" : "Criar conta"}<ArrowRight size={15} /></>
                  )}
                </button>

                <p className="text-center pt-2 text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                  {authModalTab === "login" ? "Não tem conta? " : "Já tem conta? "}
                  <button type="button" onClick={() => { setAuthModalTab(authModalTab === "login" ? "register" : "login"); reset(); }}
                    className="text-primary hover:underline cursor-pointer"
                  >{authModalTab === "login" ? "Cadastre-se" : "Faça login"}</button>
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
