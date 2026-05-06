import svgPaths from "./svg-db0df24e27";
import svgPathsAging from "./svg-abb0s7dyms";
import imgImage3 from "figma:asset/97aae0ae8291dd43169bdb54a683386010a2ba02.png";
import imgImage2 from "figma:asset/e06e2bdfdfc5ab21f45dae07313981e1cceddfd9.png";
import imgImage4 from "figma:asset/dfa09e9ee9df8c31f7ed1ee1a4d321b836c2b9bb.png";
import { imgFrame } from "./svg-b93ya";
import FormacaoDePreco from "./Group878";
import Promocao from "./Group879";

function Group55() {
  return (
    <div className="absolute contents left-[73px] top-[131px]">
      <div className="absolute bg-white border border-[#e0e0e0] border-solid h-[350px] left-[73px] rounded-[8px] top-[131px] w-[882px]">
        {/* SKU label */}
        <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[30.52px] text-[#101010] text-[16px] top-[19px]">SKU</p>
        
        {/* SKU input with search icon */}
        <div className="absolute bg-[#fafafa] h-[46px] left-[30.52px] rounded-[8px] top-[47px] w-[817.91px]">
          <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <input 
            type="text" 
            placeholder="SKU, nome do produto, etc" 
            className="absolute bg-transparent border-0 font-['Red_Hat_Display:Regular',sans-serif] font-normal h-full left-0 outline-none px-[14px] text-[#4d5163] text-[14px] w-[calc(100%-40px)]"
          />
          {/* Search icon */}
          <div className="absolute right-[14px] size-[24px] top-[11px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <g id="search">
                <path d={svgPaths.p19568f00} id="Vector" stroke="#005AFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M21 21L16.65 16.65" id="Vector_2" stroke="#005AFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </g>
            </svg>
          </div>
        </div>

        {/* Product image */}
        <div className="absolute h-[73px] left-[30.52px] top-[113px] w-[74.263px]">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
        </div>
        
        {/* Product description */}
        <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[121.06px] text-[#4d5163] text-[12px] top-[133px] w-[442.526px] whitespace-pre-wrap">PLACA DE VIDEO NVIDIA GEFORCE GT740 GDD5 4GB 128BIT - PAX740D54GB</p>
        <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[121.06px] text-[#4d5163] text-[12px] top-[150px] w-[64.09px] whitespace-pre-wrap">SKU: 123123</p>

        {/* Radio buttons ES */}
        <div className="absolute flex items-center gap-[10px] left-[765px] top-[133px]">
          <button className="relative block cursor-pointer rounded-full size-[24px]" data-name="select">
            <div aria-hidden="true" className="absolute border-2 border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-full" />
          </button>
          <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] text-[#101010] text-[16px]">ES</p>
        </div>

        {/* Radio buttons PR */}
        <div className="absolute flex items-center gap-[10px] left-[765px] top-[166px]">
          <button className="relative block cursor-pointer rounded-full size-[24px]" data-name="select">
            <div aria-hidden="true" className="absolute border-2 border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-full" />
          </button>
          <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] text-[#101010] text-[16px]">PR</p>
        </div>

        {/* Salvar button */}
        <div className="absolute bg-[#005aff] content-stretch flex gap-[16px] items-center justify-center left-[30.52px] px-[24px] py-[12px] rounded-[8px] top-[218px] w-[171px]">
          <p className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[16px] text-white">Salvar</p>
        </div>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[23.79%_82.59%_68.4%_0]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[23.79%_82.59%_68.4%_4.78%] leading-[normal] text-[#101010] text-[16px]">Caixa mãe</p>
      <button className="absolute block cursor-pointer inset-[24.16%_96.59%_68.4%_0] rounded-[4px]" data-name="select">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </button>
    </div>
  );
}

function Group61() {
  return (
    <div className="absolute contents inset-[69.14%_80.88%_23.05%_10.92%]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[69.14%_80.88%_23.05%_15.7%] leading-[normal] text-[#101010] text-[16px]">R$</p>
      <button className="absolute block cursor-pointer inset-[69.52%_85.66%_23.05%_10.92%] rounded-[27px]" data-name="select">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[27px]" />
      </button>
    </div>
  );
}

function Group62() {
  return (
    <div className="absolute contents inset-[69.14%_62.79%_23.05%_23.22%]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[69.14%_62.79%_23.05%_27.99%] leading-[normal] text-[#101010] text-[16px]">Markup</p>
      <button className="absolute block cursor-pointer inset-[69.52%_73.37%_23.05%_23.22%] rounded-[28px]" data-name="select">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[28px]" />
      </button>
    </div>
  );
}

function Component() {
  return (
    <div className="absolute inset-[69.14%_93.17%_23.05%_0]" data-name="Component 4">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[0_0_0_70%] leading-[normal] text-[#101010] text-[16px]">%</p>
      <button className="absolute block bottom-0 cursor-pointer left-0 right-1/2 rounded-[41px] top-[4.76%]" data-name="select">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[41px]" />
      </button>
    </div>
  );
}

function Group65() {
  return (
    <div className="absolute contents inset-[69.14%_93.17%_23.05%_0]">
      <Component />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-[calc(50%+70px)] top-[529px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%+98px)] text-[#101010] text-[16px] top-[529px]">Bloqueio de desconto</p>
      <button className="absolute block cursor-pointer left-[calc(50%+70px)] rounded-[4px] size-[20px] top-[530px]" data-name="select">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </button>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-[calc(50%+70px)] top-[529px]">
      <Group9 />
      <div className="absolute bg-[#fafafa] content-stretch flex h-[46px] items-start left-[calc(50%+70px)] p-[14px] rounded-[8px] top-[562px] w-[183px]" data-name="input default">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d7d8da] text-[14px]">%</p>
      </div>
    </div>
  );
}

function Group121() {
  return (
    <div className="absolute contents left-[calc(50%+40px)] top-[466px]">
      <div className="absolute bg-white border border-[#e0e0e0] border-solid h-[523px] left-[calc(50%+40px)] rounded-[8px] top-[466px] w-[648px]" />
      <div className="absolute h-[269px] left-[calc(50%+70px)] top-[643px] w-[585.82px]" data-name="Component 3">
        <Group5 />
        <div className="absolute bg-[#fafafa] content-stretch flex inset-[36.06%_78.15%_46.84%_0] items-start p-[14px] rounded-[8px]" data-name="input default">
          <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d7d8da] text-[14px]">qtd.</p>
        </div>
        <div className="absolute bg-[#fafafa] content-stretch flex inset-[36.06%_54.25%_46.84%_23.9%] items-start p-[14px] rounded-[8px]" data-name="input default">
          <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d7d8da] text-[14px]">%</p>
        </div>
        <Group61 />
        <Group62 />
        <Group65 />
        <div className="absolute bg-[#fafafa] content-stretch flex inset-[82.9%_77.7%_0_0] items-start p-[14px] rounded-[8px]" data-name="input default">
          <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d7d8da] text-[14px]">%</p>
        </div>
        <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold inset-[85.5%_72.24%_2.6%_25.2%] leading-[normal] text-[#005aff] text-[24px]">+</p>
        <div className="absolute bg-[#fafafa] content-stretch flex inset-[36.06%_23.38%_46.84%_54.32%] items-start p-[14px] rounded-[8px]" data-name="input default">
          <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d7d8da] text-[14px]">qtd.</p>
        </div>
        <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[23.79%_20.45%_68.4%_54.28%] leading-[normal] text-[#101010] text-[16px]">Promocional por lote</p>
        <button className="absolute block cursor-pointer font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[0_53.43%_92.19%_36.33%] leading-[0] text-[#a5a7a9] text-[16px] text-left whitespace-nowrap">
          <p className="leading-[normal]">Por data</p>
        </button>
        <button className="absolute block cursor-pointer font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[0_27.99%_92.19%_60.23%] leading-[0] text-[#a5a7a9] text-[16px] text-left whitespace-nowrap">
          <p className="leading-[normal]">Por verba</p>
        </button>
        <div className="absolute inset-[11.9%_0_88.1%_0.31%]">
          <div className="absolute inset-[-1px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 584 1">
              <line id="Line 90" stroke="var(--stroke-0, #A5A7A9)" x2="584" y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>
        <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold inset-[0_77.3%_92.19%_2.73%] leading-[normal] text-[#005aff] text-[16px]">Por quantidade</p>
        <div className="absolute inset-[11.9%_74.39%_88.1%_0]">
          <div className="absolute inset-[-2px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 150 2">
              <line id="Line 91" stroke="var(--stroke-0, #005AFF)" strokeWidth="2" x2="150" y1="1" y2="1" />
            </svg>
          </div>
        </div>
        <button className="absolute block cursor-pointer font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[0_2.05%_92.19%_85.66%] leading-[0] text-[#a5a7a9] text-[16px] text-left whitespace-nowrap">
          <p className="leading-[normal]">Pré venda</p>
        </button>
      </div>
      <Group6 />
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[calc(50%+70.11px)] text-[#101010] text-[20px] top-[487px]">Promoção</p>
    </div>
  );
}

function Group107() {
  return (
    <div className="absolute contents left-[99px] text-[#101010] top-[639px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[99px] text-[16px] top-[643px]">IPI</p>
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold left-[calc(8.33%+5px)] text-[20px] top-[639px]">12%</p>
    </div>
  );
}

function Group108() {
  return (
    <div className="absolute contents left-[99px] top-[639px]">
      <Group107 />
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[99px] text-[#a5a7a9] text-[16px] top-[669px]">(R$30,00)</p>
    </div>
  );
}

function Group109() {
  return (
    <div className="absolute contents left-[calc(8.33%+87px)] text-[#101010] top-[639px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[calc(8.33%+87px)] text-[16px] top-[643px]">Custo Operacional</p>
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold left-[calc(16.67%+104px)] text-[20px] top-[639px]">12%</p>
    </div>
  );
}

function Group110() {
  return (
    <div className="absolute contents left-[calc(8.33%+87px)] top-[639px]">
      <Group109 />
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[calc(8.33%+87px)] text-[#a5a7a9] text-[16px] top-[669px]">(R$30,00)</p>
    </div>
  );
}

function Group112() {
  return (
    <div className="absolute contents leading-[normal] left-[99px] top-[639px]">
      <Group108 />
      <Group110 />
    </div>
  );
}

function Edit() {
  return (
    <div className="absolute inset-[31.94%_81.53%_67.46%_17.5%]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents left-[99px] top-[740px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[99px] text-[#005aff] text-[20px] top-[740px]">R$ 1.000,00</p>
      <Edit />
      <div className="absolute h-0 left-[99px] top-[772px] w-[169px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 169 1">
            <line id="Line 86" stroke="var(--stroke-0, #A5A7A9)" x2="169" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents left-[99px] top-[714px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[0] left-[99px] text-[#101010] text-[0px] text-[16px] top-[714px]">
        <span className="leading-[normal]">{`Valor de venda `}</span>
        <span className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal]">(sem IPI)</span>
      </p>
      <Group10 />
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents left-[99px] top-[714px]">
      <Group11 />
    </div>
  );
}

function Edit1() {
  return (
    <div className="absolute inset-[31.94%_67.01%_67.46%_32.01%]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents left-[calc(16.67%+68px)] top-[740px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[calc(16.67%+68px)] text-[#005aff] text-[20px] top-[740px]">R$ 1.000,00</p>
      <Edit1 />
      <div className="absolute h-0 left-[calc(16.67%+68px)] top-[772px] w-[169px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 169 1">
            <line id="Line 86" stroke="var(--stroke-0, #A5A7A9)" x2="169" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents left-[calc(16.67%+68px)] top-[714px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[0] left-[calc(16.67%+68px)] text-[#101010] text-[0px] text-[16px] top-[714px]">
        <span className="leading-[normal]">{`Valor de venda `}</span>
        <span className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal]">(com IPI)</span>
      </p>
      <Group13 />
    </div>
  );
}

function Group111() {
  return (
    <div className="absolute contents left-[99px] top-[714px]">
      <Group16 />
      <Group12 />
    </div>
  );
}

function Group117() {
  return (
    <div className="absolute contents left-[99px] top-[639px]">
      <Group112 />
      <Group111 />
    </div>
  );
}

function Group118() {
  return (
    <div className="absolute contents leading-[normal] left-[115px] top-[825px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[calc(25%+34px)] text-[#a5a7a9] text-[12px] top-[833px]">Valor com imposto. Referência para formação antiga</p>
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold left-[115px] text-[#101010] text-[20px] top-[825px]">Referência de última compra</p>
    </div>
  );
}

function Group68() {
  return (
    <div className="absolute contents left-[115px] top-[825px]">
      <Group118 />
    </div>
  );
}

function Group66() {
  return (
    <div className="absolute contents left-[calc(16.67%+26px)] top-[875px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[calc(16.67%+26px)] text-[16px] top-[875px]">Markup</p>
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold left-[calc(16.67%+26px)] text-[20px] top-[900px]">42%</p>
    </div>
  );
}

function Group67() {
  return (
    <div className="absolute contents left-[calc(25%+8px)] top-[875px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[calc(25%+8px)] text-[16px] top-[875px]">Lucratividade</p>
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold left-[calc(25%+8px)] text-[20px] top-[900px]">1%</p>
    </div>
  );
}

function Group106() {
  return (
    <div className="absolute contents leading-[normal] left-[calc(8.33%-3px)] text-[#101010] top-[875px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold left-[calc(8.33%-3px)] text-[20px] top-[900px]">R$ 700,00</p>
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[calc(8.33%-3px)] text-[16px] top-[875px]">Última compra</p>
      <Group66 />
      <Group67 />
    </div>
  );
}

function Group113() {
  return (
    <div className="absolute contents left-[115px] top-[825px]">
      <Group68 />
      <Group106 />
    </div>
  );
}

function Group114() {
  return (
    <div className="absolute contents left-[99px] top-[804px]">
      <div className="absolute bg-white h-[143px] left-[99px] rounded-[8px] top-[804px] w-[605px]" />
      <Group113 />
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents leading-[normal] left-[99px] top-[532px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[100px] text-[#a5a7a9] text-[12px] top-[591px]">Última compra: R$643,10</p>
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[99px] text-[#101010] text-[16px] top-[532px]">CMV</p>
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold left-[99px] text-[#101010] text-[20px] top-[561px]">R$ 650,00</p>
    </div>
  );
}

function Group91() {
  return (
    <div className="absolute contents left-[calc(16.67%+58px)] top-[538px]">
      <button className="absolute block cursor-pointer left-[calc(16.67%+58px)] rounded-[41px] size-[20px] top-[538px]" data-name="select">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[41px]" />
      </button>
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(16.67%+82px)] text-[#101010] text-[16px] top-[538px]">Markup</p>
    </div>
  );
}

function Group92() {
  return (
    <div className="absolute contents left-[calc(25%+32px)] top-[538px]">
      <button className="absolute block cursor-pointer left-[calc(25%+32px)] rounded-[41px] size-[20px] top-[538px]" data-name="select">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[41px]" />
      </button>
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(25%+56px)] text-[#101010] text-[16px] top-[538px]">Lucratividade</p>
    </div>
  );
}

function Edit2() {
  return (
    <div className="absolute inset-[24.66%_73.61%_74.74%_25.42%]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents left-[calc(16.67%+58px)] top-[573px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[calc(16.67%+61px)] text-[#101010] text-[20px] top-[573px]">35%</p>
      <Edit2 />
      <div className="absolute h-0 left-[calc(16.67%+58px)] top-[601px] w-[83px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 83 1">
            <line id="Line 87" stroke="var(--stroke-0, #A5A7A9)" x2="83" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group115() {
  return (
    <div className="absolute contents left-[calc(16.67%+58px)] top-[538px]">
      <Group91 />
      <Group92 />
      <Group14 />
    </div>
  );
}

function Group116() {
  return (
    <div className="absolute contents left-[99px] top-[532px]">
      <div className="absolute bg-[#a5a7a9] h-[51px] left-[calc(16.67%+25px)] rounded-[8px] top-[544px] w-px" />
      <Group15 />
      <Group115 />
    </div>
  );
}

function Group120() {
  return (
    <div className="absolute contents left-[79px] top-[466px]">
      <div className="absolute bg-white border border-[#e0e0e0] border-solid h-[523px] left-[79px] rounded-[8px] top-[466px] w-[649px]" />
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[99px] text-[#101010] text-[20px] top-[487px]">Formação de preço</p>
      <Group117 />
      <Group114 />
      <Group116 />
    </div>
  );
}

function Edit3() {
  return (
    <div className="absolute left-[calc(58.33%+12px)] size-[14px] top-[1198px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1198px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(41.67%+96px)] text-[#101010] text-[0px] text-[14px] top-[1198px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(41.67%+96px)] text-[#4d5163] text-[12px] top-[1229px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(50%+8px)] top-[1218px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit3 />
    </div>
  );
}

function Group76() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1198px]">
      <Group17 />
    </div>
  );
}

function Edit4() {
  return (
    <div className="absolute left-[calc(58.33%+12px)] size-[14px] top-[1634px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1634px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(41.67%+96px)] text-[#101010] text-[0px] text-[14px] top-[1634px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(41.67%+96px)] text-[#4d5163] text-[12px] top-[1665px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(50%+8px)] top-[1654px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit4 />
    </div>
  );
}

function Group129() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1634px]">
      <Group18 />
    </div>
  );
}

function Edit5() {
  return (
    <div className="absolute left-[calc(58.33%+12px)] size-[14px] top-[1301px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1301px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(41.67%+96px)] text-[#101010] text-[0px] text-[14px] top-[1301px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(41.67%+96px)] text-[#4d5163] text-[12px] top-[1332px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(50%+8px)] top-[1321px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit5 />
    </div>
  );
}

function Group125() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1301px]">
      <Group19 />
    </div>
  );
}

function Edit6() {
  return (
    <div className="absolute left-[calc(58.33%+12px)] size-[14px] top-[1737px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1737px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(41.67%+96px)] text-[#101010] text-[0px] text-[14px] top-[1737px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(41.67%+96px)] text-[#4d5163] text-[12px] top-[1768px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(50%+8px)] top-[1757px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit6 />
    </div>
  );
}

function Group130() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1737px]">
      <Group20 />
    </div>
  );
}

function Edit7() {
  return (
    <div className="absolute left-[calc(58.33%+12px)] size-[14px] top-[1404px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1404px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(41.67%+96px)] text-[#101010] text-[0px] text-[14px] top-[1404px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(41.67%+96px)] text-[#4d5163] text-[12px] top-[1435px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(50%+8px)] top-[1424px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit7 />
    </div>
  );
}

function Group128() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1404px]">
      <Group21 />
    </div>
  );
}

function Edit8() {
  return (
    <div className="absolute left-[calc(58.33%+12px)] size-[14px] top-[1840px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1840px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(41.67%+96px)] text-[#101010] text-[0px] text-[14px] top-[1840px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(41.67%+96px)] text-[#4d5163] text-[12px] top-[1871px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(50%+8px)] top-[1860px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit8 />
    </div>
  );
}

function Group131() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1840px]">
      <Group22 />
    </div>
  );
}

