'use client';

import { ClipboardList, Lightbulb, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { relativeTime } from '../_lib/storage';
import type { Ticket, TicketTopic } from '../_lib/types';
import { Modal } from './ui';

const TOPICS = [
  { id: 'sugestao', label: 'Sugestão de UX', hint: 'Ideia, melhoria ou refinamento de fluxo' },
  { id: 'nova-tela', label: 'Nova tela', hint: 'Pedir uma tela inédita pro produto' },
  { id: 'nova-feature', label: 'Nova feature', hint: 'Funcionalidade nova que precisa de design' },
  { id: 'redesign', label: 'Redesign de tela', hint: 'Atualizar uma tela existente' },
  { id: 'design-review', label: 'Design review', hint: 'Pedir uma avaliação de UX/usabilidade' },
] as const;

export function HelpModal({
  open,
  onOpenChange,
  tickets = [],
  onCreateTicket,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tickets?: Ticket[];
  onCreateTicket?: (topic: TicketTopic, description: string) => void;
}) {
  const [topic, setTopic] = useState<(typeof TOPICS)[number]['id']>('sugestao');
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onCreateTicket?.(topic, text.trim());
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setText('');
      onOpenChange(false);
    }, 1500);
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Abrir chamado de UX"
      description="Pedidos que dependem do time de design — ideias, novas telas, redesign, reviews."
      size="lg"
    >
      {sent ? (
        <div className="py-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Sparkles size={20} />
          </div>
          <p className="text-base font-semibold">Chamado enviado</p>
          <p className="text-sm text-ink-500 mt-1">
            Vai aparecer no seu histórico de atividades.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
          <form onSubmit={submit} className="space-y-4 min-w-0">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400 mb-2 block">
                Tipo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TOPICS.map((t) => {
                  const active = topic === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTopic(t.id)}
                      className={`text-left rounded-2xl px-3 py-2.5 border transition ${
                        active
                          ? 'bg-[#0B1020] text-white border-[#0B1020]'
                          : 'bg-white border-ink-100 text-ink-700 hover:border-ink-200'
                      }`}
                    >
                      <p className="text-xs font-semibold">{t.label}</p>
                      <p
                        className={`text-[10px] mt-0.5 leading-snug ${
                          active ? 'text-white/70' : 'text-ink-400'
                        }`}
                      >
                        {t.hint}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400 mb-2 block">
                Descrição
              </label>
              <textarea
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Descreva o pedido com o contexto necessário..."
                className="input-glass"
                rows={5}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
              <p className="text-[11px] text-ink-400 inline-flex items-center gap-1.5 max-w-xs">
                <Lightbulb size={12} className="shrink-0" />
                Pedidos técnicos vão pro time de dev, não passam por aqui.
              </p>
              <button
                type="submit"
                className="btn-primary whitespace-nowrap justify-center min-w-[152px]"
                disabled={!text.trim()}
              >
                <Send size={13} />
                Enviar para UX
              </button>
            </div>
          </form>

          <aside className="rounded-2xl bg-white border border-ink-100 p-3 min-h-[220px]">
            <div className="flex items-center gap-2 px-1 pb-3 border-b border-ink-100">
              <ClipboardList size={14} className="text-ink-400" />
              <div>
                <p className="text-xs font-semibold">Listagem de chamados</p>
                <p className="text-[10px] text-ink-400">{tickets.length} aberto{tickets.length === 1 ? '' : 's'}</p>
              </div>
            </div>
            <div className="mt-2 max-h-72 overflow-y-auto scrollbar-hide space-y-2">
              {tickets.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs font-medium text-ink-500">Nenhum chamado ainda</p>
                  <p className="text-[10px] text-ink-400 mt-1">Os próximos pedidos aparecem aqui.</p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <article key={ticket.id} className="rounded-xl border border-ink-100 bg-ink-50/60 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-[#0B1020]">{ticket.title}</p>
                      <span className="rounded-full bg-white border border-ink-100 px-2 py-0.5 text-[9px] uppercase tracking-wide text-ink-400">
                        {ticket.status}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] leading-snug text-ink-500 line-clamp-2">
                      {ticket.description}
                    </p>
                    <p className="mt-2 text-[10px] text-ink-400">{relativeTime(ticket.createdAt)}</p>
                  </article>
                ))
              )}
            </div>
          </aside>
        </div>
      )}
    </Modal>
  );
}
