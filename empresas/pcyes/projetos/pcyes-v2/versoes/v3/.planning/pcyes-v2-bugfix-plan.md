# Plano de Correcao PCYES V2

Status geral: em andamento; implementacao concluida, validacao visual real bloqueada por dependencia nativa ausente do Chromium local
Ultima atualizacao: 2026-04-10

## Regra de retomada apos compactacao

Se o contexto compactar ou a sessao for retomada, leia este arquivo antes de continuar. Continue pelo primeiro item sem check em "Checklist de execucao", preserve alteracoes do usuario e nao mexa manualmente em `dist/` a menos que isso seja combinado depois.

## Skills em uso

- `frontend-design`: correcoes visuais, interacoes, modais, header, busca, filtros e responsividade.
- `code-security`: entradas de busca, modais de login, HTML de produto e comportamento de scroll lock sem efeitos globais inseguros.

## Escopo

Corrigir os 16 bugs e ajustes descritos pelo usuario, mantendo o comportamento visual premium do site e evitando regressao em tema claro/escuro, mobile/desktop, carrinho, login e navegacao de catalogo.

## Arquivos principais

- `src/app/components/FeaturedProduct.tsx`
- `src/app/components/BannerSection.tsx`
- `src/app/components/Navbar.tsx`
- `src/app/components/ProductsPage.tsx`
- `src/app/components/ProductPage.tsx`
- `src/app/components/CartDrawer.tsx`
- `src/app/components/ProfilePage.tsx`
- `src/app/components/AuthModal.tsx`
- `src/app/components/productPresentation.ts`
- `src/app/components/productsData.ts`

## Checklist de execucao

- [x] 1. Inventariar componentes reais e confirmar onde cada bug mora.
- [x] 2. Centralizar helpers de catalogo em `productPresentation.ts`: subcategoria, URL de catalogo e deteccao de imagens placeholder/mockup.
- [x] 3. Corrigir lancamentos: seta direita sem corte, carrossel real, seta esquerda apos avancar e CTAs apontando para o produto ativo.
- [x] 4. Corrigir banner "Monte seu setup": remover CTA flutuante global, prender CTA ao banner e reimplementar scroll expansivo apenas quando a secao estiver ativa.
- [x] 5. Implementar hierarquia `Home > Categoria > Subcategoria` com `category` e `subcategory` na URL.
- [x] 6. Ajustar filtros de subcategoria: esconder filtro global de categorias quando dentro de uma subcategoria e mostrar filtros correlacionados ao escopo.
- [x] 7. Corrigir busca do header: painel animado ancorado, sobrepondo tabs, largura limitada como referencia Keychron, Escape/click fora fechando e resultados sem placeholder.
- [x] 8. Corrigir clique de favoritos no header para abrir `/perfil?tab=favorites`.
- [x] 9. Sincronizar `ProfilePage` com query param `tab` e corrigir textos brancos em fundo claro.
- [x] 10. Revisar tags/badges brancas em PDP/cards e corrigir contraste ou remover quando nao fizer sentido.
- [x] 11. Corrigir modal de brinde para `fixed` no viewport, independente da posicao do scroll/drawer.
- [x] 12. Alterar fluxo do modal de brinde: selecionar opcao com estado pressionado, botao "Agora nao" a esquerda e "Selecionar" a direita; remover frase longa.
- [x] 13. Usar imagens reais nos brindes e remover produtos com mockup branco/placeholder das superficies de produto, busca e relacionados.
- [x] 14. Corrigir imagem do Maringa FC no megamenu usando imagem real existente na pagina/linha da collab.
- [x] 15. Melhorar filtro de preco: slider vermelho sem cortar, valores `R$` nos campos min/max e sem valor redundante abaixo.
- [x] 16. Remover botao de filtro duplicado no desktop, mantendo comportamento mobile.
- [x] 17. Deixar header contraido mais transparente com blur e contraste adequado.
- [x] 18. Bloquear scroll de fundo durante login/cadastro e restaurar ao fechar.
- [x] 19. Rodar verificacoes disponiveis: `npm run build`, servidor local Vite e smoke HTTP das rotas principais. Build passou; servidor local respondeu `200` em `/` e `/produtos?category=Perif%C3%A9ricos&subcategory=Teclados`.
- [ ] 20. Validar manualmente os fluxos no navegador: lancamentos, banner, megamenu, filtros, busca, favoritos, temas, brinde e login. Bloqueado no ambiente atual porque Playwright/Chromium nao abre sem `libnspr4.so`; `agent-browser` tambem nao esta instalado.

