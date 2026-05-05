import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function isSafeSlug(s: string) {
  return /^[a-z0-9][a-z0-9-]{0,60}$/.test(s);
}

type PrototypeRequestBody = {
  slug?: unknown;
  companyName?: unknown;
  prototypeName?: unknown;
  brandColor?: unknown;
  notes?: unknown;
};

function placeholderHtml({
  companyName,
  prototypeName,
  brandColor,
  notes,
}: {
  companyName: string;
  prototypeName: string;
  brandColor: string;
  notes: string;
}) {
  const safeNotes = notes.replace(/</g, '&lt;');
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${prototypeName} · ${companyName}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: #0B1020;
    background:
      radial-gradient(900px 500px at 0% 0%, ${brandColor}22, transparent 60%),
      radial-gradient(700px 400px at 100% 0%, #DDE5FA, transparent 60%),
      linear-gradient(180deg, #EEF1F8, #E6EBF5);
    display: grid;
    place-items: center;
    padding: 24px;
  }
  .card {
    width: min(560px, 100%);
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.9);
    border-radius: 28px;
    padding: 32px;
    box-shadow: 0 24px 48px -24px rgba(15,23,42,0.2);
  }
  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: ${brandColor}14; color: ${brandColor};
    border: 1px solid ${brandColor}26;
    padding: 4px 10px; border-radius: 999px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
  }
  h1 { font-size: 28px; letter-spacing: -0.02em; margin: 14px 0 8px; }
  p { color: #475569; line-height: 1.55; margin: 0; }
  .meta { color: #64748B; font-size: 12px; margin-top: 18px; }
  .notes { margin-top: 18px; padding: 14px; background: white; border-radius: 14px; border: 1px solid #E2E8F0; font-size: 13px; white-space: pre-wrap; }
</style>
</head>
<body>
  <div class="card">
    <span class="badge">${companyName}</span>
    <h1>${prototypeName}</h1>
    <p>Pasta criada com sucesso. Substitua este <code>index.html</code> pelo build do seu protótipo.</p>
    ${safeNotes ? `<div class="notes">${safeNotes}</div>` : ''}
    <p class="meta">Gerado pelo UX Hub · ${new Date().toLocaleDateString('pt-BR')}</p>
  </div>
</body>
</html>`;
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { ok: false, error: 'Criação de pasta só funciona em desenvolvimento.' },
      { status: 400 }
    );
  }

  let body: PrototypeRequestBody;
  try {
    body = (await req.json()) as PrototypeRequestBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'Body inválido' }, { status: 400 });
  }

  const slug = typeof body.slug === 'string' ? body.slug : '';
  const companyName = typeof body.companyName === 'string' ? body.companyName : '';
  const prototypeName =
    typeof body.prototypeName === 'string' ? body.prototypeName : slug;
  const brandColor =
    typeof body.brandColor === 'string' ? body.brandColor : '#0B1020';
  const notes = typeof body.notes === 'string' ? body.notes : '';
  if (!slug || !isSafeSlug(slug)) {
    return NextResponse.json(
      { ok: false, error: 'slug inválido (use a-z, 0-9, hífen)' },
      { status: 400 }
    );
  }

  const baseDir = join(process.cwd(), 'public', 'p', slug);
  if (existsSync(baseDir)) {
    return NextResponse.json({
      ok: true,
      path: `/p/${slug}`,
      reused: true,
    });
  }

  try {
    mkdirSync(baseDir, { recursive: true });
    writeFileSync(
      join(baseDir, 'index.html'),
      placeholderHtml({
        companyName: String(companyName || ''),
        prototypeName: String(prototypeName || slug),
        brandColor: String(brandColor),
        notes: String(notes),
      }),
      'utf-8'
    );
    return NextResponse.json({ ok: true, path: `/p/${slug}`, reused: false });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Falha ao criar' },
      { status: 500 }
    );
  }
}
