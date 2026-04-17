import svgPaths from "./svg-j7gdk8mt3n";
import imgImage from "figma:asset/747ef2a455984e3a269f98d50461721f29b721d9.png";

function Background() {
  return (
    <div className="relative shrink-0 size-[34px]" data-name="Background">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
        <g id="Background">
          <rect fill="var(--fill-0, #EFF6FF)" height="34" rx="8" width="34" />
          <path d={svgPaths.p146b0b00} fill="var(--fill-0, #3B82F6)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[20px] w-[165.11px]">
        <p className="leading-[28px] whitespace-pre-wrap">Parâmetros Base</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] w-[154px]">
        <p className="leading-[20px] whitespace-pre-wrap">Gestão de Precificação</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Heading />
      <Container3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Background />
      <Container2 />
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center mr-[-0.01px] px-[16px] py-[6px] relative shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-center w-[71.55px]">
        <p className="leading-[20px] whitespace-pre-wrap">Lucro Alvo</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#3b82f6] content-stretch flex flex-col items-center justify-center mr-[-0.01px] px-[16px] py-[6px] relative rounded-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white w-[105.66px]">
        <p className="leading-[20px] whitespace-pre-wrap">Preço de Venda</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center pl-[4px] pr-[4.01px] py-[4px] relative rounded-[8px] shrink-0" data-name="Background">
      <Button />
      <Button1 />
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative w-full">
        <Container1 />
        <Background1 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[0.6px] uppercase w-[30.45px]">
        <p className="leading-[16px] whitespace-pre-wrap">CMV</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.5px] items-start relative">
        <Container5 />
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[18px] w-[80.63px]">
          <p className="leading-[28px] whitespace-pre-wrap">R$ 42,50</p>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 size-[11.648px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6484 11.6484">
        <g id="Container">
          <path d={svgPaths.p24d16980} fill="var(--fill-0, #6B7280)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[0.6px] uppercase w-[74.89px]">
        <p className="leading-[16px] whitespace-pre-wrap">Custo Net</p>
      </div>
      <Container8 />
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.5px] items-start relative">
        <Container7 />
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[18px] w-[76.69px]">
          <p className="leading-[28px] whitespace-pre-wrap">R$ 37,23</p>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[0.6px] uppercase w-[43.47px]">
        <p className="leading-[16px] whitespace-pre-wrap">Verba</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.pebb1680} fill="var(--fill-0, #6B7280)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#10b981] text-[18px] w-[53.61px]">
        <p className="leading-[28px] whitespace-pre-wrap">1.57%</p>
      </div>
      <Container12 />
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.5px] items-start relative">
        <Container10 />
        <Container11 />
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center pr-[25px] relative w-full">
          <Container4 />
          <Container6 />
          <Container9 />
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p26402100} fill="var(--fill-0, #6B7280)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#ffedd5] content-stretch flex items-center px-[8px] py-[2px] relative rounded-[8px] shrink-0" data-name="Background">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#9a3412] text-[12px] w-[90.36px]">
        <p className="leading-[16px] whitespace-pre-wrap">Simulação ativa</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] w-[131.09px]">
        <p className="leading-[20px] whitespace-pre-wrap">Simulador de Custo</p>
      </div>
      <Background2 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[4.32px] relative shrink-0 w-[7px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 4.32031">
        <g id="Container">
          <path d={svgPaths.p26e3180} fill="var(--fill-0, #3B82F6)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex gap-[3.99px] items-center relative shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#3b82f6] text-[14px] text-center w-[47.63px]">
        <p className="leading-[20px] whitespace-pre-wrap">Ajustar</p>
      </div>
      <Container17 />
    </div>
  );
}

