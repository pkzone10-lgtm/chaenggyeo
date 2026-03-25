import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function GET() {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;

    const res = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `${month}월에 65세 이상 어르신에게 알려드릴 전국 공통 복지 혜택 5개와 부산 지역 혜택 5개를 알려주세요.

규칙:
1. 실제로 존재하는 제도/혜택만 (기초연금, 건강검진, 교통, 문화, 의료 등)
2. 각 항목은 "혜택명 — 설명 1문장" 형식
3. JSON 배열로 출력: [{"type":"national","content":"..."},{"type":"local_busan","content":"..."}]
4. JSON만 출력, 다른 텍스트 없이`,
        },
      ],
    });

    const text = res.content[0].type === "text" ? res.content[0].text : "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const candidates = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return NextResponse.json({ candidates });
  } catch {
    return NextResponse.json({ candidates: [], error: "AI 생성 실패" });
  }
}
