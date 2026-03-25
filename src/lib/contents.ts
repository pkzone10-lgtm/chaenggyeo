import { supabaseAdmin } from "./supabase";

export async function getRandomContent(type: string, dayOfWeek?: number) {
  // used_count가 가장 낮은 콘텐츠 중에서 랜덤 선택
  let query = supabaseAdmin
    .from("contents")
    .select("*")
    .eq("type", type)
    .order("used_count", { ascending: true })
    .limit(20);

  if (dayOfWeek !== undefined) {
    query = query.eq("day_of_week", dayOfWeek);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return null;

  // 가장 낮은 used_count 그룹에서 랜덤 선택
  const minCount = data[0].used_count;
  const candidates = data.filter((d) => d.used_count === minCount);
  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  // used_count 증가
  await supabaseAdmin
    .from("contents")
    .update({ used_count: (picked.used_count || 0) + 1 })
    .eq("id", picked.id);

  return picked;
}
