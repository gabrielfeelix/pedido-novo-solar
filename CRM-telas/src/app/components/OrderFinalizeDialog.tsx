import { useEffect, useMemo, useRef, useState } from 'react';
import { Building2, Check, ChevronRight, HelpCircle, Search, UserRound, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { orderClients, type OrderParty } from '../data/solarOrderMockData';
import { usePedido, type SaleType } from '../context/PedidoContext';

function normalizeText(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const SALE_TYPES: {
  value: SaleType;
  label: string;
  description: string;
  tooltip: string;
}[] = [
  {
    value: 'normal',
    label: 'Venda Normal',
    description: 'Faturado diretamente para o integrador.',
    tooltip:
      'O integrador compra os produtos em nome próprio. Não é necessário informar cliente final.',
  },
  {
    value: 'direct',
    label: 'Venda Direta',
    description: 'Intermediada pelo integrador, faturada para o cliente final.',
    tooltip:
      'O integrador é o intermediador. A nota fiscal é emitida para o cliente final. Exige cadastro do cliente de faturamento.',
  },
  {
    value: 'triangulation',
    label: 'Triangulação',
    description: 'Faturado para o integrador, entregue ao cliente final.',
    tooltip:
      'Fatura para o integrador (regime lucro real) mas a mercadoria é remetida ao cliente final. Exige dados completos do cliente para a nota de remessa.',
  },
];

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
  onSelect: (c: OrderParty) => void;
  onClear: () => void;
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
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              {label}
            </p>
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
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="Código, CNPJ, razão social ou cidade"
          className="h-10 pl-9 border-slate-300 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
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
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onSelect(client);
                    setQuery('');
                    setOpen(false);
                  }}
                  className="flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition hover:bg-blue-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{client.name}</p>
                    <Badge
                      variant="outline"
                      className="border-slate-200 bg-slate-50 text-[10px] text-slate-600"
                    >
                      {client.state}
                    </Badge>
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

export function OrderFinalizeDialog({
  open,
  onOpenChange,
  onPromoted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPromoted?: () => void;
}) {
  const pedido = usePedido();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saleType, setSaleType] = useState<SaleType | null>(null);
  const [integrador, setIntegrador] = useState<OrderParty | null>(null);
  const [clienteNota, setClienteNota] = useState<OrderParty | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStep(1);
      setSaleType(null);
      setIntegrador(null);
      setClienteNota(null);
      setError(null);
    }
  }, [open]);

  const needsClienteNota = saleType === 'direct' || saleType === 'triangulation';
  const canAdvanceStep1 = saleType !== null;
  const canAdvanceStep2 =
    integrador !== null && (!needsClienteNota || clienteNota !== null);

  const selectedSaleOption = SALE_TYPES.find((t) => t.value === saleType);

  function handleConfirm() {
    if (!saleType || !integrador) return;
    pedido.setSaleType(saleType);
    pedido.setClientePedido(integrador);
    pedido.setClienteNota(needsClienteNota && clienteNota ? clienteNota : null);
    const result = pedido.promoteBudgetToOrder();
    if (!result.success) {
      setError(result.error ?? 'Erro ao transformar em pedido.');
      return;
    }
    onPromoted?.();
    onOpenChange(false);
  }

  function goBack() {
    setStep((s) => (s - 1) as 1 | 2 | 3);
    setError(null);
  }

  function goNext() {
    setStep((s) => (s + 1) as 2 | 3);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Finalizar orçamento</DialogTitle>
          <div className="flex items-center gap-1.5 pt-1">
            {([1, 2, 3] as const).map((s) => (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step
                    ? 'w-6 bg-[#001233]'
                    : s < step
                      ? 'w-3 bg-slate-400'
                      : 'w-3 bg-slate-200'
                }`}
              />
            ))}
            <span className="ml-1 text-xs text-slate-400">
              {step === 1 ? 'Tipo de venda' : step === 2 ? 'Clientes' : 'Revisão'}
            </span>
          </div>
        </DialogHeader>

        {/* Step 1 — Sale type */}
        {step === 1 ? (
          <div className="space-y-3 py-2">
            <p className="text-sm text-slate-600">Qual o tipo de venda deste orçamento?</p>
            {SALE_TYPES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSaleType(opt.value)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  saleType === opt.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    saleType === opt.value ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                  }`}
                >
                  {saleType === opt.value && <Check className="h-3 w-3 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 cursor-help text-slate-400 hover:text-slate-600" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[240px] text-xs">{opt.tooltip}</TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-slate-500">{opt.description}</p>
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {/* Step 2 — Clients */}
        {step === 2 ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-slate-600">
              {needsClienteNota
                ? 'Informe o integrador e o cliente de faturamento.'
                : 'Informe o integrador responsável pelo pedido.'}
            </p>
            <ClientSearchField
              label="Integrador"
              icon={<Building2 className="h-3.5 w-3.5" />}
              helper="Integrador responsável pelo pedido."
              selected={integrador}
              onSelect={setIntegrador}
              onClear={() => setIntegrador(null)}
            />
            {needsClienteNota ? (
              <ClientSearchField
                label={saleType === 'triangulation' ? 'Cliente final (remessa)' : 'Cliente de faturamento'}
                icon={<UserRound className="h-3.5 w-3.5" />}
                helper={
                  saleType === 'triangulation'
                    ? 'Cliente que receberá a mercadoria. Dados usados na nota de remessa.'
                    : 'Cliente que receberá a nota fiscal de faturamento.'
                }
                selected={clienteNota}
                onSelect={setClienteNota}
                onClear={() => setClienteNota(null)}
              />
            ) : null}
          </div>
        ) : null}

        {/* Step 3 — Review */}
        {step === 3 ? (
          <div className="space-y-3 py-2">
            <p className="text-sm text-slate-600">
              Confirme os dados antes de transformar em pedido.
            </p>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
                  Tipo de venda
                </p>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {selectedSaleOption?.label}
                </Badge>
              </div>
              {integrador ? (
                <div className="flex items-center justify-between px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
                    Integrador
                  </p>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{integrador.name}</p>
                    <p className="text-[11px] text-slate-500">{integrador.document}</p>
                  </div>
                </div>
              ) : null}
              {clienteNota ? (
                <div className="flex items-center justify-between px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
                    {saleType === 'triangulation' ? 'Cliente final' : 'Cliente faturamento'}
                  </p>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{clienteNota.name}</p>
                    <p className="text-[11px] text-slate-500">{clienteNota.document}</p>
                  </div>
                </div>
              ) : null}
            </div>
            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </div>
        ) : null}

        <DialogFooter>
          {step > 1 ? (
            <Button variant="outline" onClick={goBack}>
              Voltar
            </Button>
          ) : null}
          {step < 3 ? (
            <Button
              className="bg-[#001233] text-white hover:bg-[#001233]/90"
              disabled={step === 1 ? !canAdvanceStep1 : !canAdvanceStep2}
              onClick={goNext}
            >
              Avançar <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              className="bg-[#001233] text-white hover:bg-[#001233]/90"
              onClick={handleConfirm}
            >
              <Check className="h-4 w-4" /> Transformar em Pedido
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
