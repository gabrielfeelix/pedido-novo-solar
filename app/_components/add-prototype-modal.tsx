'use client';

import { Image as ImageIcon, Link2, Plus, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Modal } from './ui';
import { FigmaIcon } from './figma-icon';
import type { Prototype } from '../_lib/types';

export type PrototypeFormData = {
  projectSlug: string;
  name: string;
  version: string;
  url: string;
  figmaUrl: string;
  preview: string;
  notes: string;
  setAsCurrent: boolean;
  scaffold: boolean;
};

export function AddPrototypeModal({
  open,
  onOpenChange,
  defaultProjectSlug,
  projects,
  editing,
  companyName,
  brandColor,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultProjectSlug?: string;
  projects: { slug: string; name: string }[];
  editing?: { prototype: Prototype; projectSlug: string } | null;
  companyName?: string;
  brandColor?: string;
  onSubmit: (data: PrototypeFormData) => Promise<void> | void;
}) {
  const isEdit = !!editing;
  const [projectSlug, setProjectSlug] = useState(
    defaultProjectSlug || projects[0]?.slug || ''
  );
  const [name, setName] = useState('');
  const [version, setVersion] = useState('v1');
  const [url, setUrl] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [notes, setNotes] = useState('');
  const [setAsCurrent, setSetAsCurrent] = useState(true);
  const [scaffold, setScaffold] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setProjectSlug(editing.projectSlug);
      setName(editing.prototype.name);
      setVersion(editing.prototype.version);
      setUrl(editing.prototype.url || '');
      setFigmaUrl(editing.prototype.figmaUrl || '');
      setPreview(editing.prototype.preview || '');
      setNotes(editing.prototype.notes || '');
      setSetAsCurrent(!!editing.prototype.isCurrent);
      setScaffold(false);
    } else {
      setProjectSlug(defaultProjectSlug || projects[0]?.slug || '');
      setName('');
      setVersion('v1');
      setUrl('');
      setFigmaUrl('');
      setPreview('');
      setNotes('');
      setSetAsCurrent(true);
      setScaffold(true);
    }
    setFeedback(null);
  }, [open, editing, defaultProjectSlug, projects]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectSlug || !name.trim()) return;
    setBusy(true);
    setFeedback(null);

    let finalUrl = url.trim();

    // Scaffold real folder /public/p/{slug} when adding (dev only)
    if (!isEdit && scaffold && !finalUrl) {
      const slug = `${projectSlug}-${version}`
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 60);
      try {
        const r = await fetch('/api/prototypes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug,
            companyName,
            prototypeName: name.trim(),
            brandColor,
            notes: notes.trim(),
          }),
        });
        const j = await r.json();
        if (j?.ok) {
          finalUrl = j.path;
          setFeedback(j.reused ? 'Pasta já existia — reutilizando.' : `Pasta criada em /public${j.path}`);
        } else {
          setFeedback(j?.error || 'Não foi possível criar a pasta.');
        }
      } catch (err: unknown) {
        setFeedback(err instanceof Error ? err.message : 'Falha de rede ao criar pasta.');
      }
    }

    await onSubmit({
      projectSlug,
      name: name.trim(),
      version: version.trim() || 'v1',
      url: finalUrl,
      figmaUrl: figmaUrl.trim(),
      preview: preview.trim(),
      notes: notes.trim(),
      setAsCurrent,
      scaffold,
    });
    setBusy(false);
    onOpenChange(false);
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Editar protótipo' : 'Novo protótipo'}
      description={
        isEdit
          ? 'Atualize nome, links e notas. Mudanças ficam salvas localmente.'
          : 'Crie um protótipo novo. Você pode deixar o sistema scaffoldar a pasta dentro de /public/p/, ou colar manualmente o link.'
      }
      size="lg"
    >
      <form onSubmit={submit} className="space-y-4">
        {projects.length > 1 && (
          <Field label="Projeto">
            <select
              value={projectSlug}
              onChange={(e) => setProjectSlug(e.target.value)}
              className="input-glass"
              disabled={isEdit}
            >
              {projects.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Field label="Nome">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-glass"
                placeholder="Ex.: Home gamer V3"
              />
            </Field>
          </div>
          <Field label="Versão">
            <input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="input-glass"
              placeholder="v3"
            />
          </Field>
        </div>

        <Field
          label="Link do protótipo"
          hint={
            !isEdit && scaffold
              ? 'opcional — gerado automaticamente'
              : 'URL pública (Vercel, S3, /p/...)'
          }
        >
          <div className="relative">
            <Link2
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-glass !pl-9"
              placeholder={
                !isEdit && scaffold
                  ? 'deixe em branco pra gerar /p/...'
                  : 'https://...'
              }
            />
          </div>
        </Field>

        <Field label="Link do Figma">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <FigmaIcon size={12} />
            </span>
            <input
              value={figmaUrl}
              onChange={(e) => setFigmaUrl(e.target.value)}
              className="input-glass !pl-9"
              placeholder="https://www.figma.com/design/..."
            />
          </div>
        </Field>

        <Field label="Imagem de preview" hint="URL de imagem (opcional)">
          <div className="relative">
            <ImageIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
              className="input-glass !pl-9"
              placeholder="https://.../preview.png"
            />
          </div>
        </Field>

        <Field label="Notas">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-glass"
            rows={3}
            placeholder="O que mudou nessa versão?"
          />
        </Field>

        <div className="flex flex-col gap-2 pt-1">
          {!isEdit && (
            <label className="flex items-center gap-2 text-xs text-ink-700 cursor-pointer">
              <input
                type="checkbox"
                checked={scaffold}
                onChange={(e) => setScaffold(e.target.checked)}
                className="accent-[#0B1020]"
              />
              Criar pasta automaticamente em <code className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">/public/p/&lt;slug&gt;</code>
            </label>
          )}
          <label className="flex items-center gap-2 text-xs text-ink-700 cursor-pointer">
            <input
              type="checkbox"
              checked={setAsCurrent}
              onChange={(e) => setSetAsCurrent(e.target.checked)}
              className="accent-[#0B1020]"
            />
            Definir como versão atual
          </label>
        </div>

        {feedback && (
          <div className="text-[11px] text-ink-500 bg-white/70 border border-white rounded-xl px-3 py-2">
            {feedback}
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="btn-ghost"
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={busy}>
            {isEdit ? <Save size={13} /> : <Plus size={13} />}
            {busy
              ? 'Salvando...'
              : isEdit
                ? 'Salvar alterações'
                : 'Adicionar protótipo'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400">
          {label}
        </label>
        {hint && <span className="text-[10px] text-ink-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