function Edit9() {
  return (
    <div className="absolute left-[calc(75%-10px)] size-[14px] top-[1198px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute contents left-[calc(58.33%+74px)] top-[1198px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(58.33%+74px)] text-[#101010] text-[0px] text-[14px] top-[1198px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(58.33%+74px)] text-[#4d5163] text-[12px] top-[1229px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(66.67%-14px)] top-[1218px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit9 />
    </div>
  );
}

function Group123() {
  return (
    <div className="absolute contents left-[calc(58.33%+74px)] top-[1198px]">
      <Group23 />
    </div>
  );
}

function Edit10() {
  return (
    <div className="absolute left-[calc(75%-10px)] size-[14px] top-[1634px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute contents left-[calc(58.33%+74px)] top-[1634px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(58.33%+74px)] text-[#101010] text-[0px] text-[14px] top-[1634px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(58.33%+74px)] text-[#4d5163] text-[12px] top-[1665px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(66.67%-14px)] top-[1654px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit10 />
    </div>
  );
}

function Group132() {
  return (
    <div className="absolute contents left-[calc(58.33%+74px)] top-[1634px]">
      <Group24 />
    </div>
  );
}

function Edit11() {
  return (
    <div className="absolute left-[calc(75%-10px)] size-[14px] top-[1301px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute contents left-[calc(58.33%+74px)] top-[1301px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(58.33%+74px)] text-[#101010] text-[0px] text-[14px] top-[1301px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(58.33%+74px)] text-[#4d5163] text-[12px] top-[1332px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(66.67%-14px)] top-[1321px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit11 />
    </div>
  );
}

