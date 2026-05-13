# Homepage V3 — Redesign Spec

**Data:** 2026-05-13
**Autor:** UI/UX (Gabriel + Claude)
**Versão:** 1.0
**Status:** Aprovado — pronto para plano de implementação

## 1. Contexto

A homepage atual da V3 (PCYES) é funcional, mas:

1. Tem peso visual desbalanceado — hero dark com vídeo YouTube + scroll parallax cria experiência cinemática que conflita com a função de loja.
2. Estrutura é monolítica — sequência de ProductShelves alternadas com banners genéricos. Não há quebra clara de mundo/uso (gaming vs produtividade).
3. Falta de FeatureGridShelf — sem composição "hero-produto + grid de relacionados", o cross-sell e o desejo aspiracional não se sustentam visualmente.
4. Não traz Monte Seu PC para dentro do fluxo de browse. O configurador é uma página isolada (`/monte-seu-pc`).
5. Componentes acessórios (FlashDealsStrip, BannerDuo, CategorySpotlight, TrustStrip pré-footer, Newsletter hero) somam ruído sem proporção de valor.

A referência principal é a **logitechstore.com.br**, mas adaptada à identidade PCYES (preto base + vermelho `#E10600` pontual). O componente Figma fornecido (`Ud4xOWE1I7x0gGP5cau7K0`, node `174:2`) é a tradução fiel desse padrão.

## 2. Decisões aprovadas

| Decisão | Escolha |
|---|---|
| Abordagem estrutural | **B — PCYES-first, 2 mundos enxutos** (Gaming primeiro, depois Dia-a-dia) |
| Hero | Slider variado com 3 themes (`dark`/`light`/`promo`) — flexibilidade pra trocar campanha sem refazer hero |
| Identidade | Preto base + vermelho `#E10600` intencional (CTAs de conversão, sale tags, dots, micro-acentos — nunca grandes superfícies) |
| Background card escuro | Radial-gradient Corsair-style — centro `#2C2D33`, bordas `#0F1013` |
| Mundos | **Gaming** + **Para o dia a dia** (produtividade/office) |
| Container max-width | 1440px |
| Newsletter | Faixa estreita inline (100px) — não merece hero |
| Trust strip | Realocada pra dentro do Footer |
| Frameworks | Manter stack atual: Vite + React 18 + Tailwind v4 + react-router 7 + motion |

## 3. Design tokens

### 3.1 Paleta

```css
--bg-page: #FFFFFF;
--bg-page-soft: #F7F7F8;
--bg-world-gaming: #0A0A0B;
--bg-card-dark: #2C2D33;        /* centro radial */
--bg-card-dark-edge: #0F1013;    /* borda radial */
--ink-primary: #0A0A0B;
--ink-secondary: #5C5F66;
--ink-tertiary: #9AA0A6;
--ink-on-dark: #FFFFFF;
--ink-on-dark-soft: rgba(255, 255, 255, 0.6);
--accent-red: #E10600;
--accent-red-hover: #B80500;
--success: #16A34A;
--border-subtle: rgba(0, 0, 0, 0.06);
```

### 3.2 Regras de uso do vermelho (intenção)

Vermelho `--accent-red` aparece SOMENTE em:

1. Sale tags / badge de desconto (canto superior-esquerdo do `ProductCard`)
2. CTA primário em contexto de conversão direta (ex: "INICIAR QUIZ", "COMPRAR AGORA"). CTAs neutros = preto.
3. Linha de underline em hover dos links de seção ("Ver tudo →")
4. Indicador de slide ativo no `HeroSlider`
5. Micro-acentos: preço promocional, ponto de "em estoque", linha de 64×2px sob `WorldDivider`
6. Glow radial sutil (10% opacity) atrás do produto no `QuizBanner`

NÃO usar em: grandes superfícies, fundos de divisor, headers, hover de card inteiro, fundo de produto.

Meta: máximo 6 toques de vermelho ao longo dos ~4500px de scroll.

### 3.3 Tipografia

```css
--font-display: 'Figtree', sans-serif;  /* já existe */
--font-body: 'Inter', sans-serif;        /* já existe */

--label-section: 12px / 500 / 0.12em / uppercase / var(--ink-tertiary);
--title-section: clamp(28px, 3vw, 40px) / 300 / var(--ink-primary);
--title-divider: clamp(48px, 6vw, 96px) / 300 / var(--ink-on-dark);
--title-hero: clamp(40px, 5.5vw, 72px) / 300 / line-height 1.05;
```

### 3.4 Grid e espaçamentos

