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
import { OrderDetailPage } from './components/OrderDetailPage';
import { ClientDetailPage } from './components/ClientDetailPage';
import { SolarBudgetListPage } from './components/SolarBudgetListPage';
import { BudgetConversionPage } from './components/BudgetConversionPage';

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
      { path: '/vendas/novo-pedido', Component: PlaceholderPage },
      { path: '/vendas/pedidos', Component: PlaceholderPage },
      { path: '/vendas/pedidos/:id', Component: OrderDetailPage },
      { path: '/vendas/novo-pedido-solar', Component: SolarBudgetListPage },
      { path: '/vendas/orcamentos-solar', Component: SolarBudgetListPage },
      { path: '/vendas/orcamentos-solar/:budgetId', Component: SolarOrderPage },
      { path: '/vendas/orcamentos-solar/:budgetId/solar-builder', Component: SolarBuilderPage },
      { path: '/vendas/orcamentos-solar/:budgetId/fechamento', Component: BudgetConversionPage },
      // Backward-compatible aliases for older links/buttons
      { path: '/vendas/pedidos/solar-builder', Component: SolarBuilderPage },
      { path: '/vendas/pedidos/novo-pedido-solar', Component: SolarBudgetListPage },
      { path: '/vendas/comissoes', Component: PlaceholderPage },

      // Cadastros
      { path: '/clientes', Component: PlaceholderPage },
      { path: '/clientes/:id', Component: ClientDetailPage },
      { path: '/cadastros/campanhas', Component: PlaceholderPage },
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
      { path: '/handoff/novo-pedido-solar', Component: HandoffPage },

      // Catch-all
      { path: '*', Component: PlaceholderPage },
    ],
  },
];

const basename =
  import.meta.env.BASE_URL === '/'
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, '');

export const router = createBrowserRouter(routes, { basename });
