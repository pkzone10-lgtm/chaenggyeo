const ZODIAC_MAP: Record<number, string> = {
  0: "원숭이", 1: "닭", 2: "개", 3: "돼지",
  4: "쥐", 5: "소", 6: "호랑이", 7: "토끼",
  8: "용", 9: "뱀", 10: "말", 11: "양",
};

function getZodiac(year: number): string {
  return ZODIAC_MAP[year % 12];
}

// 1. 날씨 메시지
export function buildWeatherMessage(
  name: string,
  temp: number,
  minTemp: number,
  maxTemp: number,
  weather: string,
  hasRain: boolean
): string {
  let msg = `🌤️ ${name}님, 오늘의 날씨\n`;
  msg += `현재 ${temp}°C / 최저 ${minTemp}°C / 최고 ${maxTemp}°C\n`;
  msg += `날씨: ${weather}`;
  if (hasRain) {
    msg += `\n☔ 비 소식이 있어요. 우산 챙기세요!`;
  }
  return msg;
}

// 2. 좋은 말씀
export function buildQuoteMessage(quote: string, source: string): string {
  return `📖 오늘의 좋은 말씀\n\n"${quote}"\n\n- ${source}`;
}

// 3. 운세
export function buildFortuneMessage(
  name: string,
  birthYear: number,
  stars: number,
  desc: string
): string {
  const zodiac = getZodiac(birthYear);
  const starStr = "⭐".repeat(stars) + "☆".repeat(5 - stars);
  return `🔮 ${name}님의 오늘 운세 (${zodiac}띠)\n\n운세지수: ${starStr}\n${desc}`;
}

// 4. 복약 알림
export function buildMedicationMessage(
  name: string,
  medications: { med_name: string; med_time: string }[]
): string {
  if (!medications || medications.length === 0) {
    return `💊 ${name}님, 오늘도 건강한 하루 보내세요!\n\n🏃 하루 30분 걷기가 건강의 비결입니다.`;
  }

  let msg = `💊 ${name}님, 오늘의 복약 알림\n`;
  medications.forEach((m, i) => {
    msg += `\n${i + 1}. ${m.med_name} - ${m.med_time}`;
  });
  msg += `\n\n잊지 말고 꼭 챙겨 드세요!`;
  return msg;
}

// 5. 혜택 안내
export function buildBenefitMessage(
  national: string,
  local: string,
  regionName: string
): string {
  let msg = `🏛️ 오늘의 혜택 안내\n`;
  msg += `\n📌 전국 공통\n${national}`;
  msg += `\n\n📌 ${regionName} 혜택\n${local}`;
  return msg;
}

// 6. 손자녀 소통 팁
export function buildGrandchildMessage(
  slang: string,
  meaning: string,
  example: string
): string {
  return `👶 손자녀 소통 팁\n\n💬 "${slang}"\n뜻: ${meaning}\n\n사용 예시: "${example}"`;
}

// 7. 로또 번호 생성
export function buildLottoMessage(): string {
  const nums = new Set<number>();
  while (nums.size < 7) {
    nums.add(Math.floor(Math.random() * 45) + 1);
  }
  const arr = Array.from(nums);
  const main = arr.slice(0, 6).sort((a, b) => a - b);
  const bonus = arr[6];
  return `🍀 오늘의 행운 번호\n\n${main.join(" · ")} + 보너스 ${bonus}\n\n행운을 빕니다!`;
}

// 8. 하루치 카드 생성
export interface DailyCardUser {
  name: string;
  birth_year: number;
  region_code: string;
  medications: { med_name: string; med_time: string }[];
}

export interface DailyCardData {
  weather: { temp: number; minTemp: number; maxTemp: number; weather: string; hasRain: boolean };
  quote: { quote: string; source: string };
  fortune: { stars: number; desc: string };
  benefit: { national: string; local: string; regionName: string };
  grandchild: { slang: string; meaning: string; example: string };
}

export function buildDailyCard(user: DailyCardUser, data: DailyCardData): string {
  const sections = [
    buildWeatherMessage(user.name, data.weather.temp, data.weather.minTemp, data.weather.maxTemp, data.weather.weather, data.weather.hasRain),
    buildQuoteMessage(data.quote.quote, data.quote.source),
    buildFortuneMessage(user.name, user.birth_year, data.fortune.stars, data.fortune.desc),
    buildMedicationMessage(user.name, user.medications),
    buildBenefitMessage(data.benefit.national, data.benefit.local, data.benefit.regionName),
    buildGrandchildMessage(data.grandchild.slang, data.grandchild.meaning, data.grandchild.example),
    buildLottoMessage(),
  ];

  return `🧡 챙겨드림 - 좋은 아침이에요!\n\n${"─".repeat(20)}\n\n${sections.join(`\n\n${"─".repeat(20)}\n\n`)}`;
}
