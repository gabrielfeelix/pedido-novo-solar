import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Download, DollarSign, Users, Search, Calendar,
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from './ui/table';
import {
  InputGroup, InputGroupAddon, InputGroupInput, InputGroupText,
} from './ui/input-group';
import { Field, FieldLabel } from './ui/field';

const FONT_INTER = "'Inter', sans-serif";
const FONT_RHD = "'Red Hat Display', sans-serif";

/* ── Types ── */
type CampaignStatus = 'aberta' | 'em_andamento' | 'finalizada' | 'cancelada';

interface CampaignProduct {
  sku: string;
  nome: string;
  tabelaDePreco: string;
  qtdOfertada: number;
  vlBruto: string;
  desconto: string;
  vlLiquido: string;
  vlVenda: string;
  status: string;
}

interface CampaignDetail {
  codigo: number;
  nome: string;
  status: CampaignStatus;
  periodoInicio: string;
  periodoConclusao: string;
  tipo: string;
  segmento: string;
  ecommerce: string;
  grupo: string[];
  responsavel: string;
  categoriaEcommerce: string;
  investimentoMarketing: number;
  metaFaturamento: number;
  metaPositivacao: number;
  descricaoConsultor: string;
  observacao: string;
  vendedor: {
    nome: string;
    foto: string;
  };
  produtos: CampaignProduct[];
}

/* ── Status config ── */
const statusConfig: Record<CampaignStatus, { label: string; bg: string; color: string }> = {
  aberta:       { label: 'Aberta',       bg: '#FFA726', color: '#FFFFFF' },
  em_andamento: { label: 'Em andamento', bg: 'var(--accent)', color: 'var(--accent-foreground)' },
  finalizada:   { label: 'Finalizada',   bg: '#00C853', color: '#FFFFFF' },
  cancelada:    { label: 'Cancelada',    bg: 'var(--destructive)', color: 'var(--destructive-foreground)' },
};

