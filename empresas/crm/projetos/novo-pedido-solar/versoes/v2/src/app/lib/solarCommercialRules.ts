import {
  campaignRules,
  commissionRules,
  inverterProducts,
  panelProducts,
  type OrderParty,
} from '../data/solarOrderMockData';

type GeneratorComponentLike = {
  category: string;
  sku: string;
  brand: string;
  quantity: number;
  unitPrice: number;
};

type GeneratorLike = {
  type: 'generator';
  components: GeneratorComponentLike[];
};

type LooseItemLike = {
  type: 'loose';
  brand: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type CommercialOrderItem = GeneratorLike | LooseItemLike;

type InverterRangeSelection = {
  label: string;
  quantity: number;
  minKwp: number;
  maxKwp: number;
};

export type GeneratorCustomizationAssessment = {
  isCustomized: boolean;
  powerKwp: number;
  supportedMinKwp: number;
  supportedMaxKwp: number;
  reason: string;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function sumRanges(inverters: InverterRangeSelection[]) {
  return inverters.reduce(
    (acc, inverter) => ({
      supportedMinKwp: acc.supportedMinKwp + inverter.minKwp * inverter.quantity,
      supportedMaxKwp: acc.supportedMaxKwp + inverter.maxKwp * inverter.quantity,
    }),
    { supportedMinKwp: 0, supportedMaxKwp: 0 },
  );
}

export function assessGeneratorCustomizationFromPower(
  powerKwp: number,
  inverters: InverterRangeSelection[],
): GeneratorCustomizationAssessment {
  const { supportedMinKwp, supportedMaxKwp } = sumRanges(inverters);
  const hasPanelPower = powerKwp > 0;
  const hasInverterRange = inverters.length > 0 && supportedMaxKwp > 0;
  const isCustomized = hasPanelPower && hasInverterRange
    ? powerKwp < supportedMinKwp || powerKwp > supportedMaxKwp
    : false;

  if (!hasPanelPower) {
    return {
      isCustomized: false,
      powerKwp,
      supportedMinKwp,
      supportedMaxKwp,
      reason: 'Kit sem potência calculada para avaliação técnica.',
    };
  }

  if (!hasInverterRange) {
    return {
      isCustomized: false,
      powerKwp,
      supportedMinKwp,
      supportedMaxKwp,
      reason: 'Kit sem inversor selecionado para avaliação técnica.',
    };
  }

  if (isCustomized) {
    return {
      isCustomized,
      powerKwp,
      supportedMinKwp,
      supportedMaxKwp,
      reason: `Potência do kit (${formatNumber(powerKwp)} kWp) fora da faixa padrão dos inversores selecionados (${formatNumber(supportedMinKwp)} a ${formatNumber(supportedMaxKwp)} kWp).`,
    };
  }

  return {
    isCustomized,
    powerKwp,
    supportedMinKwp,
    supportedMaxKwp,
    reason: `Kit dentro da faixa padrão dos inversores selecionados (${formatNumber(supportedMinKwp)} a ${formatNumber(supportedMaxKwp)} kWp).`,
  };
}

export function assessGeneratorCustomizationFromComponents(
  components: GeneratorComponentLike[],
): GeneratorCustomizationAssessment {
  const powerKwp = components.reduce((total, component) => {
    if (component.category !== 'Painéis') return total;
    const panel = panelProducts.find((item) => item.sku === component.sku);
    if (!panel) return total;
    return total + (panel.powerW * component.quantity) / 1000;
  }, 0);

  const inverterRanges = components.reduce<InverterRangeSelection[]>((acc, component) => {
    if (component.category !== 'Inversores') return acc;
    const inverter = inverterProducts.find((item) => item.sku === component.sku);
    if (!inverter) return acc;
    acc.push({
      label: inverter.name,
      quantity: component.quantity,
      minKwp: inverter.minKwp,
      maxKwp: inverter.maxKwp,
    });
    return acc;
  }, []);

  return assessGeneratorCustomizationFromPower(powerKwp, inverterRanges);
}

export function getCommissionRateForBrand(brand: string) {
  return commissionRules.find((rule) => rule.brand === brand)?.rate ?? 0;
}

export function calculateCommissionForOrderItem(item: CommercialOrderItem) {
  if (item.type === 'generator') {
    return item.components.reduce((total, component) => {
      const rate = getCommissionRateForBrand(component.brand);
      return total + component.unitPrice * component.quantity * rate;
    }, 0);
  }

  return item.total * getCommissionRateForBrand(item.brand);
}

export function calculateCampaignForOrderItem(item: CommercialOrderItem) {
  if (item.type === 'generator') {
    return item.components.reduce((total, component) => {
      const campaign = campaignRules.find((rule) => rule.brand === component.brand && rule.active);
      return total + (campaign?.valuePerUnit ?? 0) * component.quantity;
    }, 0);
  }

  const campaign = campaignRules.find((rule) => rule.brand === item.brand && rule.active);
  return (campaign?.valuePerUnit ?? 0) * item.quantity;
}

export function buildTriangulationInvoiceObservation(client: OrderParty) {
  const ieSuffix = client.stateRegistration ? `, IE ${client.stateRegistration}` : '';
  return `Mercadoria a ser remetida para ${client.name}, CNPJ/CPF ${client.document}${ieSuffix}, endereço ${client.street}, ${client.district}, ${client.city}/${client.state}, CEP ${client.zipCode}.`;
}
