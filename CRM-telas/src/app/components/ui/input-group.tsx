import * as React from "react";

import { cn } from "./utils";

/* ═══════════════════════════════════════════════
   INPUT GROUP — Compound component for inputs
   with addons (icons, text badges, buttons, etc).
   Follows the shadcn InputGroup pattern adapted
   for the Oderco DS.
═══════════════════════════════════════════════ */

function InputGroup({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        "od-input-group flex items-center overflow-hidden",
        className,
      )}
      style={{
        borderRadius: "var(--radius-input)",
        border: "1px solid var(--border)",
        background: "var(--input-background)",
        ...style,
      }}
      {...props}
    />
  );
}

type InputGroupAddonAlign = "inline-start" | "inline-end" | "block-end";

function InputGroupAddon({
  className,
  align = "inline-start",
  style,
  ...props
}: React.ComponentProps<"div"> & { align?: InputGroupAddonAlign }) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        "flex items-center justify-center shrink-0",
        align === "inline-start" && "self-stretch px-2.5",
        align === "inline-end" && "self-stretch px-2.5",
        align === "block-end" && "w-full border-t border-border px-3 py-2",
        className,
      )}
      style={style}
      {...props}
    />
  );
}

/* ── InputGroupButton ── */
type InputGroupButtonSize = "xs" | "icon-xs" | "sm" | "icon-sm";
type InputGroupButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

const buttonSizeStyles: Record<InputGroupButtonSize, React.CSSProperties> = {
  xs: { height: 24, padding: "0 10px", fontSize: "var(--text-sm)" },
  "icon-xs": { height: 24, width: 24, padding: 0, fontSize: "var(--text-sm)" },
  sm: { height: 28, padding: "0 12px", fontSize: "var(--text-sm)" },
  "icon-sm": { height: 28, width: 28, padding: 0, fontSize: "var(--text-sm)" },
};

const buttonVariantStyles: Record<InputGroupButtonVariant, React.CSSProperties> = {
  default: {
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    border: "none",
  },
  destructive: {
    background: "var(--destructive)",
    color: "var(--destructive-foreground)",
    border: "none",
  },
  outline: {
    background: "transparent",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
  },
  secondary: {
    background: "var(--secondary)",
    color: "var(--secondary-foreground)",
    border: "none",
  },
  ghost: {
    background: "transparent",
    color: "var(--foreground)",
    border: "none",
  },
  link: {
    background: "transparent",
    color: "var(--accent)",
    border: "none",
    textDecoration: "underline",
  },
};

function InputGroupButton({
  className,
  size = "xs",
  variant = "ghost",
  style,
  ...props
}: React.ComponentProps<"button"> & {
  size?: InputGroupButtonSize;
  variant?: InputGroupButtonVariant;
}) {
  return (
    <button
      data-slot="input-group-button"
      className={cn(
        "inline-flex items-center justify-center shrink-0 cursor-pointer select-none transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      style={{
        borderRadius: "calc(var(--radius-input) - 2px)",
        fontFamily: "'Inter', sans-serif",
        fontWeight: "var(--font-weight-medium)",
        lineHeight: 1,
        gap: 4,
        ...buttonSizeStyles[size],
        ...buttonVariantStyles[variant],
        ...style,
      }}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  style,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input-group-input"
      className={cn(
        "od-input-group-input flex-1 min-w-0 bg-transparent outline-none",
        "placeholder:text-muted-foreground",
        className,
      )}
      style={{
        border: "none",
        padding: "0 12px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "14px",
        fontWeight: "var(--font-weight-bold)",
        color: "var(--foreground)",
        lineHeight: "20px",
        ...style,
      }}
      {...props}
    />
  );
}

function InputGroupText({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn(className)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "14px",
        fontWeight: "var(--font-weight-medium)",
        lineHeight: "20px",
        ...style,
      }}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  style,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="input-group-textarea"
      className={cn(
        "flex-1 min-w-0 bg-transparent outline-none resize-none",
        "placeholder:text-muted-foreground",
        className,
      )}
      style={{
        border: "none",
        padding: "8px 12px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "14px",
        fontWeight: "var(--font-weight-normal)",
        color: "var(--foreground)",
        lineHeight: "20px",
        ...style,
      }}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};