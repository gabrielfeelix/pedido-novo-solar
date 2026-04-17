export type SolarTechnicalApprovalStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type SolarBuilderStep = 'setup' | 'panels' | 'inverters' | 'stringBox' | 'structure' | 'accessories' | 'summary';
export type PrizeMode = 'percent' | 'currency';
export type DeliveryArea = 'urban' | 'rural';

export interface OrderMetaField {
  label: string;
  value: string;
}

export interface OrderParty {
  id: string;
  name: string;
  document: string;
  contactName: string;
  phone: string;
  street: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface SolarCatalogItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  unitPrice: number;
  icon: 'panel' | 'inverter' | 'stringBox' | 'structure' | 'cable' | 'connector' | 'profile' | 'loose';
  note?: string;
}

export interface PanelProduct extends SolarCatalogItem {
  powerW: number;
  efficiency: string;
}

export interface InverterProduct extends SolarCatalogItem {
  minKwp: number;
  maxKwp: number;
  connection: 'Monofásico 220V' | 'Trifásico 220V' | 'Trifásico 380V';
}

export interface StructureProduct extends SolarCatalogItem {
  structureType: string;
  kitForPanels: number;
  requiredComponentName?: string;
}

export interface AccessoryProduct extends SolarCatalogItem {
  category: 'cables' | 'connectors' | 'profiles';
  supportsLength?: boolean;
  lengthOptions?: number[];
  required?: boolean;
  lockedQuantity?: number;
}

export interface LooseItemProduct extends SolarCatalogItem {}

export const orderMeta: OrderMetaField[] = [
  { label: 'Pedido', value: '#1615449' },
  { label: 'Cadastro no CRM', value: '01/04/2026 01:46:11' },
  { label: 'Consultor Titular', value: '513 - Jhulielem Rodrigues Philot' },
  { label: 'Consultor Pedido', value: '513 - Jhulielem Rodrigues Philot' },
  { label: 'Data do Pedido', value: '01/04/2026' },
  { label: 'Filial', value: 'PR - Maringá' },
  { label: 'Tabela de Preço', value: '46 - Tabela Corrente' },
  { label: 'Operação', value: '11 - Venda de Mercadorias' },
  { label: 'Origem', value: 'ERP' },
  { label: 'Status', value: 'Com bloqueio / normal' },
];

export const orderClients: OrderParty[] = [
  {
    id: 'client-87323',
    name: '87323 · WM Energia Solar LTDA',
    document: '45.827.478/0001-28',
    contactName: 'Wagner Martins',
    phone: '(44) 8803-0200',
    street: 'Av. Morangueira, 1121',
    district: 'Gleba Ribeiro Maringá',
    city: 'Maringá',
    state: 'PR',
    zipCode: '87030-300',
  },
  {
    id: 'client-1541',
    name: '1541 · Cliente Teste Odex',
    document: '25.397.679/8280-11',
    contactName: 'Juliana Siqueira',
    phone: '(41) 99882-0044',
    street: 'Rua dos Integradores, 88',
    district: 'Centro',
    city: 'Curitiba',
    state: 'PR',
    zipCode: '80010-090',
  },
  {
    id: 'client-2055',
    name: '2055 · Solar Colonial Engenharia',
    document: '53.201.199/0001-50',
    contactName: 'Ricardo Alberti',
    phone: '(47) 3022-1144',
    street: 'Rua João Pessoa, 455',
    district: 'Velha',
    city: 'Blumenau',
    state: 'SC',
    zipCode: '89036-210',
  },
];

