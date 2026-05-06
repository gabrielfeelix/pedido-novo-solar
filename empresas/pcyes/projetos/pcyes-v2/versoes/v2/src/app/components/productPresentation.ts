import { allProducts, type Product } from "./productsData";

export interface CatalogHrefParams {
  category?: string;
  subcategory?: string;
  search?: string;
}

export interface ProductSwatch {
  color: string;
  label: string;
  productId: number;
  image: string;
  name: string;
}

export interface ProductHoverMedia {
  type: "video" | "image";
  src: string;
}

const COLOR_RULES = [
  { keywords: ["black", "preto", "vulcan"], color: "#18181b", label: "Preto" },
  { keywords: ["white", "branco", "ghost"], color: "#f4f4f5", label: "Branco" },
  { keywords: ["red", "vermelho", "magma"], color: "#dc2626", label: "Vermelho" },
  { keywords: ["blue", "azul", "cobalt", "colbat"], color: "#2563eb", label: "Azul" },
  { keywords: ["green", "verde", "mint"], color: "#65a30d", label: "Verde" },
  { keywords: ["purple", "roxo"], color: "#9333ea", label: "Roxo" },
  { keywords: ["yellow", "amarela", "amarelo"], color: "#eab308", label: "Amarelo" },
  { keywords: ["brown", "marrom"], color: "#92400e", label: "Marrom" },
  { keywords: ["pink", "rosa"], color: "#ec4899", label: "Rosa" },
  { keywords: ["silver", "prata"], color: "#a1a1aa", label: "Prata" },
];

const GENERIC_TOKENS = new Set([
  "pcyes",
  "gamer",
  "gaming",
  "ergonomica",
  "ergonômica",
  "vidro",
  "temperado",
  "lateral",
  "pc",
  "yes",
  "mm",
  "rgb",
  "argb",
  "wireless",
  "sem",
  "fio",
  "usb",
  "series",
]);

