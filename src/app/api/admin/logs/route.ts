import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabaseAdmin
    .from("message_logs")
    .select("*, users(name, phone)")
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({ logs: data || [] });
}
