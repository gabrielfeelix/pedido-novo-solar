import { useState } from 'react';
import { useNavigate } from 'react-router';
import { formatCurrency } from './cart-data';

function ChevronDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface FreightOption {
  name: string;
  date: string;
  price: number;
  selected: boolean;
}

interface PaymentSection {
  state: string;
  freightType: string;
  paymentCondition: string;
  paymentForm: string;
  observation: string;
  freightOptions: FreightOption[];
  subtotal: number;
  ipi: number;
  st: number;
}

export function PaymentPage() {
  const navigate = useNavigate();

  const [sections, setSections] = useState<PaymentSection[]>([
    {
      state: 'PR',
      freightType: 'CIF (Cotação e Enviaremos)',
      paymentCondition: 'A Vista',
      paymentForm: 'Presencial',
      observation: '',
      freightOptions: [
        { name: 'JadLog', date: '03 fev - 10 fev 2022', price: 498.50, selected: true },
        { name: 'Braspress', date: '03 fev - 10 fev 2022', price: 598.50, selected: false },
        { name: 'TNT', date: '03 fev - 10 fev 2022', price: 698.50, selected: false },
      ],
      subtotal: 272.82, ipi: 19.56, st: 34.49,
    },
    {
      state: 'ES',
      freightType: 'CIF (Cotação e Enviaremos)',
      paymentCondition: 'A Vista',
      paymentForm: 'Presencial',
      observation: '',
      freightOptions: [
        { name: 'JadLog', date: '03 fev - 10 fev 2022', price: 498.50, selected: true },
        { name: 'Braspress', date: '03 fev - 10 fev 2022', price: 598.50, selected: false },
        { name: 'TNT', date: '03 fev - 10 fev 2022', price: 698.50, selected: false },
      ],
      subtotal: 272.82, ipi: 19.56, st: 34.49,
    },
  ]);

  const selectFreight = (sectionIdx: number, freightIdx: number) => {
    setSections(prev => {
      const next = [...prev];
      const section = { ...next[sectionIdx] };
      section.freightOptions = section.freightOptions.map((opt, i) => ({ ...opt, selected: i === freightIdx }));
      next[sectionIdx] = section;
      return next;
    });
  };

  const updateObservation = (sectionIdx: number, value: string) => {
    setSections(prev => {
      const next = [...prev];
      next[sectionIdx] = { ...next[sectionIdx], observation: value };
      return next;
    });
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Tabs */}
      <div className="flex justify-center pt-8 pb-6 gap-12">
        <button className="text-muted-foreground pb-2 bg-transparent cursor-pointer border-b-2 border-transparent hover:text-foreground" style={{ fontSize: 'var(--text-base)' }} onClick={() => navigate('/carrinho')}>
          Carrinho
        </button>
        <button className="text-primary border-b-2 border-primary pb-2 bg-transparent cursor-pointer" style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-base)' }}>
          Pagamento
        </button>
      </div>

      <div className="max-w-[1120px] mx-auto pb-12">
        {sections.map((section, sIdx) => (
          <div key={section.state} className="bg-card rounded-lg mb-6 p-6">
            <span className="bg-primary text-primary-foreground caption px-3 py-1.5 rounded-sm inline-block mb-5" style={{ fontWeight: 'var(--font-weight-bold)' }}>
              {section.state}
            </span>

            <div className="flex gap-10">
              {/* Left - Logística */}
              <div className="w-[220px] shrink-0">
                <p className="caption text-foreground m-0 mb-2" style={{ fontWeight: 'var(--font-weight-bold)' }}>Logística</p>
                <p className="m-0 mb-1 text-muted-foreground" style={{ fontSize: 'var(--text-2xs)' }}>Tipo de frete:</p>
                <button className="w-full h-9 bg-card border border-border rounded-sm flex items-center justify-between px-3 cursor-pointer mb-4 text-foreground">
                  <span style={{ fontSize: 'var(--text-xs)' }}>{section.freightType}</span>
                  <ChevronDownIcon />
                </button>

                <p className="caption text-foreground m-0 mb-2" style={{ fontWeight: 'var(--font-weight-bold)' }}>Pagamento</p>
                <p className="m-0 mb-1 text-muted-foreground" style={{ fontSize: 'var(--text-2xs)' }}>Condição Pgto:</p>
                <button className="w-full h-9 bg-card border border-border rounded-sm flex items-center justify-between px-3 cursor-pointer mb-3 text-foreground">
                  <span style={{ fontSize: 'var(--text-xs)' }}>{section.paymentCondition}</span>
                  <ChevronDownIcon />
                </button>

                <p className="m-0 mb-1 text-muted-foreground" style={{ fontSize: 'var(--text-2xs)' }}>Forma Pgto:</p>
                <button className="w-full h-9 bg-card border border-border rounded-sm flex items-center justify-between px-3 cursor-pointer mb-4 text-foreground">
                  <span style={{ fontSize: 'var(--text-xs)' }}>{section.paymentForm}</span>
                  <ChevronDownIcon />
                </button>

                <p className="caption text-foreground m-0 mb-1" style={{ fontWeight: 'var(--font-weight-bold)' }}>Observação do pedido</p>
                <textarea
                  className="w-full h-20 bg-card border border-border rounded-sm p-2 resize-none outline-none"
                  style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-red-hat-display)' }}
                  placeholder="Observação do pedido..."
                  value={section.observation}
                  onChange={(e) => updateObservation(sIdx, e.target.value)}
                />
              </div>

              {/* Middle - Frete */}
              <div className="flex-1">
                <p className="caption text-foreground m-0 mb-3" style={{ fontWeight: 'var(--font-weight-bold)' }}>Frete</p>
                <div className="flex flex-col gap-2">
                  {section.freightOptions.map((opt, fIdx) => (
                    <div
                      key={opt.name}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        opt.selected ? 'border-primary bg-primary/5' : 'border-muted bg-card hover:bg-muted/50'
                      }`}
                      onClick={() => selectFreight(sIdx, fIdx)}
                    >
                      <div>
                        <p className="caption text-foreground m-0" style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-xs)' }}>{opt.name}</p>
                        <p className="text-muted-foreground m-0" style={{ fontSize: 'var(--text-2xs)' }}>{opt.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="caption text-foreground" style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-xs)' }}>{formatCurrency(opt.price)}</span>
                        <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${opt.selected ? 'border-primary' : 'border-muted'}`}>
                          {opt.selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Total */}
              <div className="w-[240px] shrink-0">
                <p className="text-foreground m-0 mb-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)' }}>
                  Compra Cliente Final - {section.state}
                </p>
                <div className="flex justify-between caption mb-2">
                  <span className="text-foreground">SUBTOTAL</span>
                  <span className="text-foreground" style={{ fontWeight: 'var(--font-weight-bold)' }}>{formatCurrency(section.subtotal)}</span>
                </div>
                <div className="flex justify-between caption mb-2">
                  <span className="text-foreground">IPI</span>
                  <span className="text-foreground" style={{ fontWeight: 'var(--font-weight-bold)' }}>{formatCurrency(section.ipi)}</span>
                </div>
                <div className="flex justify-between caption mb-3">
                  <span className="text-foreground">ST</span>
                  <span className="text-foreground" style={{ fontWeight: 'var(--font-weight-bold)' }}>{formatCurrency(section.st)}</span>
                </div>
                <div className="border-t border-muted pt-3 flex justify-between">
                  <span className="text-success" style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-base)' }}>Total</span>
                  <span className="text-success" style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-base)' }}>
                    {formatCurrency(section.subtotal + section.ipi + section.st)}
                  </span>
                </div>
                <p className="text-primary m-0 mt-1" style={{ fontSize: 'var(--text-2xs)' }}>
                  Seu pedido não atingiu o valor mínimo
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="w-[214px] h-12 border border-primary rounded-lg text-primary bg-card cursor-pointer hover:bg-muted/50" style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-base)' }} onClick={() => navigate('/carrinho')}>
            Voltar
          </button>
          <button className="w-[214px] h-12 bg-primary rounded-lg text-primary-foreground border-none cursor-pointer hover:opacity-90" style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-base)' }} onClick={() => navigate('/sucesso')}>
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
}