'use client';

import {
  ArrowUpRight,
  Building2,
  FolderGit2,
  Layers,
  Search,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Workspace } from '../_lib/types';

type Hit =
  | {
      kind: 'company';
      slug: string;
      name: string;
      description: string;
      brandColor: string;
    }
  | {
      kind: 'project';
      slug: string;
      name: string;
      companySlug: string;
      companyName: string;
    }
  | {
      kind: 'prototype';
      id: string;
      name: string;
      version: string;
      url?: string;
      figmaUrl?: string;
      companySlug: string;
      companyName: string;
      projectSlug: string;
      projectName: string;
    };

export function SearchDropdown({ workspace }: { workspace: Workspace }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click / escape
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

  // Cmd+K → focus input
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 30);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const all = useMemo<Hit[]>(() => {
    const out: Hit[] = [];
    for (const c of workspace.companies) {
      out.push({
        kind: 'company',
        slug: c.slug,
        name: c.name,
        description: c.description,
        brandColor: c.brandColor,
      });
      for (const p of c.projects || []) {
        out.push({
          kind: 'project',
          slug: p.slug,
          name: p.name,
          companySlug: c.slug,
          companyName: c.name,
        });
        for (const pr of p.prototypes || []) {
          out.push({
            kind: 'prototype',
            id: pr.id,
            name: pr.name,
            version: pr.version,
            url: pr.url,
            figmaUrl: pr.figmaUrl,
            companySlug: c.slug,
            companyName: c.name,
            projectSlug: p.slug,
            projectName: p.name,
          });
        }
      }
    }
    return out;
  }, [workspace]);

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all.slice(0, 8);
    return all
      .filter((h) => {
        const blob =
          h.kind === 'company'
            ? `${h.name} ${h.description}`
            : h.kind === 'project'
              ? `${h.name} ${h.companyName}`
              : `${h.name} ${h.version} ${h.projectName} ${h.companyName}`;
        return blob.toLowerCase().includes(q);
      })
      .slice(0, 18);
  }, [all, query]);

  const grouped = useMemo(
    () => ({
      companies: hits.filter((h) => h.kind === 'company'),
      projects: hits.filter((h) => h.kind === 'project'),
      prototypes: hits.filter((h) => h.kind === 'prototype'),
    }),
    [hits]
  );

  const showDropdown = open && (query.length > 0 || hits.length > 0);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div
        className={`glass-pill rounded-full pl-4 pr-2 py-2 flex items-center gap-3 transition ${
          open ? 'ring-2 ring-indigo-200' : ''
        }`}
      >
        <Search size={14} className="text-ink-400 shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="Buscar empresas, projetos, protótipos..."
          className="bg-transparent outline-none text-xs flex-1 placeholder:text-ink-400 text-[#0B1020]"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="text-ink-400 hover:text-[#0B1020] p-1"
            aria-label="Limpar"
          >
            <X size={12} />
          </button>
        ) : (
          <span className="kbd shrink-0">⌘K</span>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 mt-2 z-50 anim-popover-in">
          <div className="glass-strong rounded-2xl overflow-hidden">
            <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
              {hits.length === 0 ? (
                <div className="py-8 text-center px-4">
                  <p className="text-sm font-medium">Nada encontrado</p>
                  <p className="text-xs text-ink-400 mt-0.5">
                    Tente outro termo.
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  {grouped.companies.length > 0 && (
                    <Group title="Empresas">
                      {grouped.companies.map((h) =>
                        h.kind === 'company' ? (
                          <Row
                            key={`c-${h.slug}`}
                            href={`/${h.slug}`}
                            onClick={() => setOpen(false)}
                          >
                            <span
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                background: `${h.brandColor}14`,
                                color: h.brandColor,
                              }}
                            >
                              <Building2 size={14} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold truncate">
                                {h.name}
                              </p>
                              <p className="text-[11px] text-ink-400 truncate">
                                {h.description}
                              </p>
                            </div>
                            <ArrowUpRight size={12} className="text-ink-300" />
                          </Row>
                        ) : null
                      )}
                    </Group>
                  )}

                  {grouped.projects.length > 0 && (
                    <Group title="Projetos">
                      {grouped.projects.map((h) =>
                        h.kind === 'project' ? (
                          <Row
                            key={`p-${h.companySlug}-${h.slug}`}
                            href={`/${h.companySlug}`}
                            onClick={() => setOpen(false)}
                          >
                            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <FolderGit2 size={14} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold truncate">
                                {h.name}
                              </p>
                              <p className="text-[11px] text-ink-400 truncate">
                                {h.companyName}
                              </p>
                            </div>
                            <ArrowUpRight size={12} className="text-ink-300" />
                          </Row>
                        ) : null
                      )}
                    </Group>
                  )}

                  {grouped.prototypes.length > 0 && (
                    <Group title="Protótipos">
                      {grouped.prototypes.map((h) =>
                        h.kind === 'prototype' ? (
                          <Row
                            key={`pr-${h.id}`}
                            href={h.url || `/${h.companySlug}`}
                            external={!!h.url}
                            onClick={() => setOpen(false)}
                          >
                            <span className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                              <Layers size={14} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold truncate">
                                  {h.name}
                                </p>
                                <span className="kbd">{h.version}</span>
                              </div>
                              <p className="text-[11px] text-ink-400 truncate">
                                {h.companyName} · {h.projectName}
                              </p>
                            </div>
                            <ArrowUpRight size={12} className="text-ink-300" />
                          </Row>
                        ) : null
                      )}
                    </Group>
                  )}
                </div>
              )}
            </div>
            <div className="px-3 py-2 border-t border-white/60 flex items-center justify-between text-[10px] text-ink-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="kbd">↵</span> abrir
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="kbd">esc</span> fechar
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-400 px-2 pt-2 pb-1">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Row({
  href,
  external,
  onClick,
  children,
}: {
  href: string;
  external?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const cls =
    'flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/70 transition';
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
        className={cls}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={cls}>
      {children}
    </Link>
  );
}
