import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRight,
  Copy,
  FileSpreadsheet,
  Filter,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { usePedido, type Budget, type BudgetStatus } from '../context/PedidoContext';
import { calculateBudgetTotals } from '../lib/solarOrderPricing';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(value: string) {
  if (!value) return '—';
  if (value.includes('/')) return value;
  return value.split('-').reverse().join('/');
}

function statusTone(status: BudgetStatus) {
  if (status === 'converted') return 'bg-emerald-100 text-emerald-800';
  if (status === 'ready_to_convert') return 'bg-blue-100 text-blue-800';
  if (status === 'sent') return 'bg-indigo-100 text-indigo-800';
  if (status === 'pending_technical') return 'bg-amber-100 text-amber-900';
  if (status === 'expired') return 'bg-rose-100 text-rose-800';
  if (status === 'quoted') return 'bg-slate-100 text-slate-700';
  return 'bg-slate-100 text-slate-600';
}

function statusLabel(status: BudgetStatus) {
  if (status === 'converted') return 'Convertido';
  if (status === 'ready_to_convert') return 'Pronto para pedido';
  if (status === 'sent') return 'Enviado';
  if (status === 'pending_technical') return 'Pendente técnico';
  if (status === 'expired') return 'Expirado';
  if (status === 'quoted') return 'Em revisão';
  return 'Rascunho';
}

function matchesQuery(budget: Budget, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  const haystack = [
    budget.budgetNumber,
    budget.name,
    budget.consultantName,
    budget.destinationState,
    budget.partyLink.integrator?.name ?? '',
    budget.partyLink.billingClient?.name ?? '',
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalized);
}

