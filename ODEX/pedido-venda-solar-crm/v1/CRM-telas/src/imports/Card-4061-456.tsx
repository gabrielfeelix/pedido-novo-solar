export default function Card() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[8px] size-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 w-full" data-name=".Slot">
        <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
          <div className="flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[8px]" data-name=".Slot Inner">
            <div aria-hidden="true" className="absolute border border-[#9747ff] border-dashed inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex items-center justify-center p-[8px] relative size-full">
                <p className="font-['Geist:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#c89dff] text-[14px]">Slot</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}