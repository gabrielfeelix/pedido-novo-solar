# Oderço — Design System (extraído do Figma)

Fonte: `figma.com/design/I5OVPQWHeYR4wJjrumiGSe` — capturado em 2026-05-13.
Este arquivo é a **fonte de verdade visual**. `theme.css` deve refletir estes tokens.

---

## 1. Cores — Brand

| Token | Hex | Uso |
|---|---|---|
| Brand/Blue/Default | `#005AFF` | Primary — botões, links, CTAs, accents |
| Brand/Blue/Dark | `#0D1D52` | Foreground principal, hover de primary, navy nav bar |
| Brand/Blue/Light | `#E5EFFF` | Surface clara, hover sutil, background de banner promo |

## 2. Cores — Texto / Cinzas neutros

| Token | Hex | Uso |
|---|---|---|
| System/Black | `#101010` | Texto extra-forte, ícones |
| Grey/700 (≈) | `#0D1D52` | Texto title (mesmo navy) |
| Grey/500 | `#A5A7A9` | Muted text, placeholders |
| Grey/300 | `#D7D8DA` | Bordas, dividers, disabled bg |
| System/White | `#FAFAFA` | Background base, card |

> **Regra DS:** `Text` usa apenas as variações navy → cinza médio → cinza claro.

## 3. Cores — Status (3 tons cada)

| Status | 500 (forte) | 300 (médio) | 100 (surface) |
|---|---|---|---|
| **Success** | `#4CD964` | `#90E49E` | `#D3EFD8` |
| **Warning** | `#FFA400` | `#FBC462` | `#F7E5C4` |
| **Danger**  | `#FF3B30` | `#FB857F` | `#F7D0CE` |

Padrão de uso:
- 500 = ícone, texto forte
- 300 = bordas
- 100 = surface/bg de pill/card

## 4. Tipografia

**Fonte única: `Red Hat Display`** (Regular 400 · Bold 700)

| Estilo | Tamanho | Peso | Uso |
|---|---|---|---|
| H1 | 48px | Bold | Hero |
| H2 | 36px | Bold | Section title |
| H3 | 36px | Regular | Subtitle pesado |
| H4 | 24px | Bold | Card title, section interna |
| H5 | 24px | Regular | Subhead |
| P1 | 16px | Reg/Bold | Body padrão |
| P2 | 14px | Reg/Bold | Body secundário, label |
| P3 | 12px | Reg/Bold | Caption, badge, micro-info |

> ⚠️ **Sem Inter**. Atual usa Inter para body — divergência. Migrar tudo para Red Hat Display.

## 5. Grid

| Breakpoint | Largura | Cols | Gutter | Col width |
|---|---|---|---|---|
| Desktop | 1440px | 12 | 32px | 64px |
| Mobile  | 300px  | 4  | 16px | 16px |

Container max-width prática: `1120-1280px` centralizado, padding lateral 24-32px desktop / 16px mobile.

## 6. Botões

6 variantes × 3 estados (Default · Hover · Disabled):

| Variante | Default | Hover | Disabled |
|---|---|---|---|
| **Primary** | bg `#005AFF` · texto white · radius 6 | bg `#0D1D52` · texto white | bg `#D7D8DA` · texto branco |
| **Primary + Icon** | mesmo + ícone leading (check, cart) | mesmo navy | mesmo |
| **Secondary** | bg white · border `#005AFF` · texto `#005AFF` | border + texto `#0D1D52` | border + texto `#D7D8DA` |
| **Secondary + Icon** | mesmo + ícone | mesmo navy | mesmo |
| **Text** | só texto `#005AFF` | texto `#0D1D52` | texto `#D7D8DA` |
| **Text + Icon** | texto + ícone external `#005AFF` | navy | grey |

Botões custom observados:
- **Cart Add Filled:** bg primary, texto white, ícone cart, "Adicionar", radius 6, h~40
- **Cart Add Dark:** bg navy `#0D1D52`, mesmo conteúdo
- **Timer Button:** bg primary fill OR outline + ícone clock + texto "10:30:09" formato, radius 6, h~36

## 7. Inputs / Forms

**Input text:**
- Label `P3` acima do campo
- Field: bg `#FAFAFA`, border `#D7D8DA`, radius 6, h ~44
- Hover/Focus: border `#005AFF` (ring sutil)
- Placeholder: `#A5A7A9`

**Select / Dropdown:**
- Mesma anatomia do input + chevron `#0D1D52`
- Aberto: chevron flip, item ativo bg `#E5EFFF`, texto `#005AFF`
- Items hover: bg `#FAFAFA`

**Checkbox:**
- Default: border `#D7D8DA` · radius 4 · 16×16
- Selected: bg `#005AFF` · check white
- Disabled: bg `#D7D8DA`

**Radio:**
- Default: border `#D7D8DA` · 16×16
- Selected: outer ring `#005AFF` + dot interno `#005AFF` (preenche círculo grande)
- Disabled: olho cortado / muted

## 8. Ícones

Sistema **filled-square**:
- 40×40, radius 6, bg `#005AFF`, ícone white 1.5-2px stroke OU filled
- Catálogo observado: cart, filter, plus, check, arrow-left, heart, package, barcode, trophy, eye, settings, user, truck, trending-up, file-plus, search, shield, file, mail, file-out, clock, timer, tag, clipboard, upload, external-link, pin, user-circle, briefcase, mail-fill, phone, calendar, menu

Variantes "ghost":
- Mesmo glyph, sem bg, stroke `#005AFF` (usado inline em texto)

