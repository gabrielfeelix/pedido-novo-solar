import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');
const workspace = JSON.parse(readFileSync(join(repoRoot, 'workspace.json'), 'utf8'));
const publicRoot = join(repoRoot, 'public');
const tempRoot = join(repoRoot, '.prototype-build');
const logoSourceRoot = join(repoRoot, 'brand-assets');

const logoFiles = [
  'azux.svg',
  'oderco-symbol.svg',
  'odex.svg',
  'pcyes-symbol.png',
  'quati.svg',
  'skul.svg',
  'tonante-symbol.png',
  'vinik.svg',
];

function run(command, args, cwd, env = {}) {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: {
      ...process.env,
      ...env,
    },
  });
}

function getProjects(company) {
  return company.projects || [];
}

function getPrototypes(project) {
  return project.prototypes || [];
}

function getAllProjects() {
  return workspace.companies.flatMap((company) =>
    getProjects(company).map((project) => ({ company, project })),
  );
}

function getAllPrototypes() {
  return getAllProjects().flatMap(({ company, project }) =>
    getPrototypes(project).map((prototype) => ({ company, project, prototype })),
  );
}

rmSync(tempRoot, { recursive: true, force: true });
rmSync(join(publicRoot, 'p'), { recursive: true, force: true });
rmSync(join(publicRoot, '_prototypes'), { recursive: true, force: true });
rmSync(join(publicRoot, 'pedido-novo-solar'), { recursive: true, force: true });
rmSync(join(publicRoot, 'v2'), { recursive: true, force: true });
rmSync(join(publicRoot, 'brand-assets'), { recursive: true, force: true });
for (const company of workspace.companies) {
  rmSync(join(publicRoot, company.slug), { recursive: true, force: true });
}

mkdirSync(publicRoot, { recursive: true });
mkdirSync(tempRoot, { recursive: true });
copyBrandAssets();

for (const { prototype } of getAllPrototypes()) {
  if (!prototype.source) {
    continue;
  }

  const sourceDir = join(repoRoot, prototype.source);
  const distDir = join(tempRoot, prototype.slug);
  const destinationDir = join(publicRoot, 'p', prototype.slug);
  const basePath = `/p/${prototype.slug}/`;

  if (!existsSync(join(sourceDir, 'package.json'))) {
    throw new Error(`Missing package.json for prototype "${prototype.slug}" at ${sourceDir}`);
  }

  console.log(`\nBuilding ${prototype.name} at ${basePath}`);
  run('npm', ['install'], sourceDir);
  run('npm', ['run', 'build'], sourceDir, {
    PROTOTYPE_BASE_PATH: basePath,
    PROTOTYPE_OUT_DIR: distDir,
  });

  if (!existsSync(distDir)) {
    throw new Error(`Build did not create dist for prototype "${prototype.slug}"`);
  }

  cpSync(distDir, destinationDir, { recursive: true });
}

writeSite();
rmSync(tempRoot, { recursive: true, force: true });

function copyBrandAssets() {
  const destination = join(publicRoot, 'brand-assets');
  mkdirSync(destination, { recursive: true });

  for (const file of logoFiles) {
    const source = join(logoSourceRoot, file);
    if (existsSync(source)) {
      cpSync(source, join(destination, file));
    } else {
      throw new Error(`Missing brand asset "${file}" at ${source}`);
    }
  }
}

function writeSite() {
  writePage('index.html', createShell({
    title: 'UX Oderco',
    body: renderCompanyIndex(),
  }));

  for (const company of workspace.companies) {
    writePage(`${company.slug}/index.html`, createShell({
      title: `UX Oderco | ${company.name}`,
      body: renderWorkspace(company, 'overview'),
    }));
    writePage(`${company.slug}/projetos/index.html`, createShell({
      title: `UX Oderco | ${company.name}`,
      body: renderWorkspace(company, 'projects'),
    }));

    for (const project of getProjects(company)) {
      writePage(`${company.slug}/projetos/${project.slug}/index.html`, createShell({
        title: `UX Oderco | ${project.name}`,
        body: renderProjectDetail(company, project),
      }));
    }
  }
}

