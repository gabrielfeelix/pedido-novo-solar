# Planejamento — Plataforma Odex Solar v2

> Pós-reunião com Natalia (08/05/2026, 38min). Documento de trabalho construído como roadmap de execução para os próximos 6–8 sprints.

---

## Status atual (atualizado em 2026-05-08)

**Mockup completo. Sem backend — todas as ações de download/envio acionam mocks (alert) que serão substituídos por endpoints reais quando o BE chegar.**

| Sprint | Status | Notas |
|---|---|---|
| Sprint 1 | ✅ Concluído | 1.1 área rural km, 1.2 Expirado, 1.3 e-mail bloqueado, 1.4 status pedidos (Aguardando pagamento + Bloqueado), 1.5 Cliente PF only, 1.6 Prêmio fora loja/PDP, 1.7 Redefinir senha |
| Sprint 2 | ✅ Concluído (mock) | 2.1 buscar cliente pré-popula form, 2.2 PJ/PF/NI dinâmico no detalhe, 2.3 validade editável + observação multilinha, 2.4 WhatsApp share orçamento, 2.5 cart preview lateral |
| Sprint 3 | ✅ Concluído (mock) | 3.1 modal pedido com NF download (PDF/XML/DANFE), 3.2 cursor download corrigido, 3.4 botões PDF/CSV na linha + tipo de NF, 3.5 hierarquia detail. **3.6 documentos cliente fica para quando houver backend.** |
| Sprint 4 | ✅ Parcial (mock) | 4.1 auto-open novidades primeira sessão + badge no botão, 4.3 reactions emoji. **4.4 lista de tipos de notificação fica em aberto (decisão do cliente).** |
| Sprint 5 | ✅ Concluído (mock) | 5.1 tela Prêmio Venda Direta, 5.2 Relatórios v1 (KPIs + tabela mensal + export buttons mock) |
| Sprint 6 | ✅ Parcial | 6.6 calculadora disclaimer + WhatsApp + tonalização sóbria, 6.4 PDP especificações. **6.1 carrinho lateral global e 6.5 engine de avaliações ficam para iteração futura.** |
| Sprint 7 | ⏸ Bloqueado | Tudo aqui depende de backend (CRM, tickets, B2C). |

---

## 1. Sumário executivo

A reunião foi um **walkthrough completo dos protótipos da v2**. Não foi uma sessão de descoberta — foi validação da direção visual + alinhamento sobre regras de negócio que só o time interno sabe (CRM, prêmio venda direta, área rural, fluxo de aprovação, restrições de edição por fraude, etc.).

A maior parte da v2 já está construída. O que sobra divide-se em **4 grupos**:

1. **Correções críticas de regra de negócio** descobertas na reunião (poucas, mas bloqueantes — frete em área rural, "sem cliente" → "expirado", e-mail bloqueado em edição).
2. **Refinos de fluxos existentes** (orçamento, pedido detail, PDP, clientes).
3. **Módulos novos** (Notificações funcionais, Novidades persistente com auto-open, Prêmio Venda Direta, Relatórios mínimo).
4. **Integrações dependentes de backend** (CRM Giovanni para status de orçamento, upload/visualização de documentos do cliente, dashboards reais).

A divisão por sprint abaixo prioriza **destravar bloqueios → fechar fluxos core → entregar novos módulos → integrar**.

---

## 2. Princípios de execução

- **Não quebrar o que está funcionando.** A v2 já tem checkout, dashboard, listas e detalhes. Toda mudança vai por *toggle* ou *feature flag* mental — primeiro nas telas em rota nova, depois substitui.
- **Backend antes de UI quando há dependência real.** Adiantar UI de status "Aprovado/Expirado" sem o sinal do CRM significa retrabalho. Vamos parear UI com endpoint logo na primeira iteração.
- **Decisões pendentes ficam listadas em § 7**, não viram suposição silenciosa no código.
- **Cada sprint termina com demo gravada** para a Natalia + cliente revisar — o ciclo de feedback que ela mesma sugeriu na reunião (área de tickets futura) começa internamente já.
- **Estimativas em pontos relativos**: S = ½–1d, M = 2–3d, L = 1 sem, XL = 2 sem+. Refinar em planning.

