'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Building2, Search, Sparkles } from 'lucide-react';
import { TopBar } from './_components/topbar';
import { ActivityFeed, buildFallbackActivity } from './_components/activity-feed';
import { totalProjects, totalPrototypes } from './_lib/storage';
import { useWorkspace } from './_components/workspace-provider';
import type { Company } from './_lib/types';

export default function HomePage() {
  const { workspace, activity } = useWorkspace();
  const [query, setQuery] = useState('');

  const companies = workspace.companies;
  const totals = useMemo(
    () => ({
      companies: companies.length,
      projects: totalProjects(workspace),
      prototypes: totalPrototypes(workspace),
    }),
    [companies.length, workspace]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [companies, query]);

  const fallback = useMemo(() => buildFallbackActivity(workspace), [workspace]);

  return (
    <div className="min-h-screen w-full">
      <TopBar workspace={workspace} activity={activity} variant="home" />

      <section className="px-6 md:px-10 pt-12 md:pt-16 pb-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-medium text-ink-500 mb-6">
            <Sparkles size={12} className="text-indigo-500" />
            Hub de design e protótipos do grupo
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#0B1020] leading-[1.05]">
            Selecione uma <span className="italic font-medium text-ink-500">empresa</span>
            <br /> para acessar o workspace.
          </h1>
          <p className="mt-5 text-ink-500 max-w-xl mx-auto text-base md:text-[17px] leading-relaxed">
            Cada empresa tem seus protótipos, handoffs e atividades centralizadas. Clique em um card pra abrir o painel.
          </p>

          <div className="mt-9 max-w-xl mx-auto">
            <div className="glass-strong rounded-2xl flex items-center gap-3 px-4 py-3">
              <Search size={18} className="text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrar empresa por nome ou área..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-400"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs text-ink-400 hover:text-ink-700"
                >
                  limpar
                </button>
              )}
            </div>
            <div className="mt-3 inline-flex items-center gap-2 text-[11px] text-ink-400">
              <span className="glass-pill rounded-full px-2 py-1">
                {totals.companies} empresas
              </span>
              <span className="glass-pill rounded-full px-2 py-1">
                {totals.projects} projetos
              </span>
              <span className="glass-pill rounded-full px-2 py-1">
                {totals.prototypes} protótipos
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-400">
                Empresas
              </h2>
              <p className="text-xs text-ink-400 mt-1">
                {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="glass-card rounded-3xl py-20 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/70 border border-white flex items-center justify-center text-ink-400 mb-4">
                <Building2 size={22} />
              </div>
              <p className="text-sm font-medium text-ink-700">Nenhuma empresa encontrada</p>
              <p className="text-xs text-ink-400 mt-1">Tente outro termo de busca.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((company) => (
                <CompanyCard key={company.slug} company={company} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 md:px-10 mt-16 pb-24">
        <div className="max-w-7xl mx-auto">
          <ActivityFeed
            activity={activity}
            workspace={workspace}
            fallback={fallback}
          />
        </div>
      </section>

      <footer className="px-6 md:px-10 pb-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ink-400">
          <p>© {new Date().getFullYear()} Oderco · UX Hub</p>
          <p>Construído com cuidado pela equipe de design.</p>
        </div>
      </footer>
    </div>
  );
}

function CompanyCard({ company }: { company: Company }) {
  const projectCount = company.projects?.length || 0;
  const prototypeCount =
    company.projects?.reduce((s, p) => s + (p.prototypes?.length || 0), 0) || 0;
  const hasProjects = projectCount > 0;
  const logoNeedsColor = company.logo.includes('white');

  return (
    <Link
      href={`/${company.slug}`}
      className="glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col group"
    >
      <div
        aria-hidden
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-25 blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-45"
        style={{ background: company.brandColor }}
      />

      <div className="flex items-start justify-between mb-8 relative">
        <div
          className="w-14 h-14 rounded-2xl border border-white flex items-center justify-center shadow-[0_8px_20px_-10px_rgba(15,23,42,0.18)] overflow-hidden relative"
          style={{
            color: company.brandColor,
            background: logoNeedsColor ? company.brandColor : '#fff',
          }}
        >
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={36}
              height={36}
              className="object-contain max-h-9 max-w-10 w-auto h-auto"
            />
          ) : (
            <Building2 size={22} />
          )}
        </div>

        <div className="w-9 h-9 rounded-full bg-white/80 border border-white text-ink-500 flex items-center justify-center transition-all duration-300 group-hover:bg-[#0B1020] group-hover:text-white group-hover:rotate-[-12deg]">
          <ArrowUpRight size={16} />
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="dot" style={{ background: company.brandColor }} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-400">
            Workspace
          </span>
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-[#0B1020]">
          {company.name}
        </h3>
        <p className="mt-2 text-sm text-ink-500 leading-relaxed line-clamp-2 min-h-[40px]">
          {company.description}
        </p>
      </div>

      <div className="mt-6 pt-5 border-t border-white/70 flex items-center justify-between relative">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-medium text-ink-700">
            {projectCount} {projectCount === 1 ? 'projeto' : 'projetos'}
          </span>
          {prototypeCount > 0 && (
            <>
              <span className="text-ink-300">·</span>
              <span className="text-ink-500">
                {prototypeCount} protótipo{prototypeCount > 1 ? 's' : ''}
              </span>
            </>
          )}
          {hasProjects && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              ativo
            </span>
          )}
        </div>
        <span className="text-[11px] text-ink-400 font-medium font-mono">
          /{company.slug}
        </span>
      </div>
    </Link>
  );
}
