// Mock data for AZUX Formacao de Preco — Oderco Distribuidora

export interface Product {
  id: string;
  codOderco: string;
  codFornecedor: string;
  descricao: string;
  marca: string;
  categoria: string;
  // Ficha tecnica
  ncm?: string;
  ean?: string;
  pesoUnit?: number;   // kg
  garantia?: string;
  multiplo?: number;
  caixaMae?: number;
  largura?: number;    // cm
  altura?: number;     // cm
  profundidade?: number; // cm
  filiais: {
    filial: 'PR' | 'ES' | 'RJ' | 'MA';
    precoDB1: number;
    custoMedioNet: number;
    ultimaEntrada: number;
    mkrp: number;
    estoque: number;
    giro60: number;
    ocConfirmada: number;
    qtdUltimaCompra: number;
    dataUltimaCompra: string;
  }[];
}

export interface ProductGroup {
  marca: string;
  categoria: string;
  products: Product[];
}

const generateProducts = (): ProductGroup[] => {
  return [
    /* ────────────────────────────────── PCYES · INFORMATICA ─────────────────────────────── */
    {
      marca: 'PCYES',
      categoria: 'INFORMATICA',
      products: [
        {
          id: '1',
          codOderco: '032290',
          codFornecedor: 'PM041600D3',
          descricao: 'Placa de Vídeo PCYES AMD Radeon R5 220 2GB DDR3 64 Bits Low Profile - PM041600D3',
          marca: 'PCYES',
          categoria: 'INFORMATICA',
          ncm: '8473.30.42',
          ean: '7908020911579',
          pesoUnit: 0.016,
          garantia: '1 Ano (Assistencia Interna)',
          multiplo: 1,
          caixaMae: 50,
          largura: 5,
          altura: 1,
          profundidade: 5,
          filiais: [
            { filial: 'PR', precoDB1: 69.90, custoMedioNet: 42.50, ultimaEntrada: 41.00, mkrp: 64.5, estoque: 1, giro60: 8, ocConfirmada: 0, qtdUltimaCompra: 100, dataUltimaCompra: '20/02/2026' },
            { filial: 'ES', precoDB1: 69.90, custoMedioNet: 43.10, ultimaEntrada: 41.50, mkrp: 62.2, estoque: 45, giro60: 12, ocConfirmada: 0, qtdUltimaCompra: 80, dataUltimaCompra: '18/02/2026' },
          ]
        },
        {
          id: '2',
          codOderco: '032292',
          codFornecedor: 'PM041600D3SO',
          descricao: 'MEMORIA PCYES SODIMM 4GB DDR3 1600MHZ - PM041600D3SO',
          marca: 'PCYES',
          categoria: 'INFORMATICA',
          ncm: '8473.30.42',
          ean: '7908020911586',
          pesoUnit: 0.012,
          garantia: '1 Ano (Assistencia Interna)',
          multiplo: 1,
          caixaMae: 50,
          largura: 3,
          altura: 0.5,
          profundidade: 7,
          filiais: [
            { filial: 'PR', precoDB1: 74.90, custoMedioNet: 45.80, ultimaEntrada: 44.20, mkrp: 63.5, estoque: 12, giro60: 3, ocConfirmada: 0, qtdUltimaCompra: 50, dataUltimaCompra: '19/02/2026' },
          ]
        },
      ]
    },
    /* ────────────────────────────────── PCYES · CABOS ─────────────────────────────── */
    {
      marca: 'PCYES',
      categoria: 'CABOS',
      products: [
        {
          id: '3',
          codOderco: '029317',
          codFornecedor: 'PVM15-2',
          descricao: 'CABO VGA 15 PINOS 2 METROS PCYES - PVM15-2',
          marca: 'PCYES',
          categoria: 'CABOS',
          ncm: '8544.42.00',
          ean: '7908020910442',
          pesoUnit: 0.120,
          garantia: '90 Dias',
          multiplo: 1,
          caixaMae: 100,
          filiais: [
            { filial: 'PR', precoDB1: 14.90, custoMedioNet: 6.80, ultimaEntrada: 6.50, mkrp: 119.1, estoque: 844, giro60: 120, ocConfirmada: 0, qtdUltimaCompra: 500, dataUltimaCompra: '19/02/2026' },
            { filial: 'ES', precoDB1: 14.90, custoMedioNet: 6.90, ultimaEntrada: 6.60, mkrp: 115.9, estoque: 612, giro60: 95, ocConfirmada: 0, qtdUltimaCompra: 400, dataUltimaCompra: '15/02/2026' },
            { filial: 'RJ', precoDB1: 14.90, custoMedioNet: 7.05, ultimaEntrada: 6.75, mkrp: 111.3, estoque: 380, giro60: 68, ocConfirmada: 0, qtdUltimaCompra: 300, dataUltimaCompra: '10/02/2026' },
          ]
        },
        {
          id: '4',
          codOderco: '032624',
          codFornecedor: 'P3AMUP-15',
          descricao: 'CABO ADAPTADOR OTG TIPO-C P/ USB A 3.0 - PRETO - 15 CM - P3AMUP-15',
          marca: 'PCYES',
          categoria: 'CABOS',
          ncm: '8544.42.00',
          ean: '7908020912019',
          pesoUnit: 0.015,
          garantia: '90 Dias',
          multiplo: 1,
          caixaMae: 200,
          filiais: [
            { filial: 'PR', precoDB1: 12.90, custoMedioNet: 4.20, ultimaEntrada: 4.00, mkrp: 207.1, estoque: 3222, giro60: 280, ocConfirmada: 0, qtdUltimaCompra: 1000, dataUltimaCompra: '19/02/2026' },
            { filial: 'ES', precoDB1: 12.90, custoMedioNet: 4.35, ultimaEntrada: 4.10, mkrp: 196.6, estoque: 1850, giro60: 195, ocConfirmada: 500, qtdUltimaCompra: 800, dataUltimaCompra: '17/02/2026' },
            { filial: 'RJ', precoDB1: 12.90, custoMedioNet: 4.40, ultimaEntrada: 4.15, mkrp: 193.2, estoque: 1120, giro60: 142, ocConfirmada: 0, qtdUltimaCompra: 600, dataUltimaCompra: '12/02/2026' },
            { filial: 'MA', precoDB1: 13.50, custoMedioNet: 4.60, ultimaEntrada: 4.30, mkrp: 193.5, estoque: 420, giro60: 55, ocConfirmada: 200, qtdUltimaCompra: 300, dataUltimaCompra: '08/02/2026' },
          ]
        },
        {
          id: '5',
          codOderco: '029293',
          codFornecedor: 'PUAMCM3-1',
          descricao: 'CABO P/ HD EXTERNO USB A 3.0 MACHO P/ MICRO USB B 3.0 - 1 METRO - PUAMCM3-1',
          marca: 'PCYES',
          categoria: 'CABOS',
          ncm: '8544.42.00',
          ean: '7908020910398',
          pesoUnit: 0.045,
          garantia: '90 Dias',
          multiplo: 1,
          caixaMae: 150,
          filiais: [
            { filial: 'PR', precoDB1: 18.90, custoMedioNet: 8.50, ultimaEntrada: 8.20, mkrp: 122.4, estoque: 291, giro60: 42, ocConfirmada: 0, qtdUltimaCompra: 200, dataUltimaCompra: '19/02/2026' },
            { filial: 'ES', precoDB1: 18.90, custoMedioNet: 8.70, ultimaEntrada: 8.40, mkrp: 117.2, estoque: 180, giro60: 28, ocConfirmada: 0, qtdUltimaCompra: 150, dataUltimaCompra: '15/02/2026' },
          ]
        },
        {
          id: '6',
          codOderco: '035643',
          codFornecedor: 'PHM21-1',
          descricao: 'CABO HDMI 2.1 MACHO 1 METRO - PHM21-1',
          marca: 'PCYES',
          categoria: 'CABOS',
          ncm: '8544.42.00',
          ean: '7908020913504',
          pesoUnit: 0.065,
          garantia: '90 Dias',
          multiplo: 1,
          caixaMae: 100,
          filiais: [
            { filial: 'PR', precoDB1: 29.90, custoMedioNet: 13.20, ultimaEntrada: 12.80, mkrp: 126.5, estoque: 735, giro60: 88, ocConfirmada: 0, qtdUltimaCompra: 300, dataUltimaCompra: '19/02/2026' },
            { filial: 'ES', precoDB1: 29.90, custoMedioNet: 13.50, ultimaEntrada: 13.00, mkrp: 121.5, estoque: 520, giro60: 62, ocConfirmada: 0, qtdUltimaCompra: 250, dataUltimaCompra: '17/02/2026' },
          ]
        },
        {
          id: '7',
          codOderco: '029306',
          codFornecedor: 'PHM20-1',
          descricao: 'CABO HDMI 2.0 PCYES 4K/60HZ - 1 METRO - PHM20-1',
          marca: 'PCYES',
          categoria: 'CABOS',
          ncm: '8544.42.00',
          ean: '7908020910435',
          pesoUnit: 0.055,
          garantia: '90 Dias',
          multiplo: 1,
          caixaMae: 100,
          filiais: [
            { filial: 'PR', precoDB1: 22.90, custoMedioNet: 9.80, ultimaEntrada: 9.50, mkrp: 133.7, estoque: 2535, giro60: 310, ocConfirmada: 0, qtdUltimaCompra: 800, dataUltimaCompra: '19/02/2026' },
            { filial: 'ES', precoDB1: 22.90, custoMedioNet: 10.00, ultimaEntrada: 9.70, mkrp: 129.0, estoque: 1420, giro60: 215, ocConfirmada: 0, qtdUltimaCompra: 600, dataUltimaCompra: '15/02/2026' },
            { filial: 'RJ', precoDB1: 22.90, custoMedioNet: 10.15, ultimaEntrada: 9.85, mkrp: 125.6, estoque: 980, giro60: 158, ocConfirmada: 0, qtdUltimaCompra: 500, dataUltimaCompra: '12/02/2026' },
            { filial: 'MA', precoDB1: 23.50, custoMedioNet: 10.40, ultimaEntrada: 10.00, mkrp: 126.0, estoque: 310, giro60: 42, ocConfirmada: 0, qtdUltimaCompra: 200, dataUltimaCompra: '05/02/2026' },
          ]
        },
        {
          id: '8',
          codOderco: '034394',
          codFornecedor: 'P2R35-2',
          descricao: 'CABO 2 RCA M PARA P2 3.5MM M - 2 MTS - P2R35-2',
          marca: 'PCYES',
          categoria: 'CABOS',
          ncm: '8544.42.00',
          ean: '7908020913207',
          pesoUnit: 0.080,
          garantia: '90 Dias',
          multiplo: 1,
          caixaMae: 100,
          filiais: [
            { filial: 'PR', precoDB1: 16.90, custoMedioNet: 7.20, ultimaEntrada: 6.90, mkrp: 134.7, estoque: 150, giro60: 18, ocConfirmada: 0, qtdUltimaCompra: 200, dataUltimaCompra: '19/02/2026' },
          ]
        },
      ]
    },
    /* ────────────────────────────────── PCYES · SOM E IMAGEM ─────────────────────────────── */
    {
      marca: 'PCYES',
      categoria: 'SOM E IMAGEM',
      products: [
        {
          id: '9',
          codOderco: '031599',
          codFornecedor: 'PLMSA01A',
          descricao: 'SUPORTE PARA TABLET 7.9" A 10.5" - PLMSA01A',
          marca: 'PCYES',
          categoria: 'SOM E IMAGEM',
          ncm: '8529.90.40',
          ean: '7908020911814',
          pesoUnit: 0.350,
          garantia: '1 Ano',
          multiplo: 1,
          caixaMae: 20,
          filiais: [
            { filial: 'PR', precoDB1: 39.90, custoMedioNet: 18.50, ultimaEntrada: 17.80, mkrp: 115.7, estoque: 1986, giro60: 145, ocConfirmada: 0, qtdUltimaCompra: 500, dataUltimaCompra: '19/02/2026' },
            { filial: 'ES', precoDB1: 39.90, custoMedioNet: 18.80, ultimaEntrada: 18.00, mkrp: 112.2, estoque: 890, giro60: 78, ocConfirmada: 0, qtdUltimaCompra: 300, dataUltimaCompra: '17/02/2026' },
            { filial: 'RJ', precoDB1: 39.90, custoMedioNet: 19.10, ultimaEntrada: 18.30, mkrp: 108.9, estoque: 540, giro60: 52, ocConfirmada: 0, qtdUltimaCompra: 200, dataUltimaCompra: '14/02/2026' },
          ]
        },
        {
          id: '10',
          codOderco: '031581',
          codFornecedor: 'PLMSN01',
          descricao: 'SUPORTE PARA MINI COMPUTADOR - ADAPTADOR VESA - PLMSN01',
          marca: 'PCYES',
          categoria: 'SOM E IMAGEM',
          ncm: '8529.90.40',
          ean: '7908020911807',
          pesoUnit: 0.280,
          garantia: '1 Ano',
          multiplo: 1,
          caixaMae: 30,
          filiais: [
            { filial: 'PR', precoDB1: 34.90, custoMedioNet: 15.20, ultimaEntrada: 14.80, mkrp: 129.6, estoque: 147, giro60: 12, ocConfirmada: 0, qtdUltimaCompra: 100, dataUltimaCompra: '19/02/2026' },
          ]
        },
      ]
    },
    /* ────────────────────────────────── Quati · ESTABILIZADORES ─────────────────────────────── */
    {
      marca: 'Quati',
      categoria: 'ESTABILIZADORES',
      products: [
        {
          id: '11',
          codOderco: '000214',
          codFornecedor: '16217',
          descricao: 'ESTAB. QUATI 300VA BI-VOLT ENT. 115/127/220V SAI. 115V PROG. III',
          marca: 'Quati',
          categoria: 'ESTABILIZADORES',
          ncm: '8504.40.40',
          ean: '7898554630122',
          pesoUnit: 1.200,
          garantia: '1 Ano',
          multiplo: 1,
          caixaMae: 12,
          filiais: [
            { filial: 'ES', precoDB1: 108.66, custoMedioNet: 82.14, ultimaEntrada: 80.50, mkrp: 32.3, estoque: 215, giro60: 42, ocConfirmada: 0, qtdUltimaCompra: 100, dataUltimaCompra: '12/01/2026' },
            { filial: 'PR', precoDB1: 108.66, custoMedioNet: 83.20, ultimaEntrada: 81.00, mkrp: 30.6, estoque: 158, giro60: 38, ocConfirmada: 0, qtdUltimaCompra: 200, dataUltimaCompra: '15/01/2026' },
            { filial: 'MA', precoDB1: 112.00, custoMedioNet: 85.40, ultimaEntrada: 83.00, mkrp: 31.1, estoque: 72, giro60: 14, ocConfirmada: 0, qtdUltimaCompra: 60, dataUltimaCompra: '08/01/2026' },
          ]
        },
        {
          id: '12',
          codOderco: '000215',
          codFornecedor: '16218',
          descricao: 'ESTAB. QUATI 500VA BI-VOLT ENT. 115/127/220V SAI. 115V PROG. III',
          marca: 'Quati',
          categoria: 'ESTABILIZADORES',
          ncm: '8504.40.40',
          ean: '7898554630139',
          pesoUnit: 1.800,
          garantia: '1 Ano',
          multiplo: 1,
          caixaMae: 8,
          filiais: [
            { filial: 'ES', precoDB1: 142.90, custoMedioNet: 105.30, ultimaEntrada: 103.50, mkrp: 35.7, estoque: 89, giro60: 28, ocConfirmada: 180, qtdUltimaCompra: 150, dataUltimaCompra: '18/01/2026' },
            { filial: 'PR', precoDB1: 142.90, custoMedioNet: 106.10, ultimaEntrada: 104.00, mkrp: 34.7, estoque: 0, giro60: 0, ocConfirmada: 0, qtdUltimaCompra: 100, dataUltimaCompra: '10/12/2025' },
          ]
        },
        {
          id: '13',
          codOderco: '000216',
          codFornecedor: '16219',
          descricao: 'ESTAB. QUATI 1000VA BI-VOLT ENT. 115/127/220V SAI. 115V PROG. V',
          marca: 'Quati',
          categoria: 'ESTABILIZADORES',
          ncm: '8504.40.40',
          ean: '7898554630146',
          pesoUnit: 2.500,
          garantia: '1 Ano',
          multiplo: 1,
          caixaMae: 6,
          filiais: [
            { filial: 'ES', precoDB1: 225.40, custoMedioNet: 168.90, ultimaEntrada: 165.00, mkrp: 33.4, estoque: 312, giro60: 55, ocConfirmada: 0, qtdUltimaCompra: 200, dataUltimaCompra: '20/01/2026' },
          ]
        },
      ]
    },
    /* ────────────────────────────────── Quati · NOBREAKS ─────────────────────────────── */
    {
      marca: 'Quati',
      categoria: 'NOBREAKS',
      products: [
        {
          id: '14',
          codOderco: '000320',
          codFornecedor: '27651',
          descricao: 'NOBREAK QUATI 600VA BI 115V MANAGER III',
          marca: 'Quati',
          categoria: 'NOBREAKS',
          ncm: '8504.40.40',
          ean: '7898554631112',
          pesoUnit: 5.200,
          garantia: '1 Ano',
          multiplo: 1,
          caixaMae: 4,
          filiais: [
            { filial: 'ES', precoDB1: 389.90, custoMedioNet: 285.40, ultimaEntrada: 280.00, mkrp: 36.6, estoque: 67, giro60: 12, ocConfirmada: 0, qtdUltimaCompra: 50, dataUltimaCompra: '05/01/2026' },
            { filial: 'PR', precoDB1: 389.90, custoMedioNet: 287.10, ultimaEntrada: 282.00, mkrp: 35.8, estoque: 45, giro60: 8, ocConfirmada: 0, qtdUltimaCompra: 30, dataUltimaCompra: '08/01/2026' },
          ]
        },
        {
          id: '15',
          codOderco: '000321',
          codFornecedor: '27652',
          descricao: 'NOBREAK QUATI 1200VA BI 115V MANAGER III',
          marca: 'Quati',
          categoria: 'NOBREAKS',
          ncm: '8504.40.40',
          ean: '7898554631129',
          pesoUnit: 8.500,
          garantia: '1 Ano',
          multiplo: 1,
          caixaMae: 2,
          filiais: [
            { filial: 'ES', precoDB1: 649.90, custoMedioNet: 478.20, ultimaEntrada: 470.00, mkrp: 35.9, estoque: 23, giro60: 5, ocConfirmada: 0, qtdUltimaCompra: 20, dataUltimaCompra: '05/01/2026' },
            { filial: 'PR', precoDB1: 649.90, custoMedioNet: 480.50, ultimaEntrada: 472.00, mkrp: 35.3, estoque: 18, giro60: 4, ocConfirmada: 0, qtdUltimaCompra: 15, dataUltimaCompra: '08/01/2026' },
          ]
        },
      ]
    },
    /* ────────────────────────────────── odex · ACESSORIOS ELETRICOS ─────────────────────────────── */
    {
      marca: 'odex',
      categoria: 'ACESSORIOS ELETRICOS',
      products: [
        {
          id: '16',
          codOderco: '001042',
          codFornecedor: 'OD-4521',
          descricao: 'TOMADA 2P+T 10A 250V PIAL PLUS+ BRANCA',
          marca: 'odex',
          categoria: 'ACESSORIOS ELETRICOS',
          ncm: '8536.69.90',
          ean: '7899560400122',
          pesoUnit: 0.035,
          garantia: '3 Anos',
          multiplo: 10,
          caixaMae: 200,
          filiais: [
            { filial: 'ES', precoDB1: 8.90, custoMedioNet: 3.02, ultimaEntrada: 3.50, mkrp: 66.1, estoque: 2450, giro60: 380, ocConfirmada: 0, qtdUltimaCompra: 1000, dataUltimaCompra: '22/01/2026' },
            { filial: 'PR', precoDB1: 8.90, custoMedioNet: 3.05, ultimaEntrada: 3.50, mkrp: 65.7, estoque: 1800, giro60: 290, ocConfirmada: 0, qtdUltimaCompra: 800, dataUltimaCompra: '25/01/2026' },
            { filial: 'RJ', precoDB1: 8.90, custoMedioNet: 3.10, ultimaEntrada: 3.55, mkrp: 64.2, estoque: 1200, giro60: 220, ocConfirmada: 0, qtdUltimaCompra: 600, dataUltimaCompra: '20/01/2026' },
            { filial: 'MA', precoDB1: 9.20, custoMedioNet: 3.25, ultimaEntrada: 3.65, mkrp: 63.4, estoque: 580, giro60: 85, ocConfirmada: 0, qtdUltimaCompra: 400, dataUltimaCompra: '15/01/2026' },
          ]
        },
        {
          id: '17',
          codOderco: '001043',
          codFornecedor: 'OD-4522',
          descricao: 'TOMADA 2P+T 20A 250V PIAL PLUS+ BRANCA',
          marca: 'odex',
          categoria: 'ACESSORIOS ELETRICOS',
          ncm: '8536.69.90',
          ean: '7899560400139',
          pesoUnit: 0.040,
          garantia: '3 Anos',
          multiplo: 10,
          caixaMae: 200,
          filiais: [
            { filial: 'ES', precoDB1: 12.50, custoMedioNet: 4.80, ultimaEntrada: 5.10, mkrp: 61.6, estoque: 1890, giro60: 210, ocConfirmada: 0, qtdUltimaCompra: 800, dataUltimaCompra: '22/01/2026' },
            { filial: 'PR', precoDB1: 12.50, custoMedioNet: 4.85, ultimaEntrada: 5.10, mkrp: 61.2, estoque: 1520, giro60: 175, ocConfirmada: 0, qtdUltimaCompra: 600, dataUltimaCompra: '25/01/2026' },
          ]
        },
        {
          id: '18',
          codOderco: '001044',
          codFornecedor: 'OD-4523',
          descricao: 'INTERRUPTOR SIMPLES 10A 250V PIAL PLUS+ BRANCO',
          marca: 'odex',
          categoria: 'ACESSORIOS ELETRICOS',
          ncm: '8536.50.90',
          ean: '7899560400146',
          pesoUnit: 0.030,
          garantia: '3 Anos',
          multiplo: 10,
          caixaMae: 200,
          filiais: [
            { filial: 'ES', precoDB1: 10.20, custoMedioNet: 3.90, ultimaEntrada: 4.20, mkrp: 61.8, estoque: 3200, giro60: 410, ocConfirmada: 500, qtdUltimaCompra: 1500, dataUltimaCompra: '22/01/2026' },
          ]
        },
      ]
    },
    /* ────────────────────────────────── Vinik · CABOS E CONECTORES ─────────────────────────────── */
    {
      marca: 'Vinik',
      categoria: 'CABOS E CONECTORES',
      products: [
        {
          id: '19',
          codOderco: '003050',
          codFornecedor: 'VNK-1201',
          descricao: 'CABO HDMI 2.0 4K 2M VINIK',
          marca: 'Vinik',
          categoria: 'CABOS E CONECTORES',
          ncm: '8544.42.00',
          ean: '7899510200122',
          pesoUnit: 0.090,
          garantia: '90 Dias',
          multiplo: 1,
          caixaMae: 100,
          filiais: [
            { filial: 'ES', precoDB1: 22.90, custoMedioNet: 10.50, ultimaEntrada: 10.00, mkrp: 118.1, estoque: 890, giro60: 145, ocConfirmada: 0, qtdUltimaCompra: 500, dataUltimaCompra: '28/01/2026' },
            { filial: 'PR', precoDB1: 22.90, custoMedioNet: 10.80, ultimaEntrada: 10.30, mkrp: 112.0, estoque: 650, giro60: 110, ocConfirmada: 0, qtdUltimaCompra: 400, dataUltimaCompra: '28/01/2026' },
            { filial: 'RJ', precoDB1: 22.90, custoMedioNet: 10.95, ultimaEntrada: 10.45, mkrp: 109.1, estoque: 420, giro60: 72, ocConfirmada: 0, qtdUltimaCompra: 250, dataUltimaCompra: '22/01/2026' },
          ]
        },
        {
          id: '20',
          codOderco: '003051',
          codFornecedor: 'VNK-1202',
          descricao: 'CABO HDMI 2.0 4K 5M VINIK',
          marca: 'Vinik',
          categoria: 'CABOS E CONECTORES',
          ncm: '8544.42.00',
          ean: '7899510200139',
          pesoUnit: 0.180,
          garantia: '90 Dias',
          multiplo: 1,
          caixaMae: 50,
          filiais: [
            { filial: 'ES', precoDB1: 38.90, custoMedioNet: 18.20, ultimaEntrada: 17.50, mkrp: 113.7, estoque: 430, giro60: 62, ocConfirmada: 0, qtdUltimaCompra: 300, dataUltimaCompra: '28/01/2026' },
            { filial: 'PR', precoDB1: 38.90, custoMedioNet: 18.50, ultimaEntrada: 17.80, mkrp: 110.3, estoque: 310, giro60: 48, ocConfirmada: 0, qtdUltimaCompra: 200, dataUltimaCompra: '28/01/2026' },
          ]
        },
      ]
    },
    /* ────────────────────────────────── Tonante · INSTRUMENTOS MUSICAIS ─────────────────────────────── */
    {
      marca: 'Tonante',
      categoria: 'INSTRUMENTOS MUSICAIS',
      products: [
        {
          id: '21',
          codOderco: '004010',
          codFornecedor: 'TNT-301',
          descricao: 'VIOLAO TONANTE ACUSTICO NATURAL NYLON',
          marca: 'Tonante',
          categoria: 'INSTRUMENTOS MUSICAIS',
          ncm: '9202.90.00',
          ean: '7898821540011',
          pesoUnit: 1.800,
          garantia: '6 Meses',
          multiplo: 1,
          caixaMae: 6,
          filiais: [
            { filial: 'ES', precoDB1: 289.90, custoMedioNet: 195.00, ultimaEntrada: 190.00, mkrp: 48.7, estoque: 35, giro60: 4, ocConfirmada: 0, qtdUltimaCompra: 20, dataUltimaCompra: '15/12/2025' },
            { filial: 'PR', precoDB1: 289.90, custoMedioNet: 197.00, ultimaEntrada: 192.00, mkrp: 47.2, estoque: 28, giro60: 3, ocConfirmada: 0, qtdUltimaCompra: 15, dataUltimaCompra: '15/12/2025' },
          ]
        },
        {
          id: '22',
          codOderco: '004011',
          codFornecedor: 'TNT-302',
          descricao: 'GUITARRA TONANTE STRATOCASTER SUNBURST',
          marca: 'Tonante',
          categoria: 'INSTRUMENTOS MUSICAIS',
          ncm: '9202.90.00',
          ean: '7898821540028',
          pesoUnit: 3.500,
          garantia: '6 Meses',
          multiplo: 1,
          caixaMae: 4,
          filiais: [
            { filial: 'ES', precoDB1: 549.90, custoMedioNet: 380.00, ultimaEntrada: 375.00, mkrp: 44.7, estoque: 12, giro60: 2, ocConfirmada: 0, qtdUltimaCompra: 10, dataUltimaCompra: '01/12/2025' },
          ]
        },
      ]
    },
  ];
};

