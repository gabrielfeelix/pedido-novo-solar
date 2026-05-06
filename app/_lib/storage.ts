'use client';

// workspace-seed-v3
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addActivity as addActivityDB } from './supabase-db';
import type {
  Activity,
  Comment,
  Company,
  Handoff,
  HandoffStatus,
  PatchedPrototype,
  Prototype,
  Ticket,
  TicketTopic,
  Workspace,
} from './types';

const STORAGE_KEY = 'ux-hub:state.v3';
const LEGACY_STORAGE_KEYS = ['ux-hub:state.v2'];

let cachedSeed: Workspace | null = null;

async function loadSeed(): Promise<Workspace> {
  if (cachedSeed) return cachedSeed;
  const res = await fetch('/workspace.json');
  if (!res.ok) throw new Error('Failed to load workspace.json');
  const data = await res.json() as Workspace;
  cachedSeed = data;
  return data;
}

type Patch = {
  prototypes: Record<string, PatchedPrototype>;
  /** Patches applied on top of seed prototypes, keyed by id */
  edits: Record<string, Partial<Prototype>>;
  removedPrototypeIds: string[];
  selectedByProject: Record<string, string>;
  comments: Record<string, Comment[]>;
  activity: Activity[];
  handoffs: Record<string, Handoff>;
  tickets: Ticket[];
};

const emptyPatch: Patch = {
  prototypes: {},
  edits: {},
  removedPrototypeIds: [],
  selectedByProject: {},
  comments: {},
  activity: [],
  handoffs: {},
  tickets: [],
};

function loadPatch(): Patch {
  if (typeof window === 'undefined') return emptyPatch;
  try {
    for (const key of LEGACY_STORAGE_KEYS) {
      window.localStorage.removeItem(key);
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyPatch;
    const parsed = JSON.parse(raw) as Partial<Patch>;
    return {
      ...emptyPatch,
      ...parsed,
    } as Patch;
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
          .map((pr) => {
            const edit = patch.edits[pr.id];
            return {
              ...pr,
              ...(edit || {}),
              comments: patch.comments[pr.id] ?? pr.comments ?? [],
            };
          });

        const userProtos = Object.values(patch.prototypes)
          .filter(
            (pr) =>
              pr.companySlug === c.slug &&
              pr.projectSlug === p.slug &&
              !removed.has(pr.id)
          )
          .map(({ companySlug: _cs, projectSlug: _ps, ...rest }) => {
            const edit = patch.edits[rest.id];
            return {
              ...rest,
              ...(edit || {}),
              comments: patch.comments[rest.id] ?? rest.comments ?? [],
            };
          });

        const allProtos = [...seedProtos, ...userProtos];
        const overrideId = patch.selectedByProject[projectKey];
        const protosWithCurrent = allProtos.map((pr) => ({
          ...pr,
          isCurrent: overrideId ? pr.id === overrideId : pr.isCurrent,
        }));

        return {
          ...p,
          selectedPrototypeId: overrideId ?? p.selectedPrototypeId,
          prototypes: protosWithCurrent,
        };
      }),
    })),
  };
}

