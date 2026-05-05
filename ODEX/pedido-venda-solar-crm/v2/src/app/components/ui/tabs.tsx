"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

/* ═══════════════════════════════════════════════
   TABS — shadcn/Radix API with Oderço DS styling.
   Uses CSS variables from theme.css. Active tab
   has card bg + elevation shadow. Inactive is
   transparent with muted-foreground text.
═══════════════════════════════════════════════ */

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "od-tabs-list inline-flex w-fit items-center justify-center gap-0.5",
        className,
      )}
      style={{
        padding: '3px',
        borderRadius: '10px',
        background: 'color-mix(in srgb, var(--muted) 40%, var(--background))',
        ...style,
      }}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  style,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "od-tabs-trigger",
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
        "disabled:pointer-events-none disabled:opacity-40",
        "cursor-pointer",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-medium)',
        lineHeight: '20px',
        padding: '4px 8px',
        minHeight: '29px',
        borderRadius: '8px',
        border: 'none',
        flexShrink: 0,
        transition: 'background 150ms ease, box-shadow 150ms ease, color 150ms ease',
        ...style,
      }}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

/* Counter badge — optional, render inside TabsTrigger children */
function TabsCounter({ count }: { count: number }) {
  return (
    <span
      data-slot="tabs-counter"
      className="inline-flex items-center justify-center shrink-0"
      style={{
        height: '16px',
        minWidth: '16px',
        padding: '0 4px',
        borderRadius: '10px',
        background: 'color-mix(in srgb, var(--muted) 70%, transparent)',
        fontFamily: "'Inter', sans-serif",
        fontSize: '11px',
        fontWeight: 'var(--font-weight-semibold)',
        lineHeight: '16px',
        color: 'inherit',
        whiteSpace: 'nowrap',
      }}
    >
      {count}
    </span>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsCounter };
