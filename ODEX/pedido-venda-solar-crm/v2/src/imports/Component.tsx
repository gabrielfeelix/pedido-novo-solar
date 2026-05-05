import svgPaths from "./svg-jw9ll04k71";

function PieChart({ className }: { className?: string }) {
  return (
    <div className={className || "relative shrink-0 size-[187px]"} data-name=".Pie Chart">
      <div className="absolute inset-[0_0_48.44%_34.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 123.099 96.4207">
          <path d={svgPaths.p3c77dac0} fill="var(--fill-0, #F54A00)" id="Pie" />
        </svg>
      </div>
      <div className="absolute bottom-[20.5%] left-1/2 right-0 top-1/2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 93.5 55.1683">
          <path d={svgPaths.p1a784b80} fill="var(--fill-0, #FE9A00)" id="Pie" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-[36.56%] right-[9.36%] top-1/2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 101.126 93.5">
          <path d={svgPaths.pc270600} fill="var(--fill-0, #FFB900)" id="Pie" />
        </svg>
      </div>
      <div className="absolute bottom-[1.71%] left-[0.35%] right-1/2 top-1/2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 92.8468 90.2957">
          <path d={svgPaths.p81aa700} fill="var(--fill-0, #104E64)" id="Pie" />
        </svg>
      </div>
      <div className="absolute bottom-[44.11%] left-0 right-1/2 top-[2.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 93.5002 100.3">
          <path d={svgPaths.p2b66c000} fill="var(--fill-0, #009689)" id="Pie" />
        </svg>
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <div className="content-stretch flex gap-[64px] items-start pt-[64px] px-[64px] relative size-full" data-name="Component">
      <p className="font-['Geist:Semibold',sans-serif] leading-[28.8px] not-italic relative shrink-0 text-[#0a0a0a] text-[24px] tracking-[-1px] w-[320px] whitespace-pre-wrap">.Pie Chart</p>
      <PieChart />
    </div>
  );
}