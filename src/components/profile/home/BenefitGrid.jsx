// src/components/profile/home/BenefitGrid.jsx
import scrab from "../../../assets/img/scrab.png";
import scrabDone from "../../../assets/img/scrab_done.png";
import cafe from "../../../assets/img/cafe.png";
import vintage from "../../../assets/img/vintage.png";
import dongbang from "../../../assets/img/dongbang.png";
import left from "../../../assets/img/left.png";
import right from "../../../assets/img/right.png";
import center from "../../../assets/img/center.png";
import React, { useEffect, useMemo, useState } from "react";

/** ───────── 썸네일 매핑 ───────── */
const thumbMap = {
  "cafe.png": cafe,
  "vintage.png": vintage,
  "dongbang.png": dongbang,
  "left.png": left,
  "center.png": center,
  "right.png": right,
};

/** 안전 썸네일 */
const getThumb = (name) => {
  if (!name) return cafe;
  if (typeof name !== "string") return name;
  let file = name.split("/").pop().toLowerCase();
  if (!/\.(png|jpe?g|webp|gif)$/.test(file)) file = `${file}.png`;
  return thumbMap[file] ?? cafe;
};

/** 단일 스키마 */
const getCount = (b) => {
  const n = Number(b?.scrab_count ?? 0);
  return Number.isFinite(n) ? n : 0;
};
const getScrapped = (b) => b?.scrab_done === true;

/** ───────── storage 헬퍼 ───────── */
const KEY = "benefits";
const readArr = (area) => {
  try {
    const raw = area.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : null;
    return Array.isArray(arr) ? arr : null;
  } catch {
    return null;
  }
};
const writeArr = (area, arr) => {
  try {
    area.setItem(KEY, JSON.stringify(arr));
  } catch {}
};

/** 토글 결과를 스토리지(있다면)에 반영 + 브로드캐스트 */
function persistToggle(id, makeOn) {
  const apply = (raw) => {
    if (!raw) return raw;
    let arr; try { arr = JSON.parse(raw); } catch { return raw; }
    if (!Array.isArray(arr)) return raw;

    const next = arr.map((it) => {
      if ((it.id ?? it.title) !== id) return it;
      const nowOn = typeof makeOn === "boolean" ? makeOn : !(it?.scrab_done === true);
      const base  = getCount(it);
      return { ...it, scrab_done: nowOn, scrab_count: Math.max(0, base + (nowOn ? 1 : -1)) };
    });
    return JSON.stringify(next);
  };

  try {
    const l = localStorage.getItem(KEY);
    const s = sessionStorage.getItem(KEY);
    if (l != null) localStorage.setItem(KEY, apply(l));
    if (s != null) sessionStorage.setItem(KEY, apply(s));
  } catch {}

  // 변경 알림 (Select.jsx 등에서 benefits:updated를 구독)
  try { window.dispatchEvent(new Event("benefits:updated")); } catch {}
}

/** ───────── 컴포넌트 ───────── */
export default function BenefitGrid({
  items = [],            // 상위에서 항상 내려주는 데이터 (scrab_done, scrab_count 포함)
  readOnly = false,
  onToggleScrap = () => {},
}) {
    // 낙관적 UI 반영용 오버라이드
    const [ov, setOv] = useState({}); // { [id]: { on, count } }
    // 렌더에 쓸 안전한 소스 배열 (props 없을 때도 빈배열 보장)
    const sourceItems = useMemo(() => (items && items.length ? items : []), [items]);


  // 렌더 리스트
  const list = useMemo(() => {
    return (sourceItems || []).map((b) => {
      const id = b.id ?? b.title;
      const baseOn = getScrapped(b);
      const baseCt = getCount(b);
      return {
        raw: b,
        id,
        title: b.title ?? "",
        thumb: getThumb(b.thumb),
        target: b.target ?? "",
        startDate: b.start_date ?? b.startDate ?? "",
        endDate: b.end_date ?? b.endDate ?? "",
        benefit: b.benefit ?? "",
        on: ov[id]?.on ?? baseOn,
        count: ov[id]?.count ?? baseCt,
      };
    });
  }, [sourceItems, ov]);

  const toggle = (id) => {
    if (readOnly) return;
    const cur = list.find((x) => x.id === id);
    if (!cur) return;
    const nextOn = !cur.on;
    const nextCt = Math.max(0, cur.count + (nextOn ? 1 : -1));

    // 1) 화면 즉시 반영
    setOv((m) => ({ ...m, [id]: { on: nextOn, count: nextCt } }));

    // 2) 스토리지 반영 + 이벤트 브로드캐스트
    persistToggle(id, nextOn);

    // 3) 상위 콜백
    try { onToggleScrap(id); } catch {}
  };

  return (
    <section className="benefits-wrap">
      <h3 className="section-title">진행 중인 제휴/혜택</h3>
      <div className="panel benefits">
        <div className="progress-panel">
          <div className="progress-grid">
            {list.map((b) => (
              <article
                key={b.id}
                className="benefit-card"
                style={{ background: "#fff", borderRadius: 14, overflow: "hidden" }}
              >
                {/* 썸네일 + 스크랩 뱃지 */}
                <div className="thumb" style={{ position: "relative" }}>
                  <img
                    src={b.thumb}
                    alt={b.title}
                    loading="lazy"
                    style={{ display: "block", width: "100%", height: "auto" }}
                  />
                  <div
                    className="scrap-badge"
                    role="group"
                    aria-label="스크랩"
                    style={{
                      position: "absolute",
                      top: 96,
                      right: 8,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      zIndex: 5,
                    }}
                  >
                    <span
                      className={`scrap-count ${b.on ? "on" : ""}`}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        lineHeight: 1,
                        color: b.on ? "#1FC37D" : "#5CCB9A",
                        minWidth: 10,
                        textAlign: "right",
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
                        width: 10.67,
                        height: 13.72,
                        cursor: readOnly ? "default" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={b.on ? scrabDone : scrab}
                        alt=""
                        style={{ width: 10.67, height: 13.72, display: "block" }}
                      />
                    </button>
                  </div>
                </div>

                {/* 본문 */}
                <div className="body" style={{ padding: "10px 12px 10px" }}>
                  <div className="title-row" style={{ marginBottom: 6 }}>
                    <h4
                      className="title"
                      title={b.title}
                      style={{ margin: 0, fontSize: 11.19, fontWeight: 700, color: "#000" }}
                    >
                      {b.title}
                    </h4>
                  </div>
                  <ul className="meta" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    <li style={{ display: "flex", gap: 6, fontSize: 8.96, color: "#000" }}>
                      <span className="label">대상</span>
                      <span className="sep">ㅣ</span>
                      <span className="value" title={b.target} style={{ color: "#000" }}>
                        {b.target}
                      </span>
                    </li>
                    <li style={{ display: "flex", gap: 6, fontSize: 8.96, color: "#000" }}>
                      <span className="label">기간</span>
                      <span className="sep">ㅣ</span>
                      <span className="value" style={{ color: "#000" }}>
                        {b.startDate} ~ {b.endDate}
                      </span>
                    </li>
                    <li style={{ display: "flex", gap: 6, fontSize: 8.96, color: "#000" }}>
                      <span className="label">혜택</span>
                      <span className="sep">ㅣ</span>
                      <span className="value" title={b.benefit} style={{ color: "#000" }}>
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
