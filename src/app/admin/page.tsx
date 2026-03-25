"use client";

import { useState, useEffect, useCallback } from "react";

interface DashboardData {
  total: number;
  active: number;
  trial: number;
  kakao: number;
  mms: number;
  today: number;
}

interface UserRow {
  id: string;
  name: string;
  phone: string;
  region_code: string;
  channel: string;
  plan: string;
  amount: number;
  is_active: boolean;
  joined_at: string;
  trial_ends_at: string | null;
}

interface LogRow {
  id: string;
  msg_type: string;
  status: string;
  content: string;
  created_at: string;
  users: { name: string; phone: string } | null;
}

interface BenefitCandidate {
  type: string;
  content: string;
  checked: boolean;
}

const REGION_NAMES: Record<string, string> = {
  seoul: "서울", busan: "부산", daegu: "대구", incheon: "인천",
  gwangju: "광주", daejeon: "대전", ulsan: "울산", sejong: "세종",
  gyeonggi: "경기", gangwon: "강원", chungbuk: "충북", chungnam: "충남",
  jeonbuk: "전북", jeonnam: "전남", gyeongbuk: "경북", gyeongnam: "경남",
  jeju: "제주",
};

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"dashboard" | "users" | "logs" | "benefits" | "send">("dashboard");

  // Dashboard
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  // Users
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);

  // Logs
  const [logs, setLogs] = useState<LogRow[]>([]);

  // Benefits
  const [candidates, setCandidates] = useState<BenefitCandidate[]>([]);
  const [benefitsLoading, setBenefitsLoading] = useState(false);
  const [benefitsSaved, setBenefitsSaved] = useState(false);

  // Send
  const [sendUserId, setSendUserId] = useState("");
  const [sendResult, setSendResult] = useState("");
  const [sendAllResult, setSendAllResult] = useState("");
  const [sending, setSending] = useState(false);

  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  // 세션 복원
  useEffect(() => {
    const saved = sessionStorage.getItem("admin-token");
    if (saved) setToken(saved);
  }, []);

  // 로그인
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      sessionStorage.setItem("admin-token", data.token);
    } else {
      setLoginError(data.error);
    }
  }

  // 데이터 로드
  const loadDashboard = useCallback(async () => {
    const res = await fetch("/api/admin/dashboard");
    setDashboard(await res.json());
  }, []);

  const loadUsers = useCallback(async (page: number) => {
    const res = await fetch(`/api/admin/users?page=${page}`);
    const data = await res.json();
    setUsers(data.users);
    setUsersTotalPages(data.totalPages);
    setUsersPage(data.page);
  }, []);

  const loadLogs = useCallback(async () => {
    const res = await fetch("/api/admin/logs");
    const data = await res.json();
    setLogs(data.logs);
  }, []);

  useEffect(() => {
    if (!token) return;
    if (tab === "dashboard") loadDashboard();
    if (tab === "users") loadUsers(1);
    if (tab === "logs") loadLogs();
    if (tab === "send") loadUsers(1);
  }, [token, tab, loadDashboard, loadUsers, loadLogs]);

  // 혜택 AI 생성
  async function generateBenefits() {
    setBenefitsLoading(true);
    setBenefitsSaved(false);
    const res = await fetch("/api/admin/benefits-review");
    const data = await res.json();
    setCandidates(
      (data.candidates || []).map((c: { type: string; content: string }) => ({
        ...c,
        checked: true,
      }))
    );
    setBenefitsLoading(false);
  }

  // 혜택 저장
  async function saveBenefits() {
    const selected = candidates.filter((c) => c.checked);
    if (selected.length === 0) {
      showToast("선택된 항목이 없습니다");
      return;
    }
    const res = await fetch("/api/admin/benefits-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ benefits: selected }),
    });
    if (res.ok) {
      const data = await res.json();
      setBenefitsSaved(true);
      showToast(`${data.saved}개 혜택이 저장됐습니다`);
    }
  }

  // 테스트 발송
  async function handleSendTest() {
    if (!sendUserId.trim()) return;
    setSending(true);
    setSendResult("");
    try {
      const res = await fetch("/api/admin/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: sendUserId }),
      });
      const data = await res.json();
      setSendResult(res.ok ? `${data.phone}에 발송 성공` : data.error);
    } catch {
      setSendResult("발송 실패");
    }
    setSending(false);
  }

  // 전체 발송
  async function handleSendAll() {
    if (!confirm("전체 활성 구독자에게 발송하시겠습니까?")) return;
    setSending(true);
    setSendAllResult("발송 중...");
    try {
      const res = await fetch("/api/admin/send-all", { method: "POST" });
      const data = await res.json();
      setSendAllResult(`성공: ${data.sent}건 / 실패: ${data.failed}건`);
    } catch {
      setSendAllResult("발송 실패");
    }
    setSending(false);
  }

  // 로그인 전
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-1">챙겨드림 관리자</h1>
          <p className="text-sm text-gray-500 mb-6">비밀번호를 입력해주세요</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-gray-900 mb-3"
          />
          {loginError && <p className="text-red-500 text-sm mb-3">{loginError}</p>}
          <button className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold py-3 rounded-full transition-colors">
            로그인
          </button>
        </form>
      </div>
    );
  }

  const tabs = [
    { key: "dashboard", label: "대시보드" },
    { key: "users", label: "구독자" },
    { key: "logs", label: "발송 로그" },
    { key: "benefits", label: "혜택 검토" },
    { key: "send", label: "수동 발송" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-100">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-gray-900">🧡 챙겨드림 관리자</span>
          <button
            onClick={() => { setToken(null); sessionStorage.removeItem("admin-token"); }}
            className="text-sm text-gray-500"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* 탭 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === t.key
                  ? "border-[#FF6B35] text-[#FF6B35]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* 대시보드 */}
        {tab === "dashboard" && dashboard && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "전체 구독자", value: dashboard.total, color: "bg-gray-900" },
              { label: "활성 구독자", value: dashboard.active, color: "bg-green-600" },
              { label: "무료체험 중", value: dashboard.trial, color: "bg-[#FF6B35]" },
              { label: "카카오톡", value: dashboard.kakao, color: "bg-yellow-500" },
              { label: "문자(MMS)", value: dashboard.mms, color: "bg-blue-500" },
              { label: "오늘 신규", value: dashboard.today, color: "bg-purple-600" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-5 border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                <div className={`w-8 h-1 ${item.color} rounded-full mt-2`} />
              </div>
            ))}
          </div>
        )}

        {/* 구독자 목록 */}
        {tab === "users" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["이름", "전화번호", "지역", "플랜", "금액", "상태", "가입일"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                      <td className="px-4 py-3 text-gray-600">{u.phone}</td>
                      <td className="px-4 py-3 text-gray-600">{REGION_NAMES[u.region_code] || u.region_code}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {u.channel === "kakao" ? "카카오" : "문자"} · {u.plan === "yearly" ? "연간" : "월간"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.amount.toLocaleString()}원</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            u.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {u.is_active ? "활성" : "해지"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(u.joined_at).toLocaleDateString("ko-KR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* 페이지네이션 */}
            <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
              <button
                onClick={() => loadUsers(usersPage - 1)}
                disabled={usersPage <= 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-30"
              >
                이전
              </button>
              <span className="text-sm text-gray-500">
                {usersPage} / {usersTotalPages}
              </span>
              <button
                onClick={() => loadUsers(usersPage + 1)}
                disabled={usersPage >= usersTotalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-30"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* 발송 로그 */}
        {tab === "logs" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["이름", "전화번호", "채널", "상태", "발송일시"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        발송 로그가 없습니다
                      </td>
                    </tr>
                  ) : (
                    logs.map((l) => (
                      <tr key={l.id} className="border-b border-gray-100">
                        <td className="px-4 py-3 text-gray-900">{l.users?.name || "-"}</td>
                        <td className="px-4 py-3 text-gray-600">{l.users?.phone || "-"}</td>
                        <td className="px-4 py-3 text-gray-600">{l.msg_type}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              l.status === "sent"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {l.status === "sent" ? "성공" : "실패"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(l.created_at).toLocaleString("ko-KR")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 혜택 검토 */}
        {tab === "benefits" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">혜택 검토</h2>
              <button
                onClick={generateBenefits}
                disabled={benefitsLoading}
                className="bg-[#FF6B35] hover:bg-[#e55a2b] disabled:bg-gray-300 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                {benefitsLoading ? "생성 중..." : "AI 혜택 후보 생성"}
              </button>
            </div>

            {candidates.length > 0 && (
              <>
                <div className="space-y-2">
                  {candidates.map((c, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                        c.checked
                          ? "bg-white border-[#FF6B35]/30"
                          : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                    >
                      <button
                        onClick={() => {
                          const updated = [...candidates];
                          updated[i] = { ...updated[i], checked: !updated[i].checked };
                          setCandidates(updated);
                        }}
                        className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          c.checked
                            ? "bg-[#FF6B35] border-[#FF6B35] text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {c.checked && "✓"}
                      </button>
                      <div className="flex-1">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            c.type === "national"
                              ? "bg-gray-900 text-white"
                              : "bg-green-700 text-white"
                          }`}
                        >
                          {c.type === "national" ? "전국" : "부산"}
                        </span>
                        <p className="text-sm text-gray-800 mt-2 leading-relaxed">
                          {c.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={saveBenefits}
                  disabled={benefitsSaved}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-full transition-colors"
                >
                  {benefitsSaved ? "저장 완료 ✓" : `검토 완료 — ${candidates.filter((c) => c.checked).length}개 저장`}
                </button>
              </>
            )}
          </div>
        )}

        {/* 수동 발송 */}
        {tab === "send" && (
          <div className="space-y-6">
            {/* 테스트 발송 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">테스트 발송</h2>
              <p className="text-sm text-gray-500 mb-4">
                특정 구독자에게 오늘의 카드를 테스트 발송합니다.
              </p>
              <div className="flex gap-2">
                <select
                  value={sendUserId}
                  onChange={(e) => setSendUserId(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-gray-900 bg-white text-sm"
                >
                  <option value="">구독자 선택</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.phone})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSendTest}
                  disabled={sending || !sendUserId}
                  className="bg-[#FF6B35] hover:bg-[#e55a2b] disabled:bg-gray-300 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  {sending ? "발송 중..." : "발송"}
                </button>
              </div>
              {sendResult && (
                <p className="text-sm mt-3 text-gray-600">{sendResult}</p>
              )}
            </div>

            {/* 전체 발송 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">전체 발송</h2>
              <p className="text-sm text-gray-500 mb-4">
                모든 활성 구독자에게 오늘의 카드를 수동 발송합니다.
              </p>
              <button
                onClick={handleSendAll}
                disabled={sending}
                className="w-full border-2 border-[#FF6B35] text-[#FF6B35] font-semibold py-3 rounded-full hover:bg-orange-50 transition-colors disabled:opacity-50"
              >
                {sending ? "발송 중..." : "전체 구독자 발송"}
              </button>
              {sendAllResult && (
                <p className="text-sm mt-3 text-gray-600">{sendAllResult}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