export function SolarBudgetListPage() {
  const navigate = useNavigate();
  const pedido = usePedido();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BudgetStatus>('all');
  const [technicalFilter, setTechnicalFilter] = useState<'all' | 'pending' | 'clean'>('all');

  const budgets = useMemo(() => {
    return pedido.budgets.filter((budget) => {
      if (!matchesQuery(budget, query)) return false;
      if (statusFilter !== 'all' && budget.status !== statusFilter) return false;
      const hasPendingTechnical = budget.orderItems.some(
        (item) => item.type === 'generator' && item.approvalStatus === 'pending',
      );
      if (technicalFilter === 'pending' && !hasPendingTechnical) return false;
      if (technicalFilter === 'clean' && hasPendingTechnical) return false;
      return true;
    });
  }, [pedido.budgets, query, statusFilter, technicalFilter]);

  const counters = useMemo(() => {
    return pedido.budgets.reduce(
      (acc, budget) => {
        acc.total += 1;
        if (budget.status === 'converted') acc.converted += 1;
        if (budget.status === 'pending_technical') acc.pendingTechnical += 1;
        if (budget.status === 'ready_to_convert') acc.ready += 1;
        return acc;
      },
      { total: 0, converted: 0, pendingTechnical: 0, ready: 0 },
    );
  }, [pedido.budgets]);

  return (
    <div className="min-h-full bg-transparent py-8">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4 rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.10),_transparent_40%),linear-gradient(135deg,_#ffffff,_#f8fafc)] p-6 shadow-sm">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-sky-100 text-sky-800 hover:bg-sky-100">
                Orçamentos Solares
              </Badge>
              <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">
                Fluxo V1
              </Badge>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Listagem de orçamentos
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Central de trabalho para montar, revisar, reenviar e transformar orçamentos em pedido.
              O fluxo começa sem cliente obrigatório e só ganha integrador e cliente final na formalização.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              className="bg-[#001233] text-white hover:bg-[#001233]/90"
              onClick={() => {
                const created = pedido.createBudget();
                navigate(`/vendas/orcamentos-solar/${created.id}`);
              }}
            >
              <Plus className="h-4 w-4" /> Novo orçamento solar
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Total</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{counters.total}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Prontos para pedido</p>
              <p className="mt-2 text-3xl font-bold text-blue-700">{counters.ready}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Pendência técnica</p>
              <p className="mt-2 text-3xl font-bold text-amber-700">{counters.pendingTechnical}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Pedidos gerados</p>
              <p className="mt-2 text-3xl font-bold text-emerald-700">{counters.converted}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4 text-slate-400" />
              Filtros
            </CardTitle>
            <CardDescription>
              Filtre por código, consultor, status, validade e situação técnica.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr_0.8fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por código, nome, consultor, integrador ou cliente"
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | BudgetStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="quoted">Em revisão</SelectItem>
                <SelectItem value="ready_to_convert">Pronto para pedido</SelectItem>
                <SelectItem value="pending_technical">Pendente técnico</SelectItem>
                <SelectItem value="sent">Enviado</SelectItem>
                <SelectItem value="expired">Expirado</SelectItem>
                <SelectItem value="converted">Convertido</SelectItem>
              </SelectContent>
            </Select>
            <Select value={technicalFilter} onValueChange={(value) => setTechnicalFilter(value as 'all' | 'pending' | 'clean')}>
              <SelectTrigger>
                <SelectValue placeholder="Técnico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Qualquer situação técnica</SelectItem>
                <SelectItem value="pending">Com pendência técnica</SelectItem>
                <SelectItem value="clean">Sem pendência técnica</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {budgets.length === 0 ? (
          <Card className="border-dashed border-slate-300 shadow-none">
            <CardContent className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <FileSpreadsheet className="h-6 w-6 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">Nenhum orçamento encontrado</p>
                <p className="mt-1 text-sm text-slate-500">
                  Ajuste os filtros ou crie um novo orçamento solar para começar.
                </p>
              </div>
              <Button
                className="bg-[#001233] text-white hover:bg-[#001233]/90"
                onClick={() => {
                  const created = pedido.createBudget();
                  navigate(`/vendas/orcamentos-solar/${created.id}`);
                }}
              >
                <Plus className="h-4 w-4" /> Criar orçamento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Orçamentos encontrados</CardTitle>
              <CardDescription>
                Listagem operacional no padrão de tabela do CRM.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="min-w-[300px]">Orçamento</TableHead>
                      <TableHead className="min-w-[190px]">Status</TableHead>
                      <TableHead className="min-w-[220px]">Relacionamento</TableHead>
                      <TableHead className="w-[90px]">UF</TableHead>
                      <TableHead className="w-[120px]">Validade</TableHead>
                      <TableHead className="w-[120px]">Itens</TableHead>
                      <TableHead className="w-[160px] text-right">Total</TableHead>
                      <TableHead className="min-w-[160px]">Atualização</TableHead>
                      <TableHead className="min-w-[340px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgets.map((budget) => {
                      const totals = calculateBudgetTotals(
                        budget.orderItems,
                        budget.saleType,
                        budget.lineAdjustments,
                        budget.destinationState,
                        budget.deliveryArea,
                      );
                      const hasPendingTechnical = budget.orderItems.some(
                        (item) => item.type === 'generator' && item.approvalStatus === 'pending',
                      );

                      return (
                        <TableRow key={budget.id} className="align-top">
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-mono text-xs text-slate-400">{budget.budgetNumber}</p>
                              <p className="text-sm font-semibold text-slate-950">{budget.name}</p>
                              <p className="text-xs text-slate-500">Consultor: {budget.consultantName}</p>
                              <p className="text-xs text-slate-500">Criado em {budget.createdAt}</p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-2">
                              <Badge className={`rounded-full hover:opacity-100 ${statusTone(budget.status)}`}>
                                {statusLabel(budget.status)}
                              </Badge>
                              {hasPendingTechnical ? (
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-900">
                                  <ShieldAlert className="h-3 w-3" />
                                  Pendente técnico
                                </div>
                              ) : null}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <p className="font-medium text-slate-900">
                                {budget.partyLink.integrator?.name ?? 'Sem integrador vinculado'}
                              </p>
                              <p className="text-xs text-slate-500">
                                {budget.partyLink.billingClient?.name ?? 'Cliente final definido só na formalização'}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="text-sm font-semibold text-slate-900">{budget.destinationState}</span>
                          </TableCell>

                          <TableCell>
                            <span className="text-sm text-slate-700">{formatDate(budget.validUntil)}</span>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1 text-sm text-slate-700">
                              <p>{totals.itemCount}</p>
                              <p className="text-xs text-slate-500">{budget.orderItems.length} linha(s)</p>
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-slate-950">{formatCurrency(totals.grandTotal)}</p>
                              <p className="text-xs text-slate-500">
                                {budget.deliveryArea === 'rural' ? 'Com taxa rural' : 'Sem taxa rural'}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1 text-sm text-slate-700">
                              <p>{budget.updatedAt}</p>
                              <p className="text-xs text-slate-500">
                                {budget.orderDraft ? `Pedido ${budget.orderDraft.orderNumber}` : 'Ainda não convertido'}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="min-w-[340px]">
                            <div className="flex flex-wrap items-start gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const duplicated = pedido.duplicateBudgetRecord(budget.id);
                                  if (duplicated) navigate(`/vendas/orcamentos-solar/${duplicated.id}`);
                                }}
                              >
                                <Copy className="h-4 w-4" /> Duplicar
                              </Button>
                              {pedido.budgets.length > 1 ? (
                                <Button variant="outline" size="sm" onClick={() => pedido.removeBudget(budget.id)}>
                                  <Trash2 className="h-4 w-4" /> Remover
                                </Button>
                              ) : null}
                              {budget.orderDraft ? (
                                <Button
                                  size="sm"
                                  className="bg-[#001233] text-white hover:bg-[#001233]/90"
                                  onClick={() => navigate(`/vendas/pedidos/${budget.orderDraft?.orderNumber}`)}
                                >
                                  Abrir pedido <ArrowRight className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  className="bg-[#001233] text-white hover:bg-[#001233]/90"
                                  onClick={() => navigate(`/vendas/orcamentos-solar/${budget.id}`)}
                                >
                                  Abrir orçamento <ArrowRight className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
