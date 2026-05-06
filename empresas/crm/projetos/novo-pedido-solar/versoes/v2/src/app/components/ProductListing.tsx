import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Search, ChevronDown,
  Check, ArrowUpDown, ArrowUp, ArrowDown, X,
  MoreHorizontal, Download, SlidersHorizontal,
} from 'lucide-react';
import {
  allProducts, marcas, categorias, type Product,
} from '../data/mockData';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from './ui/table';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

// Brand logo imports
import vinikLogo from "figma:asset/a685d7fbca11720cda854b5ee404d7d108a8777e.png";
import tonanteLogo from "figma:asset/049c83f7d6b89e54b874fa42bcb5c6fb715d9e6c.png";
import quatiLogo from "figma:asset/65f0d983e5683f5480aa1f3f0a1b24f340e03ce9.png";
import pcyesLogo from "figma:asset/cf86a9e305f37855c42f6db110c143a10ed51f95.png";
import odexSvgPaths from "../../imports/svg-n2dz9mbeoz";

// Brand logo map
const brandLogos: Record<string, string> = {
  PCYES: pcyesLogo, Vinik: vinikLogo, Tonante: tonanteLogo, Quati: quatiLogo, odex: 'svg:odex',
};

const brandColors: Record<string, string> = {
  Quati: '#6DB33F', odex: '#0D1D52', PCYES: '#8E44AD', Vinik: '#0B9A8D', Tonante: '#1A1A1A',
};

const filialBadgeColors: Record<string, { bg: string; text: string }> = {
  PR: { bg: 'color-mix(in srgb, var(--primary) 10%, transparent)', text: 'var(--primary)' },
  ES: { bg: 'color-mix(in srgb, #059669 8%, transparent)', text: '#047857' },
  RJ: { bg: 'color-mix(in srgb, #DC2626 8%, transparent)', text: '#B91C1C' },
  MA: { bg: 'color-mix(in srgb, #7C3AED 8%, transparent)', text: '#6D28D9' },
};

/* Aging mock */
interface AgingInfo {
  maxLevel: number;
  levels: { level: number; label: string; qty: number; color: string }[];
}

const agingColors = ['#34D399', '#FBBF24', '#FB923C', '#F87171'];
const agingLabels = ['N1', 'N2', 'N3', 'N4'];

function getProductAging(product: Product): AgingInfo {
  const totalEstoque = product.filiais.reduce((s, f) => s + f.estoque, 0);
  if (totalEstoque === 0) return { maxLevel: 4, levels: [{ level: 4, label: 'N4', qty: 0, color: agingColors[3] }] };
  const hash = parseInt(product.id, 10);
  const levels: AgingInfo['levels'] = [];
  const pcts = hash % 5 === 0
    ? [0.3, 0.3, 0.25, 0.15]
    : hash % 3 === 0
      ? [0.5, 0.3, 0.2, 0]
      : hash % 2 === 0
        ? [0.7, 0.3, 0, 0]
        : [1, 0, 0, 0];
  let maxLevel = 1;
  pcts.forEach((pct, i) => {
    const qty = Math.floor(totalEstoque * pct);
    if (qty > 0 || (i === 0 && totalEstoque > 0)) {
      levels.push({ level: i + 1, label: agingLabels[i], qty: Math.max(qty, i === 0 ? totalEstoque - levels.reduce((s, l) => s + l.qty, 0) : qty), color: agingColors[i] });
      maxLevel = i + 1;
    }
  });
  const assigned = levels.reduce((s, l) => s + l.qty, 0);
  if (assigned < totalEstoque && levels.length > 0) levels[0].qty += totalEstoque - assigned;
  return { maxLevel, levels: levels.filter(l => l.qty > 0) };
}

function getHealthColor(product: Product): string {
  const totalEstoque = product.filiais.reduce((s, f) => s + f.estoque, 0);
  const totalGiro60 = product.filiais.reduce((s, f) => s + f.giro60, 0);
  const aging = getProductAging(product);
  if (totalEstoque === 0 || aging.maxLevel === 4 || totalGiro60 === 0) return '#EF4444';
  if (totalEstoque < 50 || totalGiro60 < 30 || aging.maxLevel === 3) return '#F59E0B';
  return '#22C55E';
}

function getMkrpColor(_v: number): string {
  return 'var(--foreground)';
}

