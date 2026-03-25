import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GreetingParams {
  name: string;
  region: string;
  temp: number;
  weather: string;
  hasRain: boolean;
  dayOfWeek: string;
}

const DAY_CONTEXT: Record<string, string> = {
  월요일: "한 주의 시작",
  화요일: "화이팅하는 화요일",
  수요일: "한 주의 중간, 수요일",
  목요일: "주말이 가까워지는 목요일",
  금요일: "신나는 금요일, 주말이 코앞",
  토요일: "느긋한 주말 토요일",
  일요일: "편안한 일요일",
};

export async function generateGreeting(
  params: GreetingParams
): Promise<string> {
  const { name, region, temp, weather, hasRain, dayOfWeek } = params;
  const dayContext = DAY_CONTEXT[dayOfWeek] || dayOfWeek;

  const prompt = `당신은 시니어분들께 매일 아침 안부를 전하는 따뜻한 AI 비서입니다.

아래 정보를 바탕으로 안부 인사를 작성해주세요.

- 이름: ${name}
- 지역: ${region}
- 현재 기온: ${temp}°C
- 날씨: ${weather}
- 비/우산: ${hasRain ? "비 소식 있음, 우산 필요" : "비 소식 없음"}
- 요일: ${dayOfWeek} (${dayContext})

규칙:
1. 2~3문장으로 짧게 작성
2. 따뜻하고 친근한 말투 (존댓말)
3. ${hasRain ? "우산 챙기라는 말을 자연스럽게 포함" : "날씨 관련 말을 자연스럽게 포함"}
4. 요일을 자연스럽게 언급
5. 60대 이상 어르신이 이해하기 쉬운 쉬운 말
6. 이모지 1~2개만 사용
7. 인사말로 시작 (예: "좋은 아침이에요", "안녕하세요" 등)
8. 안부 인사만 출력 (다른 설명 없이)`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    return text.trim();
  } catch {
    // 생성 실패 시 기본 메시지
    const rainMsg = hasRain
      ? " 비 소식이 있으니 우산 꼭 챙기세요!"
      : "";
    return `${name}님, 좋은 아침이에요! 😊 오늘 ${region}은 ${temp}°C, ${weather}예요.${rainMsg} 행복한 ${dayOfWeek} 보내세요!`;
  }
}