---

## 3. Roadmap por sprint

### Sprint 1 — Correções críticas + débito técnico (1 semana)

Objetivo: fechar tudo que foi explicitamente identificado como **errado em produção** ou que mudou a regra de negócio na reunião.

| # | Item | Origem (reunião) | Esforço | Bloqueio? |
|---|---|---|---|---|
| 1.1 | **Área rural: campo obrigatório de "distância da cidade (km)"** ao selecionar Área Rural no endereço de entrega. Aplicar em: cadastro de cliente, novo orçamento, edição de orçamento. | 14:30 — caso real de frete 130km que quebrou. "tanto pode ser 5km como 130km" | M | Sim (frete errado em prod) |
| 1.2 | **Renomear stat "Sem cliente" → "Expirado"** em Orçamentos. Critério: orçamentos cujo `validade < hoje`. | 12:49 — "nem precisa colocar sem cliente, coloca só expirado" | S | Não |
| 1.3 | **Edição de cliente: bloquear campo e-mail.** Permitir só nome + telefone. Adicionar tooltip explicando ("o e-mail do cliente é usado para emissão da NF e não pode ser alterado"). | 27:53 — caso de fraude por integrador colocando próprio e-mail | S | Sim (compliance fiscal) |
| 1.4 | **Pedidos: substituir "Em andamento" genérico por status reais do CRM**: `Aguardando pagamento`, `Em andamento`, `Bloqueado`. Mock-data atualizado mesmo antes da integração. | 19:50, 20:18 — "tá guardando pagamento" | S (UI) + L (backend depois) | Não |
| 1.5 | **Cliente PF apenas** quando o usuário é integrador (escopar visão por role). | 25:06 — "essa tela pro integrador vai ser só pessoa física" | S | Não |
| 1.6 | **Remover "Prêmio" da loja/PDP**. Prêmio só faz sentido em Venda Direta (revenda PJ não leva). | 33:06 — "na loja não faz sentido" | S | Não |
| 1.7 | **Esqueci minha senha → fluxo de Redefinir Senha**. ✅ *Feito nesta iteração.* | screenshot atual da plataforma | — | — |

**Critério de saída do sprint:** demo + 1.1 a 1.6 mergeados. Lista de "decisões pendentes" zerada para itens deste sprint.

---

### Sprint 2 — Novo Orçamento + Detalhe (1 semana)

Objetivo: fechar os 2 fluxos mais usados pelo integrador no dia-a-dia.

| # | Item | Origem | Esforço |
|---|---|---|---|
| 2.1 | **Novo Orçamento**: buscar cliente como opcional (toggle "Sem cliente" / "Com cliente"). Quando "com cliente", pré-popular WhatsApp/email/endereço do cadastro. | 10:24, 15:40 | M |
| 2.2 | **Novo Orçamento**: tipo de orçamento — `Revenda` (só PJ) vs `Venda Direta` (PJ + PF + Não Informar). Campos do form mudam dinamicamente. ✅ *Parcialmente feito (PJ/PF/NI).* Falta toggle Revenda/Venda Direta com regra. | 10:43 | M |
| 2.3 | **Novo Orçamento**: campo "Validade" editável manualmente (hoje é fixo) + "Observação adicional" multilinha. | 11:10 | S |
| 2.4 | **Orçamento Detail**: WhatsApp share — pré-populado com telefone do cliente buscado, mensagem template editável antes de enviar, geração de PDF. ✅ *Modal feito*; falta amarrar telefone do cliente buscado. | 15:40 | S |
| 2.5 | **Orçamento Detail**: visualização live do cart no lado direito (já existe na nova seção, validar fidelidade do total com IPI/ST/desconto). | 14:16 | S |
| 2.6 | **Stats de Orçamentos**: aprovados (= virou pedido via CRM), pendentes (válido), expirados (passou validade). Conectar fórmula real, não mock. | 13:19, 12:49 | M |

**Dependência:** 2.6 precisa do gancho do CRM para marcar "aprovado". Até lá, mock + flag.

---

