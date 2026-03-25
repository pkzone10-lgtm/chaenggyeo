const ZODIAC_DATA: Record<number, { zodiac: string; emoji: string; name: string }> = {
  0:  { zodiac: "원숭이", emoji: "🐵", name: "원숭이띠" },
  1:  { zodiac: "닭",     emoji: "🐔", name: "닭띠" },
  2:  { zodiac: "개",     emoji: "🐕", name: "개띠" },
  3:  { zodiac: "돼지",   emoji: "🐷", name: "돼지띠" },
  4:  { zodiac: "쥐",     emoji: "🐭", name: "쥐띠" },
  5:  { zodiac: "소",     emoji: "🐂", name: "소띠" },
  6:  { zodiac: "호랑이", emoji: "🐯", name: "호랑이띠" },
  7:  { zodiac: "토끼",   emoji: "🐰", name: "토끼띠" },
  8:  { zodiac: "용",     emoji: "🐲", name: "용띠" },
  9:  { zodiac: "뱀",     emoji: "🐍", name: "뱀띠" },
  10: { zodiac: "말",     emoji: "🐴", name: "말띠" },
  11: { zodiac: "양",     emoji: "🐑", name: "양띠" },
};

export function getZodiac(birthYear: number) {
  return ZODIAC_DATA[birthYear % 12];
}
