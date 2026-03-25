const items = [
  "부모님과 멀리 사는 자녀",
  "부모님 약 챙겨드리고 싶은 분",
  "카카오톡 쓰시는 부모님",
  "폴더폰 쓰시는 부모님도 OK",
];

export default function Recommend() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          이런 분들께 추천해요
        </h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 p-5 bg-orange-50 rounded-xl"
            >
              <span className="flex-shrink-0 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-lg">
                ✓
              </span>
              <p className="text-lg font-medium text-gray-900">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
