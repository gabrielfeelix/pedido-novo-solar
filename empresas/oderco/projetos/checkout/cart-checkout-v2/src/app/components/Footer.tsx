import svgPaths from '../../imports/svg-xd215l8b8f';
import imgAzuxLogos from "figma:asset/f0a2597c6a7b9a0afb300669057a38abe0488596.png";
import imgPcyes from "figma:asset/837c33710ad1e89bf66593ea11b908fcbd936595.png";
import imgSkul from "figma:asset/3b20ff8a7b242ede3b0cd58c393e6f164b12c28a.png";
import imgTonante from "figma:asset/5ebc8c7a95afe3aa22e99763a7125dcbff3f558d.png";
import imgQuati from "figma:asset/da6279b624b414bfcdf6612d46e444cf1e9bc44f.png";
import imgOdex from "figma:asset/617b689c14cff7b585f653d167afb0f6f2c01c21.png";

function TruckIcon() {
  return (
    <svg width="33" height="33" viewBox="0 0 33 33" fill="none">
      <path d="M22 4.125H1.375V22H22V4.125Z" stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p9b87500} stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p34eb0240} stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.pf627e80} stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="33" height="33" viewBox="0 0 33 33" fill="none">
      <path d={svgPaths.p35b06380} stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="33" height="33" viewBox="0 0 33 33" fill="none">
      <path d={svgPaths.pfee9a80} stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p18859c80} stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function NoDropshippingIcon() {
  return (
    <svg width="33" height="33" viewBox="0 0 33 33" fill="none">
      <path d={svgPaths.p6ef9b00} fill="var(--primary)" />
      <path d={svgPaths.pe9f3780} fill="var(--primary)" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-card">
      {/* Benefits bar */}
      <div className="border-t border-muted py-6 flex justify-center px-4">
        <div className="w-full max-w-[1120px] grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <TruckIcon />
            <div>
              <p className="caption text-foreground m-0" style={{ fontWeight: 'var(--font-weight-bold)' }}>Frete Grátis para todo Brasil</p>
              <p className="caption text-muted-foreground m-0">Para compras acima de R$300,00</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldIcon />
            <div>
              <p className="caption text-foreground m-0" style={{ fontWeight: 'var(--font-weight-bold)' }}>Site Seguro</p>
              <p className="caption text-muted-foreground m-0">Compre protegido</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircleIcon />
            <div>
              <p className="caption text-foreground m-0" style={{ fontWeight: 'var(--font-weight-bold)' }}>Garantia</p>
              <p className="caption text-muted-foreground m-0">Veja as condições</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NoDropshippingIcon />
            <div>
              <p className="caption text-foreground m-0" style={{ fontWeight: 'var(--font-weight-bold)' }}>Não fazemos</p>
              <p className="caption text-foreground m-0" style={{ fontWeight: 'var(--font-weight-bold)' }}>dropshipping</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="border-t border-b border-muted py-10 flex justify-center px-4">
        <div className="w-full max-w-[1120px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          <div>
            <p className="caption text-foreground mb-4" style={{ fontWeight: 'var(--font-weight-bold)' }}>Empresa</p>
            <div className="flex flex-col gap-2">
              <p className="caption text-muted-foreground m-0 cursor-pointer hover:underline">Sobre Nós</p>
              <p className="caption text-muted-foreground m-0 cursor-pointer hover:underline">Política de Privacidade</p>
              <p className="caption text-muted-foreground m-0 cursor-pointer hover:underline">Política de Qualidade</p>
            </div>
          </div>
          <div>
            <p className="caption text-foreground mb-4" style={{ fontWeight: 'var(--font-weight-bold)' }}>Central de atendimento</p>
            <div className="flex flex-col gap-2">
              <p className="caption text-muted-foreground m-0 cursor-pointer hover:underline">Cadastre-se</p>
              <p className="caption text-muted-foreground m-0 cursor-pointer hover:underline">Segunda via boleto</p>
              <p className="caption text-muted-foreground m-0 cursor-pointer hover:underline">Trabalhe Conosco</p>
            </div>
          </div>
          <div>
            <p className="caption text-foreground mb-4" style={{ fontWeight: 'var(--font-weight-bold)' }}>Suporte</p>
            <div className="flex flex-col gap-2">
              <p className="caption text-muted-foreground m-0 cursor-pointer hover:underline">RMA</p>
              <p className="caption text-muted-foreground m-0 cursor-pointer hover:underline">Fale Conosco</p>
              <p className="caption text-muted-foreground m-0 cursor-pointer hover:underline">Conferência de mercadorias</p>
              <p className="caption text-muted-foreground m-0 cursor-pointer hover:underline">Meus pedidos</p>
              <p className="caption text-muted-foreground m-0 cursor-pointer hover:underline">Oderço Virtual</p>
            </div>
          </div>
          <div>
            <p className="caption text-foreground mb-4" style={{ fontWeight: 'var(--font-weight-bold)' }}>Contato</p>
            <div className="caption text-muted-foreground">
              <p className="m-0">Av. Paranavaí, 1906, Parque industrial bandeirantes | Maringá – Paraná</p>
              <p className="m-0">Fone: (44) 2101-1400</p>
              <p className="m-0">contato@oderco.com.br</p>
            </div>
            <p className="caption text-foreground mt-6 mb-3" style={{ fontWeight: 'var(--font-weight-bold)' }}>Acompanhe nossas redes sociais!</p>
            <div className="flex gap-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path clipRule="evenodd" d={svgPaths.p17e45c31} fill="var(--muted-foreground)" fillRule="evenodd" />
              </svg>
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
                <path d={svgPaths.p398a8a40} fill="var(--muted-foreground)" />
              </svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path clipRule="evenodd" d={svgPaths.p29053e00} fill="var(--muted-foreground)" fillRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="flex justify-center py-6 px-4">
        <div className="w-full max-w-[1120px]">
          <p className="caption text-foreground mb-4" style={{ fontWeight: 'var(--font-weight-bold)' }}>MARCAS DO GRUPO</p>
          <div className="flex items-center gap-4 md:gap-6 flex-wrap">
            <img src={imgPcyes} alt="PCYES" className="h-5 object-contain" />
            <img src={imgSkul} alt="Skul" className="h-5 object-contain" />
            <img src={imgTonante} alt="Tonante" className="h-7 object-contain" />
            <img src={imgQuati} alt="Quati" className="h-7 object-contain" />
            <img src={imgOdex} alt="Odex" className="h-4 object-contain" />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-muted flex justify-center py-4 px-4">
        <div className="w-full max-w-[1120px] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="caption text-muted-foreground m-0">
            Oderço Distribuidora © 1988-2024 | Todos os direitos reservados
          </p>
          <div className="flex items-center gap-2">
            <span className="caption text-muted-foreground">Desenvolvido Por</span>
            <img src={imgAzuxLogos} alt="AZUX" className="h-5 object-contain" />
          </div>
        </div>
      </div>
    </footer>
  );
}