export const panelProducts: PanelProduct[] = [
  {
    id: 'panel-astronergy-580',
    sku: '345436',
    name: 'Painel Solar Fotovoltaico Astronergy Bifacial 580W N-Type CHSM72N(DG)F-BH',
    brand: 'Astronergy',
    unitPrice: 525.26,
    icon: 'panel',
    powerW: 580,
    efficiency: '22,5%',
    note: 'N-Type · Tier 1 · Bifacial',
  },
  {
    id: 'panel-risen-610',
    sku: '365901',
    name: 'Painel Solar Fotovoltaico Risen Titan 610W Mono Half Cell',
    brand: 'Risen',
    unitPrice: 562.1,
    icon: 'panel',
    powerW: 610,
    efficiency: '22,3%',
    note: 'Mono PERC · 1500V',
  },
  {
    id: 'panel-jinko-550',
    sku: '328110',
    name: 'Painel Solar Fotovoltaico Jinko Tiger Neo 550W',
    brand: 'Jinko',
    unitPrice: 498.9,
    icon: 'panel',
    powerW: 550,
    efficiency: '21,7%',
    note: 'Bifacial · 132 células',
  },
];

export const inverterProducts: InverterProduct[] = [
  {
    id: 'inv-sofar-15-380',
    sku: '292438',
    name: 'Inversor Solar 15kW Trifásico 380V 15KTLX-G3P 2 MPPT Sofar AFCI',
    brand: 'Sofar',
    unitPrice: 3052.63,
    icon: 'inverter',
    minKwp: 7,
    maxKwp: 25.5,
    connection: 'Trifásico 380V',
  },
  {
    id: 'inv-chint-15-380',
    sku: '246776',
    name: 'Inversor Solar 15kW Trifásico 380V Chint Power SCA15K-T-EU',
    brand: 'Chint Power',
    unitPrice: 3326.32,
    icon: 'inverter',
    minKwp: 7,
    maxKwp: 25.5,
    connection: 'Trifásico 380V',
  },
  {
    id: 'inv-chint-20-380',
    sku: '258516',
    name: 'Inversor Solar 20kW Trifásico 380V Chint Power SCA20K-T-EU',
    brand: 'Chint Power',
    unitPrice: 4315.79,
    icon: 'inverter',
    minKwp: 10,
    maxKwp: 34,
    connection: 'Trifásico 380V',
  },
  {
    id: 'inv-sofar-25-220',
    sku: '299599',
    name: 'Inversor Solar 25kW Trifásico 220V 25KTLX-G3-LV 4 MPPT Sofar AFCI',
    brand: 'Sofar',
    unitPrice: 6052.63,
    icon: 'inverter',
    minKwp: 15,
    maxKwp: 42.5,
    connection: 'Trifásico 220V',
  },
];

export const structureTypes = [
  'Telha Calhetão',
  'Telha Cerâmica/Colonial',
  'Estrutura Solo',
  'Telha Fibrocimento Madeira',
  'Telhado Laje 15°',
  'Telha Metálica',
  'Telha Fibrocimento Metálica',
];

export const structureProducts: StructureProduct[] = [
  {
    id: 'str-colonial-trilho-2p',
    sku: '195088',
    name: 'Kit Estrutura 2P Colonial Madeira Trilho 2 x 2,40m Pratyc Madeira com Perfil',
    brand: 'Pratyc',
    unitPrice: 148.42,
    icon: 'structure',
    structureType: 'Telha Cerâmica/Colonial',
    kitForPanels: 2,
    requiredComponentName: 'Perfil Solar Group 4 x 2.40m 4800mm MD04 Lateral Alumínio',
  },
  {
    id: 'str-colonial-4p',
    sku: '313817',
    name: 'Estrutura Solar Group 4P Telha Colonial 4800mm (Sem Perfil)',
    brand: 'Solar Group',
    unitPrice: 166.32,
    icon: 'structure',
    structureType: 'Telha Cerâmica/Colonial',
    kitForPanels: 4,
    requiredComponentName: 'Emenda Perfil Lateral Smart X 846 14cm Solar Group',
  },
  {
    id: 'str-metalica-4p',
    sku: '342008',
    name: 'Kit Estrutura 4P Telha Metálica Alumínio Pratyc',
    brand: 'Pratyc',
    unitPrice: 188.9,
    icon: 'structure',
    structureType: 'Telha Metálica',
    kitForPanels: 4,
    requiredComponentName: 'Parafuso cabeça de martelo inox M8x25mm e porca FL M8',
  },
  {
    id: 'str-solo-2p',
    sku: '327700',
    name: 'Estrutura Solo Galvanizada 2P Smart Base',
    brand: 'Smart Base',
    unitPrice: 412.0,
    icon: 'structure',
    structureType: 'Estrutura Solo',
    kitForPanels: 2,
    requiredComponentName: 'Par de sapatas para estrutura solo galvanizada',
  },
];