export const productGroups = generateProducts();

export const allProducts = productGroups.flatMap(g => g.products);

// Price formation detail data for Tela 2
export interface PriceDestination {
  id: string;
  icmsInter: number;
  destino: string;
  tipo: 'interno' | 'marketplace' | 'estado';
  grupo: string;
  cmv: number;
  vlUltCompra: number;
  despOper: number;
  markup: number;
  vlBruto: number;
  vlIPI: number;
  vlST: number;
  vlFinal: number;
  lucro: number;
  giro7d: number;
  giro30d: number;
  giro60d: number;
  giro360d: number;
}

const ufICMS7 = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MS','MT','PA','PB','PE','PI','RN','RO','RR','SE','TO'];
const ufICMS12 = ['MG','PR','RJ','RS','SC','SP'];

const mkBase = (cmv: number, markup: number) => {
  const base = cmv * (1 + markup / 100);
  const vlIPI = +(base * 0.05).toFixed(2);
  const vlST = +(base * 0.03).toFixed(2);
  return {
    vlBruto: +(base + vlIPI).toFixed(2), // includes IPI
    vlIPI,
    vlST,
    vlFinal: +(base + vlIPI + vlST).toFixed(2),
  };
};

export const generatePriceDestinations = (cmv: number, ultCompra: number): PriceDestination[] => {
  const destinations: PriceDestination[] = [];

  // Internal tables
  const internos = [
    { destino: 'Oderço', markup: 35 },
    { destino: 'PCYES', markup: 38 },
    { destino: 'Odex', markup: 33 },
    { destino: 'Tonante', markup: 32 },
    { destino: 'Vinik', markup: 36 },
    { destino: 'Quati', markup: 34 },
  ];
  internos.forEach((int, i) => {
    const calc = mkBase(cmv, int.markup);
    destinations.push({
      id: `int-${i}`,
      icmsInter: 0,
      destino: int.destino,
      tipo: 'interno',
      grupo: 'Tabelas Internas',
      cmv,
      vlUltCompra: ultCompra,
      despOper: 12.0,
      markup: int.markup,
      ...calc,
      lucro: +(int.markup - 12.0).toFixed(1),
      giro7d: Math.floor(Math.random() * 5),
      giro30d: Math.floor(Math.random() * 15) + 2,
      giro60d: Math.floor(Math.random() * 30) + 5,
      giro360d: Math.floor(Math.random() * 200) + 50,
    });
  });

  // Marketplaces
  const mktplaces = [
    { destino: 'Mercado Livre', markup: 42 },
    { destino: 'Shopee', markup: 45 },
    { destino: 'TikTok Shop', markup: 48 },
    { destino: 'Amazon', markup: 40 },
  ];
  mktplaces.forEach((mkt, i) => {
    const calc = mkBase(cmv, mkt.markup);
    destinations.push({
      id: `mkt-${i}`,
      icmsInter: 0,
      destino: mkt.destino,
      tipo: 'marketplace',
      grupo: 'Marketplaces',
      cmv,
      vlUltCompra: ultCompra,
      despOper: 7.0,
      markup: mkt.markup,
      ...calc,
      lucro: +(mkt.markup - 7.0).toFixed(1),
      giro7d: Math.floor(Math.random() * 8),
      giro30d: Math.floor(Math.random() * 25) + 5,
      giro60d: Math.floor(Math.random() * 50) + 10,
      giro360d: Math.floor(Math.random() * 500) + 100,
    });
  });

  // States
  [...ufICMS7, ...ufICMS12].forEach((uf, _i) => {
    const icms = ufICMS7.includes(uf) ? 7 : 12;
    const markup = icms === 7 ? 30 + Math.random() * 8 : 28 + Math.random() * 6;
    const calc = mkBase(cmv, markup);
    destinations.push({
      id: `uf-${uf}`,
      icmsInter: icms,
      destino: uf,
      tipo: 'estado',
      grupo: icms === 7 ? 'ICMS 7%' : 'ICMS 12%',
      cmv,
      vlUltCompra: ultCompra,
      despOper: 12.0,
      markup: +markup.toFixed(1),
      ...calc,
      lucro: +(markup - 12.0).toFixed(1),
      giro7d: Math.floor(Math.random() * 3),
      giro30d: Math.floor(Math.random() * 10) + 1,
      giro60d: Math.floor(Math.random() * 20) + 2,
      giro360d: Math.floor(Math.random() * 150) + 20,
    });
  });

  return destinations;
};

export const marcas = ['PCYES', 'Quati', 'odex', 'Vinik', 'Tonante'];
export const categorias = ['INFORMATICA', 'CABOS', 'SOM E IMAGEM', 'ESTABILIZADORES', 'NOBREAKS', 'ACESSORIOS ELETRICOS', 'CABOS E CONECTORES', 'INSTRUMENTOS MUSICAIS'];