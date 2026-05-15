import { useTheme } from "./ThemeProvider";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  showExpanded?: boolean;
  navbarIsDark?: boolean;
}

export function ThemeToggle({ showExpanded = false, navbarIsDark = true }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative w-9 h-9 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Toggle theme"
        style={{ pointerEvents: "none" }}
      >
        <div className="w-4 h-4" />
      </button>
    );
  }

  const themeIsDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  // When navbar is expanded on homepage: always white icons
  // When navbar is collapsed: use theme-aware colors
  const iconColor = showExpanded
    ? "text-white hover:text-white/80"
    : "text-foreground hover:text-foreground/70";

  return (
    <button
      onClick={() => setTheme(themeIsDark ? "light" : "dark")}
      className={`relative w-9 h-9 flex items-center justify-center transition-colors cursor-pointer ${iconColor}`}
      aria-label={`Switch to ${themeIsDark ? "light" : "dark"} mode`}
    >
      <span className="relative w-4 h-4 flex items-center justify-center">
        <motion.div
          key={themeIsDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {themeIsDark ? (
            <Moon size={16} strokeWidth={1.5} />
          ) : (
            <Sun size={16} strokeWidth={1.5} />
          )}
        </motion.div>
      </span>
    </button>
  );
}
