import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type JourneyStep = {
  id: string;
  title: string;
  objective: string;
  output: string;
};

type ComponentSpec = {
  component: string;
  where: string;
  purpose: string;
  contract: string;
};

const journey: JourneyStep[] = [
  {
    id: 'F1',
    title: 'Entrada no fluxo dedicado',
    objective: 'Iniciar por Vendas > Novo Pedido Solar, sem misturar com pedido geral.',
    output: 'Usuário na rota /vendas/novo-pedido-solar.',
  },
  {
    id: 'F2',
    title: 'Contexto comercial',
    objective: 'Selecionar Integrador e Cliente para faturamento, origem, tabela e operação.',
    output: 'Pedido contextualizado para montagem e fechamento.',
  },
  {
    id: 'F3',
    title: 'Monte seu kit solar',
    objective: 'Abrir builder com stepper e montar kit completo.',
    output: 'Kit válido com componentes e totais consolidados.',
  },
  {
    id: 'F4',
    title: 'Inserção no pedido',
    objective: 'Persistir kit como SKU pai com composição de SKUs filhos.',
    output: 'Linha de kit visível na aba Itens.',
  },
  {
    id: 'F5',
    title: 'Itens avulsos',
    objective: 'Adicionar, filtrar e remover itens avulsos antes da confirmação.',
    output: 'Pedido final com kit + avulsos revisados.',
  },
  {
    id: 'F6',
    title: 'Pedido realizado',
    objective: 'Exibir estrutura final com detalhes financeiros e técnicos.',
    output: 'Tabela de itens com expansão visual do kit e abas complementares.',
  },
];

const components: ComponentSpec[] = [
  {
    component: 'Layout (header + navegação)',
    where: 'src/app/components/Layout.tsx',
    purpose: 'Organizar acesso por domínio (Vendas, Handoff etc.) e preservar contexto.',
    contract: 'Menu abre por clique (não hover). Handoff visível em aba dedicada.',
  },
  {
    component: 'Página Novo Pedido Solar',
    where: 'src/app/components/SolarOrderPage.tsx',
    purpose: 'Tela principal de criação e revisão do pedido solar.',
    contract: 'Estado vazio sem ações de rascunho; CTA principal leva ao builder.',
  },
  {
    component: 'Builder de Kit Solar',
    where: 'src/app/components/SolarBuilderPage.tsx',
    purpose: 'Montagem guiada do kit com stepper e resumo lateral.',
    contract: 'Valida mínimos lógicos sem checklist visual poluindo a revisão.',
  },
  {
    component: 'Busca inline de cliente',
    where: 'SolarOrderPage.tsx (ClientInlineSearch)',
    purpose: 'Selecionar cliente no próprio bloco sem modal dedicado.',
    contract: 'Busca por código/CNPJ/razão/cidade com lista contextual.',
  },
  {
    component: 'Modal de itens avulsos',
    where: 'SolarOrderPage.tsx (LooseItemDialog)',
    purpose: 'Adicionar avulsos com filtros e revisão antes de inserir no pedido.',
    contract: 'Lista selecionada editável, com remoção antes do confirmar.',
  },
  {
    component: 'Tabela de Itens do pedido',
    where: 'SolarOrderPage.tsx (TabsContent items)',
    purpose: 'Conferir composição e valores do pedido realizado.',
    contract: 'Kit expansível com imagem + SKU dos componentes filhos.',
  },
  {
    component: 'HandoffPage',
    where: 'src/app/components/HandoffPage.tsx',
    purpose: 'Documento vivo para transição Design -> Dev.',
    contract: 'Conter fluxo, contratos de UI e critérios de aceite objetivos.',
  },
];

const typographyContract = [
  'Heading primário: Red Hat Display (hierarquia e presença visual).',
  'Texto de interface e conteúdo: Inter (legibilidade e consistência operacional).',
  'Títulos de seção: semântica clara com contraste alto e espaçamento vertical consistente.',
  'Rótulos e microcopy: tamanho reduzido, tom objetivo e linguagem de ação.',
];

const visualContract = [
  'Estado vazio orientado por CTA (não por ações administrativas como limpar/salvar rascunho).',
  'Densidade de informação progressiva: resumo > detalhe > expansão.',
  'Cores de status semânticas: verde (ok), âmbar (atenção), vermelho (bloqueio).',
  'Ações clicáveis com cursor pointer e affordance visual consistente.',
  'Evitar ambiguidade de nomenclatura: Novo Pedido (geral) vs Novo Pedido Solar (dedicado).',
];

