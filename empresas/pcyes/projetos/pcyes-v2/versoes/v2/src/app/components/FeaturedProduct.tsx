import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, ArrowUpRight, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import { allProducts } from "./productsData";
import { getPrimaryProductImage, getVisibleCatalogProducts } from "./productPresentation";

interface FeaturedProductProps {
  label: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  price: string;
  oldPrice?: string;
  specs?: string[];
  productId?: number;
}

export function FeaturedProduct({ label, title, description, image, imageAlt, reverse, price, oldPrice, specs, productId }: FeaturedProductProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const { addItem } = useCart();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const carouselItems = useMemo(() => {
    const catalogItems = getVisibleCatalogProducts(allProducts)
      .filter((product) => product.category === "Periféricos" || product.category === "Streaming" || product.category === "Cadeiras")
      .filter((product) => product.id !== productId && product.name !== title)
      .slice(0, 4)
      .map((product) => ({
        productId: product.id,
        title: product.name,
        description: product.description ?? description,
        image: getPrimaryProductImage(product),
        imageAlt: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        specs: product.tags.slice(0, 4),
      }));

    return [
      { productId, title, description, image, imageAlt, price, oldPrice, specs },
      ...catalogItems,
    ];
  }, [description, image, imageAlt, oldPrice, price, productId, specs, title]);
  const activeProduct = carouselItems[activeIndex] ?? carouselItems[0];
  const activeProductId = activeProduct.productId || (activeProduct.title.length * 100 + activeProduct.price.length);
  const activeSpecs = activeProduct.specs && activeProduct.specs.length > 0 ? activeProduct.specs : specs;

  return (
    <section
      ref={sectionRef}
      className="px-5 py-[10px] md:px-[72.5px]"
      style={{ background: "linear-gradient(97.665deg, #000000 34.936%, #0f0f0f 101.8%)" }}
    >
      <div className={`relative max-w-[1760px] mx-auto flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 px-0 py-16 lg:gap-[10px] lg:px-[172px] lg:py-[86px]`}>
        {activeIndex > 0 && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveIndex((index) => Math.max(0, index - 1)); }}
            className="absolute left-0 top-1/2 z-30 hidden h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#1d1d1d]/85 text-white/80 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:text-white md:flex"
            aria-label="Lançamento anterior"
          >
            <ArrowRight size={20} strokeWidth={1.6} className="rotate-180" />
          </button>
        )}
        {activeIndex < carouselItems.length - 1 && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveIndex((index) => Math.min(carouselItems.length - 1, index + 1)); }}
            className="absolute right-0 top-1/2 z-30 hidden h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#1d1d1d]/85 text-white/80 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:text-white md:flex"
            aria-label="Próximo lançamento"
          >
            <ArrowRight size={20} strokeWidth={1.6} />
          </button>
        )}

        {/* Image */}
        <motion.div className="w-full md:w-[934px] md:flex-none" style={{ y: imageY }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden group cursor-pointer md:px-[45.36px] md:py-[34.02px]"
            style={{ borderRadius: "8px" }}
          >
            <Link to={activeProduct.productId ? `/produto/${activeProduct.productId}` : "/produtos"}>
              <ImageWithFallback
                src={activeProduct.image}
                alt={activeProduct.imageAlt}
                className="w-full aspect-[1045/784] object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                style={{ borderRadius: "8px" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 right-6 w-12 h-12 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <ArrowUpRight size={18} className="text-primary-foreground" />
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="w-full md:w-[512px] md:flex-none">
          <motion.p
            initial={{ opacity: 0, x: reverse ? 30 : -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-primary tracking-[0.25em] mb-8"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)", lineHeight: "19.5px" }}
          >
            {label}
          </motion.p>

          <div className="sr-only">
            <motion.h2
              initial={{ y: 80 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-foreground"
              style={{ fontSize: "clamp(36px, 5vw, var(--text-h3))", fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-light)" }}
            >
              {title}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-foreground/60 mb-8"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", lineHeight: "28.8px" }}
          >
            {activeProduct.description}
          </motion.p>

          {activeSpecs && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {activeSpecs.map((spec) => (
                <span
                  key={spec}
                  className="px-4 py-1.5 border border-white/15 text-foreground/40"
                  style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                >
                  {spec}
                </span>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center gap-4 flex-wrap"
          >
            <p className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "32px", lineHeight: "48px", fontWeight: "var(--font-weight-light)" }}>
              {activeProduct.price}
            </p>
            {activeProduct.oldPrice && (
              <p className="text-foreground/40 line-through" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "32px", lineHeight: "48px", fontWeight: "var(--font-weight-light)" }}>
                {activeProduct.oldPrice}
              </p>
            )}
            <div className="flex items-center gap-3">
              <button
                className="group relative px-8 py-3.5 bg-primary text-primary-foreground overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,0,4,0.25)] flex items-center gap-2 cursor-pointer"
                style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
                onClick={() => addItem({ id: activeProductId, name: activeProduct.title, price: activeProduct.price, image: activeProduct.image })}
              >
                <ShoppingBag size={14} strokeWidth={1.5} className="relative z-10" />
                <span className="relative z-10">Adicionar ao carrinho</span>
                <span className="absolute inset-0 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </button>
              <Link
                to={activeProduct.productId ? `/produto/${activeProduct.productId}` : "/produtos"}
                className="px-6 py-3.5 border border-foreground/15 text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all duration-300"
                style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
              >
                Ver produto
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
