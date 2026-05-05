'use client';

import { ArrowLeft, Layers, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { NotificationBell } from './notifications';
import { SearchCommand } from './search-command';
import { HelpModal } from './help-modal';
import type { Activity, Workspace } from '../_lib/types';

export function TopBar({
  workspace,
  activity,
  left,
  variant = 'home',
}: {
  workspace: Workspace;
  activity: Activity[];
  left?: ReactNode;
  variant?: 'home' | 'app';
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
      if (e.key === '/' && !searchOpen) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          setSearchOpen(true);
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  return (
    <div className="sticky-header">
      <div className="px-6 md:px-10 py-4">
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
            <button
              onClick={() => setSearchOpen(true)}
              className="glass-pill rounded-full pl-4 pr-2 py-2 flex items-center gap-3 w-full max-w-md text-left text-ink-400 hover:text-ink-700 transition"
            >
              <Search size={14} />
              <span className="text-xs flex-1">Buscar empresas, projetos, protótipos...</span>
              <span className="kbd">⌘K</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="icon-btn md:hidden"
              aria-label="Buscar"
            >
              <Search size={15} />
            </button>
            <button
              onClick={() => setHelpOpen(true)}
              className="btn-ghost !py-2 !px-3 hidden sm:inline-flex"
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

      <SearchCommand
        open={searchOpen}
        onOpenChange={setSearchOpen}
        workspace={workspace}
      />
      <HelpModal open={helpOpen} onOpenChange={setHelpOpen} />
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
