const services = [
  {
    icon: "🌤️",
    title: "날씨",
    desc: "오늘의 날씨와 미세먼지, 자외선 정보를 알려드려요",
  },
  {
    icon: "💊",
    title: "복약알림",
    desc: "매일 아침 약 드실 시간을 챙겨드려요",
  },
  {
    icon: "🔮",
    title: "운세",
    desc: "오늘의 띠별 운세로 하루를 시작해요",
  },
  {
    icon: "🏛️",
    title: "지역혜택",
    desc: "우리 동네 시니어 혜택과 행사 소식을 전해드려요",
  },
  {
    icon: "👶",
    title: "손자녀팁",
    desc: "손자녀와 더 가까워지는 소통 팁을 알려드려요",
  },
];

export default function Services() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          매일 아침, 이런 정보를 보내드려요
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              <span className="text-4xl mb-4">{s.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
