"use client";

import { useState } from "react";

const faqs = [
  {
    q: "무료체험은 어떻게 되나요?",
    a: "가입 후 3일간 무료로 이용하실 수 있어요. 카드 없이 시작 가능합니다.",
  },
  {
    q: "카카오톡이 없어도 되나요?",
    a: "네, 문자(MMS)로도 동일한 내용을 받으실 수 있어요.",
  },
  {
    q: "약 알림은 어떻게 설정하나요?",
    a: "가입 시 약 이름과 복용 시간을 입력하시면 매일 카드에 표시됩니다.",
  },
  {
    q: "언제든지 해지할 수 있나요?",
    a: "네, 언제든지 해지 가능합니다. 위약금 없음.",
  },
  {
    q: "연간 구독은 환불이 되나요?",
    a: "미사용 기간에 대해 환불 가능합니다.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          자주 묻는 질문
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-gray-900">
                  Q. {faq.q}
                </span>
                <span
                  className={`text-gray-400 text-xl transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
