'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/* ------------ Modal (centered) ------------ */

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#0B1020]/30 backdrop-blur-sm anim-overlay-in" />
        <Dialog.Content
          className={`fixed left-1/2 top-1/2 z-[60] w-[92vw] ${widths[size]} -translate-x-1/2 -translate-y-1/2 anim-content-in focus:outline-none`}
        >
          <div className="glass-strong rounded-3xl p-6 md:p-7 relative">
            <Dialog.Close
              className="absolute right-4 top-3 icon-btn !w-8 !h-8"
              aria-label="Fechar"
            >
              <X size={14} />
            </Dialog.Close>
            {title && (
              <Dialog.Title className="text-lg font-semibold tracking-tight pr-12">
                {title}
              </Dialog.Title>
            )}
            {description && (
              <Dialog.Description className="text-sm text-ink-500 mt-1 leading-relaxed pr-10">
                {description}
              </Dialog.Description>
            )}
            <div className={title || description ? 'mt-5' : ''}>{children}</div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ------------ Drawer (right side) ------------ */

export function Drawer({
  open,
  onOpenChange,
  children,
  width = 540,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: ReactNode;
  width?: number;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#0B1020]/30 backdrop-blur-sm anim-overlay-in" />
        <Dialog.Content
          className="fixed top-0 right-0 z-[60] h-full anim-drawer-in focus:outline-none"
          style={{ width: `min(${width}px, 96vw)` }}
        >
          <Dialog.Title className="sr-only">Detalhes</Dialog.Title>
          <div className="glass-strong h-full rounded-l-3xl overflow-hidden flex flex-col">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ------------ Popover (custom, lightweight, anchored) ------------ */

export function Popover({
  trigger,
  children,
  align = 'right',
  width = 360,
}: {
  trigger: (toggle: () => void, open: boolean) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: 'left' | 'right';
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      {trigger(() => setOpen((o) => !o), open)}
      {open && (
        <div
          className="absolute top-[calc(100%+8px)] z-50 anim-popover-in"
          style={{
            width,
            ...(align === 'right' ? { right: 0 } : { left: 0 }),
          }}
        >
          <div className="rounded-2xl overflow-hidden bg-white border border-ink-100 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.32)]">
            {children(() => setOpen(false))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------ Tabs (controlled) ------------ */

export function Tabs<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { id: T; label: string; count?: number }[];
}) {
  return (
    <div className="inline-flex glass-pill rounded-full p-1 gap-1">
      {items.map((it) => {
        const active = it.id === value;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 transition ${
              active
                ? 'bg-[#0B1020] text-white shadow-[0_8px_20px_-10px_rgba(11,16,32,0.6)]'
                : 'text-ink-500 hover:text-[#0B1020]'
            }`}
          >
            {it.label}
            {typeof it.count === 'number' && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-ink-500'
                }`}
              >
                {it.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------ Status pill ------------ */

export function StatusPill({
  status,
  brandColor,
}: {
  status: string;
  brandColor?: string;
}) {
  const tone = brandColor ?? '#10B981';
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full inline-flex items-center gap-1.5"
      style={{
        color: tone,
        background: `${tone}14`,
        border: `1px solid ${tone}26`,
      }}
    >
      <span className="w-1 h-1 rounded-full" style={{ background: tone }} />
      {status}
    </span>
  );
}
