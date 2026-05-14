import { Link, useLocation } from "react-router";
import { useTheme } from "./ThemeProvider";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const columns = [
  {
    title: "AJUDA E SUPORTE",
    links: [
      { label: "F.A.Q", href: "#" },
      { label: "Drivers e Manuais", href: "#" },
      { label: "Download e Suporte", href: "#" },
      { label: "Fale Conosco", href: "/fale-conosco" },
      { label: "Pedidos", href: "/perfil" },
      { label: "Política de Garantia, Trocas e Devoluções", href: "#" },
      { label: "Política de Privacidade", href: "#" },
      { label: "Termos de uso", href: "#" },
    ],
  },
  {
    title: "SOBRE A PCYES",
    links: [
      { label: "Quem somos", href: "#" },
      { label: "Onde Encontrar", href: "/onde-encontrar" },
      { label: "Seja um Influenciador", href: "/influenciadores" },
      { label: "Seja um Revendedor", href: "/revendedor" },
      { label: "Maringá FC × PCYES", href: "/maringa-fc" },
    ],
  },
];

const brandLogo = "https://www.pcyes.com.br/media/logo/stores/1/logo-default.png";
const paymentMethodsImage = "https://www.pcyes.com.br/media/.renditions/wysiwyg/pagamentos.png";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/pcyes" },
  { label: "TikTok", href: "https://www.tiktok.com/@pcyes.oficial" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/pcyes" },
  { label: "Facebook", href: "https://www.facebook.com/PCYES" },
  { label: "X", href: "https://x.com/PCYESoficial" },
  { label: "YouTube", href: "https://www.youtube.com/@PCYESOFICIAL" },
] as const;

const certifications = [
  {
    label: "PCYES",
    image: brandLogo,
    imageClassName: "w-[82px] h-[42px] object-contain",
  },
  {
    label: "RA 1000",
    href: "https://www.reclameaqui.com.br/empresa/pc-yes/",
    image: "https://www.insiderstore.com.br/cdn/shop/files/SELO-RA_1.png?v=1773463245&width=140",
    imageClassName: "w-[66px] h-[66px] object-contain",
  },
  {
    label: "Loja Protegida",
    image: "https://www.insiderstore.com.br/cdn/shop/files/Image_52_2x_85487a22-7eb0-4ae3-a7d7-75cc3910f11f.png?v=1773456501&width=140",
    imageClassName: "w-[66px] h-[66px] object-contain",
  },
  {
    label: "GPTW",
    image: "https://www.oderco.com.br/media/wysiwyg/Selo-Ranking-Paran_-2025.png",
    imageClassName: "w-[66px] h-[66px] object-contain",
  },
  {
    label: "Google Site Seguro",
    image: "https://www.insiderstore.com.br/cdn/shop/files/GOOGLE_BRANCO.png?v=1773463243&width=140",
    imageClassName: "w-[64px] h-[64px] object-contain",
  },
  {
    label: "ABNT",
    image: "https://www.oderco.com.br/media/wysiwyg/image_3.png",
    imageClassName: "w-[50px] h-[50px] object-contain",
  },
] as const;

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path
        d="M12.199 0.681641H9.50457V11.572C9.50457 12.8696 8.46827 13.9355 7.17861 13.9355C5.88896 13.9355 4.85264 12.8696 4.85264 11.572C4.85264 10.2976 5.86594 9.2549 7.10954 9.20858V6.47441C4.36902 6.52073 2.1582 8.76833 2.1582 11.572C2.1582 14.3989 4.41508 16.6697 7.20165 16.6697C9.98818 16.6697 12.2451 14.3757 12.2451 11.572V5.9878C13.2584 6.72928 14.5019 7.16953 15.8146 7.19271V4.45852C13.7881 4.38901 12.199 2.72069 12.199 0.681641Z"
        fill="currentColor"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path
        d="M12.5539 1.9502H14.8012L9.89154 7.56165L15.6674 15.1976H11.1449L7.6028 10.5664L3.54978 15.1976H1.30112L6.55252 9.19549L1.01172 1.9502H5.64898L8.85077 6.18324L12.5539 1.9502ZM11.7652 13.8525H13.0104L4.97235 3.22466H3.63606L11.7652 13.8525Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SocialIcon({ label }: { label: (typeof socialLinks)[number]["label"] }) {
  switch (label) {
    case "Instagram":
      return <Instagram size={16} strokeWidth={1.8} />;
    case "TikTok":
      return <TikTokIcon />;
    case "LinkedIn":
      return <Linkedin size={16} strokeWidth={1.8} />;
    case "Facebook":
      return <Facebook size={16} strokeWidth={1.8} />;
    case "X":
      return <XIcon />;
    case "YouTube":
      return <Youtube size={16} strokeWidth={1.8} />;
    default:
      return null;
  }
}

