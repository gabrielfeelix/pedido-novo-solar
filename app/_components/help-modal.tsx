'use client';

import { LifeBuoy, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Modal } from './ui';

const TOPICS = [
  { id: 'novo-prototipo', label: 'Novo protótipo' },
  { id: 'bug', label: 'Erro / bug' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'outro', label: 'Outro' },
] as const;

export function HelpModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [topic, setTopic] = useState<(typeof TOPICS)[number]['id']>('novo-prototipo');
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
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
      title="Abrir chamado"
      description="Conte o que precisa. A equipe de UX recebe uma notificação."
      size="md"
    >
      {sent ? (
        <div className="py-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Sparkles size={20} />
          </div>
          <p className="text-base font-semibold">Chamado enviado</p>
          <p className="text-sm text-ink-500 mt-1">
            A equipe de UX vai responder no e-mail vinculado.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400 mb-2 block">
              Tipo
            </label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => {
                const active = topic === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTopic(t.id)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${
                      active
                        ? 'bg-[#0B1020] text-white border-[#0B1020]'
                        : 'bg-white/70 border-white text-ink-500 hover:text-[#0B1020]'
                    }`}
                  >
                    {t.label}
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
              placeholder="Descreva o pedido com o máximo de contexto que puder..."
              className="input-glass"
              rows={5}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-ink-400 inline-flex items-center gap-1.5">
              <LifeBuoy size={12} />
              Time UX responde em até 24h.
            </p>
            <button type="submit" className="btn-primary" disabled={!text.trim()}>
              <Send size={13} />
              Enviar chamado
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
