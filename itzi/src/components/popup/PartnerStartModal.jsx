// src/components/popup/PartnerStartModal.jsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import "../../assets/scss/pages/popup.scss";

export default function PartnerStartModal({
  open = false,
  brand = "샤브온당",
  onClose = () => {},
  onGo = () => {},
}) {
  const navigate = useNavigate(); // ✅ 추가
  const [phase, setPhase] = useState("confirm");

  useEffect(() => {
    if (open) setPhase("confirm");
  }, [open]);

  if (!open) return null;

  const title = phase === "confirm" ? "제휴 시작하기" : "제휴맺기";
  const lineAfterTitleGap = 17;      // 제목 아래 첫 라인까지 간격
  const lineAfterNoticeGap = 35.33;  // 안내문 → 두 번째 라인 간격

  // ✅ 추가: PartneringPage로 이동하는 함수
  const handleGoToPartnering = () => {
            navigate("/partnering");
    onClose();
  };

  return createPortal(
    <div className="popup-frame">
      {/* 바깥 클릭 시 닫힘 */}
      <div className="popup-backdrop" onClick={onClose} />

      {/* 1440×955 레이아웃 박스(페이지 중심) */}
      <div className="popup-stage">
        {/* 중앙 카드 */}
        <div
          className="popup-card partner-start"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="popup-header">
            <h4>{title}</h4>
          </header>

          <div className="hr" style={{ marginTop: lineAfterTitleGap }} />

          <div className="popup-body">
            {phase === "confirm" ? (
              <>
                <p className="notice">{brand}과의 제휴가 수락되었습니다.</p>
                <div className="hr" style={{ marginTop: lineAfterNoticeGap }} />
                <p className="question">제휴를 진행하시겠습니까?</p>
              </>
            ) : (
              <>
                <p className="notice strong">
                  {brand}과의 제휴가 시작되었습니다!
                </p>
                <div className="hr" style={{ marginTop: lineAfterNoticeGap }} />
                <p className="question">
                  본격적인 제휴 맺기를 위해 [2. 제휴 맺기]로 이동해주세요.
                </p>
              </>
            )}
          </div>

          <footer className="popup-footer">
            {phase === "confirm" ? (
              <>
                <button className="btn btn-ghost" onClick={onClose}>
                  취소하기
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setPhase("started")}
                >
                  시작하기
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={onClose}>
                  닫기
                </button>
                <button className="btn btn-primary" onClick={handleGoToPartnering}>
                  이동하기
                </button>
              </>
            )}
          </footer>
        </div>
      </div>
    </div>,
    document.body
  );
}