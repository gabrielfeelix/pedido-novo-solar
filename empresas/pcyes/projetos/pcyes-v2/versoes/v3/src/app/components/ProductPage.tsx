import { useMemo, useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  ShoppingBag, Heart, Star, ChevronLeft, ChevronRight, ChevronDown, Truck,
  Check, Minus, Plus, Share2, MapPin, CreditCard, Banknote, QrCode,
  Loader2, ArrowUpRight, Zap, X, Clock, Info,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";
import { useTheme } from "./ThemeProvider";
import { allProducts } from "./productsData";
import { Footer } from "./Footer";
import {
  getCatalogHref, getProductImages, getPrimaryProductImage,
  getProductSubcategory, getProductSwatches,
  getVisibleCatalogProducts,
} from "./productPresentation";
import { toast } from "sonner";

/* ── helpers ─────────────────────────────────────────── */

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

const pad = (n: number) => String(n).padStart(2, "0");

function getRemainingUnits(product: { id: number; inStock?: boolean; reviews?: number; rating?: number }) {
  if (product.inStock === false) return 0;

  const reviewSeed = product.reviews ?? 0;
  const ratingSeed = Math.round((product.rating ?? 0) * 10);
  return 4 + ((product.id * 7 + reviewSeed + ratingSeed) % 9);
}

function getStockLabel(product: { id: number; inStock?: boolean; reviews?: number; rating?: number }) {
  const remainingUnits = getRemainingUnits(product);
  if (remainingUnits <= 0) return "Sem estoque";
  if (remainingUnits === 1) return "1 unidade restante";
  return `${remainingUnits} unidades restantes`;
}

/* ── shipping mock ─────────────────────────────────────── */

type ShippingOption = {
  id: string;
  name: string;
  price: string;
  isFree: boolean;
  days: string;
};

function calcShipping(digits: string, productPrice: number): ShippingOption[] {
  const seed = parseInt(digits.slice(0, 3)) || 10;
  const options: ShippingOption[] = [];

  if (productPrice >= 299) {
    options.push({
      id: "free",
      name: "Frete Grátis",
      price: "R$ 0,00",
      isFree: true,
      days: `${6 + (seed % 4)} dias úteis`,
    });
  }

  options.push({
    id: "pac",
    name: "Correios PAC",
    price: `R$ ${(14.9 + (seed % 6)).toFixed(2).replace(".", ",")}`,
    isFree: false,
    days: `${10 + (seed % 5)} dias úteis`,
  });

  options.push({
    id: "sedex",
    name: "SEDEX",
    price: `R$ ${(29.9 + (seed % 8)).toFixed(2).replace(".", ",")}`,
    isFree: false,
    days: `${2 + (seed % 3)} dias úteis`,
  });

  return options;
}

/* ═══════════════════════════════════════════════════════
   GALLERY
   ═══════════════════════════════════════════════════════ */

function ProductGallery({ images, name, isDark }: { images: string[]; name: string; isDark: boolean }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStart.current = null;
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 overflow-visible md:gap-5">
      <div
        className="relative w-full max-w-[560px] aspect-square overflow-hidden group cursor-zoom-in xl:max-w-[620px]"
        style={{
          borderRadius: "20px",
          background: isDark
            ? "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)"
            : "linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.01) 100%)",
          border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
          boxShadow: isDark
            ? "inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 60px -20px rgba(0,0,0,0.4)"
            : "inset 0 1px 0 rgba(255,255,255,0.6), 0 24px 60px -20px rgba(0,0,0,0.08)",
        }}
        onClick={() => setZoomed(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.06) 0%, transparent 55%)",
            borderRadius: "20px",
          }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <ImageWithFallback
              src={images[active]}
              alt={name}
              className="w-full h-full object-contain p-4 md:p-5 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
	            <button
	              onClick={(e) => { e.stopPropagation(); prev(); }}
	              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white/85 hover:bg-black/45 hover:text-white md:opacity-0 md:group-hover:opacity-100 transition-all duration-300"
	              aria-label="Imagem anterior"
	            >
              <ChevronLeft size={17} />
            </button>
	            <button
	              onClick={(e) => { e.stopPropagation(); next(); }}
	              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white/85 hover:bg-black/45 hover:text-white md:opacity-0 md:group-hover:opacity-100 transition-all duration-300"
	              aria-label="Próxima imagem"
	            >
              <ChevronRight size={17} />
            </button>
          </>
        )}

        {images.length > 1 && (
          <span
            className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/30 backdrop-blur-md text-white/75 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ borderRadius: "100px", fontSize: "11px", fontFamily: "var(--font-family-inter)" }}
          >
            {active + 1} / {images.length}
          </span>
        )}
      </div>

	      {images.length > 1 && (
	        <div className="relative z-10 hidden w-full max-w-[560px] justify-center gap-3 overflow-x-auto pb-1 scrollbar-none md:flex xl:max-w-[620px]">
	          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 md:w-[74px] md:h-[74px] overflow-hidden border transition-all cursor-pointer ${i === active ? "border-primary ring-1 ring-primary/35" : "border-foreground/10 hover:border-foreground/30"}`}
              style={{ borderRadius: "8px", background: isDark ? "#2a2a2c" : "#ffffff" }}
              aria-label={`Ver imagem ${i + 1}`}
            >
              <ImageWithFallback src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-contain p-1.5" />
            </button>
          ))}
	        </div>
	      )}

	      {images.length > 1 && (
	        <div className="relative z-10 flex items-center justify-center gap-2 md:hidden" aria-label="Indicadores da galeria">
	          {images.map((_, i) => (
	            <button
	              key={i}
	              onClick={() => setActive(i)}
	              className={`h-2.5 w-2.5 rounded-full border transition-all ${
	                i === active
	                  ? "border-foreground bg-foreground"
	                  : "border-foreground/70 bg-transparent"
	              }`}
	              aria-label={`Ver imagem ${i + 1}`}
	              aria-current={i === active ? "true" : undefined}
	            />
	          ))}
	        </div>
	      )}

      {/* Lightbox */}
      <AnimatePresence>
        {zoomed && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 cursor-zoom-out"
              onClick={() => setZoomed(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 py-16 md:inset-10 md:px-12 md:py-10"
              onClick={() => setZoomed(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setZoomed(false); }}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md transition-colors hover:bg-white/16 hover:text-white md:right-6 md:top-6"
                aria-label="Fechar imagem ampliada"
              >
                <X size={18} />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/85 backdrop-blur-md transition-colors hover:bg-white/16 hover:text-white md:left-6 md:h-12 md:w-12"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/85 backdrop-blur-md transition-colors hover:bg-white/16 hover:text-white md:right-6 md:h-12 md:w-12"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              <img
                src={images[active]}
                alt={name}
                className="max-h-full max-w-full object-contain"
                style={{ borderRadius: "var(--radius-card)" }}
                onClick={(e) => e.stopPropagation()}
              />

              {images.length > 1 && (
                <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur-md md:bottom-6">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setActive(i); }}
                      className={`h-2.5 w-2.5 rounded-full border transition-all ${
                        i === active ? "border-white bg-white" : "border-white/70 bg-transparent"
                      }`}
                      aria-label={`Ver imagem ${i + 1}`}
                      aria-current={i === active ? "true" : undefined}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COUNTDOWN — promo timer
   ═══════════════════════════════════════════════════════ */

function CountdownTimer() {
  const target = useMemo(() => {
    const t = new Date();
    t.setHours(23, 59, 59, 0);
    return t.getTime();
  }, []);

  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const TimeBox = ({ value }: { value: string }) => (
    <span
      className="inline-flex items-center justify-center min-w-[26px] px-1.5 py-1 bg-foreground text-background font-bold tabular-nums"
      style={{ borderRadius: "5px", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
    >
      {value}
    </span>
  );

  return (
    <div
      className="flex items-center gap-2.5 px-3.5 py-2.5 border border-primary/20 bg-primary/[0.05]"
      style={{ borderRadius: "var(--radius-button)" }}
    >
      <Clock size={13} className="text-primary flex-shrink-0" strokeWidth={2} />
      <span
        className="text-foreground/65 font-medium flex-1 truncate"
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
      >
        Oferta encerra em
      </span>
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <TimeBox value={pad(time.h)} />
        <span className="text-foreground/30 font-bold mx-0.5">:</span>
        <TimeBox value={pad(time.m)} />
        <span className="text-foreground/30 font-bold mx-0.5">:</span>
        <TimeBox value={pad(time.s)} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   AUTO SHIPPING CALCULATOR
   ═══════════════════════════════════════════════════════ */

function AutoShippingCalculator({ productPrice }: { productPrice: number }) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ShippingOption[] | null>(null);

  useEffect(() => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      setOptions(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setOptions(null);
    const timer = setTimeout(() => {
      setOptions(calcShipping(digits, productPrice));
      setLoading(false);
    }, 550);
    return () => clearTimeout(timer);
  }, [cep, productPrice]);

  const digits = cep.replace(/\D/g, "");
  const showHint = digits.length > 0 && digits.length < 8 && !loading;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={13} className="text-foreground/40" strokeWidth={1.8} />
        <span
          className="text-foreground/60 font-semibold tracking-wide"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.08em" }}
        >
          CONSULTAR FRETE
        </span>
      </div>

      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Digite seu CEP"
          value={cep}
          onChange={(e) => setCep(formatCep(e.target.value))}
          className="w-full text-foreground placeholder-foreground/30 px-4 py-3 pr-11 focus:outline-none transition-all"
          style={{
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.04)",
            fontFamily: "var(--font-family-inter)",
            fontSize: "14px",
            letterSpacing: "0.02em",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(34,197,94,0.55)";
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 size={15} className="animate-spin text-primary" />
          ) : digits.length === 8 && options ? (
            <Check size={15} className="text-green-500" />
          ) : (
            <span className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
              {digits.length}/8
            </span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-foreground/40 mt-2"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "11.5px" }}
          >
            Digite os 8 dígitos para ver as opções
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {options && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-1.5">
              {options.map((opt, i) => (
                <motion.div
                  key={opt.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between py-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Truck
                      size={13}
                      className={opt.isFree ? "text-green-500" : "text-foreground/35"}
                      strokeWidth={1.8}
                    />
                    <div className="min-w-0">
                      <p
                        className={`truncate ${opt.isFree ? "text-green-500 font-semibold" : "text-foreground/75 font-medium"}`}
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                      >
                        {opt.name}
                      </p>
                      <p
                        className="text-foreground/40"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
                      >
                        {opt.days}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`flex-shrink-0 ml-3 ${opt.isFree ? "text-green-500 font-bold" : "text-foreground font-semibold"}`}
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px" }}
                  >
                    {opt.price}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAYMENT MODAL
   ═══════════════════════════════════════════════════════ */

function PaymentModal({ open, onClose, priceNum }: { open: boolean; onClose: () => void; priceNum: number }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  const pixPrice = priceNum * 0.9;
  const installments = Array.from({ length: 12 }, (_, i) => ({
    n: i + 1,
    value: priceNum / (i + 1),
  }));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none p-0 md:p-6">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="pointer-events-auto w-full max-w-[520px] bg-background border border-foreground/10 shadow-2xl overflow-hidden"
              style={{
                borderRadius: "20px 20px 0 0",
                maxHeight: "min(85vh, 720px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center justify-between px-6 py-4 border-b border-foreground/8"
                style={{ borderRadius: "var(--radius-card) var(--radius-card) 0 0" }}
              >
                <h3
                  className="text-foreground"
                  style={{ fontFamily: "var(--font-family-figtree)", fontSize: "17px", fontWeight: 500 }}
                >
                  Formas de pagamento
                </h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/8 text-foreground/45 hover:text-foreground transition-all cursor-pointer"
                  aria-label="Fechar"
                >
                  <X size={16} strokeWidth={1.8} />
                </button>
              </div>

              <div className="overflow-y-auto px-6 py-5 space-y-6" style={{ maxHeight: "calc(85vh - 64px)" }}>
                {/* PIX */}
                <section>
                  <header className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-green-500/12 flex items-center justify-center flex-shrink-0">
                      <QrCode size={16} className="text-green-500" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-foreground font-semibold"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                      >
                        PIX
                      </h4>
                      <p
                        className="text-foreground/45"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "11.5px" }}
                      >
                        Aprovação imediata
                      </p>
                    </div>
                    <span
                      className="px-2 py-0.5 bg-green-500/15 text-green-500 font-bold flex-shrink-0"
                      style={{ borderRadius: "4px", fontSize: "10.5px", fontFamily: "var(--font-family-inter)" }}
                    >
                      10% OFF
                    </span>
                  </header>
                  <div
                    className="flex items-baseline justify-between px-4 py-3 bg-green-500/[0.04] border border-green-500/20"
                    style={{ borderRadius: "var(--radius-button)" }}
                  >
                    <span
                      className="text-foreground/60"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px" }}
                    >
                      Total à vista
                    </span>
                    <span
                      className="text-green-500"
                      style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: 600 }}
                    >
                      {formatBRL(pixPrice)}
                    </span>
                  </div>
                </section>

                {/* Cartão */}
                <section>
                  <header className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/12 flex items-center justify-center flex-shrink-0">
                      <CreditCard size={16} className="text-primary" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-foreground font-semibold"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                      >
                        Cartão de crédito
                      </h4>
                      <p
                        className="text-foreground/45"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "11.5px" }}
                      >
                        Visa · Master · Elo · Amex · Hipercard
                      </p>
                    </div>
                  </header>
                  <div
                    className="overflow-hidden border border-foreground/8"
                    style={{ borderRadius: "var(--radius-button)" }}
                  >
                    <div className="grid grid-cols-2 divide-x divide-foreground/6">
                      <div className="divide-y divide-foreground/6">
                        {installments.slice(0, 6).map((inst) => (
                          <div
                            key={inst.n}
                            className="flex items-center justify-between px-3.5 py-2.5"
                          >
                            <span
                              className="text-foreground/45 font-medium"
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                            >
                              {inst.n}×
                            </span>
                            <span
                              className="text-foreground font-semibold tabular-nums"
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px" }}
                            >
                              {formatBRL(inst.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="divide-y divide-foreground/6">
                        {installments.slice(6, 12).map((inst) => (
                          <div
                            key={inst.n}
                            className="flex items-center justify-between px-3.5 py-2.5"
                          >
                            <span
                              className="text-foreground/45 font-medium"
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                            >
                              {inst.n}×
                            </span>
                            <span
                              className="text-foreground font-semibold tabular-nums"
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px" }}
                            >
                              {formatBRL(inst.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p
                    className="text-foreground/40 mt-2.5 flex items-center gap-1.5"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "11.5px" }}
                  >
                    <Info size={11} strokeWidth={1.8} />
                    Todas as parcelas sem juros
                  </p>
                </section>

                {/* Boleto */}
                <section>
                  <header className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-foreground/[0.06] flex items-center justify-center flex-shrink-0">
                      <Banknote size={16} className="text-foreground/55" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-foreground font-semibold"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                      >
                        Boleto bancário
                      </h4>
                      <p
                        className="text-foreground/45"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "11.5px" }}
                      >
                        Vencimento em 3 dias úteis
                      </p>
                    </div>
                  </header>
                  <div
                    className="flex items-baseline justify-between px-4 py-3 border border-foreground/8 bg-foreground/[0.02]"
                    style={{ borderRadius: "var(--radius-button)" }}
                  >
                    <span
                      className="text-foreground/60"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px" }}
                    >
                      Total
                    </span>
                    <span
                      className="text-foreground"
                      style={{ fontFamily: "var(--font-family-figtree)", fontSize: "18px", fontWeight: 500 }}
                    >
                      {formatBRL(priceNum)}
                    </span>
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════
   STICKY PRICE CARD
   ═══════════════════════════════════════════════════════ */

type StickyCardProps = {
  product: any;
  qty: number;
  setQty: (q: number) => void;
  onBuyNow: () => void;
  onAddToCart: () => void;
  addedToCart: boolean;
  pixPrice: number;
  installment: number;
  discount: number;
};

function StickyPriceCard({
  product, qty, setQty, onBuyNow, onAddToCart, addedToCart, pixPrice, installment, discount,
}: StickyCardProps) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const inStock = product.inStock !== false;
  const stockLabel = getStockLabel(product);

  return (
    <>
      <div
        className="p-5 lg:p-6 relative overflow-hidden"
        data-purchase-card="product-page"
        style={{
          borderRadius: "20px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 60px -20px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(circle at 30% 0%, rgba(255,255,255,0.05) 0%, transparent 55%)",
            borderRadius: "20px",
          }}
        />
        {/* Promo Timer */}
        <div className="relative mb-5">
          <CountdownTimer />
        </div>

        {/* Price block */}
        <div className="relative mb-5">
          {product.oldPrice && (
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="line-through leading-none"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "rgba(255,255,255,0.38)" }}
              >
                {product.oldPrice}
              </span>
              {discount > 0 && (
                <span
                  className="inline-flex items-center rounded-md px-1.5 py-0.5 leading-none"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#0a0a0a",
                    background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                    boxShadow: "0 4px 14px -4px rgba(16,185,129,0.6)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  -{discount}%
                </span>
              )}
            </div>
          )}

          <div className="flex items-baseline gap-2 mb-1">
            <span
              className="text-foreground leading-none"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(28px, 3.2vw, 36px)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              {formatBRL(pixPrice)}
            </span>
          </div>

          <p
            className="text-foreground/55 mb-2.5"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px" }}
          >
            no <span className="text-green-500 font-semibold">PIX</span> com{" "}
            <span className="text-green-500 font-semibold">10% de desconto</span>
          </p>

          <div className="h-px bg-foreground/6 my-3" />

          <p
            className="text-foreground/65"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", lineHeight: "1.55" }}
          >
            ou <span className="text-foreground font-semibold">{product.price}</span> em até{" "}
            <span className="text-foreground font-semibold">12× {formatBRL(installment)}</span> sem juros
          </p>

          <button
            onClick={() => setPaymentOpen(true)}
            className="mt-2.5 inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors cursor-pointer group"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 600 }}
          >
            Ver opções de pagamento
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Stock indicator */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`relative flex w-2 h-2`}>
            {inStock && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-65 animate-ping" />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${inStock ? "bg-green-500" : "bg-foreground/30"}`} />
          </span>
          <span
            className={inStock ? "text-[#4CAF50]" : "text-foreground/45"}
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 600 }}
          >
            {inStock ? `${stockLabel} · envio em 24h` : "Sem estoque"}
          </span>
        </div>

        {/* Qty selector */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-foreground/55 font-semibold tracking-wide"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.08em" }}
          >
            QUANTIDADE
          </span>
          <div
            className="flex items-center border border-foreground/12 overflow-hidden"
            style={{ borderRadius: "var(--radius-button)" }}
          >
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-8 h-9 flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all cursor-pointer disabled:opacity-30"
              disabled={qty <= 1}
            >
              <Minus size={12} />
            </button>
            <span
              className="w-9 h-9 flex items-center justify-center text-foreground border-x border-foreground/10 select-none tabular-nums"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: 600 }}
            >
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-8 h-9 flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all cursor-pointer"
              disabled={!inStock}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        {/* CTAs */}
        <div className="relative flex flex-col gap-2 mb-5">
          <button
            onClick={onBuyNow}
            disabled={!inStock}
            className="h-12 flex items-center justify-center gap-2 text-white rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              fontFamily: "var(--font-family-inter)",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              boxShadow: "0 14px 32px -8px rgba(34,197,94,0.55)",
            }}
          >
            <Zap size={15} strokeWidth={2.4} fill="currentColor" />
            Comprar agora
          </button>

        </div>

        <div className="h-px bg-foreground/6 mb-5" />

        {/* Shipping */}
        <div className="mb-5">
          <AutoShippingCalculator productPrice={product.priceNum} />
        </div>
      </div>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        priceNum={product.priceNum}
      />
    </>
  );
}

