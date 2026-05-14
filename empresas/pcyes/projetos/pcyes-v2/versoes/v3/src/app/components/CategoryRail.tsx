"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  Keyboard,
  Monitor,
  Gamepad2,
  Armchair,
  HardDrive,
  Fan,
  Headphones,
  Mouse,
  Zap,
} from "lucide-react";

interface CategoryItem {
  label: string;
  href: string;
  Icon: typeof Cpu;
}

const items: CategoryItem[] = [
  { label: "Hardware", href: "/produtos?category=Hardware", Icon: Cpu },
  { label: "PC Gamer", href: "/produtos?category=Computadores", Icon: Gamepad2 },
  { label: "Placas de Vídeo", href: "/produtos?category=Placas%20de%20V%C3%ADdeo", Icon: Zap },
  { label: "Periféricos", href: "/produtos?category=Perif%C3%A9ricos", Icon: Keyboard },
  { label: "Mouses", href: "/produtos?search=mouse", Icon: Mouse },
  { label: "Headsets", href: "/produtos?search=headset", Icon: Headphones },
  { label: "Monitores", href: "/produtos?category=Monitores", Icon: Monitor },
  { label: "Cadeiras", href: "/produtos?category=Cadeiras", Icon: Armchair },
  { label: "Coolers", href: "/produtos?category=Refrigera%C3%A7%C3%A3o", Icon: Fan },
  { label: "SSD e HD", href: "/produtos?category=SSD%20e%20HD", Icon: HardDrive },
];

// cascade by distance from active
const SIZES = [124, 90, 66, 48] as const;
const OPACITIES = [1, 0.9, 0.65, 0.4] as const;
const ICON_RATIOS = [0.42, 0.46, 0.48, 0.5] as const;
const GAP = 24;
const MAX_DIST = 3;
const COPIES = 3;

function distProps(dist: number) {
  if (dist > MAX_DIST) {
    return { size: 0, opacity: 0, iconRatio: 0 };
  }
  return {
    size: SIZES[dist],
    opacity: OPACITIES[dist],
    iconRatio: ICON_RATIOS[dist],
  };
}

