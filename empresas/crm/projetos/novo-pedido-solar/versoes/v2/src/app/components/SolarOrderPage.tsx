import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  CalendarClock,
  CheckCheck,
  ChevronRight,
  ClipboardCheck,
  Copy,
  FileText,
  History,
  Info,
  Plus,
  Search,
  Send,
  ShieldAlert,
  SunMedium,
  Trash2,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
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
import { BudgetEmptyState } from './budget/BudgetEmptyState';
import { ItemsTable } from './budget/ItemsTable';
import {
  financingConditions,
  looseCategories,
  looseItems,
  states,
  type LooseCategory,
} from '../data/solarOrderMockData';
import { usePedido, type SolarGenerator } from '../context/PedidoContext';
import { calculateBudgetTotals, pricingForOrderItem } from '../lib/solarOrderPricing';

type BudgetTab = 'items' | 'commercial' | 'approval' | 'observations' | 'history';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function statusTone(status: string) {
  if (status === 'converted') return 'bg-emerald-100 text-emerald-800';
  if (status === 'ready_to_convert') return 'bg-blue-100 text-blue-800';
  if (status === 'sent') return 'bg-indigo-100 text-indigo-800';
  if (status === 'pending_technical') return 'bg-amber-100 text-amber-900';
  if (status === 'expired') return 'bg-rose-100 text-rose-800';
  if (status === 'quoted') return 'bg-slate-100 text-slate-700';
  return 'bg-slate-100 text-slate-600';
}

function statusLabel(status: string) {
  if (status === 'converted') return 'Pedido gerado';
  if (status === 'ready_to_convert') return 'Pronto para formalizar';
  if (status === 'sent') return 'Enviado ao cliente';
  if (status === 'pending_technical') return 'Pendente técnico';
  if (status === 'expired') return 'Expirado';
  if (status === 'quoted') return 'Em revisão';
  return 'Rascunho';
}

function approvalTone(status: SolarGenerator['approvalStatus']) {
  if (status === 'approved') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  if (status === 'pending') return 'border-amber-200 bg-amber-50 text-amber-900';
  if (status === 'rejected') return 'border-rose-200 bg-rose-50 text-rose-900';
  return 'border-slate-200 bg-slate-50 text-slate-700';
}