function Group126() {
  return (
    <div className="absolute contents left-[calc(58.33%+74px)] top-[1301px]">
      <Group25 />
    </div>
  );
}

function Edit12() {
  return (
    <div className="absolute left-[calc(75%-10px)] size-[14px] top-[1737px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute contents left-[calc(58.33%+74px)] top-[1737px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(58.33%+74px)] text-[#101010] text-[0px] text-[14px] top-[1737px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(58.33%+74px)] text-[#4d5163] text-[12px] top-[1768px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(66.67%-14px)] top-[1757px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit12 />
    </div>
  );
}

function Group133() {
  return (
    <div className="absolute contents left-[calc(58.33%+74px)] top-[1737px]">
      <Group26 />
    </div>
  );
}

function Edit13() {
  return (
    <div className="absolute left-[calc(83.33%+88px)] size-[14px] top-[1198px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group27() {
  return (
    <div className="absolute contents left-[calc(75%+52px)] top-[1198px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(75%+52px)] text-[#101010] text-[0px] text-[14px] top-[1198px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(75%+52px)] text-[#4d5163] text-[12px] top-[1229px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(75%+84px)] top-[1218px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit13 />
    </div>
  );
}

function Group124() {
  return (
    <div className="absolute contents left-[calc(75%+52px)] top-[1198px]">
      <Group27 />
    </div>
  );
}

function Edit14() {
  return (
    <div className="absolute left-[calc(83.33%+88px)] size-[14px] top-[1634px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group28() {
  return (
    <div className="absolute contents left-[calc(75%+52px)] top-[1634px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(75%+52px)] text-[#101010] text-[0px] text-[14px] top-[1634px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(75%+52px)] text-[#4d5163] text-[12px] top-[1665px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(75%+84px)] top-[1654px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit14 />
    </div>
  );
}

function Group134() {
  return (
    <div className="absolute contents left-[calc(75%+52px)] top-[1634px]">
      <Group28 />
    </div>
  );
}

function Edit15() {
  return (
    <div className="absolute left-[calc(83.33%+88px)] size-[14px] top-[1301px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group29() {
  return (
    <div className="absolute contents left-[calc(75%+52px)] top-[1301px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(75%+52px)] text-[#101010] text-[0px] text-[14px] top-[1301px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(75%+52px)] text-[#4d5163] text-[12px] top-[1332px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(75%+84px)] top-[1321px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit15 />
    </div>
  );
}

function Group127() {
  return (
    <div className="absolute contents left-[calc(75%+52px)] top-[1301px]">
      <Group29 />
    </div>
  );
}

function Edit16() {
  return (
    <div className="absolute left-[calc(83.33%+88px)] size-[14px] top-[1737px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group30() {
  return (
    <div className="absolute contents left-[calc(75%+52px)] top-[1737px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(75%+52px)] text-[#101010] text-[0px] text-[14px] top-[1737px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(75%+52px)] text-[#4d5163] text-[12px] top-[1768px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(75%+84px)] top-[1757px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit16 />
    </div>
  );
}

function Group135() {
  return (
    <div className="absolute contents left-[calc(75%+52px)] top-[1737px]">
      <Group30 />
    </div>
  );
}

function Edit17() {
  return (
    <div className="absolute left-[calc(16.67%+53px)] size-[14px] top-[1776px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group31() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1776px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(8.33%+17px)] text-[#101010] text-[0px] text-[14px] top-[1776px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(8.33%+17px)] text-[#4d5163] text-[12px] top-[1807px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(8.33%+49px)] top-[1796px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit17 />
    </div>
  );
}

function Group77() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1776px]">
      <Group31 />
    </div>
  );
}

function Edit18() {
  return (
    <div className="absolute left-[calc(16.67%+53px)] size-[14px] top-[1879px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group32() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1879px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(8.33%+17px)] text-[#101010] text-[0px] text-[14px] top-[1879px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(8.33%+17px)] text-[#4d5163] text-[12px] top-[1910px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(8.33%+49px)] top-[1899px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit18 />
    </div>
  );
}

function Group83() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1879px]">
      <Group32 />
    </div>
  );
}

function Edit19() {
  return (
    <div className="absolute left-[calc(33.33%+31px)] size-[14px] top-[1776px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group33() {
  return (
    <div className="absolute contents left-[calc(25%-5px)] top-[1776px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(25%-5px)] text-[#101010] text-[0px] text-[14px] top-[1776px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(25%-5px)] text-[#4d5163] text-[12px] top-[1807px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(25%+27px)] top-[1796px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit19 />
    </div>
  );
}

function Group82() {
  return (
    <div className="absolute contents left-[calc(25%-5px)] top-[1776px]">
      <Group33 />
    </div>
  );
}

function Edit20() {
  return (
    <div className="absolute left-[calc(33.33%+31px)] size-[14px] top-[1879px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group34() {
  return (
    <div className="absolute contents left-[calc(25%-5px)] top-[1879px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(25%-5px)] text-[#101010] text-[0px] text-[14px] top-[1879px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(25%-5px)] text-[#4d5163] text-[12px] top-[1910px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(25%+27px)] top-[1899px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit20 />
    </div>
  );
}

function Group84() {
  return (
    <div className="absolute contents left-[calc(25%-5px)] top-[1879px]">
      <Group34 />
    </div>
  );
}

function Group122() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1776px]">
      <Group77 />
      <Group83 />
      <Group82 />
      <Group84 />
    </div>
  );
}

function Group71() {
  return (
    <div className="absolute contents left-[calc(8.33%+81px)] top-[1715px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[calc(8.33%+81px)] text-[#101010] text-[20px] top-[1715px]">Centro Oeste</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[94.184px] left-[113.94px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[23.055px_27.232px] mask-size-[47.283px_47.283px] top-[1676.77px] w-[90.055px]" data-name="Frame" style={{ maskImage: `url('${imgFrame}')` }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 90.0554 94.184">
        <g clipPath="url(#clip0_2_1150)" id="Frame">
          <path d={svgPaths.p387ee600} fill="var(--fill-0, #005AFF)" id="Vector" />
          <g id="Group 151">
            <path d={svgPaths.p66a3100} id="path565" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p51eb800} id="path567" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p157b3400} id="path569" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p241c3800} id="path571" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p1ef53580} id="path573" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.pa030c00} id="path575" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p21523660} id="path577" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p175fbb80} id="path579" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p1c226200} id="path581" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3d08aca0} id="path583" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.pdbbbc00} id="path585" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p73ce100} id="path587" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p24dcd380} id="path589" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.pf3d5640} id="path591" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.pd7bd600} id="path593" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.pf03a4c0} id="path595" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p3ef26c08} id="path597" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p9c66a00} id="path599" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3577fb00} id="path611" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p27f60b40} id="path613" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p244d5600} id="path619" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p36f223e0} id="path621" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p1bfb5dc} id="path623" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p5871d00} id="path625" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p33b2e280} id="path627" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.pda81100} id="path629" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p2f2dff00} id="path631" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p650bc8} id="path633" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3ca77f00} id="path635" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p33e39080} id="path637" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p5b672c0} id="path639" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.pba46a00} id="path641" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p26b4ee70} id="path643" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p2449c400} id="path645" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_2_1150">
            <rect fill="white" height="94.184" width="90.0554" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[113.94px] top-[1676.77px]">
      <Frame />
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1704px]" data-name="Mask group">
      <Group />
    </div>
  );
}

function Group80() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1704px]">
      <MaskGroup />
      <div className="absolute left-[calc(8.33%+17px)] size-[48px] top-[1704px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
          <path d={svgPaths.p64ddc0} id="Ellipse 36" stroke="var(--stroke-0, #101010)" />
        </svg>
      </div>
    </div>
  );
}

function Group81() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1704px]">
      <Group71 />
      <Group80 />
    </div>
  );
}

function Group72() {
  return (
    <div className="absolute contents left-[calc(8.33%+81px)] top-[1427px]">
      <p className="-translate-x-1/2 absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[calc(8.33%+120.5px)] text-[#101010] text-[20px] text-center top-[1427px]">Sudeste</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute h-[131.719px] left-[69.45px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[67.549px_61.638px] mask-size-[47.283px_47.283px] top-[1354.36px] w-[125.945px]" data-name="Frame" style={{ maskImage: `url('${imgFrame}')` }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 125.945 131.719">
        <g clipPath="url(#clip0_2_1030)" id="Frame">
          <path d={svgPaths.p4955800} fill="var(--fill-0, #005AFF)" id="Vector" />
          <g id="Group 151">
            <path d={svgPaths.p31b88600} id="path565" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p25d64480} id="path567" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p8bbf000} id="path569" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p2b7c6b20} id="path571" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p27112f00} id="path573" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p25a6f500} id="path575" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p4664e00} id="path577" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.pfc0c640} id="path579" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p315ea880} id="path581" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p36dcbfe0} id="path583" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.pa104340} id="path585" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p38ff8cc0} id="path587" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p12ea0c00} id="path589" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3355980} id="path591" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p24847400} id="path593" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p151d6000} id="path595" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p11e8cb80} id="path597" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p16f1dee0} id="path599" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p35156780} id="path611" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p2b8fba80} id="path613" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p29802b00} id="path619" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p21a5b200} id="path621" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p2603a200} id="path623" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p29d7cf80} id="path625" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.pd4f73c0} id="path627" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.pb22e780} id="path629" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p287ca400} id="path631" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3caf0a80} id="path633" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p30077c80} id="path635" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p1c2ce580} id="path637" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p1c0d8b80} id="path639" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p2fa44000} id="path641" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.ped8900} id="path643" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p58a600} id="path645" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_2_1030">
            <rect fill="white" height="131.719" width="125.945" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[69.45px] top-[1354.36px]">
      <Frame1 />
    </div>
  );
}

