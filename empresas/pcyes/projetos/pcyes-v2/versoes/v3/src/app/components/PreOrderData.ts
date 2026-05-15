export interface PreOrderInfo {
  productId: number;
  releaseDate: string; // ISO date
  preOrderPrice?: string;
  reservedUnits: number;
  totalUnits: number;
  highlight: string;
}

export const PRE_ORDER_ITEMS: PreOrderInfo[] = [
  {
    productId: 500,
    releaseDate: "2026-07-15T20:00:00",
    preOrderPrice: "R$ 8.999,00",
    reservedUnits: 1247,
    totalUnits: 3000,
    highlight: "Ray Tracing + DLSS 3 · entrega no lançamento",
  },
  {
    productId: 433,
    releaseDate: "2026-06-10T19:00:00",
    preOrderPrice: "R$ 2.499,00",
    reservedUnits: 642,
    totalUnits: 1500,
    highlight: "Edição limitada PCYES",
  },
  {
    productId: 446,
    releaseDate: "2026-06-22T18:00:00",
    preOrderPrice: "R$ 1.099,00",
    reservedUnits: 312,
    totalUnits: 800,
    highlight: "Maringá FC Limited Edition",
  },
];

export function getPreOrderInfo(productId: number): PreOrderInfo | null {
  return PRE_ORDER_ITEMS.find((p) => p.productId === productId) ?? null;
}
