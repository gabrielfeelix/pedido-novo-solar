'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  ChevronRight,
  ExternalLink,
  FolderGit2,
  Layers,
  LayoutGrid,
  LifeBuoy,
  MessageSquare,
  Plus,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import { TopBar, BackToCompanies } from '../_components/topbar';
import { PrototypeCard } from '../_components/prototype-card';
import { PrototypeDrawer } from '../_components/prototype-drawer';
import { AddPrototypeModal } from '../_components/add-prototype-modal';
import { HelpModal } from '../_components/help-modal';
import { ActivityFeed, buildFallbackActivity } from '../_components/activity-feed';
import { Bars, Donut, TrendStat } from '../_components/charts';
import { StatusPill } from '../_components/ui';
import { useWorkspace } from '../_components/workspace-provider';
import { logoFrameStyle, logoImageStyle } from '../_lib/brand';
import type { Company, Project } from '../_lib/types';

const NAV = [
  { id: 'overview', label: 'Visão geral', icon: LayoutGrid },
  { id: 'prototypes', label: 'Protótipos', icon: FolderGit2 },
  { id: 'handoffs', label: 'Handoffs', icon: Layers },
  { id: 'team', label: 'Time', icon: Users },
  { id: 'settings', label: 'Configurações', icon: Settings },
] as const;

type Tab = (typeof NAV)[number]['id'];

