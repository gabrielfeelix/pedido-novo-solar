import { useState } from 'react';
import { Save, X, CheckCircle, AlertCircle, History, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';

interface ActionBarProps {
  changeCount: number;
}

export function ActionBar({ changeCount }: ActionBarProps) {
  const [status, setStatus] = useState<'pending' | 'saving' | 'saved'>('pending');
  const [showHistory, setShowHistory] = useState(false);

  const handleSave = () => {
    setStatus('saving');
    setTimeout(() => {
      setStatus('saved');
      setTimeout(() => setStatus('pending'), 3000);
    }, 1200);
  };

  const mockHistory = [
    { user: 'Roberto Silva', action: 'Alterou markup ES → 35.0%', date: '20/02/2026 14:32' },
    { user: 'Ana Costa', action: 'Alterou markup ML → 42.0%', date: '19/02/2026 11:15' },
    { user: 'Roberto Silva', action: 'Alterou desp. oper. → 8.5%', date: '18/02/2026 09:40' },
    { user: 'Carlos Lima', action: 'Adicionou promoção qtd. 50un.', date: '15/02/2026 16:20' },
    { user: 'Ana Costa', action: 'Alterou markup Shopee → 45%', date: '14/02/2026 10:05' },
  ];

  return (
    <>
      <div className="sticky bottom-0 z-30 bg-card" style={{ borderTop: '1px solid color-mix(in srgb, var(--border) 40%, transparent)', boxShadow: '0 -4px 16px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between px-6 py-3">
          {/* Status */}
          <div className="flex items-center gap-3">
            {changeCount > 0 && status === 'pending' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ background: 'rgba(245,158,11,0.08)' }}>
                <AlertCircle size={14} style={{ color: '#D97706' }} />
                <span style={{ fontSize: '12px', fontWeight: 'var(--font-weight-semibold)', color: '#92400E' }}>
                  {changeCount} alteraç{changeCount === 1 ? 'ão pendente' : 'ões pendentes'}
                </span>
              </div>
            )}
            {status === 'saving' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ background: 'color-mix(in srgb, var(--primary) 6%, transparent)' }}>
                <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-primary" style={{ fontSize: '12px', fontWeight: 'var(--font-weight-semibold)' }}>Salvando...</span>
              </div>
            )}
            {status === 'saved' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ background: 'rgba(16,185,129,0.06)' }}>
                <CheckCircle size={14} style={{ color: '#059669' }} />
                <span style={{ fontSize: '12px', fontWeight: 'var(--font-weight-semibold)', color: '#047857' }}>Salvo com sucesso</span>
              </div>
            )}
            {changeCount === 0 && status === 'pending' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/40">
                <CheckCircle size={14} className="text-muted-foreground" />
                <span className="text-muted-foreground" style={{ fontSize: '12px', fontWeight: 'var(--font-weight-medium)' }}>Tudo salvo</span>
              </div>
            )}

            {/* Histórico link */}
            <Button
              variant="ghost"
              size="small"
              icon={<History size={13} />}
              onClick={() => setShowHistory(!showHistory)}
            >
              Histórico
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={<X size={15} />}
            >
              Descartar
            </Button>
            <Button
              onClick={handleSave}
              disabled={status === 'saving'}
              style={{
                background: changeCount > 0 ? 'var(--foreground)' : 'var(--primary)',
                boxShadow: changeCount > 0 ? '0 4px 14px color-mix(in srgb, var(--foreground) 35%, transparent)' : 'none',
                paddingLeft: '28px',
                paddingRight: '28px',
              }}
            >
              <div className="flex items-center gap-2">
                <Save size={15} />
                <span style={{ fontSize: '13px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Inter', sans-serif", letterSpacing: '0.2px' }}>
                  Salvar Alterações
                </span>
                {changeCount > 0 && (
                  <span
                    className="rounded-full px-1.5 py-0.5"
                    style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', background: 'var(--primary)', color: 'var(--primary-foreground)', lineHeight: '1' }}
                  >
                    {changeCount}
                  </span>
                )}
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* History Side Panel */}
      {showHistory && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setShowHistory(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-[380px] z-50 bg-card border-l overflow-y-auto" style={{ borderColor: 'color-mix(in srgb, var(--border) 40%, transparent)', boxShadow: '-8px 0 24px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'color-mix(in srgb, var(--border) 30%, transparent)' }}>
              <div className="flex items-center gap-2">
                <History size={16} className="text-primary" />
                <span className="text-foreground" style={{ fontSize: '15px', fontWeight: 'var(--font-weight-semibold)' }}>Histórico de Alterações</span>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1.5 rounded-[var(--radius)] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-1">
              {mockHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 py-3 px-3 rounded-md hover:bg-secondary/30 transition-colors"
                  style={{ borderBottom: idx < mockHistory.length - 1 ? '1px solid color-mix(in srgb, var(--border) 15%, transparent)' : undefined }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary" style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)' }}>
                      {item.user.split(' ').map(w => w[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground" style={{ fontSize: '12px', fontWeight: 'var(--font-weight-semibold)' }}>{item.user}</div>
                    <div className="text-secondary-foreground mt-0.5" style={{ fontSize: '12px' }}>{item.action}</div>
                    <div className="text-muted-foreground mt-1" style={{ fontSize: '10px' }}>{item.date}</div>
                  </div>
                  <ChevronRight size={14} className="text-muted shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}