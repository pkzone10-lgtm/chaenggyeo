import { supabaseAdmin } from "./supabase";

export interface FortuneResult {
  zodiac: string;
  stars: number;
  desc: string;
}

export async function getTodayFortune(
  zodiac: string,
  date: Date
): Promise<FortuneResult> {
  // 해당 띠의 운세 전체 조회
  const { data, error } = await supabaseAdmin
    .from("contents")
    .select("*")
    .eq("type", "fortune");

  if (error) throw new Error(error.message);

  // zodiac 필터링 (content는 JSON 문자열)
  const matched = (data || []).filter((d) => {
    const parsed = JSON.parse(d.content);
    return parsed.zodiac === zodiac;
  });

  if (matched.length === 0) {
    return { zodiac, stars: 3, desc: "오늘도 좋은 하루 보내세요!" };
  }

  // 날짜 기반 시드로 항상 같은 결과 (같은 날 + 같은 띠 = 같은 운세)
  const dateStr = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = seed * 31 + dateStr.charCodeAt(i);
  }
  // 띠 이름도 시드에 포함
  for (let i = 0; i < zodiac.length; i++) {
    seed = seed * 31 + zodiac.charCodeAt(i);
  }

  const index = Math.abs(seed) % matched.length;
  const picked = matched[index];

  return JSON.parse(picked.content);
}
