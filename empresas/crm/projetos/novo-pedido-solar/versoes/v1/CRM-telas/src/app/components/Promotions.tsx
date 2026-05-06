import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Tag, MoreHorizontal, Calendar,
  ChevronLeft, ChevronRight,
  ArrowRight, Target, Plus, Eye, Pencil,
  Search, X, DollarSign, Users, Package,
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from './ui/dialog';
import { Field, FieldLabel } from './ui/field';
import { InputGroup, InputGroupInput } from './ui/input-group';

/* ── Types ── */
type CampaignStatus = 'aberta' | 'em_andamento' | 'finalizada' | 'cancelada';

interface Campaign {
  id: string;
  codigo: number;
  campanha: string;
  segmento: string;
  metaPositivacao?: number; // Meta de Positivação
  periodoInicio: string;
  periodoConclusao: string;
  status: CampaignStatus;
}

/* ── Mock Data ── */
const mockCampaigns: Campaign[] = [
  { id: '1',  codigo: 136, campanha: '3x3 Só Hoje | 03 De Março | Marcio',                    segmento: 'Informática', metaPositivacao: 342,  periodoInicio: '03/03/2026', periodoConclusao: '03/03/2026', status: 'aberta' },
  { id: '2',  codigo: 135, campanha: '3x3 Só Hoje | 03 De Março | Flavio',                    segmento: 'Informática', metaPositivacao: 256,  periodoInicio: '03/03/2026', periodoConclusao: '03/03/2026', status: 'aberta' },
  { id: '3',  codigo: 134, campanha: '3x3 Só Hoje | 03 De Março | Teramon',                   segmento: 'Informática', metaPositivacao: 189,  periodoInicio: '03/03/2026', periodoConclusao: '03/03/2026', status: 'aberta' },
  { id: '4',  codigo: 133, campanha: '3x3 Só Hoje | 03 De Março | Zaguini',                   segmento: 'Informática', metaPositivacao: 412,  periodoInicio: '03/03/2026', periodoConclusao: '03/03/2026', status: 'aberta' },
  { id: '5',  codigo: 132, campanha: '3x3 Só Hoje | 03 De Março | Paula',                     segmento: 'Informática', metaPositivacao: 298,  periodoInicio: '03/03/2026', periodoConclusao: '03/03/2026', status: 'aberta' },
  { id: '6',  codigo: 131, campanha: '3x3 Só Hoje | 03 De Março | Cleber',                    segmento: 'Informática', metaPositivacao: 175,  periodoInicio: '03/03/2026', periodoConclusao: '03/03/2026', status: 'aberta' },
  { id: '7',  codigo: 130, campanha: '3x3 Só Hoje | 03 De Março | Murilo',                    segmento: 'Informática', metaPositivacao: 523,  periodoInicio: '03/03/2026', periodoConclusao: '03/03/2026', status: 'aberta' },
  { id: '8',  codigo: 129, campanha: '3x3 Só Hoje | 03 De Março | Alfredo',                   segmento: 'Informática', metaPositivacao: 387,  periodoInicio: '03/03/2026', periodoConclusao: '03/03/2026', status: 'aberta' },
  { id: '9',  codigo: 128, campanha: 'Oportunidades Da Semana | 25 A 03 De Março | Alfredo',  segmento: 'Informática', metaPositivacao: 641,  periodoInicio: '25/02/2026', periodoConclusao: '03/03/2026', status: 'aberta' },
  { id: '10', codigo: 127, campanha: 'Oportunidades Da Semana | 25 A 03 De Março | Paula',    segmento: 'Informática', metaPositivacao: 455,  periodoInicio: '25/02/2026', periodoConclusao: '03/03/2026', status: 'em_andamento' },
  { id: '11', codigo: 126, campanha: 'Flash Sale Fevereiro | 15 De Fevereiro | Teramon',      segmento: 'Informática', metaPositivacao: 234,  periodoInicio: '15/02/2026', periodoConclusao: '15/02/2026', status: 'finalizada' },
  { id: '12', codigo: 125, campanha: 'Queima De Estoque Q1 | 01 a 15 Jan | Marcio',           segmento: 'Informática', periodoInicio: '01/01/2026', periodoConclusao: '15/01/2026', status: 'cancelada' },
];

