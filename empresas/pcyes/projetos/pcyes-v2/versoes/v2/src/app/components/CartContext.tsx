import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface CartItem {
  cartKey: string;
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  isGift?: boolean;
  originalPrice?: string;
}

type AddCartItemInput = Omit<CartItem, "quantity" | "cartKey"> & {
  cartKey?: string;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: AddCartItemInput) => void;
  removeItem: (cartKey: string) => void;
  clearCart: () => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  setGiftItem: (item: AddCartItemInput | null) => void;
  totalItems: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  lastAdded: CartItem | null;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  const addItem = useCallback((item: AddCartItemInput) => {
    const itemKey = item.cartKey ?? `${item.isGift ? "gift" : "product"}-${item.id}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.cartKey === itemKey);
      if (existing) {
        return prev.map((i) => i.cartKey === itemKey ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, cartKey: itemKey, quantity: 1 }];
    });
    const newItem = { ...item, cartKey: itemKey, quantity: 1 };
    setLastAdded(newItem);
    setIsOpen(true);
    setTimeout(() => setLastAdded(null), 2000);
  }, []);

  const removeItem = useCallback((cartKey: string) => {
    setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const updateQuantity = useCallback((cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
    } else {
      setItems((prev) => prev.map((i) => i.cartKey === cartKey ? { ...i, quantity } : i));
    }
  }, []);

  const setGiftItem = useCallback((item: AddCartItemInput | null) => {
    setItems((prev) => {
      const withoutExistingGift = prev.filter((cartItem) => !cartItem.isGift);
      if (!item) return withoutExistingGift;

      return [
        ...withoutExistingGift,
        {
          ...item,
          cartKey: item.cartKey ?? `gift-${item.id}`,
          quantity: 1,
          isGift: true,
        },
      ];
    });
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, updateQuantity, setGiftItem, totalItems, isOpen, setIsOpen, lastAdded }}>
      {children}
    </CartContext.Provider>
  );
}
