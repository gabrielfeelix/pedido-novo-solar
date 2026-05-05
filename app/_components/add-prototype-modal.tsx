'use client';

import { Image as ImageIcon, Link2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Modal } from './ui';
import { FigmaIcon } from './figma-icon';

export function AddPrototypeModal({
  open,
  onOpenChange,
  defaultProjectSlug,
  projects,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultProjectSlug?: string;
  projects: { slug: string; name: string }[];
  onSubmit: (data: {
    projectSlug: string;
    name: string;
    version: string;
    url: string;
    figmaUrl: string;
    preview: string;
    notes: string;
    setAsCurrent: boolean;
  }) => void;
}) {
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

  useEffect(() => {
    if (open) {
      setProjectSlug(defaultProjectSlug || projects[0]?.slug || '');
      setName('');
      setVersion('v1');
      setUrl('');
      setFigmaUrl('');
      setPreview('');
      setNotes('');
      setSetAsCurrent(true);
    }
  }, [open, defaultProjectSlug, projects]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectSlug || !name.trim()) return;
    onSubmit({
      projectSlug,
      name: name.trim(),
      version: version.trim() || 'v1',
      url: url.trim(),
      figmaUrl: figmaUrl.trim(),
      preview: preview.trim(),
      notes: notes.trim(),
      setAsCurrent,
    });
    onOpenChange(false);
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Novo protótipo"
      description="Adicione uma nova versão ou um protótipo independente. Você pode colar manualmente o link do Figma e do protótipo."
      size="lg"
    >
      <form onSubmit={submit} className="space-y-4">
        {projects.length > 1 && (
          <Field label="Projeto">
            <select
              value={projectSlug}
              onChange={(e) => setProjectSlug(e.target.value)}
              className="input-glass"
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

        <Field label="Link do protótipo" hint="URL pública (Vercel, S3, /p/...)">
          <div className="relative">
            <Link2
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-glass !pl-9"
              placeholder="https://..."
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
            placeholder="O que mudou nessa versão? Decisões de design, escopo..."
          />
        </Field>

        <label className="flex items-center gap-2 text-xs text-ink-500 cursor-pointer">
          <input
            type="checkbox"
            checked={setAsCurrent}
            onChange={(e) => setSetAsCurrent(e.target.checked)}
            className="accent-[#0B1020]"
          />
          Definir como versão atual
        </label>

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="btn-ghost"
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            <Plus size={13} />
            Adicionar protótipo
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
