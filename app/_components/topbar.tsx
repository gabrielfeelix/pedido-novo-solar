'use client';

import { ArrowLeft, ClipboardList, Layers } from 'lucide-react';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { NotificationBell } from './notifications';
import { SearchDropdown } from './search-dropdown';
import { HelpModal } from './help-modal';
import { TicketsModal } from './tickets-modal';
import { useWorkspace } from './workspace-provider';
import type { Activity, Workspace } from '../_lib/types';

export function TopBar({
  workspace,
  activity,
  left,
}: {
  workspace: Workspace;
  activity: Activity[];
  left?: ReactNode;
  variant?: 'home' | 'app';
}) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [ticketsOpen, setTicketsOpen] = useState(false);
  const { tickets, createTicket } = useWorkspace();

  return (
    <div className="sticky-header">
      <div className="px-6 md:px-10 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {left ?? (
            <Link
              href="/"
              className="flex items-center gap-3 px-2 py-1 rounded-xl hover:bg-white/40 transition"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0B1020] text-white flex items-center justify-center">
                <Layers size={16} />
              </div>
              <div className="leading-tight hidden sm:block">
                <p className="text-sm font-semibold tracking-tight">UX Hub</p>
                <p className="text-[11px] text-ink-400 -mt-0.5">Oderco</p>
              </div>
            </Link>
          )}

          <div className="flex-1 hidden md:flex justify-center">
            <SearchDropdown workspace={workspace} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTicketsOpen(true)}
              className="btn-ghost !py-2 !px-4 hidden sm:inline-flex whitespace-nowrap"
            >
              <ClipboardList size={13} />
              <span className="text-xs font-medium">Chamados</span>
              {tickets.length > 0 && (
                <span className="rounded-full bg-[#0B1020] px-1.5 py-0.5 text-[10px] leading-none text-white">
                  {tickets.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setHelpOpen(true)}
              className="btn-ghost !py-2 !px-4 hidden sm:inline-flex whitespace-nowrap"
            >
              <span className="text-xs font-medium">Abrir chamado</span>
            </button>
            <NotificationBell activity={activity} />
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 border border-white shadow-sm flex items-center justify-center text-[#0B1020] font-semibold text-xs cursor-pointer"
              title="Você"
            >
              GB
            </div>
          </div>
        </div>
      </div>

      <HelpModal
        open={helpOpen}
        onOpenChange={setHelpOpen}
        onCreateTicket={createTicket}
      />
      <TicketsModal
        open={ticketsOpen}
        onOpenChange={setTicketsOpen}
        tickets={tickets}
      />
    </div>
  );
}

export function BackToCompanies() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/40 transition group"
    >
      <span className="w-7 h-7 rounded-lg glass-pill inline-flex items-center justify-center group-hover:translate-x-[-1px] transition">
        <ArrowLeft size={14} />
      </span>
      <span className="text-xs font-medium text-ink-500 group-hover:text-[#0B1020]">
        Empresas
      </span>
    </Link>
  );
}