function Container13() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[4px] relative w-full">
        <Container14 />
        <Button2 />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#f9fafb] relative rounded-[8px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start justify-center p-[17px] relative w-full">
          <VerticalBorder />
          <Container13 />
        </div>
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[24px] items-start left-px pb-[25px] pt-[24px] px-[24px] right-px top-px" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Container />
      <BackgroundBorder />
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px] whitespace-pre-wrap">Definições de Preço</p>
        </div>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Label">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#3b82f6] text-[14px] w-[137.83px]">
        <p className="leading-[20px] whitespace-pre-wrap">Preço de Venda (R$)</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p3deb0c00} fill="var(--fill-0, #3B82F6)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative w-full">
        <Label />
        <Container20 />
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[27.14px] overflow-clip right-0 top-0" data-name="Input">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[36px] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[30px] w-[87.16px]">
        <p className="leading-[36px] whitespace-pre-wrap">63,80</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[37px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[28px] justify-center leading-[0] left-0 not-italic text-[#6b7280] text-[18px] top-[23px] w-[23.14px]">
          <p className="leading-[28px] whitespace-pre-wrap">R$</p>
        </div>
        <Input />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pt-[3.5px] relative w-full">
        <div className="bg-[#22c55e] rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-[132.52px]">
          <p className="leading-[16px] whitespace-pre-wrap">Sugerido pelo mercado</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border-2 border-[#3b82f6] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start p-[18px] relative w-full">
        <Container19 />
        <Container21 />
        <Container22 />
        <div className="absolute bg-[#3b82f6] bottom-[1.5px] left-0 rounded-bl-[8px] rounded-tl-[8px] top-[2px] w-[6px]" data-name="Background" />
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Label">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] w-[79.23px]">
        <p className="leading-[20px] whitespace-pre-wrap">Markup (%)</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[12px] relative shrink-0 w-[19.969px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9688 12">
        <g id="Container">
          <path d={svgPaths.p1c022580} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative w-full">
        <Label1 />
        <Container24 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[36px] justify-center leading-[0] not-italic relative shrink-0 text-[#2563eb] text-[30px] w-[97.83px]">
        <p className="leading-[36px] whitespace-pre-wrap">39.0%</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[4.938px] relative shrink-0 w-[8px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 4.9375">
        <g id="Container">
          <path d={svgPaths.p3460fd80} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <Container28 />
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[4.938px] relative shrink-0 w-[8px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 4.9375">
        <g id="Container">
          <path d={svgPaths.p34eea200} fill="var(--fill-0, #9CA3AF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <Container29 />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="Container">
      <Button3 />
      <Button4 />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative w-full">
        <Container26 />
        <Container27 />
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start p-[17px] relative w-full">
        <Container23 />
        <Container25 />
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Label">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#10b981] text-[14px] w-[65.98px]">
        <p className="leading-[20px] whitespace-pre-wrap">Lucro (%)</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[21px] relative shrink-0 w-[22.031px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.0312 21">
        <g id="Container">
          <path d={svgPaths.p21513380} fill="var(--fill-0, #10B981)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative w-full">
        <Label2 />
        <Container31 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[36px] justify-center leading-[0] not-italic relative shrink-0 text-[#10b981] text-[30px] w-[92.45px]">
        <p className="leading-[36px] whitespace-pre-wrap">27.0%</p>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#dcfce7] content-stretch flex items-center px-[8px] py-[4px] relative rounded-[8px] shrink-0" data-name="Background">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#166534] text-[12px] w-[55.95px]">
        <p className="leading-[16px] whitespace-pre-wrap">Excelente</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative w-full">
        <Container33 />
        <Background3 />
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-[rgba(16,185,129,0.05)] relative rounded-[8px] shrink-0 w-full" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(16,185,129,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start p-[17px] relative w-full">
        <Container30 />
        <Container32 />
      </div>
    </div>
  );
}

function VerticalBorder1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start pl-[24px] pr-[25px] py-[24px] relative self-stretch shrink-0 w-[425.83px]" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
      <Heading1 />
      <BackgroundBorderShadow1 />
      <BackgroundBorder1 />
      <OverlayBorder />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 3">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[0.6px] uppercase w-[159.48px]">
        <p className="leading-[16px] whitespace-pre-wrap">Composição do Preço</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-[27.89px]">
        <p className="leading-[16px] whitespace-pre-wrap">CMV</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col h-[12px] items-start pl-[8px] relative shrink-0 w-[20px]" data-name="Margin">
      <div className="bg-[#3b82f6] rounded-[9999px] shrink-0 size-[12px]" data-name="Background" />
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-[43.31px]">
        <p className="leading-[16px] whitespace-pre-wrap">Markup</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col h-[12px] items-start pl-[8px] relative shrink-0 w-[20px]" data-name="Margin">
      <div className="bg-[#fb923c] rounded-[9999px] shrink-0 size-[12px]" data-name="Background" />
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-[14.11px]">
        <p className="leading-[16px] whitespace-pre-wrap">IPI</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col h-[12px] items-start pl-[8px] relative shrink-0 w-[20px]" data-name="Margin">
      <div className="bg-[#c084fc] rounded-[9999px] shrink-0 size-[12px]" data-name="Background" />
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-[15.39px]">
        <p className="leading-[16px] whitespace-pre-wrap">ST</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <div className="bg-[#64748b] rounded-[9999px] shrink-0 size-[12px]" data-name="Background" />
      <Container36 />
      <Margin1 />
      <Container37 />
      <Margin2 />
      <Container38 />
      <Margin3 />
      <Container39 />
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pr-[0.01px] relative w-full">
          <Heading2 />
          <Container35 />
        </div>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container34 />
    </div>
  );
}

function Image() {
  return (
    <div className="relative shrink-0 size-[192px]" data-name="image">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgImage} />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] uppercase w-[38px]">
        <p className="leading-[16px] whitespace-pre-wrap">Total</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[20px] w-[89.06px]">
        <p className="leading-[28px] whitespace-pre-wrap">R$ 63,80</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute content-stretch flex flex-col inset-0 items-center justify-center" data-name="Container">
      <Container43 />
      <Container44 />
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 size-[192px]" data-name="Container">
      <Image />
      <Container42 />
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-[28.27px]">
        <p className="leading-[16px] whitespace-pre-wrap">CMV</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] w-[62.7px]">
        <p className="leading-[20px] whitespace-pre-wrap">R$ 42,50</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container49 />
      <Container50 />
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#64748b] h-[32px] rounded-[2px] shrink-0 w-[8px]" data-name="Background" />
      <Container48 />
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[12px] w-[37.53px]">
        <p className="leading-[16px] whitespace-pre-wrap">66.6%</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[8px] pr-[8.01px] py-[8px] relative w-full">
          <Container47 />
          <Container51 />
        </div>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-[43.95px]">
        <p className="leading-[16px] whitespace-pre-wrap">Markup</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] w-[57.83px]">
        <p className="leading-[20px] whitespace-pre-wrap">R$ 16,57</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container55 />
      <Container56 />
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#3b82f6] h-[32px] rounded-[2px] shrink-0 w-[8px]" data-name="Background" />
      <Container54 />
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#3b82f6] text-[12px] w-[37.34px]">
        <p className="leading-[16px] whitespace-pre-wrap">25.9%</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[8px] pr-[8.01px] py-[8px] relative w-full">
          <Container53 />
          <Container57 />
        </div>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-[14.25px]">
        <p className="leading-[16px] whitespace-pre-wrap">IPI</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] w-[52.8px]">
        <p className="leading-[20px] whitespace-pre-wrap">R$ 2,95</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container62 />
      <Container63 />
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#fb923c] h-[32px] rounded-[2px] shrink-0 w-[8px]" data-name="Background" />
      <Container61 />
    </div>
  );
}

