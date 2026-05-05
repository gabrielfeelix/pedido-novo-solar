export const DEFAULT_DISCOUNT_PCT = 4.15;

export type PricingMode = 'percent' | 'currency';
export type PricingSaleType = 'normal' | 'direct' | 'triangulation' | null;

type PricingOrderItem =
  | {
      type: 'generator';
      subtotal: number;
      components: Array<{ quantity: number }>;
    }
  | {
      type: 'loose';
      unitPrice: number;
      quantity: number;
    };

export type LinePricingAdjustment = {
  discountMode: PricingMode;
  discountValue: number;
  prizeMode: PricingMode;
  prizeValue: number;
};

export type ItemPricing = {
  quantity: number;
  unitBruto: number;
  vlBruto: number;
  discountMode: PricingMode;
  discountValue: number;
  discountPct: number;
  desconto: number;
  prizeMode: PricingMode;
  prizeValue: number;
  prizeAmount: number;
  prizePct: number;
  valorLiquido: number;
  total: number;
  invalidPrize: boolean;
  regionalFactor: number;
};

export type BudgetTotals = {
  grossTotal: number;
  discountTotal: number;
  prizeTotal: number;
  netTotal: number;
  itemCount: number;
  freightSurcharge: number;
  grandTotal: number;
};

function clampCurrency(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function clampPercent(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
}

function baseGrossForItem(item: PricingOrderItem) {
  if (item.type === 'generator') return item.subtotal;
  return item.unitPrice * item.quantity;
}

export function getRegionalFactor(destinationState: string) {
  const normalized = destinationState.toUpperCase();
  if (normalized === 'SC') return 0.015;
  if (normalized === 'RS') return 0.025;
  if (normalized === 'SP') return 0.03;
  if (normalized === 'ES') return 0.035;
  return 0;
}

export function buildDefaultLineAdjustment(item: PricingOrderItem): LinePricingAdjustment {
  return {
    discountMode: 'percent',
    discountValue: item.type === 'generator' ? DEFAULT_DISCOUNT_PCT : 0,
    prizeMode: 'currency',
    prizeValue: 0,
  };
}

export function pricingForOrderItem(
  item: PricingOrderItem,
  saleType: PricingSaleType,
  adjustment?: Partial<LinePricingAdjustment>,
  destinationState = 'PR',
): ItemPricing {
  const defaults = buildDefaultLineAdjustment(item);
  const nextAdjustment: LinePricingAdjustment = {
    ...defaults,
    ...adjustment,
  };

  const quantity = item.type === 'generator' ? 1 : item.quantity;
  const regionalFactor = getRegionalFactor(destinationState);
  const vlBruto = baseGrossForItem(item) * (1 + regionalFactor);
  const unitBruto = quantity > 0 ? vlBruto / quantity : 0;

  const discountValue =
    nextAdjustment.discountMode === 'percent'
      ? clampPercent(nextAdjustment.discountValue)
      : clampCurrency(nextAdjustment.discountValue);
  const desconto =
    nextAdjustment.discountMode === 'percent'
      ? vlBruto * (discountValue / 100)
      : Math.min(vlBruto, discountValue);
  const discountPct = vlBruto > 0 ? (desconto / vlBruto) * 100 : 0;

  const effectivePrizeValue = saleType === 'direct' ? nextAdjustment.prizeValue : 0;
  const prizeValue =
    nextAdjustment.prizeMode === 'percent'
      ? clampPercent(effectivePrizeValue)
      : clampCurrency(effectivePrizeValue);
  const prizeAmount =
    saleType === 'direct'
      ? nextAdjustment.prizeMode === 'percent'
        ? vlBruto * (prizeValue / 100)
        : prizeValue
      : 0;
  const prizePct = vlBruto > 0 ? (prizeAmount / vlBruto) * 100 : 0;

  const invalidPrize = discountPct + prizePct > 100.001;
  const valorLiquido = Math.max(0, vlBruto - desconto + prizeAmount);
  const total = valorLiquido;

  return {
    quantity,
    unitBruto,
    vlBruto,
    discountMode: nextAdjustment.discountMode,
    discountValue,
    discountPct,
    desconto,
    prizeMode: nextAdjustment.prizeMode,
    prizeValue,
    prizeAmount,
    prizePct,
    valorLiquido,
    total,
    invalidPrize,
    regionalFactor,
  };
}

export function calculateBudgetTotals(
  items: PricingOrderItem[],
  saleType: PricingSaleType,
  lineAdjustments: Record<string, Partial<LinePricingAdjustment>>,
  destinationState = 'PR',
  deliveryArea: 'urban' | 'rural' = 'urban',
): BudgetTotals {
  const aggregate = items.reduce(
    (totals, item) => {
      const pricing = pricingForOrderItem(item, saleType, lineAdjustments[item.id], destinationState);
      const itemCount = item.type === 'generator'
        ? totals.itemCount + item.components.reduce((sum, component) => sum + component.quantity, 0)
        : totals.itemCount + item.quantity;

      return {
        grossTotal: totals.grossTotal + pricing.vlBruto,
        discountTotal: totals.discountTotal + pricing.desconto,
        prizeTotal: totals.prizeTotal + pricing.prizeAmount,
        netTotal: totals.netTotal + pricing.total,
        itemCount,
      };
    },
    {
      grossTotal: 0,
      discountTotal: 0,
      prizeTotal: 0,
      netTotal: 0,
      itemCount: 0,
    },
  );

  const freightSurcharge = deliveryArea === 'rural' ? 440 : 0;

  return {
    ...aggregate,
    freightSurcharge,
    grandTotal: aggregate.netTotal + freightSurcharge,
  };
}