function MaskGroup1() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1416px]" data-name="Mask group">
      <Group1 />
    </div>
  );
}

function Group86() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1416px]">
      <MaskGroup1 />
      <div className="absolute left-[calc(8.33%+17px)] size-[48px] top-[1416px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
          <path d={svgPaths.p64ddc0} id="Ellipse 36" stroke="var(--stroke-0, #101010)" />
        </svg>
      </div>
    </div>
  );
}

function Group136() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1416px]">
      <Group72 />
      <Group86 />
    </div>
  );
}

function Edit21() {
  return (
    <div className="absolute left-[calc(16.67%+53px)] size-[14px] top-[1488px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group35() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1488px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(8.33%+17px)] text-[#101010] text-[0px] text-[14px] top-[1488px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(8.33%+17px)] text-[#4d5163] text-[12px] top-[1519px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(8.33%+49px)] top-[1508px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit21 />
    </div>
  );
}

function Group78() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1488px]">
      <Group35 />
    </div>
  );
}

function Edit22() {
  return (
    <div className="absolute left-[calc(16.67%+53px)] size-[14px] top-[1591px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group36() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1591px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(8.33%+17px)] text-[#101010] text-[0px] text-[14px] top-[1591px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(8.33%+17px)] text-[#4d5163] text-[12px] top-[1622px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(8.33%+49px)] top-[1611px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit22 />
    </div>
  );
}

function Group87() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1591px]">
      <Group36 />
    </div>
  );
}

function Edit23() {
  return (
    <div className="absolute left-[calc(33.33%+31px)] size-[14px] top-[1488px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group37() {
  return (
    <div className="absolute contents left-[calc(25%-5px)] top-[1488px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(25%-5px)] text-[#101010] text-[0px] text-[14px] top-[1488px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(25%-5px)] text-[#4d5163] text-[12px] top-[1519px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(25%+27px)] top-[1508px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit23 />
    </div>
  );
}

function Group88() {
  return (
    <div className="absolute contents left-[calc(25%-5px)] top-[1488px]">
      <Group37 />
    </div>
  );
}

function Edit24() {
  return (
    <div className="absolute left-[calc(33.33%+31px)] size-[14px] top-[1591px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group38() {
  return (
    <div className="absolute contents left-[calc(25%-5px)] top-[1591px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(25%-5px)] text-[#101010] text-[0px] text-[14px] top-[1591px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(25%-5px)] text-[#4d5163] text-[12px] top-[1622px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(25%+27px)] top-[1611px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit24 />
    </div>
  );
}

function Group89() {
  return (
    <div className="absolute contents left-[calc(25%-5px)] top-[1591px]">
      <Group38 />
    </div>
  );
}

function Group137() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1488px]">
      <Group78 />
      <Group87 />
      <Group88 />
      <Group89 />
    </div>
  );
}

function Group85() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1416px]">
      <Group136 />
      <Group137 />
    </div>
  );
}

function Edit25() {
  return (
    <div className="absolute left-[calc(16.67%+53px)] size-[14px] top-[1200px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group39() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1200px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(8.33%+17px)] text-[#101010] text-[0px] text-[14px] top-[1200px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(8.33%+17px)] text-[#4d5163] text-[12px] top-[1231px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(8.33%+49px)] top-[1220px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit25 />
    </div>
  );
}

function Group79() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1200px]">
      <Group39 />
    </div>
  );
}

function Edit26() {
  return (
    <div className="absolute left-[calc(16.67%+53px)] size-[14px] top-[1303px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group40() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1303px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(8.33%+17px)] text-[#101010] text-[0px] text-[14px] top-[1303px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(8.33%+17px)] text-[#4d5163] text-[12px] top-[1334px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(8.33%+49px)] top-[1323px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit26 />
    </div>
  );
}

function Group93() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1303px]">
      <Group40 />
    </div>
  );
}

function Edit27() {
  return (
    <div className="absolute left-[calc(33.33%+31px)] size-[14px] top-[1200px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group41() {
  return (
    <div className="absolute contents left-[calc(25%-5px)] top-[1200px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(25%-5px)] text-[#101010] text-[0px] text-[14px] top-[1200px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(25%-5px)] text-[#4d5163] text-[12px] top-[1231px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(25%+27px)] top-[1220px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit27 />
    </div>
  );
}

function Group94() {
  return (
    <div className="absolute contents left-[calc(25%-5px)] top-[1200px]">
      <Group41 />
    </div>
  );
}

function Edit28() {
  return (
    <div className="absolute left-[calc(33.33%+31px)] size-[14px] top-[1303px]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_1186)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_1186">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group42() {
  return (
    <div className="absolute contents left-[calc(25%-5px)] top-[1303px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[0] left-[calc(25%-5px)] text-[#101010] text-[0px] text-[14px] top-[1303px] w-[139.225px] whitespace-pre-wrap">
        <span className="leading-[normal]">SP:</span>
        <span className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal]">{`   R$30,00`}</span>
      </p>
      <div className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(25%-5px)] text-[#4d5163] text-[12px] top-[1334px] w-[169.712px] whitespace-pre-wrap">
        <p className="mb-0">IPI R$3,00 (7%) ST R$1,00 (2%)</p>
        <p className="mb-0">Lucratividade: 2%</p>
        <p>Frete: 8%</p>
      </div>
      <div className="absolute h-0 left-[calc(25%+27px)] top-[1323px] w-[138px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 1">
            <line id="Line 92" stroke="var(--stroke-0, #A5A7A9)" x2="138" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Edit28 />
    </div>
  );
}

function Group95() {
  return (
    <div className="absolute contents left-[calc(25%-5px)] top-[1303px]">
      <Group42 />
    </div>
  );
}

function Group73() {
  return (
    <div className="absolute contents left-[calc(8.33%+81px)] top-[1139px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[calc(8.33%+81px)] text-[#101010] text-[20px] top-[1139px]">Sul</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute h-[152px] left-[82.3px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[54.695px_104px] mask-size-[47.283px_47.283px] top-[1024px] w-[145.337px]" data-name="Frame" style={{ maskImage: `url('${imgFrame}')` }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 145.337 152">
        <g clipPath="url(#clip0_2_1072)" id="Frame">
          <path d={svgPaths.p32de00} fill="var(--fill-0, #005AFF)" id="Vector" />
          <g id="Group 151">
            <path d={svgPaths.p19baf40} id="path565" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p17ead380} id="path567" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3cad0200} id="path569" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p1e85b580} id="path571" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p7ec3b60} id="path573" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p19f3d900} id="path575" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p24d3fd00} id="path577" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p35c6e540} id="path579" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p317f2b00} id="path581" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p218e4980} id="path583" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3e4f8180} id="path585" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p1a57a400} id="path587" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p15938900} id="path589" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p25292cc0} id="path591" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p7447700} id="path593" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p47c5b00} id="path595" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p21e01000} id="path597" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p1f930c40} id="path599" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3984e40} id="path611" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3f406200} id="path613" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3b6f280} id="path619" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p4f86ac0} id="path621" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p290b8c00} id="path623" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p21039a80} id="path625" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p35cf30c0} id="path627" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3c243100} id="path629" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p1bce2440} id="path631" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3754ae00} id="path633" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p11156b97} id="path635" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p1e83a300} id="path637" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p2cf0cc0} id="path639" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p3b7c19c0} id="path641" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p1be2e580} id="path643" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p7bb5580} id="path645" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_2_1072">
            <rect fill="white" height="152" width="145.337" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[82.3px] top-[1024px]">
      <Frame2 />
    </div>
  );
}

