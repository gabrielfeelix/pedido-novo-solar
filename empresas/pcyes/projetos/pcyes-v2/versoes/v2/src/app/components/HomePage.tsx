import { useTheme } from "./ThemeProvider";
import { FeaturedProduct } from "./FeaturedProduct";
import { CategoryGrid } from "./CategoryGrid";
import { NewReleasesSection } from "./NewReleasesSection";
import { ProductsByTags } from "./ProductsByTags";
import { ProductCarousel, recentArrivalIds } from "./ProductCarousel";
import { WorldSection } from "./WorldSection";
import { InRealLifeSection } from "./InRealLifeSection";
import { FeaturesStrip } from "./FeaturesStrip";
import { Newsletter } from "./Newsletter";
import { BannerSection } from "./BannerSection";
import { Footer } from "./Footer";
import { HeroSection } from "./HeroSection";

export function HomePage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const darkBg = isDark ? "#0e0e0e" : "transparent";

  return (
    <>
      <HeroSection />

      <div style={{ background: darkBg }}>
        <FeaturedProduct
          label="LANÇAMENTOs"
          title="Headset Fallen 7.1"
          description="Som surround 7.1 com drivers de 50mm, microfone removível com cancelamento de ruído e almofadas de espuma viscoelástica para sessões sem limites."
          image="/home/featured-headset.png"
          imageAlt="Headset Fallen 7.1"
          price="R$ 279,90"
          oldPrice="R$ 349,90"
          reverse
          specs={["7.1 Surround", "50mm Drivers", "Mic Removível", "Memory Foam"]}
        />
      </div>

      <div style={{ background: darkBg }}>
        <CategoryGrid />
      </div>

      <div style={{ background: darkBg }}>
        <BannerSection />
      </div>

      <ProductCarousel
        label="Mais Vendidos"
        title="Acabou de chegar"
        productIds={recentArrivalIds}
      />

      <ProductCarousel label="Para você" title="Escolhidos a dedo" />

      <div style={{ background: darkBg }}>
        <WorldSection />
      </div>

      <NewReleasesSection />

      <div style={{ background: darkBg }}>
        <ProductsByTags />
      </div>

      <InRealLifeSection />

      <Newsletter />
      <FeaturesStrip />
      <Footer />
    </>
  );
}
