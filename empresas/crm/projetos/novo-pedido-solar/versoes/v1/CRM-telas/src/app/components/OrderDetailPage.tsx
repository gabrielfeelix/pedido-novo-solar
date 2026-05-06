import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { OrderStatusTimeline } from './OrderStatusTimeline';
import { usePedido } from '../context/PedidoContext';
import { orderMeta } from '../data/solarOrderMockData';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function OrderDetailPage() {
  const { id } = useParams();
  const pedido = usePedido();

  const totals = useMemo(
    () => pedido.orderItems.reduce((acc, item) => acc + item.total, 0),
    [pedido.orderItems],
  );

  return (
    <div className="min-h-full bg-transparent py-8">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Detalhe do pedido</Badge>
              <span className="font-mono text-xs text-slate-500">{id ?? pedido.orderNumber ?? 'PED-MOCK'}</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {pedido.orderNumber ?? id ?? 'Pedido em protótipo'}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Visualização read-only para o fluxo pós-fechamento do protótipo.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Valor total</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">{formatCurrency(totals)}</p>
          </div>
        </div>

        <OrderStatusTimeline />

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="grid gap-4 py-5 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Integrador</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{pedido.clientePedido?.name ?? 'Não informado'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Cliente faturamento</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{pedido.clienteNota?.name ?? 'Não informado'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Tipo de venda</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{pedido.saleType ?? 'Não definido'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Criado em</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {orderMeta.find((item) => item.label === 'Cadastro no CRM')?.value ?? '—'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="items" className="space-y-4">
          <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
            <TabsTrigger value="items">Itens</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Componentes do pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pedido.orderItems.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    Nenhum item no pedido atual do contexto.
                  </div>
                ) : (
                  pedido.orderItems.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">
                            {item.type === 'generator' ? item.title : item.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">SKU {item.sku}</p>
                        </div>
                        <span className="text-sm font-bold text-slate-950">{formatCurrency(item.total)}</span>
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
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Histórico</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Timeline mock do pedido. A mesma base pode receber os eventos do protótipo depois.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Placeholder para PDFs, espelho do pedido e notas fiscais.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
