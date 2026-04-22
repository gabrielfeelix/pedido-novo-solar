import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Building2,
  Check,
  CircleAlert,
  Clock,
  FileText,
  History,
  IdCard,
  Info,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Search,
  ShieldCheck,
  ShoppingCart,
  SunMedium,
  TimerReset,
  Trash2,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import {
  financingConditions,
  freightTypes,
  looseItems,
  looseCategories,
  orderMeta,
  orderClients,
  type LooseCategory,
  type SolarTechnicalApprovalStatus,
  type OrderParty,
} from '../data/solarOrderMockData';
import { imageForSku } from '../data/productImages';
import { OrderFinalizeDialog } from './OrderFinalizeDialog';
import {
  usePedido,
  type SolarGenerator,
} from '../context/PedidoContext';
import { buildTriangulationInvoiceObservation } from '../lib/solarCommercialRules';
import {
  calculateCampaignForOrderItem,
  calculateCommissionForOrderItem,
} from '../lib/solarCommercialRules';
import { pricingForOrderItem, type LinePricingAdjustment } from '../lib/solarOrderPricing';
import { ItemsTable } from './budget/ItemsTable';
import { BudgetEmptyState } from './budget/BudgetEmptyState';

type OrderTab =
  | 'items'
  | 'finance'
  | 'freight'
  | 'profitability'
  | 'triangulation'
  | 'approval'
  | 'billing'
  | 'blocks';

type HistoryEntry = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  tone?: 'default' | 'success' | 'warning';
};

type ActionDialogState =
  | { kind: 'discard' }
  | { kind: 'finalize' }
  | { kind: 'reopen' }
  | { kind: 'history' }
  | { kind: 'email' }
  | { kind: 'whatsapp' }
  | { kind: 'pdf' }
  | { kind: 'blocked'; reasons: string[]; targetTab: OrderTab }
  | null;

const ORIGIN_OPTIONS = ['ERP', 'Televendas', 'WhatsApp', 'Marketplace', 'Representante'] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatNumber(value: number, fraction = 2) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  }).format(value);
}

function normalizeText(value: string) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function formatNow() {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.startsWith('55') ? digits : `55${digits}`;
}

function buildOrderPdfFilename(orderNumber: string) {
  return `pedido-${orderNumber.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase()}.pdf`;
}

function statusStyles(status: SolarTechnicalApprovalStatus) {
  if (status === 'approved') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'pending') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (status === 'rejected') return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-slate-50 text-slate-600 border-slate-200';
}

function statusLabel(status: SolarTechnicalApprovalStatus) {
  if (status === 'approved') return 'Aprovado';
  if (status === 'pending') return 'Aguardando aprovação técnica';
  if (status === 'rejected') return 'Reprovado';
  return 'Sem aprovação necessária';
}

/* ------------------------------ Inline Client Search ------------------------------ */
function ClientInlineSearch({
  title,
  icon,
  helper,
  onSelect,
}: {
  title: string;
  icon: React.ReactNode;
  helper: string;
  onSelect: (client: OrderParty) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return orderClients;
    return orderClients.filter((c) =>
      normalizeText(`${c.name} ${c.document} ${c.contactName} ${c.city}`).includes(q),
    );
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Card className="border-dashed border-slate-300 bg-slate-50/60 shadow-none">
      <CardContent className="flex flex-col gap-3 py-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          {icon} {title}
        </div>
        <p className="text-xs text-slate-500">{helper}</p>
        <div ref={containerRef} className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            placeholder="Código, CNPJ, razão social ou cidade"
            className="h-10 pl-9 border-slate-300 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
          />
          {open ? (
            <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-[300px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-slate-500">
                  Nenhum cliente encontrado.
                </div>
              ) : (
                filtered.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onSelect(client);
                      setQuery('');
                      setOpen(false);
                    }}
                    className="flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left transition hover:bg-blue-50"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{client.name}</p>
                      <Badge variant="outline" className="border-slate-200 bg-slate-50 text-[10px] text-slate-600">
                        {client.state}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      CNPJ {client.document} · {client.contactName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {client.street} · {client.city}/{client.state}
                    </p>
                  </button>
                ))
              )}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------ Detailed Client Card (order state) ------------------------------ */
