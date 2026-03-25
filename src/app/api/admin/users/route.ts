import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;
  const offset = (page - 1) * limit;

  const { data, count } = await supabaseAdmin
    .from("users")
    .select("id, name, phone, region_code, channel, plan, amount, is_active, joined_at, trial_ends_at", { count: "exact" })
    .order("joined_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return NextResponse.json({
    users: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
