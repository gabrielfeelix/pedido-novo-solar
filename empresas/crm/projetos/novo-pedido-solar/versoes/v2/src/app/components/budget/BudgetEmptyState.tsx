import { ShoppingCart, SunMedium, Plus } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export function BudgetEmptyState({
  budgetNumber,
  emptyStateNotice,
  onBuildKit,
  onAddLooseItem,
}: {
  budgetNumber: string | null;
  emptyStateNotice: string | null;
  onBuildKit: () => void;
  onAddLooseItem: () => void;
}) {
  return (
    <div className="min-h-full bg-transparent py-8">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-800 hover:bg-amber-100">
                Orçamento Solar
              </Badge>
              {budgetNumber ? (
                <span className="text-xs font-mono text-slate-400">{budgetNumber}</span>
              ) : null}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Novo orçamento solar
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Monte o kit solar e organize os itens do orçamento. Integrador e tipo de venda serão definidos ao finalizar.
            </p>
            {emptyStateNotice ? (
              <div className="mt-4 max-w-3xl rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                {emptyStateNotice}
              </div>
            ) : null}
          </div>
        </div>

        <Card className="border-dashed border-slate-300 bg-white shadow-none">
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <ShoppingCart className="h-7 w-7 text-slate-400" />
            </div>
            <p className="text-lg font-semibold text-slate-900">Nenhum item adicionado ainda</p>
            <p className="max-w-md text-sm text-slate-500">
              Comece por <strong>Montar kit solar</strong>. Depois você pode incluir produtos avulsos que não fazem parte do gerador.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <Button className="bg-[#001233] text-white hover:bg-[#001233]/90" onClick={onBuildKit}>
                <SunMedium className="h-4 w-4" /> Montar kit solar
              </Button>
              <Button variant="outline" onClick={onAddLooseItem}>
                <Plus className="h-4 w-4" /> Adicionar produto avulso
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
