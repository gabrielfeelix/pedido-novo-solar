import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Cpu,
  Expand,
  HardDrive,
  Monitor,
  Save,
  Settings,
  Share2,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { allProducts } from "../components/productsData";
import { useCart } from "../components/CartContext";
import { Button } from "../components/ui/button";
import { cn } from "../components/ui/utils";

type VisualKind =
  | "cpu"
  | "motherboard"
  | "ram"
  | "gpu"
  | "cooling"
  | "storage"
  | "case"
  | "psu"
  | "peripheral";

type Option = {
  id: string;
  name: string;
  price: number;
  image?: string;
  gallery?: string[];
  summary?: string;
  highlights?: string[];
  type?: string;
  standard?: boolean;
  req?: string[];
};

type Category = {
  id: string;
  title: string;
  icon: React.ReactNode;
  options: Option[];
};

const CONFIG_STORAGE_KEY = "pcyes-monte-seu-pc-config";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const escapeSvgText = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const buildComponentVisual = ({
  title,
  subtitle,
  accent,
  kind,
}: {
  title: string;
  subtitle: string;
  accent: string;
  kind: VisualKind;
}) => {
  const safeTitle = escapeSvgText(title);
  const safeSubtitle = escapeSvgText(subtitle);

  let illustration = "";

  switch (kind) {
    case "cpu":
      illustration = `
        <rect x="390" y="170" width="420" height="420" rx="48" fill="#0B0F18" stroke="${accent}" stroke-width="16"/>
        <rect x="470" y="250" width="260" height="260" rx="30" fill="url(#accentGlow)" stroke="rgba(255,255,255,0.24)" stroke-width="8"/>
        <rect x="520" y="300" width="160" height="160" rx="22" fill="#05070B" stroke="rgba(255,255,255,0.18)" stroke-width="6"/>
        ${Array.from({ length: 10 })
          .map((_, index) => `<rect x="${348 + index * 50}" y="128" width="18" height="56" rx="8" fill="${accent}" opacity="0.85"/>`)
          .join("")}
        ${Array.from({ length: 10 })
          .map((_, index) => `<rect x="${348 + index * 50}" y="576" width="18" height="56" rx="8" fill="${accent}" opacity="0.85"/>`)
          .join("")}
      `;
      break;
    case "motherboard":
      illustration = `
        <rect x="320" y="150" width="560" height="470" rx="42" fill="#090B10" stroke="${accent}" stroke-width="14"/>
        <rect x="390" y="220" width="220" height="220" rx="26" fill="#0F1520" stroke="rgba(255,255,255,0.15)" stroke-width="8"/>
        <rect x="650" y="220" width="140" height="36" rx="12" fill="${accent}" opacity="0.85"/>
        <rect x="650" y="282" width="160" height="28" rx="10" fill="rgba(255,255,255,0.12)"/>
        <rect x="650" y="330" width="120" height="28" rx="10" fill="rgba(255,255,255,0.12)"/>
        <rect x="650" y="378" width="180" height="28" rx="10" fill="rgba(255,255,255,0.12)"/>
        <rect x="370" y="472" width="460" height="56" rx="20" fill="#111722" stroke="rgba(255,255,255,0.14)" stroke-width="6"/>
        <circle cx="770" cy="520" r="28" fill="${accent}" opacity="0.92"/>
      `;
      break;
    case "ram":
      illustration = `
        <rect x="220" y="338" width="760" height="170" rx="34" fill="#0A0F18" stroke="${accent}" stroke-width="14"/>
        ${Array.from({ length: 8 })
          .map((_, index) => `<rect x="${286 + index * 78}" y="296" width="42" height="128" rx="16" fill="${accent}" opacity="${0.32 + index * 0.06}"/>`)
          .join("")}
        ${Array.from({ length: 10 })
          .map((_, index) => `<rect x="${272 + index * 66}" y="510" width="16" height="70" rx="8" fill="#C7CFDD" opacity="0.7"/>`)
          .join("")}
      `;
      break;
    case "gpu":
      illustration = `
        <rect x="230" y="298" width="740" height="220" rx="40" fill="#0A0D14" stroke="${accent}" stroke-width="14"/>
        <circle cx="430" cy="408" r="88" fill="#101621" stroke="rgba(255,255,255,0.14)" stroke-width="10"/>
        <circle cx="430" cy="408" r="38" fill="${accent}" opacity="0.92"/>
        <circle cx="720" cy="408" r="88" fill="#101621" stroke="rgba(255,255,255,0.14)" stroke-width="10"/>
        <circle cx="720" cy="408" r="38" fill="${accent}" opacity="0.92"/>
        <rect x="892" y="346" width="42" height="126" rx="16" fill="#DDE3ED" opacity="0.9"/>
      `;
      break;
    case "cooling":
      illustration = `
        <rect x="230" y="250" width="480" height="300" rx="38" fill="#0B1018" stroke="${accent}" stroke-width="14"/>
        <circle cx="380" cy="400" r="90" fill="#111722" stroke="rgba(255,255,255,0.14)" stroke-width="8"/>
        <circle cx="560" cy="400" r="90" fill="#111722" stroke="rgba(255,255,255,0.14)" stroke-width="8"/>
        <circle cx="380" cy="400" r="34" fill="${accent}" opacity="0.92"/>
        <circle cx="560" cy="400" r="34" fill="${accent}" opacity="0.92"/>
        <rect x="760" y="320" width="138" height="138" rx="28" fill="#0B1018" stroke="rgba(255,255,255,0.14)" stroke-width="8"/>
        <path d="M710 400C748 400 748 389 760 389" stroke="${accent}" stroke-width="16" stroke-linecap="round"/>
      `;
      break;
    case "storage":
      illustration = `
        <rect x="220" y="352" width="760" height="124" rx="34" fill="#0B0E15" stroke="${accent}" stroke-width="14"/>
        <circle cx="314" cy="414" r="30" fill="${accent}" opacity="0.95"/>
        <rect x="388" y="382" width="250" height="30" rx="12" fill="rgba(255,255,255,0.15)"/>
        <rect x="388" y="428" width="188" height="24" rx="10" fill="rgba(255,255,255,0.1)"/>
        ${Array.from({ length: 6 })
          .map((_, index) => `<rect x="${726 + index * 32}" y="386" width="18" height="56" rx="8" fill="#DCE4F2" opacity="0.84"/>`)
          .join("")}
      `;
      break;
    case "case":
      illustration = `
        <rect x="430" y="160" width="320" height="540" rx="52" fill="#090C11" stroke="${accent}" stroke-width="14"/>
        <rect x="500" y="230" width="178" height="390" rx="32" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" stroke-width="8"/>
        <rect x="626" y="250" width="18" height="344" rx="9" fill="${accent}" opacity="0.9"/>
        <circle cx="598" cy="650" r="18" fill="#D9E0EB" opacity="0.85"/>
      `;
      break;
    case "psu":
      illustration = `
        <rect x="270" y="288" width="660" height="260" rx="40" fill="#0A0E14" stroke="${accent}" stroke-width="14"/>
        <circle cx="430" cy="418" r="96" fill="#101722" stroke="rgba(255,255,255,0.16)" stroke-width="10"/>
        <circle cx="430" cy="418" r="36" fill="${accent}" opacity="0.94"/>
        ${Array.from({ length: 8 })
          .map((_, index) => `<rect x="${664 + index * 28}" y="342" width="16" height="152" rx="8" fill="#DBE2EE" opacity="0.75"/>`)
          .join("")}
      `;
      break;
    case "peripheral":
      illustration = `
        <rect x="240" y="430" width="520" height="126" rx="28" fill="#0B1018" stroke="${accent}" stroke-width="14"/>
        ${Array.from({ length: 11 })
          .map((_, index) => `<rect x="${284 + index * 40}" y="466" width="24" height="24" rx="6" fill="rgba(255,255,255,${0.18 + (index % 3) * 0.05})"/>`)
          .join("")}
        <path d="M790 382C852 382 904 434 904 496V538H840C797 538 762 503 762 460V410C762 394 774 382 790 382Z" fill="#101722" stroke="${accent}" stroke-width="14"/>
      `;
      break;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" fill="none">
      <defs>
        <linearGradient id="bg" x1="120" y1="80" x2="1080" y2="820" gradientUnits="userSpaceOnUse">
          <stop stop-color="#14171E"/>
          <stop offset="1" stop-color="#07080B"/>
        </linearGradient>
        <radialGradient id="accentGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(600 360) rotate(90) scale(280 280)">
          <stop stop-color="${accent}" stop-opacity="0.34"/>
          <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)"/>
      <circle cx="965" cy="164" r="176" fill="${accent}" fill-opacity="0.12"/>
      <circle cx="250" cy="742" r="220" fill="${accent}" fill-opacity="0.08"/>
      <path d="M0 132H1200" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
      <path d="M0 720H1200" stroke="rgba(255,255,255,0.05)" stroke-width="2"/>
      ${illustration}
      <text x="92" y="120" fill="white" font-family="Arial, sans-serif" font-size="62" font-weight="700">${safeTitle}</text>
      <text x="92" y="176" fill="rgba(255,255,255,0.62)" font-family="Arial, sans-serif" font-size="28" font-weight="400">${safeSubtitle}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const findCatalogProduct = (...needles: string[]) =>
  allProducts.find((product) =>
    needles.every((needle) => product.name.toLowerCase().includes(needle.toLowerCase())),
  );

const cpuImages = {
  intelI5: "https://target.scene7.com/is/image/Target/GUEST_cb002eb7-a18f-41a8-9ca4-da7d187ec009?fmt=png-alpha&wid=1000&hei=1000",
  intelI7: "https://target.scene7.com/is/image/Target/GUEST_3bd1957a-5a46-4a0c-9956-8f52ddd6b783?fmt=png-alpha&wid=1000&hei=1000",
  amdR5: "https://target.scene7.com/is/image/Target/GUEST_ab1cb31e-6374-4b48-88ac-940a79c03dbc?fmt=png-alpha&wid=1000&hei=1000",
  amdR7: "https://target.scene7.com/is/image/Target/GUEST_42af582b-5e8c-42c1-b09a-6a073c63494c?fmt=png-alpha&wid=1000&hei=1000",
};

const motherboardImages = {
  b75: "https://cdn.oderco.com.br/produtos/270409/401F35F0C97D26C2E0630300A8C0FD75",
  h470: "https://cdn.oderco.com.br/produtos/270433/401F35F0C98926C2E0630300A8C0FD75",
  b650: "https://target.scene7.com/is/image/Target/GUEST_78e5082f-9e18-41c4-8d16-f3bf7fcda0c9?fmt=png-alpha&wid=1000&hei=1000",
  b650a: "https://target.scene7.com/is/image/Target/GUEST_cd497457-a7eb-4150-80fa-138e8444ce1e?fmt=png-alpha&wid=1000&hei=1000",
};

const ramImages = {
  ddr4_8: "https://cdn.oderco.com.br/produtos/34162/402EA1867FDB6E2DE0630300A8C0D98B",
  ddr4_32: "https://cdn.oderco.com.br/produtos/34689/4520E92D669EC021E0630300A8C02B6F",
  ddr4_32_front: "https://cdn.oderco.com.br/produtos/34689/4520E92D66A0C021E0630300A8C02B6F",
};

const psuImages = {
  electro550: "https://cdn.oderco.com.br/produtos/28742/4B7EC28153D51D2DE0630300A8C0552F",
  aether850: "https://cdn.oderco.com.br/produtos/244627/3D5C192CB9DE45B0E0630300A8C0C0C1",
  aether1000: "https://cdn.oderco.com.br/produtos/244628/3D5C192CB9E445B0E0630300A8C0C0C1",
};

const getProductsByCategory = (category: string, limit = 5) =>
  allProducts.filter((product) => product.category === category).slice(0, limit);

const getCaseType = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("white")) return "white";
  if (lowerName.includes("rgb") || lowerName.includes("argb")) return "rgb";
  return "black";
};