function getGiroColor(_v: number): string {
  return 'var(--foreground)';
}

function fmtBRL(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ── Inline Brand Logo Component ── */
function BrandLogo({ marca, height = 14, maxWidth = 56 }: { marca: string; height?: number; maxWidth?: number }) {
  const logo = brandLogos[marca];
  if (!logo) {
    return (
      <div className="flex items-center" style={{ height: `${height}px`, width: `${maxWidth}px` }}>
        <span
          className="inline-flex items-center gap-1.5"
          style={{ fontSize: '11px', fontWeight: 'var(--font-weight-semibold)', color: brandColors[marca] || 'var(--foreground)', fontFamily: "'Inter', sans-serif" }}
        >
          <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: brandColors[marca] || '#888' }} />
          {marca}
        </span>
      </div>
    );
  }

  if (logo === 'svg:odex') {
    return (
      <div className="flex items-center" style={{ height: `${height}px`, width: `${maxWidth}px` }}>
        <svg
          fill="none"
          viewBox="0 0 680.22 182.47"
          style={{ maxHeight: `${height}px`, maxWidth: `${maxWidth}px`, width: 'auto', height: 'auto' }}
          aria-label="odex"
        >
          <g clipPath="url(#clip_odex_table)">
            <g>
              <path d={odexSvgPaths.p34a38560} fill="var(--foreground)" />
              <path d={odexSvgPaths.p2d633500} fill="var(--foreground)" />
              <path d={odexSvgPaths.p55c3a80} fill="var(--foreground)" />
            </g>
            <g>
              <path d={odexSvgPaths.p1d754af0} fill="var(--foreground)" />
              <path d={odexSvgPaths.p36ee7300} fill="var(--foreground)" />
            </g>
            <path d={odexSvgPaths.p1e8fcb00} fill="var(--primary)" />
            <g>
              <path d={odexSvgPaths.p3ae6d500} fill="var(--primary)" />
              <path d={odexSvgPaths.pf313b80} fill="var(--primary)" />
            </g>
            <path d={odexSvgPaths.p387d9400} fill="var(--primary)" />
          </g>
          <defs>
            <clipPath id="clip_odex_table">
              <rect fill="white" height="182.47" width="680.22" />
            </clipPath>
          </defs>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex items-center" style={{ height: `${height}px`, width: `${maxWidth}px` }}>
      <img
        src={logo}
        alt={marca}
        style={{ maxHeight: `${height}px`, maxWidth: `${maxWidth}px`, width: 'auto', height: 'auto', objectFit: 'contain' }}
      />
    </div>
  );
}

type EstoqueFilter = '' | 'com' | 'sem' | 'critico';
type AgingFilter = '' | '1' | '2' | '3' | '4';
type SortField = 'codOderco' | 'descricao' | 'marca' | 'categoria' | 'precoDB1' | 'custoMedioNet' | 'mkrp' | 'estoque' | 'giro60';
type SortDir = 'asc' | 'desc';

/* ── Sort Icon ── */
function SortIndicator({ field, sortField, sortDir }: { field: SortField; sortField: SortField | null; sortDir: SortDir }) {
  if (sortField !== field) {
    return <ArrowUpDown size={12} style={{ color: 'var(--muted-foreground)', opacity: 0.5 }} />;
  }
  return sortDir === 'asc'
    ? <ArrowUp size={12} style={{ color: 'var(--primary)' }} />
    : <ArrowDown size={12} style={{ color: 'var(--primary)' }} />;
}

