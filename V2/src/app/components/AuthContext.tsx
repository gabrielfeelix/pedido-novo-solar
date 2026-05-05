import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface UserAddress {
  id: string;
  label: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  isDefault: boolean;
}

export interface UserCard {
  id: string;
  brand: string;
  last4: string;
  name: string;
  expiry: string;
  isDefault: boolean;
}

export interface OrderHistory {
  status: "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  description: string;
}

export interface Order {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: { name: string; qty: number; price: string; image: string }[];
  total: string;
  tracking?: string;
  paymentMethod?: string;
  history?: OrderHistory[];
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  avatar?: string;
  addresses: UserAddress[];
  cards: UserCard[];
  orders: Order[];
}

interface AuthContextType {
  user: UserData | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  socialLogin: (provider: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalTab: "login" | "register";
  setAuthModalTab: (tab: "login" | "register") => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

const MOCK_USER: UserData = {
  name: "João Silva",
  email: "joao@email.com",
  phone: "(44) 99999-8888",
  cpf: "123.456.789-00",
  addresses: [
    { id: "1", label: "Casa", street: "Av. Paranavaí", number: "1906", complement: "Sala 3", neighborhood: "Parque Industrial", city: "Maringá", state: "PR", cep: "87070-130", isDefault: true },
    { id: "2", label: "Trabalho", street: "Rua Santos Dumont", number: "500", neighborhood: "Centro", city: "Maringá", state: "PR", cep: "87013-000", isDefault: false },
  ],
  cards: [
    { id: "1", brand: "Visa", last4: "4242", name: "JOAO SILVA", expiry: "12/28", isDefault: true },
    { id: "2", brand: "Mastercard", last4: "8888", name: "JOAO SILVA", expiry: "06/27", isDefault: false },
  ],
  orders: [
    {
      id: "PCY-2026-001",
      date: "2026-03-28",
      status: "delivered",
      paymentMethod: "Cartão de Crédito (Visa •••• 4242)",
      items: [
        { name: "Cobra V2 Mouse", qty: 1, price: "R$ 189,90", image: "https://images.unsplash.com/photo-1768561327952-119a4c9c76f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
      ],
      total: "R$ 189,90",
      tracking: "BR123456789",
      history: [
        { status: "delivered", date: "2026-04-03 14:20", description: "O pedido foi entregue com sucesso." },
        { status: "shipped", date: "2026-04-01 10:30", description: "O pedido saiu para entrega." },
        { status: "processing", date: "2026-03-29 09:15", description: "O pagamento foi confirmado e estamos separando seu pedido." },
        { status: "processing", date: "2026-03-28 15:40", description: "Pedido recebido." },
      ]
    },
    {
      id: "PCY-2026-002",
      date: "2026-04-02",
      status: "shipped",
      paymentMethod: "Pix",
      items: [
        { name: "Mancer Pro Teclado", qty: 1, price: "R$ 349,90", image: "https://images.unsplash.com/photo-1718803448073-90ebd0d982e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
        { name: "Deskpad RGB Pro", qty: 1, price: "R$ 149,90", image: "https://images.unsplash.com/photo-1713012003065-7ca32db003ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
      ],
      total: "R$ 499,80",
      tracking: "BR987654321",
      history: [
        { status: "shipped", date: "2026-04-04 11:00", description: "O pedido está em trânsito para sua cidade." },
        { status: "shipped", date: "2026-04-03 08:30", description: "O pedido foi coletado pela transportadora." },
        { status: "processing", date: "2026-04-02 12:10", description: "Pagamento confirmado via Pix." },
        { status: "processing", date: "2026-04-02 12:00", description: "Pedido recebido." },
      ]
    },
    {
      id: "PCY-2026-003",
      date: "2026-04-05",
      status: "processing",
      paymentMethod: "Cartão de Crédito (Visa •••• 4242)",
      items: [
        { name: "Spectrum Pro Gabinete", qty: 1, price: "R$ 599,90", image: "https://images.unsplash.com/photo-1695120485648-0b6eed4707aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
      ],
      total: "R$ 599,90",
      history: [
        { status: "processing", date: "2026-04-06 10:00", description: "Pagamento confirmado." },
        { status: "processing", date: "2026-04-05 22:30", description: "Pedido recebido, aguardando confirmação de pagamento." },
      ]
    },
  ],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  const login = useCallback(async (_email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser(MOCK_USER);
    setAuthModalOpen(false);
  }, []);

  const socialLogin = useCallback(async (_provider: string) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser(MOCK_USER);
    setAuthModalOpen(false);
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser({ ...MOCK_USER, name, email });
    setAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateUser = useCallback((data: Partial<UserData>) => {
    setUser((prev) => prev ? { ...prev, ...data } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, socialLogin, register, logout, updateUser, authModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab }}>
      {children}
    </AuthContext.Provider>
  );
}