/* ── Mock data ── */
const mockCampaigns: Record<string, CampaignDetail> = {
  '1': {
    codigo: 136,
    nome: '3x3 So Hoje | 03 De Maro | Marcio',
    status: 'aberta',
    periodoInicio: '03/03/2026',
    periodoConclusao: '03/03/2026',
    tipo: 'Externa',
    segmento: 'Informatica',
    ecommerce: 'ODERCO',
    grupo: ['SDR', '+2'],
    responsavel: 'MARCIO HIDEO YASUMITSU',
    categoriaEcommerce: '03.03 So Hoje',
    investimentoMarketing: 54.00,
    metaFaturamento: 15000.00,
    metaPositivacao: 342,
    descricaoConsultor: '',
    observacao: '',
    vendedor: {
      nome: 'Marcio Yasumitsu',
      foto: 'https://images.unsplash.com/photo-1737574821698-862e77f044c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc21hbiUyMHBvcnRyYWl0JTIwb2ZmaWNlfGVufDF8fHx8MTc3MjA5MzY2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    produtos: [
      { sku: '373815', nome: 'COMPUTADOR B500 CORE B 500E 2.5GH2 MEM 16GB DDR4', tabelaDePreco: 'TABELA CORRENTE CRD-RMP-01', qtdOfertada: 10, vlBruto: 'R$ 1.747,08', desconto: '8%', vlLiquido: 'R$ 1.655,90', vlVenda: 'R$ 1.800,00', status: 'EM ANDAMENTO' },
      { sku: '373860', nome: 'COMPUTADOR B500 CORE B 81055 1.8GH2 MEM 16GB DDR4', tabelaDePreco: 'TABELA CORRENTE CRD-RMP-01', qtdOfertada: 5, vlBruto: 'R$ 1.477,70', desconto: '7%', vlLiquido: 'R$ 1.286,07', vlVenda: 'R$ 1.520,00', status: 'EM ANDAMENTO' },
      { sku: '364525', nome: 'COMPUTADOR 5500 CORE B-5000E 2.9GH2 MEM 16GB DDR5', tabelaDePreco: 'TABELA CORRENTE CRD-RMP-01', qtdOfertada: 8, vlBruto: 'R$ 4.323,99', desconto: '8%', vlLiquido: 'R$ 3.759,99', vlVenda: 'R$ 4.500,00', status: 'EM ANDAMENTO' },
      { sku: '356085', nome: 'COMPUTADOR 7100 8322R 2 3700G 3.8GH2 MEM 16GB DDR5', tabelaDePreco: 'TABELA CORRENTE CRD-RMP-01', qtdOfertada: 3, vlBruto: 'R$ 3.129,07', desconto: '8%', vlLiquido: 'R$ 2.798,98', vlVenda: 'R$ 3.200,00', status: 'EM ANDAMENTO' },
      { sku: '338835', nome: 'COMPUTADOR B500 CORE R-5200E 3.5GH2 MEM 16GB DDR5 SDD 512', tabelaDePreco: 'TABELA CORRENTE CRD-RMP-01', qtdOfertada: 12, vlBruto: 'R$ 3.219,07', desconto: '8%', vlLiquido: 'R$ 2.799,99', vlVenda: 'R$ 3.350,00', status: 'EM ANDAMENTO' },
      { sku: '334748', nome: 'COMPUTADOR 2500 8 3200 2.9GH2 MEM 16GB DDR5 POWE FONTE SSD', tabelaDePreco: 'TABELA CORRENTE CRD-RMP-01', qtdOfertada: 6, vlBruto: 'R$ 3.315,80', desconto: '10%', vlLiquido: 'R$ 2.819,28', vlVenda: 'R$ 3.450,00', status: 'EM ANDAMENTO' },
      { sku: '344851', nome: 'COMPUTADOR B500 1-32100 2.12100 MEM 16GB DDR5 512GB NVME', tabelaDePreco: 'TABELA CORRENTE CRD-RMP-01', qtdOfertada: 4, vlBruto: 'R$ 2.759,00', desconto: '10%', vlLiquido: 'R$ 2.599,00', vlVenda: 'R$ 2.900,00', status: 'EM ANDAMENTO' },
      { sku: '329797', nome: 'COMPUTADOR B300 1-32100 2.12GB MEM 16GB DDR5 SDD 512GB', tabelaDePreco: 'TABELA CORRENTE CRD-RMP-01', qtdOfertada: 7, vlBruto: 'R$ 2.504,90', desconto: '10%', vlLiquido: 'R$ 2.207,93', vlVenda: 'R$ 2.600,00', status: 'EM ANDAMENTO' },
      { sku: '326825', nome: 'COMPUTADOR 5500 CORE R-5000E 2.9GH2 MEM 16GB DDR5 SDD', tabelaDePreco: 'TABELA CORRENTE CRD-RMP-01', qtdOfertada: 9, vlBruto: 'R$ 2.647,07', desconto: '8%', vlLiquido: 'R$ 2.319,99', vlVenda: 'R$ 2.750,00', status: 'EM ANDAMENTO' },
      { sku: '326875', nome: 'COMPUTADOR B500 CORE R-5200E 2.9GH2 MEM 16GB DDR5 SDD 512', tabelaDePreco: 'TABELA CORRENTE CRD-RMP-01', qtdOfertada: 2, vlBruto: 'R$ 2.667,07', desconto: '8%', vlLiquido: 'R$ 2.319,99', vlVenda: 'R$ 2.780,00', status: 'EM ANDAMENTO' },
    ],
  },
};

/* ── Fallback: generate same structure for any campaign ID ── */
function getCampaign(id: string): CampaignDetail {
  if (mockCampaigns[id]) return mockCampaigns[id];
  return {
    ...mockCampaigns['1'],
    codigo: 100 + parseInt(id, 10),
    produtos: [], // empty for other campaigns
  };
}

