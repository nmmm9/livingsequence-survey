"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

const SURVEY_URL = "https://livingsequence-survey.vercel.app";

export default function QRPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, SURVEY_URL, {
        width: 240,
        margin: 2,
        color: { dark: "#111111", light: "#ffffff" },
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center">
      <div className="text-center px-7">
        <div className="font-figtree text-[11px] font-semibold tracking-[5px] uppercase text-white/40 mb-5">
          Living Sequence
        </div>
        <h1 className="font-figtree text-[24px] font-light tracking-tight text-white mb-8">
          Feedback
        </h1>
        <div className="bg-white rounded-2xl p-6 inline-block">
          <canvas ref={canvasRef} />
        </div>
        <p className="text-[13px] text-white/40 mt-6">QR코드를 스캔하여 설문에 참여해주세요</p>
        <p className="text-[11px] text-white/20 mt-2 font-figtree">{SURVEY_URL}</p>
      </div>
    </div>
  );
}