function Container59() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] self-stretch" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[8px] relative size-full">
          <Container60 />
        </div>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-[15.53px]">
        <p className="leading-[16px] whitespace-pre-wrap">ST</p>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] w-[48.59px]">
        <p className="leading-[20px] whitespace-pre-wrap">R$ 1,77</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container67 />
      <Container68 />
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#c084fc] h-[32px] rounded-[2px] shrink-0 w-[8px]" data-name="Background" />
      <Container66 />
    </div>
  );
}

function Container64() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] self-stretch" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[8px] relative size-full">
          <Container65 />
        </div>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex gap-[8px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container59 />
      <Container64 />
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-h-px min-w-px relative" data-name="Container">
      <Container46 />
      <Container52 />
      <Container58 />
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[32px] items-center justify-center min-h-px min-w-px relative w-full" data-name="Container">
      <Container41 />
      <Container45 />
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(249,250,251,0.5)] content-stretch flex flex-col items-start justify-center p-[24px] relative self-stretch shrink-0 w-[596.16px]" data-name="Overlay">
      <Margin />
      <Container40 />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex items-start left-px right-px top-[204px]" data-name="Container">
      <VerticalBorder1 />
      <Overlay />
    </div>
  );
}

function Container70() {
  return (
    <div className="relative shrink-0 size-[11.648px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6484 11.6484">
        <g id="Container">
          <path d={svgPaths.p24d16980} fill="var(--fill-0, #6B7280)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container69() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center justify-center relative w-full">
        <Container70 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center w-[438.42px]">
          <p className="leading-[16px] whitespace-pre-wrap">Altere o Preço de Venda — Markup e Lucro são calculados automaticamente.</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder1() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex flex-col items-start left-px pb-[12px] pt-[13px] px-[12px] right-px top-[755px]" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
      <Container69 />
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[12px] tracking-[0.6px] uppercase w-[161.72px]">
        <p className="leading-[16px] whitespace-pre-wrap">Margem Contribuição</p>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-white w-[73.95px]">
        <p className="leading-[32px] whitespace-pre-wrap">27.0%</p>
      </div>
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[14px] w-[55.02px]">
        <p className="leading-[20px] whitespace-pre-wrap">R$ 17,23</p>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="content-stretch flex gap-[8px] items-end relative shrink-0 w-full" data-name="Container">
      <Container74 />
      <Margin4 />
    </div>
  );
}

