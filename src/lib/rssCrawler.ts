import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const RSS_FEEDS = [
  {
    url: "https://www.omate.kr/rss/allArticle.xml",
    source: "시니어매일",
    encoding: "utf-8",
  },
  {
    url: "http://www.bokjinews.com/rss/S1N1.xml",
    source: "복지뉴스",
    encoding: "euc-kr",
  },
  {
    url: "https://www.ablenews.co.kr/rss/S1N1.xml",
    source: "에이블뉴스",
    encoding: "utf-8",
  },
  // 부산 전용 (실패 시 자동 건너뜀)
  {
    url: "https://www.busan.go.kr/rss/news.do",
    source: "부산시",
    encoding: "utf-8",
  },
  {
    url: "https://www.bisco.or.kr/rss",
    source: "부산복지개발원",
    encoding: "utf-8",
  },
];

// 제목에 이 중 하나라도 포함되어야 통과
const MUST_INCLUDE = [
  "무료", "지원", "혜택", "신청", "축제", "행사", "할인",
  "바우처", "보조금", "접종", "검진", "돌봄", "급여",
  "경로당", "복지관", "기초연금", "일자리",
];

// 이것 중 하나라도 있으면 제외
const EXCLUDE = [
  "파업", "성범죄", "범죄", "사망", "사고", "논란",
  "비리", "구속", "체포", "소송", "재판", "폭행",
  "칼럼", "사설", "기자수첩", "전문가 칼럼",
  "공모전", "공모", "라운드테이블", "정책토론",
  "장학생 모집", "팝업스토어",
  "이·취임", "취임식", "이취임", "업무협약 체결",
  "협약 체결", "MOU", "자살", "성폭력", "학대",
  "국회", "정당", "대통령", "선거",
];

const REGION_KEYWORDS: Record<string, string[]> = {
  seoul: ["서울"],
  busan: ["부산"],
  daegu: ["대구"],
  incheon: ["인천"],
  gwangju: ["광주"],
  daejeon: ["대전"],
  ulsan: ["울산"],
  sejong: ["세종"],
  gyeonggi: ["경기", "수원", "성남", "고양", "용인", "안산", "안양"],
  gangwon: ["강원", "춘천", "원주", "강릉"],
  chungbuk: ["충북", "청주", "충주"],
  chungnam: ["충남", "천안", "아산"],
  jeonbuk: ["전북", "전주", "익산", "군산"],
  jeonnam: ["전남", "목포", "여수", "순천"],
  gyeongbuk: ["경북", "포항", "구미", "경주", "김천"],
  gyeongnam: ["경남", "창원", "김해", "진주"],
  jeju: ["제주"],
};

export interface CrawledBenefit {
  title: string;
  description: string;
  summary: string;
  source: string;
  sourceDate: string;
  crawledAt: string;
  link: string;
  type: "national" | "local";
  regionCode: string | null; // null = 전국
}

function parseRssItems(
  xml: string
): { title: string; description: string; pubDate: string; link: string }[] {
  const items: { title: string; description: string; pubDate: string; link: string }[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = itemXml.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1] || "";
    const desc = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1] || "";
    const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
    const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || "";
    items.push({
      title: title.trim(),
      description: desc.replace(/<[^>]*>/g, "").trim().substring(0, 300),
      pubDate: pubDate.trim(),
      link: link.trim(),
    });
  }
  return items;
}

function detectRegion(title: string, description: string): string | null {
  const text = title + " " + description;
  for (const [code, keywords] of Object.entries(REGION_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return code;
  }
  return null;
}

function isActionable(title: string, description: string): boolean {
  const text = title + " " + description;

  // 제외 키워드 체크
  if (EXCLUDE.some((kw) => text.includes(kw))) return false;

  // 필수 포함 키워드 체크
  return MUST_INCLUDE.some((kw) => text.includes(kw));
}

async function summarizeActionable(title: string, description: string): Promise<string> {
  try {
    const res = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: `아래 복지/혜택 뉴스를 65세 어르신이 바로 활용할 수 있게 2문장으로 요약하세요.

규칙:
1. "~하시면 됩니다" 또는 "~받으실 수 있습니다" 형태
2. 어디서, 언제, 무엇을 할 수 있는지 포함
3. 존댓말, 쉬운 말
4. 요약만 출력

제목: ${title}
내용: ${description}

요약:`,
        },
      ],
    });
    return res.content[0].type === "text" ? res.content[0].text.trim() : title;
  } catch {
    return description.substring(0, 80);
  }
}

export async function crawlBenefits(): Promise<CrawledBenefit[]> {
  const crawledAt = new Date().toISOString();
  const allItems: CrawledBenefit[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(feed.url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;

      let text: string;
      if (feed.encoding === "euc-kr") {
        const buffer = await res.arrayBuffer();
        const decoder = new TextDecoder("euc-kr");
        text = decoder.decode(buffer);
      } else {
        text = await res.text();
      }

      const items = parseRssItems(text);

      // 엄격한 필터링: 활용 가능한 것만
      const actionableItems = items.filter((item) =>
        isActionable(item.title, item.description)
      );

      for (const item of actionableItems.slice(0, 3)) {
        const summary = await summarizeActionable(item.title, item.description);

        // AI가 "활용 불가", "요약 불가" 등으로 판단하면 제외
        if (
          summary.includes("불가능") ||
          (summary.includes("활용할 수 있는") && summary.includes("포함되어 있지 않"))
        ) {
          continue;
        }

        const regionCode = detectRegion(item.title, item.description);

        allItems.push({
          title: item.title,
          description: item.description.substring(0, 100),
          summary,
          source: feed.source,
          sourceDate: item.pubDate,
          crawledAt,
          link: item.link,
          type: regionCode ? "local" : "national",
          regionCode,
        });
      }
    } catch {
      // 개별 피드 실패 무시
    }
  }

  return allItems;
}
