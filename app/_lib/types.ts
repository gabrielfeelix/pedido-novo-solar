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

export type Project = {
  slug: string;
  name: string;
  status: string;
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
  | 'version.added'
  | 'comment.added'
  | 'company.viewed';

export type Activity = {
  id: string;
  kind: ActivityKind;
  at: string;
  companySlug: string;
  projectSlug?: string;
  prototypeId?: string;
  message: string;
};
