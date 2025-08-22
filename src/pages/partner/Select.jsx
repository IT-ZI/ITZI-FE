// src/pages/partner/Select.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../../components/profile/home/ProfileSidebar";
import InquiryPanel from "../../components/profile/home/InquiryPanel";
import "../../assets/scss/pages/select.scss";

/** ─────────────────────────────────────────────────────────
 *  스크랩 그리드
 *  - items prop이 오면 그대로 사용
 *  - 없으면 localStorage/sessionStorage의 "benefits"를 읽어 사용
 *  - scrab_done === true 만 필터링
 *  - UI는 간단 카드 (이름/태그/상태)로 표시
 *  ───────────────────────────────────────────────────────── */
function ScrapGrid({ items }) {
  const [raw, setRaw] = useState([]);

  useEffect(() => {
    if (items && Array.isArray(items)) {
      setRaw(items);
      return;
    }
    // 저장소에서 불러오기 (없으면 빈 배열)
    try {
      const fromLocal =
        JSON.parse(localStorage.getItem("benefits") || "[]") || [];
      const fromSession =
        JSON.parse(sessionStorage.getItem("benefits") || "[]") || [];
      const merged = Array.isArray(fromLocal) && fromLocal.length > 0
        ? fromLocal
        : fromSession;
      setRaw(Array.isArray(merged) ? merged : []);
    } catch {
      setRaw([]);
    }
  }, [items]);

  const scrabbed = useMemo(
    () => raw.filter((it) => it?.scrab_done === true),
    [raw]
  );

  if (scrabbed.length === 0) {
    return (
      <div className="scrap-empty">
        스크랩한 항목이 없습니다.
      </div>
    );
  }

  return (
    <div className="scrap-grid">
      {scrabbed.map((it) => (
        <article key={it.id ?? it.name} className="scrap-card">
          <div className="sc-head">
            <div className="badge">스크랩</div>
            <h4 className="name">{it.name ?? it.title ?? "이름없음"}</h4>
          </div>

          {it.tags && Array.isArray(it.tags) && it.tags.length > 0 && (
            <ul className="tags">
              {it.tags.map((t, i) => (
                <li key={i} className="tag">#{t}</li>
              ))}
            </ul>
          )}

          <div className="meta">
            {it.category && <span className="chip">{it.category}</span>}
            {it.area && <span className="chip">{it.area}</span>}
          </div>
        </article>
      ))}
    </div>
  );
}

export default function Select() {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState("inquiry"); // "inquiry" | "scrap"

  return (
    <main className="select-page">
      <div className="container">
        {/* 좌측 사이드바 */}
        <aside className="left">
          <ProfileSidebar
            profile={{ name: "성신총학_소망이랑", org: "성신여자대학교 총학생회" }}
            toProceed={2}
          />
        </aside>

        {/* 우측 본문 */}
        <section className="right">
          {/* 페이지 타이틀 */}
          <header className="page-head">
            <div className="left-side">
              <span className="step">1</span>
              <h2 className="title">선택하기</h2>
            </div>
            <div className="right-side">
              <button
                type="button"
                className="more-btn"
                onClick={() => nav("/partners")}
                aria-label="제휴처 리스트 더보기"
              >
                제휴처 리스트 더보기
              </button>
            </div>
          </header>

          {/* 탭 */}
          <div className="tabs">
            <button
              type="button"
              className={`tab ${activeTab === "inquiry" ? "active" : ""}`}
              onClick={() => setActiveTab("inquiry")}
            >
              제휴 문의
            </button>
            <button
              type="button"
              className={`tab ${activeTab === "scrap" ? "active" : ""}`}
              onClick={() => setActiveTab("scrap")}
            >
              스크랩
            </button>
          </div>

          {/* 콘텐츠 영역 */}
          <div className="content">
            {activeTab === "inquiry" ? (
              <InquiryPanel />
            ) : (
              // ✅ scrab_done = true 만 보여줌
              <ScrapGrid />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
