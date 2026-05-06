import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

export function ConfirmationAlert({
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm text-amber-900/90">{description}</p>
          {(onConfirm || onCancel) ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {onCancel ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
                  onClick={onCancel}
                >
                  {cancelLabel}
                </Button>
              ) : null}
              {onConfirm ? (
                <Button
                  size="sm"
                  className="bg-amber-600 text-white hover:bg-amber-700"
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
