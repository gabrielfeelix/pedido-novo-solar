import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  ChevronRight, Sun, Moon,
  Link2, Package, BookOpen, Bell, LogOut,
} from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Breadcrumb, type BreadcrumbItem } from './ui/Breadcrumb';
import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem,
  NavigationMenuTrigger, NavigationMenuContent,
  NavigationMenuLink, NavigationMenuLinkTitle,
  NavigationMenuLinkDescription,
} from './ui/navigation-menu';
import { allProducts } from '../data/mockData';
import { PedidoProvider } from '../context/PedidoContext';
import odercoLogo from 'figma:asset/fd8c78f59896c0b87e14b7308ac1d2fb24b260f7.png';

/* ── Navigation data with descriptions ── */
interface NavChild {
  label: string;
  description: string;
  path: string;
}

interface NavItem {
  label: string;
  children: NavChild[];
}

const topNav: NavItem[] = [
  {
    label: 'Dashboard',
    children: [
      { label: 'Dashboard Consultor', description: 'Gerencie o dashboard consultor do sistema', path: '/dashboard' },
    ],
  },
  {
    label: 'Vendas',
    children: [
      { label: 'Carteira de Clientes', description: 'Acompanhe as metas de carteira de clientes', path: '/vendas/carteira' },
      { label: 'Ações', description: 'Crie e gerencie ações de vendas', path: '/vendas/acoes' },
      { label: 'Pedidos de Venda', description: 'Fluxo geral de pedidos (não-solar)', path: '/vendas/pedidos' },
      { label: 'Novo Pedido Solar', description: 'Inicie e acompanhe o fluxo dedicado de pedido solar', path: '/vendas/novo-pedido-solar' },
      { label: 'Comissões Apuradas', description: 'Gerencie as comissões apuradas do sistema', path: '/vendas/comissoes' },
    ],
  },
  {
    label: 'Cadastros',
    children: [
      { label: 'Clientes', description: 'Gerencie os clientes do sistema', path: '/clientes' },
      { label: 'Produtos', description: 'Gerencie os produtos do sistema', path: '/produtos/texto-garantia' },
      { label: 'Atributos Ecommerce', description: 'Gerencie os atributos do ecommerce', path: '/cadastros/atributos-ecommerce' },
      { label: 'Formação de Preço', description: 'Gerencie preços e performance do portfólio', path: '/cadastros/formacao-preco' },
    ],
  },
  {
    label: 'Configurações',
    children: [
      { label: 'Geral', description: 'Configurações gerais do sistema', path: '/configuracoes' },
    ],
  },
  {
    label: 'Handoff',
    children: [
      { label: 'Novo Pedido Solar', description: 'Especificação funcional e técnica para desenvolvimento do fluxo solar', path: '/handoff/novo-pedido-solar' },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════
   LAYOUT
   ══════════════════════════════════════════════════════════════════ */
export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [openNav, setOpenNav] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const isDashboardRoute = location.pathname === '/dashboard' || location.pathname === '/';
  const hideBreadcrumb = isDashboardRoute || location.pathname === '/vendas/novo-pedido-solar';

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenNav(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setOpenNav(null);
  }, [location.pathname]);

  const isNavActive = (item: NavItem): boolean => {
    return item.children.some((c) => {
      if (c.path === '/dashboard') return location.pathname === '/' || location.pathname === '/dashboard';
      if (c.path === '/cadastros/formacao-preco') {
        return (
          location.pathname.startsWith('/cadastros/formacao-preco') ||
          location.pathname.startsWith('/produto/') ||
          location.pathname.startsWith('/campanha/')
        );
      }
      return location.pathname.startsWith(c.path);
    });
  };

  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    const path = location.pathname;

    const productMatch = path.match(/^\/produto\/(\d+)\/(PR|ES|RJ|MA)/);
    if (productMatch) {
      const product = allProducts.find(p => p.id === productMatch[1]);
      const productLabel = product ? `SKU ${product.codOderco} · ${productMatch[2]}` : 'Produto';
      return [
        { label: 'Cadastros', onClick: () => navigate('/cadastros/formacao-preco') },
        { label: 'Formação de Preço', onClick: () => navigate('/cadastros/formacao-preco') },
        { label: productLabel },
      ];
    }

    const campaignMatch = path.match(/^\/campanha\/(\d+)/);
    if (campaignMatch) {
      return [
        { label: 'Cadastros', onClick: () => navigate('/cadastros/formacao-preco') },
        { label: 'Formação de Preço', onClick: () => navigate('/cadastros/formacao-preco') },
        { label: `Campanha #${campaignMatch[1]}` },
      ];
    }

    if (path === '/cadastros/formacao-preco') {
      return [
        { label: 'Cadastros' },
        { label: 'Formação de Preço' },
      ];
    }

    const segments = path.split('/').filter(Boolean);
    return segments.map((seg, i) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
      onClick: i < segments.length - 1 ? () => navigate('/' + segments.slice(0, i + 1).join('/')) : undefined,
    }));
  }, [location.pathname, navigate]);

  /* ── Profile menu items ── */
  const profileItems: { icon: React.ElementType; label: string; hasChevron?: boolean; destructive?: boolean; onClick?: () => void }[] = [
    { icon: Link2, label: 'Gerar chave - WhatsApp' },
    { icon: Package, label: 'Baixar extensão' },
    { icon: BookOpen, label: 'Wiki' },
    { icon: Bell, label: 'Notificações', hasChevron: true },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* ── Top Header Bar ── */}
      <header
        className="shrink-0 sticky top-0 z-50"
        style={{
          background: 'var(--primary)',
          height: '64px',
        }}
      >
        <div
          className="flex items-center justify-between h-full"
          style={{ paddingLeft: '82px', paddingRight: '82px' }}
        >
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            {/* Oderço Logo */}
            <div
              className="flex items-center shrink-0 cursor-pointer"
              onClick={() => navigate('/')}
              style={{ height: '20px' }}
            >
              <img
                src={odercoLogo}
                alt="Oderço"
                style={{ height: '20px', width: 'auto' }}
              />
            </div>

            {/* Navigation items → NavigationMenu DS component */}
            <div ref={navRef}>
              <NavigationMenu
                viewport={false}
                value={openNav ?? ''}
                onValueChange={() => {
                  // Controlled by click in trigger to avoid hover-open behavior.
                }}
              >
                <NavigationMenuList className="gap-1">
                  {topNav.map((item) => {
                    const active = isNavActive(item);
                    const isSingle = item.children.length === 1;

                    return (
                      <NavigationMenuItem key={item.label} value={item.label}>
                        <NavigationMenuTrigger
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenNav((prev) => (prev === item.label ? null : item.label));
                          }}
                          style={{
                            color: 'rgba(255,255,255,1)',
                            background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                            opacity: active ? 1 : 0.7,
                            fontSize: '14px',
                          }}
                          className="hover:!bg-[rgba(255,255,255,0.1)] hover:!opacity-100 data-[state=open]:!bg-[rgba(255,255,255,0.1)] data-[state=open]:!opacity-100 focus:!bg-[rgba(255,255,255,0.1)]"
                        >
                          {item.label}
                        </NavigationMenuTrigger>

                        <NavigationMenuContent
                          style={{
                            width: isSingle ? '320px' : '480px',
                            background: 'var(--card)',
                            border: '1px solid color-mix(in srgb, var(--border) 25%, transparent)',
                            boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                          }}
                        >
                          <div className={isSingle ? '' : 'grid grid-cols-2'} style={{ padding: '4px' }}>
                            {item.children.map((child) => (
                              <NavigationMenuLink
                                key={child.path}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOpenNav(null);
                                  navigate(child.path);
                                }}
                                className="cursor-pointer"
                                style={{ padding: '10px 12px' }}
                              >
                                <NavigationMenuLinkTitle>
                                  {child.label}
                                </NavigationMenuLinkTitle>
                                <NavigationMenuLinkDescription style={{ fontSize: '12px', lineHeight: '1.4' }}>
                                  {child.description}
                                </NavigationMenuLinkDescription>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right: User avatar + Theme toggle */}
          <div className="flex items-center gap-3">
            {/* User avatar "GB" */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
                style={{
                  width: '34px',
                  height: '34px',
                  border: '1.5px solid rgba(255,255,255,0.35)',
                  background: profileOpen ? 'rgba(255,255,255,0.12)' : 'transparent',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 'var(--font-weight-semibold)',
                    fontFamily: "'Inter', sans-serif",
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  GB
                </span>
              </button>

              {/* ── Profile dropdown ── */}
              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 rounded-[var(--radius-card)] z-50 overflow-hidden"
                  style={{
                    width: '230px',
                    background: 'var(--card)',
                    border: '1px solid color-mix(in srgb, var(--border) 25%, transparent)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                  }}
                >
                  {/* Menu items */}
                  <div className="py-1.5">
                    {profileItems.map((pItem) => {
                      const Icon = pItem.icon;
                      return (
                        <div
                          key={pItem.label}
                          role="button"
                          tabIndex={0}
                          className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-secondary"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Icon size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                          <span
                            className="flex-1"
                            style={{
                              fontSize: '13px',
                              fontWeight: 'var(--font-weight-normal)',
                              fontFamily: "'Inter', sans-serif",
                              color: 'var(--foreground)',
                            }}
                          >
                            {pItem.label}
                          </span>
                          {pItem.hasChevron && (
                            <ChevronRight size={14} style={{ color: 'var(--muted-foreground)' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Separator */}
                  <div style={{ height: '1px', background: 'color-mix(in srgb, var(--border) 20%, transparent)' }} />

                  {/* Sair */}
                  <div className="py-1.5">
                    <div
                      role="button"
                      tabIndex={0}
                      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-secondary"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LogOut size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 'var(--font-weight-normal)',
                          fontFamily: "'Inter', sans-serif",
                          color: 'var(--foreground)',
                        }}
                      >
                        Sair
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => document.documentElement.classList.toggle('dark')}
              className="flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
              style={{
                width: '34px',
                height: '34px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <Sun size={16} className="dark:hidden" style={{ color: 'rgba(255,255,255,0.7)' }} />
              <Moon size={16} className="hidden dark:block" style={{ color: 'rgba(255,255,255,0.7)' }} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-auto" style={{ background: 'var(--background)' }}>
        {!hideBreadcrumb && (
          <div
            className="sticky top-0 z-40"
            style={{ background: 'var(--background)' }}
          >
            <div className="" style={{ paddingLeft: '82px', paddingRight: '82px' }}>
              <div className="py-3">
                <Breadcrumb items={breadcrumbItems} />
              </div>
            </div>
          </div>
        )}

        <div
          className=""
          style={isDashboardRoute ? undefined : { paddingLeft: '82px', paddingRight: '82px' }}
        >
          <PedidoProvider>
            <Outlet />
          </PedidoProvider>
        </div>
      </div>
    </div>
  );
}
