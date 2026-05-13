# Homepage V3 Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reformular a homepage da V3 (PCYES) seguindo o spec aprovado em [2026-05-13-homepage-v3-redesign.md](../specs/2026-05-13-homepage-v3-redesign.md): estrutura em 2 mundos (Gaming + Dia a Dia), 12 blocos no padrão Logitechstore adaptado, identidade preto+vermelho intencional, cards com radial-gradient Corsair-style.

**Architecture:** Adicionar tokens globais no `theme.css` existente, criar 7 componentes novos em `src/app/components/`, refatorar 2 componentes (HeroSection → HeroSlider, ProductCard), re-skinnar 3 (CategoryRail, BrandsStrip, Footer), aposentar 5 (FlashDealsStrip, BannerDuo, CategorySpotlight, TrustStrip, Newsletter). Montagem final no HomePage.tsx.

**Tech Stack:** Vite 6 + React 18 + TypeScript + Tailwind v4 + Radix + motion (framer) + react-router 7 + lucide-react. Trabalho exclusivamente em `versoes/v3/`. Sem nova dependência exceto se especificado.

**Verification gate (cada tarefa):**
1. `npm run build` em `versoes/v3/` — passa sem erro
2. `npm run dev` + abrir browser → verificar componente isolado (página/playground) ou homepage inteira na fase final
3. Commit atômico com mensagem convencional (`feat(pcyes-v3):`, `refactor(pcyes-v3):`, `chore(pcyes-v3):`)

**Convenções de path:** Todas as paths relativas a `/home/gabrielbarbosa/dev/hub-ux-oderco/empresas/pcyes/projetos/pcyes-v2/versoes/v3/` (raiz do v3). Quando o plano disser `src/app/components/X.tsx`, leia como `versoes/v3/src/app/components/X.tsx`.

---

## File Structure

### Componentes NOVOS

| Arquivo | Responsabilidade |
|---|---|
| `src/app/components/ProductCardV2.tsx` | Card de produto com 2 variantes (light, dark com radial Corsair-style) |
| `src/app/components/WorldDivider.tsx` | Banda divisor full-bleed (Gaming/Dia a Dia) |
| `src/app/components/FeatureGridShelf.tsx` | Hero-card + grid 4×2 — peça-chave |
| `src/app/components/CollectionCard.tsx` | Card narrativo (lifestyle + headline + CTA) |
| `src/app/components/CollectionGrid.tsx` | Wrapper grid 3 colunas de CollectionCard |
| `src/app/components/QuizBanner.tsx` | Banda Monte Seu PC inline |
| `src/app/components/InterestCard.tsx` | Card persona/uso (foto + overlay + CTA) |
| `src/app/components/InterestCardGrid.tsx` | Wrapper grid 3 colunas de InterestCard |
| `src/app/components/NewsletterInline.tsx` | Faixa newsletter 100px |
| `src/app/components/HeroSlider.tsx` | Slider 3 themes — substitui HeroSection |

### Modificados

| Arquivo | Mudança |
|---|---|
| `src/styles/theme.css` | Adicionar tokens novos da paleta + tipografia + radial-gradient + spacing |
| `src/styles/tailwind.css` | Expor tokens como classes utility (`bg-card-dark`, `text-ink-tertiary`, etc.) |
| `src/app/components/HomePage.tsx` | Reescrever com nova sequência de 12 blocos |
| `src/app/components/CategoryRail.tsx` | Re-skin tokens + hover vermelho |
| `src/app/components/BrandsStrip.tsx` | Re-skin grayscale + eyebrow |
| `src/app/components/Footer.tsx` | Absorver TrustStrip no topo |
| `src/app/components/RootLayout.tsx` | Não muda (renderiza Outlet) |

### Aposentados (deletados após HomePage não referenciar)

- `src/app/components/FlashDealsStrip.tsx`
- `src/app/components/BannerDuo.tsx`
- `src/app/components/CategorySpotlight.tsx`
- `src/app/components/TrustStrip.tsx` (conteúdo absorvido pelo Footer)
- `src/app/components/Newsletter.tsx` (substituído por NewsletterInline)
- `src/app/components/HeroSection.tsx` (substituído por HeroSlider)
- `src/app/components/ProductShelf.tsx` (substituído por FeatureGridShelf)

---

## Phases

- **Phase 0** — Setup: tokens + script typecheck (1 tarefa)
- **Phase 1** — Foundation components: ProductCardV2 + WorldDivider (2 tarefas)
- **Phase 2** — FeatureGridShelf (peça-chave) (1 tarefa)
- **Phase 3** — Banner blocks: CollectionCard/Grid, InterestCard/Grid, QuizBanner (3 tarefas)
- **Phase 4** — HeroSlider refactor (1 tarefa)
- **Phase 5** — Newsletter + Footer absorb + re-skins (3 tarefas)
- **Phase 6** — HomePage assembly + cleanup (2 tarefas)

Total: 13 tarefas.

---

# Phase 0 — Setup

## Task 0.1: Adicionar tokens globais ao theme.css + script typecheck

**Files:**
- Modify: `src/styles/theme.css`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Adicionar typecheck script ao package.json**

Editar `package.json`, secção `"scripts"`, adicionar linha `typecheck`:

```json
"scripts": {
  "build": "vite build",
  "dev": "vite",
  "typecheck": "tsc --noEmit -p tsconfig.json || echo 'no tsconfig — skipping'"
}
```

Como o projeto não tem `tsconfig.json`, o comando vai retornar `no tsconfig — skipping`, mas registra a intenção. Build do Vite já valida JSX/TS suficiente.

- [ ] **Step 2: Adicionar novos tokens ao `:root` em `theme.css`**

Abrir `src/styles/theme.css`. **Antes da última `}` do bloco `:root`**, adicionar:

```css
  /* === PCYES Homepage V3 Redesign tokens === */
  --bg-page: #FFFFFF;
  --bg-page-soft: #F7F7F8;
  --bg-world-gaming: #0A0A0B;
  --bg-card-dark: #2C2D33;
  --bg-card-dark-edge: #0F1013;
  --ink-primary: #0A0A0B;
  --ink-secondary: #5C5F66;
  --ink-tertiary: #9AA0A6;
  --ink-on-dark: #FFFFFF;
  --ink-on-dark-soft: rgba(255, 255, 255, 0.6);
  --accent-red: #E10600;
  --accent-red-hover: #B80500;
  --success: #16A34A;
  --border-subtle: rgba(0, 0, 0, 0.06);
  --shadow-card-hover: 0 12px 40px rgba(0, 0, 0, 0.08);
  --container-max: 1440px;
  --space-section: 96px;
  --space-section-md: 64px;
  --space-section-sm: 48px;
  /* radial gradient para card escuro Corsair-style */
  --gradient-card-dark: radial-gradient(ellipse 80% 70% at 50% 45%, #2C2D33 0%, #1A1B1F 60%, #0F1013 100%);
  --gradient-card-dark-mobile: radial-gradient(ellipse 100% 80% at 50% 45%, #2C2D33 0%, #1A1B1F 60%, #0F1013 100%);
```

- [ ] **Step 3: Rodar `npm run build` para garantir CSS válido**

Comando:

```bash
cd versoes/v3 && npm run build
```

Esperado: build conclui sem erro.

- [ ] **Step 4: Commit**

```bash
git add empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/styles/theme.css \
        empresas/pcyes/projetos/pcyes-v2/versoes/v3/package.json
git commit -m "feat(pcyes-v3): tokens globais para redesign da homepage"
```

---

# Phase 1 — Foundation components

## Task 1.1: ProductCardV2 (variantes light/dark + radial Corsair)

**Files:**
- Create: `src/app/components/ProductCardV2.tsx`

- [ ] **Step 1: Criar `ProductCardV2.tsx` com types e estrutura base**

Conteúdo do arquivo:

