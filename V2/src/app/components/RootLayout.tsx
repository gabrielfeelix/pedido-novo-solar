import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { CartProvider } from "./CartContext";
import { AuthProvider } from "./AuthContext";
import { FavoritesProvider } from "./FavoritesContext";
import { CartDrawer } from "./CartDrawer";
import { AuthModal } from "./AuthModal";
import { CookieConsent } from "./CookieConsent";
import { WelcomePopup } from "./WelcomePopup";
import { Navbar } from "./Navbar";
import { ThemeProvider } from "./ThemeProvider";

export function RootLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <div className="min-h-screen bg-background text-foreground overflow-x-clip transition-colors duration-300">
              {pathname !== "/checkout" && <Navbar />}
              {pathname !== "/checkout" && <CartDrawer />}
              <AuthModal />
              <WelcomePopup />
              <CookieConsent />
              <Outlet />
            </div>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
