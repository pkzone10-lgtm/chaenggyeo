import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ token: "chaenggyeo-admin-" + Date.now() });
  }
  return NextResponse.json({ error: "비밀번호가 틀렸습니다" }, { status: 401 });
}
