'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useWorkspaceStore } from '../_lib/storage';

type Store = ReturnType<typeof useWorkspaceStore>;

const WorkspaceContext = createContext<Store | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const store = useWorkspaceStore();
  return (
    <WorkspaceContext.Provider value={store}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): Store {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx;
}