const statusConfig: Record<CampaignStatus, {
  label: string;
  bg: string;
  color: string;
  dotColor: string;
  accentBar: string;
}> = {
  aberta:       { label: 'Aberta',         bg: '#FFA726', color: '#FFFFFF', dotColor: '#FFFFFF', accentBar: '#FFA726' },
  em_andamento: { label: 'Em andamento',   bg: '#2196F3', color: '#FFFFFF', dotColor: '#FFFFFF', accentBar: '#2196F3' },
  finalizada:   { label: 'Finalizada',     bg: '#00C853', color: '#FFFFFF', dotColor: '#FFFFFF', accentBar: '#00C853' },
  cancelada:    { label: 'Cancelada',      bg: '#FF3D00', color: '#FFFFFF', dotColor: '#FFFFFF', accentBar: '#FF3D00' },
};

const FONT_INTER = "'Inter', sans-serif";
const FONT_RHD   = "'Red Hat Display', sans-serif";
const PER_PAGE   = 5;

/* ── Parse campaign name into parts ── */
function parseCampanha(name: string): { tipo: string; periodo: string; vendedor: string } {
  const parts = name.split('|').map((s) => s.trim());
  return {
    tipo:     parts[0] ?? name,
    periodo:  parts[1] ?? '',
    vendedor: parts[2] ?? '',
  };
}

/* ── Initials avatar ── */
function VendedorAvatar({ name }: { name: string }) {
  const initials = name.slice(0, 2).toUpperCase();
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: `hsl(${hue}, 55%, 88%)`,
        color: `hsl(${hue}, 55%, 35%)`,
        fontFamily: FONT_INTER,
        fontSize: '9px',
        fontWeight: 'var(--font-weight-bold)',
      }}
    >
      {initials}
    </div>
  );
}

/* ── Campaign Card (Full-width horizontal layout) ── */
function CampaignCard({ c, onViewDetails, onEdit }: { c: Campaign; onViewDetails: (id: string) => void; onEdit: (campaign: Campaign) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const st = statusConfig[c.status];
  const { tipo, periodo, vendedor } = parseCampanha(c.campanha);

  return (
    <div
      className="flex transition-shadow"
      style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--elevation-sm)',
        position: 'relative',
        overflow: 'visible',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px 0 rgba(0,0,0,0.10)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--elevation-sm)'; }}
    >
      {/* Main horizontal layout */}
      <div className="flex items-center flex-1 min-w-0 gap-4" style={{ padding: '14px 16px' }}>

        {/* ── Left section: Code chip + Campaign info ── */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Code chip */}
          <span
            style={{
              fontFamily: FONT_INTER,
              fontSize: '10px',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--muted-foreground)',
              letterSpacing: '0.4px',
              background: 'color-mix(in srgb, var(--secondary) 70%, transparent)',
              borderRadius: 4,
              padding: '4px 8px',
              flexShrink: 0,
            }}
          >
            #{c.codigo}
          </span>

          {/* Campaign name + metadata */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            {/* Title row: Campaign name + Segmento */}
            <div className="flex items-center gap-2 min-w-0">
              <span
                style={{
                  fontFamily: FONT_RHD,
                  fontSize: '13px',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  lineHeight: '18px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {tipo}
              </span>
              <span style={{
                fontFamily: FONT_INTER,
                fontSize: '11px',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--muted-foreground)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                {c.segmento}
              </span>
            </div>

            {/* Metadata row: Period · Vendedor · Meta */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Calendar size={11} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                <span style={{
                  fontFamily: FONT_INTER,
                  fontSize: '11px',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  whiteSpace: 'nowrap',
                }}>
                  {c.periodoInicio}
                </span>
                {c.periodoInicio !== c.periodoConclusao && (
                  <>
                    <ArrowRight size={9} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                    <span style={{
                      fontFamily: FONT_INTER,
                      fontSize: '11px',
                      color: 'var(--muted-foreground)',
                      whiteSpace: 'nowrap',
                    }}>
                      {c.periodoConclusao}
                    </span>
                  </>
                )}
                {c.periodoInicio === c.periodoConclusao && (
                  <span style={{
                    fontFamily: FONT_INTER,
                    fontSize: '10px',
                    color: 'var(--muted-foreground)',
                  }}>
                    (1 dia)
                  </span>
                )}
              </div>

              {vendedor && (
                <>
                  <span style={{ color: 'var(--muted)', fontSize: '10px' }}>·</span>
                  <div className="flex items-center gap-1">
                    <VendedorAvatar name={vendedor} />
                    <span style={{
                      fontFamily: FONT_INTER,
                      fontSize: '11px',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--foreground)',
                      lineHeight: '16px',
                    }}>
                      {vendedor}
                    </span>
                  </div>
                </>
              )}

              {c.metaPositivacao && (
                <>
                  <span style={{ color: 'var(--muted)', fontSize: '10px' }}>·</span>
                  <span
                    className="flex items-center gap-1"
                    style={{
                      fontFamily: FONT_INTER,
                      fontSize: '11px',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--foreground)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Target size={12} style={{ color: 'var(--accent)' }} />
                    {c.metaPositivacao}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Right section: Status + Actions ── */}
        <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
          {/* Status badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5"
            style={{
              background: st.bg,
              borderRadius: 6,
            }}
          >
            <span style={{
              fontFamily: FONT_INTER,
              fontSize: '11px',
              fontWeight: 'var(--font-weight-semibold)',
              color: st.color,
              whiteSpace: 'nowrap',
            }}>
              {st.label}
            </span>
          </div>

          {/* More options button with dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="flex items-center justify-center cursor-pointer transition-colors"
              style={{
                width: 26,
                height: 26,
                borderRadius: 'var(--radius-checkbox)',
                background: menuOpen ? 'color-mix(in srgb, var(--secondary) 60%, transparent)' : 'transparent',
                border: 'none',
                color: 'var(--muted-foreground)',
                flexShrink: 0,
              }}
              onClick={() => setMenuOpen(!menuOpen)}
              onMouseEnter={(e) => { if (!menuOpen) (e.currentTarget as HTMLElement).style.background = 'color-mix(in srgb, var(--secondary) 60%, transparent)'; }}
              onMouseLeave={(e) => { if (!menuOpen) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <MoreHorizontal size={14} />
            </button>
            
            {menuOpen && (
              <>
                {/* Backdrop */}
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 10,
                  }}
                  onClick={() => setMenuOpen(false)}
                />
                
                {/* Dropdown Menu */}
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 32,
                    zIndex: 20,
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    minWidth: 160,
                    padding: '4px 0',
                  }}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onViewDetails(c.id);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: 'transparent',
                      fontFamily: FONT_INTER,
                      fontSize: '13px',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--foreground)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'color-mix(in srgb, var(--secondary) 60%, transparent)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    Detalhes
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(c);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: 'transparent',
                      fontFamily: FONT_INTER,
                      fontSize: '13px',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--foreground)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'color-mix(in srgb, var(--secondary) 60%, transparent)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    Editar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════
   PROMOTIONS — Promoções Vigentes (card grid)
