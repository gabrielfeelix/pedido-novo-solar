import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Pencil, Percent, DollarSign } from 'lucide-react';
import { Card } from './ui/Card';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './ui/input-group';
import { FieldLabel } from './ui/field';
import svgPaths from '../../imports/svg-pjhztk9mis';

interface BaseParametersProps {
  cmv: number;
  estoqueTotal: number;
  verba?: number;
  custoNet?: number;
  onParamsChange?: (params: { markup: number; lucroAlvo: number; despOper: number }) => void;
}

/* ── Calculator Icon (from Figma) ── */
function CalcIcon() {
  return (
    <div className="shrink-0" style={{ width: 14, height: 14 }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d={svgPaths.p162a1600} stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        <path d="M4.66667 3.5H9.33333" stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        <path d="M9.33333 8.16667V10.5" stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        <path d="M9.33333 5.83333H9.33917" stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        <path d="M7 5.83333H7.00583" stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        <path d="M4.66667 5.83333H4.6725" stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        <path d="M7 8.16667H7.00583" stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        <path d="M4.66667 8.16667H4.6725" stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        <path d="M7 10.5H7.00583" stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        <path d="M4.66667 10.5H4.6725" stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
      </svg>
    </div>
  );
}

/* ── Stepper arrows ── */
function StepperArrows({ onUp, onDown, accentColor }: { onUp: () => void; onDown: () => void; accentColor: string }) {
  return (
    <div className="flex flex-col gap-px shrink-0">
      <button
        onClick={onUp}
        className="flex items-center justify-center cursor-pointer transition-colors hover:bg-black/5"
        style={{ width: 20, height: 16, borderRadius: 3, background: `color-mix(in srgb, ${accentColor} 8%, transparent)` }}
      >
        <ChevronUp size={10} style={{ color: accentColor }} />
      </button>
      <button
        onClick={onDown}
        className="flex items-center justify-center cursor-pointer transition-colors hover:bg-black/5"
        style={{ width: 20, height: 16, borderRadius: 3, background: 'var(--background)' }}
      >
        <ChevronDown size={10} style={{ color: 'var(--muted-foreground)' }} />
      </button>
    </div>
  );
}

/* ── Info icon (Figma) ── */
function InfoCircleIcon() {
  return (
    <div className="shrink-0" style={{ width: 10, height: 10 }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <g clipPath="url(#clip_bp_info)">
          <path d={svgPaths.p3cf7650} stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M5 6.66667V5" stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M5 3.33333H5.00417" stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
        <defs><clipPath id="clip_bp_info"><rect fill="white" height="10" width="10" /></clipPath></defs>
      </svg>
    </div>
  );
}

export function BaseParameters({ cmv, verba: verbaProp = 1.57 }: BaseParametersProps) {
  const custoOper = 12.0; // Custo Operacional fixo %
  const ipiPct = 12.0;    // IPI %
  const stPct = 3.0;      // ST %

  const [mode, setMode] = useState<'markup' | 'lucro'>('markup');
  const [markupInput, setMarkupInput] = useState(35.0);
  const [lucroInput, setLucroInput] = useState(35.0 - custoOper);
  const [compositionOpen, setCompositionOpen] = useState(true);

  // Price overrides — user can edit these directly
  const [precoSemIPIOverride, setPrecoSemIPIOverride] = useState<number | null>(null);
  const [precoComIPIOverride, setPrecoComIPIOverride] = useState<number | null>(null);

  // ── Core calculations ──
  const markupPct = mode === 'markup' ? markupInput : +(lucroInput + custoOper).toFixed(1);
  const lucroPct = mode === 'lucro' ? lucroInput : +(markupInput - custoOper).toFixed(1);

  // Base prices from markup
  const precoSemIPICalc = +(cmv * (1 + markupPct / 100)).toFixed(2);
  const ipiValue = +(precoSemIPICalc * ipiPct / 100).toFixed(2);
  const stValue = +(precoSemIPICalc * stPct / 100).toFixed(2);
  const precoComIPICalc = +(precoSemIPICalc + ipiValue + stValue).toFixed(2);

  // Effective prices (may be overridden by user)
  const precoSemIPI = precoSemIPIOverride ?? precoSemIPICalc;
  const precoComIPI = precoComIPIOverride ?? precoComIPICalc;

  // Custo operacional R$ value
  const custoOperValue = +(precoSemIPI * custoOper / 100).toFixed(2);

  const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ── Composition data ──
  const composition = useMemo(() => {
    const markupVal = precoSemIPI - cmv;
    const total = precoComIPI;
    return [
      { label: 'CMV', value: cmv, pct: +(cmv / total * 100).toFixed(1), barColor: '#94A3B8', pipColor: 'var(--muted-foreground)' },
      { label: 'Markup', value: markupVal, pct: +(markupVal / total * 100).toFixed(1), barColor: '#669CFF', pipColor: 'var(--accent)' },
      { label: 'IPI', value: ipiValue, pct: +(ipiValue / total * 100).toFixed(1), barColor: '#FB923C', pipColor: '#FB923C' },
      { label: 'ST', value: stValue, pct: +(stValue / total * 100).toFixed(1), barColor: '#A78BFA', pipColor: 'var(--primary)' },
    ];
  }, [cmv, precoSemIPI, precoComIPI, ipiValue, stValue]);

  // ── Mode switch sync ──
  const handleModeSwitch = (newMode: 'markup' | 'lucro') => {
    if (newMode === mode) return;
    if (newMode === 'lucro') {
      setLucroInput(+(markupInput - custoOper).toFixed(1));
    } else {
      setMarkupInput(+(lucroInput + custoOper).toFixed(1));
    }
    setMode(newMode);
  };

  // ── Price edit handlers ──
  const handlePrecoSemIPIChange = (v: number) => {
    setPrecoSemIPIOverride(v);
    setPrecoComIPIOverride(null);
    // Recalculate markup from the new price
    if (cmv > 0) {
      const newMarkup = +((v / cmv - 1) * 100).toFixed(1);
      if (mode === 'markup') setMarkupInput(newMarkup);
      else setLucroInput(+(newMarkup - custoOper).toFixed(1));
    }
  };

  const handlePrecoComIPIChange = (v: number) => {
    setPrecoComIPIOverride(v);
    // Back-calculate semIPI: comIPI = semIPI * (1 + ipi% + st%)
    const semIPI = +(v / (1 + (ipiPct + stPct) / 100)).toFixed(2);
    setPrecoSemIPIOverride(semIPI);
    if (cmv > 0) {
      const newMarkup = +((semIPI / cmv - 1) * 100).toFixed(1);
      if (mode === 'markup') setMarkupInput(newMarkup);
      else setLucroInput(+(newMarkup - custoOper).toFixed(1));
    }
  };

  // When markup/lucro changes via input, clear price overrides
  const handleMarkupChange = (v: number) => {
    setMarkupInput(v);
    setPrecoSemIPIOverride(null);
    setPrecoComIPIOverride(null);
  };
  const handleLucroChange = (v: number) => {
    setLucroInput(v);
    setPrecoSemIPIOverride(null);
    setPrecoComIPIOverride(null);
  };

  // Active editable field
  const editableValue = mode === 'markup' ? markupInput : lucroInput;
  const editableLabel = mode === 'markup' ? 'Markup (%)' : 'Lucratividade (%)';
  const computedLabel = mode === 'markup' ? 'Lucratividade (%)' : 'Markup (%)';
  const computedValue = mode === 'markup' ? lucroPct : markupPct;
  const onEditableChange = mode === 'markup' ? handleMarkupChange : handleLucroChange;

  return (
    <Card className="overflow-hidden h-full flex flex-col" style={{ alignItems: 'stretch' }}>

      {/* ═══ HEADER ═══ */}
      <div className="flex items-center justify-between px-5 py-3.5 w-full shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center shrink-0" style={{ width: 28, height: 28, borderRadius: 'var(--radius)', background: 'color-mix(in srgb, var(--muted-foreground) 10%, transparent)' }}>
            <CalcIcon />
          </div>
          <div className="flex flex-col">
            <span style={{ fontSize: '14px', fontWeight: 'var(--font-weight-semibold)', fontFamily: "'Red Hat Display', sans-serif", color: 'var(--foreground)', lineHeight: '21px' }}>
              Parâmetros Base
            </span>
            <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-normal)', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)', lineHeight: '16.5px' }}>
              Gestão de Precificação
            </span>
          </div>
        </div>
        <Tabs
          value={mode}
          onValueChange={(v) => handleModeSwitch(v as 'markup' | 'lucro')}
          className="flex-row gap-0"
        >
          <TabsList>
            <TabsTrigger value="markup">markup</TabsTrigger>
            <TabsTrigger value="lucro">lucratividade</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="flex-1 flex flex-col gap-4 px-5 pb-3">

        {/* ── Definição de Preço ── */}
        <div className="flex flex-col gap-4">
          <span style={{ fontSize: '14px', fontWeight: 'var(--font-weight-medium)', fontFamily: "'Inter', sans-serif", color: '#404040', lineHeight: '20px' }}>
            Definição de Preço
          </span>

          {/* 3 fields row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Field 1: Editable (Markup or Lucratividade) */}
            <div className="flex flex-col gap-2">
              <FieldLabel style={{ color: '#059669' }}>{editableLabel}</FieldLabel>
              <InputGroup style={{ height: 44, borderColor: '#059669' }}>
                <InputGroupAddon>
                  <InputGroupText style={{ fontSize: '12px', color: '#059669' }}>%</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  type="number"
                  value={editableValue}
                  onChange={(e) => onEditableChange(parseFloat(e.target.value) || 0)}
                  step={0.5}
                  style={{ padding: '0 6px', color: 'var(--foreground)' }}
                />
                <div className="shrink-0 pr-2">
                  <StepperArrows
                    onUp={() => onEditableChange(+(editableValue + 0.5).toFixed(1))}
                    onDown={() => onEditableChange(+(editableValue - 0.5).toFixed(1))}
                    accentColor="#059669"
                  />
                </div>
              </InputGroup>
            </div>

            {/* Field 2: Custo Oper. (%) — read-only */}
            <div className="flex flex-col gap-2">
              <FieldLabel style={{ color: 'var(--muted-foreground)' }}>Custo Oper. (%)</FieldLabel>
              <InputGroup style={{ height: 44, background: 'var(--background)' }}>
                <InputGroupAddon>
                  <InputGroupText style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>%</InputGroupText>
                </InputGroupAddon>
                <InputGroupText style={{ flex: 1, padding: '0 6px', fontSize: '14px', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>
                  {custoOper.toFixed(1)}
                </InputGroupText>
                <InputGroupAddon align="inline-end">
                  <InputGroupText style={{ fontSize: '12px', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>
                    R${fmt(custoOperValue)}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>

            {/* Field 3: Computed (Lucratividade or Markup) */}
            <div className="flex flex-col gap-2">
              <FieldLabel style={{ color: 'var(--muted-foreground)' }}>{computedLabel}</FieldLabel>
              <InputGroup style={{ height: 44, background: 'var(--background)' }}>
                <InputGroupAddon>
                  <InputGroupText style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>%</InputGroupText>
                </InputGroupAddon>
                <InputGroupText style={{ flex: 1, padding: '0 6px', fontSize: '14px', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>
                  {computedValue.toFixed(1)}
                </InputGroupText>
                <InputGroupAddon align="inline-end">
                  <InputGroupText style={{ fontSize: '11px', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>
                    {mode === 'markup' ? `R$${fmt(precoSemIPI * lucroPct / 100)}` : `R$${fmt(precoSemIPI * markupPct / 100)}`}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </div>

        {/* ── Composição do Preço (collapsible) ── */}
        <div className="flex flex-col">
          <button className="flex items-center justify-between w-full cursor-pointer py-4" style={{ background: 'var(--card)' }} onClick={() => setCompositionOpen(!compositionOpen)}>
            <span style={{ fontSize: '14px', fontWeight: 'var(--font-weight-medium)', fontFamily: "'Inter', sans-serif", color: '#404040', lineHeight: '20px' }}>Composição do Preço</span>
            <div style={{ width: 16, height: 16 }}>
              <svg width="16" height="16" viewBox="0 0 9 5" fill="none" style={{ transform: compositionOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 200ms ease' }}>
                <path d={svgPaths.pc6cf80} fill="#525252" />
              </svg>
            </div>
          </button>

          {compositionOpen && (
            <div className="flex flex-col gap-3 pb-2">
              {/* Stacked bar */}
              <div className="flex overflow-hidden" style={{ height: 14, borderRadius: 9999 }}>
                {composition.map((c) => (
                  <div key={c.label} style={{ width: `${c.pct}%`, background: c.barColor, height: '100%' }} />
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-start justify-between">
                {composition.map((c) => (
                  <div key={c.label} className="flex items-center gap-1.5 px-1.5">
                    <div style={{ width: 6, height: 24, borderRadius: 2, background: c.pipColor, flexShrink: 0 }} />
                    <div className="flex flex-col">
                      <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-medium)', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)', lineHeight: '15px' }}>{c.label}</span>
                      <span style={{ fontSize: '12px', fontWeight: 'var(--font-weight-bold)', fontFamily: "'Inter', sans-serif", color: 'var(--foreground)', lineHeight: '18px' }}>R$ {fmt(c.value)}</span>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-medium)', fontFamily: "'Inter', sans-serif", color: '#94A3B8', lineHeight: '15px', marginLeft: 6 }}>{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Resultado — Preço sem/com IPI (redesigned) ── */}
        <div className="flex flex-col gap-3">
          <span style={{ fontSize: '14px', fontWeight: 'var(--font-weight-medium)', fontFamily: "'Inter', sans-serif", color: '#404040', lineHeight: '20px' }}>Resultado</span>

          <div className="grid grid-cols-2 gap-4">
            {/* Sem IPI — clean card style */}
            <div
              className="group relative rounded-[var(--radius-card)] transition-all"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                padding: '16px',
              }}
            >
              {/* Label + Edit icon */}
              <div className="flex items-center justify-between mb-3">
                <span style={{
                  fontSize: '10px',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontFamily: "'Inter', sans-serif",
                  color: 'var(--muted-foreground)',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}>
                  Valor de venda (sem IPI)
                </span>
                <div
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 'var(--radius-checkbox)',
                    background: 'color-mix(in srgb, var(--secondary) 70%, transparent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Pencil size={10} style={{ color: 'var(--foreground)' }} />
                </div>
              </div>

              {/* Value input — looks like display but editable */}
              <div className="relative">
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '14px',
                    fontWeight: 'var(--font-weight-medium)',
                    fontFamily: "'Inter', sans-serif",
                    color: 'var(--muted-foreground)',
                    pointerEvents: 'none',
                  }}
                >
                  R$
                </span>
                <input
                  type="number"
                  value={precoSemIPI}
                  onChange={(e) => handlePrecoSemIPIChange(parseFloat(e.target.value) || 0)}
                  step={0.50}
                  className="w-full outline-none transition-colors"
                  style={{
                    paddingLeft: '28px',
                    fontSize: '28px',
                    fontWeight: 'var(--font-weight-bold)',
                    fontFamily: "'Red Hat Display', sans-serif",
                    color: 'var(--foreground)',
                    lineHeight: '1.2',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '2px solid transparent',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderBottomColor = 'var(--border)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderBottomColor = 'transparent';
                  }}
                />
              </div>
            </div>

            {/* Com IPI — highlighted as primary result */}
            <div
              className="group relative rounded-[var(--radius-card)] transition-all"
              style={{
                background: 'color-mix(in srgb, #059669 4%, var(--card))',
                border: '2px solid #059669',
                padding: '16px',
                boxShadow: '0 0 0 3px color-mix(in srgb, #059669 8%, transparent)',
              }}
            >
              {/* Label + Edit icon */}
              <div className="flex items-center justify-between mb-3">
                <span style={{
                  fontSize: '10px',
                  fontWeight: 'var(--font-weight-bold)',
                  fontFamily: "'Inter', sans-serif",
                  color: '#047857',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}>
                  Valor de venda (com IPI)
                </span>
                <div
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 'var(--radius-checkbox)',
                    background: 'color-mix(in srgb, #059669 15%, transparent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Pencil size={10} style={{ color: '#047857' }} />
                </div>
              </div>

              {/* Value input — larger, more prominent */}
              <div className="relative">
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '14px',
                    fontWeight: 'var(--font-weight-semibold)',
                    fontFamily: "'Inter', sans-serif",
                    color: '#047857',
                    pointerEvents: 'none',
                  }}
                >
                  R$
                </span>
                <input
                  type="number"
                  value={precoComIPI}
                  onChange={(e) => handlePrecoComIPIChange(parseFloat(e.target.value) || 0)}
                  step={0.50}
                  className="w-full outline-none transition-colors"
                  style={{
                    paddingLeft: '28px',
                    fontSize: '28px',
                    fontWeight: 'var(--font-weight-bold)',
                    fontFamily: "'Red Hat Display', sans-serif",
                    color: '#059669',
                    lineHeight: '1.2',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '2px solid transparent',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderBottomColor = '#059669';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderBottomColor = 'transparent';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER HINT ═══ */}
      <div className="flex items-center gap-1 justify-center shrink-0" style={{ padding: '10px 12px', marginTop: 'auto' }}>
        <InfoCircleIcon />
        <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-normal)', fontFamily: "'Inter', sans-serif", color: 'var(--muted-foreground)', lineHeight: '15px' }}>
          {mode === 'markup'
            ? 'Altere o Markup para recalcular a Lucratividade, os valores propagam para a tabela de preços'
            : 'Altere a Lucratividade para recalcular o Markup, os valores propagam para a tabela de preços'
          }
        </span>
      </div>
    </Card>
  );
}