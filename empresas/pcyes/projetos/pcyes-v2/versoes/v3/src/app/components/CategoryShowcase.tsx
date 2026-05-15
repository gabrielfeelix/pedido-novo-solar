"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getCatalogHref } from "./productPresentation";

interface CategoryItem {
  label: string;
  description: string;
  image: string;
  href: string;
  cta: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    label: "Headsets",
    description: "Áudio surround, drivers premium e isolamento total — escute cada passo antes do inimigo.",
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ search: "headset" }),
    cta: "Explorar headsets",
  },
  {
    label: "Teclados Mecânicos",
    description: "Switches Kailh, anti-ghosting e RGB. Construção em alumínio para responder no milisegundo.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ search: "teclado" }),
    cta: "Explorar teclados",
  },
  {
    label: "Mouses Gamer",
    description: "Sensores ópticos de alta precisão, polling 1000Hz e botões programáveis para FPS competitivo.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ search: "mouse" }),
    cta: "Explorar mouses",
  },
  {
    label: "Monitores",
    description: "Painéis IPS de 144Hz+ com 1ms de resposta. Cores reais para criação, fluidez para esports.",
    image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ category: "Monitores" }),
    cta: "Explorar monitores",
  },
  {
    label: "Cadeiras Gamer",
    description: "Suporte lombar, encosto reclinável e materiais que aguentam maratonas de 12h sem cansaço.",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ search: "cadeira" }),
    cta: "Explorar cadeiras",
  },
  {
    label: "Gabinetes",
    description: "Vidro temperado, fluxo de ar otimizado e RGB sincronizado — sua build merece vitrine.",
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ search: "gabinete" }),
    cta: "Explorar gabinetes",
  },
  {
    label: "Placas de Vídeo",
    description: "GPUs com Ray Tracing, DLSS e VRAM dedicada — performance gráfica de geração atual.",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ search: "placa de video" }),
    cta: "Explorar placas",
  },
  {
    label: "Fontes",
    description: "Fontes 80 Plus modulares com cabos sleeve. Energia limpa pra builds de 1000W+.",
    image: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ search: "fonte" }),
    cta: "Explorar fontes",
  },
  {
    label: "SSDs",
    description: "NVMe Gen4 com velocidades de até 7000MB/s. Boot instantâneo e cargas sem espera.",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ search: "ssd" }),
    cta: "Explorar SSDs",
  },
  {
    label: "Memórias RAM",
    description: "DDR5 6000MHz+ com perfis XMP. Multitarefa, edição pesada e gaming sem gargalo.",
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ search: "memoria" }),
    cta: "Explorar memórias",
  },
  {
    label: "Water Coolers",
    description: "Refrigeração líquida AIO com pump silencioso. Mantém o CPU no frio sob carga máxima.",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ search: "water cooler" }),
    cta: "Explorar coolers",
  },
  {
    label: "Microfones",
    description: "Cardioides USB com tripé e ganho ajustável. Captação broadcast pra stream e podcast.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ search: "microfone" }),
    cta: "Explorar microfones",
  },
  {
    label: "Mousepads",
    description: "Superfícies speed e control de tamanho XL. Base antiderrapante e bordas costuradas.",
    image: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ search: "mousepad" }),
    cta: "Explorar mousepads",
  },
  {
    label: "Mini PCs",
    description: "Computadores compactos com performance de desktop. Espaço otimizado, zero ruído.",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ search: "mini computador" }),
    cta: "Explorar mini PCs",
  },
  {
    label: "Webcams",
    description: "Full HD 1080p 60fps com autofoco. Calls profissionais e streams com qualidade real.",
    image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=2000&q=85&auto=format&fit=crop",
    href: getCatalogHref({ search: "webcam" }),
    cta: "Explorar webcams",
  },
];

const GAP_PX = 24;