export const accessoryProducts: AccessoryProduct[] = [
  {
    id: 'acc-cabo-6mm',
    sku: '230308',
    name: 'Cabo Solar Odex 6mm 1.8kV Preto + Vermelho',
    brand: 'odex',
    unitPrice: 214.74,
    icon: 'cable',
    category: 'cables',
    supportsLength: true,
    lengthOptions: [20, 50, 100],
    note: 'Escolha a metragem',
  },
  {
    id: 'acc-cabo-4mm',
    sku: '230309',
    name: 'Cabo Solar Odex 4mm 1.8kV Preto + Vermelho',
    brand: 'odex',
    unitPrice: 186.15,
    icon: 'cable',
    category: 'cables',
    supportsLength: true,
    lengthOptions: [20, 50, 100],
    note: 'Escolha a metragem',
  },
  {
    id: 'acc-mc4',
    sku: '252803',
    name: 'Conector MC4 Odex · Staubli / Macho + Fêmea 2 pares',
    brand: 'odex',
    unitPrice: 20.0,
    icon: 'connector',
    category: 'connectors',
  },
  {
    id: 'acc-flexsil',
    sku: '259118',
    name: 'Cabo Flexível Flexsil 750V 16,00mm 100m Azul',
    brand: 'Flexsil',
    unitPrice: 412.5,
    icon: 'cable',
    category: 'cables',
    supportsLength: true,
    lengthOptions: [20, 30, 60],
    note: 'Escolha a metragem',
  },
  {
    id: 'acc-emenda-lateral',
    sku: '342901',
    name: 'Emenda Perfil Lateral Smart X 846 14cm Solar Group',
    brand: 'Solar Group',
    unitPrice: 23.4,
    icon: 'profile',
    category: 'profiles',
    required: true,
    lockedQuantity: 1,
  },
];

export const looseItems: LooseItemProduct[] = [
  {
    id: 'loose-disjuntor-63a',
    sku: '401122',
    name: 'Disjuntor Tripolar 63A Curva C',
    brand: 'WEG',
    unitPrice: 138.0,
    icon: 'loose',
  },
  {
    id: 'loose-monitoramento',
    sku: '402001',
    name: 'Kit Monitoramento Wi-Fi Inversor Solar',
    brand: 'Sofar',
    unitPrice: 285.0,
    icon: 'loose',
  },
  {
    id: 'loose-quadro',
    sku: '402200',
    name: 'Quadro de Proteção CA/CC 2 MPPT',
    brand: 'Odex Solar',
    unitPrice: 892.0,
    icon: 'loose',
  },
];

export const financingConditions = [
  'Entrada + 3x',
  'Entrada + 6x',
  'Entrada + 10x',
  'À vista',
];

export const freightTypes = [
  'CIF grátis (roteirizado)',
  'Pago expresso',
  'Retirada em filial',
];

export const builderStepLabels: { id: SolarBuilderStep; label: string; shortLabel: string }[] = [
  { id: 'setup', label: 'Dados iniciais', shortLabel: 'Dados iniciais' },
  { id: 'panels', label: 'Painéis', shortLabel: 'Painéis' },
  { id: 'inverters', label: 'Inversores', shortLabel: 'Inversores' },
  { id: 'stringBox', label: 'String Box', shortLabel: 'String Box' },
  { id: 'structure', label: 'Estrutura', shortLabel: 'Estrutura' },
  { id: 'accessories', label: 'Acessórios', shortLabel: 'Acessórios' },
  { id: 'summary', label: 'Resumo', shortLabel: 'Resumo' },
];

export const connectionTypes = ['Monofásico 220V', 'Trifásico 220V', 'Trifásico 380V'] as const;
export const states = ['PR', 'SC', 'SP', 'RS', 'ES'] as const;
