"use client";

import { useEffect } from "react";

export default function ThankYou() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center">
      <div className="text-center px-7">
        <div className="font-figtree text-[11px] font-semibold tracking-[5px] uppercase text-white/40 mb-5">
          Living Sequence
        </div>
        <h1 className="font-figtree text-[32px] font-light tracking-tight text-white mb-4">
          감사합니다
        </h1>
        <p className="text-[15px] text-[#999] font-light leading-relaxed mb-8">
          소중한 의견이 정상적으로 제출되었습니다.
          <br />
          더 나은 서비스로 보답하겠습니다.
        </p>
        <div className="font-figtree text-[16px] font-semibold text-white tracking-[2px]">
          LIVING SEQUENCE
        </div>
      </div>
    </div>
  );
}
