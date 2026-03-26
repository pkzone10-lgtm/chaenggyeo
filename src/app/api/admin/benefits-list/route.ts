import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regionCode = searchParams.get("region") || "all";

  let query = supabaseAdmin
    .from("contents")
    .select("id, type, content, used_count, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (regionCode === "national") {
    query = query.eq("type", "national_benefit");
  } else if (regionCode !== "all") {
    query = query.eq("type", `local_benefit_${regionCode}`);
  } else {
    query = query.or(
      "type.eq.national_benefit," +
      "type.like.local_benefit_%"
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ benefits: data || [] });
}
