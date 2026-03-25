import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { benefits } = await request.json();

    if (!benefits || benefits.length === 0) {
      return NextResponse.json({ error: "저장할 혜택이 없습니다" }, { status: 400 });
    }

    const rows = benefits.map((b: { type: string; content: string }) => ({
      type: b.type === "local_busan" ? "local_benefit_busan" : "national_benefit",
      content: b.content,
    }));

    const { error } = await supabaseAdmin.from("contents").insert(rows);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saved: rows.length });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
