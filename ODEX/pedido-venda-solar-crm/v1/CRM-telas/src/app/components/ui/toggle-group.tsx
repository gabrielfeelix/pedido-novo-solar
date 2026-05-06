"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { toggleVariants } from "./toggle";

/* ═══════════════════════════════════════════════════════
   TOGGLE GROUP — based on Figma Toggle Group pattern
   Items are joined with shared borders (negative margin).
   First item gets left radius, last gets right radius.
   Supports `shape="pill"` for rounded-full edges.
═══════════════════════════════════════════════════════ */

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & { shape?: "default" | "pill" }
>({
  size: "default",
  variant: "default",
  shape: "default",
});

function ToggleGroup({
  className,
  variant,
  size,
  shape = "default",
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    shape?: "default" | "pill";
  }) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group inline-flex w-fit items-center",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, shape }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  style,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);
  const resolvedSize = context.size || size;
  const resolvedShape = context.shape || "default";

  const radiusValue = resolvedShape === "pill"
    ? "var(--radius-toggle)"
    : "var(--radius)";

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={resolvedSize}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: resolvedSize,
        }),
        "min-w-0 shrink-0 rounded-none shadow-none -mr-px relative",
        "first:rounded-l-[--tg-radius] last:rounded-r-[--tg-radius]",
        className,
      )}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 'var(--font-weight-medium)' as string,
        fontSize: resolvedSize === 'xs' ? '12px' : '14px',
        lineHeight: resolvedSize === 'xs' ? '16px' : '20px',
        border: '1px solid color-mix(in srgb, var(--border) 40%, transparent)',
        ['--tg-radius' as string]: radiusValue,
        ...style,
      }}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
