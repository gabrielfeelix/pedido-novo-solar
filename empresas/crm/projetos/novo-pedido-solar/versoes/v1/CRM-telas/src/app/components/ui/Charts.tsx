import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart as RechartsAreaChart,
} from 'recharts';

/* ═══════════════════════════════════════════════════════
   CHART COLOR PALETTE
   Tokens defined in theme.css → --chart-1 … --chart-5
   #F54A00  #009689  #FFB900  #FE9A00  #104E64
═══════════════════════════════════════════════════════ */
export const CHART_COLORS = [
  'var(--chart-1)', /* #F54A00  red-orange */
  'var(--chart-2)', /* #009689  teal       */
  'var(--chart-3)', /* #FFB900  amber      */
  'var(--chart-4)', /* #FE9A00  orange     */
  'var(--chart-5)', /* #104E64  dark teal  */
];

/* ═══════════════════════════════════════════════════════
   SHARED TYPES
═══════════════════════════════════════════════════════ */
export interface ChartDataItem {
  /** Segment / bar / point label */
  name: string;
  /** Numeric value */
  value: number;
  /** Optional per-item color override; otherwise uses palette order */
  color?: string;
}

export type TooltipVariant = 'stacked' | 'simple' | 'bar-divider';

/* ═══════════════════════════════════════════════════════
   INTERNAL HELPERS
═══════════════════════════════════════════════════════ */

/** Three-segment "AL" indicator — matches the Figma dot-bar graphic */
function AlIndicator({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 3,
        height: 11,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
      aria-hidden="true"
    >
      <div style={{ flex: 1, background: color, borderRadius: 1 }} />
      <div style={{ height: 3, background: color, borderRadius: 1 }} />
      <div style={{ flex: 1, background: color, borderRadius: 1 }} />
    </div>
  );
}

/** Shared inline text styles — avoids the global `span { font-size: var(--text-base) }` override */
const TEXT = {
  title: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    fontWeight: 'var(--font-weight-semibold)' as const,
    lineHeight: '16px',
    color: 'var(--foreground)',
    whiteSpace: 'nowrap' as const,
  },
  label: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    fontWeight: 'var(--font-weight-normal)' as const,
    lineHeight: '16px',
    color: 'var(--muted-foreground)',
    whiteSpace: 'nowrap' as const,
    flex: '1 0 0' as const,
    minWidth: 0,
  },
  value: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    fontWeight: 'var(--font-weight-semibold)' as const,
    lineHeight: '16px',
    color: 'var(--foreground)',
    flexShrink: 0,
    whiteSpace: 'nowrap' as const,
  },
};

const TOOLTIP_BASE: React.CSSProperties = {
  background: 'var(--card)',
  borderRadius: 'var(--radius-card)',
  border: '1px solid color-mix(in srgb, var(--border) 25%, transparent)',
  boxShadow: 'var(--elevation-sm)',
  display: 'flex',
  flexShrink: 0,
};