function MaskGroup2() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1128px]" data-name="Mask group">
      <Group2 />
    </div>
  );
}

function Group97() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1128px]">
      <MaskGroup2 />
      <div className="absolute left-[calc(8.33%+17px)] size-[48px] top-[1128px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
          <path d={svgPaths.p64ddc0} id="Ellipse 36" stroke="var(--stroke-0, #101010)" />
        </svg>
      </div>
    </div>
  );
}

function Group96() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1128px]">
      <Group73 />
      <Group97 />
    </div>
  );
}

function Group90() {
  return (
    <div className="absolute contents left-[calc(8.33%+17px)] top-[1128px]">
      <Group79 />
      <Group93 />
      <Group94 />
      <Group95 />
      <Group96 />
    </div>
  );
}

function Group74() {
  return (
    <div className="absolute contents left-[calc(50%+40px)] top-[1139px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[calc(50%+40px)] text-[#101010] text-[20px] top-[1139px]">Nordeste</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute h-[98px] left-[calc(41.67%+49px)] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[47px_12px] mask-size-[47.283px_47.283px] top-[1116px] w-[94px]" data-name="Frame" style={{ maskImage: `url('${imgFrame}')` }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 94 98">
        <g clipPath="url(#clip0_2_990)" id="Frame">
          <path d={svgPaths.p327f8500} fill="var(--fill-0, #005AFF)" id="Vector" />
          <g id="Group 151">
            <path d={svgPaths.p2a661780} id="path565" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p2eb09e60} id="path567" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p31949a00} id="path569" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p1acb5380} id="path571" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p885ce00} id="path573" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p1fb14a00} id="path575" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p10fe7660} id="path577" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p28170000} id="path579" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3e69c600} id="path581" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p19707700} id="path583" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3ce7b940} id="path585" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p38acfb00} id="path587" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p2d70c200} id="path589" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p10c37080} id="path591" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p2b0cd300} id="path593" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p6015480} id="path595" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p23eb30c0} id="path597" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p15098700} id="path599" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p9e42b80} id="path611" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p1514a00} id="path613" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p2a039ec0} id="path619" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p1af93d80} id="path621" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p2fd391e0} id="path623" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p20c00980} id="path625" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p3926cc00} id="path627" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p121b4e40} id="path629" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p3a46db80} id="path631" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p3b990bc0} id="path633" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p3bcdfb00} id="path635" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p38847600} id="path637" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p34b1f40} id="path639" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p2cd2f350} id="path641" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p31488500} id="path643" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.peb46c70} id="path645" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_2_990">
            <rect fill="white" height="98" width="94" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[calc(41.67%+49px)] top-[1116px]">
      <Frame3 />
    </div>
  );
}

function MaskGroup3() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1128px]" data-name="Mask group">
      <Group3 />
    </div>
  );
}

function Group101() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1128px]">
      <MaskGroup3 />
      <div className="absolute left-[calc(41.67%+96px)] size-[48px] top-[1128px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
          <path d={svgPaths.p64ddc0} id="Ellipse 36" stroke="var(--stroke-0, #101010)" />
        </svg>
      </div>
    </div>
  );
}

function Group100() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1128px]">
      <Group74 />
      <Group101 />
    </div>
  );
}

function Group99() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1128px]">
      <Group100 />
    </div>
  );
}

function Group98() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1128px]">
      <Group99 />
    </div>
  );
}

function Group75() {
  return (
    <div className="absolute contents left-[calc(50%+40px)] top-[1573px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[calc(50%+40px)] text-[#101010] text-[20px] top-[1573px]">Norte</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute h-[70px] left-[calc(41.67%+93px)] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[3px_-3px] mask-size-[47.283px_47.283px] top-[1565px] w-[66.932px]" data-name="Frame" style={{ maskImage: `url('${imgFrame}')` }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 66.9315 70">
        <g clipPath="url(#clip0_2_1110)" id="Frame">
          <path d={svgPaths.p35ae5a00} fill="var(--fill-0, #005AFF)" id="Vector" />
          <g id="Group 151">
            <path d={svgPaths.p3e9ae880} id="path565" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p3de1d180} id="path567" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p25cccc00} id="path569" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p90d7a00} id="path571" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p3b2b2e80} id="path573" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p848b980} id="path575" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p3810f000} id="path577" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p36000f00} id="path579" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p1f5eff80} id="path581" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p155bd900} id="path583" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p1d908200} id="path585" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p17f243e8} id="path587" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p305eab00} id="path589" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p28558d00} id="path591" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p38e69400} id="path593" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p1a08c200} id="path595" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.pfacba00} id="path597" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p39af9d00} id="path599" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.pf74b080} id="path611" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p28a1f900} id="path613" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p1db64380} id="path619" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p358a5f00} id="path621" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p25669900} id="path623" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p38fe1a0} id="path625" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p6307a00} id="path627" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.pfbd7500} id="path629" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p6b5b400} id="path631" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p4c60700} id="path633" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p10d13998} id="path635" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p2da82c00} id="path637" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.p326e17c0} id="path639" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
            <path d={svgPaths.pcd2c200} id="path641" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p6718100} id="path643" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="1.06" />
            <path d={svgPaths.p2c1a3780} id="path645" stroke="var(--stroke-0, #151D29)" strokeMiterlimit="10" strokeWidth="0.5" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_2_1110">
            <rect fill="white" height="70" width="66.9315" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[calc(41.67%+93px)] top-[1565px]">
      <Frame4 />
    </div>
  );
}

function MaskGroup4() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1562px]" data-name="Mask group">
      <Group4 />
    </div>
  );
}

function Group105() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1562px]">
      <MaskGroup4 />
      <div className="absolute left-[calc(41.67%+96px)] size-[48px] top-[1562px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
          <path d={svgPaths.p64ddc0} id="Ellipse 36" stroke="var(--stroke-0, #101010)" />
        </svg>
      </div>
    </div>
  );
}

function Group104() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1562px]">
      <Group75 />
      <Group105 />
    </div>
  );
}

function Group103() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1562px]">
      <Group104 />
    </div>
  );
}

function Group102() {
  return (
    <div className="absolute contents left-[calc(41.67%+96px)] top-[1562px]">
      <Group103 />
    </div>
  );
}

