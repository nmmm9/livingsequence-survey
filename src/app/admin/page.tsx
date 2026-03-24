"use client";

import { useState, useEffect } from "react";

interface SurveyRow {
  id: string;
  responses: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface QuestionDef {
  key: string;
  label: string;
  type: "text" | "radio" | "checkbox";
  options?: string[];
}

const QUESTIONS: QuestionDef[] = [
  { key: "q1", label: "오늘 발표를 듣고, 리빙시퀀스의 첫인상을 자유롭게 표현해주세요.", type: "text" },
  { key: "q2", label: "대표님이 생각하시기에, 고객이 인테리어 업체를 선택할 때 가장 중요하게 보는 기준은 무엇입니까?", type: "radio", options: ["가격/견적", "시공 사례/포트폴리오", "지인 추천/입소문", "디자인 감각/스타일 적합성", "소통/응대 속도", "기타"] },
  { key: "q3", label: "지금까지 경험 중 계약이 무산된 가장 흔한 이유는?", type: "text" },
  { key: "q4", label: "고객과의 소통 과정에서 가장 자주 발생하는 문제나 어려움은 무엇입니까?", type: "text" },
  { key: "q5", label: "현재 인테리어 시장에서 가장 시급하게 바뀌어야 한다고 느끼는 것은?", type: "text" },
  { key: "q6", label: "현재 업무 진행 시 사용하는 툴(엑셀, 노션 등)에서 가장 불편한 점은?", type: "text" },
  { key: "q7", label: "취향Kit을 통해 고객 정보, 스타일이 사전에 정리되어 전달된다면, 초기 상담 시간이 줄어들 것 같습니까?", type: "radio", options: ["매우 그렇다", "그렇다", "보통이다", "아니다", "전혀 아니다"] },
  { key: "q8", label: "취향Kit에 있으면 좋겠다고 생각하는 고객 정보가 있다면?", type: "text" },
  { key: "q9", label: "이 플랫폼을 사용하면, 기존 대비 계약 전환율이 개선될 것이라고 생각하십니까?", type: "radio", options: ["매우 그렇다", "그렇다", "보통이다", "아니다", "전혀 아니다"] },
  { key: "q10", label: "업체 브랜딩 리뉴얼에 관심이 있으십니까?", type: "radio", options: ["매우 관심 있다", "관심 있다", "보통이다", "관심 없다"] },
  { key: "q11", label: "오늘 소개한 솔루션 중 가장 매력적인 것은?", type: "checkbox", options: ["AI 취향 매칭 (취향Kit)", "올인원 공정관리 APP", "자동 보험 적용", "업체 브랜딩 리뉴얼", "기타"] },
  { key: "q12", label: "반대로, 실효성이 낮을 것 같은 솔루션이 있다면?", type: "checkbox", options: ["AI 취향 매칭 (취향Kit)", "올인원 공정관리 APP", "자동 보험 적용", "AI 콘텐츠 자동 생성", "업체 브랜딩 리뉴얼", "없다"] },
  { key: "q13", label: "플랫폼을 통해 가장 개선되길 기대하는 업무는?", type: "checkbox", options: ["신규 고객 확보", "초기 상담/니즈 파악", "견적~계약 과정", "시공 중 고객 소통", "시공 후 클레임/AS 관리", "브랜딩/마케팅", "기타"] },
  { key: "q14", label: "이 플랫폼에 부족하다고 느끼는 기능이나 서비스가 있다면?", type: "text" },
  { key: "q15", label: "가장 우려되는 점은?", type: "checkbox", options: ["실제 고객이 유입될지 불확실", "대형 플랫폼과 경쟁 가능한지", "AI 매칭의 정확도", "아직 검증되지 않은 플랫폼이라 불안", "데이터 보안/개인정보 문제", "기타"] },
  { key: "q16", label: "이 플랫폼과 함께 한다고 했을 때, 가장 불안한 시나리오는?", type: "text" },
  { key: "q17", label: "추가 의견이나 제안 사항", type: "text" },
];

const COLORS = ["#03C75A", "#2DB400", "#00B493", "#0085FF", "#6C5CE7", "#E17055", "#FDCB6E", "#636E72"];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<SurveyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"list" | "detail" | "question">("list");
  const [selected, setSelected] = useState<SurveyRow | null>(null);
  const [selectedQ, setSelectedQ] = useState<string | null>(null);

