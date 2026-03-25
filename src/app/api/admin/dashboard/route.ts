import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const [total, active, trial, kakao, mms, today] = await Promise.all([
    supabaseAdmin.from("users").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("users").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabaseAdmin.from("users").select("*", { count: "exact", head: true }).eq("is_active", true).gte("trial_ends_at", now.toISOString()),
    supabaseAdmin.from("users").select("*", { count: "exact", head: true }).eq("channel", "kakao"),
    supabaseAdmin.from("users").select("*", { count: "exact", head: true }).in("channel", ["mms", "sms"]),
    supabaseAdmin.from("users").select("*", { count: "exact", head: true }).gte("joined_at", todayStart),
  ]);

  return NextResponse.json({
    total: total.count || 0,
    active: active.count || 0,
    trial: trial.count || 0,
    kakao: kakao.count || 0,
    mms: mms.count || 0,
    today: today.count || 0,
  });
}
