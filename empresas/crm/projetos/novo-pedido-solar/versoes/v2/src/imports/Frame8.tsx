import svgPaths from "./svg-coglkjabkb";

function Text() {
  return (
    <div className="h-[15px] relative shrink-0 w-[132.906px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-0 not-italic text-[#868ea8] text-[10px] top-0 tracking-[0.5px] uppercase">Composição do Preço</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex h-[15px] items-center justify-between relative shrink-0 w-[307.766px]" data-name="Container">
      <Text />
    </div>
  );
}

function Container3() {
  return <div className="bg-[#64748b] rounded-[4px] shrink-0 size-[8px]" data-name="Container" />;
}

function Text1() {
  return (
    <div className="flex-[1_0_0] h-[15px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#868ea8] text-[10px] top-0">CMV</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[15px] relative shrink-0 w-[35.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container3 />
        <Text1 />
      </div>
    </div>
  );
}

function Container5() {
  return <div className="bg-[#3b82f6] rounded-[4px] shrink-0 size-[8px]" data-name="Container" />;
}

function Text2() {
  return (
    <div className="flex-[1_0_0] h-[15px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#868ea8] text-[10px] top-0">Markup</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[15px] relative shrink-0 w-[48.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container5 />
        <Text2 />
      </div>
    </div>
  );
}

function Container7() {
  return <div className="bg-[#fb923c] rounded-[4px] shrink-0 size-[8px]" data-name="Container" />;
}

function Text3() {
  return (
    <div className="flex-[1_0_0] h-[15px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#868ea8] text-[10px] top-0">IPI</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[15px] relative shrink-0 w-[23.766px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container7 />
        <Text3 />
      </div>
    </div>
  );
}

function Container9() {
  return <div className="bg-[#c084fc] rounded-[4px] shrink-0 size-[8px]" data-name="Container" />;
}

function Text4() {
  return (
    <div className="flex-[1_0_0] h-[15px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#868ea8] text-[10px] top-0">ST</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[15px] relative shrink-0 w-[24.828px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container9 />
        <Text4 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[12px] h-[15px] items-center pl-[4px] relative shrink-0 w-[171.938px]" data-name="Container">
      <Container2 />
      <Container4 />
      <Container6 />
      <Container8 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container />
      <Container1 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[12.78%_8.07%_23.52%_1.67%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 104.703 97.4605">
        <g id="Group">
          <path d={svgPaths.p142d7bf0} fill="var(--fill-0, #64748B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[58.6%_12.87%_18.89%_24.1%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73.1075 34.4447">
        <g id="Group">
          <path d={svgPaths.p30c9cb00} fill="var(--fill-0, #3B82F6)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[51.45%_8.76%_37.72%_77.45%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.0011 16.5621">
        <g id="Group">
          <path d={svgPaths.p39202f80} fill="var(--fill-0, #FB923C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[46.94%_8.07%_47.12%_80.58%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.1688 9.07747">
        <g id="Group">
          <path d={svgPaths.p34cdaa00} fill="var(--fill-0, #C084FC)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[12.78%_8.07%_18.89%_1.67%]" data-name="Group">
      <Group1 />
      <Group2 />
      <Group3 />
      <Group4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[15px] relative shrink-0 w-[34.828px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[-0.09px] not-italic text-[#868ea8] text-[10px] top-0 tracking-[0.5px] uppercase">TOTAL</p>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[27px] left-[3px] text-[#0d1d52] text-[14px] top-px">R$ 63,80</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[33.01%_19.42%_39.54%_16.38%] items-center">
      <Text5 />
      <Text6 />
    </div>
  );
}

function Surface() {
  return (
    <div className="h-[153px] overflow-clip relative shrink-0 w-[116px]" data-name="Surface">
      <Group />
      <Frame5 />
    </div>
  );
}

function Container12() {
  return <div className="bg-[#64748b] h-[24px] rounded-[2px] shrink-0 w-[6px]" data-name="Container" />;
}

function Text7() {
  return (
    <div className="h-[15px] relative shrink-0 w-[49.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#868ea8] text-[10px] top-0">CMV</p>
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[49.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[#0d1d52] text-[12px] top-0">R$ 42,50</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text7 />
        <Text8 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[33px] relative shrink-0 w-[63.578px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container12 />
        <Container13 />
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[15px] relative shrink-0 w-[22.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#64748b] text-[10px] top-0">56%</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[41px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[6px] relative size-full">
          <Container11 />
          <Text9 />
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return <div className="bg-[#3b82f6] h-[24px] rounded-[2px] shrink-0 w-[6px]" data-name="Container" />;
}

function Text10() {
  return (
    <div className="h-[15px] relative shrink-0 w-[49.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#868ea8] text-[10px] top-0">Markup</p>
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[49.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[#0d1d52] text-[12px] top-0">R$ 16,57</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text10 />
        <Text11 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[33px] relative shrink-0 w-[63.578px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container16 />
        <Container17 />
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[15px] relative shrink-0 w-[22.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#3b82f6] text-[10px] top-0">26%</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[41px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[6px] relative size-full">
          <Container15 />
          <Text12 />
        </div>
      </div>
    </div>
  );
}

function Container20() {
  return <div className="bg-[#fb923c] h-[24px] rounded-[2px] shrink-0 w-[6px]" data-name="Container" />;
}

function Text13() {
  return (
    <div className="h-[15px] relative shrink-0 w-[49.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#868ea8] text-[10px] top-0">IPI</p>
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[49.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[#0d1d52] text-[12px] top-0">R$ 2,95</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text13 />
        <Text14 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[33px] relative shrink-0 w-[63.578px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container20 />
        <Container21 />
      </div>
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[15px] relative shrink-0 w-[22.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#fb923c] text-[10px] top-0">10%</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[41px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[6px] relative size-full">
          <Container19 />
          <Text15 />
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return <div className="bg-[#c084fc] h-[24px] rounded-[2px] shrink-0 w-[6px]" data-name="Container" />;
}

function Text16() {
  return (
    <div className="h-[15px] relative shrink-0 w-[49.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#868ea8] text-[10px] top-0">ST</p>
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[49.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[#0d1d52] text-[12px] top-0">R$ 1,25</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text16 />
        <Text17 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[33px] relative shrink-0 w-[63.578px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container24 />
        <Container25 />
      </div>
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[15px] relative shrink-0 w-[22.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#c084fc] text-[10px] top-0">4%</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[41px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[6px] relative size-full">
          <Container23 />
          <Text18 />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[107.766px]">
      <Container10 />
      <Container14 />
      <Container18 />
      <Container22 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[21px] items-center relative shrink-0 w-full">
      <Surface />
      <Frame1 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start p-[10px] relative w-full">
        <Frame2 />
      </div>
    </div>
  );
}

export default function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start justify-center relative size-full">
      <Frame />
      <Frame3 />
    </div>
  );
}