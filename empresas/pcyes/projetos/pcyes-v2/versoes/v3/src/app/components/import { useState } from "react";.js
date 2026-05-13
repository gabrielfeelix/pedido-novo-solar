import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowLeft, MapPin, CreditCard, QrCode, Barcode, Truck, Shield, Check, ChevronDown, Lock, Loader2 } from "lucide-react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeProvider";
import { Footer } from "./Footer";

type Step = "address" | "payment" | "review";

const STEPS: { key: Step; label: string }[] = [
    { key: "address", label: "Endereço" },
    { key: "payment", label: "Pagamento" },
    { key: "review", label: "Revisão" },
];

const parsePrice = (p: string) => parseFloat(p.replace("R$ ", "").replace(".", "").replace(",", "."));
const formatPrice = (n: number) => `R$ ${n.toFixed(2).replace(".", ",")}`;

export function CheckoutPage() {
    const { items, clearCart } = useCart();
    const { user, isLoggedIn, setAuthModalOpen } = useAuth();
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

    const [step, setStep] = useState < Step > ("address");
    const [placing, setPlacing] = useState(false);
    const [placed, setPlaced] = useState(false);

    // Address form
    const [addr, setAddr] = useState({
        cep: user?.addresses[0]?.cep || "", street: user?.addresses[0]?.street || "",
        number: user?.addresses[0]?.number || "", complement: user?.addresses[0]?.complement || "",
        neighborhood: user?.addresses[0]?.neighborhood || "", city: user?.addresses[0]?.city || "",
        state: user?.addresses[0]?.state || "", name: user?.name || "", phone: user?.phone || "",
        cpf: "",
    });

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
            } catch (err) { }
        }
    };

    // Payment
    const [paymentMethod, setPaymentMethod] = useState < "pix" | "credit" | "boleto" | "debit" > ("pix");
    const [cardNumber, setCardNumber] = useState(user?.cards[0] ? `**** **** **** ${user.cards[0].last4}` : "");
    const [cardName, setCardName] = useState(user?.cards[0]?.name || "");
    const [cardExpiry, setCardExpiry] = useState(user?.cards[0]?.expiry || "");
    const [cardCvv, setCardCvv] = useState("");
    const [cardCpf, setCardCpf] = useState("");
    const [installments, setInstallments] = useState("1");

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

    const handlePlace = () => {
        setPlacing(true);
        setTimeout(() => { setPlacing(false); setPlaced(true); }, 2000);
    };

    const inputCls = "w-full px-4 py-3 bg-foreground/[0.03] border border-foreground/8 text-foreground placeholder:text-foreground/20 focus:border-foreground/20 focus:outline-none transition-colors";
    const inputStyle = { borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" };

    return (
        <div className="pt-[140px] md:pt-[180px]">
            <div className="px-5 md:px-8 pt-8 pb-4">
                <div className="max-w-5xl mx-auto">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground/30 hover:text-foreground/60 transition-colors mb-6 cursor-pointer"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                    ><ArrowLeft size={14} /> Voltar</button>

                    <h1 className="text-foreground mb-8" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "var(--font-weight-light)" }}>Checkout</h1>

                    {/* Progress */}
                    <div className="flex items-center gap-0 mb-12">
                        {STEPS.map((s, i) => (
                            <div key={s.key} className="flex items-center">
                                <button
                                    onClick={() => i <= stepIndex && setStep(s.key)}
                                    className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 cursor-pointer ${step === s.key ? "bg-primary/10 text-primary border border-primary/20" : i < stepIndex ? "text-green-500 bg-green-500/5 border border-green-500/10" : "text-foreground/25 border border-foreground/5"
                                        }`}
                                    style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-medium)" }}
                                >
                                    {i < stepIndex ? <Check size={13} /> : <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center" style={{ fontSize: "10px" }}>{i + 1}</span>}
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
                                    <div className="flex items-center gap-3 mb-6">
                                        <MapPin size={18} className="text-primary" />
                                        <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Endereço de entrega</h2>
                                    </div>

                                    {user && user.addresses.length > 0 && (
                                        <div className="mb-6 space-y-2">
                                            <p className="text-foreground/40 mb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.1em" }}>ENDEREÇOS SALVOS</p>
                                            {user.addresses.map((a) => (
                                                <button key={a.id} onClick={() => setAddr({ cep: a.cep, street: a.street, number: a.number, complement: a.complement || "", neighborhood: a.neighborhood, city: a.city, state: a.state, name: user.name, phone: user.phone })}
                                                    className={`w-full text-left p-4 border transition-all duration-300 cursor-pointer ${addr.cep === a.cep && addr.street === a.street ? "border-primary/30 bg-primary/5" : "border-foreground/5 hover:border-foreground/10"
                                                        }`}
                                                    style={{ borderRadius: "var(--radius-card)" }}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}>{a.label}</span>
                                                        {a.isDefault && <span className="px-2 py-0.5 bg-primary/10 text-primary" style={{ borderRadius: "100px", fontSize: "9px", fontWeight: "var(--font-weight-medium)" }}>PADRÃO</span>}
                                                    </div>
                                                    <p className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                                                        {a.street}, {a.number}{a.complement ? ` - ${a.complement}` : ""} · {a.city}/{a.state} · {a.cep}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <input placeholder="Nome completo" value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} className={inputCls} style={inputStyle} />
                                            <input placeholder="Telefone" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} className={inputCls} style={inputStyle} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <input placeholder="CEP" value={addr.cep} onChange={(e) => setAddr({ ...addr, cep: e.target.value })} className={inputCls} style={inputStyle} />
                                            <input placeholder="Rua" value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} className={`col-span-2 ${inputCls}`} style={inputStyle} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <input placeholder="Número" value={addr.number} onChange={(e) => setAddr({ ...addr, number: e.target.value })} className={inputCls} style={inputStyle} />
                                            <input placeholder="Complemento" value={addr.complement} onChange={(e) => setAddr({ ...addr, complement: e.target.value })} className={`col-span-2 ${inputCls}`} style={inputStyle} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <input placeholder="Bairro" value={addr.neighborhood} onChange={(e) => setAddr({ ...addr, neighborhood: e.target.value })} className={inputCls} style={inputStyle} />
                                            <input placeholder="Cidade" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} className={inputCls} style={inputStyle} />
                                            <input placeholder="Estado" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} className={inputCls} style={inputStyle} />
                                        </div>
                                    </div>

                                    <button onClick={() => setStep("payment")}
                                        className="mt-8 px-8 py-3.5 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                                        style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
                                    >Continuar para pagamento</button>
                                </motion.div>
                            )}

                            {step === "payment" && (
                                <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <CreditCard size={18} className="text-primary" />
                                        <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Forma de pagamento</h2>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
                                        {([
                                            { key: "pix" as const, icon: QrCode, label: "Pix", desc: "5% desconto" },
                                            { key: "credit" as const, icon: CreditCard, label: "Cartão", desc: "Até 12x" },
                                            { key: "boleto" as const, icon: Barcode, label: "Boleto", desc: "3% desconto" },
                                            { key: "debit" as const, icon: CreditCard, label: "Débito", desc: "À vista" },
                                        ]).map((m) => (
                                            <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                                                className={`flex flex-col items-center gap-2 p-4 border transition-all duration-300 cursor-pointer ${paymentMethod === m.key ? "border-primary/30 bg-primary/5" : "border-foreground/5 hover:border-foreground/10"
                                                    }`}
                                                style={{ borderRadius: "var(--radius-card)" }}
                                            >
                                                <m.icon size={20} className={paymentMethod === m.key ? "text-primary" : "text-foreground/30"} />
                                                <span className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}>{m.label}</span>
                                                <span className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>{m.desc}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {paymentMethod === "pix" && (
                                        <div className="p-6 border border-foreground/5 text-center" style={{ borderRadius: "var(--radius-card)", background: "rgba(255,255,255,0.02)" }}>
                                            <QrCode size={80} className="text-foreground/15 mx-auto mb-4" />
                                            <p className="text-foreground/60 mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>
                                                Pague com Pix e ganhe 5% de desconto
                                            </p>
                                            <p className="text-green-500" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: "var(--font-weight-medium)" }}>
                                                {formatPrice(total * 0.95)}
                                            </p>
                                            <p className="text-foreground/25 mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                                                O QR Code será gerado na confirmação do pedido
                                            </p>
                                        </div>
                                    )}

                                    {paymentMethod === "credit" && (
                                        <div className="space-y-3">
                                            {user && user.cards.length > 0 && (
                                                <div className="mb-4 space-y-2">
                                                    <p className="text-foreground/40 mb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.1em" }}>CARTÕES SALVOS</p>
                                                    {user.cards.map((c) => (
                                                        <button key={c.id} onClick={() => { setCardNumber(`**** **** **** ${c.last4}`); setCardName(c.name); setCardExpiry(c.expiry); }}
                                                            className={`w-full text-left flex items-center gap-4 p-4 border transition-all duration-300 cursor-pointer ${cardNumber.endsWith(c.last4) ? "border-primary/30 bg-primary/5" : "border-foreground/5 hover:border-foreground/10"
                                                                }`}
                                                            style={{ borderRadius: "var(--radius-card)" }}
                                                        >
                                                            <div className="w-10 h-7 rounded bg-foreground/5 flex items-center justify-center">
                                                                <span className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: "var(--font-weight-medium)" }}>{c.brand}</span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>•••• {c.last4}</p>
                                                                <p className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>{c.name} · {c.expiry}</p>
                                                            </div>
                                                            {c.isDefault && <span className="px-2 py-0.5 bg-primary/10 text-primary" style={{ borderRadius: "100px", fontSize: "9px" }}>PADRÃO</span>}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            <input placeholder="Número do cartão" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} maxLength={19} className={inputCls} style={inputStyle} />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input placeholder="Nome impresso no cartão" value={cardName} onChange={(e) => setCardName(e.target.value)} className={inputCls} style={inputStyle} />
                                                <input placeholder="CPF do titular" value={cardCpf} onChange={(e) => setCardCpf(e.target.value)} className={inputCls} style={inputStyle} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <input placeholder="Validade (MM/AA)" value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} maxLength={5} className={inputCls} style={inputStyle} />
                                                <input placeholder="CVV" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} maxLength={4} className={inputCls} style={inputStyle} />
                                            </div>
                                            <div className="relative">
                                                <select value={installments} onChange={(e) => setInstallments(e.target.value)}
                                                    className={`${inputCls} appearance-none cursor-pointer`} style={inputStyle}
                                                >
                                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                                                        <option key={n} value={n}>{n}x de {formatPrice(total / n)}{n === 1 ? " à vista" : " sem juros"}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/20 pointer-events-none" />
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === "boleto" && (
                                        <div className="p-6 border border-foreground/5 text-center" style={{ borderRadius: "var(--radius-card)", background: "rgba(255,255,255,0.02)" }}>
                                            <Barcode size={50} className="text-foreground/15 mx-auto mb-4" />
                                            <p className="text-foreground/60 mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>
                                                Pague com boleto e ganhe 3% de desconto
                                            </p>
                                            <p className="text-green-500" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: "var(--font-weight-medium)" }}>
                                                {formatPrice(total * 0.97)}
                                            </p>
                                            <p className="text-foreground/25 mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                                                Prazo de compensação: 1 a 3 dias úteis
                                            </p>
                                        </div>
                                    )}

                                    {paymentMethod === "debit" && (
                                        <div className="space-y-3">
                                            <input placeholder="Número do cartão" className={inputCls} style={inputStyle} />
                                            <input placeholder="Nome no cartão" className={inputCls} style={inputStyle} />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input placeholder="Validade" className={inputCls} style={inputStyle} />
                                                <input placeholder="CVV" className={inputCls} style={inputStyle} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 mt-8">
                                        <button onClick={() => setStep("address")}
                                            className="px-6 py-3.5 border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/20 transition-all cursor-pointer"
                                            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                                        >Voltar</button>
                                        <button onClick={() => setStep("review")}
                                            className="px-8 py-3.5 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                                            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
                                        >Revisar pedido</button>
                                    </div>
                                </motion.div>
                            )}

                            {step === "review" && (
                                <motion.div key="review" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Check size={18} className="text-primary" />
                                        <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Revisar pedido</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-5 border border-foreground/5" style={{ borderRadius: "var(--radius-card)" }}>
                                            <p className="text-foreground/40 mb-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.1em" }}>ENTREGA</p>
                                            <p className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{addr.name}</p>
                                            <p className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                                                {addr.street}, {addr.number}{addr.complement ? ` - ${addr.complement}` : ""} · {addr.neighborhood} · {addr.city}/{addr.state} · {addr.cep}
                                            </p>
                                        </div>

                                        <div className="p-5 border border-foreground/5" style={{ borderRadius: "var(--radius-card)" }}>
                                            <p className="text-foreground/40 mb-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.1em" }}>PAGAMENTO</p>
                                            <p className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                                                {paymentMethod === "pix" ? "Pix (5% desconto)" : paymentMethod === "credit" ? `Cartão de crédito final ${cardNumber.slice(-4)} · ${installments}x` : "Boleto bancário (3% desconto)"}
                                            </p>
                                        </div>

                                        <div className="p-5 border border-foreground/5" style={{ borderRadius: "var(--radius-card)" }}>
                                            <p className="text-foreground/40 mb-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.1em" }}>ITENS ({items.length})</p>
                                            <div className="space-y-3">
                                                {items.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-3">
                                                        <div className="w-12 h-12 flex-shrink-0 overflow-hidden" style={{ borderRadius: "var(--radius)", background: isDark ? "#1a1a1c" : "#f5f5f5" }}>
                                                            <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-foreground/60 truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{item.name}</p>
                                                            <p className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>Qtd: {item.quantity}</p>
                                                        </div>
                                                        <p className="text-foreground/50 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{item.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-8">
                                        <button onClick={() => setStep("payment")}
                                            className="px-6 py-3.5 border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/20 transition-all cursor-pointer"
                                            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                                        >Voltar</button>
                                        <button onClick={handlePlace} disabled={placing}
                                            className="px-8 py-3.5 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-60"
                                            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
                                        >
                                            {placing ? <><Loader2 size={16} className="animate-spin" /> Processando...</> : <><Lock size={14} /> Confirmar pedido</>}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right - Summary */}
                    <div className="w-full lg:w-[340px] flex-shrink-0">
                        <div className="sticky top-[100px] border border-foreground/5 p-6" style={{ borderRadius: "var(--radius-card)", background: "rgba(255,255,255,0.02)" }}>
                            <h3 className="text-foreground mb-5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px", fontWeight: "var(--font-weight-medium)" }}>Resumo</h3>

                            <div className="space-y-3 mb-5">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="w-10 h-10 flex-shrink-0 overflow-hidden" style={{ borderRadius: "var(--radius)", background: isDark ? "#1a1a1c" : "#f5f5f5" }}>
                                            <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-foreground/60 truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{item.name}</p>
                                            <p className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>Qtd: {item.quantity}</p>
                                        </div>
                                        <p className="text-foreground/50 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{item.price}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-foreground/5 mb-4" />

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Subtotal</span>
                                    <span className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Frete</span>
                                    <span className={shipping === 0 ? "text-green-500" : "text-foreground/60"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                                        {shipping === 0 ? "Grátis" : formatPrice(shipping)}
                                    </span>
                                </div>
                                {paymentMethod === "pix" && (
                                    <div className="flex justify-between">
                                        <span className="text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Desconto Pix (5%)</span>
                                        <span className="text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>-{formatPrice(total * 0.05)}</span>
                                    </div>
                                )}
                                {paymentMethod === "boleto" && (
                                    <div className="flex justify-between">
                                        <span className="text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Desconto Boleto (3%)</span>
                                        <span className="text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>-{formatPrice(total * 0.03)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-foreground/5 mb-4" />

                            <div className="flex justify-between">
                                <span className="text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Total</span>
                                <span className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>
                                    {formatPrice(paymentMethod === "pix" ? total * 0.95 : paymentMethod === "boleto" ? total * 0.97 : total)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mt-5 text-foreground/20">
                                <Shield size={13} />
                                <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>Compra 100% segura</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