### Sprint 3 — Pedidos Detail + Modal de Resumo + Documentos (1 semana)

Objetivo: dar à tela de Pedidos a hierarquia visual que o resto do sistema já tem.

| # | Item | Origem | Esforço |
|---|---|---|---|
| 3.1 | **Pedido — Modal de Resumo** (acionado pelo ícone na lista). Conteúdo: produtos, logística, pagamento. Botão de **baixar NF (PDF + XML/Danfe)** dentro do modal. | 20:30, 21:18 | M |
| 3.2 | **Ícone de download na linha** com hover/cursor pointer correto (hoje não parece clicável — era um bug da reunião). | 21:39 | S |
| 3.3 | **Pedido Detail — hierarquia revisada**: resumo → ações → vendido por / cliente → logística → pagamento → endereço entrega → produtos → prêmio venda direta. Já está parcialmente assim; auditar e corrigir. | 22:39 | S |
| 3.4 | **Pedido Detail — botão "Imprimir NF"** com escolha de tipo (Eletrônica/Manual + Danfe/XML). | 22:48 | S |
| 3.5 | **Pedido Detail — WhatsApp/Email send**, mesmo padrão de Orçamento. | 22:48 | S |
| 3.6 | **Cliente Detail — upload e visualização de documentos** (RG, comprovante de residência) integrado ao CRM. | 25:29 | M (UI) + L (backend) |

**Dependência:** 3.6 depende de endpoint de documentos no CRM. UI primeiro, backend em paralelo no mesmo sprint.

---

### Sprint 4 — Novidades + Notificações (1 semana)

Objetivo: criar a sensação de "sistema vivo" que a Natalia explicitou como prioridade visual.

| # | Item | Origem | Esforço |
|---|---|---|---|
| 4.1 | **Novidades — drawer já existe**, falta: persistência por usuário (lida/não-lida), auto-open na primeira sessão após uma novidade nova, badge no ícone. | 02:04 — "abre automaticamente quando tem novidade" | M |
| 4.2 | **Novidades — schema** (id, título, descrição, banner_url, data_publicacao, audiência, reactions). Tabela em `novidades` + endpoint `GET /novidades?since=...`. | 02:51 | M (backend) |
| 4.3 | **Novidades — feedback (emoji react)**. Salvar reação por usuário. | 03:17 — "feedback do pessoal" | S |
| 4.4 | **Notificações — definir taxonomia** com Natalia/Marcio: o que entra? Sugestão a validar: `pedido_aprovado`, `orcamento_virou_pedido`, `cliente_cadastrado`, `mensagem_recebida`, `pagamento_confirmado`, `nf_emitida`. | 01:02 — "que notificações seriam interessantes?" — pendente | M (definição) + L (engine) |
| 4.5 | **Notificações — drawer + badge + persistência** (lida/não-lida). | 01:02 | M |

**Bloqueio:** 4.4 precisa de **decisão da Natalia/cliente** sobre lista. Item pendente em § 7.

---

### Sprint 5 — Prêmio Venda Direta + Relatórios mínimo (1 semana)

Objetivo: novo módulo (Prêmio) + relatórios básicos para zerar a tela placeholder.

| # | Item | Origem | Esforço |
|---|---|---|---|
| 5.1 | **Tela Prêmio Venda Direta** — comissão acumulada do integrador, listagem de venda direta, valor recebido vs a receber, possibilidade de gerar nota de serviço. **Precisa de exemplo da tela atual** para entender campos. | 35:40, 36:54 — "alguém tem essa tela com alguma coisa?" — pendente | M (depois do exemplo) |
| 5.2 | **Relatórios — versão 1**: pedidos finalizados por período, déficit, exportar CSV. Apenas o suficiente pra remover sensação de "tela vazia". | 28:50 — "talvez seja interessante colocar uma opção" | M |

**Bloqueio:** 5.1 depende de print/exemplo da tela legada. Item em § 7.

---

### Sprint 6 — Loja, PDP, Calculadora, Carrinho lateral (1 semana)

Objetivo: refinos visuais + correções de UX descobertas na walkthrough.

