import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Briefcase, ShoppingCart, MapPin, ChevronDown, ChevronUp,
  Eye, EyeOff, Check, Minus, LayoutGrid, Filter, List, TableProperties,
  Store, Globe, Pencil
} from 'lucide-react';
import { type PriceDestination } from '../data/mockData';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsCounter } from './ui/tabs';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from './ui/table';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './ui/input-group';

// Brand logo imports for cards
import vinikLogo from "figma:asset/a685d7fbca11720cda854b5ee404d7d108a8777e.png";
import tonanteLogo from "figma:asset/049c83f7d6b89e54b874fa42bcb5c6fb715d9e6c.png";
import quatiLogo from "figma:asset/65f0d983e5683f5480aa1f3f0a1b24f340e03ce9.png";
import pcyesLogo from "figma:asset/cf86a9e305f37855c42f6db110c143a10ed51f95.png";
import odexSvgPaths from "../../imports/svg-n2dz9mbeoz";
import odercoLogo from 'figma:asset/fd8c78f59896c0b87e14b7308ac1d2fb24b260f7.png';

// Marketplace logo imports
import mercadoLivreLogo from "figma:asset/77d4cabcf99b95c42d49ab293e2d574123be483b.png";
import shopeeLogo from "figma:asset/5e27998122cd4631b6cf3965667425cfe5277db3.png";
import tiktokShopLogo from "figma:asset/51ea7ed71579579baa08b28c65f78eec3570f950.png";
import amazonLogo from "figma:asset/6f8a7ed502f8f671c79928fb69cf6069dab25845.png";

// Brand logo map for destination cards
const destinationLogos: Record<string, { src: string; darkBg?: boolean; padding?: string }> = {
  'PCYES': { src: pcyesLogo, padding: '5px' },
  'Vinik': { src: vinikLogo },
  'Tonante': { src: tonanteLogo, padding: '5px' },
  'Quati': { src: quatiLogo, padding: '2px' },
  'Odex': { src: 'svg:odex' },
  'Oderço': { src: odercoLogo, darkBg: true, padding: '5px' },
  'Mercado Livre': { src: mercadoLivreLogo },
  'Shopee': { src: shopeeLogo },
  'TikTok Shop': { src: tiktokShopLogo },
  'Amazon': { src: amazonLogo },
};

interface PriceTableProps {
  destinations: PriceDestination[];
  onChanges?: (count: number) => void;
}

type EditingCell = { id: string; field: 'markup' | 'vlFinal' } | null;
type FilterTab = 'todos' | 'tabelas' | 'marketplaces' | 'estados';
type ViewMode = 'list' | 'cards';

function getLucroColor(v: number) {
  if (v >= 25) return '#059669';
  if (v >= 15) return '#D97706';
  return '#DC2626';
}

const FILTER_TABS: { key: FilterTab; label: string; icon?: React.ElementType }[] = [
  { key: 'todos', label: 'todos' },
  { key: 'tabelas', label: 'tabelas' },
  { key: 'marketplaces', label: 'mktplaces' },
  { key: 'estados', label: 'estados' },
];

