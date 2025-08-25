// src/pages/Select.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import step1 from "../assets/img/step1.png";
import ProfileSidebar from "../components/profile/home/ProfileSidebar";
import BenefitGrid from "../components/profile/home/BenefitGrid";
import PartnerStartModal from "../components/popup/PartnerStartModal";
import InquiryModal from "../components/profile/home/InquiryModal"; // ✅ 추가

// ✅ 정확한 SCSS 경로
import "../assets/scss/pages/select.scss";

// ✅ 스크랩 공용 저장소 (Cooperation과 동일)
import { getAll, subscribe } from "../utils/scrapStore";

// ✅ 이미지 import 추가
import plane from "../assets/img/plane.png";
import take from "../assets/img/take.png";

export default function Select() {
  console.log("Select 컴포넌트 렌더링됨"); // 디버깅용
  const nav = useNavigate();
  const location = useLocation();

  // 탭: 기본은 '제휴 문의' 탭, state에서 받은 탭이 있으면 그걸 사용
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "inquiry"
  );

  // ✅ 팝업 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");

  // ✅ InquiryModal용 상태 추가
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // ✅ 저장소에서 읽어온 전체 아이템
  const [items, setItems] = useState(() => getAll());

  // ✅ 최초 로드 + 다른 페이지(Cooperation 등)에서 스크랩 변경 시 실시간 반영
  useEffect(() => {
    setItems(getAll());
    const unsub = subscribe((list) => setItems(list));
    return () => unsub();
  }, []);

  // ✅ state에서 받은 탭이 있으면 적용
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    // ✅ 추가: state에서 모달 자동 열기 확인
    if (location.state?.openModal && location.state?.brand) {
      setSelectedBrand(location.state.brand);
      setModalOpen(true);
    }
  }, [location.state]);

  // ✅ 스크랩된 것만 필터
  const scrapped = useMemo(
    () => (items || []).filter((it) => it?.scrab_done === true),
    [items]
  );

  // ✅ 팝업 모달 열기 함수
  const openModal = (brand) => {
    setSelectedBrand(brand);
    setModalOpen(true);
  };

  // ✅ 팝업 모달 닫기 함수
  const closeModal = () => {
    setModalOpen(false);
    setSelectedBrand("");
  };

  // ✅ PartneringPage로 이동하는 함수
  const goToPartnering = () => {
    nav("/partnering");
    closeModal();
  };

  // ✅ 자세히 보기 클릭 시 InquiryModal 열기
  const openInquiryModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setInquiryModalOpen(true);
  };

  // ✅ InquiryModal 닫기
  const closeInquiryModal = () => {
    setInquiryModalOpen(false);
    setSelectedInquiry(null);
  };

  // ✅ 문의 삭제 처리
  const handleDeleteInquiry = async (inquiryId) => {
    // 여기서 실제 삭제 로직 구현
    console.log("삭제할 문의 ID:", inquiryId);
    // 성공적으로 삭제되면 모달 닫기
    closeInquiryModal();
  };

  // ✅ 간단한 문의 리스트 컴포넌트
  const InquiryList = ({ items = [], mode = "sent" }) => {
    const icon = mode === "received" ? take : plane;

    return (
      <div className="inquiry-list">
        {items.length === 0 ? (
          <div className="empty">목록이 없습니다.</div>
        ) : (
          <ul>
            {items.map((it) => (
              <li key={it.id} className="inquiry-item">
                <div className="item-left">
                  <img className="icon" src={icon} alt="" />
                  <span className="text">{it.name}</span>
                </div>
                {/* ✅ PartnerStartModal 대신 InquiryModal 열기 */}
                <button type="button" className="detail-btn" onClick={() => openInquiryModal(it)}>
                  <span>자세히 보기&nbsp;&gt;</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

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

          {/* 탭을 page-head 밖으로 이동 */}
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
            <section className="content">
              <div className="panel inquiry">
                {/* ✅ 새로운 구조: 왼쪽/오른쪽 섹션으로 분리 */}
                <div className="inquiry-container">
                  {/* 왼쪽: 보낸 문의함 */}
                  <div className="inquiry-section sent-section">
                    <h3 className="section-title">보낸 문의함</h3>
                    <InquiryList 
                      items={[
                        { id: 1, name: "샤브온당" },
                        { id: 2, name: "투고샐러드" }
                      ]} 
                      mode="sent" 
                    />
                  </div>

                  {/* 중앙선 */}
                  <div className="inquiry-divider"></div>

                  {/* 오른쪽: 받은 문의함 */}
                  <div className="inquiry-section received-section">
                    <h3 className="section-title">받은 문의함</h3>
                    <InquiryList 
                      items={[
                        { id: 3, name: "카페구월" },
                        { id: 4, name: "오르비에토" }
                      ]} 
                      mode="received" 
                    />
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="content">
              {scrapped.length === 0 ? (
                <div className="empty" style={{ padding: 24 }}>
                  스크랩된 게시물이 없습니다. 제휴를 잇지에서 마음에 드는 게시물을 스크랩해보세요!
                </div>
              ) : (
                // ✅ BenefitGrid는 '순수 뷰'로, 전달된 items만 렌더하도록 유지
                <div className="panel benefits">
                  <div className="section-title">진행 중인 제휴/혜택</div>
                  <BenefitGrid items={scrapped} />
                </div>
              )}
            </section>
          )}
        </section>
      </div>

      {/* ✅ InquiryModal 추가 */}
      <InquiryModal
        open={inquiryModalOpen}
        title={selectedInquiry?.name || ""}
        inquiryId={selectedInquiry?.id}
        onClose={closeInquiryModal}
        onDelete={handleDeleteInquiry}
      />

      {/* ✅ PartnerStartModal은 그대로 유지 (다른 용도로) */}
      <PartnerStartModal
        open={modalOpen}
        brand={selectedBrand}
        onClose={closeModal}
        onGo={goToPartnering}
      />
    </main>
  );
}