import { Fragment } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Info,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { looseItems } from '../../data/solarOrderMockData';
import { imageForSku } from '../../data/productImages';
import { type OrderItem, type SaleType, type SolarGenerator } from '../../context/PedidoContext';
import {
  calculateCampaignForOrderItem,
  calculateCommissionForOrderItem,
} from '../../lib/solarCommercialRules';
import {
  pricingForOrderItem,
  type LinePricingAdjustment,
  type PricingMode,
} from '../../lib/solarOrderPricing';
import { HelpTooltip } from '../shared/HelpTooltip';

type GeneratorComponentCategory = SolarGenerator['components'][number]['category'];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatNumber(value: number, fraction = 2) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  }).format(value);
}

function parseNumericInput(value: string) {
  const normalized = value.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function statusStyles(status: SolarGenerator['approvalStatus']) {
  if (status === 'approved') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'pending') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (status === 'rejected') return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-slate-50 text-slate-600 border-slate-200';
}

function statusLabel(status: SolarGenerator['approvalStatus']) {
  if (status === 'approved') return 'Aprovado';
  if (status === 'pending') return 'Aguardando aprovação técnica';
  if (status === 'rejected') return 'Reprovado';
  return 'Sem aprovação necessária';
}

function getCategoryIcon(category: GeneratorComponentCategory) {
  return category;
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: PricingMode;
  onChange: (mode: PricingMode) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5">
      <button
        type="button"
        onClick={() => onChange('percent')}
        className={`rounded px-2 py-1 text-[10px] font-semibold ${
          mode === 'percent' ? 'bg-slate-900 text-white' : 'text-slate-500'
        }`}
      >
        %
      </button>
      <button
        type="button"
        onClick={() => onChange('currency')}
        className={`rounded px-2 py-1 text-[10px] font-semibold ${
          mode === 'currency' ? 'bg-slate-900 text-white' : 'text-slate-500'
        }`}
      >
        R$
      </button>
    </div>
  );
}

