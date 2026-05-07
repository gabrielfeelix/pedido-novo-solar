'use client';

import {
  ArrowUpRight,
  ExternalLink,
  Layers,
} from 'lucide-react';
import Image from 'next/image';
import { FigmaIcon } from './figma-icon';
import type { Project } from '../_lib/types';

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

  if (!current) return null;

  const otherVersions = protos.filter((p) => p.id !== current.id);

  return (
    <article className="glass-card rounded-3xl overflow-hidden flex flex-col group">
      {/* Large Preview Area - Main Focus */}
      <button
        type="button"
        onClick={() => onOpenDetails(current.id)}
        className="relative h-64 w-full overflow-hidden block flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${brandColor}1a, ${brandColor}05)`,
        }}
      >
        {current.preview ? (
          <Image
            src={current.preview}
            alt={current.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <PreviewPlaceholder brandColor={brandColor} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Top-left Info Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="glass-pill rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0B1020] inline-flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full" style={{ background: brandColor }} />
            {current.version}
          </span>
          {otherVersions.length > 0 && (
            <span className="glass-pill rounded-lg px-2.5 py-1.5 text-[10px] font-medium text-ink-600 inline-flex items-center gap-1 w-fit">
              <Layers size={12} />
              +{otherVersions.length}
            </span>
          )}
        </div>

        {/* Quick Action - Figma Link */}
        {current.figmaUrl && (
          <a
            href={current.figmaUrl}
            target="_blank"
            rel="noreferrer"
            title="Abrir no Figma"
            className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/90 hover:bg-white transition flex items-center justify-center shadow-sm"
          >
            <FigmaIcon size={16} />
          </a>
        )}
      </button>

      {/* Minimal Info Section */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-400 mb-1">
            {project.name}
          </p>
          <h3 className="text-base font-semibold tracking-tight line-clamp-2">
            {current.name}
          </h3>
        </div>

        {current.notes && (
          <p className="text-xs text-ink-500 leading-relaxed line-clamp-2">
            {current.notes}
          </p>
        )}

        {/* Version Navigator - Minimal */}
        {otherVersions.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {protos.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectVersion(p.id)}
                className={`text-[10px] font-medium px-2 py-1 rounded-lg transition ${
                  p.id === current.id
                    ? 'bg-white/80 text-[#0B1020]'
                    : 'bg-white/40 text-ink-600 hover:bg-white/60'
                }`}
                title={p.name}
              >
                {p.version}
              </button>
            ))}
            {protos.length > 3 && (
              <button
                onClick={() => onOpenDetails(current.id)}
                className="text-[10px] font-medium px-2 py-1 rounded-lg bg-white/40 text-ink-600 hover:bg-white/60 transition"
              >
                +{protos.length - 3}
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-2">
          {current.url ? (
            <a
              href={current.url}
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex-1 justify-center !py-2 !text-xs"
            >
              Acessar
              <ArrowUpRight size={12} />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="btn-primary flex-1 justify-center !py-2 !text-xs opacity-50"
            >
              Sem link
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenDetails(current.id)}
            className="btn-ghost !py-2 !px-3"
            title="Ver detalhes"
          >
            <ExternalLink size={12} />
          </button>
        </div>
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
