import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*, medications(*)")
      .eq("phone", phone)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "가입되지 않은 번호입니다" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
