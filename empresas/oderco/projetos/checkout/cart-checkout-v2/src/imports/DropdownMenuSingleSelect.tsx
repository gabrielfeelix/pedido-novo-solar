export default function DropdownMenuSingleSelect() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[2px] items-center overflow-clip p-[4px] relative rounded-[8px] shadow-[0px_10px_22px_0px_rgba(45,77,108,0.15)] size-full" data-name="dropdown menu / single select">
      <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Context menu item">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center pl-[16px] pr-[20px] py-[9px] relative size-full">
            <div className="flex flex-col font-['Red_Hat_Display:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#868ea8] text-[14px] whitespace-nowrap">
              <p className="leading-[20px]">Choose value</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Context menu item">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center pl-[16px] pr-[20px] py-[9px] relative size-full">
            <div className="flex flex-col font-['Red_Hat_Display:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0d1d52] text-[14px] whitespace-nowrap">
              <p className="leading-[20px]">Item 1</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Context menu item">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center pl-[16px] pr-[20px] py-[9px] relative size-full">
            <div className="flex flex-col font-['Red_Hat_Display:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0d1d52] text-[14px] whitespace-nowrap">
              <p className="leading-[20px]">Item 3</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#ccdeff] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Context menu item">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center pl-[16px] pr-[20px] py-[9px] relative size-full">
            <div className="flex flex-col font-['Red_Hat_Display:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0d1d52] text-[14px] whitespace-nowrap">
              <p className="leading-[20px]">Chosen value</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Context menu item">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center pl-[16px] pr-[20px] py-[9px] relative size-full">
            <div className="flex flex-col font-['Red_Hat_Display:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0d1d52] text-[14px] whitespace-nowrap">
              <p className="leading-[20px]">Item 4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}