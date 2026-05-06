import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HomePage } from "./components/HomePage";
import { ProductsPage } from "./components/ProductsPage";
import { ProductPage } from "./components/ProductPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { ProfilePage } from "./components/ProfilePage";
import { InfluencersPage } from "./components/pages/InfluencersPage";
import { ResellerPage } from "./components/pages/ResellerPage";
import { ContactPage } from "./components/pages/ContactPage";
import { StoreLocatorPage } from "./components/pages/StoreLocatorPage";
import { MaringaFCCollabPage } from "./components/pages/MaringaFCCollabPage";
import { MonteSeuPcPage } from "./pages/MonteSeuPcPage";
import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary";

const basename =
  import.meta.env.BASE_URL === "/"
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, "");

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <GlobalErrorBoundary />,
    children: [
      { index: true, Component: HomePage },
      { path: "produtos", Component: ProductsPage },
      { path: "produto/:id", Component: ProductPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "perfil", Component: ProfilePage },
      { path: "influenciadores", Component: InfluencersPage },
      { path: "revendedor", Component: ResellerPage },
      { path: "fale-conosco", Component: ContactPage },
      { path: "onde-encontrar", Component: StoreLocatorPage },
      { path: "maringa-fc", Component: MaringaFCCollabPage },
      { path: "monte-seu-pc", Component: MonteSeuPcPage },
    ],
  },
], { basename });
