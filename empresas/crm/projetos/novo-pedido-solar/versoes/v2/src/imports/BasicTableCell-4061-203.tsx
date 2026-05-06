export default function BasicTableCell() {
  return (
    <div className="content-stretch flex items-center justify-end p-[8px] relative size-full" data-name="Basic Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="font-['Geist:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#0a0a0a] text-[16px]">Basic Table Cell</p>
    </div>
  );
}