function Group119() {
  return (
    <div className="absolute contents left-[79px] top-[1021px]">
      <div className="absolute bg-white border border-[#e0e0e0] border-solid h-[969px] left-[73px] rounded-[8px] top-[1021px] w-[calc(50%+615px)]" />
      <Group76 />
      <Group129 />
      <Group125 />
      <Group130 />
      <Group128 />
      <Group131 />
      <Group123 />
      <Group132 />
      <Group126 />
      <Group133 />
      <Group124 />
      <Group134 />
      <Group127 />
      <Group135 />
      <Group122 />
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[103px] text-[#101010] text-[20px] top-[1046px] w-[159.55px] whitespace-pre-wrap">Valor por estado</p>
      <Group81 />
      <Group85 />
      <Group90 />
      <Group98 />
      <Group102 />
    </div>
  );
}

function Group56() {
  return (
    <div className="absolute contents left-[99.04px] top-[2036px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[99.04px] text-[#101010] text-[20px] top-[2036px]">Giro de estoque</p>
    </div>
  );
}

function Group43() {
  return (
    <div className="absolute contents font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[99px] text-[16px] top-[2086px]">
      <p className="absolute left-[99px] text-[#005aff] top-[2086px] w-[42.742px] whitespace-pre-wrap">Giro 7</p>
      <p className="-translate-x-full absolute left-[calc(16.67%+31.9px)] text-[#101010] text-right top-[2086px]">13</p>
      <p className="absolute left-[580px] text-[#101010] text-right top-[2086px] w-[110px]">5 clientes</p>
    </div>
  );
}

function Group44() {
  return (
    <div className="absolute contents font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[99.04px] text-[16px] top-[2123px]">
      <p className="absolute left-[99.04px] text-[#005aff] top-[2123px] w-[53.676px] whitespace-pre-wrap">Giro 30</p>
      <p className="-translate-x-full absolute left-[calc(16.67%+37.9px)] text-[#101010] text-right top-[2123px]">49</p>
      <p className="absolute left-[580px] text-[#101010] text-right top-[2123px] w-[110px]">5 clientes</p>
    </div>
  );
}

function Group45() {
  return (
    <div className="absolute contents font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[99.04px] text-[16px] top-[2160px]">
      <p className="absolute left-[99.04px] text-[#005aff] top-[2160px] w-[54.67px] whitespace-pre-wrap">Giro 60</p>
      <p className="-translate-x-full absolute left-[calc(16.67%+42.9px)] text-[#101010] text-right top-[2160px]">196</p>
      <p className="absolute left-[580px] text-[#101010] text-right top-[2160px] w-[110px]">5 clientes</p>
    </div>
  );
}

function Group46() {
  return (
    <div className="absolute contents font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[99.04px] text-[16px] top-[2197px]">
      <p className="absolute left-[99.04px] text-[#005aff] top-[2197px] w-[54.67px] whitespace-pre-wrap">Giro 90</p>
      <p className="-translate-x-full absolute left-[calc(16.67%+44.9px)] text-[#101010] text-right top-[2197px]">357</p>
      <p className="absolute left-[580px] text-[#101010] text-right top-[2197px] w-[110px]">5 clientes</p>
    </div>
  );
}

function Group47() {
  return (
    <div className="absolute contents font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[99.04px] text-[16px] top-[2234px]">
      <p className="absolute left-[99.04px] text-[#005aff] top-[2234px] w-[58.646px] whitespace-pre-wrap">Giro 180</p>
      <p className="-translate-x-full absolute left-[calc(16.67%+44.9px)] text-[#101010] text-right top-[2234px]">357</p>
      <p className="absolute left-[580px] text-[#101010] text-right top-[2234px] w-[110px]">5 clientes</p>
    </div>
  );
}

function Group48() {
  return (
    <div className="absolute contents font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[99.04px] text-[16px] top-[2271px]">
      <p className="absolute left-[99.04px] text-[#005aff] top-[2271px] w-[78.526px] whitespace-pre-wrap">Giro Médio</p>
      <p className="-translate-x-full absolute left-[calc(16.67%+45.9px)] text-[#101010] text-right top-[2271px]">1.63</p>
      <p className="absolute left-[580px] text-[#101010] text-right top-[2271px] w-[110px]">5 clientes</p>
    </div>
  );
}

function Group57() {
  return (
    <div className="absolute contents left-[99px] top-[2086px]">
      <Group43 />
      <Group44 />
      <Group45 />
      <Group46 />
      <Group47 />
      <Group48 />
      <div className="absolute h-0 left-[99px] top-[2115px] w-[609px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 609 1">
            <line id="Line 86" stroke="var(--stroke-0, #D7D8DA)" x2="609" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[99px] top-[2152px] w-[609px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 609 1">
            <line id="Line 86" stroke="var(--stroke-0, #D7D8DA)" x2="609" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[99px] top-[2189px] w-[609px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 609 1">
            <line id="Line 86" stroke="var(--stroke-0, #D7D8DA)" x2="609" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[99px] top-[2226px] w-[609px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 609 1">
            <line id="Line 86" stroke="var(--stroke-0, #D7D8DA)" x2="609" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[99px] top-[2263px] w-[609px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 609 1">
            <line id="Line 86" stroke="var(--stroke-0, #D7D8DA)" x2="609" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group69() {
  return (
    <div className="absolute contents left-[99px] top-[2036px]">
      <Group56 />
      <Group57 />
    </div>
  );
}

function Group58() {
  return (
    <div className="absolute contents left-[79px] top-[2015px]">
      <div className="absolute bg-white border border-[#e0e0e0] border-solid h-[302px] left-[79px] rounded-[8px] top-[2015px] w-[649px]" />
      <Group69 />
    </div>
  );
}

function Group49() {
  return (
    <div className="absolute contents font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%+60.57px)] text-[#101010] text-[16px] top-[2086px]">
      <p className="absolute left-[calc(50%+60.57px)] top-[2086px]">0548 - Oderço Distribuidora de Elet...</p>
      <p className="absolute left-[calc(75%+70px)] top-[2086px] w-[49.7px] whitespace-pre-wrap">549 pç</p>
      <p className="absolute left-[calc(50%+550px)] text-right top-[2086px] w-[83.496px] whitespace-pre-wrap">24/10/2022</p>
    </div>
  );
}

function Group50() {
  return (
    <div className="absolute contents font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%+60.57px)] text-[#101010] text-[16px] top-[2123px]">
      <p className="absolute left-[calc(50%+60.57px)] top-[2123px]">0548 - Oderço Distribuidora de Elet...</p>
      <p className="absolute left-[calc(75%+70px)] top-[2123px] w-[49.7px] whitespace-pre-wrap">549 pç</p>
      <p className="absolute left-[calc(50%+550px)] text-right top-[2123px] w-[83.496px] whitespace-pre-wrap">24/10/2022</p>
    </div>
  );
}

function Group51() {
  return (
    <div className="absolute contents font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%+60.57px)] text-[#101010] text-[16px] top-[2160px]">
      <p className="absolute left-[calc(50%+60.57px)] top-[2160px]">0548 - Oderço Distribuidora de Elet...</p>
      <p className="absolute left-[calc(75%+70px)] top-[2160px] w-[49.7px] whitespace-pre-wrap">549 pç</p>
      <p className="absolute left-[calc(50%+550px)] text-right top-[2160px] w-[83.496px] whitespace-pre-wrap">24/10/2022</p>
    </div>
  );
}

function Group52() {
  return (
    <div className="absolute contents font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%+60.57px)] text-[#101010] text-[16px] top-[2197px]">
      <p className="absolute left-[calc(50%+60.57px)] top-[2197px]">0548 - Oderço Distribuidora de Elet...</p>
      <p className="absolute left-[calc(75%+70px)] top-[2197px] w-[49.7px] whitespace-pre-wrap">549 pç</p>
      <p className="absolute left-[calc(50%+550px)] text-right top-[2197px] w-[83.496px] whitespace-pre-wrap">24/10/2022</p>
    </div>
  );
}

function Group53() {
  return (
    <div className="absolute contents font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%+60.57px)] text-[#101010] text-[16px] top-[2234px]">
      <p className="absolute left-[calc(50%+60.57px)] top-[2234px]">0548 - Oderço Distribuidora de Elet...</p>
      <p className="absolute left-[calc(75%+70px)] top-[2234px] w-[49.7px] whitespace-pre-wrap">549 pç</p>
      <p className="absolute left-[calc(50%+550px)] text-right top-[2234px] w-[83.496px] whitespace-pre-wrap">24/10/2022</p>
    </div>
  );
}

function Group54() {
  return (
    <div className="absolute contents font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%+60.57px)] text-[#101010] text-[16px] top-[2271px]">
      <p className="absolute left-[calc(50%+60.57px)] top-[2271px]">0548 - Oderço Distribuidora de Elet...</p>
      <p className="absolute left-[calc(75%+70px)] top-[2271px] w-[49.7px] whitespace-pre-wrap">549 pç</p>
      <p className="absolute left-[calc(50%+550px)] text-right top-[2271px] w-[83.496px] whitespace-pre-wrap">24/10/2022</p>
    </div>
  );
}

function Group60() {
  return (
    <div className="absolute contents left-[calc(50%+60.57px)] top-[2086px]">
      <Group49 />
      <Group50 />
      <Group51 />
      <Group52 />
      <Group53 />
      <Group54 />
      <div className="absolute h-0 left-[calc(50%+61px)] top-[2115px] w-[606px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 606 1">
            <line id="Line 86" stroke="var(--stroke-0, #D7D8DA)" x2="606" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[calc(50%+61px)] top-[2152px] w-[606px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 606 1">
            <line id="Line 86" stroke="var(--stroke-0, #D7D8DA)" x2="606" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[calc(50%+61px)] top-[2189px] w-[606px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 606 1">
            <line id="Line 86" stroke="var(--stroke-0, #D7D8DA)" x2="606" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[calc(50%+61px)] top-[2226px] w-[606px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 606 1">
            <line id="Line 86" stroke="var(--stroke-0, #D7D8DA)" x2="606" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[calc(50%+61px)] top-[2263px] w-[606px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 606 1">
            <line id="Line 86" stroke="var(--stroke-0, #D7D8DA)" x2="606" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group70() {
  return (
    <div className="absolute contents left-[calc(50%+60.57px)] top-[2036px]">
      <Group60 />
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[calc(50%+63.37px)] text-[#101010] text-[20px] top-[2036px]">Maiores clientes</p>
    </div>
  );
}

function Group59() {
  return (
    <div className="absolute contents left-[calc(50%+40px)] top-[2015px]">
      <div className="absolute bg-white border border-[#e0e0e0] border-solid h-[302px] left-[calc(50%+40px)] rounded-[8px] top-[2015px] w-[648px]" />
      <Group70 />
    </div>
  );
}

function Group138() {
  return (
    <div className="relative size-[116px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 116 116">
        <g id="Group 1457">
          <path d={svgPathsAging.p2eefe200} fill="var(--fill-0, #4CD964)" id="Ellipse 58" />
          <path d={svgPathsAging.p14b1000} fill="var(--fill-0, #FF3B30)" id="Ellipse 61" />
          <path d={svgPathsAging.p2975d100} fill="var(--fill-0, #FFCD00)" id="Ellipse 59" />
          <path d={svgPathsAging.p1a7fc8c0} fill="var(--fill-0, #669CFF)" id="Ellipse 60" />
        </g>
      </svg>
    </div>
  );
}

function Group139() {
  return (
    <div className="absolute contents left-[calc(83.33%+48px)] top-[191px]">
      <Group138 />
    </div>
  );
}

function Frame1Aging() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[12px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <circle cx="6" cy="6" fill="var(--fill-0, #4CD964)" id="Ellipse 62" r="6" />
        </svg>
      </div>
      <p className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#4cd964] text-[14px]">Nível 1</p>
    </div>
  );
}

function Frame3Aging() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame1Aging />
    </div>
  );
}

function Frame2Aging() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[12px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <circle cx="6" cy="6" fill="var(--fill-0, #FFCD00)" id="Ellipse 62" r="6" />
        </svg>
      </div>
      <p className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#ffcd00] text-[14px]">Nível 2</p>
    </div>
  );
}

function Frame7Aging() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame2Aging />
    </div>
  );
}

function Frame5Aging() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[12px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <circle cx="6" cy="6" fill="var(--fill-0, #669CFF)" id="Ellipse 62" r="6" />
        </svg>
      </div>
      <p className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#669cff] text-[14px]">Nível 3</p>
    </div>
  );
}

function Frame4Aging() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame5Aging />
    </div>
  );
}

function Frame9Aging() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[12px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <circle cx="6" cy="6" fill="var(--fill-0, #FF3B30)" id="Ellipse 62" r="6" />
        </svg>
      </div>
      <p className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#ff3b30] text-[14px]">Nível 4</p>
    </div>
  );
}

function Frame6Aging() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame9Aging />
    </div>
  );
}

function Frame8Aging() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame3Aging />
      <Frame7Aging />
      <Frame4Aging />
      <Frame6Aging />
    </div>
  );
}

