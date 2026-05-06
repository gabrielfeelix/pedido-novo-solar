'use client';

import { ClipboardList, Inbox } from 'lucide-react';
import { relativeTime } from '../_lib/storage';
import type { Ticket } from '../_lib/types';
import { Modal } from './ui';

export function TicketsModal({
  open,
  onOpenChange,
  tickets,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tickets: Ticket[];
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Chamados de UX"
      description="Acompanhe os pedidos abertos para o time de design."
      size="lg"
    >
      <section className="rounded-2xl bg-white border border-ink-100 overflow-hidden">
        <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-ink-100">
          <div className="flex items-center gap-2">
            <ClipboardList size={15} className="text-ink-400" />
            <p className="text-sm font-semibold">Listagem de chamados</p>
          </div>
          <span className="rounded-full bg-ink-50 border border-ink-100 px-2.5 py-1 text-[11px] text-ink-500">
            {tickets.length} aberto{tickets.length === 1 ? '' : 's'}
          </span>
        </header>

        <div className="max-h-[56vh] overflow-y-auto scrollbar-hide p-3">
          {tickets.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-11 h-11 rounded-2xl bg-ink-50 border border-ink-100 mx-auto flex items-center justify-center text-ink-400 mb-3">
                <Inbox size={18} />
              </div>
              <p className="text-sm font-semibold text-[#0B1020]">Nenhum chamado ainda</p>
              <p className="text-xs text-ink-400 mt-1">Quando um pedido for criado, ele aparece aqui.</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {tickets.map((ticket) => (
                <article
                  key={ticket.id}
                  className="rounded-2xl border border-ink-100 bg-ink-50/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0B1020]">{ticket.title}</p>
                      <p className="text-[11px] text-ink-400 mt-0.5">
                        {ticket.id.toUpperCase()} · {relativeTime(ticket.createdAt)}
                      </p>
                    </div>
                    <span className="rounded-full bg-white border border-ink-100 px-2.5 py-1 text-[10px] uppercase tracking-wide text-ink-500 shrink-0">
                      {ticket.status}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-ink-500">
                    {ticket.description}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Modal>
  );
}
