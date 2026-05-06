import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { DeliveryArea, OrderParty } from '../data/solarOrderMockData';
import {
  assessGeneratorCustomizationFromComponents,
  buildTriangulationInvoiceObservation,
} from '../lib/solarCommercialRules';
import type { LinePricingAdjustment } from '../lib/solarOrderPricing';

const STORAGE_KEY = 'odex-solar-budgets-v1';
const DEFAULT_CONSULTANT = '513 · Jhulielem R. Philot';

export type SaleType = 'normal' | 'direct' | 'triangulation';
export type BudgetStatus =
  | 'draft'
  | 'quoted'
  | 'sent'
  | 'pending_technical'
  | 'ready_to_convert'
  | 'expired'
  | 'converted';
export type TechnicalApprovalStatus = 'not_required' | 'pending' | 'approved' | 'rejected';
export type SolarTechnicalApprovalStatus = TechnicalApprovalStatus;

export interface GeneratorComponentItem {
  id: string;
  category: 'Painéis' | 'Inversores' | 'String Box' | 'Estrutura' | 'Acessórios';
  name: string;
  sku: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  note?: string;
}

export interface SolarGenerator {
  id: string;
  type: 'generator';
  title: string;
  sku: string;
  connectionType: string;
  state: string;
  prizeMode: 'percent' | 'currency';
  prizeValue: number;
  prizeAmount: number;
  subtotal: number;
  total: number;
  powerKwp: number;
  approvalStatus: SolarTechnicalApprovalStatus;
  approvalResponsible: string;
  approvalTimestamp: string;
  approvalNote: string;
  components: GeneratorComponentItem[];
  isCustomized: boolean;
}