function Container71() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative">
        <Container72 />
        <Container73 />
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="h-[12px] relative shrink-0 w-[19.969px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9688 12">
        <g id="Container">
          <path d={svgPaths.p1c022580} fill="var(--fill-0, #4ADE80)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(34,197,94,0.2)] relative rounded-[9999px] shrink-0 size-[40px]" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container75 />
      </div>
    </div>
  );
}

function VerticalBorder2() {
  return (
    <div className="content-stretch flex items-center justify-between pr-[25px] relative self-stretch shrink-0 w-[308.66px]" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#374151] border-r border-solid inset-0 pointer-events-none" />
      <Container71 />
      <Overlay1 />
    </div>
  );
}

function Container77() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[12px] tracking-[0.6px] uppercase w-[114.84px]">
        <p className="leading-[16px] whitespace-pre-wrap">Margem Líquida</p>
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#10b981] text-[24px] w-[68.64px]">
        <p className="leading-[32px] whitespace-pre-wrap">17.8%</p>
      </div>
    </div>
  );
}

function Margin5() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[14px] w-[95.03px]">
        <p className="leading-[20px] whitespace-pre-wrap">Após IR+CSLL</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex gap-[8px] items-end relative shrink-0 w-full" data-name="Container">
      <Container79 />
      <Margin5 />
    </div>
  );
}

function Container76() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative">
        <Container77 />
        <Container78 />
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="h-[18px] relative shrink-0 w-[18.984px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.9844 18">
        <g id="Container">
          <path d={svgPaths.p37439c0} fill="var(--fill-0, #4ADE80)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay2() {
  return (
    <div className="bg-[rgba(34,197,94,0.2)] relative rounded-[9999px] shrink-0 size-[40px]" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container80 />
      </div>
    </div>
  );
}

