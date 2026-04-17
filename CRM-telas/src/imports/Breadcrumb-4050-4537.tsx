import svgPaths from "./svg-fw87u4464z";

export default function Breadcrumb() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative size-full" data-name="Breadcrumb">
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name=".Breadcrumb item">
        <p className="font-['Geist:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#737373] text-[14px]">Home</p>
      </div>
      <div className="content-stretch flex items-center relative shrink-0 size-[14px]" data-name=".Breadcrumb separator">
        <div className="overflow-clip relative shrink-0 size-[14px]" data-name="Icon / chevron-right">
          <div className="absolute inset-[21.88%_34.38%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.37493 7.87493">
              <path d={svgPaths.p3c4e2e00} fill="var(--fill-0, #525252)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name=".Breadcrumb item">
        <p className="font-['Geist:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#737373] text-[14px]">Page</p>
      </div>
      <div className="content-stretch flex items-center relative shrink-0 size-[14px]" data-name=".Breadcrumb separator">
        <div className="overflow-clip relative shrink-0 size-[14px]" data-name="Icon / chevron-right">
          <div className="absolute inset-[21.88%_34.38%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.37493 7.87493">
              <path d={svgPaths.p3c4e2e00} fill="var(--fill-0, #525252)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name=".Breadcrumb item">
        <p className="font-['Geist:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#0a0a0a] text-[14px]">Active page</p>
      </div>
    </div>
  );
}