═════════════════════════════════════════════════ */
export function Promotions({ onViewCampaign }: { onViewCampaign?: (campaignId: string) => void }) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_PAGE);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const campaigns = mockCampaigns;
  const navigate = useNavigate();

  const handleViewCampaign = (id: string) => {
    navigate(`/campanha/${id}`);
  };

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setModalOpen(true);
  };

  const handleModalSave = (data: CampaignFormData) => {
    // In a real app, this would POST/PUT to the API
    console.log(editingCampaign ? 'Updating campaign:' : 'Creating campaign:', data);
    setModalOpen(false);
    setEditingCampaign(null);
  };

  const totalPages = Math.max(1, Math.ceil(campaigns.length / perPage));
  const paginated = useMemo(
    () => campaigns.slice((page - 1) * perPage, page * perPage),
    [campaigns, page, perPage],
  );

  return (
    <>
      <Card className="w-full h-full flex flex-col" style={{ overflow: 'visible', alignItems: 'stretch' }}>

        {/* ── Header ── */}
        <div
          className="px-5 flex items-center justify-between shrink-0"
          style={{ borderBottom: '1px solid var(--border)', height: '56px' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 28,
                height: 28,
                borderRadius: 'var(--radius)',
                background: 'color-mix(in srgb, var(--muted-foreground) 10%, transparent)',
              }}
            >
              <Tag size={14} style={{ color: 'var(--muted-foreground)' }} />
            </div>
            <div className="flex flex-col">
              <span style={{
                fontSize: '14px',
                fontWeight: 'var(--font-weight-semibold)',
                fontFamily: FONT_RHD,
                color: 'var(--foreground)',
                lineHeight: '21px',
              }}>
                Campanhas Vigentes
              </span>
              <span style={{
                fontSize: '11px',
                fontFamily: FONT_INTER,
                color: 'var(--muted-foreground)',
                lineHeight: '16px',
              }}>
                Campanhas ativas com este produto
              </span>
            </div>
          </div>

          {/* Add Promotion button */}
          <Button
            variant="outline"
            size="small"
            icon={<Plus size={14} />}
            onClick={handleOpenCreate}
          >
            Nova campanha
          </Button>
        </div>

        {/* ── Card List (full-width layout) ── */}
        <div className="flex-1 min-h-0 overflow-y-auto" style={{ padding: '14px 16px 12px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center" style={{ padding: '40px 0' }}>
                <Tag size={28} style={{ color: 'var(--muted-foreground)', opacity: 0.4, marginBottom: 8 }} />
                <span style={{ fontFamily: FONT_INTER, fontSize: '13px', color: 'var(--muted-foreground)' }}>
                  Nenhuma campanha vigente
                </span>
              </div>
            ) : (
              paginated.map((c) => (
                <CampaignCard
                  key={c.id}
                  c={c}
                  onViewDetails={handleViewCampaign}
                  onEdit={handleOpenEdit}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Pagination Footer ── */}
        <div
          className="shrink-0 flex items-center justify-between"
          style={{
            borderTop: '1px solid var(--border)',
            padding: '12px 20px',
            background: 'var(--card)',
          }}
        >
          {/* Left: count */}
          <span style={{
            fontFamily: FONT_INTER,
            fontSize: '12px',
            color: 'var(--muted-foreground)',
          }}>
            {paginated.length} de {campaigns.length} campanhas
          </span>

          {/* Right: pagination */}
          <NumberedPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </Card>

      {/* ── Campaign Modal (Create / Edit) ── */}
      <CampaignModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingCampaign(null);
        }}
        campaign={editingCampaign}
        onSave={handleModalSave}
      />
    </>
  );
}