  const fetchWithPassword = async (pw: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/responses", {
        headers: { "x-admin-password": pw },
      });
      if (res.status === 401) {
        setError("비밀번호가 틀렸습니다.");
        sessionStorage.removeItem("admin_pw");
        return;
      }
      const json = await res.json();
      setData(json);
      setAuthed(true);
      sessionStorage.setItem("admin_pw", pw);
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = () => fetchWithPassword(password || sessionStorage.getItem("admin_pw") || "");

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_pw");
    if (saved) {
      setPassword(saved);
      fetchWithPassword(saved);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center px-5">
        <div className="bg-white rounded-2xl p-8 w-full max-w-[360px]">
          <div className="font-figtree text-[10px] font-semibold tracking-[4px] uppercase text-[#ccc] mb-4">Living Sequence</div>
          <h1 className="text-xl font-semibold mb-1">관리자</h1>
          <p className="text-sm text-[#999] mb-6">응답을 확인하려면 비밀번호를 입력하세요.</p>
          <input
            type="password"
            className="w-full px-4 py-3.5 border border-[#eee] rounded-xl text-sm outline-none focus:border-[#333] transition-colors mb-3"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchData()}
          />
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <button
            onClick={fetchData}
            disabled={loading || !password}
            className="w-full py-3.5 bg-[#111] text-white rounded-xl text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-40"
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
        </div>
      </div>
    );
  }

  const avgTime = data.length > 0
    ? Math.round(data.reduce((sum, r) => sum + ((r.metadata?.completionTimeSeconds as number) || 0), 0) / data.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <header className="bg-[#111] text-white">
        <div className="max-w-[1200px] mx-auto px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-figtree text-[10px] font-semibold tracking-[4px] uppercase text-white/40">Living Sequence</div>
              <h1 className="font-figtree text-xl font-light mt-1">Survey Dashboard</h1>
            </div>
            <button onClick={fetchData} className="px-4 py-2 bg-white/10 rounded-lg text-xs text-white/70 hover:bg-white/20 transition-colors">
              새로고침
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white rounded-2xl px-4 py-4">
            <div className="text-2xl font-semibold text-[#111] font-figtree">{data.length}</div>
            <div className="text-[11px] text-[#999] mt-0.5">총 응답</div>
          </div>
          <div className="bg-white rounded-2xl px-4 py-4">
            <div className="text-2xl font-semibold text-[#111] font-figtree">{avgTime ? `${Math.floor(avgTime / 60)}분` : "-"}</div>
            <div className="text-[11px] text-[#999] mt-0.5">평균 소요시간</div>
          </div>
          <div className="bg-white rounded-2xl px-4 py-4">
            <div className="text-2xl font-semibold text-[#111] font-figtree">
              {data.length > 0 ? new Date(data[0].created_at).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }) : "-"}
            </div>
            <div className="text-[11px] text-[#999] mt-0.5">최근 응답</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 bg-[#eee] rounded-xl p-1">
          <button
            onClick={() => { setView("list"); setSelected(null); setSelectedQ(null); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-colors ${view === "list" || view === "detail" ? "bg-white text-[#111] shadow-sm" : "text-[#999] hover:text-[#666]"}`}
          >
            응답자별
          </button>
          <button
            onClick={() => { setView("question"); setSelected(null); setSelectedQ(null); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-colors ${view === "question" ? "bg-white text-[#111] shadow-sm" : "text-[#999] hover:text-[#666]"}`}
          >
            질문별
          </button>
        </div>

        <div className="mt-4 pb-8">

          {/* ── 응답자별: 목록 ── */}
          {view === "list" && (
            <div className="grid gap-3">
              {data.map((row, i) => (
                <button
                  key={row.id}
                  onClick={() => { setSelected(row); setView("detail"); }}
                  className="bg-white rounded-2xl p-5 text-left hover:shadow-md transition-shadow w-full"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#03C75A] flex items-center justify-center font-figtree text-xs font-bold text-white">
                        {data.length - i}
                      </span>
                      <span className="text-xs text-[#999]">
                        {new Date(row.created_at).toLocaleString("ko-KR")}
                      </span>
                    </div>
                    {row.metadata?.completionTimeSeconds ? (
                      <span className="text-[11px] text-[#999] bg-[#f7f7f7] px-2 py-0.5 rounded-full">{formatTime(row.metadata.completionTimeSeconds as number)}</span>
                    ) : null}
                  </div>
                  {row.responses.q1 ? (
                    <p className="text-[14px] text-[#333] leading-relaxed mb-3 line-clamp-1">
                      {formatPreview(row.responses.q1)}
                    </p>
                  ) : null}
                  <div className="flex flex-col gap-1.5">
                    {formatSummary(row.responses)}
                  </div>
                </button>
              ))}
              {data.length === 0 && (
                <div className="text-center py-20 text-[#999] text-sm">아직 응답이 없습니다.</div>
              )}
            </div>
          )}

          {/* ── 응답자별: 상세 ── */}
          {view === "detail" && selected && (
            <div>
              <button
                onClick={() => { setView("list"); setSelected(null); }}
                className="mb-4 px-4 py-2 bg-white rounded-xl text-sm text-[#666] hover:bg-[#eee] transition-colors"
              >
                ← 목록으로
              </button>
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-[#eee] flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[#111]">응답 상세</h2>
                  <div className="flex items-center gap-3">
                    {selected.metadata?.completionTimeSeconds ? (
                      <span className="text-xs text-[#03C75A] bg-[#03C75A]/10 px-2.5 py-1 rounded-full font-medium">
                        {formatTime(selected.metadata.completionTimeSeconds as number)} 소요
                      </span>
                    ) : null}
                    <span className="text-xs text-[#999]">
                      {new Date(selected.created_at).toLocaleString("ko-KR")}
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-[#f0f0f0]">
                  {QUESTIONS.map((q) => {
                    const answer = selected.responses[q.key];
                    if (answer === null || answer === undefined || answer === "") return null;
                    return (
                      <div key={q.key} className="px-6 py-6">
                        <div className="text-[12px] font-semibold text-[#03C75A] mb-1.5 font-figtree">Q{q.key.slice(1)}</div>
                        <div className="text-[16px] font-semibold text-[#111] mb-4 leading-relaxed">{q.label}</div>
                        <div className="text-[15px] text-[#222] leading-[1.8]">
                          {renderDetailAnswer(q, answer)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── 질문별: 한 페이지에 모두 펼쳐서 ── */}
          {view === "question" && (
            <div className="grid gap-4">
              {QUESTIONS.map((q) => {
                const answers = data
                  .map((r, idx) => ({ answer: r.responses[q.key], num: data.length - idx }))
                  .filter((a) => {
                    if (!a.answer) return false;
                    if (typeof a.answer === "string") return a.answer.length > 0;
                    if (typeof a.answer === "object" && "value" in (a.answer as Record<string, unknown>)) return !!(a.answer as Record<string, unknown>).value;
                    if (typeof a.answer === "object" && "values" in (a.answer as Record<string, unknown>)) return ((a.answer as Record<string, unknown>).values as string[]).length > 0;
                    return false;
                  });

                if (answers.length === 0) return null;

                // 객관식: 통계
                const valueCounts: Record<string, number> = {};
                if (q.type === "radio") {
                  answers.forEach(({ answer }) => {
                    const val = (answer as Record<string, unknown>).value as string;
                    if (val) valueCounts[val] = (valueCounts[val] || 0) + 1;
                  });
                } else if (q.type === "checkbox") {
                  answers.forEach(({ answer }) => {
                    const vals = (answer as Record<string, unknown>).values as string[];
                    vals?.forEach((v) => { valueCounts[v] = (valueCounts[v] || 0) + 1; });
                  });
                }
                const sortedCounts = Object.entries(valueCounts).sort((a, b) => b[1] - a[1]);
                const maxCount = sortedCounts.length > 0 ? sortedCounts[0][1] : 1;

                return (
                  <div key={q.key} className="bg-white rounded-2xl overflow-hidden">
                    {/* 질문 헤더 */}
                    <div className="px-6 py-5 border-b border-[#f0f0f0]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-figtree text-[12px] font-bold text-[#03C75A]">Q{q.key.slice(1)}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          q.type === "text" ? "bg-blue-50 text-blue-500" : q.type === "radio" ? "bg-green-50 text-green-600" : "bg-purple-50 text-purple-500"
                        }`}>
                          {q.type === "text" ? "주관식" : q.type === "radio" ? "단일선택" : "복수선택"}
                        </span>
                      </div>
                      <h3 className="text-[15px] font-semibold text-[#111] leading-relaxed">{q.label}</h3>
                      <div className="text-[12px] text-[#999] mt-1"><span className="text-[#03C75A] font-semibold">{answers.length}</span>명 응답</div>
                    </div>

                    {/* 객관식: 바 차트 */}
                    {(q.type === "radio" || q.type === "checkbox") && sortedCounts.length > 0 && (
                      <div className="px-6 py-5 border-b border-[#f0f0f0]">
                        <div className="space-y-3">
                          {sortedCounts.map(([label, count], idx) => {
                            const pct = answers.length > 0 ? Math.round((count / answers.length) * 100) : 0;
                            const colors = ["#03C75A", "#2DB400", "#00B493", "#0085FF", "#6C5CE7", "#E17055", "#FDCB6E", "#636E72"];
                            const color = colors[idx % colors.length];
                            return (
                              <div key={label}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[13px] text-[#222]">{label}</span>
                                  <span className="text-[12px] font-semibold font-figtree" style={{ color }}>{pct}% <span className="text-[#999] font-normal">({count}명)</span></span>
                                </div>
                                <div className="h-2.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: color }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 주관식: 답변 나열 */}
                    {q.type === "text" && (
                      <div className="px-6 py-4">
                        <div className="space-y-2">
                          {answers.map(({ answer }, i) => (
                            <div key={i} className="py-1.5 border-b border-[#f5f5f5] last:border-0">
                              <p className="text-[14px] text-[#333] leading-relaxed">{typeof answer === "string" ? answer : JSON.stringify(answer)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 객관식: 기타/하위응답 있는 것만 펼쳐서 */}
                    {(q.type === "radio" || q.type === "checkbox") && (() => {
                      const extras = answers.filter(({ answer }) => {
                        const obj = answer as Record<string, unknown>;
                        if (obj.other) return true;
                        if (obj.reason) return true;
                        const subs = Object.keys(obj).filter((k) => k.startsWith("q"));
                        return subs.some((k) => !!obj[k]);
                      });
                      if (extras.length === 0) return null;
                      return (
                        <div className="px-6 py-4 border-t border-[#f0f0f0]">
                          <div className="text-[11px] text-[#999] font-medium mb-3">추가 응답</div>
                          <div className="space-y-3">
                            {extras.map(({ answer, num }, i) => {
                              const obj = answer as Record<string, unknown>;
                              const mainVal = obj.value ? String(obj.value) : (obj.values as string[] | undefined)?.join(", ");
                              const otherText = obj.other ? String(obj.other) : null;
                              const reasonText = obj.reason ? String(obj.reason) : null;
                              const subAnswers: { value: string; other?: string }[] = [];
                              Object.keys(obj).filter((k) => k.startsWith("q")).forEach((k) => {
                                const sub = obj[k] as Record<string, unknown> | null;
                                if (sub) subAnswers.push({ value: String(sub.value), other: sub.other ? String(sub.other) : undefined });
                              });
                              if (!otherText && !reasonText && subAnswers.length === 0) return null;
                              return (
                                <div key={i} className="bg-[#fafafa] rounded-xl px-4 py-3">
                                  {mainVal && (
                                    <div className="mb-2">
                                      <span className="text-[12px] text-[#666]">{mainVal}</span>
                                    </div>
                                  )}
                                  <div className="space-y-1.5">
                                    {otherText && (
                                      <div className="flex items-start gap-2">
                                        <span className="text-[11px] text-[#999] shrink-0 mt-px">기타</span>
                                        <span className="text-[13px] text-[#333]">{otherText}</span>
                                      </div>
                                    )}
                                    {reasonText && (
                                      <div className="flex items-start gap-2">
                                        <span className="text-[11px] text-[#999] shrink-0 mt-px">이유</span>
                                        <span className="text-[13px] text-[#333]">{reasonText}</span>
                                      </div>
                                    )}
                                    {subAnswers.map((sub, si) => (
                                      <div key={si} className="flex items-start gap-2">
                                        <span className="text-[11px] text-[#999] shrink-0 mt-px">추가</span>
                                        <span className="text-[13px] text-[#333]">{sub.value}{sub.other ? <span className="text-[#999]"> ({sub.other})</span> : ""}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatPreview(val: unknown): string {
  if (typeof val === "string") return val || "응답 없음";
  return "응답 있음";
}

function formatSummary(responses: Record<string, unknown>) {
  const items: { label: string; value: string }[] = [];

  const q2 = responses.q2 as { value?: string; other?: string } | undefined;
  if (q2?.value) items.push({ label: "선택기준", value: q2.value === "기타" ? q2.other || "기타" : q2.value });

  const q7 = responses.q7 as { value?: string } | undefined;
  if (q7?.value) items.push({ label: "상담시간 단축", value: q7.value });

  const q9 = responses.q9 as { value?: string } | undefined;
  if (q9?.value) items.push({ label: "전환율 개선", value: q9.value });

  const q10 = responses.q10 as { value?: string } | undefined;
  if (q10?.value) items.push({ label: "브랜딩 관심", value: q10.value });

  const q11 = responses.q11 as { values?: string[] } | undefined;
  if (q11?.values?.length) items.push({ label: "매력 솔루션", value: q11.values.join(", ") });

  return items.map((item, i) => (
    <div key={i} className="flex items-start gap-2 text-[12px]">
      <span className="text-[#999] shrink-0 w-[70px]">{item.label}</span>
      <span className="text-[#333] line-clamp-1">{item.value}</span>
    </div>
  ));
}

function renderDetailAnswer(q: QuestionDef, answer: unknown): React.ReactNode {
  // Text questions
  if (q.type === "text" || !q.options) {
    if (typeof answer === "string") return <p className="whitespace-pre-wrap bg-[#f9f9f9] rounded-xl px-4 py-3">{answer}</p>;
    return renderAnswer(q.key, answer);
  }

  const obj = answer as Record<string, unknown>;

  // Radio - show all options, highlight selected
  if (q.type === "radio") {
    const selected = (obj.value as string) || "";
    const otherText = obj.other as string | undefined;
    const subs = Object.keys(obj).filter((k) => k !== "value" && k !== "other" && k.startsWith("q"));

    return (
      <div>
        <div className="flex flex-col gap-2">
          {q.options.map((opt) => {
            const isSelected = selected === opt;
            return (
              <div
                key={opt}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-[#111] text-white border-[#111]"
                    : "bg-[#fafafa] text-[#bbb] border-transparent"
                }`}
              >
                <span className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected ? "border-white" : "border-[#ddd]"
                }`}>
                  {isSelected && <span className="w-[8px] h-[8px] rounded-full bg-white" />}
                </span>
                <span className="text-[14px]">{opt}</span>
                {isSelected && opt === "기타" && otherText && (
                  <span className="text-[13px] opacity-70">: {otherText}</span>
                )}
              </div>
            );
          })}
        </div>
        {subs.map((sk) => {
          const sub = obj[sk];
          if (!sub) return null;
          if (typeof sub === "string") return <p key={sk} className="mt-3 pl-4 border-l-[3px] border-[#03C75A]/20 text-[#555] text-[14px]">{sub}</p>;
          const subObj = sub as Record<string, unknown>;
          return (
            <p key={sk} className="mt-3 pl-4 border-l-[3px] border-[#03C75A]/20 text-[#555] text-[14px]">
              → {String(subObj.value)}{subObj.other ? <span className="text-[#999]"> ({String(subObj.other)})</span> : ""}
            </p>
          );
        })}
      </div>
    );
  }

  // Checkbox - show all options, highlight selected
  if (q.type === "checkbox") {
    const selectedVals = (obj.values as string[]) || [];
    const otherText = obj.other as string | undefined;
    const reason = obj.reason as string | undefined;
    const subs = Object.keys(obj).filter((k) => k.startsWith("q"));

    return (
      <div>
        <div className="flex flex-col gap-2">
          {q.options.map((opt) => {
            const isSelected = selectedVals.includes(opt);
            return (
              <div
                key={opt}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-[#111] text-white border-[#111]"
                    : "bg-[#fafafa] text-[#bbb] border-transparent"
                }`}
              >
                <span className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected ? "border-white" : "border-[#ddd]"
                }`}>
                  {isSelected && <span className="w-[8px] h-[8px] rounded-full bg-white" />}
                </span>
                <span className="text-[14px]">{opt}</span>
                {isSelected && opt === "기타" && otherText && (
                  <span className="text-[13px] opacity-70">: {otherText}</span>
                )}
              </div>
            );
          })}
        </div>
        {reason && <p className="mt-3 pl-4 border-l-[3px] border-[#03C75A]/20 text-[#555] text-[14px]">{reason}</p>}
        {subs.map((sk) => {
          const sub = obj[sk];
          if (!sub) return null;
          const subObj = sub as Record<string, unknown>;
          return (
            <p key={sk} className="mt-3 pl-4 border-l-[3px] border-[#03C75A]/20 text-[#555] text-[14px]">
              → {String(subObj.value)}{subObj.other ? <span className="text-[#999]"> ({String(subObj.other)})</span> : ""}
            </p>
          );
        })}
      </div>
    );
  }

  return renderAnswer(q.key, answer);
}

function renderAnswer(key: string, answer: unknown): React.ReactNode {
  if (typeof answer === "string") return <p className="whitespace-pre-wrap">{answer}</p>;

  if (typeof answer === "object" && answer !== null) {
    const obj = answer as Record<string, unknown>;

    if ("value" in obj && !("values" in obj)) {
      const subs = Object.keys(obj).filter((k) => k !== "value" && k !== "other" && (k.startsWith(key + "_") || k.startsWith("q")));
      return (
        <div>
          <p className="font-medium">{String(obj.value)}{obj.other ? <span className="text-[#999] font-normal"> (기타: {String(obj.other)})</span> : ""}</p>
          {subs.map((sk) => {
            const sub = obj[sk];
            if (!sub) return null;
            if (typeof sub === "string") return <p key={sk} className="mt-2 pl-4 border-l-[3px] border-[#03C75A]/20 text-[#555] text-[14px]">{sub}</p>;
            const subObj = sub as Record<string, unknown>;
            return (
              <p key={sk} className="mt-2 pl-4 border-l-[3px] border-[#03C75A]/20 text-[#555] text-[14px]">
                {String(subObj.value)}{subObj.other ? <span className="text-[#999]"> ({String(subObj.other)})</span> : ""}
              </p>
            );
          })}
        </div>
      );
    }

    if ("values" in obj) {
      const vals = obj.values as string[];
      return (
        <div>
          <div className="flex gap-2 flex-wrap">
            {vals.map((v) => (
              <span key={v} className="px-3 py-1.5 bg-[#f0f5f0] rounded-lg text-[13px] text-[#222] font-medium">{v}</span>
            ))}
          </div>
          {obj.other ? <p className="mt-2 text-[#666] text-[14px]">기타: {String(obj.other)}</p> : null}
          {obj.reason ? <p className="mt-2 pl-4 border-l-[3px] border-[#03C75A]/20 text-[#555] text-[14px]">{String(obj.reason)}</p> : null}
          {Object.keys(obj).filter((k) => k.startsWith("q")).map((sk) => {
            const sub = obj[sk];
            if (!sub) return null;
            const subObj = sub as Record<string, unknown>;
            return (
              <p key={sk} className="mt-2 pl-4 border-l-[3px] border-[#03C75A]/20 text-[#555] text-[14px]">
                {String(subObj.value)}{subObj.other ? <span className="text-[#999]"> ({String(subObj.other)})</span> : ""}
              </p>
            );
          })}
        </div>
      );
    }
  }

  return <p>{JSON.stringify(answer)}</p>;
}

function formatTime(seconds: number | undefined): string {
  if (!seconds) return "-";
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}분 ${sec}초`;
}
