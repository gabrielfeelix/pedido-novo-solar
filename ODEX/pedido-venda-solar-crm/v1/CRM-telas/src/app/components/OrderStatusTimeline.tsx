const ORDER_STEPS = [
  'Recebido',
  'Em aprovação',
  'Aprovado',
  'Separado',
  'Enviado',
  'Entregue',
] as const;

export function OrderStatusTimeline({
  currentStep = 'Em aprovação',
}: {
  currentStep?: (typeof ORDER_STEPS)[number];
}) {
  const currentIndex = ORDER_STEPS.indexOf(currentStep);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Status do pedido
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Régua mock para o protótipo. A integração real virá depois com o DP1.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {currentStep}
        </span>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-6">
        {ORDER_STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = index === currentIndex;
          return (
            <div key={step} className="relative">
              <div
                className={`rounded-xl border px-3 py-3 text-center text-xs font-semibold transition ${
                  isActive
                    ? 'border-blue-200 bg-blue-50 text-blue-800'
                    : isDone
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}
              >
                {step}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