## Criterios de aceite por area

### Lancamentos

- Seta direita fica dentro do frame visual e funciona.
- Ao avancar, outro lancamento aparece.
- Seta esquerda so aparece depois do primeiro avanco.
- "Adicionar ao carrinho" e "Ver produto" usam o lancamento ativo.

### Banner "Monte seu setup"

- O botao nao fica flutuando pelo site.
- Ao chegar na secao, a tela trava no banner apenas enquanto o efeito de expansao esta em progresso.
- Scroll/touch expande o video.
- A pagina volta a rolar normalmente depois da expansao.

### Catalogo e hierarquia

- Megamenu navega para `Home > Categoria > Subcategoria`.
- Exemplo: `Home > Perifericos > Teclados`.
- Em subcategoria, a sidebar nao permite trocar para familias aleatorias como Monitores ou Cadeiras.
- Filtros exibidos sao correlacionados a subcategoria/familia atual.

### Busca

- Busca abre como painel ancorado no header, com animacao e largura limitada.
- Painel se sobrepoe as tabs sem ocupar ponta a ponta.
- Escape e click fora fecham.
- Resultados nao exibem mockup/placeholder.

### Favoritos e perfil

- Coracao do header abre Favoritos, nao Meus Pedidos.
- `/perfil` continua em Meus Pedidos.
- `/perfil?tab=favorites` abre Favoritos.
- Tema claro nao tem texto branco sobre fundo claro.

### Brinde

- Modal aparece no centro do viewport, mesmo se o usuario estiver no meio/fim da pagina.
- Opcoes usam fotos reais.
- Clicar numa opcao so seleciona visualmente; o item entra no carrinho apenas ao clicar "Selecionar".
- Frase "Voce pode abrir essa selecao novamente..." removida.

### Login

- Fundo nao rola com modal aberto.
- Ao fechar, scroll volta ao normal.

## Notas tecnicas

- `productsData.ts` ja possui `subcategory`; preferir usar esse campo antes de inferencias por nome.
- O repo estava com `dist/` sujo antes desta tarefa. `npm run build` foi executado em 2026-04-10 e passou, mas tambem atualizou artefatos em `dist/`.
- `npm run build` foi executado novamente em 2026-04-10 apos o ajuste de galerias/imagens e passou. O build gerou novos assets em `dist/`.
- O servidor local `npm run dev -- --host 127.0.0.1 --port 5173` subiu com sucesso em 2026-04-10. Smoke HTTP via `curl -I` retornou `200 OK` para `/` e para `/produtos?category=Perif%C3%A9ricos&subcategory=Teclados`.
- Tentativa de screenshot via `npx playwright screenshot http://127.0.0.1:5173/ /tmp/pcyes-home.png` falhou porque o Chromium local nao encontra `libnspr4.so`. Nao marcar a validacao visual completa sem um navegador funcional.
- Produtos com imagem de categoria `/home/...` ou mockup branco devem ser filtrados das superficies de produto, mas assets de categoria podem continuar sendo usados como banners/categorias.
- Se houver necessidade de sanitizar HTML de produto, manter a sanitizacao existente e nao usar `dangerouslySetInnerHTML` com entrada nova sem filtro.
