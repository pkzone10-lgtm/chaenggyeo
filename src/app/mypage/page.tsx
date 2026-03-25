"use client";

import { useState } from "react";

const regions = [
  { code: "seoul", name: "서울특별시" },
  { code: "busan", name: "부산광역시" },
  { code: "daegu", name: "대구광역시" },
  { code: "incheon", name: "인천광역시" },
  { code: "gwangju", name: "광주광역시" },
  { code: "daejeon", name: "대전광역시" },
  { code: "ulsan", name: "울산광역시" },
  { code: "sejong", name: "세종특별자치시" },
  { code: "gyeonggi", name: "경기도" },
  { code: "gangwon", name: "강원특별자치도" },
  { code: "chungbuk", name: "충청북도" },
  { code: "chungnam", name: "충청남도" },
  { code: "jeonbuk", name: "전북특별자치도" },
  { code: "jeonnam", name: "전라남도" },
  { code: "gyeongbuk", name: "경상북도" },
  { code: "gyeongnam", name: "경상남도" },
  { code: "jeju", name: "제주특별자치도" },
];

const PLAN_LABELS: Record<string, string> = {
  kakao: "카카오톡",
  mms: "문자(MMS)",
  sms: "문자(SMS)",
};

const PERIOD_LABELS: Record<string, string> = {
  monthly: "월간",
  yearly: "연간",
};

interface Med {
  id?: string;
  med_name: string;
  med_time: string;
}

interface UserData {
  id: string;
  name: string;
  phone: string;
  region_code: string;
  channel: string;
  plan: string;
  amount: number;
  is_active: boolean;
  trial_ends_at: string | null;
  joined_at: string;
  medications: Med[];
}

function formatPhone(value: string) {
  const nums = value.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
  return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
}

