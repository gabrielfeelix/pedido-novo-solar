import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Building2,
  Cable,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Copy,
  Layers3,
  Minus,
  Package2,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  SunMedium,
  TimerReset,
  Trash2,
  UserRound,
  Wrench,
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
import {
  financingConditions,
  freightTypes,
  looseItems,
  orderMeta,
  orderClients,
  type SolarTechnicalApprovalStatus,
  type OrderParty,
} from '../data/solarOrderMockData';
import { usePedido, type GeneratorComponentItem, type SolarGenerator } from '../context/PedidoContext';

type OrderTab = 'items' | 'finance' | 'freight' | 'profitability' | 'approval' | 'billing' | 'blocks';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function normalizeText(value: string) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
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

function getCategoryIcon(category: GeneratorComponentItem['category']) {
  if (category === 'Painéis') return <SunMedium className="h-4 w-4" />;
  if (category === 'Inversores') return <Wrench className="h-4 w-4" />;
  if (category === 'Estrutura') return <Layers3 className="h-4 w-4" />;
  if (category === 'Acessórios') return <Cable className="h-4 w-4" />;
  return <Package2 className="h-4 w-4" />;
}

/* ------------------------------ Client Search Dialog ------------------------------ */
function ClientSearchDialog({
  open,
  onOpenChange,
  onSelect,
  title,
  description,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (client: OrderParty) => void;
  title: string;
  description: string;
}) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return orderClients;
    return orderClients.filter((c) =>
      normalizeText(`${c.name} ${c.document} ${c.contactName} ${c.city}`).includes(q),
    );
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Código, CNPJ, nome ou cidade"
            className="pl-9 border-slate-300 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
          />
        </div>
        <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Nenhum cliente encontrado.
            </div>
          ) : (
            filtered.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => {
                  onSelect(client);
                  onOpenChange(false);
                  setQuery('');
                }}
                className="flex w-full flex-col items-start gap-1 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-500 hover:bg-blue-50/40"
              >
                <div className="flex w-full items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{client.name}</p>
                  <Badge variant="outline" className="border-slate-200 bg-slate-50 text-xs text-slate-600">
                    {client.state}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">CNPJ {client.document} · {client.contactName}</p>
                <p className="text-xs text-slate-500">{client.street} · {client.city}/{client.state}</p>
              </button>
            ))
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------ Avulso Dialog ------------------------------ */
function AvulsoDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (productId: string, quantity: number) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return looseItems;
    return looseItems.filter((item) => normalizeText(`${item.name} ${item.sku} ${item.brand}`).includes(q));
  }, [query]);

  const selected = useMemo(() => looseItems.find((i) => i.id === selectedId), [selectedId]);

  function handleClose(v: boolean) {
    onOpenChange(v);
    if (!v) {
      setQuery('');
      setSelectedId(null);
      setQuantity(1);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Adicionar item avulso</DialogTitle>
          <DialogDescription>Busque por SKU ou nome e informe a quantidade para inserir no pedido.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex.: 401122, Disjuntor, Quadro"
            className="pl-9 border-slate-300 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
          />
        </div>
        <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
          {filtered.map((item) => {
            const isSel = selectedId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition ${
                  isSel ? 'border-blue-500 bg-blue-50/60' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">SKU {item.sku} · {item.brand}</p>
                </div>
                <span className="text-sm font-semibold text-slate-900">{formatCurrency(item.unitPrice)}</span>
              </button>
            );
          })}
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Nenhum item encontrado.
            </div>
          ) : null}
        </div>
        {selected ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{selected.name}</p>
              <p className="text-xs text-slate-500">Subtotal {formatCurrency(selected.unitPrice * quantity)}</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white p-1">
              <Button variant="ghost" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-8 text-center text-sm font-semibold text-slate-900">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => setQuantity((q) => q + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>Cancelar</Button>
          <Button
            disabled={!selected}
            onClick={() => {
              if (!selected) return;
              onAdd(selected.id, quantity);
              handleClose(false);
            }}
            className="bg-[#001233] text-white hover:bg-[#001233]/90"
          >
            Inserir no pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------ Client Card ------------------------------ */
function ClientCard({
  title,
  client,
  onSearch,
  onClear,
  icon,
}: {
  title: string;
  client: OrderParty | null;
  onSearch: () => void;
  onClear: () => void;
  icon: React.ReactNode;
}) {
  if (!client) {
    return (
      <Card className="border-dashed border-slate-300 bg-slate-50/60 shadow-none">
        <CardContent className="flex flex-col items-start gap-3 py-6">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            {icon} {title}
          </div>
          <p className="text-sm text-slate-600">Nenhum cliente selecionado. Busque por código, CNPJ ou nome.</p>
          <Button variant="outline" onClick={onSearch} className="border-slate-300">
            <Search className="h-4 w-4" /> Buscar cliente
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              {icon} {title}
            </div>
            <CardTitle className="mt-1 text-lg font-semibold text-slate-900">{client.name}</CardTitle>
            <CardDescription>CNPJ {client.document}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onSearch}>Alterar</Button>
            <Button variant="ghost" size="icon" onClick={onClear} aria-label="Remover cliente">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 pb-5 md:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Contato</p>
          <p className="mt-1 text-sm text-slate-900">{client.contactName}</p>
          <p className="text-sm text-slate-500">{client.phone}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Endereço</p>
          <p className="mt-1 text-sm text-slate-900">{client.street}</p>
          <p className="text-sm text-slate-500">{client.district} · {client.city}/{client.state} · CEP {client.zipCode}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================== Main Page ============================== */
export function SolarOrderPage() {
  const navigate = useNavigate();
  const pedido = usePedido();

  const [activeTab, setActiveTab] = useState<OrderTab>('items');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [clientePedidoOpen, setClientePedidoOpen] = useState(false);
  const [clienteNotaOpen, setClienteNotaOpen] = useState(false);
  const [avulsoOpen, setAvulsoOpen] = useState(false);

  const orderTotals = useMemo(() => {
    const subtotal = pedido.orderItems.reduce((t, i) => t + i.total, 0);
    const prizeDirect = pedido.orderItems.reduce((t, i) => (i.type === 'generator' ? t + i.prizeAmount : t), 0);
    const freight = pedido.deliveryArea === 'rural' ? 440 : 0;
    const total = subtotal + freight;
    const itemCount = pedido.orderItems.reduce((t, i) => {
      if (i.type === 'generator') return t + i.components.reduce((s, c) => s + c.quantity, 0);
      return t + i.quantity;
    }, 0);
    return { subtotal, prizeDirect, freight, total, itemCount };
  }, [pedido.orderItems, pedido.deliveryArea]);

  const generators = pedido.orderItems.filter((i): i is SolarGenerator => i.type === 'generator');
  const pendingApprovals = generators.filter((g) => g.approvalStatus === 'pending').length;
  const hasGeneratedOrder = pedido.orderItems.length > 0;
  const orderNumber = orderMeta.find((item) => item.label === 'Pedido')?.value ?? '#1615449';
  const createdAt = orderMeta.find((item) => item.label === 'Cadastro no CRM')?.value ?? '01/04/2026 01:46:11';
  const statusValue = orderMeta.find((item) => item.label === 'Status')?.value ?? 'Rascunho';
  const headerTitle = hasGeneratedOrder ? `Pedido ${orderNumber}` : 'Novo pedido solar';
  const headerDescription = hasGeneratedOrder
    ? `Criado no CRM em ${createdAt}. Fluxo consolidado com itens, aprovação técnica e fechamento no mesmo contexto.`
    : 'Monte o gerador, adicione itens avulsos e fecha aqui mesmo — sem pular para Plataforma Solar ou Azux.';
  const topMetaFields = orderMeta.filter((item) =>
    ['Data do Pedido', 'Cadastro no CRM', 'Filial', 'Origem'].includes(item.label),
  );

  function handleAddLoose(productId: string, quantity: number) {
    const product = looseItems.find((i) => i.id === productId);
    if (!product) return;
    pedido.addLooseItem({
      id: `loose-${Date.now()}`,
      type: 'loose',
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      quantity,
      unitPrice: product.unitPrice,
      total: product.unitPrice * quantity,
    });
  }

  function toggleExpanded(id: string) {
    setExpandedItems((s) => ({ ...s, [id]: !s[id] }));
  }

  const hasClient = Boolean(pedido.clientePedido);

  return (
    <div className="min-h-full bg-slate-50 py-8">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-800">
                Pedido Venda Solar
              </Badge>
              <Badge variant="outline" className="rounded-full border-slate-300 bg-white text-xs text-slate-600">
                {statusValue}
              </Badge>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{headerTitle}</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              {headerDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={pedido.resetOrder}>
              <Trash2 className="h-4 w-4" /> Limpar rascunho
            </Button>
            <Button variant="outline">Enviar e-mail</Button>
            <Button variant="outline">Gerar PDF</Button>
            <Button
              className="bg-[#001233] text-white hover:bg-[#001233]/90"
              disabled={!hasClient || pedido.orderItems.length === 0}
            >
              Salvar pedido
            </Button>
          </div>
        </div>

        {hasGeneratedOrder ? (
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-4">
            {topMetaFields.map((field) => (
              <div key={field.label}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  {field.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{field.value}</p>
              </div>
            ))}
          </div>
        ) : null}

        {/* Clients */}
        <div className="grid gap-4 md:grid-cols-2">
          <ClientCard
            title="Cliente Pedido (Integrador)"
            icon={<Building2 className="h-4 w-4" />}
            client={pedido.clientePedido}
            onSearch={() => setClientePedidoOpen(true)}
            onClear={() => pedido.setClientePedido(null)}
          />
          <ClientCard
            title="Cliente Nota (Consumidor Final)"
            icon={<UserRound className="h-4 w-4" />}
            client={pedido.clienteNota}
            onSearch={() => setClienteNotaOpen(true)}
            onClear={() => pedido.setClienteNota(null)}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrderTab)}>
          <TabsList className="w-full justify-start overflow-auto rounded-xl border border-slate-200 bg-white p-1">
            <TabsTrigger value="items">Itens {pedido.orderItems.length > 0 ? `(${pedido.orderItems.length})` : ''}</TabsTrigger>
            <TabsTrigger value="finance">Financeiro</TabsTrigger>
            <TabsTrigger value="freight">Frete</TabsTrigger>
            <TabsTrigger value="profitability">Lucratividade</TabsTrigger>
            <TabsTrigger value="approval">
              Aprovação Técnica{pendingApprovals > 0 ? ` · ${pendingApprovals}` : ''}
            </TabsTrigger>
            <TabsTrigger value="billing">Faturamento</TabsTrigger>
            <TabsTrigger value="blocks">Bloqueios</TabsTrigger>
          </TabsList>

          {/* ITEMS TAB */}
          <TabsContent value="items" className="space-y-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Itens do pedido</h2>
                <p className="text-sm text-slate-600">
                  Geradores aparecem como produto fechado (1 linha), com expansão para os componentes internos.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setAvulsoOpen(true)}>
                  <Plus className="h-4 w-4" /> Item avulso
                </Button>
                <Button
                  className="bg-[#001233] text-white hover:bg-[#001233]/90"
                  onClick={() => navigate('/vendas/pedidos/solar-builder')}
                >
                  <SunMedium className="h-4 w-4" /> Montar Gerador Solar
                </Button>
              </div>
            </div>

            {pedido.orderItems.length === 0 ? (
              <Card className="border-dashed border-slate-300 bg-white shadow-none">
                <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                    <ShoppingCart className="h-7 w-7 text-slate-400" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Nenhum item adicionado ainda</p>
                  <p className="max-w-md text-sm text-slate-500">
                    Comece por <strong>Montar Gerador Solar</strong> — o fluxo step-by-step monta o kit completo. Depois
                    você pode adicionar itens avulsos que não façam parte do gerador.
                  </p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    <Button
                      className="bg-[#001233] text-white hover:bg-[#001233]/90"
                      onClick={() => navigate('/vendas/pedidos/solar-builder')}
                    >
                      <SunMedium className="h-4 w-4" /> Montar gerador
                    </Button>
                    <Button variant="outline" onClick={() => setAvulsoOpen(true)}>
                      <Plus className="h-4 w-4" /> Item avulso
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {pedido.orderItems.map((item) => (
                  <Card key={item.id} className="border-slate-200 shadow-sm">
                    <CardContent className="py-5">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={item.type === 'generator' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}>
                              {item.type === 'generator' ? 'Gerador Solar' : 'Item avulso'}
                            </Badge>
                            {item.type === 'generator' ? (
                              <Badge variant="outline" className={statusStyles(item.approvalStatus)}>
                                {statusLabel(item.approvalStatus)}
                              </Badge>
                            ) : null}
                          </div>
                          <p className="text-lg font-semibold text-slate-950">
                            {item.type === 'generator' ? item.title : item.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            SKU {item.sku}
                            {item.type === 'generator'
                              ? ` · ${item.connectionType} · ${item.state} · ${item.powerKwp.toFixed(2)} kWp`
                              : ` · ${item.brand} · ${item.quantity} un`}
                          </p>
                          {item.type === 'generator' ? (
                            <div className="flex flex-wrap gap-1.5">
                              <Badge variant="outline" className="border-slate-200 bg-slate-50 text-xs text-slate-600">
                                {item.components.length} componentes
                              </Badge>
                              {item.components.slice(0, 3).map((c) => (
                                <Badge key={c.id} variant="outline" className="border-slate-200 bg-slate-50 text-xs text-slate-600">
                                  {c.quantity}x {c.name.split(' ').slice(0, 3).join(' ')}
                                </Badge>
                              ))}
                              {item.components.length > 3 ? (
                                <Badge variant="outline" className="border-slate-200 bg-slate-50 text-xs text-slate-500">
                                  +{item.components.length - 3}
                                </Badge>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                        <div className="flex flex-col items-start gap-3 xl:items-end">
                          <div className="text-left xl:text-right">
                            <p className="text-xs uppercase tracking-wider text-slate-400">Valor</p>
                            <p className="text-2xl font-bold text-slate-950">{formatCurrency(item.total)}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => toggleExpanded(item.id)}>
                              {expandedItems[item.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              {expandedItems[item.id] ? 'Recolher' : 'Detalhar'}
                            </Button>
                            {item.type === 'generator' ? (
                              <Button variant="outline" size="sm" onClick={() => pedido.duplicateGenerator(item.id)}>
                                <Copy className="h-4 w-4" /> Duplicar
                              </Button>
                            ) : null}
                            <Button variant="ghost" size="icon" onClick={() => pedido.removeItem(item.id)} aria-label="Remover item">
                              <Trash2 className="h-4 w-4 text-slate-500" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {expandedItems[item.id] && item.type === 'generator' ? (
                        <div className="mt-5 space-y-3 border-t border-slate-200 pt-5">
                          {Object.entries(
                            item.components.reduce<Record<string, GeneratorComponentItem[]>>((acc, c) => {
                              acc[c.category] = [...(acc[c.category] ?? []), c];
                              return acc;
                            }, {}),
                          ).map(([group, components]) => (
                            <div key={group} className="rounded-xl bg-slate-50 p-3">
                              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                {getCategoryIcon(group as GeneratorComponentItem['category'])} {group}
                              </div>
                              <div className="space-y-2">
                                {components.map((c) => (
                                  <div
                                    key={c.id}
                                    className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 md:flex-row md:items-center md:justify-between"
                                  >
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-medium text-slate-900">{c.name}</p>
                                      <p className="text-xs text-slate-500">SKU {c.sku} · {c.brand}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white p-0.5">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7"
                                          onClick={() => pedido.updateGeneratorComponent(item.id, c.id, -1)}
                                        >
                                          <Minus className="h-3.5 w-3.5" />
                                        </Button>
                                        <span className="min-w-8 text-center text-sm font-semibold text-slate-900">{c.quantity}</span>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7"
                                          onClick={() => pedido.updateGeneratorComponent(item.id, c.id, 1)}
                                        >
                                          <Plus className="h-3.5 w-3.5" />
                                        </Button>
                                      </div>
                                      <div className="min-w-[110px] text-right">
                                        <p className="text-sm font-semibold text-slate-900">
                                          {formatCurrency(c.quantity * c.unitPrice)}
                                        </p>
                                        <p className="text-xs text-slate-500">{formatCurrency(c.unitPrice)}/un</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {expandedItems[item.id] && item.type === 'loose' ? (
                        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                          {item.quantity} × {formatCurrency(item.unitPrice)} = {formatCurrency(item.total)}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Totals row */}
            {pedido.orderItems.length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-slate-900">Observações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Observação nota</label>
                      <Textarea
                        value={pedido.invoiceObservation}
                        onChange={(e) => pedido.setInvoiceObservation(e.target.value)}
                        placeholder="Ex.: não entregar sem agendamento prévio"
                        className="border-slate-300 focus-visible:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Observação pedido</label>
                      <Textarea
                        value={pedido.orderObservation}
                        onChange={(e) => pedido.setOrderObservation(e.target.value)}
                        placeholder="Alinhamentos do consultor, fechamento, negociação"
                        className="border-slate-300 focus-visible:border-blue-500"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-[#001233] text-white shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-white">Resumo do pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>Itens somados</span>
                      <strong className="text-white">{orderTotals.itemCount}</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal</span>
                      <strong className="text-white">{formatCurrency(orderTotals.subtotal)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Prêmio venda direta</span>
                      <strong className="text-emerald-400">+{formatCurrency(orderTotals.prizeDirect)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Frete</span>
                      <strong className="text-white">{formatCurrency(orderTotals.freight)}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-700 pt-3 text-base">
                      <span className="text-slate-200">Total geral</span>
                      <strong className="text-2xl text-white">{formatCurrency(orderTotals.total)}</strong>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
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
                  <p className="mt-1 text-2xl font-bold text-slate-950">{formatCurrency(orderTotals.subtotal)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Prêmio venda direta</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{formatCurrency(orderTotals.prizeDirect)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Margem</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {orderTotals.subtotal > 0 ? `${((orderTotals.prizeDirect / orderTotals.subtotal) * 100).toFixed(2)}%` : '—'}
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
                <CardDescription>Emissão de nota fiscal seguindo o cliente nota selecionado.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Cliente nota</p>
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
            {!hasClient ? (
              <Card className="border-amber-200 bg-amber-50 shadow-none">
                <CardContent className="flex items-start gap-3 py-4 text-sm text-amber-900">
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>Pedido sem cliente vinculado. Variações tributárias podem alterar o valor final.</p>
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
            {hasClient && pendingApprovals === 0 ? (
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="py-6 text-center text-sm text-slate-500">Nenhum bloqueio ativo.</CardContent>
              </Card>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>

      <ClientSearchDialog
        open={clientePedidoOpen}
        onOpenChange={setClientePedidoOpen}
        onSelect={pedido.setClientePedido}
        title="Buscar Cliente Pedido"
        description="Integrador responsável pelo pedido."
      />
      <ClientSearchDialog
        open={clienteNotaOpen}
        onOpenChange={setClienteNotaOpen}
        onSelect={pedido.setClienteNota}
        title="Buscar Cliente Nota"
        description="Consumidor final que receberá a nota fiscal."
      />
      <AvulsoDialog open={avulsoOpen} onOpenChange={setAvulsoOpen} onAdd={handleAddLoose} />
    </div>
  );
}
