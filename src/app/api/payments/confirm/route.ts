import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    // 토스페이먼츠 결제 승인 API 호출
    const secretKey = process.env.TOSSPAYMENTS_SECRET_KEY!;
    const encodedKey = Buffer.from(secretKey + ":").toString("base64");

    const tossRes = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${encodedKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      }
    );

    const tossData = await tossRes.json();

    if (!tossRes.ok) {
      return NextResponse.json(
        { error: tossData.message || "결제 승인 실패" },
        { status: 400 }
      );
    }

    // orderId에서 userId 추출 (orderId = chaenggyeo_userId_timestamp)
    const parts = orderId.split("_");
    const userId = parts[1];

    if (!userId) {
      return NextResponse.json({ error: "주문 정보 오류" }, { status: 400 });
    }

    // users 테이블 활성화
    await supabaseAdmin
      .from("users")
      .update({ is_active: true })
      .eq("id", userId);

    // payers 테이블에 결제 정보 저장
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("plan")
      .eq("id", userId)
      .single();

    const nextBilling = new Date();
    if (user?.plan === "yearly") {
      nextBilling.setFullYear(nextBilling.getFullYear() + 1);
    } else {
      nextBilling.setMonth(nextBilling.getMonth() + 1);
    }

    await supabaseAdmin.from("payers").insert({
      user_id: userId,
      plan: user?.plan || "monthly",
      amount,
      payment_method: tossData.method || "card",
      next_billing_at: nextBilling.toISOString(),
    });

    return NextResponse.json({
      success: true,
      paymentKey: tossData.paymentKey,
      orderId: tossData.orderId,
      amount: tossData.totalAmount,
    });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