export function PriceTable({ destinations, onChanges }: PriceTableProps) {
  const [data, setData] = useState(destinations);
  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const [editValue, setEditValue] = useState('');
  const [changedRows, setChangedRows] = useState<Set<string>>(new Set());
  const [recentlyChanged, setRecentlyChanged] = useState<Set<string>>(new Set());
  // In 'todos' tab, all groups collapsed by default. Specific tabs open groups.
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [bulkMarkup, setBulkMarkup] = useState('');
  const [bulkBruto, setBulkBruto] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('tabelas');

  const handleFilterChange = (tab: FilterTab) => {
    setActiveFilter(tab);
    if (tab === 'todos') {
      // Collapse all groups when switching to "Todos"
      setCollapsedGroups(new Set(['interno', 'marketplace', 'estado-7', 'estado-12']));
    } else {
      // Expand all groups when switching to a specific tab
      setCollapsedGroups(new Set());
    }
  };
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [ipiMode, setIpiMode] = useState<'rs' | 'pct'>('rs');
  const [stMode, setStMode] = useState<'rs' | 'pct'>('rs');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setData(destinations);
    setEditingCell(null);
    setEditValue('');
    setChangedRows(new Set());
    setRecentlyChanged(new Set());
    setSelectedRows(new Set());
    setBulkMarkup('');
    setBulkBruto('');
  }, [destinations]);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  useEffect(() => {
    onChanges?.(changedRows.size);
  }, [changedRows.size, onChanges]);

  const startEdit = (id: string, field: 'markup' | 'vlFinal') => {
    const row = data.find((d) => d.id === id);
    if (!row) return;
    setEditingCell({ id, field });
    setEditValue(field === 'markup' ? row.markup.toFixed(1) : row.vlFinal.toFixed(2));
  };

  // base = price before IPI/ST. vlBruto = base + IPI. vlFinal = base + IPI + ST.
  const recalcFromBase = (row: PriceDestination, newMarkup: number, base: number) => {
    const vlIPI = +(base * 0.05).toFixed(2);
    const vlST = +(base * 0.03).toFixed(2);
    const vlBruto = +(base + vlIPI).toFixed(2);
    const vlFinal = +(base + vlIPI + vlST).toFixed(2);
    const lucro = +(newMarkup - row.despOper).toFixed(1);
    return { ...row, markup: newMarkup, vlBruto, vlIPI, vlST, vlFinal, lucro };
  };

  const commitEdit = useCallback(() => {
    if (!editingCell) return;
    const value = parseFloat(editValue);
    if (isNaN(value)) { setEditingCell(null); return; }

    setData((prev) =>
      prev.map((row) => {
        if (row.id !== editingCell.id) return row;
        if (editingCell.field === 'markup') {
          const base = +(row.cmv * (1 + value / 100)).toFixed(2);
          return recalcFromBase(row, value, base);
        } else {
          // vlFinal edited: reverse-calculate base = vlFinal / 1.08
          const base = +(value / 1.08).toFixed(2);
          const newMarkup = +((base / row.cmv - 1) * 100).toFixed(1);
          return recalcFromBase(row, newMarkup, base);
        }
      }),
    );

    const cellId = editingCell.id;
    setChangedRows((prev) => new Set(prev).add(cellId));
    setRecentlyChanged((prev) => new Set(prev).add(cellId));
    setTimeout(() => {
      setRecentlyChanged((prev) => { const n = new Set(prev); n.delete(cellId); return n; });
    }, 1500);
    setEditingCell(null);
  }, [editingCell, editValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitEdit();
      if (editingCell) {
        const idx = data.findIndex((d) => d.id === editingCell.id);
        if (idx < data.length - 1) {
          const next = data[idx + 1];
          setTimeout(() => startEdit(next.id, editingCell.field), 50);
        }
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      commitEdit();
      if (editingCell) {
        if (editingCell.field === 'markup') {
          setTimeout(() => startEdit(editingCell.id, 'vlFinal'), 50);
        } else {
          const idx = data.findIndex((d) => d.id === editingCell.id);
          if (idx < data.length - 1) {
            const next = data[idx + 1];
            setTimeout(() => startEdit(next.id, 'markup'), 50);
          }
        }
      }
    }
  };

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => {
      const n = new Set(prev);
      n.has(group) ? n.delete(group) : n.add(group);
      return n;
    });
  };

  const toggleRowSelection = (id: string, e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    setSelectedRows((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleGroupSelection = (items: PriceDestination[]) => {
    const ids = items.map(i => i.id);
    const allSelected = ids.every(id => selectedRows.has(id));
    setSelectedRows(prev => {
      const n = new Set(prev);
      ids.forEach(id => allSelected ? n.delete(id) : n.add(id));
      return n;
    });
  };

  const applyBulkMarkup = () => {
    const value = parseFloat(bulkMarkup);
    if (isNaN(value)) return;
    setData(prev => prev.map(row => {
      if (!selectedRows.has(row.id)) return row;
      const base = +(row.cmv * (1 + value / 100)).toFixed(2);
      return recalcFromBase(row, value, base);
    }));
    setChangedRows((prev) => {
      const next = new Set(prev);
      selectedRows.forEach((id) => next.add(id));
      return next;
    });
    setSelectedRows(new Set());
    setBulkMarkup('');
  };

  const applyBulkBruto = () => {
    const value = parseFloat(bulkBruto);
    if (isNaN(value)) return;
    setData(prev => prev.map(row => {
      if (!selectedRows.has(row.id)) return row;
      // Bulk bruto maps to base + IPI, so reverse with 1.05.
      const base = +(value / 1.05).toFixed(2);
      const newMarkup = +((base / row.cmv - 1) * 100).toFixed(1);
      return recalcFromBase(row, newMarkup, base);
    }));
    setChangedRows((prev) => {
      const next = new Set(prev);
      selectedRows.forEach((id) => next.add(id));
      return next;
    });
    setSelectedRows(new Set());
    setBulkBruto('');
  };

  const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const allGroups = useMemo(() => [
    { key: 'interno', label: 'Tabelas Internas', icon: Briefcase, color: '#3B82F6', items: data.filter((d) => d.tipo === 'interno') },
    { key: 'marketplace', label: 'Marketplaces', icon: ShoppingCart, color: '#F59E0B', items: data.filter((d) => d.tipo === 'marketplace') },
    { key: 'estado-7', label: 'Estados — ICMS 7%', icon: MapPin, color: '#10B981', items: data.filter((d) => d.tipo === 'estado' && d.icmsInter === 7) },
    { key: 'estado-12', label: 'Estados — ICMS 12%', icon: MapPin, color: '#8B5CF6', items: data.filter((d) => d.tipo === 'estado' && d.icmsInter === 12) },
  ], [data]);

  const groups = useMemo(() => {
    switch (activeFilter) {
      case 'tabelas': return allGroups.filter(g => g.key === 'interno');
      case 'marketplaces': return allGroups.filter(g => g.key === 'marketplace');
      case 'estados': return allGroups.filter(g => g.key.startsWith('estado'));
      default: return allGroups;
    }
  }, [allGroups, activeFilter]);

  // Counts for tab badges
  const tabCounts = useMemo(() => ({
    todos: data.length,
    tabelas: allGroups.find(g => g.key === 'interno')?.items.length ?? 0,
    marketplaces: allGroups.find(g => g.key === 'marketplace')?.items.length ?? 0,
    estados: allGroups.filter(g => g.key.startsWith('estado')).reduce((s, g) => s + g.items.length, 0),
  }), [data.length, allGroups]);

  const totalCols = showDetails ? 17 : 10; // +1 for Margem Contribuição when details shown

  return (
    <Card className="w-full" style={{ overflow: 'hidden', alignItems: 'stretch' }}>
      {/* Number input spinner styles handled by .od-input-group-input in theme.css */}
      {/* ── Card Header ── */}
      <div className="px-5 py-3 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[var(--radius)] flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--muted-foreground) 10%, transparent)' }}>
              <TableProperties size={14} style={{ color: 'var(--muted-foreground)' }} />
            </div>
            <div>
              <span className="text-foreground block" style={{ fontSize: '14px', fontWeight: 'var(--font-weight-semibold)', fontFamily: "'Red Hat Display', sans-serif" }}>
                Tabela de Preços por Destino
              </span>
              <span className="block" style={{ fontSize: '12px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)', marginTop: '2px' }}>
                Gerencie markup e preço final para cada canal de venda
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* ── Filter Tabs → Tabs component ── */}
            <Tabs
              value={activeFilter}
              onValueChange={(v) => handleFilterChange(v as FilterTab)}
              className="flex-row gap-0"
            >
              <TabsList>
                {FILTER_TABS.map((tab) => (
                  <TabsTrigger key={tab.key} value={tab.key}>{tab.label} <TabsCounter count={tabCounts[tab.key]} /></TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="w-px h-5 mx-1" style={{ background: 'color-mix(in srgb, var(--border) 25%, transparent)' }} />

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-toggle)] transition-all duration-200 cursor-pointer"
              style={{
                fontSize: '11px',
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: "'Inter', sans-serif",
                color: showDetails ? 'var(--primary)' : 'var(--muted-foreground)',
                background: showDetails ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent',
              }}
            >
              {showDetails ? <EyeOff size={13} /> : <Eye size={13} />}
              {showDetails ? 'Ocultar detalhes' : 'Mostrar detalhes'}
            </button>

            <div className="w-px h-5 mx-1" style={{ background: 'color-mix(in srgb, var(--border) 25%, transparent)' }} />

            {/* ── View Mode Toggle → ToggleGroup DS ── */}
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(v) => v && setViewMode(v as ViewMode)}
              size="sm"
              variant="outline"
              className="rounded-[var(--radius)] p-0.5"
              style={{ background: 'color-mix(in srgb, var(--secondary) 60%, transparent)' }}
            >
              <ToggleGroupItem
                value="list"
                aria-label="Visualização em lista"
                style={{
                  border: 'none',
                  borderRadius: 'var(--radius-checkbox)',
                  background: viewMode === 'list' ? 'var(--card)' : 'transparent',
                  boxShadow: viewMode === 'list' ? 'var(--elevation-sm)' : 'none',
                  color: viewMode === 'list' ? 'var(--primary)' : 'var(--muted-foreground)',
                }}
              >
                <List size={14} />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="cards"
                aria-label="Visualização em cards"
                style={{
                  border: 'none',
                  borderRadius: 'var(--radius-checkbox)',
                  background: viewMode === 'cards' ? 'var(--card)' : 'transparent',
                  boxShadow: viewMode === 'cards' ? 'var(--elevation-sm)' : 'none',
                  color: viewMode === 'cards' ? 'var(--primary)' : 'var(--muted-foreground)',
                }}
              >
                <LayoutGrid size={14} />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      {/* ── Bulk action toolbar ── */}
      {selectedRows.size > 0 && (
        <div className="mx-5 mb-2 px-4 py-2.5 rounded-[var(--radius)] flex items-center gap-3" style={{ background: 'color-mix(in srgb, var(--primary) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)' }}>
          <span className="text-primary" style={{ fontSize: '12px', fontWeight: 'var(--font-weight-semibold)', fontFamily: "'Inter', sans-serif" }}>
            {selectedRows.size} destino{selectedRows.size > 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--primary) 30%, transparent)' }}>|</span>

          <span className="text-secondary-foreground" style={{ fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>Markup:</span>
          <InputGroup style={{ width: 80, height: 28, borderColor: 'var(--primary)' }}>
            <InputGroupAddon style={{ width: 24, background: 'var(--primary)' }}>
              <InputGroupText style={{ fontSize: '9px', fontWeight: 'var(--font-weight-bold)', color: '#FFFFFF' }}>%</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              type="number"
              value={bulkMarkup}
              onChange={(e) => setBulkMarkup(e.target.value)}
              placeholder="0.0"
              step={0.1}
              onKeyDown={(e) => e.key === 'Enter' && applyBulkMarkup()}
              style={{ fontSize: '12px', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary)', padding: '0 6px' }}
            />
          </InputGroup>
          <button
            onClick={applyBulkMarkup}
            className="flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-button)] bg-primary text-primary-foreground cursor-pointer transition-colors hover:bg-primary/90"
            style={{ fontSize: '11px', fontWeight: 'var(--font-weight-semibold)', fontFamily: "'Inter', sans-serif" }}
          >
            <Check size={11} /> Aplicar
          </button>

          <span style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--primary) 30%, transparent)' }}>|</span>

          <span className="text-secondary-foreground" style={{ fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>Bruto:</span>
          <InputGroup style={{ width: 80, height: 28, borderColor: 'var(--primary)' }}>
            <InputGroupAddon style={{ width: 24, background: 'var(--primary)' }}>
              <InputGroupText style={{ fontSize: '9px', fontWeight: 'var(--font-weight-bold)', color: '#FFFFFF' }}>R$</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              type="number"
              value={bulkBruto}
              onChange={(e) => setBulkBruto(e.target.value)}
              placeholder="0.00"
              step={0.01}
              onKeyDown={(e) => e.key === 'Enter' && applyBulkBruto()}
              style={{ fontSize: '12px', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary)', padding: '0 6px' }}
            />
          </InputGroup>
          <button
            onClick={applyBulkBruto}
            className="flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-button)] bg-primary text-primary-foreground cursor-pointer transition-colors hover:bg-primary/90"
            style={{ fontSize: '11px', fontWeight: 'var(--font-weight-semibold)', fontFamily: "'Inter', sans-serif" }}
          >
            <Check size={11} /> Aplicar
          </button>

          <button
            onClick={() => setSelectedRows(new Set())}
            className="ml-auto text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            style={{ fontSize: '10px', fontFamily: "'Inter', sans-serif" }}
          >
            Limpar
          </button>
        </div>
      )}

      {/* ── Content Area ── */}
      {viewMode === 'list' ? (
        /* ── Table View ── */
        <div className="px-5 pb-5 flex flex-col w-full" style={{ maxHeight: 'calc(100vh - 240px)', minHeight: '300px' }}>
          <div
            className="flex-1 min-h-0"
            style={{ overflowX: 'auto', overflowY: 'auto' }}
          >
          <Table style={{ width: '100%', minWidth: showDetails ? '1400px' : '900px', borderCollapse: 'separate', borderSpacing: '0 0', tableLayout: showDetails ? undefined : 'fixed' }}>
            <TableHeader className="sticky top-0 z-20">
              <TableRow style={{ background: 'var(--card)', borderBottom: 'none' }}>
                {/* Checkbox */}
                <TableHead style={{ width: showDetails ? '40px' : '3.5%' }} />

                {/* Detail cols (level 3) */}
                {showDetails && (
                  <TableHead style={{ width: '50px' }}>
                    <Tooltip><TooltipTrigger asChild><span className="cursor-help">ICMS</span></TooltipTrigger><TooltipContent>Alíquota interestadual de ICMS aplicada ao destino</TooltipContent></Tooltip>
                  </TableHead>
                )}

                {/* Protagonist: Destino */}
                <TableHead style={{ width: showDetails ? undefined : '14%', minWidth: showDetails ? '120px' : undefined }}>
                  <Tooltip><TooltipTrigger asChild><span className="cursor-help">DESTINO</span></TooltipTrigger><TooltipContent>Tabela, marketplace ou estado de destino da venda</TooltipContent></Tooltip>
                </TableHead>

                {showDetails && (
                  <>
                    <TableHead style={{ width: '80px' }}>
                      <Tooltip><TooltipTrigger asChild><span className="cursor-help">CMV</span></TooltipTrigger><TooltipContent>Custo da Mercadoria Vendida — custo unitário base para cálculo do preço</TooltipContent></Tooltip>
                    </TableHead>
                    <TableHead style={{ width: '85px' }}>
                      <Tooltip><TooltipTrigger asChild><span className="cursor-help">ÚLT. COMPRA</span></TooltipTrigger><TooltipContent>Valor da última compra registrada no sistema</TooltipContent></Tooltip>
                    </TableHead>
                    <TableHead style={{ width: '70px' }}>
                      <Tooltip><TooltipTrigger asChild><span className="cursor-help">DESP. OP.</span></TooltipTrigger><TooltipContent>Despesa operacional — marketplaces 7%, distribuição padrão 12%</TooltipContent></Tooltip>
                    </TableHead>
                  </>
                )}

                {/* Protagonist: Markup (editable) */}
                <TableHead style={{ width: showDetails ? undefined : '12%', minWidth: showDetails ? '110px' : undefined }}>
                  <Tooltip><TooltipTrigger asChild><span className="flex items-center gap-1 cursor-help">MARKUP %<span style={{ opacity: 0.5 }}>✎</span></span></TooltipTrigger><TooltipContent>Markup sobre o CMV — editável, recalcula o preço final automaticamente</TooltipContent></Tooltip>
                </TableHead>

                {/* Vl. Bruto (read-only, includes IPI) */}
                <TableHead style={{ width: showDetails ? undefined : '10%', minWidth: showDetails ? '100px' : undefined }}>
                  <Tooltip><TooltipTrigger asChild><span className="cursor-help">VL. BRUTO</span></TooltipTrigger><TooltipContent>Valor de venda incluindo IPI. Base para cálculo do markup.</TooltipContent></Tooltip>
                </TableHead>

                {showDetails && (
                  <>
                    <TableHead style={{ width: '70px' }}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 cursor-help">
                            <span>IPI</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); setIpiMode(prev => prev === 'rs' ? 'pct' : 'rs'); }}
                              className="px-1 py-px rounded-sm cursor-pointer transition-colors"
                              style={{
                                fontSize: '9px', fontWeight: 'var(--font-weight-medium)', fontFamily: "'Inter', sans-serif",
                                color: 'var(--primary)', background: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                                border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
                              }}
                            >{ipiMode === 'rs' ? 'R$' : '%'}</button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Imposto sobre Produtos Industrializados — alterna entre R$ e %</TooltipContent>
                      </Tooltip>
                    </TableHead>
                    <TableHead style={{ width: '70px' }}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 cursor-help">
                            <span>ST</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); setStMode(prev => prev === 'rs' ? 'pct' : 'rs'); }}
                              className="px-1 py-px rounded-sm cursor-pointer transition-colors"
                              style={{
                                fontSize: '9px', fontWeight: 'var(--font-weight-medium)', fontFamily: "'Inter', sans-serif",
                                color: 'var(--primary)', background: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                                border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
                              }}
                            >{stMode === 'rs' ? 'R$' : '%'}</button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Substituição Tributária — alterna entre R$ e %</TooltipContent>
                      </Tooltip>
                    </TableHead>
                  </>
                )}

                {/* Protagonist: Vl. Final (editable) */}
                <TableHead style={{ width: showDetails ? undefined : '12%', minWidth: showDetails ? '110px' : undefined }}>
                  <Tooltip><TooltipTrigger asChild><span className="flex items-center gap-1 cursor-help">VL. FINAL<span style={{ opacity: 0.5 }}>✎</span></span></TooltipTrigger><TooltipContent>Editável — altere o preço final e o markup será recalculado automaticamente</TooltipContent></Tooltip>
                </TableHead>

                {/* Margem Contribuição (when details shown) */}
                {showDetails && (
                  <TableHead style={{ width: '85px' }}>
                    <Tooltip><TooltipTrigger asChild><span className="cursor-help">MG. CONTRIB.</span></TooltipTrigger><TooltipContent>Margem de Contribuição: antes do IR e CSLL (34%)</TooltipContent></Tooltip>
                  </TableHead>
                )}

                {/* Protagonist: Lucro % (Margem Líquida) */}
                <TableHead style={{ width: showDetails ? undefined : '14%', minWidth: showDetails ? '120px' : undefined }}>
                  <Tooltip><TooltipTrigger asChild><span className="cursor-help">LUCRO %</span></TooltipTrigger><TooltipContent>Lucratividade líquida estimada — margem de contribuição descontado IR/CSLL (34%)</TooltipContent></Tooltip>
                </TableHead>

                {/* Coadjuvant: Giro */}
                <TableHead className="text-center" style={{ width: showDetails ? undefined : '5.5%', minWidth: showDetails ? '45px' : undefined }}>
                  <Tooltip><TooltipTrigger asChild><span className="cursor-help">G.7d</span></TooltipTrigger><TooltipContent>Giro nos últimos 7 dias</TooltipContent></Tooltip>
                </TableHead>
                <TableHead className="text-center" style={{ width: showDetails ? undefined : '5.5%', minWidth: showDetails ? '45px' : undefined }}>
                  <Tooltip><TooltipTrigger asChild><span className="cursor-help">G.30d</span></TooltipTrigger><TooltipContent>Giro nos últimos 30 dias</TooltipContent></Tooltip>
                </TableHead>
                <TableHead className="text-center" style={{ width: showDetails ? undefined : '5.5%', minWidth: showDetails ? '50px' : undefined }}>
                  <Tooltip><TooltipTrigger asChild><span className="cursor-help">G.60d</span></TooltipTrigger><TooltipContent>Giro nos últimos 60 dias</TooltipContent></Tooltip>
                </TableHead>
                <TableHead className="text-center" style={{ width: showDetails ? undefined : '6%', minWidth: showDetails ? '55px' : undefined }}>
                  <Tooltip><TooltipTrigger asChild><span className="cursor-help">G.360d</span></TooltipTrigger><TooltipContent>Giro nos últimos 360 dias</TooltipContent></Tooltip>
                </TableHead>
              </TableRow>
              {/* Separator line */}
              <tr>
                <th colSpan={totalCols} className="p-0">
                  <div style={{ height: '1px', background: 'color-mix(in srgb, var(--border) 25%, transparent)' }} />
                </th>
              </tr>
            </TableHeader>
            {groups.map((group) => (
              <GroupSection
                key={group.key}
                group={group}
                collapsed={collapsedGroups.has(group.key)}
                onToggle={() => toggleGroup(group.key)}
                showDetails={showDetails}
                totalCols={totalCols}
                editingCell={editingCell}
                editValue={editValue}
                inputRef={inputRef}
                recentlyChanged={recentlyChanged}
                changedRows={changedRows}
                selectedRows={selectedRows}
                onStartEdit={startEdit}
                onEditValueChange={setEditValue}
                onCommitEdit={commitEdit}
                onKeyDown={handleKeyDown}
                onToggleRow={toggleRowSelection}
                onToggleGroupSelect={toggleGroupSelection}
                fmt={fmt}
                ipiMode={ipiMode}
                stMode={stMode}
              />
            ))}
            <TableBody>
              {groups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={totalCols} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Filter size={20} className="text-muted" />
                      <span className="text-muted-foreground" style={{ fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                        Nenhum destino neste filtro
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </div>
      ) : (
        /* ── Cards View ── */
        <CardsView
          groups={groups}
          fmt={fmt}
          data={data}
          setData={setData}
          changedRows={changedRows}
          setChangedRows={setChangedRows}
          recentlyChanged={recentlyChanged}
          setRecentlyChanged={setRecentlyChanged}
          recalcFromBase={recalcFromBase}
        />
      )}
    </Card>
  );
}

/* ── Visual Cards Editing View ── */

const destinationIcons: Record<string, { icon: React.ElementType; emoji: string }> = {
  'PCYES': { icon: Store, emoji: '🏷️' },
  'Vinik': { icon: Store, emoji: '🎯' },
  'Produção': { icon: Briefcase, emoji: '🏭' },
  'Tonante': { icon: Store, emoji: '🎸' },
  'Mercado Livre': { icon: ShoppingCart, emoji: '🛒' },
  'Shopee': { icon: ShoppingCart, emoji: '🧡' },
  'Amazon': { icon: ShoppingCart, emoji: '📦' },
  'Magazine Luiza': { icon: ShoppingCart, emoji: '💙' },
};

const defaultDestIcon = { icon: Globe, emoji: '📍' };

function LucroGauge({ lucro, size = 64, color }: { lucro: number; size?: number; color: string }) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(Math.max(lucro, 0), 50) / 50;
  const offset = circumference * (1 - pct * 0.75);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-135deg)' }}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="color-mix(in srgb, var(--secondary) 60%, transparent)"
        strokeWidth={4}
        strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        strokeLinecap="round"
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 500ms ease-out' }}
      />
    </svg>
  );
}

