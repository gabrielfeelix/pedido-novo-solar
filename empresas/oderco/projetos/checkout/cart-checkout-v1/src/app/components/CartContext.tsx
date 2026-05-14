import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { cartSections } from './cart-data';

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  filial: string;
  quantity: number;
  unitType: string;
}

export type NfKey = 'PR' | 'ES';

export interface CompletedOrder {
  nf: NfKey;
  orderNumber: string;
  total: number;
  paymentMethod: string;
  completedAt: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  removeFilial: (filial: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  totalItems: number;
  subtotal: number;
  /* Multi-NF flow state */
  completedOrders: CompletedOrder[];
  markNfCompleted: (order: Omit<CompletedOrder, 'completedAt'>) => void;
  resetCompleted: () => void;
  /** Próxima NF que tem itens e ainda não foi finalizada — driver do fluxo "1 pedido por vez". */
  activeNf: NfKey | null;
  /** Lista de NFs presentes no carrinho com itens (independente de status). */
  nfsInCart: NfKey[];
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

const INITIAL_CART: CartItem[] = cartSections.flatMap(section =>
  section.products.map(p => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    brand: p.brand,
    price: p.price,
    oldPrice: p.oldPrice ?? null,
    image: p.image,
    filial: p.filial,
    quantity: p.quantity,
    unitType: p.unitType,
  }))
);

function getFilialKey(filial: string): NfKey {
  return filial.includes('ES') ? 'ES' : 'PR';
}

const NF_ORDER: NfKey[] = ['PR', 'ES'];

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [isOpen, setIsOpen] = useState(false);
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.filial === item.filial);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.filial === item.filial
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const removeFilial = useCallback((filial: string) => {
    setItems((prev) => prev.filter((i) => i.filial !== filial));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, []);

  const markNfCompleted = useCallback((order: Omit<CompletedOrder, 'completedAt'>) => {
    setCompletedOrders((prev) => {
      if (prev.some(o => o.nf === order.nf)) return prev;
      return [...prev, { ...order, completedAt: Date.now() }];
    });
    setItems((prev) => prev.filter((i) => getFilialKey(i.filial) !== order.nf));
  }, []);

  const resetCompleted = useCallback(() => {
    setCompletedOrders([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const nfsInCart = useMemo<NfKey[]>(() => {
    const set = new Set<NfKey>();
    items.forEach((i) => set.add(getFilialKey(i.filial)));
    return NF_ORDER.filter((k) => set.has(k));
  }, [items]);

  const activeNf = useMemo<NfKey | null>(() => {
    const completed = new Set(completedOrders.map((o) => o.nf));
    return nfsInCart.find((k) => !completed.has(k)) ?? null;
  }, [nfsInCart, completedOrders]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        removeFilial,
        updateQuantity,
        totalItems,
        subtotal,
        completedOrders,
        markNfCompleted,
        resetCompleted,
        activeNf,
        nfsInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
