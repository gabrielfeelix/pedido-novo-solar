import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { allProducts, generatePriceDestinations } from '../data/mockData';
import { ProductHeader } from './ProductHeader';
import { BaseParameters } from './BaseParameters';
import { PriceTable } from './PriceTable';
import { Promotions } from './Promotions';
import { ActionBar } from './ActionBar';
import { Button } from './ui/Button';

export function PriceFormation() {
  const { id, filial } = useParams();
  const navigate = useNavigate();
  const [changeCount, setChangeCount] = useState(0);

  const product = allProducts.find(p => p.id === id);

  // Find the specific filial data
  const filialData = product?.filiais.find(f => f.filial === filial);
  // Fallback: if filial param doesn't match, use first filial
  const activeFilial = filialData || product?.filiais[0];
  const activeFilialCode = (filialData?.filial || product?.filiais[0]?.filial || 'PR') as 'PR' | 'ES' | 'RJ' | 'MA';

  // Find all sibling filials (all others besides the active one)
  const siblingFilials = product?.filiais
    .filter(f => f.filial !== activeFilialCode)
    .map(f => ({ filial: f.filial, productId: product!.id })) ?? [];

  const destinations = useMemo(
    () => activeFilial ? generatePriceDestinations(activeFilial.custoMedioNet, activeFilial.ultimaEntrada) : [],
    [activeFilial?.custoMedioNet, activeFilial?.ultimaEntrada]
  );

  if (!product || !activeFilial) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
        <span style={{ fontSize: '48px' }}>404</span>
        <span style={{ fontSize: 'var(--text-sm)' }}>Produto não encontrado</span>
        <Button onClick={() => navigate('/')}>
          Voltar à listagem
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-auto">
        {/* Product Header — scrolls with content */}
        <ProductHeader
          product={product}
          filial={activeFilialCode}
          siblingFilials={siblingFilials.length > 0 ? siblingFilials : undefined}
        />

        <div className="py-6 space-y-6">
          {/* Zone 2 - Base Parameters + Promotions side by side */}
          <div className="grid grid-cols-2 gap-6" style={{ minHeight: 520 }}>
            <BaseParameters
              cmv={activeFilial.custoMedioNet}
              estoqueTotal={activeFilial.estoque}
              verba={activeFilialCode === 'ES' ? 1.25 : 1.57}
            />
            <Promotions />
          </div>

          {/* Zone 3 - Price Table */}
          <PriceTable
            destinations={destinations}
            onChanges={setChangeCount}
          />

          {/* Bottom spacing for action bar */}
          <div className="h-4" />
        </div>
      </div>

      {/* Sticky Action Bar */}
      <ActionBar changeCount={changeCount} />
    </div>
  );
}