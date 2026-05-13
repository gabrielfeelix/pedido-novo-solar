import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ArrowUpRight, Clock, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const allProducts = [
  { id: 1, name: "Cobra V2 Mouse", category: "Periféricos", price: "R$ 189,90", image: "https://images.unsplash.com/photo-1768561327952-119a4c9c76f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZSUyMGRhcmslMjBtaW5pbWFsfGVufDF8fHx8MTc3MzgzOTc5NHww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 2, name: "Mancer Pro Teclado", category: "Periféricos", price: "R$ 349,90", image: "https://images.unsplash.com/photo-1718803448073-90ebd0d982e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmQlMjBjbG9zZXVwJTIwZGFya3xlbnwxfHx8fDE3NzM4Mzk3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 3, name: "Fallen 7.1 Headset", category: "Áudio", price: "R$ 279,90", image: "https://images.unsplash.com/photo-1673669231301-09baa4d7761b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkc2V0JTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzczODM5Nzk1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 4, name: "Spectrum Pro Gabinete", category: "Gabinetes", price: "R$ 599,90", image: "https://images.unsplash.com/photo-1695120485648-0b6eed4707aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGNhc2UlMjB0b3dlciUyMGRhcmt8ZW58MXx8fHwxNzczODM5Nzk1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 5, name: "Electra 750W Fonte", category: "Fontes", price: "R$ 449,90", image: "https://images.unsplash.com/photo-1630831506636-5209d7349db9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHBvd2VyJTIwc3VwcGx5JTIwdW5pdCUyMGRhcmt8ZW58MXx8fHwxNzczODM5Nzk2fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 6, name: "Cadeira Titan Elite", category: "Cadeiras", price: "R$ 1.899,90", image: "https://images.unsplash.com/photo-1757194455393-8e3134d4ce19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjaGFpciUyMGVyZ29ub21pYyUyMGRhcmt8ZW58MXx8fHwxNzczODQwNDA4fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 7, name: "Studio X Microfone", category: "Streaming", price: "R$ 489,90", image: "https://images.unsplash.com/photo-1579870946215-8284f1a47c9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3Bob25lJTIwY29uZGVuc2VyJTIwc3R1ZGlvJTIwZGFya3xlbnwxfHx8fDE3NzM4NDA0MTB8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 8, name: "Controle Vortex Wireless", category: "Controles", price: "R$ 329,90", image: "https://images.unsplash.com/photo-1622349851524-890cc3641b87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb250cm9sbGVyJTIwd2lyZWxlc3MlMjBkYXJrfGVufDF8fHx8MTc3Mzg0MDQwOXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 9, name: "Deskpad RGB Pro", category: "Acessórios", price: "R$ 149,90", image: "https://images.unsplash.com/photo-1713012003065-7ca32db003ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSR0IlMjBtb3VzZXBhZCUyMGRlc2slMjBtYXQlMjBkYXJrfGVufDF8fHx8MTc3Mzg0MDQwOXww&ixlib=rb-4.1.0&q=80&w=1080" },
];

const trending = ["Gabinete Spectrum", "Mouse Cobra", "Teclado Mecânico", "Headset 7.1"];
const recent = ["Fontes modulares", "Cadeiras gaming"];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose(); else onClose(); // toggle handled externally
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim().length > 0) {
      onClose();
      navigate(`/produtos?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const results = query.trim().length > 0
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 z-[71] w-[95%] max-w-[640px] bg-card border border-border/10 overflow-hidden shadow-2xl"
            style={{ borderRadius: "12px" }}
          >
            {/* Search input */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-border/10">
              <Search size={18} className="text-foreground/30 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar produtos, categorias..."
                className="flex-1 bg-transparent text-foreground placeholder:text-foreground/20 outline-none"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px" }}
              />
              <div className="flex items-center gap-2">
                {query && (
                  <button onClick={() => setQuery("")} className="text-foreground/20 hover:text-foreground/50 transition-colors">
                    <X size={15} />
                  </button>
                )}
                <kbd
                  className="hidden md:flex items-center px-2 py-0.5 bg-foreground/5 text-foreground/20"
                  style={{ borderRadius: "var(--radius)", fontFamily: "var(--font-family-inter)", fontSize: "10px" }}
                >
                  ESC
                </kbd>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim().length === 0 ? (
                <div className="p-6">
                  {/* Trending */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={12} className="text-primary" />
                      <span className="text-foreground/30 tracking-wider" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>
                        TENDÊNCIAS
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trending.map((t) => (
                        <button
                          key={t}
                          onClick={() => setQuery(t)}
                          className="px-4 py-2 bg-foreground/[0.03] border border-border/5 text-foreground/50 hover:text-foreground hover:border-border/20 transition-all duration-300"
                          style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Recent */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Clock size={12} className="text-foreground/30" />
                      <span className="text-foreground/30 tracking-wider" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>
                        RECENTES
                      </span>
                    </div>
                    {recent.map((r) => (
                      <button
                        key={r}
                        onClick={() => setQuery(r)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-foreground/40 hover:text-foreground hover:bg-foreground/[0.03] transition-all duration-200"
                        style={{ borderRadius: "var(--radius)", fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                      >
                        <Clock size={13} className="text-foreground/15" />
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="p-3">
                  <p className="px-3 py-2 text-foreground/20" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                    {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
                  </p>
                  {results.map((product, i) => (
                    <motion.a
                      key={product.id}
                      href="#"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                      className="group flex items-center gap-4 p-3 hover:bg-foreground/[0.03] transition-colors"
                      style={{ borderRadius: "var(--radius-card)" }}
                      onClick={onClose}
                    >
                      <div className="w-[52px] h-[52px] flex-shrink-0 overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
                        <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground group-hover:text-primary transition-colors truncate" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>
                          {product.name}
                        </p>
                        <p className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                          {product.category}
                        </p>
                      </div>
                      <span className="text-foreground/40 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                        {product.price}
                      </span>
                      <ArrowUpRight size={14} className="text-foreground/10 group-hover:text-foreground/40 transition-colors flex-shrink-0" />
                    </motion.a>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center">
                  <p className="text-foreground/30 mb-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px", fontWeight: "var(--font-weight-medium)" }}>
                    Nenhum resultado
                  </p>
                  <p className="text-foreground/15" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                    Tente buscar por outro termo
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