function VerticalBorder3() {
  return (
    <div className="content-stretch flex items-center justify-between pl-[24px] pr-[25px] relative self-stretch shrink-0 w-[308.67px]" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#374151] border-r border-solid inset-0 pointer-events-none" />
      <Container76 />
      <Overlay2 />
    </div>
  );
}

function Container83() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[12px] text-right tracking-[0.6px] uppercase w-[169.36px]">
        <p className="leading-[16px] whitespace-pre-wrap">Preço Final Calculado</p>
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end mr-[-0.01px] relative shrink-0" data-name="Container">
      <Container83 />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[36px] justify-center leading-[0] not-italic relative shrink-0 text-[30px] text-right text-white tracking-[-0.75px] w-[127.59px]">
        <p className="leading-[36px] whitespace-pre-wrap">R$ 63,80</p>
      </div>
    </div>
  );
}

function Background5() {
  return (
    <div className="h-[29.406px] relative shrink-0 w-[33.578px]" data-name="Background">
      <div className="absolute inset-[-6.8%_-36.99%_-73.43%_-35.74%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58 53">
          <g id="Background">
            <rect fill="var(--fill-0, #3B82F6)" height="29.4062" rx="8" width="33.5781" x="12" y="2" />
            <g filter="url(#filter0_dd_4016_431)" id="Overlay+Shadow">
              <rect fill="var(--fill-0, white)" fillOpacity="0.01" height="29" rx="8" shapeRendering="crispEdges" width="34" x="12" y="2" />
            </g>
            <path d={svgPaths.p619f2e0} fill="var(--fill-0, white)" id="Icon" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="53" id="filter0_dd_4016_431" width="58" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feMorphology in="SourceAlpha" operator="erode" radius="4" result="effect1_dropShadow_4016_431" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="3" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.117647 0 0 0 0 0.227451 0 0 0 0 0.541176 0 0 0 0.5 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4016_431" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feMorphology in="SourceAlpha" operator="erode" radius="3" result="effect2_dropShadow_4016_431" />
              <feOffset dy="10" />
              <feGaussianBlur stdDeviation="7.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.117647 0 0 0 0 0.227451 0 0 0 0 0.541176 0 0 0 0.5 0" />
              <feBlend in2="effect1_dropShadow_4016_431" mode="normal" result="effect2_dropShadow_4016_431" />
              <feBlend in="SourceGraphic" in2="effect2_dropShadow_4016_431" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[16px] relative shrink-0" data-name="Margin">
      <Background5 />
    </div>
  );
}

function Container81() {
  return (
    <div className="content-stretch flex items-center justify-end pl-[24px] pr-[0.01px] relative self-stretch shrink-0 w-[308.66px]" data-name="Container">
      <Container82 />
      <Margin6 />
    </div>
  );
}

function Background4() {
  return (
    <div className="absolute bg-[#111827] content-stretch flex gap-[24px] items-start justify-center left-px overflow-clip p-[24px] right-px top-[651px]" data-name="Background">
      <VerticalBorder2 />
      <VerticalBorder3 />
      <div className="absolute bg-[rgba(34,197,94,0.1)] blur-[32px] right-0 rounded-[9999px] size-[128px] top-0" data-name="Overlay+Blur" />
      <Container81 />
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white h-[797px] max-w-[1024px] relative rounded-[12px] shrink-0 w-[1024px]" data-name="Background+Border+Shadow">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <BackgroundHorizontalBorder />
        <Container18 />
        <BackgroundHorizontalBorder1 />
        <Background4 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

export default function Body() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center px-[16px] py-[113.5px] relative size-full" data-name="Body">
      <BackgroundBorderShadow />
    </div>
  );
}