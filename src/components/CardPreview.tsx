export default function CardPreview() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          매일 아침 이런 카드가 도착해요
        </h2>

        <div className="flex justify-center">
          {/* 카카오톡 채팅방 */}
          <div
            style={{
              background: "#B5C8D8",
              borderRadius: 30,
              padding: "20px 14px 30px",
              width: 340,
            }}
          >
            {/* 채팅방 상단 헤더 */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "#F9E000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                💛
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>챙겨드림</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.72)" }}>
                  부모님 곁의 든든한 디지털 비서
                </div>
              </div>
            </div>

            {/* 말풍선 + 시간 */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <div style={{ flex: 1 }}>
                {/* 카드 */}
                <div
                  style={{
                    width: 300,
                    borderRadius: 22,
                    overflow: "hidden",
                    background: "#FAFAF7",
                  }}
                >
                  {/* 브랜드 헤더 */}
                  <div
                    style={{
                      background: "#FF6B35",
                      padding: "14px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Noto Serif KR', serif",
                        fontSize: 17,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      챙겨드림
                    </span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.72)", textAlign: "right" }}>
                      2026년 3월 20일
                      <br />
                      금요일
                    </span>
                  </div>

                  {/* ① 날씨 */}
                  <div style={{ padding: "16px 20px", background: "#fff" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.10em", marginBottom: 10 }}>
                      ☀️ 오늘의 날씨
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#8E8E93", marginBottom: 2 }}>📍 부산광역시</div>
                        <div style={{ display: "flex", alignItems: "flex-start" }}>
                          <span style={{ fontSize: 54, fontWeight: 900, color: "#1C1C1E", lineHeight: 1 }}>11</span>
                          <span style={{ fontSize: 20, fontWeight: 300, color: "#8E8E93", marginTop: 6 }}>°</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#8E8E93", marginTop: 2 }}>최저 8° · 최고 11°</div>
                        <div
                          style={{
                            marginTop: 8,
                            display: "inline-block",
                            background: "#EBF3FF",
                            color: "#007AFF",
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "4px 10px",
                            borderRadius: 20,
                          }}
                        >
                          🌧 종일 비 예보
                        </div>
                      </div>
                      <span style={{ fontSize: 58, lineHeight: 1 }}>🌧</span>
                    </div>
                  </div>

                  <div style={{ height: 1.5, background: "#EEEBE4" }} />

                  {/* ② AI 맞춤 안부 */}
                  <div style={{ padding: "16px 20px", background: "#FAFAF7" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.10em", marginBottom: 10 }}>
                      🤖 AI 맞춤 안부
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #A855F7, #6366F1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          flexShrink: 0,
                        }}
                      >
                        🤖
                      </div>
                      <div
                        style={{
                          background: "#fff",
                          border: "1.5px solid #EDE8FF",
                          borderRadius: "4px 14px 14px 14px",
                          padding: "12px 14px",
                          fontSize: 12,
                          color: "#333",
                          lineHeight: 1.6,
                        }}
                      >
                        홍길동님, 좋은 아침이에요 😊
                        <br />
                        오늘 종일 비가 내려요.{" "}
                        <span style={{ color: "#FF6B35", fontWeight: 700 }}>우산 꼭 챙기시고</span>{" "}
                        비 맞으면 관절이 더 욱신거릴 수 있으니 따뜻하게 입고 나가세요.
                        <br />
                        벌써 금요일이에요! 💙
                      </div>
                    </div>
                  </div>

                  <div style={{ height: 1.5, background: "#EEEBE4" }} />

                  {/* ③ 오늘의 좋은 말씀 */}
                  <div style={{ padding: "16px 20px", background: "#FAFAF7" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.10em", marginBottom: 10 }}>
                      ✨ 오늘의 좋은 말씀
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ width: 4, borderRadius: 2, background: "#FF6B35", flexShrink: 0 }} />
                      <div>
                        <div style={{ color: "#111111", fontWeight: 700, fontSize: 14, lineHeight: 1.6 }}>
                          나무는 폭풍 속에서
                          <br />더 깊이 뿌리를 내린다.
                        </div>
                        <div style={{ fontSize: 11, color: "#B0A898", marginTop: 6 }}>— 작자 미상</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ height: 1.5, background: "#EEEBE4" }} />

                  {/* ④ 복약 알림 */}
                  <div style={{ padding: "16px 20px", background: "#FAFAF7" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.10em", marginBottom: 10 }}>
                      💊 오늘의 복약 알림
                    </div>
                    <div
                      style={{
                        background: "#FFF5F5",
                        border: "1.5px solid #FFD0D0",
                        borderRadius: 14,
                        padding: "14px 16px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            background: "#FF4D4D",
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 20,
                            flexShrink: 0,
                          }}
                        >
                          💊
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1C1E" }}>
                          홍길동님, 오늘 드실 약이에요
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {[
                          { color: "#FF4D4D", name: "혈압약", time: "아침 식후 30분" },
                          { color: "#007AFF", name: "당뇨약", time: "아침·저녁 식전" },
                          { color: "#34C759", name: "비타민D", time: "아침 식후" },
                        ].map((med) => (
                          <div key={med.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: med.color,
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ fontWeight: 600, color: "#1C1C1E" }}>{med.name}</span>
                            <span style={{ color: "#8E8E93" }}>—</span>
                            <span style={{ color: "#6E6860" }}>{med.time}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 11, color: "#FF6B35", marginTop: 10 }}>
                        오늘도 빠짐없이 챙겨 드세요 💙
                      </div>
                    </div>
                  </div>

                  <div style={{ height: 1.5, background: "#EEEBE4" }} />

                  {/* ⑤ 운세 */}
                  <div style={{ padding: "16px 20px", background: "#FAFAF7" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.10em", marginBottom: 10 }}>
                      🔮 오늘의 운세
                    </div>
                    <div
                      style={{
                        background: "#fff",
                        border: "1.5px solid #EEEBE4",
                        borderRadius: 14,
                        padding: "14px 16px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 46,
                            height: 46,
                            borderRadius: "50%",
                            background: "#FFF5F0",
                            border: "2px solid #FFE0D0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 24,
                            flexShrink: 0,
                          }}
                        >
                          🐂
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "#8E8E93" }}>1962년생 · 소띠</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1C1E" }}>홍길동님의 운세</div>
                          <div style={{ fontSize: 14, marginTop: 2 }}>⭐⭐⭐⭐⭐</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "#4E5968", lineHeight: 1.6, marginTop: 10 }}>
                        금요일 운이 매우 좋아요! 오늘 중요한 일이 있다면 도전해보세요 🌟
                      </div>
                    </div>
                  </div>

                  <div style={{ height: 1.5, background: "#EEEBE4" }} />

                  {/* ⑥ 오늘의 혜택 */}
                  <div style={{ padding: "16px 20px", background: "#FAFAF7" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.10em", marginBottom: 10 }}>
                      📍 오늘의 혜택 · 정보
                    </div>

                    {/* 전국 공통 */}
                    <div
                      style={{
                        display: "inline-block",
                        background: "#1C1C1E",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 6,
                        marginBottom: 8,
                      }}
                    >
                      🇰🇷 전국 공통
                    </div>
                    <div
                      style={{
                        background: "#fff",
                        border: "1.5px solid #EEEBE4",
                        borderRadius: 14,
                        padding: "14px 16px",
                        marginBottom: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: "#FFF0EB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                            flexShrink: 0,
                          }}
                        >
                          💰
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1C1E" }}>기초연금 인상 신청 안내</div>
                          <div style={{ fontSize: 11, color: "#8E8E93", marginTop: 2, lineHeight: 1.5 }}>
                            2026년 기초연금이 인상됩니다. 가까운 주민센터에서 신청하세요.
                          </div>
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: 6,
                              fontSize: 10,
                              fontWeight: 600,
                              color: "#FF6B35",
                              background: "#FFF0EB",
                              padding: "2px 8px",
                              borderRadius: 10,
                            }}
                          >
                            정부혜택
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 지역별 */}
                    <div
                      style={{
                        display: "inline-block",
                        background: "#2E7D52",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 6,
                        marginBottom: 8,
                      }}
                    >
                      📍 부산 동구
                    </div>
                    <div
                      style={{
                        background: "#fff",
                        border: "1.5px solid #EEEBE4",
                        borderRadius: 14,
                        padding: "14px 16px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: "#ECFDF5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                            flexShrink: 0,
                          }}
                        >
                          🏥
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1C1E" }}>동구 보건소 무료 혈압 측정</div>
                          <div style={{ fontSize: 11, color: "#8E8E93", marginTop: 2, lineHeight: 1.5 }}>
                            매주 월·수·금 오전 9시~12시, 동구 보건소 1층
                          </div>
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: 6,
                              fontSize: 10,
                              fontWeight: 600,
                              color: "#2E7D52",
                              background: "#ECFDF5",
                              padding: "2px 8px",
                              borderRadius: 10,
                            }}
                          >
                            무료 의료
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ height: 1.5, background: "#EEEBE4" }} />

                  {/* ⑦ 손자녀 소통 팁 */}
                  <div style={{ padding: "16px 20px", background: "#FAFAF7" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.10em", marginBottom: 10 }}>
                      👨‍👧 손자녀 소통 팁
                    </div>
                    <div
                      style={{
                        background: "#fff",
                        border: "1.5px solid #EEEBE4",
                        borderRadius: 14,
                        padding: "14px 16px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span
                          style={{
                            background: "#1C1C1E",
                            color: "#fff",
                            fontSize: 15,
                            fontWeight: 700,
                            borderRadius: 20,
                            padding: "4px 14px",
                          }}
                        >
                          레전드
                        </span>
                        <span style={{ color: "#D0CCBF", fontSize: 16, fontWeight: 700 }}>=</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#1C1C1E" }}>최고라는 뜻</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#6E6860", lineHeight: 1.6 }}>
                        손주한테 &lsquo;너 레전드다!&rsquo; 해보세요.
                        <br />
                        완전 좋아할 거예요 😄
                      </div>
                    </div>
                  </div>

                  <div style={{ height: 1.5, background: "#EEEBE4" }} />

                  {/* ⑧ 로또 */}
                  <div style={{ padding: "16px 20px", background: "#FEFDF0" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.10em" }}>
                        🍀 이번 주 행운 번호
                      </div>
                      <span
                        style={{
                          background: "#FF6B35",
                          color: "#fff",
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 20,
                        }}
                      >
                        목·금요일만 발송
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#8E8E93", marginBottom: 12 }}>
                      어제 꿈에서 받아온 번호예요 😄
                      <br />딱 1천원만 재미로!
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 12 }}>
                      {[
                        { n: 7, bg: "#FF4D4D" },
                        { n: 14, bg: "#FF8C00" },
                        { n: 25, bg: "#F5C518", color: "#333" },
                        { n: 33, bg: "#34C759" },
                        { n: 39, bg: "#007AFF" },
                        { n: 42, bg: "#AF52DE" },
                      ].map((ball) => (
                        <span
                          key={ball.n}
                          style={{
                            width: 33,
                            height: 33,
                            borderRadius: "50%",
                            background: ball.bg,
                            color: ball.color || "#fff",
                            fontSize: 12,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {ball.n}
                        </span>
                      ))}
                      <span style={{ fontSize: 14, color: "#B0A898", margin: "0 2px" }}>+</span>
                      <span
                        style={{
                          width: 33,
                          height: 33,
                          borderRadius: "50%",
                          background: "#8E8E93",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        7
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#B0A898", lineHeight: 1.5 }}>
                      ※ 순수 재미용이에요. 당첨 보장 없음.
                      <br />
                      안 되도 제 탓 금지 🙅
                      <br />
                      당첨되면 커피 한 잔은 사주셔야 해요!
                    </div>
                  </div>

                  {/* 카드 푸터 */}
                  <div
                    style={{
                      background: "#EFECE5",
                      padding: "9px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: "0 0 22px 22px",
                    }}
                  >
                    <span style={{ fontSize: 10, color: "#B0A898" }}>챙겨드림 · 매일 아침 07:10</span>
                    <span style={{ fontSize: 9, color: "#C8C4BC" }}>수신거부 080-000-0000</span>
                  </div>
                </div>
              </div>

              {/* 시간 표시 */}
              <span style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 2, flexShrink: 0 }}>
                오전 7:10
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
