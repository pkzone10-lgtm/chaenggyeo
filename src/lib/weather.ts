import { WEATHER_GRID } from "./weatherGrid";

const API_KEY = process.env.WEATHER_API_KEY!;
const BASE_URL =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

const SKY_MAP: Record<string, string> = {
  "1": "맑음☀",
  "3": "구름많음⛅",
  "4": "흐림☁",
};

// PTY 1=비, 2=비/눈, 3=눈, 4=소나기 → 우산 필요
const RAIN_CODES = ["1", "2", "3", "4"];

export interface WeatherResult {
  regionName: string;
  temp: number;
  minTemp: number;
  maxTemp: number;
  sky: string;
  hasRain: boolean;
  ptyCode: string;
}

function getBaseDateTime(): { baseDate: string; baseTime: string } {
  const now = new Date();
  // 기상청 단기예보 발표 시각: 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300
  // 아침 7시 발송이므로 0500 발표 데이터 사용
  // 만약 현재 5시 이전이면 전날 2300 사용
  const hours = now.getHours();

  let baseDate: Date;
  let baseTime: string;

  if (hours < 5) {
    baseDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    baseTime = "2300";
  } else if (hours < 8) {
    baseDate = now;
    baseTime = "0500";
  } else if (hours < 11) {
    baseDate = now;
    baseTime = "0800";
  } else if (hours < 14) {
    baseDate = now;
    baseTime = "1100";
  } else if (hours < 17) {
    baseDate = now;
    baseTime = "1400";
  } else if (hours < 20) {
    baseDate = now;
    baseTime = "1700";
  } else if (hours < 23) {
    baseDate = now;
    baseTime = "2000";
  } else {
    baseDate = now;
    baseTime = "2300";
  }

  const y = baseDate.getFullYear();
  const m = String(baseDate.getMonth() + 1).padStart(2, "0");
  const d = String(baseDate.getDate()).padStart(2, "0");

  return { baseDate: `${y}${m}${d}`, baseTime };
}

export async function getWeather(regionCode: string): Promise<WeatherResult> {
  const grid = WEATHER_GRID[regionCode];
  if (!grid) throw new Error(`Unknown region: ${regionCode}`);

  const { baseDate, baseTime } = getBaseDateTime();

  // serviceKey는 인코딩하지 않고 직접 삽입 (이중 인코딩 방지)
  const params = new URLSearchParams({
    numOfRows: "300",
    pageNo: "1",
    dataType: "JSON",
    base_date: baseDate,
    base_time: baseTime,
    nx: String(grid.nx),
    ny: String(grid.ny),
  });

  const res = await fetch(`${BASE_URL}?serviceKey=${API_KEY}&${params}`);
  const json = await res.json();

  const items = json?.response?.body?.items?.item;
  if (!items || items.length === 0) {
    throw new Error(`No weather data: ${JSON.stringify(json?.response?.header)}`);
  }

  // 오늘 날짜
  const now = new Date();
  const todayStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

  let temp: number | null = null;
  let minTemp: number | null = null;
  let maxTemp: number | null = null;
  let skyCode = "1";
  let ptyCode = "0";

  for (const item of items) {
    if (item.fcstDate !== todayStr) continue;

    switch (item.category) {
      case "TMP":
        // 현재 시간에 가장 가까운 기온
        if (temp === null) temp = Number(item.fcstValue);
        break;
      case "TMN":
        minTemp = Number(item.fcstValue);
        break;
      case "TMX":
        maxTemp = Number(item.fcstValue);
        break;
      case "SKY":
        if (skyCode === "1") skyCode = item.fcstValue;
        break;
      case "PTY":
        if (ptyCode === "0" && item.fcstValue !== "0") ptyCode = item.fcstValue;
        break;
    }
  }

  return {
    regionName: grid.name,
    temp: temp ?? 0,
    minTemp: minTemp ?? temp ?? 0,
    maxTemp: maxTemp ?? temp ?? 0,
    sky: SKY_MAP[skyCode] || "맑음☀",
    hasRain: RAIN_CODES.includes(ptyCode),
    ptyCode,
  };
}