/* ── Form data type ── */
interface CampaignFormData {
  campanha: string;
  tipo: string;
  segmento: string;
  ecommerce: string;
  grupo: string[];
  responsavel: string;
  categoriaEcommerce: string;
  investimentoMarketing: string;
  metaFaturamento: string;
  metaPositivacao: string;
  periodoInicio: string;
  periodoConclusao: string;
  descricaoConsultor: string;
  observacao: string;
  status: CampaignStatus;
  produtos: SelectedProduct[];
}

/* ── Product search types ── */
interface SelectedProduct {
  sku: string;
  nome: string;
  preco: number;
}

const mockProductCatalog: SelectedProduct[] = [
  { sku: '34420', nome: 'PILHA ALCALINA AA C/6 LR6XAB/L6P5192', preco: 14.20 },
  { sku: '1403',  nome: 'MICROFONE PROFISSIONAL SM58 P4 BK PRETO FOSCO', preco: 119.90 },
  { sku: '17416', nome: 'SUPORTE PORTATIL PARA VIOLAO SGV PRETO', preco: 36.60 },
  { sku: '32516', nome: 'ANTI-FEEDBACK ABAFADOR VIOLAO CLASSICO BOCA REDONDA AFCL', preco: 20.90 },
  { sku: '032290', nome: 'FONTE REAL 600W 80 PLUS BRONZE GM600 GAMEMAX', preco: 289.90 },
  { sku: '035801', nome: 'GABINETE GAMER MID-TOWER ASGARD III RGB GAMDIAS', preco: 349.90 },
  { sku: '038150', nome: 'TECLADO MECANICO GAMER RGB SWITCH BLUE TC210 MULTILASER', preco: 179.90 },
  { sku: '041220', nome: 'MOUSE GAMER 12000DPI RGB 7 BOTOES MO607 MULTILASER', preco: 89.90 },
  { sku: '045601', nome: 'HEADSET GAMER 7.1 USB LED RGB H2 FORTREK', preco: 129.90 },
  { sku: '048900', nome: 'MONITOR GAMER 24P 144HZ 1MS FHD IPS ACER', preco: 899.90 },
];

const GRUPO_OPTIONS = ['SDR', 'Closer', 'CS', 'Farmer', 'Hunter'];

