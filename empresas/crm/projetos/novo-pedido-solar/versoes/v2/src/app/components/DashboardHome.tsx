import odercoLogo from 'figma:asset/fd8c78f59896c0b87e14b7308ac1d2fb24b260f7.png';

export function DashboardHome() {
  return (
    <section
      className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 50% 46%, rgba(9, 23, 65, 0.03) 0%, rgba(9, 23, 65, 0.015) 14%, rgba(245, 245, 245, 0) 36%), var(--background)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 22%), linear-gradient(90deg, rgba(9, 23, 65, 0.02) 0%, rgba(9, 23, 65, 0) 18%, rgba(9, 23, 65, 0) 82%, rgba(9, 23, 65, 0.02) 100%)',
        }}
      />

      <div className="relative flex flex-col items-center justify-center px-8 py-16 text-center">
        <div
          className="absolute left-1/2 top-1/2 -z-10 rounded-full blur-3xl"
          style={{
            width: '520px',
            height: '520px',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(9, 23, 65, 0.05) 0%, rgba(9, 23, 65, 0.015) 38%, rgba(9, 23, 65, 0) 72%)',
          }}
        />

        <img
          src={odercoLogo}
          alt="Oderco"
          className="select-none"
          style={{
            width: 'min(420px, 44vw)',
            minWidth: '240px',
            opacity: 0.09,
            filter: 'grayscale(1) saturate(0)',
          }}
          draggable={false}
        />

        <div className="mt-10 max-w-xl">
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'color-mix(in srgb, var(--foreground) 28%, white)',
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            Central de operacoes
          </p>
          <h1
            className="mt-4"
            style={{
              fontFamily: "'Red Hat Display', sans-serif",
              fontSize: 'clamp(32px, 4vw, 52px)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: 'color-mix(in srgb, var(--foreground) 18%, white)',
              fontWeight: '800',
            }}
          >
            Dashboard inicial
          </h1>
          <p
            className="mx-auto mt-4"
            style={{
              maxWidth: '520px',
              fontSize: '15px',
              lineHeight: 1.7,
              color: 'color-mix(in srgb, var(--foreground) 38%, white)',
            }}
          >
            Tela de entrada do CRM com area limpa para futuras visoes, atalhos e indicadores.
          </p>
        </div>
      </div>
    </section>
  );
}
