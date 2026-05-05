'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import seedJson from '@/workspace.json';
import type { Activity, Comment, Company, Prototype, Workspace } from './types';

const STORAGE_KEY = 'ux-hub:state.v1';

type Patch = {
  /** prototypes added or replaced by id */
  prototypes: Record<string, Prototype & { companySlug: string; projectSlug: string }>;
  /** prototype ids marked deleted */
  removedPrototypeIds: string[];
  /** project.selectedPrototypeId overrides */
  selectedByProject: Record<string, string>; // key = company.slug + ':' + project.slug
  /** comments grouped by prototype id */
  comments: Record<string, Comment[]>;
  /** activity log */
  activity: Activity[];
};

const emptyPatch: Patch = {
  prototypes: {},
  removedPrototypeIds: [],
  selectedByProject: {},
  comments: {},
  activity: [],
};

function loadPatch(): Patch {
  if (typeof window === 'undefined') return emptyPatch;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyPatch;
    const parsed = JSON.parse(raw) as Partial<Patch>;
    return {
      prototypes: parsed.prototypes ?? {},
      removedPrototypeIds: parsed.removedPrototypeIds ?? [],
      selectedByProject: parsed.selectedByProject ?? {},
      comments: parsed.comments ?? {},
      activity: parsed.activity ?? [],
    };
  } catch {
    return emptyPatch;
  }
}

function savePatch(patch: Patch) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(patch));
  } catch {
    /* noop */
  }
}

function mergeWorkspace(seed: Workspace, patch: Patch): Workspace {
  const removed = new Set(patch.removedPrototypeIds);

  return {
    ...seed,
    companies: seed.companies.map((c) => ({
      ...c,
      projects: (c.projects || []).map((p) => {
        const projectKey = `${c.slug}:${p.slug}`;
        const seedProtos = (p.prototypes || [])
          .filter((pr) => !removed.has(pr.id))
          .map((pr) => ({
            ...pr,
            comments: patch.comments[pr.id] ?? pr.comments ?? [],
          }));

        const userProtos = Object.values(patch.prototypes)
          .filter(
            (pr) =>
              pr.companySlug === c.slug &&
              pr.projectSlug === p.slug &&
              !removed.has(pr.id)
          )
          .map(({ companySlug: _cs, projectSlug: _ps, ...rest }) => ({
            ...rest,
            comments: patch.comments[rest.id] ?? rest.comments ?? [],
          }));

        const allProtos = [...seedProtos, ...userProtos];

        const overrideId = patch.selectedByProject[projectKey];
        const protosWithCurrent = allProtos.map((pr) => ({
          ...pr,
          isCurrent: overrideId
            ? pr.id === overrideId
            : pr.isCurrent,
        }));

        return {
          ...p,
          selectedPrototypeId:
            overrideId ?? p.selectedPrototypeId,
          prototypes: protosWithCurrent,
        };
      }),
    })),
  };
}

export function useWorkspace() {
  const seed = seedJson as unknown as Workspace;
  const [patch, setPatch] = useState<Patch>(emptyPatch);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPatch(loadPatch());
    setHydrated(true);
  }, []);

  const update = useCallback((next: Patch | ((prev: Patch) => Patch)) => {
    setPatch((prev) => {
      const computed =
        typeof next === 'function' ? (next as (p: Patch) => Patch)(prev) : next;
      savePatch(computed);
      return computed;
    });
  }, []);

  const workspace = useMemo(() => mergeWorkspace(seed, patch), [seed, patch]);

  const logActivity = useCallback(
    (a: Omit<Activity, 'id' | 'at'> & Partial<Pick<Activity, 'at' | 'id'>>) => {
      update((prev) => ({
        ...prev,
        activity: [
          {
            id: a.id ?? crypto.randomUUID(),
            at: a.at ?? new Date().toISOString(),
            ...a,
          },
          ...prev.activity,
        ].slice(0, 60),
      }));
    },
    [update]
  );

  const addPrototype = useCallback(
    (
      companySlug: string,
      projectSlug: string,
      input: Omit<Prototype, 'id' | 'createdAt'> & { id?: string }
    ) => {
      const id = input.id ?? `proto-${Date.now().toString(36)}`;
      const proto: Prototype & { companySlug: string; projectSlug: string } = {
        ...input,
        id,
        createdAt: new Date().toISOString(),
        companySlug,
        projectSlug,
      };
      update((prev) => ({
        ...prev,
        prototypes: { ...prev.prototypes, [id]: proto },
      }));
      logActivity({
        kind: 'prototype.created',
        companySlug,
        projectSlug,
        prototypeId: id,
        message: `Você criou o protótipo "${proto.name}" (${proto.version})`,
      });
      return id;
    },
    [update, logActivity]
  );

  const setCurrentPrototype = useCallback(
    (companySlug: string, projectSlug: string, prototypeId: string) => {
      const key = `${companySlug}:${projectSlug}`;
      update((prev) => ({
        ...prev,
        selectedByProject: {
          ...prev.selectedByProject,
          [key]: prototypeId,
        },
      }));
      logActivity({
        kind: 'prototype.updated',
        companySlug,
        projectSlug,
        prototypeId,
        message: `Versão definida como atual neste projeto.`,
      });
    },
    [update, logActivity]
  );

  const removePrototype = useCallback(
    (companySlug: string, projectSlug: string, prototypeId: string, name: string) => {
      update((prev) => ({
        ...prev,
        removedPrototypeIds: Array.from(
          new Set([...prev.removedPrototypeIds, prototypeId])
        ),
      }));
      logActivity({
        kind: 'prototype.updated',
        companySlug,
        projectSlug,
        prototypeId,
        message: `Versão "${name}" removida.`,
      });
    },
    [update, logActivity]
  );

  const addComment = useCallback(
    (
      companySlug: string,
      projectSlug: string,
      prototypeId: string,
      text: string,
      author = 'Você'
    ) => {
      const c: Comment = {
        id: `c-${Date.now().toString(36)}`,
        author,
        text,
        at: new Date().toISOString(),
      };
      update((prev) => ({
        ...prev,
        comments: {
          ...prev.comments,
          [prototypeId]: [...(prev.comments[prototypeId] || []), c],
        },
      }));
      logActivity({
        kind: 'comment.added',
        companySlug,
        projectSlug,
        prototypeId,
        message: `Comentário adicionado.`,
      });
      return c;
    },
    [update, logActivity]
  );

  return {
    workspace,
    activity: patch.activity,
    hydrated,
    addPrototype,
    setCurrentPrototype,
    removePrototype,
    addComment,
    logActivity,
  };
}

/* ------------ Helpers (pure) ------------ */

export function findCompany(ws: Workspace, slug: string): Company | undefined {
  return ws.companies.find((c) => c.slug === slug);
}

export function totalProjects(ws: Workspace) {
  return ws.companies.reduce((s, c) => s + (c.projects?.length || 0), 0);
}

export function totalPrototypes(ws: Workspace) {
  return ws.companies.reduce(
    (s, c) =>
      s +
      (c.projects || []).reduce(
        (ss, p) => ss + (p.prototypes?.length || 0),
        0
      ),
    0
  );
}

export function relativeTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `há ${d}d`;
  const w = Math.floor(d / 7);
  if (w < 5) return `há ${w} sem`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `há ${mo} mês${mo > 1 ? 'es' : ''}`;
  return date.toLocaleDateString('pt-BR');
}
