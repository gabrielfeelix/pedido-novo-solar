import { useEffect } from "react";
import { useTheme } from "../ThemeProvider";

/**
 * Injects a theme-sync script into the DOM so that
 * dynamically loaded HTML pages can sync their theme.
 */
export function useThemeBridge() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const theme = resolvedTheme === "dark" || resolvedTheme === undefined ? "dark" : "light";

    // Store in localStorage for HTML pages to read
    try {
      localStorage.setItem("v2-theme", theme);
    } catch {
      // Not available
    }

    // Broadcast to any listening HTML pages
    window.postMessage({ type: "theme-change", theme }, "*");

    // Also set a class on document.documentElement for any CSS to hook into
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [resolvedTheme]);
}
