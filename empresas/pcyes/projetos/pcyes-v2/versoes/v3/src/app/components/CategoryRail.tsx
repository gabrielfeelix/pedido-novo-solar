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
    <section className="border-b border-white/5" style={{ background: "#0e0e0e" }}>
      <div className="max-w-[1760px] mx-auto px-5 md:px-[72px] py-5">
        <div
          className="flex items-center gap-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map(({ label, href, Icon }) => (
            <Link
              key={label}
              to={href}
              className="group flex flex-shrink-0 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2.5 text-white/70 transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-white"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              <Icon
                size={16}
                strokeWidth={1.6}
                className="text-white/50 group-hover:text-primary transition-colors duration-300"
              />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
