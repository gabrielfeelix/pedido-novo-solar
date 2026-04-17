import svgPaths from "./svg-joemu10g9t";

function DonutChart({ className }: { className?: string }) {
  return (
    <div className={className || "relative shrink-0 size-[187px]"} data-name=".Donut Chart">
      <div className="absolute inset-[0_0_48.44%_34.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 123.099 96.4207">
          <path d={svgPaths.p2ad04f00} fill="var(--fill-0, #F54A00)" id="Donut piece" />
        </svg>
      </div>
      <div className="absolute bottom-[20.5%] left-[75.03%] right-0 top-1/2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46.6931 55.1683">
          <path d={svgPaths.p229c7980} fill="var(--fill-0, #FE9A00)" id="Donut piece" />
        </svg>
      </div>
      <div className="absolute inset-[68.06%_9.36%_0_36.56%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 101.126 59.7242">
          <path d={svgPaths.p9ccbe80} fill="var(--fill-0, #FFB900)" id="Donut piece" />
        </svg>
      </div>
      <div className="absolute inset-[53.66%_58.05%_1.71%_0.35%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 77.7997 83.4551">
          <path d={svgPaths.p280a6500} fill="var(--fill-0, #104E64)" id="Donut piece" />
        </svg>
      </div>
      <div className="absolute inset-[2.25%_59.2%_44.11%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76.2946 100.3">
          <path d={svgPaths.p33108000} fill="var(--fill-0, #009689)" id="Donut piece" />
        </svg>
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <div className="content-stretch flex gap-[64px] items-start pt-[64px] px-[64px] relative size-full" data-name="Component">
      <p className="font-['Geist:Semibold',sans-serif] leading-[28.8px] not-italic relative shrink-0 text-[#0a0a0a] text-[24px] tracking-[-1px] w-[320px] whitespace-pre-wrap">.Donut Chart</p>
      <DonutChart />
    </div>
  );
}