"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const plans = [
  {
    id: "kakao-monthly",
    channel: "카카오톡",
    period: "월간",
    price: 4900,
    priceLabel: "4,900원/월",
    badge: null,
  },
  {
    id: "kakao-yearly",
    channel: "카카오톡",
    period: "연간",
    price: 44900,
    priceLabel: "44,900원/년",
    badge: "2달 무료",
  },
  {
    id: "mms-monthly",
    channel: "문자(MMS)",
    period: "월간",
    price: 6900,
    priceLabel: "6,900원/월",
    badge: null,
  },
  {
    id: "mms-yearly",
    channel: "문자(MMS)",
    period: "연간",
    price: 62900,
    priceLabel: "62,900원/년",
    badge: "1달 무료",
  },
];

const regions = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
];

interface Medicine {
  name: string;
  time: string;
}

export default function SubscribePage() {
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [region, setRegion] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", time: "" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function formatPhone(value: string) {
    const nums = value.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(e.target.value));
  }

  function addMedicine() {
    if (medicines.length >= 5) return;
    setMedicines([...medicines, { name: "", time: "" }]);
  }

  function updateMedicine(index: number, field: keyof Medicine, value: string) {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  }

  function removeMedicine(index: number) {
    if (medicines.length <= 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!selectedPlan) newErrors.plan = "플랜을 선택해주세요";
    if (!name.trim()) newErrors.name = "이름을 입력해주세요";

    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone))
      newErrors.phone = "전화번호 형식을 확인해주세요 (010-0000-0000)";

    const year = parseInt(birthYear);
    if (!birthYear || isNaN(year) || year < 1930 || year > 2010)
      newErrors.birthYear = "출생년도를 확인해주세요 (1930~2010)";

    if (!region) newErrors.region = "지역을 선택해주세요";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError("");

    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          name,
          phone,
          birthYear: parseInt(birthYear),
          region,
          medicines: medicines.filter((m) => m.name.trim()),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "저장에 실패했습니다");
        return;
      }

      sessionStorage.setItem(
        "subscribe-data",
        JSON.stringify({
          user_id: data.user_id,
          name,
          phone,
          plan: selectedPlan,
          trial_ends_at: data.trial_ends_at,
        })
      );
      router.push("/subscribe/confirm");
    } catch {
      setApiError("서버에 연결할 수 없습니다");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <a href="/" className="text-lg font-bold text-gray-900">
            🧡 챙겨드림
          </a>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">구독 신청</h1>

        {/* 1. 플랜 선택 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">플랜 선택</h2>
          {errors.plan && (
            <p className="text-red-500 text-sm mb-3">{errors.plan}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                  selectedPlan === plan.id
                    ? "border-[#FF6B35] bg-orange-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {plan.badge && (
                  <span className="absolute top-3 right-3 text-xs font-semibold text-[#FF6B35] bg-orange-100 px-2 py-0.5 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <p className="text-sm text-gray-500">
                  {plan.channel} · {plan.period}
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {plan.priceLabel}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* 2. 정보 입력 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">정보 입력</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전화번호
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                출생년도
              </label>
              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="1962"
                min={1930}
                max={2010}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900"
              />
              {errors.birthYear && (
                <p className="text-red-500 text-sm mt-1">{errors.birthYear}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지역
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 bg-white"
              >
                <option value="">지역을 선택해주세요</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.region && (
                <p className="text-red-500 text-sm mt-1">{errors.region}</p>
              )}
            </div>
          </div>
        </section>

        {/* 3. 약 설정 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-1">약 설정</h2>
          <p className="text-sm text-gray-500 mb-4">선택사항</p>
          <div className="space-y-3">
            {medicines.map((med, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input
                  type="text"
                  value={med.name}
                  onChange={(e) => updateMedicine(i, "name", e.target.value)}
                  placeholder="약 이름 (예: 혈압약)"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900"
                />
                <input
                  type="text"
                  value={med.time}
                  onChange={(e) => updateMedicine(i, "time", e.target.value)}
                  placeholder="복용 시간 (예: 아침 식후 30분)"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900"
                />
                {medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicine(i)}
                    className="px-3 py-3 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          {medicines.length < 5 && (
            <button
              type="button"
              onClick={addMedicine}
              className="mt-3 text-sm font-medium text-[#FF6B35] hover:text-[#e55a2b] transition-colors"
            >
              + 약 추가하기
            </button>
          )}
        </section>

        {/* 4. 다음 버튼 */}
        {apiError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {apiError}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-lg font-semibold py-4 rounded-full transition-colors shadow-lg shadow-orange-200"
        >
          {isLoading ? "저장 중..." : "다음"}
        </button>
      </form>
    </div>
  );
}