export default function CompanyDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const {
    workspace,
    activity,
    addPrototype,
    setCurrentPrototype,
    addComment,
    removePrototype,
    createTicket,
  } = useWorkspace();
  const company = workspace.companies.find((c) => c.slug === slug);
  if (!company) notFound();

  const [tab, setTab] = useState<Tab>('overview');
  const [drawerProtoId, setDrawerProtoId] = useState<string | null>(null);
  const [drawerProjectSlug, setDrawerProjectSlug] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [defaultAddProject, setDefaultAddProject] = useState<string | undefined>();
  const [helpOpen, setHelpOpen] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  const projects = useMemo(() => company.projects || [], [company.projects]);
  const drawerProject = useMemo(
    () => projects.find((p) => p.slug === drawerProjectSlug),
    [projects, drawerProjectSlug]
  );

  const companyActivity = useMemo(
    () => activity.filter((a) => a.companySlug === company.slug),
    [activity, company.slug]
  );
  const fallback = useMemo(
    () => buildFallbackActivity(workspace).filter((a) => a.companySlug === company.slug),
    [workspace, company.slug]
  );

  function openDrawer(projectSlug: string, protoId: string) {
    setDrawerProjectSlug(projectSlug);
    setDrawerProtoId(protoId);
  }

  function openAdd(projectSlug?: string) {
    setDefaultAddProject(projectSlug);
    setAddOpen(true);
  }

  async function shareWorkspace() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg('✓ Link copiado!');

      const { saveWorkspaceShare } = await import('@/_lib/supabase-db');
      saveWorkspaceShare(company.slug, url).catch(console.error);

      setTimeout(() => setShareMsg(null), 3000);
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
      setShareMsg('✗ Erro ao copiar');
      setTimeout(() => setShareMsg(null), 3000);
    }
  }

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar
        company={company}
        tab={tab}
        onTab={setTab}
        onOpenHelp={() => setHelpOpen(true)}
      />

      <main className="flex-1 min-w-0 flex flex-col">
        <TopBar
          workspace={workspace}
          activity={activity}
          variant="app"
          left={<DashboardCrumb company={company} />}
        />

        <div className="px-6 md:px-10 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {tab === 'overview' && (
              <>
                <CompanyHero
                  company={company}
                  onCreate={() => openAdd(projects[0]?.slug)}
                  onShare={shareWorkspace}
                />
                <OverviewCharts company={company} projects={projects} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ProjectsSection
                      title="Protótipos da empresa"
                      hint="Toque em um card pra ver versões, comentários e gerar handoff."
                      company={company}
                      projects={projects}
                      onOpen={openDrawer}
                      onSelectVersion={(projectSlug, id) =>
                        setCurrentPrototype(company.slug, projectSlug, id)
                      }
                      onAdd={() => openAdd()}
                    />
                  </div>
                  <div>
                    <ActivityFeed
                      activity={companyActivity}
                      workspace={workspace}
                      fallback={fallback}
                    />
                  </div>
                </div>
              </>
            )}

            {tab === 'prototypes' && (
              <ProjectsSection
                title="Protótipos"
                hint="Tudo o que existe nesta empresa. Use o drawer pra alternar versões."
                company={company}
                projects={projects}
                onOpen={openDrawer}
                onSelectVersion={(projectSlug, id) =>
                  setCurrentPrototype(company.slug, projectSlug, id)
                }
                onAdd={() => openAdd()}
                hideViewAll
              />
            )}

            {tab === 'handoffs' && (
              <HandoffsSection
                company={company}
                projects={projects}
                onOpen={openDrawer}
              />
            )}

            {tab === 'team' && <PlaceholderTab title="Time" />}
            {tab === 'settings' && <PlaceholderTab title="Configurações" />}
          </div>
        </div>
      </main>

      <PrototypeDrawer
        open={!!drawerProtoId}
        onOpenChange={(v) => {
          if (!v) {
            setDrawerProtoId(null);
            setDrawerProjectSlug(null);
          }
        }}
        project={drawerProject}
        brandColor={company.brandColor}
        companySlug={company.slug}
        prototypeId={drawerProtoId}
        onSelectVersion={(id) => {
          if (drawerProjectSlug)
            setCurrentPrototype(company.slug, drawerProjectSlug, id);
          setDrawerProtoId(id);
        }}
        onAddComment={(id, text) =>
          drawerProjectSlug &&
          addComment(company.slug, drawerProjectSlug, id, text)
        }
        onAddVersion={() => {
          if (drawerProjectSlug) openAdd(drawerProjectSlug);
        }}
        onRemoveVersion={(id, name) =>
          drawerProjectSlug &&
          removePrototype(company.slug, drawerProjectSlug, id, name)
        }
      />

      <AddPrototypeModal
        open={addOpen}
        onOpenChange={setAddOpen}
        defaultProjectSlug={defaultAddProject}
        projects={projects.map((p) => ({ slug: p.slug, name: p.name }))}
        companySlug={company.slug}
        companyName={company.name}
        brandColor={company.brandColor}
        onSubmit={(data) => {
          const newId = addPrototype(company.slug, data.projectSlug, {
            name: data.name,
            version: data.version,
            slug: `${data.projectSlug}-${data.version}`,
            url: data.url || undefined,
            figmaUrl: data.figmaUrl || undefined,
            preview: data.preview || undefined,
            notes: data.notes,
            source: 'manual',
          });
          if (data.setAsCurrent) {
            setCurrentPrototype(company.slug, data.projectSlug, newId);
          }
        }}
      />

      <HelpModal
        open={helpOpen}
        onOpenChange={setHelpOpen}
        onCreateTicket={createTicket}
      />
    </div>
  );
}

/* ---------------- Sidebar ---------------- */