export interface LooseOrderItem {
  id: string;
  type: 'loose';
  name: string;
  sku: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type OrderItem = SolarGenerator | LooseOrderItem;

export interface BudgetPartyLink {
  integrator: OrderParty | null;
  billingClient: OrderParty | null;
}

export interface CommercialAdjustment extends LinePricingAdjustment {
  commissionEstimated?: number;
  campaignEstimated?: number;
}

export interface BudgetHistoryEntry {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  tone?: 'default' | 'success' | 'warning';
}

export interface OrderDraft {
  id: string;
  orderNumber: string;
  createdAt: string;
  saleType: SaleType;
  clientePedido: OrderParty | null;
  clienteNota: OrderParty | null;
  deliveryArea: DeliveryArea;
  freightType: string;
  financialCondition: string;
  orderObservation: string;
  invoiceObservation: string;
}

export interface Budget {
  id: string;
  budgetNumber: string;
  name: string;
  status: BudgetStatus;
  createdAt: string;
  updatedAt: string;
  validUntil: string;
  consultantName: string;
  destinationState: string;
  saleType: SaleType | null;
  orderItems: OrderItem[];
  partyLink: BudgetPartyLink;
  deliveryArea: DeliveryArea;
  freightType: string;
  financialCondition: string;
  orderObservation: string;
  invoiceObservation: string;
  lineAdjustments: Record<string, Partial<CommercialAdjustment>>;
  history: BudgetHistoryEntry[];
  orderDraft: OrderDraft | null;
  pdfGeneratedAt: string | null;
  sentAt: string | null;
}

interface PedidoContextValue {
  budgets: Budget[];
  activeBudgetId: string | null;
  activeBudget: Budget | null;
  stage: 'budget' | 'order';
  saleType: SaleType | null;
  budgetNumber: string | null;
  orderNumber: string | null;
  orderItems: OrderItem[];
  clientePedido: OrderParty | null;
  clienteNota: OrderParty | null;
  deliveryArea: DeliveryArea;
  freightType: string;
  financialCondition: string;
  orderObservation: string;
  invoiceObservation: string;
  destinationState: string;
  validUntil: string;
  lineAdjustments: Record<string, Partial<CommercialAdjustment>>;
  createBudget: () => Budget;
  duplicateBudgetRecord: (budgetId: string) => Budget | null;
  removeBudget: (budgetId: string) => void;
  selectBudget: (budgetId: string) => void;
  getBudgetById: (budgetId: string) => Budget | null;
  getBudgetByOrderNumber: (orderNumber: string) => Budget | null;
  setBudgetName: (value: string) => void;
  setDestinationState: (value: string) => void;
  setValidUntil: (value: string) => void;
  setClientePedido: (client: OrderParty | null) => void;
  setClienteNota: (client: OrderParty | null) => void;
  setSaleType: (type: SaleType | null) => void;
  setDeliveryArea: (value: DeliveryArea) => void;
  setFreightType: (value: string) => void;
  setFinancialCondition: (value: string) => void;
  setOrderObservation: (value: string) => void;
  setInvoiceObservation: (value: string) => void;
  setLineAdjustment: (itemId: string, patch: Partial<CommercialAdjustment>) => void;
  clearLineAdjustment: (itemId: string) => void;
  addGenerator: (generator: SolarGenerator) => void;
  addLooseItem: (item: LooseOrderItem) => void;
  removeItem: (id: string) => void;
  updateGeneratorComponent: (generatorId: string, componentId: string, delta: number) => void;
  updateApproval: (generatorId: string, status: SolarTechnicalApprovalStatus, note?: string) => void;
  duplicateGenerator: (generatorId: string) => void;
  markBudgetPdfGenerated: () => void;
  markBudgetSent: () => void;
  renewBudgetValidity: (days?: number) => void;
  promoteBudgetToOrder: (payload?: {
    saleType?: SaleType | null;
    integrator?: OrderParty | null;
    billingClient?: OrderParty | null;
    deliveryArea?: DeliveryArea;
    freightType?: string;
    financialCondition?: string;
    orderObservation?: string;
    invoiceObservation?: string;
  }) => { success: boolean; error?: string; orderNumber?: string };
  resetOrder: () => void;
}

const PedidoContext = createContext<PedidoContextValue | null>(null);

function formatDateTime(date = new Date()) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatDateOnly(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function generateBudgetNumber() {
  return `ORC-${Date.now().toString().slice(-7)}`;
}

function generateOrderNumber() {
  return `PED-${Date.now().toString().slice(-7)}`;
}

function futureDate(days: number) {
  const value = new Date();
  value.setDate(value.getDate() + days);
  return formatDateOnly(value);
}

function hasPendingTechnicalApproval(items: OrderItem[]) {
  return items.some((item) => item.type === 'generator' && item.approvalStatus === 'pending');
}

function hasExpired(validUntil: string) {
  return Boolean(validUntil) && validUntil < formatDateOnly();
}

function deriveBudgetStatus(budget: Budget): BudgetStatus {
  if (budget.orderDraft) return 'converted';
  if (hasPendingTechnicalApproval(budget.orderItems)) return 'pending_technical';
  if (hasExpired(budget.validUntil)) return 'expired';
  if (budget.sentAt) return 'sent';
  if (budget.pdfGeneratedAt && budget.orderItems.length > 0) return 'ready_to_convert';
  if (budget.orderItems.length > 0) return 'quoted';
  return 'draft';
}

function appendHistory(
  budget: Budget,
  title: string,
  description: string,
  tone: BudgetHistoryEntry['tone'] = 'default',
) {
  const entry: BudgetHistoryEntry = {
    id: generateId('history'),
    title,
    description,
    tone,
    timestamp: formatDateTime(),
  };
  return [entry, ...budget.history];
}

function withDerivedStatus(budget: Budget) {
  return {
    ...budget,
    status: deriveBudgetStatus(budget),
    updatedAt: formatDateTime(),
  };
}

function createEmptyBudget(): Budget {
  const createdAt = formatDateTime();
  const budget: Budget = {
    id: generateId('budget'),
    budgetNumber: generateBudgetNumber(),
    name: 'Novo orçamento solar',
    status: 'draft',
    createdAt,
    updatedAt: createdAt,
    validUntil: futureDate(7),
    consultantName: DEFAULT_CONSULTANT,
    destinationState: 'PR',
    saleType: null,
    orderItems: [],
    partyLink: {
      integrator: null,
      billingClient: null,
    },
    deliveryArea: 'urban',
    freightType: 'CIF grátis (roteirizado)',
    financialCondition: 'Entrada + 3x',
    orderObservation: '',
    invoiceObservation: '',
    lineAdjustments: {},
    history: [
      {
        id: generateId('history'),
        title: 'Orçamento criado',
        description: 'Rascunho inicial pronto para montagem do kit e inclusão de avulsos.',
        tone: 'success',
        timestamp: createdAt,
      },
    ],
    orderDraft: null,
    pdfGeneratedAt: null,
    sentAt: null,
  };

  return withDerivedStatus(budget);
}

function sanitizeBudget(budget: Budget): Budget {
  const sanitizedItems = budget.orderItems.map((item) => {
    if (item.type !== 'generator') return item;
    const customization = assessGeneratorCustomizationFromComponents(item.components);
    const approvalStatus: SolarTechnicalApprovalStatus =
      item.approvalStatus === 'pending' || item.approvalStatus === 'approved' || item.approvalStatus === 'rejected'
        ? item.approvalStatus
        : 'not_required';
    return {
      ...item,
      isCustomized: customization.isCustomized,
      approvalStatus,
      approvalNote: item.approvalNote || customization.reason,
    };
  });

  return withDerivedStatus({
    ...budget,
    orderItems: sanitizedItems,
  });
}

function loadInitialBudgets() {
  if (typeof window === 'undefined') return [createEmptyBudget()];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [createEmptyBudget()];

    const parsed = JSON.parse(raw) as { budgets?: Budget[]; activeBudgetId?: string | null };
    const budgets = (parsed.budgets ?? []).map(sanitizeBudget);

    if (budgets.length === 0) return [createEmptyBudget()];
    return budgets;
  } catch {
    return [createEmptyBudget()];
  }
}

function loadInitialActiveBudgetId(budgets: Budget[]) {
  if (typeof window === 'undefined') return budgets[0]?.id ?? null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return budgets[0]?.id ?? null;
    const parsed = JSON.parse(raw) as { activeBudgetId?: string | null };
    const activeBudgetId = parsed.activeBudgetId ?? budgets[0]?.id ?? null;
    return budgets.some((budget) => budget.id === activeBudgetId) ? activeBudgetId : budgets[0]?.id ?? null;
  } catch {
    return budgets[0]?.id ?? null;
  }
}

