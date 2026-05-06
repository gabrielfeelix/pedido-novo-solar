import * as React from "react";

import { cn } from "./utils";

/* ═══════════════════════════════════════════════
   FIELD — Compound component for form field
   layout with label, input, and description.
═══════════════════════════════════════════════ */

function Field({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  style,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn(className)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "10px",
        fontWeight: "var(--font-weight-semibold)",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        lineHeight: "15px",
        color: "var(--foreground)",
        ...style,
      }}
      {...props}
    />
  );
}

function FieldDescription({
  className,
  style,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(className)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "12px",
        fontWeight: "var(--font-weight-normal)",
        color: "var(--muted-foreground)",
        lineHeight: "18px",
        ...style,
      }}
      {...props}
    />
  );
}

export { Field, FieldLabel, FieldDescription };
