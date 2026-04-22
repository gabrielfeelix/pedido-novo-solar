import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function HelpTooltip({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center text-slate-400 transition hover:text-slate-600 ${className ?? ''}`}
          aria-label="Ajuda"
        >
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[240px] text-xs">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