/* ── Campaign Modal Component ── */
function CampaignModal({
  open,
  onOpenChange,
  campaign,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
  onSave: (data: CampaignFormData) => void;
}) {
  const isEdit = campaign !== null;
  const parsed = campaign ? parseCampanha(campaign.campanha) : null;

  const emptyForm: CampaignFormData = {
    campanha: '',
    tipo: 'Externa',
    segmento: 'Informática',
    ecommerce: 'ODERCO',
    grupo: ['SDR'],
    responsavel: '',
    categoriaEcommerce: '',
    investimentoMarketing: 'R$ 0,00',
    metaFaturamento: 'R$ 0,00',
    metaPositivacao: '',
    periodoInicio: '',
    periodoConclusao: '',
    descricaoConsultor: '',
    observacao: '',
    status: 'aberta',
    produtos: [],
  };

  const [formData, setFormData] = useState<CampaignFormData>(emptyForm);
  const [productSearch, setProductSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Sync form data when campaign changes
  useMemo(() => {
    if (campaign && parsed) {
      setFormData({
        campanha: campaign.campanha,
        tipo: 'Externa',
        segmento: campaign.segmento,
        ecommerce: 'ODERCO',
        grupo: ['SDR'],
        responsavel: parsed.vendedor.toUpperCase(),
        categoriaEcommerce: parsed.periodo ? `${parsed.periodo.replace(/\s/g, '.')}` : '',
        investimentoMarketing: 'R$ 0,00',
        metaFaturamento: 'R$ 0,00',
        metaPositivacao: campaign.metaPositivacao?.toString() || '0',
        periodoInicio: campaign.periodoInicio,
        periodoConclusao: campaign.periodoConclusao,
        descricaoConsultor: '',
        observacao: '',
        status: campaign.status,
        produtos: mockProductCatalog.slice(0, 3),
      });
    } else {
      setFormData(emptyForm);
    }
    setProductSearch('');
    setShowSearchResults(false);
  }, [campaign]);

  const update = (key: keyof CampaignFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return [];
    const q = productSearch.toLowerCase();
    return mockProductCatalog.filter(
      (p) =>
        (p.sku.toLowerCase().includes(q) || p.nome.toLowerCase().includes(q)) &&
        !formData.produtos.some((sp) => sp.sku === p.sku),
    );
  }, [productSearch, formData.produtos]);

  const addProduct = (product: SelectedProduct) => {
    setFormData((prev) => ({ ...prev, produtos: [...prev.produtos, product] }));
    setProductSearch('');
    setShowSearchResults(false);
  };

  const removeProduct = (sku: string) => {
    setFormData((prev) => ({ ...prev, produtos: prev.produtos.filter((p) => p.sku !== sku) }));
  };

  const toggleGrupo = (g: string) => {
    setFormData((prev) => ({
      ...prev,
      grupo: prev.grupo.includes(g) ? prev.grupo.filter((x) => x !== g) : [...prev.grupo, g],
    }));
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: FONT_INTER,
    fontSize: '13px',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--foreground)',
    background: 'var(--input-background)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-input)',
    padding: '0 12px',
    height: 40,
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23737373' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: FONT_INTER,
    fontSize: '13px',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--foreground)',
    background: 'var(--input-background)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-input)',
    padding: '10px 12px',
    outline: 'none',
    resize: 'vertical',
    minHeight: 60,
  };

  const sectionLabelStyle: React.CSSProperties = {
    fontFamily: FONT_RHD,
    fontSize: '13px',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--foreground)',
    marginBottom: 4,
  };

  const iconInputStyle = (size: number): React.CSSProperties => ({
    height: 40,
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-input)',
    background: 'var(--input-background)',
    overflow: 'hidden',
  });

  const iconBoxStyle: React.CSSProperties = {
    width: 36,
    height: '100%',
    background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
    borderRight: '1px solid var(--border)',
  };

  const innerInputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    background: 'transparent',
    padding: '0 12px',
    fontFamily: FONT_INTER,
    fontSize: '13px',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--foreground)',
    outline: 'none',
    height: '100%',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[720px]"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)',
          padding: 0,
          gap: 0,
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.16)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── Header ── */}
        <div style={{ padding: '24px 24px 0 24px', flexShrink: 0 }}>
          <DialogHeader>
            <DialogTitle
              style={{
                fontFamily: FONT_RHD,
                fontSize: '18px',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--foreground)',
                lineHeight: '1.3',
              }}
            >
              {isEdit ? `Editar campanha #${campaign.codigo}` : 'Nova campanha'}
            </DialogTitle>
            <DialogDescription
              style={{
                fontFamily: FONT_INTER,
                fontSize: '13px',
                color: 'var(--muted-foreground)',
                marginTop: 4,
              }}
            >
              {isEdit
                ? 'Altere os dados da campanha e clique em salvar.'
                : 'Preencha os dados e adicione os produtos da campanha.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* ── Scrollable Form Body ── */}
        <div style={{ padding: '20px 24px 24px 24px', overflowY: 'auto', flex: 1 }} className="flex flex-col gap-5">

          {/* ═══ Section 1: Dados da Campanha ═══ */}
          <div className="flex flex-col gap-3">
            <div style={sectionLabelStyle}>Dados da campanha</div>

            {/* Row: Nome* */}
            <Field>
              <FieldLabel htmlFor="campanha">Nome*</FieldLabel>
              <InputGroup style={{ height: 40 }}>
                <InputGroupInput
                  id="campanha"
                  placeholder="Ex: 3x3 Só Hoje | 03 De Março | Marcio"
                  value={formData.campanha}
                  onChange={(e) => update('campanha', e.target.value)}
                />
              </InputGroup>
            </Field>

            {/* Row: Periodo */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="inicio">Periodo inicio*</FieldLabel>
                <InputGroup style={{ height: 40 }}>
                  <InputGroupInput
                    id="inicio"
                    placeholder="dd/mm/aaaa"
                    value={formData.periodoInicio}
                    onChange={(e) => update('periodoInicio', e.target.value)}
                  />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="conclusao">Periodo conclusao*</FieldLabel>
                <InputGroup style={{ height: 40 }}>
                  <InputGroupInput
                    id="conclusao"
                    placeholder="dd/mm/aaaa"
                    value={formData.periodoConclusao}
                    onChange={(e) => update('periodoConclusao', e.target.value)}
                  />
                </InputGroup>
              </Field>
            </div>

            {/* Row: Tipo + Segmento + E-commerce */}
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel htmlFor="tipo">Tipo*</FieldLabel>
                <select id="tipo" value={formData.tipo} onChange={(e) => update('tipo', e.target.value)} style={selectStyle}>
                  <option value="Externa">Externa</option>
                  <option value="Interna">Interna</option>
                  <option value="Flash">Flash</option>
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="segmento">Segmento*</FieldLabel>
                <select id="segmento" value={formData.segmento} onChange={(e) => update('segmento', e.target.value)} style={selectStyle}>
                  <option value="Informática">Informática</option>
                  <option value="Eletrônicos">Eletrônicos</option>
                  <option value="Periféricos">Periféricos</option>
                  <option value="Acessórios">Acessórios</option>
                  <option value="Energia Solar">Energia Solar</option>
                  <option value="Automotivo">Automotivo</option>
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="ecommerce">E-commerce*</FieldLabel>
                <select id="ecommerce" value={formData.ecommerce} onChange={(e) => update('ecommerce', e.target.value)} style={selectStyle}>
                  <option value="ODERCO">ODERCO</option>
                  <option value="MEGA ODERCO">MEGA ODERCO</option>
                </select>
              </Field>
            </div>

            {/* Row: Grupo + Responsavel + Categoria E-commerce */}
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel>Grupo*</FieldLabel>
                <div className="flex items-center gap-1.5 flex-wrap" style={{ minHeight: 40 }}>
                  {GRUPO_OPTIONS.map((g) => (
                    <button
                      key={g}
                      onClick={() => toggleGrupo(g)}
                      className="cursor-pointer transition-colors"
                      style={{
                        fontFamily: FONT_INTER,
                        fontSize: '11px',
                        fontWeight: 'var(--font-weight-semibold)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius)',
                        border: formData.grupo.includes(g) ? '1px solid var(--accent)' : '1px solid var(--border)',
                        background: formData.grupo.includes(g) ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'var(--input-background)',
                        color: formData.grupo.includes(g) ? 'var(--accent)' : 'var(--muted-foreground)',
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="responsavel">Responsavel*</FieldLabel>
                <InputGroup style={{ height: 40 }}>
                  <InputGroupInput id="responsavel" placeholder="NOME COMPLETO" value={formData.responsavel} onChange={(e) => update('responsavel', e.target.value)} />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="catEcommerce">Categoria E-commerce</FieldLabel>
                <InputGroup style={{ height: 40 }}>
                  <InputGroupInput id="catEcommerce" placeholder="Ex: 03.03 Só Hoje" value={formData.categoriaEcommerce} onChange={(e) => update('categoriaEcommerce', e.target.value)} />
                </InputGroup>
              </Field>
            </div>

            {/* Row: Investimento Marketing + Meta Faturamento + Meta Positivação */}
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel htmlFor="invMarketing">Investimento Marketing</FieldLabel>
                <div className="flex items-center" style={iconInputStyle(40)}>
                  <div className="flex items-center justify-center shrink-0" style={iconBoxStyle}><DollarSign size={14} style={{ color: 'var(--accent)' }} /></div>
                  <input id="invMarketing" value={formData.investimentoMarketing} onChange={(e) => update('investimentoMarketing', e.target.value)} style={innerInputStyle} />
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="metaFat">Meta Faturamento</FieldLabel>
                <div className="flex items-center" style={iconInputStyle(40)}>
                  <div className="flex items-center justify-center shrink-0" style={iconBoxStyle}><DollarSign size={14} style={{ color: 'var(--accent)' }} /></div>
                  <input id="metaFat" value={formData.metaFaturamento} onChange={(e) => update('metaFaturamento', e.target.value)} style={innerInputStyle} />
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="metaPos">Meta Positivacao</FieldLabel>
                <div className="flex items-center" style={iconInputStyle(40)}>
                  <div className="flex items-center justify-center shrink-0" style={iconBoxStyle}><Users size={14} style={{ color: 'var(--accent)' }} /></div>
                  <input id="metaPos" type="number" value={formData.metaPositivacao} onChange={(e) => update('metaPositivacao', e.target.value)} placeholder="0" style={innerInputStyle} />
                </div>
              </Field>
            </div>

            {/* Row: Descricao + Observacao */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="descricao">Descricao para Consultor</FieldLabel>
                <textarea id="descricao" placeholder="Digite a descricao" value={formData.descricaoConsultor} onChange={(e) => update('descricaoConsultor', e.target.value)} style={textareaStyle} />
              </Field>
              <Field>
                <FieldLabel htmlFor="observacao">Observacao</FieldLabel>
                <textarea id="observacao" placeholder="Digite uma observacao" value={formData.observacao} onChange={(e) => update('observacao', e.target.value)} style={textareaStyle} />
              </Field>
            </div>
          </div>

          {/* ═══ Section divider ═══ */}
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

          {/* ═══ Section 2: Produtos da Campanha ═══ */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={15} style={{ color: 'var(--accent)' }} />
                <span style={sectionLabelStyle}>Produtos da campanha</span>
              </div>
              <span style={{ fontFamily: FONT_INTER, fontSize: '11px', color: 'var(--muted-foreground)' }}>
                {formData.produtos.length} produto{formData.produtos.length !== 1 ? 's' : ''} adicionado{formData.produtos.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Product search bar */}
            <div style={{ position: 'relative' }}>
              <div className="flex items-center" style={iconInputStyle(40)}>
                <div className="flex items-center justify-center shrink-0" style={{ width: 36, height: '100%' }}>
                  <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
                </div>
                <input
                  placeholder="Buscar produto por SKU ou nome..."
                  value={productSearch}
                  onChange={(e) => { setProductSearch(e.target.value); setShowSearchResults(true); }}
                  onFocus={() => { if (productSearch.trim()) setShowSearchResults(true); }}
                  style={{ ...innerInputStyle, paddingLeft: 0 }}
                />
                {productSearch && (
                  <button onClick={() => { setProductSearch(''); setShowSearchResults(false); }} className="flex items-center justify-center cursor-pointer shrink-0" style={{ width: 28, height: 28, border: 'none', background: 'transparent', color: 'var(--muted-foreground)', marginRight: 4 }}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Search results dropdown */}
              {showSearchResults && filteredProducts.length > 0 && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setShowSearchResults(false)} />
                  <div style={{ position: 'absolute', top: 44, left: 0, right: 0, zIndex: 20, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: 200, overflowY: 'auto' }}>
                    {filteredProducts.map((p) => (
                      <button
                        key={p.sku}
                        onClick={() => addProduct(p)}
                        className="flex items-center gap-3 w-full cursor-pointer transition-colors"
                        style={{ padding: '10px 12px', border: 'none', background: 'transparent', textAlign: 'left' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'color-mix(in srgb, var(--secondary) 60%, transparent)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <span style={{ fontFamily: FONT_INTER, fontSize: '11px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', background: 'color-mix(in srgb, var(--secondary) 70%, transparent)', padding: '2px 6px', borderRadius: 3, flexShrink: 0 }}>{p.sku}</span>
                        <span style={{ fontFamily: FONT_INTER, fontSize: '12px', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nome}</span>
                        <span style={{ fontFamily: FONT_INTER, fontSize: '12px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--accent)', flexShrink: 0 }}>R$ {p.preco.toFixed(2).replace('.', ',')}</span>
                        <Plus size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Selected products list */}
            {formData.produtos.length > 0 && (
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <div className="flex items-center gap-3" style={{ padding: '8px 12px', background: 'color-mix(in srgb, var(--secondary) 50%, transparent)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ width: 60, fontFamily: FONT_INTER, fontSize: '10px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SKU</span>
                  <span style={{ flex: 1, fontFamily: FONT_INTER, fontSize: '10px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nome</span>
                  <span style={{ width: 80, fontFamily: FONT_INTER, fontSize: '10px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Preco</span>
                  <span style={{ width: 28 }} />
                </div>
                {formData.produtos.map((p, i) => (
                  <div key={p.sku} className="flex items-center gap-3" style={{ padding: '8px 12px', borderBottom: i < formData.produtos.length - 1 ? '1px solid color-mix(in srgb, var(--border) 50%, transparent)' : 'none' }}>
                    <span style={{ width: 60, fontFamily: FONT_INTER, fontSize: '12px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>{p.sku}</span>
                    <span style={{ flex: 1, fontFamily: FONT_INTER, fontSize: '12px', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nome}</span>
                    <span style={{ width: 80, fontFamily: FONT_INTER, fontSize: '12px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', textAlign: 'right' }}>R$ {p.preco.toFixed(2).replace('.', ',')}</span>
                    <button
                      onClick={() => removeProduct(p.sku)}
                      className="flex items-center justify-center cursor-pointer transition-colors"
                      style={{ width: 24, height: 24, borderRadius: 'var(--radius-checkbox)', border: 'none', background: 'transparent', color: 'var(--muted-foreground)', flexShrink: 0 }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--destructive)'; (e.currentTarget as HTMLElement).style.background = 'color-mix(in srgb, var(--destructive) 10%, transparent)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formData.produtos.length === 0 && (
              <div className="flex flex-col items-center justify-center" style={{ padding: '24px 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>
                <Package size={20} style={{ color: 'var(--muted-foreground)', opacity: 0.4, marginBottom: 6 }} />
                <span style={{ fontFamily: FONT_INTER, fontSize: '12px', color: 'var(--muted-foreground)' }}>
                  Busque e adicione produtos acima
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => onOpenChange(false)}
            className="cursor-pointer transition-colors"
            style={{
              fontFamily: FONT_INTER,
              fontSize: '14px',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '8px 20px',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--secondary)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(formData)}
            className="cursor-pointer transition-opacity"
            style={{
              fontFamily: FONT_INTER,
              fontSize: '14px',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--primary-foreground)',
              background: 'var(--primary)',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '8px 24px',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            {isEdit ? 'Salvar campanha' : 'Criar campanha'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Numbered Pagination Component ── */
function NumberedPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | 'ellipsis')[] = [];
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const pages = getPageNumbers();

  const navTextStyle: React.CSSProperties = {
    fontFamily: FONT_INTER,
    fontSize: '13px',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--foreground)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 2px',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  const disabledTextStyle: React.CSSProperties = {
    ...navTextStyle,
    color: 'var(--muted)',
    cursor: 'not-allowed',
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        style={currentPage <= 1 ? disabledTextStyle : navTextStyle}
      >
        <ChevronLeft size={14} />
        <span>Previous</span>
      </button>
      <div style={{ width: 8 }} />
      {pages.map((p, idx) =>
        p === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              fontFamily: FONT_INTER,
              fontSize: '13px',
              color: 'var(--muted-foreground)',
              userSelect: 'none',
            }}
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className="flex items-center justify-center cursor-pointer transition-colors"
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius)',
              fontFamily: FONT_INTER,
              fontSize: '13px',
              fontWeight: p === currentPage ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
              color: p === currentPage ? 'var(--foreground)' : 'var(--muted-foreground)',
              background: p === currentPage ? 'var(--secondary)' : 'transparent',
              border: p === currentPage ? '1px solid var(--border)' : '1px solid transparent',
            }}
          >
            {p}
          </button>
        ),
      )}
      <div style={{ width: 8 }} />
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        style={currentPage >= totalPages ? disabledTextStyle : navTextStyle}
      >
        <span>Next</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
}