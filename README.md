# UX Oderco

Workspace para empresas, projetos, handoffs e protótipos de UX.

## Como rodar

```bash
npm install
npm run build
npm run dev
```

O build da raiz instala e compila os protótipos declarados em `workspace.json`, copiando os arquivos finais para `public/{empresa}/{projeto}/{versao}`.

## Estrutura

- `/` - portal do UX Hub
- `/app`, `/scripts`, `workspace.json` - infraestrutura do portal
- `/brand-assets` - marcas e imagens compartilhadas
- `/empresas/{empresa}` - acervo de uma empresa
- `/empresas/{empresa}/projetos/{projeto}` - materiais de um projeto
- `/empresas/{empresa}/projetos/{projeto}/versoes/{versao}` - versão prototipada
- `/public/{empresa}/{projeto}/{versao}` - build publicado pelo portal

Exemplos atuais:

- `empresas/pcyes/projetos/pcyes-v2/versoes/v2`
- `empresas/crm/projetos/novo-pedido-solar/versoes/v1`
- `empresas/crm/projetos/novo-pedido-solar/versoes/v2`
- `empresas/odex/projetos/website/versoes/v1`
- `empresas/odex/projetos/website/versoes/v2`

## Credenciais

Não commitamos segredos. Use `.env.example` como contrato local e mantenha os valores reais no Vercel Environment Variables.

Depois de linkar a raiz ao projeto Vercel, agentes podem hidratar credenciais locais com:

```bash
vercel env pull .env.local
```