- Container max-width: 1440px
- Gutters: 24px desktop / 16px mobile
- Espaço entre seções: 96px desktop / 64px tablet / 48px mobile
- `--radius-card: 8px`
- `--radius-button: 999px` (pill, já existe)
- Grade de produtos: 4 cols desktop / 3 cols tablet / 2 cols mobile

### 3.5 Background radial-gradient (card escuro)

```css
background: radial-gradient(
  ellipse 80% 70% at 50% 45%,
  #2C2D33 0%,
  #1A1B1F 60%,
  #0F1013 100%
);
```

Mobile: reduzir intensidade para `ellipse 100% 80%`.

### 3.6 Elevação

```css
--shadow-card-hover: 0 12px 40px rgba(0, 0, 0, 0.08);
```

Cards default sem sombra — só `--border-subtle` 1px.

## 4. Componentes

### 4.1 `<HeroSlider />`

- Altura: `min(82vh, 760px)`
- 3 themes: `dark` (radial escuro + halo vermelho), `light` (cinza-claro), `promo` (imagem cheia + overlay)
- 3-5 slides max
- Auto-advance: imagem 8s / vídeo 30s
- Dots com progress: linha horizontal fina, dot ativo `--accent-red`, à esquerda inferior
- Setas chevron sutis nas laterais (só em hover desktop)
- Crossfade 700ms, sem scroll parallax (remover do `HeroSection.tsx` atual)
- Mobile: stack texto/produto, dots no rodapé

**Slots por slide:** `kicker`, `title`, `subtitle?`, `cta_primary`, `cta_secondary?`, `media_type` (image/video/youtube), `media_src`, `media_align` (right/full).

### 4.2 `<CategoryRail />`

- Strip horizontal, 7-9 pílulas circulares 96×96
- Foto recortada de produto-tipo + label embaixo
- Snap-scroll horizontal mobile, grade fixa desktop
- Hover: scale 1.04 + underline vermelho no label
- Imagens: reaproveitar `public/home/category-*.png`

### 4.3 `<WorldDivider />`

- Banda full-bleed, altura 280px desktop / 200px mobile
- Variantes `tone`: `dark` (gaming, fundo `--bg-world-gaming`) | `light` (dia-a-dia, fundo `--bg-page-soft`)
- Slots: `eyebrow` ("MUNDO"), `title` (48-96px), `subtitle?`, `accent_line` (vermelha 64×2px decorativa acima do título), `cta?` (link no canto inferior-direito)
- Minimalista tipográfico, sem background image

### 4.4 `<FeatureGridShelf />` (peça-chave)

Layout 12 colunas:

