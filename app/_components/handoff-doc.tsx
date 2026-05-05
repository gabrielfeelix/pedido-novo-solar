'use client';

import {
  Accessibility,
  Boxes,
  Check,
  CheckCircle2,
  Clipboard,
  Code2,
  ExternalLink,
  FileText,
  GitBranch,
  Layers,
  MessageSquare,
  Save,
  Sparkles,
  Target,
  Type,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { statusColor } from '../_lib/storage';
import type { Handoff, HandoffStatus, Project, Prototype } from '../_lib/types';
import { FigmaIcon } from './figma-icon';

const SECTIONS: {
  key: keyof Pick<
    Handoff,
    'goal' | 'decisions' | 'components' | 'states' | 'copy' | 'accessibility' | 'resources'
  >;
  label: string;
  hint: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  placeholder: string;
}[] = [
  {
    key: 'goal',
    label: 'Objetivo & contexto',
    hint: 'O que essa tela resolve, pra quem, qual é a métrica.',
    icon: Target,
    placeholder: 'Ex.: Reduzir abandono no checkout em 12%, foco no primeiro acesso...',
  },
  {
    key: 'decisions',
    label: 'Decisões de design',
    hint: 'Por que o desenho ficou assim. Trade-offs aceitos.',
    icon: Sparkles,
    placeholder: '• Adotamos botão pill preto pra reforçar a hierarquia primária.\n• Removemos o stepper porque...',
  },
  {
    key: 'components',
    label: 'Componentes & padrões',
    hint: 'Lista de componentes usados, novos ou existentes.',
    icon: Boxes,
    placeholder: '• Button (primary, ghost)\n• Card.glass (novo)\n• Input.search\n• Avatar.gradient',
  },
  {
    key: 'states',
    label: 'Estados & breakpoints',
    hint: 'Loading, vazio, erro, hover, mobile.',
    icon: Layers,
    placeholder: '• Loading: skeleton + sparkline animado\n• Vazio: ilustração + CTA\n• Mobile (≤640): stack...',
  },
  {
    key: 'copy',
    label: 'Copy & microcopy',
    hint: 'Texto final aprovado por marketing/conteúdo.',
    icon: Type,
    placeholder: 'Header: "Selecione uma empresa pra acessar o workspace."\nBotão: "Acessar protótipo"',
  },
  {
    key: 'accessibility',
    label: 'Acessibilidade',
    hint: 'Contraste, ordem de tab, aria-labels.',
    icon: Accessibility,
    placeholder: '• Todos botões têm aria-label\n• Foco visível com ring 2px\n• Contraste AA mínimo 4.5:1',
  },
  {
    key: 'resources',
    label: 'Recursos & links',
    hint: 'Outros arquivos: planilhas, doc de produto, vídeos.',
    icon: FileText,
    placeholder: '• Planilha: notion.so/...\n• Vídeo do user testing: ...',
  },
];

const STATUSES: { id: HandoffStatus; label: string }[] = [
  { id: 'rascunho', label: 'Rascunho' },
  { id: 'pronto', label: 'Pronto pra dev' },
  { id: 'em-dev', label: 'Em desenvolvimento' },
  { id: 'entregue', label: 'Entregue' },
];

export function HandoffDoc({
  proto,
  project,
  companySlug,
  companyName,
  brandColor,
  handoff,
  onSave,
}: {
  proto: Prototype;
  project: Project;
  companySlug: string;
  companyName: string;
  brandColor: string;
  handoff: Handoff | undefined;
  onSave: (patch: Partial<Handoff>) => void;
}) {
  const [draft, setDraft] = useState<Partial<Handoff>>({});
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Hydrate draft when prototype/handoff changes
  useEffect(() => {
    setDraft({
      goal: handoff?.goal ?? '',
      decisions: handoff?.decisions ?? '',
      components: handoff?.components ?? '',
      states: handoff?.states ?? '',
      copy: handoff?.copy ?? '',
      accessibility: handoff?.accessibility ?? '',
      resources: handoff?.resources ?? '',
      repoUrl: handoff?.repoUrl ?? '',
      status: handoff?.status ?? 'rascunho',
    });
    setDirty(false);
  }, [proto.id, handoff]);

  const status = (draft.status ?? 'rascunho') as HandoffStatus;
  const tone = statusColor(status);

  const completion = useMemo(() => {
    const fields = SECTIONS.map((s) => (draft[s.key] || '').toString().trim());
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / SECTIONS.length) * 100);
  }, [draft]);

  function setField<K extends keyof Handoff>(key: K, value: Handoff[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  }

  function save() {
    onSave(draft);
    setDirty(false);
    setSavedAt(Date.now());
  }

  function copyForAgent() {
    const md = buildMarkdown({ proto, project, companySlug, companyName, draft });
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-5">
      {/* Status + progress */}
      <div className="rounded-2xl bg-white/60 border border-white p-4 flex flex-wrap items-center gap-3 justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400">
            Status do handoff
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            {STATUSES.map((s) => {
              const active = s.id === status;
              const c = statusColor(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setField('status', s.id)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition ${
                    active
                      ? 'border-transparent shadow-[0_4px_10px_-4px_rgba(15,23,42,0.2)]'
                      : 'bg-white border-white text-ink-500 hover:border-ink-200'
                  }`}
                  style={
                    active
                      ? { background: c.bg, color: c.fg }
                      : undefined
                  }
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2 text-[11px] text-ink-500">
            <span className="font-semibold">{completion}%</span> completo
          </div>
          <div className="w-40 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${completion}%`,
                background: `linear-gradient(90deg, ${brandColor}, ${tone.fg})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <LinkPill
          icon={<FigmaIcon size={12} />}
          label="Figma"
          value={proto.figmaUrl || project.figmaUrl}
          empty="Sem link"
        />
        <LinkPill
          icon={<ExternalLink size={12} />}
          label="Protótipo"
          value={proto.url}
          empty="Sem link"
        />
        <LinkPill
          icon={<GitBranch size={12} />}
          label="Repositório"
          value={draft.repoUrl}
          empty="Adicionar abaixo"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400 mb-1.5 block">
          Link do repositório / PR
        </label>
        <input
          value={draft.repoUrl || ''}
          onChange={(e) => setField('repoUrl', e.target.value)}
          className="input-glass"
          placeholder="https://github.com/.../pull/123"
        />
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const value = (draft[s.key] || '') as string;
          const filled = value.trim().length > 0;
          return (
            <div
              key={s.key}
              className="rounded-2xl bg-white/60 border border-white overflow-hidden"
            >
              <div className="px-4 py-3 flex items-center gap-2 border-b border-white/70">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    filled
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-slate-100 text-ink-400'
                  }`}
                >
                  {filled ? <CheckCircle2 size={14} /> : <Icon size={13} />}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{s.label}</p>
                  <p className="text-[11px] text-ink-400">{s.hint}</p>
                </div>
              </div>
              <textarea
                value={value}
                onChange={(e) => setField(s.key, e.target.value)}
                placeholder={s.placeholder}
                rows={3}
                className="input-glass !rounded-none !border-0 !shadow-none focus:!ring-0 !bg-transparent"
              />
            </div>
          );
        })}
      </div>

      {/* AI handoff snippet */}
      <div className="rounded-2xl bg-[#0B1020] text-white p-4 relative">
        <div className="flex items-center gap-2 mb-2">
          <Code2 size={14} className="text-indigo-300" />
          <p className="text-sm font-semibold">Resumo pra agente</p>
        </div>
        <p className="text-xs text-white/70 leading-relaxed mb-3">
          Tudo o que está acima, formatado em Markdown, pronto pra colar no agente de dev.
        </p>
        <button
          onClick={copyForAgent}
          className="absolute top-3 right-3 text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
        >
          {copied ? (
            <>
              <Check size={11} /> Copiado
            </>
          ) : (
            <>
              <Clipboard size={11} /> Copiar markdown
            </>
          )}
        </button>
      </div>

      {/* Save bar */}
      <div className="sticky bottom-2 z-10">
        <div className="rounded-2xl glass-strong px-4 py-3 flex items-center justify-between">
          <div className="text-[11px] text-ink-500 flex items-center gap-2">
            {dirty ? (
              <>
                <span className="dot bg-amber-500" />
                Alterações não salvas
              </>
            ) : savedAt ? (
              <>
                <span className="dot bg-emerald-500" />
                Salvo {new Date(savedAt).toLocaleTimeString('pt-BR')}
              </>
            ) : (
              <>
                <MessageSquare size={11} />
                Edite e salve quando estiver pronto
              </>
            )}
          </div>
          <button
            onClick={save}
            disabled={!dirty}
            className="btn-primary !py-2 !px-3 !text-xs"
          >
            <Save size={12} />
            Salvar handoff
          </button>
        </div>
      </div>
    </div>
  );
}

