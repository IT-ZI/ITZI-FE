// src/pages/AgreementPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ProfileDropdown from "../components/common/ProfileDropdown";
import priorbutton from "../assets/img/priorbutton.png";

import "../assets/scss/pages/AgreementsPage.scss";

export default function AgreementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { partnerId: partnerIdFromParams } = useParams();

  // 👉 파트너 이름은 state로만 받되(디자인상 텍스트), 없으면 기본값
  const partnerName = location.state?.partnerName || "샤브온당";

  // 👉 실제 API에서 쓰는 "파트너십 ID"는 URL 파라미터 또는 state 중 하나로 받음
  //    (둘 다 들어오는 상황을 대비해 URL > state 우선)
  const partnershipId = partnerIdFromParams ?? location.state?.partnershipId ?? null;

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
  const [showModePopup, setShowModePopup] = useState(true);
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [agreementId, setAgreementId] = useState(null);
  const [isLoadingPrepare, setIsLoadingPrepare] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE || "https://api.onlyoneprivate.store";

  const isFormModified = () => {
    const hasContent = Object.values(formData).some((v) => v.trim().length > 0);
    return hasContent;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ 임시저장: agreements/:partnershipId 로 PATCH (agreementId 갱신)
  const handleTempSave = async () => {
    if (!partnershipId) {
      alert("제휴 정보(partnershipId)가 없어 임시저장할 수 없습니다.");
      return;
    }
    try {
      setIsSaving(true);
      setSaveError(null);

      const requestData = {
        senderId: 101, // TODO: 실제 로그인 사용자 ID
        receiverId: 104, // TODO: 실제 상대방 ID
        partnershipId,
        senderName: formData.proposer || "총학생회",
        receiverName: formData.partner || partnerName,
        purpose: formData.purpose || "",
        targetPeriod: formData.target || "",
        benefitCondition: formData.benefit || "",
        role: formData.role || "",
        effect: formData.effect || "",
        etc: formData.etc || "",
        content: null
      };

      const res = await fetch(`${API_BASE}/agreements/${encodeURIComponent(partnershipId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const data = await res.json();

      if (!res.ok || !data?.isSuccess) {
        throw new Error(data?.message || "임시저장 중 오류가 발생했습니다.");
      }

      if (data?.result?.agreementId) {
        setAgreementId(data.result.agreementId);
      }

      setShowSavePopup(true);
      setTimeout(() => setShowSavePopup(false), 3000);
      console.log("임시저장 성공:", data.result);
    } catch (e) {
      console.error("임시저장 오류:", e);
      setSaveError(e.message);
      alert(`임시저장 실패: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ 문서 변환: DRAFT → GENERATED
  const handleConvertDoc = async () => {
    try {
      let idToUse = agreementId;

      // 아직 agreementId가 없으면, 임시저장(PATCH)로 먼저 DRAFT 생성
      if (!idToUse) {
        if (!partnershipId) {
          alert("제휴 정보가 없어 문서 변환을 진행할 수 없습니다.");
          return;
        }
        const draftPayload = {
          senderId: 101,
          receiverId: 104,
          partnershipId,
          senderName: formData.proposer || "총학생회",
          receiverName: formData.partner || partnerName,
          purpose: formData.purpose || "",
          targetPeriod: formData.target || "",
          benefitCondition: formData.benefit || "",
          role: formData.role || "",
          effect: formData.effect || "",
          etc: formData.etc || "",
          content: null,
        };
        const draftRes = await fetch(`${API_BASE}/agreements/${encodeURIComponent(partnershipId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draftPayload),
        });
        const draftData = await draftRes.json();
        if (!draftRes.ok || !draftData?.isSuccess || !draftData?.result?.agreementId) {
          throw new Error(draftData?.message || "임시저장 후 문서 변환을 진행할 수 없습니다.");
        }
        idToUse = draftData.result.agreementId;
        setAgreementId(idToUse);
      }

      const res = await fetch(`${API_BASE}/agreements/${encodeURIComponent(idToUse)}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok || !data?.isSuccess) {
        throw new Error(data?.message || data?.error?.message || "문서 변환 중 오류가 발생했습니다.");
      }

      alert("문서가 GENERATED 상태로 변환되었습니다.");
      console.log("문서 변환 성공:", data.result);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  const handlePreview = () => {
    console.log("미리보기", formData);
  };

  // ✅ 협약 상세 조회(제휴 중/보낸 문의함): GET /agreements/prepare/{partnershipId}
  const handleViewPrepare = async () => {
    try {
      if (!partnershipId) {
        alert("제휴 정보가 없어 조회할 수 없습니다.");
        return;
      }
      setIsLoadingPrepare(true);
      const url = `${API_BASE}/agreements/prepare/${encodeURIComponent(partnershipId)}`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      const data = await res.json();

      if (!res.ok || !data?.isSuccess) {
        throw new Error(data?.message || "협약 상세 조회 실패");
      }
      const r = data.result || {};
      alert(`파트너: ${r.partnerDisplayName || "-"}\n파트너십 ID: ${r.partnershipId || "-"}\n게시글 ID: ${r.postId || "-"}`);
      console.log("협약 상세 조회 성공:", { url, data });
    } catch (e) {
      console.error("협약 상세 조회 오류:", e);
      alert(e.message);
    } finally {
      setIsLoadingPrepare(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isActive = isFormModified();

  // ✅ AI 자동 작성: POST /agreements/ai/{partnershipId}
  const handleAutoGenerate = async () => {
    try {
      setIsAIGenerating(true);
      if (!partnershipId) {
        console.warn("partnershipId가 없어 AI 자동 작성 호출을 건너뜁니다.");
        setShowModePopup(false);
        return;
      }

      const res = await fetch(`${API_BASE}/agreements/ai/${encodeURIComponent(partnershipId)}`, {
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
      setAgreementId(r?.agreementId || null);
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
            <button className="view-btn" onClick={handleViewPrepare} disabled={isLoadingPrepare}>
              제휴 모집 글 보기
            </button>
            <button className="view-btn" onClick={handleViewPrepare} disabled={isLoadingPrepare}>
              제휴 문의 글 보기
            </button>
          </div>
        </header>

        <div className="main-content">
          {/* 폼 */}
          <div className="content-container">
            <div className="form-content">
              <div className="form-section">
                <h3>기본 정보</h3>
                <div className="input-group">
                  <input
                    type="text"
                    value={formData.proposer}
                    onChange={(e) => handleInputChange("proposer", e.target.value)}
                    placeholder="제휴 제안자"
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    value={formData.partner}
                    onChange={(e) => handleInputChange("partner", e.target.value)}
                    placeholder="제휴 대상자"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>제 1 조 (목적)</h3>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  placeholder="ex) 학생 복지 증진 및 지역 상권 활성화를 위한 제휴 협약 체결"
                />
              </div>

              <div className="form-section">
                <h3>제 2 조 (대상 및 기간)</h3>
                <input
                  type="text"
                  value={formData.target}
                  onChange={(e) => handleInputChange("target", e.target.value)}
                  placeholder="ex) 00대 재학생 및 교직원을 대상으로 2025.01.01 ~ 2025.01.31 기간 동안 적용"
                />
              </div>

              <div className="form-section">
                <h3>제 3 조 (혜택 및 조건)</h3>
                <input
                  type="text"
                  value={formData.benefit}
                  onChange={(e) => handleInputChange("benefit", e.target.value)}
                  placeholder="ex) 결제 시 10% 할인 / 학생증 제시 필수 / 타 쿠폰과 중복 불가"
                />
              </div>

              <div className="form-section">
                <h3>제 4 조 (역할 및 의무)</h3>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  placeholder="ex) 제휴 제안자는 제휴 혜택을 온라인으로 홍보하고, 매장은 혜택을 안정적으로 제공"
                />
              </div>

              <div className="form-section">
                <h3>제 5 조 (효력 및 해지)</h3>
                <input
                  type="text"
                  value={formData.effect}
                  onChange={(e) => handleInputChange("effect", e.target.value)}
                  placeholder="ex) 서명일로부터 효력 발생 / 일방 해지 시 사전 서면 통보 필요"
                />
              </div>

              <div className="form-section">
                <h3>제 6 조 (기타)</h3>
                <input
                  type="text"
                  value={formData.etc}
                  onChange={(e) => handleInputChange("etc", e.target.value)}
                  placeholder="ex) 본 협약은 양측 서명 후 각 1부씩 보관하며, 필요시 추가 조율 가능"
                />
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="bottom-buttons">
            <button
              className={`temp-save-btn ${isActive ? "active" : "inactive"}`}
              onClick={handleTempSave}
              disabled={!isActive || isSaving}
              style={{
                backgroundColor: isActive && !isSaving ? "#7F86FF" : "#C2C3D9",
                color: "white",
              }}
            >
              {isSaving ? "저장 중..." : "임시저장"}
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

      {/* 작성 모드 선택 오버레이 */}
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
