// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface CartProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  filial: string;
  quantity: number;
  unitType: string;
}

export interface CartSection {
  state: string;
  products: CartProduct[];
}

/**
 * CatalogProduct
 *
 * filial: 'FILIAL PR' | 'FILIAL ES'
 *   → Para produtos de filial única (priceES === null), indica a qual NF o
 *     produto pertence (NF Paraná ou NF Espírito Santo).
 *   → Para produtos duais (priceES !== null), o cliente seleciona a filial
 *     no card antes de adicionar ao carrinho.
 *
 * Esta associação é mantida no nível de dados (backend). O front-end a usa
 * apenas para rotear o item à NF correta no checkout.
 */
export interface CatalogProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  /** Preço base — usado também para produtos ES-only quando priceES === null e filial === 'FILIAL ES' */
  pricePR: number;
  /** null → produto de filial única. number → disponível em PR e ES */
  priceES: number | null;
  oldPrice?: number | null;
  image: string;
  /** Filial primária / NF de destino para produtos de filial única */
  filial: 'FILIAL PR' | 'FILIAL ES';
  unitInfo?: string;
  hasTimer?: boolean;
  discount?: string | null;
}

// ─── Figma asset ─────────────────────────────────────────────────────────────
import imgImage7 from 'figma:asset/c43f80881077b18717d00a7c7b7a14972dcb1059.png';
const imgMouse = imgImage7;

// ─── Product images ───────────────────────────────────────────────────────────
export const imgKeyboard =
  'https://images.unsplash.com/photo-1626958390916-90be78b9bfe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';
export const imgHeadset =
  'https://images.unsplash.com/photo-1549015900-29b4d462d219?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';
export const imgMonitor =
  'https://images.unsplash.com/photo-1632064824547-e77c36851495?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';
export const imgChair =
  'https://images.unsplash.com/photo-1770195555068-37103df33bf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';
export const imgCase =
  'https://images.unsplash.com/photo-1706477001921-8e41eedcdbae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';
export const imgWebcam =
  'https://images.unsplash.com/photo-1671464884932-842296b12314?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';
export const imgPSU =
  'https://images.unsplash.com/photo-1754928864335-608149b7f6a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';
export const imgGPU =
  'https://images.unsplash.com/photo-1757356747708-f11f10dbda7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

// Legacy re-exports (kept for backward compatibility)
export {
  imgMouse,
  imgMouse as imgImage3,
  imgMouse as imgImage4,
  imgMouse as imgImage5,
  imgMouse as imgImage6,
};

