import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const flowSteps = [
  {
    title: '1) Entrada no fluxo solar',
    detail:
      'Usuário entra por Vendas > Novo Pedido Solar. Esse fluxo é dedicado e não deve reaproveitar a tela genérica de novo pedido.',
  },
  {
    title: '2) Dados comerciais do pedido',
    detail:
      'Selecionar Integrador e Cliente para faturamento por busca inline no bloco do cliente. Definir Origem, Tabela e Operação.',
  },
  {
    title: '3) Montagem do kit solar',
    detail:
      'Entrar em Montar gerador solar e seguir stepper: dados iniciais > painéis > inversores > string box > estrutura > acessórios > revisão.',
  },
  {
    title: '4) Revisão e inserção no pedido',
    detail:
      'Na revisão, permitir excluir itens (exceto mínimos travados por regra). Ao concluir, inserir kit como SKU pai + componentes filhos.',
  },
  {
    title: '5) Itens avulsos',
    detail:
      'Adicionar itens avulsos em modal grande com busca, filtros e miniatura. Permitir revisar e remover itens antes de confirmar.',
  },
  {
    title: '6) Pedido realizado',
    detail:
      'Na tela final, exibir tabela de itens com kit expansível, incluindo imagem dos componentes filhos no dropdown do kit.',
  },
  {
    title: '7) Fechamento',
    detail:
      'Fluxo segue para abas Financeiro/Frete/Aprovação/Faturamento/Bloqueios, mantendo rastreabilidade de status e totalizadores.',
  },
];

const uxRules = [
  'Menus do header abrem somente por clique. Não abrir por hover e não usar transição de slide ao atravessar tabs.',
  'Estrutura de fixação inicia com todas as categorias selecionadas; usuário pode filtrar por chips sem perder visão global.',
  'Checklist visual da revisão foi removido por decisão de UX; manter validações sem sobrecarregar a interface.',
  'Tab Triangulação deve ser contextual (habilitada somente para operações compatíveis).',
  'Nomenclatura padrão: Integrador, Cliente para faturamento, Novo Pedido Solar, Produtos avulsos.',
  'Estados vazios precisam CTA claro para avançar no próximo passo lógico.',
];

const techNotes = [
  {
    title: 'Rotas canônicas do protótipo',
    lines: [
      '/vendas/pedidos -> fluxo geral (não-solar)',
      '/vendas/novo-pedido-solar -> pedido solar (tela principal)',
      '/vendas/novo-pedido-solar/solar-builder -> montagem do kit',
      '/handoff -> documentação para desenvolvimento',
    ],
  },
  {
    title: 'Modelagem funcional mínima',
    lines: [
      'Kit = SKU pai + lista de componentes filhos (SKU, marca, quantidade, preço unitário).',
      'Itens avulsos independentes do kit, com CRUD no pedido.',
      'Bloqueios derivados de regras de negócio (cliente, aprovação, operação e dados faltantes).',
      'Totais sempre derivados dos itens renderizados (evitar números desconectados da UI).',
    ],
  },
  {
    title: 'Critérios de aceite sugeridos',
    lines: [
      'Usuário completa fluxo sem ficar preso em modais sem saída.',
      'Troca de aba/menu não gera flicker ou animação inesperada.',
      'Remoção de item funciona na revisão e no resumo lateral.',
      'Kit expandido mostra composição com imagem e SKU dos filhos.',
      'Build de frontend executa sem erro (`npm run build`).',
    ],
  },
];

export function HandoffPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-100">Handoff</Badge>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
          Novo Pedido Solar · Especificação para Dev
        </h1>
      </div>

      <Card className="mb-6 border-slate-200">
        <CardHeader>
          <CardTitle>Objetivo</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-slate-700">
          Entregar para implementação um fluxo dedicado de <strong>Novo Pedido Solar</strong>,
          separado do fluxo de pedido genérico, cobrindo jornada completa da criação até a
          visualização do pedido realizado.
        </CardContent>
      </Card>

      <Card className="mb-6 border-slate-200">
        <CardHeader>
          <CardTitle>Fluxo End-to-End</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {flowSteps.map((step) => (
            <div key={step.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-900">{step.title}</p>
              <p className="mt-1 text-sm text-slate-600">{step.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6 border-slate-200">
        <CardHeader>
          <CardTitle>Diretrizes de UX/UI</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            {uxRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {techNotes.map((note) => (
          <Card key={note.title} className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">{note.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                {note.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
