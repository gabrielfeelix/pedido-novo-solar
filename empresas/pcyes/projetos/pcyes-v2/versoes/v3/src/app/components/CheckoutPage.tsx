import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowLeft, MapPin, CreditCard, QrCode, Barcode, Shield, Check, ChevronDown, Lock, Loader2, Zap, Plus, Trash2, User, Phone, Home, Building, Hash } from "lucide-react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeProvider";
import { Footer } from "./Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type Step = "address" | "payment" | "review";

const STEPS: { key: Step; label: string }[] = [
  { key: "address", label: "Endereço" },
  { key: "payment", label: "Pagamento" },
  { key: "review", label: "Revisão" },
];

const parsePrice = (p: string) => parseFloat(p.replace("R$ ", "").replace(".", "").replace(",", "."));
const formatPrice = (n: number) => `R$ ${n.toFixed(2).replace(".", ",")}`;

const VirtualCard = ({ number, name, expiry, cvv, isFlipped, isDark }: any) => {
  return (
    <div className="w-full max-w-[340px] mx-auto perspective-1000">
      <motion.div 
        className="w-full aspect-[1.586/1] relative"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl" 
          style={{ background: isDark ? "linear-gradient(135deg, #2a2a2c 0%, #1a1a1c 100%)" : "linear-gradient(135deg, #111 0%, #333 100%)", border: "1px solid rgba(255,255,255,0.1)", backfaceVisibility: "hidden" }}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="flex justify-between items-center relative z-10">
            <Shield size={28} className="text-white/30" />
            <div className="flex gap-1">
              <div className="w-7 h-7 rounded-full bg-red-500/80" />
              <div className="w-7 h-7 rounded-full bg-yellow-500/80 -ml-4" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-white/90 tracking-widest mb-3 drop-shadow-md" style={{ fontFamily: "monospace", fontSize: "20px" }}>
              {number || "•••• •••• •••• ••••"}
            </p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Titular do Cartão</p>
                <p className="text-white/90 text-sm uppercase truncate max-w-[180px] font-medium">{name || "NOME IMPRESSO"}</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Validade</p>
                <p className="text-white/90 text-sm font-medium">{expiry || "MM/AA"}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl" 
          style={{ background: isDark ? "linear-gradient(135deg, #1a1a1c 0%, #2a2a2c 100%)" : "linear-gradient(135deg, #333 0%, #111 100%)", border: "1px solid rgba(255,255,255,0.1)", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <div className="w-full h-12 bg-black/80 mt-6" />
          <div className="px-6 mt-6">
            <div className="w-full h-10 bg-white/90 rounded flex items-center justify-end px-4">
              <span className="text-black font-mono text-base font-medium">{cvv || "•••"}</span>
            </div>
            <p className="text-white/30 text-[10px] text-right mt-2">Código de segurança</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function CheckoutPage() {
  const { items, clearCart, removeItem } = useCart();
  const { user, isLoggedIn, setAuthModalOpen } = useAuth();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  const [step, setStep] = useState<Step>("address");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  // Modal states
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState<"new" | "edit">("new");

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardModalMode, setCardModalMode] = useState<"new" | "edit" | "installments">("new");
  const [cardModalType, setCardModalType] = useState<"credit" | "debit">("credit");

  // Address Modes
  const [addressMode, setAddressMode] = useState<"saved" | "new">(user?.addresses?.length ? "saved" : "new");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(user?.addresses?.[0]?.id || null);

  const [addr, setAddr] = useState({
    cep: user?.addresses[0]?.cep || "", street: user?.addresses[0]?.street || "",
    number: user?.addresses[0]?.number || "", complement: user?.addresses[0]?.complement || "",
    neighborhood: user?.addresses[0]?.neighborhood || "", city: user?.addresses[0]?.city || "",
    state: user?.addresses[0]?.state || "", name: user?.name || "", phone: user?.phone || "",
    cpf: "",
  });

  const handleSelectSavedAddress = (a: any) => {
    setAddressMode("saved");
    setSelectedAddressId(a.id);
    setAddr({
      cep: a.cep, street: a.street, number: a.number, complement: a.complement || "",
      neighborhood: a.neighborhood, city: a.city, state: a.state, name: user?.name || "", phone: user?.phone || "", cpf: ""
    });
  };

  const handleEditAddress = (a: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddressModalMode("edit");
    setSelectedAddressId(a.id);
    setAddr({
      cep: a.cep, street: a.street, number: a.number, complement: a.complement || "",
      neighborhood: a.neighborhood, city: a.city, state: a.state, name: user?.name || "", phone: user?.phone || "", cpf: ""
    });
    setIsAddressModalOpen(true);
  };

  const handleNewAddress = () => {
    setAddressModalMode("new");
    setSelectedAddressId(null);
    setAddr({
      cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "", name: user?.name || "", phone: user?.phone || "", cpf: ""
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = () => {
    setAddressMode("saved");
    setIsAddressModalOpen(false);
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    setAddr({ ...addr, cep: e.target.value });
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddr((prev) => ({ ...prev, street: data.logradouro, neighborhood: data.bairro, city: data.localidade, state: data.uf, cep: data.cep }));
        }
      } catch (err) {}
    }
  };

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit" | "boleto" | "debit">("pix");
  
  const [cardMode, setCardMode] = useState<"saved" | "new">("saved");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardCpf, setCardCpf] = useState("");
  const [installments, setInstallments] = useState("1");
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const handleSelectSavedCardForInstallments = (c: any, type: "credit"|"debit") => {
    setCardModalMode("installments");
    setCardModalType(type);
    setSelectedCardId(c.id);
    setCardNumber(`**** **** **** ${c.last4}`);
    setCardName(c.name);
    setCardExpiry(c.expiry);
    setCardCvv("");
    setCardCpf("");
    setInstallments("1");
    setIsCardModalOpen(true);
  };

  const handleEditCard = (c: any, type: "credit"|"debit", e: React.MouseEvent) => {
    e.stopPropagation();
    setCardModalMode("edit");
    setCardModalType(type);
    setSelectedCardId(c.id);
    setCardNumber(`**** **** **** ${c.last4}`);
    setCardName(c.name);
    setCardExpiry(c.expiry);
    setCardCvv("");
    setCardCpf("");
    setIsCardModalOpen(true);
  };

  const handleNewCard = (type: "credit"|"debit") => {
    setCardModalMode("new");
    setCardModalType(type);
    setSelectedCardId(null);
    setCardNumber(""); setCardName(""); setCardExpiry(""); setCardCvv(""); setCardCpf("");
    setIsCardModalOpen(true);
  };

  const handleSaveCard = () => {
    setCardMode("saved");
    setIsCardModalOpen(false);
  };

  const formatCardNumber = (val: string) => val.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);
  const formatExpiry = (val: string) => val.replace(/\D/g, "").replace(/(\d{2})(\d{1,2})/, "$1/$2").slice(0, 5);

  const subtotal = items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0);
  const shipping = subtotal >= 299 ? 0 : 18.9;
  const total = subtotal + shipping;

  if (!isLoggedIn) {
    return (
      <div className="pt-[140px] md:pt-[180px] min-h-screen flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <Lock size={40} className="text-foreground/15 mx-auto mb-6" />
          <h2 className="text-foreground mb-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "28px", fontWeight: "var(--font-weight-light)" }}>
            Faça login para continuar
          </h2>
          <p className="text-foreground/35 mb-8" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", lineHeight: "1.7" }}>
            Para finalizar sua compra, precisamos que você esteja logado.
          </p>
          <button onClick={() => setAuthModalOpen(true)}
            className="px-8 py-3.5 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 cursor-pointer"
            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
          >Entrar na minha conta</button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="pt-[140px] md:pt-[180px] min-h-screen flex items-center justify-center px-8">
        <div className="text-center">
          <h2 className="text-foreground mb-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "28px", fontWeight: "var(--font-weight-light)" }}>Carrinho vazio</h2>
          <p className="text-foreground/35 mb-6" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Adicione produtos antes de prosseguir.</p>
          <Link to="/" className="px-6 py-3 bg-primary text-primary-foreground inline-flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer"
            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
          >Voltar à loja</Link>
        </div>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="pt-[140px] md:pt-[180px] min-h-screen flex items-center justify-center px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
            <Check size={32} className="text-green-500" />
          </div>
          <h2 className="text-foreground mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "28px", fontWeight: "var(--font-weight-light)" }}>Pedido confirmado!</h2>
          <p className="text-foreground/40 mb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Pedido #PCY-2026-004</p>
          <p className="text-foreground/30 mb-8" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", lineHeight: "1.7" }}>
            Você receberá um e-mail com os detalhes e o acompanhamento do seu pedido.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/perfil" className="px-5 py-3 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/20 transition-all cursor-pointer"
              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
            >Meus pedidos</Link>
            <Link to="/" className="px-5 py-3 bg-primary text-primary-foreground hover:brightness-110 transition-all cursor-pointer"
              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
            >Continuar comprando</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const isAddressValid = () => {
    if (addressMode === "saved") return selectedAddressId !== null;
    if (addressMode === "edit") return true;
    return addr.cep.length >= 8 && addr.street.length > 0 && addr.number.length > 0 && addr.neighborhood.length > 0 && addr.city.length > 0 && addr.state.length > 0 && addr.name.length > 0 && addr.phone.length > 0;
  };

  const isPaymentValid = () => {
    if (paymentMethod === "pix" || paymentMethod === "boleto") return true;
    if (cardMode === "saved") return selectedCardId !== null;
    return cardNumber.length >= 15 && cardName.length > 3 && cardExpiry.length >= 4 && cardCvv.length >= 3 && cardCpf.length >= 11;
  };

  const handleStepClick = (targetKey: Step, index: number) => {
    if (index <= stepIndex) {
      setStep(targetKey);
    } else if (index === 1 && isAddressValid()) {
      setStep("payment");
    } else if (index === 2 && isAddressValid() && isPaymentValid()) {
      setStep("review");
    }
  };

  const handlePlace = () => {
    setPlacing(true);
    setTimeout(() => { setPlacing(false); setPlaced(true); clearCart(); }, 2000);
  };

  const inputCls = "w-full px-4 py-3 bg-foreground/[0.03] border border-foreground/8 text-foreground placeholder:text-foreground/30 focus:border-primary/50 focus:bg-primary/5 focus:outline-none transition-all";
  const inputStyle = { borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px" };

  return (
    <div className="bg-background min-h-screen pt-8">
      <div className="px-5 md:px-8 pb-2">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground/40 hover:text-foreground/80 transition-colors mb-6 cursor-pointer"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
          ><ArrowLeft size={14} /> Voltar</button>

          <h1 className="text-foreground mb-8" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "var(--font-weight-light)" }}>Checkout</h1>

          {/* Progress */}
          <div className="flex items-center gap-0 mb-12">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <button
                  onClick={() => handleStepClick(s.key, i)}
                  className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 cursor-pointer ${
                    step === s.key ? "bg-primary/10 text-primary border border-primary/20" : i < stepIndex ? "text-green-500 bg-green-500/5 border border-green-500/10" : "text-foreground/25 border border-foreground/5"
                  }`}
                  style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
                >
                  {i < stepIndex ? <Check size={14} /> : <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center" style={{ fontSize: "11px" }}>{i + 1}</span>}
                  {s.label}
                </button>
                {i < STEPS.length - 1 && <div className={`w-8 h-px mx-1 ${i < stepIndex ? "bg-green-500/30" : "bg-foreground/5"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 md:px-8 pb-24">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Left - Form */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {step === "address" && (
                <motion.div key="address" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  
                  {/* Express Checkout Option */}
                  {user && user.addresses.length > 0 && user.cards.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-5 border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderRadius: "var(--radius-card)" }}>
                      <div>
                        <h3 className="text-primary font-medium flex items-center gap-2 mb-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "18px" }}>
                          <Zap size={18} className="fill-primary text-primary" /> Compra Express (1-Clique)
                        </h3>
                        <p className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                          Use seu endereço e cartão padrão para ir direto para a revisão.
                        </p>
                      </div>
                      <button onClick={() => { setStep("review"); setPaymentMethod("credit"); }} className="px-6 py-3 bg-primary text-primary-foreground hover:brightness-110 transition-all flex items-center gap-2 shrink-0 cursor-pointer" style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}>
                        Pular para Revisão <ArrowLeft size={14} className="rotate-180" />
                      </button>
                    </motion.div>
                  )}

                  <div className="flex items-center gap-3 mb-6">
                    <MapPin size={20} className="text-primary" />
                    <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: "var(--font-weight-medium)" }}>Endereço de entrega</h2>
                  </div>

                  {user && user.addresses.length > 0 && (
                    <div className="mb-8 space-y-3">
                      <p className="text-foreground/40 mb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.1em" }}>ENDEREÇOS SALVOS</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {user.addresses.map((a) => {
                          const isSelected = selectedAddressId === a.id && addressMode !== "new";
                          return (
                            <div key={a.id} onClick={() => handleSelectSavedAddress(a)}
                              className={`w-full text-left p-4 border transition-all duration-300 cursor-pointer ${
                                isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-foreground/10 hover:border-foreground/20 bg-foreground/[0.01]"
                              }`}
                              style={{ borderRadius: "var(--radius-card)" }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-foreground/80 flex items-center gap-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>
                                  {a.label}
                                  {isSelected && <Check size={14} className="text-primary" />}
                                </span>
                                <div className="flex items-center gap-2">
                                  {a.isDefault && <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20" style={{ borderRadius: "100px", fontSize: "10px", fontWeight: "var(--font-weight-bold)" }}>PADRÃO</span>}
                                  <button onClick={(e) => handleEditAddress(a, e)} className="text-foreground/60 hover:text-primary hover:bg-primary/10 bg-foreground/5 text-[11px] cursor-pointer px-2.5 py-1 font-medium transition-colors" style={{ borderRadius: "100px" }}>Editar</button>
                                </div>
                              </div>
                              <p className="text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", lineHeight: "1.5" }}>
                                {a.street}, {a.number}{a.complement ? ` - ${a.complement}` : ""}<br/>
                                {a.city}/{a.state} · {a.cep}
                              </p>
                            </div>
                          );
                        })}
                        <button onClick={handleNewAddress} 
                          className={`w-full flex flex-col items-center justify-center p-4 border border-dashed transition-all duration-300 cursor-pointer ${
                            addressMode === "new" ? "border-primary text-primary bg-primary/5 shadow-sm" : "border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:bg-foreground/[0.02]"
                          }`}
                          style={{ borderRadius: "var(--radius-card)" }}
                        >
                          <Plus size={24} className="mb-2" />
                          <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}>Adicionar novo endereço</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <AnimatePresence>
                    {(addressMode === "new" || addressMode === "edit" || !user || user.addresses.length === 0) && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="space-y-4 pt-2">
                          {user && user.addresses.length > 0 && (
                            <p className="text-foreground/40 mb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.1em" }}>
                              {addressMode === "edit" ? "EDITAR ENDEREÇO" : "NOVO ENDEREÇO"}
                            </p>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input placeholder="Nome completo" value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} className={inputCls} style={inputStyle} />
                            <input placeholder="Telefone" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} className={inputCls} style={inputStyle} />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <input placeholder="CEP" value={addr.cep} onChange={handleCepChange} className={inputCls} style={inputStyle} />
                            <input placeholder="Rua" value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} className={`col-span-2 ${inputCls}`} style={inputStyle} />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <input placeholder="Número" value={addr.number} onChange={(e) => setAddr({ ...addr, number: e.target.value })} className={inputCls} style={inputStyle} />
                            <input placeholder="Complemento" value={addr.complement} onChange={(e) => setAddr({ ...addr, complement: e.target.value })} className={`col-span-2 ${inputCls}`} style={inputStyle} />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <input placeholder="Bairro" value={addr.neighborhood} onChange={(e) => setAddr({ ...addr, neighborhood: e.target.value })} className={inputCls} style={inputStyle} />
                            <input placeholder="Cidade" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} className={inputCls} style={inputStyle} />
                            <input placeholder="Estado" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} className={inputCls} style={inputStyle} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard size={20} className="text-primary" />
                    <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: "var(--font-weight-medium)" }}>Forma de pagamento</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                    {([
                      { key: "pix" as const, icon: QrCode, label: "Pix", desc: "5% desconto" },
                      { key: "credit" as const, icon: CreditCard, label: "Cartão", desc: "Até 12x" },
                      { key: "boleto" as const, icon: Barcode, label: "Boleto", desc: "3% desconto" },
                      { key: "debit" as const, icon: CreditCard, label: "Débito", desc: "À vista" },
                    ]).map((m) => (
                      <div key={m.key} onClick={() => setPaymentMethod(m.key)}
                        className={`relative overflow-hidden flex flex-col items-center gap-3 p-5 border transition-all duration-300 cursor-pointer ${
                          paymentMethod === m.key 
                            ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] scale-[1.02]" 
                            : "border-foreground/10 hover:border-foreground/20 bg-foreground/[0.02]"
                        }`}
                        style={{ borderRadius: "var(--radius-card)" }}
                      >
                        {paymentMethod === m.key && (
                          <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm" />
                        )}
                        <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-colors ${paymentMethod === m.key ? "bg-primary text-primary-foreground" : "bg-foreground/5 text-foreground/40"}`}>
                          <m.icon size={22} />
                        </div>
                        <div className="relative text-center">
                          <span className={`block transition-colors ${paymentMethod === m.key ? "text-primary" : "text-foreground/70"}`} style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-semibold)" }}>{m.label}</span>
                          <span className={`block mt-1 ${paymentMethod === m.key ? "text-primary/70" : "text-foreground/40"}`} style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>{m.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {paymentMethod === "pix" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 border border-primary/20 text-center relative overflow-hidden" style={{ borderRadius: "var(--radius-card)", background: "rgba(var(--primary-rgb), 0.05)" }}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-10 -mt-10" />
                      <QrCode size={90} className="text-primary mx-auto mb-6 relative z-10" />
                      <p className="text-foreground/80 mb-2 relative z-10" style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", fontWeight: "var(--font-weight-medium)" }}>
                        Pague com Pix e ganhe 5% de desconto
                      </p>
                      <p className="text-green-500 relative z-10" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "28px", fontWeight: "var(--font-weight-semibold)" }}>
                        {formatPrice(total * 0.95)}
                      </p>
                      <p className="text-foreground/40 mt-3 relative z-10" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                        O QR Code será gerado na confirmação do pedido
                      </p>
                    </motion.div>
                  )}

                  {paymentMethod === "credit" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                      {user && user.cards.length > 0 && (
                        <div className="mb-6 space-y-3">
                          <p className="text-foreground/40 mb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.1em" }}>CARTÕES DE CRÉDITO</p>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {user.cards.map((c) => {
                              const isSelected = cardMode === "saved" && selectedCardId === c.id;
                              return (
                                <div key={c.id} onClick={() => handleSelectSavedCardForInstallments(c, "credit")}
                                  className={`w-full text-left flex flex-col gap-4 p-4 border transition-all duration-300 cursor-pointer ${
                                    isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-foreground/10 hover:border-foreground/20 bg-foreground/[0.01]"
                                  }`}
                                  style={{ borderRadius: "var(--radius-card)" }}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-8 rounded bg-foreground/10 flex items-center justify-center">
                                        <span className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-bold)" }}>{c.brand}</span>
                                      </div>
                                      <div>
                                        <p className="text-foreground/80 flex items-center gap-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>
                                          •••• {c.last4}
                                          {isSelected && <Check size={14} className="text-primary" />}
                                        </p>
                                        <p className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                                          {c.name} · {c.expiry}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                      {c.isDefault && <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20" style={{ borderRadius: "100px", fontSize: "10px", fontWeight: "var(--font-weight-bold)" }}>PADRÃO</span>}
                                      <button onClick={(e) => handleEditCard(c, "credit", e)} className="text-foreground/60 hover:text-primary hover:bg-primary/10 bg-foreground/5 text-[11px] cursor-pointer px-2.5 py-1 font-medium transition-colors" style={{ borderRadius: "100px" }}>Editar</button>
                                    </div>
                                  </div>
                                  
                                  {isSelected && installments && (
                                    <div className="w-full pt-3 mt-1 border-t border-foreground/5 flex items-center justify-between">
                                      <span className="text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>Parcelamento:</span>
                                      <span className="text-primary font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                                        {installments}x de {formatPrice(total / parseInt(installments))} {parseInt(installments) === 1 ? "à vista" : "sem juros"}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            <button onClick={() => handleNewCard("credit")} 
                              className={`w-full flex flex-col items-center justify-center p-4 border border-dashed transition-all duration-300 cursor-pointer ${
                                cardMode === "new" ? "border-primary text-primary bg-primary/5 shadow-sm" : "border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:bg-foreground/[0.02]"
                              }`}
                              style={{ borderRadius: "var(--radius-card)" }}
                            >
                              <Plus size={24} className="mb-2" />
                              <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}>Usar novo cartão</span>
                            </button>
                          </div>
                        </div>
                      )}
                      
                    </motion.div>
                  )}

                  {paymentMethod === "boleto" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 border border-foreground/10 text-center" style={{ borderRadius: "var(--radius-card)", background: "rgba(255,255,255,0.02)" }}>
                      <Barcode size={70} className="text-foreground/30 mx-auto mb-6" />
                      <p className="text-foreground/80 mb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", fontWeight: "var(--font-weight-medium)" }}>
                        Pague com boleto e ganhe 3% de desconto
                      </p>
                      <p className="text-green-500" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "28px", fontWeight: "var(--font-weight-semibold)" }}>
                        {formatPrice(total * 0.97)}
                      </p>
                      <p className="text-foreground/40 mt-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                        Prazo de compensação: 1 a 3 dias úteis
                      </p>
                    </motion.div>
                  )}

                  {paymentMethod === "debit" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      
                      {user && user.cards.length > 0 && (
                        <div className="mb-6 space-y-3 mt-6">
                          <p className="text-foreground/40 mb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.1em" }}>CARTÕES DE DÉBITO SALVOS</p>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {user.cards.map((c) => {
                              const isSelected = cardMode === "saved" && selectedCardId === c.id;
                              return (
                                <div key={c.id} onClick={() => handleSelectSavedCardForInstallments(c, "debit")}
                                  className={`w-full text-left flex flex-col gap-4 p-4 border transition-all duration-300 cursor-pointer ${
                                    isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-foreground/10 hover:border-foreground/20 bg-foreground/[0.01]"
                                  }`}
                                  style={{ borderRadius: "var(--radius-card)" }}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-8 rounded bg-foreground/10 flex items-center justify-center">
                                        <span className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-bold)" }}>{c.brand}</span>
                                      </div>
                                      <div>
                                        <p className="text-foreground/80 flex items-center gap-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>
                                          •••• {c.last4}
                                          {isSelected && <Check size={14} className="text-primary" />}
                                        </p>
                                        <p className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                                          {c.name} · {c.expiry}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                      {c.isDefault && <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20" style={{ borderRadius: "100px", fontSize: "10px", fontWeight: "var(--font-weight-bold)" }}>PADRÃO</span>}
                                      <button onClick={(e) => handleEditCard(c, "debit", e)} className="text-foreground/60 hover:text-primary hover:bg-primary/10 bg-foreground/5 text-[11px] cursor-pointer px-2.5 py-1 font-medium transition-colors" style={{ borderRadius: "100px" }}>Editar</button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            <button onClick={() => handleNewCard("debit")} 
                              className={`w-full flex flex-col items-center justify-center p-4 border border-dashed transition-all duration-300 cursor-pointer ${
                                cardMode === "new" ? "border-primary text-primary bg-primary/5 shadow-sm" : "border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:bg-foreground/[0.02]"
                              }`}
                              style={{ borderRadius: "var(--radius-card)" }}
                            >
                              <Plus size={24} className="mb-2" />
                              <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}>Usar novo cartão</span>
                            </button>
                          </div>
                        </div>
                      )}
                      
                    </motion.div>
                  )}
                </motion.div>
              )}

              {step === "review" && (
                <motion.div key="review" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <Check size={20} className="text-primary" />
                    <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: "var(--font-weight-medium)" }}>Revisar pedido</h2>
                  </div>

                  <div className="space-y-5">
                    <div className="p-6 border border-foreground/10 bg-foreground/[0.01]" style={{ borderRadius: "var(--radius-card)" }}>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-bold)", letterSpacing: "0.1em" }}>ENDEREÇO DE ENTREGA</p>
                        <button onClick={() => setStep("address")} className="text-primary hover:underline text-sm font-medium cursor-pointer">Editar</button>
                      </div>
                      <p className="text-foreground/90 font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>{addr.name}</p>
                      <p className="text-foreground/60 mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", lineHeight: "1.6" }}>
                        {addr.street}, {addr.number}{addr.complement ? ` - ${addr.complement}` : ""}<br/>
                        {addr.neighborhood} · {addr.city}/{addr.state} · {addr.cep}
                      </p>
                    </div>

                    <div className="p-6 border border-foreground/10 bg-foreground/[0.01]" style={{ borderRadius: "var(--radius-card)" }}>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-bold)", letterSpacing: "0.1em" }}>FORMA DE PAGAMENTO</p>
                        <button onClick={() => setStep("payment")} className="text-primary hover:underline text-sm font-medium cursor-pointer">Editar</button>
                      </div>
                      <div className="flex items-center gap-3">
                        {paymentMethod === "pix" && <QrCode size={24} className="text-primary" />}
                        {paymentMethod === "credit" && <CreditCard size={24} className="text-primary" />}
                        {paymentMethod === "debit" && <CreditCard size={24} className="text-primary" />}
                        {paymentMethod === "boleto" && <Barcode size={24} className="text-primary" />}
                        <p className="text-foreground/90 font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>
                          {paymentMethod === "pix" ? "Pix (5% de desconto)" 
                            : paymentMethod === "credit" ? `Cartão de crédito final ${cardNumber.slice(-4)} · ${installments}x` 
                            : paymentMethod === "debit" ? `Cartão de débito final ${cardNumber.slice(-4)} à vista`
                            : "Boleto bancário (3% de desconto)"}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 border border-foreground/10 bg-foreground/[0.01]" style={{ borderRadius: "var(--radius-card)" }}>
                      <p className="text-foreground/40 mb-4" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-bold)", letterSpacing: "0.1em" }}>ITENS DO PEDIDO ({items.length})</p>
                      <div className="space-y-4 flex flex-col">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-14 h-14 flex-shrink-0 overflow-hidden" style={{ borderRadius: "var(--radius)", background: isDark ? "#1a1a1c" : "#f5f5f5" }}>
                              <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover p-1" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-foreground/80 truncate font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>{item.name}</p>
                              <p className="text-foreground/40 mt-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>Qtd: {item.quantity}</p>
                            </div>
                            <p className="text-foreground/70 font-medium flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>{item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* UX/UI Item 5: Enhanced Right Summary */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="sticky top-[110px] border border-foreground/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl" style={{ borderRadius: "var(--radius-card)", background: isDark ? "rgba(20, 20, 22, 0.7)" : "rgba(255, 255, 255, 0.7)" }}>
              <h3 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-semibold)" }}>Resumo da Compra</h3>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.cartKey} className="flex items-center gap-4 group">
                    <div className="relative w-14 h-14 flex-shrink-0" style={{ borderRadius: "var(--radius)", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}>
                      <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md p-1" />
                      <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center text-[11px] font-bold border-2 border-background z-10">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground/90 truncate font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{item.name}</p>
                      <p className="text-foreground/50 mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{item.price}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.cartKey)} 
                      className="text-foreground/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1 cursor-pointer"
                      aria-label="Remover item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="h-px bg-foreground/10 mb-6" />

              <div className="mb-6">
                <div className="flex gap-2">
                  <input 
                    placeholder="Cupom de desconto" 
                    className="w-full px-4 py-2.5 bg-foreground/[0.03] border border-foreground/8 text-foreground placeholder:text-foreground/30 focus:border-primary/50 focus:bg-primary/5 focus:outline-none transition-all" 
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                  />
                  <button className="px-4 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors font-medium cursor-pointer" style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                    Aplicar
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Subtotal</span>
                  <span className="text-foreground/90 font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Frete</span>
                  <span className={shipping === 0 ? "text-green-500 font-medium" : "text-foreground/90 font-medium"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>
                    {shipping === 0 ? "Grátis" : formatPrice(shipping)}
                  </span>
                </div>
                {paymentMethod === "pix" && (
                  <div className="flex justify-between">
                    <span className="text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Desconto Pix (5%)</span>
                    <span className="text-green-500 font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>-{formatPrice(total * 0.05)}</span>
                  </div>
                )}
                {paymentMethod === "boleto" && (
                  <div className="flex justify-between">
                    <span className="text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Desconto Boleto (3%)</span>
                    <span className="text-green-500 font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>-{formatPrice(total * 0.03)}</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-foreground/10 mb-6" />

              <div className="flex justify-between items-end mb-8">
                <span className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px" }}>Total</span>
                <span className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "28px", fontWeight: "var(--font-weight-semibold)" }}>
                  {formatPrice(paymentMethod === "pix" ? total * 0.95 : paymentMethod === "boleto" ? total * 0.97 : total)}
                </span>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                {step === "address" && (
                  <button onClick={() => { if (isAddressValid()) setStep("payment"); }} disabled={!isAddressValid()}
                    className="w-full py-4 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: "var(--font-weight-semibold)" }}
                  >Continuar para pagamento <ArrowLeft size={16} className="rotate-180" /></button>
                )}
                {step === "payment" && (
                  <>
                    <button onClick={() => { if (isPaymentValid()) setStep("review"); }} disabled={!isPaymentValid()}
                      className="w-full py-4 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: "var(--font-weight-semibold)" }}
                    >Revisar pedido <ArrowLeft size={16} className="rotate-180" /></button>
                    <button onClick={() => setStep("address")}
                      className="w-full py-3 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all cursor-pointer"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
                    >Voltar para Endereço</button>
                  </>
                )}
                {step === "review" && (
                  <>
                    <button onClick={handlePlace} disabled={placing}
                      className="w-full py-4 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-lg shadow-primary/20"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: "var(--font-weight-semibold)" }}
                    >
                      {placing ? <><Loader2 size={18} className="animate-spin" /> Processando...</> : <><Lock size={16} /> Confirmar pedido</>}
                    </button>
                    <button onClick={() => setStep("payment")}
                      className="w-full py-3 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all cursor-pointer"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
                    >Voltar para Pagamento</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* ── Modals ── */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background border border-foreground/10 shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50" />
              <h3 className="text-foreground mb-8 flex items-center gap-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "24px", fontWeight: "var(--font-weight-medium)" }}>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={20} />
                </div>
                {addressModalMode === "edit" ? "Editar Endereço" : "Novo Endereço"}
              </h3>
              
              <div className="space-y-8">
                {/* Contact Section */}
                <div className="space-y-4">
                  <p className="text-foreground/50 border-b border-foreground/5 pb-2 mb-4" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-bold)", letterSpacing: "0.1em" }}>INFORMAÇÕES DE CONTATO</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">Nome do destinatário</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                        <input placeholder="Ex: João da Silva" value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} className={`pl-10 ${inputCls}`} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">Telefone</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                        <input placeholder="(11) 90000-0000" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} className={`pl-10 ${inputCls}`} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="space-y-4">
                  <p className="text-foreground/50 border-b border-foreground/5 pb-2 mb-4 mt-6" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-bold)", letterSpacing: "0.1em" }}>DADOS DE ENTREGA</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">CEP</label>
                      <div className="relative">
                        <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                        <input placeholder="00000-000" value={addr.cep} onChange={handleCepChange} className={`pl-10 ${inputCls}`} style={inputStyle} />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">Endereço (Rua/Avenida)</label>
                      <div className="relative">
                        <Home size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                        <input placeholder="Av. Paulista, Rua das Flores..." value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} className={`pl-10 ${inputCls}`} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">Número</label>
                      <div className="relative">
                        <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                        <input placeholder="1234" value={addr.number} onChange={(e) => setAddr({ ...addr, number: e.target.value })} className={`pl-10 ${inputCls}`} style={inputStyle} />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">Complemento (Opcional)</label>
                      <div className="relative">
                        <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                        <input placeholder="Apto 12, Bloco B..." value={addr.complement} onChange={(e) => setAddr({ ...addr, complement: e.target.value })} className={`pl-10 ${inputCls}`} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">Bairro</label>
                      <input placeholder="Centro" value={addr.neighborhood} onChange={(e) => setAddr({ ...addr, neighborhood: e.target.value })} className={inputCls} style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">Cidade</label>
                      <input placeholder="São Paulo" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} className={inputCls} style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">Estado</label>
                      <input placeholder="SP" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} className={inputCls} style={inputStyle} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-foreground/5">
                <button onClick={() => setIsAddressModalOpen(false)} className="px-6 py-3 border border-foreground/10 text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer" style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>Cancelar</button>
                <button onClick={handleSaveAddress} className="px-8 py-3 bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20 transition-all cursor-pointer flex items-center gap-2" style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>
                  <Check size={16} /> Salvar endereço
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCardModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background border border-foreground/10 shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50" />
              <h3 className="text-foreground mb-8 flex items-center gap-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "24px", fontWeight: "var(--font-weight-medium)" }}>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCard size={20} />
                </div>
                {cardModalMode === "installments" ? "Confirmar Cartão" : cardModalMode === "edit" ? "Editar Cartão" : "Novo Cartão"}
              </h3>
              
              <div className="flex flex-col md:flex-row gap-10 items-start">
                
                {/* Left side: Card Preview */}
                <div className="w-full md:w-[340px] flex-shrink-0">
                  <div className="sticky top-0">
                    <VirtualCard number={cardNumber} name={cardName} expiry={cardExpiry} cvv={cardCvv} isFlipped={isCardFlipped} isDark={isDark} />
                  </div>
                </div>

                {/* Right side: Form Fields */}
                <div className="flex-1 w-full space-y-6">
                  {cardModalMode !== "installments" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">Número do cartão</label>
                        <div className="relative">
                          <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                          <input placeholder={`0000 0000 0000 0000`} value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} maxLength={19} className={`pl-10 ${inputCls}`} style={inputStyle} onFocus={() => setIsCardFlipped(false)} />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">Nome impresso</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                          <input placeholder="Como no cartão" value={cardName} onChange={(e) => setCardName(e.target.value)} className={`pl-10 ${inputCls}`} style={inputStyle} onFocus={() => setIsCardFlipped(false)} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">CPF do titular</label>
                        <input placeholder="000.000.000-00" value={cardCpf} onChange={(e) => setCardCpf(e.target.value)} className={inputCls} style={inputStyle} onFocus={() => setIsCardFlipped(false)} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">Validade</label>
                          <input placeholder="MM/AA" value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} maxLength={5} className={inputCls} style={inputStyle} onFocus={() => setIsCardFlipped(false)} />
                        </div>
                        <div>
                          <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">CVV</label>
                          <div className="relative">
                            <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                            <input placeholder="123" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} maxLength={4} className={`pl-10 ${inputCls}`} style={inputStyle} onFocus={() => setIsCardFlipped(true)} onBlur={() => setIsCardFlipped(false)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {cardModalMode === "installments" && (
                    <div className="space-y-6">
                        <div className="bg-primary/5 border border-primary/10 p-5" style={{ borderRadius: "var(--radius-card)" }}>
                          <p className="text-foreground/80 leading-relaxed" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>
                            Para sua segurança, por favor confirme o <strong>código de 3 dígitos (CVV)</strong>.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">Código de Segurança (CVV)</label>
                            <div className="relative">
                              <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                              <input placeholder="Ex: 123" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} maxLength={4} className={`pl-10 ${inputCls}`} style={inputStyle} onFocus={() => setIsCardFlipped(true)} onBlur={() => setIsCardFlipped(false)} />
                            </div>
                          </div>

                          {cardModalType === "credit" && (
                            <div>
                              <label className="block text-foreground/70 mb-1.5 ml-1 text-xs font-medium">Opções de parcelamento</label>
                              <Select value={installments} onValueChange={(val) => setInstallments(val)}>
                                <SelectTrigger className={inputCls} style={inputStyle} onFocus={() => setIsCardFlipped(false)}>
                                  <SelectValue placeholder="Escolha em quantas vezes deseja pagar" />
                                </SelectTrigger>
                                <SelectContent position="popper" sideOffset={4} className="z-[70] max-h-[300px]">
                                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                                    <SelectItem key={n} value={n.toString()}>
                                      {n}x de {formatPrice(total / n)}{n === 1 ? " à vista" : " sem juros"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                    </div>
                  )}

                  {cardModalMode !== "installments" && cardModalType === "credit" && (
                    <div className="space-y-2 pt-4 border-t border-foreground/5">
                      <label className="text-foreground/80 mb-1.5 ml-1 text-sm font-semibold flex items-center gap-2">
                        <Zap size={14} className="text-primary" />
                        Selecione o parcelamento
                      </label>
                      <Select value={installments} onValueChange={(val) => setInstallments(val)}>
                        <SelectTrigger className={inputCls} style={inputStyle} onFocus={() => setIsCardFlipped(false)}>
                          <SelectValue placeholder="Escolha em quantas vezes deseja pagar" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4} className="z-[70] max-h-[300px]">
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                            <SelectItem key={n} value={n.toString()}>
                              {n}x de {formatPrice(total / n)}{n === 1 ? " à vista" : " sem juros"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-foreground/5">
                <button onClick={() => setIsCardModalOpen(false)} className="px-6 py-3 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/5 transition-colors cursor-pointer" style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>Cancelar</button>
                <button onClick={handleSaveCard} className="px-8 py-3 bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20 transition-all cursor-pointer flex items-center gap-2" style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>
                  <Check size={16} /> Confirmar e Salvar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
