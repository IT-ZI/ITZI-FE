import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

export default function AgreementModal({
  open = false,
  partnerName = "샤브온당",
  onClose = () => {},
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("internal"); // "internal" | "external"

  if (!open) return null;

  const handleBack = () => {
    onClose();
    navigate(-1); // 이전 화면으로 이동
  };

  const handleViewRecruitment = () => {
    console.log("제휴 모집 글 보기");
  };

  const handleViewInquiry = () => {
    console.log("제휴 문의 글 보기");
  };

  const handleManualCreation = () => {
    console.log("수동 작성");
  };

  const handleAICreation = () => {
    console.log("AI 자동 작성");
  };

  return createPortal(
    <div className="popup-frame agreement-modal">
      <div className="popup-backdrop" onClick={onClose} />
      <div className="popup-card agreement-card" onClick={(e) => e.stopPropagation()}>
        <header className="agreement-header">
          <button className="back-btn" onClick={handleBack}>&lt;</button>
          <h2 className="partner-name">{partnerName}</h2>
          <div className="header-buttons">
            <button className="view-btn" onClick={handleViewRecruitment}>
              제휴 모집 글 보기
            </button>
            <button className="view-btn" onClick={handleViewInquiry}>
              제휴 문의 글 보기
            </button>
          </div>
        </header>

        <main className="agreement-main">
          <div className="tab-nav">
            <button 
              className={`tab-btn ${activeTab === "internal" ? "active" : ""}`} 
              onClick={() => setActiveTab("internal")}
            >
              협약서 작성 영역
            </button>
            <button 
              className={`tab-btn ${activeTab === "external" ? "active" : ""}`} 
              onClick={() => setActiveTab("external")}
            >
              협약서 만들기
            </button>
          </div>

          {activeTab === "internal" ? (
            <div className="internal-content">
              <div className="form-section">
                <h3>기본 정보</h3>
                <div className="input-group">
                  <label>제휴 제안자</label>
                  <input type="text" placeholder="성신여자대학교 총학생회" />
                </div>
                <div className="input-group">
                  <label>제휴 대상자</label>
                  <input type="text" placeholder={partnerName} />
                </div>
              </div>

              <div className="form-section">
                <h3>제 1 조 (목적)</h3>
                <textarea placeholder="제휴의 목적과 방향성을 입력하세요" />
              </div>

              <div className="form-section">
                <h3>제 2 조 (대상 및 기간)</h3>
                <textarea placeholder="제휴 대상과 기간을 입력하세요" />
              </div>

              <div className="form-section">
                <h3>제 3 조 (혜택 및 조건)</h3>
                <textarea placeholder="제휴 혜택과 조건을 입력하세요" />
              </div>

              <div className="form-section">
                <h3>제 4 조 (역할 및 의무)</h3>
                <textarea placeholder="각자의 역할과 의무를 입력하세요" />
              </div>

              <div className="form-section">
                <h3>제 5 조 (효력 및 해지)</h3>
                <textarea placeholder="협약의 효력과 해지 조건을 입력하세요" />
              </div>

              <div className="form-section">
                <h3>제 6 조 (기타)</h3>
                <textarea placeholder="기타 사항을 입력하세요" />
              </div>
            </div>
          ) : (
            <div className="external-content">
              <div className="creation-info">
                <h3>협약서 만들기</h3>
                <p className="main-description">
                  AI가 작성한 제휴 모집 게시글과 제휴 문의글을 바탕으로 1차 협약서를 자동으로 생성합니다. 
                  이후 필요에 따라 내용을 수정하실 수 있습니다.
                </p>
                <p className="sub-description">
                  AI 작성을 원하지 않으시면 수동 입력 버튼을 선택해주세요.
                </p>
              </div>

              <div className="creation-buttons">
                <button className="manual-btn" onClick={handleManualCreation}>
                  수동 작성
                  <span className="badge">4</span>
                </button>
                <button className="ai-btn" onClick={handleAICreation}>
                  AI 자동 작성
                  <span className="badge">5</span>
                </button>
              </div>

              <div className="floating-profile">
                <div className="profile-circle">원정 시현</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>,
    document.body
  );
}