function MobilePurchaseFlow({
  product, qty, setQty, onBuyNow, onAddToCart, addedToCart, pixPrice, installment, discount, onSeeDescription, shippingRef,
}: StickyCardProps & { onSeeDescription: () => void; shippingRef?: React.RefObject<HTMLDivElement> }) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const inStock = product.inStock !== false;
  const stockLabel = getStockLabel(product);

  return (
    <section className="order-4 lg:hidden w-full mt-2 mb-10" data-purchase-card="mobile-product-flow">
      <div className="py-5 border-y border-foreground/8">
        <div className="flex items-center justify-between gap-3 mb-3">
          {product.oldPrice ? (
            <div className="flex items-center gap-2">
              <span
                className="text-foreground/35 line-through"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
              >
                {product.oldPrice}
              </span>
              {discount > 0 && (
                <span
                  className="inline-flex items-center rounded-md px-1.5 py-0.5 leading-none"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "10.5px",
                    fontWeight: 800,
                    color: "#0a0a0a",
                    background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                    boxShadow: "0 4px 14px -4px rgba(16,185,129,0.6)",
                  }}
                >
                  -{discount}%
                </span>
              )}
            </div>
          ) : <span />}

          <span
            className={inStock ? "text-green-500" : "text-foreground/45"}
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 700 }}
          >
            {inStock ? stockLabel : "Sem estoque"}
          </span>
        </div>

        <div className="mb-3">
          <p
            className="text-foreground leading-none mb-2"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(34px, 10vw, 44px)",
              fontWeight: 650,
              letterSpacing: "-0.02em",
            }}
          >
            {formatBRL(pixPrice)}
          </p>
          <p
            className="text-foreground/60"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", lineHeight: "1.55" }}
          >
            à vista no <span className="text-[#4CAF50] font-bold">PIX</span> com{" "}
            <span className="text-[#4CAF50] font-bold">10% de desconto</span>
          </p>
        </div>

        <p
          className="text-foreground/68 mb-3"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", lineHeight: "1.6" }}
        >
          ou <span className="text-foreground font-bold">{product.price}</span> em até{" "}
          <span className="text-foreground font-bold">12x de {formatBRL(installment)}</span> sem juros no cartão
        </p>

        <button
          onClick={() => setPaymentOpen(true)}
          className="mb-5 inline-flex items-center gap-1 text-foreground underline underline-offset-4 decoration-foreground/30 cursor-pointer"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 700 }}
        >
          Ver opções de pagamento
          <ArrowUpRight size={12} />
        </button>

        <div className="flex items-center justify-between mb-3">
          <span
            className="text-foreground/50 font-semibold tracking-wide"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.08em" }}
          >
            QUANTIDADE
          </span>
          <div className="flex items-center rounded-full border border-foreground/12 overflow-hidden">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-9 h-9 flex items-center justify-center text-foreground/45 disabled:opacity-30"
              disabled={qty <= 1}
              aria-label="Diminuir quantidade"
            >
              <Minus size={13} />
            </button>
            <span
              className="w-10 h-9 flex items-center justify-center text-foreground border-x border-foreground/8 tabular-nums"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: 700 }}
            >
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-9 h-9 flex items-center justify-center text-foreground/45 disabled:opacity-30"
              disabled={!inStock}
              aria-label="Aumentar quantidade"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onBuyNow}
            disabled={!inStock}
            className="h-12 flex items-center justify-center gap-2 text-white rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              fontFamily: "var(--font-family-inter)",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              boxShadow: "0 14px 32px -8px rgba(34,197,94,0.55)",
            }}
          >
            <Zap size={15} strokeWidth={2.4} fill="currentColor" />
            Comprar agora
          </button>
          <button
            onClick={onAddToCart}
            disabled={!inStock}
            className={`h-12 flex items-center justify-center gap-2 font-bold transition-all cursor-pointer disabled:opacity-40 ${
              addedToCart
                ? "bg-[#4CAF50]/10 text-[#4CAF50]"
                : "bg-white text-black border border-foreground/10"
            }`}
            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
          >
            {addedToCart ? (
              <><Check size={15} strokeWidth={2.2} /> Adicionado ao carrinho</>
            ) : (
              <><ShoppingBag size={15} strokeWidth={1.9} /> Comprar</>
            )}
          </button>
        </div>
      </div>

      <div ref={shippingRef} className="py-5 border-b border-foreground/8" data-mobile-shipping-checkpoint>
        <AutoShippingCalculator productPrice={product.priceNum} />
      </div>

      <div className="py-5 border-b border-foreground/8">
        <AboutProduct product={product} onSeeDescription={onSeeDescription} />
      </div>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        priceNum={product.priceNum}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   ABOUT PRODUCT (middle column bullets + ver mais)
   ═══════════════════════════════════════════════════════ */

