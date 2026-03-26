import { NextResponse } from "next/server";
import { crawlBenefits } from "@/lib/rssCrawler";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // 1차: RSS 크롤링
    const crawled = await crawlBenefits();

    if (crawled.length > 0) {
      return NextResponse.json({
        candidates: crawled,
        crawledAt: crawled[0].crawledAt,
        source: "rss",
      });
    }

    // 2차: RSS 실패 시 백업 DB에서 최근 데이터 조회
    const { data: backupNational } = await supabaseAdmin
      .from("contents")
      .select("content, created_at")
      .eq("type", "national_benefit")
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: backupLocal } = await supabaseAdmin
      .from("contents")
      .select("content, created_at")
      .eq("type", "local_benefit_busan")
      .order("created_at", { ascending: false })
      .limit(5);

    const fallback = [
      ...(backupNational || []).map((b) => ({
        title: b.content.split(" — ")[0] || b.content,
        description: b.content,
        summary: b.content,
        source: "백업DB",
        sourceDate: b.created_at,
        crawledAt: new Date().toISOString(),
        link: "",
        type: "national" as const,
      })),
      ...(backupLocal || []).map((b) => ({
        title: b.content.split(" — ")[0] || b.content,
        description: b.content,
        summary: b.content,
        source: "백업DB",
        sourceDate: b.created_at,
        crawledAt: new Date().toISOString(),
        link: "",
        type: "local_busan" as const,
      })),
    ];

    return NextResponse.json({
      candidates: fallback,
      crawledAt: new Date().toISOString(),
      source: "backup",
    });
  } catch {
    return NextResponse.json(
      { candidates: [], error: "수집 실패" },
      { status: 500 }
    );
  }
}
