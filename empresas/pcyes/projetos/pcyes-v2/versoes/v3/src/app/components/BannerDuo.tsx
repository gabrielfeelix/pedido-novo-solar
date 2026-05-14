import { useRef } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BannerCard {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  tint: string;
}

const banners: BannerCard[] = [
  {
    eyebrow: "PC GAMER",
    title: "Setup completo",
    description: "Builds prontas com placa de vídeo, processador e gabinete RGB",
    cta: "Montar agora",
    href: "/monte-seu-pc",
    image: "/home/category-pc-gamer.png",
    tint: "linear-gradient(115deg, rgba(220,20,20,0.7) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
  },
  {
    eyebrow: "PERIFÉRICOS",
    title: "Equipamentos pro",
    description: "Mouses, teclados e headsets para níveis avançados de desempenho",
    cta: "Explorar tudo",
    href: "/produtos?category=Perif%C3%A9ricos",
    image: "/home/category-peripherals.png",
    tint: "linear-gradient(115deg, rgba(15,15,15,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
  },
];

export function BannerDuo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="px-5 py-12 md:px-[72px] md:py-16"
      style={{ background: "#0e0e0e" }}
    >
      <div className="mx-auto grid max-w-[1760px] grid-cols-1 gap-5 md:grid-cols-2">
        {banners.map((banner, i) => (
          <motion.div
            key={banner.title}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={banner.href}
              className="neon-hover-red group relative block aspect-[16/9] overflow-hidden rounded-lg md:aspect-[3/2] lg:aspect-[16/9]"
            >
              <ImageWithFallback
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: banner.tint }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              <div className="relative flex h-full flex-col justify-end p-7 md:p-8 lg:p-10">
                <span
                  className="mb-3 inline-flex w-fit items-center rounded-full border border-white/25 bg-black/30 px-3 py-1 text-white/90 backdrop-blur-sm"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                  }}
                >
                  {banner.eyebrow}
                </span>
                <h3
                  className="mb-2 max-w-md text-white"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "clamp(28px, 3.5vw, 42px)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {banner.title}
                </h3>
                <p
                  className="mb-5 max-w-sm text-white/75"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "14px",
                    lineHeight: 1.5,
                  }}
                >
                  {banner.description}
                </p>
                <span
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-black transition-all group-hover:bg-primary group-hover:text-white"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {banner.cta}
                  <ArrowUpRight size={14} strokeWidth={2} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