```tsx
import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Heart, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export type ProductCardVariant = "light" | "dark";

export interface ProductCardV2Props {
  id: number | string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  installments?: { count: number; value: number };
  discountPercent?: number;
  href?: string;
  variant?: ProductCardVariant;
  onWishlist?: (id: number | string) => void;
  onAdd?: (id: number | string) => void;
}

function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function ProductCardV2({
  id,
  name,
  image,
  price,
  oldPrice,
  installments,
  discountPercent,
  href = "#",
  variant = "light",
  onWishlist,
  onAdd,
}: ProductCardV2Props) {
  const [hovered, setHovered] = useState(false);
  const isDark = variant === "dark";

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex flex-col overflow-hidden transition-all duration-300 ${
        isDark
          ? "text-white"
          : "text-[var(--ink-primary)] border border-[var(--border-subtle)] bg-[var(--bg-page-soft)]"
      }`}
      style={{
        borderRadius: "var(--radius-card)",
        ...(isDark
          ? { background: "var(--gradient-card-dark)" }
          : {}),
        ...(hovered && !isDark
          ? { boxShadow: "var(--shadow-card-hover)" }
          : {}),
      }}
    >
      {/* Sale tag */}
      {typeof discountPercent === "number" && discountPercent > 0 && (
        <span
          className="absolute top-3 left-3 z-10 inline-flex items-center justify-center px-2.5 h-6 text-[11px] font-medium text-white rounded-full"
          style={{ backgroundColor: "var(--accent-red)" }}
        >
          -{discountPercent}%
        </span>
      )}

      {/* Wishlist */}
      <button
        type="button"
        aria-label="Favoritar"
        onClick={(e) => {
          e.preventDefault();
          onWishlist?.(id);
        }}
        className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-colors"
      >
        <Heart
          size={18}
          strokeWidth={1.6}
          className={isDark ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"}
        />
      </button>

      {/* Imagem do produto */}
      <Link to={href} className="relative aspect-square flex items-center justify-center p-[14%] md:p-[20%]">
        <motion.div
          animate={{ y: hovered ? -6 : 0, scale: hovered ? 1.03 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full h-full flex items-center justify-center"
        >
          <ImageWithFallback src={image} alt={name} className="max-w-full max-h-full object-contain" />
        </motion.div>

        {/* CTA Add (+) */}
        {hovered && (
          <motion.button
            type="button"
            aria-label="Adicionar ao carrinho"
            onClick={(e) => {
              e.preventDefault();
              onAdd?.(id);
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center rounded-full"
            style={{
              backgroundColor: isDark ? "#FFFFFF" : "#0A0A0B",
              color: isDark ? "#0A0A0B" : "#FFFFFF",
            }}
          >
            <Plus size={18} strokeWidth={2} />
          </motion.button>
        )}
      </Link>

      {/* Footer info */}
      <div className="px-4 pb-4 pt-2 flex flex-col gap-1">
        <h3
          className="text-[14px] leading-tight font-normal line-clamp-2 min-h-[2.4em]"
          style={{ fontFamily: "var(--font-family-inter)" }}
        >
          {name}
        </h3>
        <div className="flex items-baseline gap-2">
          {oldPrice && oldPrice > price && (
            <span className={`text-[12px] line-through ${isDark ? "text-white/40" : "text-[var(--ink-tertiary)]"}`}>
              {formatPrice(oldPrice)}
            </span>
          )}
          <span className="text-[15px] font-medium" style={{ fontFamily: "var(--font-family-inter)" }}>
            {formatPrice(price)}
          </span>
        </div>
        {installments && (
          <span className={`text-[11px] ${isDark ? "text-white/50" : "text-[var(--ink-secondary)]"}`}>
            {installments.count}x de {formatPrice(installments.value)}
          </span>
        )}
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Criar página de playground temporária para verificação visual**

Criar `src/app/components/pages/__playground.tsx`:

```tsx
import { ProductCardV2 } from "../ProductCardV2";

export function Playground() {
  const demo = {
    id: 1,
    name: "Mouse Gamer Sem Fio PCYES PRO X",
    image: "/home/category-peripherals.png",
    price: 899.91,
    oldPrice: 1099.00,
    installments: { count: 5, value: 179.98 },
    discountPercent: 18,
    href: "/produtos",
  };
  return (
    <div className="min-h-screen p-12 bg-white">
      <h1 className="mb-8 text-2xl">ProductCardV2 — Playground</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <ProductCardV2 {...demo} variant="light" />
        <ProductCardV2 {...demo} variant="light" discountPercent={undefined} oldPrice={undefined} />
        <ProductCardV2 {...demo} variant="dark" />
        <ProductCardV2 {...demo} variant="dark" discountPercent={undefined} oldPrice={undefined} />
      </div>
    </div>
  );
}
```

Registrar rota em `src/app/routes.tsx`, adicionar dentro do array `children`:

```tsx
{ path: "__playground", Component: Playground },
```

E adicionar import no topo:

```tsx
import { Playground } from "./components/pages/__playground";
```

- [ ] **Step 3: Build gate**

```bash
cd versoes/v3 && npm run build
```

Esperado: build conclui sem erro.

- [ ] **Step 4: Visual verify**

```bash
cd versoes/v3 && npm run dev
```

Abrir `http://localhost:5173/__playground`. Verificar:
- 4 cards renderizam (2 light, 2 dark)
- Card dark tem fundo com radial-gradient (clarão central, escurecimento bordas)
- Tag vermelha `-18%` aparece nos cards com discount
- Coração no canto superior-direito
- Hover sobre card: produto sobe levemente + scale, botão `+` aparece bottom-right
- Mobile: redimensionar janela <768px — padding da imagem reduz, mantém leitura

- [ ] **Step 5: Commit**

```bash
git add empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/ProductCardV2.tsx \
        empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/pages/__playground.tsx \
        empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/routes.tsx
git commit -m "feat(pcyes-v3): ProductCardV2 com variantes light/dark e radial"
```

---

## Task 1.2: WorldDivider

**Files:**
- Create: `src/app/components/WorldDivider.tsx`

- [ ] **Step 1: Criar `WorldDivider.tsx`**

```tsx
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

export type WorldDividerTone = "dark" | "light";

export interface WorldDividerProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; href: string };
  tone?: WorldDividerTone;
}

export function WorldDivider({
  eyebrow = "MUNDO",
  title,
  subtitle,
  cta,
  tone = "dark",
}: WorldDividerProps) {
  const isDark = tone === "dark";
  return (
    <section
      className="relative w-full"
      style={{
        backgroundColor: isDark ? "var(--bg-world-gaming)" : "var(--bg-page-soft)",
        color: isDark ? "var(--ink-on-dark)" : "var(--ink-primary)",
      }}
    >
      <div
        className="mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col items-center text-center"
        style={{ maxWidth: "var(--container-max)" }}
      >
        {/* Linha vermelha decorativa */}
        <div
          aria-hidden="true"
          className="mb-6"
          style={{
            width: "64px",
            height: "2px",
            backgroundColor: "var(--accent-red)",
          }}
        />

        {/* Eyebrow */}
        {eyebrow && (
          <span
            className="mb-4 uppercase"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.12em",
              color: isDark ? "var(--ink-on-dark-soft)" : "var(--ink-tertiary)",
              fontFamily: "var(--font-family-inter)",
            }}
          >
            {eyebrow}
          </span>
        )}

        {/* Título */}
        <h2
          className="mb-4"
          style={{
            fontSize: "clamp(48px, 6vw, 96px)",
            fontWeight: 300,
            lineHeight: 1.05,
            fontFamily: "var(--font-family-figtree)",
          }}
        >
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="max-w-xl"
            style={{
              fontSize: "15px",
              lineHeight: 1.6,
              color: isDark ? "var(--ink-on-dark-soft)" : "var(--ink-secondary)",
              fontFamily: "var(--font-family-inter)",
            }}
          >
            {subtitle}
          </p>
        )}

        {/* CTA */}
        {cta && (
          <Link
            to={cta.href}
            className="mt-8 inline-flex items-center gap-1 group"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              fontFamily: "var(--font-family-inter)",
              color: isDark ? "var(--ink-on-dark)" : "var(--ink-primary)",
            }}
          >
            <span className="underline-offset-4 group-hover:underline group-hover:decoration-[var(--accent-red)]">
              {cta.label}
            </span>
            <ChevronRight size={16} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Adicionar 2 divisores ao playground**

Em `__playground.tsx`, depois dos cards adicionar:

```tsx
import { WorldDivider } from "../WorldDivider";

// ... dentro do JSX, após a grid de cards:
<WorldDivider
  eyebrow="MUNDO"
  title="GAMING"
  subtitle="Periféricos, componentes e setups feitos pra performance."
  cta={{ label: "Ver tudo gaming", href: "/produtos?categoria=gamer" }}
  tone="dark"
/>
<WorldDivider
  eyebrow="MUNDO"
  title="PARA O DIA A DIA"
  subtitle="Periféricos silenciosos e ergonômicos pra trabalho e estudo."
  cta={{ label: "Ver tudo produtividade", href: "/produtos?categoria=office" }}
  tone="light"
/>
```

- [ ] **Step 3: Build gate**

```bash
cd versoes/v3 && npm run build
```

Esperado: passa.

- [ ] **Step 4: Visual verify**

`/__playground` agora mostra 2 banners full-width. Verificar:
- "GAMING" banner: fundo preto, título grande peso 300, linha vermelha 64×2px acima do eyebrow "MUNDO"
- "PARA O DIA A DIA" banner: fundo cinza-claro, texto preto, mesma anatomia
- CTA "Ver tudo gaming →" no centro abaixo, hover sublinha vermelho
- Mobile: tipografia escala via clamp(48px, 6vw, 96px)

- [ ] **Step 5: Commit**

```bash
git add empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/WorldDivider.tsx \
        empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/pages/__playground.tsx
git commit -m "feat(pcyes-v3): WorldDivider full-bleed com 2 tones"
```

---

# Phase 2 — FeatureGridShelf (peça-chave)

## Task 2.1: FeatureGridShelf

**Files:**
- Create: `src/app/components/FeatureGridShelf.tsx`

- [ ] **Step 1: Criar `FeatureGridShelf.tsx`**

```tsx
import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductCardV2, type ProductCardV2Props } from "./ProductCardV2";

export type FeatureGridTheme = "gaming" | "productivity";

export interface FeatureGridHeroProduct {
  name: string;
  image: string;
  price: number;
  tag?: string;
  href: string;
}

export interface FeatureGridShelfProps {
  heroProduct: FeatureGridHeroProduct;
  products: ProductCardV2Props[];
  theme: FeatureGridTheme;
  eyebrow?: string;
  title?: string;
}

function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function FeatureGridShelf({
  heroProduct,
  products,
  theme,
  eyebrow,
  title,
}: FeatureGridShelfProps) {
  const isGaming = theme === "gaming";
  const cardVariant = isGaming ? "dark" : "light";

  return (
    <section
      className="w-full"
      style={{
        paddingTop: "var(--space-section-md)",
        paddingBottom: "var(--space-section-md)",
      }}
    >
      <div
        className="mx-auto px-6 md:px-12"
        style={{ maxWidth: "var(--container-max)" }}
      >
        {/* Header opcional */}
        {(eyebrow || title) && (
          <header className="mb-8 flex items-end justify-between gap-6">
            <div>
              {eyebrow && (
                <span
                  className="block uppercase mb-2"
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    color: "var(--ink-tertiary)",
                    fontFamily: "var(--font-family-inter)",
                  }}
                >
                  {eyebrow}
                </span>
              )}
              {title && (
                <h2
                  style={{
                    fontSize: "clamp(28px, 3vw, 40px)",
                    fontWeight: 300,
                    fontFamily: "var(--font-family-figtree)",
                    color: "var(--ink-primary)",
                  }}
                >
                  {title}
                </h2>
              )}
            </div>
          </header>
        )}

        {/* Grid 12 cols: hero 4 + grid 8 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Hero card */}
          <Link
            to={heroProduct.href}
            className="lg:col-span-4 relative aspect-square lg:aspect-auto group overflow-hidden flex flex-col"
            style={{
              borderRadius: "var(--radius-card)",
              background: isGaming ? "var(--gradient-card-dark)" : "var(--bg-page-soft)",
              color: isGaming ? "var(--ink-on-dark)" : "var(--ink-primary)",
              minHeight: "500px",
            }}
          >
            {heroProduct.tag && (
              <span
                className="absolute top-5 left-5 uppercase"
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: isGaming ? "var(--ink-on-dark-soft)" : "var(--ink-tertiary)",
                  fontFamily: "var(--font-family-inter)",
                }}
              >
                {heroProduct.tag}
              </span>
            )}

            {/* Imagem 60% width centralizada */}
            <div className="flex-1 flex items-center justify-center p-12">
              <motion.div
                whileHover={{ y: -8, scale: 1.04 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-[60%] flex items-center justify-center"
              >
                <ImageWithFallback
                  src={heroProduct.image}
                  alt={heroProduct.name}
                  className="max-w-full max-h-full object-contain"
                />
              </motion.div>
            </div>

            {/* Bottom info */}
            <div className="p-6 md:p-8">
              <h3
                className="mb-2"
                style={{
                  fontSize: "18px",
                  fontWeight: 400,
                  fontFamily: "var(--font-family-inter)",
                  lineHeight: 1.3,
                }}
              >
                {heroProduct.name}
              </h3>
              <p
                className="mb-4"
                style={{
                  fontSize: "14px",
                  color: isGaming ? "var(--ink-on-dark-soft)" : "var(--ink-secondary)",
                }}
              >
                {formatPrice(heroProduct.price)}
              </p>
              <span
                className="inline-flex items-center gap-1 group/cta"
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: "var(--font-family-inter)",
                }}
              >
                <span className="underline-offset-4 group-hover/cta:underline group-hover/cta:decoration-[var(--accent-red)]">
                  Conferir
                </span>
                <ChevronRight size={16} strokeWidth={1.6} className="transition-transform group-hover/cta:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Grid 4×2 — 8 produtos */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((p) => (
              <ProductCardV2 key={p.id} {...p} variant={cardVariant} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Adicionar FeatureGridShelf ao playground**

No `__playground.tsx`, importar e adicionar:

```tsx
import { FeatureGridShelf } from "../FeatureGridShelf";

// dentro do JSX, após os WorldDivider:
const sampleProducts = Array.from({ length: 8 }).map((_, i) => ({
  id: 100 + i,
  name: `Produto Demo ${i + 1}`,
  image: "/home/category-peripherals.png",
  price: 199 + i * 50,
  installments: { count: 5, value: (199 + i * 50) / 5 },
  discountPercent: i === 2 ? 15 : undefined,
  href: "/produtos",
}));

<FeatureGridShelf
  theme="gaming"
  eyebrow="GAMING"
  title="Top de performance"
  heroProduct={{
    name: "Mouse Gamer Sem Fio PCYES PRO X",
    image: "/home/category-peripherals.png",
    price: 899.91,
    tag: "DESTAQUE",
    href: "/produtos",
  }}
  products={sampleProducts}
/>
<FeatureGridShelf
  theme="productivity"
  eyebrow="PRODUTIVIDADE"
  title="Combos para o dia a dia"
  heroProduct={{
    name: "Combo Teclado + Mouse Sem Fio PCYES Office",
    image: "/home/category-computers.png",
    price: 449.91,
    tag: "MAIS VENDIDO",
    href: "/produtos",
  }}
  products={sampleProducts}
/>
```

- [ ] **Step 3: Build gate**

```bash
cd versoes/v3 && npm run build
```

- [ ] **Step 4: Visual verify**

Em `/__playground`, verificar:
- Hero card gaming (esquerda) ocupa 4 colunas com fundo radial-gradient escuro
- Grid à direita 4×2 com produtos dark
- Hero produto: tag "DESTAQUE" canto sup-esq, nome+preço+"Conferir →" bottom
- Hover no hero: produto sobe e cresce; seta translada
- Hero productivity (segundo): mesmo layout mas paleta clara
- Mobile: vira stack — hero full-width em cima, grid 2 cols embaixo

- [ ] **Step 5: Commit**

```bash
git add empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/FeatureGridShelf.tsx \
        empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/pages/__playground.tsx
git commit -m "feat(pcyes-v3): FeatureGridShelf com hero-card + grid 4x2"
```

---

# Phase 3 — Banner blocks

## Task 3.1: CollectionCard + CollectionGrid

**Files:**
- Create: `src/app/components/CollectionCard.tsx`
- Create: `src/app/components/CollectionGrid.tsx`

- [ ] **Step 1: Criar `CollectionCard.tsx`**

```tsx
import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface CollectionCardProps {
  image: string;
  overlayTitle: string;
  subtitle: string;
  href: string;
}

export function CollectionCard({ image, overlayTitle, subtitle, href }: CollectionCardProps) {
  return (
    <Link to={href} className="group flex flex-col">
      <div
        className="relative overflow-hidden aspect-[4/3]"
        style={{ borderRadius: "var(--radius-card)" }}
      >
        <motion.div
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full h-full"
        >
          <ImageWithFallback src={image} alt={overlayTitle} className="w-full h-full object-cover" />
        </motion.div>
        {/* Overlay degradê */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
        {/* Título sobre imagem */}
        <h3
          className="absolute bottom-5 left-5 right-5 uppercase text-white"
          style={{
            fontSize: "18px",
            fontWeight: 500,
            letterSpacing: "0.04em",
            fontFamily: "var(--font-family-inter)",
            lineHeight: 1.2,
          }}
        >
          {overlayTitle}
        </h3>
      </div>

      <div className="pt-4">
        <p
          className="mb-3"
          style={{
            fontSize: "14px",
            color: "var(--ink-secondary)",
            fontFamily: "var(--font-family-inter)",
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
        <span
          className="inline-flex items-center gap-1 uppercase group/cta"
          style={{
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: "var(--ink-primary)",
            fontFamily: "var(--font-family-inter)",
          }}
        >
          <span className="underline-offset-4 group-hover/cta:underline group-hover/cta:decoration-[var(--accent-red)]">
            Confira
          </span>
          <ChevronRight size={14} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Criar `CollectionGrid.tsx`**

```tsx
import { CollectionCard, type CollectionCardProps } from "./CollectionCard";

export interface CollectionGridProps {
  eyebrow?: string;
  title?: string;
  items: CollectionCardProps[];
}

export function CollectionGrid({ eyebrow, title, items }: CollectionGridProps) {
  return (
    <section
      className="w-full"
      style={{
        paddingTop: "var(--space-section-md)",
        paddingBottom: "var(--space-section-md)",
      }}
    >
      <div
        className="mx-auto px-6 md:px-12"
        style={{ maxWidth: "var(--container-max)" }}
      >
        {(eyebrow || title) && (
          <header className="mb-8">
            {eyebrow && (
              <span
                className="block uppercase mb-2"
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  color: "var(--ink-tertiary)",
                  fontFamily: "var(--font-family-inter)",
                }}
              >
                {eyebrow}
              </span>
            )}
            {title && (
              <h2
                style={{
                  fontSize: "clamp(28px, 3vw, 40px)",
                  fontWeight: 300,
                  fontFamily: "var(--font-family-figtree)",
                  color: "var(--ink-primary)",
                }}
              >
                {title}
              </h2>
            )}
          </header>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.slice(0, 3).map((item, idx) => (
            <CollectionCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Adicionar ao playground**

```tsx
import { CollectionGrid } from "../CollectionGrid";

// dentro do JSX, após FeatureGridShelf:
<CollectionGrid
  eyebrow="LINHAS"
  title="Linhas gaming"
  items={[
    {
      image: "/home/release-keyboard-context.png",
      overlayTitle: "ZERO OPPOSITION",
      subtitle: "Periféricos projetados em parceria com jogadores profissionais.",
      href: "/produtos?colecao=pro",
    },
    {
      image: "/home/release-mouse-context.png",
      overlayTitle: "PLAY YOUR WAY",
      subtitle: "Personalize sua experiência com periféricos modulares.",
      href: "/produtos?colecao=custom",
    },
    {
      image: "/home/release-controller-context.png",
      overlayTitle: "WIN EVERY MATCH",
      subtitle: "Componentes e refrigeração para performance máxima.",
      href: "/produtos?colecao=performance",
    },
  ]}
/>
```

- [ ] **Step 4: Build + visual verify**

```bash
cd versoes/v3 && npm run build && npm run dev
```

Verificar `/__playground`:
- 3 cards em grid 3-cols desktop / 1-col mobile
- Imagem 4:3 com overlay gradient bottom→top, título caixa-alta sobre imagem
- Abaixo: subtítulo + link "CONFIRA →" preto, hover sublinha vermelho
- Hover: imagem zoom 1.06 (700ms, easeOut)

- [ ] **Step 5: Commit**

```bash
git add empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/CollectionCard.tsx \
        empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/CollectionGrid.tsx \
        empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/pages/__playground.tsx
git commit -m "feat(pcyes-v3): CollectionCard + CollectionGrid"
```

---

## Task 3.2: InterestCard + InterestCardGrid

**Files:**
- Create: `src/app/components/InterestCard.tsx`
- Create: `src/app/components/InterestCardGrid.tsx`

- [ ] **Step 1: Criar `InterestCard.tsx`**

```tsx
import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface InterestCardProps {
  image: string;
  title: string;
  subtitle: string;
  href: string;
}

export function InterestCard({ image, title, subtitle, href }: InterestCardProps) {
  return (
    <Link to={href} className="group flex flex-col">
      <div className="relative overflow-hidden aspect-square" style={{ borderRadius: "var(--radius-card)" }}>
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full"
        >
          <ImageWithFallback src={image} alt={title} className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <motion.h3
            whileHover={{ y: -4 }}
            className="uppercase mb-1"
            style={{
              fontSize: "18px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              fontFamily: "var(--font-family-inter)",
              lineHeight: 1.2,
            }}
          >
            {title}
          </motion.h3>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>
            {subtitle}
          </p>
        </div>
      </div>
      <span
        className="mt-4 inline-flex items-center gap-1 uppercase group/cta"
        style={{
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.06em",
          color: "var(--ink-primary)",
          fontFamily: "var(--font-family-inter)",
        }}
      >
        <span className="underline-offset-4 group-hover/cta:underline group-hover/cta:decoration-[var(--accent-red)]">
          Confira
        </span>
        <ChevronRight size={14} strokeWidth={2} />
      </span>
    </Link>
  );
}
```

- [ ] **Step 2: Criar `InterestCardGrid.tsx`**

```tsx
import { InterestCard, type InterestCardProps } from "./InterestCard";

export interface InterestCardGridProps {
  eyebrow?: string;
  title?: string;
  items: InterestCardProps[];
}

export function InterestCardGrid({ eyebrow, title, items }: InterestCardGridProps) {
  return (
    <section
      className="w-full"
      style={{
        paddingTop: "var(--space-section-md)",
        paddingBottom: "var(--space-section-md)",
      }}
    >
      <div className="mx-auto px-6 md:px-12" style={{ maxWidth: "var(--container-max)" }}>
        {(eyebrow || title) && (
          <header className="mb-8">
            {eyebrow && (
              <span
                className="block uppercase mb-2"
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  color: "var(--ink-tertiary)",
                  fontFamily: "var(--font-family-inter)",
                }}
              >
                {eyebrow}
              </span>
            )}
            {title && (
              <h2
                style={{
                  fontSize: "clamp(28px, 3vw, 40px)",
                  fontWeight: 300,
                  fontFamily: "var(--font-family-figtree)",
                  color: "var(--ink-primary)",
                }}
              >
                {title}
              </h2>
            )}
          </header>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.slice(0, 3).map((item, idx) => (
            <InterestCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Adicionar ao playground**

```tsx
import { InterestCardGrid } from "../InterestCardGrid";

<InterestCardGrid
  eyebrow="POR INTERESSE"
  title="Compre por interesse"
  items={[
    {
      image: "/home/release-deskpad-context.png",
      title: "HOME OFFICE",
      subtitle: "Tudo pra produtividade silenciosa.",
      href: "/produtos?interesse=home-office",
    },
    {
      image: "/home/release-mic-context.png",
      title: "CRIADORES DE CONTEÚDO",
      subtitle: "Microfones, webcams e iluminação.",
      href: "/produtos?interesse=criadores",
    },
    {
      image: "/home/release-chair-context.png",
      title: "SETUP COMPACTO",
      subtitle: "Periféricos sem fio e organizadores.",
      href: "/produtos?interesse=setup-compacto",
    },
  ]}
/>
```

- [ ] **Step 4: Build + visual verify**

Em `/__playground`, verificar 3 cards quadrados com overlay e título caixa-alta sobre imagem, link "CONFIRA →" abaixo. Hover: zoom 1.04 + título sobe 4px.

- [ ] **Step 5: Commit**

```bash
git add empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/InterestCard.tsx \
        empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/InterestCardGrid.tsx \
        empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/pages/__playground.tsx
git commit -m "feat(pcyes-v3): InterestCard + InterestCardGrid"
```

---

## Task 3.3: QuizBanner

**Files:**
- Create: `src/app/components/QuizBanner.tsx`

- [ ] **Step 1: Criar `QuizBanner.tsx`**

```tsx
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface QuizBannerProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image: string;
}

export function QuizBanner({
  eyebrow = "MONTE SEU PC",
  title,
  subtitle,
  ctaLabel = "INICIAR",
  ctaHref = "/monte-seu-pc",
  image,
}: QuizBannerProps) {
  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        backgroundColor: "var(--bg-world-gaming)",
        color: "var(--ink-on-dark)",
      }}
    >
      {/* Glow vermelho sutil atrás da imagem */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(225, 6, 0, 0.1) 0%, transparent 70%)",
        }}
      />

      <div
        className="mx-auto px-6 md:px-12 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        style={{ maxWidth: "var(--container-max)" }}
      >
        {/* Texto + CTA */}
        <div className="flex flex-col">
          <span
            className="uppercase mb-3"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.12em",
              color: "var(--ink-on-dark-soft)",
              fontFamily: "var(--font-family-inter)",
            }}
          >
            {eyebrow}
          </span>
          <h2
            className="mb-3"
            style={{
              fontSize: "clamp(28px, 3.6vw, 44px)",
              fontWeight: 300,
              lineHeight: 1.1,
              fontFamily: "var(--font-family-figtree)",
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="mb-8 max-w-md"
              style={{
                fontSize: "15px",
                lineHeight: 1.5,
                color: "var(--ink-on-dark-soft)",
                fontFamily: "var(--font-family-inter)",
              }}
            >
              {subtitle}
            </p>
          )}
          <Link
            to={ctaHref}
            className="inline-flex items-center gap-2 self-start uppercase transition-colors"
            style={{
              backgroundColor: "var(--accent-red)",
              color: "var(--ink-on-dark)",
              padding: "16px 32px",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              borderRadius: "var(--radius-button)",
              fontFamily: "var(--font-family-inter)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent-red-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent-red)";
            }}
          >
            {ctaLabel}
            <ChevronRight size={16} strokeWidth={2} />
          </Link>
        </div>

        {/* Imagem direita */}
        <div className="relative flex items-center justify-center md:justify-end">
          <ImageWithFallback
            src={image}
            alt={title}
            className="max-w-full md:max-w-[80%] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Adicionar ao playground**