function ClientCardDetailed({
  title,
  client,
  onChange,
  onClear,
  variant,
}: {
  title: string;
  client: OrderParty;
  onChange: (client: OrderParty) => void;
  onClear: () => void;
  variant: 'pedido' | 'nota';
}) {
  const isNota = variant === 'nota';
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return orderClients;
    return orderClients.filter((c) =>
      normalizeText(`${c.name} ${c.document} ${c.contactName} ${c.city}`).includes(q),
    );
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="space-y-4 py-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
              <UserRound className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${isNota ? 'text-blue-700' : 'text-slate-500'}`}>
                {title}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{client.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            aria-label="Remover cliente"
            className="h-8 w-8"
          >
            <X className="h-4 w-4 text-slate-500" />
          </Button>
        </div>

        <div ref={containerRef} className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            placeholder={`Pesquisar ${isNota ? 'cliente para faturamento' : 'integrador'} por código, CNPJ, razão social ou cidade`}
            className="h-10 pl-9 border-slate-300 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
          />
          {open ? (
            <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-[300px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-slate-500">
                  Nenhum cliente encontrado.
                </div>
              ) : (
                filtered.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(candidate);
                      setQuery('');
                      setOpen(false);
                    }}
                    className="flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left transition hover:bg-blue-50"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{candidate.name}</p>
                      <Badge variant="outline" className="border-slate-200 bg-slate-50 text-[10px] text-slate-600">
                        {candidate.state}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      CNPJ {candidate.document} · {candidate.contactName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {candidate.street} · {candidate.city}/{candidate.state}
                    </p>
                  </button>
                ))
              )}
            </div>
          ) : null}
        </div>

        {/* Document */}
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
            <IdCard className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Documento</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{client.document}</p>
          </div>
        </div>

        {/* Contatos (Cliente Pedido only) */}
        {!isNota ? (
          <Select defaultValue={client.id}>
            <SelectTrigger className="border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-500" />
                <SelectValue placeholder="Contatos" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={client.id}>
                {client.contactName} · {client.phone}
              </SelectItem>
            </SelectContent>
          </Select>
        ) : null}

        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
            <MapPin className="h-4 w-4 text-slate-600" />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Rua, Número
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{client.street}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Bairro</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{client.district}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">CEP</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{client.zipCode}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Cidade</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{client.city}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Estado</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{client.state}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------ Avulso Dialog (redesigned) ------------------------------ */
function AvulsoDialog({
  open,
  onOpenChange,
  onAddMany,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAddMany: (picks: { productId: string; quantity: number }[]) => void;
}) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<LooseCategory | 'all'>('all');
  const [cart, setCart] = useState<Record<string, number>>({});

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    return looseItems.filter((item) => {
      if (activeCat !== 'all' && item.category !== activeCat) return false;
      if (!q) return true;
      return normalizeText(`${item.name} ${item.sku} ${item.brand}`).includes(q);
    });
  }, [query, activeCat]);

  const cartEntries = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const product = looseItems.find((i) => i.id === id);
        return product ? { product, quantity: qty } : null;
      })
      .filter((x): x is { product: typeof looseItems[number]; quantity: number } => Boolean(x));
  }, [cart]);

  const cartTotal = cartEntries.reduce((t, e) => t + e.product.unitPrice * e.quantity, 0);
  const cartCount = cartEntries.reduce((t, e) => t + e.quantity, 0);

  function updateQty(id: string, delta: number) {
    setCart((prev) => {
      const next = { ...prev };
      const current = next[id] ?? 0;
      const value = Math.max(0, current + delta);
      if (value === 0) delete next[id];
      else next[id] = value;
      return next;
    });
  }

  function removeFromCart(id: string) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function handleClose(v: boolean) {
    onOpenChange(v);
    if (!v) {
      setQuery('');
      setActiveCat('all');
      setCart({});
    }
  }

  function handleConfirm() {
    if (cartEntries.length === 0) return;
    onAddMany(cartEntries.map((e) => ({ productId: e.product.id, quantity: e.quantity })));
    handleClose(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex h-[82vh] max-h-[780px] w-[96vw] max-w-[1080px] flex-col gap-0 p-0 sm:max-w-[1080px]">
        <DialogHeader className="border-b border-slate-200 px-6 pb-4 pt-5">
          <DialogTitle className="text-xl font-semibold text-slate-950">
            Adicionar produtos avulsos
          </DialogTitle>
          <DialogDescription>
            Selecione um ou mais produtos do catálogo. Ajuste a quantidade em cada card e depois
            confirme a inclusão no pedido.
          </DialogDescription>
        </DialogHeader>

        {/* Search + filters */}
        <div className="space-y-3 border-b border-slate-100 px-6 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busque por SKU, nome ou marca"
              className="h-11 pl-9 border-slate-300 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Categorias
            </span>
            <CategoryChip
              active={activeCat === 'all'}
              label={`Todas · ${looseItems.length}`}
              onClick={() => setActiveCat('all')}
            />
            {looseCategories.map((cat) => {
              const count = looseItems.filter((i) => i.category === cat).length;
              return (
                <CategoryChip
                  key={cat}
                  active={activeCat === cat}
                  label={`${cat} · ${count}`}
                  onClick={() => setActiveCat(cat)}
                />
              );
            })}
          </div>
        </div>

        {/* Grid of product cards + review */}
        <div className="flex-1 overflow-hidden px-6 py-5">
          <div className="grid h-full gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-h-0 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex h-full min-h-[240px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-500">
                  Nenhum item encontrado com esse filtro.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filtered.map((product) => {
                    const qty = cart[product.id] ?? 0;
                    const selected = qty > 0;
                    return (
                      <Card
                        key={product.id}
                        className={`overflow-hidden border-2 transition-all ${
                          selected ? 'border-blue-500 shadow-md' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="relative h-36 w-full bg-slate-100">
                          <img
                            src={imageForSku(product.sku, undefined, product.icon)}
                            alt={product.name}
                            className="h-full w-full object-cover mix-blend-multiply"
                          />
                          <Badge
                            variant="outline"
                            className="absolute left-2 top-2 border-white/80 bg-white/90 text-[10px] font-semibold uppercase tracking-wider text-slate-600"
                          >
                            {product.category}
                          </Badge>
                          {selected ? (
                            <Badge className="absolute right-2 top-2 bg-blue-600 text-[10px] font-semibold text-white hover:bg-blue-600">
                              {qty} selecionado{qty > 1 ? 's' : ''}
                            </Badge>
                          ) : null}
                        </div>
                        <CardContent className="space-y-3 p-4">
                          <div className="min-h-[52px]">
                            <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                              {product.name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              SKU {product.sku} · {product.brand}
                            </p>
                          </div>
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                                Preço unit.
                              </p>
                              <p className="text-base font-bold text-slate-900">
                                {formatCurrency(product.unitPrice)}
                              </p>
                            </div>
                            {qty === 0 ? (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => updateQty(product.id, 1)}
                                className="bg-[#001233] text-white hover:bg-[#001233]/90"
                              >
                                <Plus className="h-4 w-4" /> Adicionar
                              </Button>
                            ) : (
                              <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white p-0.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQty(product.id, -1)}
                                  aria-label="Diminuir quantidade"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </Button>
                                <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
                                  {qty}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-blue-600"
                                  onClick={() => updateQty(product.id, 1)}
                                  aria-label="Aumentar quantidade"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            <Card className="flex h-full min-h-[280px] flex-col border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Revisão dos itens</CardTitle>
                <CardDescription>
                  Confira os itens selecionados antes de inserir no pedido.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
                  {cartEntries.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center text-xs text-slate-500">
                      Nenhum item selecionado.
                    </div>
                  ) : (
                    cartEntries.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2"
                      >
                        <img
                          src={imageForSku(product.sku, undefined, product.icon)}
                          alt={product.name}
                          className="h-12 w-12 rounded-md border border-slate-200 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-slate-900">
                            SKU {product.sku} · {product.name}
                          </p>
                          <p className="text-[11px] text-slate-500">{formatCurrency(product.unitPrice)}/un</p>
                          <p className="text-[11px] font-semibold text-slate-700">
                            Subtotal: {formatCurrency(product.unitPrice * quantity)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white p-0.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQty(product.id, -1)}
                              aria-label="Diminuir quantidade"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </Button>
                            <span className="min-w-7 text-center text-sm font-semibold text-slate-900">
                              {quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-blue-600"
                              onClick={() => updateQty(product.id, 1)}
                              aria-label="Aumentar quantidade"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-rose-600"
                            onClick={() => removeFromCart(product.id)}
                            aria-label="Remover item da revisão"
                            title="Remover item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky footer */}
        <DialogFooter className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>
              <strong className="text-slate-900">{cartCount}</strong> item{cartCount !== 1 ? 's' : ''}{' '}
              selecionado{cartCount !== 1 ? 's' : ''}
            </span>
            {cartCount > 0 ? (
              <>
                <span className="hidden h-4 w-px bg-slate-300 sm:block" />
                <span>
                  Subtotal{' '}
                  <strong className="text-slate-900">{formatCurrency(cartTotal)}</strong>
                </span>
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancelar
            </Button>
            <Button
              disabled={cartCount === 0}
              onClick={handleConfirm}
              className="bg-[#001233] text-white hover:bg-[#001233]/90"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 ? `Inserir ${cartCount} no pedido` : 'Inserir no pedido'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CategoryChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
        active
          ? 'bg-slate-900 text-white'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

/* ============================== Main Page ============================== */
export function SolarOrderPage() {
  const navigate = useNavigate();
  const pedido = usePedido();

  const [activeTab, setActiveTab] = useState<OrderTab>('items');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [avulsoOpen, setAvulsoOpen] = useState(false);
  const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false);
  const [priceTable, setPriceTable] = useState('46 - Tabela Corrente');
  const [operation, setOperation] = useState('11 - Venda de Mercadorias');
  const [origin, setOrigin] = useState('ERP');
  const [itemFilter, setItemFilter] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewFinalizedAt, setReviewFinalizedAt] = useState<string | null>(null);
  const [reviewSnapshot, setReviewSnapshot] = useState<string | null>(null);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [actionDialog, setActionDialog] = useState<ActionDialogState>(null);
  const [emptyStateNotice, setEmptyStateNotice] = useState<string | null>(null);
  const [lineAdjustments, setLineAdjustments] = useState<Record<string, Partial<LinePricingAdjustment>>>({});

  const orderTotals = useMemo(() => {
    const pricingEntries = pedido.orderItems.map((item) => pricingForOrderItem(item, pedido.saleType, lineAdjustments[item.id]));
    const subtotal = pricingEntries.reduce((total, pricing) => total + pricing.vlBruto, 0);
    const prizeDirect = pricingEntries.reduce((total, pricing) => total + pricing.prizeAmount, 0);
    const totalLiquido = pricingEntries.reduce((total, pricing) => total + pricing.total, 0);
    const commissionEstimated = pedido.orderItems.reduce((t, i) => t + calculateCommissionForOrderItem(i), 0);
    const campaignEstimated = pedido.orderItems.reduce((t, i) => t + calculateCampaignForOrderItem(i), 0);
    const freight = pedido.deliveryArea === 'rural' ? 440 : 0;
    const grandTotal = totalLiquido + freight;
    const itemCount = pedido.orderItems.reduce((t, i) => {
      if (i.type === 'generator') return t + i.components.reduce((s, c) => s + c.quantity, 0);
      return t + i.quantity;
    }, 0);
    const vlBruto = pricingEntries.reduce((total, pricing) => total + pricing.vlBruto, 0);
    const desconto = pricingEntries.reduce((total, pricing) => total + pricing.desconto, 0);
    return {
      subtotal,
      prizeDirect,
      totalLiquido,
      commissionEstimated,
      campaignEstimated,
      freight,
      grandTotal,
      itemCount,
      vlBruto,
      desconto,
    };
  }, [pedido.orderItems, pedido.deliveryArea, pedido.saleType, lineAdjustments]);

  const generators = pedido.orderItems.filter((i): i is SolarGenerator => i.type === 'generator');
  const generatorCount = generators.length;
  const looseCount = pedido.orderItems.filter((i) => i.type === 'loose').length;
  const pendingApprovals = generators.filter((g) => g.approvalStatus === 'pending').length;
  const hasGeneratedOrder = pedido.orderItems.length > 0;
  const orderNumber = orderMeta.find((item) => item.label === 'Pedido')?.value ?? '#1615449';
  const createdAt = orderMeta.find((item) => item.label === 'Cadastro no CRM')?.value ?? '01/04/2026 01:46:11';
  const reviewFingerprint = useMemo(
    () => JSON.stringify({
      items: pedido.orderItems,
      lineAdjustments,
      stage: pedido.stage,
      saleType: pedido.saleType,
      clientePedido: pedido.clientePedido?.id ?? null,
      clienteNota: pedido.clienteNota?.id ?? null,
      deliveryArea: pedido.deliveryArea,
      freightType: pedido.freightType,
      financialCondition: pedido.financialCondition,
      orderObservation: pedido.orderObservation,
      invoiceObservation: pedido.invoiceObservation,
      operation,
      origin,
      priceTable,
    }),
    [
      pedido.orderItems,
      lineAdjustments,
      pedido.stage,
      pedido.saleType,
      pedido.clientePedido,
      pedido.clienteNota,
      pedido.deliveryArea,
      pedido.freightType,
      pedido.financialCondition,
      pedido.orderObservation,
      pedido.invoiceObservation,
      operation,
      origin,
      priceTable,
    ],
  );

  const filteredItems = useMemo(() => {
    const q = normalizeText(itemFilter);
    if (!q) return pedido.orderItems;
    return pedido.orderItems.filter((item) => {
      const base = item.type === 'generator'
        ? `${item.sku} ${item.title}`
        : `${item.sku} ${item.name} ${item.brand}`;
      return normalizeText(base).includes(q);
    });
  }, [pedido.orderItems, itemFilter]);

  const totalPages = useMemo(() => {
    const perPage = Number(itemsPerPage);
    return Math.max(1, Math.ceil(filteredItems.length / perPage));
  }, [filteredItems.length, itemsPerPage]);

  const paginatedItems = useMemo(() => {
    const perPage = Number(itemsPerPage);
    const start = (currentPage - 1) * perPage;
    return filteredItems.slice(start, start + perPage);
  }, [filteredItems, itemsPerPage, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemFilter, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setLineAdjustments((previous) => {
      const validIds = new Set(pedido.orderItems.map((item) => item.id));
      const next = Object.fromEntries(
        Object.entries(previous).filter(([itemId]) => validIds.has(itemId)),
      );
      return Object.keys(next).length === Object.keys(previous).length ? previous : next;
    });
  }, [pedido.orderItems]);

  const appendHistory = (title: string, description: string, tone: HistoryEntry['tone'] = 'default') => {
    setHistoryEntries((prev) => [
      {
        id: `${Date.now()}-${prev.length}`,
        title,
        description,
        timestamp: formatNow(),
        tone,
      },
      ...prev,
    ]);
  };

  useEffect(() => {
    if (hasGeneratedOrder && historyEntries.length === 0) {
      setHistoryEntries([
        {
          id: 'entry-created',
          title: 'Pedido solar em edição',
          description: 'Fluxo de pedido solar iniciado com itens no pedido.',
          timestamp: createdAt,
          tone: 'default',
        },
      ]);
    }
  }, [hasGeneratedOrder, historyEntries.length, createdAt]);

  function handleAddMany(picks: { productId: string; quantity: number }[]) {
    picks.forEach(({ productId, quantity }) => {
      const product = looseItems.find((i) => i.id === productId);
      if (!product) return;
      pedido.addLooseItem({
        id: `loose-${Date.now()}-${productId}`,
        type: 'loose',
        name: product.name,
        sku: product.sku,
        brand: product.brand,
        quantity,
        unitPrice: product.unitPrice,
        total: product.unitPrice * quantity,
      });
    });
    if (picks.length > 0) {
      appendHistory(
        'Produtos avulsos adicionados',
        `${picks.length} item(ns) foram preparados e adicionados ao pedido.`,
        'default',
      );
    }
  }

  function toggleExpanded(id: string) {
    setExpandedItems((s) => ({ ...s, [id]: !s[id] }));
  }

  function updateLineAdjustment(itemId: string, patch: Partial<LinePricingAdjustment>) {
    setLineAdjustments((previous) => ({
      ...previous,
      [itemId]: {
        ...previous[itemId],
        ...patch,
      },
    }));
  }

  function handleDiscardOrder() {
    const discardedSummary = [
      generatorCount > 0 ? `${generatorCount} kit(s)` : null,
      looseCount > 0 ? `${looseCount} produto(s) avulso(s)` : null,
      hasIntegrator ? 'integrador vinculado' : null,
      hasBillingClient ? 'cliente para faturamento vinculado' : null,
    ].filter(Boolean).join(', ');

    pedido.resetOrder();
    setActionDialog(null);
    setExpandedItems({});
    setLineAdjustments({});
    setItemFilter('');
    setCurrentPage(1);
    setHistoryEntries([]);
    setReviewFinalizedAt(null);
    setReviewSnapshot(null);
    setActiveTab('items');
    setEmptyStateNotice(
      discardedSummary
        ? `Pedido descartado. Foram removidos: ${discardedSummary}.`
        : 'Pedido descartado. Nenhum item permaneceu em rascunho.',
    );
  }

  function handleFinalizeReview() {
    if (hasReviewBeenFinalized) {
      setActionDialog({ kind: 'reopen' });
      return;
    }

    if (unresolvedReviewReasons.length > 0) {
      setActionDialog({
        kind: 'blocked',
        reasons: unresolvedReviewReasons,
        targetTab: pendingApprovals > 0 ? 'approval' : 'blocks',
      });
      return;
    }

    setActionDialog({ kind: 'finalize' });
  }

  const hasIntegrator = Boolean(pedido.clientePedido);
  const hasBillingClient = Boolean(pedido.clienteNota);
  const triangulationEnabled = operation.startsWith('13') || pedido.saleType === 'triangulation';
  const warningBlockCount = pendingApprovals > 0 ? 1 : 0;
  const blockCount = warningBlockCount;
  const flowStage = pedido.stage === 'order'
    ? pendingApprovals > 0 ? 'Em revisão' : 'Finalizado'
    : 'Orçamento';
  const flowStageClass = flowStage === 'Finalizado'
    ? 'bg-emerald-100 text-emerald-800'
    : flowStage === 'Em revisão'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-blue-100 text-blue-800';
  const hasReviewBeenFinalized = Boolean(reviewFinalizedAt);
  const unresolvedReviewReasons = [
    pendingApprovals > 0 ? `${pendingApprovals} gerador(es) ainda aguardam aprovação técnica.` : null,
  ].filter((item): item is string => Boolean(item));
  const whatsappRecipient = pedido.clienteNota ?? pedido.clientePedido;
  const whatsappPhone = whatsappRecipient?.phone ? normalizePhone(whatsappRecipient.phone) : '';
  const displayOrderNumber = pedido.stage === 'order'
    ? (pedido.orderNumber ?? orderNumber)
    : (pedido.budgetNumber ?? orderNumber);
  const whatsappPdfFilename = buildOrderPdfFilename(displayOrderNumber);
  const outboundActionsEnabled = pedido.stage === 'order' && pendingApprovals === 0;
  const outboundActionsTooltip = pedido.stage === 'budget'
    ? 'Finalize o orçamento e transforme em pedido para liberar esta ação.'
    : 'Aguardando aprovação técnica dos geradores para liberar esta ação.';
  const whatsappMessage = whatsappRecipient
    ? [
        `Olá, ${whatsappRecipient.contactName}.`,
        `Segue o pedido ${displayOrderNumber} em PDF para conferência.`,
        `Cliente: ${whatsappRecipient.name}`,
        `Total do pedido: ${formatCurrency(orderTotals.grandTotal)}`,
        `Arquivo previsto: ${whatsappPdfFilename}`,
      ].join('\n')
    : '';
  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`
    : '';

  useEffect(() => {
    if (!triangulationEnabled && activeTab === 'triangulation') {
      setActiveTab('items');
    }
  }, [triangulationEnabled, activeTab]);

  useEffect(() => {
    if (hasGeneratedOrder && emptyStateNotice) {
      setEmptyStateNotice(null);
    }
  }, [hasGeneratedOrder, emptyStateNotice]);

  useEffect(() => {
    if (reviewFinalizedAt && reviewSnapshot && reviewFingerprint !== reviewSnapshot) {
      setReviewFinalizedAt(null);
      setReviewSnapshot(null);
      appendHistory(
        'Revisão reaberta automaticamente',
        'Uma alteração comercial ou estrutural foi feita após a finalização da revisão.',
        'warning',
      );
    }
  }, [reviewFinalizedAt, reviewSnapshot, reviewFingerprint]);

  /* =========================== EMPTY STATE =========================== */
  if (!hasGeneratedOrder) {
    return (
      <>
        <BudgetEmptyState
          budgetNumber={pedido.budgetNumber}
          emptyStateNotice={emptyStateNotice}
          onBuildKit={() => navigate('/vendas/novo-pedido-solar/solar-builder')}
          onAddLooseItem={() => setAvulsoOpen(true)}
        />
        <AvulsoDialog open={avulsoOpen} onOpenChange={setAvulsoOpen} onAddMany={handleAddMany} />
      </>
    );
  }

  /* =========================== ORDER (PEDIDO REALIZADO) STATE =========================== */
  return (
    <div className="min-h-full bg-transparent pb-20 pt-8">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6">

        {/* Header: status + title + actions */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge
                className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${flowStageClass}`}
              >
                {flowStage}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-md border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700"
              >
                {blockCount > 0 ? `${blockCount} bloqueio(s)` : 'Sem bloqueios'}
              </Badge>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {pedido.stage === 'order' ? 'Pedido' : 'Orçamento'}{' '}
              <span className="text-slate-500">{displayOrderNumber}</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={outboundActionsEnabled ? -1 : 0} className="inline-flex">
                  <Button
                    variant="outline"
                    className="border-slate-300"
                    disabled={!outboundActionsEnabled}
                    onClick={() => setActionDialog({ kind: 'email' })}
                  >
                    <Mail className="h-4 w-4" /> Enviar e-mail
                  </Button>
                </span>
              </TooltipTrigger>
              {!outboundActionsEnabled ? (
                <TooltipContent>{outboundActionsTooltip}</TooltipContent>
              ) : null}
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={outboundActionsEnabled ? -1 : 0} className="inline-flex">
                  <Button
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 disabled:border-slate-200 disabled:text-slate-400"
                    disabled={!outboundActionsEnabled}
                    onClick={() => setActionDialog({ kind: 'whatsapp' })}
                  >
                    <MessageCircle className="h-4 w-4" /> Enviar por WhatsApp
                  </Button>
                </span>
              </TooltipTrigger>
              {!outboundActionsEnabled ? (
                <TooltipContent>{outboundActionsTooltip}</TooltipContent>
              ) : null}
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={outboundActionsEnabled ? -1 : 0} className="inline-flex">
                  <Button
                    variant="outline"
                    className="border-slate-300 text-rose-600 disabled:border-slate-200 disabled:text-slate-400"
                    disabled={!outboundActionsEnabled}
                    onClick={() => setActionDialog({ kind: 'pdf' })}
                  >
                    <FileText className="h-4 w-4" /> Gerar PDF
                  </Button>
                </span>
              </TooltipTrigger>
              {!outboundActionsEnabled ? (
                <TooltipContent>{outboundActionsTooltip}</TooltipContent>
              ) : null}
            </Tooltip>
          </div>
        </div>

        {/* Meta grid — 2 rows */}
        <div className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-4">
          <MetaField label="Data do Pedido" value="01/04/2026" />
          <MetaField label="Cadastro no CRM" value={createdAt} />
          <MetaField label="Consultor Titular" value="513 · Jhulielem R. Philot" />
          <MetaField label="Consultor Pedido" value="513 · Jhulielem R. Philot" />

          <OriginField value={origin} onChange={setOrigin} />
          <MetaField label="Filial" value="PR · Maringá" />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Tabela de Preço</p>
            <Select value={priceTable} onValueChange={setPriceTable}>
              <SelectTrigger className="mt-1 h-10 border-slate-300 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="46 - Tabela Corrente">46 - Tabela Corrente</SelectItem>
                <SelectItem value="47 - Tabela Promocional">47 - Tabela Promocional</SelectItem>
                <SelectItem value="48 - Tabela Atacado">48 - Tabela Atacado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Operação</p>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger className="mt-1 h-10 border-slate-300 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="11 - Venda de Mercadorias">11 - Venda de Mercadorias</SelectItem>
                <SelectItem value="12 - Venda para Uso/Consumo">12 - Venda para Uso/Consumo</SelectItem>
                <SelectItem value="13 - Venda com Triangulação">13 - Venda com Triangulação</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clients */}
        {pedido.stage === 'budget' ? (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-5 py-4 text-sm text-slate-500">
            <Users className="h-4 w-4 shrink-0 text-slate-400" />
            <span>Integrador e tipo de venda serão definidos ao finalizar o orçamento.</span>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pedido.clientePedido ? (
              <ClientCardDetailed
                title="Integrador"
                client={pedido.clientePedido}
                onChange={pedido.setClientePedido}
                onClear={() => pedido.setClientePedido(null)}
                variant="pedido"
              />
            ) : (
              <ClientInlineSearch
                title="Integrador"
                icon={<Building2 className="h-4 w-4" />}
                helper="Integrador responsável pelo pedido."
                onSelect={pedido.setClientePedido}
              />
            )}
            {pedido.clienteNota ? (
              <ClientCardDetailed
                title="Cliente para faturamento"
                client={pedido.clienteNota}
                onChange={pedido.setClienteNota}
                onClear={() => pedido.setClienteNota(null)}
                variant="nota"
              />
            ) : (
              <ClientInlineSearch
                title="Cliente para faturamento"
                icon={<UserRound className="h-4 w-4" />}
                helper="Cliente que receberá o faturamento da nota fiscal."
                onSelect={pedido.setClienteNota}
              />
            )}
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrderTab)}>
          <TabsList className="w-full justify-start overflow-auto rounded-xl border border-slate-200 bg-white p-1">
            <TabsTrigger value="items">Itens {pedido.orderItems.length > 0 ? `(${pedido.orderItems.length})` : ''}</TabsTrigger>
            <TabsTrigger value="freight">Frete</TabsTrigger>
            <TabsTrigger value="finance">Financeiro</TabsTrigger>
            <TabsTrigger value="approval">
              Aprovação Técnica{pendingApprovals > 0 ? ` · ${pendingApprovals}` : ''}
            </TabsTrigger>
            <TabsTrigger value="billing">Faturamento</TabsTrigger>
            <TabsTrigger value="blocks">Bloqueios{blockCount > 0 ? ` · ${blockCount}` : ''}</TabsTrigger>
            <TabsTrigger value="profitability">Lucratividade</TabsTrigger>
            <TabsTrigger value="triangulation" disabled={!triangulationEnabled}>Triangulação</TabsTrigger>
          </TabsList>
          {!triangulationEnabled ? (
            <p className="mt-2 text-xs text-slate-500">
              Triangulação disponível ao selecionar a operação <strong>13 - Venda com Triangulação</strong>.
            </p>
          ) : null}

          {/* ITEMS TAB */}
          <TabsContent value="items" className="space-y-5">
            {/* Filter + actions */}
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative max-w-md flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={itemFilter}
                    onChange={(e) => setItemFilter(e.target.value)}
                    placeholder="Filtrar por SKU, nome ou marca"
                    className="h-10 pl-9 border-slate-300 focus-visible:border-blue-500"
                  />
                  {itemFilter ? (
                    <button
                      type="button"
                      onClick={() => setItemFilter('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      aria-label="Limpar filtro"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setAvulsoOpen(true)}>
                  <Plus className="h-4 w-4" /> Produto avulso
                </Button>
                <Button
                  className="bg-[#001233] text-white hover:bg-[#001233]/90"
                  onClick={() => navigate('/vendas/novo-pedido-solar/solar-builder')}
                >
                  <SunMedium className="h-4 w-4" /> Monte seu kit solar
                </Button>
              </div>
            </div>

            {/* Items table */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="px-0 py-0">
                <ItemsTable
                  items={paginatedItems}
                  saleType={pedido.saleType}
                  expandedItems={expandedItems}
                  pricingAdjustments={lineAdjustments}
                  toggleExpanded={toggleExpanded}
                  onPricingAdjustmentChange={updateLineAdjustment}
                  onDuplicateGenerator={pedido.duplicateGenerator}
                  onRemoveItem={pedido.removeItem}
                  onUpdateGeneratorComponent={pedido.updateGeneratorComponent}
                />

                {/* Pagination */}
                <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-600 md:flex-row md:items-center md:justify-between">
                  <p>
                    {filteredItems.length} de {pedido.orderItems.length} produto(s).
                  </p>
                  <div className="flex items-center gap-3">
                    <span>Itens por página</span>
                    <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                      <SelectTrigger className="h-8 w-[72px] border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>
                      Página {currentPage} de {totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage(1)}
                      >
                        «
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      >
                        ‹
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      >
                        ›
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        »
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalhes + Resumo */}
            <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-900">Detalhes do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <DetailGroup title="Valores do Pedido">
                    <DetailItem label="Valor Total Bruto" value={formatCurrency(orderTotals.vlBruto)} />
                    <DetailItem label="Valor Desconto" value={formatCurrency(orderTotals.desconto)} />
                    <DetailItem label="Valor Total Líquido" value={formatCurrency(orderTotals.totalLiquido)} />
                    <DetailItem label="Valor Total Impostos" value={formatCurrency(0)} />
                  </DetailGroup>

                  <DetailGroup title="Comissões e Verbas">
                    <DetailItem label="Valor Comissão" value={formatCurrency(orderTotals.commissionEstimated)} />
                    <DetailItem label="Valor Campanha" value={formatCurrency(orderTotals.campaignEstimated)} />
                    <DetailItem label="Prêmio Venda Direta" value={formatCurrency(orderTotals.prizeDirect)} />
                  </DetailGroup>

                  <DetailGroup title="Saldos do Cliente">
                    <DetailItem label="Saldo Adto" value={formatCurrency(0)} />
                    <DetailItem label="Saldo RMA" value={formatCurrency(0)} />
                    <DetailItem label="Saldo Limite de Crédito" value={formatCurrency(200000)} />
                  </DetailGroup>

                  {/* Observations */}
                  <div className="border-t border-slate-100 pt-5">
                    <div className="mb-3 flex items-center gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Observações
                      </p>
                      <Button variant="outline" size="sm" className="h-7 rounded-full border-slate-300 text-xs">
                        <Pencil className="h-3 w-3" /> Editar
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600">Observação Nota</label>
                        <Textarea
                          value={pedido.invoiceObservation}
                          onChange={(e) => pedido.setInvoiceObservation(e.target.value)}
                          placeholder="Adicionar observação"
                          className="border-slate-300 focus-visible:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600">Observação Pedido</label>
                        <Textarea
                          value={pedido.orderObservation}
                          onChange={(e) => pedido.setOrderObservation(e.target.value)}
                          placeholder="Adicionar observação"
                          className="border-slate-300 focus-visible:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resumo (light) */}
              <Card className="h-max border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-900">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <ResumoRow label="Total Líquido" value={formatCurrency(orderTotals.totalLiquido)} />
                  <ResumoRow label="Frete" value={formatCurrency(orderTotals.freight)} />
                  <ResumoRow label="Total IPI" value={formatCurrency(0)} />
                  <ResumoRow label="Total ST" value={formatCurrency(0)} />
                  <div className="border-t border-slate-200 pt-3">
                    <ResumoRow label="Total em produtos" value={formatCurrency(orderTotals.totalLiquido)} strong />
                  </div>
                  <div className="flex items-end justify-between border-t border-slate-200 pt-4">
                    <span className="text-sm text-slate-500">Total</span>
                    <span className="text-2xl font-bold text-slate-950">
                      {formatCurrency(orderTotals.grandTotal)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FINANCE */}
          <TabsContent value="finance">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Financeiro</CardTitle>
                <CardDescription>Condições comerciais e forma de pagamento.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Condição de pagamento</label>
                  <Select value={pedido.financialCondition} onValueChange={pedido.setFinancialCondition}>
                    <SelectTrigger className="border-slate-300"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {financingConditions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Prêmio venda direta total</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{formatCurrency(orderTotals.prizeDirect)}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FREIGHT */}
          <TabsContent value="freight">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Frete</CardTitle>
                <CardDescription>Tipo de entrega e área influenciam o cálculo.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Área de entrega</label>
                  <div className="flex gap-2">
                    <Button
                      variant={pedido.deliveryArea === 'urban' ? 'default' : 'outline'}
                      onClick={() => pedido.setDeliveryArea('urban')}
                    >
                      Área urbana
                    </Button>
                    <Button
                      variant={pedido.deliveryArea === 'rural' ? 'default' : 'outline'}
                      onClick={() => pedido.setDeliveryArea('rural')}
                    >
                      Área rural (+R$ 440)
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tipo de frete</label>
                  <Select value={pedido.freightType} onValueChange={pedido.setFreightType}>
                    <SelectTrigger className="border-slate-300"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {freightTypes.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROFITABILITY */}
          <TabsContent value="profitability">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Lucratividade</CardTitle>
                <CardDescription>Visão consolidada do pedido.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Valor bruto</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{formatCurrency(orderTotals.vlBruto)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Prêmio venda direta</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{formatCurrency(orderTotals.prizeDirect)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Margem</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {orderTotals.totalLiquido > 0 ? `${((orderTotals.prizeDirect / orderTotals.totalLiquido) * 100).toFixed(2)}%` : '—'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TRIANGULATION */}
          <TabsContent value="triangulation">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Triangulação</CardTitle>
                <CardDescription>
                  A mercadoria é faturada para o integrador mas remetida ao cliente final. Os dados abaixo
                  compõem a observação da nota de remessa.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Partes envolvidas */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Faturado para (Integrador)</p>
                    <p className="mt-1.5 text-sm font-semibold text-slate-900">{pedido.clientePedido?.name ?? '—'}</p>
                    {pedido.clientePedido ? (
                      <p className="text-xs text-slate-500">
                        CNPJ {pedido.clientePedido.document} · {pedido.clientePedido.city}/{pedido.clientePedido.state}
                      </p>
                    ) : null}
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700">Remetido para (Cliente final)</p>
                    <p className="mt-1.5 text-sm font-semibold text-slate-900">{pedido.clienteNota?.name ?? '—'}</p>
                    {pedido.clienteNota ? (
                      <p className="text-xs text-slate-500">
                        CNPJ {pedido.clienteNota.document} · {pedido.clienteNota.city}/{pedido.clienteNota.state}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Dados do cliente final */}
                {pedido.clienteNota ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Endereço de remessa
                    </p>
                    <div className="grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <p className="text-[11px] text-slate-500">Logradouro</p>
                        <p className="font-medium text-slate-900">{pedido.clienteNota.street}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">Bairro</p>
                        <p className="font-medium text-slate-900">{pedido.clienteNota.district}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">Cidade / UF</p>
                        <p className="font-medium text-slate-900">{pedido.clienteNota.city}/{pedido.clienteNota.state}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">CEP</p>
                        <p className="font-medium text-slate-900">{pedido.clienteNota.zipCode}</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Observação da nota de remessa */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-800">Observação da nota de remessa</label>
                    {pedido.clienteNota ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 border-slate-300 text-xs"
                        onClick={() => pedido.setInvoiceObservation(buildTriangulationInvoiceObservation(pedido.clienteNota!))}
                      >
                        Restaurar padrão
                      </Button>
                    ) : null}
                  </div>
                  <Textarea
                    value={pedido.invoiceObservation}
                    onChange={(e) => pedido.setInvoiceObservation(e.target.value)}
                    placeholder={pedido.clienteNota ? buildTriangulationInvoiceObservation(pedido.clienteNota) : 'Finalize o orçamento informando o cliente final para preencher automaticamente.'}
                    rows={4}
                    className="border-slate-300 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  />
                  <p className="text-xs text-slate-500">
                    Este texto é inserido na observação da nota fiscal de remessa. Edite conforme necessário ou use "Restaurar padrão" para regenerar a partir dos dados do cliente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* APPROVAL */}
          <TabsContent value="approval" className="space-y-3">
            {generators.length === 0 ? (
              <Card className="border-dashed border-slate-300 bg-white shadow-none">
                <CardContent className="py-16 text-center text-slate-500">
                  Nenhum gerador no pedido ainda.
                </CardContent>
              </Card>
            ) : (
              generators.map((g) => (
                <Card key={g.id} className="border-slate-200 shadow-sm">
                  <CardContent className="py-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold text-slate-950">{g.title}</p>
                          <Badge variant="outline" className={statusStyles(g.approvalStatus)}>
                            {statusLabel(g.approvalStatus)}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">{g.approvalResponsible} · {g.approvalTimestamp}</p>
                        <p className="text-sm text-slate-700">{g.approvalNote}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => pedido.updateApproval(g.id, 'pending')}>
                          <TimerReset className="h-4 w-4" /> Pendente
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => pedido.updateApproval(g.id, 'approved')}>
                          <ShieldCheck className="h-4 w-4 text-emerald-600" /> Aprovar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => pedido.updateApproval(g.id, 'rejected')}>
                          <CircleAlert className="h-4 w-4 text-red-600" /> Reprovar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* BILLING */}
          <TabsContent value="billing">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Faturamento</CardTitle>
                <CardDescription>Emissão de nota fiscal seguindo o cliente de faturamento selecionado.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Cliente para faturamento</p>
                  <p className="mt-1 font-semibold text-slate-900">{pedido.clienteNota?.name ?? '— não informado'}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Documento</p>
                  <p className="mt-1 font-semibold text-slate-900">{pedido.clienteNota?.document ?? '—'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BLOCKS */}
          <TabsContent value="blocks" className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                Atenções: {warningBlockCount}
              </Badge>
              {blockCount === 0 ? (
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  Fluxo pronto para finalizar
                </Badge>
              ) : null}
            </div>
            {pedido.stage === 'budget' ? (
              <Card className="border-blue-200 bg-blue-50 shadow-none">
                <CardContent className="flex items-start gap-3 py-4 text-sm text-blue-900">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>Este orçamento ainda não foi transformado em pedido. Integrador e tipo de venda serão definidos ao finalizar.</p>
                </CardContent>
              </Card>
            ) : null}
            {pendingApprovals > 0 ? (
              <Card className="border-amber-200 bg-amber-50 shadow-none">
                <CardContent className="flex items-start gap-3 py-4 text-sm text-amber-900">
                  <TimerReset className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{pendingApprovals} gerador(es) aguardando aprovação técnica antes do fechamento.</p>
                </CardContent>
              </Card>
            ) : null}
            {pedido.stage === 'order' && pendingApprovals === 0 ? (
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="py-6 text-center text-sm text-slate-500">Nenhum bloqueio ativo.</CardContent>
              </Card>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom fixed status bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-5 text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className={`flex h-5 w-5 items-center justify-center rounded-full ${hasReviewBeenFinalized ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                {hasReviewBeenFinalized ? (
                  <History className="h-3 w-3 text-blue-700" />
                ) : (
                  <Check className="h-3 w-3 text-emerald-700" />
                )}
              </span>
              {hasReviewBeenFinalized ? `Revisão finalizada em ${reviewFinalizedAt}` : 'Tudo salvo'}
            </span>
            <button
              type="button"
              onClick={() => setActionDialog({ kind: 'history' })}
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
            >
              <Clock className="h-4 w-4" />
              Histórico
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setActionDialog({ kind: 'discard' })}>
              <Trash2 className="h-4 w-4" /> Descartar
            </Button>
            {pedido.stage === 'budget' ? (
              <Button
                className="bg-[#001233] text-white hover:bg-[#001233]/90"
                onClick={() => setFinalizeDialogOpen(true)}
              >
                <Check className="h-4 w-4" /> Finalizar orçamento
              </Button>
            ) : (
              <Button
                className="bg-[#001233] text-white hover:bg-[#001233]/90"
                onClick={handleFinalizeReview}
              >
                {hasReviewBeenFinalized ? (
                  <TimerReset className="h-4 w-4" />
                ) : (
                  <History className="h-4 w-4" />
                )}{' '}
                {hasReviewBeenFinalized ? 'Reabrir revisão' : 'Finalizar revisão'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <OrderFinalizeDialog
        open={finalizeDialogOpen}
        onOpenChange={setFinalizeDialogOpen}
        onPromoted={() => {
          appendHistory(
            'Orçamento transformado em pedido',
            'Tipo de venda e clientes vinculados. Pedido pronto para revisão.',
            'success',
          );
        }}
      />

      <Dialog open={Boolean(actionDialog)} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent className="sm:max-w-[560px]">
          {actionDialog?.kind === 'discard' ? (
            <>
              <DialogHeader>
                <DialogTitle>Descartar pedido atual?</DialogTitle>
                <DialogDescription>
                  Essa ação remove kits, produtos avulsos, clientes vinculados e observações do pedido solar atual.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                {[
                  generatorCount > 0 ? `${generatorCount} kit(s)` : null,
                  looseCount > 0 ? `${looseCount} produto(s) avulso(s)` : null,
                  hasIntegrator ? 'integrador vinculado' : null,
                  hasBillingClient ? 'cliente para faturamento vinculado' : null,
                ].filter(Boolean).join(', ') || 'Nenhum dado relevante será mantido.'}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActionDialog(null)}>
                  Continuar editando
                </Button>
                <Button variant="destructive" onClick={handleDiscardOrder}>
                  Descartar pedido
                </Button>
              </DialogFooter>
            </>
          ) : null}

          {actionDialog?.kind === 'finalize' ? (
            <>
              <DialogHeader>
                <DialogTitle>Finalizar revisão do pedido?</DialogTitle>
                <DialogDescription>
                  Isso registra que a revisão comercial do pedido foi concluída no protótipo.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <p>O pedido continuará editável, mas qualquer alteração relevante reabrirá a revisão automaticamente.</p>
                <p>Use essa ação quando os dados comerciais, clientes, frete e aprovações já estiverem coerentes.</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActionDialog(null)}>
                  Revisar mais
                </Button>
                <Button
                  className="bg-[#001233] text-white hover:bg-[#001233]/90"
                  onClick={() => {
                    const timestamp = formatNow();
                    setReviewFinalizedAt(timestamp);
                    setReviewSnapshot(reviewFingerprint);
                    appendHistory(
                      'Revisão finalizada',
                      'A revisão comercial do pedido foi marcada como concluída.',
                      'success',
                    );
                    setActionDialog(null);
                  }}
                >
                  Confirmar finalização
                </Button>
              </DialogFooter>
            </>
          ) : null}

          {actionDialog?.kind === 'reopen' ? (
            <>
              <DialogHeader>
                <DialogTitle>Reabrir revisão?</DialogTitle>
                <DialogDescription>
                  Reabra a revisão se quiser voltar a tratar o pedido como pendente de validação comercial.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActionDialog(null)}>
                  Manter finalizada
                </Button>
                <Button
                  className="bg-[#001233] text-white hover:bg-[#001233]/90"
                  onClick={() => {
                    setReviewFinalizedAt(null);
                    setReviewSnapshot(null);
                    appendHistory(
                      'Revisão reaberta manualmente',
                      'A revisão comercial foi reaberta para novos ajustes.',
                      'warning',
                    );
                    setActionDialog(null);
                  }}
                >
                  Reabrir revisão
                </Button>
              </DialogFooter>
            </>
          ) : null}

          {actionDialog?.kind === 'blocked' ? (
            <>
              <DialogHeader>
                <DialogTitle>Não é possível finalizar a revisão</DialogTitle>
                <DialogDescription>
                  Ainda existem pendências obrigatórias no pedido atual.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                {actionDialog.reasons.map((reason) => (
                  <p key={reason}>{reason}</p>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActionDialog(null)}>
                  Fechar
                </Button>
                <Button
                  className="bg-[#001233] text-white hover:bg-[#001233]/90"
                  onClick={() => {
                    setActiveTab(actionDialog.targetTab);
                    setActionDialog(null);
                  }}
                >
                  {actionDialog.targetTab === 'approval' ? 'Ir para Aprovação Técnica' : 'Ir para Bloqueios'}
                </Button>
              </DialogFooter>
            </>
          ) : null}

          {actionDialog?.kind === 'history' ? (
            <>
              <DialogHeader>
                <DialogTitle>Histórico do pedido</DialogTitle>
                <DialogDescription>
                  Linha do tempo das ações relevantes registradas neste protótipo.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {historyEntries.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                    Nenhum evento registrado ainda.
                  </div>
                ) : (
                  historyEntries.map((entry) => (
                    <div key={entry.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
                        <Badge
                          variant="outline"
                          className={
                            entry.tone === 'success'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : entry.tone === 'warning'
                                ? 'border-amber-200 bg-amber-50 text-amber-700'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                          }
                        >
                          {entry.timestamp}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{entry.description}</p>
                    </div>
                  ))
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActionDialog(null)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          ) : null}

          {actionDialog?.kind === 'email' ? (
            <>
              <DialogHeader>
                <DialogTitle>Enviar e-mail</DialogTitle>
                <DialogDescription>
                  No protótipo, este botão apenas simula a saída operacional do pedido.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                A implementação final deve abrir fluxo de envio com destinatários, template, anexos e confirmação de disparo.
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActionDialog(null)}>
                  Fechar
                </Button>
                <Button
                  className="bg-[#001233] text-white hover:bg-[#001233]/90"
                  onClick={() => {
                    appendHistory(
                      'Simulação de envio por e-mail',
                      'Usuário acionou a saída de envio de e-mail do pedido.',
                      'default',
                    );
                    setActionDialog(null);
                  }}
                >
                  Registrar ação
                </Button>
              </DialogFooter>
            </>
          ) : null}

          {actionDialog?.kind === 'whatsapp' ? (
            <>
              <DialogHeader>
                <DialogTitle>Enviar por WhatsApp</DialogTitle>
                <DialogDescription>
                  O protótipo prepara o espelho do pedido em PDF e abre o WhatsApp com a mensagem pronta para o cliente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                      Cliente de envio
                    </p>
                    <p className="mt-1 font-semibold">
                      {whatsappRecipient?.name ?? 'Nenhum cliente definido'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                      Contato
                    </p>
                    <p className="mt-1 font-semibold">
                      {whatsappRecipient?.contactName ?? 'Contato indisponível'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                      Telefone
                    </p>
                    <p className="mt-1 font-semibold">
                      {whatsappRecipient?.phone ?? 'Telefone indisponível'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                      PDF previsto
                    </p>
                    <p className="mt-1 font-semibold">{whatsappPdfFilename}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-white/70 p-3 text-slate-700">
                  Na versão final, o PDF será anexado automaticamente ao envio. Neste protótipo, registramos a geração do PDF e abrimos o WhatsApp com a mensagem pronta.
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActionDialog(null)}>
                  Fechar
                </Button>
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={!whatsappUrl}
                  onClick={() => {
                    appendHistory(
                      'Simulação de envio por WhatsApp',
                      `PDF ${whatsappPdfFilename} preparado e envio por WhatsApp iniciado para ${whatsappRecipient?.name ?? 'cliente'}.`,
                      'success',
                    );
                    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                    setActionDialog(null);
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Gerar PDF e abrir WhatsApp
                </Button>
              </DialogFooter>
            </>
          ) : null}

          {actionDialog?.kind === 'pdf' ? (
            <>
              <DialogHeader>
                <DialogTitle>Gerar PDF</DialogTitle>
                <DialogDescription>
                  No protótipo, este botão representa a exportação do espelho do pedido.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                A versão final deve gerar PDF com cabeçalho do pedido, clientes, composição do kit, condições comerciais e totalizadores.
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActionDialog(null)}>
                  Fechar
                </Button>
                <Button
                  className="bg-[#001233] text-white hover:bg-[#001233]/90"
                  onClick={() => {
                    appendHistory(
                      'Simulação de geração de PDF',
                      'Usuário acionou a exportação do PDF do pedido.',
                      'default',
                    );
                    setActionDialog(null);
                  }}
                >
                  Registrar ação
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AvulsoDialog open={avulsoOpen} onOpenChange={setAvulsoOpen} onAddMany={handleAddMany} />
    </div>
  );
}

/* ------------------------------ Small presentational helpers ------------------------------ */
function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function OriginField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return ORIGIN_OPTIONS;
    return ORIGIN_OPTIONS.filter((item) => normalizeText(item).includes(q));
  }, [query]);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Origem</p>
      <div className="relative mt-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onBlur={() => {
            if (ORIGIN_OPTIONS.some((option) => option === query)) {
              onChange(query);
            } else {
              setQuery(value);
            }
          }}
          className="h-10 border-slate-300 pl-8"
          placeholder="Pesquisar origem"
        />
        {open ? (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-xs text-slate-500">Nenhuma origem encontrada.</div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(option);
                    setQuery(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${
                    option === value ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {option}
                  {option === value ? <Check className="h-3.5 w-3.5" /> : null}
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DetailGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{children}</div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ResumoRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${strong ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>{label}</span>
      <span className={`${strong ? 'text-base font-bold text-slate-950' : 'text-sm font-semibold text-slate-900'}`}>
        {value}
      </span>
    </div>
  );
}
