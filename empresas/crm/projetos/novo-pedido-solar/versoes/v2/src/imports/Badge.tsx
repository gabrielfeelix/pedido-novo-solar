export default function Badge() {
  return (
    <div className="bg-[#001233] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[8px] size-full" data-name="Badge">
      <div className="flex flex-col font-['Geist:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">Label</p>
      </div>
    </div>
  );
}