```
┌──────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│              │   product   │   product   │   product   │   product   │
│   HERO       │             │             │             │             │
│   CARD       ├─────────────┼─────────────┼─────────────┼─────────────┤
│   (4 cols)   │   product   │   product   │   product   │   product   │
│              │             │             │             │             │
└──────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

**Slots:**
- `hero_product` — 1 produto destaque
- `products[]` — 6-8 produtos
- `theme` — `gaming` (radial dark) | `productivity` (cinza-claro sólido)

**Hero card:**
- Background: radial-gradient escuro (gaming) ou cinza-claro (productivity)
- Tag "DESTAQUE" superior-esquerda
- Produto centralizado 60% da largura
- Nome 16-18px + preço 14px + CTA "Conferir →" bottom-left
- Hover: produto translateY -8px + scale 1.04, seta translateX +4px, 600ms

**Mobile:** hero full-width em cima, grid 2-cols embaixo.

### 4.5 `<ProductCard />`

Duas variantes:

**`light` (default):**
- Fundo: `--bg-page-soft`
- Borda `--border-subtle` 1px
- Texto preto

**`dark` (Corsair-style):**
- Fundo: radial-gradient (Stage 3.5)
- Sem borda
- Texto branco

**Comum:**
- Aspect-ratio 1:1 área da imagem, padding 20% (14% mobile)
- Footer 80-100px: nome 2 linhas truncate, preço, "5x sem juros"
- Sale tag: pill 24px altura, fundo `--accent-red`, texto branco "-15%" (canto sup-esq)
- Wishlist: ícone coração top-right 24px
- Hover: produto sobe 6px + scale 1.03, sombra (light) ou inner glow sutil (dark), CTA "+" circular 40px bottom-right

### 4.6 `<CollectionCard />` (LINHAS GAMING)

- Imagem topo aspect 4:3 (lifestyle, não packshot)
- Título caixa-alta 18px sobre overlay gradient preto→transparente, canto inf-esq
- Subtítulo 14px 1 linha + link "CONFIRA →" (preto, hover sublinha vermelho) abaixo da imagem
- Grid: 3 colunas desktop / 2 colunas mobile (scroll-snap horizontal)
- Hover: zoom 1.06 dentro da máscara, 700ms

### 4.7 `<QuizBanner />`

- Banda full-width, altura ~360px desktop / 280px mobile
- Fundo: preto `--bg-world-gaming` + radial vermelho 10% sutil atrás da imagem
- Layout 2-colunas: texto + CTA esquerda / imagem direita
- Eyebrow "MONTE SEU PC", title 32-44px, subtitle 1 linha, CTA pill vermelho 56px
- Mobile: stack
- Link: `/monte-seu-pc`

### 4.8 `<InterestCard />`

- Imagem 1:1 lifestyle (pessoa em contexto: home office, streaming, gamer setup)
- Overlay gradient preto bottom→top 0-60%
- Título 16-18px branco sobre overlay bottom-left
- Subtítulo 12-13px branco/80% 1-2 linhas
- CTA "CONFIRA →" abaixo da imagem (preto, hover sublinha vermelho)
- Grid: 3 colunas desktop / 1 coluna scroll-snap mobile
- Hover: zoom 1.04 + título translateY -4px

### 4.9 `<BrandStrip />`

- Fundo `--bg-page`
- Logos 24-32px altura, grayscale + opacity 0.5
- Hover: grayscale(0) opacity(1) 300ms
- Sem moldura, padding 48px entre logos
- Auto-scroll marquee opcional desktop se >7 marcas
- Eyebrow "MARCAS PARCEIRAS" caixa-alta centralizada

### 4.10 `<NewsletterInline />`

- Banda 100px altura, fundo `--bg-page-soft`
- 3 zonas inline: ícone email + texto curto + input + botão "Inscrever-se →"
- Mobile: quebra em 2 linhas
- CTA preto (não vermelho — não é conversão primária)

### 4.11 `<Footer />`

- Footer atual + `<TrustStrip />` integrada no topo (80px com ícones: garantia, frete, pagamento, suporte)

## 5. Sequência da homepage (12 blocos)

```
0–760px      HeroSlider                          [dots vermelhos, CTA vermelho]
760–920px    CategoryRail                        [neutro]
920–1200px   WorldDivider GAMING                 [preto, linha vermelha 64px]
1200–1900px  FeatureGridShelf (gaming)           [cards radial-dark]
1900–2400px  CollectionGrid (LINHAS GAMING)      [neutro, fotos lifestyle]
2400–2760px  QuizBanner                          [preto, CTA vermelho]
2760–3040px  WorldDivider PARA O DIA A DIA       [cinza claro, linha vermelha]
3040–3740px  FeatureGridShelf (productivity)     [cards light]
3740–4200px  InterestCardGrid                    [neutro]
4200–4320px  BrandStrip                          [grayscale]
4320–4420px  NewsletterInline                    [cinza claro]
4420+        Footer (com TrustStrip)             [preto]
```

**Total scroll desktop estimado:** ~4500px (vs ~5800px do v3 atual — economia ~22%).

### 5.1 Conteúdo inicial sugerido

**HeroSlider — 3 slides:**

1. Dark/Gaming — kicker "PRO SERIES", title "Drive to Win", CTA vermelho "Comprar agora" + CTA outline "Conheça a linha", produto-herói direita
2. Light/Productivity — kicker "WORKSPACE", title "Setup que entrega", CTA preto "Explorar produtividade", combo teclado+mouse claro
3. Promo — campanha sazonal (Maringá FC, ofertas do mês, etc.)

**FeatureGridShelf gaming:** 1 mouse PRO X hero + 8 produtos gamer (mouses, teclados, headsets, controles)

**CollectionGrid (3 cards):**
1. Zero Opposition — periféricos pro
2. Play Your Way — modulares/customizáveis
3. Win Every Match — performance/refrigeração

**FeatureGridShelf productivity:** 1 combo teclado+mouse office hero + 8 produtos office (teclados sem fio, mouses ergonômicos, webcams, microfones, hubs USB)

**InterestCardGrid (3 cards):**
1. Home Office
2. Criadores de Conteúdo
3. Setup Compacto

**BrandStrip:** 6-8 logos (definir com PCYES — AMD, Intel, NVIDIA, Corsair, etc.)

## 6. Mapeamento de arquivos

| Arquivo atual | Ação |
|---|---|
| `src/app/components/HomePage.tsx` | Reescrever com nova sequência |
| `src/app/components/HeroSection.tsx` | Refatorar → `HeroSlider` com 3 themes + dots c/ progress |
| `src/app/components/CategoryRail.tsx` | Re-skin tokens |
| `src/app/components/FlashDealsStrip.tsx` | Remover (sale vira tag em produto) |
| `src/app/components/ProductShelf.tsx` | Substituir por `FeatureGridShelf` |
| `src/app/components/BannerDuo.tsx` | Remover |
| `src/app/components/BrandsStrip.tsx` | Re-skin |
| `src/app/components/CategorySpotlight.tsx` | Substituir por `InterestCard` |
| `src/app/components/TrustStrip.tsx` | Mover pra dentro do `Footer` |
| `src/app/components/Newsletter.tsx` | Substituir por `NewsletterInline` |
| `src/app/components/Footer.tsx` | Absorver TrustStrip |

**Componentes novos:**
- `WorldDivider`
- `FeatureGridShelf`
- `CollectionCard` + wrapper `CollectionGrid`
- `QuizBanner`
- `InterestCard` + wrapper `InterestCardGrid`
- `NewsletterInline`
- `ProductCard` (variantes `dark`/`light` com radial)

**Componentes existentes a aposentar (não usar):** `FlashDealsStrip`, `BannerDuo`, `CategorySpotlight`, `TrustStrip` (vira parte do footer), `Newsletter` atual.

## 7. Pulso de vermelho ao scroll

Mapeamento dos 6 toques de vermelho intencional ao longo dos ~4500px:

1. **Hero** — dot ativo do slider
2. **WorldDivider GAMING** — linha decorativa 64×2px acima do título
3. **FeatureGridShelf gaming** — sale tags em 2-3 produtos (no máximo)
4. **QuizBanner** — CTA pill vermelho
5. **WorldDivider PARA O DIA A DIA** — linha decorativa 64×2px (mantém DNA cross-world)
6. **FeatureGridShelf productivity** — micro-acentos de preço promocional em 1-2 produtos

Nunca grandes superfícies vermelhas. Vermelho sempre menor que 5% da área visível em qualquer viewport.

## 8. Acessibilidade (WCAG 2.2 AA)

- Contraste mínimo 4.5:1 em todo texto contra fundo (já garantido: `--ink-primary` em `--bg-page`, `--ink-on-dark` em `--bg-world-gaming`, `--accent-red` `#E10600` em branco passa 4.6:1)
- Foco visível em todos elementos interativos: outline 2px `--accent-red`, offset 2px
- `prefers-reduced-motion`: desabilitar parallax, zoom de hover, scroll-snap automático; manter crossfade slider em 200ms
- Slider hero: pause em hover/focus, controles de teclado (setas left/right), aria-live polite no slide ativo
- Texto sobre overlay (InterestCard, CollectionCard): garantir contraste com gradient stop suficiente
- `alt` semântico em todas as imagens de produto e lifestyle

