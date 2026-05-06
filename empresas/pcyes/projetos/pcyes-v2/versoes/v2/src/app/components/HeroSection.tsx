import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Slide {
  type: "image" | "video";
  src: string; // image url or youtube video id
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
}

const slides: Slide[] = [
  {
    type: "video",
    src: "Xh2S_T-SQtw",
    title: "Nova Coleção Performance 2026",
    subtitle: "Periféricos e componentes que elevam sua experiência ao máximo nível de performance e design.",
    cta: "Compre agora",
    ctaLink: "/produtos",
  },
  {
    type: "image",
    src: "/home/hero-videogame.png",
    title: "Videogame e setup em sintonia",
    subtitle: "Acessórios, cabos e periféricos para completar sua experiência de jogo.",
    cta: "Ver periféricos",
    ctaLink: "/produtos?category=Periféricos",
  },
];

const IMAGE_DURATION = 10000; // 10s for images

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 0.7]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const slide = slides[current];

  const goToSlide = useCallback((index: number) => {
    setCurrent(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % slides.length);
  }, [current, goToSlide]);

  // Timer for image slides
  useEffect(() => {
    if (slide.type === "video") return; // videos handle their own advancement

    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / IMAGE_DURATION, 1);
      setProgress(p);
      if (p >= 1) {
        nextSlide();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, slide.type, nextSlide]);

  // For video slides, use YouTube API to detect end
  // Since we can't easily detect YouTube iframe end, we'll use a generous timer
  // We'll set a 30s timeout for videos as fallback, but ideally the video loops
  useEffect(() => {
    if (slide.type !== "video") return;
    startTimeRef.current = Date.now();
    const videoDuration = 30000; // 30s fallback for video

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / videoDuration, 1);
      setProgress(p);
      if (p >= 1) {
        nextSlide();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [current, slide.type, nextSlide]);

  return (
    <section ref={containerRef} className="relative h-[102vh] min-h-[880px] md:h-[945px]">
      <div className="sticky top-0 h-screen min-h-[880px] overflow-hidden">
        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {slide.type === "video" ? (
              <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${slide.src}?autoplay=1&mute=1&loop=1&playlist=${slide.src}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&fs=0`}
                  title="Hero Video"
                  className="absolute left-1/2 top-1/2 aspect-video h-[max(100vh,56.25vw)] w-[max(177.78vh,100vw)] -translate-x-1/2 -translate-y-1/2"
                  style={{ border: "none" }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen={false}
                />
              </div>
            ) : (
              <ImageWithFallback
                src={slide.src}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />

        {/* Content at bottom-left */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-6 md:px-[72px] pb-20 md:pb-[80px]"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <div className="max-w-[1760px] mx-auto flex items-end justify-between">
            {/* Left — text */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="overflow-hidden mb-4">
                    <h1
                      className="text-white"
                      style={{
                        fontSize: "clamp(34px, 5vw, 56px)",
                        fontFamily: "var(--font-family-figtree)",
                        fontWeight: "var(--font-weight-light)",
                        lineHeight: "1.1",
                      }}
                    >
                      {slide.title}
                    </h1>
                  </div>

                  <p
                    className="text-white/60 max-w-[448px] mb-8"
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "var(--text-base)",
                      lineHeight: "1.7",
                    }}
                  >
                    {slide.subtitle}
                  </p>

                  <div className="flex items-center gap-4">
                    <Link
                      to={slide.ctaLink}
                      className="px-8 py-3.5 bg-white text-black hover:bg-primary hover:text-white transition-all duration-500"
                      style={{
                        borderRadius: "var(--radius-button)",
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "13px",
                        fontWeight: "var(--font-weight-medium)",
                      }}
                    >
                      {slide.cta}
                    </Link>
                    <Link
                      to="/produtos"
                      className="px-8 py-3.5 border border-white/25 text-white/80 hover:text-white hover:border-white/60 transition-all duration-500"
                      style={{
                        borderRadius: "var(--radius-button)",
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "13px",
                        fontWeight: "var(--font-weight-medium)",
                      }}
                    >
                      Descubra mais
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right — dots with progress */}
            <div className="hidden md:flex items-center gap-2.5 pb-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className="relative w-2.5 h-2.5 rounded-full cursor-pointer group"
                  aria-label={`Slide ${i + 1}`}
                >
                  {/* Background dot */}
                  <span
                    className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                      i === current ? "bg-white/30" : "bg-white/15 group-hover:bg-white/30"
                    }`}
                  />
                  {/* Progress fill — only on active dot */}
                  {i === current && (
                    <span
                      className="absolute inset-0 rounded-full bg-white origin-center"
                      style={{
                        transform: `scale(${progress})`,
                        transition: "transform 50ms linear",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
