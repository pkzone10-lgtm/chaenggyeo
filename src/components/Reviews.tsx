const reviews = [
  {
    name: "부산 김○○님",
    text: "매일 아침 어머니한테 전화 못 드려서 늘 마음이 무거웠는데, 챙겨드림 덕분에 어머니가 먼저 연락 주세요. \"오늘 비 온다더라, 우산 챙겼니?\" 하시면서요. 감사합니다.",
  },
  {
    name: "서울 이○○님",
    text: "아버지가 혈압약을 자꾸 깜빡하셔서 걱정이 많았는데, 카드에 복약 알림이 나오니까 이제 안 빼먹으세요. 월 4,900원이 이렇게 값어치 있을 줄 몰랐어요.",
  },
  {
    name: "대구 박○○님",
    text: "어머니가 폴더폰이라 카톡이 안 돼서 문자로 신청했어요. 매일 아침 문자 받으시고 손녀한테 \"갓생이 뭐냐\" 물어보셨대요. 가족 대화가 늘었어요.",
  },
];

export default function Reviews() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          이용 후기
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-orange-50 rounded-2xl p-6 flex flex-col"
            >
              <p className="text-[#FF6B35] text-lg mb-3">⭐⭐⭐⭐⭐</p>
              <p className="text-gray-700 leading-relaxed flex-1 text-sm">
                &ldquo;{r.text}&rdquo;
              </p>
              <p className="mt-4 text-sm font-semibold text-gray-900">
                {r.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
