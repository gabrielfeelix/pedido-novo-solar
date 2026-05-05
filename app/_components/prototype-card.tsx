'use client';

import {
  ArrowUpRight,
  ChevronDown,
  ExternalLink,
  Layers,
  Star,
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { FigmaIcon } from './figma-icon';
import type { Prototype, Project } from '../_lib/types';

export function PrototypeCard({
  project,
  brandColor,
  onOpenDetails,
  onSelectVersion,
}: {
  project: Project;
  brandColor: string;
  onOpenDetails: (prototypeId: string) => void;
  onSelectVersion: (prototypeId: string) => void;
}) {
  const protos = project.prototypes || [];
  const current =
    protos.find((p) => p.isCurrent) ||
    protos.find((p) => p.id === project.selectedPrototypeId) ||
    protos[0];

  const [versionMenuOpen, setVersionMenuOpen] = useState(false);

  if (!current) return null;

  const otherVersions = protos.filter((p) => p.id !== current.id);

  return (
    <article className="glass-card rounded-3xl overflow-hidden flex flex-col group">
      {/* Preview area */}
      <button
        type="button"
        onClick={() => onOpenDetails(current.id)}
        className="relative h-40 w-full overflow-hidden block"
        style={{
          background: `linear-gradient(135deg, ${brandColor}1a, ${brandColor}05)`,
        }}
      >
        {current.preview ? (
          <Image
            src={current.preview}
            alt={current.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <PreviewPlaceholder brandColor={brandColor} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="glass-pill rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0B1020] inline-flex items-center gap-1.5">
            <Star size={10} className="fill-amber-400 stroke-amber-500" />
            atual
          </span>
          <span className="glass-pill rounded-full px-2 py-0.5 text-[10px] font-mono text-ink-700">
            {current.version}
          </span>
        </div>
      </button>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <header className="flex items-start gap-3 justify-between mb-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-400 mb-1">
              {project.name}
            </p>
            <h3 className="text-lg font-semibold tracking-tight truncate">
              {current.name}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {current.figmaUrl && (
              <a
                href={current.figmaUrl}
                target="_blank"
                rel="noreferrer"
                title="Abrir no Figma"
                className="icon-btn !w-9 !h-9"
              >
                <FigmaIcon size={14} />
              </a>
            )}
          </div>
        </header>

        {current.notes && (
          <p className="text-xs text-ink-500 leading-relaxed line-clamp-2 mb-4">
            {current.notes}
          </p>
        )}

        {/* Versions row (if more than one) */}
        {otherVersions.length > 0 && (
          <div className="relative mb-4">
            <button
              type="button"
              onClick={() => setVersionMenuOpen((v) => !v)}
              className="w-full flex items-center justify-between text-xs glass-pill rounded-xl px-3 py-2.5 hover:bg-white/90 transition"
            >
              <span className="inline-flex items-center gap-2 text-ink-500">
                <Layers size={13} />
                <span className="font-medium text-[#0B1020]">{protos.length} versões</span>
                <span className="text-ink-400">· toque para trocar</span>
              </span>
              <ChevronDown
                size={13}
                className={`text-ink-400 transition ${versionMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {versionMenuOpen && (
              <div className="absolute z-20 top-[calc(100%+6px)] left-0 right-0 glass-strong rounded-xl overflow-hidden anim-popover-in">
                {protos.map((p) => {
                  const active = p.id === current.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectVersion(p.id);
                        setVersionMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 flex items-center gap-3 text-left transition border-b border-white/40 last:border-0 ${
                        active ? 'bg-white/80' : 'hover:bg-white/60'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          active ? 'bg-emerald-500' : 'bg-ink-200'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-[11px] text-ink-400">
                          {p.version} ·{' '}
                          <span className="font-mono">{p.slug}</span>
                        </p>
                      </div>
                      {active && (
                        <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                          atual
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <footer className="mt-auto flex flex-wrap items-center gap-2">
          {current.url ? (
            <a
              href={current.url}
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex-1 justify-center min-w-[140px]"
            >
              Acessar protótipo
              <ArrowUpRight size={13} />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="btn-primary flex-1 justify-center min-w-[140px]"
            >
              Sem link
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenDetails(current.id)}
            className="btn-ghost"
          >
            Detalhes
            <ExternalLink size={12} />
          </button>
        </footer>
      </div>
    </article>
  );
}

function PreviewPlaceholder({ brandColor }: { brandColor: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-50"
        style={{ background: brandColor }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-30"
        style={{ background: brandColor }}
      />
      <div className="relative w-14 h-14 rounded-2xl bg-white/80 border border-white flex items-center justify-center shadow-sm">
        <Layers size={22} style={{ color: brandColor }} />
      </div>
    </div>
  );
}