const hoverVideos: Partial<Record<number, string>> = {};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function includesAny(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

export function getProductSubcategory(product: Pick<Product, "name" | "category" | "subcategory">) {
  const name = normalizeText(product.name);
  const category = normalizeText(product.category);
  const rawSubcategory = product.subcategory ? normalizeText(product.subcategory) : "";
  const searchable = `${name} ${rawSubcategory}`;

  if (includesAny(searchable, ["teclado", "keyboard"])) return "Teclados";
  if (includesAny(searchable, ["mousepad", "mouse pad", "desk mat"])) return "Mousepads";
  if (includesAny(searchable, ["mouse"])) return "Mouses";
  if (includesAny(searchable, ["headset", "fone"])) return "Headsets";
  if (includesAny(searchable, ["microfone", "placa de captura", "captura", "webcam"])) return product.subcategory ?? "Streaming";
  if (includesAny(searchable, ["mini computador", "mini pc"])) return "Mini Computadores";
  if (includesAny(searchable, ["pcyes one", "all in one"])) return "All in One";
  if (includesAny(searchable, ["cadeira gamer"])) return "Cadeiras Gamer";
  if (includesAny(searchable, ["cadeira ergonomica", "cadeira ergonomica", "ergonomica"])) return "Cadeiras Ergonômicas";
  if (includesAny(searchable, ["cadeira office"])) return "Cadeiras Office";
  if (includesAny(searchable, ["water cooler"])) return "Water Coolers";
  if (includesAny(searchable, ["cooler fan"])) return "Cooler Fans";
  if (includesAny(searchable, ["cooler"])) return "Coolers";
  if (includesAny(searchable, ["gabinete"])) return "Gabinetes";
  if (includesAny(searchable, ["placa de video", "geforce", "radeon"])) return "Placas de Vídeo";
  if (includesAny(searchable, ["ssd", "hd ", "memoria", "memória"])) return product.subcategory ?? "Armazenamento";
  if (includesAny(searchable, ["fonte"])) return "Fontes";
  if (includesAny(searchable, ["monitor"])) return "Monitores";

  if (product.subcategory) return product.subcategory;
  if (category) return product.category;
  return "Produtos";
}

export function isPlaceholderProductImage(image?: string) {
  if (!image) return true;

  const normalized = image.toLowerCase();
  return (
    normalized.startsWith("/home/") ||
    normalized.includes("category-") ||
    normalized.includes("release-keyboard-context")
  );
}

export function hasUsableProductImage(product: Pick<Product, "image" | "images">) {
  if (!isPlaceholderProductImage(product.image)) return true;
  return Boolean(product.images?.some((image) => !isPlaceholderProductImage(image)));
}

export function getPrimaryProductImage(product: Pick<Product, "image" | "images">) {
  return product.images?.find((image) => !isPlaceholderProductImage(image)) ?? product.image;
}

export function getProductImages(product: Pick<Product, "image" | "images">) {
  const images = product.images?.filter((image) => !isPlaceholderProductImage(image)) ?? [];
  if (!isPlaceholderProductImage(product.image) && !images.includes(product.image)) {
    images.unshift(product.image);
  }
  return images.length > 0 ? images : [product.image];
}

export function getVisibleCatalogProducts(catalog: Product[] = allProducts) {
  return catalog.filter(hasUsableProductImage);
}

export function getCatalogHref({ category, subcategory, search }: CatalogHrefParams) {
  const params = new URLSearchParams();

  if (category) params.set("category", category);
  if (subcategory) params.set("subcategory", subcategory);
  if (search) params.set("search", search);

  const query = params.toString();
  return query ? `/produtos?${query}` : "/produtos";
}

function getColorRule(name: string) {
  const normalized = normalizeText(name);
  return COLOR_RULES.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
}

function tokenizeName(value: string) {
  return normalizeText(value)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function isSwitchContext(tokens: string[], index: number) {
  return tokens[index - 1] === "switch" || tokens[index + 1] === "switch";
}

function getBodyColorLabels(name: string) {
  const tokens = tokenizeName(name);
  const labels = new Set<string>();

  COLOR_RULES.forEach((rule) => {
    tokens.forEach((token, index) => {
      if (!rule.keywords.includes(token)) return;
      if (isSwitchContext(tokens, index)) return;
      labels.add(rule.label);
    });
  });

  return Array.from(labels);
}

export function getProductColorLabels(product: Pick<Product, "name">) {
  return getBodyColorLabels(product.name);
}

function getFamilySignature(product: Pick<Product, "name" | "category">) {
  const normalized = normalizeText(product.name)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => token.length > 2)
    .filter((token) => !GENERIC_TOKENS.has(token))
    .filter((token) => !COLOR_RULES.some((rule) => rule.keywords.includes(token)));

  const familyTokens = normalized.slice(0, 2);
  return `${normalizeText(product.category)}::${familyTokens.join("-")}`;
}

export function findProductBySwatch(swatch: ProductSwatch, catalog: Product[] = allProducts) {
  return catalog.find((product) => product.id === swatch.productId) ?? null;
}

export function getProductSwatches(
  product: Pick<Product, "id" | "name" | "category">,
  catalog: Product[] = allProducts,
): ProductSwatch[] {
  const signature = getFamilySignature(product);
  if (!signature.endsWith("::")) {
    const variants = catalog.filter((candidate) => getFamilySignature(candidate) === signature && hasUsableProductImage(candidate));
    const deduped = new Map<string, ProductSwatch>();

    variants.forEach((variant) => {
      const label = getBodyColorLabels(variant.name)[0];
      const rule = label ? COLOR_RULES.find((item) => item.label === label) : null;
      if (!rule) return;

      deduped.set(rule.label, {
        color: rule.color,
        label: rule.label,
        productId: variant.id,
        image: getPrimaryProductImage(variant),
        name: variant.name,
      });
    });

    if (deduped.size > 1) {
      return Array.from(deduped.values()).slice(0, 6);
    }
  }

  return [];
}

export function getProductHoverMedia(
  product: Pick<Product, "id" | "image" | "images">,
): ProductHoverMedia | null {
  const video = hoverVideos[product.id];
  if (video) {
    return { type: "video", src: video };
  }

  if (product.images && product.images.length > 1) {
    return { type: "image", src: product.images[1] };
  }

  return null;
}
