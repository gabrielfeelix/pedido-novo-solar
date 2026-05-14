import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { ListaPage } from './components/ListaPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { SuccessPage } from './components/SuccessPage';

const basename = import.meta.env.BASE_URL === '/'
  ? '/'
  : import.meta.env.BASE_URL.replace(/\/$/, '');

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'lista', Component: ListaPage },
      { path: 'produto/:id', Component: ProductDetailPage },
      { path: 'carrinho', Component: CartPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: 'sucesso', Component: SuccessPage },
    ],
  },
], { basename });
