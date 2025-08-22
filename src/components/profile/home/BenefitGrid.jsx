// src/components/.../BenefitGrid.jsx
import scrab from "../../../assets/img/scrab.png";
import scrabDone from "../../../assets/img/scrab_done.png";
import cafe from "../../../assets/img/cafe.png";
import vintage from "../../../assets/img/vintage.png";
import dongbang from "../../../assets/img/dongbang.png";
import left from "../../../assets/img/left.png";
import right from "../../../assets/img/right.png";
import center from "../../../assets/img/center.png";
import React, { useMemo, useState } from "react";

/** 썸네일 파일명 → import 모듈 매핑 */
const thumbMap = {
  "cafe.png": cafe,
  "vintage.png": vintage,
  "dongbang.png": dongbang,
  "left.png": left,
  "center.png": center,
  "right.png": right,
};

/** 어떤 입력이 와도 안전하게 처리 */
const getThumb = (name) => {
  if (!name) return cafe;
  if (typeof name !== "string") return name;
  let file = name.split("/").pop().toLowerCase();
  if (!/\.(png|jpe?g|webp|gif)$/.test(file)) file = `${file}.png`;
  return thumbMap[file] ?? cafe;
};

/** 숫자 필드 추출(여러 네이밍 케이스 허용) */
const getCount = (b) => {
  const v = b?.scrapCount ?? b?.scrap_count ?? b?.scrab_count ?? b?.likes ?? b?.like ?? 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** boolean 필드 추출(여러 네이밍 케이스 허용) */
const getScrapped = (b) => Boolean(b?.scrapped ?? b?.scrap_done ?? b?.scrab_done);

/** 저장소 갱신 유틸: localStorage / sessionStorage 동시 반영 */
function persistToggle(id, makeScrapped) {
  const apply = (raw) => {
    if (!raw) return raw;
    let arr;
    try { arr = JSON.parse(raw); } catch { return raw; }
    if (!Array.isArray(arr)) return raw;

    const next = arr.map((it) => {
      if ((it.id ?? it.title) !== id) return it;
      const wasOn = getScrapped(it);
      const nowOn = typeof makeScrapped === "boolean" ? makeScrapped : !wasOn;
      const base = getCount(it);
      const nextCount = Math.max(0, base + (nowOn ? 1 : -1));
      return {
        ...it,
        // 다양한 키 모두 동기화
        scrapped: nowOn,
        scrap_done: nowOn,
        scrab_done: nowOn,
        scrapCount: nextCount,
        scrap_count: nextCount,
        scrab_count: nextCount,
        likes: nextCount,
        like: nextCount,
      };
    });
    return JSON.stringify(next);
  };

  try {
    const k = "benefits";
    const l = localStorage.getItem(k);
    const s = sessionStorage.getItem(k);
    if (l != null) localStorage.setItem(k, apply(l));
    if (s != null) sessionStorage.setItem(k, apply(s));
  } catch {
    /* storage 접근 실패 시 무시 */
  }
}

/**
 * BenefitGrid
 * - readOnly=false일 때 스크랩 토글 가능
 * - onToggleScrap(id) 를 부모에서 넘기면 호출(선택)
 * - 내부적으로도 storage 갱신 + 커스텀 이벤트 발행 → select 스크랩 탭과 연동
 *
 * 📌 Select 스크랩 탭 연동 예시:
 *   useEffect(() => {
 *     const onChange = () => forceReloadFromStorage(); // or setState(...)
 *     window.addEventListener("benefit:scrap-changed", onChange);
 *     return () => window.removeEventListener("benefit:scrap-changed", onChange);
 *   }, []);
 */
export default function BenefitGrid({
  items = [],
  readOnly = false,
  onToggleScrap = () => {},
}) {
  // 낙관적 UI 오버라이드(카드별 스크랩 상태/숫자)
  const [overrides, setOverrides] = useState({}); // { [id]: {on, count} }

  const list = useMemo(() => {
    return items.map((b) => {
      const id = b.id ?? b.title;
      const baseOn = getScrapped(b);
      const baseCount = getCount(b);
      const ov = overrides[id];
      return {
        raw: b,
        id,
        title: b.title ?? "",
        thumb: getThumb(b.thumb),
        target: b.target ?? "",
        startDate: b.startDate ?? b.start_date ?? "",
        endDate: b.endDate ?? b.end_date ?? "",
        benefit: b.benefit ?? "",
        on: ov?.on ?? baseOn,
        count: ov?.count ?? baseCount,
      };
    });
  }, [items, overrides]);

  const toggle = (id) => {
    if (readOnly) return;
    // 현재 상태 계산
    const cur = list.find((x) => x.id === id);
    if (!cur) return;
    const nextOn = !cur.on;
    const nextCount = Math.max(0, cur.count + (nextOn ? 1 : -1));

    // 1) 즉시 UI 반영
    setOverrides((m) => ({ ...m, [id]: { on: nextOn, count: nextCount } }));

    // 2) storage 갱신 (benefits)
    persistToggle(id, nextOn);

    // 3) 외부 콜백 통지(있으면)
    try { onToggleScrap(id); } catch {}

    // 4) select 스크랩 탭 등에 알림
    try {
      window.dispatchEvent(
        new CustomEvent("benefit:scrap-changed", {
          detail: { id, scrapped: nextOn, count: nextCount },
        })
      );
    } catch {}
  };

  return (
    <section className="benefits-wrap">
      <h3 className="section-title">진행 중인 제휴/혜택</h3>

      <div className="panel benefits">
        <div className="progress-panel">
          <div className="progress-grid">
            {list.map((b) => (
              <article key={b.id} className="benefit-card">
                <div className="thumb">
                  <img src={b.thumb} alt={b.title} loading="lazy" />
                </div>

                {/* 본문(뱃지 기준 컨테이너) */}
                <div className="body" style={{ position: "relative" }}>
                  {/* ✅ 우상단 스크랩 뱃지 */}
                  <div
                    className="scrap-badge"
                    role="group"
                    aria-label="스크랩"
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 8,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      zIndex: 99,
                      visibility: "visible",
                      opacity: 1,
                    }}
                  >
                    <span
                      className={`scrap-count ${b.on ? "on" : ""}`}
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1,
                        color: b.on ? "#1FC37D" : "#5CCB9A",
                      }}
                    >
                      {b.count}
                    </span>

                    <button
                      className={`scrap ${b.on ? "on" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(b.id);
                      }}
                      disabled={readOnly}
                      aria-label={b.on ? "스크랩 해제" : "스크랩"}
                      title={readOnly ? "읽기 전용" : ""}
                      style={{
                        width: 20,
                        height: 20,
                        border: 0,
                        background: "transparent",
                        padding: 0,
                        cursor: readOnly ? "default" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={b.on ? scrabDone : scrab}
                        alt=""
                        style={{ width: 16, height: 16, display: "block" }}
                      />
                    </button>
                  </div>

                  <div className="title-row">
                    <h4 className="title" title={b.title}>
                      {b.title}
                    </h4>
                  </div>

                  <ul className="meta">
                    <li>
                      <span className="label">대상</span>
                      <span className="sep">ㅣ</span>
                      <span className="value" title={b.target}>
                        {b.target}
                      </span>
                    </li>
                    <li>
                      <span className="label">기간</span>
                      <span className="sep">ㅣ</span>
                      <span className="value">
                        {b.startDate} ~ {b.endDate}
                      </span>
                    </li>
                    <li>
                      <span className="label">혜택</span>
                      <span className="sep">ㅣ</span>
                      <span className="value" title={b.benefit}>
                        {b.benefit}
                      </span>
                    </li>
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
