import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  SlidersHorizontal, ArrowUpDown, ChevronDown, Grid3X3, LayoutList,
  Heart, ShoppingBag, Star, X, ArrowUpRight, ChevronLeft,
  ChevronRight, Check, Eye, Minus, Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";
import { useTheme } from "./ThemeProvider";
import { Footer } from "./Footer";
import { allProducts, allTags as productTags, brands as productBrands, categories as productCategories, type Product } from "./productsData";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  getCatalogHref,
  getProductImages,
  getProductColorLabels,
  getPrimaryProductImage,
  getProductSubcategory,
  getProductSwatches,
  getVisibleCatalogProducts,
} from "./productPresentation";

const categoryMap: Record<string, string> = {
  ...Object.fromEntries(productCategories.map((category) => [category, category])),
  "Coolers": "Refrigeração",
  "Linha BrTT": "Periféricos",
};
const allTags = productTags.filter((tag) => ["Gaming", "RGB", "Wireless", "Streaming", "Escritório"].includes(tag));
const featuredCategoryFilters = [
  {
    label: "Fone de Ouvido",
    matches: (product: Product) => {
      const name = product.name.toLowerCase();
      return name.includes("fone de ouvido") || name.includes("headphone") || name.includes("fone ");
    },
  },
  {
    label: "Headset",
    matches: (product: Product) => {
      const name = product.name.toLowerCase();
      return name.includes("headset") || getProductSubcategory(product) === "Headsets";
    },
  },
  {
    label: "Mouse",
    matches: (product: Product) => {
      const name = product.name.toLowerCase();
      return name.includes("mouse") || getProductSubcategory(product) === "Mouses";
    },
  },
  {
    label: "Teclado",
    matches: (product: Product) => {
      const name = product.name.toLowerCase();
      return name.includes("teclado") || name.includes("keyboard") || getProductSubcategory(product) === "Teclados";
    },
  },
] satisfies Array<{ label: string; matches: (product: Product) => boolean }>;
const featuredCategoryRoutes: Record<string, { category: string; subcategory: string }> = {
  "Fone de Ouvido": { category: "Periféricos", subcategory: "Headsets" },
  "Headset": { category: "Periféricos", subcategory: "Headsets" },
  "Mouse": { category: "Periféricos", subcategory: "Mouses" },
  "Teclado": { category: "Periféricos", subcategory: "Teclados" },
};
const colorFilters = [
  { label: "Cinza", color: "#5a5a5a" },
  { label: "Lilás", color: "#c7a1d9" },
  { label: "Preto", color: "#09090b" },
  { label: "Vermelho", color: "#d6181f" },
  { label: "Verde", color: "#17823b" },
  { label: "Azul", color: "#1438a6" },
  { label: "Branco", color: "#f8f8f7" },
  { label: "Prata", color: "#bcbcbc" },
  { label: "Amarelo", color: "#ffef2d" },
  { label: "Laranja", color: "#ff9900" },
  { label: "Rosa", color: "#ff79a8" },
  { label: "Marrom", color: "#8b5a2b" },
];
function normalizeFilterKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
function getFeaturedCategoryLabel(value: string) {
  return featuredCategoryFilters.find((filter) => normalizeFilterKey(filter.label) === normalizeFilterKey(value))?.label ?? "";
}
// Products with real images only — filters out placeholder category images
const validProducts = getVisibleCatalogProducts(allProducts);
const productById = new Map<number, Product>(allProducts.map((product) => [product.id, product]));
const productSwatchesById: Record<number, ReturnType<typeof getProductSwatches>> = {};
const productColorLabelsById: Record<number, string[]> = {};
const productVariantByColor: Record<number, Record<string, Product>> = {};

validProducts.forEach((product) => {
  const directColorLabels = getProductColorLabels(product);
  const swatches = getProductSwatches(product);
  const colorLabels = new Set(directColorLabels);
  const variantsByColor: Record<string, Product> = {};

  directColorLabels.forEach((label) => {
    variantsByColor[label] = product;
  });

  swatches.forEach((swatch) => {
    colorLabels.add(swatch.label);
    const variant = productById.get(swatch.productId);
    if (variant) variantsByColor[swatch.label] = variant;
  });

  productSwatchesById[product.id] = swatches;
  productColorLabelsById[product.id] = Array.from(colorLabels);
  productVariantByColor[product.id] = variantsByColor;
});

function productMatchesColor(product: Product, label: string) {
  return productColorLabelsById[product.id]?.includes(label) ?? false;
}

function getProductSwatchesCached(product: Product) {
  return productSwatchesById[product.id] ?? [];
}

function getProductVariantByColor(product: Product, label: string) {
  return productVariantByColor[product.id]?.[label] ?? null;
}

const PAGE_SIZE_OPTIONS = [12, 24, 36] as const;
const sortOptions = [
  { label: "Relevância", value: "relevance" },
  { label: "Mais vendidos", value: "bestselling" },
  { label: "A – Z", value: "az" },
  { label: "Z – A", value: "za" },
  { label: "Menor preço", value: "price-asc" },
  { label: "Maior preço", value: "price-desc" },
  { label: "Mais avaliados", value: "rating" },
  { label: "Maior desconto", value: "discount" },
];
const brandsList = productBrands;
const GLOBAL_MIN = 0;
const GLOBAL_MAX = 15000;

function getDiscount(p: Product) {
  if (!p.oldPriceNum || p.oldPriceNum <= p.priceNum) return 0;
  return Math.round(((p.oldPriceNum - p.priceNum) / p.oldPriceNum) * 100);
}

function getSwitchBadgeInfo(product: Product) {
  const normalized = `${product.badge ?? ""} ${product.name}`.toLowerCase();
  if (!normalized.includes("switch")) return null;
  if (normalized.includes("blue")) return { src: "/switches/blue-switch.png", label: product.badge ?? "Blue Switch" };
  if (normalized.includes("red")) return { src: "/switches/red-dragon.png", label: product.badge ?? "Red Switch" };
  if (normalized.includes("brown")) return { src: "/switches/brown-switch1.png", label: product.badge ?? "Brown Switch" };
  return null;
}

