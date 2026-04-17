import { createContext, useContext, useState, type ReactNode } from 'react';
import type { DeliveryArea, OrderParty, SolarTechnicalApprovalStatus } from '../data/solarOrderMockData';

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

interface PedidoState {
  orderItems: OrderItem[];
  clientePedido: OrderParty | null;
  clienteNota: OrderParty | null;
  deliveryArea: DeliveryArea;
  freightType: string;
  financialCondition: string;
  orderObservation: string;
  invoiceObservation: string;
}

interface PedidoContextValue extends PedidoState {
  setClientePedido: (c: OrderParty | null) => void;
  setClienteNota: (c: OrderParty | null) => void;
  setDeliveryArea: (a: DeliveryArea) => void;
  setFreightType: (f: string) => void;
  setFinancialCondition: (c: string) => void;
  setOrderObservation: (v: string) => void;
  setInvoiceObservation: (v: string) => void;
  addGenerator: (generator: SolarGenerator) => void;
  addLooseItem: (item: LooseOrderItem) => void;
  removeItem: (id: string) => void;
  updateGeneratorComponent: (generatorId: string, componentId: string, delta: number) => void;
  updateApproval: (generatorId: string, status: SolarTechnicalApprovalStatus, note?: string) => void;
  duplicateGenerator: (generatorId: string) => void;
  resetOrder: () => void;
}

const PedidoContext = createContext<PedidoContextValue | null>(null);

function formatDateTime() {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

const INITIAL_STATE: PedidoState = {
  orderItems: [],
  clientePedido: null,
  clienteNota: null,
  deliveryArea: 'urban',
  freightType: 'CIF grátis (roteirizado)',
  financialCondition: 'Entrada + 3x',
  orderObservation: '',
  invoiceObservation: '',
};

export function PedidoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PedidoState>(INITIAL_STATE);

  const setClientePedido = (c: OrderParty | null) => setState((s) => ({ ...s, clientePedido: c, clienteNota: s.clienteNota ?? c }));
  const setClienteNota = (c: OrderParty | null) => setState((s) => ({ ...s, clienteNota: c }));
  const setDeliveryArea = (a: DeliveryArea) => setState((s) => ({ ...s, deliveryArea: a }));
  const setFreightType = (f: string) => setState((s) => ({ ...s, freightType: f }));
  const setFinancialCondition = (c: string) => setState((s) => ({ ...s, financialCondition: c }));
  const setOrderObservation = (v: string) => setState((s) => ({ ...s, orderObservation: v }));
  const setInvoiceObservation = (v: string) => setState((s) => ({ ...s, invoiceObservation: v }));

  const addGenerator = (generator: SolarGenerator) => {
    setState((s) => ({ ...s, orderItems: [generator, ...s.orderItems] }));
  };

  const addLooseItem = (item: LooseOrderItem) => {
    setState((s) => ({ ...s, orderItems: [item, ...s.orderItems] }));
  };

  const removeItem = (id: string) => {
    setState((s) => ({ ...s, orderItems: s.orderItems.filter((i) => i.id !== id) }));
  };

  const updateGeneratorComponent = (generatorId: string, componentId: string, delta: number) => {
    setState((s) => ({
      ...s,
      orderItems: s.orderItems.map((item) => {
        if (item.type !== 'generator' || item.id !== generatorId) return item;
        const components = item.components
          .map((c) => (c.id === componentId ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c))
          .filter((c) => c.quantity > 0);
        const subtotal = components.reduce((t, c) => t + c.unitPrice * c.quantity, 0);
        const prizeAmount = item.prizeMode === 'percent' ? subtotal * (item.prizeValue / 100) : item.prizeValue;
        return {
          ...item,
          components,
          subtotal,
          total: subtotal + prizeAmount,
          prizeAmount,
          approvalStatus: 'pending' as const,
          approvalTimestamp: formatDateTime(),
          approvalNote: 'Quantidade alterada no pedido. Pendente de revisão técnica.',
        };
      }),
    }));
  };

  const updateApproval = (generatorId: string, status: SolarTechnicalApprovalStatus, note?: string) => {
    setState((s) => ({
      ...s,
      orderItems: s.orderItems.map((item) => {
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
                ? 'Reprovado. Revisar componentes.'
                : status === 'pending'
                  ? 'Aguardando revisão técnica.'
                  : 'Sem alteração — aprovação não necessária.'),
        };
      }),
    }));
  };

  const duplicateGenerator = (generatorId: string) => {
    setState((s) => {
      const source = s.orderItems.find((i) => i.type === 'generator' && i.id === generatorId);
      if (!source || source.type !== 'generator') return s;
      const copy: SolarGenerator = {
        ...source,
        id: `generator-${Date.now()}`,
        sku: `GER-${Date.now().toString().slice(-5)}`,
        title: `${source.title} (cópia)`,
        components: source.components.map((c) => ({ ...c, id: `${c.id}-copy-${Date.now()}` })),
        approvalStatus: source.approvalStatus === 'pending' ? 'pending' : 'none',
      };
      return { ...s, orderItems: [copy, ...s.orderItems] };
    });
  };

  const resetOrder = () => setState(INITIAL_STATE);

  return (
    <PedidoContext.Provider
      value={{
        ...state,
        setClientePedido,
        setClienteNota,
        setDeliveryArea,
        setFreightType,
        setFinancialCondition,
        setOrderObservation,
        setInvoiceObservation,
        addGenerator,
        addLooseItem,
        removeItem,
        updateGeneratorComponent,
        updateApproval,
        duplicateGenerator,
        resetOrder,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
}

export function usePedido() {
  const ctx = useContext(PedidoContext);
  if (!ctx) throw new Error('usePedido must be used within PedidoProvider');
  return ctx;
}
