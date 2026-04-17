import imgImage from "figma:asset/e579f89d4d79d7fbf92b38570783d9f3a30e59bf.png";
import imgImage1 from "figma:asset/6e06d7c6e1f67c016649efcc928ab0b11ffdeb2a.png";
import imgImage2 from "figma:asset/c92671628277a435a21bad42d494ef168e7d9972.png";

function Al() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] h-full items-start min-h-px min-w-px overflow-x-clip overflow-y-auto py-[8px] relative" data-name="AL">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] tracking-[0.18px] w-full whitespace-pre-wrap">v1.2.0-beta.48</p>
      <div className="content-stretch flex flex-col items-start justify-center py-[2px] relative shrink-0 w-full" data-name="Separator">
        <div className="bg-[#e5e5e5] h-px shrink-0 w-full" data-name="Separator / Horizontal" />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] tracking-[0.18px] w-full whitespace-pre-wrap">v1.2.0-beta.47</p>
      <div className="content-stretch flex flex-col items-start justify-center py-[2px] relative shrink-0 w-full" data-name="Separator">
        <div className="bg-[#e5e5e5] h-px shrink-0 w-full" data-name="Separator / Horizontal" />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] tracking-[0.18px] w-full whitespace-pre-wrap">v1.2.0-beta.46</p>
      <div className="content-stretch flex flex-col items-start justify-center py-[2px] relative shrink-0 w-full" data-name="Separator">
        <div className="bg-[#e5e5e5] h-px shrink-0 w-full" data-name="Separator / Horizontal" />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] tracking-[0.18px] w-full whitespace-pre-wrap">V1.2.0-beta.45</p>
      <div className="content-stretch flex flex-col items-start justify-center py-[2px] relative shrink-0 w-full" data-name="Separator">
        <div className="bg-[#e5e5e5] h-px shrink-0 w-full" data-name="Separator / Horizontal" />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] tracking-[0.18px] w-full whitespace-pre-wrap">v1.2.0-beta.44</p>
      <div className="content-stretch flex flex-col items-start justify-center py-[2px] relative shrink-0 w-full" data-name="Separator">
        <div className="bg-[#e5e5e5] h-px shrink-0 w-full" data-name="Separator / Horizontal" />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] tracking-[0.18px] w-full whitespace-pre-wrap">v1.2.0-beta.43</p>
      <div className="content-stretch flex flex-col items-start justify-center py-[2px] relative shrink-0 w-full" data-name="Separator">
        <div className="bg-[#e5e5e5] h-px shrink-0 w-full" data-name="Separator / Horizontal" />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] tracking-[0.18px] w-full whitespace-pre-wrap">v1.2.0-beta.42</p>
      <div className="content-stretch flex flex-col items-start justify-center py-[2px] relative shrink-0 w-full" data-name="Separator">
        <div className="bg-[#e5e5e5] h-px shrink-0 w-full" data-name="Separator / Horizontal" />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] tracking-[0.18px] w-full whitespace-pre-wrap">v1.2.0-beta.41</p>
      <div className="content-stretch flex flex-col items-start justify-center py-[2px] relative shrink-0 w-full" data-name="Separator">
        <div className="bg-[#e5e5e5] h-px shrink-0 w-full" data-name="Separator / Horizontal" />
      </div>
    </div>
  );
}

function Al1() {
  return (
    <div className="content-stretch flex h-full items-start justify-end relative shrink-0" data-name="AL">
      <div className="h-[48px] relative shrink-0 w-[6px]" data-name="Scrollbar">
        <div className="absolute bg-[#e5e5e5] inset-0 rounded-[4px]" />
      </div>
    </div>
  );
}

function Example() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex gap-[8px] h-[185px] items-center pl-[12px] pr-px relative rounded-[4px] shrink-0 w-[189px]" data-name="Example">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-[-1px] pointer-events-none rounded-[5px]" />
      <Al />
      <Al1 />
    </div>
  );
}

function PhotoCaption() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Photo & caption">
      <div className="h-[200px] relative shrink-0 w-[150px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] tracking-[0.18px]">Photo by Ornella Binni</p>
    </div>
  );
}

function PhotoCaption1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Photo & caption">
      <div className="h-[200px] relative shrink-0 w-[150px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] tracking-[0.18px]">Photo by Tom Byrom</p>
    </div>
  );
}

function PhotoCaption2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Photo & caption">
      <div className="h-[200px] relative shrink-0 w-[150px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] tracking-[0.18px]">Photo by Vladimir Malyav</p>
    </div>
  );
}

function Photos() {
  return (
    <div className="relative shrink-0 w-full" data-name="Photos">
      <div className="overflow-x-auto overflow-y-clip size-full">
        <div className="content-stretch flex gap-[8px] items-start px-[16px] py-[8px] relative w-full">
          <PhotoCaption />
          <PhotoCaption1 />
          <PhotoCaption2 />
        </div>
      </div>
    </div>
  );
}

function Al2() {
  return (
    <div className="relative shrink-0 w-full" data-name="AL">
      <div className="content-stretch flex items-start px-[16px] relative w-full">
        <div className="h-[6px] relative shrink-0 w-[48px]" data-name="Scrollbar">
          <div className="absolute bg-[#e5e5e5] inset-0 rounded-[4px]" data-name="Scrollbar / Horizontal" />
        </div>
      </div>
    </div>
  );
}

function Example1() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex flex-col gap-[8px] items-start justify-center pb-px relative rounded-[4px] shrink-0 w-[381px]" data-name="Example">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-[-1px] pointer-events-none rounded-[5px]" />
      <Photos />
      <Al2 />
    </div>
  );
}

export default function Content() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start relative size-full" data-name="Content">
      <Example />
      <Example1 />
    </div>
  );
}