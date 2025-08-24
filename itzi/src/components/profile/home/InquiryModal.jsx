// src/components/popup/InquiryModal.jsx
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import xImg from "../../../assets/img/x.png";
import TagInput from "../../profile/TagInput";

export default function InquiryModal({
  open = false,
  title = "샤브온당",
  inquiryId,               // ← 삭제 대상 문의 id (상위에서 내려줌)
  onClose = () => {},
  onDelete = async () => {}, // ← 반드시 상위에서 구현
}) {
  const preset = useMemo(() => {
    const commonPurpose = "성신여대 총학생회 상권 제휴 문의";
    const shabu = {
      purpose: commonPurpose,
      period: "게시글과 동일",
      orgInfo: "자동 입력",
      detail: "내용",
      ai: "내용",
      rejected: false,
    };
    const tugo = {
      purpose: commonPurpose,
      period: "게시글과 동일",
      orgInfo: "자동 입력",
      detail: "내용",
      ai: "내용",
      rejected: true, // ← 투고샐러드는 거절 상태
    };
    return title === "투고샐러드" ? tugo : shabu;
  }, [title]);

  const [keywords, setKeywords] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState("");
  const isRejected = preset.rejected;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleDelete = async () => {
    if (deleting) return;
    setErr("");
    setDeleting(true);
    try {
      await onDelete(inquiryId); // ← 상위에서 실제 삭제(상태/서버) 수행
      onClose();                 // 성공 후 모달 닫기
    } catch (e) {
      setErr(e?.message || "삭제 중 오류가 발생했어요.");
    } finally {
      setDeleting(false);
    }
  };

  const modalEl = (
    <div className="popup-frame" role="dialog" aria-modal="true">
      <div className="popup-backdrop" onClick={onClose} />

      <div
        className="popup-card popup--shabu-fixed"
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="popup-title"
      >
        <header
        className="popup-header"
        style={{position: "relative",height: 56,display: "flex",alignItems: "center",
            justifyContent: "center",background: "#FFFFFF",color: "#1C2359",borderBottom: "1px solid #E7E8F2",}}>
        <h4 id="popup-title"
            style={{margin: 0, fontWeight: 700, fontSize: "18px", color: "#1C2359", }}>
            {title}
        </h4>
        <button onClick={onClose} aria-label="닫기"
            style={{position: "absolute",right: "14px",top: "50%",transform: "translateY(-50%)",width: "28px",
            height: "28px",border: "0",background: "transparent",cursor: "pointer",}}>
            <img src={xImg} alt="닫기"style={{ display: "block", width: "20px", height: "20px" }}/></button>
        </header>

        <div className="popup-body">
          <div className="v-sep" aria-hidden="true" />

          {/* 왼쪽 */}
          <section className="side left">
            <div className="section-card">
              <div className="field">
                <label>문의 목적</label>
                <input className="input" readOnly value={preset.purpose} />
              </div>

              <div className="field">
                <label>희망 제휴 기간</label>
                <div className="input select-like">{preset.period}</div>
              </div>

              <div className="field">
                <label>우리 단체 정보</label>
                <div className="input select-like">{preset.orgInfo}</div>
              </div>

              <div className="field">
                <label>문의 내용 상세</label>
                <textarea
                  className="textarea"
                  defaultValue="내용"
                  disabled={isRejected}
                />
              </div>

              <section className="block kw-block">
                <h2 className="block-title">AI 작성 요청 키워드 입력</h2>
                <p className="tooltip">
                  AI 작성 참고용 키워드를 입력해보세요! (10자 이내/최대 5개)
                </p>

                <TagInput
                  value={keywords}
                  onChange={setKeywords}
                  max={5}
                  placeholder="ex) 친절함, 제목 필수, 기승전결"
                  disabled={isRejected}
                />
                <div className="kw-holder" />
              </section>
            </div>
          </section>

          {/* 오른쪽 */}
          <section className="side right">
            <div className="ai-box">
              <div className="ai-title">AI 문의 글 작성</div>
              <div className="ai-content">내용</div>
            </div>
          </section>
        </div>

        <footer className="popup-footer">
          {isRejected ? (
            <>
              <button
                className="btn"
                style={{
                  background: "#434DFD",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "10px 20px",
                  border: "none",
                  fontWeight: 600,
                  width: 423,
                  height: 54,
                }}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "삭제 중..." : "삭제하기"}
              </button>
              {err && (
                <div
                  style={{
                    marginTop: 8,
                    color: "#D92D20",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  {err}
                </div>
              )}
            </>
          ) : (
            <>
              <button className="btn primary" disabled>
                전송 완료
              </button>
              <div className="foot-note">
                작성한 문의는 상대방에게 전달되며, 수락 시 제휴가 진행됩니다.
              </div>
            </>
          )}
        </footer>
      </div>
    </div>
  );

  return createPortal(modalEl, document.body);
}