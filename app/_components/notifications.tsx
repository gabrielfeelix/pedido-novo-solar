'use client';

import { Bell, Check, Inbox } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Popover } from './ui';
import { relativeTime } from '../_lib/storage';
import type { Activity } from '../_lib/types';

const READ_KEY = 'ux-hub:notifications.read';

export function NotificationBell({ activity }: { activity: Activity[] }) {
  const items = activity.slice(0, 8);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(READ_KEY);
      if (raw) setReadIds(new Set(JSON.parse(raw) as string[]));
    } catch {
      setReadIds(new Set());
    }
  }, []);

  const unread = useMemo(
    () => items.filter((item) => !readIds.has(item.id)).length,
    [items, readIds]
  );

  function markVisibleAsRead() {
    const next = new Set(readIds);
    for (const item of items) next.add(item.id);
    setReadIds(next);
    try {
      window.localStorage.setItem(READ_KEY, JSON.stringify(Array.from(next)));
    } catch {
      /* noop */
    }
  }

  return (
    <Popover
      align="right"
      width={360}
      trigger={(toggle, open) => (
        <button
          onClick={toggle}
          className={`icon-btn ${open ? '!bg-white !text-[#0B1020]' : ''}`}
          aria-label="Notificações"
        >
          <Bell size={15} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 ring-2 ring-white text-[9px] leading-4 text-white font-semibold">
              {unread}
            </span>
          )}
        </button>
      )}
    >
      {(close) => (
        <div>
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/60">
            <div className="flex items-center gap-2">
              <Inbox size={14} className="text-ink-400" />
              <p className="text-sm font-semibold">Notificações</p>
            </div>
            {items.length > 0 && (
              <button
                onClick={() => {
                  markVisibleAsRead();
                  close();
                }}
                className="text-[11px] font-medium text-ink-400 hover:text-[#0B1020] inline-flex items-center gap-1"
              >
                <Check size={12} />
                Marcar como lido
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-hide">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="w-10 h-10 rounded-full bg-white/70 border border-white mx-auto flex items-center justify-center text-ink-400 mb-2">
                  <Inbox size={16} />
                </div>
                <p className="text-sm font-medium">Tudo em dia</p>
                <p className="text-xs text-ink-400 mt-0.5">
                  Nenhuma atividade recente.
                </p>
              </div>
            ) : (
              items.map((a) => (
                <div
                  key={a.id}
                  className="px-4 py-3 border-b border-white/40 last:border-0 hover:bg-white/40 transition relative"
                >
                  {!readIds.has(a.id) && (
                    <span className="absolute left-2 top-4 w-1.5 h-1.5 rounded-full bg-rose-500" />
                  )}
                  <p className="text-sm text-[#0B1020] leading-snug">{a.message}</p>
                  <p className="text-[11px] text-ink-400 mt-0.5">
                    {relativeTime(a.at)} · {a.companySlug}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="px-4 py-2.5 border-t border-white/60 text-[11px] text-ink-400 text-center">
            Histórico das suas últimas ações
          </div>
        </div>
      )}
    </Popover>
  );
}