function Sidebar({
  company,
  tab,
  onTab,
  onOpenHelp,
}: {
  company: Company;
  tab: Tab;
  onTab: (t: Tab) => void;
  onOpenHelp: () => void;
}) {
  return (
    <aside className="w-[260px] shrink-0 sticky top-0 h-screen p-4 hidden lg:flex">
      <div className="glass rounded-3xl flex-1 flex flex-col p-5">
        <Link
          href="/"
          className="group flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/40 transition"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0B1020] text-white flex items-center justify-center">
            <Layers size={16} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">UX Hub</p>
            <p className="text-[11px] text-ink-400 -mt-0.5">Oderco</p>
          </div>
        </Link>

        <div className="divider my-4" />

        <div className="rounded-2xl bg-white/60 border border-white p-3 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden"
            style={logoFrameStyle(company)}
          >
            {company.logo ? (
              <Image
                src={company.logo}
                alt={company.name}
                width={26}
                height={26}
                className="object-contain max-h-7 max-w-8 w-auto h-auto"
                style={logoImageStyle(company)}
              />
            ) : (
              <Building2 size={18} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{company.name}</p>
            <p className="text-[11px] text-ink-400 truncate">
              {company.projects?.length || 0} projetos
            </p>
          </div>
          <Link
            href="/"
            title="Trocar empresa"
            className="w-8 h-8 rounded-lg bg-white border border-slate-100 text-ink-500 hover:text-ink-700 flex items-center justify-center transition"
          >
            <ArrowLeft size={14} />
          </Link>
        </div>

        <nav className="mt-5 space-y-1">
          <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-400">
            Workspace
          </p>
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#0B1020] text-white shadow-[0_10px_24px_-12px_rgba(11,16,32,0.5)]'
                    : 'text-ink-500 hover:text-[#0B1020] hover:bg-white/60'
                }`}
              >
                <Icon size={16} className={active ? 'opacity-90' : 'opacity-80'} />
                <span className="flex-1 text-left">{item.label}</span>
                {active && <ChevronRight size={14} className="opacity-70" />}
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="rounded-2xl p-4 bg-gradient-to-br from-[#0B1020] to-[#1F2937] text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-indigo-500/30 blur-2xl" />
          <div className="relative">
            <LifeBuoy size={18} className="opacity-90" />
            <p className="text-sm font-semibold mt-3">Precisa de ajuda?</p>
            <p className="text-[11px] text-white/60 mt-1 leading-relaxed">
              Solicite um novo protótipo ou tire dúvidas com o time de UX.
            </p>
            <button
              onClick={onOpenHelp}
              className="mt-3 w-full text-xs font-medium bg-white/15 hover:bg-white/25 transition rounded-lg py-2 inline-flex items-center justify-center gap-1.5"
            >
              Abrir chamado <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ---------------- Crumb ---------------- */

function DashboardCrumb({ company }: { company: Company }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <BackToCompanies />
      <span className="hidden md:block text-ink-200">/</span>
      <div className="hidden md:flex items-center gap-2 min-w-0">
        <div
          className="w-7 h-7 rounded-lg border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden"
          style={logoFrameStyle(company)}
        >
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={18}
              height={18}
              className="object-contain max-h-5 max-w-5 w-auto h-auto"
              style={logoImageStyle(company)}
            />
          ) : (
            <Building2 size={14} />
          )}
        </div>
        <span className="text-sm font-semibold truncate">{company.name}</span>
      </div>
    </div>
  );
}

/* ---------------- Hero ---------------- */

function CompanyHero({ company, onCreate, onShare }: { company: Company; onCreate: () => void; onShare: () => void }) {
  const projectCount = company.projects?.length || 0;
  return (
    <section className="relative rounded-3xl overflow-hidden glass-strong">
      <div
        aria-hidden
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          background: `radial-gradient(700px 280px at 90% -20%, ${company.brandColor}, transparent 70%), radial-gradient(500px 220px at -10% 120%, ${company.brandColor}, transparent 70%)`,
        }}
      />
      <div className="relative p-8 md:p-10 flex items-center gap-8 flex-col md:flex-row text-center md:text-left">
        <div
          className="w-24 h-24 rounded-3xl border border-white shadow-[0_24px_48px_-24px_rgba(15,23,42,0.25)] flex items-center justify-center p-4 shrink-0"
          style={logoFrameStyle(company)}
        >
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={70}
              height={70}
              className="object-contain max-h-16 max-w-20 w-auto h-auto"
              style={logoImageStyle(company)}
            />
          ) : (
            <Building2 size={36} />
          )}
        </div>

        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/80 border border-white text-[11px] font-medium text-ink-500 mb-3">
            <span className="dot" style={{ background: company.brandColor }} />
            Workspace ativo · {projectCount} {projectCount === 1 ? 'projeto' : 'projetos'}
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#0B1020]">
            {company.name}
          </h1>
          <p className="mt-2 text-ink-500 text-sm md:text-base max-w-2xl leading-relaxed">
            {company.description}
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 w-full md:w-auto">
          <button onClick={onCreate} className="btn-primary justify-center">
            <Plus size={14} />
            Novo protótipo
          </button>
          <button onClick={onShare} className="btn-ghost justify-center relative">
            Compartilhar workspace
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Charts ---------------- */

function OverviewCharts({ company, projects }: { company: Company; projects: Project[] }) {
  const projectCount = company.projects?.length || 0;
  const prototypeCount =
    company.projects?.reduce((s, p) => s + (p.prototypes?.length || 0), 0) || 0;

  // Deterministic mock series seeded by name length so it doesn't flicker
  const seed = company.name.length;
  const series = (offset: number) =>
    Array.from({ length: 12 }, (_, i) => {
      const x = (i + seed + offset) * 0.7;
      return Math.round(8 + Math.sin(x) * 5 + Math.cos(x / 2) * 4 + i * 0.6);
    });

  const monthly = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map((label, i) => ({
    label,
    value: Math.max(2, Math.round(3 + Math.sin(seed + i) * 3 + i * 1.5)),
  }));

  const statusCounts = {
    ativo: projects.filter(p => p.status === 'ativo').length,
    'em-revisao': projects.filter(p => p.status === 'em-revisao').length,
    pausado: projects.filter(p => p.status === 'pausado').length,
    concluido: projects.filter(p => p.status === 'concluido').length,
  };

  const status = [
    { label: 'Ativos', value: statusCounts.ativo, color: '#10B981' },
    { label: 'Em revisão', value: statusCounts['em-revisao'], color: '#6366F1' },
    { label: 'Pausados', value: statusCounts.pausado, color: '#94A3B8' },
    { label: 'Concluídos', value: statusCounts.concluido, color: '#059669' },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <TrendStat
        label="Acessos no mês"
        value="124"
        delta="+18%"
        series={series(0)}
        color={company.brandColor}
      />
      <TrendStat
        label="Protótipos publicados"
        value={prototypeCount}
        delta="+2"
        series={series(2)}
        color="#6366F1"
      />
      <div className="glass-card rounded-3xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400">
            Status dos projetos
          </p>
        </div>
        <Donut data={status} size={108} />
      </div>
      <div className="glass-card rounded-3xl p-5 md:col-span-3">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400">
            Atividade por mês
          </p>
          <span className="text-[10px] text-ink-400">últimos 6 meses</span>
        </div>
        <Bars data={monthly} color={company.brandColor} height={120} />
      </div>
    </section>
  );
}

/* ---------------- Projects ---------------- */

function ProjectsSection({
  title,
  hint,
  company,
  projects,
  onOpen,
  onSelectVersion,
  onAdd,
  hideViewAll,
}: {
  title: string;
  hint?: string;
  company: Company;
  projects: Project[];
  onOpen: (projectSlug: string, prototypeId: string) => void;
  onSelectVersion: (projectSlug: string, prototypeId: string) => void;
  onAdd: () => void;
  hideViewAll?: boolean;
}) {
  const totalProtos = projects.reduce(
    (s, p) => s + (p.prototypes?.length || 0),
    0
  );

  return (
    <section>
      <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#0B1020] flex items-center gap-2">
            {title}
            <span className="text-[11px] font-medium text-ink-500 bg-white/70 border border-white rounded-full px-2 py-0.5">
              {totalProtos}
            </span>
          </h2>
          {hint && <p className="text-xs text-ink-400 mt-1">{hint}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onAdd} className="btn-primary !py-2 !px-3 !text-xs">
            <Plus size={12} />
            Novo protótipo
          </button>
          {!hideViewAll && totalProtos > 2 && (
            <button
              onClick={() => window.open(`/${company.slug}?tab=prototypes`, '_self')}
              className="btn-ghost !py-2 !px-3 !text-xs"
            >
              Ver todos
              <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>

      {totalProtos === 0 ? (
        <EmptyProjects company={company} onAdd={onAdd} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.flatMap((project) => {
            if (!project.prototypes || project.prototypes.length === 0) return [];
            return [
              <PrototypeCard
                key={project.slug}
                project={project}
                brandColor={company.brandColor}
                onOpenDetails={(id) => onOpen(project.slug, id)}
                onSelectVersion={(id) => {
                  onSelectVersion(project.slug, id);
                }}
              />,
            ];
          })}
        </div>
      )}
    </section>
  );
}

function HandoffsSection({
  company,
  projects,
  onOpen,
}: {
  company: Company;
  projects: Project[];
  onOpen: (projectSlug: string, prototypeId: string) => void;
}) {
  const rows = projects.flatMap((p) =>
    (p.prototypes || []).map((proto) => ({ project: p, proto }))
  );

  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Handoffs</h2>
          <p className="text-xs text-ink-400 mt-1">
            Conteúdo estruturado pronto pra alimentar agentes e desenvolvedores.
          </p>
        </div>
        <span className="text-[11px] font-medium text-ink-500 bg-white/70 border border-white rounded-full px-2 py-0.5">
          {rows.length}
        </span>
      </div>

      {rows.length === 0 ? (
        <EmptyProjects company={company} onAdd={() => {}} />
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-400 border-b border-white/70">
            <div className="col-span-5">Protótipo</div>
            <div className="col-span-3">Projeto</div>
            <div className="col-span-2">Versão</div>
            <div className="col-span-2 text-right">Ação</div>
          </div>
          {rows.map(({ project, proto }) => (
            <div
              key={proto.id}
              className="grid grid-cols-12 items-center px-6 py-4 hover:bg-white/50 transition border-b border-white/50 last:border-0"
            >
              <div className="col-span-5 flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600">
                  <Layers size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{proto.name}</p>
                  <p className="text-[11px] text-ink-400 truncate inline-flex items-center gap-2">
                    {proto.notes || proto.source}
                    {proto.comments && proto.comments.length > 0 && (
                      <span className="inline-flex items-center gap-0.5">
                        <MessageSquare size={10} />
                        {proto.comments.length}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="col-span-3 text-sm text-ink-700 truncate">
                {project.name}
              </div>
              <div className="col-span-2">
                <StatusPill status={proto.version} brandColor={company.brandColor} />
              </div>
              <div className="col-span-2 flex justify-end gap-1.5">
                <button
                  onClick={() => onOpen(project.slug, proto.id)}
                  className="btn-ghost !py-1.5 !px-3 !text-xs"
                >
                  Detalhes
                </button>
                {proto.url && (
                  <a
                    href={proto.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary !py-1.5 !px-3 !text-xs"
                  >
                    Abrir <ArrowUpRight size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyProjects({
  company,
  onAdd,
}: {
  company: Company;
  onAdd: () => void;
}) {
  return (
    <div className="glass-card rounded-3xl p-12 flex flex-col items-center text-center">
      <div
        className="w-14 h-14 rounded-2xl bg-white border border-white flex items-center justify-center mb-4"
        style={{ color: company.brandColor }}
      >
        <FolderGit2 size={22} />
      </div>
      <h4 className="text-base font-semibold text-[#0B1020]">
        Nenhum protótipo cadastrado
      </h4>
      <p className="text-sm text-ink-400 max-w-sm mt-1">
        Adicione um protótipo manualmente colando o link do Figma e do build.
      </p>
      <button onClick={onAdd} className="btn-primary mt-5">
        <Sparkles size={14} />
        Adicionar primeiro protótipo
      </button>
    </div>
  );
}

function PlaceholderTab({ title }: { title: string }) {
  return (
    <div className="glass-card rounded-3xl p-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/80 border border-white text-ink-400 flex items-center justify-center mx-auto mb-4">
        <LayoutGrid size={22} />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-ink-400 mt-1">
        Em breve nesta tela. Continue acompanhando o hub.
      </p>
    </div>
  );
}
