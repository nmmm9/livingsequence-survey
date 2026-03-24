"use client";

import { useEffect } from "react";

export default function ThankYou() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center">
      <div className="text-center px-7">
        <img src="/logo.png" alt="Living Sequence" className="h-[60px] mx-auto mb-8" />
        <h1 className="text-[36px] font-semibold tracking-tight text-white mb-5">
          감사합니다
        </h1>
        <p className="text-[15px] text-[#999] font-light leading-relaxed">
          소중한 의견 남겨주셔서 감사합니다.
          <br />
          더 나은 방향으로 개선해 나가겠습니다.
        </p>
      </div>
    </div>
  );
}
