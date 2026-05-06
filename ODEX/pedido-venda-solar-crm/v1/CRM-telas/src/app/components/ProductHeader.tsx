import { ArrowLeft, ArrowRightLeft, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { type Product } from '../data/mockData';
import { Badge } from './ui/Badge';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import productImg from 'figma:asset/9d0fce106cad781cccc55f895143cdc7f73d44f5.png';
import pcyesLogo from 'figma:asset/cf86a9e305f37855c42f6db110c143a10ed51f95.png';

const brandColors: Record<string, string> = {
  Quati: '#6DB33F', odex: '#0D1D52', PCYES: '#8E44AD',
  Vinik: '#0B9A8D', Tonante: '#1A1A1A',
};

const filialNames: Record<string, string> = {
  PR: 'Paraná',
  ES: 'Espírito Santo',
  RJ: 'Rio de Janeiro',
  MA: 'Maranhão',
};

const filialColors: Record<string, { bg: string; text: string; border: string }> = {
  PR: { bg: 'color-mix(in srgb, var(--primary) 8%, transparent)', text: 'var(--primary)', border: 'color-mix(in srgb, var(--primary) 20%, transparent)' },
  ES: { bg: 'color-mix(in srgb, #059669 6%, transparent)', text: '#047857', border: 'color-mix(in srgb, #059669 15%, transparent)' },
  RJ: { bg: 'color-mix(in srgb, #DC2626 6%, transparent)', text: '#B91C1C', border: 'color-mix(in srgb, #DC2626 15%, transparent)' },
  MA: { bg: 'color-mix(in srgb, #7C3AED 6%, transparent)', text: '#6D28D9', border: 'color-mix(in srgb, #7C3AED 15%, transparent)' },
};

// Mock purchase history data
const mockPurchaseHistory = [
  { fornecedor: 'PCYES Tecnologia', data: '20/02/2026', precoUnit: 41.00, qtd: 8000, total: 328000, markup: 68, lucro: 56 },
  { fornecedor: 'PCYES Tecnologia', data: '05/01/2026', precoUnit: 40.50, qtd: 5200, total: 210600, markup: 64, lucro: 52 },
  { fornecedor: 'PCYES Tecnologia', data: '12/11/2025', precoUnit: 39.80, qtd: 11500, total: 457700, markup: 61, lucro: 49 },
];

interface ProductHeaderProps {
  product: Product;
  filial: 'PR' | 'ES' | 'RJ' | 'MA';
  siblingFilials?: {
    filial: 'PR' | 'ES' | 'RJ' | 'MA';
    productId: string;
  }[];
}

export function ProductHeader({ product, filial, siblingFilials }: ProductHeaderProps) {
  const navigate = useNavigate();
  const [showAgingDetail, setShowAgingDetail] = useState(false);
  const [giroExpanded, setGiroExpanded] = useState(false);

  // Use only the active filial's data
  const activeFilialData = product.filiais.find((f) => f.filial === filial)!;
  const totalEstoque = activeFilialData.estoque;
  const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Aging values
  const baseAgingValue = totalEstoque * activeFilialData.custoMedioNet;
  const agingMultiplier = baseAgingValue < 5000 ? 28 : baseAgingValue < 20000 ? 12 : baseAgingValue < 80000 ? 4 : 1.8;
  const totalInventoryValue = baseAgingValue * agingMultiplier;
  const agingTiers = [
    { label: '0–30d', pct: 45, color: '#059669', qty: Math.round(totalEstoque * 0.45), value: Math.round(totalInventoryValue * 0.45) },
    { label: '31–90d', pct: 30, color: '#D97706', qty: Math.round(totalEstoque * 0.30), value: Math.round(totalInventoryValue * 0.30) },
    { label: '91–180d', pct: 18, color: '#EA580C', qty: Math.round(totalEstoque * 0.18), value: Math.round(totalInventoryValue * 0.18) },
    { label: '180d+', pct: 7, color: '#DC2626', qty: Math.round(totalEstoque * 0.07), value: Math.round(totalInventoryValue * 0.07) },
  ];
  const totalAgingValue = agingTiers.reduce((s, t) => s + t.value, 0);
  const dominantAging = agingTiers[0];

  const giro60 = activeFilialData.giro60;
  const giroValues = useMemo(() => {
    const g7d = Math.floor(Math.random() * 5 + 1);
    const g30d = Math.floor(Math.random() * 15 + 2);
    const g45d = Math.floor(g30d * 1.4 + Math.random() * 5);
    return { giro7d: g7d, giro30d: g30d, giro45d: g45d };
  }, []);
  const { giro7d, giro30d, giro45d } = giroValues;

  // Build detail attributes
  const details = [
    product.ncm ? `NCM ${product.ncm}` : null,
    product.ean ? `EAN ${product.ean}` : null,
    `Cx.Mãe ${product.caixaMae ?? '—'}`,
    `Múlt. ${product.multiplo ?? 1}`,
    product.pesoUnit != null
      ? `${product.pesoUnit >= 1 ? `${product.pesoUnit.toFixed(1)} kg` : `${(product.pesoUnit * 1000).toFixed(0)} g`}`
      : null,
    product.garantia ?? null,
  ].filter(Boolean);

  const brandColor = brandColors[product.marca] || '#666';

  // Coverage days
  const coverageDays = giro60 > 0 ? Math.round((totalEstoque / giro60) * 60) : 0;

  // Filial styling
  const fc = filialColors[filial] || filialColors.PR;

  // Verba per filial
  const verbaValor = filial === 'ES' ? 3250.00 : 4780.00;
  const verbaPeriodo = filial === 'ES' ? 'Trimestral' : 'Mensal';

  return (
    <div>
      <div className="pt-5 pb-0">
        {/* ── Row 1: Back + Product identity ── */}
        <div className="flex items-start gap-6 mb-5">
          {/* Back button — aligned to top */}
          <button
            onClick={() => navigate('/cadastros/formacao-preco')}
            className="p-2 rounded-[var(--radius)] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer mt-2 shrink-0"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Product photo — larger, more prominent */}
          <div
            className="shrink-0 flex items-center justify-center rounded-[var(--radius-card)]"
            style={{
              width: '128px',
              height: '128px',
              background: 'transparent',
              border: '1px solid var(--border)',
              padding: '8px',
            }}
          >
            <img
              src={productImg}
              alt={product.descricao}
              className="object-contain"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Text column — improved hierarchy */}
          <div className="flex-1 min-w-0 pt-1">
            {/* ── Level 0: Identification — SKU + Brand (plain text, no fills) ── */}
            <div className="flex items-center gap-2.5 mb-1.5">
              <span
                className="tabular-nums"
                style={{
                  fontSize: '12px',
                  fontWeight: 'var(--font-weight-medium)',
                  fontFamily: "'Inter', sans-serif",
                  color: 'var(--muted-foreground)',
                  letterSpacing: '0.3px',
                }}
              >
                {product.codOderco}
              </span>
              <span style={{ fontSize: '8px', color: 'var(--muted)' }}>·</span>
              {/* Brand — logo or text, NO background box */}
              {product.marca === 'PCYES' ? (
                <img
                  src={pcyesLogo}
                  alt="PCYES"
                  style={{ height: '12px', objectFit: 'contain', opacity: 0.7 }}
                />
              ) : (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 'var(--font-weight-bold)',
                    fontFamily: "'Inter', sans-serif",
                    color: brandColor,
                    letterSpacing: '0.3px',
                    opacity: 0.8,
                  }}
                >
                  {product.marca}
                </span>
              )}
            </div>

            {/* ── Level 1: Product name — hero text ── */}
            <h1
              className="truncate"
              style={{
                fontSize: '20px',
                fontWeight: 'var(--font-weight-bold)',
                fontFamily: "'Red Hat Display', sans-serif",
                color: 'var(--foreground)',
                lineHeight: '1.3',
                letterSpacing: '-0.02em',
                marginBottom: '12px',
              }}
              title={product.descricao}
            >
              {product.descricao}
            </h1>

            {/* ── Level 2: Filial context + navigation ── */}
            <div className="flex items-center gap-3 mb-3">
              {/* Active filial — the ONLY element with a colored fill */}
              <Badge
                variant="outline"
                style={{
                  fontSize: '11px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 'var(--font-weight-semibold)',
                  color: fc.text,
                  background: fc.bg,
                  border: `1px solid ${fc.border}`,
                  gap: '6px',
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  paddingTop: '4px',
                  paddingBottom: '4px',
                }}
                icon={
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: fc.text }}
                  />
                }
              >
                {filial} — {filialNames[filial]}
              </Badge>

              {/* Separator between context badge and navigation actions */}
              {siblingFilials && siblingFilials.length > 0 && (
                <div
                  style={{
                    width: 1,
                    height: 16,
                    background: 'var(--border)',
                    flexShrink: 0,
                  }}
                />
              )}

              {/* Sibling filials — text links, NOT badges */}
              {siblingFilials && siblingFilials.length > 0 && siblingFilials.map((sib) => {
                const sibFc = filialColors[sib.filial] || filialColors.PR;
                return (
                  <button
                    key={sib.filial}
                    className="flex items-center gap-1.5 cursor-pointer transition-colors"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '2px 0',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '11px',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--muted-foreground)',
                    }}
                    onClick={() => navigate(`/produto/${sib.productId}/${sib.filial}`)}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = sibFc.text;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)';
                    }}
                  >
                    <ArrowRightLeft size={11} />
                    <span>Ver {sib.filial}</span>
                  </button>
                );
              })}
            </div>

            {/* ── Level 3: Metadata — lightest layer ── */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {details.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <span style={{ fontSize: '8px', color: 'var(--muted)', margin: '0 2px' }}>·</span>
                  )}
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: "'Inter', sans-serif",
                      color: 'color-mix(in srgb, var(--muted-foreground) 70%, transparent)',
                      fontWeight: 'var(--font-weight-normal)',
                    }}
                  >
                    {item}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 2: Metrics — 6 individual KPI cards ── */}
        <div className="grid grid-cols-6 gap-3">
          {/* Estoque */}
          <KpiCard>
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={kpiLabelStyle} className="cursor-help">ESTOQUE</span>
              </TooltipTrigger>
              <TooltipContent>Quantidade disponível em estoque na filial ativa</TooltipContent>
            </Tooltip>
            <div className="mt-2">
              <span style={{ ...kpiValueStyle, fontSize: '22px' }}>
                {totalEstoque.toLocaleString('pt-BR')}
              </span>
            </div>
            <span className="mt-2 block" style={kpiSubStyle}>
              Cobertura ~{coverageDays} dias
            </span>
          </KpiCard>

          {/* CMV */}
          <KpiCard>
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={kpiLabelStyle} className="cursor-help">CMV</span>
              </TooltipTrigger>
              <TooltipContent>Custo da Mercadoria Vendida — custo médio líquido de aquisição descontados impostos recuperáveis</TooltipContent>
            </Tooltip>
            <div className="mt-2">
              <span className="tabular-nums" style={kpiValueStyle}>
                R$ {fmt(activeFilialData.custoMedioNet)}
              </span>
            </div>
            <span className="mt-2 block" style={kpiSubStyle}>
              Custo médio net
            </span>
          </KpiCard>

          {/* Giro 60d */}
          <KpiCard
            onClick={() => setGiroExpanded(!giroExpanded)}
            className="cursor-pointer"
            active={giroExpanded}
          >
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span style={kpiLabelStyle} className="cursor-help">GIRO 60D</span>
                </TooltipTrigger>
                <TooltipContent>Unidades vendidas nos últimos 60 dias — indica a velocidade de saída do produto</TooltipContent>
              </Tooltip>
              {giroExpanded ? (
                <ChevronUp size={12} style={{ color: 'var(--muted-foreground)' }} />
              ) : (
                <ChevronDown size={12} style={{ color: 'var(--muted-foreground)' }} />
              )}
            </div>

            {!giroExpanded ? (
              <>
                <div className="mt-2">
                  <span style={kpiValueStyle}>
                    {giro60.toLocaleString('pt-BR')}
                  </span>
                </div>
                <span className="mt-2 block" style={kpiSubStyle}>
                  7d: {giro7d} · 30d: {giro30d}
                </span>
              </>
            ) : (
              <div className="flex items-end gap-4 mt-2.5">
                {[
                  { label: '7d', value: giro7d },
                  { label: '30d', value: giro30d },
                  { label: '45d', value: giro45d },
                  { label: '60d', value: giro60 },
                ].map(g => (
                  <div key={g.label} className="flex flex-col items-center">
                    <span style={{ fontSize: '14px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Red Hat Display', sans-serif", color: 'var(--foreground)', lineHeight: '1' }}>
                      {g.value}
                    </span>
                    <span style={{ fontSize: '9px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)', marginTop: '3px' }}>
                      {g.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </KpiCard>

          {/* Aging */}
          <KpiCard
            className="relative cursor-default"
            onMouseEnter={() => setShowAgingDetail(true)}
            onMouseLeave={() => setShowAgingDetail(false)}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={kpiLabelStyle} className="cursor-help">AGING</span>
              </TooltipTrigger>
              <TooltipContent>Tempo médio de permanência do estoque — classifica a "idade" do inventário por faixas</TooltipContent>
            </Tooltip>
            <div className="mt-2 flex items-baseline gap-2">
              <span style={kpiValueStyle}>
                {dominantAging.pct}%
              </span>
              <span
                className="rounded-full"
                style={{
                  fontSize: '10px',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontFamily: "'Inter', sans-serif",
                  color: dominantAging.color,
                  background: `color-mix(in srgb, ${dominantAging.color} 12%, transparent)`,
                  padding: '2px 8px',
                }}
              >
                {dominantAging.label}
              </span>
            </div>
            {/* Segmented bar */}
            <div className="flex h-1.5 rounded-full overflow-hidden mt-3 gap-px">
              {agingTiers.map((t) => (
                <div key={t.label} className="rounded-full" style={{ width: `${t.pct}%`, background: t.color }} />
              ))}
            </div>

            {/* ── Aging hover tooltip ── */}
            {showAgingDetail && (
              <div
                className="absolute left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-[var(--radius-card)]"
                style={{
                  top: 'calc(100% + 6px)',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  minWidth: '280px',
                }}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.4px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)' }}>
                    DISTRIBUIÇÃO DO AGING
                  </span>
                  <span className="tabular-nums" style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Inter', sans-serif", color: 'var(--foreground)' }}>
                    R$ {fmt(totalAgingValue)}
                  </span>
                </div>
                <div className="space-y-2">
                  {agingTiers.map((tier) => (
                    <div key={tier.label} className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: tier.color }} />
                      <span style={{ fontSize: '11px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)', minWidth: '50px' }}>
                        {tier.label}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--secondary)' }}>
                        <div className="h-full rounded-full" style={{ width: `${tier.pct}%`, background: tier.color }} />
                      </div>
                      <span className="tabular-nums" style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Inter', sans-serif", color: tier.color, minWidth: '70px', textAlign: 'right' }}>
                        R$ {fmt(tier.value)}
                      </span>
                      <span className="tabular-nums" style={{ fontSize: '10px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)', minWidth: '30px', textAlign: 'right' }}>
                        {tier.qty} un
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </KpiCard>

          {/* Verba */}
          <KpiCard>
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={kpiLabelStyle} className="cursor-help">VERBA</span>
              </TooltipTrigger>
              <TooltipContent>Valor de verba negociada com o fornecedor para este produto/filial</TooltipContent>
            </Tooltip>
            <div className="mt-2">
              <span style={kpiValueStyle}>
                R$ {fmt(verbaValor)}
              </span>
            </div>
            <span className="mt-2 block" style={kpiSubStyle}>
              {verbaPeriodo}
            </span>
          </KpiCard>

          {/* Compra */}
          <div className="compra-kpi-wrapper relative">
            <style>{`
              .compra-kpi-wrapper .compra-popover { opacity: 0; pointer-events: none; transition: opacity 0.15s ease; }
              .compra-kpi-wrapper:hover .compra-popover { opacity: 1; pointer-events: auto; }
            `}</style>
            <div
              className="h-full rounded-[var(--radius-card)] px-5 py-4"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex items-center justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span style={kpiLabelStyle} className="cursor-help">COMPRA</span>
                  </TooltipTrigger>
                  <TooltipContent>Última ordem de compra registrada — passe o mouse para ver o histórico completo</TooltipContent>
                </Tooltip>
                <Clock
                  size={14}
                  style={{ color: 'var(--muted-foreground)' }}
                />
              </div>
              <div className="mt-2">
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: '15px',
                    fontWeight: 'var(--font-weight-bold)',
                    fontFamily: "'Red Hat Display', sans-serif",
                    color: 'var(--foreground)',
                    lineHeight: '1',
                  }}
                >
                  #PC-48721
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span style={{ fontSize: '11px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)' }}>
                  Prev. <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-semibold)', fontFamily: "'Inter', sans-serif", color: 'var(--foreground)' }}>15/08/2026</span>
                </span>
                <span style={{ fontSize: '8px', color: 'var(--muted)' }}>·</span>
                <span style={{ fontSize: '11px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)' }}>
                  Qtd. <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-semibold)', fontFamily: "'Inter', sans-serif", color: 'var(--foreground)' }}>800 un.</span>
                </span>
              </div>
            </div>

            {/* ── Purchase History Popover ── */}
            <div
              className="compra-popover absolute right-0 z-50 rounded-[var(--radius-card)]"
              style={{
                top: 'calc(100% + 6px)',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                minWidth: '340px',
              }}
            >
              <div className="flex items-center justify-between px-4 pt-3 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '12px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Red Hat Display', sans-serif", color: 'var(--foreground)' }}>
                  Histórico de Compras
                </span>
              </div>
              <div className="px-4 py-2 space-y-0">
                {mockPurchaseHistory.map((h, i) => (
                  <div
                    key={i}
                    className="py-2.5"
                    style={{ borderBottom: i < mockPurchaseHistory.length - 1 ? '1px solid color-mix(in srgb, var(--border) 50%, transparent)' : 'none' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="block truncate" style={{ fontSize: '11px', fontWeight: 'var(--font-weight-semibold)', fontFamily: "'Inter', sans-serif", color: 'var(--foreground)' }}>
                          {h.fornecedor}
                        </span>
                        <span style={{ fontSize: '10px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)' }}>
                          {h.data} · {h.qtd.toLocaleString('pt-BR')} un.
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block tabular-nums" style={{ fontSize: '13px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Inter', sans-serif", color: 'var(--foreground)' }}>
                          R$ {h.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="tabular-nums" style={{ fontSize: '10px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)' }}>
                          R$ {h.precoUnit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/un.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span style={{ fontSize: '10px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)' }}>
                        Markup <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Inter', sans-serif", color: 'var(--foreground)' }}>{h.markup}%</span>
                      </span>
                      <span style={{ fontSize: '10px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)' }}>
                        Lucro <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Inter', sans-serif", color: 'var(--foreground)' }}>{h.lucro}%</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared KPI typography styles ── */
const kpiLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 'var(--font-weight-semibold)' as any,
  letterSpacing: '0.3px',
  fontFamily: "'Inter', sans-serif",
  color: 'var(--muted-foreground)',
};

const kpiValueStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'var(--font-weight-bold)' as any,
  fontFamily: "'Red Hat Display', sans-serif",
  color: 'var(--foreground)',
  lineHeight: '1',
};

const kpiSubStyle: React.CSSProperties = {
  fontSize: '11px',
  fontFamily: "'Inter', sans-serif",
  color: 'var(--muted-foreground)',
};

/* ── Reusable KPI Card wrapper ── */
function KpiCard({
  children,
  className = '',
  active = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <div
      className={`rounded-[var(--radius-card)] px-5 py-4 min-w-0 ${className}`}
      style={{
        background: active ? 'color-mix(in srgb, var(--secondary) 40%, var(--card))' : 'var(--card)',
        border: '1px solid var(--border)',
        transition: 'background 150ms ease',
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}