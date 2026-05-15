"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Slide {
  src: string;
  href: string;
  alt: string;
}

const slides: Slide[] = [
  { src: "/assets/banner-1.png", href: "/produtos", alt: "Nova Coleção Performance 2026" },
  { src: "/assets/banner-2.png", href: "/produtos?category=Periféricos", alt: "Equipamentos para streamers" },
  { src: "/assets/banner-3.png", href: "/monte-seu-pc", alt: "Builds prontas pra dominar" },
];

const SLIDE_DURATION = 6500;
const GAP_PX = 44;

export function HeroSection() {
  const N = slides.length;
  // Triple buffer for infinite loop
  const items = useMemo(() => [...slides, ...slides, ...slides], []);
  const [pos, setPos] = useState(N);
  const [skip, setSkip] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());

  const activeIdx = ((pos % N) + N) % N;

  const goPrev = useCallback(() => {
    setSkip(false);
    setPos((p) => p - 1);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const goNext = useCallback(() => {
    setSkip(false);
    setPos((p) => p + 1);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      const delta = idx - activeIdx;
      setSkip(false);
      setPos((p) => p + delta);
      setProgress(0);
      startTimeRef.current = Date.now();
    },
    [activeIdx],
  );

  // Auto-advance timer with progress bar
  useEffect(() => {
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / SLIDE_DURATION, 1);
      setProgress(p);
      if (p >= 1) goNext();
    }, 50);
    return () => clearInterval(interval);
  }, [pos, goNext]);

  // Snap back from buffer edges (invisible)
  const handleSettled = () => {
    if (pos >= 2 * N) {
      setSkip(true);
      setPos(pos - N);
    } else if (pos < N) {
      setSkip(true);
      setPos(pos + N);
    }
  };

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    const threshold = 60;
    const swipe = info.offset.x + info.velocity.x * 0.25;
    if (swipe < -threshold) goNext();
    else if (swipe > threshold) goPrev();
  };

  return (
    <section
      className="relative overflow-x-hidden pb-6 md:pb-8 pt-[160px] md:pt-[210px]"
      style={{ background: "#0a0a0a" }}
    >
      {/* Carousel track */}
      <div className="relative">
        <div className="overflow-hidden" style={{ height: "clamp(420px, 48vw, 600px)" }}>
          <motion.div
            className="flex h-full"
            style={{ gap: `${GAP_PX}px`, paddingLeft: "0px", paddingRight: "0px" }}
            animate={{
              x: `calc(${-pos} * (82% + ${GAP_PX}px) + 9%)`,
            }}
            transition={
              skip
                ? { duration: 0 }
                : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
            }
            onAnimationComplete={handleSettled}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
          >
            {items.map((slide, i) => {
              const isActive = i === pos;
              return (
                <Link
                  key={i}
                  to={slide.href}
                  draggable={false}
                  className="hero-card flex-shrink-0 relative h-full block cursor-grab active:cursor-grabbing"
                  style={{
                    width: "82%",
                    borderRadius: "24px",
                  }}
                >
                  <div
                    className="relative h-full w-full overflow-hidden"
                    style={{ borderRadius: "24px" }}
                  >
                    <ImageWithFallback
                      src={slide.src}
                      alt={slide.alt}
                      className="h-full w-full object-cover pointer-events-none select-none"
                      draggable={false}
                      style={{
                        WebkitUserDrag: "none",
                        objectPosition: "center 25%",
                        filter: isActive ? "none" : "brightness(0.35) saturate(0.7)",
                        transition: "filter 320ms ease",
                      } as React.CSSProperties}
                    />
                  </div>
                  {/* Gradient stroke — gray default, red on hover */}
                  <div
                    className="hero-card-stroke pointer-events-none absolute inset-0"
                    style={{
                      borderRadius: "24px",
                      padding: "2px",
                      WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      transition: "background 320ms ease",
                    }}
                  />
                </Link>
              );
            })}
          </motion.div>
        </div>

        {/* Side arrows */}
        <button
          onClick={goPrev}
          aria-label="Anterior"
          className="absolute top-1/2 z-20 hidden md:flex h-12 w-12 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 cursor-pointer"
          style={{
            left: "9%",
            transform: "translate(-50%, -50%)",
            background: "rgba(48, 48, 52, 0.92)",
            border: "1px solid rgba(255,255,255,0.18)",
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
          className="absolute top-1/2 z-20 hidden md:flex h-12 w-12 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 cursor-pointer"
          style={{
            right: "9%",
            transform: "translate(50%, -50%)",
            background: "rgba(48, 48, 52, 0.92)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "white",
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 28px -8px rgba(0,0,0,0.6)",
          }}
        >
          <ChevronRight size={20} strokeWidth={2.2} />
        </button>
      </div>

      {/* Dots BELOW the carousel */}
      <div className="mt-7 flex items-center justify-center gap-2">
        {slides.map((_, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative h-2 cursor-pointer overflow-hidden rounded-full transition-all duration-500"
              style={{
                width: isActive ? "44px" : "10px",
                background: isActive ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.25)",
              }}
              aria-label={`Banner ${i + 1}`}
            >
              {isActive && (
                <span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    background: "linear-gradient(90deg, var(--primary) 0%, #ff2419 100%)",
                    boxShadow: "0 0 10px rgba(225,6,0,0.6)",
                    transition: "width 50ms linear",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