function writePage(relativePath, html) {
  const file = join(publicRoot, relativePath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

function createShell({ title, body }) {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(workspace.description)}">
    <style>${styles()}</style>
  </head>
  <body>
    ${body}
  </body>
</html>
`;
}

function renderCompanyIndex() {
  const totalProjects = getAllProjects().length;
  const totalPrototypes = getAllPrototypes().length;
  const companyCards = workspace.companies
    .map((company, index) => {
      const projects = getProjects(company);
      const prototypes = projects.flatMap(getPrototypes);
      return `<a class="company-card reveal" style="--accent:${company.brandColor};--delay:${index * 45}ms" href="/${company.slug}">
        ${renderLogo(company, 'company-logo')}
        <span class="company-copy">
          <strong>${escapeHtml(company.name)}</strong>
          <small>${escapeHtml(company.description)}</small>
        </span>
        <span class="company-stats">${projects.length} projetos · ${prototypes.length} protótipos</span>
      </a>`;
    })
    .join('');

  return `<main class="landing">
    <section class="hero-panel">
      <div class="hero-copy">
        <p class="eyebrow">UX Oderco</p>
        <h1>Escolha uma empresa para abrir o workspace.</h1>
        <p class="lead">Um repositorio visual para projetos, handoffs, prototipos e versoes escolhidas.</p>
      </div>
      <div class="hero-metrics">
        <span><strong>${workspace.companies.length}</strong> empresas</span>
        <span><strong>${totalProjects}</strong> projetos</span>
        <span><strong>${totalPrototypes}</strong> protótipos</span>
      </div>
    </section>
    <section class="company-grid" aria-label="Empresas">
      ${companyCards}
    </section>
  </main>`;
}

function renderWorkspace(company, view) {
  const projects = getProjects(company);
  const prototypes = projects.flatMap(getPrototypes);
  const selected = projects.filter((project) => project.selectedPrototypeId).length;

  return `<main class="workspace-shell" style="--accent:${company.brandColor}">
    ${renderSidebar(company)}
    <section class="workspace-main">
      <header class="workspace-header glass">
        <div>
          <p class="eyebrow">${escapeHtml(company.name)} Workspace</p>
          <h1>${view === 'projects' ? 'Projetos' : 'Painel de UX'}</h1>
          <p class="lead">${escapeHtml(company.description)}</p>
        </div>
        ${renderLogo(company, 'header-logo')}
      </header>
      <section class="metric-row">
        ${renderMetric('Projetos ativos', projects.length)}
        ${renderMetric('Protótipos', prototypes.length)}
        ${renderMetric('Escolhidos', selected)}
        ${renderMetric('Pendentes', Math.max(projects.length - selected, 0))}
      </section>
      ${view === 'projects' ? renderProjectList(company) : renderOverview(company)}
    </section>
  </main>`;
}

function renderProjectDetail(company, project) {
  const prototypes = getPrototypes(project);
  const selectedPrototype = prototypes.find((prototype) => prototype.id === project.selectedPrototypeId);

  return `<main class="workspace-shell" style="--accent:${company.brandColor}">
    ${renderSidebar(company)}
    <section class="workspace-main">
      <header class="workspace-header glass">
        <div>
          <p class="eyebrow">${escapeHtml(company.name)} · Projeto</p>
          <h1>${escapeHtml(project.name)}</h1>
          <p class="lead">${selectedPrototype ? `Versao escolhida: ${escapeHtml(selectedPrototype.name)} ${escapeHtml(selectedPrototype.version)}` : 'Nenhuma versao escolhida ainda.'}</p>
        </div>
        <div class="quick-actions">
          ${renderAction(project.figmaUrl, 'Figma')}
          ${renderAction(project.handoffUrl, 'Handoff')}
        </div>
      </header>
      <section class="project-detail-grid">
        <article class="glass detail-panel">
          <p class="eyebrow">Versoes</p>
          <h2>Protótipos do projeto</h2>
          <div class="prototype-list">
            ${prototypes.map((prototype) => renderPrototypeCard(project, prototype)).join('')}
          </div>
        </article>
        <aside class="glass detail-panel">
          <p class="eyebrow">Links</p>
          <h2>Handoff e origem</h2>
          <div class="link-stack">
            ${renderAction(project.figmaUrl, 'Abrir Figma')}
            ${renderAction(project.handoffUrl, 'Abrir handoff')}
            ${selectedPrototype ? renderAction(`/p/${selectedPrototype.slug}`, 'Abrir escolhido') : ''}
          </div>
        </aside>
      </section>
    </section>
  </main>`;
}

function renderSidebar(company) {
  const items = [
    ['Projetos', `/${company.slug}/projetos`, 'grid'],
    ['Protótipos', `/${company.slug}/projetos`, 'play'],
    ['Handoffs', `/${company.slug}/projetos`, 'file'],
    ['Arquivos', `/${company.slug}`, 'folder'],
    ['Config', `/${company.slug}`, 'gear'],
  ];

  return `<aside class="sidebar glass">
    <a class="brand-lockup" href="/">
      ${renderLogo(company, 'sidebar-logo')}
      <span>${escapeHtml(company.name)}</span>
    </a>
    <nav>
      ${items.map(([label, href, icon]) => `<a href="${href}" title="${label}">${iconSvg(icon)}<span>${label}</span></a>`).join('')}
    </nav>
  </aside>`;
}

function renderOverview(company) {
  const projects = getProjects(company);
  const selectedProjects = projects.filter((project) => project.selectedPrototypeId);

  return `<section class="dashboard-grid">
    <article class="glass feature-card">
      <p class="eyebrow">Projetos recentes</p>
      <h2>${projects.length ? `${projects.length} projeto(s) em andamento` : 'Sem projetos cadastrados ainda'}</h2>
      <p>${projects.length ? 'Abra a aba Projetos para comparar versoes, handoffs e links de Figma.' : 'Quando chegar o primeiro prototipo desta empresa, ele aparece aqui automaticamente pelo manifesto.'}</p>
      <a class="button-link" href="/${company.slug}/projetos">Ver projetos</a>
    </article>
    <article class="glass list-panel">
      <p class="eyebrow">Escolhidos</p>
      ${selectedProjects.length ? selectedProjects.map((project) => {
        const prototype = getPrototypes(project).find((item) => item.id === project.selectedPrototypeId);
        return `<a class="compact-row" href="/${company.slug}/projetos/${project.slug}">
          <span><strong>${escapeHtml(project.name)}</strong><small>${prototype ? escapeHtml(prototype.name) : 'Versao definida no manifesto'}</small></span>
          <b>Escolhido</b>
        </a>`;
      }).join('') : '<p class="empty">Nenhuma versao escolhida para esta empresa.</p>'}
    </article>
  </section>`;
}

function renderProjectList(company) {
  const projects = getProjects(company);
  const projectCards = projects.length
    ? projects.map((project) => renderProjectCard(company, project)).join('')
    : `<article class="glass empty-card">
        <p class="eyebrow">Sem projetos</p>
        <h2>Nenhum projeto cadastrado para ${escapeHtml(company.name)}.</h2>
        <p>Adicione um projeto no manifesto para ele aparecer nesta area.</p>
      </article>`;

  return `<section class="toolbar glass">
    <input aria-label="Buscar projetos" placeholder="Buscar por projeto, prototipo ou status">
    <div class="segmented">
      <span>Todos</span>
      <span>Ativos</span>
      <span>Escolhidos</span>
    </div>
  </section>
  <section class="project-grid">${projectCards}</section>`;
}

function renderProjectCard(company, project) {
  const prototypes = getPrototypes(project);
  const selectedPrototype = prototypes.find((prototype) => prototype.id === project.selectedPrototypeId);

  return `<article class="project-card glass">
    <div class="project-card-top">
      <span class="status-pill">${escapeHtml(project.status || 'rascunho')}</span>
      ${selectedPrototype ? '<span class="selected-pill">Escolhido</span>' : ''}
    </div>
    <h2>${escapeHtml(project.name)}</h2>
    <p>${selectedPrototype ? escapeHtml(selectedPrototype.notes || selectedPrototype.name) : 'Projeto aguardando prototipo escolhido.'}</p>
    <div class="project-meta">
      <span>${prototypes.length} versões</span>
      <span>${project.figmaUrl ? 'Figma vinculado' : 'Sem Figma'}</span>
      <span>${project.handoffUrl ? 'Handoff pronto' : 'Sem handoff'}</span>
    </div>
    <div class="card-actions">
      <a href="/${company.slug}/projetos/${project.slug}">Detalhes</a>
      ${selectedPrototype ? `<a href="/p/${selectedPrototype.slug}">Abrir protótipo</a>` : ''}
    </div>
  </article>`;
}

function renderPrototypeCard(project, prototype) {
  const selected = prototype.id === project.selectedPrototypeId || prototype.isSelected;

  return `<article class="prototype-card">
    <div>
      <p class="version">${escapeHtml(prototype.version)}</p>
      <h3>${escapeHtml(prototype.name)}</h3>
      <p>${escapeHtml(prototype.notes || '')}</p>
      <small>${escapeHtml(prototype.createdAt || '')}</small>
    </div>
    <div class="prototype-actions">
      ${selected ? '<span class="selected-pill">Escolhido</span>' : ''}
      <a href="/p/${prototype.slug}">Abrir</a>
    </div>
  </article>`;
}

function renderMetric(label, value) {
  return `<article class="metric glass"><strong>${value}</strong><span>${label}</span></article>`;
}

function renderAction(url, label) {
  if (!url) {
    return '';
  }

  return `<a class="button-link" href="${escapeAttribute(url)}">${escapeHtml(label)}</a>`;
}

function renderLogo(company, className) {
  if (company.logo) {
    return `<span class="${className} logo-mark" style="--accent:${company.brandColor}"><img src="${escapeAttribute(company.logo)}" alt=""></span>`;
  }

  return `<span class="${className} logo-mark fallback-logo" style="--accent:${company.brandColor}">${escapeHtml(company.name.slice(0, 2).toUpperCase())}</span>`;
}

function iconSvg(name) {
  const icons = {
    grid: '<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    file: '<svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6zM14 3v5h5"/></svg>',
    folder: '<svg viewBox="0 0 24 24"><path d="M3 6h7l2 2h9v10H3z"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="M4 12h2m12 0h2M12 4v2m0 12v2"/></svg>',
  };

  return icons[name] || icons.grid;
}

function styles() {
  return `
    :root {
      --ink: #0d0f14;
      --muted: rgba(255,255,255,.62);
      --panel: rgba(17,18,24,.68);
      --panel-strong: rgba(255,255,255,.86);
      --stroke: rgba(255,255,255,.16);
      --surface: #dadce4;
      --accent: #2458e6;
      font-family: "Aptos", "Segoe UI", ui-sans-serif, system-ui, sans-serif;
    }
    * { box-sizing: border-box; }
    html { min-height: 100%; background: #b7b4ba; }
    body {
      min-height: 100vh;
      margin: 0;
      color: white;
      background:
        radial-gradient(circle at 12% 10%, rgba(255,120,62,.22), transparent 27rem),
        radial-gradient(circle at 78% 12%, rgba(55,93,237,.24), transparent 30rem),
        linear-gradient(135deg, #b7b4ba, #dfe5ef 48%, #bac6d9);
      letter-spacing: 0;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image: linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px);
      background-size: 44px 44px;
      mask-image: radial-gradient(circle at center, black, transparent 76%);
    }
    a { color: inherit; text-decoration: none; }
    .landing {
      width: min(1180px, calc(100% - 32px));
      margin: 0 auto;
      padding: 48px 0;
    }
    .hero-panel, .workspace-shell {
      border: 1px solid rgba(255,255,255,.28);
      background: linear-gradient(135deg, rgba(12,13,16,.86), rgba(25,27,34,.72));
      box-shadow: 0 28px 80px rgba(34,31,38,.28);
      backdrop-filter: blur(28px);
    }
    .hero-panel {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 24px;
      border-radius: 10px;
      padding: clamp(28px, 5vw, 56px);
      overflow: hidden;
      position: relative;
    }
    .hero-panel::after {
      content: "";
      position: absolute;
      inset: auto -8% -42% 44%;
      height: 260px;
      background: radial-gradient(circle, rgba(255,255,255,.2), transparent 66%);
      transform: rotate(-8deg);
    }
    .eyebrow {
      margin: 0 0 10px;
      color: rgba(255,255,255,.64);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .12em;
      text-transform: uppercase;
    }
    h1, h2, h3, p { margin-top: 0; }
    h1 {
      max-width: 720px;
      margin-bottom: 14px;
      font-size: clamp(36px, 7vw, 76px);
      line-height: .94;
      font-weight: 760;
    }
    h2 { margin-bottom: 12px; font-size: 24px; line-height: 1.08; }
    h3 { margin-bottom: 8px; font-size: 17px; }
    .lead { max-width: 620px; color: rgba(255,255,255,.7); line-height: 1.55; }
    .hero-metrics {
      display: grid;
      gap: 12px;
      align-content: end;
      min-width: 180px;
    }
    .hero-metrics span, .metric, .glass {
      border: 1px solid var(--stroke);
      background: rgba(255,255,255,.09);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 18px 45px rgba(0,0,0,.16);
      backdrop-filter: blur(22px);
    }
    .hero-metrics span {
      border-radius: 999px;
      padding: 10px 14px;
      color: rgba(255,255,255,.72);
    }
    .hero-metrics strong { color: white; font-size: 22px; }
    .company-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-top: 18px;
    }
    .company-card {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 14px;
      min-height: 150px;
      border: 1px solid rgba(255,255,255,.34);
      border-radius: 10px;
      padding: 18px;
      color: #101217;
      background: rgba(255,255,255,.52);
      backdrop-filter: blur(24px);
      box-shadow: 0 18px 55px rgba(30,37,52,.14);
      transition: transform .22s ease, border-color .22s ease, background .22s ease;
      animation: rise .5s ease both;
      animation-delay: var(--delay);
    }
    .company-card:hover { transform: translateY(-4px); border-color: color-mix(in srgb, var(--accent), white 18%); background: rgba(255,255,255,.72); }
    .company-copy strong { display:block; font-size: 18px; margin-top: 6px; }
    .company-copy small { display:block; margin-top: 7px; color: rgba(16,18,23,.62); line-height: 1.4; }
    .company-stats { grid-column: 1 / -1; color: rgba(16,18,23,.56); font-size: 13px; }
    .logo-mark {
      display: inline-flex;
      width: 44px;
      height: 44px;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background: color-mix(in srgb, var(--accent), black 8%);
      overflow: hidden;
    }
    .logo-mark img { width: 72%; height: 72%; object-fit: contain; }
    .fallback-logo { color: white; font-size: 13px; font-weight: 800; }
    .workspace-shell {
      display: grid;
      grid-template-columns: 92px 1fr;
      gap: 18px;
      width: min(1240px, calc(100% - 24px));
      min-height: calc(100vh - 44px);
      margin: 22px auto;
      padding: 18px;
      border-radius: 12px;
    }
    .sidebar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 26px;
      border-radius: 22px;
      padding: 18px 10px;
      background: rgba(8,9,12,.48);
    }
    .brand-lockup { display: grid; gap: 8px; justify-items: center; font-size: 11px; font-weight: 800; }
    .sidebar-logo { width: 48px; height: 48px; }
    nav { display: grid; gap: 12px; width: 100%; }
    nav a {
      display: grid;
      place-items: center;
      gap: 5px;
      min-height: 58px;
      border-radius: 16px;
      color: rgba(255,255,255,.7);
      transition: background .18s ease, color .18s ease;
    }
    nav a:hover { background: rgba(255,255,255,.12); color: white; }
    nav svg { width: 19px; height: 19px; fill: none; stroke: currentColor; stroke-width: 1.8; }
    nav span { font-size: 10px; }
    .workspace-main { display: grid; align-content: start; gap: 14px; min-width: 0; }
    .workspace-header {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: center;
      border-radius: 22px;
      padding: 28px;
    }
    .workspace-header h1 { font-size: clamp(30px, 5vw, 52px); }
    .header-logo { width: 76px; height: 76px; border-radius: 24px; flex: 0 0 auto; }
    .metric-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
    .metric { border-radius: 18px; padding: 16px; }
    .metric strong { display:block; font-size: 28px; }
    .metric span { color: rgba(255,255,255,.62); font-size: 13px; }
    .dashboard-grid, .project-detail-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(280px, .65fr); gap: 14px; }
    .feature-card, .list-panel, .detail-panel, .empty-card, .toolbar, .project-card {
      border-radius: 22px;
      padding: 22px;
    }
    .feature-card {
      min-height: 260px;
      background:
        linear-gradient(135deg, color-mix(in srgb, var(--accent), white 24%), rgba(255,255,255,.1)),
        rgba(255,255,255,.1);
    }
    .feature-card p, .empty-card p, .project-card p, .prototype-card p { color: rgba(255,255,255,.68); line-height: 1.5; }
    .button-link, .card-actions a, .prototype-actions a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px;
      border-radius: 999px;
      padding: 0 15px;
      border: 1px solid rgba(255,255,255,.2);
      background: rgba(255,255,255,.9);
      color: #111217;
      font-size: 13px;
      font-weight: 800;
    }
    .compact-row {
      display:flex;
      justify-content:space-between;
      gap:14px;
      align-items:center;
      padding: 13px 0;
      border-bottom: 1px solid rgba(255,255,255,.12);
    }
    .compact-row small { display:block; margin-top: 4px; color: rgba(255,255,255,.55); }
    .compact-row b, .selected-pill {
      display:inline-flex;
      align-items:center;
      min-height: 28px;
      border-radius: 999px;
      padding: 0 10px;
      background: color-mix(in srgb, var(--accent), white 12%);
      color: white;
      font-size: 12px;
    }
    .toolbar {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }
    .toolbar input {
      width: min(420px, 100%);
      min-height: 42px;
      border: 1px solid rgba(255,255,255,.16);
      border-radius: 999px;
      padding: 0 16px;
      color: white;
      background: rgba(0,0,0,.22);
      outline: none;
    }
    .toolbar input::placeholder { color: rgba(255,255,255,.48); }
    .segmented { display:flex; gap:6px; padding: 5px; border-radius: 999px; background: rgba(0,0,0,.18); }
    .segmented span { padding: 8px 11px; border-radius: 999px; color: rgba(255,255,255,.66); font-size: 12px; }
    .segmented span:first-child { background: white; color: #111217; font-weight: 800; }
    .project-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
    .project-card-top, .card-actions, .prototype-actions, .quick-actions, .link-stack { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
    .project-card-top { justify-content: space-between; margin-bottom: 18px; }
    .status-pill {
      display:inline-flex;
      align-items:center;
      min-height: 28px;
      border-radius: 999px;
      padding: 0 10px;
      background: rgba(255,255,255,.12);
      color: rgba(255,255,255,.74);
      font-size: 12px;
      text-transform: capitalize;
    }
    .project-meta {
      display:grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin: 20px 0;
    }
    .project-meta span {
      min-height: 46px;
      border-radius: 14px;
      padding: 10px;
      background: rgba(255,255,255,.08);
      color: rgba(255,255,255,.68);
      font-size: 12px;
    }
    .prototype-list { display:grid; gap: 10px; }
    .prototype-card {
      display:flex;
      justify-content:space-between;
      gap: 14px;
      padding: 16px;
      border: 1px solid rgba(255,255,255,.14);
      border-radius: 18px;
      background: rgba(255,255,255,.08);
    }
    .prototype-card small, .version, .empty { color: rgba(255,255,255,.54); }
    .version { margin-bottom: 6px; font-size: 12px; font-weight: 900; text-transform: uppercase; }
    @keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 920px) {
      .company-grid, .project-grid, .dashboard-grid, .project-detail-grid, .metric-row { grid-template-columns: 1fr; }
      .hero-panel { grid-template-columns: 1fr; }
      .workspace-shell { grid-template-columns: 1fr; }
      .sidebar { position: sticky; top: 8px; z-index: 2; flex-direction: row; justify-content: space-between; overflow-x: auto; }
      nav { display:flex; width:auto; }
      nav a { min-width: 70px; }
      .workspace-header, .toolbar { align-items:flex-start; flex-direction: column; }
    }
    @media (max-width: 560px) {
      .landing { width: min(100% - 20px, 1180px); padding: 16px 0; }
      .workspace-shell { width: calc(100% - 12px); margin: 6px auto; padding: 10px; }
      .workspace-header { padding: 18px; }
      .header-logo { width: 56px; height: 56px; }
      .project-meta { grid-template-columns: 1fr; }
    }
  `;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}