export function Footer() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const { pathname } = useLocation();
  const isCheckout = pathname === "/checkout";

  if (isCheckout) {
    return (
      <footer className={`${isDark ? "bg-[#040404]" : "bg-[#f5f5f5]"} border-t ${isDark ? "border-white/5" : "border-foreground/10"} text-foreground py-12 mt-auto`}>
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <Link to="/" className="hover:opacity-80 transition-opacity" aria-label="PCYES">
              <ImageWithFallback src={brandLogo} alt="PCYES" className="h-[34px] w-auto object-contain" />
            </Link>
            <p className={`max-w-md text-[13px] ${isDark ? "text-foreground/50" : "text-foreground/60"}`} style={{ fontFamily: "var(--font-family-inter)", lineHeight: "1.6" }}>
              A PCYES nasceu para impulsionar a performance dos gamers e profissionais, entregando produtos de alta qualidade, tecnologia e design inovador para o seu setup.
            </p>
            <div className="pt-6">
              <ImageWithFallback src={paymentMethodsImage} alt="Formas de pagamento PCYES" className="h-auto w-[250px] max-w-full object-contain opacity-50 hover:opacity-80 transition-opacity" />
            </div>
            <p className={isDark ? "text-foreground/30 mt-2" : "text-foreground/40 mt-2"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
              &copy; {new Date().getFullYear()} Oderço Distribuidora | Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`${isDark ? "bg-[#040404]" : "bg-[#f5f5f5]"} border-t ${isDark ? "border-white/5" : "border-foreground/10"} text-foreground`}>
      <div className="mx-auto max-w-[1434px] px-5 pt-[65px] pb-4 md:px-12 xl:px-0">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_400px] md:gap-8">
          
          {/* Brand & Mission & Socials */}
          <div className="flex flex-col items-start">
            <Link to="/" className="mb-5 block hover:opacity-80 transition-opacity" aria-label="PCYES">
              <ImageWithFallback src={brandLogo} alt="PCYES" className="h-[34px] w-auto object-contain" />
            </Link>
            <p className="mb-4 text-foreground tracking-[0.04em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-bold)" }}>
              NOSSA MISSÃO
            </p>
            <p className={`mb-8 max-w-[503px] text-sm pr-4 ${isDark ? "text-foreground/60" : "text-foreground/70"}`} style={{ fontFamily: "var(--font-family-inter)", lineHeight: "22.75px" }}>
              A PCYES nasceu para impulsionar a performance dos gamers e profissionais, entregando produtos de alta qualidade, tecnologia e design inovador para o seu setup.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${isDark ? "border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30" : "border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40"}`}
                  aria-label={social.label}
                >
                  <SocialIcon label={social.label} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:justify-center md:gap-[82px]">
            {columns.map((col) => (
              <div key={col.title}>
                <p className={isDark ? "text-foreground mb-6 tracking-wide" : "text-foreground mb-6 tracking-wide"}
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-bold)", letterSpacing: "0.04em" }}
                >{col.title}</p>
                <div className="flex flex-col gap-4">
                  {col.links.map((link) => (
                    <Link key={link.label} to={link.href}
                      className={isDark ? "text-foreground/60 hover:text-foreground transition-colors duration-300" : "text-foreground/70 hover:text-foreground transition-colors duration-300"}
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                    >{link.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certificados */}
          <div>
            <p className={isDark ? "text-foreground mb-6 tracking-wide" : "text-foreground mb-6 tracking-wide"}
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-bold)", letterSpacing: "0.04em" }}
            >CERTIFICADOS</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {certifications.map((cert) => {
                const cardClassName = `min-h-[113px] rounded-2xl border px-3 py-3 transition-all duration-300 ${
                  isDark
                    ? "border-foreground/10 bg-white/[0.03] hover:border-foreground/20 hover:bg-white/[0.06]"
                    : "border-foreground/10 bg-white hover:border-foreground/20"
                }`;

                const cardContent = (
                  <div className="flex h-full items-center justify-center text-center">
                    <ImageWithFallback src={cert.image} alt={cert.label} className={cert.imageClassName} />
                  </div>
                );

                if (cert.href) {
                  return (
                    <a
                      key={cert.label}
                      href={cert.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cardClassName}
                    >
                      {cardContent}
                    </a>
                  );
                }

                return (
                  <div key={cert.label} className={cardClassName}>
                    {cardContent}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="mx-auto max-w-[1434px] px-5 py-8 md:px-12 xl:px-0">
        {/* Corporate Info */}
        <div className={`flex flex-col gap-10 pt-[33px] border-t md:grid md:grid-cols-3 md:items-center ${isDark ? "border-foreground/5" : "border-foreground/10"}`}>
          <div className="flex-1">
            <p className={isDark ? "text-foreground/50 mb-1" : "text-foreground/80 mb-1"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-bold)" }}>
              Oderço Distribuidora de Eletrônicos LTDA - 09.301.845/0001-91
            </p>
            <p className={isDark ? "text-foreground/40" : "text-foreground/60"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", lineHeight: "1.6" }}>
              Av. Paranavaí, 1906 - Parque Industrial Bandeirantes, Maringá - PR, 87070-130
              <br/>
              &copy; {new Date().getFullYear()} Oderço Distribuidora | Todos os direitos reservados.
            </p>
          </div>
          <div className="flex justify-center">
            <ImageWithFallback src={paymentMethodsImage} alt="Formas de pagamento PCYES" className="h-auto w-[373px] max-w-full object-contain" />
          </div>
          <div className="md:flex-1 md:text-right">
            <p className={isDark ? "text-foreground/30" : "text-foreground/50"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-bold)" }}>
              Desenvolvido por Oderço
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