function Frame10Aging() {
  return (
    <div className="content-stretch flex flex-col gap-[22px] items-start justify-center relative shrink-0 w-[220px]">
      <p className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#101010] text-[20px] w-full whitespace-pre-wrap">Aging</p>
      <Frame8Aging />
      <div className="font-['Red_Hat_Display:Regular',sans-serif] font-normal h-[93px] leading-[0] relative shrink-0 text-[#101010] text-[0px] w-full whitespace-pre-wrap">
        <p className="mb-0 text-[16px]">
          <span className="leading-[normal]">{`Estoque: `}</span>
          <span className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal]">{`465 `}</span>
          <span className="leading-[normal]">{`| Reserva: `}</span>
          <span className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal]">{`250 `}</span>
          <span className="leading-[normal]">{`Última entrada: 24/10/22 `}</span>
        </p>
        <p className="leading-[normal] mb-0 text-[#a5a7a9] text-[12px]">300 peças</p>
        <p className="mb-0 text-[16px]">
          <span className="leading-[normal]">{`Em compra: `}</span>
          <span className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal]">800</span>
        </p>
        <p className="leading-[normal] mb-0 text-[#a5a7a9] text-[12px]">PO #32542</p>
        <p className="leading-[normal] text-[16px]">&nbsp;</p>
      </div>
    </div>
  );
}

function FrameGraphAging() {
  return (
    <div className="content-stretch flex h-full items-start pt-[38px] relative shrink-0">
      <Group138 />
    </div>
  );
}

function AgingCard() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-center left-[calc(66.67%+52px)] top-[153px]">
      <Frame10Aging />
      <div className="flex flex-row items-center self-stretch">
        <FrameGraphAging />
      </div>
    </div>
  );
}

export default function Formacao() {
  return (
    <div className="bg-white relative size-full" data-name="formacao">
      <div className="absolute h-[710px] left-0 top-[-1px] w-[1440px]" data-name="image 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage3} />
      </div>
      <div className="absolute bg-white h-[1178px] left-[67px] top-[118px] w-[1357px]" />
      <Group55 />
      <div className="absolute h-[739px] left-0 top-[37px] w-[43px]" data-name="image 4">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage4} />
      </div>
      <div className="absolute bg-[#f8f8f8] border-[#e7e7e7] border-r border-solid h-[1585px] left-0 top-[763px] w-[40px]" />
      <div className="absolute bg-white h-[37px] left-[calc(91.67%+11px)] top-[68px] w-[82px]" />
      <div className="absolute bg-white border border-[#e0e0e0] border-solid h-[350px] left-[calc(66.67%+27px)] rounded-[8px] top-[131px] w-[422px]" />
      
      {/* Aging Card */}
      <AgingCard />

      {/* Shift all content below by +47px to maintain 32px gap after taller Row 1 cards */}
      <div className="absolute inset-0" style={{ transform: 'translateY(47px)' }}>
        {/* Promoção panel - standalone frame Group879 */}
        <div className="absolute left-[calc(50%+40px)] top-[466px] h-[523px] w-[648px]">
          <Promocao />
        </div>
        {/* Formação de preço panel - standalone frame Group878 */}
        <div className="absolute left-[79px] top-[466px] h-[523px] w-[649px]">
          <FormacaoDePreco />
        </div>
        <Group119 />
        <Group58 />
        <Group59 />
      </div>
    </div>
  );
}