export function CategoryShowcase() {
  const N = CATEGORIES.length;
  // Triple buffer so we can snap back invisibly when nearing edges
  const items = useMemo(() => [...CATEGORIES, ...CATEGORIES, ...CATEGORIES], []);

  // Position is logical (0 .. 3N-1). Start at first item of MIDDLE copy.
  const [pos, setPos] = useState(N);
  const [skip, setSkip] = useState(false);

  const activeIdx = ((pos % N) + N) % N;
  const active = CATEGORIES[activeIdx];

  const goPrev = () => {
    setSkip(false);
    setPos((p) => p - 1);
  };
  const goNext = () => {
    setSkip(false);
    setPos((p) => p + 1);
  };

  const handleSettled = () => {
    if (pos >= 2 * N) {
      setSkip(true);
      setPos(pos - N);
    } else if (pos < N) {
      setSkip(true);
      setPos(pos + N);
    }
  };

  return (
    <section
      className="relative"
      style={{
        paddingTop: "var(--space-section-sm)",
        paddingBottom: "var(--space-section-sm)",
        background: "#0a0a0a",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="px-5 md:px-[72px] mb-10 md:mb-12">
        <div className="mx-auto" style={{ maxWidth: "1600px" }}>
          <p
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "var(--primary)",
              marginBottom: "10px",
            }}
          >
            EXPLORE
          </p>
          <h2
            className="text-white"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(28px, 3.4vw, 44px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: "640px",
            }}
          >
            Equipamentos por categoria
          </h2>
        </div>
      </div>

      {/* Carousel — single sliding track */}
      <div className="relative">
        <div className="overflow-hidden" style={{ height: "clamp(360px, 38vw, 460px)" }}>
          <motion.div
            className="flex h-full"
            style={{ gap: `${GAP_PX}px`, paddingLeft: `${GAP_PX}px`, paddingRight: `${GAP_PX}px` }}
            animate={{
              x: `calc(${-(pos - 1)} * (33.333% + ${GAP_PX / 3}px))`,
            }}
            transition={
              skip
                ? { duration: 0 }
                : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            }
            onAnimationComplete={handleSettled}
          >
            {items.map((cat, i) => {
              const isLit = i === pos || i === pos + 1;
              const isFeatured = isLit;
              const isPrimary = i === pos;
              return (
                <div
                  key={i}
                  className={`flex-shrink-0 relative overflow-hidden h-full group category-card ${isFeatured ? "category-active" : ""}`}
                  style={{
                    width: `calc((100% - ${GAP_PX * 2}px) / 3)`,
                    borderRadius: "26px",
                    border: isLit
                      ? "1px solid transparent"
                      : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: isFeatured
                      ? "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 18px -6px rgba(255,36,25,0.2), inset 0 1px 0 rgba(255,255,255,0.06)"
                      : "none",
                    transition: "border-color 320ms ease, box-shadow 320ms ease",
                  }}
                >
                  {isLit && (
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        borderRadius: "26px",
                        padding: "1px",
                        background:
                          "linear-gradient(135deg, rgba(255,36,25,0.45) 0%, rgba(255,36,25,0.05) 45%, rgba(255,36,25,0.35) 100%)",
                        WebkitMask:
                          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                        zIndex: 5,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 overflow-hidden">
                    <ImageWithFallback
                      src={cat.image}
                      alt={cat.label}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      style={{ filter: isLit ? "none" : "brightness(0.55) saturate(0.85)" }}
                    />
                  </div>

                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: isFeatured
                        ? "linear-gradient(180deg, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.85) 100%)"
                        : isLit
                        ? "linear-gradient(180deg, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.6) 100%)"
                        : "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
                    }}
                  />

                  {isFeatured ? (
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={cat.label}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 12 }}
                          transition={{ duration: 0.4, delay: 0.15 }}
                          className="max-w-[460px]"
                        >
                          <h3
                            className="text-white mb-2"
                            style={{
                              fontFamily: "var(--font-family-figtree)",
                              fontSize: "clamp(22px, 2.4vw, 34px)",
                              fontWeight: 700,
                              lineHeight: 1.05,
                              letterSpacing: "-0.02em",
                              textShadow: "0 2px 12px rgba(0,0,0,0.55)",
                            }}
                          >
                            {cat.label}
                          </h3>
                          <p
                            className="mb-4"
                            style={{
                              fontFamily: "var(--font-family-inter)",
                              fontSize: "clamp(12px, 1vw, 14px)",
                              lineHeight: 1.5,
                              color: "rgba(255,255,255,0.85)",
                              textShadow: "0 1px 6px rgba(0,0,0,0.55)",
                            }}
                          >
                            {cat.description}
                          </p>
                          <Link
                            to={cat.href}
                            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 transition-transform hover:scale-[1.04] active:scale-[0.97]"
                            style={{
                              background:
                                "linear-gradient(135deg, var(--primary) 0%, #ff2419 100%)",
                              color: "white",
                              fontFamily: "var(--font-family-inter)",
                              fontSize: "11px",
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              boxShadow: "0 14px 32px -10px rgba(225,6,0,0.6)",
                            }}
                          >
                            {cat.cta} <ArrowRight size={13} strokeWidth={2.4} />
                          </Link>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSkip(false);
                        setPos(i);
                      }}
                      className="absolute inset-0 flex items-end p-4 md:p-5 cursor-pointer"
                      aria-label={cat.label}
                    >
                      <span
                        className="text-white"
                        style={{
                          fontFamily: "var(--font-family-figtree)",
                          fontSize: "clamp(13px, 1.2vw, 16px)",
                          fontWeight: 700,
                          letterSpacing: "-0.01em",
                          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                        }}
                      >
                        {cat.label}
                      </span>
                    </button>
                  )}

                  {isPrimary && (
                    <div className="pointer-events-none absolute top-5 right-5 flex items-center gap-1 z-10">
                      {CATEGORIES.map((_, j) => (
                        <span
                          key={j}
                          className="h-1.5 rounded-full transition-all"
                          style={{
                            width: j === activeIdx ? "18px" : "5px",
                            background:
                              j === activeIdx
                                ? "rgba(255,255,255,0.95)"
                                : "rgba(255,255,255,0.35)",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>

        <button
          onClick={goPrev}
          aria-label="Anterior"
          className="absolute left-4 md:left-6 top-1/2 z-20 hidden md:flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 cursor-pointer"
          style={{
            background: "rgba(15, 15, 16, 0.85)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "white",
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 28px -8px rgba(0,0,0,0.6)",
          }}
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <button
          onClick={goNext}
          aria-label="Próximo"
          className="absolute right-4 md:right-6 top-1/2 z-20 hidden md:flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 cursor-pointer"
          style={{
            background: "rgba(15, 15, 16, 0.85)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "white",
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 28px -8px rgba(0,0,0,0.6)",
          }}
        >
          <ChevronRight size={20} strokeWidth={2.2} />
        </button>
      </div>
    </section>
  );
}
