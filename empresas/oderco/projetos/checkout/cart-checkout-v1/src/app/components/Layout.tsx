import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { CheckoutFooter } from './CheckoutFooter';
import { CartProvider } from './CartContext';
import { CartSidebar } from './CartSidebar';

export function Layout() {
  const location = useLocation();
  const isCheckoutFlow = location.pathname === '/checkout' || location.pathname === '/sucesso';

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-background">
        {!isCheckoutFlow && <Header />}
        <main className="flex-1">
          <Outlet />
        </main>
        {isCheckoutFlow ? <CheckoutFooter /> : <Footer />}
        <CartSidebar />
      </div>
    </CartProvider>
  );
}