import { createContext, useContext, useState, type ReactNode } from "react";

interface CheckoutPrefs {
  appliedCoupon: string | null;
  setAppliedCoupon: (c: string | null) => void;
  pointsApplied: boolean;
  setPointsApplied: (b: boolean) => void;
  pointsToUse: number;
  setPointsToUse: (n: number) => void;
}

const CheckoutPrefsContext = createContext<CheckoutPrefs | null>(null);

export function useCheckoutPrefs() {
  const ctx = useContext(CheckoutPrefsContext);
  if (!ctx) throw new Error("useCheckoutPrefs must be used within CheckoutPrefsProvider");
  return ctx;
}

export function CheckoutPrefsProvider({ children }: { children: ReactNode }) {
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [pointsApplied, setPointsApplied] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  return (
    <CheckoutPrefsContext.Provider
      value={{ appliedCoupon, setAppliedCoupon, pointsApplied, setPointsApplied, pointsToUse, setPointsToUse }}
    >
      {children}
    </CheckoutPrefsContext.Provider>
  );
}
