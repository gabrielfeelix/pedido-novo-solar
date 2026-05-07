'use client';

import {
  ArrowUpRight,
  Check,
  Clipboard,
  Code2,
  ExternalLink,
  Layers,
  MessageSquare,
  Plus,
  Send,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Drawer, Tabs } from './ui';
import { FigmaIcon } from './figma-icon';
import { relativeTime } from '../_lib/storage';
import type { Comment, Project, Prototype } from '../_lib/types';

type Tab = 'preview' | 'versions' | 'comments' | 'handoff';

export function PrototypeDrawer({
  open,
  onOpenChange,
  project,
  brandColor,
  companySlug,
  prototypeId,
  onSelectVersion,
  onAddComment,
  onAddVersion,
  onRemoveVersion,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  project: Project | undefined;
  brandColor: string;
  companySlug: string;
  prototypeId: string | null;
  onSelectVersion: (id: string) => void;
  onAddComment: (prototypeId: string, text: string) => void;
  onAddVersion: () => void;
  onRemoveVersion: (id: string, name: string) => void;
}) {
  const [tab, setTab] = useState<Tab>('preview');
  const [comment, setComment] = useState('');
  const [copied, setCopied] = useState(false);

  const proto = useMemo(
    () => project?.prototypes?.find((p) => p.id === prototypeId),
    [project, prototypeId]
  );

  useEffect(() => {
    if (open) setTab('preview');
  }, [open, prototypeId]);

  if (!proto || !project) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerHeader title="Versão" onClose={() => onOpenChange(false)} />
        <div className="p-6 text-sm text-ink-500">Selecione uma versão.</div>
      </Drawer>
    );
  }

  const versions = project.prototypes || [];
  const comments = proto.comments || [];

  function copyHandoff() {
    const handoffText = buildHandoff(proto!, project!, companySlug);
    navigator.clipboard.writeText(handoffText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} width={620}>
      <DrawerHeader title={proto.name} onClose={() => onOpenChange(false)} />

      {/* Hero */}
      <div className="relative">
        <div
          className="h-44 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${brandColor}26, ${brandColor}08)`,
          }}
        >
          {proto.preview ? (
            <Image
              src={proto.preview}
              alt={proto.name}
              fill
              className="object-cover"
              sizes="600px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="absolute -top-10 -right-10 w-56 h-56 rounded-full blur-3xl opacity-50"
                style={{ background: brandColor }}
              />
              <div
                className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-3xl opacity-30"
                style={{ background: brandColor }}
              />
              <div className="relative w-16 h-16 rounded-2xl bg-white/85 border border-white flex items-center justify-center shadow">
                <Layers size={26} style={{ color: brandColor }} />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
        </div>

        {/* Meta row */}
        <div className="px-6 py-4 border-b border-white/60 flex flex-wrap items-center gap-3 justify-between">
          <div className="min-w-0">
            <p className="text-[11px] text-ink-400 mb-1">
              {project.name} ·{' '}
              <span className="font-mono">{proto.source}</span>
            </p>
            <div className="flex items-center gap-2">
              <Star size={13} className="fill-amber-400 stroke-amber-500" />
              <span className="text-xs font-semibold text-[#0B1020]">
                Versão atual
              </span>
              <span className="kbd">{proto.version}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {proto.figmaUrl && (
              <a
                href={proto.figmaUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <FigmaIcon size={13} /> Figma
              </a>
            )}
            {proto.url && (
              <a
                href={proto.url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Acessar
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 pb-3 border-b border-white/60">
        <Tabs<Tab>
          value={tab}
          onChange={setTab}
          items={[
            { id: 'preview', label: 'Visão geral' },
            { id: 'versions', label: 'Versões', count: versions.length },
            { id: 'comments', label: 'Comentários', count: comments.length },
            { id: 'handoff', label: 'Handoff' },
          ]}
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-5">
        {tab === 'preview' && (
          <PreviewTab
            url={proto.url}
            notes={proto.notes}
            createdAt={proto.createdAt}
          />
        )}

        {tab === 'versions' && (
          <VersionsTab
            project={project}
            currentId={proto.id}
            onSelect={onSelectVersion}
            onAdd={onAddVersion}
            onRemove={(id, name) => onRemoveVersion(id, name)}
          />
        )}

        {tab === 'comments' && (
          <CommentsTab
            comments={comments}
            value={comment}
            onChange={setComment}
            onSubmit={() => {
              if (!comment.trim()) return;
              onAddComment(proto.id, comment.trim());
              setComment('');
            }}
          />
        )}

        {tab === 'handoff' && (
          <HandoffTab
            proto={proto}
            project={project}
            companySlug={companySlug}
            copied={copied}
            onCopy={copyHandoff}
          />
        )}
      </div>
    </Drawer>
  );
}

function DrawerHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/60">
      <div className="flex items-center gap-2 min-w-0">
        <span className="dot bg-emerald-500" />
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-500">
          Versão
        </h2>
        <span className="text-ink-300">/</span>
        <p className="text-sm font-semibold truncate">{title}</p>
      </div>
      <Dialog.Close
        onClick={onClose}
        className="icon-btn !w-9 !h-9"
        aria-label="Fechar"
      >
        <X size={14} />
      </Dialog.Close>
    </div>
  );
}

function PreviewTab({
  url,
  notes,
  createdAt,
}: {
  url?: string;
  notes?: string;
  createdAt?: string;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white/60 border border-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-400 mb-1">
          Notas
        </p>
        <p className="text-sm leading-relaxed text-[#0B1020]">
          {notes || 'Sem notas para esta versão.'}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Info label="Criada em" value={createdAt ? new Date(createdAt).toLocaleDateString('pt-BR') : '—'} />
        <Info label="Status" value="Em revisão" tone="emerald" />
      </div>
      {url && (
        <div className="rounded-2xl overflow-hidden border border-white/60 bg-white">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/60 bg-white/80">
            <p className="text-[11px] text-ink-400 truncate">{url}</p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-medium text-[#0B1020] inline-flex items-center gap-1"
            >
              Abrir <ExternalLink size={11} />
            </a>
          </div>
          <iframe
            src={url}
            title="Preview da versão"
            className="w-full h-[420px] bg-white"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}
    </div>
  );
}

function VersionsTab({
  project,
  currentId,
  onSelect,
  onAdd,
  onRemove,
}: {
  project: Project;
  currentId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string, name: string) => void;
}) {
  const versions = project.prototypes || [];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Histórico de versões</p>
        <button onClick={onAdd} className="btn-primary !py-2 !px-3 !text-xs">
          <Plus size={12} />
          Adicionar versão
        </button>
      </div>
      <div className="space-y-2">
        {versions.map((v) => {
          const active = v.id === currentId;
          return (
            <div
              key={v.id}
              className={`rounded-2xl p-4 flex items-center gap-3 transition border ${
                active
                  ? 'bg-white border-white'
                  : 'bg-white/50 border-white/60 hover:bg-white/80'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Layers size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate">{v.name}</p>
                  <span className="kbd">{v.version}</span>
                  {active && (
                    <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                      atual
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-ink-400">
                  {v.createdAt
                    ? new Date(v.createdAt).toLocaleDateString('pt-BR')
                    : '—'}{' '}
                  · {v.notes || v.source}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {!active && (
                  <button
                    onClick={() => onSelect(v.id)}
                    className="text-[11px] font-medium text-[#0B1020] hover:underline"
                  >
                    Definir como atual
                  </button>
                )}
                {v.url && (
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noreferrer"
                    className="icon-btn !w-8 !h-8"
                    title="Abrir versão"
                  >
                    <ArrowUpRight size={12} />
                  </a>
                )}
                {!active && versions.length > 1 && (
                  <button
                    onClick={() => onRemove(v.id, v.name)}
                    className="icon-btn !w-8 !h-8 hover:!text-rose-500"
                    title="Remover"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CommentsTab({
  comments,
  value,
  onChange,
  onSubmit,
}: {
  comments: Comment[];
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white/40 p-6 text-center">
            <MessageSquare size={18} className="mx-auto text-ink-400" />
            <p className="text-sm font-medium mt-2">Sem comentários ainda</p>
            <p className="text-xs text-ink-400 mt-0.5">
              Use este espaço para registrar feedbacks e revisões.
            </p>
          </div>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl bg-white/60 border border-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">{c.author}</p>
                <p className="text-[11px] text-ink-400">{relativeTime(c.at)}</p>
              </div>
              <p className="text-sm text-[#0B1020] mt-1.5 leading-relaxed whitespace-pre-wrap">
                {c.text}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="rounded-2xl border border-white/80 bg-white/70 p-3">
        <textarea
          rows={3}
          placeholder="Escreva um comentário..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-glass !bg-transparent !border-0 !shadow-none focus:!ring-0 !p-1"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-[11px] text-ink-400">Markdown não suportado por enquanto.</p>
          <button
            onClick={onSubmit}
            disabled={!value.trim()}
            className="btn-primary !py-2 !px-3 !text-xs"
          >
            <Send size={11} />
            Comentar
          </button>
        </div>
      </div>
    </div>
  );
}

function HandoffTab({
  proto,
  project,
  companySlug,
  copied,
  onCopy,
}: {
  proto: Prototype;
  project: Project;
  companySlug: string;
  copied: boolean;
  onCopy: () => void;
}) {
  const text = buildHandoff(proto, project, companySlug);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/80 bg-white/60 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Code2 size={14} className="text-indigo-600" />
          <p className="text-sm font-semibold">Handoff estruturado</p>
        </div>
        <p className="text-xs text-ink-500 leading-relaxed">
          Texto pronto pra colar no agente de dev. Inclui empresa, projeto,
          versão atual, link do Figma e link da versão. Conforme você
          comenta e adiciona versões, o conteúdo é atualizado automaticamente.
        </p>
      </div>

      <div className="rounded-2xl bg-[#0B1020] text-white p-4 relative">
        <button
          onClick={onCopy}
          className="absolute top-3 right-3 text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
        >
          {copied ? (
            <>
              <Check size={11} /> Copiado
            </>
          ) : (
            <>
              <Clipboard size={11} /> Copiar
            </>
          )}
        </button>
        <pre className="text-[11.5px] leading-relaxed font-mono whitespace-pre-wrap">
          {text}
        </pre>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Info label="Empresa" value={companySlug.toUpperCase()} />
        <Info label="Projeto" value={project.name} />
        <Info label="Versão atual" value={`${proto.name} · ${proto.version}`} />
        <Info label="Source" value={proto.source} />
      </div>
    </div>
  );
}

function buildHandoff(proto: Prototype, project: Project, companySlug: string) {
  return [
    `# Handoff — ${project.name}`,
    ``,
    `Empresa: ${companySlug}`,
    `Projeto: ${project.name}`,
    `Versão atual: ${proto.name} (${proto.version})`,
    `Source: ${proto.source}`,
    proto.url ? `Versão: ${proto.url}` : '',
    proto.figmaUrl ? `Figma: ${proto.figmaUrl}` : '',
    ``,
    `## Notas`,
    proto.notes || '—',
    ``,
    `## Comentários`,
    ...((proto.comments || []) as Comment[]).map(
      (c) => `- [${c.author}] ${c.text}`
    ),
  ]
    .filter(Boolean)
    .join('\n');
}

function Info({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'emerald';
}) {
  return (
    <div className="rounded-2xl bg-white/60 border border-white p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-400">
        {label}
      </p>
      <p
        className={`text-sm font-semibold mt-1 truncate ${
          tone === 'emerald' ? 'text-emerald-600' : 'text-[#0B1020]'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
