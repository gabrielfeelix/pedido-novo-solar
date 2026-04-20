import { useState, useMemo, type Dispatch, type SetStateAction } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Cable,
  Check,
  Layers3,
  LockKeyhole,
  Minus,
  PackageSearch,
  Plus,
  Search,
  ShoppingCart,
  SunMedium,
  TimerReset,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  panelProducts,
  inverterProducts,
  structureProducts,
  accessoryProducts,
  builderStepLabels,
  type SolarBuilderStep,
  type PrizeMode,
  connectionTypes,
  states,
  structureTypes,
} from '../data/solarOrderMockData';
import { usePedido, type GeneratorComponentItem, type SolarGenerator } from '../context/PedidoContext';

const PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400';
const PRODUCT_IMAGE_BY_ICON: Record<string, string> = {
  panel:
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400',
  inverter:
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400',
  structure:
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
  cable:
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400',
  connector:
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=400',
  profile:
    'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=400',
  loose:
    'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=400',
  stringBox:
    'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?auto=format&fit=crop&q=80&w=400',
};

const SUMMARY_IMAGE_BY_CATEGORY: Record<GeneratorComponentItem['category'], string> = {
  Painéis: PRODUCT_IMAGE_BY_ICON.panel,
  Inversores: PRODUCT_IMAGE_BY_ICON.inverter,
  'String Box': PRODUCT_IMAGE_BY_ICON.stringBox,
  Estrutura: PRODUCT_IMAGE_BY_ICON.structure,
  Acessórios: PRODUCT_IMAGE_BY_ICON.cable,
};

const stringBoxProducts = [
  {
    id: 'sbox-1',
    sku: '315148',
    name: 'Micro String Box Growatt Neo X2 Monofásico 220V 4 MPPT',
    brand: 'Growatt',
    unitPrice: 789.47,
    icon: 'stringBox',
    minKwp: 0.5,
    maxKwp: 2.25,
  },
  {
    id: 'sbox-2',
    sku: '315166',
    name: 'String Box Odex Smart 2 Entradas / 2 Saídas 1000V',
    brand: 'Odex',
    unitPrice: 1239.2,
    icon: 'stringBox',
    minKwp: 1.2,
    maxKwp: 5.0,
  },
  {
    id: 'sbox-3',
    sku: '315177',
    name: 'String Box Solar Group 4 Entradas / 4 Saídas 1500V',
    brand: 'Solar Group',
    unitPrice: 1890.0,
    icon: 'stringBox',
    minKwp: 4.5,
    maxKwp: 12.0,
  },
];

type SortDirection = 'asc' | 'desc';
type SortField = 'price' | 'brand' | 'power';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function normalizeText(value: string) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

const inputBase =
  'h-11 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20';

const selectTriggerBase =
  'h-11 rounded-lg border border-slate-300 bg-white text-slate-900 data-[placeholder]:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20';

type LiveItem = {
  id: string;
  category: GeneratorComponentItem['category'];
  name: string;
  sku: string;
  brand: string;
  quantity: number;
  unitPrice: number;
};

type PrefixedAccessory = {
  id: string;
  productId?: string;
  name: string;
  sku: string;
  brand: string;
  icon: keyof typeof PRODUCT_IMAGE_BY_ICON;
  quantity: number;
  unitPrice: number;
  sourceStructures: string[];
};

