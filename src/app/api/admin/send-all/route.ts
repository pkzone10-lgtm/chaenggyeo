import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { buildDailyCardForUser, sendCardToUser } from "@/lib/scheduler";

// sendCardToUser가 없으면 직접 구현
async function sendToAll() {
  const { data: users } = await supabaseAdmin
    .from("users")
    .select("id, name, phone, region_code, birth_year, channel, is_active")
    .eq("is_active", true);

  if (!users || users.length === 0) return { sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;

  for (const user of users) {
    try {
      await sendCardToUser(user);
      sent++;
    } catch {
      failed++;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  return { sent, failed };
}

export async function POST() {
  try {
    // buildDailyCardForUser 의존성 확인용
    void buildDailyCardForUser;

    const result = await sendToAll();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