// ─── Product Catalog ──────────────────────────────────────────────────────────
//
// Regras de filial (NF):
//   • priceES === null + filial 'FILIAL PR'  → exclusivo NF Paraná
//   • priceES === null + filial 'FILIAL ES'  → exclusivo NF Espírito Santo
//   • priceES !== null                       → disponível em ambas; cliente seleciona no card
//
export const PRODUCT_CATALOG: CatalogProduct[] = [
  // ── Exclusivos FILIAL PR ────────────────────────────────────────────────
  {
    id: 'PRD-001',
    sku: '10001',
    name: 'MOUSE DASH GREY SEM FIO MULTI DEVICE SILENT CLICK 1500 DPI PMDWMDSCG',
    brand: 'PCYES',
    pricePR: 47.52,
    priceES: null,
    image: imgMouse,
    filial: 'FILIAL PR',
    unitInfo: 'Valores com IPI + ST (Caso Houver)',
  },
  {
    id: 'PRD-002',
    sku: '10002',
    name: 'TECLADO GAMER STRIKE PRO RGB 104 TECLAS SWITCH ÓPTICO ANTI-GHOSTING PRETO',
    brand: 'PCYES',
    pricePR: 89.90,
    priceES: null,
    oldPrice: 97.72,
    image: imgKeyboard,
    filial: 'FILIAL PR',
    unitInfo: 'Valores com IPI + ST (Caso Houver)',
    discount: '-8%',
  },
  {
    id: 'PRD-003',
    sku: '10003',
    name: 'HEADSET GAMER 7.1 SURROUND USB COM MICROFONE RETRÁTIL LED RGB',
    brand: 'PCYES',
    pricePR: 65.00,
    priceES: null,
    image: imgHeadset,
    filial: 'FILIAL PR',
    unitInfo: 'Valores com IPI + ST (Caso Houver)',
  },
  {
    id: 'PRD-004',
    sku: '10004',
    name: 'FONTE DE ALIMENTAÇÃO ATX 500W REAIS 80 PLUS BRONZE PFC ATIVO CABO FLAT',
    brand: 'PCYES',
    pricePR: 120.00,
    priceES: null,
    oldPrice: 149.90,
    image: imgPSU,
    filial: 'FILIAL PR',
    unitInfo: 'Valores com IPI + ST (Caso Houver)',
    discount: '-20%',
  },
  {
    id: 'PRD-005',
    sku: '10005',
    name: 'WEBCAM FULL HD 1080P 30FPS COM MICROFONE INTEGRADO USB PLUG & PLAY',
    brand: 'VINIK',
    pricePR: 55.90,
    priceES: null,
    image: imgWebcam,
    filial: 'FILIAL PR',
    unitInfo: 'Valores com IPI + ST (Caso Houver)',
  },

  // ── Exclusivos FILIAL ES ────────────────────────────────────────────────
  {
    id: 'PRD-006',
    sku: '10006',
    name: 'MONITOR LED 24" FULL HD IPS 75HZ HDMI/VGA BORDAS ULTRAFINAS',
    brand: 'PCYES',
    pricePR: 450.00,
    priceES: null,
    image: imgMonitor,
    filial: 'FILIAL ES',
    unitInfo: 'Valores com IPI + ST (Caso Houver)',
  },
  {
    id: 'PRD-007',
    sku: '10007',
    name: 'CADEIRA GAMER ERGONÔMICA RECLINÁVEL 180° ENCOSTO LOMBAR APOIO DE CABEÇA',
    brand: 'PCYES',
    pricePR: 310.00,
    priceES: null,
    image: imgChair,
    filial: 'FILIAL ES',
    unitInfo: 'Valores com IPI + ST (Caso Houver)',
    hasTimer: true,
  },

  // ── Disponível em ambas as filiais (PR + ES) ────────────────────────────
  {
    id: 'PRD-008',
    sku: '10008',
    name: 'GABINETE GAMER MID TOWER RGB VIDRO TEMPERADO LATERAL 2 FANS INCLUSOS PRETO',
    brand: 'PCYES',
    pricePR: 199.90,
    priceES: 204.00,
    image: imgCase,
    filial: 'FILIAL PR',
    unitInfo: 'Valores com IPI + ST (Caso Houver)',
  },
  {
    id: 'PRD-009',
    sku: '10009',
    name: 'PLACA DE VÍDEO GTX 1650 4GB GDDR6 128 BITS LOW PROFILE DUAL FAN',
    brand: 'PCYES',
    pricePR: 780.00,
    priceES: 790.00,
    oldPrice: 849.90,
    image: imgGPU,
    filial: 'FILIAL PR',
    unitInfo: 'Valores com IPI + ST (Caso Houver)',
    discount: '-5%',
  },
  {
    id: 'PRD-010',
    sku: '10010',
    name: 'MOUSE SEM FIO OFFICE SILENCIOSO 1600 DPI BLUETOOTH USB RECARREGÁVEL BRANCO',
    brand: 'VINIK',
    pricePR: 52.00,
    priceES: 52.00,
    image: imgMouse,
    filial: 'FILIAL PR',
    unitInfo: 'Valores com IPI + ST (Caso Houver)',
  },
];

// ─── Initial cart mock ────────────────────────────────────────────────────────
// 2 itens FILIAL PR + 2 itens FILIAL ES

export const cartSections: CartSection[] = [
  {
    state: 'PR',
    products: [
      {
        id: 'pr-1',
        sku: '10001',
        name: 'MOUSE DASH GREY SEM FIO MULTI DEVICE SILENT CLICK 1500 DPI PMDWMDSCG',
        brand: 'PCYES',
        price: 47.52,
        image: imgMouse,
        filial: 'FILIAL PR',
        quantity: 1,
        unitType: 'Item',
      },
      {
        id: 'pr-2',
        sku: '10002',
        name: 'TECLADO GAMER STRIKE PRO RGB 104 TECLAS SWITCH ÓPTICO ANTI-GHOSTING PRETO',
        brand: 'PCYES',
        price: 89.90,
        oldPrice: 97.72,
        image: imgKeyboard,
        filial: 'FILIAL PR',
        quantity: 2,
        unitType: 'Item',
      },
    ],
  },
  {
    state: 'ES',
    products: [
      {
        id: 'es-1',
        sku: '10006',
        name: 'MONITOR LED 24" FULL HD IPS 75HZ HDMI/VGA BORDAS ULTRAFINAS',
        brand: 'PCYES',
        price: 450.00,
        image: imgMonitor,
        filial: 'FILIAL ES',
        quantity: 1,
        unitType: 'Item',
      },
      {
        id: 'es-2',
        sku: '10007',
        name: 'CADEIRA GAMER ERGONÔMICA RECLINÁVEL 180° ENCOSTO LOMBAR APOIO DE CABEÇA',
        brand: 'PCYES',
        price: 310.00,
        image: imgChair,
        filial: 'FILIAL ES',
        quantity: 1,
        unitType: 'Caixa mãe',
      },
    ],
  },
];

// Suggested / related products shown on product detail page
export const suggestedProducts = PRODUCT_CATALOG.slice(0, 4).map((p) => ({
  id: p.id,
  sku: p.sku,
  name: p.name,
  brand: p.brand,
  pricePR: p.pricePR,
  priceES: p.priceES,
  oldPrice: p.oldPrice ?? null,
  image: p.image,
  filial: p.filial,
  unitInfo: p.unitInfo ?? '',
  hasTimer: p.hasTimer ?? false,
  discount: p.discount ?? null,
}));

// ─── Utility ──────────────────────────────────────────────────────────────────
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
