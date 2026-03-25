import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { userId, medications } = await request.json();

    // 기존 약 삭제
    await supabaseAdmin
      .from("medications")
      .delete()
      .eq("user_id", userId);

    // 새 약 저장
    if (medications && medications.length > 0) {
      const rows = medications
        .filter((m: { name: string }) => m.name.trim())
        .map((m: { name: string; time: string }) => ({
          user_id: userId,
          med_name: m.name,
          med_time: m.time,
          is_active: true,
        }));

      if (rows.length > 0) {
        const { error } = await supabaseAdmin
          .from("medications")
          .insert(rows);

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
