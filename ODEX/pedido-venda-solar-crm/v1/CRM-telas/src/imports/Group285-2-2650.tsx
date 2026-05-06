import imgImage2 from "figma:asset/e06e2bdfdfc5ab21f45dae07313981e1cceddfd9.png";

function Group() {
  return (
    <div className="absolute contents left-[30.52px] top-[122px]">
      <div className="absolute h-[73px] left-[30.52px] top-[122px] w-[74.263px]" data-name="image 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
      </div>
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[121.06px] text-[#4d5163] text-[12px] top-[142px] w-[442.526px] whitespace-pre-wrap">PLACA DE VIDEO NVIDIA GEFORCE GT740 GDD5 4GB 128BIT - PAX740D54GB</p>
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[121.06px] text-[#4d5163] text-[12px] top-[159px] w-[64.09px] whitespace-pre-wrap">SKU: 123123</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[30.52px] top-[19px]">
      <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[30.52px] top-[19px] w-[817.91px]" data-name="input default">
        <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#101010] text-[16px]">SKU</p>
        <button className="bg-[#fafafa] cursor-pointer h-[46px] relative rounded-[8px] shrink-0 w-full" data-name="input default">
          <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <div className="content-stretch flex items-start p-[14px] relative size-full">
            <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d7d8da] text-[14px] text-left">SKU, nome do produto, etc</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function Group2() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-white border border-[#e0e0e0] border-solid h-[303px] left-0 rounded-[8px] top-0 w-[882px]" />
      <Group />
      <Group1 />
      <div className="absolute bg-[#005aff] content-stretch flex gap-[16px] items-center justify-center left-[31px] px-[24px] py-[12px] rounded-[8px] top-[227px] w-[171px]" data-name="buttom">
        <p className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[16px] text-white">Salvar</p>
      </div>
    </div>
  );
}