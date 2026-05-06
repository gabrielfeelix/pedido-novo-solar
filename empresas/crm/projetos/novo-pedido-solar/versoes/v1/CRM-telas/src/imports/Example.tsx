function Al1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[20px] min-h-px min-w-px relative text-[14px]" data-name="AL">
      <p className="font-['Geist:Semibold',sans-serif] not-italic relative shrink-0 text-[#0a0a0a]">Documentation</p>
      <p className="font-['Geist:Regular',sans-serif] font-normal relative shrink-0 text-[#737373]">Learn how to use the library.</p>
    </div>
  );
}

function Al() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="AL">
      <Al1 />
    </div>
  );
}

function Al3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[20px] min-h-px min-w-px relative text-[14px]" data-name="AL">
      <p className="font-['Geist:Semibold',sans-serif] not-italic relative shrink-0 text-[#0a0a0a]">Documentation</p>
      <p className="font-['Geist:Regular',sans-serif] font-normal relative shrink-0 text-[#737373]">Learn how to use the library.</p>
    </div>
  );
}

function Al2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="AL">
      <Al3 />
    </div>
  );
}

function Al5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[20px] min-h-px min-w-px relative text-[14px]" data-name="AL">
      <p className="font-['Geist:Semibold',sans-serif] not-italic relative shrink-0 text-[#0a0a0a]">Documentation</p>
      <p className="font-['Geist:Regular',sans-serif] font-normal relative shrink-0 text-[#737373]">Learn how to use the library.</p>
    </div>
  );
}

function Al4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="AL">
      <Al5 />
    </div>
  );
}

function Al7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[20px] min-h-px min-w-px relative text-[14px]" data-name="AL">
      <p className="font-['Geist:Semibold',sans-serif] not-italic relative shrink-0 text-[#0a0a0a]">Documentation</p>
      <p className="font-['Geist:Regular',sans-serif] font-normal relative shrink-0 text-[#737373]">Learn how to use the library.</p>
    </div>
  );
}

function Al6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="AL">
      <Al7 />
    </div>
  );
}

export default function Example() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative size-full" data-name="Example">
      <div className="content-stretch flex items-center relative shrink-0 w-[768px]" data-name="Navigation Menu">
        <div className="bg-[rgba(0,0,0,0.05)] content-stretch flex gap-[8px] items-center justify-center min-h-[36px] px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
          <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Label</p>
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[8px] items-center justify-center min-h-[36px] px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
          <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#404040] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Label</p>
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[8px] items-center justify-center min-h-[36px] px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
          <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#404040] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Label</p>
          </div>
        </div>
      </div>
      <div className="bg-white h-[138px] relative rounded-[8px] shrink-0 w-full" data-name="Menu">
        <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)]" />
        <div className="content-stretch flex flex-col items-start p-[8px] relative size-full">
          <div className="flex-[1_0_0] gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(2,minmax(0,1fr))] min-h-px min-w-px relative rounded-[8px] w-full" data-name=".Navigation Menu Content">
            <div className="col-1 content-stretch flex gap-[8px] items-center min-h-[32px] px-[8px] py-[5.5px] relative rounded-[6px] row-1 self-start shrink-0 w-[240px]" data-name="Menu Item">
              <Al />
            </div>
            <div className="col-2 content-stretch flex gap-[8px] items-center min-h-[32px] px-[8px] py-[5.5px] relative rounded-[6px] row-1 self-start shrink-0 w-[240px]" data-name="Menu Item">
              <Al2 />
            </div>
            <div className="col-1 content-stretch flex gap-[8px] items-center min-h-[32px] px-[8px] py-[5.5px] relative rounded-[6px] row-2 self-start shrink-0 w-[240px]" data-name="Menu Item">
              <Al4 />
            </div>
            <div className="col-2 content-stretch flex gap-[8px] items-center min-h-[32px] px-[8px] py-[5.5px] relative rounded-[6px] row-2 self-start shrink-0 w-[240px]" data-name="Menu Item">
              <Al6 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}