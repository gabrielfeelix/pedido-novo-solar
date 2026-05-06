import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Package, Heart, MapPin, User, CreditCard, HelpCircle, Shield, LogOut,
  ChevronRight, Truck, Check, Clock, X as XIcon, Eye, Star, ShoppingBag,
  ArrowLeft, Copy, ExternalLink, Receipt, Info, Share2, AlertCircle, PackageCheck
} from "lucide-react";
import { useAuth, type Order } from "./AuthContext";
import { useFavorites } from "./FavoritesContext";
import { useCart } from "./CartContext";
import { useTheme } from "./ThemeProvider";
import { allProducts } from "./productsData";
import { Footer } from "./Footer";
import { getPrimaryProductImage, getVisibleCatalogProducts } from "./productPresentation";

function OrderStatusTimeline({ status }: { status: Order["status"] }) {
  const steps = [
    { key: "received", label: "Recebido", icon: Clock },
    { key: "processing", label: "Preparando", icon: Check },
    { key: "shipped", label: "Em Trânsito", icon: Truck },
    { key: "delivered", label: "Entregue", icon: PackageCheck },
  ];

  const getStatusIndex = (s: string) => {
    if (s === "cancelled") return -1;
    if (s === "delivered") return 3;
    if (s === "shipped") return 2;
    if (s === "processing") return 1;
    return 0;
  };

  const currentIndex = getStatusIndex(status);

  return (
    <div className="relative flex justify-between items-start mb-12 mt-4 px-2 sm:px-4">
      <div className="absolute top-[20px] left-[10%] right-[10%] h-[2px] bg-foreground/5 hidden sm:block z-0" />
      {currentIndex >= 0 && (
        <div 
          className="absolute top-[20px] left-[10%] h-[2px] bg-primary transition-all duration-1000 hidden sm:block z-0"
          style={{ width: `${(currentIndex / 3) * 80}%` }} 
        />
      )}
      
      {steps.map((step, idx) => {
        const isActive = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        const isCancelled = status === "cancelled";
        
        return (
          <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 mb-2.5 ${
              isActive ? (isCancelled ? "bg-red-500 text-white" : "bg-primary text-white shadow-lg shadow-primary/20") 
              : "bg-foreground/5 text-foreground/20"
            }`}>
              <step.icon size={18} className={isCurrent ? "animate-pulse" : ""} />
            </div>
            <p className={`text-[10px] sm:text-[11px] text-center font-medium leading-tight ${
              isActive ? "text-foreground" : "text-foreground/20"
            }`} style={{ fontFamily: "var(--font-family-inter)" }}>
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

type Tab = "orders" | "favorites" | "addresses" | "data" | "cards" | "help" | "privacy";

const TABS: { key: Tab; icon: typeof Package; label: string }[] = [
  { key: "orders", icon: Package, label: "Meus Pedidos" },
  { key: "favorites", icon: Heart, label: "Favoritos" },
  { key: "addresses", icon: MapPin, label: "Endereços" },
  { key: "data", icon: User, label: "Dados Pessoais" },
  { key: "cards", icon: CreditCard, label: "Cartões" },
  { key: "help", icon: HelpCircle, label: "Ajuda e Suporte" },
  { key: "privacy", icon: Shield, label: "Privacidade" },
];

const STATUS_MAP = {
  processing: { label: "Em processamento", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock },
  shipped: { label: "Enviado", color: "text-blue-400", bg: "bg-blue-400/10", icon: Truck },
  delivered: { label: "Entregue", color: "text-green-500", bg: "bg-green-500/10", icon: Check },
  cancelled: { label: "Cancelado", color: "text-red-400", bg: "bg-red-400/10", icon: XIcon },
};

export function ProfilePage() {
  const { user, isLoggedIn, setAuthModalOpen, logout, updateUser } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = TABS.some((tab) => tab.key === searchParams.get("tab")) ? searchParams.get("tab") as Tab : "orders";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const setProfileTab = (tab: Tab) => {
    setActiveTab(tab);
    const next = new URLSearchParams(searchParams);
    if (tab === "orders") next.delete("tab");
    else next.set("tab", tab);
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (TABS.some((tab) => tab.key === tabParam)) {
      setActiveTab(tabParam as Tab);
    } else {
      setActiveTab("orders");
    }
  }, [searchParams]);

  if (!isLoggedIn || !user) {
    return (
      <div className="pt-[140px] md:pt-[180px] min-h-screen flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <User size={40} className="text-foreground/15 mx-auto mb-6" />
          <h2 className="text-foreground mb-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "28px", fontWeight: "var(--font-weight-light)" }}>
            Acesse sua conta
          </h2>
          <p className="text-foreground/35 mb-8" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", lineHeight: "1.7" }}>
            Faça login para acessar seus pedidos, favoritos e informações.
          </p>
          <button onClick={() => setAuthModalOpen(true)}
            className="px-8 py-3.5 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 cursor-pointer"
            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
          >Entrar na minha conta</button>
        </div>
      </div>
    );
  }

  const favoriteProducts = getVisibleCatalogProducts(allProducts).filter((p) => favorites.has(p.id));

  const inputCls = "w-full px-4 py-3 bg-foreground/[0.03] border border-foreground/8 text-foreground placeholder:text-foreground/20 focus:border-foreground/20 focus:outline-none transition-colors";
  const inputStyle = { borderRadius: "var(--radius-button)" as const, fontFamily: "var(--font-family-inter)", fontSize: "13px" };

  return (
    <div className="pt-[140px] md:pt-[180px]">
      {/* Header */}
      <div className="px-5 md:px-8 pt-12 pb-8" style={{ background: isDark ? "#161617" : "#f5f5f7" }}>
        <div className="max-w-[1760px] mx-auto flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: "var(--font-weight-medium)" }}>
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-foreground mb-0.5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "24px", fontWeight: "var(--font-weight-medium)" }}>
              Olá, {user.name.split(" ")[0]}
            </h1>
            <p className="text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{user.email}</p>
          </div>
        </div>
      </div>

      <div className="px-5 md:px-8 py-10">
        <div className="max-w-[1760px] mx-auto flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-[220px] flex-shrink-0">
            <nav className="space-y-1">
              {TABS.map((tab) => (
                <button key={tab.key} onClick={() => setProfileTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-300 cursor-pointer ${
                    activeTab === tab.key ? "bg-primary/10 text-primary" : "text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.03]"
                  }`}
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
              <div className="h-px bg-foreground/5 my-3" />
              <button onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-foreground/30 hover:text-primary transition-all duration-300 cursor-pointer"
                style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
              ><LogOut size={16} /> Sair</button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  {!selectedOrderId ? (
                    <>
                      <div className="flex items-center justify-between mb-8">
                        <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Meus Pedidos</h2>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 border border-foreground/5 text-foreground/40 hover:text-foreground/60 transition-colors" style={{ borderRadius: "var(--radius-button)", fontSize: "12px" }}>Todos</button>
                          <button className="px-3 py-1.5 border border-foreground/5 text-foreground/40 hover:text-foreground/60 transition-colors" style={{ borderRadius: "var(--radius-button)", fontSize: "12px" }}>Em aberto</button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {user.orders.map((order) => {
                          const s = STATUS_MAP[order.status];
                          return (
                            <div key={order.id} 
                              onClick={() => setSelectedOrderId(order.id)}
                              className="group border border-foreground/5 p-6 hover:border-primary/20 hover:bg-primary/[0.01] transition-all cursor-pointer relative" 
                              style={{ borderRadius: "var(--radius-card)" }}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.bg} ${s.color}`}>
                                    <s.icon size={20} />
                                  </div>
                                  <div>
                                    <p className="text-foreground font-medium mb-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Pedido {order.id}</p>
                                    <p className="text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>Realizado em {new Date(order.date).toLocaleDateString("pt-BR")}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`flex items-center gap-1.5 px-3 py-1.5 ${s.bg} ${s.color}`} style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}>
                                    {s.label}
                                  </span>
                                  <ChevronRight size={16} className="text-foreground/10 group-hover:text-primary transition-colors group-hover:translate-x-0.5 duration-300" />
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                                {order.items.map((item, i) => (
                                  <div key={i} className="w-16 h-16 flex-shrink-0 overflow-hidden border border-foreground/5" style={{ borderRadius: "var(--radius)", background: isDark ? "#1a1a1c" : "#f5f5f5" }}>
                                    <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                                {order.items.length > 3 && (
                                  <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-foreground/5 text-foreground/30 font-medium" style={{ borderRadius: "var(--radius)", fontSize: "12px" }}>
                                    +{order.items.length - 3}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between pt-5 border-t border-foreground/5">
                                <div className="flex items-center gap-6">
                                  <div>
                                    <p className="text-foreground/25 mb-0.5" style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "0.05em" }}>TOTAL</p>
                                    <p className="text-foreground font-semibold" style={{ fontSize: "15px" }}>{order.total}</p>
                                  </div>
                                  {order.tracking && (
                                    <div className="hidden sm:block">
                                      <p className="text-foreground/25 mb-0.5" style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "0.05em" }}>RASTREIO</p>
                                      <p className="text-foreground/60" style={{ fontSize: "13px" }}>{order.tracking}</p>
                                    </div>
                                  )}
                                </div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setSelectedOrderId(order.id); }}
                                  className="px-4 py-2 border border-foreground/10 hover:border-primary hover:text-primary transition-all text-[12px] font-medium"
                                  style={{ borderRadius: "var(--radius-button)" }}
                                >
                                  Ver detalhes
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (() => {
                    const order = user.orders.find(o => o.id === selectedOrderId);
                    if (!order) return null;
                    const s = STATUS_MAP[order.status];
                    
                    return (
                      <div className="space-y-6">
                        <button 
                          onClick={() => setSelectedOrderId(null)}
                          className="flex items-center gap-2 text-foreground/40 hover:text-primary transition-colors mb-6 group"
                          style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                        >
                          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Voltar para pedidos
                        </button>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "24px", fontWeight: "var(--font-weight-medium)" }}>Pedido {order.id}</h2>
                              <span className={`flex items-center gap-1.5 px-3 py-1 ${s.bg} ${s.color}`} style={{ borderRadius: "100px", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}>
                                {s.label}
                              </span>
                            </div>
                            <p className="text-foreground/30" style={{ fontSize: "13px" }}>Realizado em {new Date(order.date).toLocaleDateString("pt-BR")} às 14:30</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground/70 transition-colors" style={{ borderRadius: "var(--radius-button)", fontSize: "12px" }}>
                              <Receipt size={14} /> Nota Fiscal
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground/70 transition-colors" style={{ borderRadius: "var(--radius-button)", fontSize: "12px" }}>
                              <Share2 size={14} /> Compartilhar
                            </button>
                          </div>
                        </div>

                        {/* Visual Tracking */}
                        <div className="bg-foreground/[0.02] border border-foreground/5 p-8" style={{ borderRadius: "var(--radius-card)" }}>
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-foreground/80 font-medium" style={{ fontSize: "16px" }}>Acompanhamento do Pedido</h3>
                            {order.tracking && (
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary border border-primary/10" style={{ borderRadius: "var(--radius-button)" }}>
                                <Truck size={14} />
                                <span className="font-mono text-[11px] font-bold">{order.tracking}</span>
                                <button onClick={() => { navigator.clipboard.writeText(order.tracking!); }} className="hover:text-primary/70 transition-colors ml-1">
                                  <Copy size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <OrderStatusTimeline status={order.status} />
                          
                          {order.status !== "cancelled" && order.status !== "delivered" && (
                            <div className="mt-8 p-4 bg-primary/5 border border-primary/10 flex items-start gap-3" style={{ borderRadius: "var(--radius)" }}>
                              <Info size={16} className="text-primary mt-0.5" />
                              <div className="text-[12px] text-primary/80 leading-relaxed">
                                Seu pedido está seguindo o cronograma previsto. A data estimada de entrega é <strong>15 de Abril de 2026</strong>.
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Order History */}
                          <div className="lg:col-span-2 space-y-6">
                            <div className="bg-background border border-foreground/5 overflow-hidden" style={{ borderRadius: "var(--radius-card)" }}>
                              <div className="px-6 py-4 border-b border-foreground/5 bg-foreground/[0.01]">
                                <h3 className="text-foreground/70 font-medium" style={{ fontSize: "14px" }}>Histórico de Atualizações</h3>
                              </div>
                              <div className="p-6">
                                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-foreground/5">
                                  {order.history?.map((event, i) => (
                                    <div key={i} className="relative pl-8">
                                      <div className={`absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full border-4 border-background flex items-center justify-center z-10 ${
                                        i === 0 ? "bg-primary" : "bg-foreground/10"
                                      }`} />
                                      <div>
                                        <p className={`font-medium mb-1 ${i === 0 ? "text-foreground" : "text-foreground/50"}`} style={{ fontSize: "14px" }}>{event.description}</p>
                                        <p className="text-foreground/30" style={{ fontSize: "12px" }}>{event.date}</p>
                                      </div>
                                    </div>
                                  )) || (
                                    <div className="text-center py-4 text-foreground/30 text-[13px]">
                                      Nenhum histórico disponível para este pedido.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="bg-background border border-foreground/5 overflow-hidden" style={{ borderRadius: "var(--radius-card)" }}>
                              <div className="px-6 py-4 border-b border-foreground/5 bg-foreground/[0.01]">
                                <h3 className="text-foreground/70 font-medium" style={{ fontSize: "14px" }}>Itens do Pedido</h3>
                              </div>
                              <div className="divide-y divide-foreground/5">
                                {order.items.map((item, i) => (
                                  <div key={i} className="p-6 flex items-center gap-4">
                                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden border border-foreground/5" style={{ borderRadius: "var(--radius)", background: isDark ? "#1a1a1c" : "#f5f5f5" }}>
                                      <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-foreground font-medium mb-1 truncate" style={{ fontSize: "14px" }}>{item.name}</h4>
                                      <p className="text-foreground/30 mb-2" style={{ fontSize: "12px" }}>Quantidade: {item.qty}</p>
                                      <div className="flex items-center gap-2">
                                        <button className="text-primary hover:underline font-medium" style={{ fontSize: "12px" }}>Comprar novamente</button>
                                        <span className="text-foreground/10">•</span>
                                        <button className="text-foreground/40 hover:text-foreground/60 transition-colors" style={{ fontSize: "12px" }}>Ver produto</button>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-foreground font-semibold" style={{ fontSize: "15px" }}>{item.price}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="p-6 bg-foreground/[0.01] border-t border-foreground/5 space-y-2">
                                <div className="flex justify-between text-[13px] text-foreground/40">
                                  <span>Subtotal</span>
                                  <span>{order.total}</span>
                                </div>
                                <div className="flex justify-between text-[13px] text-foreground/40">
                                  <span>Frete</span>
                                  <span className="text-green-500">Grátis</span>
                                </div>
                                <div className="flex justify-between text-[16px] text-foreground font-bold pt-2">
                                  <span>Total</span>
                                  <span>{order.total}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Sidebar Info */}
                          <div className="space-y-6">
                            <div className="bg-background border border-foreground/5 p-6" style={{ borderRadius: "var(--radius-card)" }}>
                              <h3 className="text-foreground/70 font-medium mb-4" style={{ fontSize: "14px" }}>Endereço de Entrega</h3>
                              <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-foreground/20 mt-1" />
                                <div>
                                  <p className="text-foreground/80 font-medium mb-1" style={{ fontSize: "13px" }}>{user.addresses[0].label}</p>
                                  <p className="text-foreground/40 leading-relaxed" style={{ fontSize: "12px" }}>
                                    {user.addresses[0].street}, {user.addresses[0].number}<br />
                                    {user.addresses[0].neighborhood}<br />
                                    {user.addresses[0].city} - {user.addresses[0].state}<br />
                                    CEP {user.addresses[0].cep}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-background border border-foreground/5 p-6" style={{ borderRadius: "var(--radius-card)" }}>
                              <h3 className="text-foreground/70 font-medium mb-4" style={{ fontSize: "14px" }}>Pagamento</h3>
                              <div className="flex items-center gap-3">
                                <CreditCard size={16} className="text-foreground/20" />
                                <p className="text-foreground/60" style={{ fontSize: "13px" }}>{order.paymentMethod || "Cartão de Crédito"}</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-foreground/10 hover:border-foreground/30 text-foreground/60 transition-all font-medium" 
                                style={{ borderRadius: "var(--radius-button)", fontSize: "13px" }}>
                                <HelpCircle size={16} /> Preciso de ajuda
                              </button>
                              {order.status === "processing" && (
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/5 hover:bg-red-500/10 text-red-500 transition-all font-medium border border-red-500/10" 
                                  style={{ borderRadius: "var(--radius-button)", fontSize: "13px" }}>
                                  Cancelar Pedido
                                </button>
                              )}
                            </div>
                            
                            <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 flex items-start gap-3" style={{ borderRadius: "var(--radius)" }}>
                              <AlertCircle size={16} className="text-yellow-500 mt-0.5" />
                              <p className="text-[11px] text-yellow-600 leading-normal">
                                Você tem até 7 dias após o recebimento para solicitar a devolução gratuita.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}

              {activeTab === "favorites" && (
                <motion.div key="favorites" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Favoritos</h2>
                  {favoriteProducts.length === 0 ? (
                    <div className="text-center py-16">
                      <Heart size={32} className="text-foreground/10 mx-auto mb-4" />
                      <p className="text-foreground/30 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px" }}>Nenhum favorito ainda</p>
                      <p className="text-foreground/20 mb-6" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Clique no coração nos produtos para salvá-los aqui.</p>
                      <Link to="/produtos" className="text-primary hover:underline" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Ver produtos</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoriteProducts.map((product) => (
                        <div key={product.id} className="group border border-foreground/5 overflow-hidden" style={{ borderRadius: "var(--radius-card)" }}>
                          <Link to={`/produto/${product.id}`} className="block relative aspect-square" style={{ background: isDark ? "#1a1a1c" : "#f5f5f5" }}>
                            <ImageWithFallback src={getPrimaryProductImage(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          </Link>
                          <div className="p-4">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Star size={10} className="fill-primary text-primary" />
                              <span className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>{product.rating}</span>
                            </div>
                            <p className="text-foreground/80 truncate mb-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>{product.name}</p>
                            <p className="text-foreground/50 mb-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{product.price}</p>
                            <div className="flex gap-2">
                              <button onClick={() => addItem(product)}
                                className="flex-1 py-2 bg-primary text-primary-foreground flex items-center justify-center gap-1.5 hover:brightness-110 transition-all cursor-pointer"
                                style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}
                              ><ShoppingBag size={12} /> Adicionar</button>
                              <button onClick={() => toggleFavorite(product.id)}
                                className="w-9 h-9 border border-foreground/10 flex items-center justify-center text-primary hover:bg-primary/10 transition-all cursor-pointer"
                                style={{ borderRadius: "var(--radius-button)" }}
                              ><Heart size={13} className="fill-primary" /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "addresses" && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Endereços</h2>
                  <div className="space-y-3">
                    {user.addresses.map((a) => (
                      <div key={a.id} className="flex items-start justify-between p-5 border border-foreground/5" style={{ borderRadius: "var(--radius-card)" }}>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin size={13} className="text-foreground/30" />
                            <span className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>{a.label}</span>
                            {a.isDefault && <span className="px-2 py-0.5 bg-primary/10 text-primary" style={{ borderRadius: "100px", fontSize: "9px" }}>PADRÃO</span>}
                          </div>
                          <p className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: "1.6" }}>
                            {a.street}, {a.number}{a.complement ? ` - ${a.complement}` : ""}<br />{a.neighborhood} · {a.city}/{a.state} · CEP {a.cep}
                          </p>
                        </div>
                        <button className="text-foreground/20 hover:text-foreground/50 transition-colors cursor-pointer" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>Editar</button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "data" && (
                <motion.div key="data" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Dados Pessoais</h2>
                  <div className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-foreground/40 mb-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.05em" }}>NOME</label>
                      <input value={user.name} onChange={(e) => updateUser({ name: e.target.value })} className={inputCls} style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-foreground/40 mb-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.05em" }}>E-MAIL</label>
                      <input value={user.email} onChange={(e) => updateUser({ email: e.target.value })} className={inputCls} style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-foreground/40 mb-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.05em" }}>TELEFONE</label>
                      <input value={user.phone} onChange={(e) => updateUser({ phone: e.target.value })} className={inputCls} style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-foreground/40 mb-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.05em" }}>CPF</label>
                      <input value={user.cpf} disabled className={`${inputCls} opacity-50`} style={inputStyle} />
                    </div>
                    <button className="px-6 py-3 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 cursor-pointer"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
                    >Salvar alterações</button>
                  </div>
                </motion.div>
              )}

              {activeTab === "cards" && (
                <motion.div key="cards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Cartões salvos</h2>
                  <div className="space-y-3">
                    {user.cards.map((c) => (
                      <div key={c.id} className="flex items-center gap-4 p-5 border border-foreground/5" style={{ borderRadius: "var(--radius-card)" }}>
                        <div className="w-12 h-8 rounded bg-foreground/5 flex items-center justify-center">
                          <span className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>{c.brand}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>•••• •••• •••• {c.last4}</p>
                          <p className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>{c.name} · Validade {c.expiry}</p>
                        </div>
                        {c.isDefault && <span className="px-2 py-0.5 bg-primary/10 text-primary" style={{ borderRadius: "100px", fontSize: "9px" }}>PADRÃO</span>}
                        <button className="text-foreground/20 hover:text-foreground/50 transition-colors cursor-pointer" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>Remover</button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "help" && (
                <motion.div key="help" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Ajuda e Suporte</h2>
                  {[
                    { title: "Central de Ajuda", desc: "Encontre respostas para suas dúvidas" },
                    { title: "Fale Conosco", desc: "Entre em contato via chat ou e-mail" },
                    { title: "Política de Trocas", desc: "Saiba como trocar ou devolver" },
                    { title: "Rastrear Pedido", desc: "Acompanhe sua entrega em tempo real" },
                  ].map((item) => (
                    <button key={item.title} className="w-full flex items-center justify-between p-5 border border-foreground/5 mb-2 hover:border-foreground/10 transition-all cursor-pointer"
                      style={{ borderRadius: "var(--radius-card)" }}
                    >
                      <div className="text-left">
                        <p className="text-foreground/60 mb-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>{item.title}</p>
                        <p className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{item.desc}</p>
                      </div>
                      <ChevronRight size={16} className="text-foreground/15" />
                    </button>
                  ))}
                </motion.div>
              )}

              {activeTab === "privacy" && (
                <motion.div key="privacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Privacidade</h2>
                  {[
                    { title: "Política de Privacidade", desc: "Como tratamos seus dados pessoais" },
                    { title: "Cookies", desc: "Gerencie suas preferências de cookies" },
                    { title: "Excluir minha conta", desc: "Solicite a remoção permanente dos seus dados" },
                  ].map((item) => (
                    <button key={item.title} className="w-full flex items-center justify-between p-5 border border-foreground/5 mb-2 hover:border-foreground/10 transition-all cursor-pointer"
                      style={{ borderRadius: "var(--radius-card)" }}
                    >
                      <div className="text-left">
                        <p className="text-foreground/60 mb-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>{item.title}</p>
                        <p className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{item.desc}</p>
                      </div>
                      <ChevronRight size={16} className="text-foreground/15" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
