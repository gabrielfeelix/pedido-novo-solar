# UX Oderco

Workspace estático para empresas, projetos, handoffs e protótipos de UX.

## Como rodar

```bash
npm install
npm run build
npm run dev
```

O build da raiz instala e compila os protótipos declarados em `workspace.json`, copiando os arquivos finais para `public/p/{slug}`.

## Estrutura

- `/` - lista de empresas
- `/oderco` - workspace da empresa
- `/oderco/projetos` - projetos da empresa
- `/oderco/projetos/pedido-solar` - detalhe do projeto
- `/p/pedido-solar-v2` - protótipo publicado

## Credenciais

Não commitamos segredos. Use `.env.example` como contrato local e mantenha os valores reais no Vercel Environment Variables.

Depois de linkar a raiz ao projeto Vercel, agentes podem hidratar credenciais locais com:

```bash
vercel env pull .env.local
```
