import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { buildDailyCardForUser } from "@/lib/scheduler";
import { sendSMS } from "@/lib/solapi";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, name, phone, region_code, birth_year, channel, is_active")
      .eq("id", userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "유저를 찾을 수 없습니다" }, { status: 404 });
    }

    const card = await buildDailyCardForUser(user);
    await sendSMS({ to: user.phone, text: card });

    return NextResponse.json({ success: true, phone: user.phone });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