function getProductAboutBullets(product: Product) {
  return product.features?.length
    ? product.features
    : (product.description ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

/* ═══════════════════════════════════════════════════════
   PRICE RANGE SLIDER
   ═══════════════════════════════════════════════════════ */

function PriceRangeSlider({
  min, max, minBound = GLOBAL_MIN, maxBound = GLOBAL_MAX, onMinChange, onMaxChange, onApply,
}: {
  min: number; max: number;
  minBound?: number; maxBound?: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
  onApply: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);
  const range = Math.max(1, maxBound - minBound);
  const safeMin = Math.max(minBound, Math.min(min, maxBound));
  const safeMax = Math.min(maxBound, Math.max(max, minBound));

  const minPct = ((safeMin - minBound) / range) * 100;
  const maxPct = ((safeMax - minBound) / range) * 100;

  const getPctFromEvent = (e: MouseEvent | React.MouseEvent) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const x = "touches" in e ? (e as any).touches[0].clientX : e.clientX;
    return Math.max(0, Math.min(1, (x - rect.left) / rect.width));
  };

  const handlePointerDown = (thumb: "min" | "max") => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDragging(thumb);
    const pct = getPctFromEvent(e);
    const val = Math.round(minBound + pct * range);
    if (thumb === "min") onMinChange(Math.min(val, max));
    else onMaxChange(Math.max(val, min));
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      const pct = getPctFromEvent(e as any);
      const val = Math.round(minBound + pct * range);
      if (dragging === "min") onMinChange(Math.min(val, max));
      else onMaxChange(Math.max(val, min));
    };
    const handleUp = () => { setDragging(null); onApply(); };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
  }, [dragging, min, max, minBound, range, onMinChange, onMaxChange, onApply]);

  const formatBRL = (v: number) =>
    `R$ ${Math.round(v).toLocaleString("pt-BR")}`;

  return (
    <div className="space-y-4 mt-2">
      {/* Slider track */}
      <div className="px-3 py-3">
      <div ref={trackRef} className="relative h-2 bg-foreground/[0.08] rounded-full cursor-pointer select-none">
        {/* Active range */}
        <div
          className="absolute top-0 h-full rounded-full bg-primary"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        {/* Min thumb */}
        <div
          onMouseDown={handlePointerDown("min")}
          onTouchStart={handlePointerDown("min") as any}
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-primary border-2 border-background shadow-md cursor-grab active:cursor-grabbing z-10 flex items-center justify-center"
          style={{ left: `calc(${minPct}% - 10px)` }}
          aria-label="Preço mínimo"
          role="slider"
        >
          <div className="absolute w-11 h-11 bg-transparent" />
        </div>
        {/* Max thumb */}
        <div
          onMouseDown={handlePointerDown("max")}
          onTouchStart={handlePointerDown("max") as any}
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-primary border-2 border-background shadow-md cursor-grab active:cursor-grabbing z-10 flex items-center justify-center"
          style={{ left: `calc(${maxPct}% - 10px)` }}
          aria-label="Preço máximo"
          role="slider"
        >
          <div className="absolute w-11 h-11 bg-transparent" />
        </div>
      </div>
      </div>
      {/* Min / Max inputs */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-foreground/40 mb-1.5 block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.06em" }}>MÍN</label>
          <input
            type="text" value={formatBRL(safeMin)}
            onChange={(e) => onMinChange(Math.max(minBound, Math.min(parseInt(e.target.value.replace(/\D/g, "")) || minBound, max)))}
            onBlur={onApply}
            className="w-full border border-foreground/15 px-3 py-2 bg-transparent text-foreground focus:border-foreground/30 focus:outline-none transition-colors text-center"
            style={{ borderRadius: "6px", fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
          />
        </div>
        <div className="flex-1">
          <label className="text-foreground/40 mb-1.5 block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.06em" }}>MÁX</label>
          <input
            type="text" value={formatBRL(safeMax)}
            onChange={(e) => onMaxChange(Math.min(maxBound, Math.max(parseInt(e.target.value.replace(/\D/g, "")) || maxBound, min)))}
            onBlur={onApply}
            className="w-full border border-foreground/15 px-3 py-2 bg-transparent text-foreground focus:border-foreground/30 focus:outline-none transition-colors text-center"
            style={{ borderRadius: "6px", fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSubcategory = searchParams.get("subcategory") || "";
  const initialSearch = searchParams.get("search") || "";
  const initialFeaturedCategory = initialCategory ? getFeaturedCategoryLabel(initialCategory) : "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    initialCategory && !initialFeaturedCategory ? new Set([categoryMap[initialCategory] ?? initialCategory]) : new Set()
  );
  const [selectedFeaturedCategories, setSelectedFeaturedCategories] = useState<Set<string>>(
    initialFeaturedCategory ? new Set([initialFeaturedCategory]) : new Set()
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(
    initialSubcategory ? new Set([initialSubcategory]) : new Set()
  );
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState(GLOBAL_MIN);
  const [priceMax, setPriceMax] = useState(GLOBAL_MAX);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [minDiscount, setMinDiscount] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [gridMode, setGridMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [itemsPerPageDropdownOpen, setItemsPerPageDropdownOpen] = useState(false);
  const [colsCount, setColsCount] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(36);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<Record<string, number>>({});
  const [selectedVariantIds, setSelectedVariantIds] = useState<Record<number, number>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true, brands: true, tags: false, price: true, color: true, rating: false, promo: false,
  });

  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const activeCategoryLabel = initialCategory ? categoryMap[initialCategory] ?? initialCategory : "";
  const isSubcategoryRoute = Boolean(activeCategoryLabel && initialSubcategory);

  useEffect(() => {
    const cat = searchParams.get("category");
    const subcat = searchParams.get("subcategory");
    const featuredCat = cat ? getFeaturedCategoryLabel(cat) : "";
    setSelectedCategories(cat && !featuredCat ? new Set([categoryMap[cat] ?? cat]) : new Set());
    setSelectedFeaturedCategories(featuredCat ? new Set([featuredCat]) : new Set());
    setSelectedSubcategories(subcat ? new Set([subcat]) : new Set());

    const sq = searchParams.get("search");
    setSearchQuery(sq ?? "");
  }, [searchParams]);

  /* ── Responsive columns ── */
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1800) setColsCount(4);
      else if (w >= 1280) setColsCount(3);
      else setColsCount(2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ── Scroll to top on category change ── */
  const mainRef = useRef<HTMLDivElement>(null);
  const itemsPerPageDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [initialCategory, initialSubcategory]);

  /* ── Helpers ── */
  const toggleSet = <T,>(setter: React.Dispatch<React.SetStateAction<Set<T>>>, val: T) => {
    setter((prev) => { const n = new Set(prev); n.has(val) ? n.delete(val) : n.add(val); return n; });
  };
  const toggleCategory = (cat: string) => {
    const isSelected = selectedCategories.has(cat);
    toggleSet(setSelectedCategories, cat);
    setSelectedFeaturedCategories(new Set());
    if (isSelected) {
      // Clear subcategories belonging to this category when deselecting
      const catSubcatSet = new Set(validProducts.filter((p) => p.category === cat).map(getProductSubcategory));
      setSelectedSubcategories((prev) => { const n = new Set(prev); catSubcatSet.forEach((sc) => n.delete(sc)); return n; });
      const sp = new URLSearchParams(searchParams); sp.delete("category"); sp.delete("subcategory"); setSearchParams(sp, { replace: true });
    }
  };
  const toggleFeaturedCategory = (label: string) => {
    const route = featuredCategoryRoutes[label];
    if (route) {
      setSearchParams(new URLSearchParams(getCatalogHref(route).split("?")[1]), { replace: false });
      return;
    }

    toggleSet(setSelectedFeaturedCategories, label);
    setSelectedCategories(new Set());
    setSelectedSubcategories(new Set());
    const sp = new URLSearchParams(searchParams);
    sp.delete("category");
    sp.delete("subcategory");
    setSearchParams(sp, { replace: true });
  };
  const toggleColor = (label: string) => {
    setSelectedColors((prev) => (prev.has(label) ? new Set() : new Set([label])));
  };
  const toggleSection = (key: string) => setExpandedSections((p) => ({ ...p, [key]: !p[key] }));

  const getColorMatchedProduct = (product: Product) => {
    const manualVariantId = selectedVariantIds[product.id];
    if (manualVariantId) {
      const manualVariant = productById.get(manualVariantId);
      if (manualVariant) return manualVariant;
    }

    const selectedColor = [...selectedColors].find((color) => productMatchesColor(product, color));
    if (!selectedColor) return product;

    return getProductVariantByColor(product, selectedColor) ?? product;
  };

  const clearAll = () => {
    setSelectedCategories(new Set()); setSelectedFeaturedCategories(new Set()); setSelectedSubcategories(new Set()); setSelectedTags(new Set()); setSelectedBrands(new Set()); setSelectedColors(new Set());
    setPriceMin(GLOBAL_MIN); setPriceMax(GLOBAL_MAX); setOnlyDiscount(false); setMinDiscount(null); setMinRating(null);
    setInStockOnly(false); setSearchQuery(""); setSelectedVariantIds({});
    const sp = new URLSearchParams(searchParams); sp.delete("category"); sp.delete("subcategory"); sp.delete("search"); setSearchParams(sp, { replace: true });
  };

  const productsWithoutPriceFilter = useMemo(() => {
    let result = [...validProducts];
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lowerQ) || p.category.toLowerCase().includes(lowerQ));
    }
    if (selectedCategories.size > 0) result = result.filter((p) => selectedCategories.has(p.category));
    if (selectedFeaturedCategories.size > 0) {
      result = result.filter((p) =>
        featuredCategoryFilters.some((filter) => selectedFeaturedCategories.has(filter.label) && filter.matches(p))
      );
    }
    if (selectedSubcategories.size > 0) result = result.filter((p) => selectedSubcategories.has(getProductSubcategory(p)));
    if (selectedTags.size > 0) result = result.filter((p) => p.tags.some((t) => selectedTags.has(t)));
    if (selectedBrands.size > 0) result = result.filter((p) => p.brand && selectedBrands.has(p.brand));
    if (onlyDiscount) result = result.filter((p) => getDiscount(getColorMatchedProduct(p)) > 0);
    if (minDiscount !== null) result = result.filter((p) => getDiscount(getColorMatchedProduct(p)) >= minDiscount);
    if (minRating !== null) result = result.filter((p) => p.rating >= minRating);
    if (inStockOnly) result = result.filter((p) => p.inStock !== false);

    return result;
  }, [selectedCategories, selectedFeaturedCategories, selectedSubcategories, selectedTags, selectedBrands, onlyDiscount, minDiscount, minRating, inStockOnly, searchQuery]);

  const priceBounds = useMemo(() => {
    const productsForPrice = selectedColors.size > 0
      ? productsWithoutPriceFilter.filter((p) => [...selectedColors].some((color) => productMatchesColor(p, color)))
      : productsWithoutPriceFilter;

    if (productsForPrice.length === 0) return { min: GLOBAL_MIN, max: GLOBAL_MAX };

    const prices = productsForPrice.map((product) => getColorMatchedProduct(product).priceNum);
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));

    return { min: Math.max(GLOBAL_MIN, min), max: Math.max(GLOBAL_MIN, max) };
  }, [productsWithoutPriceFilter, selectedColors]);

  useEffect(() => {
    setPriceMin((prev) => Math.max(priceBounds.min, Math.min(prev, priceBounds.max)));
    setPriceMax((prev) => Math.min(priceBounds.max, Math.max(prev, priceBounds.min)));
  }, [priceBounds.min, priceBounds.max]);

  const priceFilterActive = priceMin > priceBounds.min || priceMax < priceBounds.max;

  const activeFilterCount = selectedCategories.size + selectedFeaturedCategories.size + selectedSubcategories.size + selectedTags.size + selectedBrands.size + selectedColors.size
    + (priceFilterActive ? 1 : 0) + (onlyDiscount ? 1 : 0)
    + (minDiscount !== null ? 1 : 0)
    + (minRating !== null ? 1 : 0) + (searchQuery ? 1 : 0) + (inStockOnly ? 1 : 0);

  const productsBeforeColorFilter = useMemo(() => {
    let result = [...productsWithoutPriceFilter];
    if (priceMin > priceBounds.min) result = result.filter((p) => getColorMatchedProduct(p).priceNum >= priceMin);
    if (priceMax < priceBounds.max) result = result.filter((p) => getColorMatchedProduct(p).priceNum <= priceMax);

    return result;
  }, [productsWithoutPriceFilter, priceMin, priceMax, priceBounds.min, priceBounds.max]);

  const availableColorFilters = useMemo(() => (
    colorFilters
      .map((filter) => ({
        ...filter,
        count: productsBeforeColorFilter.filter((product) => productMatchesColor(product, filter.label)).length,
      }))
      .filter((filter) => filter.count > 0)
  ), [productsBeforeColorFilter]);

  useEffect(() => {
    const availableLabels = new Set(availableColorFilters.map((filter) => filter.label));
    setSelectedColors((prev) => {
      const next = new Set([...prev].filter((color) => availableLabels.has(color)));
      return next.size === prev.size ? prev : next;
    });
  }, [availableColorFilters]);

  /* ── Filtered + sorted products ── */
  const filtered = useMemo(() => {
    let result = [...productsBeforeColorFilter];
    if (selectedColors.size > 0) result = result.filter((p) => [...selectedColors].some((color) => productMatchesColor(p, color)));

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.priceNum - b.priceNum); break;
      case "price-desc": result.sort((a, b) => b.priceNum - a.priceNum); break;
      case "rating": result.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
      case "discount": result.sort((a, b) => getDiscount(b) - getDiscount(a)); break;
      case "bestselling": result.sort((a, b) => b.reviews - a.reviews); break;
      case "az": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "za": result.sort((a, b) => b.name.localeCompare(a.name)); break;
    }
    return result;
  }, [productsBeforeColorFilter, selectedColors, sortBy]);

  /* ── Reset page when filters change ── */
  useEffect(() => { setCurrentPage(1); }, [filtered, itemsPerPage]);

  useEffect(() => {
    if (!itemsPerPageDropdownOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!itemsPerPageDropdownRef.current?.contains(event.target as Node)) {
        setItemsPerPageDropdownOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [itemsPerPageDropdownOpen]);

  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeFilterPills = (
    <>
      {searchQuery && <FilterPill label={`"${searchQuery}"`} onRemove={() => { setSearchQuery(""); const sp = new URLSearchParams(searchParams); sp.delete("search"); setSearchParams(sp, { replace: true }); }} />}
      {[...selectedCategories].map((c) => <FilterPill key={c} label={c} onRemove={() => toggleCategory(c)} />)}
      {[...selectedFeaturedCategories].map((c) => <FilterPill key={c} label={c} onRemove={() => toggleFeaturedCategory(c)} />)}
      {[...selectedSubcategories].map((c) => <FilterPill key={c} label={c} onRemove={() => toggleSet(setSelectedSubcategories, c)} />)}
      {[...selectedBrands].map((b) => <FilterPill key={b} label={b} onRemove={() => toggleSet(setSelectedBrands, b)} />)}
      {[...selectedTags].map((t) => <FilterPill key={t} label={t} onRemove={() => toggleSet(setSelectedTags, t)} />)}
      {[...selectedColors].map((color) => <FilterPill key={color} label={color} onRemove={() => toggleColor(color)} />)}
      {priceFilterActive && <FilterPill label={`R$ ${priceMin} – R$ ${priceMax}`} onRemove={() => { setPriceMin(priceBounds.min); setPriceMax(priceBounds.max); }} />}
      {onlyDiscount && <FilterPill label="Promoção" onRemove={() => setOnlyDiscount(false)} />}
      {minDiscount !== null && <FilterPill label={`> ${minDiscount}% OFF`} onRemove={() => setMinDiscount(null)} />}
      {minRating !== null && <FilterPill label={`${minRating}+ Estrelas`} onRemove={() => setMinRating(null)} />}
      {inStockOnly && <FilterPill label="Em estoque" onRemove={() => setInStockOnly(false)} />}
      {activeFilterCount > 0 && (
        <button onClick={clearAll} className="text-foreground/50 hover:text-foreground underline px-2 py-1 text-[12px] font-inter transition-colors">Limpar tudo</button>
      )}
    </>
  );

  /* ── Apply filters with loading ── */
  const applyFilters = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 350);
  };

  /* ── Add to cart with toast ── */
  const handleAddToCart = useCallback((product: typeof allProducts[0]) => {
    addItem(product);
    toast.success(`${product.name.split(" ").slice(0, 4).join(" ")}…`, {
      description: product.price,
      duration: 2500,
    });
  }, [addItem]);

  /* ── Image carousel ── */
  const getImageIndex = (imageKey: string | number, max: number) => Math.min(activeImageIndex[String(imageKey)] ?? 0, max - 1);
  const setImageIdx = (imageKey: string | number, idx: number, max: number) => {
    setActiveImageIndex((prev) => ({ ...prev, [String(imageKey)]: Math.max(0, Math.min(idx, max - 1)) }));
  };

  /* ═══════════════════════════════════════════════════════
     FILTER SIDEBAR CONTENT
     ═══════════════════════════════════════════════════════ */

  const filterSidebar = (
    <div className="space-y-1 pr-2">
      {/* Categorias — hierarchical */}
      {isSubcategoryRoute ? (
        <div className="border-b border-foreground/5 pb-5">
          <p className="text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em" }}>
            FAMÍLIA ATUAL
          </p>
          <p className="mt-2 text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: 600 }}>
            {initialSubcategory}
          </p>
          <p className="mt-1 text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: 1.5 }}>
            Filtros limitados a {activeCategoryLabel} / {initialSubcategory}.
          </p>
          <Link
            to={getCatalogHref({ category: activeCategoryLabel })}
            className="mt-3 inline-flex text-primary transition-opacity hover:opacity-75"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 600 }}
          >
            Ver {activeCategoryLabel}
          </Link>
        </div>
      ) : (
        <FilterSection title="Categorias" expanded={expandedSections.categories} onToggle={() => toggleSection("categories")}>
          {featuredCategoryFilters.map(({ label, matches }) => {
            const route = featuredCategoryRoutes[label];
            const isSelected = selectedFeaturedCategories.has(label) || Boolean(route && selectedCategories.has(route.category) && selectedSubcategories.has(route.subcategory));
            const catCount = validProducts.filter(matches).length;
            return (
              <button
                key={label}
                onClick={() => toggleFeaturedCategory(label)}
                className="flex w-full items-center justify-between gap-3 py-2 text-left group/item cursor-pointer"
              >
                <span
                  className={`transition-colors flex-1 ${isSelected ? "text-foreground font-medium" : "text-foreground/72 group-hover/item:text-foreground"}`}
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                >
                  {label}
                </span>
                <span className="text-foreground/30 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                  ({catCount})
                </span>
              </button>
            );
          })}
        </FilterSection>
      )}

      <FilterSection title="Preço" expanded={expandedSections.price} onToggle={() => toggleSection("price")}>
        <PriceRangeSlider
          min={priceMin} max={priceMax}
          minBound={priceBounds.min} maxBound={priceBounds.max}
          onMinChange={setPriceMin} onMaxChange={setPriceMax}
          onApply={applyFilters}
        />
      </FilterSection>

      {availableColorFilters.length > 0 && (
        <FilterSection title="Cor" expanded={expandedSections.color} onToggle={() => toggleSection("color")}>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {availableColorFilters.map(({ label, color, count }) => {
            const active = selectedColors.has(label);
            const isLight = label === "Branco" || label === "Amarelo";
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleColor(label)}
                className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 hover:scale-110 cursor-pointer ${active ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                style={{
                  backgroundColor: color,
                  borderColor: active ? "var(--primary)" : (isLight ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.16)"),
                  boxShadow: active ? "0 8px 20px rgba(255,43,46,0.26)" : "0 1px 2px rgba(0,0,0,0.08)",
                }}
                title={`${label} (${count})`}
                aria-label={`${label} (${count})`}
                aria-pressed={active}
              >
                {active && (
                  <Check
                    size={14}
                    className={isLight ? "text-black" : "text-white"}
                    strokeWidth={3}
                  />
                )}
              </button>
            );
            })}
          </div>
        </FilterSection>
      )}

      {/* Promoção */}
      <FilterSection title="Promoção" expanded={expandedSections.promo} onToggle={() => toggleSection("promo")}>
        <label className="flex items-center gap-3 py-2 cursor-pointer group/item">
          <input type="checkbox" className="hidden" checked={onlyDiscount} onChange={() => setOnlyDiscount(!onlyDiscount)} />
          <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${onlyDiscount ? "border-foreground bg-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`} style={{ borderRadius: "4px" }}>
            {onlyDiscount && <svg width="10" height="10" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          <span className="text-foreground/70 group-hover/item:text-foreground transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Em promoção</span>
        </label>
        {[10, 20, 30, 40].map((pct) => {
          const count = productsBeforeColorFilter.filter((pr) => getDiscount(getColorMatchedProduct(pr)) >= pct).length;
          const active = minDiscount === pct;
          return (
            <label key={pct} className="flex items-center gap-3 py-2 cursor-pointer group/item">
              <input type="checkbox" className="hidden" checked={active} onChange={() => setMinDiscount(active ? null : pct)} />
              <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-foreground bg-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`} style={{ borderRadius: "4px" }}>
                {active && <svg width="10" height="10" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              <span className="text-foreground/70 group-hover/item:text-foreground transition-colors flex-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>A partir de {pct}% OFF</span>
              <span className="text-foreground/30 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>({count})</span>
            </label>
          );
        })}
      </FilterSection>

      {/* Tags */}
      <FilterSection title="Tags" expanded={expandedSections.tags} onToggle={() => toggleSection("tags")}>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const active = selectedTags.has(tag);
            return (
              <button key={tag} onClick={() => toggleSet(setSelectedTags, tag)}
                className={`px-4 py-2 border transition-colors ${active ? "border-foreground/30 bg-foreground/5 text-foreground" : "border-foreground/10 text-foreground/50 hover:border-foreground/25"
                  }`}
                style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
              >{tag}</button>
            );
          })}
        </div>
      </FilterSection>

      {/* Avaliação */}
      <FilterSection title="Avaliação" expanded={expandedSections.rating} onToggle={() => toggleSection("rating")}>
        {[4.5, 4.0, 3.5].map((r) => {
          const active = minRating === r;
          return (
            <label key={r} className="flex items-center gap-3 py-2 cursor-pointer group/item">
              <input type="radio" name="rating" className="hidden" checked={active} onChange={() => setMinRating(active ? null : r)} />
              <span className={`w-4 h-4 border-2 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`}>
                {active && <span className="w-2 h-2 rounded-full bg-foreground" />}
              </span>
              <div className="flex items-center gap-1.5">
                <Star size={14} className="fill-foreground text-foreground" />
                <span className="text-foreground/70 group-hover/item:text-foreground transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>{r}+</span>
              </div>
            </label>
          );
        })}
      </FilterSection>

      {/* Em estoque */}
      <div>
        <label className="flex items-center gap-3 py-2 cursor-pointer group/item">
          <input type="checkbox" className="hidden" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} />
          <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${inStockOnly ? "border-foreground bg-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`} style={{ borderRadius: "4px" }}>
            {inStockOnly && <svg width="10" height="10" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          <span className="text-foreground/70 group-hover/item:text-foreground transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Em estoque</span>
        </label>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */

  return (
    <div ref={mainRef} className="pt-[112px] md:pt-[142px] min-h-screen">
      {/* ── Breadcrumb strip ── */}
      <div className="px-5 md:px-8 py-3" style={{ background: isDark ? "#161617" : "#f5f5f7" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
            <div className="flex items-center gap-2">
              <Link to="/" className="text-foreground/40 hover:text-foreground/80 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Home</Link>
              <span className="text-foreground/20" style={{ fontSize: "12px" }}>›</span>
              {activeCategoryLabel ? (
                <Link to={getCatalogHref({ category: activeCategoryLabel })} className="text-foreground/40 hover:text-foreground/80 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                  {activeCategoryLabel}
                </Link>
              ) : (
                <span className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                  Produtos
                </span>
              )}
              {initialSubcategory && (
                <>
                  <span className="text-foreground/20" style={{ fontSize: "12px" }}>›</span>
                  <span className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                    {initialSubcategory}
                  </span>
                </>
              )}
            </div>
        </div>
      </div>

      {/* ── Main Content — Insider layout ── */}
      <div className="px-5 md:px-8 py-6">
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <div className="flex gap-8 lg:gap-14">
            {/* ── Sidebar (Insider: narrow, left-aligned, auto-height) ── */}
            <aside className="hidden lg:block w-[240px] xl:w-[280px] flex-shrink-0">
              <div className="sticky top-[112px]">
                {filterSidebar}
              </div>
            </aside>

            {/* ── Products area ── */}
            <div className="flex-1 min-w-0">
              {/* Control bar */}
              <div className="flex flex-col gap-4 mb-6 pb-4 border-b border-foreground/5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <button onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-foreground/15 text-foreground/70 hover:text-foreground transition-colors"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                  >
                    <SlidersHorizontal size={14} /> Filtros
                    {activeFilterCount > 0 && (
                      <span className="ml-1 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center font-bold" style={{ fontSize: "11px" }}>{activeFilterCount}</span>
                    )}
                  </button>
                  {activeFilterPills}
                </div>

                <div className="flex flex-wrap items-center gap-4 xl:flex-nowrap">
                  {/* Sort */}
                  <div className="relative">
                    <button onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                      className="flex items-center gap-2 text-foreground/50 hover:text-foreground/80 transition-colors"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                    >
                      <ArrowUpDown size={14} />
                      {sortOptions.find((s) => s.value === sortBy)?.label}
                      <ChevronDown size={12} className={`transition-transform duration-200 ${sortDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {sortDropdownOpen && (
                        <motion.div initial={{ opacity: 0, y: -5, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.97 }} transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-3 border border-foreground/10 shadow-xl z-30 min-w-[200px] py-2"
                          style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1e1e20" : "#fff" }}
                        >
                          {sortOptions.map((opt) => (
                            <button key={opt.value} onClick={() => { setSortBy(opt.value); setSortDropdownOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 transition-colors ${sortBy === opt.value ? "text-foreground bg-foreground/[0.06]" : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.03]"
                                }`}
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                            >{opt.label}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div ref={itemsPerPageDropdownRef} className="relative flex items-center gap-2 text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: 600 }}>
                    <span>Mostrar:</span>
                    <button
                      type="button"
                      onClick={() => setItemsPerPageDropdownOpen((prev) => !prev)}
                      className={`relative inline-flex h-9 min-w-[62px] items-center justify-between gap-2 rounded-[10px] border px-3 transition-all cursor-pointer ${
                        itemsPerPageDropdownOpen
                          ? "border-primary/50 bg-foreground/[0.06] text-foreground shadow-[0_0_0_1px_rgba(255,59,48,0.16)]"
                          : "border-foreground/10 bg-foreground/[0.03] text-foreground hover:border-foreground/20"
                      }`}
                      aria-haspopup="listbox"
                      aria-expanded={itemsPerPageDropdownOpen}
                      aria-label="Quantidade de produtos por página"
                    >
                      <span>{itemsPerPage}</span>
                      <ChevronDown size={13} className={`text-foreground/45 transition-transform duration-200 ${itemsPerPageDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {itemsPerPageDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full z-30 mt-3 min-w-[120px] overflow-hidden border border-white/8 shadow-2xl"
                          style={{ borderRadius: "14px", background: "#151517" }}
                        >
                          <div className="border-b border-white/6 px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-white/35">
                            Itens por p&aacute;gina
                          </div>
                          <div className="p-2">
                            {PAGE_SIZE_OPTIONS.map((option) => {
                              const active = option === itemsPerPage;
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => {
                                    setItemsPerPage(option);
                                    setItemsPerPageDropdownOpen(false);
                                  }}
                                  className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left transition-colors cursor-pointer ${
                                    active
                                      ? "bg-primary text-white"
                                      : "text-white/72 hover:bg-white/[0.06] hover:text-white"
                                  }`}
                                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: 600 }}
                                  role="option"
                                  aria-selected={active}
                                >
                                  <span>{option}</span>
                                  {active && <Check size={14} />}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Grid / List */}
                  <div className="hidden sm:flex border border-foreground/10 overflow-hidden" style={{ borderRadius: "var(--radius-button)" }}>
                    <button onClick={() => setGridMode("grid")}
                      className={`p-2 transition-colors ${gridMode === "grid" ? "bg-foreground/[0.08] text-foreground" : "text-foreground/40 hover:text-foreground/60"}`}
                      aria-label="Visualização em grade"
                    ><Grid3X3 size={16} /></button>
                    <button onClick={() => setGridMode("list")}
                      className={`p-2 transition-colors ${gridMode === "list" ? "bg-foreground/[0.08] text-foreground" : "text-foreground/40 hover:text-foreground/60"}`}
                      aria-label="Visualização em lista"
                    ><LayoutList size={16} /></button>
                  </div>
                </div>
              </div>

              {/* ── Products Area ── */}
              {filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground/[0.05] flex items-center justify-center">
                    <ShoppingBag size={24} className="text-foreground/30" />
                  </div>
                  <p className="text-foreground mb-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "24px", fontWeight: "var(--font-weight-medium)" }}>Nenhum produto encontrado</p>
                  <p className="text-foreground/50 mb-8" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px" }}>Tente ajustar os filtros ou mudar os termos de busca.</p>
                  <button onClick={clearAll}
                    className="px-6 py-3 border border-foreground/15 text-foreground/70 hover:text-foreground hover:border-foreground/30 transition-all font-medium"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                  >Limpar filtros</button>
                </motion.div>
              ) : (
                <div className={`relative transition-opacity duration-300 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                  {isLoading && (
                    <div className="absolute inset-0 z-20 flex items-start justify-center pt-32">
                      <div className="w-10 h-10 border-4 border-foreground/10 border-t-foreground rounded-full animate-spin shadow-lg" />
                    </div>
                  )}
                  {gridMode === "grid" ? (
                    <div className={`grid gap-x-4 sm:gap-x-6 gap-y-14 grid-cols-2 xl:grid-cols-${colsCount}`}>
                      <AnimatePresence mode="popLayout">
                    {paginatedProducts.map((product, i) => {
                      const displayProduct = getColorMatchedProduct(product);
                      const discount = getDiscount(displayProduct);
                      const productImages = getProductImages(displayProduct);
                      const imageKey = `${product.id}:${displayProduct.id}`;
                      const imgIdx = getImageIndex(imageKey, productImages.length);
                      const swatches = getProductSwatchesCached(product);
                      const switchBadgeInfo = getSwitchBadgeInfo(displayProduct);

                      return (
                        <motion.div key={product.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.3, delay: Math.min(i * 0.025, 0.35) }}
                          className="group relative"
                        >
                          <div className={`relative overflow-hidden mb-4 aspect-square transition-all ${displayProduct.inStock === false ? 'opacity-60 grayscale-[0.5]' : ''}`} style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1a1a1c" : "#f0f0f0" }}>
                            <Link to={`/produto/${displayProduct.id}`} className="block h-full">
                              <div className="flex h-full w-full items-center justify-center p-4 sm:p-5 lg:p-6">
                                <ImageWithFallback
                                  src={productImages[imgIdx]}
                                  alt={displayProduct.name}
                                  loading="lazy"
                                  decoding="async"
                                  className="h-full w-full object-contain scale-[0.92] group-hover:scale-[0.96] transition-transform duration-[1s] ease-out"
                                />
                              </div>
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.06] transition-colors duration-500" />
                            </Link>

                            {/* Badges — top-left corner */}
                            <div className="absolute top-3 left-3 flex items-start gap-2 z-10">
                              {switchBadgeInfo ? (
                                <span className="flex h-12 w-12 items-center justify-center overflow-hidden border border-white/10 bg-black/35 shadow-sm backdrop-blur-sm rounded-full" title={switchBadgeInfo.label}>
                                  <img src={switchBadgeInfo.src} alt={switchBadgeInfo.label} className="h-full w-full object-contain p-0.5" />
                                </span>
                              ) : displayProduct.badge && (
                                <span className={`px-2.5 py-1 shadow-sm ${displayProduct.badge.toUpperCase().includes('BLUE') ? 'bg-blue-600 text-white' : displayProduct.badge.toUpperCase().includes('RED') ? 'bg-red-600 text-white' : displayProduct.badge.toUpperCase().includes('BROWN') ? 'bg-amber-700 text-white' : 'bg-primary text-primary-foreground'}`}
                                  style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "600", letterSpacing: "0.03em" }}>
                                  {displayProduct.badge}
                                </span>
                              )}
                              {discount > 0 && (
                                <span className="px-2.5 py-1 bg-emerald-500 text-white shadow-sm" style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.03em" }}>
                                  {discount}% OFF
                                </span>
                              )}
                              {displayProduct.inStock === false && (
                                <span className="px-2.5 py-1 bg-foreground/80 text-background shadow-sm" style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "600" }}>
                                  Esgotado
                                </span>
                              )}
                            </div>

                            {/* Favorite + Quick View — top-right */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(displayProduct.id); }}
                                className="w-9 h-9 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50 hover:scale-105 cursor-pointer"
                                aria-label={isFavorite(displayProduct.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                              >
                                <Heart size={16} className={isFavorite(displayProduct.id) ? "fill-red-500 text-red-500" : "text-white"} strokeWidth={2} />
                              </button>
                              <button onClick={(e) => { e.preventDefault(); setQuickViewProduct(displayProduct); }}
                                className="w-9 h-9 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 hover:bg-black/50 hover:scale-105 hidden lg:flex cursor-pointer"
                                aria-label="Visualização Rápida"
                              >
                                <Eye size={16} className="text-white" />
                              </button>
                            </div>

                            {/* Carousel arrows (multi-image) */}
                            {productImages.length > 1 && (
                              <>
                                {imgIdx > 0 && (
                                  <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImageIdx(imageKey, imgIdx - 1, productImages.length); }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-white hover:bg-black/50 z-10"
                                    aria-label="Imagem anterior"
                                  >
                                    <ChevronLeft size={18} />
                                  </button>
                                )}
                                {imgIdx < productImages.length - 1 && (
                                  <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImageIdx(imageKey, imgIdx + 1, productImages.length); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 text-white hover:bg-black/50 z-10"
                                    aria-label="Próxima imagem"
                                  >
                                    <ChevronRight size={18} />
                                  </button>
                                )}
                                {/* Dots */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                  {productImages.map((_, idx) => (
                                    <button key={idx}
                                      onClick={(e) => { e.preventDefault(); setImageIdx(imageKey, idx, productImages.length); }}
                                      aria-label={`Ir para imagem ${idx + 1}`}
                                      className={`h-1.5 rounded-full transition-all ${idx === imgIdx ? "bg-white w-5" : "bg-white/50 w-1.5 hover:bg-white/80"}`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}

                            {/* Quick add — Insider "Compra Rápida" style */}
                            <div className="absolute bottom-0 left-0 right-0 z-10">
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(displayProduct); }}
                                className="w-full py-3.5 bg-foreground/95 backdrop-blur-md text-background flex items-center justify-center gap-2 lg:opacity-0 lg:translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                                style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase" }}
                              >
                                <ShoppingBag size={14} /> Adicionar ao Carrinho
                              </button>
                            </div>
                          </div>

                          {/* Product info — Insider order: Swatches → Name → Rating → Price */}
                          <div className="px-1">
                            {/* Color swatches */}
                            {swatches.length > 1 && (
                              <div className="flex items-center gap-1.5 mb-3">
                                {swatches.map((sw) => (
                                  <button
                                    key={sw.productId}
                                    className={`w-4 h-4 rounded-full border border-foreground/15 transition-transform hover:scale-125 cursor-pointer ${
                                      sw.productId === displayProduct.id ? "ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : ""
                                    }`}
                                    style={{ backgroundColor: sw.color }}
                                    title={sw.label}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const variant = getProductVariantByColor(product, sw.label) ?? productById.get(sw.productId) ?? null;
                                      if (variant) setSelectedVariantIds((prev) => ({ ...prev, [product.id]: variant.id }));
                                    }}
                                  />
                                ))}
                              </div>
                            )}

                            {/* Name */}
                            <Link to={`/produto/${displayProduct.id}`}>
                              <p className="text-foreground group-hover:text-foreground/70 transition-colors mb-2 truncate leading-snug"
                                style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px", fontWeight: "var(--font-weight-medium)", lineHeight: 1.4 }}>
                                {displayProduct.name}
                              </p>
                            </Link>

                            {/* Rating + Price inline */}
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex items-center gap-1.5">
                                <Star size={12} className="fill-foreground text-foreground" />
                                <span className="text-foreground/60 font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                                  {displayProduct.rating}
                                </span>
                                <span className="text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                                  ({displayProduct.reviews})
                                </span>
                              </div>
                              <div className="text-right">
                                {displayProduct.oldPrice && (
                                  <p className="text-foreground/40 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                                    {displayProduct.oldPrice}
                                  </p>
                                )}
                                <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", fontWeight: "700" }}>
                                  {displayProduct.price}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                /* ── LIST VIEW ── */
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {paginatedProducts.map((product, i) => {
                      const displayProduct = getColorMatchedProduct(product);
                      const discount = getDiscount(displayProduct);
                      return (
                        <motion.div key={product.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25, delay: i * 0.02 }}
                          className="group flex flex-col sm:flex-row sm:items-center gap-5 border border-foreground/10 hover:border-foreground/20 p-4 transition-all duration-300"
                          style={{ borderRadius: "var(--radius-card)" }}
                        >
                          <Link to={`/produto/${displayProduct.id}`} className={`w-full sm:w-[140px] aspect-square sm:h-[140px] flex-shrink-0 overflow-hidden relative block transition-all ${displayProduct.inStock === false ? 'opacity-60 grayscale-[0.5]' : ''}`} style={{ borderRadius: "var(--radius-button)", background: isDark ? "#1a1a1c" : "#f0f0f0" }}>
                            <div className="flex h-full w-full items-center justify-center p-3">
                              <ImageWithFallback src={getPrimaryProductImage(displayProduct)} alt={displayProduct.name} loading="lazy" decoding="async" className="h-full w-full object-contain scale-[0.92] group-hover:scale-[0.97] transition-transform duration-700" />
                            </div>
                            {discount > 0 && (
                              <span className="absolute top-2 left-2 px-2 py-1 bg-emerald-500 text-white" style={{ borderRadius: "4px", fontSize: "11px", fontWeight: "700" }}>{discount}% OFF</span>
                            )}
                          </Link>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-foreground/40 uppercase font-semibold" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.05em" }}>{displayProduct.category}</span>
                              {displayProduct.brand && <span className="text-foreground/30 font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>· {displayProduct.brand}</span>}
                            </div>
                            <Link to={`/produto/${displayProduct.id}`}>
                              <p className="text-foreground group-hover:text-foreground/70 transition-colors mb-2 text-lg" style={{ fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-medium)", lineHeight: 1.3 }}>
                                {displayProduct.name}
                              </p>
                            </Link>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                              <p className="text-foreground text-xl" style={{ fontFamily: "var(--font-family-inter)", fontWeight: "700" }}>{displayProduct.price}</p>
                              {displayProduct.oldPrice && <p className="text-foreground/40 line-through text-sm" style={{ fontFamily: "var(--font-family-inter)" }}>{displayProduct.oldPrice}</p>}
                            </div>
                          </div>
                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 flex-shrink-0 mt-4 sm:mt-0">
                            <button onClick={() => toggleFavorite(displayProduct.id)}
                              className="w-10 h-10 border border-foreground/15 rounded-full flex items-center justify-center text-foreground/40 hover:text-foreground hover:border-foreground/30 transition-all bg-foreground/[0.02] cursor-pointer"
                              aria-label={isFavorite(displayProduct.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                            ><Heart size={16} className={isFavorite(displayProduct.id) ? "fill-red-500 text-red-500" : ""} strokeWidth={2} /></button>
                            <button onClick={() => handleAddToCart(displayProduct)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background hover:opacity-90 transition-all font-semibold cursor-pointer"
                              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", letterSpacing: "0.04em", textTransform: "uppercase" }}
                            ><ShoppingBag size={14} /> Adicionar</button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
                </div>
              )}

              {/* ── Pagination ── */}
              {pageCount > 1 && (
                <>
                  {/* Desktop Pagination */}
                  <div className="hidden md:flex items-center justify-center gap-1.5 mt-14 mb-2">
                    <button
                      onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={currentPage === 1}
                      className="w-9 h-9 flex items-center justify-center border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                      style={{ borderRadius: "var(--radius-button)" }}
                      aria-label="Página anterior"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => {
                      const isCurrent = page === currentPage;
                      const isNearCurrent = Math.abs(page - currentPage) <= 1;
                      const isEdge = page === 1 || page === pageCount;
                      if (!isNearCurrent && !isEdge) {
                        if (page === 2 || page === pageCount - 1) {
                          return <span key={page} className="text-foreground/25 px-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>…</span>;
                        }
                        return null;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => { setCurrentPage(page); mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className={`w-9 h-9 flex items-center justify-center border transition-all ${isCurrent ? "border-foreground bg-foreground text-background font-bold" : "border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30"}`}
                          style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                          aria-label={`Página ${page}`}
                          aria-current={isCurrent ? "page" : undefined}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => { setCurrentPage((p) => Math.min(pageCount, p + 1)); mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={currentPage === pageCount}
                      className="w-9 h-9 flex items-center justify-center border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                      style={{ borderRadius: "var(--radius-button)" }}
                      aria-label="Próxima página"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  
                  {/* Mobile Pagination */}
                  <div className="flex md:hidden items-center justify-between mt-12 mb-4 w-full gap-4">
                    <button
                      onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={currentPage === 1}
                      className="flex-1 py-3.5 border border-foreground/20 text-foreground/70 disabled:opacity-30 rounded-full font-medium transition-opacity"
                    >
                      Anterior
                    </button>
                    <span className="text-sm font-medium text-foreground/60">{currentPage} / {pageCount}</span>
                    <button
                      onClick={() => { setCurrentPage((p) => Math.min(pageCount, p + 1)); mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={currentPage === pageCount}
                      className="flex-1 py-3.5 border border-foreground/20 text-foreground/70 disabled:opacity-30 rounded-full font-medium transition-opacity"
                    >
                      Próxima
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[320px] max-w-[85vw] z-50 overflow-y-auto p-6"
              style={{ background: isDark ? "#161617" : "#fff", borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-foreground/70 tracking-[0.15em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-bold)" }}>FILTROS</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-foreground/40 hover:text-foreground transition-colors p-2" aria-label="Fechar filtros"><X size={20} /></button>
              </div>
              {filterSidebar}
              <div className="sticky bottom-0 pt-4 mt-8 bg-inherit">
                <button onClick={() => { applyFilters(); setMobileFiltersOpen(false); }}
                  className="w-full py-3.5 bg-foreground text-background font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 shadow-lg"
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", letterSpacing: "0.04em", textTransform: "uppercase" }}
                >
                  <Check size={16} /> Mostrar {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Quick View Modal ── */}
      <AnimatePresence>
        {quickViewProduct && (() => {
          const quickViewImages = getProductImages(quickViewProduct);
          const quickViewImageIndex = getImageIndex(quickViewProduct.id, quickViewImages.length);
          const quickViewDiscount = getDiscount(quickViewProduct);
          const quickViewBullets = getProductAboutBullets(quickViewProduct).slice(0, 6);

          return (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setQuickViewProduct(null)}
            />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[800px] md:max-h-[85vh] z-50 overflow-y-auto p-8 shadow-2xl"
              style={{ background: isDark ? "#161617" : "#fff", borderRadius: "var(--radius-card)" }}
            >
              <button onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-foreground/5 rounded-full text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-colors z-10 cursor-pointer"
                aria-label="Fechar"
              ><X size={20} /></button>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-square overflow-hidden" style={{ borderRadius: "var(--radius-card)", background: isDark ? "#161617" : "#fff" }}>
                  <ImageWithFallback src={quickViewImages[quickViewImageIndex]} alt={quickViewProduct.name} loading="lazy" decoding="async" className="h-full w-full object-contain p-6" />
                  {quickViewDiscount > 0 && (
                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-500 text-white shadow-sm" style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "700", letterSpacing: "0.03em" }}>
                      {quickViewDiscount}% OFF
                    </span>
                  )}
                  {quickViewImages.length > 1 && (
                    <>
                      {quickViewImageIndex > 0 && (
                        <button
                          onClick={(e) => { e.preventDefault(); setImageIdx(quickViewProduct.id, quickViewImageIndex - 1, quickViewImages.length); }}
                          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/55 cursor-pointer"
                          aria-label="Imagem anterior"
                        >
                          <ChevronLeft size={20} />
                        </button>
                      )}
                      {quickViewImageIndex < quickViewImages.length - 1 && (
                        <button
                          onClick={(e) => { e.preventDefault(); setImageIdx(quickViewProduct.id, quickViewImageIndex + 1, quickViewImages.length); }}
                          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/55 cursor-pointer"
                          aria-label="Próxima imagem"
                        >
                          <ChevronRight size={20} />
                        </button>
                      )}
                    </>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-foreground/40 uppercase mb-3 font-semibold tracking-wider" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{quickViewProduct.category}</p>
                  <h3 className="text-foreground mb-3 text-2xl md:text-3xl" style={{ fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-medium)", lineHeight: 1.2 }}>{quickViewProduct.name}</h3>
                  <div className="flex items-center gap-2 mb-5">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-foreground/70 font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>{quickViewProduct.rating}</span>
                    <span className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>({quickViewProduct.reviews} avaliações)</span>
                  </div>
                  <div className="flex flex-col gap-1 mb-6">
                    {quickViewProduct.oldPrice && (
                      <p className="text-foreground/40 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px" }}>{quickViewProduct.oldPrice}</p>
                    )}
                    <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "28px", fontWeight: "700" }}>{quickViewProduct.price}</p>
                  </div>
                  {quickViewBullets.length > 0 && (
                    <div className="mb-8">
                      <h4
                        className="text-foreground/55 font-semibold tracking-wide mb-4 flex items-center gap-2"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.1em" }}
                      >
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        SOBRE O PRODUTO
                      </h4>
                      <ul className="space-y-3">
                        {quickViewBullets.map((bullet, index) => (
                          <motion.li
                            key={`${quickViewProduct.id}-${index}-${bullet.slice(0, 20)}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.18, delay: Math.min(index, 5) * 0.025 }}
                            className="flex items-start gap-3"
                          >
                            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                              <Check size={9} className="text-primary" strokeWidth={2.5} />
                            </span>
                            <span
                              className="text-foreground/65 leading-relaxed"
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", lineHeight: "1.65" }}
                            >
                              {bullet}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex gap-4 mt-auto">
                    <button onClick={() => { handleAddToCart(quickViewProduct); setQuickViewProduct(null); }}
                      className="flex-1 py-3.5 bg-foreground text-background flex items-center justify-center gap-2 font-bold transition-opacity hover:opacity-90 shadow-md cursor-pointer"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", letterSpacing: "0.04em", textTransform: "uppercase" }}
                    >
                      <ShoppingBag size={16} /> Adicionar
                    </button>
                    <Link to={`/produto/${quickViewProduct.id}`}
                      className="py-3.5 px-6 border border-foreground/15 text-foreground/70 hover:text-foreground hover:border-foreground/30 transition-colors flex items-center justify-center font-semibold cursor-pointer"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                    >
                      Detalhes <ArrowUpRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
          );
        })()}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */

function FilterSection({ title, expanded = true, onToggle, children }: { title: string; expanded?: boolean; onToggle?: () => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(expanded);
  useEffect(() => {
    setOpen(expanded);
  }, [expanded]);
  const toggle = onToggle ?? (() => setOpen(!open));
  return (
    <div className="border-b border-foreground/5 py-4 last:border-0">
      <button onClick={toggle} className="flex items-center justify-between w-full mb-1 group outline-none" aria-expanded={open}>
        <span className="text-foreground/80 tracking-[0.08em] font-bold" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{title.toUpperCase()}</span>
        <ChevronDown size={14} className={`text-foreground/40 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="pt-3 pb-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button onClick={onRemove}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground/[0.06] text-foreground/80 border border-foreground/10 hover:border-foreground/25 hover:bg-foreground/[0.08] transition-colors font-medium"
      style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
      aria-label={`Remover filtro ${label}`}
    >
      {label} <X size={12} className="opacity-60" />
    </button>
  );
}
