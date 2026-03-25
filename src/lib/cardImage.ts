import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

interface CardData {
  date: string;
  greeting: string;
  regionName: string;
  temp: number;
  minTemp: number;
  maxTemp: number;
  weatherEmoji: string;
  weatherLabel: string;
  weatherBadgeBg: string;
  weatherBadgeColor: string;
  hasRain: boolean;
  quote: string;
  quoteSource: string;
  meds: { name: string; time: string; color: string }[];
  zodiacEmoji: string;
  zodiacLabel: string;
  birthYear: number;
  name: string;
  fortuneStars: number;
  fortuneDesc: string;
  nationalBenefit: string;
  localBenefit: string;
  localRegion: string;
  slang: string;
  slangMeaning: string;
  slangExample: string;
  isLottoDay: boolean;
  lottoNums?: number[];
  lottoBonus?: number;
  lottoStory?: string;
}

const MED_COLORS = ["#FF4D4D", "#007AFF", "#34C759", "#FF8C00", "#AF52DE"];
const LOTTO_COLORS = ["#FF4D4D", "#FF8C00", "#F5C518", "#34C759", "#007AFF", "#AF52DE"];

function buildCardHTML(data: CardData): string {
  const stars = "⭐".repeat(data.fortuneStars) + "☆".repeat(5 - data.fortuneStars);

  const medsHTML = data.meds.length > 0
    ? data.meds.map((m, i) => `
      <div style="display:flex;align-items:center;gap:8px;font-size:12px;">
        <span style="width:8px;height:8px;border-radius:50%;background:${MED_COLORS[i % MED_COLORS.length]};flex-shrink:0;"></span>
        <span style="font-weight:600;color:#1C1C1E;">${m.name}</span>
        <span style="color:#8E8E93;">—</span>
        <span style="color:#6E6860;">${m.time}</span>
      </div>`).join("")
    : `<div style="font-size:12px;color:#6E6860;">오늘도 건강한 하루 보내세요! 🏃</div>`;

  const medsTitle = data.meds.length > 0
    ? `${data.name}님, 오늘 드실 약이에요`
    : `${data.name}님, 건강 팁`;

  const lottoHTML = data.isLottoDay && data.lottoNums ? `
    <div style="height:1.5px;background:#EEEBE4;"></div>
    <div style="padding:16px 20px;background:#FEFDF0;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <div style="font-size:10px;font-weight:700;color:#8E8E93;letter-spacing:0.10em;">🍀 이번 주 행운 번호</div>
        <span style="background:#FF6B35;color:#fff;font-size:9px;font-weight:700;padding:2px 8px;border-radius:20px;">목·금요일만 발송</span>
      </div>
      <div style="font-size:12px;color:#8E8E93;margin-bottom:12px;">${data.lottoStory || ""}</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:12px;">
        ${data.lottoNums.map((n, i) => `<span style="width:33px;height:33px;border-radius:50%;background:${LOTTO_COLORS[i]};color:${i===2?"#333":"#fff"};font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;">${n}</span>`).join("")}
        <span style="font-size:14px;color:#B0A898;margin:0 2px;">+</span>
        <span style="width:33px;height:33px;border-radius:50%;background:#8E8E93;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;">${data.lottoBonus}</span>
      </div>
    </div>` : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>*{margin:0;padding:0;box-sizing:border-box;}body{background:#B5C8D8;padding:20px 14px 30px;width:340px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}</style>
</head><body>
<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
  <div style="width:40px;height:40px;border-radius:12px;background:#F9E000;display:flex;align-items:center;justify-content:center;font-size:20px;">💛</div>
  <div><div style="font-size:14px;font-weight:700;color:#fff;">챙겨드림</div><div style="font-size:10px;color:rgba(255,255,255,0.72);">부모님 곁의 든든한 디지털 비서</div></div>
</div>
<div style="display:flex;align-items:flex-end;gap:6px;">
<div style="flex:1;">
<div style="width:300px;border-radius:22px;overflow:hidden;background:#FAFAF7;">
  <!-- 브랜드 헤더 -->
  <div style="background:#FF6B35;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;">
    <span style="font-size:17px;font-weight:700;color:#fff;">챙겨드림</span>
    <span style="font-size:11px;color:rgba(255,255,255,0.72);text-align:right;">${data.date}</span>
  </div>
  <!-- 날씨 -->
  <div style="padding:16px 20px;background:#fff;">
    <div style="font-size:10px;font-weight:700;color:#8E8E93;letter-spacing:0.10em;margin-bottom:10px;">☀️ 오늘의 날씨</div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div style="font-size:11px;color:#8E8E93;margin-bottom:2px;">📍 ${data.regionName}</div>
        <div style="display:flex;align-items:flex-start;"><span style="font-size:54px;font-weight:900;color:#1C1C1E;line-height:1;">${data.temp}</span><span style="font-size:20px;font-weight:300;color:#8E8E93;margin-top:6px;">°</span></div>
        <div style="font-size:12px;color:#8E8E93;margin-top:2px;">최저 ${data.minTemp}° · 최고 ${data.maxTemp}°</div>
        <div style="margin-top:8px;display:inline-block;background:${data.weatherBadgeBg};color:${data.weatherBadgeColor};font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;">${data.weatherLabel}</div>
      </div>
      <span style="font-size:58px;line-height:1;">${data.weatherEmoji}</span>
    </div>
  </div>
  <div style="height:1.5px;background:#EEEBE4;"></div>
  <!-- AI 안부 -->
  <div style="padding:16px 20px;background:#FAFAF7;">
    <div style="font-size:10px;font-weight:700;color:#8E8E93;letter-spacing:0.10em;margin-bottom:10px;">🤖 AI 맞춤 안부</div>
    <div style="display:flex;gap:8px;align-items:flex-start;">
      <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#A855F7,#6366F1);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">🤖</div>
      <div style="background:#fff;border:1.5px solid #EDE8FF;border-radius:4px 14px 14px 14px;padding:12px 14px;font-size:12px;color:#333;line-height:1.6;">${data.greeting}</div>
    </div>
  </div>
  <div style="height:1.5px;background:#EEEBE4;"></div>
  <!-- 명언 -->
  <div style="padding:16px 20px;background:#FAFAF7;">
    <div style="font-size:10px;font-weight:700;color:#8E8E93;letter-spacing:0.10em;margin-bottom:10px;">✨ 오늘의 좋은 말씀</div>
    <div style="display:flex;gap:12px;">
      <div style="width:4px;border-radius:2px;background:#FF6B35;flex-shrink:0;"></div>
      <div><div style="color:#111;font-weight:700;font-size:14px;line-height:1.6;">${data.quote}</div><div style="font-size:11px;color:#B0A898;margin-top:6px;">— ${data.quoteSource}</div></div>
    </div>
  </div>
  <div style="height:1.5px;background:#EEEBE4;"></div>
  <!-- 복약 -->
  <div style="padding:16px 20px;background:#FAFAF7;">
    <div style="font-size:10px;font-weight:700;color:#8E8E93;letter-spacing:0.10em;margin-bottom:10px;">💊 오늘의 복약 알림</div>
    <div style="background:#FFF5F5;border:1.5px solid #FFD0D0;border-radius:14px;padding:14px 16px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <div style="width:40px;height:40px;background:#FF4D4D;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">💊</div>
        <div style="font-size:13px;font-weight:700;color:#1C1C1E;">${medsTitle}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;">${medsHTML}</div>
    </div>
  </div>
  <div style="height:1.5px;background:#EEEBE4;"></div>
  <!-- 운세 -->
  <div style="padding:16px 20px;background:#FAFAF7;">
    <div style="font-size:10px;font-weight:700;color:#8E8E93;letter-spacing:0.10em;margin-bottom:10px;">🔮 오늘의 운세</div>
    <div style="background:#fff;border:1.5px solid #EEEBE4;border-radius:14px;padding:14px 16px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:46px;height:46px;border-radius:50%;background:#FFF5F0;border:2px solid #FFE0D0;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">${data.zodiacEmoji}</div>
        <div><div style="font-size:11px;color:#8E8E93;">${data.birthYear}년생 · ${data.zodiacLabel}</div><div style="font-size:13px;font-weight:700;color:#1C1C1E;">${data.name}님의 운세</div><div style="font-size:14px;margin-top:2px;">${stars}</div></div>
      </div>
      <div style="font-size:12px;color:#4E5968;line-height:1.6;margin-top:10px;">${data.fortuneDesc}</div>
    </div>
  </div>
  <div style="height:1.5px;background:#EEEBE4;"></div>
  <!-- 혜택 -->
  <div style="padding:16px 20px;background:#FAFAF7;">
    <div style="font-size:10px;font-weight:700;color:#8E8E93;letter-spacing:0.10em;margin-bottom:10px;">📍 오늘의 혜택 · 정보</div>
    <div style="display:inline-block;background:#1C1C1E;color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:6px;margin-bottom:8px;">🇰🇷 전국 공통</div>
    <div style="background:#fff;border:1.5px solid #EEEBE4;border-radius:14px;padding:14px 16px;margin-bottom:12px;">
      <div style="font-size:12px;color:#1C1C1E;line-height:1.6;">${data.nationalBenefit}</div>
    </div>
    <div style="display:inline-block;background:#2E7D52;color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:6px;margin-bottom:8px;">📍 ${data.localRegion}</div>
    <div style="background:#fff;border:1.5px solid #EEEBE4;border-radius:14px;padding:14px 16px;">
      <div style="font-size:12px;color:#1C1C1E;line-height:1.6;">${data.localBenefit}</div>
    </div>
  </div>
  <div style="height:1.5px;background:#EEEBE4;"></div>
  <!-- 손자녀 -->
  <div style="padding:16px 20px;background:#FAFAF7;">
    <div style="font-size:10px;font-weight:700;color:#8E8E93;letter-spacing:0.10em;margin-bottom:10px;">👨‍👧 손자녀 소통 팁</div>
    <div style="background:#fff;border:1.5px solid #EEEBE4;border-radius:14px;padding:14px 16px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="background:#1C1C1E;color:#fff;font-size:15px;font-weight:700;border-radius:20px;padding:4px 14px;">${data.slang}</span>
        <span style="color:#D0CCBF;font-size:16px;font-weight:700;">=</span>
        <span style="font-size:13px;font-weight:700;color:#1C1C1E;">${data.slangMeaning}</span>
      </div>
      <div style="font-size:11px;color:#8E8E93;margin-top:6px;">손주에게 이렇게 써보세요!</div>
      <div style="font-size:12px;color:#6E6860;line-height:1.6;margin-top:2px;">"${data.slangExample}"</div>
    </div>
  </div>
  ${lottoHTML}
  <!-- 푸터 -->
  <div style="background:#EFECE5;padding:9px 20px;display:flex;align-items:center;justify-content:space-between;">
    <span style="font-size:10px;color:#B0A898;">챙겨드림 · 매일 아침 07:10</span>
    <span style="font-size:9px;color:#C8C4BC;">수신거부 080-000-0000</span>
  </div>
</div>
</div>
<span style="font-size:11px;color:rgba(0,0,0,0.4);margin-bottom:2px;flex-shrink:0;">오전 7:10</span>
</div>
</body></html>`;
}

export async function renderCardImage(data: CardData): Promise<string> {
  const html = buildCardHTML(data);
  const tmpDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const outputPath = path.join(tmpDir, `card-${Date.now()}.jpg`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // SOLAPI MMS 제한: 가로 1500px, 세로 1440px
  // 1단계: 원본 크기로 렌더링하여 높이 측정
  const cardWidth = 340;
  const page = await browser.newPage();
  await page.setViewport({ width: cardWidth, height: 100, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });

  const body = await page.$("body");
  if (body) {
    const box = await body.boundingBox();
    const contentHeight = box?.height || 1500;
    const contentWidth = box?.width || cardWidth;

    // 2단계: SOLAPI 제한(1500x1440) 내 최대 해상도
    const scaleByW = 1500 / contentWidth;
    const scaleByH = 1440 / contentHeight;
    const scaleFactor = Math.min(scaleByW, scaleByH);

    await page.setViewport({ width: cardWidth, height: 100, deviceScaleFactor: scaleFactor });
    await page.setContent(html, { waitUntil: "load" });

    const body2 = await page.$("body");
    if (body2) {
      await body2.screenshot({ path: outputPath, type: "jpeg", quality: 95 });
    }
  }

  await browser.close();
  return outputPath;
}

export type { CardData };
