import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "./supabase";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 백업 데이터에서 랜덤 조회 (used_count 기반)
async function getBackupContent(type: string) {
  const { data } = await supabaseAdmin
    .from("contents")
    .select("*")
    .eq("type", type)
    .order("used_count", { ascending: true })
    .limit(10);

  if (!data || data.length === 0) return null;

  const minCount = data[0].used_count;
  const candidates = data.filter((d) => d.used_count === minCount);
  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  await supabaseAdmin
    .from("contents")
    .update({ used_count: (picked.used_count || 0) + 1 })
    .eq("id", picked.id);

  return picked.content;
}

// 전국 공통 혜택 — 백업 DB에서 조회
export async function getNationalBenefit(): Promise<string> {
  const backup = await getBackupContent("national_benefit");
  return backup || "기초연금 신청 안내 — 만 65세 이상 어르신은 가까운 주민센터에서 신청하실 수 있습니다.";
}

// 지역별 혜택 — 백업 DB에서 조회
export async function getLocalBenefit(regionCode: string): Promise<string> {
  const backup = await getBackupContent(`local_benefit_${regionCode}`);
  if (backup) return backup;

  const regionNames: Record<string, string> = {
    busan: "부산", seoul: "서울", daegu: "대구", incheon: "인천",
    gwangju: "광주", daejeon: "대전", ulsan: "울산", sejong: "세종",
    gyeonggi: "경기", gangwon: "강원", chungbuk: "충북", chungnam: "충남",
    jeonbuk: "전북", jeonnam: "전남", gyeongbuk: "경북", gyeongnam: "경남",
    jeju: "제주",
  };
  const name = regionNames[regionCode] || regionCode;
  return `${name} 지역 노인복지관에서 다양한 무료 프로그램을 운영합니다. 가까운 복지관에 문의해보세요.`;
}

// Claude로 쉬운 말 요약
export async function summarizeBenefit(rawText: string): Promise<string> {
  try {
    const res = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: `아래 혜택 정보를 65세 이상 어르신이 이해하기 쉽게 2문장으로 요약해주세요.
쉬운 말로, 존댓말로, 핵심만 간단히.

혜택 정보: ${rawText}`,
        },
      ],
    });
    const text = res.content[0].type === "text" ? res.content[0].text : "";
    return text.trim();
  } catch {
    return rawText;
  }
}