function CardsView({ groups, fmt, data, setData, changedRows, setChangedRows, recentlyChanged, setRecentlyChanged, recalcFromBase }: {
  groups: { key: string; label: string; icon: React.ElementType; color: string; items: PriceDestination[] }[];
  fmt: (v: number) => string;
  data: PriceDestination[];
  setData: React.Dispatch<React.SetStateAction<PriceDestination[]>>;
  changedRows: Set<string>;
  setChangedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  recentlyChanged: Set<string>;
  setRecentlyChanged: React.Dispatch<React.SetStateAction<Set<string>>>;
  recalcFromBase: (row: PriceDestination, newMarkup: number, base: number) => PriceDestination;
}) {
  const [editingCard, setEditingCard] = useState<{ id: string; field: 'markup' | 'vlFinal' } | null>(null);
  const [editVal, setEditVal] = useState('');
  const cardInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCard && cardInputRef.current) {
      cardInputRef.current.focus();
      cardInputRef.current.select();
    }
  }, [editingCard]);

  const startCardEdit = (id: string, field: 'markup' | 'vlFinal') => {
    const row = data.find(d => d.id === id);
    if (!row) return;
    setEditingCard({ id, field });
    setEditVal(field === 'markup' ? row.markup.toFixed(1) : row.vlFinal.toFixed(2));
  };

  const commitCardEdit = () => {
    if (!editingCard) return;
    const value = parseFloat(editVal);
    if (isNaN(value)) { setEditingCard(null); return; }

    setData(prev => prev.map(row => {
      if (row.id !== editingCard.id) return row;
      if (editingCard.field === 'markup') {
        const base = +(row.cmv * (1 + value / 100)).toFixed(2);
        return recalcFromBase(row, value, base);
      } else {
        const base = +(value / 1.08).toFixed(2);
        const newMarkup = +((base / row.cmv - 1) * 100).toFixed(1);
        return recalcFromBase(row, newMarkup, base);
      }
    }));

    const cellId = editingCard.id;
    setChangedRows(prev => new Set(prev).add(cellId));
    setRecentlyChanged(prev => new Set(prev).add(cellId));
    setTimeout(() => {
      setRecentlyChanged(prev => { const n = new Set(prev); n.delete(cellId); return n; });
    }, 1500);
    setEditingCard(null);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitCardEdit();
    else if (e.key === 'Escape') setEditingCard(null);
    else if (e.key === 'Tab') {
      e.preventDefault();
      commitCardEdit();
      if (editingCard) {
        if (editingCard.field === 'markup') {
          setTimeout(() => startCardEdit(editingCard.id, 'vlFinal'), 50);
        } else {
          setEditingCard(null);
        }
      }
    }
  };

  return (
    <div className="overflow-auto px-5 pb-5 w-full" style={{ maxHeight: 'calc(100vh - 240px)', minHeight: '300px' }}>
      <div className="space-y-5">
      {groups.map(group => {
        const Icon = group.icon;

        // Compute best margin item for marketplace groups
        const bestMarginId = group.key === 'marketplace' && group.items.length >= 2
          ? group.items.reduce((best, cur) => cur.lucro > best.lucro ? cur : best, group.items[0]).id
          : null;

        return (
          <div key={group.key}>
            {/* ── Group Header ── */}
            <div className="flex items-center gap-2.5 mb-3 px-1">
              <span style={{ fontSize: '13px', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: "'Red Hat Display', sans-serif" }}>
                {group.label}
              </span>
              <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Inter', sans-serif", color: '#fff', background: group.color }}>
                {group.items.length}
              </span>
            </div>

            {/* ── Cards Grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {group.items.map(item => {
                const lucroColor = getLucroColor(item.lucro);
                const destConf = destinationIcons[item.destino] || defaultDestIcon;
                const DestIcon = destConf.icon;
                const isChanged = changedRows.has(item.id);
                const isRecent = recentlyChanged.has(item.id);
                const isEditingThis = editingCard?.id === item.id;
                const brandLogo = destinationLogos[item.destino];
                const isBestMargin = item.id === bestMarginId;

                return (
                  <div
                    key={item.id}
                    className="rounded-[var(--radius-card)] overflow-hidden transition-all duration-300"
                    style={{
                      background: isBestMargin ? 'color-mix(in srgb, #10B981 3%, var(--card))' : 'var(--card)',
                      border: isRecent
                        ? '1.5px solid color-mix(in srgb, #10B981 40%, transparent)'
                        : isEditingThis
                        ? `1.5px solid color-mix(in srgb, var(--primary) 40%, transparent)`
                        : isBestMargin
                        ? '1.5px solid color-mix(in srgb, #10B981 35%, transparent)'
                        : '1px solid var(--border)',
                      boxShadow: isRecent
                        ? '0 0 12px color-mix(in srgb, #10B981 10%, transparent)'
                        : isEditingThis
                        ? '0 4px 16px color-mix(in srgb, var(--primary) 10%, transparent)'
                        : isBestMargin
                        ? '0 2px 12px color-mix(in srgb, #10B981 12%, transparent)'
                        : 'var(--elevation-sm)',
                    }}
                  >
                    {/* ── Card Top: Accent + Identity ── */}
                    <div className="relative px-4 pt-3.5 pb-3">
                      {/* Top accent line */}
                      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: isBestMargin ? 'linear-gradient(90deg, #10B981, #34D399)' : `linear-gradient(90deg, ${lucroColor}, color-mix(in srgb, ${lucroColor} 30%, transparent))` }} />

                      <div className="flex items-start justify-between">
                        {/* Icon/Logo + Name */}
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {brandLogo ? (
                            brandLogo.src === 'svg:odex' ? (
                              <div className="w-10 h-10 rounded-[var(--radius)] flex items-center justify-center shrink-0" style={{
                                background: 'color-mix(in srgb, var(--secondary) 60%, transparent)',
                                border: '1px solid var(--border)',
                              }}>
                                <svg fill="none" viewBox="0 0 680.22 182.47" style={{ width: '24px', height: 'auto' }} aria-label="Odex">
                                  <g clipPath="url(#clip_odex_card)">
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
                                    <clipPath id="clip_odex_card">
                                      <rect fill="white" height="182.47" width="680.22" />
                                    </clipPath>
                                  </defs>
                                </svg>
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-[var(--radius)] overflow-hidden shrink-0" style={{
                                background: brandLogo.darkBg ? 'var(--primary)' : 'color-mix(in srgb, var(--secondary) 60%, transparent)',
                                border: brandLogo.darkBg ? 'none' : '1px solid var(--border)',
                                padding: brandLogo.padding || '0px',
                              }}>
                                <img src={brandLogo.src} alt={item.destino} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              </div>
                            )
                          ) : (
                            <div className="w-10 h-10 rounded-[var(--radius)] flex items-center justify-center shrink-0" style={{
                              background: `color-mix(in srgb, ${lucroColor} 8%, transparent)`,
                              border: '1px solid var(--border)',
                            }}>
                              <DestIcon size={18} style={{ color: lucroColor }} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="block truncate" style={{
                                fontSize: '14px',
                                fontWeight: 'var(--font-weight-bold)',
                                fontFamily: "'Red Hat Display', sans-serif",
                                color: 'var(--foreground)',
                                lineHeight: '1.2',
                              }}>
                                {item.destino}
                              </span>
                              {isBestMargin && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm shrink-0" style={{
                                  fontSize: '9px',
                                  fontWeight: 'var(--font-weight-bold)',
                                  fontFamily: "'Inter', sans-serif",
                                  color: '#166534',
                                  background: '#DCFCE7',
                                  lineHeight: '1.2',
                                  letterSpacing: '0.2px',
                                }}>
                                  Melhor margem
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {item.icmsInter > 0 && (
                                <span className="px-1.5 py-px rounded-sm" style={{
                                  fontSize: '9px', fontWeight: 'var(--font-weight-semibold)', fontFamily: "'Inter', sans-serif",
                                  color: 'var(--muted-foreground)', background: 'color-mix(in srgb, var(--secondary) 60%, transparent)',
                                }}>ICMS {item.icmsInter}%</span>
                              )}
                              <span style={{ fontSize: '10px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)' }}>
                                Desp. {item.despOper}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Lucro Gauge */}
                        <div className="relative shrink-0" style={{ width: '56px', height: '56px' }}>
                          <LucroGauge lucro={item.lucro} size={56} color={lucroColor} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: 'translateY(-2px)' }}>
                            <span style={{
                              fontSize: '14px',
                              fontWeight: 'var(--font-weight-bold)',
                              fontFamily: "'Red Hat Display', sans-serif",
                              color: lucroColor,
                              lineHeight: '1',
                            }}>
                              {item.lucro.toFixed(1)}
                            </span>
                            <span style={{ fontSize: '8px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)', lineHeight: '1' }}>
                              % lucro
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── Editable Fields ── */}
                    <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
                      <div className="grid grid-cols-2 gap-2.5">
                        {/* Markup */}
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Pencil size={8} style={{ color: 'var(--primary)' }} />
                            <span style={{ fontSize: '9px', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.4px', fontFamily: "'Inter', sans-serif", color: 'var(--primary)' }}>MARKUP %</span>
                          </div>
                          {editingCard?.id === item.id && editingCard.field === 'markup' ? (
                            <InputGroup style={{
                              height: 38,
                              borderColor: 'var(--primary)',
                              borderWidth: 2,
                              boxShadow: '0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent)',
                            }}>
                              <InputGroupAddon style={{ width: 28, background: 'var(--primary)' }}>
                                <InputGroupText style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', color: '#FFFFFF' }}>%</InputGroupText>
                              </InputGroupAddon>
                              <InputGroupInput
                                ref={cardInputRef}
                                type="number"
                                value={editVal}
                                onChange={e => setEditVal(e.target.value)}
                                onBlur={commitCardEdit}
                                onKeyDown={handleCardKeyDown}
                                step={0.1}
                                style={{ fontSize: '16px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Red Hat Display', sans-serif", color: 'var(--primary)', padding: '0 8px' }}
                              />
                            </InputGroup>
                          ) : (
                            <InputGroup
                              role="button" tabIndex={0}
                              onClick={() => startCardEdit(item.id, 'markup')}
                              onKeyDown={e => e.key === 'Enter' && startCardEdit(item.id, 'markup')}
                              className="cursor-pointer transition-all duration-150 hover:border-primary/25"
                              style={{
                                height: 38,
                                background: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                                borderColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                              }}
                            >
                              <InputGroupAddon style={{ width: 28, background: 'color-mix(in srgb, var(--primary) 15%, transparent)' }}>
                                <InputGroupText style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary)' }}>%</InputGroupText>
                              </InputGroupAddon>
                              <InputGroupText style={{ padding: '0 8px', fontSize: '16px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Red Hat Display', sans-serif", color: 'var(--primary)' }}>
                                {item.markup.toFixed(1)}
                              </InputGroupText>
                            </InputGroup>
                          )}
                        </div>

                        {/* Vl. Final (editable) */}
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Pencil size={8} style={{ color: '#047857' }} />
                            <span style={{ fontSize: '9px', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.4px', fontFamily: "'Inter', sans-serif", color: '#047857' }}>VL. FINAL</span>
                          </div>
                          {editingCard?.id === item.id && editingCard.field === 'vlFinal' ? (
                            <InputGroup style={{
                              height: 38,
                              borderColor: '#059669',
                              borderWidth: 2,
                              boxShadow: '0 0 0 3px color-mix(in srgb, #059669 15%, transparent)',
                            }}>
                              <InputGroupAddon style={{ width: 28, background: '#059669' }}>
                                <InputGroupText style={{ fontSize: '9px', fontWeight: 'var(--font-weight-bold)', color: '#FFFFFF' }}>R$</InputGroupText>
                              </InputGroupAddon>
                              <InputGroupInput
                                ref={cardInputRef}
                                type="number"
                                value={editVal}
                                onChange={e => setEditVal(e.target.value)}
                                onBlur={commitCardEdit}
                                onKeyDown={handleCardKeyDown}
                                step={0.01}
                                style={{ fontSize: '16px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Red Hat Display', sans-serif", color: '#047857', padding: '0 8px' }}
                              />
                            </InputGroup>
                          ) : (
                            <InputGroup
                              role="button" tabIndex={0}
                              onClick={() => startCardEdit(item.id, 'vlFinal')}
                              onKeyDown={e => e.key === 'Enter' && startCardEdit(item.id, 'vlFinal')}
                              className="cursor-pointer transition-all duration-150"
                              style={{
                                height: 38,
                                background: 'color-mix(in srgb, #059669 4%, transparent)',
                                borderColor: 'color-mix(in srgb, #059669 12%, transparent)',
                              }}
                            >
                              <InputGroupAddon style={{ width: 28, background: 'color-mix(in srgb, #059669 12%, transparent)' }}>
                                <InputGroupText style={{ fontSize: '9px', fontWeight: 'var(--font-weight-bold)', color: '#047857' }}>R$</InputGroupText>
                              </InputGroupAddon>
                              <InputGroupText style={{ padding: '0 8px', fontSize: '16px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Red Hat Display', sans-serif", color: '#047857' }}>
                                {fmt(item.vlFinal)}
                              </InputGroupText>
                            </InputGroup>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ── Card Footer: Final Price + Giros ── */}
                    <div className="px-4 pt-2.5 pb-3" style={{
                      background: 'var(--card)',
                      borderTop: '1px solid var(--border)',
                    }}>
                      {/* Bruto price (read-only, includes IPI) */}
                      <div className="flex items-baseline justify-between mb-2.5">
                        <div>
                          <span style={{ fontSize: '9px', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.4px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)' }}>
                            VL. BRUTO
                          </span>
                          <div style={{
                            fontSize: '16px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Red Hat Display', sans-serif",
                            color: 'var(--secondary-foreground)', lineHeight: '1.2',
                          }}>
                            R$ {fmt(item.vlBruto)}
                          </div>
                        </div>
                        {isChanged && (
                          <span className="px-1.5 py-0.5 rounded-sm" style={{
                            fontSize: '8px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Inter', sans-serif",
                            color: '#059669', background: 'color-mix(in srgb, #10B981 12%, transparent)',
                          }}>EDITADO</span>
                        )}
                      </div>

                      {/* Mini details row */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span style={{ fontSize: '9px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)' }}>IPI</span>
                          <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-semibold)', fontFamily: "'Inter', sans-serif", color: 'var(--secondary-foreground)' }}>{fmt(item.vlIPI)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span style={{ fontSize: '9px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)' }}>ST</span>
                          <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-semibold)', fontFamily: "'Inter', sans-serif", color: 'var(--secondary-foreground)' }}>{fmt(item.vlST)}</span>
                        </div>
                        <div className="flex items-center gap-1 ml-auto">
                          <span style={{ fontSize: '9px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)' }}>CMV</span>
                          <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-semibold)', fontFamily: "'Inter', sans-serif", color: 'var(--secondary-foreground)' }}>{fmt(item.cmv)}</span>
                        </div>
                      </div>

                      {/* Giro bar chart mini */}
                      <div className="mt-2.5 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                        <div className="flex items-end gap-2 h-6">
                          {[
                            { label: '7d', value: item.giro7d, max: 20 },
                            { label: '30d', value: item.giro30d, max: 80 },
                            { label: '60d', value: item.giro60d, max: 150 },
                            { label: '360d', value: item.giro360d, max: 500 },
                          ].map(g => {
                            const h = Math.max(4, (g.value / g.max) * 24);
                            return (
                              <div key={g.label} className="flex-1 flex flex-col items-center gap-0.5" title={`${g.label}: ${g.value}`}>
                                <div className="w-full rounded-t-sm" style={{
                                  height: `${h}px`,
                                  background: `color-mix(in srgb, ${lucroColor} ${30 + (g.value / g.max) * 40}%, transparent)`,
                                  minHeight: '4px',
                                  transition: 'height 300ms ease-out',
                                }} />
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex gap-2 mt-1">
                          {['7d', '30d', '60d', '360d'].map(l => (
                            <span key={l} className="flex-1 text-center" style={{ fontSize: '8px', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)' }}>{l}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {groups.length === 0 && (
        <div className="py-12 flex flex-col items-center gap-2">
          <Filter size={20} className="text-muted" />
          <span className="text-muted-foreground" style={{ fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
            Nenhum destino neste filtro
          </span>
        </div>
      )}
      </div>
    </div>
  );
}

/* ── Group Section ── */
interface GroupSectionProps {
  group: { key: string; label: string; icon: React.ElementType; color: string; items: PriceDestination[] };
  collapsed: boolean;
  onToggle: () => void;
  showDetails: boolean;
  totalCols: number;
  editingCell: EditingCell;
  editValue: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  recentlyChanged: Set<string>;
  changedRows: Set<string>;
  selectedRows: Set<string>;
  onStartEdit: (id: string, field: 'markup' | 'vlFinal') => void;
  onEditValueChange: (v: string) => void;
  onCommitEdit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onToggleRow: (id: string, e: React.MouseEvent | React.ChangeEvent) => void;
  onToggleGroupSelect: (items: PriceDestination[]) => void;
  fmt: (v: number) => string;
  ipiMode: 'rs' | 'pct';
  stMode: 'rs' | 'pct';
}

function GroupSection({
  group, collapsed, onToggle, showDetails, totalCols,
  editingCell, editValue, inputRef,
  recentlyChanged, changedRows, selectedRows,
  onStartEdit, onEditValueChange, onCommitEdit, onKeyDown,
  onToggleRow, onToggleGroupSelect, fmt, ipiMode, stMode,
}: GroupSectionProps) {
  const Icon = group.icon;
  const avgMarkup = group.items.length > 0 ? group.items.reduce((s, r) => s + r.markup, 0) / group.items.length : 0;
  const avgLucro = group.items.length > 0 ? group.items.reduce((s, r) => s + r.lucro, 0) / group.items.length : 0;
  const allGroupSelected = group.items.every(i => selectedRows.has(i.id));
  const someGroupSelected = group.items.some(i => selectedRows.has(i.id));

  // ADIÇÃO 5: Priority states for estado-12 group  
  const PRIORITY_STATES_LIST = ['SP', 'PR', 'MG', 'SC', 'RJ', 'RS'];
  const isEstado12Group = group.key === 'estado-12';
  const sortedItems = useMemo(() => {
    if (!isEstado12Group) return group.items;
    const priority = group.items.filter(r => PRIORITY_STATES_LIST.includes(r.destino))
      .sort((a, b) => PRIORITY_STATES_LIST.indexOf(a.destino) - PRIORITY_STATES_LIST.indexOf(b.destino));
    const rest = group.items.filter(r => !PRIORITY_STATES_LIST.includes(r.destino));
    return [...priority, ...rest];
  }, [group.items, isEstado12Group]);
  const priorityCount = isEstado12Group ? sortedItems.filter(r => PRIORITY_STATES_LIST.includes(r.destino)).length : 0;

  return (
    <TableBody>
      {/* ── Group header ── */}
      <TableRow style={{ borderBottom: 'none' }}>
        {/* Checkbox cell — matches checkbox column width */}
        <TableCell className="p-0 pt-2" style={{ fontSize: 'inherit', lineHeight: 'inherit', verticalAlign: 'middle' }}>
          <div
            className="flex items-center justify-center cursor-pointer rounded-l-[var(--radius)]"
            style={{
              background: `color-mix(in srgb, ${group.color} 5%, var(--card))`,
              borderTop: `1px solid color-mix(in srgb, ${group.color} 12%, transparent)`,
              borderBottom: `1px solid color-mix(in srgb, ${group.color} 12%, transparent)`,
              borderLeft: `1px solid color-mix(in srgb, ${group.color} 12%, transparent)`,
              padding: '10px 12px',
            }}
            onClick={(e) => { e.stopPropagation(); onToggleGroupSelect(group.items); }}
          >
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onToggleGroupSelect(group.items); } }}
              className="w-4 h-4 rounded-[var(--radius-checkbox)] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
              style={{
                background: allGroupSelected ? group.color : someGroupSelected ? group.color : 'transparent',
                border: allGroupSelected || someGroupSelected ? `1.5px solid ${group.color}` : '1.5px solid var(--muted)',
              }}
            >
              {allGroupSelected && <Check size={10} color="#fff" strokeWidth={3} />}
              {someGroupSelected && !allGroupSelected && <Minus size={10} color="#fff" strokeWidth={3} />}
            </div>
          </div>
        </TableCell>

        {/* Detail: ICMS spacer */}
        {showDetails && (
          <TableCell className="p-0 pt-2" style={{ fontSize: 'inherit', lineHeight: 'inherit', verticalAlign: 'middle' }}>
            <div style={{
              background: `color-mix(in srgb, ${group.color} 5%, var(--card))`,
              borderTop: `1px solid color-mix(in srgb, ${group.color} 12%, transparent)`,
              borderBottom: `1px solid color-mix(in srgb, ${group.color} 12%, transparent)`,
              minHeight: '41px',
            }} />
          </TableCell>
        )}

        {/* Rest of columns — label + stats */}
        <TableCell colSpan={totalCols - (showDetails ? 2 : 1)} className="p-0 pt-2" style={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
          <div
            className="flex items-center gap-3 py-2.5 pr-4 pl-3 cursor-pointer transition-all duration-200 rounded-r-[var(--radius)]"
            style={{
              background: `color-mix(in srgb, ${group.color} 5%, var(--card))`,
              borderTop: `1px solid color-mix(in srgb, ${group.color} 12%, transparent)`,
              borderBottom: `1px solid color-mix(in srgb, ${group.color} 12%, transparent)`,
              borderRight: `1px solid color-mix(in srgb, ${group.color} 12%, transparent)`,
            }}
            onClick={onToggle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onToggle()}
          >
            <span style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: group.color, fontFamily: "'Red Hat Display', sans-serif" }}>{group.label}</span>
            <span className="rounded-full text-white" style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', background: group.color, padding: '1px 7px', fontFamily: "'Inter', sans-serif" }}>{group.items.length}</span>

            <div className="ml-auto flex items-center gap-6">
              <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: "'Inter', sans-serif" }}>
                Markup <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: group.color }}>{avgMarkup.toFixed(1)}%</span>
              </span>
              <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: "'Inter', sans-serif" }}>
                Lucro <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: getLucroColor(avgLucro) }}>{avgLucro.toFixed(1)}%</span>
              </span>
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `color-mix(in srgb, ${group.color} 12%, transparent)` }}>
                {collapsed ? <ChevronDown size={14} style={{ color: group.color }} /> : <ChevronUp size={14} style={{ color: group.color }} />}
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>

      {/* ── Data rows ── */}
      {!collapsed && sortedItems.map((row, idx) => {
        const isRecent = recentlyChanged.has(row.id);
        const isSelected = selectedRows.has(row.id);
        const lucroBorderColor = row.lucro >= 25 ? '#22C55E' : row.lucro >= 15 ? '#F59E0B' : '#EF4444';
        const showPriorityLabel = isEstado12Group && idx === 0;
        const showPrioritySep = isEstado12Group && idx === priorityCount;

        return (
          <React.Fragment key={row.id}>
          {showPriorityLabel && (
            <TableRow style={{ borderBottom: 'none' }}>
              <TableCell colSpan={totalCols} className="px-4 pt-2 pb-1" style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>
                ⭐ Principais mercados
              </TableCell>
            </TableRow>
          )}
          {showPrioritySep && (
            <TableRow style={{ borderBottom: 'none' }}>
              <TableCell colSpan={totalCols} className="px-4 py-1" style={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
                <div style={{ borderTop: '1.5px dashed color-mix(in srgb, var(--border) 35%, transparent)' }} />
              </TableCell>
            </TableRow>
          )}
          <TableRow
            style={{
              background: isRecent
                ? 'color-mix(in srgb, #10B981 4%, var(--card))'
                : isSelected
                ? 'color-mix(in srgb, var(--primary) 5%, var(--card))'
                : idx % 2 === 0
                ? 'var(--card)'
                : 'color-mix(in srgb, var(--secondary) 30%, var(--card))',
              borderBottom: '1px solid color-mix(in srgb, var(--border) 12%, transparent)',
            }}
            onMouseEnter={(e) => {
              if (!isRecent && !isSelected) (e.currentTarget.style.background = 'color-mix(in srgb, var(--secondary) 50%, var(--card))');
            }}
            onMouseLeave={(e) => {
              if (!isRecent && !isSelected) {
                (e.currentTarget.style.background = idx % 2 === 0 ? 'var(--card)' : 'color-mix(in srgb, var(--secondary) 30%, var(--card))');
              }
            }}
          >
            {/* Checkbox */}
            <TableCell className="px-3 py-2.5" style={{ fontSize: 'inherit', lineHeight: 'inherit', borderLeft: `4px solid ${lucroBorderColor}` }}>
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => onToggleRow(row.id, e as React.MouseEvent)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggleRow(row.id, e as unknown as React.MouseEvent); }}
                className="w-4 h-4 rounded-[var(--radius-checkbox)] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                style={{
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  border: isSelected ? '1.5px solid var(--primary)' : '1.5px solid var(--muted)',
                }}
              >
                {isSelected && <Check size={10} color="var(--primary-foreground)" strokeWidth={3} />}
              </div>
            </TableCell>

            {/* ICMS (detail — Level 3) */}
            {showDetails && (
              <TableCell className="px-2 py-2.5">
                {row.icmsInter > 0 ? (
                  <span>{row.icmsInter}%</span>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: "'Inter', sans-serif" }}>—</span>
                )}
              </TableCell>
            )}

            {/* Destino — Level 1 Protagonist */}
            <TableCell className="px-3 py-2.5" style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '13px', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: "'Red Hat Display', sans-serif" }}>{row.destino}</span>
            </TableCell>

            {/* Detail cols — Level 3 */}
            {showDetails && (
              <>
                <TableCell className="px-2 py-2.5">{fmt(row.cmv)}</TableCell>
                <TableCell className="px-2 py-2.5">{fmt(row.vlUltCompra)}</TableCell>
                <TableCell className="px-2 py-2.5">
                  {row.tipo === 'marketplace' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">{row.despOper}%</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        E-commerce: 7% (diferente da distribuição padrão de 12%).
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span>{row.despOper}%</span>
                  )}
                </TableCell>
              </>
            )}

            {/* Markup (editable — InputGroup DS) */}
            <TableCell className="px-2 py-1.5">
              <InputGroup style={{
                height: 32,
                background: 'var(--card)',
                borderColor: editingCell?.id === row.id && editingCell.field === 'markup' ? 'var(--primary)' : 'var(--border)',
                borderWidth: 1,
                boxShadow: editingCell?.id === row.id && editingCell.field === 'markup' ? '0 0 0 3px color-mix(in srgb, var(--primary) 12%, transparent)' : 'none',
              }}>
                {editingCell?.id === row.id && editingCell.field === 'markup' ? (
                  <InputGroupInput
                    ref={inputRef}
                    type="number"
                    value={editValue}
                    onChange={(e) => onEditValueChange(e.target.value)}
                    onBlur={onCommitEdit}
                    onKeyDown={onKeyDown}
                    step={0.1}
                    style={{ fontSize: '12px', fontFamily: "'Inter', sans-serif", color: 'var(--foreground)', padding: '0 8px', textAlign: 'center' }}
                  />
                ) : (
                  <div
                    onClick={() => onStartEdit(row.id, 'markup')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onStartEdit(row.id, 'markup')}
                    className="flex-1 flex items-center justify-center cursor-pointer"
                    style={{ fontSize: '12px', fontFamily: "'Inter', sans-serif", color: 'var(--foreground)', lineHeight: '32px' }}
                  >
                    {row.markup.toFixed(1)}
                  </div>
                )}
                <InputGroupAddon style={{ width: 24, background: 'transparent', borderLeft: '1px solid var(--border)' }}>
                  <InputGroupText style={{ fontSize: '10px', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}>%</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </TableCell>

            {/* Vl. Bruto (read-only) */}
            <TableCell className="px-3 py-2.5">
              <span style={{ fontFamily: "'Inter', sans-serif" }}>
                {fmt(row.vlBruto)}
              </span>
            </TableCell>

            {/* IPI/ST (detail — Level 3) with R$/% toggle */}
            {showDetails && (
              <>
                <TableCell className="px-2 py-2.5">
                  {ipiMode === 'rs' ? fmt(row.vlIPI) : '5,0%'}
                </TableCell>
                <TableCell className="px-2 py-2.5">
                  {stMode === 'rs' ? fmt(row.vlST) : '3,0%'}
                </TableCell>
              </>
            )}

            {/* Vl. Final — Editable (InputGroup DS) */}
            <TableCell className="px-2 py-1.5">
              <InputGroup style={{
                height: 32,
                background: 'var(--card)',
                borderColor: editingCell?.id === row.id && editingCell.field === 'vlFinal' ? 'var(--primary)' : 'var(--border)',
                borderWidth: 1,
                boxShadow: editingCell?.id === row.id && editingCell.field === 'vlFinal' ? '0 0 0 3px color-mix(in srgb, var(--primary) 12%, transparent)' : 'none',
              }}>
                {editingCell?.id === row.id && editingCell.field === 'vlFinal' ? (
                  <InputGroupInput
                    ref={inputRef}
                    type="number"
                    value={editValue}
                    onChange={(e) => onEditValueChange(e.target.value)}
                    onBlur={onCommitEdit}
                    onKeyDown={onKeyDown}
                    step={0.01}
                    style={{ fontSize: '12px', fontFamily: "'Inter', sans-serif", color: 'var(--foreground)', padding: '0 8px', textAlign: 'center' }}
                  />
                ) : (
                  <div
                    onClick={() => onStartEdit(row.id, 'vlFinal')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onStartEdit(row.id, 'vlFinal')}
                    className="flex-1 flex items-center justify-center cursor-pointer"
                    style={{ fontSize: '12px', fontFamily: "'Inter', sans-serif", color: 'var(--foreground)', lineHeight: '32px' }}
                  >
                    {fmt(row.vlFinal)}
                  </div>
                )}
                <InputGroupAddon style={{ width: 28, background: 'transparent', borderLeft: '1px solid var(--border)' }}>
                  <InputGroupText style={{ fontSize: '9px', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}>R$</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </TableCell>

            {/* Margem Contribuição (when details shown) */}
            {showDetails && (() => {
              const mc = row.lucro;
              return (
                <TableCell className="px-2 py-2.5">
                  {mc.toFixed(1)}%
                </TableCell>
              );
            })()}

            {/* Lucro % (Margem Líquida = contrib × 0.66) */}
            <TableCell className="px-3 py-2.5">
              {(() => {
                const margemLiq = +(row.lucro * 0.66).toFixed(1);
                const liqColor = getLucroColor(margemLiq);
                return (
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-1.5 rounded-full overflow-hidden shrink-0" style={{ background: 'color-mix(in srgb, var(--secondary) 70%, transparent)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(Math.max(margemLiq, 0) / 40 * 100, 100)}%`,
                          background: liqColor,
                        }}
                      />
                    </div>
                    <span style={{ color: liqColor, fontFamily: "'Inter', sans-serif" }}>
                      {margemLiq.toFixed(1)}%
                    </span>
                  </div>
                );
              })()}
            </TableCell>

            {/* Giro — Level 2 Coadjuvant */}
            <TableCell className="px-2 py-2.5 text-center">{row.giro7d}</TableCell>
            <TableCell className="px-2 py-2.5 text-center">{row.giro30d}</TableCell>
            <TableCell className="px-2 py-2.5 text-center">{row.giro60d}</TableCell>
            <TableCell className="px-2 py-2.5 text-center">{row.giro360d}</TableCell>
          </TableRow>
          </React.Fragment>
        );
      })}

      {/* Spacer between groups */}
      {!collapsed && (
        <TableRow style={{ borderBottom: 'none' }}><TableCell colSpan={totalCols} className="h-1 p-0" style={{ fontSize: 'inherit', lineHeight: 'inherit' }} /></TableRow>
      )}
    </TableBody>
  );
}
