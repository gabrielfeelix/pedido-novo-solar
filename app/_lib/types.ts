export type Comment = {
  id: string;
  author: string;
  text: string;
  at: string;
};

export type Prototype = {
  id: string;
  name: string;
  version: string;
  slug: string;
  source: string;
  notes: string;
  createdAt: string;
  url?: string;
  figmaUrl?: string;
  preview?: string;
  isCurrent?: boolean;
  comments?: Comment[];
};

export type ProjectStatus = 'ativo' | 'em-revisao' | 'pausado' | 'concluido';

export type Project = {
  slug: string;
  name: string;
  status: ProjectStatus;
  figmaUrl?: string;
  handoffUrl?: string;
  selectedPrototypeId?: string;
  prototypes?: Prototype[];
};

export type Company = {
  slug: string;
  name: string;
  brandColor: string;
  logo: string;
  description: string;
  projects?: Project[];
};

export type Workspace = {
  name: string;
  description: string;
  companies: Company[];
};

export type ActivityKind =
  | 'prototype.created'
  | 'prototype.updated'
  | 'prototype.removed'
  | 'version.added'
  | 'comment.added'
  | 'handoff.updated'
  | 'company.viewed'
  | 'ticket.created';

export type Activity = {
  id: string;
  kind: ActivityKind;
  at: string;
  companySlug: string;
  projectSlug?: string;
  prototypeId?: string;
  message: string;
};

export type HandoffStatus = 'rascunho' | 'pronto' | 'em-dev' | 'entregue';

export type Handoff = {
  prototypeId: string;
  status: HandoffStatus;
  goal: string;
  decisions: string;
  components: string;
  states: string;
  copy: string;
  accessibility: string;
  resources: string;
  repoUrl: string;
  updatedAt: string;
};

export type PatchedPrototype = Prototype & {
  companySlug: string;
  projectSlug: string;
};

export type TicketTopic =
  | 'sugestao'
  | 'nova-tela'
  | 'nova-feature'
  | 'redesign'
  | 'design-review';

export type TicketStatus = 'aberto' | 'em-analise' | 'resolvido';

export type Ticket = {
  id: string;
  topic: TicketTopic;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
};