const toOptionFromProduct = (
  prefix: string,
  product: (typeof allProducts)[number],
  index: number,
  extras: Partial<Option> = {},
): Option => ({
  id: `${prefix}-${index + 1}`,
  name: product.name,
  price: product.priceNum,
  image: product.image,
  gallery: product.images?.length ? product.images : [product.image],
  summary: extras.summary ?? product.description,
  highlights: extras.highlights ?? product.features?.slice(0, 3) ?? product.tags.slice(0, 3),
  standard: extras.standard,
  req: extras.req,
  type: extras.type,
});

const gpuProducts = getProductsByCategory("Placas de Vídeo", 5);
const coolingProducts = getProductsByCategory("Refrigeração", 5);
const storageProducts = getProductsByCategory("SSD e HD", 5);
const caseProducts = getProductsByCategory("Gabinetes", 5);
const peripheralProducts = getProductsByCategory("Periféricos", 5);

const categories: Category[] = [
  {
    id: "cpu",
    title: "Processador",
    icon: <Cpu className="h-4 w-4" />,
    options: [
      {
        id: "cpu-1",
        name: "Intel Core i5-13400F",
        price: 1200,
        standard: true,
        summary: "Imagem real de caixa, boa leitura visual e ótimo ponto de partida para a vitrine do configurador.",
        highlights: ["LGA1700", "10 núcleos", "Até 4.6GHz"],
        image: cpuImages.intelI5,
        gallery: [cpuImages.intelI5],
      },
      {
        id: "cpu-2",
        name: "Intel Core i7-14700K",
        price: 2500,
        summary: "Outra foto real de produto para a etapa ficar mais parecida com um e-commerce montável de verdade.",
        highlights: ["LGA1700", "20 núcleos", "Até 5.6GHz"],
        image: cpuImages.intelI7,
        gallery: [cpuImages.intelI7],
      },
      {
        id: "cpu-3",
        name: "AMD Ryzen 5 7600",
        price: 1400,
        summary: "Caixa real do Ryzen para validar como a direita se comporta com fotos de marca conhecidas.",
        highlights: ["AM5", "6 núcleos", "Até 5.1GHz"],
        image: cpuImages.amdR5,
        gallery: [cpuImages.amdR5],
      },
      {
        id: "cpu-4",
        name: "AMD Ryzen 7 7800X3D",
        price: 2800,
        summary: "Produto real forte para games, útil para testar visual premium dentro do fluxo.",
        highlights: ["AM5", "8 núcleos", "3D V-Cache"],
        image: cpuImages.amdR7,
        gallery: [cpuImages.amdR7],
      },
    ],
  },
  {
    id: "motherboard",
    title: "Placa Mãe",
    icon: <Settings className="h-4 w-4" />,
    options: [
      {
        id: "mb-1",
        name: "B760M AORUS ELITE (Intel)",
        price: 1100,
        req: ["cpu-1", "cpu-2"],
        standard: true,
        summary: "Foto real de placa-mãe para validar melhor leitura de produto escolhido no accordion.",
        highlights: ["LGA1155", "DDR3", "mATX"],
        image: motherboardImages.b75,
        gallery: [motherboardImages.b75],
      },
      {
        id: "mb-2",
        name: "H470 PCYES (Intel)",
        price: 1800,
        req: ["cpu-1", "cpu-2"],
        summary: "Outra placa real da PCYES para comparação visual no fluxo.",
        highlights: ["LGA1200", "DDR4", "mATX"],
        image: motherboardImages.h470,
        gallery: [motherboardImages.h470],
      },
      {
        id: "mb-3",
        name: "TUF GAMING B650-PLUS WIFI (AMD)",
        price: 1300,
        req: ["cpu-3", "cpu-4"],
        summary: "Imagem real com motherboard e bundle, ótima para testar cards mais densos.",
        highlights: ["AM5", "DDR5", "ATX"],
        image: motherboardImages.b650,
        gallery: [motherboardImages.b650],
      },
      {
        id: "mb-4",
        name: "ROG STRIX B650-A GAMING WIFI (AMD)",
        price: 2500,
        req: ["cpu-3", "cpu-4"],
        summary: "Uma opção mais premium com foto real para ver como o bloco aguenta um produto mais sofisticado.",
        highlights: ["AM5", "DDR5", "ATX"],
        image: motherboardImages.b650a,
        gallery: [motherboardImages.b650a],
      },
    ],
  },
  {
    id: "ram",
    title: "Memória RAM",
    icon: <Zap className="h-4 w-4" />,
    options: [
      {
        id: "ram-1",
        name: "8GB DDR4 3200MHz UDIMM PCYES",
        price: 400,
        standard: true,
        summary: "Foto real do módulo PCYES, mais coerente com a proposta do configurador.",
        highlights: ["8GB", "DDR4", "3200MHz"],
        image: ramImages.ddr4_8,
        gallery: [ramImages.ddr4_8],
      },
      {
        id: "ram-2",
        name: "16GB DDR4 3200MHz UDIMM PCYES",
        price: 800,
        summary: "Mantém a vitrine com módulo real e deixa a comparação de cards mais fiel ao catálogo.",
        highlights: ["16GB", "DDR4", "3200MHz"],
        image: ramImages.ddr4_32_front,
        gallery: [ramImages.ddr4_32_front],
      },
      {
        id: "ram-3",
        name: "16GB DDR5 5600MHz UDIMM PCYES",
        price: 1600,
        summary: "Outra opção visualmente realista para testar como a etapa de memória se comporta com variações.",
        highlights: ["16GB", "DDR5", "5600MHz"],
        image: ramImages.ddr4_32,
        gallery: [ramImages.ddr4_32],
      },
      {
        id: "ram-4",
        name: "32GB DDR4 3200MHz UDIMM PCYES",
        price: 1900,
        summary: "Módulo real em ângulo, útil para ver diferença de leitura dentro do card e no cabeçalho.",
        highlights: ["32GB", "DDR4", "3200MHz"],
        image: ramImages.ddr4_32,
        gallery: [ramImages.ddr4_32, ramImages.ddr4_32_front],
      },
    ],
  },
  {
    id: "gpu",
    title: "Placa de Vídeo",
    icon: <Monitor className="h-4 w-4" />,
    options: gpuProducts.map((product, index) =>
      toOptionFromProduct("gpu", product, index, {
        standard: index === 0,
        summary: "Produto real do catálogo para a gente validar densidade visual, foto e nome ao mesmo tempo.",
      }),
    ),
  },
  {
    id: "cooling",
    title: "Refrigeração",
    icon: <Settings className="h-4 w-4" />,
    options: coolingProducts.map((product, index) =>
      toOptionFromProduct("cooling", product, index, {
        standard: index === 0,
        summary: "Foto real do item para testar como coolers menores e AIOs se comportam no grid.",
      }),
    ),
  },
  {
    id: "storage",
    title: "HD e SSD",
    icon: <HardDrive className="h-4 w-4" />,
    options: storageProducts.map((product, index) =>
      toOptionFromProduct("storage", product, index, {
        standard: index === 0,
        summary: "Produto real do catálogo, bom para validar cards menores com nome técnico mais comprido.",
      }),
    ),
  },
  {
    id: "case",
    title: "Gabinete",
    icon: <Monitor className="h-4 w-4" />,
    options: caseProducts.map((product, index) =>
      toOptionFromProduct("case", product, index, {
        standard: product.name.toLowerCase().includes("white ghost") || index === 0,
        summary: "Foto real de gabinete, importante para testar a percepção premium da prévia grande.",
        type: getCaseType(product.name),
      }),
    ),
  },
  {
    id: "psu",
    title: "Fonte de Alimentação",
    icon: <Zap className="h-4 w-4" />,
    options: [
      {
        id: "psu-1",
        name: "PCYES Electro V2 550W 80Plus Bronze",
        price: 300,
        standard: true,
        summary: "Foto real levantada no site oficial, mais fiel para a etapa de fonte.",
        highlights: ["550W", "80+ Bronze", "ATX"],
        image: psuImages.electro550,
        gallery: [psuImages.electro550],
      },
      {
        id: "psu-2",
        name: "PCYES Electro V2 650W 80Plus Bronze",
        price: 550,
        summary: "Mantém uma imagem real de fonte enquanto a gente avalia a hierarquia de conteúdo.",
        highlights: ["650W", "80+ Bronze", "PFC ativo"],
        image: psuImages.electro550,
        gallery: [psuImages.electro550],
      },
      {
        id: "psu-3",
        name: "PCYES Aether 850W Full Modular Gold",
        price: 650,
        summary: "Fonte real com visual mais premium para testar cards e thumb no cabeçalho.",
        highlights: ["850W", "80+ Gold", "ATX"],
        image: psuImages.aether850,
        gallery: [psuImages.aether850],
      },
      {
        id: "psu-4",
        name: "PCYES Aether 1000W Full Modular Gold",
        price: 1200,
        summary: "Mais uma foto real para a grade de fontes ficar com densidade suficiente.",
        highlights: ["1000W", "Gold", "Full Modular"],
        image: psuImages.aether1000,
        gallery: [psuImages.aether1000],
      },
    ],
  },
  {
    id: "peripherals",
    title: "Periféricos",
    icon: <Settings className="h-4 w-4" />,
    options: peripheralProducts.map((product, index) =>
      toOptionFromProduct("peripherals", product, index, {
        standard: index === 0,
        summary: "Foto real do catálogo para avaliar como itens menores se comportam nos cards da direita.",
      }),
    ),
  },
];

