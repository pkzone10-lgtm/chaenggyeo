"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadTossPayments } from "@tosspayments/payment-sdk";

const PLAN_LABELS: Record<string, string> = {
  "kakao-monthly": "카카오톡 월간",
  "kakao-yearly": "카카오톡 연간",
  "mms-monthly": "문자(MMS) 월간",
  "mms-yearly": "문자(MMS) 연간",
};

const PLAN_AMOUNTS: Record<string, number> = {
  "kakao-monthly": 4900,
  "kakao-yearly": 44900,
  "mms-monthly": 6900,
  "mms-yearly": 62900,
};

type PayMethod = "카드" | "토스페이" | "휴대폰" | "계좌이체";

export default function PaymentPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [plan, setPlan] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("subscribe-data");
    if (stored) {
      const data = JSON.parse(stored);
      setUserId(data.user_id);
      setUserName(data.name);
      setPlan(data.plan);
      setAmount(PLAN_AMOUNTS[data.plan] || 4900);
    } else {
      setUserId("test_" + Date.now());
      setUserName("테스트");
      setPlan("kakao-monthly");
      setAmount(4900);
    }
  }, [router]);

  async function handlePayment(method: PayMethod) {
    const clientKey = process.env.NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY;
    if (!clientKey) {
      setError("결제 키가 설정되지 않았습니다");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const tossPayments = await loadTossPayments(clientKey);
      const orderId = `chaenggyeo_${userId}_${Date.now()}`;

      await tossPayments.requestPayment(method, {
        amount,
        orderId,
        orderName: `챙겨드림 ${PLAN_LABELS[plan] || plan}`,
        customerName: userName,
        successUrl: `${window.location.origin}/subscribe/success`,
        failUrl: `${window.location.origin}/subscribe/fail`,
      });
    } catch {
      setError("결제가 취소됐습니다");
      setLoading(false);
    }
  }

  const methods: { label: string; method: PayMethod; icon: string; bg: string; text: string }[] = [
    { label: "카드 결제", method: "카드", icon: "💳", bg: "bg-[#FF6B35] hover:bg-[#e55a2b] shadow-lg shadow-orange-200", text: "text-white" },
    { label: "토스페이", method: "토스페이", icon: "💙", bg: "bg-[#0064FF] hover:bg-[#0050CC]", text: "text-white" },
    { label: "휴대폰 결제", method: "휴대폰", icon: "📱", bg: "bg-gray-900 hover:bg-gray-800", text: "text-white" },
    { label: "계좌이체", method: "계좌이체", icon: "🏦", bg: "bg-white hover:bg-gray-50 border-2 border-gray-200", text: "text-gray-900" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <a href="/" className="text-lg font-bold text-gray-900">
            🧡 챙겨드림
          </a>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제하기</h1>
        <p className="text-gray-500 mb-8">
          {userName}님 · {PLAN_LABELS[plan] || plan} ·{" "}
          <span className="font-semibold text-gray-900">
            {amount.toLocaleString()}원
          </span>
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {methods.map((m) => (
            <button
              key={m.method}
              onClick={() => handlePayment(m.method)}
              disabled={loading}
              className={`w-full ${m.bg} disabled:bg-gray-300 ${m.text} text-lg font-semibold py-4 rounded-full transition-colors`}
            >
              {loading ? "결제 중..." : `${m.icon} ${m.label}`}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          결제는 토스페이먼츠를 통해 안전하게 처리됩니다
        </p>
      </div>
    </div>
  );
}
