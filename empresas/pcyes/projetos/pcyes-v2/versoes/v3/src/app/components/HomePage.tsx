import { HeroSection } from "./HeroSection";
import { CategoryShowcase } from "./CategoryShowcase";
import { EssentialsSection } from "./EssentialsSection";
import { IntelligentDevices } from "./IntelligentDevices";
import { FlashDealsStrip } from "./FlashDealsStrip";
import { ProductShelf } from "./ProductShelf";
import { DealsHighlight } from "./DealsHighlight";
import { GpuShowcase } from "./GpuShowcase";
import { TrustStrip } from "./TrustStrip";
import { Newsletter } from "./Newsletter";
import { Footer } from "./Footer";

const bestSellerIds = [30, 446, 433, 217, 164, 84, 199, 27, 129, 72];
const newArrivalIds = [466, 295, 130, 252, 375, 217];
const dealIds = [446, 433, 30, 217, 199, 27, 84, 164];

export function HomePage() {
  return (
    <>
      {/* ── BLOCO 1: Hero ─────────────────────────────── */}
      <HeroSection />

      {/* ── BLOCO 2: 1 seção (CategoryRail temporariamente removido) ── */}
      <FlashDealsStrip />

      {/* ── BLOCO 3: Banner de categorias (substitui BannerDuo) ── */}
      <CategoryShowcase />

      {/* ── BLOCO 4: 3 seções ─────────────────────────── */}
      <ProductShelf
        label="// MAIS VENDIDOS"
        title="Top da semana"
        productIds={bestSellerIds}
        showRanking
      />
      <EssentialsSection />
      <IntelligentDevices />

      {/* ── BLOCO 5: Banner / seção visual grande ─────── */}
      <GpuShowcase />

      {/* ── BLOCO 6: 2 seções ─────────────────────────── */}
      <DealsHighlight
        label="// OFERTAS"
        title="Promoções imperdíveis"
        productIds={dealIds}
      />
      <ProductShelf
        label="// LANÇAMENTOS"
        title="Recém-chegados"
        productIds={newArrivalIds}
      />

      {/* ── BLOCO 7: Institucional ────────────────────── */}
      {/* TODO: PCYES In Real Life (UGC / lifestyle photos) */}
      {/* TODO: Vídeos (YouTube embeds / highlights)       */}
      <TrustStrip />
      <Newsletter />
      <Footer />
    </>
  );
}
