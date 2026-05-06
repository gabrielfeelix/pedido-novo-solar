'use client';

import {
  Building2,
  Layers,
  MessageSquare,
  Plus,
  Sparkles,
  Trash2,
  Workflow,
} from 'lucide-react';
import Link from 'next/link';
import { relativeTime } from '../_lib/storage';
import type { Activity, Workspace } from '../_lib/types';

const ICONS: Record<Activity['kind'], React.ComponentType<{ size?: number; className?: string }>> = {
  'prototype.created': Plus,
  'prototype.updated': Layers,
  'prototype.removed': Trash2,
  'version.added': Layers,
  'comment.added': MessageSquare,
  'handoff.updated': Workflow,
  'company.viewed': Building2,
  'ticket.created': MessageSquare,
};

const TINTS: Record<Activity['kind'], string> = {
  'prototype.created': 'bg-emerald-50 text-emerald-600',
  'prototype.updated': 'bg-violet-50 text-violet-600',
  'prototype.removed': 'bg-rose-50 text-rose-600',
  'version.added': 'bg-blue-50 text-blue-600',
  'comment.added': 'bg-amber-50 text-amber-600',
  'handoff.updated': 'bg-cyan-50 text-cyan-600',
  'company.viewed': 'bg-slate-100 text-slate-600',
  'ticket.created': 'bg-indigo-50 text-indigo-600',
};

export function ActivityFeed({
  activity,
  workspace,
  fallback,
}: {
  activity: Activity[];
  workspace: Workspace;
  fallback: Activity[];
}) {
  const items = (activity.length ? activity : fallback).slice(0, 8);

  function companyOf(slug?: string) {
    return workspace.companies.find((c) => c.slug === slug);
  }

  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-400">
            Últimas atividades
          </h2>
          <p className="text-xs text-ink-400 mt-1">
            Tudo o que aconteceu nos seus projetos recentemente
          </p>
        </div>
        {activity.length === 0 && (
          <span className="text-[10px] glass-pill rounded-full px-2 py-1 text-ink-500 inline-flex items-center gap-1">
            <Sparkles size={10} />
            histórico de exemplo
          </span>
        )}
      </div>

      <div className="glass-card rounded-3xl divide-y divide-white/60">
        {items.map((a) => {
          const Icon = ICONS[a.kind];
          const tint = TINTS[a.kind];
          const company = companyOf(a.companySlug);
          return (
            <Link
              key={a.id}
              href={company ? `/${company.slug}` : '/'}
              className="flex items-center gap-4 px-5 py-4 hover:bg-white/40 transition first:rounded-t-3xl last:rounded-b-3xl"
            >
              <div className={`w-10 h-10 rounded-xl ${tint} flex items-center justify-center shrink-0`}>
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[#0B1020] leading-snug">{a.message}</p>
                <p className="text-[11px] text-ink-400 mt-0.5">
                  {relativeTime(a.at)}
                  {company ? <> · {company.name}</> : null}
                </p>
              </div>
              {company && (
                <div
                  className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-[10px] font-semibold"
                  style={{
                    background: `${company.brandColor}14`,
                    color: company.brandColor,
                  }}
                >
                  {company.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/** Sample seed activity used when localStorage is empty */
export function buildFallbackActivity(workspace: Workspace): Activity[] {
  const out: Activity[] = [];
  const now = Date.now();

  workspace.companies.forEach((c, ci) => {
    (c.projects || []).forEach((p) => {
      (p.prototypes || []).forEach((pr, pi) => {
        out.push({
          id: `seed-${c.slug}-${p.slug}-${pr.id}`,
          kind: 'prototype.created',
          at: new Date(now - (ci * 4 + pi) * 3600 * 1000).toISOString(),
          companySlug: c.slug,
          projectSlug: p.slug,
          prototypeId: pr.id,
          message: `Você publicou “${pr.name}” em ${p.name}.`,
        });
      });
    });
  });

  if (out.length < 4) {
    out.push({
      id: 'seed-welcome',
      kind: 'company.viewed',
      at: new Date(now - 24 * 3600 * 1000).toISOString(),
      companySlug: workspace.companies[0]?.slug ?? 'pcyes',
      message: 'Bem-vindo ao UX Hub. Comece adicionando um protótipo.',
    });
  }

  return out
    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
    .slice(0, 6);
}
