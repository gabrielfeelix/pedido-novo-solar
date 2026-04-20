import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "./utils";

/* ═══════════════════════════════════════════════════════
   NAVIGATION MENU — based on Figma Navigation Menu pattern
   Trigger buttons: Inter medium 14px, subtle active bg.
   Dropdown: white bg, DS border/shadow, 2-column grid.
   Menu items: rounded-[radius-checkbox], hover bg.
═══════════════════════════════════════════════════════ */

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  [
    "group inline-flex h-9 w-max items-center justify-center px-4 py-2",
    "transition-[color,box-shadow,background] outline-none cursor-pointer",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
    /* idle */
    "bg-transparent text-secondary-foreground",
    /* hover */
    "hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] hover:text-foreground",
    /* active / open */
    "data-[state=open]:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] data-[state=open]:text-foreground",
    "focus:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] focus:text-foreground",
  ].join(" "),
);

function NavigationMenuTrigger({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 'var(--font-weight-medium)' as string,
        fontSize: '14px',
        lineHeight: '20px',
        borderRadius: 'var(--radius)',
        ...style,
      }}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
        "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
        "top-0 left-0 w-full p-2 md:absolute md:w-auto",
        /* When viewport is disabled, show inline dropdown */
        "group-data-[viewport=false]/navigation-menu:bg-card",
        "group-data-[viewport=false]/navigation-menu:text-card-foreground",
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in",
        "group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out",
        "group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95",
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95",
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0",
        "group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0",
        "group-data-[viewport=false]/navigation-menu:top-full",
        "group-data-[viewport=false]/navigation-menu:mt-1.5",
        "group-data-[viewport=false]/navigation-menu:overflow-hidden",
        "group-data-[viewport=false]/navigation-menu:shadow",
        "group-data-[viewport=false]/navigation-menu:duration-200",
        "**:data-[slot=navigation-menu-link]:focus:ring-0",
        "**:data-[slot=navigation-menu-link]:focus:outline-none",
        className,
      )}
      style={{
        borderRadius: 'var(--radius)',
        border: '1px solid color-mix(in srgb, var(--border) 40%, transparent)',
        boxShadow: 'var(--elevation-sm)',
        ...style,
      }}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center",
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-card text-card-foreground",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90",
          "relative mt-1.5 overflow-hidden",
          "h-[var(--radix-navigation-menu-viewport-height)]",
          "w-full md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        style={{
          borderRadius: 'var(--radius)',
          border: '1px solid color-mix(in srgb, var(--border) 40%, transparent)',
          boxShadow: 'var(--elevation-sm)',
        }}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-1 p-2 text-sm transition-all outline-none",
        "hover:bg-[color-mix(in_srgb,var(--secondary)_50%,transparent)]",
        "focus:bg-[color-mix(in_srgb,var(--secondary)_50%,transparent)]",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
        "data-[active=true]:bg-[color-mix(in_srgb,var(--secondary)_50%,transparent)]",
        "[&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      )}
      style={{
        borderRadius: 'var(--radius-checkbox)',
        fontFamily: "'Inter', sans-serif",
        ...style,
      }}
      {...props}
    />
  );
}

/* ── NavigationMenuLinkTitle / Description helpers ── */

function NavigationMenuLinkTitle({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-foreground", className)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 'var(--font-weight-semibold)' as string,
        fontSize: '14px',
        lineHeight: '20px',
        ...style,
      }}
      {...props}
    />
  );
}

function NavigationMenuLinkDescription({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-muted-foreground", className)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 'var(--font-weight-normal)' as string,
        fontSize: '14px',
        lineHeight: '20px',
        ...style,
      }}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out",
        "data-[state=hidden]:fade-out data-[state=visible]:fade-in",
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      <div
        className="relative top-[60%] h-2 w-2 rotate-45 shadow-md"
        style={{
          background: 'color-mix(in srgb, var(--border) 40%, transparent)',
          borderRadius: '2px',
        }}
      />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuLinkTitle,
  NavigationMenuLinkDescription,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
