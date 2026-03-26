import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { regionCode, title, content, source } = await request.json();

    const dbType = regionCode === "national"
      ? "national_benefit"
      : `local_benefit_${regionCode}`;

    const dbContent = source
      ? `${title} — ${content} (출처: ${source})`
      : `${title} — ${content}`;

    const { error } = await supabaseAdmin
      .from("contents")
      .insert({ type: dbType, content: dbContent });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
