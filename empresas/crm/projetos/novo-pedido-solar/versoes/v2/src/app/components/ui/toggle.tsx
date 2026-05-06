"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

/* ═══════════════════════════════════════════════════════
   TOGGLE — based on Figma Toggle Button pattern
   Sizes: lg (40px), default (36px), sm (32px), xs (24px)
   Active state uses subtle foreground-tinted background.
   Typography: Inter medium.
═══════════════════════════════════════════════════════ */

const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "transition-[color,box-shadow,background] outline-none cursor-pointer select-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-transparent text-secondary-foreground",
          "hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)]",
          "hover:text-foreground",
          "data-[state=on]:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)]",
          "data-[state=on]:text-foreground",
        ].join(" "),
        outline: [
          "border bg-transparent text-secondary-foreground",
          "hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)]",
          "hover:text-foreground",
          "data-[state=on]:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)]",
          "data-[state=on]:text-foreground",
        ].join(" "),
      },
      size: {
        lg: "h-10 px-3 min-w-10",
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        xs: "h-6 px-1 min-w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  style,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 'var(--font-weight-medium)' as string,
        fontSize: size === 'xs' ? '12px' : '14px',
        lineHeight: size === 'xs' ? '16px' : '20px',
        borderRadius: 'var(--radius)',
        ...style,
      }}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
