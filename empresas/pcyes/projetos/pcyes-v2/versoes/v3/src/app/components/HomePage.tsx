import { HeroSection } from "./HeroSection";
import { CategoryRail } from "./CategoryRail";
import { FlashDealsStrip } from "./FlashDealsStrip";
import { ProductShelf } from "./ProductShelf";
import { BannerDuo } from "./BannerDuo";
import { BrandsStrip } from "./BrandsStrip";
import { CategorySpotlight } from "./CategorySpotlight";
import { TrustStrip } from "./TrustStrip";
import { Newsletter } from "./Newsletter";
import { Footer } from "./Footer";

const bestSellerIds = [436, 72, 329, 433, 446, 199];
const newArrivalIds = [375, 295, 128, 30, 199, 433];
const dealIds = [30, 128, 295, 446, 375, 329];

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryRail />

      <FlashDealsStrip />

      <ProductShelf
        label="MAIS VENDIDOS"
        title="Top da semana"
        productIds={bestSellerIds}
        showRanking
      />

      <BannerDuo />

      <ProductShelf
        label="LANÇAMENTOS"
        title="Recém-chegados"
        productIds={newArrivalIds}
      />

      <BrandsStrip />

      <CategorySpotlight />

      <ProductShelf
        label="OFERTAS"
        title="Promoções imperdíveis"
        productIds={dealIds}
        emphasizeDiscount
      />

      <TrustStrip />
      <Newsletter />
      <Footer />
    </>
  );
}
