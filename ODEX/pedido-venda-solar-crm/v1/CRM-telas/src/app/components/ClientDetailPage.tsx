import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ClientUpdateButton } from './ClientUpdateButton';
import { orderClients } from '../data/solarOrderMockData';

export function ClientDetailPage() {
  const { id } = useParams();

  const client = useMemo(
    () => orderClients.find((item) => item.id === id) ?? orderClients[0],
    [id],
  );

  return (
    <div className="min-h-full bg-transparent py-8">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Cliente
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {client.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Página mock para o protótipo de atualização cadastral.
            </p>
          </div>
          <ClientUpdateButton client={client} />
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Dados atuais</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Documento</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{client.document}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Inscrição estadual</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{client.stateRegistration ?? 'Não informada'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Contato</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{client.contactName}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Telefone</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{client.phone}</p>
            </div>
            <div className="md:col-span-2 xl:col-span-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Endereço</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {client.street}, {client.district}, {client.city}/{client.state}, CEP {client.zipCode}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
