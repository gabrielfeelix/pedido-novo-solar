import svgPaths from "./svg-abb0s7dyms";

function Frame1() {
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

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame1 />
    </div>
  );
}

function Frame2() {
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

function Frame7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame2 />
    </div>
  );
}

function Frame5() {
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

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame5 />
    </div>
  );
}

function Frame9() {
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

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame9 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame3 />
      <Frame7 />
      <Frame4 />
      <Frame6 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[22px] items-start justify-center relative shrink-0 w-[220px]">
      <p className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#101010] text-[20px] w-full whitespace-pre-wrap">Aging</p>
      <Frame8 />
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

function Group() {
  return (
    <div className="relative shrink-0 size-[116px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 116 116">
        <g id="Group 1457">
          <path d={svgPaths.p2eefe200} fill="var(--fill-0, #4CD964)" id="Ellipse 58" />
          <path d={svgPaths.p14b1000} fill="var(--fill-0, #FF3B30)" id="Ellipse 61" />
          <path d={svgPaths.p2975d100} fill="var(--fill-0, #FFCD00)" id="Ellipse 59" />
          <path d={svgPaths.p1a7fc8c0} fill="var(--fill-0, #669CFF)" id="Ellipse 60" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex h-full items-start pt-[38px] relative shrink-0">
      <Group />
    </div>
  );
}

export default function Frame11() {
  return (
    <div className="bg-white content-stretch flex gap-[16px] items-center pl-[25px] pr-[45px] py-[22px] relative size-full">
      <Frame10 />
      <div className="flex flex-row items-center self-stretch">
        <Frame />
      </div>
    </div>
  );
}