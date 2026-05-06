import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronRight,
  FileCheck2,
  Search,
  ShieldAlert,
  UserRound,
  X,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { HelpTooltip } from './shared/HelpTooltip';
import { usePedido, type OrderParty, type SaleType } from '../context/PedidoContext';
import { financingConditions, freightTypes, orderClients } from '../data/solarOrderMockData';
import { calculateBudgetTotals } from '../lib/solarOrderPricing';

const SALE_TYPES: {
  value: SaleType;
  label: string;
  description: string;
  tooltip: string;
}[] = [
  {
    value: 'normal',
    label: 'Venda Normal',
    description: 'Faturamento diretamente para o integrador.',
    tooltip: 'Não exige cliente final. O pedido é fechado no CNPJ do integrador.',
  },
  {
    value: 'direct',
    label: 'Venda Direta',
    description: 'Integrador intermedia e a nota sai para o cliente final.',
    tooltip: 'Exige cliente final e permite prêmio de venda direta.',
  },
  {
    value: 'triangulation',
    label: 'Triangulação',
    description: 'Fatura para o integrador e remete ao cliente final.',
    tooltip: 'Exige dados do cliente final para observação da remessa.',
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function normalizeText(value: string) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function ClientSearchField({
  label,
  icon,
  helper,
  selected,
  onSelect,
  onClear,
}: {
  label: string;
  icon: React.ReactNode;
  helper: string;
  selected: OrderParty | null;
  onSelect: (client: OrderParty) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const normalized = normalizeText(query);
    if (!normalized) return orderClients;
    return orderClients.filter((client) =>
      normalizeText(`${client.name} ${client.document} ${client.contactName} ${client.city}`).includes(normalized),
    );
  }, [query]);

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  if (selected) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900">{selected.name}</p>
            <p className="text-[11px] text-slate-500">
              CNPJ {selected.document} · {selected.city}/{selected.state}
            </p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {icon} {label}
      </div>
      <p className="mb-2 text-xs text-slate-500">{helper}</p>
      <div ref={containerRef} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          placeholder="Código, CNPJ, razão social ou cidade"
          className="h-10 pl-9"
        />
        {open ? (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[240px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
            {filtered.length === 0 ? (
              <div className="px-3 py-5 text-center text-xs text-slate-500">
                Nenhum cliente encontrado.
              </div>
            ) : (
              filtered.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onSelect(client);
                    setQuery('');
                    setOpen(false);
                  }}
                  className="flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition hover:bg-blue-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{client.name}</p>
                    <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100">{client.state}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    CNPJ {client.document} · {client.contactName}
                  </p>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function BudgetConversionPage() {
  const navigate = useNavigate();
  const { budgetId } = useParams();
  const pedido = usePedido();

  const budget = budgetId ? pedido.getBudgetById(budgetId) : null;
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saleType, setSaleType] = useState<SaleType | null>(budget?.saleType ?? null);
  const [integrator, setIntegrator] = useState<OrderParty | null>(budget?.partyLink.integrator ?? null);
  const [billingClient, setBillingClient] = useState<OrderParty | null>(budget?.partyLink.billingClient ?? null);
  const [financialCondition, setFinancialCondition] = useState(budget?.financialCondition ?? financingConditions[0]);
  const [deliveryArea, setDeliveryArea] = useState<'urban' | 'rural'>(budget?.deliveryArea ?? 'urban');
  const [freightType, setFreightType] = useState(budget?.freightType ?? freightTypes[0]);
  const [orderObservation, setOrderObservation] = useState(budget?.orderObservation ?? '');
  const [invoiceObservation, setInvoiceObservation] = useState(budget?.invoiceObservation ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!budgetId) return;
    pedido.selectBudget(budgetId);
  }, [budgetId, pedido]);

  useEffect(() => {
    if (!budget) navigate('/vendas/orcamentos-solar');
  }, [budget, navigate]);

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
      saleType ?? budget.saleType,
      budget.lineAdjustments,
      budget.destinationState,
      deliveryArea,
    );
  }, [budget, deliveryArea, saleType]);

  if (!budget) return null;

  const hasPendingTechnical = budget.orderItems.some(
    (item) => item.type === 'generator' && item.approvalStatus === 'pending',
  );
  const isExpired = budget.status === 'expired';
  const needsBillingClient = saleType === 'direct' || saleType === 'triangulation';
  const canAdvanceStep1 = Boolean(saleType);
  const canAdvanceStep2 = Boolean(integrator) && (!needsBillingClient || Boolean(billingClient));
  const canConvert = Boolean(saleType && integrator && (!needsBillingClient || billingClient));

  function handleNext() {
    setError(null);
    setStep((current) => (current + 1) as 2 | 3);
  }

  function handleBack() {
    setError(null);
    setStep((current) => (current - 1) as 1 | 2);
  }

  function handleConvert() {
    setError(null);
    const result = pedido.promoteBudgetToOrder({
      saleType,
      integrator,
      billingClient: needsBillingClient ? billingClient : null,
      deliveryArea,
      freightType,
      financialCondition,
      orderObservation,
      invoiceObservation,
    });

    if (!result.success) {
      setError(result.error ?? 'Erro ao transformar em pedido.');
      return;
    }

    navigate(`/vendas/pedidos/${result.orderNumber}`);
  }

  return (
    <div className="min-h-full bg-transparent py-8">
      <div className="mx-auto grid w-full max-w-[1480px] gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(`/vendas/orcamentos-solar/${budget.id}`)}>
              <ArrowLeft className="h-4 w-4" /> Voltar ao orçamento
            </Button>
            <span className="font-mono text-xs text-slate-400">{budget.budgetNumber}</span>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Fechamento do pedido
                </Badge>
                {hasPendingTechnical ? (
                  <Badge className="rounded-full bg-amber-100 text-amber-900 hover:bg-amber-100">
                    Pendente técnico
                  </Badge>
                ) : null}
                {isExpired ? (
                  <Badge className="rounded-full bg-rose-100 text-rose-800 hover:bg-rose-100">
                    Orçamento expirado
                  </Badge>
                ) : null}
              </div>
              <CardTitle className="mt-3 text-3xl tracking-tight">
                Formalizar orçamento em pedido
              </CardTitle>
              <CardDescription>
                Agora o fluxo deixa de ser apenas uma proposta comercial e ganha tipo de venda, partes e operação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((current) => (
                  <span
                    key={current}
                    className={`h-1.5 rounded-full transition-all ${
                      current === step ? 'w-7 bg-[#001233]' : current < step ? 'w-4 bg-slate-400' : 'w-4 bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {hasPendingTechnical || isExpired ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-semibold">Antes de seguir</p>
                      <p className="mt-1">
                        {hasPendingTechnical
                          ? 'Este orçamento ainda tem geradores fora do padrão técnico. Aprove ou ajuste a composição antes de converter.'
                          : 'A validade do orçamento expirou. Renove a validade no detalhe do orçamento antes de formalizar.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 1 ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">Qual o tipo de venda deste fechamento?</p>
                  {SALE_TYPES.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSaleType(option.value)}
                      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                        saleType === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          saleType === option.value ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                        }`}
                      >
                        {saleType === option.value ? <Check className="h-3 w-3 text-white" /> : null}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                          <HelpTooltip content={option.tooltip} />
                        </div>
                        <p className="text-xs text-slate-500">{option.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-4">
                  <ClientSearchField
                    label="Integrador"
                    icon={<Building2 className="h-3.5 w-3.5" />}
                    helper="Integrador responsável pelo pedido."
                    selected={integrator}
                    onSelect={setIntegrator}
                    onClear={() => setIntegrator(null)}
                  />
                  {needsBillingClient ? (
                    <ClientSearchField
                      label={saleType === 'triangulation' ? 'Cliente final (remessa)' : 'Cliente final'}
                      icon={<UserRound className="h-3.5 w-3.5" />}
                      helper={
                        saleType === 'triangulation'
                          ? 'Usado na observação da nota de remessa.'
                          : 'Cliente que receberá o faturamento.'
                      }
                      selected={billingClient}
                      onSelect={setBillingClient}
                      onClear={() => setBillingClient(null)}
                    />
                  ) : null}
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Condição de pagamento
                      </p>
                      <Select value={financialCondition} onValueChange={setFinancialCondition}>
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

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Modalidade de frete
                      </p>
                      <Select value={freightType} onValueChange={setFreightType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {freightTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Área de entrega
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant={deliveryArea === 'urban' ? 'default' : 'outline'} onClick={() => setDeliveryArea('urban')}>
                        Urbano
                      </Button>
                      <Button variant={deliveryArea === 'rural' ? 'default' : 'outline'} onClick={() => setDeliveryArea('rural')}>
                        Rural
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Observação interna
                      </p>
                      <Textarea
                        value={orderObservation}
                        onChange={(event) => setOrderObservation(event.target.value)}
                        placeholder="Observações operacionais para o pedido."
                        rows={5}
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Observação fiscal / nota
                      </p>
                      <Textarea
                        value={invoiceObservation}
                        onChange={(event) => setInvoiceObservation(event.target.value)}
                        placeholder="Observação para nota fiscal ou remessa."
                        rows={5}
                      />
                    </div>
                  </div>

                  {error ? (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {error}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5">
                {step > 1 ? (
                  <Button variant="outline" onClick={handleBack}>
                    Voltar
                  </Button>
                ) : <span />}

                {step < 3 ? (
                  <Button
                    className="bg-[#001233] text-white hover:bg-[#001233]/90"
                    disabled={
                      hasPendingTechnical
                      || isExpired
                      || (step === 1 ? !canAdvanceStep1 : !canAdvanceStep2)
                    }
                    onClick={handleNext}
                  >
                    Avançar <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    className="bg-[#001233] text-white hover:bg-[#001233]/90"
                    disabled={hasPendingTechnical || isExpired || !canConvert}
                    onClick={handleConvert}
                  >
                    <FileCheck2 className="h-4 w-4" /> Abrir pedido
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Resumo financeiro</CardTitle>
              <CardDescription>
                O preço final já considera a UF de destino e a área de entrega selecionada.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Valor bruto</span>
                <span className="font-semibold text-slate-900">{formatCurrency(totals.grossTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Descontos</span>
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
                  <span className="text-sm font-medium text-slate-600">Total do pedido</span>
                  <span className="text-2xl font-bold text-slate-950">{formatCurrency(totals.grandTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Resumo do orçamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Código</span>
                <span className="font-mono text-slate-900">{budget.budgetNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Validade</span>
                <span className="font-medium text-slate-900">{budget.validUntil.split('-').reverse().join('/')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>UF destino</span>
                <span className="font-medium text-slate-900">{budget.destinationState}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Itens</span>
                <span className="font-medium text-slate-900">{budget.orderItems.length}</span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
