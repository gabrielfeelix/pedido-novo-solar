import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight } from "lucide-react";

type Audience = "Todos" | "Gamers" | "Escritório";

interface CategoryCard {
  name: string;
  caption: string;
  href: string;
  image: string;
  span: string;
}

const categoryGroups: Record<Audience, CategoryCard[]> = {
  Todos: [
    {
      name: "Hardware",
      caption: "Peças e componentes para upgrades completos",
      href: "/produtos",
      image: "/home/category-hardware.png",
      span: "col-span-1 sm:col-span-2 row-span-2",
    },
    {
      name: "Periféricos",
      caption: "Mouse, teclado, headset e acessórios do dia a dia",
      href: "/produtos?category=Perif%C3%A9ricos",
      image: "/home/category-peripherals.png",
      span: "col-span-1",
    },
    {
      name: "Computadores",
      caption: "Soluções prontas para produtividade e operação",
      href: "/produtos",
      image: "/home/category-computers.png",
      span: "col-span-1",
    },
    {
      name: "PC Gamer",
      caption: "Combinações pensadas para jogar com performance",
      href: "/produtos",
      image: "/home/category-pc-gamer.png",
      span: "col-span-1",
    },
    {
      name: "Cadeiras",
      caption: "Mais conforto para uma imersão de horas",
      href: "/produtos?category=Cadeiras",
      image: "/home/category-chair.png",
      span: "col-span-1",
    },
    {
      name: "Placa de video",
      caption: "Peças e componentes para upgrades completos",
      href: "/produtos?category=Placas%20de%20V%C3%ADdeo",
      image: "/home/category-gpu.png",
      span: "col-span-1 sm:col-span-2",
    },
    {
      name: "Refrigeradores",
      caption: "Peças e componentes para upgrades completos",
      href: "/produtos?category=Coolers",
      image: "/home/category-cooling.png",
      span: "col-span-1 sm:col-span-2",
    },
  ],
  Gamers: [
    {
      name: "Gabinetes",
      caption: "Presença visual, airflow e vidro temperado",
      href: "/produtos?category=Gabinetes",
      image: "/home/category-hardware.png",
      span: "col-span-1 sm:col-span-2 row-span-2",
    },
    {
      name: "Placas de Vídeo",
      caption: "FPS alto, ray tracing e potência bruta",
      href: "/produtos?category=Placas%20de%20V%C3%ADdeo",
      image: "/home/category-gpu.png",
      span: "col-span-1",
    },
    {
      name: "PC Gamer",
      caption: "Builds prontas para entrar em jogo",
      href: "/produtos",
      image: "/home/category-pc-gamer.png",
      span: "col-span-1",
    },
    {
      name: "Streaming",
      caption: "Áudio, suporte e presença para criadores",
      href: "/produtos?category=Streaming",
      image: "/home/category-peripherals.png",
      span: "col-span-1",
    },
    {
      name: "Mouse Gamer",
      caption: "Precisão e resposta rápida na mão",
      href: "/produtos?category=Perif%C3%A9ricos",
      image: "/home/category-peripherals.png",
      span: "col-span-1 sm:col-span-2",
    },
  ],
  Escritório: [
    {
      name: "Computadores",
      caption: "Máquinas versáteis para rotina e operação",
      href: "/produtos",
      image: "/home/category-computers.png",
      span: "col-span-1 sm:col-span-2 row-span-2",
    },
    {
      name: "Monitores",
      caption: "Mais área útil e ergonomia para produtividade",
      href: "/produtos?category=Monitores",
      image: "/home/category-computers.png",
      span: "col-span-1",
    },
    {
      name: "SSD e HD",
      caption: "Armazenamento rápido para abrir tudo sem espera",
      href: "/produtos?category=SSD%20e%20HD",
      image: "/home/category-gpu.png",
      span: "col-span-1",
    },
    {
      name: "Periféricos",
      caption: "Itens essenciais para uma mesa funcional",
      href: "/produtos?category=Perif%C3%A9ricos",
      image: "/home/category-peripherals.png",
      span: "col-span-1",
    },
    {
      name: "Cadeiras",
      caption: "Postura e conforto pensados para o dia inteiro",
      href: "/produtos?category=Cadeiras",
      image: "/home/category-chair.png",
      span: "col-span-1 sm:col-span-2",
    },
  ],
};

export function CategoryGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const [activeAudience, setActiveAudience] = useState<Audience>("Todos");

  const cards = useMemo(() => categoryGroups[activeAudience], [activeAudience]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-5 pb-[168px] pt-[72px] md:px-[72.5px] md:pb-[220px]"
      style={{ background: isDark ? "linear-gradient(72.85deg, #000000 44.62%, #0f0f0f 100.35%)" : "transparent" }}
      id="explore"
    >
      <div className="relative max-w-[1760px] mx-auto">
        <div className="mb-12 flex flex-col items-center text-center gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-primary tracking-[0.25em] mb-5"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-label)", fontWeight: "var(--font-weight-medium)" }}
            >
              CATEGORIAS
            </motion.p>

            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 80 }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-foreground"
                style={{ fontSize: "clamp(48px, 6vw, 74px)", fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-light)", letterSpacing: "-0.03em", lineHeight: 1 }}
              >
                Explore por categoria
              </motion.h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {(["Todos", "Gamers", "Escritório"] as Audience[]).map((audience) => {
              const active = activeAudience === audience;
              return (
                <button
                  key={audience}
                  onClick={() => setActiveAudience(audience)}
                  onMouseEnter={() => setActiveAudience(audience)}
                  className={`cursor-pointer rounded-full border px-[17px] py-[9px] transition-all duration-300 ${
                    active
                      ? "border-primary/30 bg-primary text-white"
                      : "border-white/10 bg-transparent text-white/45 hover:text-white/75 hover:border-white/20"
                  }`}
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "600", lineHeight: "19.5px" }}
                >
                  {audience}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 auto-rows-[180px] gap-y-[22px] gap-x-[33.6px] sm:grid-cols-4 sm:grid-rows-[154px_154px_209px] sm:auto-rows-[209px] lg:px-[178px]">
          {cards.map((card, i) => (
            <Link
              key={`${activeAudience}-${card.name}`}
              to={card.href}
              className={`group relative overflow-hidden cursor-pointer block ${card.span}`}
              style={{ borderRadius: "5.6px" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.07 * i, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full w-full"
              >
                <ImageWithFallback
                  src={card.image}
                  alt={card.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/14 to-transparent group-hover:from-black/85 transition-all duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-[16.8px]">
                  <p className="text-white mb-1.5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(19px, 1.8vw, 20px)", fontWeight: "600", lineHeight: 1.05 }}>
                    {card.name}
                  </p>
                  <p className="mb-3 max-w-[19ch] text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "8.4px", lineHeight: "13.02px" }}>
                    {card.caption}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 group-hover:bg-white group-hover:text-black transition-all duration-500"
                    style={{ borderRadius: "2.8px", fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "500", letterSpacing: "0.02em" }}
                  >
                    Ver categoria
                    <ArrowUpRight size={11} />
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
