import { useLocation, useNavigate } from 'react-router';
import { Construction, ArrowLeft } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/contabilidade': 'Contabilidade',
  '/logistica/integracoes-es': 'Integrações ES',
  '/logistica/rastreio-nf': 'Rastreio de Nota Fiscal',
  '/clientes': 'Clientes',
  '/clientes/prospex': 'Prospex',
  '/crm/atividades': 'Atividades',
  '/crm/atendimentos': 'Atendimentos',
  '/crm/campanhas': 'Cadastro de Campanhas',
  '/relatorios/gerador': 'Gerador de Relatórios',
  '/produtos/texto-garantia': 'Texto Garantia',
  '/produtos/pdf': 'PDF de Produtos',
  '/produtos/atualizacoes': 'Atualizações de Produtos',
  '/produtos/aging': 'Aging',
  '/produtos/aging/sumario': 'Aging — Sumário',
  '/configuracoes': 'Configurações',
  '/vendas/pedidos': 'Pedidos de Venda (Geral)',
};

export function PlaceholderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || 'Página';

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
      <div
        className="w-16 h-16 rounded-[var(--radius-card)] bg-secondary flex items-center justify-center"
      >
        <Construction size={28} className="text-muted-foreground" />
      </div>
      <div className="text-center">
        <h1 className="od-title mb-2">{title}</h1>
        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
          Este módulo está em desenvolvimento e estará disponível em breve.
        </p>
      </div>
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-button)] bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-[var(--elevation-sm)]"
        style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}
      >
        <ArrowLeft size={16} />
        Voltar ao Dashboard
      </button>
    </div>
  );
}
