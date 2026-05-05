import svgPaths from "./svg-8ecdorambs";

function Group13() {
  return (
    <div className="absolute contents left-[20px] text-[#101010] top-[173px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[20px] text-[16px] top-[177px]">IPI</p>
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold left-[46px] text-[20px] top-[173px]">12%</p>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents left-[20px] top-[173px]">
      <Group13 />
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[20px] text-[#a5a7a9] text-[16px] top-[203px]">(R$30,00)</p>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents left-[128px] text-[#101010] top-[173px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[128px] text-[16px] top-[177px]">Custo Operacional</p>
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold left-[265px] text-[20px] top-[173px]">12%</p>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents left-[128px] top-[173px]">
      <Group15 />
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[128px] text-[#a5a7a9] text-[16px] top-[203px]">(R$30,00)</p>
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents leading-[normal] left-[20px] top-[173px]">
      <Group14 />
      <Group16 />
    </div>
  );
}

function Edit() {
  return (
    <div className="absolute inset-[54.3%_71.19%_43.02%_26.66%]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_878_edit)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_878_edit">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function GroupValorSemIPI() {
  return (
    <div className="absolute contents left-[20px] top-[274px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[20px] text-[#005aff] text-[20px] top-[274px]">R$ 1.000,00</p>
      <Edit />
      <div className="absolute h-0 left-[20px] top-[306px] w-[169px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 169 1">
            <line id="Line 86" stroke="var(--stroke-0, #A5A7A9)" x2="169" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function GroupLabelSemIPI() {
  return (
    <div className="absolute contents left-[20px] top-[248px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[0] left-[20px] text-[#101010] text-[0px] text-[16px] top-[248px]">
        <span className="leading-[normal]">{`Valor de venda `}</span>
        <span className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal]">(sem IPI)</span>
      </p>
      <GroupValorSemIPI />
    </div>
  );
}

function Edit1() {
  return (
    <div className="absolute inset-[54.3%_38.98%_43.02%_58.86%]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_878_edit1)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_878_edit1">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function GroupValorComIPI() {
  return (
    <div className="absolute contents left-[229px] top-[274px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[229px] text-[#005aff] text-[20px] top-[274px]">R$ 1.000,00</p>
      <Edit1 />
      <div className="absolute h-0 left-[229px] top-[306px] w-[169px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 169 1">
            <line id="Line 86" stroke="var(--stroke-0, #A5A7A9)" x2="169" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function GroupLabelComIPI() {
  return (
    <div className="absolute contents left-[229px] top-[248px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[0] left-[229px] text-[#101010] text-[0px] text-[16px] top-[248px]">
        <span className="leading-[normal]">{`Valor de venda `}</span>
        <span className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal]">(com IPI)</span>
      </p>
      <GroupValorComIPI />
    </div>
  );
}

function GroupValores() {
  return (
    <div className="absolute contents left-[20px] top-[248px]">
      <GroupLabelSemIPI />
      <GroupLabelComIPI />
    </div>
  );
}

function GroupIPIValores() {
  return (
    <div className="absolute contents left-[20px] top-[173px]">
      <Group18 />
      <GroupValores />
    </div>
  );
}

function GroupRefTitle() {
  return (
    <div className="absolute contents leading-[normal] left-[36px] top-[359px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[315px] text-[#a5a7a9] text-[12px] top-[367px]">Valor com imposto. Referência para formação antiga</p>
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold left-[36px] text-[#101010] text-[20px] top-[359px]">Referência de última compra</p>
    </div>
  );
}

function GroupMarkup() {
  return (
    <div className="absolute contents left-[187px] top-[409px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[187px] text-[16px] top-[409px]">Markup</p>
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold left-[187px] text-[20px] top-[434px]">42%</p>
    </div>
  );
}

function GroupLucratividade() {
  return (
    <div className="absolute contents left-[289px] top-[409px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[289px] text-[16px] top-[409px]">Lucratividade</p>
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold left-[289px] text-[20px] top-[434px]">1%</p>
    </div>
  );
}

function GroupUltimaCompra() {
  return (
    <div className="absolute contents leading-[normal] left-[38px] text-[#101010] top-[409px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold left-[38px] text-[20px] top-[434px]">R$ 700,00</p>
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[38px] text-[16px] top-[409px]">Última compra</p>
      <GroupMarkup />
      <GroupLucratividade />
    </div>
  );
}

function GroupReferencia() {
  return (
    <div className="absolute contents left-[20px] top-[338px]">
      <div className="absolute bg-white h-[143px] left-[20px] rounded-[8px] top-[338px] w-[605px]" />
      <div className="absolute contents left-[36px] top-[359px]">
        <GroupRefTitle />
        <GroupUltimaCompra />
      </div>
    </div>
  );
}

function GroupCMV() {
  return (
    <div className="absolute contents leading-[normal] left-[20px] top-[66px]">
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[21px] text-[#a5a7a9] text-[12px] top-[125px]">Última compra: R$643,10</p>
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal left-[20px] text-[#101010] text-[16px] top-[66px]">CMV</p>
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold left-[20px] text-[#101010] text-[20px] top-[95px]">R$ 650,00</p>
    </div>
  );
}

function GroupSelectMarkup() {
  return (
    <div className="absolute contents left-[219px] top-[72px]">
      <button className="absolute block cursor-pointer left-[219px] rounded-[41px] size-[20px] top-[72px]" data-name="select">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[41px]" />
      </button>
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[243px] text-[#101010] text-[16px] top-[72px]">Markup</p>
    </div>
  );
}

function GroupSelectLucratividade() {
  return (
    <div className="absolute contents left-[313px] top-[72px]">
      <button className="absolute block cursor-pointer left-[313px] rounded-[41px] size-[20px] top-[72px]" data-name="select">
        <div aria-hidden="true" className="absolute border border-[#d7d8da] border-solid inset-0 pointer-events-none rounded-[41px]" />
      </button>
      <p className="absolute font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] left-[337px] text-[#101010] text-[16px] top-[72px]">Lucratividade</p>
    </div>
  );
}

function Edit2() {
  return (
    <div className="absolute inset-[21.61%_53.62%_75.72%_44.22%]" data-name="edit">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_878_edit2)" id="edit">
          <path d={svgPaths.p3295c900} id="Vector" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3fdb880} id="Vector_2" stroke="var(--stroke-0, #A5A7A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_878_edit2">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function GroupPercentual() {
  return (
    <div className="absolute contents left-[219px] top-[107px]">
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[222px] text-[#101010] text-[20px] top-[107px]">35%</p>
      <Edit2 />
      <div className="absolute h-0 left-[219px] top-[135px] w-[83px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 83 1">
            <line id="Line 87" stroke="var(--stroke-0, #A5A7A9)" x2="83" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function GroupSelectores() {
  return (
    <div className="absolute contents left-[219px] top-[72px]">
      <GroupSelectMarkup />
      <GroupSelectLucratividade />
      <GroupPercentual />
    </div>
  );
}

function GroupFormacaoBody() {
  return (
    <div className="absolute contents left-[20px] top-[66px]">
      <div className="absolute bg-[#a5a7a9] h-[51px] left-[186px] rounded-[8px] top-[78px] w-px" />
      <GroupCMV />
      <GroupSelectores />
    </div>
  );
}

export default function Group878() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-white border border-[#e0e0e0] border-solid h-[523px] left-0 rounded-[8px] top-0 w-[649px]" />
      <p className="absolute font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] left-[20px] text-[#101010] text-[20px] top-[21px]">Formação de preço</p>
      <GroupIPIValores />
      <GroupReferencia />
      <GroupFormacaoBody />
    </div>
  );
}