const technicalContract = [
  'Rotas canônicas: /vendas/novo-pedido-solar e /vendas/novo-pedido-solar/solar-builder.',
  'Rotas gerais devem permanecer fora do fluxo solar: /vendas/pedidos e /vendas/novo-pedido.',
  'Compatibilidade temporária com aliases legados para evitar tela vazia em links antigos.',
  'Kit deve ser modelado como entidade composta (SKU pai + coleção de filhos).',
  'Totalizadores derivados do estado atual da UI, nunca de valor estático.',
];

const implementationPlan = [
  'Etapa 1: estabilizar rotas e navegação (canônicas + aliases).',
  'Etapa 2: consolidar componentes compartilhados (cards de cliente, tabela de itens, dialog de avulsos).',
  'Etapa 3: extrair regras de negócio do builder para utilitários testáveis.',
  'Etapa 4: cobrir jornada crítica com testes E2E (entrada > montar kit > pedido realizado).',
  'Etapa 5: aplicar telemetria de eventos-chave (início kit, conclusão kit, inclusão/remoção de item).',
];

const qaChecklist = [
  'Novo Pedido (geral) não abre fluxo solar.',
  'Novo Pedido Solar sempre abre a tela dedicada.',
  'CTA “Monte seu kit solar” nunca abre página vazia.',
  'Expansão do kit mostra imagem e SKU dos itens filhos.',
  'Botões clicáveis exibem cursor pointer e feedback visual.',
  'Build frontend executa sem erro.',
];

function Dot({ label }: { label: string }) {
  return (
    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-100 px-2 text-[11px] font-semibold text-blue-700">
      {label}
    </span>
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-base text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function HandoffPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] p-6 md:p-8">
      <div className="mb-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-100">Handoff</Badge>
          <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">Novo Pedido Solar</Badge>
          <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Design to Dev</Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
          Handoff UX/UI Completo · Fluxo de Novo Pedido Solar
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
          Documento de implementação para engenharia com foco em jornada, contratos visuais e estrutura de componentes.
          Objetivo: reduzir ambiguidade e garantir consistência do fluxo dedicado solar, da entrada até o pedido realizado.
        </p>
      </div>

      <Card className="mb-6 border-slate-200">
        <CardHeader>
          <CardTitle>Fluxo End-to-End</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {journey.map((step) => (
            <div key={step.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Dot label={step.id} />
                <p className="text-sm font-semibold text-slate-900">{step.title}</p>
              </div>
              <p className="text-sm text-slate-700"><strong>Objetivo:</strong> {step.objective}</p>
              <p className="mt-1 text-sm text-slate-600"><strong>Saída esperada:</strong> {step.output}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6 border-slate-200">
        <CardHeader>
          <CardTitle>Mapa de Componentes (UI para Responsabilidade)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="hidden grid-cols-[1.15fr_1fr_1.2fr_1.2fr] gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600 lg:grid">
            <div>Componente</div>
            <div>Arquivo</div>
            <div>Papel no fluxo</div>
            <div>Contrato</div>
          </div>
          {components.map((row) => (
            <div
              key={`${row.component}-${row.where}`}
              className="grid gap-2 rounded-lg border border-slate-200 px-3 py-3 text-sm lg:grid-cols-[1.15fr_1fr_1.2fr_1.2fr] lg:gap-3"
            >
              <p className="font-semibold text-slate-900">{row.component}</p>
              <p className="font-mono text-xs text-slate-600">{row.where}</p>
              <p className="text-slate-700">{row.purpose}</p>
              <p className="text-slate-700">{row.contract}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <BulletSection title="Contrato de Tipografia" items={typographyContract} />
        <BulletSection title="Contrato Visual e Interação" items={visualContract} />
        <BulletSection title="Contrato Técnico" items={technicalContract} />
        <BulletSection title="Plano de Implementação" items={implementationPlan} />
      </div>

      <Card className="mt-6 border-emerald-200 bg-emerald-50">
        <CardHeader>
          <CardTitle className="text-base text-emerald-900">Critérios de Aceite (QA)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-emerald-900">
            {qaChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
