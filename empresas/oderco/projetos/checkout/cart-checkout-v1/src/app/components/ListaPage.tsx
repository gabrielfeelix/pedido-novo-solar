import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ProductCard, type ProductCardProps } from './ProductCard';
import imgImage7 from "figma:asset/c43f80881077b18717d00a7c7b7a14972dcb1059.png";

const imgMouse = imgImage7;
const imgKeyboard = 'https://images.unsplash.com/photo-1643869094397-962f806fe3ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmQlMjBSR0IlMjBnYW1pbmd8ZW58MXx8fHwxNzcyNzM5OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080';
const imgHeadset = 'https://images.unsplash.com/photo-1600186279172-fdbaefd74383?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkc2V0JTIwYmxhY2t8ZW58MXx8fHwxNzcyNjI2MTE0fDA&ixlib=rb-4.1.0&q=80&w=1080';
const imgChair = 'https://images.unsplash.com/photo-1770194993269-2521ad916c23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlcmdvbm9taWMlMjBnYW1pbmclMjBjaGFpciUyMHJlZCUyMGJsYWNrfGVufDF8fHx8MTc3MjczOTk3NXww&ixlib=rb-4.1.0&q=80&w=1080';
const imgWebcam = 'https://images.unsplash.com/photo-1614588876378-b2ffa4520c22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJjYW0lMjBkZXNrdG9wJTIwY29tcHV0ZXIlMjBjYW1lcmF8ZW58MXx8fHwxNzcyNzM5OTc1fDA&ixlib=rb-4.1.0&q=80&w=1080';

const allProducts: ProductCardProps[] = [
  { id: 'l-1', sku: '12345', name: 'MOUSE DASH GREY SEM FIO MULTI DEVICE SILENT CLICK 1500 DPI PMDWMDSCG - CINZA', brand: 'PCYES', pricePR: 47.52, priceES: 47.52, image: imgMouse, filial: 'FILIAL PR', unitInfo: 'Valores com IPI + ST (Caso Houver)' },
  { id: 'l-2', sku: '12347', name: 'MOUSE DASH GREY SEM FIO MULTI DEVICE SILENT CLICK 1500 DPI PMDWMDSCG - CINZA', brand: 'PCYES', pricePR: 47.52, priceES: null, image: imgMouse, filial: 'FILIAL PR', unitInfo: 'Valor com IPI + ST (Caso Houver)' },
  { id: 'l-3', sku: '12349', name: 'MOUSE DASH GREY SEM FIO MULTI DEVICE SILENT CLICK 1500 DPI PMDWMDSCG - CINZA', brand: 'PCYES', pricePR: 47.52, priceES: 47.52, image: imgMouse, filial: 'FILIAL PR', unitInfo: 'Valores com IPI + ST (Caso Houver)' },
  { id: 'l-4', sku: '12345', name: 'MOUSE DASH GREY SEM FIO MULTI DEVICE SILENT CLICK 1500 DPI PMDWMDSCG - CINZA', brand: 'PCYES', pricePR: 47.52, priceES: null, image: imgMouse, filial: 'FILIAL PR' },
  { id: 'l-5', sku: '12345', name: 'TECLADO GAMER RGB STRIKE PRO 104 TECLAS MECÂNICAS PRETO', brand: 'PCYES', pricePR: 89.90, priceES: 92.10, image: imgKeyboard, filial: 'FILIAL PR', unitInfo: 'Valores com IPI + ST (Caso Houver)' },
  { id: 'l-6', sku: '12345', name: 'HEADSET GAMER HAVIT H2002D 7.1 SURROUND USB COM MIC', brand: 'PCYES', pricePR: 65.00, priceES: null, image: imgHeadset, filial: 'FILIAL PR', unitInfo: 'Valor com IPI + ST (Caso Houver)' },
  { id: 'l-7', sku: '12345', name: 'CADEIRA GAMER ERGONÔMICA ENCOSTO RECLINÁVEL 180° COM APOIO', brand: 'PCYES', pricePR: 310.00, priceES: 318.00, image: imgChair, filial: 'FILIAL PR', unitInfo: 'Valores com IPI + ST (Caso Houver)' },
  { id: 'l-8', sku: '12345', name: 'WEBCAM FULL HD 1080P COM MICROFONE INTEGRADO USB', brand: 'PCYES', pricePR: 55.90, priceES: 58.00, image: imgWebcam, filial: 'FILIAL PR', unitInfo: 'Valores com IPI + ST (Caso Houver)' },
  { id: 'l-9', sku: '12345', name: 'MOUSE DASH GREY SEM FIO MULTI DEVICE SILENT CLICK 1500 DPI PMDWMDSCG - CINZA', brand: 'PCYES', pricePR: 47.52, priceES: 47.52, image: imgMouse, filial: 'FILIAL PR', unitInfo: 'Valores com IPI + ST (Caso Houver)' },
  { id: 'l-10', sku: '12345', name: 'MOUSE DASH GREY SEM FIO MULTI DEVICE SILENT CLICK 1500 DPI PMDWMDSCG - CINZA', brand: 'PCYES', pricePR: 47.52, priceES: 47.52, image: imgMouse, filial: 'FILIAL PR', unitInfo: 'Valores com IPI + ST (Caso Houver)' },
  { id: 'l-11', sku: '12345', name: 'MOUSE DASH GREY SEM FIO MULTI DEVICE SILENT CLICK 1500 DPI PMDWMDSCG - CINZA', brand: 'PCYES', pricePR: 47.52, priceES: 47.52, image: imgMouse, filial: 'FILIAL PR', unitInfo: 'Valores com IPI + ST (Caso Houver)' },
  { id: 'l-12', sku: '12345', name: 'MOUSE DASH GREY SEM FIO MULTI DEVICE SILENT CLICK 1500 DPI PMDWMDSCG - CINZA', brand: 'PCYES', pricePR: 47.52, priceES: 47.52, image: imgMouse, filial: 'FILIAL PR', unitInfo: 'Valores com IPI + ST (Caso Houver)' },
];

