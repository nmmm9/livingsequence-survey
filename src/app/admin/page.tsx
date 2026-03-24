"use client";

import { useState } from "react";

interface SurveyRow {
  id: string;
  responses: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
}

const QUESTIONS: { key: string; label: string; type: "text" | "radio" | "checkbox" }[] = [
  { key: "q1", label: "리빙시퀀스의 첫인상", type: "text" },
  { key: "q2", label: "고객이 인테리어 업체 선택 시 가장 중요한 기준", type: "radio" },
  { key: "q3", label: "계약이 무산된 가장 흔한 이유", type: "text" },
  { key: "q4", label: "시공 후 고객 불만 시 어려웠던 점", type: "text" },
  { key: "q5", label: "인테리어 시장에서 가장 시급히 바뀌어야 할 것", type: "text" },
  { key: "q6", label: "대표님의 가장 큰 업무 고민", type: "text" },
  { key: "q7", label: "취향Kit으로 초기 상담 시간 단축 여부", type: "radio" },
  { key: "q8", label: "취향Kit에 있으면 좋겠는 고객 정보", type: "text" },
  { key: "q9", label: "매칭 추천 리스트의 계약 전환 도움 여부", type: "radio" },
  { key: "q10", label: "브랜드 프로필 제작 관심 여부", type: "radio" },
  { key: "q11", label: "가장 매력적인 솔루션", type: "checkbox" },
  { key: "q12", label: "실효성 낮은 솔루션", type: "checkbox" },
  { key: "q13", label: "가장 개선 기대 업무", type: "checkbox" },
  { key: "q14", label: "부족한 기능/서비스", type: "text" },
  { key: "q15", label: "가장 우려되는 점", type: "checkbox" },
  { key: "q16", label: "가장 불안한 시나리오", type: "text" },
  { key: "q17", label: "추가 의견/제안", type: "text" },
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

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/responses", {
        headers: { "x-admin-password": password },
      });
      if (res.status === 401) {
        setError("비밀번호가 틀렸습니다.");
        return;
      }
      const json = await res.json();
      setData(json);
      setAuthed(true);
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

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
                  <p className="text-[15px] text-[#111] leading-relaxed mb-3 font-medium">
                    {formatPreview(row.responses.q1)}
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {formatTags(row.responses)}
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
                  {QUESTIONS.map(({ key, label }) => {
                    const answer = selected.responses[key];
                    if (answer === null || answer === undefined || answer === "") return null;
                    return (
                      <div key={key} className="px-6 py-5">
                        <div className="text-[12px] font-semibold text-[#03C75A] mb-2 font-figtree">Q{key.slice(1)}. {label}</div>
                        <div className="text-[15px] text-[#222] leading-[1.8]">
                          {renderAnswer(key, answer)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── 질문별 ── */}
          {view === "question" && !selectedQ && (
            <div className="grid gap-3">
              {QUESTIONS.map(({ key, label, type }) => {
                const count = data.filter((r) => {
                  const a = r.responses[key];
                  if (!a) return false;
                  if (typeof a === "string") return a.length > 0;
                  if (typeof a === "object" && "value" in (a as Record<string, unknown>)) return !!(a as Record<string, unknown>).value;
                  if (typeof a === "object" && "values" in (a as Record<string, unknown>)) return ((a as Record<string, unknown>).values as string[]).length > 0;
                  return false;
                }).length;
                const rate = data.length > 0 ? Math.round((count / data.length) * 100) : 0;

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedQ(key)}
                    className="bg-white rounded-2xl p-5 text-left hover:shadow-md transition-shadow w-full"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-figtree text-xs font-bold text-[#03C75A]">Q{key.slice(1)}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        type === "text" ? "bg-blue-50 text-blue-500" : type === "radio" ? "bg-green-50 text-green-600" : "bg-purple-50 text-purple-500"
                      }`}>
                        {type === "text" ? "주관식" : type === "radio" ? "단일선택" : "복수선택"}
                      </span>
                    </div>
                    <p className="text-[14px] text-[#222] mb-3 font-medium">{label}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-[#eee] rounded-full overflow-hidden">
                        <div className="h-full bg-[#03C75A] rounded-full transition-all" style={{ width: `${rate}%` }} />
                      </div>
                      <span className="text-xs text-[#666] font-figtree font-semibold">{count}/{data.length} <span className="text-[#999] font-normal">({rate}%)</span></span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── 질문별: 상세 ── */}
          {view === "question" && selectedQ && (
            <div>
              <button
                onClick={() => setSelectedQ(null)}
                className="mb-4 px-4 py-2 bg-white rounded-xl text-sm text-[#666] hover:bg-[#eee] transition-colors"
              >
                ← 질문 목록으로
              </button>

              {(() => {
                const q = QUESTIONS.find((q) => q.key === selectedQ)!;
                const answers = data
                  .map((r) => ({ answer: r.responses[selectedQ], time: r.created_at }))
                  .filter((a) => {
                    if (!a.answer) return false;
                    if (typeof a.answer === "string") return a.answer.length > 0;
                    return true;
                  });

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
                const total = answers.length || 1;

                return (
                  <div className="bg-white rounded-2xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-[#f0f0f0]">
                      <div className="text-[12px] font-semibold text-[#03C75A] mb-1 font-figtree">Q{selectedQ.slice(1)}</div>
                      <h2 className="text-[16px] font-semibold text-[#111]">{q.label}</h2>
                      <div className="text-xs text-[#999] mt-1.5">
                        <span className="text-[#03C75A] font-semibold">{answers.length}명</span> 응답 / 전체 {data.length}명
                      </div>
                    </div>

                    {/* Bar chart */}
                    {(q.type === "radio" || q.type === "checkbox") && sortedCounts.length > 0 && (
                      <div className="px-6 py-6 border-b border-[#f0f0f0]">
                        <div className="space-y-4">
                          {sortedCounts.map(([label, count], idx) => {
                            const pct = Math.round((count / total) * 100);
                            const color = COLORS[idx % COLORS.length];
                            return (
                              <div key={label}>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[14px] text-[#222] font-medium">{label}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-semibold font-figtree" style={{ color }}>{pct}%</span>
                                    <span className="text-[12px] text-[#999] font-figtree">{count}명</span>
                                  </div>
                                </div>
                                <div className="h-3 bg-[#f0f0f0] rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{ width: `${pct}%`, backgroundColor: color }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Individual answers */}
                    <div>
                      <div className="px-6 py-3 bg-[#fafafa] border-b border-[#f0f0f0]">
                        <span className="text-[12px] text-[#999] font-medium">개별 응답</span>
                      </div>
                      <div className="divide-y divide-[#f0f0f0]">
                        {answers.map(({ answer, time }, i) => (
                          <div key={i} className="px-6 py-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[12px] font-semibold text-[#03C75A] font-figtree">
                                응답 {answers.length - i}
                              </span>
                              <span className="text-[11px] text-[#bbb]">
                                {new Date(time).toLocaleString("ko-KR")}
                              </span>
                            </div>
                            <div className="text-[15px] text-[#222] leading-[1.8]">
                              {renderAnswer(selectedQ, answer)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
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

function formatTags(responses: Record<string, unknown>) {
  const tags: string[] = [];
  const q2 = responses.q2 as { value?: string } | undefined;
  if (q2?.value) tags.push(q2.value);
  const q7 = responses.q7 as { value?: string } | undefined;
  if (q7?.value) tags.push(q7.value);
  const q10 = responses.q10 as { value?: string } | undefined;
  if (q10?.value) tags.push(q10.value);
  return tags.slice(0, 3).map((t, i) => (
    <span key={`${i}-${t}`} className="px-2.5 py-1 bg-[#f0f5f0] rounded-lg text-[11px] text-[#03C75A] font-medium">{t}</span>
  ));
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