## 9. Cards

### 9.1 Product Card (dual filial)
- Container: white, radius 8-12, shadow leve
- Imagem: top, padding interno
- SKU + FILIAL pill (top-right, "FILIAL PR" texto bold P3)
- Nome produto: P1 bold uppercase
- Brand pill: "PCYES" bg muted, P3
- **Preço dual (radio):** 2 linhas verticais
  - `( ) R$ 47,52  PR`
  - `( ) R$ 47,52  ES`
  - Selecionado tem bullet primary fill
- Subtexto: "Valores com IPI + ST (Caso Houver)" P3 muted
- Stepper qty + select unidade ("Caixa mãe")
- CTA "Adicionar" full-width primary OU timer button

### 9.2 Pedido / Order Status Card
- Container: white, radius 8, shadow elevation-sm
- Header: `Pedido: #846132028` bold + status pill alinhado direita
  - `Confirmado` (blue surface) / `Pendente` (yellow surface) / `Entregue` (green surface) / `Cancelado` (red)
- Linhas key:value: `Qtde Itens: 12`, `Data do Pedido: ...`, `Filial: PR`, `Forma de Pgto: Boleto a Vista`, `Valor Total: R$15.048,23`, `Data Faturamento: ...`, `Nº NF: 9845230`
- Footer: link "Detalhes" com ícone external

### 9.3 Boleto Card
- Container white, radius 8
- Grid 3 colunas: Pedido / Filial / Boleto (ID + link)
- Linhas: Emissão, Vencimento, Valor, Parcela, Status (vermelho se Vencido)

### 9.4 Highlight Card (Limite, Nível)
- "Total de Limite" + 2 valores side-by-side (Utilizado warning · Disponível success)
- "Nível Diamante" — bg branca + texto primary destacado, progress bar, link "Conheça programa fidelidade"

## 10. Status Pills (chips)

| Status | bg | texto |
|---|---|---|
| Pendente | warning/100 `#F7E5C4` | warning/500 |
| Confirmado | brand/light `#E5EFFF` | brand/default `#005AFF` |
| Entregue | success/100 `#D3EFD8` | success/500 |
| Cancelado | danger/100 `#F7D0CE` | danger/500 |

Anatomia: radius full, padding `4px 10px`, `P3 bold`.

## 11. Header / Nav (homepage)

- Top bar branca: logo Oderço esquerda · search center (rounded full, primary search button) · "Entre ou Cadastre-se" + cart pill direita
- Sub-nav navy `#0D1D52`: hambúrguer + categorias horizontais (texto white P2)
- Hero: bg azul claro `#E5EFFF` com mockup produto + título marca

## 12. Banner promocional (3-up)

- Cards horizontais bg `#E5EFFF`, radius 8
- Esquerda: kicker P3 + título H4 bold navy + link "Ver Tudo" primary
- Direita: imagem produto

---

## 🔄 Audit: theme.css atual vs DS Figma

| Token CSS | Atual | DS Figma | Ação |
|---|---|---|---|
| `--background` | `#F8FAFC` | `#FAFAFA` | ⚠️ Alinhar |
| `--foreground` | `#0D1D52` | `#0D1D52` | ✅ OK |
| `--primary` | `#005AFF` | `#005AFF` | ✅ OK |
| `--card` | `#FFFFFF` | `#FAFAFA` | ⚠️ Marginal — manter `#FFF` para contraste |
| `--success` | `#22C55E` | `#4CD964` | ❌ Trocar |
| `--success` (surface) | derivada | `#D3EFD8` | ⚠️ Tokenizar |
| `--warning` | `#F59E0B` | `#FFA400` | ❌ Trocar |
| `--warning-surface` | derivada | `#F7E5C4` | ⚠️ Tokenizar |
| `--destructive-foreground` | `#FB857F` | `#FB857F` (Danger 300) | ✅ OK |
| Falta token "danger 500" | — | `#FF3B30` | ➕ Adicionar |
| `--muted` | `#E7E8EE` | `#D7D8DA` | ⚠️ Alinhar |
| `--muted-foreground` | `#868EA8` | `#A5A7A9` | ⚠️ Alinhar |
| `--font-inter` | usado em ~40% dos componentes | NÃO existe no DS | ❌ Remover gradativamente — DS é Red Hat Display only |
| `--text-3xl` (30px) | tem | DS pula | manter (extra OK) |
| `--text-xl` (20px) | tem | DS pula | manter |
| Status pills (Confirmado/Pendente/Entregue) | inexistente | definidos | ➕ Adicionar utility |
| NF colors (PR navy / ES roxo) | tem | NÃO existem no DS — são data field custom | manter como acento sutil, não competir com primary |

---

## 🎯 Decisão de aplicação no protótipo de Cart/Checkout

1. **Migrar tokens divergentes** (success, warning, muted) sem renomear vars — só refresh dos hex
2. **Reduzir uso de Inter** progressivamente; novos componentes Red Hat Display
3. **Padronizar botões** para 6 variantes do DS — primary/secondary/text × icon
4. **Status pills** usar paleta DS oficial
5. **Cards** seguir anatomia DS (radius 8, shadow elevation-sm, padding 16-24)
6. **NF (PR/ES)** continua como data-field cromático, mas APENAS:
   - badge fill (avatar tipo "PR"/"ES")
   - thin border-left no card (3px)
   - texto accent em title da NF
   - **NUNCA** preencher card todo com surface PR/ES (quebra DS)