export function useWorkspaceStore() {
  const [seed, setSeed] = useState<Workspace | null>(null);
  const [patch, setPatch] = useState<Patch>(emptyPatch);
  const [hydrated, setHydrated] = useState(false);
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadSeed().then(setSeed).catch(console.error);
    setPatch(loadPatch());
    setHydrated(true);
  }, []);

  // Debounced writes to avoid blocking on every keystroke/click
  const update = useCallback(
    (next: Patch | ((prev: Patch) => Patch)) => {
      setPatch((prev) => {
        const computed =
          typeof next === 'function' ? (next as (p: Patch) => Patch)(prev) : next;
        if (writeTimer.current) clearTimeout(writeTimer.current);
        writeTimer.current = setTimeout(() => savePatch(computed), 180);
        return computed;
      });
    },
    []
  );

  useEffect(
    () => () => {
      if (writeTimer.current) clearTimeout(writeTimer.current);
    },
    []
  );

  const workspace = useMemo(() => {
    if (!seed) return { name: '', description: '', companies: [] } as Workspace;
    return mergeWorkspace(seed, patch);
  }, [seed, patch]);

  const logActivity = useCallback(
    (a: Omit<Activity, 'id' | 'at'> & Partial<Pick<Activity, 'at' | 'id'>>) => {
      const activity = {
        id: a.id ?? crypto.randomUUID(),
        at: a.at ?? new Date().toISOString(),
        ...a,
      };

      update((prev) => ({
        ...prev,
        activity: [activity, ...prev.activity].slice(0, 60),
      }));

      addActivityDB(a).catch(console.error);
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
      const proto: PatchedPrototype = {
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

  const editPrototype = useCallback(
    (
      companySlug: string,
      projectSlug: string,
      prototypeId: string,
      patch: Partial<Prototype>
    ) => {
      update((prev) => ({
        ...prev,
        edits: {
          ...prev.edits,
          [prototypeId]: { ...(prev.edits[prototypeId] || {}), ...patch },
        },
        prototypes: prev.prototypes[prototypeId]
          ? {
              ...prev.prototypes,
              [prototypeId]: { ...prev.prototypes[prototypeId], ...patch },
            }
          : prev.prototypes,
      }));
      logActivity({
        kind: 'prototype.updated',
        companySlug,
        projectSlug,
        prototypeId,
        message: `Protótipo atualizado.`,
      });
    },
    [update, logActivity]
  );

  const setCurrentPrototype = useCallback(
    (companySlug: string, projectSlug: string, prototypeId: string) => {
      const key = `${companySlug}:${projectSlug}`;
      update((prev) => ({
        ...prev,
        selectedByProject: { ...prev.selectedByProject, [key]: prototypeId },
      }));
      logActivity({
        kind: 'prototype.updated',
        companySlug,
        projectSlug,
        prototypeId,
        message: `Versão atual definida.`,
      });
    },
    [update, logActivity]
  );

  const removePrototype = useCallback(
    (
      companySlug: string,
      projectSlug: string,
      prototypeId: string,
      name: string
    ) => {
      update((prev) => ({
        ...prev,
        removedPrototypeIds: Array.from(
          new Set([...prev.removedPrototypeIds, prototypeId])
        ),
      }));
      logActivity({
        kind: 'prototype.removed',
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

  const upsertHandoff = useCallback(
    (
      companySlug: string,
      projectSlug: string,
      prototypeId: string,
      data: Partial<Handoff>
    ) => {
      update((prev) => {
        const cur = prev.handoffs[prototypeId];
        const defaults: Omit<Handoff, 'prototypeId' | 'updatedAt'> = {
          status: 'rascunho',
          goal: '',
          decisions: '',
          components: '',
          states: '',
          copy: '',
          accessibility: '',
          resources: '',
          repoUrl: '',
        };
        const next: Handoff = {
          ...defaults,
          ...cur,
          ...data,
          prototypeId,
          updatedAt: new Date().toISOString(),
        };
        return { ...prev, handoffs: { ...prev.handoffs, [prototypeId]: next } };
      });
      logActivity({
        kind: 'handoff.updated',
        companySlug,
        projectSlug,
        prototypeId,
        message: `Handoff atualizado${data.status ? ` → ${data.status}` : ''}.`,
      });
    },
    [update, logActivity]
  );

  const createTicket = useCallback(
    (topic: TicketTopic, description: string) => {
      const labels: Record<TicketTopic, string> = {
        sugestao: 'Sugestão de UX',
        'nova-tela': 'Nova tela',
        'nova-feature': 'Nova feature',
        redesign: 'Redesign de tela',
        'design-review': 'Design review',
      };
      const ticket: Ticket = {
        id: `ux-${Date.now().toString(36)}`,
        topic,
        title: labels[topic],
        description,
        status: 'aberto',
        createdAt: new Date().toISOString(),
      };
      const activityItem: Activity = {
        id: `activity-${ticket.id}`,
        kind: 'ticket.created',
        at: ticket.createdAt,
        companySlug: 'crm',
        message: `Chamado "${ticket.title}" aberto para UX.`,
      };

      update((prev) => ({
        ...prev,
        tickets: [ticket, ...prev.tickets].slice(0, 80),
        activity: [activityItem, ...prev.activity].slice(0, 60),
      }));

      return ticket.id;
    },
    [update]
  );

  return {
    workspace,
    activity: patch.activity,
    handoffs: patch.handoffs,
    tickets: patch.tickets,
    hydrated,
    addPrototype,
    editPrototype,
    setCurrentPrototype,
    removePrototype,
    addComment,
    upsertHandoff,
    createTicket,
    logActivity,
  };
}

/* ------------ Helpers ------------ */

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
      (c.projects || []).reduce((ss, p) => ss + (p.prototypes?.length || 0), 0),
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

export function statusColor(s: HandoffStatus) {
  switch (s) {
    case 'rascunho':
      return { fg: '#64748B', bg: '#F1F5F9', label: 'Rascunho' };
    case 'pronto':
      return { fg: '#0284C7', bg: '#E0F2FE', label: 'Pronto pra dev' };
    case 'em-dev':
      return { fg: '#7C3AED', bg: '#EDE9FE', label: 'Em desenvolvimento' };
    case 'entregue':
      return { fg: '#059669', bg: '#D1FAE5', label: 'Entregue' };
  }
}
