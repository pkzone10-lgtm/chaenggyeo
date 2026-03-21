const plans = [
  {
    channel: "카카오톡",
    icon: "💬",
    prices: [
      { label: "월간 구독", price: "4,900", unit: "원/월" },
      { label: "연간 구독", price: "44,900", unit: "원/년", badge: "2달 무료" },
    ],
  },
  {
    channel: "문자(MMS)",
    icon: "📩",
    prices: [
      { label: "월간 구독", price: "6,900", unit: "원/월" },
      { label: "연간 구독", price: "62,900", unit: "원/년", badge: "1달 무료" },
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
          요금 안내
        </h2>
        <p className="text-center text-gray-500 mb-12">
          하루 163원, 커피 한 잔보다 저렴해요
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.channel}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{plan.icon}</span>
                <h3 className="text-xl font-bold text-gray-900">
                  {plan.channel}
                </h3>
              </div>
              <div className="space-y-4">
                {plan.prices.map((p) => (
                  <div
                    key={p.label}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                  >
                    <div>
                      <span className="text-sm text-gray-500">{p.label}</span>
                      {p.badge && (
                        <span className="ml-2 text-xs font-semibold text-[#FF6B35] bg-orange-100 px-2 py-0.5 rounded-full">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-gray-900">
                        {p.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        {p.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="#"
                className="mt-6 block text-center bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold py-3.5 rounded-full transition-colors"
              >
                {plan.channel}으로 구독하기
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