function AboutProduct({ product, onSeeDescription }: { product: any; onSeeDescription: () => void }) {
  const bullets: string[] = product.features?.length
    ? product.features
    : (product.description ?? "")
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean);

  if (!bullets.length) return null;

  return (
    <section>
      <h2
        className="text-primary font-bold tracking-wide mb-4"
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.3em" }}
      >
        // SOBRE O PRODUTO
      </h2>

      <ul key={product.id} className="space-y-3">
        {bullets.map((bullet, i) => (
          <motion.li
            key={`${i}-${bullet.slice(0, 20)}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, delay: Math.min(i, 5) * 0.025 }}
            className="flex items-start gap-3"
          >
            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center mt-1">
              <Check size={9} className="text-primary" strokeWidth={2.5} />
            </span>
            <span
              className="text-foreground/65 leading-relaxed"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", lineHeight: "1.65" }}
            >
              {bullet}
            </span>
          </motion.li>
        ))}
      </ul>

      <button
        onClick={onSeeDescription}
        className="mt-4 inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors cursor-pointer group"
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", fontWeight: 600 }}
      >
        Ver mais
        <ChevronRight size={13} className="rotate-90 transition-transform group-hover:translate-y-0.5" />
      </button>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   REVIEWS SECTION
   ═══════════════════════════════════════════════════════ */

function ReviewsSection({ product, isDark }: { product: any; isDark: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<"recent" | "relevant" | "photos">("recent");
  const [activeStarFilter, setActiveStarFilter] = useState<number | null>(null);
  const [reviewPage, setReviewPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<{ reviewIndex: number; imageIndex: number } | null>(null);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");

  const reviews = [
    {
      id: 1,
      user: "Ricardo M.",
      rating: 5,
      date: "24 Mar 2026",
      comment: "Simplesmente incrível. O acabamento é premium e o desempenho superou minhas expectativas. Recomendo muito para quem busca qualidade.",
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop",
      ],
      likes: 12
    },
    {
      id: 2,
      user: "Juliana S.",
      rating: 5,
      date: "15 Mar 2026",
      comment: "Entrega super rápida e o produto veio muito bem embalado. A cor é linda e o material parece ser bem durável.",
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=900&auto=format&fit=crop",
      ],
      likes: 8
    },
    {
      id: 3,
      user: "Fabio L.",
      rating: 4,
      date: "02 Mar 2026",
      comment: "Ótimo custo-benefício. O único ponto é que o cabo poderia ser um pouco mais longo, mas nada que atrapalhe o uso.",
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=900&auto=format&fit=crop",
      ],
      likes: 4
    },
    {
      id: 4,
      user: "Marina A.",
      rating: 5,
      date: "21 Fev 2026",
      comment: "Gostei muito do visual minimalista. Combina com meu setup e a experiência no uso diário é bem fluida.",
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=900&auto=format&fit=crop",
      ],
      likes: 19
    },
    {
      id: 5,
      user: "Pedro C.",
      rating: 5,
      date: "08 Fev 2026",
      comment: "A compra foi tranquila, chegou antes do prazo e o produto tem uma presença muito melhor pessoalmente.",
      verified: true,
      likes: 7
    },
    {
      id: 6,
      user: "Camila R.",
      rating: 4,
      date: "19 Jan 2026",
      comment: "Produto muito bom. Só senti falta de uma embalagem um pouco mais premium, mas o produto em si é excelente.",
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=900&auto=format&fit=crop",
      ],
      likes: 5
    },
  ];

  const mediaReviews = reviews.filter((review) => review.images?.length);
  const customerPhotos = mediaReviews.flatMap((review) =>
    review.images!.map((image, imageIndex) => ({
      image,
      imageIndex,
      reviewIndex: reviews.findIndex((item) => item.id === review.id),
      review,
    })),
  );
  const sortedReviews = activeFilter === "photos"
    ? mediaReviews
    : activeFilter === "relevant"
      ? [...reviews].sort((a, b) => b.likes - a.likes)
      : [...reviews].sort((a, b) => a.id - b.id);
  const filteredReviews = activeStarFilter ? sortedReviews.filter(r => r.rating === activeStarFilter) : sortedReviews;
  const reviewsPerPage = 4;
  const totalReviewPages = Math.max(1, Math.ceil(filteredReviews.length / reviewsPerPage));
  const visibleReviews = filteredReviews.slice((reviewPage - 1) * reviewsPerPage, reviewPage * reviewsPerPage);
  const selectedReview = selectedMedia ? reviews[selectedMedia.reviewIndex] : null;
  const selectedImage = selectedReview?.images?.[selectedMedia?.imageIndex ?? 0];

  const openMedia = (reviewIndex: number, imageIndex: number) => {
    setSelectedMedia({ reviewIndex, imageIndex });
  };

  const moveMedia = (direction: 1 | -1) => {
    if (!selectedMedia) return;
    const images = reviews[selectedMedia.reviewIndex]?.images ?? [];
    if (images.length <= 1) return;
    const nextImageIndex = (selectedMedia.imageIndex + direction + images.length) % images.length;
    setSelectedMedia({ reviewIndex: selectedMedia.reviewIndex, imageIndex: nextImageIndex });
  };

  const moveReview = (direction: 1 | -1) => {
    if (!selectedMedia) return;
    const reviewOrder = mediaReviews.map((review) => reviews.findIndex((item) => item.id === review.id));
    const currentIndex = reviewOrder.indexOf(selectedMedia.reviewIndex);
    const nextIndex = (currentIndex + direction + reviewOrder.length) % reviewOrder.length;
    setSelectedMedia({ reviewIndex: reviewOrder[nextIndex], imageIndex: 0 });
  };

  const goToReviewPage = (page: number) => {
    setReviewPage(page);
    window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const filters = [
    { key: "recent" as const, label: "Recentes" },
    { key: "relevant" as const, label: "Mais relevantes" },
    { key: "photos" as const, label: "Com fotos" },
  ];

  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
  const ratingDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ratingDropdownRef.current && !ratingDropdownRef.current.contains(e.target as Node)) {
        setRatingDropdownOpen(false);
      }
    };
    if (ratingDropdownOpen) window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [ratingDropdownOpen]);

  return (
    <section ref={sectionRef} className="py-16 md:py-20 border-t border-foreground/5 bg-foreground/[0.01] scroll-mt-[96px]">
      <div className="max-w-[1760px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Summary */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "28px", fontWeight: 600 }}>
              Avaliações de Clientes
            </h2>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-foreground" style={{ fontSize: "56px", fontWeight: 700, fontFamily: "var(--font-family-figtree)" }}>
                {product.rating.toFixed(1)}
              </span>
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-[#FFB800] text-[#FFB800]" : "text-foreground/12"} fill="currentColor" />
                  ))}
                </div>
                <p className="text-foreground/45" style={{ fontSize: "14px", fontFamily: "var(--font-family-inter)" }}>
                  {product.reviews} avaliações
                </p>
              </div>
            </div>

            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const percentage = star === 5 ? 85 : star === 4 ? 12 : 1;
                return (
                  <button key={star} onClick={() => { setActiveStarFilter(activeStarFilter === star ? null : star); setReviewPage(1); }} className={`flex w-full items-center gap-3 p-1.5 rounded transition-colors cursor-pointer ${activeStarFilter === star ? 'bg-primary/10' : 'hover:bg-foreground/5'}`}>
                    <span className="text-foreground/45 min-w-[12px]" style={{ fontSize: "12px", fontWeight: 600 }}>{star}</span>
                    <div className="flex-1 h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-[#FFB800]"
                      />
                    </div>
                    <span className="text-foreground/30 min-w-[32px] text-right" style={{ fontSize: "12px" }}>{percentage}%</span>
                  </button>
                );
              })}
            </div>

            <button onClick={() => setReviewModalOpen(true)} className="w-full mt-10 py-3.5 border border-foreground/10 hover:border-foreground/25 text-foreground transition-all font-semibold cursor-pointer" style={{ borderRadius: "var(--radius-button)", fontSize: "14px" }}>
              Escrever uma avaliação
            </button>
          </div>

          {/* List */}
          <div className="flex-1">
            <div className="mb-8 pb-5 border-b border-foreground/5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
                  {filters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => {
                        setActiveFilter(filter.key);
                        setReviewPage(1);
                      }}
                      className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                        activeFilter === filter.key
                          ? "bg-foreground text-background"
                          : "bg-foreground/5 text-foreground/45 hover:text-foreground hover:bg-foreground/10"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div ref={ratingDropdownRef} className="relative ml-auto">
                  <button
                    onClick={() => setRatingDropdownOpen((v) => !v)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      activeStarFilter
                        ? "bg-primary/15 text-primary border border-primary/35"
                        : "bg-foreground/5 text-foreground/65 hover:text-foreground hover:bg-foreground/10 border border-transparent"
                    }`}
                    aria-haspopup="listbox"
                    aria-expanded={ratingDropdownOpen}
                  >
                    {activeStarFilter ? (
                      <span className="inline-flex items-center gap-1">
                        <Star size={12} className="fill-current" /> {activeStarFilter} estrelas
                      </span>
                    ) : (
                      "Qualificação"
                    )}
                    <ChevronDown size={13} className={`transition-transform ${ratingDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {ratingDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full z-30 mt-2 min-w-[180px] overflow-hidden rounded-[12px] border border-white/10 shadow-2xl"
                        style={{ background: "#1f1c1c" }}
                        role="listbox"
                      >
                        <button
                          onClick={() => { setActiveStarFilter(null); setReviewPage(1); setRatingDropdownOpen(false); }}
                          className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition-colors ${
                            activeStarFilter === null ? "bg-primary/15 text-primary" : "text-white/75 hover:bg-white/[0.06] hover:text-white"
                          }`}
                        >
                          Todas
                          {activeStarFilter === null && <Check size={13} />}
                        </button>
                        {[5, 4, 3, 2, 1].map((star) => (
                          <button
                            key={star}
                            onClick={() => { setActiveStarFilter(activeStarFilter === star ? null : star); setReviewPage(1); setRatingDropdownOpen(false); }}
                            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition-colors ${
                              activeStarFilter === star ? "bg-primary/15 text-primary" : "text-white/75 hover:bg-white/[0.06] hover:text-white"
                            }`}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <Star size={12} className="fill-[#FFB800] text-[#FFB800]" />
                              {star} {star === 1 ? "estrela" : "estrelas"}
                            </span>
                            {activeStarFilter === star && <Check size={13} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {customerPhotos.map((photo) => (
                  <button
                    key={`${photo.review.id}-${photo.imageIndex}`}
                    onClick={() => openMedia(photo.reviewIndex, photo.imageIndex)}
                    className="group relative h-20 w-20 flex-shrink-0 overflow-hidden border border-foreground/8 bg-foreground/5 cursor-pointer"
                    style={{ borderRadius: "8px" }}
                    aria-label={`Abrir foto da avaliação de ${photo.review.user}`}
                  >
                    <img
                      src={photo.image}
                      alt={`Foto enviada por ${photo.review.user}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-10 divide-y divide-foreground/[0.03]">
              {visibleReviews.map((rev) => {
                const reviewIndex = reviews.findIndex((item) => item.id === rev.id);
                return (
                <div key={rev.id} className="pt-10 first:pt-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center font-bold text-foreground/40">
                        {rev.user.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-foreground font-semibold" style={{ fontSize: "14px" }}>{rev.user}</span>
                          {rev.verified && <Check size={12} className="text-green-500" strokeWidth={3} />}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={11} className={i < rev.rating ? "fill-[#FFB800] text-[#FFB800]" : "text-foreground/12"} fill="currentColor" />
                            ))}
                          </div>
                          <span className="text-foreground/25" style={{ fontSize: "11px" }}>{rev.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-foreground/75 leading-relaxed mb-4" style={{ fontSize: "15px", fontFamily: "var(--font-family-inter)" }}>
                    {rev.comment}
                  </p>

                  {rev.images && (
                    <div className="flex gap-2 mb-4">
                      {rev.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => openMedia(reviewIndex, i)}
                          className="w-20 h-20 rounded-lg overflow-hidden border border-foreground/5 cursor-pointer"
                          aria-label={`Abrir foto ${i + 1} da avaliação de ${rev.user}`}
                        >
                          <img src={img} alt={`Foto da avaliação de ${rev.user}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  <button className="flex items-center gap-2 text-foreground/30 hover:text-foreground transition-colors" style={{ fontSize: "12px" }}>
                    Útil? ({rev.likes})
                  </button>
                </div>
              )})}
            </div>

            {filteredReviews.length > reviewsPerPage && (
              <div className="mt-12 flex items-center justify-between gap-4">
                <span className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                  Página {reviewPage} de {totalReviewPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToReviewPage(Math.max(1, reviewPage - 1))}
                    disabled={reviewPage === 1}
                    className="h-9 px-4 border border-foreground/10 text-foreground/55 transition-colors hover:border-foreground/25 hover:text-foreground disabled:opacity-30 disabled:hover:border-foreground/10 disabled:hover:text-foreground/55 cursor-pointer disabled:cursor-not-allowed"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 700 }}
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalReviewPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToReviewPage(page)}
                      className={`h-9 w-9 transition-colors cursor-pointer ${
                        page === reviewPage
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground/5 text-foreground/45 hover:bg-foreground/10 hover:text-foreground"
                      }`}
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 800 }}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => goToReviewPage(Math.min(totalReviewPages, reviewPage + 1))}
                    disabled={reviewPage === totalReviewPages}
                    className="h-9 px-4 border border-foreground/10 text-foreground/55 transition-colors hover:border-foreground/25 hover:text-foreground disabled:opacity-30 disabled:hover:border-foreground/10 disabled:hover:text-foreground/55 cursor-pointer disabled:cursor-not-allowed"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 700 }}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedMedia && selectedReview && selectedImage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedMedia(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-4 z-50 mx-auto flex max-w-[980px] items-center justify-center pointer-events-none md:inset-8"
            >
              <div
                className="grid w-full max-h-[88vh] overflow-hidden border border-white/10 shadow-2xl pointer-events-auto md:grid-cols-[minmax(0,1.2fr)_360px]"
                style={{
                  borderRadius: "18px",
                  background: isDark ? "rgba(16,16,17,0.98)" : "rgba(255,255,255,0.98)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative min-h-[320px] bg-black md:min-h-[560px]">
                  <img src={selectedImage} alt={`Foto enviada por ${selectedReview.user}`} className="h-full w-full object-contain" />
                  {(selectedReview.images?.length ?? 0) > 1 && (
                    <>
                      <button
                        onClick={() => moveMedia(-1)}
                        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/55"
                        aria-label="Foto anterior desta avaliação"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => moveMedia(1)}
                        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/55"
                        aria-label="Próxima foto desta avaliação"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                </div>

                <aside className="flex max-h-[88vh] flex-col p-5 md:p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-foreground font-semibold" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>
                        {selectedReview.user}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < selectedReview.rating ? "fill-[#FFB800] text-[#FFB800]" : "text-foreground/12"} />
                          ))}
                        </div>
                        <span className="text-foreground/30" style={{ fontSize: "11px" }}>{selectedReview.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMedia(null)}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-foreground/45 transition-colors hover:bg-foreground/8 hover:text-foreground"
                      aria-label="Fechar foto"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p className="text-foreground/70 leading-relaxed" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", lineHeight: 1.7 }}>
                    {selectedReview.comment}
                  </p>

                  <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {selectedReview.images?.map((image, index) => (
                      <button
                        key={image}
                        onClick={() => setSelectedMedia({ reviewIndex: selectedMedia.reviewIndex, imageIndex: index })}
                        className={`h-14 w-14 flex-shrink-0 overflow-hidden border transition-all ${
                          index === selectedMedia.imageIndex ? "border-primary opacity-100" : "border-foreground/10 opacity-45 hover:opacity-80"
                        }`}
                        style={{ borderRadius: "7px" }}
                      >
                        <img src={image} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </aside>
              </div>
            </motion.div>
            {mediaReviews.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[55] pointer-events-none"
              >
                <button
                  onClick={() => moveReview(-1)}
                  className="pointer-events-auto absolute left-5 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-2xl transition-transform hover:scale-105 hover:bg-white md:left-[7vw] cursor-pointer"
                  aria-label="Avaliação anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => moveReview(1)}
                  className="pointer-events-auto absolute right-5 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-2xl transition-transform hover:scale-105 hover:bg-white md:right-[7vw] cursor-pointer"
                  aria-label="Próxima avaliação"
                >
                  <ChevronRight size={24} />
                </button>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setReviewModalOpen(false)}
            />
            <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none p-4">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.96 }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="pointer-events-auto w-full max-w-[500px] bg-background border border-foreground/10 shadow-2xl p-6"
                style={{ borderRadius: "20px" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: 600 }}>
                    Escrever Avaliação
                  </h3>
                  <button
                    onClick={() => setReviewModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/8 text-foreground/45 hover:text-foreground transition-all cursor-pointer"
                  >
                    <X size={16} strokeWidth={1.8} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-foreground/70 mb-2" style={{ fontSize: "14px", fontWeight: 500 }}>Nota</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star size={28} className={star <= newReviewRating ? "fill-[#FFB800] text-[#FFB800]" : "text-foreground/20"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-foreground/70 mb-2" style={{ fontSize: "14px", fontWeight: 500 }}>Seu comentário</label>
                    <textarea
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Conte-nos o que achou do produto..."
                      className="w-full h-32 border border-foreground/12 bg-transparent text-foreground placeholder-foreground/30 p-3 focus:border-primary/50 focus:outline-none transition-colors resize-none"
                      style={{ borderRadius: "8px", fontSize: "14px" }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (newReviewRating === 0) {
                        toast.error("Por favor, selecione uma nota.");
                        return;
                      }
                      if (!newReviewText.trim()) {
                        toast.error("Por favor, escreva um comentário.");
                        return;
                      }
                      toast.success("Avaliação enviada com sucesso!");
                      setReviewModalOpen(false);
                      setNewReviewRating(0);
                      setNewReviewText("");
                    }}
                    className="w-full mt-4 py-3 bg-primary text-primary-foreground font-semibold transition-all hover:bg-primary/90 cursor-pointer"
                    style={{ borderRadius: "var(--radius-button)", fontSize: "14px" }}
                  >
                    Enviar Avaliação
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   STANDARD PRODUCT DESCRIPTION
   ═══════════════════════════════════════════════════════ */

function ProductStandardDescription({ product, images }: { product: any; images: string[] }) {
  const primaryImage = images[0] ?? getPrimaryProductImage(product);
  const secondaryImage = images[1] ?? primaryImage;
  const tertiaryImage = images[2] ?? secondaryImage;
  const specs = product.specs?.length
    ? product.specs
    : [
        { label: "Categoria", value: product.category },
        { label: "Modelo", value: product.sku ? String(product.sku) : product.name },
        { label: "Marca", value: product.brand ?? "PCYES" },
      ];

  const lead = product.description?.split("\n").find((item: string) => item.trim()) ??
    `${product.name} foi desenvolvido para entregar desempenho, acabamento e confiabilidade no uso diário.`;

  const productImageBg = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
  } as const;

  return (
    <section className="pb-20 border-t border-foreground/5">
      <div className="mx-auto mt-10 max-w-[1120px]">
        <div
          className="overflow-hidden shadow-[0_22px_70px_rgba(0,0,0,0.24)]"
          style={{
            borderRadius: "30px",
            background: "linear-gradient(180deg, #161617 0%, #131314 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <section className="px-6 py-10 text-center md:px-10 md:py-14">
            <p className="mb-4 text-primary tracking-[0.24em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 800 }}>
              // {product.category}
            </p>
            <h2 className="mx-auto max-w-[820px] text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(30px, 5vw, 52px)", lineHeight: 1.02, fontWeight: 700, letterSpacing: "-0.04em" }}>
              {product.name}
            </h2>
            <p className="mx-auto mt-5 max-w-[820px] text-foreground/65" style={{ fontFamily: "var(--font-family-inter)", fontSize: "17px", lineHeight: 1.65 }}>
              {lead}
            </p>
            <div className="relative mt-9 flex min-h-[360px] items-center justify-center overflow-hidden p-8" style={{ borderRadius: "24px", ...productImageBg }}>
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.06) 0%, transparent 55%)",
                  borderRadius: "24px",
                }}
              />
              <ImageWithFallback src={primaryImage} alt={product.name} className="relative max-h-[340px] w-full object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.32)]" />
            </div>
          </section>

          <section className="border-t border-white/5 px-6 py-10 md:px-10">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <article className="relative min-h-[540px] overflow-hidden" style={{ borderRadius: "24px", ...productImageBg }}>
                <ImageWithFallback src={secondaryImage} alt={`${product.name} em destaque`} className="absolute inset-0 h-full w-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="max-w-[420px] text-white" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.08, fontWeight: 700, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                    Construção pensada para performance
                  </h3>
                  <p className="mt-3 max-w-[520px] text-white/85" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", lineHeight: 1.65, textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
                    Produto pensado para setups exigentes, com materiais selecionados, visual limpo e desempenho consistente.
                  </p>
                </div>
              </article>

              <div className="grid gap-6">
                <article className="relative min-h-[260px] overflow-hidden" style={{ borderRadius: "24px", ...productImageBg }}>
                  <div className="relative z-10 max-w-[58%] p-7">
                    <h3 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "25px", lineHeight: 1.1, fontWeight: 700 }}>
                      Design para o dia a dia
                    </h3>
                    <p className="mt-3 text-foreground/68" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", lineHeight: 1.6 }}>
                      Visual moderno, presença equilibrada e experiência consistente para trabalho, estudo ou gameplay.
                    </p>
                  </div>
                  <ImageWithFallback src={tertiaryImage} alt={`${product.name} detalhe`} className="absolute inset-y-0 right-0 h-full w-[52%] object-contain p-6" />
                  <div className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-[#161617] via-[#161617]/55 to-transparent pointer-events-none" />
                </article>

                <article className="relative min-h-[260px] overflow-hidden" style={{ borderRadius: "24px", ...productImageBg }}>
                  <div className="relative z-10 max-w-[58%] p-7">
                    <h3 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "25px", lineHeight: 1.1, fontWeight: 700 }}>
                      Pronto para acompanhar seu ritmo
                    </h3>
                    <p className="mt-3 text-foreground/68" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", lineHeight: 1.6 }}>
                      Recursos essenciais reunidos em um produto confiável, bonito e fácil de integrar ao seu setup.
                    </p>
                  </div>
                  <ImageWithFallback src={primaryImage} alt={`${product.name} em uso`} className="absolute inset-y-0 right-0 h-full w-[52%] object-contain p-6" />
                  <div className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-[#161617] via-[#161617]/55 to-transparent pointer-events-none" />
                </article>
              </div>
            </div>
          </section>

          <section className="border-t border-white/5 px-6 py-10 md:px-10">
            <div className="grid gap-7 md:grid-cols-2">
              {[primaryImage, secondaryImage].map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-[16/10] overflow-hidden" style={{ borderRadius: "22px", ...productImageBg }}>
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.06) 0%, transparent 55%)",
                      borderRadius: "22px",
                    }}
                  />
                  <ImageWithFallback src={image} alt={`${product.name} galeria ${index + 1}`} className="relative h-full w-full object-contain p-6" />
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-white/5 px-6 py-10 md:px-10">
            <article className="relative overflow-hidden" style={{ borderRadius: "24px", ...productImageBg }}>
              <div className="relative z-10 w-full p-7 md:w-[62%] md:p-9">
                <p className="mb-4 text-primary tracking-[0.22em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: 800 }}>
                  // RAIO-X DO PRODUTO
                </p>
                <h3 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px, 4vw, 38px)", lineHeight: 1.08, fontWeight: 700 }}>
                  Especificações técnicas
                </h3>
                <dl className="mt-6 grid gap-3">
                  {specs.slice(0, 8).map((spec: { label: string; value: string }) => (
                    <div key={spec.label} className="grid gap-2 border-b border-white/8 pb-3 sm:grid-cols-[170px_1fr]">
                      <dt className="text-foreground/48 tracking-[0.12em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 800 }}>
                        {spec.label}
                      </dt>
                      <dd className="text-foreground/85" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: 600 }}>
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <ImageWithFallback src={tertiaryImage} alt={`${product.name} especificações`} className="absolute inset-y-0 right-0 hidden h-full w-[40%] object-contain p-6 md:block" />
              <div className="absolute inset-y-0 left-0 w-[70%] bg-gradient-to-r from-[#161617] via-[#161617]/60 to-transparent pointer-events-none" />
            </article>
          </section>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = allProducts.find((p) => p.id === Number(id));
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showMobileStickyCta, setShowMobileStickyCta] = useState(false);

  const relatedRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const mobileShippingRef = useRef<HTMLDivElement>(null);
  const relatedInView = useInView(relatedRef, { once: true, amount: 0.1 });

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToDescription = () => {
    descriptionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const updateStickyCta = () => {
      const shippingEl = mobileShippingRef.current;
      if (!shippingEl || window.innerWidth >= 1024) {
        setShowMobileStickyCta(false);
        return;
      }

      setShowMobileStickyCta(shippingEl.getBoundingClientRect().top < window.innerHeight - 180);
    };

    updateStickyCta();
    window.addEventListener("scroll", updateStickyCta, { passive: true });
    window.addEventListener("resize", updateStickyCta);
    return () => {
      window.removeEventListener("scroll", updateStickyCta);
      window.removeEventListener("resize", updateStickyCta);
    };
  }, [product?.id]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p
          className="text-foreground/30"
          style={{ fontFamily: "var(--font-family-figtree)", fontSize: "24px", fontWeight: "var(--font-weight-light)" }}
        >
          Produto não encontrado
        </p>
        <Link
          to="/produtos"
          className="px-6 py-3 border border-foreground/15 text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all duration-300"
          style={{
            borderRadius: "var(--radius-button)",
            fontFamily: "var(--font-family-inter)",
            fontSize: "13px",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          Ver todos os produtos
        </Link>
      </div>
    );
  }

  const productSubcategory = getProductSubcategory(product);
  const galleryImages = getProductImages(product);
  const visibleProducts = getVisibleCatalogProducts(allProducts);
  const swatches = getProductSwatches(product);

  const related = visibleProducts
    .filter((p) => p.category === product.category && getProductSubcategory(p) === productSubcategory && p.id !== product.id)
    .slice(0, 8);
  if (related.length < 8) {
    const extras = visibleProducts
      .filter((p) => p.category === product.category && p.id !== product.id && !related.find((r) => r.id === p.id))
      .slice(0, 8 - related.length);
    related.push(...extras);
  }

  const discount = product.oldPriceNum && product.oldPriceNum > product.priceNum
    ? Math.round(((product.oldPriceNum - product.priceNum) / product.oldPriceNum) * 100)
    : 0;

  const pixPrice = product.priceNum * 0.9;
  const installment = product.priceNum / 12;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: getPrimaryProductImage(product),
      });
    }
    setAddedToCart(true);
    toast.success(`${product.name.split(" ").slice(0, 4).join(" ")}…`, {
      description: `${qty}× adicionado ao carrinho`,
      duration: 2500,
    });
    setTimeout(() => setAddedToCart(false), 2200);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: getPrimaryProductImage(product),
      });
    }
    navigate("/checkout");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
      return;
    }
    navigator.clipboard.writeText(window.location.href).then(() => toast.success("Link copiado!"));
  };

  const liked = isFavorite(product.id);

  return (
    <div className="pt-[70px] lg:pt-[180px]">
      {/* Breadcrumb */}
      <div className="px-5 md:px-8 pt-1 pb-0 lg:pt-6 lg:pb-2">
        <div className="max-w-[1760px] mx-auto hidden lg:flex items-center gap-1.5 flex-wrap">
          {[
            { label: "Home", to: "/" },
            { label: product.category, to: getCatalogHref({ category: product.category }) },
            { label: productSubcategory, to: getCatalogHref({ category: product.category, subcategory: productSubcategory }) },
          ].map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-foreground/15" style={{ fontSize: "10px" }}>›</span>}
              <Link
                to={crumb.to}
                className="text-foreground/35 hover:text-foreground/65 transition-colors"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
              >
                {crumb.label}
              </Link>
            </span>
          ))}
          <span className="text-foreground/15" style={{ fontSize: "10px" }}>›</span>
          <span
            className="text-foreground/55 truncate max-w-[260px]"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
          >
            {product.name}
          </span>
        </div>
      </div>

      {/* Main PDP */}
      <div className="px-5 md:px-8 pt-2 pb-24 lg:pt-6">
        <div className="max-w-[1760px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] items-start gap-8 xl:gap-10">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <div className="flex flex-col lg:flex-row items-start gap-8 xl:gap-10">

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 w-full lg:order-none lg:w-[50%] xl:w-[52%] flex-shrink-0"
          >
            <ProductGallery images={galleryImages} name={product.name} isDark={isDark} />
          </motion.div>

          {swatches.length > 1 && (
            <div className="order-3 lg:hidden w-full">
              <p
                className="text-foreground/55 mb-2.5 font-semibold tracking-wide"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.1em" }}
              >
                COR · <span className="text-foreground/40 font-medium tracking-normal normal-case">
                  {swatches.find((s) => s.productId === product.id)?.label}
                </span>
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {swatches.map((sw) => (
                  <button
                    key={sw.productId}
                    title={sw.label}
                    onClick={() => navigate(`/produto/${sw.productId}`)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      sw.productId === product.id
                        ? "border-primary ring-2 ring-primary/25 ring-offset-2 ring-offset-background scale-105"
                        : "border-foreground/15"
                    }`}
                    style={{ backgroundColor: sw.color }}
                    aria-label={sw.label}
                  />
                ))}
              </div>
            </div>
          )}

          <MobilePurchaseFlow
            product={product}
            qty={qty}
            setQty={setQty}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAdd}
            addedToCart={addedToCart}
            pixPrice={pixPrice}
            installment={installment}
            discount={discount}
            onSeeDescription={scrollToDescription}
            shippingRef={mobileShippingRef}
          />

          {/* Middle column: title, rating, share/like, description */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="order-1 w-full lg:order-none lg:flex-1 min-w-0"
          >
            {/* Brand + badges row */}
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {product.brand && (
                  <span
                    className="text-foreground/45 font-semibold tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "10.5px", letterSpacing: "0.14em" }}
                  >
                    {product.brand}
                  </span>
                )}
                {product.brand && product.badge && <span className="text-foreground/15">·</span>}
                {product.badge && (
                  <span
                    className="px-2 py-0.5 bg-primary/12 text-primary font-bold"
                    style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "10.5px" }}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Like + Share */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
                    liked
                      ? "bg-red-500/10 text-red-500"
                      : "text-foreground/35 hover:text-foreground/70 hover:bg-foreground/5"
                  }`}
                  aria-label={liked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  <Heart size={15} className={liked ? "fill-red-500" : ""} strokeWidth={1.7} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-foreground/35 hover:text-foreground/70 hover:bg-foreground/5 transition-all duration-300 cursor-pointer"
                  aria-label="Compartilhar"
                >
                  <Share2 size={15} strokeWidth={1.7} />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1
              className="text-foreground mb-4 leading-[1.12]"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(22px, 2.6vw, 32px)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2.5 mb-6 flex-wrap">
              <div
                className="flex items-center gap-0.5 cursor-pointer group"
                onClick={scrollToReviews}
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(product.rating) ? "fill-[#FFB800] text-[#FFB800]" : "text-foreground/12"}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span
                className="text-foreground/70 font-semibold tabular-nums cursor-pointer hover:text-[#FFB800] transition-colors"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                onClick={scrollToReviews}
              >
                {product.rating.toFixed(1)}
              </span>
              <span className="text-foreground/15">·</span>
              <span
                className="text-foreground/45 hover:text-foreground/65 cursor-pointer transition-colors"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px" }}
                onClick={scrollToReviews}
              >
                {product.reviews} avaliações
              </span>
              {product.sku && (
                <>
                  <span className="text-foreground/15">·</span>
                  <span
                    className="text-foreground/30"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "11.5px" }}
                  >
                    SKU {product.sku}
                  </span>
                </>
              )}
            </div>

            {/* Color swatches */}
            {swatches.length > 1 && (
              <div className="hidden lg:block mb-6">
                <p
                  className="text-foreground/55 mb-2.5 font-semibold tracking-wide"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.1em" }}
                >
                  COR · <span className="text-foreground/40 font-medium tracking-normal normal-case">
                    {swatches.find((s) => s.productId === product.id)?.label}
                  </span>
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {swatches.map((sw) => (
                    <button
                      key={sw.productId}
                      title={sw.label}
                      onClick={() => navigate(`/produto/${sw.productId}`)}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                        sw.productId === product.id
                          ? "border-primary ring-2 ring-primary/25 ring-offset-2 ring-offset-background scale-105"
                          : "border-foreground/15 hover:border-foreground/35"
                      }`}
                      style={{ backgroundColor: sw.color }}
                      aria-label={sw.label}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="h-px bg-foreground/6 mb-6" />

            {/* About / bullets */}
            <div className="hidden lg:block">
              <AboutProduct product={product} onSeeDescription={scrollToDescription} />
            </div>
          </motion.div>
            </div>
          </div>

            {/* Purchase card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="hidden w-full lg:col-start-2 lg:row-start-1 lg:block lg:sticky lg:top-[150px] lg:self-start"
            >
              <StickyPriceCard
                product={product}
                qty={qty}
                setQty={setQty}
                onBuyNow={handleBuyNow}
                onAddToCart={handleAdd}
                addedToCart={addedToCart}
                pixPrice={pixPrice}
                installment={installment}
                discount={discount}
              />
            </motion.div>

          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <div ref={descriptionRef} className="scroll-mt-[96px]">
              <ProductStandardDescription product={product} images={galleryImages} />
            </div>

      {/* Reviews Section */}
      <div ref={reviewsRef}>
        <ReviewsSection product={product} isDark={isDark} />
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div ref={relatedRef} className="py-20 border-t border-foreground/5">
          <div className="max-w-[1760px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={relatedInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-end justify-between mb-10"
            >
              <div>
                <p
                  className="mb-3 text-primary"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.3em" }}
                >
                  // VOCÊ TAMBÉM VAI GOSTAR
                </p>
                <h2
                  className="text-foreground"
                  style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px, 3vw, 36px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em" }}
                >
                  Produtos Relacionados
                </h2>
              </div>
              <Link
                to={getCatalogHref({ category: product.category, subcategory: productSubcategory })}
                className="hidden md:flex items-center gap-2 text-foreground/30 hover:text-foreground/60 transition-colors duration-300"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
              >
                Ver todos <ArrowUpRight size={14} />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((rProduct, i) => {
                const rDiscount = rProduct.oldPriceNum && rProduct.oldPriceNum > rProduct.priceNum
                  ? Math.round(((rProduct.oldPriceNum - rProduct.priceNum) / rProduct.oldPriceNum) * 100)
                  : 0;
                const rInstallment = `R$ ${(rProduct.priceNum / 10).toFixed(2).replace(".", ",")}`;
                return (
                  <motion.div
                    key={rProduct.id}
                    initial={{ opacity: 0, y: 28 }}
                    animate={relatedInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="group cursor-pointer"
                    onClick={() => { navigate(`/produto/${rProduct.id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  >
                    <div
                      className="relative overflow-hidden aspect-[5/6] mb-4 transition-all duration-300"
                      style={{
                        borderRadius: "20px",
                        background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.06) 0%, transparent 55%)",
                          borderRadius: "20px",
                        }}
                      />
                      <ImageWithFallback
                        src={getPrimaryProductImage(rProduct)}
                        alt={rProduct.name}
                        className="absolute inset-0 h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                      {rDiscount > 0 && (
                        <span
                          className="absolute z-20 rounded-full px-2.5 py-1 text-white"
                          style={{
                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            top: "12px",
                            left: "12px",
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            boxShadow: "0 6px 18px -4px rgba(16, 185, 129, 0.55)",
                          }}
                        >
                          -{rDiscount}%
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem({ id: rProduct.id, name: rProduct.name, price: rProduct.price, image: getPrimaryProductImage(rProduct) }); toast.success("Adicionado!"); }}
                        className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 translate-y-2 whitespace-nowrap rounded-full px-10 py-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
                        style={{
                          background: "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
                          color: "white",
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "13px",
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          boxShadow: "0 10px 26px -6px rgba(225,6,0,0.6)",
                        }}
                      >
                        <span className="inline-flex items-center gap-2"><ShoppingBag size={14} strokeWidth={2} /> Comprar</span>
                      </button>
                    </div>

                    <div className="px-1">
                      <h3 className="line-clamp-1 text-white" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "15px", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.01em" }}>
                        {rProduct.name}
                      </h3>
                      <div className="mt-3">
                        {rProduct.oldPrice && (
                          <p className="line-through leading-none mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "rgba(255,255,255,0.38)" }}>
                            {rProduct.oldPrice}
                          </p>
                        )}
                        <div className="flex items-baseline gap-2">
                          <p className="text-white leading-none" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: 700, letterSpacing: "-0.015em" }}>
                            {rProduct.price}
                          </p>
                          {rDiscount > 0 && (
                            <span className="inline-flex items-center rounded-md px-1.5 py-0.5 leading-none" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 800, color: "#0a0a0a", background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)", boxShadow: "0 4px 14px -4px rgba(16,185,129,0.6)", letterSpacing: "-0.01em" }}>
                              -{rDiscount}%
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 leading-tight" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>
                          No PIX ou 10x de {rInstallment}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden transition-all duration-300 ${
        showMobileStickyCta ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}>
        <div
          className="px-4 py-3 flex items-center gap-3 border-t border-foreground/10"
          style={{ background: isDark ? "rgba(16,16,17,0.95)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)" }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-foreground/45 text-xs truncate" style={{ fontFamily: "var(--font-family-inter)" }}>
              {product.name.split(" ").slice(0, 5).join(" ")}…
            </p>
            <p className="text-foreground font-bold" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px" }}>
              {formatBRL(pixPrice)} <span className="text-[#4CAF50] text-xs font-normal">no PIX</span>
            </p>
          </div>
          <button
            onClick={handleBuyNow}
            disabled={product.inStock === false}
            className="px-5 py-3 flex items-center gap-2 font-semibold transition-all cursor-pointer disabled:opacity-40 bg-[#4CAF50] text-white"
            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", whiteSpace: "nowrap" }}
          >
            <Zap size={14} fill="currentColor" />
            Comprar
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
