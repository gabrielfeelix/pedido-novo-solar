import { useMemo, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import type { OrderParty } from '../data/solarOrderMockData';

type ClientFieldDiff = {
  label: string;
  current: string;
  fetched: string;
};

export function ClientUpdateButton({
  client,
}: {
  client: OrderParty;
}) {
  const [open, setOpen] = useState(false);

  const diffs = useMemo<ClientFieldDiff[]>(
    () => [
      {
        label: 'Contato',
        current: client.contactName,
        fetched: `${client.contactName} Atualizado`,
      },
      {
        label: 'Telefone',
        current: client.phone,
        fetched: client.phone.replace('0200', '0211'),
      },
      {
        label: 'Endereço',
        current: `${client.street}, ${client.district}`,
        fetched: `${client.street}, ${client.district} Sala 2`,
      },
    ],
    [client],
  );

  return (
    <>
      <Button
        variant="outline"
        className="border-slate-300"
        onClick={() => setOpen(true)}
      >
        <RefreshCcw className="h-4 w-4" />
        Atualizar cliente
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Atualizar cliente via Receita/Sintegra</DialogTitle>
            <DialogDescription>
              Mock do comparativo entre cadastro atual e dados consultados externamente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            {diffs.map((diff) => (
              <div key={diff.label} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Atual · {diff.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{diff.current}</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700">
                    Consultado · {diff.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-amber-950">{diff.fetched}</p>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
            <Button
              className="bg-[#001233] text-white hover:bg-[#001233]/90"
              onClick={() => setOpen(false)}
            >
              Aplicar mock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
