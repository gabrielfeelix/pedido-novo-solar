function GroupCaixaMae() {
  return (
    <div className="absolute contents inset-[23.79%_82.59%_68.4%_0]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[23.79%_82.59%_68.4%_4.78%] leading-[normal] text-[#101010] text-[16px]">Caixa mãe</p>
      <button className="absolute block cursor-pointer inset-[24.16%_96.59%_68.4%_0] rounded-[4px]" data-name="select">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </button>
    </div>
  );
}

function GroupSelectRS() {
  return (
    <div className="absolute contents inset-[69.14%_80.88%_23.05%_10.92%]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[69.14%_80.88%_23.05%_15.7%] leading-[normal] text-[#101010] text-[16px]">R$</p>
      <button className="absolute block cursor-pointer inset-[69.52%_85.66%_23.05%_10.92%] rounded-[27px]" data-name="select">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[27px]" />
      </button>
    </div>
  );
}

function GroupSelectMarkup() {
  return (
    <div className="absolute contents inset-[69.14%_62.79%_23.05%_23.22%]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[69.14%_62.79%_23.05%_27.99%] leading-[normal] text-[#101010] text-[16px]">Markup</p>
      <button className="absolute block cursor-pointer inset-[69.52%_73.37%_23.05%_23.22%] rounded-[28px]" data-name="select">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[28px]" />
      </button>
    </div>
  );
}

function GroupSelectPct() {
  return (
    <div className="absolute inset-[69.14%_93.17%_23.05%_0]" data-name="Component 4">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[0_0_0_70%] leading-[normal] text-[#101010] text-[16px]">%</p>
      <button className="absolute block bottom-0 cursor-pointer left-0 right-1/2 rounded-[41px] top-[4.76%]" data-name="select">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[41px]" />
      </button>
    </div>
  );
}

function GroupBloqueioDesconto() {
  return (
    <div className="absolute contents left-[30px] top-[63px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[58px] text-[#101010] text-[16px] top-[63px]">Bloqueio de desconto</p>
      <button className="absolute block cursor-pointer left-[30px] rounded-[4px] size-[20px] top-[64px]" data-name="select">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </button>
    </div>
  );
}

function GroupBloqueioSection() {
  return (
    <div className="absolute contents left-[30px] top-[63px]">
      <GroupBloqueioDesconto />
      <div className="absolute bg-[#fafafa] content-stretch flex h-[46px] items-start left-[30px] p-[14px] rounded-[8px] top-[96px] w-[183px]" data-name="input default">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d7d8da] text-[14px]">%</p>
      </div>
    </div>
  );
}

export default function Group879() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-white border border-[#e0e0e0] border-solid h-[523px] left-0 rounded-[8px] top-0 w-[648px]" />
      <div className="absolute h-[269px] left-[30px] top-[177px] w-[585.82px]" data-name="Component 3">
        <GroupCaixaMae />
        <div className="absolute bg-[#fafafa] content-stretch flex inset-[36.06%_78.15%_46.84%_0] items-start p-[14px] rounded-[8px]" data-name="input default">
          <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d7d8da] text-[14px]">qtd.</p>
        </div>
        <div className="absolute bg-[#fafafa] content-stretch flex inset-[36.06%_54.25%_46.84%_23.9%] items-start p-[14px] rounded-[8px]" data-name="input default">
          <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d7d8da] text-[14px]">%</p>
        </div>
        <GroupSelectRS />
        <GroupSelectMarkup />
        <GroupSelectPct />
        <div className="absolute bg-[#fafafa] content-stretch flex inset-[82.9%_77.7%_0_0] items-start p-[14px] rounded-[8px]" data-name="input default">
          <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d7d8da] text-[14px]">%</p>
        </div>
        <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold inset-[85.5%_72.24%_2.6%_25.2%] leading-[normal] text-[#005aff] text-[24px]">+</p>
        <div className="absolute bg-[#fafafa] content-stretch flex inset-[36.06%_23.38%_46.84%_54.32%] items-start p-[14px] rounded-[8px]" data-name="input default">
          <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d7d8da] text-[14px]">qtd.</p>
        </div>
        <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[23.79%_20.45%_68.4%_54.28%] leading-[normal] text-[#101010] text-[16px]">Promocional por lote</p>
        <button className="absolute block cursor-pointer font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[0_53.43%_92.19%_36.33%] leading-[0] text-[#a5a7a9] text-[16px] text-left whitespace-nowrap">
          <p className="leading-[normal]">Por data</p>
        </button>
        <button className="absolute block cursor-pointer font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[0_27.99%_92.19%_60.23%] leading-[0] text-[#a5a7a9] text-[16px] text-left whitespace-nowrap">
          <p className="leading-[normal]">Por verba</p>
        </button>
        <div className="absolute inset-[11.9%_0_88.1%_0.31%]">
          <div className="absolute inset-[-1px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 584 1">
              <line id="Line 90" stroke="var(--stroke-0, #A5A7A9)" x2="584" y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>
        <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold inset-[0_77.3%_92.19%_2.73%] leading-[normal] text-[#005aff] text-[16px]">Por quantidade</p>
        <div className="absolute inset-[11.9%_74.39%_88.1%_0]">
          <div className="absolute inset-[-2px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 150 2">
              <line id="Line 91" stroke="var(--stroke-0, #005AFF)" strokeWidth="2" x2="150" y1="1" y2="1" />
            </svg>
          </div>
        </div>
        <button className="absolute block cursor-pointer font-['Red_Hat_Display:Regular',sans-serif] font-normal inset-[0_2.05%_92.19%_85.66%] leading-[0] text-[#a5a7a9] text-[16px] text-left whitespace-nowrap">
          <p className="leading-[normal]">Pré venda</p>
        </button>
      </div>
      <GroupBloqueioSection />
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[30.11px] text-[#101010] text-[20px] top-[21px]">Promoção</p>
    </div>
  );
}