export function CategoryRail() {
  const N = items.length;
  const expanded = Array.from({ length: N * COPIES }, (_, i) => ({
    ...items[i % N],
    realIdx: i % N,
  }));

  const [virtualActive, setVirtualActive] = useState(N);
  const [snap, setSnap] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackW, setTrackW] = useState(0);

  useLayoutEffect(() => {
    if (!trackRef.current) return;
    const ro = new ResizeObserver((entries) => {
      setTrackW(entries[0].contentRect.width);
    });
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  let activeCenter = 0;
  for (let i = 0; i <= virtualActive; i++) {
    const { size } = distProps(Math.abs(i - virtualActive));
    activeCenter += i === virtualActive ? size / 2 : size + GAP;
  }
  const translateX = trackW > 0 ? trackW / 2 - activeCenter : 0;

  const realActive = virtualActive % N;

  const goPrev = () => setVirtualActive((v) => v - 1);
  const goNext = () => setVirtualActive((v) => v + 1);

  const onTransitionEnd = () => {
    if (snap) return;
    if (virtualActive < N) {
      setSnap(true);
      requestAnimationFrame(() => {
        setVirtualActive((v) => v + N);
        requestAnimationFrame(() => setSnap(false));
      });
    } else if (virtualActive >= 2 * N) {
      setSnap(true);
      requestAnimationFrame(() => {
        setVirtualActive((v) => v - N);
        requestAnimationFrame(() => setSnap(false));
      });
    }
  };

  const navBtn = (onClick: () => void, label: string, icon: React.ReactNode) => (
    <button
      onClick={onClick}
      className="w-11 h-11 flex items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/70 transition-all hover:border-[var(--primary)]/70 hover:text-white hover:bg-[var(--primary)]/10 hover:scale-105 active:scale-95 flex-shrink-0 cursor-pointer"
      aria-label={label}
    >
      {icon}
    </button>
  );

  return (
    <section
      style={{
        paddingTop: "56px",
        paddingBottom: "56px",
        background: "#0a0a0a",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: "var(--container-max)" }}>

        {/* Header */}
        <div className="text-center px-6 md:px-12 mb-12">
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
            CATEGORIAS
          </p>
          <h3
            className="text-white"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(26px, 2.6vw, 34px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Explore por categoria
          </h3>
        </div>

        {/* Carousel */}
        <div
          className="flex items-center justify-center px-6 md:px-12"
          style={{ gap: "24px" }}
        >
          {navBtn(goPrev, "Anterior", <ChevronLeft size={18} strokeWidth={2.2} />)}

          <div
            ref={trackRef}
            className="relative overflow-hidden"
            style={{
              height: `${SIZES[0] + 24}px`,
              width: `${(SIZES[0] + GAP) + (SIZES[1] + GAP) * 2 + (SIZES[2] + GAP) * 2 + (SIZES[3] + GAP) * 2}px`,
              maxWidth: "100%",
            }}
          >
            <div
              className="absolute top-1/2 left-0 flex items-center"
              onTransitionEnd={onTransitionEnd}
              style={{
                gap: `${GAP}px`,
                transform: `translate(${translateX}px, -50%)`,
                transition: snap
                  ? "none"
                  : "transform 480ms cubic-bezier(0.32, 0.72, 0.32, 1)",
                willChange: "transform",
              }}
            >
              {expanded.map(({ realIdx, Icon, label, href }, vIdx) => {
                const dist = Math.abs(vIdx - virtualActive);
                const { size, opacity, iconRatio } = distProps(dist);
                const isActive = vIdx === virtualActive;
                const isHovered = hovered === vIdx && !isActive;
                const iconSize = size > 0 ? Math.round(size * iconRatio) : 0;
                const pointerEvents = dist > MAX_DIST ? "none" : "auto";

                return (
                  <Link
                    key={vIdx}
                    to={href}
                    aria-label={label}
                    onMouseEnter={() => setHovered(vIdx)}
                    onMouseLeave={() => setHovered(null)}
                    className="flex-shrink-0 flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-full"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      opacity,
                      pointerEvents,
                      transition: snap
                        ? "none"
                        : "width 480ms cubic-bezier(0.32, 0.72, 0.32, 1), height 480ms cubic-bezier(0.32, 0.72, 0.32, 1), opacity 360ms ease",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isActive
                          ? "radial-gradient(circle at 50% 50%, rgba(225, 6, 0, 0.22) 0%, rgba(225, 6, 0, 0.05) 70%, rgba(225, 6, 0, 0) 100%)"
                          : isHovered
                          ? "rgba(225, 6, 0, 0.08)"
                          : "rgba(255, 255, 255, 0.04)",
                        border: isActive
                          ? "1.5px solid rgba(225, 6, 0, 0.85)"
                          : isHovered
                          ? "1px solid rgba(225, 6, 0, 0.5)"
                          : "1px solid rgba(255, 255, 255, 0.10)",
                        boxShadow: isActive
                          ? "0 0 0 6px rgba(225, 6, 0, 0.08), 0 0 28px -2px rgba(225, 6, 0, 0.55)"
                          : isHovered
                          ? "0 0 18px -4px rgba(225, 6, 0, 0.4)"
                          : "none",
                        transform: isHovered ? "scale(1.06)" : "scale(1)",
                        transition: "background 280ms ease, border-color 280ms ease, box-shadow 280ms ease, transform 280ms ease",
                      }}
                    >
                      {iconSize > 0 && (
                        <Icon
                          size={iconSize}
                          strokeWidth={isActive ? 1.4 : 1.5}
                          style={{
                            color: isActive
                              ? "#ff2419"
                              : isHovered
                              ? "rgba(255, 90, 80, 0.95)"
                              : "rgba(255, 255, 255, 0.78)",
                            transition: "color 260ms ease",
                            flexShrink: 0,
                            filter: isActive
                              ? "drop-shadow(0 0 6px rgba(225, 6, 0, 0.4))"
                              : "none",
                          }}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {navBtn(goNext, "Próximo", <ChevronRight size={18} strokeWidth={2.2} />)}
        </div>

        {/* Active label */}
        <div className="flex justify-center mt-7">
          <Link
            to={items[realActive].href}
            className="text-white transition-colors hover:text-[var(--primary)] cursor-pointer"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "0.025em",
            }}
          >
            {items[realActive].label}
          </Link>
        </div>

      </div>
    </section>
  );
}
