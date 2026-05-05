import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeProviderState {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Read synchronously on mount to avoid FOUC
    try {
      const stored = localStorage.getItem("pcyes-theme");
      if (stored === "light" || stored === "dark") {
        return stored as Theme;
      }
    } catch {}
    return "dark"; // default theme
  });

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem("pcyes-theme", newTheme);
    } catch {}
    setThemeState(newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Sync for ThemeToggleBridge features
    try {
      localStorage.setItem("v2-theme", theme);
      window.postMessage({ type: "theme-change", theme }, "*");
    } catch {}
  }, [theme]);

  return (
    <ThemeProviderContext.Provider value={{ theme, resolvedTheme: theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeProviderContext);
