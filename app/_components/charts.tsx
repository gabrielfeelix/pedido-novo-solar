'use client';

import { TrendingUp } from 'lucide-react';

/* ------------ Sparkline ------------ */
export function Sparkline({
  data,
  color = '#6366F1',
  height = 64,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 100;
  const h = 100;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h * 0.85 - h * 0.075;
    return [x, y] as const;
  });
  const linePath = points
    .map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
    .join(' ');
  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;
  const last = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#spark-${color.replace('#', '')})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2" fill={color} />
    </svg>
  );
}

/* ------------ Bars ------------ */
export function Bars({
  data,
  color = '#0B1020',
  height = 100,
  highlightLast = true,
}: {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  highlightLast?: boolean;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => {
        const isLast = i === data.length - 1;
        const h = `${Math.max(6, (d.value / max) * 100)}%`;
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
            <div
              className="w-full rounded-md transition-all"
              style={{
                height: h,
                background:
                  isLast && highlightLast
                    ? `linear-gradient(180deg, ${color}, ${color}b3)`
                    : `${color}22`,
                boxShadow:
                  isLast && highlightLast
                    ? `0 8px 16px -8px ${color}80`
                    : 'none',
              }}
            />
            <p className="text-[10px] text-ink-400 truncate">{d.label}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ------------ Donut ------------ */
export function Donut({
  data,
  size = 120,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 40;
  const cx = 50;
  const cy = 50;
  const stroke = 14;
  const circumference = 2 * Math.PI * r;
  const segments = data.map((d, i) => {
    const previous = data
      .slice(0, i)
      .reduce((sum, item) => sum + item.value / total, 0);
    const portion = d.value / total;
    return {
      ...d,
      dash: portion * circumference,
      offset: -previous * circumference,
    };
  });

  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(15,23,42,0.08)"
          strokeWidth={stroke}
        />
        {segments.map((d, i) => {
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={stroke}
              strokeDasharray={`${d.dash} ${circumference}`}
              strokeDashoffset={d.offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
        })}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="600"
          fill="#0B1020"
        >
          {total}
        </text>
      </svg>
      <ul className="space-y-1.5">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: d.color }}
            />
            <span className="text-ink-500">{d.label}</span>
            <span className="ml-auto font-semibold text-[#0B1020]">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------ Trend stat card ------------ */
export function TrendStat({
  label,
  value,
  delta,
  series,
  color = '#6366F1',
}: {
  label: string;
  value: string | number;
  delta?: string;
  series?: number[];
  color?: string;
}) {
  return (
    <div className="glass-card rounded-3xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400">
          {label}
        </p>
        {delta && (
          <span className="text-[10px] font-medium text-emerald-600 inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
            <TrendingUp size={10} />
            {delta}
          </span>
        )}
      </div>
      <p className="text-3xl font-semibold tracking-tight text-[#0B1020]">{value}</p>
      {series && <Sparkline data={series} color={color} height={56} />}
    </div>
  );
}
