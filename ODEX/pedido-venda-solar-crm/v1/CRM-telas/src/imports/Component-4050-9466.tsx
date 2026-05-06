import svgPaths from "./svg-10dkrkqbm4";

function Al() {
  return (
    <div className="h-[11px] relative shrink-0 w-[3px]" data-name="AL">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 11">
        <g id="AL">
          <path d={svgPaths.pa11bc00} fill="var(--fill-0, #F54A00)" id="Rectangle 13" />
          <path d="M0 4H3V7H0V4Z" fill="var(--fill-0, #F54A00)" id="Rectangle 14" />
          <path d={svgPaths.p8b1e500} fill="var(--fill-0, #F54A00)" id="Rectangle 15" />
        </g>
      </svg>
    </div>
  );
}

function Stack() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Stack">
      <Al />
      <p className="flex-[1_0_0] font-['Geist:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#0a0a0a] text-[12px] whitespace-pre-wrap">Visitors</p>
      <p className="font-['Geist:Semibold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px]">305</p>
    </div>
  );
}

function Al1() {
  return (
    <div className="h-[11px] relative shrink-0 w-[3px]" data-name="AL">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 11">
        <g id="AL">
          <path d={svgPaths.pa11bc00} fill="var(--fill-0, #009689)" id="Rectangle 13" />
          <path d="M0 4H3V7H0V4Z" fill="var(--fill-0, #009689)" id="Rectangle 14" />
          <path d={svgPaths.p8b1e500} fill="var(--fill-0, #009689)" id="Rectangle 15" />
        </g>
      </svg>
    </div>
  );
}

function Stack1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Stack">
      <Al1 />
      <p className="flex-[1_0_0] font-['Geist:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#0a0a0a] text-[12px] whitespace-pre-wrap">Visitors</p>
      <p className="font-['Geist:Semibold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px]">200</p>
    </div>
  );
}

function ChartTooltip({ className }: { className?: string }) {
  return (
    <div className={className || "bg-white content-stretch flex flex-col items-start px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-[128px]"} data-name=".Chart Tooltip 1">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
      <p className="font-['Geist:Semibold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] w-full whitespace-pre-wrap">February</p>
      <Stack />
      <Stack1 />
    </div>
  );
}

function ChartTooltip1({ className }: { className?: string }) {
  return (
    <div className={className || "bg-white content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-[128px]"} data-name=".Chart Tooltip 2">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
      <div className="bg-[#f54a00] rounded-[2px] shrink-0 size-[10px]" data-name="Indicator" />
      <p className="flex-[1_0_0] font-['Geist:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#0a0a0a] text-[12px] whitespace-pre-wrap">Visitors</p>
      <p className="font-['Geist:Semibold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px]">275</p>
    </div>
  );
}

function Stack3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[85px]" data-name="Stack">
      <p className="flex-[1_0_0] font-['Geist:Regular',sans-serif] font-normal min-h-px min-w-px relative text-[#737373] whitespace-pre-wrap">Desktop</p>
      <p className="font-['Geist:Semibold',sans-serif] not-italic relative shrink-0 text-[#0a0a0a]">200</p>
    </div>
  );
}

function Stack2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start leading-[16px] min-h-px min-w-px relative text-[12px]" data-name="Stack">
      <p className="font-['Geist:Semibold',sans-serif] min-w-full not-italic relative shrink-0 text-[#0a0a0a] w-[min-content] whitespace-pre-wrap">March</p>
      <Stack3 />
    </div>
  );
}

function ChartTooltip2({ className }: { className?: string }) {
  return (
    <div className={className || "bg-white content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-[124px]"} data-name=".Chart Tooltip 3">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
      <div className="h-[32px] relative shrink-0 w-[3px]" data-name="Divider">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 32">
          <path d={svgPaths.p22665600} fill="var(--fill-0, #F54A00)" id="Divider" />
        </svg>
      </div>
      <Stack2 />
    </div>
  );
}

function Components() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0" data-name="Components">
      <ChartTooltip />
      <ChartTooltip1 />
      <ChartTooltip2 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="content-stretch flex gap-[64px] items-start p-[64px] relative size-full" data-name="Component">
      <p className="font-['Geist:Semibold',sans-serif] leading-[28.8px] not-italic relative shrink-0 text-[#0a0a0a] text-[24px] tracking-[-1px] w-[320px] whitespace-pre-wrap">.Chart Tooltips</p>
      <Components />
    </div>
  );
}