"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setStatus("error");
      setErrorMsg("결제 정보가 없습니다");
      return;
    }

    async function confirm() {
      const res = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: Number(amount),
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMsg(data.error || "결제 승인 실패");
      }
    }

    confirm();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">결제 승인 중...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-sm border border-gray-100 text-center">
          <span className="text-5xl block mb-4">😢</span>
          <h1 className="text-2xl font-bold text-gray-900">결제 실패</h1>
          <p className="text-gray-500 mt-2">{errorMsg}</p>
          <a
            href="/subscribe"
            className="mt-6 inline-block bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            다시 시도하기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-sm border border-gray-100 text-center">
        <span className="text-6xl block mb-6">🎉</span>
        <h1 className="text-2xl font-bold text-gray-900">결제가 완료됐어요!</h1>
        <p className="mt-3 text-gray-500">
          매일 아침 7시 10분에 카드가 발송됩니다.
        </p>
        <div className="mt-6 bg-yellow-50 rounded-xl p-5 text-left">
          <p className="font-semibold text-gray-900 text-sm mb-2">
            💬 카카오톡 채널 추가 안내
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            카카오톡에서{" "}
            <span className="font-semibold text-gray-700">
              &quot;챙겨드림&quot;
            </span>
            을 검색하여 채널을 추가해주세요.
          </p>
        </div>
        <a
          href="/"
          className="mt-8 inline-block w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold py-3.5 rounded-full transition-colors"
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