/* ── Filter Dropdown (styled like reference) ── */
interface DropdownOption { value: string; label: string }

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const active = value !== '';
  const activeLabel = options.find(o => o.value === value)?.label;

  return (
    <div ref={ref} className="relative">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpen(!open)}
        className="flex items-center justify-between gap-2 cursor-pointer transition-all select-none"
        style={{
          padding: '8px 12px',
          minWidth: '160px',
          border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
          borderRadius: 'var(--radius-input)',
          background: 'var(--card)',
          fontSize: '13px',
          fontFamily: "'Inter', sans-serif",
          color: active ? 'var(--primary)' : 'var(--foreground)',
        }}
      >
        <span style={{ fontWeight: active ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)' }}>
          {active ? activeLabel : label}
        </span>
        <ChevronDown size={14} style={{ color: 'var(--muted-foreground)' }} />
      </div>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 min-w-[180px] bg-popover rounded-[var(--radius)] overflow-hidden z-50 py-1"
          style={{ border: '1px solid color-mix(in srgb, var(--border) 40%, transparent)', boxShadow: 'var(--elevation-sm)' }}
        >
          <div
            role="button"
            tabIndex={0}
            onClick={() => { onChange(''); setOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors hover:bg-secondary"
            style={{ fontSize: '13px', fontFamily: "'Inter', sans-serif", color: value === '' ? 'var(--primary)' : 'var(--foreground)', fontWeight: value === '' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)' }}
          >
            Todos
          </div>
          {options.map((opt) => (
            <div
              key={opt.value}
              role="button"
              tabIndex={0}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors hover:bg-secondary"
              style={{ fontSize: '13px', fontFamily: "'Inter', sans-serif", color: value === opt.value ? 'var(--primary)' : 'var(--foreground)', fontWeight: value === opt.value ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)' }}
            >
              {value === opt.value && <Check size={12} style={{ color: 'var(--primary)' }} />}
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Marca Multi-Select Dropdown ── */
function MarcaDropdown({
  selected, onToggle, onClear,
}: {
  selected: string[];
  onToggle: (m: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch(''); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const active = selected.length > 0;
  const filteredMarcas = marcas.filter(m => m.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} className="relative">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpen(!open)}
        className="flex items-center justify-between gap-2 cursor-pointer transition-all select-none"
        style={{
          padding: '8px 12px',
          minWidth: '160px',
          border: active ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--border) 40%, transparent)',
          borderRadius: 'var(--radius-input)',
          background: 'var(--card)',
          fontSize: '13px',
          fontFamily: "'Inter', sans-serif",
          color: active ? 'var(--primary)' : 'var(--foreground)',
        }}
      >
        <span style={{ fontWeight: active ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)' }}>
          {active ? `${selected.length} marca${selected.length > 1 ? 's' : ''}` : 'Marca'}
        </span>
        <ChevronDown size={14} style={{ color: 'var(--muted-foreground)' }} />
      </div>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 w-[240px] bg-popover rounded-[var(--radius)] overflow-hidden z-50"
          style={{ border: '1px solid color-mix(in srgb, var(--border) 40%, transparent)', boxShadow: 'var(--elevation-sm)' }}
        >
          <div className="px-2 pt-2 pb-1">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Buscar marca..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-[var(--radius-input)] outline-none"
                style={{
                  fontSize: '12px',
                  fontFamily: "'Inter', sans-serif",
                  border: '1px solid color-mix(in srgb, var(--border) 30%, transparent)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                }}
              />
            </div>
          </div>

          <div className="max-h-[220px] overflow-y-auto py-1">
            {filteredMarcas.map((m) => {
              const isSelected = selected.includes(m);
              return (
                <div
                  key={m}
                  role="button"
                  tabIndex={0}
                  onClick={() => onToggle(m)}
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-secondary cursor-pointer transition-colors"
                  style={{ fontSize: '13px', fontFamily: "'Inter', sans-serif" }}
                >
                  <div
                    className="w-4 h-4 rounded-[var(--radius-checkbox)] flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      background: isSelected ? 'var(--primary)' : 'transparent',
                      border: isSelected ? '1.5px solid var(--primary)' : '1.5px solid var(--muted)',
                    }}
                  >
                    {isSelected && <Check size={10} color="var(--primary-foreground)" strokeWidth={3} />}
                  </div>
                  <div className="flex items-center" style={{ height: '18px', minWidth: '40px' }}>
                    <BrandLogo marca={m} height={14} />
                  </div>
                </div>
              );
            })}
            {filteredMarcas.length === 0 && (
              <div className="px-3 py-3 text-center" style={{ fontSize: '12px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)' }}>
                Nenhuma marca encontrada
              </div>
            )}
          </div>

          {active && (
            <div
              role="button"
              tabIndex={0}
              onClick={onClear}
              className="w-full text-left px-3 py-2 cursor-pointer transition-colors"
              style={{
                fontSize: '12px',
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: "'Inter', sans-serif",
                color: 'var(--primary)',
                borderTop: '1px solid color-mix(in srgb, var(--border) 25%, transparent)',
              }}
            >
              Limpar seleção
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Types ── */
type FlatRow = {
  product: Product;
  filial: Product['filiais'][0];
  aging: AgingInfo;
  totalEstoque: number;
};

/* ══════════════════════════════════════════════════════════════════
   PRODUCT LISTING
   ══════════════════════════════════════════════════════════════════ */
export function ProductListing() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [marcaFilter, setMarcaFilter] = useState<string[]>([]);
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [estoqueFilter, setEstoqueFilter] = useState<EstoqueFilter>('');
  const [agingFilter, setAgingFilter] = useState<AgingFilter>('');
  const [filialFilter, setFilialFilter] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // Build flat filtered rows (no grouping)
  const flatRows = useMemo(() => {
    const q = search.toLowerCase();
    const rows: FlatRow[] = [];

    allProducts.forEach((p) => {
      if (q) {
        const inCod = p.codOderco.toLowerCase().includes(q);
        const inForn = p.codFornecedor.toLowerCase().includes(q);
        const inDesc = p.descricao.toLowerCase().includes(q);
        const inMarca = p.marca.toLowerCase().includes(q);
        const inCat = p.categoria.toLowerCase().includes(q);
        if (!inCod && !inForn && !inDesc && !inMarca && !inCat) return;
      }
      if (marcaFilter.length > 0 && !marcaFilter.includes(p.marca)) return;
      if (categoriaFilter && p.categoria !== categoriaFilter) return;
      if (agingFilter) {
        const aging = getProductAging(p);
        if (aging.maxLevel < parseInt(agingFilter, 10)) return;
      }
      if (filialFilter && !p.filiais.some(f => f.filial === filialFilter)) return;

      const aging = getProductAging(p);
      const totalEstoque = p.filiais.reduce((s, f) => s + f.estoque, 0);
      const filiaisToShow = filialFilter ? p.filiais.filter(f => f.filial === filialFilter) : p.filiais;
      filiaisToShow.forEach((f) => {
        if (estoqueFilter === 'sem' && f.estoque !== 0) return;
        if (estoqueFilter === 'com' && f.estoque <= 0) return;
        if (estoqueFilter === 'critico' && f.estoque > 50) return;
        rows.push({ product: p, filial: f, aging, totalEstoque });
      });
    });

    if (sortField) {
      rows.sort((a, b) => {
        let va: number | string = 0;
        let vb: number | string = 0;
        switch (sortField) {
          case 'codOderco': va = a.product.codOderco; vb = b.product.codOderco; break;
          case 'descricao': va = a.product.descricao; vb = b.product.descricao; break;
          case 'marca': va = a.product.marca; vb = b.product.marca; break;
          case 'categoria': va = a.product.categoria; vb = b.product.categoria; break;
          case 'precoDB1': va = a.filial.precoDB1; vb = b.filial.precoDB1; break;
          case 'custoMedioNet': va = a.filial.custoMedioNet; vb = b.filial.custoMedioNet; break;
          case 'mkrp': va = a.filial.mkrp; vb = b.filial.mkrp; break;
          case 'estoque': va = a.filial.estoque; vb = b.filial.estoque; break;
          case 'giro60': va = a.filial.giro60; vb = b.filial.giro60; break;
        }
        if (typeof va === 'string' && typeof vb === 'string') {
          return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
        }
        return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
      });
    }

    return rows;
  }, [search, marcaFilter, categoriaFilter, estoqueFilter, agingFilter, filialFilter, sortField, sortDir]);

  const totalFilteredRows = flatRows.length;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(totalFilteredRows / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return flatRows.slice(start, start + itemsPerPage);
  }, [flatRows, safeCurrentPage, itemsPerPage]);

  const toggleMarca = (m: string) => {
    setMarcaFilter((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  };

  const hasActiveFilters = marcaFilter.length > 0 || categoriaFilter !== '' || estoqueFilter !== '' || agingFilter !== '' || filialFilter !== '';

  const clearAllFilters = () => {
    setMarcaFilter([]);
    setCategoriaFilter('');
    setEstoqueFilter('');
    setAgingFilter('');
    setFilialFilter('');
    setSearch('');
    setCurrentPage(1);
  };

  const categoriaOptions: DropdownOption[] = categorias.map(c => ({ value: c, label: c }));
  const estoqueOptions: DropdownOption[] = [
    { value: 'com', label: 'Com estoque' },
    { value: 'sem', label: 'Sem estoque' },
    { value: 'critico', label: 'Estoque crítico' },
  ];

  // Table columns
  const columns: { key: SortField | 'filial' | 'ocConfirmada' | 'aging' | 'actions'; label: string; sortable?: boolean; sortKey?: SortField; align?: 'right'; tooltip?: string }[] = [
    { key: 'codOderco', label: 'SKU', sortable: true, sortKey: 'codOderco', tooltip: 'Código interno do produto no sistema Oderço' },
    { key: 'descricao', label: 'Produto', sortable: true, sortKey: 'descricao', tooltip: 'Nome completo do produto conforme cadastro' },
    { key: 'categoria', label: 'Categoria', sortable: true, sortKey: 'categoria', tooltip: 'Categoria do produto (Informática, Cabos, etc.)' },
    { key: 'marca', label: 'Marca', sortable: true, sortKey: 'marca', tooltip: 'Marca/fabricante do produto' },
    { key: 'filial', label: 'Filial', tooltip: 'Filial de distribuição (PR, ES, RJ, MA)' },
    { key: 'precoDB1', label: 'Preço DB1', sortable: true, sortKey: 'precoDB1', align: 'right', tooltip: 'Preço de venda na tabela DB1 — valor com IPI incluso' },
    { key: 'custoMedioNet', label: 'Custo Méd.', sortable: true, sortKey: 'custoMedioNet', align: 'right', tooltip: 'Custo médio líquido (net) — custo de aquisição descontados impostos recuperáveis' },
    { key: 'mkrp', label: 'MKRP %', sortable: true, sortKey: 'mkrp', align: 'right', tooltip: 'Markup real praticado — relação entre o preço de venda e o custo médio líquido' },
    { key: 'estoque', label: 'Estoque', sortable: true, sortKey: 'estoque', align: 'right', tooltip: 'Quantidade disponível em estoque na filial' },
    { key: 'giro60', label: 'Giro 60d', sortable: true, sortKey: 'giro60', align: 'right', tooltip: 'Unidades vendidas nos últimos 60 dias — indica a velocidade de saída do produto' },
    { key: 'aging', label: 'Aging', tooltip: 'Tempo médio de permanência do estoque — classifica a "idade" do inventário (N1 a N5)' },
    { key: 'actions', label: 'Ações' },
  ];

  /* ── Border style for the reference table ── */
  const BORDER = '1px solid var(--border)';

  return (
    <div className="space-y-6" style={{ paddingTop: '20px', paddingBottom: '24px' }}>
      {/* ─── Page Title + Actions ─── */}
      <div className="flex items-center justify-between" style={{ paddingBottom: '16px' }}>
        <div>
          <h1 className="od-title">Formação de Preço</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
            Gerencie preços e acompanhe a performance do seu portfólio
          </p>
        </div>
        <Button
          variant="outline"
          size="small"
          icon={<Download size={14} />}
          style={{ fontSize: '13px', fontFamily: "'Inter', sans-serif" }}
        >
          Download
        </Button>
      </div>

      {/* ─── Filters bar (reference style) ─── */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Search */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontFamily: "'Inter', sans-serif", fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            Produto
          </label>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="text"
              placeholder="Pesquisar"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              style={{
                width: '240px',
                paddingLeft: '36px',
                paddingRight: '12px',
                paddingTop: '8px',
                paddingBottom: '8px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-input)',
                background: 'var(--card)',
                fontSize: '13px',
                fontFamily: "'Inter', sans-serif",
                color: 'var(--foreground)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontFamily: "'Inter', sans-serif", fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            Categoria
          </label>
          <FilterSelect
            label="Selecione"
            value={categoriaFilter}
            options={categoriaOptions}
            onChange={(v) => { setCategoriaFilter(v); setCurrentPage(1); }}
          />
        </div>

        {/* Estoque */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontFamily: "'Inter', sans-serif", fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            Estoque
          </label>
          <FilterSelect
            label="Selecione"
            value={estoqueFilter}
            options={estoqueOptions}
            onChange={(v) => { setEstoqueFilter(v as EstoqueFilter); setCurrentPage(1); }}
          />
        </div>

        {/* Filial */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontFamily: "'Inter', sans-serif", fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            Filial
          </label>
          <FilterSelect
            label="Selecione"
            value={filialFilter}
            options={[
              { value: 'PR', label: 'PR — Paraná' },
              { value: 'ES', label: 'ES — Espírito Santo' },
              { value: 'RJ', label: 'RJ — Rio de Janeiro' },
              { value: 'MA', label: 'MA — Maranhão' },
            ]}
            onChange={(v) => { setFilialFilter(v); setCurrentPage(1); }}
          />
        </div>

        {/* Marca — moved next to Filial */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontFamily: "'Inter', sans-serif", fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            Marca
          </label>
          <MarcaDropdown
            selected={marcaFilter}
            onToggle={toggleMarca}
            onClear={() => setMarcaFilter([])}
          />
        </div>

        {/* Right-aligned action buttons */}
        <div className="flex items-end gap-3 ml-auto">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 cursor-pointer transition-colors"
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--foreground)',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-button)',
              }}
            >
              <X size={14} />
              <span style={{ fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Limpar</span>
            </button>
          )}
          <button
            className="flex items-center gap-2 cursor-pointer transition-colors"
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--primary-foreground)',
              background: 'var(--primary)',
              border: 'none',
              borderRadius: 'var(--radius-button)',
            }}
          >
            <SlidersHorizontal size={14} />
            <span style={{ fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Colunas</span>
          </button>
        </div>
      </div>

      {/* ─── Table (reference flat style) ─── */}
      <div
        className="overflow-x-auto"
        style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius-card)',
          border: BORDER,
        }}
      >
        <Table style={{ minWidth: '1100px' }}>
          <TableHeader>
            <TableRow
              className="hover:!bg-transparent"
              style={{
                borderBottom: BORDER,
                background: 'var(--card)',
              }}
            >
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={col.sortable ? 'cursor-pointer select-none' : ''}
                  onClick={col.sortable && col.sortKey ? () => handleSort(col.sortKey!) : undefined}
                  style={{
                    textAlign: col.align || 'left',
                  }}
                >
                  {col.tooltip ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1.5 cursor-help">
                          {col.label}
                          {col.sortable && col.sortKey && (
                            <SortIndicator field={col.sortKey} sortField={sortField} sortDir={sortDir} />
                          )}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{col.tooltip}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      {col.label}
                      {col.sortable && col.sortKey && (
                        <SortIndicator field={col.sortKey} sortField={sortField} sortDir={sortDir} />
                      )}
                    </span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedRows.map((row, idx) => {
              const { product, filial, aging } = row;
              const isFirstFilial = idx === 0 || paginatedRows[idx - 1].product.id !== product.id;
              const isPrimary = isFirstFilial || !filialFilter && product.filiais.length <= 1;

              return (
                <TableRow
                  key={`${product.id}-${filial.filial}`}
                  className="cursor-pointer group"
                  onClick={() => navigate(`/produto/${product.id}/${filial.filial}`)}
                  style={{
                    borderBottom: BORDER,
                    background: 'var(--card)',
                  }}
                >
                  {/* SKU */}
                  <TableCell>
                    {product.codOderco}
                  </TableCell>

                  {/* Produto */}
                  <TableCell
                    className="group-hover:text-primary transition-colors"
                    style={{ maxWidth: '320px' }}
                  >
                    <div
                      className="truncate"
                      title={product.descricao}
                    >
                      {product.descricao}
                    </div>
                  </TableCell>

                  {/* Categoria */}
                  <TableCell>
                    {product.categoria}
                  </TableCell>

                  {/* Marca */}
                  <TableCell>
                    <BrandLogo marca={product.marca} height={14} maxWidth={56} />
                  </TableCell>

                  {/* Filial */}
                  <TableCell>
                    {(() => {
                      const fbc = filialBadgeColors[filial.filial] || filialBadgeColors.PR;
                      return (
                        <Badge
                          variant="secondary"
                          style={{
                            fontSize: '11px',
                            fontFamily: "'Inter', sans-serif",
                            background: fbc.bg,
                            color: fbc.text,
                          }}
                        >
                          {filial.filial}
                        </Badge>
                      );
                    })()}
                  </TableCell>

                  {/* Preço DB1 — único com bold */}
                  <TableCell style={{
                    textAlign: 'right',
                    fontWeight: 'var(--font-weight-bold)',
                  }}>
                    {fmtBRL(filial.precoDB1)}
                  </TableCell>

                  {/* Custo Méd. */}
                  <TableCell style={{ textAlign: 'right' }}>
                    {fmtBRL(filial.custoMedioNet)}
                  </TableCell>

                  {/* MKRP % */}
                  <TableCell style={{ textAlign: 'right' }}>
                    {filial.mkrp.toFixed(1)}%
                  </TableCell>

                  {/* Estoque */}
                  <TableCell style={{ textAlign: 'right' }}>
                    {filial.estoque === 0 ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <span style={{ color: 'var(--destructive)' }}>0</span>
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 'var(--font-weight-semibold)',
                            fontFamily: "'Inter', sans-serif",
                            background: 'color-mix(in srgb, var(--destructive) 8%, transparent)',
                            color: 'var(--destructive)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          SEM ESTOQUE
                        </span>
                      </div>
                    ) : (
                      filial.estoque.toLocaleString('pt-BR')
                    )}
                  </TableCell>

                  {/* Giro 60d */}
                  <TableCell style={{ textAlign: 'right' }}>
                    {filial.giro60}
                  </TableCell>

                  {/* Aging */}
                  <TableCell>
                    <AgingBadge aging={aging} />
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <button
                      className="flex items-center justify-center cursor-pointer transition-colors rounded-[var(--radius)]"
                      style={{
                        width: '28px',
                        height: '28px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--muted-foreground)',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/produto/${product.id}/${filial.filial}`);
                      }}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
            {flatRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '14px' }}>
                  Nenhum produto encontrado com os filtros aplicados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ─── Pagination footer (DS pattern) ─── */}
      <div
        className="flex items-center justify-between"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px',
          color: 'var(--muted-foreground)',
          padding: '8px 0',
        }}
      >
        <span style={{ fontStyle: 'italic' }}>
          0 de {totalFilteredRows} linha(s) selecionada(s).
        </span>

        <div className="flex items-center gap-6">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              style={{
                padding: '4px 8px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-input)',
                background: 'var(--card)',
                fontSize: '14px',
                fontFamily: "'Inter', sans-serif",
                color: 'var(--foreground)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {[10, 25, 50, 100].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Page info */}
          <span>
            Page {safeCurrentPage} of {totalPages}
          </span>

          {/* Nav buttons */}
          <div className="flex items-center gap-1">
            <PaginationBtn onClick={() => setCurrentPage(1)} disabled={safeCurrentPage <= 1}>&laquo;</PaginationBtn>
            <PaginationBtn onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safeCurrentPage <= 1}>&lsaquo;</PaginationBtn>
            <PaginationBtn onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safeCurrentPage >= totalPages}>&rsaquo;</PaginationBtn>
            <PaginationBtn onClick={() => setCurrentPage(totalPages)} disabled={safeCurrentPage >= totalPages}>&raquo;</PaginationBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Pagination Button ── */
function PaginationBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center cursor-pointer transition-colors"
      style={{
        width: '28px',
        height: '28px',
        borderRadius: 'var(--radius)',
        border: '1px solid color-mix(in srgb, var(--border) 30%, transparent)',
        background: disabled ? 'transparent' : 'var(--card)',
        color: disabled ? 'var(--muted)' : 'var(--foreground)',
        fontSize: '14px',
        fontFamily: "'Inter', sans-serif",
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );
}

/* ── Aging Badge → Tooltip DS ── */
function AgingBadge({ aging }: { aging: AgingInfo }) {
  const maxColor = agingColors[aging.maxLevel - 1];
  const maxLabel = agingLabels[aging.maxLevel - 1];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 cursor-help" style={{ fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: maxColor }} />
          <span style={{ color: maxColor, fontWeight: 'var(--font-weight-medium)', fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
            {maxLabel}
          </span>
        </span>
      </TooltipTrigger>
      <TooltipContent style={{ fontSize: '11px', lineHeight: 1.5, padding: '8px 12px' }}>
        <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>Aging max.: {maxLabel}</div>
        <div className="mt-0.5">
          {aging.levels.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
              <span>{l.qty.toLocaleString('pt-BR')} un.</span>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
