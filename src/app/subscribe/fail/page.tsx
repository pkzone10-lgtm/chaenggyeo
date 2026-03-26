"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const message = searchParams.get("message") || "결제에 실패했습니다";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-sm border border-gray-100 text-center">
        <span className="text-5xl block mb-4">😢</span>
        <h1 className="text-2xl font-bold text-gray-900">결제 실패</h1>
        <p className="text-gray-500 mt-2">{message}</p>
        {code && (
          <p className="text-xs text-gray-400 mt-1">에러 코드: {code}</p>
        )}
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

export default function FailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      }
    >
      <FailContent />
    </Suspense>
  );
}
