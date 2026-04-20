import { createBrowserRouter, type RouteObject } from 'react-router';
import { Layout } from './components/Layout';
import { ProductListing } from './components/ProductListing';
import { PriceFormation } from './components/PriceFormation';
import { CampaignDetails } from './components/CampaignDetails';
import { PlaceholderPage } from './components/PlaceholderPage';
import { DashboardHome } from './components/DashboardHome';
import { SolarOrderPage } from './components/SolarOrderPage';
import { SolarBuilderPage } from './components/SolarBuilderPage';
import { HandoffPage } from './components/HandoffPage';

const routes: RouteObject[] = [
  {
    Component: Layout,
    children: [
      // Dashboard (default landing)
      { path: '/', Component: DashboardHome },
      { path: '/dashboard', Component: DashboardHome },

      // Cadastros > Formação de Preço
      { path: '/cadastros/formacao-preco', Component: ProductListing },
      { path: '/produto/:id/:filial', Component: PriceFormation },
      { path: '/campanha/:id', Component: CampaignDetails },

      // Vendas
      { path: '/vendas/carteira', Component: PlaceholderPage },
      { path: '/vendas/acoes', Component: PlaceholderPage },
      { path: '/vendas/pedidos', Component: PlaceholderPage },
      { path: '/vendas/novo-pedido-solar', Component: SolarOrderPage },
      { path: '/vendas/novo-pedido-solar/solar-builder', Component: SolarBuilderPage },
      { path: '/vendas/comissoes', Component: PlaceholderPage },

      // Cadastros
      { path: '/clientes', Component: PlaceholderPage },
      { path: '/cadastros/atributos-ecommerce', Component: PlaceholderPage },

      // Produtos
      { path: '/produtos/texto-garantia', Component: PlaceholderPage },
      { path: '/produtos/pdf', Component: PlaceholderPage },
      { path: '/produtos/atualizacoes', Component: PlaceholderPage },
      { path: '/produtos/aging', Component: PlaceholderPage },
      { path: '/produtos/aging/sumario', Component: PlaceholderPage },

      // Configurações
      { path: '/configuracoes', Component: PlaceholderPage },
      { path: '/handoff', Component: HandoffPage },

      // Catch-all
      { path: '*', Component: PlaceholderPage },
    ],
  },
];

export const router = createBrowserRouter(routes);
