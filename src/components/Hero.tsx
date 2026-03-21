export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-orange-50 to-white py-20 md:py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
          하루 163원으로
          <br />
          매일 아침 부모님을 챙겨드려요
        </h1>
        <p className="mt-6 text-base md:text-lg text-gray-500 leading-relaxed">
          날씨·복약알림·운세·지역혜택을
          <br className="md:hidden" />
          매일 아침 7시 10분에 보내드립니다
        </p>
        <a
          href="/subscribe"
          className="mt-10 inline-block bg-[#FF6B35] hover:bg-[#e55a2b] text-white text-lg font-semibold px-10 py-4 rounded-full transition-colors shadow-lg shadow-orange-200"
        >
          구독 시작하기
        </a>
      </div>
    </section>
  );
}
