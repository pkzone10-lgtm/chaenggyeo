import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

interface BenefitItem {
  type: string;
  regionCode: string | null;
  summary: string;
  source: string;
  sourceDate: string;
  crawledAt: string;
  title: string;
}

export async function POST(request: Request) {
  try {
    const { benefits } = await request.json();

    if (!benefits || benefits.length === 0) {
      return NextResponse.json({ error: "저장할 혜택이 없습니다" }, { status: 400 });
    }

    const rows = benefits.map((b: BenefitItem) => {
      let dbType = "national_benefit";
      if (b.type === "local" && b.regionCode) {
        dbType = `local_benefit_${b.regionCode}`;
      }
      return {
        type: dbType,
        content: JSON.stringify({
          text: b.summary || b.title,
          source: b.source,
          sourceDate: b.sourceDate,
          crawledAt: b.crawledAt,
        }),
      };
    });

    const { error } = await supabaseAdmin.from("contents").insert(rows);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saved: rows.length });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
