"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Truck,
  CreditCard,
  Loader2,
  Lock,
  ArrowRight,
  Zap,
  Wallet,
  Apple,
  Fingerprint,
  X,
  Copy,
  Clock,
  Ticket,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "./CartContext";
import { useCheckoutPrefs } from "./CheckoutPrefsContext";
import { Footer } from "./Footer";

type Step = 0 | 1 | 2 | 3;

const STEPS = [
  { key: 0, label: "Endereço", icon: MapPin },
  { key: 1, label: "Entrega", icon: Truck },
  { key: 2, label: "Pagamento", icon: CreditCard },
  { key: 3, label: "Revisão", icon: ShieldCheck },
] as const;

const COUPONS: Record<string, number> = {
  PCYES10: 10,
  PROMO20: 20,
  BEMVINDO: 15,
};

function parseBRL(s: string): number {
  return Number(s.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".")) || 0;
}

function formatBRL(n: number): string {
  return `R$ ${n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

const cardBg = "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)";
const cardBorder = "1px solid rgba(255,255,255,0.08)";
const inputBg = "rgba(255,255,255,0.03)";
const inputBorder = "1px solid rgba(255,255,255,0.1)";

interface Address {
  zip: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  recipient: string;
  phone: string;
}

interface ShippingOption {
  id: string;
  label: string;
  eta: string;
  price: number;
  badge?: string;
}

type PaymentMethod = "pix" | "credit" | "apple" | "google" | "boleto" | "mercadopago";
type WalletSheet = "apple" | "google" | "mercadopago" | null;

const inputClass =
  "w-full text-white placeholder:text-white/25 focus:outline-none transition-all";
const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "10px",
  border: inputBorder,
  background: inputBg,
  fontFamily: "var(--font-family-inter)",
  fontSize: "13.5px",
  fontWeight: 600,
  letterSpacing: "0.01em",
};

function Field({ label, children, required, className }: { label: string; children: React.ReactNode; required?: boolean; className?: string }) {
  return (
    <div className={className}>
      <label
        className="mb-1.5 block text-white/55"
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}
      >
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  );
}

function PaymentOption({
  icon,
  label,
  badge,
  active,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-3 transition-all"
      style={{
        borderRadius: "12px",
        background: active ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
        border: active ? `1.5px solid ${color ?? "var(--primary)"}` : "1px solid rgba(255,255,255,0.08)",
        boxShadow: active ? `0 14px 32px -16px ${color ?? "rgba(225,6,0,0.4)"}` : "none",
        color: active ? "#fff" : "rgba(255,255,255,0.65)",
      }}
    >
      <span style={{ color: active ? (color ?? "var(--primary)") : "rgba(255,255,255,0.55)" }}>{icon}</span>
      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.02em" }}>{label}</span>
      {badge && (
        <span
          className="ml-auto inline-flex items-center"
          style={{
            padding: "2px 6px",
            borderRadius: "6px",
            background: "rgba(34,197,94,0.15)",
            color: "#22c55e",
            fontFamily: "var(--font-family-inter)",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.04em",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function ReviewCard({ icon, label, onEdit, children }: { icon: React.ReactNode; label: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div
      className="rounded-[14px] p-4"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          {icon}
          {label}
        </span>
        <button
          onClick={onEdit}
          className="text-primary transition-opacity hover:opacity-70"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
        >
          Alterar
        </button>
      </div>
      {children}
    </div>
  );
}

function FakeQrCode() {
  const N = 25;
  const cell = 100 / N;
  const grid: number[][] = Array.from({ length: N }, () => Array.from({ length: N }, () => 0));

  const isFinder = (r: number, c: number, top: number, left: number) =>
    r >= top && r < top + 7 && c >= left && c < left + 7;

  const isFinderRing = (r: number, c: number, top: number, left: number) => {
    const dr = r - top, dc = c - left;
    if (dr === 0 || dr === 6 || dc === 0 || dc === 6) return true;
    if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) return true;
    return false;
  };

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const corners = [[0, 0], [0, N - 7], [N - 7, 0]] as const;
      let inFinder = false;
      let fill = false;
      for (const [tr, tc] of corners) {
        if (isFinder(r, c, tr, tc)) {
          inFinder = true;
          if (isFinderRing(r, c, tr, tc)) fill = true;
          break;
        }
      }
      if (!inFinder) {
        const inFinderSep =
          (r < 8 && c < 8) ||
          (r < 8 && c >= N - 8) ||
          (r >= N - 8 && c < 8);
        if (inFinderSep) {
          grid[r][c] = 0;
          continue;
        }
        if (r === 6) {
          grid[r][c] = c % 2 === 0 ? 1 : 0;
          continue;
        }
        if (c === 6) {
          grid[r][c] = r % 2 === 0 ? 1 : 0;
          continue;
        }
        const ar = N - 5;
        const ac = N - 5;
        if (r >= ar && r < ar + 5 && c >= ac && c < ac + 5) {
          const dr = r - ar, dc = c - ac;
          const ring =
            dr === 0 || dr === 4 || dc === 0 || dc === 4 || (dr === 2 && dc === 2);
          grid[r][c] = ring ? 1 : 0;
          continue;
        }
        const h = (r * 928371 + c * 1234567 + 9176) ^ ((r << 5) + c);
        fill = ((h * 2654435761) >>> 0) % 100 < 48;
      }
      grid[r][c] = fill ? 1 : 0;
    }
  }

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-label="QR Code PIX" shapeRendering="crispEdges">
      <rect x="0" y="0" width="100" height="100" fill="#fff" />
      {grid.map((row, r) =>
        row.map((v, c) =>
          v === 1 ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell}
              y={r * cell}
              width={cell + 0.05}
              height={cell + 0.05}
              fill="#000"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

function Line({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-family-inter)",
          fontSize: "13px",
          fontWeight: 700,
          color: positive ? "#22c55e" : "rgba(255,255,255,0.85)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function CheckoutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(0);
  const [address, setAddress] = useState<Address>({
    zip: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
    recipient: "",
    phone: "",
  });
  const [loadingCep, setLoadingCep] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<string>("sedex");
  const [payment, setPayment] = useState<PaymentMethod>("pix");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [installments, setInstallments] = useState(1);
  const { appliedCoupon, setAppliedCoupon, pointsApplied, setPointsApplied, pointsToUse, setPointsToUse } = useCheckoutPrefs();
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponOpen, setCouponOpen] = useState(false);
  const [pointsOpen, setPointsOpen] = useState(false);
  const userPoints = 480;
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedSnapshot, setConfirmedSnapshot] = useState<{
    items: typeof items;
    total: number;
    paymentLabel: string;
  } | null>(null);
  const [walletSheet, setWalletSheet] = useState<WalletSheet>(null);
  const [walletConfirming, setWalletConfirming] = useState(false);
  const [pixWaiting, setPixWaiting] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [pixTimer, setPixTimer] = useState(600);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => (item.isGift ? sum : sum + parseBRL(item.price) * item.quantity), 0),
    [items],
  );

  const shippingOptions: ShippingOption[] = useMemo(() => {
    if (subtotal === 0) return [];
    const free = subtotal >= 299;
    return [
      {
        id: "sedex",
        label: "Sedex Expresso",
        eta: "2 dias úteis",
        price: free ? 0 : 35.9,
        badge: free ? "GRÁTIS" : undefined,
      },
      {
        id: "pac",
        label: "PAC Econômico",
        eta: "7 dias úteis",
        price: free ? 0 : 14.9,
        badge: free ? "GRÁTIS" : undefined,
      },
      {
        id: "today",
        label: "Entrega no mesmo dia",
        eta: "Hoje · só capitais",
        price: 59.9,
        badge: "EXPRESS",
      },
    ];
  }, [subtotal]);

  const shippingPrice = shippingOptions.find((o) => o.id === selectedShipping)?.price ?? 0;
  const discountPct = appliedCoupon ? COUPONS[appliedCoupon] || 0 : 0;
  const discountValue = (subtotal * discountPct) / 100;
  const maxPointsRedeem = Math.min(userPoints, Math.floor((subtotal - discountValue) * 0.3));
  const pointsValue = pointsApplied ? Math.min(pointsToUse, maxPointsRedeem) : 0;
  const baseTotal = subtotal - discountValue + shippingPrice - pointsValue;
  const pixDiscount = payment === "pix" ? Math.max(0, (subtotal - discountValue - pointsValue)) * 0.1 : 0;
  const total = baseTotal - pixDiscount;

  const handleApplyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    if (COUPONS[c]) {
      setAppliedCoupon(c);
      setCouponError("");
      setCouponOpen(false);
    } else {
      setCouponError("Cupom inválido");
      setAppliedCoupon(null);
    }
  };

  const step0Valid = address.zip.length >= 9 && !!address.street && !!address.number && !!address.city && !!address.recipient;
  const step1Valid = !!selectedShipping;
  const step2Valid =
    payment === "pix" ||
    payment === "boleto" ||
    payment === "apple" ||
    payment === "google" ||
    (payment === "credit" && !!cardName && cardNumber.length >= 15 && cardExp.length === 5 && cardCvc.length >= 3);

  const canAdvance = step === 0 ? step0Valid : step === 1 ? step1Valid : step === 2 ? step2Valid : true;

  const formatCep = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  };
  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };
  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length > 6) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return d;
  };

  const handleCepLookup = async (zip: string) => {
    if (zip.replace(/\D/g, "").length !== 8) return;
    setLoadingCep(true);
    await new Promise((r) => setTimeout(r, 600));
    setAddress((a) => ({
      ...a,
      street: a.street || "Av. Pedro Taques",
      district: a.district || "Zona 02",
      city: a.city || "Maringá",
      state: a.state || "PR",
    }));
    setLoadingCep(false);
  };

  const paymentLabel = (() => {
    switch (payment) {
      case "pix": return "PIX · 10% OFF";
      case "credit": return `Cartão · ${installments}× sem juros`;
      case "apple": return "Apple Pay";
      case "google": return "Google Pay";
      case "mercadopago": return "Mercado Pago";
      case "boleto": return "Boleto";
    }
  })();

  const snapshot = () => ({ items: [...items], total, paymentLabel });

  const handleFinish = () => {
    if (payment === "pix") {
      setPixWaiting(true);
      return;
    }
    setConfirmedSnapshot(snapshot());
    setOrderConfirmed(true);
    clearCart();
  };

  const handleWalletConfirm = () => {
    setWalletConfirming(true);
    setTimeout(() => {
      setWalletConfirming(false);
      setWalletSheet(null);
      setConfirmedSnapshot(snapshot());
      setOrderConfirmed(true);
      clearCart();
    }, 1600);
  };

  // PIX waiting countdown + auto-confirm after ~8s
  useEffect(() => {
    if (!pixWaiting) return;
    const confirmTimer = setTimeout(() => {
      setConfirmedSnapshot(snapshot());
      setOrderConfirmed(true);
      clearCart();
    }, 8000);
    const tick = setInterval(() => setPixTimer((t) => Math.max(0, t - 1)), 1000);
    return () => {
      clearTimeout(confirmTimer);
      clearInterval(tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixWaiting]);

  useEffect(() => {
    if (pointsToUse > maxPointsRedeem) setPointsToUse(maxPointsRedeem);
  }, [maxPointsRedeem, pointsToUse]);

  const copyPix = () => {
    const code = "00020126360014BR.GOV.BCB.PIX0114pcyes@pcyes.com5204000053039865802BR5913PCYES Gamer6009Maringa62070503***6304ABCD";
    navigator.clipboard?.writeText(code);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  if (items.length === 0 && !orderConfirmed) {
    return (
      <>
        <div className="pt-[112px] md:pt-[142px]" style={{ background: "#0e0e0e", minHeight: "calc(100vh - 200px)" }}>
          <div className="mx-auto flex max-w-[640px] flex-col items-center px-5 py-24 text-center">
            <p
              className="mb-3 text-primary"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.3em" }}
            >
              // CHECKOUT VAZIO
            </p>
            <h1
              className="mb-6 text-white"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
              }}
            >
              Adicione itens ao carrinho primeiro
            </h1>
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-white transition-transform hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
                fontFamily: "var(--font-family-inter)",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                boxShadow: "0 14px 32px -8px rgba(225,6,0,0.55)",
              }}
            >
              Explorar produtos
              <ArrowRight size={14} strokeWidth={2.4} />
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (pixWaiting && !orderConfirmed) {
    const pixCode = "00020126360014BR.GOV.BCB.PIX0114pcyes@pcyes.com5204000053039865802BR5913PCYES Gamer6009Maringa62070503***6304ABCD";
    const m = Math.floor(pixTimer / 60).toString().padStart(2, "0");
    const s = (pixTimer % 60).toString().padStart(2, "0");
    return (
      <>
        <div className="pt-[80px] md:pt-[88px]" style={{ background: "#0e0e0e", minHeight: "calc(100vh - 120px)" }}>
          <div className="mx-auto max-w-[720px] px-5 py-10 md:px-8">
            <p
              className="mb-3 text-primary"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.3em" }}
            >
              // PEDIDO #{Math.floor(Math.random() * 90000 + 10000)}
            </p>
            <h1
              className="mb-2 text-white"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(28px, 3.5vw, 38px)",
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
              }}
            >
              Pague com PIX
            </h1>
            <p className="mb-6 text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", lineHeight: 1.55 }}>
              Escaneie o QR Code ou copie o código. Liberação instantânea.
            </p>

            <div
              className="overflow-hidden p-6 md:p-8"
              style={{
                borderRadius: "20px",
                background: cardBg,
                border: cardBorder,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 60px -20px rgba(0,0,0,0.5)",
              }}
            >
              {/* Status pill */}
              <div
                aria-live="polite"
                role="status"
                className="mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
                style={{
                  background: "rgba(255,193,7,0.1)",
                  border: "1px solid rgba(255,193,7,0.3)",
                  color: "#facc15",
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-65" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
                </span>
                Aguardando pagamento
              </div>

              {/* Timer */}
              <div className="mb-6 inline-flex items-center gap-2 text-white/75">
                <Clock size={15} strokeWidth={2.2} />
                <span
                  className="tabular-nums"
                  style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: 800, letterSpacing: "0.04em" }}
                >
                  {m}:{s}
                </span>
                <span className="text-white/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                  pra expirar
                </span>
              </div>

              <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                {/* QR Code */}
                <div
                  className="flex h-[220px] w-[220px] flex-shrink-0 items-center justify-center"
                  style={{
                    borderRadius: "16px",
                    background: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "12px",
                  }}
                >
                  <FakeQrCode />
                </div>

                {/* Right side */}
                <div className="flex-1 min-w-0">
                  <p className="mb-2 text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                    Valor a pagar
                  </p>
                  <p className="mb-5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "32px", fontWeight: 800, color: "#22c55e", letterSpacing: "-0.025em", lineHeight: 1 }}>
                    {formatBRL(total)}
                  </p>

                  <p className="mb-2 text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                    PIX copia e cola
                  </p>
                  <div
                    className="mb-3 break-all rounded-[10px] p-3 text-white/55"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: "11px",
                      lineHeight: 1.5,
                    }}
                  >
                    {pixCode.slice(0, 70)}…
                  </div>
                  <button
                    onClick={copyPix}
                    aria-label="Copiar código PIX"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-white transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60"
                    style={{
                      background: pixCopied
                        ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                        : "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "13px",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      boxShadow: pixCopied ? "0 14px 32px -8px rgba(34,197,94,0.55)" : "0 14px 32px -8px rgba(225,6,0,0.55)",
                    }}
                  >
                    {pixCopied ? <Check size={14} strokeWidth={2.6} /> : <Copy size={13} strokeWidth={2.4} />}
                    {pixCopied ? "Código copiado" : "Copiar código PIX"}
                  </button>
                </div>
              </div>

              <div
                className="mt-6 flex items-start gap-3 rounded-[12px] p-3.5"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <ShieldCheck size={14} strokeWidth={2} className="mt-0.5 flex-shrink-0 text-green-500" />
                <p className="text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: 1.55 }}>
                  Abra o app do seu banco, escolha PIX, escaneie o QR ou cole o código. A confirmação chega em segundos e atualizamos sua tela.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (orderConfirmed) {
    const snap = confirmedSnapshot;
    return (
      <>
        <div className="pt-[80px] md:pt-[88px]" style={{ background: "#0e0e0e", minHeight: "calc(100vh - 200px)" }}>
          <div className="mx-auto max-w-[720px] px-5 py-12 md:px-8">
            <div className="mb-10 flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="mb-7 flex h-24 w-24 items-center justify-center rounded-full text-white"
                style={{
                  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  boxShadow: "0 30px 80px -16px rgba(34,197,94,0.55), 0 0 0 6px rgba(34,197,94,0.12)",
                }}
              >
                <Check size={42} strokeWidth={3} />
              </motion.div>
              <p
                className="mb-3 text-primary"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.3em" }}
              >
                // GG PURCHASE · PEDIDO #{Math.floor(Math.random() * 90000 + 10000)}
              </p>
              <h1
                className="mb-4 text-white"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 700,
                  lineHeight: 1.04,
                  letterSpacing: "-0.025em",
                }}
              >
                Pedido confirmado!
              </h1>
              <p
                className="max-w-md text-white/60"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", lineHeight: 1.55 }}
              >
                Sua build tá a caminho. Os detalhes foram pro seu email.
              </p>
            </div>

            {snap && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="overflow-hidden p-6 md:p-7"
                style={{
                  borderRadius: "20px",
                  background: cardBg,
                  border: cardBorder,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 60px -20px rgba(0,0,0,0.5)",
                }}
              >
                <div className="mb-5 flex items-center justify-between">
                  <p
                    className="text-primary"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.3em" }}
                  >
                    // SUA BUILD
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      color: "#22c55e",
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "10.5px",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    <Truck size={11} strokeWidth={2.4} />
                    Em separação
                  </span>
                </div>

                <div className="space-y-3">
                  {snap.items.map((item, i) => (
                    <motion.div
                      key={item.cartKey}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                      className="flex items-center gap-3 rounded-[14px] p-3"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <div
                          className="h-full w-full overflow-hidden"
                          style={{
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-contain p-1.5" />
                        </div>
                        {item.quantity > 1 && (
                          <span
                            className="absolute -right-1.5 -top-1.5 z-10 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-white"
                            style={{
                              background: "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
                              fontFamily: "var(--font-family-inter)",
                              fontSize: "10px",
                              fontWeight: 800,
                              boxShadow: "0 4px 12px -4px rgba(225,6,0,0.55)",
                            }}
                          >
                            {item.quantity}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-white" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: 600, lineHeight: 1.3 }}>
                          {item.name}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "11.5px",
                            fontWeight: 700,
                            color: item.isGift ? "#22c55e" : "rgba(255,255,255,0.55)",
                            marginTop: "3px",
                          }}
                        >
                          {item.isGift ? "Brinde · Cortesia PCYES" : `${item.quantity}× ${item.price}`}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="my-5 h-px bg-white/5" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                      {snap.paymentLabel}
                    </p>
                    <p className="mt-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "26px", fontWeight: 800, color: "#22c55e", letterSpacing: "-0.02em" }}>
                      {formatBRL(snap.total)}
                    </p>
                  </div>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-white transition-transform hover:scale-[1.03]"
                    style={{
                      background: "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "12.5px",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      boxShadow: "0 14px 32px -8px rgba(225,6,0,0.55)",
                    }}
                  >
                    Voltar pra home
                    <ArrowRight size={13} strokeWidth={2.4} />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="pt-[80px] md:pt-[88px]" style={{ background: "#0e0e0e", minHeight: "100vh" }}>
        <div className="mx-auto max-w-[1320px] px-5 py-4 md:px-8 md:py-6">
          <Link
            to="/carrinho"
            className="mb-4 inline-flex items-center gap-1.5 text-white/45 transition-colors hover:text-white/75"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
          >
            <ChevronLeft size={14} strokeWidth={2} />
            Voltar pro carrinho
          </Link>

          <div className="mb-6">
            <p
              className="mb-2 text-primary"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.3em" }}
            >
              // CHECKOUT
            </p>
            <h1
              className="text-white"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(26px, 3vw, 36px)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
              }}
            >
              Finalize seu pedido
            </h1>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const active = step === s.key;
                const done = step > s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => done && setStep(s.key as Step)}
                    disabled={!done}
                    className="flex flex-1 items-center gap-2 disabled:cursor-not-allowed"
                  >
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all"
                      style={{
                        background: active
                          ? "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)"
                          : done
                          ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                          : "rgba(255,255,255,0.06)",
                        border: active || done ? "none" : "1px solid rgba(255,255,255,0.1)",
                        color: active || done ? "#fff" : "rgba(255,255,255,0.4)",
                        boxShadow: active
                          ? "0 8px 22px -6px rgba(225,6,0,0.5)"
                          : done
                          ? "0 8px 22px -6px rgba(34,197,94,0.45)"
                          : "none",
                      }}
                    >
                      {done ? <Check size={14} strokeWidth={2.6} /> : <Icon size={14} strokeWidth={2.2} />}
                    </div>
                    <span
                      className={`hidden md:inline ${active ? "text-white" : done ? "text-white/70" : "text-white/35"}`}
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em" }}
                    >
                      {s.label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div className="hidden h-px flex-1 md:block" style={{ background: done ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)" }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
            <div className="min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden p-6 md:p-8"
                  style={{
                    borderRadius: "20px",
                    background: cardBg,
                    border: cardBorder,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  {step === 0 && (
                    <>
                      <h2
                        className="mb-2 text-white"
                        style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}
                      >
                        Endereço de entrega
                      </h2>
                      <p className="mb-6 text-white/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                        Pra onde mandamos sua build?
                      </p>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="CEP" required>
                          <div className="relative">
                            <input
                              inputMode="numeric"
                              value={address.zip}
                              placeholder="00000-000"
                              onChange={(e) => {
                                const v = formatCep(e.target.value);
                                setAddress((a) => ({ ...a, zip: v }));
                                if (v.replace(/\D/g, "").length === 8) handleCepLookup(v);
                              }}
                              className={inputClass}
                              style={inputStyle}
                            />
                            {loadingCep && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-white/60" />}
                          </div>
                        </Field>
                        <Field label="Destinatário" required>
                          <input
                            value={address.recipient}
                            placeholder="Quem vai receber?"
                            onChange={(e) => setAddress((a) => ({ ...a, recipient: e.target.value }))}
                            className={inputClass}
                            style={inputStyle}
                          />
                        </Field>
                        <Field label="Rua / Avenida" required className="md:col-span-2">
                          <input
                            value={address.street}
                            placeholder="Nome da rua"
                            onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
                            className={inputClass}
                            style={inputStyle}
                          />
                        </Field>
                        <Field label="Número" required>
                          <input
                            value={address.number}
                            placeholder="123"
                            onChange={(e) => setAddress((a) => ({ ...a, number: e.target.value.replace(/\D/g, "") }))}
                            className={inputClass}
                            style={inputStyle}
                          />
                        </Field>
                        <Field label="Complemento (opcional)">
                          <input
                            value={address.complement}
                            placeholder="Apto, bloco, etc."
                            onChange={(e) => setAddress((a) => ({ ...a, complement: e.target.value }))}
                            className={inputClass}
                            style={inputStyle}
                          />
                        </Field>
                        <Field label="Bairro">
                          <input
                            value={address.district}
                            placeholder="Bairro"
                            onChange={(e) => setAddress((a) => ({ ...a, district: e.target.value }))}
                            className={inputClass}
                            style={inputStyle}
                          />
                        </Field>
                        <Field label="Cidade" required>
                          <input
                            value={address.city}
                            placeholder="Cidade"
                            onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                            className={inputClass}
                            style={inputStyle}
                          />
                        </Field>
                        <Field label="Estado">
                          <input
                            value={address.state}
                            placeholder="UF"
                            maxLength={2}
                            onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value.toUpperCase() }))}
                            className={inputClass}
                            style={inputStyle}
                          />
                        </Field>
                        <Field label="Telefone">
                          <input
                            inputMode="numeric"
                            value={address.phone}
                            placeholder="(00) 00000-0000"
                            onChange={(e) => setAddress((a) => ({ ...a, phone: formatPhone(e.target.value) }))}
                            className={inputClass}
                            style={inputStyle}
                          />
                        </Field>
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <h2 className="mb-2 text-white" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                        Como entregar?
                      </h2>
                      <p className="mb-6 text-white/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                        Para {address.city || "—"}/{address.state || "—"}
                      </p>
                      <div className="flex flex-col gap-3">
                        {shippingOptions.map((opt) => {
                          const active = selectedShipping === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setSelectedShipping(opt.id)}
                              className="flex items-center gap-4 p-4 text-left transition-all"
                              style={{
                                borderRadius: "14px",
                                background: active ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.02)",
                                border: active ? "1.5px solid rgba(34,197,94,0.5)" : "1px solid rgba(255,255,255,0.08)",
                                boxShadow: active ? "0 16px 36px -16px rgba(34,197,94,0.35)" : "none",
                              }}
                            >
                              <div
                                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                                style={{
                                  background: active ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" : "transparent",
                                  border: active ? "none" : "1.5px solid rgba(255,255,255,0.25)",
                                }}
                              >
                                {active && <Check size={11} strokeWidth={3} className="text-white" />}
                              </div>
                              <Truck size={18} strokeWidth={1.8} className={active ? "text-green-400" : "text-white/55"} />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-white" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: 700 }}>
                                    {opt.label}
                                  </p>
                                  {opt.badge && (
                                    <span
                                      className="inline-flex items-center text-white"
                                      style={{
                                        padding: "2px 8px",
                                        borderRadius: "999px",
                                        background:
                                          opt.badge === "GRÁTIS"
                                            ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                                            : "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
                                        fontFamily: "var(--font-family-inter)",
                                        fontSize: "9.5px",
                                        fontWeight: 800,
                                        letterSpacing: "0.1em",
                                      }}
                                    >
                                      {opt.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-white/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", marginTop: 2 }}>
                                  {opt.eta}
                                </p>
                              </div>
                              <p
                                className="flex-shrink-0"
                                style={{
                                  fontFamily: "var(--font-family-figtree)",
                                  fontSize: "16px",
                                  fontWeight: 800,
                                  color: opt.price === 0 ? "#22c55e" : "#fff",
                                  letterSpacing: "-0.015em",
                                }}
                              >
                                {opt.price === 0 ? "Grátis" : formatBRL(opt.price)}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <h2 className="mb-2 text-white" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                        Como vai pagar?
                      </h2>
                      <p className="mb-6 text-white/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                        Escolha um método. PIX dá 10% off automático.
                      </p>

                      {/* Express checkout — 1-click */}
                      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3 mb-5">
                        <button
                          onClick={() => { setPayment("apple"); setWalletSheet("apple"); }}
                          aria-label="Pagar com Apple Pay"
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
                          style={{
                            background: "#000",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.14)",
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "13.5px",
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                          }}
                        >
                          <Apple size={16} strokeWidth={1.8} fill="currentColor" />
                          <span className="font-light">Pay</span>
                        </button>
                        <button
                          onClick={() => { setPayment("google"); setWalletSheet("google"); }}
                          aria-label="Pagar com Google Pay"
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
                          style={{
                            background: "#fff",
                            color: "#000",
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "13.5px",
                            fontWeight: 700,
                            boxShadow: "0 4px 14px -4px rgba(0,0,0,0.4)",
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                            <path d="M22 11.4c0-.7-.06-1.4-.18-2.05H12v3.87h5.62c-.24 1.3-.97 2.4-2.06 3.13v2.6h3.33C20.83 17.2 22 14.55 22 11.4z" fill="#4285F4" />
                            <path d="M12 22c2.78 0 5.12-.92 6.83-2.5l-3.33-2.6c-.92.62-2.1.99-3.5.99-2.7 0-4.97-1.82-5.78-4.27H2.78v2.68C4.48 19.6 8 22 12 22z" fill="#34A853" />
                            <path d="M6.22 13.62c-.2-.62-.32-1.28-.32-1.96s.12-1.34.32-1.96V7.02H2.78A9.99 9.99 0 002 12c0 1.6.38 3.13 1.05 4.47l3.17-2.85z" fill="#FBBC05" />
                            <path d="M12 5.78c1.52 0 2.88.52 3.95 1.55l2.96-2.96C17.12 2.83 14.78 2 12 2 8 2 4.48 4.4 2.78 7.02l3.44 2.68C7.03 7.6 9.3 5.78 12 5.78z" fill="#EA4335" />
                          </svg>
                          Pay
                        </button>
                        <button
                          onClick={() => { setPayment("mercadopago"); setWalletSheet("mercadopago"); }}
                          aria-label="Pagar com Mercado Pago"
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
                          style={{
                            background: "#009ee3",
                            color: "#fff",
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "13.5px",
                            fontWeight: 800,
                            letterSpacing: "0.02em",
                            boxShadow: "0 8px 22px -8px rgba(0,158,227,0.55)",
                          }}
                        >
                          <svg width="18" height="14" viewBox="0 0 30 22" fill="none" aria-hidden>
                            <ellipse cx="15" cy="11" rx="14" ry="9" fill="#FFF159" />
                            <path d="M9 12c1.5-2 4-3 6-3s4.5 1 6 3" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" fill="none" />
                          </svg>
                          Mercado Pago
                        </button>
                      </div>

                      {/* Divider OR */}
                      <div className="mb-5 flex items-center gap-4">
                        <div className="h-px flex-1 bg-white/8" />
                        <span
                          className="text-white/35"
                          style={{ fontFamily: "var(--font-family-inter)", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" }}
                        >
                          ou
                        </span>
                        <div className="h-px flex-1 bg-white/8" />
                      </div>

                      {/* Traditional methods */}
                      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3 mb-6">
                        <PaymentOption icon={<Zap size={16} strokeWidth={2.4} fill="currentColor" />} label="PIX" badge="-10%" active={payment === "pix"} onClick={() => setPayment("pix")} color="#22c55e" />
                        <PaymentOption icon={<CreditCard size={16} strokeWidth={2} />} label="Cartão" active={payment === "credit"} onClick={() => setPayment("credit")} />
                        <PaymentOption icon={<Wallet size={16} strokeWidth={2} />} label="Boleto" active={payment === "boleto"} onClick={() => setPayment("boleto")} />
                      </div>

                      <AnimatePresence mode="wait">
                        {payment === "credit" && (
                          <motion.div
                            key="credit"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-2">
                              <Field label="Nome no cartão" required className="md:col-span-2">
                                <input
                                  value={cardName}
                                  placeholder="Como está impresso"
                                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                  className={inputClass}
                                  style={inputStyle}
                                />
                              </Field>
                              <Field label="Número do cartão" required className="md:col-span-2">
                                <div className="relative">
                                  <input
                                    inputMode="numeric"
                                    value={cardNumber}
                                    placeholder="0000 0000 0000 0000"
                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                    className={inputClass}
                                    style={{ ...inputStyle, paddingRight: "60px" }}
                                  />
                                  <CardBrand digits={cardNumber.replace(/\D/g, "")} />
                                </div>
                              </Field>
                              <Field label="Validade" required>
                                <input
                                  inputMode="numeric"
                                  value={cardExp}
                                  placeholder="MM/AA"
                                  onChange={(e) => setCardExp(formatExp(e.target.value))}
                                  className={inputClass}
                                  style={inputStyle}
                                />
                              </Field>
                              <Field label="CVC" required>
                                <input
                                  inputMode="numeric"
                                  value={cardCvc}
                                  placeholder="000"
                                  maxLength={3}
                                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                                  className={inputClass}
                                  style={inputStyle}
                                />
                              </Field>
                              <Field label="Parcelas" className="md:col-span-2">
                                <select
                                  value={installments}
                                  onChange={(e) => setInstallments(Number(e.target.value))}
                                  className={inputClass}
                                  style={inputStyle}
                                >
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                    <option key={n} value={n} style={{ background: "#1f1c1c" }}>
                                      {n}× {formatBRL(baseTotal / n)} sem juros
                                    </option>
                                  ))}
                                </select>
                              </Field>
                            </div>
                          </motion.div>
                        )}

                        {payment === "pix" && (
                          <motion.div
                            key="pix"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div
                              className="flex items-start gap-3 rounded-[14px] p-4"
                              style={{
                                background: "rgba(34,197,94,0.06)",
                                border: "1px solid rgba(34,197,94,0.25)",
                              }}
                            >
                              <Zap size={18} strokeWidth={2.4} className="mt-0.5 text-green-400 flex-shrink-0" fill="currentColor" />
                              <div>
                                <p className="text-green-300" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 700 }}>
                                  10% OFF automático no PIX
                                </p>
                                <p className="mt-1 text-white/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: 1.5 }}>
                                  Após finalizar, vamos gerar o QR Code pra pagamento instantâneo. Compensação em até 1 minuto.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {(payment === "apple" || payment === "google") && (
                          <motion.div key="wallet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <p className="text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", lineHeight: 1.5 }}>
                              Autenticação acontece direto no seu dispositivo. Toque em finalizar pra abrir o {payment === "apple" ? "Apple Pay" : "Google Pay"}.
                            </p>
                          </motion.div>
                        )}

                        {payment === "boleto" && (
                          <motion.div key="boleto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <p className="text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", lineHeight: 1.5 }}>
                              Boleto gerado após confirmação. Vencimento em 3 dias úteis. Compensação em até 2 dias úteis após pagamento.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <h2 className="mb-2 text-white" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                        Revisão final
                      </h2>
                      <p className="mb-6 text-white/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                        Confirme se tá tudo certo antes de fechar.
                      </p>

                      <div className="space-y-4">
                        <ReviewCard icon={<MapPin size={14} strokeWidth={2} />} label="Endereço" onEdit={() => setStep(0)}>
                          <p className="text-white" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600 }}>
                            {address.recipient}
                          </p>
                          <p className="text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", lineHeight: 1.5 }}>
                            {address.street}, {address.number}
                            {address.complement ? ` · ${address.complement}` : ""}
                          </p>
                          <p className="text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px" }}>
                            {address.district} · {address.city}/{address.state} · {address.zip}
                          </p>
                        </ReviewCard>

                        <ReviewCard icon={<Truck size={14} strokeWidth={2} />} label="Entrega" onEdit={() => setStep(1)}>
                          {shippingOptions.find((o) => o.id === selectedShipping) && (
                            <p className="text-white" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600 }}>
                              {shippingOptions.find((o) => o.id === selectedShipping)!.label}{" "}
                              <span className="text-white/55 font-normal">· {shippingOptions.find((o) => o.id === selectedShipping)!.eta}</span>
                            </p>
                          )}
                        </ReviewCard>

                        <ReviewCard icon={<CreditCard size={14} strokeWidth={2} />} label="Pagamento" onEdit={() => setStep(2)}>
                          <p className="text-white" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600 }}>
                            {payment === "pix" && "PIX · 10% OFF automático"}
                            {payment === "credit" && `Cartão de crédito · ${installments}× sem juros`}
                            {payment === "apple" && "Apple Pay"}
                            {payment === "google" && "Google Pay"}
                            {payment === "boleto" && "Boleto bancário"}
                          </p>
                        </ReviewCard>

                        <div
                          className="rounded-[14px] p-4"
                          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <p
                            className="mb-3 text-white/55"
                            style={{ fontFamily: "var(--font-family-inter)", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}
                          >
                            Itens ({items.length})
                          </p>
                          <div className="space-y-3">
                            {items.map((item) => (
                              <div key={item.cartKey} className="flex items-center gap-3">
                                <div
                                  className="h-12 w-12 flex-shrink-0 overflow-hidden"
                                  style={{
                                    borderRadius: "10px",
                                    background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                  }}
                                >
                                  <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-contain p-1.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="line-clamp-1 text-white" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", fontWeight: 600 }}>
                                    {item.name}
                                  </p>
                                  <p className="text-white/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                                    {item.quantity}× {item.isGift ? "Brinde" : item.price}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  onClick={() => (step === 0 ? navigate("/carrinho") : setStep((s) => (s - 1) as Step))}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-5 py-3 text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  <ChevronLeft size={14} strokeWidth={2.4} />
                  Voltar
                </button>

                {step < 3 ? (
                  <button
                    onClick={() => setStep((s) => (s + 1) as Step)}
                    disabled={!canAdvance}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full px-7 py-3 text-white transition-transform hover:scale-[1.03] active:scale-[0.97] disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "12.5px",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      boxShadow: "0 14px 32px -8px rgba(225,6,0,0.55)",
                    }}
                  >
                    Continuar
                    <ChevronRight size={14} strokeWidth={2.6} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full px-7 py-3 text-white transition-transform hover:scale-[1.03] active:scale-[0.97]"
                    style={{
                      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "12.5px",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      boxShadow: "0 14px 32px -8px rgba(34,197,94,0.55)",
                    }}
                  >
                    <Lock size={13} strokeWidth={2.6} />
                    Finalizar pedido
                  </button>
                )}
              </div>
            </div>

            <div className="lg:sticky lg:top-[150px] lg:self-start">
              <div
                className="overflow-hidden p-6"
                style={{
                  borderRadius: "20px",
                  background: cardBg,
                  border: cardBorder,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 60px -20px rgba(0,0,0,0.5)",
                }}
              >
                <p
                  className="mb-5 text-primary"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.3em" }}
                >
                  // RESUMO
                </p>

                <div className="mb-4 max-h-[280px] space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.cartKey} className="flex items-center gap-3">
                      <div className="relative h-14 w-14 flex-shrink-0">
                        <div
                          className="h-full w-full overflow-hidden"
                          style={{
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                          }}
                        >
                          <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-contain p-1.5" />
                        </div>
                        {item.quantity > 1 && (
                          <span
                            aria-label={`Quantidade ${item.quantity}`}
                            className="absolute -right-1.5 -top-1.5 z-10 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-white"
                            style={{
                              background: "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
                              fontFamily: "var(--font-family-inter)",
                              fontSize: "10px",
                              fontWeight: 800,
                              boxShadow: "0 4px 12px -4px rgba(225,6,0,0.55)",
                            }}
                          >
                            {item.quantity}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-white/80" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 600, lineHeight: 1.3 }}>
                          {item.name}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "11.5px",
                            fontWeight: 700,
                            color: item.isGift ? "#22c55e" : "rgba(255,255,255,0.85)",
                            marginTop: "2px",
                          }}
                        >
                          {item.isGift ? "Brinde · Grátis" : item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-white/5 mb-4" />

                {/* Cupom inline (CheckoutPage) */}
                <div className="mb-3">
                  <button
                    onClick={() => setCouponOpen((v) => !v)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2.5 transition-colors ${
                      appliedCoupon ? "rounded-[12px] border border-green-500/25 bg-green-500/[0.06]" : "rounded-[12px] border border-white/8 hover:border-white/14 hover:bg-white/[0.03]"
                    }`}
                    aria-expanded={couponOpen}
                  >
                    <span className="flex items-center gap-2">
                      {appliedCoupon ? <Check size={13} className="text-green-500" strokeWidth={2.4} /> : <Ticket size={13} className="text-white/45" strokeWidth={2} />}
                      <span
                        className={appliedCoupon ? "text-green-400" : "text-white/65"}
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: appliedCoupon ? 700 : 600 }}
                      >
                        {appliedCoupon ? `${appliedCoupon} aplicado` : "Tenho um cupom"}
                      </span>
                      {appliedCoupon && (
                        <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "10.5px", fontWeight: 700, color: "rgba(34,197,94,0.75)" }}>
                          −{discountPct}%
                        </span>
                      )}
                    </span>
                    <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "10.5px", fontWeight: 700, color: appliedCoupon ? "rgba(34,197,94,0.75)" : "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {appliedCoupon ? "Alterar" : "Adicionar"}
                    </span>
                  </button>
                  <AnimatePresence>
                    {couponOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text"
                            placeholder="Ex: PCYES10"
                            value={coupon}
                            onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponError(""); }}
                            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                            aria-label="Código do cupom"
                            className="flex-1 rounded-[10px] px-3 py-2 text-white placeholder:text-white/25 focus:outline-none"
                            style={{
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              fontFamily: "var(--font-family-inter)",
                              fontSize: "12.5px",
                              fontWeight: 600,
                            }}
                          />
                          <button
                            onClick={handleApplyCoupon}
                            disabled={!coupon.trim()}
                            className="cursor-pointer rounded-[10px] px-4 py-2 text-white transition-transform hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                            style={{
                              background: "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
                              fontFamily: "var(--font-family-inter)",
                              fontSize: "11px",
                              fontWeight: 800,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              boxShadow: "0 8px 22px -8px rgba(225,6,0,0.55)",
                            }}
                          >
                            Aplicar
                          </button>
                        </div>
                        {couponError && (
                          <p className="mt-2 text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 600 }}>
                            {couponError}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* PCYES Points inline (CheckoutPage) */}
                <div
                  className={`mb-4 overflow-hidden rounded-[12px] transition-colors ${
                    pointsApplied
                      ? "border border-yellow-300/40 bg-yellow-300/[0.05]"
                      : "border border-white/8 hover:border-yellow-300/35 hover:bg-yellow-300/[0.05]"
                  }`}
                >
                  <button
                    onClick={() => { setPointsApplied((v) => !v); setPointsOpen((v) => !v); }}
                    className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2.5"
                    aria-expanded={pointsApplied}
                  >
                    <span className="flex items-center gap-2">
                      <PcyesCoinSmall />
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 700, color: pointsApplied ? "#facc15" : "rgba(255,255,255,0.78)" }}>
                        PCYES Points
                      </span>
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "10.5px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
                        {userPoints} pts
                      </span>
                    </span>
                    <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "10.5px", fontWeight: 800, letterSpacing: "0.1em", color: pointsApplied ? "#facc15" : "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
                      {pointsApplied ? "Aplicado" : "Usar"}
                    </span>
                  </button>
                  <AnimatePresence>
                    {pointsApplied && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t px-3 pb-3 pt-3" style={{ borderColor: "rgba(250,204,21,0.2)" }}>
                          <div className="mb-2.5 flex items-center justify-between gap-3">
                            <NumberStepperRed
                              value={pointsToUse}
                              onChange={setPointsToUse}
                              max={maxPointsRedeem}
                              step={10}
                            />
                            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "10.5px", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                              de {maxPointsRedeem}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={maxPointsRedeem}
                            step={10}
                            value={pointsToUse}
                            onChange={(e) => setPointsToUse(Number(e.target.value))}
                            aria-label="Slider de pontos PCYES"
                            className="w-full"
                            style={{ accentColor: "#facc15" }}
                          />
                          <p className="mt-2 text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10.5px" }}>
                            Economia: <span style={{ color: "#facc15", fontWeight: 800 }}>{formatBRL(pointsValue)}</span>
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mb-4 space-y-2">
                  <Line label="Subtotal" value={formatBRL(subtotal)} />
                  {discountValue > 0 && <Line label={`Cupom ${appliedCoupon}`} value={`−${formatBRL(discountValue)}`} positive />}
                  <Line label="Frete" value={shippingPrice === 0 ? "Grátis" : formatBRL(shippingPrice)} positive={shippingPrice === 0} />
                  {pointsValue > 0 && (
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "#facc15", fontWeight: 600 }}>
                        PCYES Points
                      </span>
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "#facc15", fontWeight: 700 }}>
                        −{formatBRL(pointsValue)}
                      </span>
                    </div>
                  )}
                  {pixDiscount > 0 && <Line label="Desconto PIX (10%)" value={`−${formatBRL(pixDiscount)}`} positive />}
                </div>

                <div
                  className="rounded-[14px] p-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Total
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-family-figtree)",
                        fontSize: "26px",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        color: payment === "pix" ? "#22c55e" : "#fff",
                      }}
                    >
                      {formatBRL(total)}
                    </span>
                  </div>
                  {payment !== "pix" && (
                    <p className="mt-1 text-white/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                      ou no PIX por {formatBRL(total - (subtotal - discountValue) * 0.1)}{" "}
                      <span className="text-green-400 font-bold">−10%</span>
                    </p>
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-2 text-white/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 600 }}>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={12} strokeWidth={2} className="text-green-500" />
                    Compra 100% segura · SSL
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Truck size={12} strokeWidth={2} className="text-white/55" />
                    Frete grátis acima de R$ 299
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Apple Pay sheet */}
      <AnimatePresence>
        {walletSheet === "apple" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !walletConfirming && setWalletSheet(null)}
            className="fixed inset-0 z-[120] flex items-end justify-center bg-black/80 backdrop-blur-md md:items-center"
            role="dialog"
            aria-modal="true"
            aria-label="Apple Pay"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[480px] overflow-hidden"
              style={{
                background: "#1d1d1f",
                color: "#fff",
                borderRadius: "20px 20px 0 0",
                boxShadow: "0 -40px 100px rgba(0,0,0,0.55)",
              }}
            >
              <div className="flex items-center justify-between px-5 pb-3 pt-4">
                <span className="inline-flex items-center gap-1 text-white" style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", fontWeight: 600 }}>
                  <Apple size={17} strokeWidth={1.8} fill="currentColor" />
                  <span className="font-light">Pay</span>
                </span>
                <button
                  onClick={() => !walletConfirming && setWalletSheet(null)}
                  aria-label="Fechar Apple Pay"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="h-px bg-white/8" />

              <div className="px-5 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>PCYES Gamer</span>
                  <span style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em" }}>{formatBRL(total)}</span>
                </div>

                <div className="mb-3 rounded-[12px] p-3.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>Pagar com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-12 items-center justify-center rounded-[6px]" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: 800, color: "#fff" }}>VISA</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600 }}>Apple Card</p>
                      <p className="text-white/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>•••• 4231</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3 flex items-center justify-between text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                  <span>Enviar para</span>
                  <span className="text-white">{address.city || "Maringá"}, {address.state || "PR"}</span>
                </div>
                <div className="flex items-center justify-between text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                  <span>Email</span>
                  <span className="text-white">j****@icloud.com</span>
                </div>
              </div>

              <div className="border-t border-white/8 px-5 py-5">
                <div className="mb-3 flex flex-col items-center gap-2">
                  <motion.div
                    animate={walletConfirming ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                    transition={{ duration: 1.2, repeat: walletConfirming ? Infinity : 0 }}
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ background: walletConfirming ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    {walletConfirming ? (
                      <Loader2 size={22} className="animate-spin text-green-400" strokeWidth={2.4} />
                    ) : (
                      <Fingerprint size={22} strokeWidth={1.6} className="text-white" />
                    )}
                  </motion.div>
                  <p className="text-center text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11.5px" }}>
                    {walletConfirming ? "Autenticando..." : "Pressione 2× no botão lateral pra confirmar"}
                  </p>
                </div>
                <button
                  onClick={handleWalletConfirm}
                  disabled={walletConfirming}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "#fff",
                    color: "#000",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  <Apple size={16} strokeWidth={1.8} fill="currentColor" />
                  Pagar com Face ID
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {walletSheet === "google" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !walletConfirming && setWalletSheet(null)}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Google Pay"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] overflow-hidden"
              style={{
                background: "#fff",
                borderRadius: "20px",
                boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
              }}
            >
              <div className="flex items-center justify-between px-5 pb-3 pt-5">
                <div className="inline-flex items-center gap-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 600, color: "#5f6368" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                    <path d="M22 11.4c0-.7-.06-1.4-.18-2.05H12v3.87h5.62c-.24 1.3-.97 2.4-2.06 3.13v2.6h3.33C20.83 17.2 22 14.55 22 11.4z" fill="#4285F4" />
                    <path d="M12 22c2.78 0 5.12-.92 6.83-2.5l-3.33-2.6c-.92.62-2.1.99-3.5.99-2.7 0-4.97-1.82-5.78-4.27H2.78v2.68C4.48 19.6 8 22 12 22z" fill="#34A853" />
                    <path d="M6.22 13.62c-.2-.62-.32-1.28-.32-1.96s.12-1.34.32-1.96V7.02H2.78A9.99 9.99 0 002 12c0 1.6.38 3.13 1.05 4.47l3.17-2.85z" fill="#FBBC05" />
                    <path d="M12 5.78c1.52 0 2.88.52 3.95 1.55l2.96-2.96C17.12 2.83 14.78 2 12 2 8 2 4.48 4.4 2.78 7.02l3.44 2.68C7.03 7.6 9.3 5.78 12 5.78z" fill="#EA4335" />
                  </svg>
                  Pay
                </div>
                <button onClick={() => !walletConfirming && setWalletSheet(null)} aria-label="Fechar Google Pay" className="text-[#5f6368] hover:bg-black/[0.06] rounded-full h-8 w-8 flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>

              <div className="px-5 pb-2">
                <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "#5f6368" }}>Pagando para</p>
                <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", fontWeight: 600, color: "#202124" }}>PCYES Gamer</p>
                <p className="mt-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "32px", fontWeight: 700, color: "#202124", letterSpacing: "-0.02em" }}>
                  {formatBRL(total)}
                </p>
              </div>

              <div className="mt-4 mx-5 mb-5 rounded-[12px] border" style={{ borderColor: "#dadce0" }}>
                <button className="flex w-full items-center gap-3 p-4 text-left">
                  <div className="flex h-10 w-12 items-center justify-center rounded-[6px]" style={{ background: "#1a73e8" }}>
                    <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: 800, color: "#fff" }}>VISA</span>
                  </div>
                  <div className="flex-1">
                    <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: 500, color: "#202124" }}>Visa •••• 4231</p>
                    <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", color: "#5f6368" }}>Pagamento padrão</p>
                  </div>
                  <Check size={18} strokeWidth={2} className="text-[#1a73e8]" />
                </button>
              </div>

              <div className="bg-[#f8f9fa] px-5 py-4">
                <button
                  onClick={handleWalletConfirm}
                  disabled={walletConfirming}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "#1a73e8",
                    color: "#fff",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "14px",
                    fontWeight: 700,
                    boxShadow: "0 4px 14px -4px rgba(26,115,232,0.4)",
                  }}
                >
                  {walletConfirming ? <Loader2 size={16} className="animate-spin" /> : null}
                  {walletConfirming ? "Processando..." : "Pagar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {walletSheet === "mercadopago" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !walletConfirming && setWalletSheet(null)}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Mercado Pago"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[440px] overflow-hidden"
              style={{
                background: "#fff",
                borderRadius: "20px",
                boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
              }}
            >
              <div className="flex items-center justify-between px-5 py-4" style={{ background: "#FFF159" }}>
                <div className="inline-flex items-center gap-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", fontWeight: 800, color: "#009ee3" }}>
                  <svg width="22" height="16" viewBox="0 0 30 22" aria-hidden>
                    <ellipse cx="15" cy="11" rx="14" ry="9" fill="#009ee3" />
                    <path d="M9 12c1.5-2 4-3 6-3s4.5 1 6 3" stroke="#FFF159" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                  Mercado Pago
                </div>
                <button onClick={() => !walletConfirming && setWalletSheet(null)} aria-label="Fechar Mercado Pago" className="text-[#009ee3] hover:bg-black/[0.06] rounded-full h-8 w-8 flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>

              <div className="px-6 py-6">
                <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", color: "#737373", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>
                  Valor a pagar
                </p>
                <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "32px", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
                  {formatBRL(total)}
                </p>
                <p className="mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", color: "#737373" }}>
                  PCYES Gamer · pedido #PCY{Math.floor(Math.random() * 90000 + 10000)}
                </p>

                <div className="mt-5 space-y-2">
                  <button className="flex w-full items-center gap-3 rounded-[12px] border p-3.5 text-left transition-colors hover:bg-[#f5f5f5]" style={{ borderColor: "#009ee3", background: "rgba(0,158,227,0.05)" }}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "#009ee3", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: 800 }}>
                      MP
                    </div>
                    <div className="flex-1">
                      <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 700, color: "#1a1a1a" }}>Saldo Mercado Pago</p>
                      <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", color: "#737373" }}>R$ 2.349,80 disponível</p>
                    </div>
                    <Check size={18} strokeWidth={2.4} className="text-[#009ee3]" />
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-[12px] border p-3.5 text-left transition-colors hover:bg-[#f5f5f5]" style={{ borderColor: "#dadce0" }}>
                    <div className="flex h-9 w-12 items-center justify-center rounded-[6px]" style={{ background: "#eb001b" }}>
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: 800, color: "#fff" }}>MC</span>
                    </div>
                    <div className="flex-1">
                      <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600, color: "#1a1a1a" }}>Mastercard •••• 8821</p>
                      <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", color: "#737373" }}>Crédito</p>
                    </div>
                  </button>
                </div>

                <button
                  onClick={handleWalletConfirm}
                  disabled={walletConfirming}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "#009ee3",
                    color: "#fff",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "14px",
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    boxShadow: "0 8px 22px -8px rgba(0,158,227,0.55)",
                  }}
                >
                  {walletConfirming ? <Loader2 size={16} className="animate-spin" /> : <Lock size={14} strokeWidth={2.4} />}
                  {walletConfirming ? "Processando..." : "Pagar agora"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CardBrand({ digits }: { digits: string }) {
  if (digits.length < 1) return null;
  const first = digits[0];
  const first2 = digits.slice(0, 2);
  let brand: "visa" | "master" | "amex" | "elo" | "hiper" | null = null;
  if (first === "4") brand = "visa";
  else if (["51", "52", "53", "54", "55"].includes(first2) || (Number(first2) >= 22 && Number(first2) <= 27)) brand = "master";
  else if (first2 === "34" || first2 === "37") brand = "amex";
  else if (["40", "43", "44", "45", "63", "65", "50"].includes(first2)) brand = "elo";
  else if (first === "6") brand = "hiper";
  if (!brand) return null;

  const wrap = (children: React.ReactNode, bg: string) => (
    <span
      className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-7 w-11 items-center justify-center overflow-hidden"
      style={{ background: bg, borderRadius: "5px", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 12px -4px rgba(0,0,0,0.5)" }}
      aria-label={`Bandeira ${brand}`}
    >
      {children}
    </span>
  );

  if (brand === "visa")
    return wrap(
      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "9.5px", fontWeight: 900, color: "#fff", letterSpacing: "0.04em" }}>VISA</span>,
      "linear-gradient(135deg, #1a1f71 0%, #0f1450 100%)",
    );
  if (brand === "master")
    return wrap(
      <span className="relative inline-flex h-5 w-9 items-center justify-center">
        <span className="absolute left-0 inline-block h-5 w-5 rounded-full" style={{ background: "#eb001b" }} />
        <span className="absolute right-0 inline-block h-5 w-5 rounded-full" style={{ background: "#f79e1b" }} />
        <span className="absolute left-2 right-2 inline-block h-5 w-3" style={{ background: "#ff5f00" }} />
      </span>,
      "#fff",
    );
  if (brand === "amex")
    return wrap(
      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "7.5px", fontWeight: 900, color: "#fff", letterSpacing: "0.04em", textAlign: "center", lineHeight: 1 }}>AMEX</span>,
      "linear-gradient(135deg, #2671b8 0%, #1a4d80 100%)",
    );
  if (brand === "elo")
    return wrap(
      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: 900, color: "#fff", letterSpacing: "0.02em" }}>elo</span>,
      "linear-gradient(135deg, #000 0%, #333 100%)",
    );
  return wrap(
    <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "7.5px", fontWeight: 900, color: "#fff", letterSpacing: "0.04em" }}>HIPER</span>,
    "linear-gradient(135deg, #cc0000 0%, #7a0000 100%)",
  );
}

