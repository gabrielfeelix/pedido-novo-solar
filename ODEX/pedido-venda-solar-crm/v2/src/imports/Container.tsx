import svgPaths from "./svg-pjhztk9mis";

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p162a1600} id="Vector" stroke="var(--stroke-0, #0090FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M4.66667 3.5H9.33333" id="Vector_2" stroke="var(--stroke-0, #0090FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 8.16667V10.5" id="Vector_3" stroke="var(--stroke-0, #0090FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 5.83333H9.33917" id="Vector_4" stroke="var(--stroke-0, #0090FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 5.83333H7.00583" id="Vector_5" stroke="var(--stroke-0, #0090FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M4.66667 5.83333H4.6725" id="Vector_6" stroke="var(--stroke-0, #0090FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 8.16667H7.00583" id="Vector_7" stroke="var(--stroke-0, #0090FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M4.66667 8.16667H4.6725" id="Vector_8" stroke="var(--stroke-0, #0090FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 10.5H7.00583" id="Vector_9" stroke="var(--stroke-0, #0090FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M4.66667 10.5H4.6725" id="Vector_10" stroke="var(--stroke-0, #0090FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[121px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#171717] text-[14px] top-0">Parâmetros Base</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[121px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[#737373] text-[11px] top-0">Gestão de Precificação</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] h-[37.5px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text />
        <Text1 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[12px] h-[37.5px] items-center relative shrink-0 w-[161px]" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Tab() {
  return (
    <div className="flex-[1_0_0] h-[29px] min-h-px min-w-px relative rounded-[8px]" data-name="Tab">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <div className="bg-[rgba(0,0,0,0.05)] min-h-[36px] relative rounded-bl-[8px] rounded-tl-[8px] shrink-0" data-name="Toggle Button">
          <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-bl-[8px] rounded-tl-[8px]" />
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center min-h-[inherit] px-[8px] py-[7.5px] relative">
            <p className="font-['Geist:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#0a0a0a] text-[14px]">Lucro Alvo</p>
          </div>
        </div>
        <div className="min-h-[36px] relative rounded-br-[8px] rounded-tr-[8px] shrink-0" data-name="Toggle Button">
          <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-br-[8px] rounded-tr-[8px]" />
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center min-h-[inherit] px-[8px] py-[7.5px] relative">
            <p className="font-['Geist:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#0a0a0a] text-[14px]">Preço de Venda</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[35px] items-center px-[3px] relative rounded-[10px] shrink-0 w-[217.203px]" data-name="Container">
      <Tab />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Container1 />
      <Container4 />
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[15px] relative shrink-0 w-[216.672px]" data-name="Text">
      <p className="absolute font-['Geist:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#404040] text-[14px] top-0 w-[534px] whitespace-pre-wrap">Definição de Preço</p>
    </div>
  );
}

function Label() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-0 not-italic text-[#059669] text-[10px] top-0 tracking-[0.5px] uppercase">Lucro Alvo (%)</p>
    </div>
  );
}

function NumberInput() {
  return (
    <div className="absolute bg-white h-[48px] left-0 rounded-[8px] top-0 w-[174.156px]" data-name="Number Input">
      <div className="content-stretch flex items-center overflow-clip pl-[12px] pr-[32px] py-[10px] relative rounded-[inherit] size-full">
        <p className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#0d1d52] text-[16px]">26.5</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#059669] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[11px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="Icon">
          <path d={svgPaths.p2b54b100} fill="var(--fill-0, #E9F8FF)" />
          <path d={svgPaths.p15f34800} id="Vector" stroke="var(--stroke-0, #0090FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.14583" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="h-[16px] relative rounded-[3px] shrink-0 w-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[11px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="Icon">
          <path d={svgPaths.p2b54b100} fill="var(--fill-0, #F5F5F5)" />
          <path d={svgPaths.p26a1c040} id="Vector" stroke="var(--stroke-0, #868EA8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.14583" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[3px] w-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-px h-[33px] items-start left-[148.16px] top-[7.5px] w-[20px]" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Ec() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Ec">
      <NumberInput />
      <Container8 />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[69px] items-start left-0 top-0 w-[174.156px]" data-name="Container">
      <Label />
      <Ec />
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-0 not-italic text-[#404040] text-[10px] top-0 tracking-[0.5px] uppercase">Desp. Oper. (%)</p>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[22.844px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#737373] text-[16px] top-[-1px]">8.5</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[12px] relative shrink-0 w-[40.609px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[12px] left-0 not-italic text-[#737373] text-[8px] top-0 tracking-[0.3px] uppercase">Fixo/ano</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[#f5f5f5] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#a3a3a3] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <Text3 />
          <Text4 />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[69px] items-start left-[186.16px] top-0 w-[174.172px]" data-name="Container">
      <Label1 />
      <Container10 />
    </div>
  );
}

function Label2() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-0 not-italic text-[#404040] text-[10px] top-0 tracking-[0.5px] uppercase">Markup (%)</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p1977ee80} id="Vector" stroke="var(--stroke-0, #669CFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3471a100} id="Vector_2" stroke="var(--stroke-0, #669CFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[24px] relative shrink-0 w-[45.75px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#669cff] text-[16px] top-[-1px]">35.0%</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[#f5f5f5] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#a3a3a3] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <Icon3 />
          <Text5 />
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[69px] items-start left-[372.33px] top-0 w-[174.172px]" data-name="Container">
      <Label2 />
      <Container12 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[69px] relative shrink-0 w-[546.5px]" data-name="Container">
      <Container7 />
      <Container9 />
      <Container11 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Text2 />
      <Container6 />
    </div>
  );
}