const filterCategories = ['Informática', 'Computadores', 'Musical', 'Cabos', 'Figures'];
const filterBrands = ['PCYES', 'Vinik', 'Skul', 'Tonante', 'Quati'];

export function ListaPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [perPage, setPerPage] = useState(12);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const totalItems = 250;

  const toggleFilter = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  return (
    <div style={{ background: 'var(--card)', minHeight: '100vh', fontFamily: 'var(--font-red-hat-display)' }}>
      <div className="max-w-[1120px] mx-auto py-[32px] px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-[8px] mb-[8px]">
          <span
            className="cursor-pointer hover:underline"
            style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}
            onClick={() => navigate('/')}
          >
            Home
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>/</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)' }}>
            Promoções do dia
          </span>
        </div>

        {/* Title */}
        <h2
          className="m-0 mb-[24px]"
          style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--foreground)',
            lineHeight: 'normal',
          }}
        >
          Promoções do dia
        </h2>

        <div className="flex gap-[32px]">
          {/* Sidebar Filters */}
          <aside className="w-[200px] shrink-0 hidden md:block">
            <p className="m-0 mb-[24px]" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
              Itens 1‑{Math.min(perPage, totalItems)} de {totalItems}
            </p>

            {/* Categorias */}
            <div className="mb-[24px]">
              <p className="m-0 mb-[12px]" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>
                Categorias
              </p>
              <div className="flex flex-col gap-[8px]">
                {filterCategories.map((cat) => (
                  <label key={cat} className="flex items-center gap-[8px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
                      className="w-[16px] h-[16px] rounded-sm accent-[var(--primary)]"
                    />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)' }}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Marca */}
            <div className="mb-[24px]">
              <p className="m-0 mb-[12px]" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>
                Marca
              </p>
              <div className="flex flex-col gap-[8px]">
                {filterBrands.map((brand) => (
                  <label key={brand} className="flex items-center gap-[8px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleFilter(selectedBrands, setSelectedBrands, brand)}
                      className="w-[16px] h-[16px] rounded-sm accent-[var(--primary)]"
                    />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)' }}>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preço */}
            <div className="mb-[24px]">
              <p className="m-0 mb-[12px]" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>
                Preço
              </p>
              <div className="flex items-center gap-[8px]">
                <input
                  type="text"
                  placeholder="R$ Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full h-[36px] px-[8px] rounded-sm outline-none"
                  style={{
                    border: '1px solid var(--border)',
                    background: 'var(--card)',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-red-hat-display)',
                    color: 'var(--foreground)',
                  }}
                />
                <input
                  type="text"
                  placeholder="R$ Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full h-[36px] px-[8px] rounded-sm outline-none"
                  style={{
                    border: '1px solid var(--border)',
                    background: 'var(--card)',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-red-hat-display)',
                    color: 'var(--foreground)',
                  }}
                />
              </div>
            </div>

            <button
              className="flex items-center gap-[4px] bg-transparent border-none cursor-pointer p-0"
              style={{ color: 'var(--primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)' }}
            >
              Ver tudo
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-end mb-[24px] gap-[12px]">
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>Ordenar por</span>
              <button
                className="h-[36px] w-[200px] rounded-sm flex items-center justify-between px-[12px] cursor-pointer"
                style={{ background: 'var(--card)', border: '1px solid var(--muted)', color: 'var(--foreground)', fontSize: 'var(--text-xs)' }}
              >
                <span>Preço Menor</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap gap-[16px] mb-[32px]">
              {allProducts.map((p) => (
                <div key={p.id} className="flex justify-center">
                  <ProductCard {...p} showHeart onNavigate={() => navigate('/produto/' + p.id)} />
                </div>
              ))}
            </div>

            {/* Bottom controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                <span>Mostrar</span>
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  className="h-[32px] px-[8px] rounded-sm outline-none cursor-pointer"
                  style={{ border: '1px solid var(--muted)', background: 'var(--card)', color: 'var(--foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)' }}
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
                <span>por página</span>
              </div>

              {/* Pagination */}
              <div className="flex items-center gap-[4px]">
                <button
                  className="w-[32px] h-[32px] rounded-sm flex items-center justify-center cursor-pointer disabled:opacity-40"
                  style={{ background: 'var(--card)', border: '1px solid var(--muted)', color: 'var(--foreground)' }}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className="w-[32px] h-[32px] rounded-sm flex items-center justify-center cursor-pointer"
                    style={{
                      background: currentPage === page ? 'var(--primary)' : 'var(--card)',
                      color: currentPage === page ? 'var(--primary-foreground)' : 'var(--foreground)',
                      border: currentPage === page ? '1px solid var(--primary)' : '1px solid var(--muted)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: currentPage === page ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)',
                    }}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', padding: '0 4px' }}>...</span>

                <button
                  className="w-[32px] h-[32px] rounded-sm flex items-center justify-center cursor-pointer"
                  style={{ background: 'var(--card)', border: '1px solid var(--muted)', color: 'var(--foreground)' }}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}