export function SolarOrderPage() {
  const navigate = useNavigate();
  const { budgetId } = useParams();
  const pedido = usePedido();

  const [itemFilter, setItemFilter] = useState('');
  const [activeTab, setActiveTab] = useState<BudgetTab>('items');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [looseDialogOpen, setLooseDialogOpen] = useState(false);
  const [looseQuery, setLooseQuery] = useState('');
  const [looseCategory, setLooseCategory] = useState<'all' | LooseCategory>('all');
  const [emptyStateNotice, setEmptyStateNotice] = useState<string | null>(null);

  const budget = budgetId ? pedido.getBudgetById(budgetId) : null;

  useEffect(() => {
    if (!budgetId) return;
    pedido.selectBudget(budgetId);
  }, [budgetId, pedido]);

  useEffect(() => {
    if (!budget) navigate('/vendas/orcamentos-solar');
  }, [budget, navigate]);

  useEffect(() => {
    if (!budget) return;
    setExpandedItems((current) => {
      const validIds = new Set(budget.orderItems.map((item) => item.id));
      return Object.fromEntries(Object.entries(current).filter(([id]) => validIds.has(id)));
    });
  }, [budget]);

  const totals = useMemo(() => {
    if (!budget) {
      return {
        grossTotal: 0,
        discountTotal: 0,
        prizeTotal: 0,
        netTotal: 0,
        itemCount: 0,
        freightSurcharge: 0,
        grandTotal: 0,
      };
    }

    return calculateBudgetTotals(
      budget.orderItems,
      budget.saleType,
      budget.lineAdjustments,
      budget.destinationState,
      budget.deliveryArea,
    );
  }, [budget]);

  const filteredItems = useMemo(() => {
    if (!budget) return [];
    const query = itemFilter.trim().toLowerCase();
    if (!query) return budget.orderItems;

    return budget.orderItems.filter((item) => {
      const haystack = item.type === 'generator'
        ? `${item.title} ${item.sku} ${item.components.map((component) => `${component.name} ${component.sku}`).join(' ')}`
        : `${item.name} ${item.sku} ${item.brand}`;
      return haystack.toLowerCase().includes(query);
    });
  }, [budget, itemFilter]);

  const generators = useMemo(
    () => (budget?.orderItems.filter((item): item is SolarGenerator => item.type === 'generator') ?? []),
    [budget],
  );

  const looseOptions = useMemo(() => {
    const query = looseQuery.trim().toLowerCase();
    return looseItems.filter((item) => {
      if (looseCategory !== 'all' && item.category !== looseCategory) return false;
      if (!query) return true;
      return `${item.name} ${item.sku} ${item.brand}`.toLowerCase().includes(query);
    });
  }, [looseCategory, looseQuery]);

  if (!budget) return null;

  const pendingApprovals = generators.filter((item) => item.approvalStatus === 'pending').length;
  const isExpired = budget.status === 'expired';
  const canFormalize = budget.status !== 'converted' && !isExpired && pendingApprovals === 0 && budget.orderItems.length > 0;

  function toggleExpanded(id: string) {
    setExpandedItems((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  function addLooseItem(looseItemId: string) {
    const looseItem = looseItems.find((item) => item.id === looseItemId);
    if (!looseItem) return;

    pedido.addLooseItem({
      id: `loose-${Date.now()}`,
      type: 'loose',
      name: looseItem.name,
      sku: looseItem.sku,
      brand: looseItem.brand,
      quantity: 1,
      unitPrice: looseItem.unitPrice,
      total: looseItem.unitPrice,
    });
    setLooseDialogOpen(false);
    setEmptyStateNotice(`${looseItem.name} foi incluído no orçamento.`);
  }

  function handleGeneratePdf() {
    pedido.markBudgetPdfGenerated();
    setEmptyStateNotice(`PDF comercial do orçamento ${budget.budgetNumber} preparado para envio.`);
  }

  function handleMarkSent() {
    pedido.markBudgetSent();
    setEmptyStateNotice(`Orçamento ${budget.budgetNumber} marcado como enviado.`);
  }

  function handleRenewValidity() {
    pedido.renewBudgetValidity(7);
    setEmptyStateNotice(`Validade do orçamento ${budget.budgetNumber} renovada por mais 7 dias.`);
  }

  function openNewBudgetFromCopy() {
    const duplicated = pedido.duplicateBudgetRecord(budget.id);
    if (duplicated) navigate(`/vendas/orcamentos-solar/${duplicated.id}`);
  }

  return (
    <div className="min-h-full bg-transparent py-8">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={() => navigate('/vendas/orcamentos-solar')}>
                <ArrowLeft className="h-4 w-4" /> Voltar à listagem
              </Button>
              <Badge className={`rounded-full hover:opacity-100 ${statusTone(budget.status)}`}>
                {statusLabel(budget.status)}
              </Badge>
              <span className="font-mono text-xs text-slate-400">{budget.budgetNumber}</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {budget.name}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Orçamento comercial preliminar. Cliente final e tipo de venda só entram na formalização do pedido.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={openNewBudgetFromCopy}>
              <Copy className="h-4 w-4" /> Duplicar orçamento
            </Button>
            <Button variant="outline" onClick={handleGeneratePdf}>
              <FileText className="h-4 w-4" /> Gerar PDF
            </Button>
            <Button variant="outline" onClick={handleMarkSent}>
              <Send className="h-4 w-4" /> Marcar como enviado
            </Button>
            {budget.orderDraft ? (
              <Button className="bg-[#001233] text-white hover:bg-[#001233]/90" onClick={() => navigate(`/vendas/pedidos/${budget.orderDraft?.orderNumber}`)}>
                Abrir pedido <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="bg-[#001233] text-white hover:bg-[#001233]/90"
                disabled={!canFormalize}
                onClick={() => navigate(`/vendas/orcamentos-solar/${budget.id}/fechamento`)}
              >
                Formalizar pedido <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {budget.orderDraft ? (
          <Card className="border-emerald-200 bg-emerald-50 shadow-none">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="flex items-start gap-3 text-sm text-emerald-900">
                <CheckCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-semibold">Este orçamento já virou pedido</p>
                  <p className="mt-1">
                    Pedido {budget.orderDraft.orderNumber} aberto com dados comerciais e logísticos vinculados.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate(`/vendas/pedidos/${budget.orderDraft?.orderNumber}`)}>
                Abrir pedido
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {pendingApprovals > 0 ? (
          <Card className="border-amber-200 bg-amber-50 shadow-none">
            <CardContent className="flex items-start gap-3 py-4 text-sm text-amber-900">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Aprovação técnica pendente</p>
                <p className="mt-1">
                  {pendingApprovals} gerador(es) estão fora do padrão e bloqueiam o envio final e a formalização.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {isExpired ? (
          <Card className="border-rose-200 bg-rose-50 shadow-none">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm text-rose-900">
              <div className="flex items-start gap-3">
                <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-semibold">Orçamento expirado</p>
                  <p className="mt-1">
                    Renove a validade para liberar a formalização em pedido.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleRenewValidity}>
                Renovar validade
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Valor bruto</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{formatCurrency(totals.grossTotal)}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Desconto</p>
              <p className="mt-2 text-2xl font-bold text-rose-600">-{formatCurrency(totals.discountTotal)}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Prêmio</p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">+{formatCurrency(totals.prizeTotal)}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Itens</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{totals.itemCount}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Total final</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{formatCurrency(totals.grandTotal)}</p>
            </CardContent>
          </Card>
        </div>

        {budget.orderItems.length === 0 ? (
          <BudgetEmptyState
            budgetNumber={budget.budgetNumber}
            emptyStateNotice={emptyStateNotice}
            onBuildKit={() => navigate(`/vendas/orcamentos-solar/${budget.id}/solar-builder`)}
            onAddLooseItem={() => setLooseDialogOpen(true)}
          />
        ) : (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-5">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BudgetTab)}>
                <TabsList className="w-full justify-start overflow-auto rounded-xl border border-slate-200 bg-white p-1">
                  <TabsTrigger value="items">Itens</TabsTrigger>
                  <TabsTrigger value="commercial">Comercial</TabsTrigger>
                  <TabsTrigger value="approval">Aprovação técnica</TabsTrigger>
                  <TabsTrigger value="observations">Observações</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>

                <TabsContent value="items" className="space-y-5 pt-5">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div className="relative max-w-md flex-1">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        value={itemFilter}
                        onChange={(event) => setItemFilter(event.target.value)}
                        placeholder="Filtrar por SKU, nome ou marca"
                        className="pl-9"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={() => setLooseDialogOpen(true)}>
                        <Plus className="h-4 w-4" /> Produto avulso
                      </Button>
                      <Button className="bg-[#001233] text-white hover:bg-[#001233]/90" onClick={() => navigate(`/vendas/orcamentos-solar/${budget.id}/solar-builder`)}>
                        <SunMedium className="h-4 w-4" /> Montar kit solar
                      </Button>
                    </div>
                  </div>

                  <ItemsTable
                    items={filteredItems}
                    saleType={budget.saleType}
                    expandedItems={expandedItems}
                    pricingAdjustments={budget.lineAdjustments}
                    toggleExpanded={toggleExpanded}
                    onPricingAdjustmentChange={pedido.setLineAdjustment}
                    onDuplicateGenerator={pedido.duplicateGenerator}
                    onRemoveItem={pedido.removeItem}
                    onUpdateGeneratorComponent={pedido.updateGeneratorComponent}
                  />
                </TabsContent>

                <TabsContent value="commercial" className="space-y-5 pt-5">
                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="border-slate-200 shadow-none">
                        <CardHeader>
                          <CardTitle className="text-base">Dados comerciais</CardTitle>
                          <CardDescription>
                            O orçamento já considera a UF de destino e a área de entrega.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                              Nome do orçamento
                            </p>
                            <Input value={budget.name} onChange={(event) => pedido.setBudgetName(event.target.value)} />
                          </div>
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                              UF destino
                            </p>
                            <Select value={budget.destinationState} onValueChange={pedido.setDestinationState}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {states.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                              Validade
                            </p>
                            <Input type="date" value={budget.validUntil} onChange={(event) => pedido.setValidUntil(event.target.value)} />
                          </div>
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                              Condição sugerida
                            </p>
                            <Select value={budget.financialCondition} onValueChange={pedido.setFinancialCondition}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {financingConditions.map((condition) => (
                                  <SelectItem key={condition} value={condition}>
                                    {condition}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200 shadow-none">
                        <CardHeader>
                          <CardTitle className="text-base">Leitura financeira</CardTitle>
                          <CardDescription>
                            Valores consolidados do orçamento antes da formalização do pedido.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between text-sm text-slate-600">
                            <span>Valor bruto</span>
                            <span className="font-semibold text-slate-900">{formatCurrency(totals.grossTotal)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-slate-600">
                            <span>Desconto</span>
                            <span className="font-semibold text-rose-600">-{formatCurrency(totals.discountTotal)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-slate-600">
                            <span>Prêmio</span>
                            <span className="font-semibold text-emerald-600">+{formatCurrency(totals.prizeTotal)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-slate-600">
                            <span>Taxa rural</span>
                            <span className="font-semibold text-slate-900">{formatCurrency(totals.freightSurcharge)}</span>
                          </div>
                          <div className="border-t border-slate-100 pt-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-600">Total final</span>
                              <span className="text-2xl font-bold text-slate-950">{formatCurrency(totals.grandTotal)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-slate-200 shadow-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Info className="h-4 w-4 text-slate-400" />
                          Contexto logístico
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm text-slate-600">
                        <p>
                          A proposta já considera a região <strong className="text-slate-900">{budget.destinationState}</strong>.
                        </p>
                        <p>
                          No V1, a transportadora não é definida no orçamento. Essa decisão acontece depois da formalização, junto com a logística.
                        </p>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                          Transportadora definida pela logística após formalização.
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="approval" className="space-y-4 pt-5">
                  {generators.length === 0 ? (
                    <Card className="border-dashed border-slate-300 shadow-none">
                      <CardContent className="py-10 text-center text-sm text-slate-500">
                        Ainda não há kits no orçamento para avaliação técnica.
                      </CardContent>
                    </Card>
                  ) : (
                    generators.map((generator) => (
                      <Card key={generator.id} className={`shadow-none ${approvalTone(generator.approvalStatus)}`}>
                        <CardContent className="space-y-4 py-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-lg font-semibold">{generator.title}</p>
                              <p className="mt-1 text-sm">
                                {generator.powerKwp.toFixed(2)} kWp · SKU {generator.sku}
                              </p>
                            </div>
                            <Badge className={statusTone(generator.approvalStatus).replace('rounded-full ', '')}>
                              {generator.approvalStatus === 'approved'
                                ? 'Aprovado'
                                : generator.approvalStatus === 'pending'
                                  ? 'Pendente'
                                  : generator.approvalStatus === 'rejected'
                                    ? 'Reprovado'
                                    : 'Sem aprovação'}
                            </Badge>
                          </div>

                          <p className="text-sm">{generator.approvalNote}</p>

                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => pedido.updateApproval(generator.id, 'pending')}>
                              Marcar pendente
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => pedido.updateApproval(generator.id, 'approved')}>
                              Aprovar
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => pedido.updateApproval(generator.id, 'rejected')}>
                              Reprovar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="observations" className="space-y-4 pt-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-slate-200 shadow-none">
                      <CardHeader>
                        <CardTitle className="text-base">Observação interna</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={budget.orderObservation}
                          onChange={(event) => pedido.setOrderObservation(event.target.value)}
                          rows={8}
                          placeholder="Use este campo para orientar operação e fechamento."
                        />
                      </CardContent>
                    </Card>
                    <Card className="border-slate-200 shadow-none">
                      <CardHeader>
                        <CardTitle className="text-base">Observação fiscal / nota</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={budget.invoiceObservation}
                          onChange={(event) => pedido.setInvoiceObservation(event.target.value)}
                          rows={8}
                          placeholder="Pode ficar em branco até a formalização."
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4 pt-5">
                  <Card className="border-slate-200 shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <History className="h-4 w-4 text-slate-400" />
                        Histórico do orçamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {budget.history.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                          Ainda não há eventos registrados.
                        </div>
                      ) : (
                        budget.history.map((entry) => (
                          <div key={entry.id} className="rounded-xl border border-slate-200 px-4 py-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="font-semibold text-slate-900">{entry.title}</p>
                              <span className="text-xs text-slate-400">{entry.timestamp}</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">{entry.description}</p>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={looseDialogOpen} onOpenChange={setLooseDialogOpen}>
        <DialogContent className="sm:max-w-[760px]">
          <DialogHeader>
            <DialogTitle>Adicionar produto avulso</DialogTitle>
            <DialogDescription>
              Use avulsos para complementar o orçamento sem misturar com personalização técnica do gerador.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={looseQuery}
                onChange={(event) => setLooseQuery(event.target.value)}
                placeholder="Buscar por nome, SKU ou marca"
                className="pl-9"
              />
            </div>
            <Select value={looseCategory} onValueChange={(value) => setLooseCategory(value as 'all' | LooseCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {looseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
            {looseOptions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                Nenhum item encontrado com os filtros atuais.
              </div>
            ) : (
              looseOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => addLooseItem(item.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      SKU {item.sku} · {item.brand} · {item.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900">{formatCurrency(item.unitPrice)}</span>
                    <Plus className="h-4 w-4 text-slate-400" />
                  </div>
                </button>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setLooseDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
