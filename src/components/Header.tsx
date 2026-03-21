"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧡</span>
          <span className="text-xl font-bold text-gray-900">챙겨드림</span>
        </div>
        <a
          href="#pricing"
          className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          구독하기
        </a>
      </div>
    </header>
  );
}