export function ItemsTable({
  items,
  saleType,
  expandedItems,
  pricingAdjustments,
  toggleExpanded,
  onPricingAdjustmentChange,
  onDuplicateGenerator,
  onRemoveItem,
  onUpdateLooseItemQuantity,
  onUpdateGeneratorComponent,
}: {
  items: OrderItem[];
  saleType: SaleType | null;
  expandedItems: Record<string, boolean>;
  pricingAdjustments: Record<string, Partial<LinePricingAdjustment>>;
  toggleExpanded: (id: string) => void;
  onPricingAdjustmentChange: (itemId: string, patch: Partial<LinePricingAdjustment>) => void;
  onDuplicateGenerator: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onUpdateLooseItemQuantity: (itemId: string, quantity: number) => void;
  onUpdateGeneratorComponent: (generatorId: string, componentId: string, delta: number) => void;
}) {
  const showPrizeColumn = saleType === 'direct';
  const columnCount = showPrizeColumn ? 11 : 10;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="sticky top-0 z-10 w-[44px] bg-slate-50" />
            <TableHead className="sticky top-0 z-10 w-[80px] bg-slate-50">Produto</TableHead>
            <TableHead className="sticky top-0 z-10 min-w-[280px] bg-slate-50">Descrição</TableHead>
            <TableHead className="sticky top-0 z-10 w-[120px] bg-slate-50">Qtd.</TableHead>
            <TableHead className="sticky top-0 z-10 w-[140px] bg-slate-50">Valor Bruto</TableHead>
            <TableHead className="sticky top-0 z-10 w-[170px] bg-slate-50">Desconto</TableHead>
            {showPrizeColumn ? (
              <TableHead className="sticky top-0 z-10 w-[180px] bg-slate-50">
                <div className="flex items-center gap-1.5">
                  Prêmio de Venda
                  <HelpTooltip content="No protótipo, o prêmio pode ser ajustado em percentual ou em valor para venda direta." />
                </div>
              </TableHead>
            ) : null}
            <TableHead className="sticky top-0 z-10 w-[120px] bg-slate-50">Comissão</TableHead>
            <TableHead className="sticky top-0 z-10 w-[180px] bg-slate-50">Tributo</TableHead>
            <TableHead className="sticky top-0 z-10 w-[160px] bg-slate-50 text-right">Valor Líquido</TableHead>
            <TableHead className="sticky top-0 z-10 w-[60px] bg-slate-50" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columnCount} className="py-12 text-center text-sm text-slate-500">
                Nenhum item encontrado com esse filtro.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const pricing = pricingForOrderItem(item, saleType, pricingAdjustments[item.id]);
              const isExpanded = Boolean(expandedItems[item.id]);
              const isKit = item.type === 'generator';
              const displayName = isKit ? item.title : item.name;
              const displayBrand = isKit ? 'ODEX SOLAR' : item.brand;
              const componentCount = isKit ? item.components.length : 0;
              const commissionValue = calculateCommissionForOrderItem(item);
              const commissionRate = pricing.vlBruto > 0 ? (commissionValue / pricing.vlBruto) * 100 : 0;
              const campaignValue = calculateCampaignForOrderItem(item);

              const rowThumb = isKit
                ? imageForSku(item.sku, 'Painéis')
                : imageForSku(item.sku, undefined, looseItems.find((loose) => loose.sku === item.sku)?.icon);

              return (
                <Fragment key={item.id}>
                  <TableRow className="align-top">
                    <TableCell className="py-4">
                      {isKit ? (
                        <button
                          type="button"
                          onClick={() => toggleExpanded(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
                          aria-label={isExpanded ? 'Recolher componentes' : 'Ver componentes'}
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                      ) : null}
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="h-14 w-14 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                        <img
                          src={rowThumb}
                          alt={displayName}
                          className="h-full w-full object-cover mix-blend-multiply"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <p className="text-sm font-bold text-slate-900">{item.sku}</p>
                      <p className="line-clamp-1 text-sm font-semibold text-slate-800">{displayName}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {displayBrand}
                        </span>
                        {isKit ? (
                          <Badge className="bg-blue-100 text-[10px] font-semibold text-blue-700 hover:bg-blue-100">
                            KIT · {componentCount} itens
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-500">Avulso</span>
                        )}
                        {campaignValue > 0 ? (
                          <Badge className="bg-amber-100 text-[10px] font-semibold text-amber-800 hover:bg-amber-100">
                            Campanha
                          </Badge>
                        ) : null}
                        {isKit && item.isCustomized ? (
                          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-[10px] text-amber-800">
                            Personalizado
                          </Badge>
                        ) : null}
                      </div>
                      {isKit ? (
                        <Badge variant="outline" className={`mt-2 ${statusStyles(item.approvalStatus)}`}>
                          {statusLabel(item.approvalStatus)}
                        </Badge>
                      ) : null}
                    </TableCell>

                    <TableCell className="py-4">
                      {isKit ? (
                        <Input
                          readOnly
                          value={pricing.quantity}
                          className="h-9 w-16 border-slate-300 bg-white text-center font-semibold"
                        />
                      ) : (
                        <div className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white p-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onUpdateLooseItemQuantity(item.id, item.quantity - 1)}
                            aria-label="Diminuir quantidade do item"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <Input
                            value={item.quantity}
                            onChange={(event) => {
                              const parsed = Number.parseInt(event.target.value, 10);
                              if (Number.isNaN(parsed)) return;
                              onUpdateLooseItemQuantity(item.id, parsed);
                            }}
                            className="h-7 w-12 border-0 bg-transparent p-0 text-center font-semibold focus-visible:ring-0"
                            inputMode="numeric"
                            aria-label="Quantidade do item avulso"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-blue-600"
                            onClick={() => onUpdateLooseItemQuantity(item.id, item.quantity + 1)}
                            aria-label="Aumentar quantidade do item"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                      <div className="mt-1 max-w-[72px] space-y-0.5 text-[10px] leading-3 sm:text-[11px] sm:leading-4">
                        <p className="font-medium text-emerald-600">Estoque 55</p>
                        <p className="font-medium text-rose-500">Produção 0</p>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(pricing.unitBruto)}</p>
                      <p className="text-[11px] text-slate-500">Total: {formatCurrency(pricing.vlBruto)}</p>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="space-y-2">
                        <ModeToggle
                          mode={pricing.discountMode}
                          onChange={(mode) => onPricingAdjustmentChange(item.id, { discountMode: mode })}
                        />
                        <Input
                          value={formatNumber(pricing.discountValue)}
                          onChange={(event) => onPricingAdjustmentChange(item.id, {
                            discountValue: parseNumericInput(event.target.value),
                          })}
                          className="h-9 w-24 border-slate-300 bg-white text-right"
                        />
                        <p className="text-[11px] text-slate-500">
                          Total: {formatCurrency(pricing.desconto)}
                        </p>
                      </div>
                    </TableCell>

                    {showPrizeColumn ? (
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <ModeToggle
                            mode={pricing.prizeMode}
                            onChange={(mode) => onPricingAdjustmentChange(item.id, { prizeMode: mode })}
                          />
                          <Input
                            value={formatNumber(pricing.prizeValue)}
                            onChange={(event) => onPricingAdjustmentChange(item.id, {
                              prizeValue: parseNumericInput(event.target.value),
                            })}
                            className={`h-9 w-24 border-slate-300 bg-white text-right ${
                              pricing.invalidPrize ? 'border-amber-400 text-amber-700' : ''
                            }`}
                          />
                          <p className="text-[11px] text-slate-500">
                            Total: {formatCurrency(pricing.prizeAmount)}
                          </p>
                          {pricing.invalidPrize ? (
                            <p className="text-[11px] text-amber-700">
                              Desconto + prêmio excedem 100% do bruto.
                            </p>
                          ) : null}
                        </div>
                      </TableCell>
                    ) : null}

                    <TableCell className="py-4">
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(commissionValue)}</p>
                      <p className="text-[11px] text-slate-500">({formatNumber(commissionRate)}%)</p>
                      {campaignValue > 0 ? (
                        <p className="text-[11px] text-amber-700">Campanha: {formatCurrency(campaignValue)}</p>
                      ) : null}
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="space-y-1 text-[11px]">
                        <div>
                          <span className="font-semibold text-slate-700">IPI</span>{' '}
                          <span className="text-slate-500">(0,00%)</span>
                          <p className="text-slate-500">R$ 0,00 / R$ 0,00</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700">ST</span>
                          <p className="text-slate-500">R$ 0,00 / R$ 0,00</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 text-right">
                      <p className="text-sm font-bold text-slate-950">{formatCurrency(pricing.valorLiquido)}</p>
                      <p className="text-[11px] text-slate-500">UN {formatCurrency(pricing.valorLiquido / Math.max(pricing.quantity, 1))}</p>
                      <div className="mt-1 flex items-center justify-end">
                        <Info className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex flex-col items-end gap-1">
                        {isKit ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onDuplicateGenerator(item.id)}
                            aria-label="Duplicar kit"
                            title="Duplicar kit"
                          >
                            <Copy className="h-3.5 w-3.5 text-slate-500" />
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label="Remover item"
                          title="Remover do pedido"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {isKit && isExpanded ? (
                    <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                      <TableCell colSpan={columnCount} className="py-4">
                        <div className="ml-14 space-y-3 border-l-2 border-blue-200 pl-5">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                              Componentes do kit {item.sku}
                            </p>
                            <span className="text-[11px] text-slate-500">
                              {componentCount} SKUs distintos · {item.components.reduce((sum, component) => sum + component.quantity, 0)} unidades
                            </span>
                          </div>
                          <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
                            {item.components.map((component) => (
                              <div
                                key={component.id}
                                className="flex flex-col gap-2 p-3 md:flex-row md:items-center md:justify-between"
                              >
                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                  <img
                                    src={imageForSku(component.sku, component.category)}
                                    alt={component.name}
                                    className="h-12 w-12 shrink-0 rounded-md border border-slate-200 object-cover mix-blend-multiply"
                                  />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                      <span>{getCategoryIcon(component.category)}</span>
                                      <span>SKU {component.sku}</span>
                                    </div>
                                    <p className="truncate text-sm font-medium text-slate-800">{component.name}</p>
                                    <p className="text-[11px] text-slate-500">
                                      {component.brand} · {component.category}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white p-0.5">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => onUpdateGeneratorComponent(item.id, component.id, -1)}
                                    >
                                      <Minus className="h-3.5 w-3.5" />
                                    </Button>
                                    <span className="min-w-8 text-center text-sm font-semibold text-slate-900">{component.quantity}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => onUpdateGeneratorComponent(item.id, component.id, 1)}
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                  <div className="min-w-[120px] text-right">
                                    <p className="text-sm font-semibold text-slate-900">
                                      {formatCurrency(component.quantity * component.unitPrice)}
                                    </p>
                                    <p className="text-[11px] text-slate-500">{formatCurrency(component.unitPrice)}/un</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
