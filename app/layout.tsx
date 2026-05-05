import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'UX Hub | Oderco',
  description: 'Portal de Projetos e Protótipos',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable}`}>
      <body className="font-sans antialiased text-[#0B1020] min-h-screen">
        {/* Decorative ambient blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[15%] -left-[5%] w-[55%] h-[55%] rounded-full bg-gradient-to-br from-[#C9D6F8] via-[#DDE5FA] to-transparent blur-[110px] opacity-70" />
          <div className="absolute top-[10%] right-[-10%] w-[55%] h-[60%] rounded-full bg-gradient-to-tl from-[#D8C7F5] via-[#E2D9FB] to-transparent blur-[120px] opacity-70" />
          <div className="absolute bottom-[-15%] left-[20%] w-[55%] h-[55%] rounded-full bg-gradient-to-tr from-[#BFD3F7] to-transparent blur-[120px] opacity-60" />
        </div>
        {children}
      </body>
    </html>
  );
}
