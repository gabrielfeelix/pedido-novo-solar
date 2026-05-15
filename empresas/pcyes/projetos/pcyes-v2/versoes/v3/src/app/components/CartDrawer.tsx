import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { X, Minus, Plus, ShoppingBag, Trash2, Truck, Tag, Loader2, Check, MapPin, ChevronDown, Gift, Sparkles } from "lucide-react";
import { useCart } from "./CartContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts } from "./productsData";
import { getPrimaryProductImage, getVisibleCatalogProducts } from "./productPresentation";

const MOCK_SHIPPING: Record<string, { name: string; price: number; days: string }[]> = {
  default: [
    { name: "PAC", price: 18.9, days: "8-12 dias úteis" },
    { name: "SEDEX", price: 32.5, days: "3-5 dias úteis" },
  ],
  free: [
    { name: "Frete Grátis (PAC)", price: 0, days: "8-12 dias úteis" },
    { name: "SEDEX", price: 24.9, days: "3-5 dias úteis" },
  ],
};

const COUPONS: Record<string, number> = {
  PCYES10: 10, PROMO20: 20, BEMVINDO: 15,
};

const GIFT_THRESHOLD = 950;

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, lastAdded, setGiftItem } = useCart();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const navigate = useNavigate();

  const [shippingOpen, setShippingOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [giftDismissed, setGiftDismissed] = useState(false);
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null);

  const [cep, setCep] = useState("");
  const [shippingOptions, setShippingOptions] = useState<typeof MOCK_SHIPPING.default | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<number | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const parsePrice = (p: string) => parseFloat(p.replace("R$ ", "").replace(".", "").replace(",", "."));
  const formatPrice = (n: number) => `R$ ${n.toFixed(2).replace(".", ",")}`;

  const paidItems = items.filter((item) => !item.isGift);
  const giftItem = items.find((item) => item.isGift) ?? null;
  const subtotal = paidItems.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0);
  const discountPct = appliedCoupon ? COUPONS[appliedCoupon] || 0 : 0;
  const discountValue = subtotal * (discountPct / 100);
  const shippingCost = selectedShipping !== null && shippingOptions ? shippingOptions[selectedShipping].price : 0;
  const total = subtotal - discountValue + shippingCost;
  const giftUnlocked = subtotal >= GIFT_THRESHOLD;
  const giftProgress = Math.min(100, (subtotal / GIFT_THRESHOLD) * 100);
  const remainingForGift = Math.max(0, GIFT_THRESHOLD - subtotal);

  const giftOptions = useMemo(
    () => {
      const uniqueCategories = new Set<string>();
      return getVisibleCatalogProducts(allProducts)
        .sort((a, b) => a.priceNum - b.priceNum)
        .filter((product) => {
          if (uniqueCategories.has(product.category)) return false;
          uniqueCategories.add(product.category);
          return true;
        })
        .slice(0, 3);
    },
    [],
  );

  useEffect(() => {
    if (!giftUnlocked && giftItem) {
      setGiftItem(null);
      setGiftModalOpen(false);
      setGiftDismissed(false);
      return;
    }

    if (!giftUnlocked) {
      setGiftDismissed(false);
      setGiftModalOpen(false);
      return;
    }

    if (giftUnlocked && !giftItem && !giftDismissed && paidItems.length > 0) {
      setGiftModalOpen(true);
    }
  }, [giftDismissed, giftItem, giftUnlocked, paidItems.length, setGiftItem]);

  const handleCepSearch = () => {
    if (cep.replace(/\D/g, "").length < 8) return;
    setLoadingCep(true);
    setSelectedShipping(null);
    setTimeout(() => {
      setShippingOptions(subtotal >= 299 ? MOCK_SHIPPING.free : MOCK_SHIPPING.default);
      setLoadingCep(false);
    }, 1200);
  };

  const handleApplyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    if (COUPONS[c]) { setAppliedCoupon(c); setCouponError(""); }
    else { setCouponError("Cupom inválido"); setAppliedCoupon(null); }
  };

  const formatCep = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
  };

  const confirmGift = () => {
    const product = giftOptions.find((item) => item.id === selectedGiftId);
    if (!product) return;

    setGiftItem({
      id: product.id,
      name: product.name,
      price: "R$ 0,00",
      image: getPrimaryProductImage(product),
      isGift: true,
      originalPrice: product.price,
    });
    setGiftModalOpen(false);
    setSelectedGiftId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[61] flex w-full max-w-[460px] flex-col overflow-hidden"
            style={{
              background: isDark ? "#161617" : "white",
              borderTopLeftRadius: "22px",
              borderBottomLeftRadius: "22px",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "-24px 0 60px -12px rgba(0,0,0,0.55)",
            }}
          >
            <div className="flex items-center justify-between border-b border-foreground/5 px-7 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-foreground" strokeWidth={1.5} />
                <span className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "18px", fontWeight: "var(--font-weight-medium)" }}>Carrinho</span>
                <span className="px-2 py-0.5 bg-primary text-primary-foreground" style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>{totalItems}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-9 h-9 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors rounded-full hover:bg-foreground/5 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {paidItems.length > 0 && (
              <div className="border-b border-foreground/5 px-7 py-3.5">
                <div className={`overflow-hidden rounded-[18px] border ${giftUnlocked ? "border-primary/18 bg-primary/[0.06]" : "border-foreground/8 bg-foreground/[0.03]"}`}>
                  <div className="px-4 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.08] text-primary">
                          <Gift size={15} />
                        </div>
                        <div>
                          <p className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "15px", fontWeight: "600", lineHeight: 1.2 }}>
                            Ganhe um brinde a partir de {formatPrice(GIFT_THRESHOLD)}
                          </p>
                          <p className="mt-1 text-foreground/42" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", lineHeight: 1.45 }}>
                            {giftUnlocked
                              ? giftItem
                                ? "Seu brinde já foi selecionado e adicionado ao carrinho."
                                : "Você desbloqueou o presente. Escolha um item especial da PCYES."
                              : `Faltam ${formatPrice(remainingForGift)} para desbloquear seu presente.`}
                          </p>
                        </div>
                      </div>
                      {giftUnlocked && (
                        <button
                          onClick={() => { setGiftDismissed(false); setGiftModalOpen(true); }}
                          className="text-primary hover:opacity-80 transition-opacity cursor-pointer"
                          style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em" }}
                        >
                          {giftItem ? "TROCAR" : "ESCOLHER"}
                        </button>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="h-1.5 overflow-hidden rounded-full bg-foreground/6">
                        <motion.div
                          initial={false}
                          animate={{ width: `${giftProgress}%` }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full bg-linear-to-r from-primary to-primary/65"
                        />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "600", letterSpacing: "0.12em" }}>
                          0
                        </span>
                        <span className={`flex items-center gap-1.5 ${giftUnlocked ? "text-primary" : "text-foreground/35"}`} style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em" }}>
                          <Sparkles size={11} />
                          BRINDE
                        </span>
                        <span className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "600", letterSpacing: "0.12em" }}>
                          {formatPrice(GIFT_THRESHOLD)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-7 py-5" style={{ scrollbarWidth: "none" }}>
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
                    <ShoppingBag size={28} className="text-foreground/20" strokeWidth={1} />
                  </div>
                  <p className="text-foreground/60 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "17px", fontWeight: "var(--font-weight-medium)" }}>Carrinho vazio</p>
                  <p className="text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Adicione produtos para começar</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div key={item.cartKey} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30, height: 0 }} transition={{ duration: 0.3 }}
                        className={`flex gap-4 p-3.5 border ${lastAdded?.cartKey === item.cartKey ? "border-primary/30 bg-primary/5" : item.isGift ? "border-primary/20 bg-primary/[0.04]" : "border-foreground/5 bg-foreground/[0.02]"} transition-colors duration-700`}
                        style={{ borderRadius: "var(--radius-card)" }}
                      >
                        <div className="w-[75px] h-[75px] flex-shrink-0 overflow-hidden relative" style={{ borderRadius: "var(--radius)", background: isDark ? "#1e1e20" : "#f5f5f5" }}>
                          <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          {item.isGift && (
                            <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                              <Gift size={13} />
                            </div>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="truncate text-foreground mb-0.5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>{item.name}</p>
                              {item.isGift && (
                                <span className="rounded-full bg-primary/[0.1] px-2 py-0.5 text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: "700", letterSpacing: "0.08em" }}>
                                  BRINDE
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {item.isGift && item.originalPrice && (
                                <p className="text-foreground/20 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>{item.originalPrice}</p>
                              )}
                              <p className={item.isGift ? "text-primary" : "text-foreground/50"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: item.isGift ? "600" : "400" }}>
                                {item.price}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            {item.isGift ? (
                              <div className="flex items-center gap-2 text-primary/80">
                                <Gift size={13} />
                                <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "600", letterSpacing: "0.08em" }}>
                                  1 item gratuito
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-0 border border-foreground/10" style={{ borderRadius: "var(--radius)" }}>
                                <button onClick={() => updateQuantity(item.cartKey, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors cursor-pointer"><Minus size={12} /></button>
                                <span className="w-7 h-7 flex items-center justify-center text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.cartKey, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors cursor-pointer"><Plus size={12} /></button>
                              </div>
                            )}
                            <button onClick={() => item.isGift ? setGiftItem(null) : removeItem(item.cartKey)} className="text-foreground/20 hover:text-primary transition-colors cursor-pointer">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-foreground/5 px-7 py-5 space-y-3 max-h-[55vh] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                <div>
                  {shippingOptions && selectedShipping !== null && !shippingOpen ? (
                    <div className="flex items-center justify-between w-full py-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <Truck size={12} className="text-primary flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-foreground/75 truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 600 }}>
                            {shippingOptions[selectedShipping].name} · {shippingOptions[selectedShipping].price === 0 ? "Grátis" : formatPrice(shippingOptions[selectedShipping].price)}
                          </p>
                          <p className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10.5px" }}>
                            CEP {cep} · {shippingOptions[selectedShipping].days}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => setShippingOpen(true)}
                        className="flex-shrink-0 text-primary/85 hover:text-primary transition-colors cursor-pointer"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.02em" }}
                      >
                        Alterar
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setShippingOpen(!shippingOpen)}
                      className="flex items-center justify-between w-full py-1 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-foreground/25" />
                        <span className="text-foreground/30 group-hover:text-foreground/50 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                          Calcular frete
                        </span>
                      </div>
                      <ChevronDown size={11} className={`text-foreground/20 transition-transform duration-300 ${shippingOpen ? "rotate-180" : ""}`} />
                    </button>
                  )}
                  <AnimatePresence>
                    {shippingOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="pt-3 space-y-2">
                          <div className="flex gap-2">
                            <input type="text" placeholder="00000-000" value={cep}
                              onChange={(e) => setCep(formatCep(e.target.value))}
                              onKeyDown={(e) => e.key === "Enter" && handleCepSearch()}
                              className="flex-1 px-3 py-2 border border-foreground/8 bg-foreground/[0.03] text-foreground placeholder:text-foreground/15 focus:border-foreground/20 focus:outline-none transition-colors"
                              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px" }} />
                            <button onClick={handleCepSearch} disabled={loadingCep || cep.replace(/\D/g, "").length < 8}
                              className="px-3 py-2 text-foreground/30 hover:text-foreground/60 transition-all duration-300 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                            >{loadingCep ? <Loader2 size={13} className="animate-spin" /> : "Calcular"}</button>
                          </div>
                          <AnimatePresence>
                            {shippingOptions && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                                {shippingOptions.map((opt, idx) => (
                                  <button key={opt.name} onClick={() => { setSelectedShipping(idx); setShippingOpen(false); }}
                                    className={`w-full flex items-center justify-between px-3 py-2 border transition-all duration-300 cursor-pointer ${
                                      selectedShipping === idx ? "border-primary/30 bg-primary/5" : "border-foreground/5 hover:border-foreground/10"
                                    }`}
                                    style={{ borderRadius: "var(--radius-button)" }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Truck size={12} className={selectedShipping === idx ? "text-primary" : "text-foreground/25"} />
                                      <div className="text-left">
                                        <p className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}>{opt.name}</p>
                                        <p className="text-foreground/20" style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px" }}>{opt.days}</p>
                                      </div>
                                    </div>
                                    <span className={opt.price === 0 ? "text-green-500" : "text-foreground/40"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}>
                                      {opt.price === 0 ? "Grátis" : formatPrice(opt.price)}
                                    </span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <button onClick={() => setCouponOpen(!couponOpen)}
                    className="flex items-center justify-between w-full py-1 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <Tag size={12} className="text-foreground/25" />
                      <span className="text-foreground/30 group-hover:text-foreground/50 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                        {appliedCoupon ? `Cupom: ${appliedCoupon} (-${discountPct}%)` : "Cupom de desconto"}
                      </span>
                    </div>
                    <ChevronDown size={11} className={`text-foreground/20 transition-transform duration-300 ${couponOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {couponOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="pt-3">
                          {appliedCoupon ? (
                            <div className="flex items-center justify-between px-3 py-2 border border-green-500/20 bg-green-500/5" style={{ borderRadius: "var(--radius-button)" }}>
                              <div className="flex items-center gap-2">
                                <Check size={13} className="text-green-500" />
                                <span className="text-green-400" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-medium)" }}>{appliedCoupon}</span>
                                <span className="text-green-500/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>(-{discountPct}%)</span>
                              </div>
                              <button onClick={() => { setAppliedCoupon(null); setCoupon(""); }} className="text-foreground/30 hover:text-foreground transition-colors cursor-pointer"><X size={13} /></button>
                            </div>
                          ) : (
                            <>
                              <div className="flex gap-2">
                                <input type="text" placeholder="Ex: PCYES10" value={coupon}
                                  onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponError(""); }}
                                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                                  className="flex-1 px-3 py-2 border border-foreground/8 bg-foreground/[0.03] text-foreground placeholder:text-foreground/15 focus:border-foreground/20 focus:outline-none transition-colors"
                                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px" }} />
                                <button onClick={handleApplyCoupon} disabled={!coupon.trim()}
                                  className="px-3 py-2 text-foreground/30 hover:text-foreground/60 transition-all duration-300 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                                >Aplicar</button>
                              </div>
                              {couponError && <p className="text-primary mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>{couponError}</p>}
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-foreground/5" />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Subtotal</span>
                    <span className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{formatPrice(subtotal)}</span>
                  </div>
                  {discountValue > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>Desconto ({discountPct}%)</span>
                      <span className="text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>-{formatPrice(discountValue)}</span>
                    </div>
                  )}
                  {selectedShipping !== null && shippingOptions && (
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>Frete</span>
                      <span className={shippingCost === 0 ? "text-green-500" : "text-foreground/50"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                        {shippingCost === 0 ? "Grátis" : formatPrice(shippingCost)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Total</span>
                  <span className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: "var(--font-weight-medium)" }}>{formatPrice(total)}</span>
                </div>

                <button
                  className="w-full py-4 bg-primary text-primary-foreground hover:shadow-[0_0_40px_rgba(255,43,46,0.25)] transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
                  onClick={() => { setIsOpen(false); navigate("/checkout"); }}
                >Finalizar compra</button>
                <button onClick={() => setIsOpen(false)}
                  className="w-full py-2 text-foreground/30 hover:text-foreground/50 transition-colors cursor-pointer"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                >Continuar comprando</button>
              </div>
            )}
          </motion.div>

          <AnimatePresence>
            {giftModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 backdrop-blur-md p-0 md:items-center md:p-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 18, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-[92dvh] w-full max-w-[780px] flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-background shadow-[0_40px_120px_rgba(0,0,0,0.32)] md:h-auto md:max-h-[calc(100dvh-3rem)] md:rounded-[32px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="border-b border-foreground/5 px-5 py-5 md:px-8 md:py-7">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <div className="mb-3 flex items-center gap-2 text-primary">
                          <Gift size={16} />
                          <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.18em" }}>
                            BRINDE DESBLOQUEADO
                          </span>
                        </div>
                        <h3 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(24px, 7vw, 34px)", fontWeight: "600", lineHeight: 0.98 }}>
                          Escolha seu presente
                        </h3>
                        <p className="mt-3 max-w-[560px] text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "clamp(12px, 3.4vw, 14px)", lineHeight: 1.6 }}>
                          Você atingiu o valor de {formatPrice(GIFT_THRESHOLD)}. Selecione um produto para entrar no carrinho com selo de presente e valor zerado.
                        </p>
                      </div>
                      <button onClick={() => { setGiftModalOpen(false); setGiftDismissed(true); }} className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/8 text-foreground/35 transition-colors hover:text-foreground hover:bg-foreground/[0.04] cursor-pointer flex-shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-8 md:py-8">
                    <div className="grid gap-4 md:grid-cols-3 md:gap-5">
                    {giftOptions.map((product) => (
                      <button
                        key={`gift-option-${product.id}`}
                        onClick={() => setSelectedGiftId(product.id)}
                        aria-pressed={selectedGiftId === product.id}
                        className={`group overflow-hidden rounded-[22px] border bg-linear-to-b from-foreground/[0.03] to-transparent text-left transition-all duration-300 hover:border-primary/20 hover:shadow-[0_24px_80px_rgba(0,0,0,0.18)] cursor-pointer ${
                          selectedGiftId === product.id ? "border-primary/55 shadow-[0_24px_90px_rgba(255,43,46,0.18)] ring-2 ring-primary/25" : "border-foreground/8"
                        }`}
                      >
                        <div className="relative h-[150px] overflow-hidden border-b border-foreground/6 bg-radial-[circle_at_top] from-primary/10 via-transparent to-transparent md:h-[210px]">
                          <ImageWithFallback src={getPrimaryProductImage(product)} alt={product.name} className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04] md:p-6" />
                          <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:left-4 md:top-4 md:h-9 md:w-9">
                            <Gift size={14} />
                          </div>
                          {selectedGiftId === product.id && (
                            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:right-4 md:top-4 md:h-9 md:w-9">
                              <Check size={15} />
                            </div>
                          )}
                        </div>
                        <div className="px-4 py-4 md:px-5 md:py-5">
                          <p className="line-clamp-2 text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(17px, 5vw, 21px)", fontWeight: "600", lineHeight: 1.05 }}>
                            {product.name}
                          </p>
                          <div className="mt-3 flex items-end gap-2 md:mt-4">
                            <span className="text-foreground/20 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                              {product.price}
                            </span>
                            <span className="text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "clamp(18px, 5vw, 22px)", fontWeight: "700" }}>
                              R$ 0,00
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between md:mt-4">
                            <span className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: "700", letterSpacing: "0.14em" }}>
                              PRESENTE PCYES
                            </span>
                            <span className={selectedGiftId === product.id ? "text-primary" : "text-foreground/35"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em" }}>
                              {selectedGiftId === product.id ? "SELECIONADO" : "SELECIONAR"}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-foreground/5 px-5 py-4 md:px-8 md:py-5">
                    <button
                      onClick={() => { setGiftModalOpen(false); setGiftDismissed(true); setSelectedGiftId(null); }}
                      className="text-foreground/35 transition-colors hover:text-foreground/60 cursor-pointer"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "600", letterSpacing: "0.08em" }}
                    >
                      AGORA NÃO
                    </button>
                    <button
                      onClick={confirmGift}
                      disabled={!selectedGiftId}
                      className="rounded-[8px] bg-primary px-5 py-3 text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em" }}
                    >
                      SELECIONAR
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
