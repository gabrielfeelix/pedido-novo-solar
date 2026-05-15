import { HeroSection } from "./HeroSection";
import { DropDoDiaSection } from "./DropDoDiaSection";
import { CategoryShowcase } from "./CategoryShowcase";
import { EssentialsSection } from "./EssentialsSection";
import { IntelligentDevices } from "./IntelligentDevices";
import { FlashDealsStrip } from "./FlashDealsStrip";
import { ProductShelf } from "./ProductShelf";
import { DealsHighlight } from "./DealsHighlight";
import { GpuShowcase } from "./GpuShowcase";
import { InRealLifeSection } from "./InRealLifeSection";
import { TrustStrip } from "./TrustStrip";
import { Newsletter } from "./Newsletter";
import { Footer } from "./Footer";

const bestSellerIds = [30, 446, 433, 217, 164, 84, 199, 125, 129, 72];
const newArrivalIds = [466, 295, 130, 252, 375, 217];
const dealIds = [446, 433, 30, 217, 199, 27, 84, 164];

export function HomePage() {
  return (
    <>
      {/* ── BLOCO 1: Hero ─────────────────────────────── */}
      <HeroSection />

      {/* ── BLOCO 2: Drop do dia (3 deals selecionados) ── */}
      <DropDoDiaSection />

      {/* ── BLOCO 3: Promoções da semana ──────────────── */}
      <FlashDealsStrip />

      {/* ── BLOCO 4: Banner de categorias ──────────────── */}
      <CategoryShowcase />

      {/* ── BLOCO 5: Hall da meta ─────────────────────── */}
      <DealsHighlight
        label="// HALL DA META"
        title="Drops mais cobiçados"
        productIds={dealIds}
      />

      {/* ── BLOCO 5: Mais vendidos + essentials + smart ── */}
      <ProductShelf
        label="// MAIS VENDIDOS"
        title="Top da semana"
        productIds={bestSellerIds}
        showRanking
      />
      <EssentialsSection />
      <IntelligentDevices />

      {/* ── BLOCO 6: GPU before/after ──────────────────── */}
      <GpuShowcase />

      {/* ── BLOCO 7: Recém-chegados + UGC ──────────────── */}
      <ProductShelf
        label="// LANÇAMENTOS"
        title="Recém-chegados"
        productIds={newArrivalIds}
      />
      <InRealLifeSection />

      {/* ── BLOCO 8: Institucional ────────────────────── */}
      <TrustStrip />
      <Newsletter />
      <Footer />
    </>
  );
}