export default function MyPage() {
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [showCancel, setShowCancel] = useState(false);

  // 약 편집
  const [meds, setMeds] = useState<{ name: string; time: string }[]>([]);
  const [medsEditing, setMedsEditing] = useState(false);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  // 로그인
  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/users/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        setUser(null);
        return;
      }
      setUser(data.user);
      setMeds(
        (data.user.medications || []).map((m: Med) => ({
          name: m.med_name,
          time: m.med_time,
        }))
      );
    } catch {
      setError("서버에 연결할 수 없습니다");
    } finally {
      setLoading(false);
    }
  }

  // 지역 변경
  async function handleRegionChange(regionCode: string) {
    if (!user) return;
    const res = await fetch("/api/users/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, regionCode }),
    });
    if (res.ok) {
      setUser({ ...user, region_code: regionCode });
      showToast("지역이 변경됐습니다");
    }
  }

  // 약 저장
  async function handleMedsSave() {
    if (!user) return;
    const res = await fetch("/api/medications/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, medications: meds }),
    });
    if (res.ok) {
      setMedsEditing(false);
      showToast("약 설정이 변경됐습니다");
    }
  }

  // 해지
  async function handleCancel() {
    if (!user) return;
    const res = await fetch("/api/users/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    if (res.ok) {
      setUser({ ...user, is_active: false });
      setShowCancel(false);
      showToast("해지가 완료됐습니다");
    }
  }

  const regionName =
    regions.find((r) => r.code === user?.region_code)?.name || user?.region_code;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="text-lg font-bold text-gray-900">
            🧡 챙겨드림
          </a>
          {user && (
            <button
              onClick={() => {
                setUser(null);
                setPhone("");
              }}
              className="text-sm text-gray-500"
            >
              로그아웃
            </button>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 토스트 */}
        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm shadow-lg z-50">
            {toast}
          </div>
        )}

        {!user ? (
          /* 로그인 폼 */
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">마이페이지</h1>
            <p className="text-gray-500 mb-8">가입하신 전화번호를 입력해주세요</p>
            <form onSubmit={handleLookup}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="010-0000-0000"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 mb-3"
              />
              {error && (
                <p className="text-red-500 text-sm mb-3">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-full transition-colors"
              >
                {loading ? "확인 중..." : "확인"}
              </button>
            </form>
          </div>
        ) : (
          /* 마이페이지 내용 */
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {user.name}님의 마이페이지
            </h1>

            {/* 구독 현황 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">구독 현황</h2>
              {!user.is_active && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">
                  현재 구독이 해지된 상태입니다
                </div>
              )}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">플랜</span>
                  <span className="font-semibold text-gray-900">
                    {PLAN_LABELS[user.channel] || user.channel} ·{" "}
                    {PERIOD_LABELS[user.plan] || user.plan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">구독료</span>
                  <span className="font-semibold text-gray-900">
                    {user.amount.toLocaleString()}원
                    /{user.plan === "yearly" ? "년" : "월"}
                  </span>
                </div>
                {user.trial_ends_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">무료체험 종료일</span>
                    <span className="font-semibold text-[#FF6B35]">
                      {new Date(user.trial_ends_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">가입일</span>
                  <span className="text-gray-900">
                    {new Date(user.joined_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">지역</span>
                  <span className="text-gray-900">{regionName}</span>
                </div>
              </div>
            </div>

            {/* 지역 변경 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">지역 변경</h2>
              <select
                value={user.region_code}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 bg-white"
              >
                {regions.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 약 설정 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">약 설정</h2>
                {!medsEditing ? (
                  <button
                    onClick={() => {
                      setMedsEditing(true);
                      if (meds.length === 0) setMeds([{ name: "", time: "" }]);
                    }}
                    className="text-sm font-medium text-[#FF6B35]"
                  >
                    수정
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setMedsEditing(false);
                        setMeds(
                          (user.medications || []).map((m) => ({
                            name: m.med_name,
                            time: m.med_time,
                          }))
                        );
                      }}
                      className="text-sm text-gray-500"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleMedsSave}
                      className="text-sm font-medium text-[#FF6B35]"
                    >
                      저장
                    </button>
                  </div>
                )}
              </div>

              {!medsEditing ? (
                meds.length > 0 ? (
                  <div className="space-y-2">
                    {meds.map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm p-3 bg-gray-50 rounded-xl"
                      >
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="font-medium text-gray-900">
                          {m.name}
                        </span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-500">{m.time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">등록된 약이 없습니다</p>
                )
              ) : (
                <div className="space-y-3">
                  {meds.map((med, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => {
                          const updated = [...meds];
                          updated[i] = { ...updated[i], name: e.target.value };
                          setMeds(updated);
                        }}
                        placeholder="약 이름"
                        className="flex-1 px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-sm text-gray-900"
                      />
                      <input
                        type="text"
                        value={med.time}
                        onChange={(e) => {
                          const updated = [...meds];
                          updated[i] = { ...updated[i], time: e.target.value };
                          setMeds(updated);
                        }}
                        placeholder="복용 시간"
                        className="flex-1 px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-sm text-gray-900"
                      />
                      <button
                        onClick={() => setMeds(meds.filter((_, j) => j !== i))}
                        className="px-2 py-2.5 text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {meds.length < 5 && (
                    <button
                      onClick={() => setMeds([...meds, { name: "", time: "" }])}
                      className="text-sm font-medium text-[#FF6B35]"
                    >
                      + 약 추가하기
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 해지 */}
            {user.is_active && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  구독 해지
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  해지하시면 더 이상 카드가 발송되지 않습니다.
                </p>
                <button
                  onClick={() => setShowCancel(true)}
                  className="w-full border-2 border-red-200 text-red-500 font-semibold py-3 rounded-full hover:bg-red-50 transition-colors"
                >
                  해지하기
                </button>
              </div>
            )}
          </div>
        )}

        {/* 해지 확인 팝업 */}
        {showCancel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                정말 해지하시겠어요?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                해지하시면 매일 아침 카드 발송이 중단됩니다.
                <br />
                언제든지 다시 구독하실 수 있어요.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancel(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-full"
                >
                  취소
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-red-500 text-white font-semibold py-3 rounded-full"
                >
                  해지하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