export function SolarBuilderPage() {
  const navigate = useNavigate();
  const pedido = usePedido();
  const [step, setStep] = useState<SolarBuilderStep>('setup');

  const [title, setTitle] = useState('Gerador Personalizado');
  const [connectionType, setConnectionType] = useState('Trifásico 380V');
  const [state, setState] = useState('PR');
  const [prizeMode, setPrizeMode] = useState<PrizeMode>('percent');
  const [prizeValue, setPrizeValue] = useState(0);

  const [selectedPanelId, setSelectedPanelId] = useState('');
  const [panelQuantity, setPanelQuantity] = useState(0);
  const [inverterQuantities, setInverterQuantities] = useState<Record<string, number>>({});
  const [stringBoxQuantities, setStringBoxQuantities] = useState<Record<string, number>>({});
  const [selectedStructureTypes, setSelectedStructureTypes] = useState<string[]>([...structureTypes]);
  const [structureQuantities, setStructureQuantities] = useState<Record<string, number>>({});
  const [accessoryQuantities, setAccessoryQuantities] = useState<Record<string, number>>({});

  const [panelQuery, setPanelQuery] = useState('');
  const [inverterQuery, setInverterQuery] = useState('');
  const [stringBoxQuery, setStringBoxQuery] = useState('');
  const [structureQuery, setStructureQuery] = useState('');
  const [accessoryQuery, setAccessoryQuery] = useState('');
  const [panelSortField, setPanelSortField] = useState<SortField>('price');
  const [panelSortDirection, setPanelSortDirection] = useState<SortDirection>('asc');
  const [inverterSortField, setInverterSortField] = useState<SortField>('price');
  const [inverterSortDirection, setInverterSortDirection] = useState<SortDirection>('asc');
  const [stringBoxSortField, setStringBoxSortField] = useState<SortField>('price');
  const [stringBoxSortDirection, setStringBoxSortDirection] = useState<SortDirection>('asc');
  const [structureSortField, setStructureSortField] = useState<'price' | 'brand'>('price');
  const [structureSortDirection, setStructureSortDirection] = useState<SortDirection>('asc');
  const [accessoryCategoryFilter, setAccessoryCategoryFilter] = useState<'all' | 'cables' | 'connectors' | 'profiles'>('all');
  const [accessorySortField, setAccessorySortField] = useState<'price' | 'brand'>('price');
  const [accessorySortDirection, setAccessorySortDirection] = useState<SortDirection>('asc');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const selectedPanel = useMemo(
    () => panelProducts.find((p) => p.id === selectedPanelId) ?? null,
    [selectedPanelId],
  );

  const powerKwp = useMemo(() => {
    if (!selectedPanel) return 0;
    return (selectedPanel.powerW * panelQuantity) / 1000;
  }, [selectedPanel, panelQuantity]);

  const prefixedAccessories = useMemo<PrefixedAccessory[]>(() => {
    const byKey: Record<string, PrefixedAccessory> = {};

    Object.entries(structureQuantities).forEach(([structureId, quantity]) => {
      if (quantity <= 0) return;
      const structure = structureProducts.find((item) => item.id === structureId);
      if (!structure?.requiredComponentName) return;

      const requiredNameNormalized = normalizeText(structure.requiredComponentName);
      const matchedAccessory = accessoryProducts.find((accessory) => {
        const accessoryNameNormalized = normalizeText(accessory.name);
        return (
          accessoryNameNormalized.includes(requiredNameNormalized) ||
          requiredNameNormalized.includes(accessoryNameNormalized)
        );
      });

      const key = matchedAccessory ? `matched-${matchedAccessory.id}` : `virtual-${requiredNameNormalized}`;
      const current = byKey[key];

      if (current) {
        current.quantity += quantity;
        current.sourceStructures = [...current.sourceStructures, structure.name];
        return;
      }

      const inferredIcon: keyof typeof PRODUCT_IMAGE_BY_ICON = matchedAccessory?.icon ?? (
        requiredNameNormalized.includes('perfil')
          ? 'profile'
          : requiredNameNormalized.includes('cabo')
            ? 'cable'
            : requiredNameNormalized.includes('conector')
              ? 'connector'
              : 'connector'
      );

      byKey[key] = {
        id: key,
        productId: matchedAccessory?.id,
        name: matchedAccessory?.name ?? structure.requiredComponentName,
        sku: matchedAccessory?.sku ?? 'DERIVADO',
        brand: matchedAccessory?.brand ?? structure.brand,
        icon: inferredIcon,
        quantity,
        unitPrice: matchedAccessory?.unitPrice ?? 0,
        sourceStructures: [structure.name],
      };
    });

    return Object.values(byKey);
  }, [structureQuantities]);

  const requiredAccessoryMinimums = useMemo(() => {
    const minimums: Record<string, number> = {};

    prefixedAccessories.forEach((item) => {
      if (!item.productId) return;
      minimums[item.productId] = (minimums[item.productId] ?? 0) + item.quantity;
    });

    accessoryProducts.forEach((item) => {
      if (!item.required) return;
      minimums[item.id] = Math.max(minimums[item.id] ?? 0, item.lockedQuantity ?? 1);
    });

    return minimums;
  }, [prefixedAccessories]);

  const liveItems = useMemo<LiveItem[]>(() => {
    const items: LiveItem[] = [];
    if (selectedPanel && panelQuantity > 0) {
      items.push({
        id: selectedPanel.id,
        category: 'Painéis',
        name: selectedPanel.name,
        sku: selectedPanel.sku,
        brand: selectedPanel.brand,
        quantity: panelQuantity,
        unitPrice: selectedPanel.unitPrice,
      });
    }
    Object.entries(inverterQuantities).forEach(([id, q]) => {
      if (q <= 0) return;
      const inv = inverterProducts.find((i) => i.id === id);
      if (inv) {
        items.push({
          id: inv.id,
          category: 'Inversores',
          name: inv.name,
          sku: inv.sku,
          brand: inv.brand,
          quantity: q,
          unitPrice: inv.unitPrice,
        });
      }
    });
    Object.entries(stringBoxQuantities).forEach(([id, q]) => {
      if (q <= 0) return;
      const stringBox = stringBoxProducts.find((item) => item.id === id);
      if (stringBox) {
        items.push({
          id: stringBox.id,
          category: 'String Box',
          name: stringBox.name,
          sku: stringBox.sku,
          brand: stringBox.brand,
          quantity: q,
          unitPrice: stringBox.unitPrice,
        });
      }
    });
    Object.entries(structureQuantities).forEach(([id, q]) => {
      if (q <= 0) return;
      const str = structureProducts.find((s) => s.id === id);
      if (str) {
        items.push({
          id: str.id,
          category: 'Estrutura',
          name: str.name,
          sku: str.sku,
          brand: str.brand,
          quantity: q,
          unitPrice: str.unitPrice,
        });
      }
    });
    accessoryProducts.forEach((accessory) => {
      const manualQuantity = accessoryQuantities[accessory.id] ?? 0;
      const lockedMinimum = requiredAccessoryMinimums[accessory.id] ?? 0;
      const quantity = Math.max(manualQuantity, lockedMinimum);
      if (quantity <= 0) return;
      items.push({
        id: accessory.id,
        category: 'Acessórios',
        name: accessory.name,
        sku: accessory.sku,
        brand: accessory.brand,
        quantity,
        unitPrice: accessory.unitPrice,
      });
    });

    prefixedAccessories
      .filter((item) => !item.productId)
      .forEach((item) => {
        items.push({
          id: item.id,
          category: 'Acessórios',
          name: item.name,
          sku: item.sku,
          brand: item.brand,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        });
      });

    return items;
  }, [
    selectedPanel,
    panelQuantity,
    inverterQuantities,
    stringBoxQuantities,
    structureQuantities,
    accessoryQuantities,
    requiredAccessoryMinimums,
    prefixedAccessories,
  ]);

  const subtotal = useMemo(
    () => liveItems.reduce((t, i) => t + i.quantity * i.unitPrice, 0),
    [liveItems],
  );

  const prizeAmount = useMemo(() => {
    if (prizeMode === 'percent') return subtotal * (prizeValue / 100);
    return prizeValue;
  }, [subtotal, prizeMode, prizeValue]);

  const total = subtotal + prizeAmount;

  const stepIndex = builderStepLabels.findIndex((s) => s.id === step);
  const countsByCategory = useMemo(() => {
    const byCat: Record<string, number> = {};
    liveItems.forEach((i) => {
      byCat[i.category] = (byCat[i.category] ?? 0) + i.quantity;
    });
    return byCat;
  }, [liveItems]);

  const filteredPanels = useMemo(() => {
    const q = normalizeText(panelQuery);
    const filtered = panelProducts.filter((p) =>
      normalizeText(`${p.name} ${p.brand} ${p.sku}`).includes(q),
    );
    const sorted = [...filtered].sort((a, b) => {
      if (panelSortField === 'brand') return a.brand.localeCompare(b.brand, 'pt-BR');
      if (panelSortField === 'power') return a.powerW - b.powerW;
      return a.unitPrice - b.unitPrice;
    });
    return panelSortDirection === 'asc' ? sorted : sorted.reverse();
  }, [panelQuery, panelSortField, panelSortDirection]);

  const filteredInverters = useMemo(() => {
    const q = normalizeText(inverterQuery);
    const base = inverterProducts.filter((i) => i.connection === connectionType);
    const filtered = (base.length > 0 ? base : inverterProducts).filter((p) =>
      normalizeText(`${p.name} ${p.brand} ${p.sku}`).includes(q),
    );
    const sorted = [...filtered].sort((a, b) => {
      if (inverterSortField === 'brand') return a.brand.localeCompare(b.brand, 'pt-BR');
      if (inverterSortField === 'power') return a.maxKwp - b.maxKwp;
      return a.unitPrice - b.unitPrice;
    });
    return inverterSortDirection === 'asc' ? sorted : sorted.reverse();
  }, [inverterQuery, connectionType, inverterSortField, inverterSortDirection]);

  const filteredStringBoxes = useMemo(() => {
    const q = normalizeText(stringBoxQuery);
    const filtered = stringBoxProducts.filter((p) =>
      normalizeText(`${p.name} ${p.brand} ${p.sku}`).includes(q),
    );
    const sorted = [...filtered].sort((a, b) => {
      if (stringBoxSortField === 'brand') return a.brand.localeCompare(b.brand, 'pt-BR');
      if (stringBoxSortField === 'power') return a.maxKwp - b.maxKwp;
      return a.unitPrice - b.unitPrice;
    });
    return stringBoxSortDirection === 'asc' ? sorted : sorted.reverse();
  }, [stringBoxQuery, stringBoxSortField, stringBoxSortDirection]);

  const filteredStructures = useMemo(() => {
    const q = normalizeText(structureQuery);
    const activeStructureTypes = selectedStructureTypes.length > 0 ? selectedStructureTypes : [...structureTypes];
    const filtered = structureProducts.filter(
      (p) => p.structureType === 'Universal' || activeStructureTypes.includes(p.structureType),
    ).filter((p) => normalizeText(`${p.name} ${p.brand} ${p.sku}`).includes(q));
    const sorted = [...filtered].sort((a, b) => {
      if (structureSortField === 'brand') return a.brand.localeCompare(b.brand, 'pt-BR');
      return a.unitPrice - b.unitPrice;
    });
    return structureSortDirection === 'asc' ? sorted : sorted.reverse();
  }, [structureQuery, selectedStructureTypes, structureSortField, structureSortDirection]);

  const filteredAccessories = useMemo(() => {
    const q = normalizeText(accessoryQuery);
    const byCategory = accessoryProducts.filter((p) =>
      accessoryCategoryFilter === 'all' ? true : p.category === accessoryCategoryFilter,
    );
    const filtered = byCategory.filter((p) =>
      normalizeText(`${p.name} ${p.brand} ${p.sku}`).includes(q),
    );
    const sorted = [...filtered].sort((a, b) => {
      if (accessorySortField === 'brand') return a.brand.localeCompare(b.brand, 'pt-BR');
      return a.unitPrice - b.unitPrice;
    });
    return accessorySortDirection === 'asc' ? sorted : sorted.reverse();
  }, [accessoryQuery, accessoryCategoryFilter, accessorySortField, accessorySortDirection]);

  const handleNext = () => {
    if (stepIndex < builderStepLabels.length - 1) {
      setStep(builderStepLabels[stepIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStep(builderStepLabels[stepIndex - 1].id);
    }
  };

  const updateQuantity = (
    setter: Dispatch<SetStateAction<Record<string, number>>>,
    id: string,
    delta: number,
  ) => {
    setter((prev) => {
      const next = { ...prev };
      const current = next[id] || 0;
      const newVal = Math.max(0, current + delta);
      if (newVal === 0) delete next[id];
      else next[id] = newVal;
      return next;
    });
  };

  const updateAccessoryQuantity = (id: string, delta: number) => {
    setAccessoryQuantities((prev) => {
      const next = { ...prev };
      const requiredMinimum = requiredAccessoryMinimums[id] ?? 0;
      const current = Math.max(next[id] ?? 0, requiredMinimum);
      const newValue = Math.max(requiredMinimum, current + delta);
      if (newValue === 0) delete next[id];
      else next[id] = newValue;
      return next;
    });
  };

  const removeLiveItem = (id: string, category: LiveItem['category']) => {
    if (category === 'Painéis') {
      setPanelQuantity(0);
      setSelectedPanelId('');
      return;
    }
    if (category === 'Inversores') {
      setInverterQuantities((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    if (category === 'String Box') {
      setStringBoxQuantities((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    if (category === 'Estrutura') {
      setStructureQuantities((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    if (category === 'Acessórios') {
      if (requiredAccessoryMinimums[id]) return;
      setAccessoryQuantities((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const hasBuilderProgress = Boolean(
    selectedPanelId
    || panelQuantity > 0
    || Object.keys(inverterQuantities).length > 0
    || Object.keys(stringBoxQuantities).length > 0
    || Object.keys(structureQuantities).length > 0
    || Object.keys(accessoryQuantities).length > 0
    || title !== 'Gerador Personalizado'
    || connectionType !== 'Trifásico 380V'
    || state !== 'PR'
    || prizeMode !== 'percent'
    || prizeValue !== 0,
  );

  const resetBuilderFlow = () => {
    setSelectedPanelId('');
    setPanelQuantity(0);
    setInverterQuantities({});
    setStringBoxQuantities({});
    setStructureQuantities({});
    setAccessoryQuantities({});
    setPanelQuery('');
    setInverterQuery('');
    setStringBoxQuery('');
    setStructureQuery('');
    setAccessoryQuery('');
    setPanelSortField('price');
    setPanelSortDirection('asc');
    setInverterSortField('price');
    setInverterSortDirection('asc');
    setStringBoxSortField('price');
    setStringBoxSortDirection('asc');
    setSelectedStructureTypes([...structureTypes]);
    setStructureSortField('price');
    setStructureSortDirection('asc');
    setAccessoryCategoryFilter('all');
    setAccessorySortField('price');
    setAccessorySortDirection('asc');
    setTitle('Gerador Personalizado');
    setConnectionType('Trifásico 380V');
    setState('PR');
    setPrizeMode('percent');
    setPrizeValue(0);
    setStep('setup');
  };

  const toggleStructureType = (type: string) => {
    setSelectedStructureTypes((prev) => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== type);
      }
      return [...prev, type];
    });
  };

  const canConclude = (
    Boolean(pedido.clientePedido)
    && Boolean(pedido.clienteNota)
    && Boolean(selectedPanel)
    && panelQuantity > 0
    && liveItems.some((item) => item.category === 'Inversores')
    && liveItems.some((item) => item.category === 'Estrutura')
  );
  const missingIntegrator = !pedido.clientePedido;
  const missingBillingClient = !pedido.clienteNota;
  const missingPanel = !selectedPanel || panelQuantity <= 0;
  const missingInverter = !liveItems.some((item) => item.category === 'Inversores');
  const missingStructure = !liveItems.some((item) => item.category === 'Estrutura');
  const missingItems = [
    missingPanel ? 'Selecionar ao menos 1 painel com quantidade maior que zero.' : null,
    missingInverter ? 'Adicionar ao menos 1 inversor ao kit.' : null,
    missingStructure ? 'Adicionar ao menos 1 item de estrutura de fixação.' : null,
    missingIntegrator ? 'Definir o integrador no Novo Pedido Solar.' : null,
    missingBillingClient ? 'Definir o cliente para faturamento no Novo Pedido Solar.' : null,
  ].filter((item): item is string => Boolean(item));
  const firstMissingBuilderStep: SolarBuilderStep | null = missingPanel
    ? 'panels'
    : missingInverter
      ? 'inverters'
      : missingStructure
        ? 'structure'
        : null;

  function handleConclude() {
    if (!canConclude) return;
    if (!pedido.invoiceObservation.trim()) {
      pedido.setInvoiceObservation('NÃO REALIZAR ENTREGA SEM AGENDAMENTO PRÉVIO COM O CLIENTE.');
    }
    if (!pedido.orderObservation.trim()) {
      pedido.setOrderObservation(
        'Pedido gerado via montagem solar no CRM. Validar aprovação técnica antes do fechamento.',
      );
    }

    const components: GeneratorComponentItem[] = liveItems.map((i) => ({
      id: `comp-${i.id}-${Date.now()}`,
      category: i.category,
      name: i.name,
      sku: i.sku,
      brand: i.brand,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    }));
    const now = new Date();
    const generator: SolarGenerator = {
      id: `generator-${Date.now()}`,
      type: 'generator',
      title,
      sku: `GER-${Date.now().toString().slice(-5)}`,
      connectionType,
      state,
      prizeMode,
      prizeValue,
      prizeAmount,
      subtotal,
      total,
      powerKwp,
      approvalStatus: 'pending',
      approvalResponsible: 'Consultor Solar',
      approvalTimestamp: new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(now),
      approvalNote: 'Gerador recém-montado. Aguardando revisão técnica.',
      components,
    };
    pedido.addGenerator(generator);
    navigate('/vendas/novo-pedido-solar');
  }

  /* ---------------- Product Card ---------------- */
  const renderProductCard = (
    product: any,
    quantity: number,
    onDecrease: () => void,
    onIncrease: () => void,
    onClick?: () => void,
    isSelected?: boolean,
  ) => {
    const selectable = Boolean(onClick);
    const imageSrc = PRODUCT_IMAGE_BY_ICON[product.icon] ?? PRODUCT_IMAGE;
    return (
      <div key={product.id} onClick={onClick} className={selectable ? 'cursor-pointer' : ''}>
        <Card
          className={`overflow-hidden transition-all duration-200 border-2 ${
            isSelected ? 'border-blue-600 ring-4 ring-blue-600/10' : 'border-slate-200 hover:border-slate-300'
          } shadow-sm hover:shadow-md`}
        >
          <div className="relative h-36 w-full bg-slate-100">
            <img
              src={imageSrc}
              alt={product.name}
              className="h-full w-full object-cover mix-blend-multiply"
            />
          </div>
          <CardContent className="flex min-h-[172px] flex-col justify-between p-4">
            <div>
              <div className="mb-2 flex items-start justify-between gap-2">
                <Badge
                  variant="outline"
                  className="border-slate-200 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"
                >
                  {product.brand}
                </Badge>
                {product.powerW ? (
                  <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {product.powerW}W
                  </Badge>
                ) : null}
              </div>
              <h4 className="mb-1 text-sm font-semibold leading-tight text-slate-900 line-clamp-2">
                {product.name}
              </h4>
              <p className="mb-3 text-xs text-slate-500">SKU {product.sku}</p>
              {'minKwp' in product && 'maxKwp' in product ? (
                <p className="mb-2 text-xs font-medium text-blue-700">
                  Potência mínima: {product.minKwp}kW | Potência máxima: {product.maxKwp}kW
                </p>
              ) : null}
            </div>
            <div className="mt-auto flex items-end justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400">Preço unit.</p>
                <p className="text-base font-bold text-slate-900">
                  {formatCurrency(product.unitPrice)}
                </p>
              </div>
              {selectable ? (
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              ) : (
                <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white p-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDecrease();
                    }}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="min-w-7 text-center text-sm font-semibold text-slate-900">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onIncrease();
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  /* ---------------- Filter + Sorting toolbar ---------------- */
  const FilterSortBar = ({
    query,
    onQueryChange,
    queryPlaceholder,
    sortField,
    onSortFieldChange,
    sortDirection,
    onSortDirectionToggle,
    onClear,
    options,
  }: {
    query: string;
    onQueryChange: (value: string) => void;
    queryPlaceholder: string;
    sortField: string;
    onSortFieldChange: (value: string) => void;
    sortDirection: SortDirection;
    onSortDirectionToggle: () => void;
    onClear: () => void;
    options: Array<{ value: string; label: string }>;
  }) => (
    <div className="mb-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Buscar</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={queryPlaceholder}
            className={`${inputBase} pl-9`}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ordenar por</label>
        <div className="flex items-center gap-2">
          <Select value={sortField} onValueChange={onSortFieldChange}>
            <SelectTrigger className={`${selectTriggerBase} flex-1`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 border-slate-300"
            onClick={onSortDirectionToggle}
            title={sortDirection === 'asc' ? 'Crescente' : 'Decrescente'}
          >
            <ArrowUp className={`h-4 w-4 transition ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 border-slate-300"
            onClick={onClear}
            title="Limpar filtros"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  /* ---------------- Steps ---------------- */
  const renderSetup = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Dados iniciais</h2>
        <p className="mt-1 text-sm text-slate-600">
          Configure os parâmetros base que pautam o restante da montagem.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Nome do gerador
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Gerador Cliente Azevedo"
            className={inputBase}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Estado de destino
          </label>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className={selectTriggerBase}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {states.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tipo de ligação
          </label>
          <Select value={connectionType} onValueChange={setConnectionType}>
            <SelectTrigger className={selectTriggerBase}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {connectionTypes.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Prêmio venda direta
          </label>
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-slate-300 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setPrizeMode('percent')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  prizeMode === 'percent'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => setPrizeMode('currency')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  prizeMode === 'currency'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                R$
              </button>
            </div>
            <Input
              type="number"
              min={0}
              value={prizeValue}
              onChange={(e) => setPrizeValue(Number(e.target.value) || 0)}
              placeholder="0"
              className={`${inputBase} flex-1`}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPanels = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Módulos solares</h2>
        <p className="mt-1 text-sm text-slate-600">
          Escolha o painel e informe a quantidade. A potência é calculada automaticamente.
        </p>
      </div>
      <FilterSortBar
        query={panelQuery}
        onQueryChange={setPanelQuery}
        queryPlaceholder="Código, nome..."
        sortField={panelSortField}
        onSortFieldChange={(value) => setPanelSortField(value as SortField)}
        sortDirection={panelSortDirection}
        onSortDirectionToggle={() => setPanelSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
        onClear={() => {
          setPanelQuery('');
          setPanelSortField('price');
          setPanelSortDirection('asc');
        }}
        options={[
          { value: 'price', label: 'Preço' },
          { value: 'brand', label: 'Marca' },
          { value: 'power', label: 'Potência' },
        ]}
      />

      {selectedPanelId ? (
        <div className="flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Painel selecionado
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{selectedPanel?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Quantidade
            </label>
            <div className="flex items-center gap-1 rounded-lg border border-blue-200 bg-white p-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPanelQuantity((q) => Math.max(0, q - 1))}
              >
                <Minus className="h-4 w-4 text-blue-700" />
              </Button>
              <input
                type="number"
                min={0}
                value={panelQuantity}
                onChange={(e) => setPanelQuantity(Math.max(0, Number(e.target.value) || 0))}
                className="w-14 border-0 bg-transparent text-center text-base font-bold text-slate-900 outline-none"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPanelQuantity((q) => q + 1)}
              >
                <Plus className="h-4 w-4 text-blue-700" />
              </Button>
            </div>
            <div className="rounded-lg bg-white px-3 py-2 text-right">
              <p className="text-[10px] uppercase tracking-wider text-blue-600">Potência</p>
              <p className="text-lg font-bold text-slate-950">{powerKwp.toFixed(2)} kWp</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPanels.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Nenhum painel encontrado com esses filtros.
          </div>
        ) : (
          filteredPanels.map((p) =>
            renderProductCard(
              p,
              0,
              () => {},
              () => {},
              () => setSelectedPanelId(p.id),
              selectedPanelId === p.id,
            ),
          )
        )}
      </div>
    </div>
  );

  const renderInverters = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Inversores</h2>
        <p className="mt-1 text-sm text-slate-600">
          Filtrado por ligação {connectionType} · sistema de {powerKwp.toFixed(2)} kWp.
        </p>
      </div>
      <FilterSortBar
        query={inverterQuery}
        onQueryChange={setInverterQuery}
        queryPlaceholder="Código, nome..."
        sortField={inverterSortField}
        onSortFieldChange={(value) => setInverterSortField(value as SortField)}
        sortDirection={inverterSortDirection}
        onSortDirectionToggle={() => setInverterSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
        onClear={() => {
          setInverterQuery('');
          setInverterSortField('price');
          setInverterSortDirection('asc');
        }}
        options={[
          { value: 'price', label: 'Preço' },
          { value: 'brand', label: 'Marca' },
          { value: 'power', label: 'Potência' },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredInverters.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Nenhum inversor encontrado com esses filtros.
          </div>
        ) : (
          filteredInverters.map((p) =>
            renderProductCard(p, inverterQuantities[p.id] || 0, () =>
              updateQuantity(setInverterQuantities, p.id, -1), () =>
              updateQuantity(setInverterQuantities, p.id, 1),
            ),
          )
        )}
      </div>
    </div>
  );

  const renderStructure = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Estrutura de fixação</h2>
        <p className="mt-1 text-sm text-slate-600">
          Todas as categorias de telhado já vêm selecionadas. Use os chips abaixo para filtrar as estruturas que suportam {panelQuantity || '—'} painéis.
        </p>
      </div>
      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Categorias de telhado
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 border-slate-300 text-xs"
            onClick={() => setSelectedStructureTypes([...structureTypes])}
          >
            Selecionar todas
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {structureTypes.map((type) => {
            const selected = selectedStructureTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleStructureType(type)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  selected
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500">
          {selectedStructureTypes.length} de {structureTypes.length} categoria(s) ativa(s)
        </p>
      </div>
      <FilterSortBar
        query={structureQuery}
        onQueryChange={setStructureQuery}
        queryPlaceholder="Código, nome..."
        sortField={structureSortField}
        onSortFieldChange={(value) => setStructureSortField(value as 'price' | 'brand')}
        sortDirection={structureSortDirection}
        onSortDirectionToggle={() => setStructureSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
        onClear={() => {
          setStructureQuery('');
          setStructureSortField('price');
          setStructureSortDirection('asc');
        }}
        options={[
          { value: 'price', label: 'Preço' },
          { value: 'brand', label: 'Marca' },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStructures.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Nenhuma estrutura compatível com os filtros aplicados.
          </div>
        ) : (
          filteredStructures.map((p) =>
            renderProductCard(p, structureQuantities[p.id] || 0, () =>
              updateQuantity(setStructureQuantities, p.id, -1), () =>
              updateQuantity(setStructureQuantities, p.id, 1),
            ),
          )
        )}
      </div>
    </div>
  );

  const renderAccessories = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Acessórios e cabos</h2>
        <p className="mt-1 text-sm text-slate-600">
          Complementos necessários para a instalação. Alguns itens entram prefixados conforme a estrutura.
        </p>
      </div>

      {prefixedAccessories.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-900">
            <LockKeyhole className="h-4 w-4" />
            Itens prefixados pela estrutura escolhida
          </div>
          <div className="space-y-1.5 text-sm">
            {prefixedAccessories.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 rounded-lg bg-white/70 px-3 py-2">
                <div className="flex min-w-0 items-start gap-3">
                  <img
                    src={PRODUCT_IMAGE_BY_ICON[item.icon] ?? PRODUCT_IMAGE}
                    alt={item.name}
                    className="h-11 w-11 shrink-0 rounded-md border border-amber-200 bg-white object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{item.quantity}x {item.name}</p>
                    <p className="text-xs text-slate-600">SKU {item.sku} · {item.brand}</p>
                    <p className="text-xs text-amber-700">Origem: {item.sourceStructures.join(', ')}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-900">{formatCurrency(item.quantity * item.unitPrice)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <FilterSortBar
        query={accessoryQuery}
        onQueryChange={setAccessoryQuery}
        queryPlaceholder="Código, nome..."
        sortField={accessorySortField}
        onSortFieldChange={(value) => setAccessorySortField(value as 'price' | 'brand')}
        sortDirection={accessorySortDirection}
        onSortDirectionToggle={() => setAccessorySortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
        onClear={() => {
          setAccessoryQuery('');
          setAccessoryCategoryFilter('all');
          setAccessorySortField('price');
          setAccessorySortDirection('asc');
        }}
        options={[
          { value: 'price', label: 'Preço' },
          { value: 'brand', label: 'Marca' },
        ]}
      />
      <div className="grid gap-4 md:grid-cols-[280px_minmax(0,1fr)] md:items-end">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Categoria
          </label>
          <Select value={accessoryCategoryFilter} onValueChange={(value) => setAccessoryCategoryFilter(value as 'all' | 'cables' | 'connectors' | 'profiles')}>
            <SelectTrigger className={selectTriggerBase}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="cables">Cabos</SelectItem>
              <SelectItem value="connectors">Conectores</SelectItem>
              <SelectItem value="profiles">Perfis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-xs text-slate-500">
          {filteredAccessories.length} item(ns) encontrado(s) para os filtros atuais.
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAccessories.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Nenhum acessório encontrado com esses filtros.
          </div>
        ) : null}
        {filteredAccessories.map((product) => {
          const lockedMinimum = requiredAccessoryMinimums[product.id] ?? 0;
          const quantity = Math.max(accessoryQuantities[product.id] ?? 0, lockedMinimum);
          const locked = lockedMinimum > 0;
          return (
            <Card key={product.id} className="overflow-hidden border-2 border-slate-200 shadow-sm">
              <div className="relative h-36 w-full bg-slate-100">
                <img src={PRODUCT_IMAGE_BY_ICON[product.icon] ?? PRODUCT_IMAGE} alt={product.name} className="h-full w-full object-cover mix-blend-multiply" />
                {locked ? (
                  <Badge className="absolute left-2 top-2 bg-amber-100 text-amber-800">
                    <LockKeyhole className="mr-1 h-3 w-3" /> Prefixado
                  </Badge>
                ) : null}
              </div>
              <CardContent className="space-y-3 p-4">
                <div>
                  <p className="line-clamp-2 text-sm font-semibold text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500">SKU {product.sku} · {product.brand}</p>
                  {locked ? (
                    <p className="mt-1 text-xs text-amber-700">Mínimo obrigatório: {lockedMinimum}</p>
                  ) : null}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-slate-900">{formatCurrency(product.unitPrice)}</p>
                  <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white p-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={locked && quantity <= lockedMinimum}
                      onClick={() => updateAccessoryQuantity(product.id, -1)}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="min-w-7 text-center text-sm font-semibold text-slate-900">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-blue-600"
                      onClick={() => updateAccessoryQuantity(product.id, 1)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderStringBox = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">String Box</h2>
        <p className="mt-1 text-sm text-slate-600">
          Selecione os modelos de String Box compatíveis com a montagem.
        </p>
      </div>
      <FilterSortBar
        query={stringBoxQuery}
        onQueryChange={setStringBoxQuery}
        queryPlaceholder="Código, nome..."
        sortField={stringBoxSortField}
        onSortFieldChange={(value) => setStringBoxSortField(value as SortField)}
        sortDirection={stringBoxSortDirection}
        onSortDirectionToggle={() => setStringBoxSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
        onClear={() => {
          setStringBoxQuery('');
          setStringBoxSortField('price');
          setStringBoxSortDirection('asc');
        }}
        options={[
          { value: 'price', label: 'Preço' },
          { value: 'brand', label: 'Marca' },
          { value: 'power', label: 'Potência' },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStringBoxes.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Nenhum item de String Box encontrado com esses filtros.
          </div>
        ) : (
          filteredStringBoxes.map((product) =>
            renderProductCard(
              product,
              stringBoxQuantities[product.id] || 0,
              () => updateQuantity(setStringBoxQuantities, product.id, -1),
              () => updateQuantity(setStringBoxQuantities, product.id, 1),
            ),
          )
        )}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Revisão do kit</h2>
        <p className="mt-1 text-sm text-slate-600">
          Confira o kit completo e valide as pendências visuais antes de inserir como linha fechada no pedido.
        </p>
      </div>

      {!canConclude ? (
        <Card className="border-amber-200 bg-amber-50 shadow-sm">
          <CardContent className="space-y-4 py-4">
            <div>
              <p className="text-sm font-semibold text-amber-950">
                Ainda falta concluir estes pontos para inserir o kit no pedido:
              </p>
              <div className="mt-3 space-y-2">
                {missingItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-amber-200 bg-white/70 px-3 py-2 text-sm text-amber-900"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {firstMissingBuilderStep ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(firstMissingBuilderStep)}
                  className="border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
                >
                  Corrigir montagem
                </Button>
              ) : null}
              {(missingIntegrator || missingBillingClient) ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/vendas/novo-pedido-solar')}
                  className="border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
                >
                  Abrir novo pedido solar
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {liveItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          Nenhum componente selecionado. Volte aos passos anteriores para montar o kit.
        </div>
      ) : (
        <div className="space-y-4">
          {(['Painéis', 'Inversores', 'String Box', 'Estrutura', 'Acessórios'] as const).map((cat) => {
            const items = liveItems.filter((i) => i.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  {categoryIcon(cat)} {cat}
                </div>
                <div className="divide-y divide-slate-100">
                  {items.map((i) => (
                    <div
                      key={i.id}
                      className="flex items-center justify-between gap-3 py-2 text-sm"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={SUMMARY_IMAGE_BY_CATEGORY[i.category]}
                          alt={i.name}
                          className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">{i.name}</p>
                          <p className="text-xs text-slate-500">
                            SKU {i.sku} · {i.brand}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500">×{i.quantity}</span>
                        <span className="min-w-[100px] text-right font-semibold text-slate-900">
                          {formatCurrency(i.quantity * i.unitPrice)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${
                            i.category === 'Acessórios' && requiredAccessoryMinimums[i.id]
                              ? 'text-amber-500'
                              : 'text-slate-500 hover:text-red-600'
                          }`}
                          onClick={() => removeLiveItem(i.id, i.category)}
                          disabled={Boolean(i.category === 'Acessórios' && requiredAccessoryMinimums[i.id])}
                          aria-label="Excluir item da revisão"
                          title={
                            i.category === 'Acessórios' && requiredAccessoryMinimums[i.id]
                              ? 'Item prefixado pela estrutura'
                              : 'Excluir item'
                          }
                        >
                          {i.category === 'Acessórios' && requiredAccessoryMinimums[i.id] ? (
                            <LockKeyhole className="h-4 w-4" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 'setup':
        return renderSetup();
      case 'panels':
        return renderPanels();
      case 'inverters':
        return renderInverters();
      case 'stringBox':
        return renderStringBox();
      case 'structure':
        return renderStructure();
      case 'accessories':
        return renderAccessories();
      case 'summary':
        return renderSummary();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate('/vendas/novo-pedido-solar')}
              aria-label="Voltar"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Montagem de gerador
              </p>
              <h1 className="text-lg font-semibold text-slate-900">Kits Personalizados</h1>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-slate-300"
            onClick={() => {
              if (!hasBuilderProgress) {
                resetBuilderFlow();
                return;
              }
              setResetDialogOpen(true);
            }}
          >
            <TimerReset className="h-4 w-4" /> Reiniciar
          </Button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1800px] gap-8 px-6 py-8 xl:px-10">
        <main className="min-w-0 flex-1">
          {/* Stepper */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-4 lg:grid-cols-7">
              {builderStepLabels.map((s, idx) => {
                const isActive = s.id === step;
                const isPast = idx < stepIndex;
                return (
                  <div key={s.id} className="min-w-0">
                    <button
                      type="button"
                      onClick={() => setStep(s.id)}
                      className="group flex w-full min-w-0 flex-col items-center rounded-xl px-2 py-2 text-center transition hover:bg-slate-50"
                    >
                      <div className="relative flex w-full justify-center">
                        {idx > 0 ? (
                          <div
                            className={`absolute left-0 top-1/2 hidden h-[2px] w-[calc(50%-1.5rem)] -translate-y-1/2 rounded-full transition lg:block ${
                              idx <= stepIndex ? 'bg-blue-500' : 'bg-slate-200'
                            }`}
                          />
                        ) : null}
                        {idx < builderStepLabels.length - 1 ? (
                          <div
                            className={`absolute right-0 top-1/2 hidden h-[2px] w-[calc(50%-1.5rem)] -translate-y-1/2 rounded-full transition lg:block ${
                              idx < stepIndex ? 'bg-blue-500' : 'bg-slate-200'
                            }`}
                          />
                        ) : null}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                            isActive
                              ? 'bg-blue-600 text-white ring-4 ring-blue-600/15'
                              : isPast
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                          }`}
                        >
                          {isPast ? <Check className="h-4 w-4" /> : idx + 1}
                        </div>
                      </div>
                      <span
                        className={`mt-2 line-clamp-2 min-h-[2.5rem] w-full text-center text-xs font-semibold leading-tight ${
                          isActive ? 'text-slate-950' : isPast ? 'text-slate-700' : 'text-slate-500'
                        }`}
                      >
                        {s.shortLabel ?? s.label}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step content */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            {renderStepContent()}

            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
              <Button
                variant="outline"
                className="border-slate-300"
                onClick={handlePrev}
                disabled={stepIndex === 0}
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              {step !== 'summary' ? (
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleNext}
                >
                  Avançar <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="bg-[#001233] text-white hover:bg-[#001233]/90"
                  disabled={!canConclude}
                  onClick={handleConclude}
                >
                  <ShoppingCart className="h-4 w-4" /> Inserir no pedido
                </Button>
              )}
            </div>
          </div>
        </main>

        {/* Live Resumo Comercial */}
        <aside className="hidden w-[380px] shrink-0 xl:block">
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-[#001233] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                Resumo comercial
              </p>
              <h3 className="mt-1 truncate text-lg font-semibold">{title || 'Novo gerador'}</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="uppercase tracking-wider text-slate-400">Potência</p>
                  <p className="mt-1 text-base font-bold text-white">{powerKwp.toFixed(2)} kWp</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="uppercase tracking-wider text-slate-400">Itens</p>
                  <p className="mt-1 text-base font-bold text-white">
                    {liveItems.reduce((t, i) => t + i.quantity, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="max-h-[360px] space-y-3 overflow-y-auto p-4">
              {liveItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                  Selecione componentes — eles aparecem aqui em tempo real.
                </div>
              ) : (
                (['Painéis', 'Inversores', 'String Box', 'Estrutura', 'Acessórios'] as const).map((cat) => {
                  const items = liveItems.filter((i) => i.category === cat);
                  if (items.length === 0) return null;
                  return (
                    <div key={cat}>
                      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {categoryIcon(cat)} {cat}
                        <span className="text-slate-400">· {countsByCategory[cat]}</span>
                      </div>
                      <div className="space-y-1.5">
                        {items.map((i) => (
                          <div
                            key={i.id}
                            className="group flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-2"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-slate-900">
                                {i.name}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {i.quantity} × {formatCurrency(i.unitPrice)}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs font-semibold text-slate-900">
                                {formatCurrency(i.quantity * i.unitPrice)}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeLiveItem(i.id, i.category)}
                                className={`transition group-hover:opacity-100 ${
                                  i.category === 'Acessórios' && requiredAccessoryMinimums[i.id]
                                    ? 'cursor-not-allowed text-amber-500 opacity-100'
                                    : 'text-slate-300 opacity-0 hover:text-red-500'
                                }`}
                                aria-label="Remover"
                                title={
                                  i.category === 'Acessórios' && requiredAccessoryMinimums[i.id]
                                    ? 'Item prefixado pela estrutura'
                                    : 'Remover'
                                }
                              >
                                {i.category === 'Acessórios' && requiredAccessoryMinimums[i.id]
                                  ? <LockKeyhole className="h-3.5 w-3.5" />
                                  : <Trash2 className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="space-y-3 border-t border-slate-100 bg-slate-50/40 p-5">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Prêmio venda direta</span>
                <span className="font-semibold text-emerald-600">
                  +{formatCurrency(prizeAmount)}
                </span>
              </div>
              <div className="flex items-end justify-between border-t border-slate-200 pt-3">
                <span className="text-xs uppercase tracking-wider text-slate-500">Total</span>
                <span className="text-2xl font-bold text-slate-950">{formatCurrency(total)}</span>
              </div>
              <Button
                className="h-12 w-full bg-[#001233] text-base font-semibold text-white hover:bg-[#001233]/90"
                disabled={!canConclude}
                onClick={handleConclude}
              >
                Concluir montagem
              </Button>
              <p className="text-center text-[11px] text-slate-400">
                Valor pode variar conforme tributação do cliente final.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Reiniciar montagem do kit?</DialogTitle>
            <DialogDescription>
              Isso limpa componentes selecionados, filtros e parâmetros comerciais da montagem atual.
              O pedido solar em si não será descartado.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Componentes, quantidades e estrutura serão removidos. Use essa ação somente se quiser
            começar a montagem novamente do zero.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>
              Continuar editando
            </Button>
            <Button
              className="bg-[#001233] text-white hover:bg-[#001233]/90"
              onClick={() => {
                resetBuilderFlow();
                setResetDialogOpen(false);
              }}
            >
              Reiniciar fluxo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function categoryIcon(cat: GeneratorComponentItem['category']) {
  if (cat === 'Painéis') return <SunMedium className="h-3.5 w-3.5" />;
  if (cat === 'Inversores') return <Wrench className="h-3.5 w-3.5" />;
  if (cat === 'String Box') return <PackageSearch className="h-3.5 w-3.5" />;
  if (cat === 'Estrutura') return <Layers3 className="h-3.5 w-3.5" />;
  if (cat === 'Acessórios') return <Cable className="h-3.5 w-3.5" />;
  return null;
}
