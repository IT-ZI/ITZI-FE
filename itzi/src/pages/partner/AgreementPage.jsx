import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileDropdown from "../../components/common/ProfileDropdown";
import priorbutton from "../../assets/img/priorbutton.png";

import "../../assets/scss/pages/AgreementPage.scss";

export default function AgreementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const partnerName = location.state?.partnerName || "샤브온당";
  const partnershipId = location.state?.partnershipId; // 제휴 ID (상세에서 전달)

  const [formData, setFormData] = useState({
    proposer: "",
    partner: "",
    purpose: "",
    target: "",
    benefit: "",
    role: "",
    effect: "",
    etc: ""
  });

  const [showSavePopup, setShowSavePopup] = useState(false);
  // ✅ 최초 진입 시 모드 선택 팝업
  const [showModePopup, setShowModePopup] = useState(true);
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  const isFormModified = () => {
    const hasContent = Object.values(formData).some(value => {
      const trimmedValue = value.trim();
      return trimmedValue.length > 0;
    });
    
    return hasContent;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTempSave = () => {
    console.log("임시저장", formData);
    setShowSavePopup(true);
    
    setTimeout(() => {
      setShowSavePopup(false);
    }, 3000);
  };

  const handleConvertDoc = () => {
    console.log("문서 변환", formData);
    navigate("/partner/agreement/create", {
      state: { 
        partnerName: partnerName,
        formData: formData 
      }
    });
  };

  const handlePreview = () => {
    console.log("미리보기", formData);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isActive = isFormModified();

  // ✅ AI 자동 작성: 서버에 협약서 생성 요청 후 폼에 값 채우기
  const handleAutoGenerate = async () => {
    try {
      setIsAIGenerating(true);
      if (!partnershipId) {
        console.warn("partnershipId가 없어 AI 자동 작성 호출을 건너뜁니다.");
        setShowModePopup(false);
        return;
      }

      const res = await fetch(`/agreements/ai/${partnershipId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();

      if (!data?.isSuccess) {
        console.warn("협약서 생성 실패", data);
        if (data?.message) alert(data.message);
        setShowModePopup(false);
        return;
      }

      const r = data.result;
      setFormData({
        proposer: r?.senderName || "",
        partner: r?.receiverName || "",
        purpose: r?.purpose || "",
        target: r?.targetPeriod || "",
        benefit: r?.benefitCondition || "",
        role: r?.role || "",
        effect: r?.effect || "",
        etc: r?.etc || "",
      });
      setShowModePopup(false);
    } catch (e) {
      console.error(e);
      alert("자동 작성 호출 중 오류가 발생했습니다.");
      setShowModePopup(false);
    } finally {
      setIsAIGenerating(false);
    }
  };

  return (
    <main className="agreement-page">
      <div className="page-container">
        <header className="page-header">
          <button className="back-btn" onClick={handleBack}>
            <img src={priorbutton} alt="뒤로가기" />
          </button>
          <h1 className="page-title">{partnerName}</h1>
          <div className="header-buttons">
            <button className="view-btn">제휴 모집 글 보기</button>
            <button className="view-btn">제휴 문의 글 보기</button>
          </div>
        </header>

        <div className="main-content">
          {/* ✅ content-container: 폼 내용만 포함 */}
          <div className="content-container">
            <div className="form-content">
              <div className="form-section">
                <h3>기본 정보</h3>
                <div className="input-group">
                  <input 
                    type="text" 
                    value={formData.proposer}
                    onChange={(e) => handleInputChange('proposer', e.target.value)}
                    placeholder="제휴 제안자"
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    value={formData.partner}
                    onChange={(e) => handleInputChange('partner', e.target.value)}
                    placeholder="제휴 대상자"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>제 1 조 (목적)</h3>
                <input 
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  placeholder="ex) 학생 복지 증진 및 지역 상권 활성화를 위한 제휴 협약 체결" 
                />
              </div>

              <div className="form-section">
                <h3>제 2 조 (대상 및 기간)</h3>
                <input 
                  type="text"
                  value={formData.target}
                  onChange={(e) => handleInputChange('target', e.target.value)}
                  placeholder="ex) 00대 재학생 및 교직원을 대상으로 2025.01.01 ~ 2025.01.31 기간 동안 적용" 
                />
              </div>

              <div className="form-section">
                <h3>제 3 조 (혜택 및 조건)</h3>
                <input 
                  type="text"
                  value={formData.benefit}
                  onChange={(e) => handleInputChange('benefit', e.target.value)}
                  placeholder="ex) 결제 시 10% 할인 / 학생증 제시 필수 / 타 쿠폰과 중복 불가" 
                />
              </div>

              <div className="form-section">
                <h3>제 4 조 (역할 및 의무)</h3>
                <input 
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="ex) 제휴 제안자는 제휴 혜택을 온라인으로 홍보하고, 매장은 혜택을 안정적으로 제공" 
                />
              </div>

              <div className="form-section">
                <h3>제 5 조 (효력 및 해지)</h3>
                <input 
                  type="text"
                  value={formData.effect}
                  onChange={(e) => handleInputChange('effect', e.target.value)}
                  placeholder="ex) 서명일로부터 효력 발생 / 일방 해지 시 사전 서면 통보 필요" 
                />
              </div>

              <div className="form-section">
                <h3>제 6 조 (기타)</h3>
                <input 
                  type="text"
                  value={formData.etc}
                  onChange={(e) => handleInputChange('etc', e.target.value)}
                  placeholder="ex) 본 협약은 양측 서명 후 각 1부씩 보관하며, 필요시 추가 조율 가능" 
                />
              </div>
            </div>
          </div>

          {/* ✅ bottom-buttons: content-container 밖에 별도 위치 */}
          <div className="bottom-buttons">
            <button 
              className={`temp-save-btn ${isActive ? 'active' : 'inactive'}`}
              onClick={handleTempSave}
              disabled={!isActive}
              style={{ 
                backgroundColor: isActive ? '#7F86FF' : '#C2C3D9',
                color: 'white'
              }}
            >
              임시저장
            </button>
            <button className="convert-doc-btn" onClick={handleConvertDoc}>
              문서 변환
            </button>
            <button className="preview-btn" onClick={handlePreview}>
              미리보기
            </button>
          </div>
        </div>
      </div>

      {showSavePopup && (
        <div className="save-popup">
          <div className="popup-content">
            <p className="popup-title">내용이 임시 저장되었습니다</p>
            <p className="popup-subtitle">해당 게시글은 언제든지 수정이 가능합니다.</p>
          </div>
        </div>
      )}

      {/* ✅ 작성 모드 선택 오버레이 */}
      {showModePopup && (
        <div className="mode-overlay">
          <div className="mode-card">
            <h2 className="mode-title">협약서 만들기</h2>
            <p className="mode-desc">
              AI가 작성한 제휴 모집 게시글과 제휴 문의글을 바탕으로 1차 협약서를 자동으로 생성합니다.
              이후 필요에 따라 내용을 수정하실 수 있습니다.
            </p>
            <p className="mode-note">AI 작성을 원하지 않으시면 수동 작성 버튼을 선택해주세요.</p>
            <div className="mode-actions">
              <button className="manual-btn" onClick={() => setShowModePopup(false)}>
                수동 작성
              </button>
              <button className="auto-btn" onClick={handleAutoGenerate} disabled={isAIGenerating}>
                {isAIGenerating ? "작성 중..." : "AI 자동 작성"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}