/* ════════════════════════════════════════════════════
   CAMPAIGN DETAILS — Routed page
════════════════════════════════════════════════════ */
export function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const campaign = getCampaign(id ?? '1');
  const st = statusConfig[campaign.status];

  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Filtered & paginated products
  const filteredProducts = useMemo(() => {
    if (!filter.trim()) return campaign.produtos;
    const q = filter.toLowerCase();
    return campaign.produtos.filter(
      (p) => p.sku.includes(q) || p.nome.toLowerCase().includes(q),
    );
  }, [campaign.produtos, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
  const paginated = filteredProducts.slice((currentPage - 1) * perPage, currentPage * perPage);
  const rangeStart = filteredProducts.length === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const rangeEnd = Math.min(currentPage * perPage, filteredProducts.length);

  const fmtCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* ── Page Title ── */}
      <h1 className="od-title" style={{ margin: 0 }}>
        Ver Campanha
      </h1>

      {/* ── Back link ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 cursor-pointer self-start transition-colors"
        style={{
          background: 'transparent',
          border: 'none',
          fontFamily: FONT_INTER,
          fontSize: '13px',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--foreground)',
          padding: 0,
          marginTop: -8,
        }}
      >
        <ChevronLeft size={16} style={{ color: 'var(--foreground)' }} />
        Voltar
      </button>

      {/* ════════════════════════════════════════
          CAMPAIGN INFO CARD
      ════════════════════════════════════════ */}
      <Card style={{ padding: '28px 32px' }}>
        {/* Top row: Status badge + Title + Download */}
        <div className="flex items-start justify-between w-full" style={{ marginBottom: 24 }}>
          <div className="flex flex-col gap-2">
            {/* Status badge */}
            <Badge
              variant="outline"
              style={{
                background: st.bg,
                color: st.color,
                border: 'none',
                fontSize: '11px',
                fontWeight: 'var(--font-weight-bold)',
                padding: '3px 10px',
                borderRadius: 6,
                alignSelf: 'flex-start',
              }}
            >
              {st.label}
            </Badge>
            {/* Campaign title */}
            <div className="flex items-baseline gap-2">
              <span
                style={{
                  fontFamily: FONT_RHD,
                  fontSize: '22px',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--foreground)',
                  lineHeight: '1.3',
                }}
              >
                Campanha
              </span>
              <span
                style={{
                  fontFamily: FONT_INTER,
                  fontSize: '14px',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--muted-foreground)',
                }}
              >
                #{campaign.codigo}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="small"
            icon={<Download size={15} />}
          >
            Download
          </Button>
        </div>

        {/* Main content: Vendor Card + Fields Grid */}
        <div className="flex gap-8 w-full">
          {/* ── Vendor Card (left) ── */}
          <div
            className="shrink-0 flex flex-col items-center justify-center"
            style={{
              width: 220,
              background: 'var(--primary)',
              borderRadius: 'var(--radius-card)',
              padding: '32px 24px',
              gap: 16,
            }}
          >
            {/* Oderco branding text */}
            <span
              style={{
                fontFamily: FONT_INTER,
                fontSize: '10px',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--primary-foreground)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                opacity: 0.7,
              }}
            >
              ODERCO
            </span>

            {/* Photo */}
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid color-mix(in srgb, var(--primary-foreground) 25%, transparent)',
                flexShrink: 0,
              }}
            >
              <img
                src={campaign.vendedor.foto}
                alt={campaign.vendedor.nome}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Name */}
            <span
              style={{
                fontFamily: FONT_INTER,
                fontSize: '14px',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--primary-foreground)',
                textAlign: 'center',
                lineHeight: '20px',
              }}
            >
              {campaign.vendedor.nome}
            </span>
          </div>

          {/* ── Fields Grid (right) ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Row 1: Nome + Periodo */}
            <div className="grid grid-cols-2 gap-4">
              <ReadOnlyField label="Nome*" value={campaign.nome} />
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Periodo*</FieldLabel>
                <div className="flex items-center gap-2">
                  <InputGroup style={{ height: 40, flex: 1 }}>
                    <InputGroupAddon>
                      <Calendar size={14} style={{ color: 'var(--muted-foreground)' }} />
                    </InputGroupAddon>
                    <InputGroupText
                      style={{
                        flex: 1,
                        padding: '0 8px',
                        fontSize: '13px',
                        fontWeight: 'var(--font-weight-normal)',
                        color: 'var(--foreground)',
                      }}
                    >
                      {campaign.periodoInicio}
                    </InputGroupText>
                  </InputGroup>
                  <InputGroup style={{ height: 40, flex: 1 }}>
                    <InputGroupAddon>
                      <Calendar size={14} style={{ color: 'var(--muted-foreground)' }} />
                    </InputGroupAddon>
                    <InputGroupText
                      style={{
                        flex: 1,
                        padding: '0 8px',
                        fontSize: '13px',
                        fontWeight: 'var(--font-weight-normal)',
                        color: 'var(--foreground)',
                      }}
                    >
                      {campaign.periodoConclusao}
                    </InputGroupText>
                  </InputGroup>
                </div>
              </div>
            </div>

            {/* Row 2: Tipo + Segmento + E-commerce */}
            <div className="grid grid-cols-3 gap-4">
              <ReadOnlyField label="Tipo*" value={campaign.tipo} />
              <ReadOnlyField label="Segmento*" value={campaign.segmento} />
              <ReadOnlyField label="E-commerce*" value={campaign.ecommerce} />
            </div>

            {/* Row 3: Grupo + Responsavel + Categoria */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Grupo*</FieldLabel>
                <InputGroup style={{ height: 40 }}>
                  <div className="flex items-center gap-1.5 px-3 flex-1">
                    {campaign.grupo.map((g) => (
                      <span
                        key={g}
                        style={{
                          fontFamily: FONT_INTER,
                          fontSize: '11px',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--primary-foreground)',
                          background: 'var(--primary)',
                          borderRadius: 4,
                          padding: '2px 8px',
                        }}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </InputGroup>
              </div>
              <ReadOnlyField label="Responsavel*" value={campaign.responsavel} />
              <ReadOnlyField label="Categoria E-commerce" value={campaign.categoriaEcommerce} />
            </div>

            {/* Row 4: Investimento + Meta Faturamento + Meta Positivacao */}
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel>Investimento Marketing</FieldLabel>
                <InputGroup style={{ height: 40 }}>
                  <InputGroupAddon
                    style={{
                      background: 'var(--primary)',
                      width: 36,
                      borderRadius: 'var(--radius-input) 0 0 var(--radius-input)',
                    }}
                  >
                    <DollarSign size={14} style={{ color: 'var(--primary-foreground)' }} />
                  </InputGroupAddon>
                  <InputGroupText
                    style={{
                      flex: 1,
                      padding: '0 10px',
                      fontSize: '13px',
                      fontWeight: 'var(--font-weight-normal)',
                      color: 'var(--foreground)',
                    }}
                  >
                    {fmtCurrency(campaign.investimentoMarketing)}
                  </InputGroupText>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel>Meta Faturamento</FieldLabel>
                <InputGroup style={{ height: 40 }}>
                  <InputGroupAddon
                    style={{
                      background: 'var(--primary)',
                      width: 36,
                      borderRadius: 'var(--radius-input) 0 0 var(--radius-input)',
                    }}
                  >
                    <DollarSign size={14} style={{ color: 'var(--primary-foreground)' }} />
                  </InputGroupAddon>
                  <InputGroupText
                    style={{
                      flex: 1,
                      padding: '0 10px',
                      fontSize: '13px',
                      fontWeight: 'var(--font-weight-normal)',
                      color: 'var(--foreground)',
                    }}
                  >
                    {fmtCurrency(campaign.metaFaturamento)}
                  </InputGroupText>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel>Meta Positivacao</FieldLabel>
                <InputGroup style={{ height: 40 }}>
                  <InputGroupAddon
                    style={{
                      background: 'var(--primary)',
                      width: 36,
                      borderRadius: 'var(--radius-input) 0 0 var(--radius-input)',
                    }}
                  >
                    <Users size={14} style={{ color: 'var(--primary-foreground)' }} />
                  </InputGroupAddon>
                  <InputGroupText
                    style={{
                      flex: 1,
                      padding: '0 10px',
                      fontSize: '13px',
                      fontWeight: 'var(--font-weight-normal)',
                      color: 'var(--foreground)',
                    }}
                  >
                    {campaign.metaPositivacao}
                  </InputGroupText>
                </InputGroup>
              </Field>
            </div>

            {/* Row 5: Descricao + Observacao */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Descricao para Consultor</FieldLabel>
                <textarea
                  readOnly
                  placeholder="Digite a descricao"
                  value={campaign.descricaoConsultor}
                  rows={2}
                  style={{
                    fontFamily: FONT_INTER,
                    fontSize: '13px',
                    fontWeight: 'var(--font-weight-normal)',
                    color: 'var(--foreground)',
                    background: 'var(--input-background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-input)',
                    padding: '8px 12px',
                    resize: 'none',
                    outline: 'none',
                  }}
                />
              </Field>
              <Field>
                <FieldLabel>Observacao</FieldLabel>
                <textarea
                  readOnly
                  placeholder="Digite uma observacao"
                  value={campaign.observacao}
                  rows={2}
                  style={{
                    fontFamily: FONT_INTER,
                    fontSize: '13px',
                    fontWeight: 'var(--font-weight-normal)',
                    color: 'var(--foreground)',
                    background: 'var(--input-background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-input)',
                    padding: '8px 12px',
                    resize: 'none',
                    outline: 'none',
                  }}
                />
              </Field>
            </div>

            {/* Editar Campanha button (right-aligned) */}
            <div className="flex justify-end" style={{ marginTop: 8 }}>
              <Button variant="primary">
                Editar Campanha
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* ════════════════════════════════════════
          PRODUCTS TABLE
      ════════════════════════════════════════ */}
      <Card style={{ overflow: 'hidden' }}>
        {/* Table toolbar */}
        <div
          className="flex items-center justify-between w-full"
          style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}
        >
          {/* Filter input */}
          <InputGroup style={{ width: 300, height: 38 }}>
            <InputGroupInput
              placeholder="Filtre itens da campanha"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                fontSize: '13px',
                fontWeight: 'var(--font-weight-normal)',
              }}
            />
            <InputGroupAddon align="inline-end">
              <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <Table style={{ width: '100%' }}>
            <TableHeader>
              <TableRow>
                <TableHead>Sku</TableHead>
                <TableHead style={{ minWidth: 200 }}>Nome</TableHead>
                <TableHead>Tabela de Preco</TableHead>
                <TableHead>Qtde. Ofertada</TableHead>
                <TableHead>Vl. Bruto</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Vl. Liquido</TableHead>
                <TableHead style={{ color: 'var(--accent)' }}>Vl. Venda</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    style={{ textAlign: 'center', padding: '48px 16px' }}
                  >
                    <span
                      style={{
                        fontFamily: FONT_INTER,
                        fontSize: '13px',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      Nenhum resultado para exibir
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((p, idx) => (
                  <TableRow key={p.sku + idx}>
                    <TableCell style={{ fontFamily: FONT_INTER, fontSize: '12px' }}>
                      {p.sku}
                    </TableCell>
                    <TableCell
                      style={{
                        fontFamily: FONT_INTER,
                        fontSize: '12px',
                        maxWidth: 220,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {p.nome}
                    </TableCell>
                    <TableCell style={{ fontFamily: FONT_INTER, fontSize: '11px', color: 'var(--muted-foreground)' }}>
                      {p.tabelaDePreco}
                    </TableCell>
                    <TableCell style={{ fontFamily: FONT_INTER, fontSize: '12px' }}>
                      {p.qtdOfertada}
                    </TableCell>
                    <TableCell style={{ fontFamily: FONT_INTER, fontSize: '12px' }}>
                      {p.vlBruto}
                    </TableCell>
                    <TableCell style={{ fontFamily: FONT_INTER, fontSize: '12px' }}>
                      {p.desconto}
                    </TableCell>
                    <TableCell style={{ fontFamily: FONT_INTER, fontSize: '12px' }}>
                      {p.vlLiquido}
                    </TableCell>
                    <TableCell
                      style={{
                        fontFamily: FONT_INTER,
                        fontSize: '12px',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--accent)',
                      }}
                    >
                      {p.vlVenda}
                    </TableCell>
                    <TableCell>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          background: 'var(--accent)',
                          borderRadius: 4,
                          fontFamily: FONT_INTER,
                          fontSize: '10px',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--accent-foreground)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="mini">
                        Remover
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination footer */}
        <div
          className="flex items-center justify-between w-full"
          style={{ padding: '12px 24px', borderTop: '1px solid var(--border)' }}
        >
          {/* Left: range info */}
          <span
            style={{
              fontFamily: FONT_INTER,
              fontSize: '12px',
              color: 'var(--accent)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            {rangeStart} - {rangeEnd} de {filteredProducts.length} produtos.
          </span>

          {/* Right: page nav */}
          <div className="flex items-center gap-3">
            <span
              style={{
                fontFamily: FONT_INTER,
                fontSize: '12px',
                color: 'var(--foreground)',
              }}
            >
              Pagina {currentPage} de {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <PagBtn disabled={currentPage <= 1} onClick={() => setCurrentPage(1)}>
                <ChevronsLeft size={14} />
              </PagBtn>
              <PagBtn disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft size={14} />
              </PagBtn>
              <PagBtn disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                <ChevronRight size={14} />
              </PagBtn>
              <PagBtn disabled={currentPage >= totalPages} onClick={() => setCurrentPage(totalPages)}>
                <ChevronsRight size={14} />
              </PagBtn>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ── Helper: Read-only field with InputGroup ── */
function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <InputGroup style={{ height: 40 }}>
        <InputGroupText
          style={{
            flex: 1,
            padding: '0 12px',
            fontSize: '13px',
            fontWeight: 'var(--font-weight-normal)',
            color: 'var(--foreground)',
          }}
        >
          {value}
        </InputGroupText>
      </InputGroup>
    </Field>
  );
}

/* ── Pagination button ── */
function PagBtn({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center cursor-pointer transition-colors"
      style={{
        width: 28,
        height: 28,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-checkbox)',
        color: disabled ? 'var(--muted)' : 'var(--foreground)',
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}
