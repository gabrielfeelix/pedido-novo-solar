import { Link } from "react-router";
import {
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
  { label: "Hardware", href: "/produtos", Icon: Cpu },
  { label: "PC Gamer", href: "/produtos", Icon: Gamepad2 },
  { label: "Placas de Vídeo", href: "/produtos?category=Placas%20de%20V%C3%ADdeo", Icon: Zap },
  { label: "Periféricos", href: "/produtos?category=Perif%C3%A9ricos", Icon: Keyboard },
  { label: "Mouses", href: "/produtos?category=Perif%C3%A9ricos", Icon: Mouse },
  { label: "Headsets", href: "/produtos?category=Perif%C3%A9ricos", Icon: Headphones },
  { label: "Monitores", href: "/produtos?category=Monitores", Icon: Monitor },
  { label: "Cadeiras", href: "/produtos?category=Cadeiras", Icon: Armchair },
  { label: "Coolers", href: "/produtos?category=Coolers", Icon: Fan },
  { label: "SSD e HD", href: "/produtos?category=SSD%20e%20HD", Icon: HardDrive },
];

export function CategoryRail() {
  return (
    <section
      style={{
        paddingTop: "var(--space-section-md)",
        paddingBottom: "var(--space-section-md)",
        background: "#0e0e0e",
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: "var(--container-max)" }}
      >
        <div
          className="flex items-start gap-6 md:gap-8 overflow-x-auto scrollbar-hide px-6 md:px-12"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map(({ label, href, Icon }) => (
            <Link
              key={label}
              to={href}
              className="group flex flex-col items-center gap-3 flex-shrink-0"
              style={{ width: "104px" }}
            >
              <div
                className="neon-hover-red relative flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-[1.06]"
                style={{
                  width: "88px",
                  height: "88px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <Icon
                  size={32}
                  strokeWidth={1.4}
                  className="transition-colors duration-300"
                  style={{ color: "rgba(255, 255, 255, 0.85)" }}
                />
              </div>
              <span
                className="text-center transition-colors duration-300 group-hover:text-white"
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontFamily: "var(--font-family-inter)",
                  lineHeight: 1.2,
                }}
              >
                {label}
              </span>
            </Link>
          ))}
          {/* Spacer for breathing room on the right */}
          <div aria-hidden="true" className="flex-shrink-0 w-6 md:w-12" />
        </div>
      </div>
    </section>
  );
}