function LinkPill({
  icon,
  label,
  value,
  empty,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  empty: string;
}) {
  if (!value) {
    return (
      <div className="rounded-2xl bg-white/40 border border-dashed border-ink-200 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-400 inline-flex items-center gap-1.5">
          {icon}
          {label}
        </p>
        <p className="text-xs text-ink-400 mt-1">{empty}</p>
      </div>
    );
  }
  return (
    <a
      href={value}
      target="_blank"
      rel="noreferrer"
      className="rounded-2xl bg-white/70 border border-white px-3 py-2.5 hover:bg-white transition block"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-400 inline-flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className="text-xs text-[#0B1020] truncate mt-1">{value}</p>
    </a>
  );
}

function buildMarkdown({
  proto,
  project,
  companySlug,
  companyName,
  draft,
}: {
  proto: Prototype;
  project: Project;
  companySlug: string;
  companyName: string;
  draft: Partial<Handoff>;
}) {
  const lines = [
    `# Handoff — ${proto.name}`,
    ``,
    `Empresa: ${companyName} (${companySlug})`,
    `Projeto: ${project.name}`,
    `Versão: ${proto.version}`,
    proto.url ? `Protótipo: ${proto.url}` : '',
    proto.figmaUrl ? `Figma: ${proto.figmaUrl}` : '',
    draft.repoUrl ? `Repo/PR: ${draft.repoUrl}` : '',
    `Status: ${draft.status ?? 'rascunho'}`,
    ``,
    ...SECTIONS.flatMap((s) => {
      const v = (draft[s.key] || '').toString().trim();
      if (!v) return [];
      return [`## ${s.label}`, v, ``];
    }),
    proto.comments && proto.comments.length > 0
      ? `## Comentários\n${proto.comments
          .map((c) => `- [${c.author}] ${c.text}`)
          .join('\n')}`
      : '',
  ];
  return lines.filter(Boolean).join('\n');
}
