// src/pages/partner/Select.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import step1 from "../../assets/img/step1.png";
import ProfileSidebar from "../../components/profile/home/ProfileSidebar";
import InquiryPanel from "../../components/profile/home/InquiryPanel";
import BenefitGrid from "../../components/profile/home/BenefitGrid";

// 레이아웃/카드 그리드 스타일
import "../../assets/scss/pages/select.scss";

/** 저장소 키 (BenefitGrid의 persistToggle과 동일 키 사용) */
const KEY = "benefits";

export default function Select() {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState("scrap"); // 기본: 스크랩
  const [items, setItems] = useState([]);

  // 저장소에서 benefits 읽기
  useEffect(() => {
    const read = () => {
      try {
        const l = localStorage.getItem(KEY);
        const s = sessionStorage.getItem(KEY);
        const parsed =
          (l && JSON.parse(l)) ||
          (s && JSON.parse(s)) ||
          [];
        if (Array.isArray(parsed)) setItems(parsed);
        else setItems([]);
      } catch {
        setItems([]);
      }
    };

    read();

    // BenefitGrid의 persistToggle이 브로드캐스트하는 이벤트 수신
    const onUpdated = () => read();
    window.addEventListener("benefits:updated", onUpdated);
    return () => window.removeEventListener("benefits:updated", onUpdated);
  }, []);

  // ✅ 스크랩된 것만 필터링
  const scrapped = useMemo(
    () => items.filter((it) => it?.scrab_done === true),
    [items]
  );

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
              <div className="sub-title">제휴 맺기</div>
              <div className="title-row">
                <span className="step">
                  <img src={step1} alt="Step 1" />
                </span>
                <h2 className="title">선택하기</h2>
              </div>
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

          {/* 콘텐츠 */}
          {activeTab === "inquiry" ? (
            // 문의 탭
            <section className="content">
              <div className="panel inquiry">
                <InquiryPanel />
              </div>
            </section>
          ) : (
            // 스크랩 탭: 스크랩된 것만 표시
            <section className="content">
              {scrapped.length === 0 ? (
                <div className="empty" style={{ padding: 24 }}>
                  스크랩된 게시물이 없습니다.
                </div>
              ) : (
                <BenefitGrid items={scrapped} />
              )}
            </section>
          )}
        </section>
      </div>
    </main>
  );
}