function PcyesCoinSmall({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <defs>
        <radialGradient id="pcoin-grad-checkout" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        <radialGradient id="pcoin-shine-checkout" cx="30%" cy="25%" r="35%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#pcoin-grad-checkout)" stroke="#92400e" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="#92400e" strokeWidth="0.7" strokeDasharray="1.5 1.2" opacity="0.45" />
      <text
        x="16"
        y="21.5"
        textAnchor="middle"
        fontFamily="var(--font-family-figtree), system-ui, sans-serif"
        fontSize="14"
        fontWeight="900"
        fill="#7c2d12"
        letterSpacing="-0.04em"
      >
        P
      </text>
      <ellipse cx="12" cy="11" rx="4.5" ry="3" fill="url(#pcoin-shine-checkout)" />
    </svg>
  );
}

function NumberStepperRed({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max: number;
  step?: number;
}) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  return (
    <div
      className="inline-flex items-stretch overflow-hidden"
      style={{
        borderRadius: "10px",
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(250,204,21,0.35)",
      }}
    >
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value.replace(/\D/g, "")) || 0))}
        aria-label="Quantidade de pontos"
        className="w-14 bg-transparent px-2 py-1 text-center text-white focus:outline-none"
        style={{
          fontFamily: "var(--font-family-figtree)",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "-0.01em",
        }}
      />
      <div className="flex flex-col border-l" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <button
          type="button"
          onClick={() => onChange(clamp(value + step))}
          aria-label="Aumentar"
          className="flex h-4 w-7 items-center justify-center transition-colors hover:bg-white/[0.08]"
          style={{ color: "#facc15" }}
        >
          <svg width="9" height="6" viewBox="0 0 10 6" fill="none" aria-hidden>
            <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        <button
          type="button"
          onClick={() => onChange(clamp(value - step))}
          aria-label="Diminuir"
          className="flex h-4 w-7 items-center justify-center transition-colors hover:bg-white/[0.08]"
          style={{ color: "#facc15" }}
        >
          <svg width="9" height="6" viewBox="0 0 10 6" fill="none" aria-hidden>
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