| # | Item | Origem | Esforço |
|---|---|---|---|
| 6.1 | **Carrinho lateral (drawer)** — visível em qualquer tela via ícone do header. Mostra orçamento parcial com IPI/ST. | 00:18, 09:11 | M |
| 6.2 | **Header — espaço pro carrinho + notificações** ao lado do user-menu. ✅ *Parcialmente feito.* | 00:18 | S |
| 6.3 | **Loja — repensar bloco "Mais vendidos"**. Em vez de carrossel repetitivo (3 marcas só), virar **"Produto do dia / Em destaque"** configurável pelo time comercial. | 06:39, 07:33 | M |
| 6.4 | **PDP (Produto Detail)** — abas: Sobre / Especificações (STC + NOCT + físicas) / Manuais & Datasheets / Avaliações. Manuais via upload pelo TI. | 33:49, 34:19 | M |
| 6.5 | **PDP — avaliações**: link/QR enviado ao cliente final pós-compra, formulário curto, retorna nota + comentário pro PDP. | 31:24 | L (engine de envio) |
| 6.6 | **Calculadora — disclaimer jurídico** no rodapé do PDF gerado. Texto a ser revisado pelo jurídico ("não nos responsabilizamos pelo dimensionamento"). Botão "Compartilhar via WhatsApp" gera PDF e abre wa.me. | 18:46, 19:16 | S (UI) + decisão jurídica |
| 6.7 | **Calculadora — nichar como "compartilhável pelo integrador para o cliente final"**, não como lead capture B2C. Remover qualquer texto que sugira venda direta. | 16:43, 17:14 | S |

---

### Sprint 7+ — Integrações, área de tickets, post-launch (capacidade reservada)

| # | Item | Status |
|---|---|---|
| 7.1 | **Integração CRM Giovanni** — orçamento aprovado, status pedido, documentos cliente. | A planejar com Giovanni |
| 7.2 | **Tickets / sugestões do cliente** — campo na Central de Ajuda para o integrador mandar feedback estruturado. | Backlog (Natalia mencionou pós-experimentação) |
| 7.3 | **Configurações — integrações futuras** (lista placeholder hoje). | Backlog |
| 7.4 | **B2C calc / lead capture** — não fazer enquanto não houver vazão de lead. | Bloqueado por estratégia comercial |
| 7.5 | **Refino visual continuado** — cor azul mais clara, cantos arredondados nos botões (hoje DS é quadrado). Avaliar com a Natalia se quer evoluir o DS ou manter consistência. | Decisão visual aberta |

---

## 4. Visão por dimensão (não por sprint)

### 4.1. Modelo de dados afetado

```
clientes
  + endereco.area_rural_distancia_km   (NULLABLE, obrigatório se area_rural=true)

orcamentos
  + tipo: enum('revenda','venda_direta')
  + tipo_cliente: enum('pj','pf','nao_informar')   // restrito por tipo
  + validade_personalizada (boolean) + validade_data
  + observacao (text)
  + status: enum('pendente','aprovado','expirado','cancelado')   // 'aprovado' = sinal CRM

pedidos
  + status_pagamento: enum('aguardando','confirmado','bloqueado')
  + nfs (relacionamento) — XML, Danfe, NF eletrônica/manual

clientes_documentos
  + tipo: enum('rg','comprovante_residencia','outros')
  + arquivo_url, upload_em, upload_por

novidades
  + id, titulo, conteudo, banner_url, publicado_em, audiencia
novidades_leituras (user_id, novidade_id, lida_em, reacao)

notificacoes
  + tipo (enum), payload (jsonb), criada_em, lida_em, user_id

avaliacoes_produto
  + produto_id, cliente_id, nota, comentario, criada_em
  + token_envio (uuid p/ link público de avaliação)

premio_venda_direta
  + integrador_id, pedido_id, valor_comissao, status, nota_servico_url
```

### 4.2. Permissões por role

| Role | Vê | Edita |
|---|---|---|
| Integrador | próprios clientes (PF), próprios orçamentos/pedidos, próprio prêmio venda direta | nome+telefone do cliente, orçamento próprio em rascunho |
| Vendedor interno | todos os clientes, orçamentos/pedidos atribuídos | depende do CRM |
| Admin | tudo | tudo + usuários + configurações |