interface AmbientConfig {
  bg: string;
  glow: string;
}

const getAmbient = (type?: string): AmbientConfig => {
  switch (type) {
    case "white":
      return {
        bg: "radial-gradient(circle at 22% 14%, rgba(255,255,255,0.12), transparent 28%), radial-gradient(circle at 78% 18%, rgba(255,255,255,0.08), transparent 24%), linear-gradient(180deg, #171717 0%, #090909 100%)",
        glow: "rgba(255,255,255,0.14)",
      };
    case "rgb":
      return {
        bg: "radial-gradient(circle at 18% 16%, rgba(139,92,246,0.22), transparent 28%), radial-gradient(circle at 82% 18%, rgba(6,182,212,0.16), transparent 22%), linear-gradient(180deg, #12091d 0%, #080808 100%)",
        glow: "rgba(139,92,246,0.26)",
      };
    default:
      return {
        bg: "radial-gradient(circle at 22% 14%, rgba(255,255,255,0.07), transparent 26%), radial-gradient(circle at 82% 16%, rgba(255,255,255,0.04), transparent 20%), linear-gradient(180deg, #141414 0%, #080808 100%)",
        glow: "rgba(255,255,255,0.09)",
      };
  }
};

export function MonteSeuPcPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const previewRef = useRef<HTMLDivElement>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  const [selections, setSelections] = useState<Record<string, string>>({
    cpu: "cpu-1",
    motherboard: "mb-1",
    ram: "ram-1",
    gpu: "gpu-1",
    cooling: "cooling-1",
    storage: "storage-1",
    case: "case-2",
    psu: "psu-1",
    peripherals: "peripherals-1",
  });
  const [activeCategory, setActiveCategory] = useState<string>("cpu");
  const [expandedCategory, setExpandedCategory] = useState<string>("cpu");
  const [activeView, setActiveView] = useState(0);
  const [actionFeedback, setActionFeedback] = useState("");

  const categoriesWithSelected = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        selectedOption: category.options.find((option) => option.id === selections[category.id]),
      })),
    [selections],
  );

  const currentCategory = categoriesWithSelected.find((category) => category.id === activeCategory);
  const currentPreviewOption = currentCategory?.selectedOption ?? categoriesWithSelected.find((category) => category.id === "case")?.selectedOption;
  const currentGallery =
    currentPreviewOption?.gallery?.length
      ? currentPreviewOption.gallery
      : currentPreviewOption?.image
        ? [currentPreviewOption.image]
        : [];

  const currentCase = categoriesWithSelected.find((category) => category.id === "case")?.selectedOption;
  const ambient = useMemo(() => getAmbient(currentCase?.type), [currentCase?.type]);

  const priceBreakdown = useMemo(() => {
    let base = 0;
    let equipment = 0;

    Object.entries(selections).forEach(([categoryId, optionId]) => {
      const category = categories.find((item) => item.id === categoryId);
      const option = category?.options.find((item) => item.id === optionId);
      if (!option) return;

      if (option.standard) base += option.price;
      else equipment += option.price;
    });

    return { base, equipment, total: base + equipment };
  }, [selections]);

  const configurationName = useMemo(() => {
    const caseName = currentCase?.name ?? "PCYES Custom";
    return `${caseName} · Build personalizada`;
  }, [currentCase?.name]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY);
      if (!raw) return;

      const savedSelections = JSON.parse(raw) as Record<string, string>;
      if (!savedSelections || typeof savedSelections !== "object") return;
      setSelections((prev) => ({ ...prev, ...savedSelections }));
    } catch {
      // Ignore invalid saved data.
    }
  }, []);

  useEffect(() => {
    setSelections((prev) => {
      let changed = false;
      const next = { ...prev };

      categories.forEach((category) => {
        const selected = category.options.find((option) => option.id === next[category.id]);
        if (!selected) return;

        if (selected.req && !selected.req.includes(next.cpu)) {
          const fallback = category.options.find((option) => !option.req || option.req.includes(next.cpu));
          if (fallback) {
            next[category.id] = fallback.id;
            changed = true;
          }
        }
      });

      return changed ? next : prev;
    });
  }, [selections.cpu]);

  useEffect(() => {
    setActiveView(0);
  }, [activeCategory, currentPreviewOption?.id]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const pushFeedback = (message: string) => {
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }

    setActionFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => {
      setActionFeedback("");
      feedbackTimerRef.current = null;
    }, 2400);
  };

  const getVisibleOptions = (category: Category) =>
    category.options.filter((option) => !option.req || option.req.includes(selections.cpu));

  const handleSelect = (categoryId: string, optionId: string) => {
    setSelections((prev) => ({ ...prev, [categoryId]: optionId }));
    setActiveCategory(categoryId);

    const currentIndex = categories.findIndex((category) => category.id === categoryId);
    const nextCategory = categories[currentIndex + 1];
    if (nextCategory) {
      setExpandedCategory(nextCategory.id);
      setActiveCategory(nextCategory.id);
    }
  };

  const toggleSection = (categoryId: string) => {
    setExpandedCategory((prev) => (prev === categoryId ? "" : categoryId));
    setActiveCategory(categoryId);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/produtos");
  };

  const handleSave = () => {
    window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(selections));
    pushFeedback("Configuração salva");
  };

  const handleShare = async () => {
    const shareData = {
      title: configurationName,
      text: `Confira esta configuração PCYES em ${formatCurrency(priceBreakdown.total)}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(window.location.href);
      pushFeedback("Link pronto para compartilhar");
    } catch {
      pushFeedback("Compartilhamento cancelado");
    }
  };

  const handleFullscreen = async () => {
    if (!previewRef.current) return;

    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await previewRef.current.requestFullscreen();
    } catch {
      pushFeedback("Tela cheia indisponível");
    }
  };

  const handleAddToCart = () => {
    const cartKey = `pc-builder-${Object.entries(selections)
      .map(([categoryId, optionId]) => `${categoryId}:${optionId}`)
      .join("|")}`;

    addItem({
      cartKey,
      id: 900001,
      name: configurationName,
      price: formatCurrency(priceBreakdown.total),
      image: currentCase?.image ?? currentPreviewOption?.image ?? "",
    });

    pushFeedback("Configuração adicionada ao carrinho");
  };

  return (
    <div className="bg-[#080808] pt-[140px] md:pt-[180px] text-[#f5f5f5]">
      <header className="sticky top-[92px] z-40 border-b border-white/[0.06] bg-[#090909]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1760px] items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2 rounded-full px-3 text-sm text-zinc-300 hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="gap-2 rounded-full px-3 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Salvar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-2 rounded-full px-3 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
          </div>

          <div className="hidden text-center md:block">
            <p className="text-sm font-semibold tracking-[0.18em] text-zinc-100">
              MONTE SEU PC
              <span className="ml-2 text-xs font-normal tracking-[0.12em] text-zinc-500">PCYES</span>
            </p>
            {actionFeedback && <p className="mt-1 text-[11px] text-zinc-400">{actionFeedback}</p>}
          </div>

          <div className="text-right">
            <p className="text-lg font-bold tabular-nums">{formatCurrency(priceBreakdown.total)}</p>
            <p className="text-[10px] text-zinc-500">Valores não incluem frete</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1760px] flex-col gap-0 md:h-[calc(100vh-151px)] md:overflow-hidden md:flex-row">
        <section className="border-b border-white/[0.05] md:h-full md:w-[63%] md:border-b-0 md:border-r md:border-white/[0.04]">
          <div className="flex h-full flex-col px-4 pb-6 pt-4 md:px-6 md:pb-8 lg:px-8">
            <div
              ref={previewRef}
              className="relative min-h-[420px] flex-1 overflow-hidden rounded-[28px] border border-white/[0.06] shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
              style={{ background: ambient.bg }}
            >
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px] transition-all duration-700 md:h-[480px] md:w-[480px]"
                style={{ backgroundColor: ambient.glow }}
              />

              {currentGallery[activeView] ? (
                <img
                  src={currentGallery[activeView]}
                  alt={currentPreviewOption?.name ?? "Prévia da configuração"}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-500"
                />
              ) : (
                <div className="absolute inset-0 animate-pulse bg-white/[0.04]" />
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />

              <button
                type="button"
                onClick={handleFullscreen}
                className="absolute right-5 top-5 z-20 rounded-2xl border border-white/10 bg-black/35 p-3 text-zinc-100 transition hover:bg-black/55"
                aria-label="Abrir em tela cheia"
              >
                <Expand className="h-4 w-4" />
              </button>

              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pb-5 pt-20 md:px-7 md:pb-7">
                <div className="max-w-[560px]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">{currentCategory?.title ?? "Configuração"}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white md:text-[32px]">{currentPreviewOption?.name ?? configurationName}</h2>
                  {currentPreviewOption?.summary && <p className="mt-2 max-w-[46ch] text-sm text-zinc-300 md:text-[15px]">{currentPreviewOption.summary}</p>}
                  {currentPreviewOption?.highlights && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {currentPreviewOption.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] text-zinc-200"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {currentGallery.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {currentGallery.map((image, index) => (
                  <button
                    key={`${currentPreviewOption?.id ?? "preview"}-${index}`}
                    type="button"
                    onClick={() => setActiveView(index)}
                    className={cn(
                      "h-20 w-24 overflow-hidden rounded-2xl border transition",
                      activeView === index
                        ? "border-white/30 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                        : "border-white/[0.08] opacity-70 hover:border-white/20 hover:opacity-100",
                    )}
                  >
                    <img src={image} alt={`${currentPreviewOption?.name ?? "Prévia"} ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="w-full md:h-full md:w-[37%] md:overflow-y-auto">
          <div className="px-5 py-6 md:px-6 lg:px-7">
            <div className="mb-6">
              <h1 className="text-[28px] font-semibold tracking-tight text-white">Monte seu PC</h1>
              <p className="mt-1 text-sm text-zinc-500">
                O fluxo da escolha fica aqui na direita. Abrimos uma etapa por vez, com imagem e contexto de cada item.
              </p>
            </div>

            <div className="space-y-3">
              {categoriesWithSelected.map((category) => {
                const isOpen = expandedCategory === category.id;
                const visibleOptions = getVisibleOptions(category);
                const hasSelection = Boolean(category.selectedOption);

                return (
                  <div
                    key={category.id}
                    className={cn(
                      "overflow-hidden rounded-[24px] border bg-white/[0.02] transition-colors",
                      hasSelection
                        ? "border-emerald-500/18 bg-emerald-500/[0.03]"
                        : "border-white/[0.06]",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(category.id)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left md:px-5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={cn(
                            "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border",
                            hasSelection
                              ? "border-white/[0.08] bg-white/[0.05]"
                              : "border-white/[0.06] bg-white/[0.05] text-zinc-400",
                          )}
                        >
                          {category.selectedOption?.image ? (
                            <img
                              src={category.selectedOption.image}
                              alt={category.selectedOption.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            category.icon
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-semibold text-white">{category.title}</p>
                          {category.selectedOption && (
                            <p className="mt-1 truncate text-sm text-zinc-500">{category.selectedOption.name}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {category.selectedOption && (
                          <span
                            className={cn(
                              "text-sm tabular-nums",
                              hasSelection ? "text-emerald-400/95" : "text-zinc-300",
                            )}
                          >
                            {formatCurrency(category.selectedOption.price)}
                          </span>
                        )}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200",
                            isOpen && "rotate-180",
                          )}
                        />
                      </div>
                    </button>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300",
                        isOpen ? "max-h-[2400px] opacity-100" : "max-h-0 opacity-0",
                      )}
                    >
                      <div className="border-t border-white/[0.05] px-4 py-4 md:px-5">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {visibleOptions.map((option) => {
                            const selected = selections[category.id] === option.id;

                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => handleSelect(category.id, option.id)}
                                className={cn(
                                  "group relative flex flex-col rounded-[22px] border p-3.5 text-left transition-all duration-200 md:p-4",
                                  selected
                                    ? "border-emerald-500/22 bg-emerald-500/[0.03] shadow-[0_0_0_1px_rgba(16,185,129,0.06)]"
                                    : "border-white/[0.07] bg-transparent hover:border-white/[0.14] hover:bg-white/[0.02]",
                                )}
                              >
                                <div className="aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-white/[0.04]">
                                  {option.image ? (
                                    <img src={option.image} alt={option.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-white/[0.03] text-zinc-600">
                                      {category.icon}
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1 pt-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <span className="block text-sm font-semibold leading-snug text-zinc-100">
                                        {option.name}
                                      </span>
                                      {option.summary && (
                                        <p className="mt-1 text-sm leading-relaxed text-zinc-400">{option.summary}</p>
                                      )}
                                    </div>

                                    {selected && (
                                      <div className="shrink-0 rounded-full bg-white/12 p-1">
                                        <Check className="h-3.5 w-3.5 text-white" />
                                      </div>
                                    )}
                                  </div>

                                  {option.highlights && option.highlights.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                      {option.highlights.map((highlight) => (
                                        <span
                                          key={highlight}
                                          className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-300"
                                        >
                                          {highlight}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  <div className="mt-3 flex items-center justify-between">
                                    <span
                                      className={cn(
                                        "text-sm tabular-nums",
                                        selected ? "text-emerald-400/95" : "text-zinc-200",
                                      )}
                                    >
                                      {formatCurrency(option.price)}
                                    </span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-5 md:p-6">
              <Button
                type="button"
                onClick={handleAddToCart}
                className="h-14 w-full rounded-2xl bg-white text-base font-semibold text-black transition hover:bg-white/90"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
