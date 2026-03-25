import cron from "node-cron";
import { supabaseAdmin } from "./supabase";
import { getWeather } from "./weather";
import { generateGreeting } from "./aiGreeting";
import { getZodiac } from "./zodiac";
import { getTodayFortune } from "./fortune";
import { getRandomContent } from "./contents";
import { getNationalBenefit, getLocalBenefit } from "./benefits";
import { sendSMS } from "./solapi";
import {
  buildWeatherMessage,
  buildQuoteMessage,
  buildMedicationMessage,
  buildFortuneMessage,
  buildBenefitMessage,
  buildGrandchildMessage,
  buildLottoMessage,
} from "./templates";
import { WEATHER_GRID } from "./weatherGrid";

const DAY_NAMES = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

interface UserRow {
  id: string;
  name: string;
  phone: string;
  region_code: string;
  birth_year: number;
  channel: string;
  is_active: boolean;
}

interface MedRow {
  med_name: string;
  med_time: string;
}

// 전체 카드 조합
export async function buildDailyCardForUser(user: UserRow) {
  const now = new Date();
  const dayOfWeek = DAY_NAMES[now.getDay()];
  const isLottoDay = now.getDay() === 4 || now.getDay() === 5; // 목·금

  // 1. 날씨
  let weatherData;
  try {
    weatherData = await getWeather(user.region_code);
  } catch {
    weatherData = {
      regionName: WEATHER_GRID[user.region_code]?.name || user.region_code,
      temp: 0, minTemp: 0, maxTemp: 0, sky: "정보없음", hasRain: false, ptyCode: "0",
    };
  }

  // 2. AI 안부
  let greeting: string;
  try {
    greeting = await generateGreeting({
      name: user.name,
      region: weatherData.regionName,
      temp: weatherData.temp,
      weather: weatherData.sky,
      hasRain: weatherData.hasRain,
      dayOfWeek,
    });
  } catch {
    greeting = `${user.name}님, 좋은 아침이에요! 😊 행복한 ${dayOfWeek} 보내세요!`;
  }

  // 3. 명언
  const quoteData = await getRandomContent("quote");
  const quoteParts = (quoteData?.content || "오늘도 좋은 하루 보내세요. — 격언").split(" — ");
  const quoteText = quoteParts[0];
  const quoteSource = quoteParts[1] || "격언";

  // 4. 복약알림
  const { data: meds } = await supabaseAdmin
    .from("medications")
    .select("med_name, med_time")
    .eq("user_id", user.id)
    .eq("is_active", true);

  // 5. 운세
  const zodiacInfo = getZodiac(user.birth_year);
  const fortune = await getTodayFortune(zodiacInfo.zodiac, now);

  // 6. 혜택
  const nationalBenefit = await getNationalBenefit();
  const localBenefit = await getLocalBenefit(user.region_code);

  // 7. 손자녀 팁
  const grandchildData = await getRandomContent("grandchild");
  const grandchildText = grandchildData?.content || "";

  // 카드 조합
  const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${dayOfWeek}`;

  let card = `🧡 챙겨드림 — ${dateStr}\n`;
  card += `${"─".repeat(20)}\n\n`;

  // AI 안부
  card += `🤖 ${greeting}\n\n`;
  card += `${"─".repeat(20)}\n\n`;

  // 날씨
  card += buildWeatherMessage(
    user.name, weatherData.temp, weatherData.minTemp,
    weatherData.maxTemp, weatherData.sky, weatherData.hasRain
  );
  card += `\n\n${"─".repeat(20)}\n\n`;

  // 명언
  card += buildQuoteMessage(quoteText, quoteSource);
  card += `\n\n${"─".repeat(20)}\n\n`;

  // 복약알림
  card += buildMedicationMessage(user.name, (meds as MedRow[]) || []);
  card += `\n\n${"─".repeat(20)}\n\n`;

  // 운세
  card += buildFortuneMessage(user.name, user.birth_year, fortune.stars, fortune.desc);
  card += `\n\n${"─".repeat(20)}\n\n`;

  // 혜택
  card += buildBenefitMessage(nationalBenefit, localBenefit, weatherData.regionName);
  card += `\n\n${"─".repeat(20)}\n\n`;

  // 손자녀 팁
  if (grandchildText) {
    const parts = grandchildText.split(" 예: ");
    const slangParts = (parts[0] || "").split(" = ");
    card += buildGrandchildMessage(
      slangParts[0] || "", slangParts[1] || "", (parts[1] || "").replace(/"/g, "")
    );
    card += `\n\n${"─".repeat(20)}\n\n`;
  }

  // 로또 (목·금)
  if (isLottoDay) {
    const lottoStory = await getRandomContent("lotto_story", now.getDay());
    card += `🍀 이번 주 행운 번호\n`;
    if (lottoStory) card += `${lottoStory.content}\n`;
    card += buildLottoMessage().split("\n").slice(1).join("\n");
    card += `\n\n${"─".repeat(20)}\n\n`;
  }

  card += `챙겨드림 · 매일 아침 07:10`;

  return card;
}

// 단일 유저 발송
export async function sendCardToUser(user: UserRow) {
  const card = await buildDailyCardForUser(user);

  try {
    if (user.channel === "mms" || user.channel === "sms") {
      await sendSMS({ to: user.phone, text: card });
    }
    // 카카오는 추후 구현

    // message_logs 기록
    await supabaseAdmin.from("message_logs").insert({
      user_id: user.id,
      msg_type: user.channel,
      status: "sent",
      content: card.substring(0, 1000),
    });

    console.log(`[발송 성공] ${user.name} (${user.phone})`);
  } catch (err) {
    await supabaseAdmin.from("message_logs").insert({
      user_id: user.id,
      msg_type: user.channel,
      status: "failed",
      content: String(err),
    });
    console.log(`[발송 실패] ${user.name}: ${err}`);
  }
}

// 전체 구독자 발송
async function sendToAllUsers() {
  console.log(`[${new Date().toLocaleString("ko-KR")}] 전체 발송 시작`);

  const { data: users } = await supabaseAdmin
    .from("users")
    .select("id, name, phone, region_code, birth_year, channel, is_active")
    .eq("is_active", true);

  if (!users || users.length === 0) {
    console.log("활성 구독자가 없습니다.");
    return;
  }

  console.log(`활성 구독자 ${users.length}명 발송 시작`);

  for (const user of users) {
    await sendCardToUser(user as UserRow);
    // API 부하 방지 딜레이
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`[${new Date().toLocaleString("ko-KR")}] 전체 발송 완료`);
}

// 스케줄러 시작
export function startScheduler() {
  console.log("📅 스케줄러 시작됨");

  // 매일 05:00 — 혜택 수집 (현재는 백업 데이터 사용으로 로그만)
  cron.schedule("0 5 * * *", () => {
    console.log(`[${new Date().toLocaleString("ko-KR")}] 혜택 수집 작업 실행`);
  });

  // 매일 07:10 — 전체 발송
  cron.schedule("10 7 * * *", () => {
    sendToAllUsers().catch(console.error);
  });

  console.log("⏰ 05:00 혜택 수집, 07:10 카드 발송 등록 완료");
}
