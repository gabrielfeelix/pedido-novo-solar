"use client";

import { useState } from "react";
import { Link } from "react-router";
import { X } from "lucide-react";

const MESSAGES = [
  "Que a Força esteja com seu setup ⚔️ · 25% OFF com cupom JEDI25",
  "Estes não são os preços que você procura... são MELHORES ⭐ · até 60% OFF",
  "Path of the Sith aceito · Cartão, PIX e até créditos do Império",
  "I am your father... do desconto. Use NERDPRIDE pra 10% extra",
];

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [idx, setIdx] = useState(0);

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Aviso promocional"
      className="fixed inset-x-0 top-0 z-[60] w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #050505 0%, #0a0a1a 50%, #050505 100%)",
        borderBottom: "1px solid rgba(255,232,31,0.18)",
      }}
    >
      {/* starfield */}
      <div
        className="pointer-events-none absolute inset-0 opacity-65"
        style={{
          backgroundImage:
            "radial-gradient(circle at 8% 60%, #fff 0.5px, transparent 1px), radial-gradient(circle at 24% 30%, #fff 0.5px, transparent 1px), radial-gradient(circle at 42% 70%, #fde68a 0.5px, transparent 1px), radial-gradient(circle at 58% 25%, #fff 0.5px, transparent 1px), radial-gradient(circle at 73% 65%, #fff 0.5px, transparent 1px), radial-gradient(circle at 88% 40%, #fde68a 0.5px, transparent 1px), radial-gradient(circle at 95% 75%, #fff 0.5px, transparent 1px)",
        }}
      />
      {/* lightsaber stripe */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
        style={{
          background: "linear-gradient(180deg, #22c55e 0%, #facc15 50%, #ff2419 100%)",
          boxShadow: "0 0 18px rgba(34,197,94,0.55), 0 0 8px rgba(255,36,25,0.55)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[3px]"
        style={{
          background: "linear-gradient(180deg, #ff2419 0%, #facc15 50%, #22c55e 100%)",
          boxShadow: "0 0 18px rgba(255,36,25,0.55), 0 0 8px rgba(34,197,94,0.55)",
        }}
      />

      <div className="relative mx-auto flex max-w-[1760px] items-center justify-between gap-3 px-5 py-[10px] md:px-8">
        <button
          onClick={() => setIdx((i) => (i - 1 + MESSAGES.length) % MESSAGES.length)}
          className="hidden text-white/45 transition-colors hover:text-white md:inline"
          aria-label="Anúncio anterior"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
        >
          ‹
        </button>

        <div className="flex flex-1 items-center justify-center gap-3 overflow-hidden">
          {/* pill semana nerd */}
          <span
            className="hidden flex-shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 sm:inline-flex"
            style={{
              background: "linear-gradient(135deg, #facc15 0%, #f97316 100%)",
              color: "#0f0a02",
              fontFamily: "var(--font-family-inter)",
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              boxShadow: "0 4px 14px -4px rgba(250,204,21,0.6)",
            }}
          >
            ⚡ Semana do Orgulho Nerd
          </span>

          <Link
            to="/produtos"
            key={idx}
            className="line-clamp-1 text-center text-white/90 transition-opacity hover:text-white"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "12.5px",
              fontWeight: 600,
              letterSpacing: "0.02em",
              animation: "fadeSlide 0.45s ease",
            }}
          >
            {MESSAGES[idx]}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIdx((i) => (i + 1) % MESSAGES.length)}
            className="hidden text-white/45 transition-colors hover:text-white md:inline"
            aria-label="Próximo anúncio"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
          >
            ›
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Fechar aviso"
            className="flex h-5 w-5 items-center justify-center rounded-full text-white/45 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={11} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