export function PedidoProvider({ children }: { children: ReactNode }) {
  const [initialState] = useState(() => {
    const initialBudgets = loadInitialBudgets();
    return {
      budgets: initialBudgets,
      activeBudgetId: loadInitialActiveBudgetId(initialBudgets),
    };
  });
  const [budgets, setBudgets] = useState<Budget[]>(initialState.budgets);
  const [activeBudgetId, setActiveBudgetId] = useState<string | null>(initialState.activeBudgetId);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        budgets,
        activeBudgetId,
      }),
    );
  }, [budgets, activeBudgetId]);

  useEffect(() => {
    if (!activeBudgetId && budgets[0]) {
      setActiveBudgetId(budgets[0].id);
      return;
    }
    if (activeBudgetId && budgets.length > 0 && !budgets.some((budget) => budget.id === activeBudgetId)) {
      setActiveBudgetId(budgets[0]?.id ?? null);
    }
  }, [activeBudgetId, budgets]);

  const activeBudget = useMemo(
    () => budgets.find((budget) => budget.id === activeBudgetId) ?? budgets[0] ?? null,
    [activeBudgetId, budgets],
  );

  const mutateActiveBudget = (
    updater: (budget: Budget) => Budget,
  ) => {
    if (!activeBudget) return;

    setBudgets((current) =>
      current.map((budget) => {
        if (budget.id !== activeBudget.id) return budget;
        return withDerivedStatus(updater(budget));
      }),
    );
  };

  const createBudget = () => {
    const nextBudget = createEmptyBudget();
    setBudgets((current) => [nextBudget, ...current]);
    setActiveBudgetId(nextBudget.id);
    return nextBudget;
  };

  const duplicateBudgetRecord = (budgetId: string) => {
    const source = budgets.find((budget) => budget.id === budgetId);
    if (!source) return null;

    const duplicated = withDerivedStatus({
      ...source,
      id: generateId('budget'),
      budgetNumber: generateBudgetNumber(),
      name: `${source.name} (cópia)`,
      createdAt: formatDateTime(),
      updatedAt: formatDateTime(),
      validUntil: futureDate(7),
      saleType: null,
      partyLink: {
        integrator: null,
        billingClient: null,
      },
      orderDraft: null,
      pdfGeneratedAt: null,
      sentAt: null,
      history: [
        {
          id: generateId('history'),
          title: 'Orçamento duplicado',
          description: `Novo orçamento criado a partir de ${source.budgetNumber}.`,
          tone: 'success',
          timestamp: formatDateTime(),
        },
      ],
    });

    setBudgets((current) => [duplicated, ...current]);
    setActiveBudgetId(duplicated.id);
    return duplicated;
  };

  const removeBudget = (budgetId: string) => {
    setBudgets((current) => {
      const nextBudgets = current.filter((budget) => budget.id !== budgetId);
      if (activeBudgetId === budgetId) {
        setActiveBudgetId(nextBudgets[0]?.id ?? null);
      }
      return nextBudgets;
    });
  };

  const selectBudget = (budgetId: string) => {
    setActiveBudgetId(budgetId);
  };

  const getBudgetById = (budgetId: string) => budgets.find((budget) => budget.id === budgetId) ?? null;
  const getBudgetByOrderNumber = (orderNumber: string) =>
    budgets.find((budget) => budget.orderDraft?.orderNumber === orderNumber) ?? null;

  const setBudgetName = (value: string) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      name: value,
    }));

  const setDestinationState = (value: string) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      destinationState: value,
    }));

  const setValidUntil = (value: string) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      validUntil: value,
      history: appendHistory(
        budget,
        'Validade atualizada',
        `Validade do orçamento ajustada para ${value.split('-').reverse().join('/')}.`,
      ),
    }));

  const setClientePedido = (client: OrderParty | null) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      partyLink: {
        ...budget.partyLink,
        integrator: client,
      },
    }));

  const setClienteNota = (client: OrderParty | null) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      partyLink: {
        ...budget.partyLink,
        billingClient: client,
      },
    }));

  const setSaleType = (type: SaleType | null) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      saleType: type,
    }));

  const setDeliveryArea = (value: DeliveryArea) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      deliveryArea: value,
    }));

  const setFreightType = (value: string) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      freightType: value,
    }));

  const setFinancialCondition = (value: string) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      financialCondition: value,
    }));

  const setOrderObservation = (value: string) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      orderObservation: value,
    }));

  const setInvoiceObservation = (value: string) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      invoiceObservation: value,
    }));

  const setLineAdjustment = (itemId: string, patch: Partial<CommercialAdjustment>) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      lineAdjustments: {
        ...budget.lineAdjustments,
        [itemId]: {
          ...budget.lineAdjustments[itemId],
          ...patch,
        },
      },
    }));

  const clearLineAdjustment = (itemId: string) =>
    mutateActiveBudget((budget) => {
      const nextAdjustments = { ...budget.lineAdjustments };
      delete nextAdjustments[itemId];
      return {
        ...budget,
        lineAdjustments: nextAdjustments,
      };
    });

  const addGenerator = (generator: SolarGenerator) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      orderItems: [generator, ...budget.orderItems],
      history: appendHistory(
        budget,
        'Kit adicionado',
        `${generator.title} entrou no orçamento com ${generator.components.length} componentes.`,
        'success',
      ),
    }));

  const addLooseItem = (item: LooseOrderItem) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      orderItems: [item, ...budget.orderItems],
      history: appendHistory(
        budget,
        'Produto avulso adicionado',
        `${item.name} foi incluído no orçamento.`,
      ),
    }));

  const removeItem = (id: string) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      orderItems: budget.orderItems.filter((item) => item.id !== id),
      history: appendHistory(
        budget,
        'Item removido',
        'Um item foi removido da composição do orçamento.',
        'warning',
      ),
    }));

  const updateGeneratorComponent = (generatorId: string, componentId: string, delta: number) => {
    mutateActiveBudget((budget) => ({
      ...budget,
      orderItems: budget.orderItems.map((item) => {
        if (item.type !== 'generator' || item.id !== generatorId) return item;

        const components = item.components
          .map((component) =>
            component.id === componentId
              ? { ...component, quantity: Math.max(0, component.quantity + delta) }
              : component,
          )
          .filter((component) => component.quantity > 0);

        const subtotal = components.reduce((total, component) => total + component.unitPrice * component.quantity, 0);
        const customization = assessGeneratorCustomizationFromComponents(components);
        const approvalStatus: SolarTechnicalApprovalStatus = customization.isCustomized
          ? 'pending'
          : item.approvalStatus === 'approved'
            ? 'approved'
            : 'not_required';

        return {
          ...item,
          components,
          subtotal,
          total: subtotal,
          prizeAmount: 0,
          prizeValue: 0,
          approvalStatus,
          approvalTimestamp: formatDateTime(),
          approvalNote: customization.isCustomized
            ? `${customization.reason} Ajuste manual exige nova revisão técnica.`
            : customization.reason,
          isCustomized: customization.isCustomized,
        };
      }),
    }));
  };

  const updateApproval = (generatorId: string, status: SolarTechnicalApprovalStatus, note?: string) => {
    mutateActiveBudget((budget) => ({
      ...budget,
      orderItems: budget.orderItems.map((item) => {
        if (item.type !== 'generator' || item.id !== generatorId) return item;
        return {
          ...item,
          approvalStatus: status,
          approvalTimestamp: formatDateTime(),
          approvalNote:
            note ??
            (status === 'approved'
              ? 'Liberado pelo time técnico.'
              : status === 'rejected'
                ? 'Reprovado. Revisar composição técnica.'
                : status === 'pending'
                  ? 'Aguardando revisão técnica.'
                  : 'Sem aprovação necessária.'),
        };
      }),
      history: appendHistory(
        budget,
        'Status técnico atualizado',
        'Um gerador teve o status de aprovação técnica alterado.',
      ),
    }));
  };

  const duplicateGenerator = (generatorId: string) => {
    mutateActiveBudget((budget) => {
      const source = budget.orderItems.find((item) => item.type === 'generator' && item.id === generatorId);
      if (!source || source.type !== 'generator') return budget;

      const copy: SolarGenerator = {
        ...source,
        id: generateId('generator'),
        sku: `GER-${Date.now().toString().slice(-5)}`,
        title: `${source.title} (cópia)`,
        approvalStatus: source.isCustomized ? 'pending' : 'not_required',
        approvalTimestamp: formatDateTime(),
        components: source.components.map((component) => ({
          ...component,
          id: generateId('component'),
        })),
      };

      return {
        ...budget,
        orderItems: [copy, ...budget.orderItems],
        history: appendHistory(
          budget,
          'Kit duplicado',
          `${source.title} foi duplicado dentro do orçamento.`,
          'success',
        ),
      };
    });
  };

  const markBudgetPdfGenerated = () =>
    mutateActiveBudget((budget) => ({
      ...budget,
      pdfGeneratedAt: formatDateTime(),
      history: appendHistory(
        budget,
        'PDF gerado',
        'O PDF comercial do orçamento foi preparado para envio ao cliente.',
        'success',
      ),
    }));

  const markBudgetSent = () =>
    mutateActiveBudget((budget) => ({
      ...budget,
      sentAt: formatDateTime(),
      pdfGeneratedAt: budget.pdfGeneratedAt ?? formatDateTime(),
      history: appendHistory(
        budget,
        'Orçamento enviado',
        'A proposta foi marcada como enviada ao cliente.',
        'success',
      ),
    }));

  const renewBudgetValidity = (days = 7) =>
    mutateActiveBudget((budget) => ({
      ...budget,
      validUntil: futureDate(days),
      history: appendHistory(
        budget,
        'Validade renovada',
        `O orçamento ganhou mais ${days} dias de validade.`,
        'success',
      ),
    }));

  const promoteBudgetToOrder: PedidoContextValue['promoteBudgetToOrder'] = (payload) => {
    if (!activeBudget) return { success: false, error: 'Nenhum orçamento ativo encontrado.' };

    let result: { success: boolean; error?: string; orderNumber?: string } = { success: false, error: 'Erro desconhecido.' };

    setBudgets((current) =>
      current.map((budget) => {
        if (budget.id !== activeBudget.id) return budget;

        const nextBudgetBase: Budget = {
          ...budget,
          saleType: payload?.saleType ?? budget.saleType,
          partyLink: {
            integrator: payload?.integrator ?? budget.partyLink.integrator,
            billingClient: payload?.billingClient ?? budget.partyLink.billingClient,
          },
          deliveryArea: payload?.deliveryArea ?? budget.deliveryArea,
          freightType: payload?.freightType ?? budget.freightType,
          financialCondition: payload?.financialCondition ?? budget.financialCondition,
          orderObservation: payload?.orderObservation ?? budget.orderObservation,
          invoiceObservation: payload?.invoiceObservation ?? budget.invoiceObservation,
        };

        if (nextBudgetBase.orderItems.length === 0) {
          result = { success: false, error: 'Adicione ao menos um item antes de transformar em pedido.' };
          return budget;
        }

        if (deriveBudgetStatus(nextBudgetBase) === 'pending_technical') {
          result = { success: false, error: 'Aprove os itens técnicos pendentes antes de transformar em pedido.' };
          return budget;
        }

        if (hasExpired(nextBudgetBase.validUntil)) {
          result = { success: false, error: 'Este orçamento expirou. Renove a validade antes de seguir.' };
          return budget;
        }

        if (!nextBudgetBase.saleType) {
          result = { success: false, error: 'Selecione o tipo de venda antes de transformar em pedido.' };
          return budget;
        }

        if (!nextBudgetBase.partyLink.integrator) {
          result = { success: false, error: 'Selecione o integrador antes de transformar em pedido.' };
          return budget;
        }

        if (
          (nextBudgetBase.saleType === 'direct' || nextBudgetBase.saleType === 'triangulation')
          && !nextBudgetBase.partyLink.billingClient
        ) {
          result = { success: false, error: 'Selecione o cliente final antes de transformar em pedido.' };
          return budget;
        }

        const invoiceObservation =
          nextBudgetBase.saleType === 'triangulation'
          && nextBudgetBase.partyLink.billingClient
          && !nextBudgetBase.invoiceObservation.trim()
            ? buildTriangulationInvoiceObservation(nextBudgetBase.partyLink.billingClient)
            : nextBudgetBase.invoiceObservation;

        const orderNumber = generateOrderNumber();
        const orderDraft: OrderDraft = {
          id: generateId('order'),
          orderNumber,
          createdAt: formatDateTime(),
          saleType: nextBudgetBase.saleType,
          clientePedido: nextBudgetBase.partyLink.integrator,
          clienteNota:
            nextBudgetBase.saleType === 'normal'
              ? null
              : nextBudgetBase.partyLink.billingClient,
          deliveryArea: nextBudgetBase.deliveryArea,
          freightType: nextBudgetBase.freightType,
          financialCondition: nextBudgetBase.financialCondition,
          orderObservation: nextBudgetBase.orderObservation,
          invoiceObservation,
        };

        result = { success: true, orderNumber };
        return withDerivedStatus({
          ...nextBudgetBase,
          invoiceObservation,
          orderDraft,
          history: appendHistory(
            nextBudgetBase,
            'Pedido aberto',
            `Orçamento convertido em pedido ${orderNumber}.`,
            'success',
          ),
        });
      }),
    );

    return result;
  };

  const resetOrder = () => {
    createBudget();
  };

  const value: PedidoContextValue = {
    budgets,
    activeBudgetId: activeBudget?.id ?? activeBudgetId,
    activeBudget,
    stage: activeBudget?.orderDraft ? 'order' : 'budget',
    saleType: activeBudget?.saleType ?? null,
    budgetNumber: activeBudget?.budgetNumber ?? null,
    orderNumber: activeBudget?.orderDraft?.orderNumber ?? null,
    orderItems: activeBudget?.orderItems ?? [],
    clientePedido: activeBudget?.partyLink.integrator ?? null,
    clienteNota: activeBudget?.partyLink.billingClient ?? null,
    deliveryArea: activeBudget?.deliveryArea ?? 'urban',
    freightType: activeBudget?.freightType ?? 'CIF grátis (roteirizado)',
    financialCondition: activeBudget?.financialCondition ?? 'Entrada + 3x',
    orderObservation: activeBudget?.orderObservation ?? '',
    invoiceObservation: activeBudget?.invoiceObservation ?? '',
    destinationState: activeBudget?.destinationState ?? 'PR',
    validUntil: activeBudget?.validUntil ?? futureDate(7),
    lineAdjustments: activeBudget?.lineAdjustments ?? {},
    createBudget,
    duplicateBudgetRecord,
    removeBudget,
    selectBudget,
    getBudgetById,
    getBudgetByOrderNumber,
    setBudgetName,
    setDestinationState,
    setValidUntil,
    setClientePedido,
    setClienteNota,
    setSaleType,
    setDeliveryArea,
    setFreightType,
    setFinancialCondition,
    setOrderObservation,
    setInvoiceObservation,
    setLineAdjustment,
    clearLineAdjustment,
    addGenerator,
    addLooseItem,
    removeItem,
    updateGeneratorComponent,
    updateApproval,
    duplicateGenerator,
    markBudgetPdfGenerated,
    markBudgetSent,
    renewBudgetValidity,
    promoteBudgetToOrder,
    resetOrder,
  };

  return <PedidoContext.Provider value={value}>{children}</PedidoContext.Provider>;
}

export function usePedido() {
  const context = useContext(PedidoContext);
  if (!context) throw new Error('usePedido must be used within PedidoProvider');
  return context;
}
