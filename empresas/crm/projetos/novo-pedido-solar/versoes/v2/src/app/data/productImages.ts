import type { GeneratorComponentItem } from '../context/PedidoContext';

const PANEL_IMG =
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400';
const INVERTER_IMG =
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400';
const STRUCTURE_IMG =
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400';
const CABLE_IMG =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400';
const CONNECTOR_IMG =
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=400';
const PROFILE_IMG =
  'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=400';
const LOOSE_IMG =
  'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=400';
const STRINGBOX_IMG =
  'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?auto=format&fit=crop&q=80&w=400';
const BREAKER_IMG =
  'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=400';
const TOOL_IMG =
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=400';
const MONITOR_IMG =
  'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=400';
const PANEL_ALT_IMG =
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=400';
const INVERTER_ALT_IMG =
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=400';
const STRUCTURE_ALT_IMG =
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=400';
const CABLE_ALT_IMG =
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400';

export const PRODUCT_IMAGE_BY_ICON: Record<string, string> = {
  panel: PANEL_IMG,
  inverter: INVERTER_IMG,
  structure: STRUCTURE_IMG,
  cable: CABLE_IMG,
  connector: CONNECTOR_IMG,
  profile: PROFILE_IMG,
  loose: LOOSE_IMG,
  stringBox: STRINGBOX_IMG,
  breaker: BREAKER_IMG,
  tool: TOOL_IMG,
  monitor: MONITOR_IMG,
};

export const PRODUCT_IMAGE_BY_SKU: Record<string, string> = {
  '345436': PANEL_IMG,
  '365901': PANEL_ALT_IMG,
  '328110': PANEL_IMG,
  '292438': INVERTER_IMG,
  '246776': INVERTER_ALT_IMG,
  '258516': INVERTER_IMG,
  '299599': INVERTER_ALT_IMG,
  '195088': STRUCTURE_IMG,
  '313817': STRUCTURE_ALT_IMG,
  '342008': STRUCTURE_IMG,
  '327700': STRUCTURE_ALT_IMG,
  '230308': CABLE_IMG,
  '230309': CABLE_ALT_IMG,
  '252803': CONNECTOR_IMG,
  '259118': PROFILE_IMG,
  '342901': PROFILE_IMG,
  '401122': BREAKER_IMG,
  '401123': BREAKER_IMG,
  '402001': MONITOR_IMG,
  '402002': MONITOR_IMG,
  '402200': STRINGBOX_IMG,
  '402201': STRINGBOX_IMG,
  '403001': CONNECTOR_IMG,
  '403010': CABLE_ALT_IMG,
  '404100': TOOL_IMG,
  '404101': TOOL_IMG,
};

export function imageForCategory(cat: GeneratorComponentItem['category']): string {
  if (cat === 'Painéis') return PANEL_IMG;
  if (cat === 'Inversores') return INVERTER_IMG;
  if (cat === 'String Box') return STRINGBOX_IMG;
  if (cat === 'Estrutura') return STRUCTURE_IMG;
  return CABLE_IMG;
}

export function imageForIcon(icon?: string): string {
  if (icon && PRODUCT_IMAGE_BY_ICON[icon]) return PRODUCT_IMAGE_BY_ICON[icon];
  return LOOSE_IMG;
}

export function imageForSku(
  sku?: string,
  category?: GeneratorComponentItem['category'],
  icon?: string,
): string {
  if (sku && PRODUCT_IMAGE_BY_SKU[sku]) return PRODUCT_IMAGE_BY_SKU[sku];
  if (icon) return imageForIcon(icon);
  if (category) return imageForCategory(category);
  return LOOSE_IMG;
}
