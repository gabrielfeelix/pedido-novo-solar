import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { OrderStatusTimeline } from './OrderStatusTimeline';
import { usePedido } from '../context/PedidoContext';
import { calculateBudgetTotals, pricingForOrderItem } from '../lib/solarOrderPricing';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function OrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const pedido = usePedido();

  const budget = useMemo(() => (id ? pedido.getBudgetByOrderNumber(id) : null), [id, pedido]);

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
      budget.orderDraft?.saleType ?? budget.saleType,
      budget.lineAdjustments,
      budget.destinationState,
      budget.orderDraft?.deliveryArea ?? budget.deliveryArea,
    );
  }, [budget]);

  if (!budget || !budget.orderDraft) return null;

  const order = budget.orderDraft;

  return (
    <div className="min-h-full bg-transparent py-8">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Pedido aberto</Badge>
              <span className="font-mono text-xs text-slate-500">{order.orderNumber}</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {order.orderNumber}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Acompanhamento do pedido formalizado a partir do orçamento {budget.budgetNumber}.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate(`/vendas/orcamentos-solar/${budget.id}`)}>
              Voltar ao orçamento
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Total</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{formatCurrency(totals.grandTotal)}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Tipo de venda</p>
              <p className="mt-2 text-xl font-bold text-slate-950">{order.saleType}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Área de entrega</p>
              <p className="mt-2 text-xl font-bold text-slate-950">{order.deliveryArea === 'rural' ? 'Rural' : 'Urbana'}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Criado em</p>
              <p className="mt-2 text-xl font-bold text-slate-950">{order.createdAt}</p>
            </CardContent>
          </Card>
        </div>

        <OrderStatusTimeline />

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="grid gap-4 py-5 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Integrador</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{order.clientePedido?.name ?? 'Não informado'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Cliente final</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{order.clienteNota?.name ?? 'Não aplicável'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Pagamento</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{order.financialCondition}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Frete</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{order.freightType}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="items" className="space-y-4">
          <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
            <TabsTrigger value="items">Itens</TabsTrigger>
            <TabsTrigger value="finance">Financeiro</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Composição do pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {budget.orderItems.map((item) => {
                  const pricing = pricingForOrderItem(
                    item,
                    order.saleType,
                    budget.lineAdjustments[item.id],
                    budget.destinationState,
                  );
                  return (
                    <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">
                            {item.type === 'generator' ? item.title : item.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">SKU {item.sku}</p>
                        </div>
                        <span className="text-sm font-bold text-slate-950">{formatCurrency(pricing.total)}</span>
                      </div>

                      {item.type === 'generator' ? (
                        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                          {item.components.map((component) => (
                            <div key={component.id} className="flex items-center justify-between gap-3 text-sm">
                              <div>
                                <p className="font-medium text-slate-900">{component.name}</p>
                                <p className="text-xs text-slate-500">{component.brand} · {component.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-slate-900">{component.quantity} un</p>
                                <p className="text-xs text-slate-500">{formatCurrency(component.quantity * component.unitPrice)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Espelho financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Valor bruto</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(totals.grossTotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Desconto</span>
                  <span className="font-semibold text-rose-600">-{formatCurrency(totals.discountTotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Prêmio</span>
                  <span className="font-semibold text-emerald-600">+{formatCurrency(totals.prizeTotal)}</span>
                </div>
                <div className="flex items-center justify-between">
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
          </TabsContent>

          <TabsContent value="documents">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Documentos e observações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Observação interna</p>
                  <p className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                    {order.orderObservation || 'Sem observações internas.'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Observação fiscal</p>
                  <p className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                    {order.invoiceObservation || 'Sem observação fiscal.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Histórico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {budget.history.map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-slate-200 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900">{entry.title}</p>
                      <span className="text-xs text-slate-400">{entry.timestamp}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{entry.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
