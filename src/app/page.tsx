"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

type RadioAnswer = { value: string; other?: string };
type CheckboxAnswer = { values: string[]; other?: string; reason?: string };

interface FormData {
  q1: string;
  q2: RadioAnswer;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: { value: string; q7_1?: RadioAnswer; q7_2?: string };
  q8: string;
  q9: { value: string; q9_1?: RadioAnswer; q9_2?: RadioAnswer };
  q10: { value: string; q10_2?: RadioAnswer };
  q11: CheckboxAnswer;
  q12: { values: string[]; reason?: string };
  q13: { values: string[]; other?: string };
  q14: string;
  q15: { values: string[]; other?: string; q15_1?: RadioAnswer };
  q16: string;
  q17: string;
}

const initialData: FormData = {
  q1: "",
  q2: { value: "" },
  q3: "",
  q4: "",
  q5: "",
  q6: "",
  q7: { value: "" },
  q8: "",
  q9: { value: "" },
  q10: { value: "" },
  q11: { values: [] },
  q12: { values: [] },
  q13: { values: [] },
  q14: "",
  q15: { values: [] },
  q16: "",
  q17: "",
};

export default function SurveyPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState<{ show: boolean; message: string; qId: string }>({
    show: false,
    message: "",
    qId: "",
  });
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!submitting) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [submitting]);

  const REQUIRED_FIELDS: { key: string; label: string; check: () => boolean }[] = [
    { key: "q1", label: "1번 문항에 답변해주세요.", check: () => !!form.q1.trim() },
    { key: "q2", label: "2번 문항에 답변해주세요.", check: () => !!form.q2.value },
    { key: "q2", label: "2번 기타를 선택하셨다면 내용을 적어주세요.", check: () => form.q2.value !== "기타" || !!form.q2.other?.trim() },
    { key: "q7", label: "7번 문항에 답변해주세요.", check: () => !!form.q7.value },
    { key: "q7", label: "7번 추가 질문에 답변해주세요.", check: () => {
      const pos = form.q7.value === "매우 그렇다" || form.q7.value === "그렇다";
      return !pos || !!form.q7.q7_1?.value;
    }},
    { key: "q7", label: "7번 추가 질문의 기타 내용을 적어주세요.", check: () => {
      const pos = form.q7.value === "매우 그렇다" || form.q7.value === "그렇다";
      return !pos || form.q7.q7_1?.value !== "기타" || !!form.q7.q7_1?.other?.trim();
    }},
    { key: "q7", label: "7번 추가 질문에 답변해주세요.", check: () => {
      const neg = form.q7.value === "아니다" || form.q7.value === "전혀 아니다";
      return !neg || !!form.q7.q7_2;
    }},
    { key: "q9", label: "9번 문항에 답변해주세요.", check: () => !!form.q9.value },
    { key: "q9", label: "9번 추가 질문에 답변해주세요.", check: () => {
      const pos = form.q9.value === "매우 그렇다" || form.q9.value === "그렇다";
      return !pos || !!form.q9.q9_1?.value;
    }},
    { key: "q9", label: "9번 추가 질문의 기타 내용을 적어주세요.", check: () => {
      const pos = form.q9.value === "매우 그렇다" || form.q9.value === "그렇다";
      return !pos || form.q9.q9_1?.value !== "기타" || !!form.q9.q9_1?.other?.trim();
    }},
    { key: "q9", label: "9번 추가 질문에 답변해주세요.", check: () => {
      const neg = form.q9.value === "아니다" || form.q9.value === "전혀 아니다";
      return !neg || !!form.q9.q9_2?.value;
    }},
    { key: "q9", label: "9번 추가 질문의 기타 내용을 적어주세요.", check: () => {
      const neg = form.q9.value === "아니다" || form.q9.value === "전혀 아니다";
      return !neg || form.q9.q9_2?.value !== "기타" || !!form.q9.q9_2?.other?.trim();
    }},
    { key: "q10", label: "10번 문항에 답변해주세요.", check: () => !!form.q10.value },
    { key: "q10", label: "10번 추가 질문에 답변해주세요.", check: () => {
      return form.q10.value !== "관심 없다" || !!form.q10.q10_2?.value;
    }},
    { key: "q10", label: "10번 추가 질문의 기타 내용을 적어주세요.", check: () => {
      return form.q10.value !== "관심 없다" || form.q10.q10_2?.value !== "기타" || !!form.q10.q10_2?.other?.trim();
    }},
    { key: "q11", label: "11번 문항에 답변해주세요.", check: () => form.q11.values.length > 0 },
    { key: "q11", label: "11번 기타를 선택하셨다면 내용을 적어주세요.", check: () => !form.q11.values.includes("기타") || !!form.q11.other?.trim() },
    { key: "q12", label: "12번 문항에 답변해주세요.", check: () => form.q12.values.length > 0 },
    { key: "q13", label: "13번 문항에 답변해주세요.", check: () => form.q13.values.length > 0 },
    { key: "q13", label: "13번 기타를 선택하셨다면 내용을 적어주세요.", check: () => !form.q13.values.includes("기타") || !!form.q13.other?.trim() },
    { key: "q15", label: "15번 문항에 답변해주세요.", check: () => form.q15.values.length > 0 },
    { key: "q15", label: "15번 기타를 선택하셨다면 내용을 적어주세요.", check: () => !form.q15.values.includes("기타") || !!form.q15.other?.trim() },
    { key: "q15", label: "15번 추가 질문에 답변해주세요.", check: () => {
      return !form.q15.values.includes("실제 고객이 유입될지 불확실") || !!form.q15.q15_1?.value;
    }},
    { key: "q15", label: "15번 추가 질문의 기타 내용을 적어주세요.", check: () => {
      return !form.q15.values.includes("실제 고객이 유입될지 불확실") || form.q15.q15_1?.value !== "기타" || !!form.q15.q15_1?.other?.trim();
    }},
  ];

  const progress = useCallback(() => {
    let answered = 0;
    if (form.q2.value) answered++;
    if (form.q7.value) answered++;
    if (form.q9.value) answered++;
    if (form.q10.value) answered++;
    if (form.q11.values.length > 0) answered++;
    if (form.q12.values.length > 0) answered++;
    if (form.q13.values.length > 0) answered++;
    if (form.q15.values.length > 0) answered++;
    return Math.round((answered / 8) * 100);
  }, [form]);

  const handleSubmit = async () => {
    const missing = REQUIRED_FIELDS.find((f) => !f.check());
    if (missing) {
      setModal({ show: true, message: missing.label, qId: missing.key });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses: {
            ...form,
            q6: form.q6 || null,
          },
          metadata: {
            userAgent: navigator.userAgent,
            completionTimeSeconds: Math.round((Date.now() - startTime.current) / 1000),
          },
        }),
      });

      if (res.ok) {
        router.replace("/thank-you");
      } else {
        alert("제출에 실패했습니다. 다시 시도해주세요.");
      }
    } catch {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[640px] mx-auto">
      {/* Header */}
      <header className="px-7 pt-[60px] pb-12 text-center bg-[var(--dark)] text-white">
        <img src="/logo.png" alt="Living Sequence" className="h-[60px] mx-auto mb-5" />
        <h1 className="font-figtree text-[40px] font-light tracking-tight text-white mb-2.5">
          Feedback
        </h1>
        <div className="text-[13px] text-[var(--muted)] font-light">
          소중한 의견을 들려주세요
        </div>
      </header>


      {/* All Questions */}
      <div className="bg-[var(--card)] mx-3 mt-3 rounded-[20px] px-6 py-9">

        <QuestionTextarea id="q1" num="01" label="오늘 발표를 듣고, 리빙시퀀스의 첫인상을 자유롭게 표현해주세요." value={form.q1} onChange={(v) => setForm({ ...form, q1: v })} />
        <Divider />
        <QuestionRadio id="q2" num="02" label="대표님이 생각하시기에, 고객이 인테리어 업체를 선택할 때 가장 중요하게 보는 기준은 무엇입니까?" options={["가격/견적", "시공 사례/포트폴리오", "지인 추천/입소문", "디자인 감각/스타일 적합성", "소통/응대 속도"]} hasOther value={form.q2} onChange={(v) => setForm({ ...form, q2: v })} />
        <Divider />
        <QuestionTextarea num="03" label="지금까지 경험 중 계약이 무산된 가장 흔한 이유는?" optional value={form.q3} onChange={(v) => setForm({ ...form, q3: v })} />
        <Divider />
        <QuestionTextarea num="04" label="고객과의 소통 과정에서 가장 자주 발생하는 문제나 어려움은 무엇입니까?" optional value={form.q4} onChange={(v) => setForm({ ...form, q4: v })} />
        <Divider />
        <QuestionTextarea num="05" label="현재 인테리어 시장에서 가장 시급하게 바뀌어야 한다고 느끼는 것은?" optional value={form.q5} onChange={(v) => setForm({ ...form, q5: v })} />
        <Divider />
        <QuestionTextarea num="06" label="플랫폼이 아닌, 대표님이 직접 해결하고 싶은 업무상 가장 큰 고민은?" optional value={form.q6} onChange={(v) => setForm({ ...form, q6: v })} />
        <Divider />

        <Question id="q7" num="07" label="취향Kit을 통해 고객 정보, 스타일이 사전에 정리되어 전달된다면, 초기 상담 시간이 줄어들 것 같습니까?">
          <RadioGroup name="q7" options={["매우 그렇다", "그렇다", "보통이다", "아니다", "전혀 아니다"]} value={form.q7.value} onChange={(v) => { const positive = v === "매우 그렇다" || v === "그렇다"; const negative = v === "아니다" || v === "전혀 아니다"; setForm({ ...form, q7: { value: v, q7_1: positive ? form.q7.q7_1 : undefined, q7_2: negative ? form.q7.q7_2 : undefined } }); }} />
          {(form.q7.value === "매우 그렇다" || form.q7.value === "그렇다") && (
            <SubQuestion label="어떤 부분에서 시간이 가장 줄어들 것 같습니까?">
              <RadioGroup name="q7_1" options={["고객 취향/스타일 파악", "예산 범위 확인", "공간 구조/활용 방식 이해"]} hasOther value={form.q7.q7_1?.value ?? ""} otherValue={form.q7.q7_1?.other} onChange={(v) => setForm({ ...form, q7: { ...form.q7, q7_1: { value: v } } })} onOtherChange={(o) => setForm({ ...form, q7: { ...form.q7, q7_1: { value: "기타", other: o } } })} />
            </SubQuestion>
          )}
          {(form.q7.value === "아니다" || form.q7.value === "전혀 아니다") && (
            <SubQuestion label="상담 시간이 줄지 않을 것 같은 이유는?">
              <textarea className="survey-textarea" placeholder="자유롭게 적어주세요" value={form.q7.q7_2 ?? ""} onChange={(e) => setForm({ ...form, q7: { ...form.q7, q7_2: e.target.value } })} />
            </SubQuestion>
          )}
        </Question>
        <Divider />

        <QuestionTextarea num="08" label="취향Kit에 있으면 좋겠다고 생각하는 고객 정보가 있다면?" optional value={form.q8} onChange={(v) => setForm({ ...form, q8: v })} />
        <Divider />

        <Question id="q9" num="09" label="이 플랫폼을 사용하면, 기존 대비 계약 전환율이 개선될 것이라고 생각하십니까?">
          <RadioGroup name="q9" options={["매우 그렇다", "그렇다", "보통이다", "아니다", "전혀 아니다"]} value={form.q9.value} onChange={(v) => { const positive = v === "매우 그렇다" || v === "그렇다"; const negative = v === "아니다" || v === "전혀 아니다"; setForm({ ...form, q9: { value: v, q9_1: positive ? form.q9.q9_1 : undefined, q9_2: negative ? form.q9.q9_2 : undefined } }); }} />
          {(form.q9.value === "매우 그렇다" || form.q9.value === "그렇다") && (
            <SubQuestion label="가장 크게 기대되는 부분은?">
              <RadioGroup name="q9_1" options={["사전 정보로 상담 효율 향상", "고객 신뢰가 높은 상태에서 시작", "불필요한 비교 견적 경쟁 감소"]} hasOther value={form.q9.q9_1?.value ?? ""} otherValue={form.q9.q9_1?.other} onChange={(v) => setForm({ ...form, q9: { ...form.q9, q9_1: { value: v } } })} onOtherChange={(o) => setForm({ ...form, q9: { ...form.q9, q9_1: { value: "기타", other: o } } })} />
            </SubQuestion>
          )}
          {(form.q9.value === "아니다" || form.q9.value === "전혀 아니다") && (
            <SubQuestion label="개선되기 어렵다고 생각하는 이유는?">
              <RadioGroup name="q9_2" options={["고객은 결국 가격으로 결정한다", "플랫폼만으로는 신뢰 형성이 어렵다", "기존 방식과 큰 차이가 없을 것 같다"]} hasOther value={form.q9.q9_2?.value ?? ""} otherValue={form.q9.q9_2?.other} onChange={(v) => setForm({ ...form, q9: { ...form.q9, q9_2: { value: v } } })} onOtherChange={(o) => setForm({ ...form, q9: { ...form.q9, q9_2: { value: "기타", other: o } } })} />
            </SubQuestion>
          )}
        </Question>
        <Divider />

        <Question id="q10" num="10" label="리빙시퀀스에서 업체 브랜딩 리뉴얼을 제작해드릴 예정입니다. 관심이 있으십니까?">
          <RadioGroup name="q10" options={["매우 관심 있다", "관심 있다", "보통이다", "관심 없다"]} value={form.q10.value} onChange={(v) => { setForm({ ...form, q10: { value: v, q10_2: v === "관심 없다" ? form.q10.q10_2 : undefined } }); }} />
          {form.q10.value === "관심 없다" && (
            <SubQuestion label="관심이 없는 이유는?">
              <RadioGroup name="q10_2" options={["이미 충분히 갖추고 있다", "포트폴리오보다 실제 고객 유입이 중요하다"]} hasOther value={form.q10.q10_2?.value ?? ""} otherValue={form.q10.q10_2?.other} onChange={(v) => setForm({ ...form, q10: { ...form.q10, q10_2: { value: v } } })} onOtherChange={(o) => setForm({ ...form, q10: { ...form.q10, q10_2: { value: "기타", other: o } } })} />
            </SubQuestion>
          )}
        </Question>
        <Divider />

        <Question id="q11" num="11" label="오늘 소개한 솔루션 중 가장 매력적인 것은?" optional="복수 선택 가능">
          <CheckboxGroup name="q11" options={["AI 취향 매칭 (취향Kit)", "올인원 공정관리 APP", "자동 보험 적용", "업체 브랜딩 리뉴얼"]} hasOther values={form.q11.values} otherValue={form.q11.other} onChange={(vs) => setForm({ ...form, q11: { ...form.q11, values: vs } })} onOtherChange={(o) => setForm({ ...form, q11: { ...form.q11, other: o } })} />
          <div className="mt-5">
            <div className="text-[13px] font-medium text-[var(--teal)] mb-3">
              선택한 이유를 간단히 적어주세요 <span className="text-[11px] text-[var(--muted)] font-normal ml-0.5">선택</span>
            </div>
            <textarea className="survey-textarea" placeholder="자유롭게 적어주세요" value={form.q11.reason ?? ""} onChange={(e) => setForm({ ...form, q11: { ...form.q11, reason: e.target.value } })} />
          </div>
        </Question>
        <Divider />

        <Question id="q12" num="12" label="반대로, 실효성이 낮을 것 같은 솔루션이 있다면?">
          <CheckboxGroup name="q12" options={["AI 취향 매칭 (취향Kit)", "올인원 공정관리 APP", "자동 보험 적용", "AI 콘텐츠 자동 생성", "업체 브랜딩 리뉴얼", "없다"]} values={form.q12.values} onChange={(vs) => setForm({ ...form, q12: { ...form.q12, values: vs } })} />
          {form.q12.values.length > 0 && !form.q12.values.every((v) => v === "없다") && (
            <SubQuestion label="실효성이 낮다고 생각하는 이유는?" optional>
              <textarea className="survey-textarea" placeholder="자유롭게 적어주세요" value={form.q12.reason ?? ""} onChange={(e) => setForm({ ...form, q12: { ...form.q12, reason: e.target.value } })} />
            </SubQuestion>
          )}
        </Question>
        <Divider />

        <Question id="q13" num="13" label="플랫폼을 통해 가장 개선되길 기대하는 업무는?" optional="복수 선택 가능">
          <CheckboxGroup name="q13" options={["신규 고객 확보", "초기 상담/니즈 파악", "견적~계약 과정", "시공 중 고객 소통", "시공 후 클레임/AS 관리", "브랜딩/마케팅"]} hasOther values={form.q13.values} otherValue={form.q13.other} onChange={(vs) => setForm({ ...form, q13: { ...form.q13, values: vs } })} onOtherChange={(o) => setForm({ ...form, q13: { ...form.q13, other: o } })} />
        </Question>
        <Divider />

        <QuestionTextarea num="14" label="이 플랫폼에 부족하다고 느끼는 기능이나 서비스가 있다면?" optional value={form.q14} onChange={(v) => setForm({ ...form, q14: v })} />
        <Divider />

        <Question id="q15" num="15" label="가장 우려되는 점은?" optional="복수 선택 가능">
          <CheckboxGroup name="q15" options={["실제 고객이 유입될지 불확실", "대형 플랫폼과 경쟁 가능한지", "AI 매칭의 정확도", "아직 검증되지 않은 플랫폼이라 불안", "데이터 보안/개인정보 문제"]} hasOther values={form.q15.values} otherValue={form.q15.other} onChange={(vs) => setForm({ ...form, q15: { ...form.q15, values: vs } })} onOtherChange={(o) => setForm({ ...form, q15: { ...form.q15, other: o } })} />
          {form.q15.values.includes("실제 고객이 유입될지 불확실") && (
            <SubQuestion label="어느 정도의 고객 유입이 체감되어야 신뢰가 생기겠습니까?">
              <RadioGroup name="q15_1" options={["월 1~2건이라도 실제 계약으로 이어지면", "월 5건 이상 상담 유입", "월 10건 이상 상담 유입"]} hasOther value={form.q15.q15_1?.value ?? ""} otherValue={form.q15.q15_1?.other} onChange={(v) => setForm({ ...form, q15: { ...form.q15, q15_1: { value: v } } })} onOtherChange={(o) => setForm({ ...form, q15: { ...form.q15, q15_1: { value: "기타", other: o } } })} />
            </SubQuestion>
          )}
        </Question>
        <Divider />

        <QuestionTextarea num="16" label="이 플랫폼과 함께 한다고 했을 때, 가장 불안한 시나리오는?" optional value={form.q16} onChange={(v) => setForm({ ...form, q16: v })} />
        <Divider />

        <QuestionTextarea num="17" label="추가 의견이나 제안 사항" optional value={form.q17} onChange={(v) => setForm({ ...form, q17: v })} />

      </div>

      {/* Submit + Footer */}
      <div className="px-3 pb-3 mt-2.5">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 bg-white text-[var(--dark)] rounded-2xl text-[15px] font-semibold
                     hover:bg-gray-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "제출 중..." : "제출하기"}
        </button>
      </div>

      <footer className="text-center pt-10 pb-16 bg-[var(--dark)]">
        <img src="/logo.png" alt="Living Sequence" className="h-[60px] mx-auto" />
      </footer>

      {/* Submitting overlay */}
      {submitting && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl px-8 py-6 text-center">
            <div className="w-6 h-6 border-2 border-[#111] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-[#111]">제출 중입니다...</p>
            <p className="text-xs text-[#999] mt-1">잠시만 기다려주세요</p>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={() => setModal({ ...modal, show: false })}>
          <div className="bg-white rounded-2xl p-6 mx-6 max-w-[320px] w-full" onClick={(e) => e.stopPropagation()}>
            <p className="text-[15px] font-medium text-[var(--dark)] mb-5 leading-relaxed">{modal.message}</p>
            <button
              className="w-full py-3 bg-[var(--dark)] text-white rounded-xl text-sm font-medium"
              onClick={() => {
                setModal({ ...modal, show: false });
                const el = document.getElementById(modal.qId);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              이동하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */

function Section({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return (
    <div
      className={`bg-[var(--card)] mx-3 rounded-[20px] px-6 py-9 ${
        first ? "mt-0 rounded-t-none" : "mt-2.5"
      }`}
    >
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-[var(--border)] my-14" />;
}

function Question({
  num,
  label,
  optional,
  children,
  id,
}: {
  num: string;
  label: string;
  optional?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="mb-11 last:mb-0">
      <div className="font-figtree text-[11px] font-bold text-[#999] mb-2.5 tracking-[0.5px]">{num}</div>
      <div className="text-[15px] font-medium mb-[18px] leading-relaxed text-[var(--dark)]">
        {label}
        {optional && <span className="text-[11px] text-[var(--muted)] font-normal ml-0.5"> {optional}</span>}
      </div>
      {children}
    </div>
  );
}

function QuestionTextarea({
  id,
  num,
  label,
  optional,
  value,
  onChange,
}: {
  id?: string;
  num: string;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Question id={id} num={num} label={label} optional={optional ? "선택" : undefined}>
      <textarea
        className="survey-textarea"
        placeholder="자유롭게 적어주세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Question>
  );
}

function QuestionRadio({
  id,
  num,
  label,
  options,
  hasOther,
  value,
  onChange,
}: {
  id?: string;
  num: string;
  label: string;
  options: string[];
  hasOther?: boolean;
  value: RadioAnswer;
  onChange: (v: RadioAnswer) => void;
}) {
  return (
    <Question id={id} num={num} label={label}>
      <RadioGroup
        name={`main-${num}`}
        options={options}
        hasOther={hasOther}
        value={value.value}
        otherValue={value.other}
        onChange={(v) => onChange({ value: v })}
        onOtherChange={(o) => onChange({ value: "기타", other: o })}
      />
    </Question>
  );
}

function RadioGroup({
  name,
  options,
  hasOther,
  value,
  otherValue,
  onChange,
  onOtherChange,
}: {
  name: string;
  options: string[];
  hasOther?: boolean;
  value: string;
  otherValue?: string;
  onChange: (v: string) => void;
  onOtherChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-center px-[18px] py-[15px] rounded-[14px] text-sm cursor-pointer
                      transition-all active:scale-[0.98] min-h-[50px] border-[1.5px]
                      ${value === opt
                        ? "bg-[var(--dark)] text-white border-[var(--dark)]"
                        : "bg-[var(--bg)] text-[var(--teal)] border-transparent"
                      }`}
          onClick={(e) => { e.preventDefault(); onChange(value === opt ? "" : opt); }}
        >
          <span className={`w-[20px] h-[20px] mr-3 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
            value === opt ? "border-white" : "border-[#ccc]"
          }`}>
            {value === opt && <span className="w-[10px] h-[10px] rounded-full bg-white" />}
          </span>
          {opt}
        </label>
      ))}
      {hasOther && (
        <label
          className={`flex items-center flex-wrap px-[18px] py-[15px] rounded-[14px] text-sm cursor-pointer
                      transition-all active:scale-[0.98] min-h-[50px] border-[1.5px]
                      ${value === "기타"
                        ? "bg-[var(--dark)] text-white border-[var(--dark)]"
                        : "bg-[var(--bg)] text-[var(--teal)] border-transparent"
                      }`}
          onClick={(e) => { e.preventDefault(); onChange(value === "기타" ? "" : "기타"); }}
        >
          <span className={`w-[20px] h-[20px] mr-3 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
            value === "기타" ? "border-white" : "border-[#ccc]"
          }`}>
            {value === "기타" && <span className="w-[10px] h-[10px] rounded-full bg-white" />}
          </span>
          기타
          <input
            type="text"
            className={`w-full basis-full border-0 border-b rounded-none py-1.5 text-sm mt-1.5 outline-none bg-transparent font-[inherit]
                        ${value === "기타"
                          ? "border-white/30 text-white placeholder:text-white/40"
                          : "border-[var(--border)] text-inherit placeholder:text-[var(--muted)]"
                        }`}
            placeholder="직접 입력"
            value={otherValue ?? ""}
            onClick={(e) => e.stopPropagation()}
            onFocus={() => { if (value !== "기타") onChange("기타"); }}
            onChange={(e) => onOtherChange?.(e.target.value)}
          />
        </label>
      )}
    </div>
  );
}

function CheckboxGroup({
  name,
  options,
  hasOther,
  values,
  otherValue,
  onChange,
  onOtherChange,
}: {
  name: string;
  options: string[];
  hasOther?: boolean;
  values: string[];
  otherValue?: string;
  onChange: (vs: string[]) => void;
  onOtherChange?: (v: string) => void;
}) {
  const toggle = (opt: string) => {
    if (values.includes(opt)) {
      onChange(values.filter((v) => v !== opt));
    } else {
      onChange([...values, opt]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-center px-[18px] py-[15px] rounded-[14px] text-sm cursor-pointer
                      transition-all active:scale-[0.98] min-h-[50px] border-[1.5px]
                      ${values.includes(opt)
                        ? "bg-[var(--dark)] text-white border-[var(--dark)]"
                        : "bg-[var(--bg)] text-[var(--teal)] border-transparent"
                      }`}
          onClick={(e) => { e.preventDefault(); toggle(opt); }}
        >
          <span className={`w-[20px] h-[20px] mr-3 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
            values.includes(opt) ? "border-white" : "border-[#ccc]"
          }`}>
            {values.includes(opt) && <span className="w-[10px] h-[10px] rounded-full bg-white" />}
          </span>
          {opt}
        </label>
      ))}
      {hasOther && (
        <label
          className={`flex items-center flex-wrap px-[18px] py-[15px] rounded-[14px] text-sm cursor-pointer
                      transition-all active:scale-[0.98] min-h-[50px] border-[1.5px]
                      ${values.includes("기타")
                        ? "bg-[var(--dark)] text-white border-[var(--dark)]"
                        : "bg-[var(--bg)] text-[var(--teal)] border-transparent"
                      }`}
          onClick={(e) => { e.preventDefault(); toggle("기타"); }}
        >
          <span className={`w-[20px] h-[20px] mr-3 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
            values.includes("기타") ? "border-white" : "border-[#ccc]"
          }`}>
            {values.includes("기타") && <span className="w-[10px] h-[10px] rounded-full bg-white" />}
          </span>
          기타
          <input
            type="text"
            className={`w-full basis-full border-0 border-b rounded-none py-1.5 text-sm mt-1.5 outline-none bg-transparent font-[inherit]
                        ${values.includes("기타")
                          ? "border-white/30 text-white placeholder:text-white/40"
                          : "border-[var(--border)] text-inherit placeholder:text-[var(--muted)]"
                        }`}
            placeholder="직접 입력"
            value={otherValue ?? ""}
            onFocus={() => { if (!values.includes("기타")) toggle("기타"); }}
            onChange={(e) => onOtherChange?.(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </label>
      )}
    </div>
  );
}

function SubQuestion({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="mt-3.5 p-5 bg-[var(--bg)] rounded-[14px] animate-[fadeIn_0.25s_ease]">
      <div className="text-[13px] font-medium text-[var(--teal)] mb-3">{label}{optional && <span className="text-[11px] text-[var(--muted)] font-normal ml-1">선택</span>}</div>
      {children}
    </div>
  );
}