## 9. Responsivo

**Breakpoints (Tailwind v4 default):**
- `sm` 640px
- `md` 768px
- `lg` 1024px (desktop começa)
- `xl` 1280px
- `2xl` 1536px (container max-width 1440px)

**Mobile-first:** todas seções definidas em mobile primeiro, escala para desktop. Grid de produtos sempre 2 cols mobile, 3 tablet, 4 desktop.

## 10. Performance

- Imagens hero: WebP + `<picture>` com fallback. Lazy-load tudo abaixo do fold (CategoryRail+).
- `srcset` por densidade em todo `<ProductCard>`.
- Vídeo YouTube no slide hero: `loading="lazy"` no iframe, só renderiza ao virar slide ativo.
- `motion` (framer): usar `viewport: { once: true }` em reveal animations.
- Não precarregar fontes além de Figtree 300/400/500 + Inter 400/500.

## 11. Fora de escopo (próximas iterações)

- Otimização SEO específica (schema.org Product, ItemList, Breadcrumb)
- A/B test de ordem dos mundos (Gaming primeiro vs. Produtividade primeiro)
- Personalização baseada em histórico (ex: usuário já comprou produtividade → Produtividade primeiro)
- Hero com produto 3D interativo
- Vídeo loop em FeatureGridShelf hero-card

## 12. Critérios de sucesso

- 12 blocos renderizados na sequência especificada em desktop e mobile
- Pulso de vermelho: 6 toques no máximo, nenhum bloco chapado de vermelho
- Scroll total desktop ~4500px ±10%
- Lighthouse Performance ≥ 85 em mobile
- Lighthouse Accessibility ≥ 95
- Nenhum CLS visível durante carregamento
- Hero slider: troca de slide ≤ 800ms (crossfade + render)
- FeatureGridShelf: hover do hero-card responsivo (60fps em desktop mid-tier)