/* ═══════════════════════════════════════════════════════
   CHART TOOLTIP CONTENT
   Recharts-compatible (pass as `content={…}` on <Tooltip>)
   and usable standalone for layout demonstrations.
═══════════════════════════════════════════════════════ */
export interface ChartTooltipContentProps {
  /** Injected by recharts – only render when true (ignored if undefined → standalone) */
  active?: boolean;
  /** Injected by recharts – series data for the hovered point */
  payload?: Array<{ name: string; value: number; color: string; fill?: string }>;
  /** Injected by recharts – X-axis label of the hovered point */
  label?: string;
  /** Visual variant */
  variant?: TooltipVariant;
  /** Custom value formatter */
  formatter?: (value: number, name: string) => string;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  variant = 'stacked',
  formatter,
}: ChartTooltipContentProps) {
  // When used inside recharts, hide if not active
  if (active === false) return null;

  const items = (payload ?? []).map((p) => ({
    name: p.name,
    value: p.value,
    color: p.fill ?? p.color,
  }));

  const fmt = (v: number, n: string) => (formatter ? formatter(v, n) : String(v));

  /* ── Variant 1: Stacked (multi-series, AL dot-bar indicators) ── */
  if (variant === 'stacked') {
    return (
      <div
        style={{
          ...TOOLTIP_BASE,
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '8px 12px',
          gap: 4,
          minWidth: 128,
        }}
        data-name=".Chart Tooltip 1"
      >
        {label && <p style={{ ...TEXT.title, width: '100%' }}>{label}</p>}
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
            <AlIndicator color={item.color} />
            <p style={TEXT.label}>{item.name}</p>
            <p style={TEXT.value}>{fmt(item.value, item.name)}</p>
          </div>
        ))}
      </div>
    );
  }

  /* ── Variant 2: Simple (single item, color square + label + value) ── */
  if (variant === 'simple') {
    const item = items[0];
    return (
      <div
        style={{
          ...TOOLTIP_BASE,
          flexDirection: 'row',
          alignItems: 'center',
          padding: '8px 12px',
          gap: 8,
          minWidth: 120,
        }}
        data-name=".Chart Tooltip 2"
      >
        {item ? (
          <>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: item.color,
                flexShrink: 0,
              }}
            />
            <p style={TEXT.label}>{item.name}</p>
            <p style={TEXT.value}>{fmt(item.value, item.name)}</p>
          </>
        ) : null}
      </div>
    );
  }

  /* ── Variant 3: Bar-divider (colored left border + title + label/value) ── */
  if (variant === 'bar-divider') {
    const item = items[0];
    const dividerColor = item?.color ?? 'var(--chart-1)';
    return (
      <div
        style={{
          ...TOOLTIP_BASE,
          flexDirection: 'row',
          alignItems: 'center',
          padding: '8px 12px',
          gap: 12,
          minWidth: 124,
        }}
        data-name=".Chart Tooltip 3"
      >
        {/* Colored left-border divider */}
        <div
          style={{ width: 3, height: 32, borderRadius: 2, background: dividerColor, flexShrink: 0 }}
          aria-hidden="true"
        />
        {/* Content block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: '1 0 0', minWidth: 0 }}>
          {label && <p style={TEXT.title}>{label}</p>}
          {item && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <p style={TEXT.label}>{item.name}</p>
              <p style={TEXT.value}>{fmt(item.value, item.name)}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

/* ═══════════════════════════════════════════════════════
   CHART LEGEND
═══════════════════════════════════════════════════════ */
export interface ChartLegendProps {
  items: ChartDataItem[];
  formatter?: (value: number, name: string) => string;
  /** 'horizontal' renders items in a row, 'vertical' stacks them */
  direction?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

export function ChartLegend({
  items,
  formatter,
  direction = 'vertical',
  className,
  style,
}: ChartLegendProps) {
  const fmt = (v: number, n: string) => (formatter ? formatter(v, n) : String(v));
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        flexWrap: direction === 'horizontal' ? 'wrap' : 'nowrap',
        gap: direction === 'horizontal' ? '12px 16px' : 6,
        ...style,
      }}
      className={className}
      data-name="Chart Legend"
    >
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: item.color ?? CHART_COLORS[index % CHART_COLORS.length],
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              fontWeight: 'var(--font-weight-normal)',
              lineHeight: '16px',
              color: 'var(--foreground)',
              flex: '1 0 0',
              minWidth: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {item.name}
          </span>
          {formatter && (
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '12px',
                fontWeight: 'var(--font-weight-semibold)',
                lineHeight: '16px',
                color: 'var(--foreground)',
                flexShrink: 0,
              }}
            >
              {fmt(item.value, item.name)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PIE CHART
═══════════════════════════════════════════════════════ */
export interface PieChartProps {
  data: ChartDataItem[];
  /** Container size in px (square). Default 187 */
  size?: number;
  tooltipVariant?: TooltipVariant;
  formatter?: (value: number, name: string) => string;
  className?: string;
  style?: React.CSSProperties;
}

export function PieChart({
  data,
  size = 187,
  tooltipVariant = 'simple',
  formatter,
  className,
  style,
}: PieChartProps) {
  return (
    <div
      style={{ width: size, height: size, ...style }}
      className={className}
      data-name=".Pie Chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="50%"
            dataKey="value"
            stroke="none"
            strokeWidth={0}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color ?? CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            cursor={false}
            content={(props) => (
              <ChartTooltipContent
                {...(props as ChartTooltipContentProps)}
                variant={tooltipVariant}
                formatter={formatter}
              />
            )}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DONUT CHART
═══════════════════════════════════════════════════════ */
export interface DonutChartProps {
  data: ChartDataItem[];
  /** Container size in px (square). Default 187 */
  size?: number;
  /** Center main value label (e.g. "1125") */
  label?: string;
  /** Center sub-label (e.g. "visitors") */
  sublabel?: string;
  tooltipVariant?: TooltipVariant;
  formatter?: (value: number, name: string) => string;
  className?: string;
  style?: React.CSSProperties;
}

export function DonutChart({
  data,
  size = 187,
  label,
  sublabel,
  tooltipVariant = 'simple',
  formatter,
  className,
  style,
}: DonutChartProps) {
  return (
    <div
      style={{ width: size, height: size, position: 'relative', ...style }}
      className={className}
      data-name=".Donut Chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="38%"
            outerRadius="50%"
            dataKey="value"
            stroke="none"
            strokeWidth={0}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color ?? CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            cursor={false}
            content={(props) => (
              <ChartTooltipContent
                {...(props as ChartTooltipContentProps)}
                variant={tooltipVariant}
                formatter={formatter}
              />
            )}
          />
        </RechartsPieChart>
      </ResponsiveContainer>

      {/* ── Center label overlay ── */}
      {(label || sublabel) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            pointerEvents: 'none',
          }}
          aria-label={label}
        >
          {label && (
            <span
              style={{
                fontFamily: "'Red Hat Display', sans-serif",
                fontSize: '30px',
                fontWeight: 'var(--font-weight-semibold)',
                lineHeight: '30px',
                color: 'var(--foreground)',
              }}
            >
              {label}
            </span>
          )}
          {sublabel && (
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '12px',
                fontWeight: 'var(--font-weight-normal)',
                lineHeight: '16px',
                color: 'var(--muted-foreground)',
                textAlign: 'center',
              }}
            >
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BAR CHART
═══════════════════════════════════════════════════════ */
export interface BarChartDataItem {
  name: string;
  [key: string]: number | string;
}

export interface BarChartSeries {
  key: string;
  label?: string;
  color?: string;
}

export interface BarChartProps {
  data: BarChartDataItem[];
  series: BarChartSeries[];
  height?: number;
  tooltipVariant?: TooltipVariant;
  formatter?: (value: number, name: string) => string;
  showGrid?: boolean;
  showAxes?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function BarChart({
  data,
  series,
  height = 220,
  tooltipVariant = 'stacked',
  formatter,
  showGrid = true,
  showAxes = true,
  className,
  style,
}: BarChartProps) {
  return (
    <div style={{ width: '100%', height, ...style }} className={className} data-name=".Bar Chart">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} barCategoryGap="35%" barGap={4}>
          {showGrid && (
            <CartesianGrid
              vertical={false}
              stroke="color-mix(in srgb, var(--border) 30%, transparent)"
              strokeDasharray="4 2"
            />
          )}
          {showAxes && (
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fill: 'var(--muted-foreground)',
              }}
            />
          )}
          {showAxes && (
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fill: 'var(--muted-foreground)',
              }}
              width={36}
            />
          )}
          <Tooltip
            cursor={{ fill: 'color-mix(in srgb, var(--muted) 20%, transparent)', radius: 4 }}
            content={(props) => (
              <ChartTooltipContent
                {...(props as unknown as ChartTooltipContentProps)}
                variant={tooltipVariant}
                formatter={formatter}
              />
            )}
          />
          {series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label ?? s.key}
              fill={s.color ?? CHART_COLORS[i % CHART_COLORS.length]}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LINE / AREA CHART
═══════════════════════════════════════════════════════ */
export interface LineChartDataItem {
  name: string;
  [key: string]: number | string;
}

export interface LineChartSeries {
  key: string;
  label?: string;
  color?: string;
  /** Render as filled area instead of a plain line */
  area?: boolean;
}

export interface LineChartProps {
  data: LineChartDataItem[];
  series: LineChartSeries[];
  height?: number;
  tooltipVariant?: TooltipVariant;
  formatter?: (value: number, name: string) => string;
  showGrid?: boolean;
  showAxes?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function LineChart({
  data,
  series,
  height = 220,
  tooltipVariant = 'stacked',
  formatter,
  showGrid = true,
  showAxes = true,
  className,
  style,
}: LineChartProps) {
  const hasArea = series.some((s) => s.area);
  const ChartComponent = hasArea ? RechartsAreaChart : RechartsLineChart;

  return (
    <div style={{ width: '100%', height, ...style }} className={className} data-name=".Line Chart">
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data}>
          {/* Gradient defs for area fills */}
          {hasArea && (
            <defs>
              {series.map((s, i) => {
                const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
                return (
                  <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                );
              })}
            </defs>
          )}

          {showGrid && (
            <CartesianGrid
              vertical={false}
              stroke="color-mix(in srgb, var(--border) 30%, transparent)"
              strokeDasharray="4 2"
            />
          )}
          {showAxes && (
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fill: 'var(--muted-foreground)',
              }}
            />
          )}
          {showAxes && (
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fill: 'var(--muted-foreground)',
              }}
              width={36}
            />
          )}
          <Tooltip
            content={(props) => (
              <ChartTooltipContent
                {...(props as unknown as ChartTooltipContentProps)}
                variant={tooltipVariant}
                formatter={formatter}
              />
            )}
          />

          {series.map((s, i) => {
            const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
            if (s.area) {
              return (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label ?? s.key}
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#grad-${s.key})`}
                  dot={false}
                  activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
                />
              );
            }
            return (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label ?? s.key}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              />
            );
          })}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
