"use client";

import * as React from "react";

import { cn } from "./utils";

/* ═══════════════════════════════════════════════════════
   BASE TYPOGRAPHY TOKENS
   These serve as defaults — consumers can override any
   individual property via the `style` prop.
═══════════════════════════════════════════════════════ */
const FONT_HEAD: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 'var(--font-weight-medium)' as string,
  fontSize: '12px',
  letterSpacing: '0',
  lineHeight: '18px',
  color: 'var(--muted-foreground)',
};

const FONT_CELL: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 'var(--font-weight-normal)' as string,
  fontSize: '12px',
  lineHeight: '18px',
  color: 'var(--foreground)',
};

/* ═══════════════════════════════════════════════════════
   TABLE (wrapper)
   Provides a scroll container + base table reset.
   Pass `striped` to enable zebra rows in TableBody.
═══════════════════════════════════════════════════════ */
function Table({
  className,
  style,
  ...props
}: React.ComponentProps<"table">) {
  return (
    <table
      data-slot="table"
      className={cn("w-full caption-bottom", className)}
      style={{
        borderCollapse: 'collapse',
        fontFamily: "'Inter', sans-serif",
        ...style,
      }}
      {...props}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   TABLE HEADER (<thead>)
═══════════════════════════════════════════════════════ */
function TableHeader({
  className,
  style,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("", className)}
      style={style}
      {...props}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   TABLE BODY (<tbody>)
   Pass `data-striped="true"` or the `striped` class to
   enable alternating-row background from the DS.
═══════════════════════════════════════════════════════ */
function TableBody({
  className,
  style,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      style={style}
      {...props}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   TABLE FOOTER (<tfoot>)
═══════════════════════════════════════════════════════ */
function TableFooter({
  className,
  style,
  ...props
}: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t [&>tr]:last:border-b-0",
        className,
      )}
      style={{ fontWeight: 'var(--font-weight-medium)' as string, ...style }}
      {...props}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   TABLE ROW (<tr>)
   Border-bottom is applied by default (subtle design
   system border). Override via style or className.
═══════════════════════════════════════════════════════ */
function TableRow({
  className,
  style,
  ...props
}: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "transition-colors hover:bg-[color-mix(in_srgb,var(--secondary)_40%,transparent)]",
        className,
      )}
      style={{
        borderBottom: '1px solid var(--border)',
        ...style,
      }}
      {...props}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   TABLE HEAD (<th>)
   DS typography defaults for header cells.
   Individual properties can be overridden via `style`.
═══════════════════════════════════════════════════════ */
function TableHead({
  className,
  style,
  ...props
}: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-4 text-left align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      style={{ ...FONT_HEAD, ...style }}
      {...props}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   TABLE CELL (<td>)
   DS typography defaults for body cells.
   Individual properties can be overridden via `style`.
═══════════════════════════════════════════════════════ */
function TableCell({
  className,
  style,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      style={{ ...FONT_CELL, ...style }}
      {...props}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   TABLE CAPTION
═══════════════════════════════════════════════════════ */
function TableCaption({
  className,
  style,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4", className)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '14px',
        ...style,
      }}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};