```tsx
import { QuizBanner } from "../QuizBanner";

<QuizBanner
  title="Configurador inteligente"
  subtitle="Em 4 passos, montamos a máquina ideal pro seu uso."
  image="/home/category-pc-gamer.png"
/>
```

- [ ] **Step 3: Build + visual verify**

Verificar em `/__playground`:
- Banda preta full-width altura ~360px desktop
- Esquerda: eyebrow "MONTE SEU PC", título 32-44px, subtítulo, pill vermelho "INICIAR →"
- Direita: imagem PC com glow vermelho radial sutil (10%) ao fundo
- Mobile: stack — texto+CTA em cima, imagem embaixo (glow oculto md:hidden)
- Hover CTA: cor vermelho-hover

- [ ] **Step 4: Commit**

```bash
git add empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/QuizBanner.tsx \
        empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/pages/__playground.tsx
git commit -m "feat(pcyes-v3): QuizBanner Monte Seu PC inline"
```

---

# Phase 4 — HeroSlider refactor

## Task 4.1: HeroSlider com 3 themes

**Files:**
- Create: `src/app/components/HeroSlider.tsx`

- [ ] **Step 1: Criar `HeroSlider.tsx`**

```tsx
import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export type HeroSlideTheme = "dark" | "light" | "promo";

export interface HeroSlide {
  theme: HeroSlideTheme;
  kicker?: string;
  title: string;
  subtitle?: string;
  ctaPrimary: { label: string; href: string; variant?: "red" | "black" | "white" };
  ctaSecondary?: { label: string; href: string };
  mediaType: "image" | "video" | "youtube";
  mediaSrc: string;
  mediaAlt?: string;
}

export interface HeroSliderProps {
  slides: HeroSlide[];
}

const IMAGE_DURATION = 8000;
const VIDEO_DURATION = 30000;

export function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const startRef = useRef(Date.now());

  const slide = slides[current];
  const isDark = slide.theme === "dark";
  const isPromo = slide.theme === "promo";

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % slides.length) + slides.length) % slides.length);
    setProgress(0);
    startRef.current = Date.now();
  }, [slides.length]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const duration = slide.mediaType === "video" || slide.mediaType === "youtube" ? VIDEO_DURATION : IMAGE_DURATION;
    startRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p >= 1) next();
    }, 60);
    return () => clearInterval(interval);
  }, [current, paused, slide.mediaType, next]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const bgStyle: React.CSSProperties = isPromo
    ? { backgroundColor: "#000000" }
    : isDark
    ? { background: "var(--gradient-card-dark)" }
    : { backgroundColor: "var(--bg-page-soft)" };

  const ctaPrimaryStyle = (variant?: string): React.CSSProperties => {
    if (variant === "red") {
      return { backgroundColor: "var(--accent-red)", color: "#FFFFFF" };
    }
    if (variant === "white") {
      return { backgroundColor: "#FFFFFF", color: "#0A0A0B" };
    }
    return { backgroundColor: "#0A0A0B", color: "#FFFFFF" };
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "min(82vh, 760px)", minHeight: "560px", ...bgStyle }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrossel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
          aria-live="polite"
        >
          {/* Media */}
          {isPromo ? (
            slide.mediaType === "youtube" ? (
              <iframe
                src={`https://www.youtube.com/embed/${slide.mediaSrc}?autoplay=1&mute=1&loop=1&playlist=${slide.mediaSrc}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                title={slide.mediaAlt || slide.title}
                className="absolute inset-0 w-full h-full"
                style={{ border: "none" }}
                allow="autoplay; encrypted-media"
                loading="lazy"
              />
            ) : (
              <ImageWithFallback src={slide.mediaSrc} alt={slide.mediaAlt || slide.title} className="w-full h-full object-cover" />
            )
          ) : (
            <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 flex items-center justify-center p-12">
              <ImageWithFallback
                src={slide.mediaSrc}
                alt={slide.mediaAlt || slide.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}

          {/* Promo overlay degradê esquerda */}
          {isPromo && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />
          )}

          {/* Conteúdo texto */}
          <div
            className="absolute inset-0 mx-auto px-6 md:px-12 flex items-center"
            style={{ maxWidth: "var(--container-max)" }}
          >
            <div className="max-w-xl" style={{ color: isPromo || isDark ? "#FFFFFF" : "var(--ink-primary)" }}>
              {slide.kicker && (
                <span
                  className="block uppercase mb-4"
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    color: isPromo || isDark ? "rgba(255,255,255,0.6)" : "var(--ink-tertiary)",
                    fontFamily: "var(--font-family-inter)",
                  }}
                >
                  {slide.kicker}
                </span>
              )}
              <h1
                className="mb-4"
                style={{
                  fontSize: "clamp(40px, 5.5vw, 72px)",
                  fontWeight: 300,
                  lineHeight: 1.05,
                  fontFamily: "var(--font-family-figtree)",
                }}
              >
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p
                  className="mb-8 max-w-md"
                  style={{
                    fontSize: "16px",
                    lineHeight: 1.6,
                    color: isPromo || isDark ? "rgba(255,255,255,0.7)" : "var(--ink-secondary)",
                    fontFamily: "var(--font-family-inter)",
                  }}
                >
                  {slide.subtitle}
                </p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  to={slide.ctaPrimary.href}
                  className="inline-flex items-center transition-opacity hover:opacity-90"
                  style={{
                    ...ctaPrimaryStyle(slide.ctaPrimary.variant),
                    padding: "14px 28px",
                    fontSize: "13px",
                    fontWeight: 500,
                    borderRadius: "var(--radius-button)",
                    fontFamily: "var(--font-family-inter)",
                  }}
                >
                  {slide.ctaPrimary.label}
                </Link>
                {slide.ctaSecondary && (
                  <Link
                    to={slide.ctaSecondary.href}
                    className="inline-flex items-center transition-colors"
                    style={{
                      border: `1px solid ${isPromo || isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)"}`,
                      color: isPromo || isDark ? "#FFFFFF" : "#0A0A0B",
                      padding: "13px 28px",
                      fontSize: "13px",
                      fontWeight: 500,
                      borderRadius: "var(--radius-button)",
                      fontFamily: "var(--font-family-inter)",
                    }}
                  >
                    {slide.ctaSecondary.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Setas */}
      <button
        type="button"
        onClick={prev}
        aria-label="Slide anterior"
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-50"
        style={{ backgroundColor: "rgba(0,0,0,0.3)", color: "#FFFFFF" }}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Próximo slide"
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity"
        style={{ backgroundColor: "rgba(0,0,0,0.3)", color: "#FFFFFF" }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots com progress (linha horizontal) */}
      <div className="absolute bottom-8 left-6 md:left-12 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => goTo(idx)}
            aria-label={`Ir para slide ${idx + 1}`}
            className="relative h-[3px] w-12 rounded-full overflow-hidden cursor-pointer"
            style={{ backgroundColor: isPromo || isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)" }}
          >
            {idx === current && (
              <span
                className="absolute left-0 top-0 h-full"
                style={{
                  width: `${progress * 100}%`,
                  backgroundColor: "var(--accent-red)",
                  transition: "width 60ms linear",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Adicionar ao playground**

```tsx
import { HeroSlider } from "../HeroSlider";

// no topo do return:
<HeroSlider
  slides={[
    {
      theme: "dark",
      kicker: "PRO SERIES",
      title: "Drive to Win",
      subtitle: "Periféricos forjados em parceria com jogadores profissionais.",
      ctaPrimary: { label: "Comprar agora", href: "/produtos", variant: "red" },
      ctaSecondary: { label: "Conheça a linha", href: "/produtos?colecao=pro" },
      mediaType: "image",
      mediaSrc: "/home/category-peripherals.png",
    },
    {
      theme: "light",
      kicker: "WORKSPACE",
      title: "Setup que entrega",
      subtitle: "Teclados e mouses sem fio pra produtividade silenciosa.",
      ctaPrimary: { label: "Explorar produtividade", href: "/produtos?categoria=office", variant: "black" },
      mediaType: "image",
      mediaSrc: "/home/category-computers.png",
    },
    {
      theme: "promo",
      kicker: "CAMPANHA",
      title: "Maringá FC × PCYES",
      subtitle: "Edição limitada de periféricos do time.",
      ctaPrimary: { label: "Ver coleção", href: "/maringa-fc", variant: "red" },
      mediaType: "image",
      mediaSrc: "/home/hero-videogame.png",
      mediaAlt: "Maringá FC collab",
    },
  ]}
/>
```

- [ ] **Step 3: Build + visual verify**

```bash
cd versoes/v3 && npm run build && npm run dev
```

Verificar `/__playground`:
- Hero 82vh, slide inicial dark com radial-gradient escuro, produto à direita
- Texto esquerda: kicker, title peso 300, CTA vermelho + CTA outline
- Dots: 3 linhas horizontais 12px largura, ativo enche com vermelho ao longo de 8s
- Setas chevron aparecem em hover
- Após 8s auto-advance pra slide light (paleta inverte)
- Hover sobre hero pausa auto-advance
- Teclado: setas ← → trocam slide
- Mobile: stack texto/produto, dots no rodapé funcionam

- [ ] **Step 4: Commit**

```bash
git add empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/HeroSlider.tsx \
        empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/pages/__playground.tsx
git commit -m "feat(pcyes-v3): HeroSlider com 3 themes e dots de progress"
```

---

# Phase 5 — Newsletter + Footer + re-skins

## Task 5.1: NewsletterInline

**Files:**
- Create: `src/app/components/NewsletterInline.tsx`

- [ ] **Step 1: Criar `NewsletterInline.tsx`**

```tsx
import { useState } from "react";
import { Mail } from "lucide-react";

export function NewsletterInline() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar com backend de newsletter quando definido
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section
      className="w-full"
      style={{
        backgroundColor: "var(--bg-page-soft)",
        paddingTop: "32px",
        paddingBottom: "32px",
      }}
    >
      <div
        className="mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-4 md:gap-8"
        style={{ maxWidth: "var(--container-max)" }}
      >
        <div className="flex items-center gap-3">
          <Mail size={22} strokeWidth={1.6} style={{ color: "var(--ink-primary)" }} />
          <p
            className="m-0"
            style={{
              fontSize: "14px",
              color: "var(--ink-primary)",
              fontFamily: "var(--font-family-inter)",
            }}
          >
            Inscreva-se para receber novidades por e-mail.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2 w-full md:max-w-md md:ml-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Endereço de e-mail"
            className="flex-1 px-4 py-3 outline-none focus:ring-1"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-button)",
              fontSize: "14px",
              fontFamily: "var(--font-family-inter)",
            }}
          />
          <button
            type="submit"
            className="inline-flex items-center transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#0A0A0B",
              color: "#FFFFFF",
              padding: "12px 24px",
              fontSize: "13px",
              fontWeight: 500,
              borderRadius: "var(--radius-button)",
              fontFamily: "var(--font-family-inter)",
            }}
          >
            Inscrever-se
          </button>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Adicionar ao playground**

```tsx
import { NewsletterInline } from "../NewsletterInline";

// no fim do JSX:
<NewsletterInline />
```

- [ ] **Step 3: Build + visual verify**

Verificar faixa estreita ~100px alt, fundo cinza-claro, ícone email + texto + input + CTA preto inline. Mobile: quebra em 2 linhas.

- [ ] **Step 4: Commit**

```bash
git add empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/NewsletterInline.tsx \
        empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/pages/__playground.tsx
git commit -m "feat(pcyes-v3): NewsletterInline faixa estreita"
```

---

## Task 5.2: Footer absorve TrustStrip

**Files:**
- Modify: `src/app/components/Footer.tsx`
- Read first: `src/app/components/TrustStrip.tsx`

- [ ] **Step 1: Ler `TrustStrip.tsx` atual**

```bash
cat versoes/v3/src/app/components/TrustStrip.tsx
```

Identificar os 4 itens de garantia/pagamento/entrega/suporte e seus ícones (Shield, Truck, etc.).

- [ ] **Step 2: Adicionar bloco de trust no topo do `Footer.tsx`**

Abrir `src/app/components/Footer.tsx`. Identificar o início do `<footer>` (ou elemento raiz do return).

Adicionar **antes do conteúdo principal do footer**:

```tsx
{/* Trust strip — absorvido do TrustStrip */}
<div
  className="w-full border-b"
  style={{ borderColor: "rgba(255,255,255,0.08)" }}
>
  <div
    className="mx-auto px-6 md:px-12 py-6 grid grid-cols-2 md:grid-cols-4 gap-6"
    style={{ maxWidth: "var(--container-max)" }}
  >
    {[
      { icon: "🛡️", title: "Garantia oficial", subtitle: "1 ano de cobertura" },
      { icon: "🚚", title: "Frete grátis", subtitle: "Acima de R$ 299" },
      { icon: "💳", title: "Até 12x", subtitle: "Sem juros no cartão" },
      { icon: "🎧", title: "Suporte 5★", subtitle: "Atendimento humano" },
    ].map((item, idx) => (
      <div key={idx} className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">{item.icon}</span>
        <div>
          <p style={{ fontSize: "13px", fontWeight: 500, color: "#FFFFFF", marginBottom: 2 }}>
            {item.title}
          </p>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
            {item.subtitle}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
```

**Importante:** se o `TrustStrip.tsx` atual usa ícones `lucide-react` específicos (Shield, Truck, CreditCard, Headphones), substituir os emojis acima pelos ícones correspondentes — adicionar import no topo do Footer:

```tsx
import { Shield, Truck, CreditCard, Headphones } from "lucide-react";
```

E trocar `<span className="text-2xl">{item.icon}</span>` pelo componente apropriado (`<Shield size={22} strokeWidth={1.4} style={{ color: '#FFFFFF' }} />` etc).

- [ ] **Step 3: Build + visual verify**

```bash
cd versoes/v3 && npm run build && npm run dev
```

Navegar para qualquer página com Footer (`/`, `/perfil`, etc.). Verificar trust-strip no topo do footer.

- [ ] **Step 4: Commit**

```bash
git add empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/Footer.tsx
git commit -m "refactor(pcyes-v3): Footer absorve TrustStrip no topo"
```

---

## Task 5.3: Re-skin CategoryRail + BrandsStrip

**Files:**
- Modify: `src/app/components/CategoryRail.tsx`
- Modify: `src/app/components/BrandsStrip.tsx`

- [ ] **Step 1: Ler ambos para entender estrutura atual**

```bash
cat versoes/v3/src/app/components/CategoryRail.tsx
cat versoes/v3/src/app/components/BrandsStrip.tsx
```

- [ ] **Step 2: CategoryRail — atualizar hover para underline vermelho**

No JSX do label de cada pílula, garantir que tenha:

```tsx
<span className="underline-offset-4 group-hover:underline group-hover:decoration-[var(--accent-red)] transition-all">
  {category.label}
</span>
```

E scale na pílula em hover:

```tsx
className="group transition-transform hover:scale-[1.04]"
```

Atualizar paddings de seção:

```tsx
style={{ paddingTop: 'var(--space-section-md)', paddingBottom: 'var(--space-section-md)' }}
```

- [ ] **Step 3: BrandsStrip — grayscale + eyebrow**

Garantir que cada logo tem:

```tsx
className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
```

E adicionar header com eyebrow:

```tsx
<header className="text-center mb-6">
  <span
    className="block uppercase"
    style={{
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: "0.12em",
      color: "var(--ink-tertiary)",
      fontFamily: "var(--font-family-inter)",
    }}
  >
    Marcas parceiras
  </span>
</header>
```

Logos: altura 24-32px, separador via padding 48px horizontal entre cada.

- [ ] **Step 4: Build + visual verify**

Adicionar `CategoryRail` e `BrandsStrip` ao playground (após HeroSlider) e verificar.

- [ ] **Step 5: Commit**

```bash
git add empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/CategoryRail.tsx \
        empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/BrandsStrip.tsx
git commit -m "refactor(pcyes-v3): re-skin CategoryRail + BrandsStrip com tokens novos"
```

---

# Phase 6 — HomePage assembly + cleanup

## Task 6.1: Reescrever HomePage.tsx com nova sequência

**Files:**
- Modify: `src/app/components/HomePage.tsx`

- [ ] **Step 1: Reescrever HomePage.tsx do zero**

Substituir o conteúdo COMPLETO de `src/app/components/HomePage.tsx` por:

```tsx
import { HeroSlider, type HeroSlide } from "./HeroSlider";
import { CategoryRail } from "./CategoryRail";
import { WorldDivider } from "./WorldDivider";
import { FeatureGridShelf } from "./FeatureGridShelf";
import { CollectionGrid } from "./CollectionGrid";
import { QuizBanner } from "./QuizBanner";
import { InterestCardGrid } from "./InterestCardGrid";
import { BrandsStrip } from "./BrandsStrip";
import { NewsletterInline } from "./NewsletterInline";
import { Footer } from "./Footer";
import { allProducts } from "./productsData";

const heroSlides: HeroSlide[] = [
  {
    theme: "dark",
    kicker: "PRO SERIES",
    title: "Drive to Win",
    subtitle: "Periféricos forjados em parceria com jogadores profissionais.",
    ctaPrimary: { label: "Comprar agora", href: "/produtos", variant: "red" },
    ctaSecondary: { label: "Conheça a linha", href: "/produtos?colecao=pro" },
    mediaType: "image",
    mediaSrc: "/home/category-peripherals.png",
  },
  {
    theme: "light",
    kicker: "WORKSPACE",
    title: "Setup que entrega",
    subtitle: "Teclados e mouses sem fio pra produtividade silenciosa.",
    ctaPrimary: { label: "Explorar produtividade", href: "/produtos?categoria=office", variant: "black" },
    mediaType: "image",
    mediaSrc: "/home/category-computers.png",
  },
  {
    theme: "promo",
    kicker: "CAMPANHA",
    title: "Maringá FC × PCYES",
    subtitle: "Edição limitada de periféricos do time.",
    ctaPrimary: { label: "Ver coleção", href: "/maringa-fc", variant: "red" },
    mediaType: "image",
    mediaSrc: "/home/hero-videogame.png",
  },
];

const gamingIds = [436, 72, 329, 433, 446, 199, 375, 295];
const productivityIds = [128, 30, 199, 433, 446, 375, 295, 329];

function productById(id: number) {
  const p = allProducts.find((x) => x.id === id);
  if (!p) {
    return {
      id,
      name: `Produto ${id}`,
      image: "/home/category-peripherals.png",
      price: 199,
      href: "/produtos",
    };
  }
  return {
    id: p.id,
    name: p.name,
    image: p.image,
    price: p.price,
    oldPrice: p.oldPrice,
    discountPercent: p.discountPercent,
    installments: p.installments,
    href: `/produto/${p.id}`,
  };
}

export function HomePage() {
  return (
    <>
      {/* 1. Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* 2. Category Rail */}
      <CategoryRail />

      {/* 3. Divisor Gaming */}
      <WorldDivider
        eyebrow="MUNDO"
        title="GAMING"
        subtitle="Periféricos, componentes e setups feitos pra performance."
        cta={{ label: "Ver tudo gaming", href: "/produtos?categoria=gamer" }}
        tone="dark"
      />

      {/* 4. FeatureGridShelf gaming */}
      <FeatureGridShelf
        theme="gaming"
        heroProduct={{
          name: "Mouse Gamer Sem Fio PCYES PRO X",
          image: "/home/category-peripherals.png",
          price: 899.91,
          tag: "DESTAQUE",
          href: "/produtos",
        }}
        products={gamingIds.map(productById)}
      />

      {/* 5. Linhas Gaming */}
      <CollectionGrid
        eyebrow="LINHAS"
        title="Linhas gaming"
        items={[
          {
            image: "/home/release-keyboard-context.png",
            overlayTitle: "ZERO OPPOSITION",
            subtitle: "Periféricos projetados em parceria com jogadores profissionais.",
            href: "/produtos?colecao=pro",
          },
          {
            image: "/home/release-mouse-context.png",
            overlayTitle: "PLAY YOUR WAY",
            subtitle: "Personalize sua experiência com periféricos modulares.",
            href: "/produtos?colecao=custom",
          },
          {
            image: "/home/release-controller-context.png",
            overlayTitle: "WIN EVERY MATCH",
            subtitle: "Componentes e refrigeração para performance máxima.",
            href: "/produtos?colecao=performance",
          },
        ]}
      />

      {/* 6. Quiz Banner */}
      <QuizBanner
        title="Configurador inteligente"
        subtitle="Em 4 passos, montamos a máquina ideal pro seu uso."
        image="/home/category-pc-gamer.png"
      />

      {/* 7. Divisor Dia a Dia */}
      <WorldDivider
        eyebrow="MUNDO"
        title="PARA O DIA A DIA"
        subtitle="Periféricos silenciosos e ergonômicos pra trabalho e estudo."
        cta={{ label: "Ver tudo produtividade", href: "/produtos?categoria=office" }}
        tone="light"
      />

      {/* 8. FeatureGridShelf productivity */}
      <FeatureGridShelf
        theme="productivity"
        heroProduct={{
          name: "Combo Teclado + Mouse Sem Fio PCYES Office",
          image: "/home/category-computers.png",
          price: 449.91,
          tag: "MAIS VENDIDO",
          href: "/produtos",
        }}
        products={productivityIds.map(productById)}
      />

      {/* 9. Compre por interesse */}
      <InterestCardGrid
        eyebrow="POR INTERESSE"
        title="Compre por interesse"
        items={[
          {
            image: "/home/release-deskpad-context.png",
            title: "HOME OFFICE",
            subtitle: "Tudo pra produtividade silenciosa.",
            href: "/produtos?interesse=home-office",
          },
          {
            image: "/home/release-mic-context.png",
            title: "CRIADORES DE CONTEÚDO",
            subtitle: "Microfones, webcams e iluminação.",
            href: "/produtos?interesse=criadores",
          },
          {
            image: "/home/release-chair-context.png",
            title: "SETUP COMPACTO",
            subtitle: "Periféricos sem fio e organizadores.",
            href: "/produtos?interesse=setup-compacto",
          },
        ]}
      />

      {/* 10. Brand strip */}
      <BrandsStrip />

      {/* 11. Newsletter */}
      <NewsletterInline />

      {/* 12. Footer (já tem TrustStrip absorvido) */}
      <Footer />
    </>
  );
}
```

**Importante:** o helper `productById` é defensivo — se algum id não existir em `productsData`, retorna um placeholder seguro. Manter mesmo que todos os ids existam, pra evitar crash em runtime.

Se a estrutura de `Product` em `productsData.ts` for diferente do esperado (image, price, oldPrice, etc.), ajustar o mapper sem mudar a interface dos componentes.

- [ ] **Step 2: Build gate**

```bash
cd versoes/v3 && npm run build
```

Esperado: passa. Se falhar por causa do shape de `Product`, ler `productsData.ts` e ajustar o mapper.

- [ ] **Step 3: Visual verify homepage completa**

```bash
cd versoes/v3 && npm run dev
```

Abrir `http://localhost:5173/`. Scroll do topo até o footer. Verificar todos os 12 blocos na ordem do spec (Section 5):

1. HeroSlider rotaciona slides ✓
2. CategoryRail abaixo ✓
3. Divisor "GAMING" preto com linha vermelha ✓
4. FeatureGridShelf gaming (hero card preto + grid 4×2 dark) ✓
5. CollectionGrid LINHAS GAMING (3 cards lifestyle) ✓
6. QuizBanner preto com CTA vermelho ✓
7. Divisor "PARA O DIA A DIA" claro ✓
8. FeatureGridShelf productivity (light) ✓
9. InterestCardGrid (3 cards) ✓
10. BrandsStrip grayscale ✓
11. NewsletterInline faixa estreita ✓
12. Footer com trust no topo ✓

Conferir pulso de vermelho ao scroll (max 6 toques visíveis, nunca grandes superfícies).

Testar mobile (responsive em <768px): cada bloco encaixa, hero stack, grids 2 cols, divisor tipografia escala.

- [ ] **Step 4: Commit**

```bash
git add empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/app/components/HomePage.tsx
git commit -m "feat(pcyes-v3): homepage redesign — 12 blocos novos seguindo spec"
```

---

## Task 6.2: Cleanup — aposentar componentes não usados

**Files:**
- Delete: 7 arquivos
- Modify: `src/app/routes.tsx` (remover rota playground)
- Delete: `src/app/components/pages/__playground.tsx`

- [ ] **Step 1: Confirmar que nenhum dos arquivos a aposentar é importado em outro lugar**

Rodar grep em cada um:

```bash
cd versoes/v3 && for f in HeroSection FlashDealsStrip BannerDuo CategorySpotlight TrustStrip Newsletter ProductShelf; do
  echo "=== $f ==="
  grep -rn "from .*$f" src --include="*.tsx" --include="*.ts" | grep -v "^src/app/components/$f.tsx"
done
```

Esperado: zero matches (ou só matches dentro do próprio arquivo do componente).

Se algum aparecer (ex: alguma página solta ainda importa `ProductShelf`), ler a página, migrar o uso pro `FeatureGridShelf` ou outro equivalente, e depois prosseguir.

- [ ] **Step 2: Deletar arquivos aposentados**

```bash
cd versoes/v3 && rm \
  src/app/components/HeroSection.tsx \
  src/app/components/FlashDealsStrip.tsx \
  src/app/components/BannerDuo.tsx \
  src/app/components/CategorySpotlight.tsx \
  src/app/components/TrustStrip.tsx \
  src/app/components/Newsletter.tsx \
  src/app/components/ProductShelf.tsx
```

- [ ] **Step 3: Remover rota e arquivo do playground**

Editar `src/app/routes.tsx`:
- Remover linha `import { Playground } from "./components/pages/__playground";`
- Remover entrada `{ path: "__playground", Component: Playground },`

Deletar arquivo:

```bash
rm versoes/v3/src/app/components/pages/__playground.tsx
```

- [ ] **Step 4: Build gate**

```bash
cd versoes/v3 && npm run build
```

Esperado: passa. Se quebrar por algum import quebrado de um arquivo deletado, encontrar o consumidor e migrar/remover o import.

- [ ] **Step 5: Visual verify homepage final**

```bash
cd versoes/v3 && npm run dev
```

`/` deve renderizar idêntico à Task 6.1 Step 3. Nenhuma regressão visual.

Tirar print da home desktop e mobile para arquivar como referência (opcional, mas recomendado).

- [ ] **Step 6: Commit final**

```bash
git add -A empresas/pcyes/projetos/pcyes-v2/versoes/v3/src/
git commit -m "chore(pcyes-v3): remove componentes aposentados pelo redesign"
```

---

# Critérios de Sucesso (Section 12 do spec)

- [ ] 12 blocos renderizados na ordem do spec (desktop e mobile)
- [ ] Pulso de vermelho: 6 toques no máximo, nenhum bloco chapado de vermelho
- [ ] Scroll total desktop ~4500px ±10% — medir via DevTools (`document.documentElement.scrollHeight`)
- [ ] `npm run build` passa sem erro
- [ ] Hero slider: troca de slide ≤ 800ms (crossfade + render)
- [ ] FeatureGridShelf: hover do hero-card a 60fps em desktop mid-tier
- [ ] Mobile (<768px): cada bloco encaixa, sem overflow horizontal, tipografia legível

Validação manual visual: navegar do topo ao footer, conferir cada bloco contra spec section 4. Testar com `prefers-reduced-motion: reduce` no DevTools para verificar que animações pesadas estão suavizadas (CSS `@media (prefers-reduced-motion: reduce)` opcional para iteração futura — fora de escopo).

---

# Plan Self-Review Notes

- Cobertura do spec: ✓ 12 blocos, ✓ 11 componentes, ✓ tokens, ✓ regras de vermelho, ✓ a11y básica (foco visível via tokens), ✓ responsivo (mobile/tablet/desktop em cada componente)
- Placeholders: zero — todo código aparece literal nos passos
- Type consistency: `ProductCardV2Props` definido na Task 1.1, usado em Task 2.1 e Task 6.1; `HeroSlide` definido na Task 4.1, usado na Task 6.1 — sem divergência
- Critérios de sucesso: mensuráveis (scroll height, build, hover fps via observação)
