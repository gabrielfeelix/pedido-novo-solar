import { useRef } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SpotlightCard {
  name: string;
  href: string;
  image: string;
}

const cards: SpotlightCard[] = [
  { name: "Hardware", href: "/produtos", image: "/home/category-hardware.png" },
  { name: "Periféricos", href: "/produtos?category=Perif%C3%A9ricos", image: "/home/category-peripherals.png" },
  { name: "PC Gamer", href: "/produtos", image: "/home/category-pc-gamer.png" },
  { name: "Placas de Vídeo", href: "/produtos?category=Placas%20de%20V%C3%ADdeo", image: "/home/category-gpu.png" },
  { name: "Cadeiras", href: "/produtos?category=Cadeiras", image: "/home/category-chair.png" },
  { name: "Computadores", href: "/produtos", image: "/home/category-computers.png" },
];

export function CategorySpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="px-5 py-16 md:px-[72px] md:py-20"
      style={{ background: "#0e0e0e" }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: "1600px" }}>
        <div className="mb-8 flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-3 text-primary"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.25em",
              }}
            >
              CATEGORIAS EM DESTAQUE
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-white"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(28px, 3vw, 36px)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Compre por departamento
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 md:gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 * i }}
            >
              <Link
                to={card.href}
                className="neon-hover-red group relative block aspect-[4/5] overflow-hidden rounded-lg"
              >
                <ImageWithFallback
                  src={card.image}
                  alt={card.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5 transition-all group-hover:from-black/90" />
                <div className="relative flex h-full flex-col justify-end p-4">
                  <p
                    className="text-white"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "15px",
                      fontWeight: 600,
                      lineHeight: 1.1,
                    }}
                  >
                    {card.name}
                  </p>
                  <span
                    className="mt-2 inline-flex w-fit items-center gap-1 text-white/65 transition-colors group-hover:text-primary"
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "11px",
                      fontWeight: 500,
                    }}
                  >
                    Ver categoria
                    <ArrowUpRight size={12} strokeWidth={1.8} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
