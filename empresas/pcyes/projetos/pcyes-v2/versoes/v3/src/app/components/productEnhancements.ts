import type { Product } from "./productsData";

/** Discount % from oldPriceNum (real or synthetic). */
export function getDiscountPct(p: Product): number {
  if (!p.oldPriceNum || p.oldPriceNum <= p.priceNum) return 0;
  return Math.round(((p.oldPriceNum - p.priceNum) / p.oldPriceNum) * 100);
}

/** Money saved (oldPrice - price). 0 if no discount. */
export function getEconomy(p: Product): number {
  if (!p.oldPriceNum || p.oldPriceNum <= p.priceNum) return 0;
  return Math.round((p.oldPriceNum - p.priceNum) * 100) / 100;
}

/** PIX price = priceNum with 10% extra discount. */
export function getPixPrice(p: Product): number {
  return Math.round(p.priceNum * 0.9 * 100) / 100;
}

/** Format BRL "R$ 1.234,56". */
export function formatBRL(n: number): string {
  return `R$ ${n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** 10x installment. */
export function getInstallment(p: Product): number {
  return Math.round((p.priceNum / 10) * 100) / 100;
}

export type SocialProof = {
  icon: "fire" | "eye" | "zap";
  text: string;
  color: string;
};

/** Deterministic social proof per product. ~60% chance show. */
export function getSocialProof(p: Product): SocialProof | null {
  const hash = (p.id * 31 + 7) % 100;
  if (hash < 40) return null;
  if (hash < 60) {
    const sold = ((p.id * 13) % 40) + 8;
    return { icon: "fire", text: `${sold} vendidos hoje`, color: "#ff7a45" };
  }
  if (hash < 80) {
    const watching = ((p.id * 7) % 18) + 3;
    return { icon: "eye", text: `${watching} olhando agora`, color: "#22c55e" };
  }
  return { icon: "zap", text: "Vendendo rápido", color: "#ff2419" };
}

/** Low stock if hash low. */
export function isLowStock(p: Product): boolean {
  if (p.inStock === false) return false;
  const hash = (p.id * 19 + 11) % 100;
  return hash < 18;
}

/** Stock count for "Últimas X". */
export function getStockCount(p: Product): number {
  return ((p.id * 13) % 5) + 2;
}

/** Heat level for discount badge color. */
export function getDiscountHeat(discount: number): "cold" | "warm" | "hot" | "fire" {
  if (discount >= 40) return "fire";
  if (discount >= 25) return "hot";
  if (discount >= 15) return "warm";
  return "cold";
}

export function getDiscountBg(discount: number): string {
  const h = getDiscountHeat(discount);
  if (h === "fire") return "linear-gradient(135deg, #ff2419 0%, #ff7a45 100%)";
  if (h === "hot") return "linear-gradient(135deg, #f97316 0%, #facc15 100%)";
  if (h === "warm") return "linear-gradient(135deg, #34d399 0%, #10b981 100%)";
  return "linear-gradient(135deg, #34d399 0%, #10b981 100%)";
}

export function getDiscountGlow(discount: number): string {
  const h = getDiscountHeat(discount);
  if (h === "fire") return "0 6px 22px -4px rgba(255,36,25,0.7)";
  if (h === "hot") return "0 6px 22px -4px rgba(249,115,22,0.6)";
  return "0 6px 18px -4px rgba(16,185,129,0.55)";
}
