import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const ZODIAC_MAP: Record<number, string> = {
  0: "원숭이", 1: "닭", 2: "개", 3: "돼지",
  4: "쥐", 5: "소", 6: "호랑이", 7: "토끼",
  8: "용", 9: "뱀", 10: "말", 11: "양",
};

function getZodiac(year: number): string {
  return ZODIAC_MAP[year % 12];
}

// 지역명 → region_code 매핑
const REGION_MAP: Record<string, string> = {
  서울특별시: "seoul",
  부산광역시: "busan",
  대구광역시: "daegu",
  인천광역시: "incheon",
  광주광역시: "gwangju",
  대전광역시: "daejeon",
  울산광역시: "ulsan",
  세종특별자치시: "sejong",
  경기도: "gyeonggi",
  강원특별자치도: "gangwon",
  충청북도: "chungbuk",
  충청남도: "chungnam",
  전북특별자치도: "jeonbuk",
  전라남도: "jeonnam",
  경상북도: "gyeongbuk",
  경상남도: "gyeongnam",
  제주특별자치도: "jeju",
};

// 플랜 ID → channel, plan, amount 매핑
const PLAN_MAP: Record<string, { channel: string; plan: string; amount: number }> = {
  "kakao-monthly": { channel: "kakao", plan: "monthly", amount: 4900 },
  "kakao-yearly": { channel: "kakao", plan: "yearly", amount: 44900 },
  "mms-monthly": { channel: "mms", plan: "monthly", amount: 6900 },
  "mms-yearly": { channel: "mms", plan: "yearly", amount: 62900 },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan, name, phone, birthYear, region, medicines } = body;

    // 플랜 검증
    const planInfo = PLAN_MAP[plan];
    if (!planInfo) {
      return NextResponse.json(
        { error: "유효하지 않은 플랜입니다" },
        { status: 400 }
      );
    }

    // 중복 전화번호 체크
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("phone", phone)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "이미 가입된 번호입니다" },
        { status: 409 }
      );
    }

    // users 테이블에 저장
    const regionCode = REGION_MAP[region] || region;
    const zodiac = getZodiac(birthYear);

    const now = new Date();
    const trialEnds = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .insert({
        name,
        phone,
        region_code: regionCode,
        birth_year: birthYear,
        zodiac,
        channel: planInfo.channel,
        plan: planInfo.plan,
        amount: planInfo.amount,
        is_active: true,
        trial_started_at: now.toISOString(),
        trial_ends_at: trialEnds.toISOString(),
      })
      .select()
      .single();

    if (userError) {
      return NextResponse.json(
        { error: userError.message },
        { status: 500 }
      );
    }

    // medications 테이블에 약 정보 저장
    if (medicines && medicines.length > 0) {
      const medsToInsert = medicines
        .filter((m: { name: string; time: string }) => m.name.trim())
        .map((m: { name: string; time: string }) => ({
          user_id: user.id,
          med_name: m.name,
          med_time: m.time,
          is_active: true,
        }));

      if (medsToInsert.length > 0) {
        const { error: medError } = await supabaseAdmin
          .from("medications")
          .insert(medsToInsert);

        if (medError) {
          return NextResponse.json(
            { error: medError.message },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json(
      {
        user_id: user.id,
        trial_ends_at: user.trial_ends_at,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