### 4.3. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| **CRM atrasa** e bloqueia status real de orçamento/pedido | Sprint 1.4 + 2.6 já entram com mock + feature flag; UI não bloqueia. |
| **Prêmio Venda Direta** sem exemplo de tela legada | Sprint 5 fica condicional; se não chegar exemplo, faz wireframe + valida antes. |
| **Calculadora pode gerar processo jurídico** se cliente final usar errado | Disclaimer + jurídico aprova texto antes do release. Marcar item como bloqueante. |
| **Notificações muito ruidosas** = usuário desativa tudo | Granularidade desde dia 1: usuário escolhe tipos em Configurações > Notificações. |
| **Documentos do cliente expostos** | Logs de auditoria de visualização desde o release. Treinamento interno antes. |

---

## 5. Métricas de sucesso por release

- **Sprint 1**: zero ocorrência de frete errado em área rural nos últimos 30 dias após release. Zero edição de e-mail por integrador.
- **Sprint 2**: tempo médio para criar orçamento ↓ 30%. Taxa de orçamento sem cliente associado ↓ 40%.
- **Sprint 3**: % de pedidos com NF baixada via plataforma > 60% em 30 dias.
- **Sprint 4**: > 70% dos integradores ativos veem ao menos 1 novidade por mês. Reactions > 0 em 50% das novidades.
- **Sprint 6**: tempo médio para finalizar checkout via Loja ↓ 20%. Taxa de uso da Calculadora pelo integrador (medido como compartilhamento) > 15% dos integradores ativos.

---

## 6. Que ficou bom o suficiente como está (não tocar)

Para evitar refactor desnecessário:

- **Sidebar** — design atual aprovado pela Natalia.
- **Login + Cadastro multi-step** — Natalia: "dá essa sensação de atualização".
- **Dashboard greeting + KPI cards + chart de histórico** — direção validada.
- **Monte seu Kit** — fora de escopo até nova sinalização ("muita regra de negócio").
- **DS atual** (cantos quadrados, azul atual) — manter até decisão explícita.

---

## 7. Decisões pendentes (precisam de Natalia / cliente)

1. **Lista oficial de tipos de notificação** (sprint 4.4). Sugestão minha como ponto de partida acima — precisa validação.
2. **Print ou exemplo da tela atual de Prêmio Venda Direta** (sprint 5.1). Sem isso a tela vai precisar ser inferida e validada por iteração.
3. **Texto jurídico do disclaimer da Calculadora** (sprint 6.6) — aguarda revisão jurídica.
4. **Quem aprova "orçamento aprovado"?** — está decidido que vem do CRM Giovanni, mas falta confirmar formato do webhook/API.
5. **Manuais/Datasheets dos produtos** (sprint 6.4) — quem mantém? Upload pelo TI? Vinculado ao SKU do ERP?
6. **Avaliação pós-compra** (sprint 6.5) — a Natalia mesma levantou que precisa pensar como mandar (link? formulário? QR? e-mail? WhatsApp?). Decisão aberta.
7. **Tickets / sugestões** (sprint 7.2) — quando? Após qual marco?
8. **Evolução de DS** — manter cantos quadrados ou migrar para arredondado? Natalia "vai ver se vão deixar". Precisa decisão para não fazer ambos.

---

## 8. Próxima ação recomendada

1. **Hoje/amanhã**: rodar este planejamento com a Natalia em 30min — validar prioridades de sprint 1 e 2, fechar pelo menos 4 dos 8 itens da seção § 7.
2. **Sprint 1 começa imediatamente após** com itens 1.1–1.6 (não dependem de mais ninguém).
3. **Em paralelo ao Sprint 1**, abrir conversa com Giovanni (CRM) para alinhar contrato de status de orçamento/pedido — Sprint 2.6 e 1.4 desbloqueiam dependentes.
4. **Demo gravada ao fim de cada sprint** + envio para cliente piloto + Natalia.

---

*Documento vivo. Atualizar ao fim de cada planning.*
