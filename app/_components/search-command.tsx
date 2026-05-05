'use client';

import { ArrowUpRight, Building2, FolderGit2, Layers, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Modal } from './ui';
import type { Workspace } from '../_lib/types';

type SearchHit =
  | { kind: 'company'; slug: string; name: string; description: string; brandColor: string }
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

export function SearchCommand({
  open,
  onOpenChange,
  workspace,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  workspace: Workspace;
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [open]);

  const hits = useMemo<SearchHit[]>(() => {
    const q = query.trim().toLowerCase();
    const all: SearchHit[] = [];
    for (const c of workspace.companies) {
      all.push({
        kind: 'company',
        slug: c.slug,
        name: c.name,
        description: c.description,
        brandColor: c.brandColor,
      });
      for (const p of c.projects || []) {
        all.push({
          kind: 'project',
          slug: p.slug,
          name: p.name,
          companySlug: c.slug,
          companyName: c.name,
        });
        for (const pr of p.prototypes || []) {
          all.push({
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
    if (!q) return all.slice(0, 12);
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
      .slice(0, 30);
  }, [query, workspace]);

  const grouped = useMemo(() => {
    return {
      companies: hits.filter((h) => h.kind === 'company'),
      projects: hits.filter((h) => h.kind === 'project'),
      prototypes: hits.filter((h) => h.kind === 'prototype'),
    };
  }, [hits]);

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="lg">
      <div className="-m-1 -mt-2">
        <div className="flex items-center gap-3 px-1 pb-4 border-b border-white/60">
          <Search size={16} className="text-ink-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar empresas, projetos, protótipos..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-400"
          />
          <span className="kbd">ESC</span>
        </div>

        <div className="max-h-[60vh] overflow-y-auto scrollbar-hide pt-3 -mx-1 px-1">
          {hits.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-10 h-10 rounded-full bg-white/70 border border-white mx-auto flex items-center justify-center text-ink-400 mb-2">
                <Search size={16} />
              </div>
              <p className="text-sm font-medium">Nada encontrado</p>
              <p className="text-xs text-ink-400 mt-0.5">
                Tente outro termo de busca.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {grouped.companies.length > 0 && (
                <Group title="Empresas">
                  {grouped.companies.map(
                    (h) =>
                      h.kind === 'company' && (
                        <Link
                          key={`c-${h.slug}`}
                          href={`/${h.slug}`}
                          onClick={() => onOpenChange(false)}
                          className="hit-row group"
                        >
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{
                              background: `${h.brandColor}14`,
                              color: h.brandColor,
                            }}
                          >
                            <Building2 size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{h.name}</p>
                            <p className="text-[11px] text-ink-400 truncate">
                              {h.description}
                            </p>
                          </div>
                          <ArrowUpRight
                            size={14}
                            className="text-ink-300 group-hover:text-[#0B1020] transition"
                          />
                        </Link>
                      )
                  )}
                </Group>
              )}

              {grouped.projects.length > 0 && (
                <Group title="Projetos">
                  {grouped.projects.map(
                    (h) =>
                      h.kind === 'project' && (
                        <Link
                          key={`p-${h.companySlug}-${h.slug}`}
                          href={`/${h.companySlug}`}
                          onClick={() => onOpenChange(false)}
                          className="hit-row group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FolderGit2 size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{h.name}</p>
                            <p className="text-[11px] text-ink-400 truncate">
                              {h.companyName}
                            </p>
                          </div>
                          <ArrowUpRight
                            size={14}
                            className="text-ink-300 group-hover:text-[#0B1020] transition"
                          />
                        </Link>
                      )
                  )}
                </Group>
              )}

              {grouped.prototypes.length > 0 && (
                <Group title="Protótipos">
                  {grouped.prototypes.map(
                    (h) =>
                      h.kind === 'prototype' && (
                        <a
                          key={`pr-${h.id}`}
                          href={h.url || `/${h.companySlug}`}
                          target={h.url ? '_blank' : undefined}
                          rel="noreferrer"
                          onClick={() => onOpenChange(false)}
                          className="hit-row group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                            <Layers size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold truncate">{h.name}</p>
                              <span className="text-[10px] font-mono text-ink-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                {h.version}
                              </span>
                            </div>
                            <p className="text-[11px] text-ink-400 truncate">
                              {h.companyName} · {h.projectName}
                            </p>
                          </div>
                          <ArrowUpRight
                            size={14}
                            className="text-ink-300 group-hover:text-[#0B1020] transition"
                          />
                        </a>
                      )
                  )}
                </Group>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/60 text-[11px] text-ink-400">
          <div className="flex items-center gap-2">
            <span className="kbd">↵</span> abrir
          </div>
          <div className="flex items-center gap-2">
            <span className="kbd">⌘</span>
            <span className="kbd">K</span> pra abrir/fechar
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.hit-row) {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 8px;
          border-radius: 14px;
          transition: background 0.15s ease;
        }
        :global(.hit-row:hover) {
          background: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </Modal>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-400 px-2 mb-1">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
