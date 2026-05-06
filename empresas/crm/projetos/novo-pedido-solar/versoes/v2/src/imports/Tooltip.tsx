import svgPaths from "./svg-3i5296vd6x";

export default function Tooltip() {
  return (
    <div className="bg-black content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[6px] relative rounded-[8px] size-full" data-name="Tooltip">
      <p className="font-['Geist:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-white">Tooltip text</p>
      <div className="-translate-x-1/2 absolute bottom-[-5px] h-[5px] left-[calc(50%-0.25px)] w-[11.5px]" data-name="Arrow">
        <div className="absolute inset-[0_0_6.51%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 4.67436">
            <path d={svgPaths.p26825c00} fill="var(--fill-0, black)" id="Arrow" />
          </svg>
        </div>
      </div>
    </div>
  );
}