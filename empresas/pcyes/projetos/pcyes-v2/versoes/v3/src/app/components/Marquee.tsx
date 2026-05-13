import { motion } from "motion/react";

interface MarqueeProps {
  words: string[];
  speed?: number;
  separator?: string;
}

export function Marquee({ words, speed = 30, separator = "—" }: MarqueeProps) {
  const text = words.join(` ${separator} `) + ` ${separator} `;
  const doubled = text + text;

  return (
    <div className="overflow-hidden py-8 border-t border-b border-border/10">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="whitespace-nowrap"
      >
        <span
          className="text-foreground/8"
          style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(60px, 8vw, 120px)", fontWeight: "var(--font-weight-light)" }}
        >
          {doubled}
        </span>
      </motion.div>
    </div>
  );
}
