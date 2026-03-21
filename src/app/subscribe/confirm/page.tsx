"use client";

import { useEffect, useState } from "react";

interface SubscribeData {
  user_id: string;
  name: string;
  phone: string;
  plan: string;
  trial_ends_at: string;
}

export default function ConfirmPage() {
  const [data, setData] = useState<SubscribeData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("subscribe-data");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">구독 정보를 불러오는 중...</p>
      </div>
    );
  }

  const trialEnd = new Date(data.trial_ends_at);
  const formattedDate = `${trialEnd.getFullYear()}년 ${trialEnd.getMonth() + 1}월 ${trialEnd.getDate()}일`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-sm border border-gray-100 text-center">
        <span className="text-6xl block mb-6">🎉</span>

        <h1 className="text-2xl font-bold text-gray-900">
          3일 무료체험이 시작됐어요!
        </h1>

        <p className="mt-3 text-gray-500">
          <span className="font-semibold text-gray-900">{data.name}</span>님,
          환영합니다
        </p>

        <div className="mt-6 bg-orange-50 rounded-xl p-5">
          <p className="text-sm text-gray-500">무료체험 종료일</p>
          <p className="text-xl font-bold text-[#FF6B35] mt-1">
            {formattedDate}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            체험 기간 동안 모든 서비스를 무료로 이용하실 수 있어요
          </p>
        </div>

        <div className="mt-6 bg-yellow-50 rounded-xl p-5 text-left">
          <p className="font-semibold text-gray-900 text-sm mb-2">
            💬 카카오톡 채널 추가 안내
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            카카오톡에서 <span className="font-semibold text-gray-700">&quot;챙겨드림&quot;</span>을
            검색하여 채널을 추가해주세요.
            <br />
            채널 추가 후 매일 아침 7시 10분에 메시지가 발송됩니다.
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