function Al() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative" data-name="AL">
      <p className="flex-[1_0_0] font-['Geist:Medium',sans-serif] font-medium leading-[20px] min-h-px min-w-px relative text-[#404040] text-[14px] whitespace-pre-wrap">Composição do Preço</p>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon">
        <div className="absolute inset-[34.37%_21.88%_34.38%_21.88%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.99992 5.00004">
            <path d={svgPaths.pc6cf80} fill="var(--fill-0, #525252)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return <div className="absolute bg-[#94a3b8] h-[14px] left-[0.24px] top-0 w-[375px]" data-name="Container" />;
}

function Container16() {
  return <div className="absolute bg-[#669cff] h-[15px] left-[375px] top-[-0.5px] w-[144px]" data-name="Container" />;
}

function Container17() {
  return <div className="absolute bg-[#fb923c] h-[15px] left-[519px] top-[-0.5px] w-[32px]" data-name="Container" />;
}

function Container18() {
  return <div className="absolute bg-[#a78bfa] h-[14px] left-[551px] top-0 w-[15px]" data-name="Container" />;
}

function Container14() {
  return (
    <div className="h-[14px] relative rounded-[33554400px] shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Container15 />
        <Container16 />
        <Container17 />
        <Container18 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col h-[14px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container14 />
    </div>
  );
}

function Container22() {
  return <div className="bg-[#737373] h-[24px] rounded-[2px] shrink-0 w-[6px]" data-name="Container" />;
}

function Text6() {
  return (
    <div className="h-[15px] relative shrink-0 w-[53.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#737373] text-[10px] top-0">CMV</p>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[53.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[#171717] text-[12px] top-0">R$ 42,50</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text6 />
        <Text7 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[33px] relative shrink-0 w-[67.766px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container22 />
        <Container23 />
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[15px] relative shrink-0 w-[31.281px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#737373] text-[10px] top-0">66.6%</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[33px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[14px] h-full items-center px-[6px] relative">
        <Container21 />
        <Text8 />
      </div>
    </div>
  );
}

function Container26() {
  return <div className="bg-[#0090ff] h-[24px] rounded-[2px] shrink-0 w-[6px]" data-name="Container" />;
}

function Text9() {
  return (
    <div className="h-[15px] relative shrink-0 w-[50.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#737373] text-[10px] top-0">Markup</p>
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[50.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[#171717] text-[12px] top-0">R$ 16,58</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text9 />
        <Text10 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[33px] relative shrink-0 w-[64.406px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container26 />
        <Container27 />
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[15px] relative shrink-0 w-[22.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#94a3b8] text-[10px] top-0">26%</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[33px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[14px] h-full items-center px-[6px] relative">
        <Container25 />
        <Text11 />
      </div>
    </div>
  );
}

function Container30() {
  return <div className="bg-[#e9f8ff] h-[24px] rounded-[2px] shrink-0 w-[6px]" data-name="Container" />;
}

function Text12() {
  return (
    <div className="h-[15px] relative shrink-0 w-[45.281px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#737373] text-[10px] top-0">IPI</p>
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[45.281px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[#171717] text-[12px] top-0">R$ 2,95</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text12 />
        <Text13 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[33px] relative shrink-0 w-[59.281px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container30 />
        <Container31 />
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[15px] relative shrink-0 w-[25.234px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#94a3b8] text-[10px] top-0">4.6%</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[33px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[14px] h-full items-center px-[6px] relative">
        <Container29 />
        <Text14 />
      </div>
    </div>
  );
}

function Container34() {
  return <div className="bg-[#001233] h-[24px] rounded-[2px] shrink-0 w-[6px]" data-name="Container" />;
}

function Text15() {
  return (
    <div className="h-[15px] relative shrink-0 w-[41.672px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#737373] text-[10px] top-0">ST</p>
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[41.672px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[#171717] text-[12px] top-0">R$ 1,77</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text15 />
        <Text16 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[33px] relative shrink-0 w-[55.672px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container34 />
        <Container35 />
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[15px] relative shrink-0 w-[25.188px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#94a3b8] text-[10px] top-0">2.8%</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[14px] items-center px-[6px] relative">
        <Container33 />
        <Text17 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container20 />
      <Container24 />
      <Container28 />
      <Container32 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0 w-full">
      <Container13 />
      <Container19 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[566px]">
      <div className="bg-white content-stretch flex items-center justify-between py-[16px] relative shrink-0 w-full" data-name="Accordion Trigger">
        <Al />
      </div>
      <Frame1 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Container5 />
      <Frame2 />
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[15px] relative shrink-0 w-[216.672px]" data-name="Text">
      <p className="absolute font-['Geist:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#404040] text-[14px] top-0 w-[534px] whitespace-pre-wrap">Resultado</p>
    </div>
  );
}

function Text19() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[53.141px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[#737373] text-[14px] top-0">R$ 42,50</p>
      </div>
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[8px] relative shrink-0 w-[19.5px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[8px] left-0 not-italic text-[#a3a3a3] text-[8px] top-0 tracking-[0.3px]">CMV</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col h-[26px] items-center relative shrink-0 w-[53.141px]" data-name="Container">
      <Text19 />
      <Text20 />
    </div>
  );
}

function Text21() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[38.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[#669cff] text-[14px] top-0">35.0%</p>
      </div>
    </div>
  );
}

function Text22() {
  return (
    <div className="h-[8px] relative shrink-0 w-[36.141px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[8px] left-0 not-italic text-[#a3a3a3] text-[8px] top-0 tracking-[0.3px]">MARKUP</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col h-[26px] items-center relative shrink-0 w-[38.875px]" data-name="Container">
      <Text21 />
      <Text22 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[11px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="Icon">
          <path d="M2.29167 5.5H8.70833" id="Vector" stroke="var(--stroke-0, #868EA8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.916667" />
          <path d={svgPaths.p3ed2e300} id="Vector_2" stroke="var(--stroke-0, #868EA8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.916667" />
        </g>
      </svg>
    </div>
  );
}

function Text23() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[53.234px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[#0d1d52] text-[14px] top-0">R$ 61,97</p>
      </div>
    </div>
  );
}

function Text24() {
  return (
    <div className="h-[8px] relative shrink-0 w-[40.25px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[8px] left-0 not-italic text-[#a3a3a3] text-[8px] top-0 tracking-[0.3px]">VL. FINAL</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col h-[26px] items-center relative shrink-0 w-[53.234px]" data-name="Container">
      <Text23 />
      <Text24 />
    </div>
  );
}

function Text25() {
  return (
    <div className="h-[15px] relative shrink-0 w-[40.625px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#a3a3a3] text-[10px] top-0">+IPI +ST</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[14px] py-[12px] relative size-full">
          <Container38 />
          <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[16.5px] relative shrink-0 text-[#cfd2dc] text-[14px]">×</p>
          <Container39 />
          <Icon4 />
          <Container40 />
          <Text25 />
        </div>
      </div>
    </div>
  );
}

function Text26() {
  return (
    <div className="h-[15px] relative shrink-0 w-[31.172px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-0 not-italic text-[#059669] text-[10px] top-0 tracking-[0.4px] uppercase">pREÇO Final</p>
      </div>
    </div>
  );
}

function Text27() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#047857] text-[20px] top-0">R$ 61,97</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="relative shrink-0 w-[157.359px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start justify-center px-[20px] py-[8px] relative w-full">
        <Text26 />
        <Text27 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex items-center justify-between px-[20px] relative rounded-[9px] shrink-0 w-[564px]" data-name="Container">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Container37 />
      </div>
      <Container41 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <Text18 />
      <Container36 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g clipPath="url(#clip0_4073_1835)" id="Icon">
          <path d={svgPaths.p3cf7650} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M5 6.66667V5" id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M5 3.33333H5.00417" id="Vector_3" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
        <defs>
          <clipPath id="clip0_4073_1835">
            <rect fill="white" height="10" width="10" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text28() {
  return (
    <div className="h-[15px] relative shrink-0 w-[426.391px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#737373] text-[10px] top-0">Altere o Lucro Alvo para recalcular o Markup, os valores propagam para a tabela de preços</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center pr-[0.016px] relative size-full">
          <Icon5 />
          <Text28 />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame3 />
      <Frame5 />
      <Frame4 />
      <Container42 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start overflow-clip px-[20px] py-[14px] relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)] size-full" data-name="Container">
      <Frame />
    </div>
  );
}