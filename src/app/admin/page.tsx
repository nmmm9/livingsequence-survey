"use client";

import { useState } from "react";

interface SurveyRow {
  id: string;
  responses: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
}

const QUESTIONS: Record<string, string> = {
  q1: "01. 리빙시퀀스의 첫인상",
  q2: "02. 고객이 인테리어 업체 선택 시 가장 중요한 기준",
  q3: "03. 계약이 무산된 가장 흔한 이유",
  q4: "04. 시공 후 고객 불만 시 어려웠던 점",
  q5: "05. 인테리어 시장에서 가장 시급히 바뀌어야 할 것",
  q6: "06. 대표님의 가장 큰 업무 고민 (선택)",
  q7: "07. 취향Kit으로 초기 상담 시간 단축 여부",
  q8: "08. 취향Kit에 있으면 좋겠는 고객 정보",
  q9: "09. 매칭 추천 리스트의 계약 전환 도움 여부",
  q10: "10. 브랜드 프로필 제작 관심 여부",
  q11: "11. 가장 매력적인 솔루션 (복수)",
  q12: "12. 실효성 낮은 솔루션",
  q13: "13. 가장 개선 기대 업무 (복수)",
  q14: "14. 부족한 기능/서비스",
  q15: "15. 가장 우려되는 점 (복수)",
  q16: "16. 가장 불안한 시나리오",
  q17: "17. 추가 의견/제안",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<SurveyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<SurveyRow | null>(null);

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
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 w-[340px]">
          <h1 className="text-lg font-semibold mb-1">관리자 로그인</h1>
          <p className="text-sm text-[#999] mb-6">응답을 확인하려면 비밀번호를 입력하세요.</p>
          <input
            type="password"
            className="w-full px-4 py-3 border border-[#eee] rounded-xl text-sm outline-none focus:border-[#333] transition-colors mb-3"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchData()}
          />
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <button
            onClick={fetchData}
            disabled={loading || !password}
            className="w-full py-3 bg-[#111] text-white rounded-xl text-sm font-medium
                       hover:bg-[#333] transition-colors disabled:opacity-40"
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <header className="bg-[#111] text-white px-6 py-5 flex items-center justify-between">
        <div>
          <div className="font-figtree text-[10px] font-semibold tracking-[4px] uppercase text-white/40">
            Living Sequence
          </div>
          <h1 className="font-figtree text-lg font-light mt-1">Survey Responses</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/60">총 {data.length}건</span>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-white/10 rounded-lg text-xs hover:bg-white/20 transition-colors"
          >
            새로고침
          </button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto p-4">
        {/* Response List */}
        {!selected ? (
          <div className="grid gap-3">
            {data.map((row, i) => (
              <button
                key={row.id}
                onClick={() => setSelected(row)}
                className="bg-white rounded-2xl p-5 text-left hover:shadow-md transition-shadow w-full"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-figtree text-xs font-bold text-[#999]">
                    #{data.length - i}
                  </span>
                  <span className="text-xs text-[#999]">
                    {new Date(row.created_at).toLocaleString("ko-KR")}
                  </span>
                </div>
                <p className="text-sm text-[#333] line-clamp-2">
                  {formatPreview(row.responses.q1)}
                </p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {formatTags(row.responses)}
                </div>
              </button>
            ))}
            {data.length === 0 && (
              <div className="text-center py-20 text-[#999] text-sm">
                아직 응답이 없습니다.
              </div>
            )}
          </div>
        ) : (
          /* Detail View */
          <div>
            <button
              onClick={() => setSelected(null)}
              className="mb-4 px-4 py-2 bg-white rounded-xl text-sm text-[#333] hover:bg-[#eee] transition-colors"
            >
              ← 목록으로
            </button>
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#eee]">
                <h2 className="text-base font-semibold">응답 상세</h2>
                <span className="text-xs text-[#999]">
                  {new Date(selected.created_at).toLocaleString("ko-KR")}
                </span>
              </div>
              <div className="space-y-6">
                {Object.entries(QUESTIONS).map(([key, label]) => {
                  const answer = selected.responses[key];
                  if (answer === null || answer === undefined || answer === "") return null;
                  return (
                    <div key={key}>
                      <div className="text-xs font-medium text-[#999] mb-1.5">{label}</div>
                      <div className="text-sm text-[#111] leading-relaxed">
                        {renderAnswer(key, answer)}
                      </div>
                    </div>
                  );
                })}
              </div>
              {selected.metadata && Object.keys(selected.metadata).length > 0 && (
                <div className="mt-6 pt-4 border-t border-[#eee]">
                  <div className="text-xs text-[#999]">
                    소요시간: {formatTime(selected.metadata.completionTimeSeconds as number)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatPreview(val: unknown): string {
  if (typeof val === "string") return val;
  return "응답 있음";
}

function formatTags(responses: Record<string, unknown>) {
  const tags: string[] = [];
  const q2 = responses.q2 as { value?: string } | undefined;
  if (q2?.value) tags.push(q2.value);
  const q7 = responses.q7 as { value?: string } | undefined;
  if (q7?.value) tags.push(`상담시간: ${q7.value}`);
  const q10 = responses.q10 as { value?: string } | undefined;
  if (q10?.value) tags.push(`프로필: ${q10.value}`);
  return tags.slice(0, 3).map((t) => (
    <span key={t} className="px-2.5 py-1 bg-[#f7f7f7] rounded-lg text-[11px] text-[#666]">
      {t}
    </span>
  ));
}

function renderAnswer(key: string, answer: unknown): React.ReactNode {
  if (typeof answer === "string") return <p className="whitespace-pre-wrap">{answer}</p>;

  if (typeof answer === "object" && answer !== null) {
    const obj = answer as Record<string, unknown>;

    // Radio with other
    if ("value" in obj && !("values" in obj)) {
      const parts: string[] = [];
      parts.push(obj.value as string);
      if (obj.other) parts.push(`(기타: ${obj.other})`);

      // Sub-questions
      const subKeys = Object.keys(obj).filter((k) => k.startsWith(key + "_") || k.startsWith("q"));
      const subs = subKeys.filter((k) => k !== "value" && k !== "other");
      return (
        <div>
          <p>{parts.join(" ")}</p>
          {subs.map((sk) => {
            const sub = obj[sk];
            if (!sub) return null;
            if (typeof sub === "string") return <p key={sk} className="mt-1 pl-3 border-l-2 border-[#eee] text-[#666]">{sub}</p>;
            const subObj = sub as Record<string, unknown>;
            return (
              <p key={sk} className="mt-1 pl-3 border-l-2 border-[#eee] text-[#666]">
                → {String(subObj.value)}{subObj.other ? ` (${String(subObj.other)})` : ""}
              </p>
            );
          })}
        </div>
      );
    }

    // Checkbox
    if ("values" in obj) {
      const vals = obj.values as string[];
      return (
        <div>
          <div className="flex gap-1.5 flex-wrap">
            {vals.map((v) => (
              <span key={v} className="px-2.5 py-1 bg-[#f7f7f7] rounded-lg text-[12px]">{v}</span>
            ))}
          </div>
          {obj.other ? <p className="mt-1 text-[#666]">기타: {String(obj.other)}</p> : null}
          {obj.reason ? <p className="mt-1 pl-3 border-l-2 border-[#eee] text-[#666]">{String(obj.reason)}</p> : null}
          {/* Sub-questions for checkbox (e.g., q15_1) */}
          {Object.keys(obj).filter((k) => k.startsWith("q")).map((sk) => {
            const sub = obj[sk];
            if (!sub) return null;
            const subObj = sub as Record<string, unknown>;
            return (
              <p key={sk} className="mt-1 pl-3 border-l-2 border-[#eee] text-[#666]">
                → {String(subObj.value)}{subObj.other ? ` (${String(subObj.other)})` : ""}
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
