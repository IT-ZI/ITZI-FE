// src/components/profile/home/InquiryPanel.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import InquiryModal from "../../../components/profile/home/InquiryModal";
import "../../../assets/scss/pages/popup.scss";

import plane from "../../../assets/img/plane.png";
import take from "../../../assets/img/take.png";
import xImg from "../../../assets/img/x.png";
import cafeInfo from "../../../assets/img/cafe_info.png";

/** 내부 리스트 */
function InquiryList({ items = [], onOpen = () => {}, mode = "sent" }) {
  const two = items.slice(0, 2);
  const icon = mode === "received" ? take : plane;

  return (
    <div className="inquiry-card">
      <div className="inquiry-body">
        {two.length === 0 ? (
          <div className="empty">목록이 없습니다.</div>
        ) : (
          <ul className="inq-list">
            {two.map((it) => (
              <li key={it.id ?? it.name} className="inq-row">
                <div className="row-left">
                  <img className="plane" src={icon} alt="" />
                  <span className="text">{it.name}</span>
                </div>
                <button type="button" className="inq-more-btn" onClick={() => onOpen(it)}>
                  <span className="detail">자세히 보기&nbsp;&gt;</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/** 보낸/받은 문의함 + 상세 모달 */
export default function InquiryPanel({ sent = [], received = [] }) {
  const nav = useNavigate();
  const [sentList, setSentList] = useState(sent);
  const [recvList, setRecvList] = useState(received);
  useEffect(() => setSentList(sent), [sent]);
  useEffect(() => setRecvList(received), [received]);

  const [openBox, setOpenBox] = useState(null); // "sent" | "received" | null
  const [openId, setOpenId] = useState(null);
  const open = openBox !== null && openId !== null;

  const selected = useMemo(() => {
    const list = openBox === "received" ? recvList : sentList;
    return list.find((x) => String(x.id) === String(openId)) ?? null;
  }, [openBox, openId, sentList, recvList]);

  const handleOpenSent = (item) => { 
    setOpenBox("sent"); 
    setOpenId(item.id); 
  };
  const handleOpenReceived = (item) => { 
    setOpenBox("received"); 
    setOpenId(item.id); 
  };
  const handleClose = () => { setOpenBox(null); setOpenId(null); };

  const handleDelete = () => {
    if (!open) return;
    if (openBox === "received") {
      setRecvList((prev) => prev.filter((it) => String(it.id) !== String(openId)));
    } else {
      setSentList((prev) => prev.filter((it) => String(it.id) !== String(openId)));
    }
    handleClose();
  };

  // 전용 팝업 분기
  const isCafe =
    open && openBox === "received" &&
    (selected?.name?.includes("카페구월") || selected?.brand?.includes?.("카페구월"));

  const isOrvieto =
    open && openBox === "received" &&
    (selected?.name?.includes("오르비에토") || selected?.brand?.includes?.("오르비에토"));

  // 카페구월: 거절 → 임시 라우팅
  const goReject = () => { handleClose(); nav("/partnering?modal=reject"); };

  // 오르비에토: 거절 확인 팝업
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);

  return (
    <>
      <div className="inquiries">
        <h3 className="inquiry-title">보낸 문의함</h3>
        <InquiryList items={sentList} mode="sent" onOpen={handleOpenSent} />

        <h3 className="inquiry-title" style={{ marginTop: 16 }}>
          받은 문의함
        </h3>
        <InquiryList items={recvList} mode="received" onOpen={handleOpenReceived} />
      </div>

      {/* 1) 카페구월 전용 팝업 — 중앙 고정 */}
      {isCafe && (
        <div className="popup-frame" role="dialog" aria-modal="true" aria-labelledby="cafe-modal-title">
          <div className="popup-backdrop" onClick={handleClose} />
          <section
            className="popup-card cafe-modal"
            style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          >
            {/* 헤더(흰색) */}
            <header className="popup-header">
              <h4 id="cafe-modal-title">카페구월</h4>
              <button onClick={handleClose} aria-label="닫기" className="btn-x">
                <img src={xImg} alt="닫기" />
              </button>
            </header>

            {/* 본문 */}
            <div className="cafe-modal__body">
              <div className="cafe-modal__message">
                안녕하세요, 카페구월입니다 ☕��
                {"\n"}성신여대 총학생회에서 올려주신 상권 제휴 모집 공지를
                {"\n"}확인하고 연락드립니다.
                {"\n\n"}저희 카페는 성신여대 재학생 및 교직원분들을 대상으로
                {"\n"}음료·디저트 주문 시 10% 할인 혜택을 제공드릴 수
                {"\n"}있습니다.
                {"\n\n"}제휴 기간은 2025년 9월 1일부터 9월 30일까지로
                {"\n"}제안드리며, 필요 시 기간 및 조건은 유연하게 조율
                {"\n"}가능합니다.
                {"\n\n"}제휴 진행을 위해 필요한 절차나 제출 서류를 안내해
                {"\n"}주시면 준비하여 보내드리겠습니다.
                {"\n\n"}함께 이번 가을, 학생분들의 일상에 작은 즐거움을 더할
                {"\n"}수 있기를 기대합니다 ��
                {"\n\n"}감사합니다.
                {"\n"}카페구월 드림
              </div>

              <img className="cafe-modal__info" src={cafeInfo} alt="카페구월 정보" />
            </div>

            {/* 푸터(하단 구분선 제거) */}
            <footer className="popup-footer" style={{ borderTop: "none" }}>
              <button type="button" className="btn btn-ghost" onClick={goReject}>거절하기</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  // 1) 현재 팝업 닫고 → 2) 임시 페이지로 이동 + 작은 팝업 자동 오픈 플래그
                  handleClose();
                  nav("/accept-demo?mini=1", {
                    state: { brand: "카페구월", inquiryId: openId, mini: true },
                    replace: false,
                  });
                }}
              >
                수락하기
              </button>
            </footer>
          </section>
        </div>
      )}

      {/* 2) 오르비에토 전용 팝업 (538×611, 헤더 흰색) */}
      {isOrvieto && (
        <div className="popup-frame" role="dialog" aria-modal="true" aria-labelledby="orvieto-modal-title">
          <div className="popup-backdrop" onClick={handleClose} />
          <section
            className="popup-card"
            style={{
              position: "fixed",
              left: "50%", top: "50%", transform: "translate(-50%, -50%)",
              width: 538, height: 611, borderRadius: 15, border: "1.5px solid #D9DAEC",
              background: "#FFFFFF", display: "flex", flexDirection: "column", overflow: "hidden"
            }}
          >
            {/* 헤더: 흰색 배경 + 검정 텍스트 */}
            <header
              className="popup-header"
              style={{
                position: "relative", height: 56,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "#FFFFFF", color: "#1C2359", borderBottom: "1px solid #E7E8F2"
              }}
            >
              <h4
                id="orvieto-modal-title"
                style={{ margin: 0, fontWeight: 700, fontSize: "18px", color: "#1C2359" }}
              >
                오르비에토
              </h4>
              <button
                onClick={handleClose}
                aria-label="닫기"
                style={{
                  position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                  width: "28px", height: "28px", border: "0", background: "transparent", cursor: "pointer",
                }}
              >
                <img src={xImg} alt="닫기" style={{ display: "block", width: "20px", height: "20px" }} />
              </button>
            </header>

            {/* 본문 (423×390 박스) */}
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div
                style={{
                  width: 423, height: 390,
                  borderRadius: 10, border: "1px solid #C2C3D9", background: "#F6F6FF",
                  padding: 16, overflow: "auto"
                }}
              >
                <pre
                  style={{
                    margin: 0, whiteSpace: "pre-wrap",
                    fontFamily: "Pretendard, system-ui, -apple-system",
                    fontSize: 14, lineHeight: "22px", color: "#21212C"
                  }}
                >{`안녕하세요, 오르비에토입니다 ��🥗
성신여대 총학생회에서 올린 상권 제휴 모집 공지를
확인하고 제휴 가능 여부를 문의드립니다.

저희 매장은 성신여대 재학생 및 교직원분들께 메인
메뉴 한정 10% 할인 혜택을 제공할 수 있습니다.

제휴 기간은 2025년 9월 5일부터 9월 20일까지로
제안드리며, 필요 시 일정과 조건은 조율 가능합니다.
제휴 진행을 위해 필요한 절차나 제출 서류를 안내해
주시면 빠르게 준비하겠습니다.

캠퍼스 근처에서 함께 분위기 있는 식사를 즐길 수
있도록 좋은 제휴를 만들길 기대합니다.

감사합니다.
오르비에토 드림`}</pre>
              </div>
            </div>

            {/* 푸터: 구분선 제거 + 거절 시 겹침 방지 */}
            <footer
              className="popup-footer"
              style={{ padding: 16, borderTop: "none", display: "flex", gap: 12, justifyContent: "center" }}
            >
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setTimeout(() => setRejectConfirmOpen(true), 0);
                }}
                style={{
                  minWidth: 120, height: 44, padding: "0 18px", borderRadius: 10,
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  background: "#FFFFFF", color: "#4B4FD1", border: "1px solid #D9DAEC"
                }}
              >
                거절하기
              </button>
              <button
                type="button"
                onClick={() => {
                  // 디자인 스펙상 알림 제거 → 단순 닫기
                  handleClose();
                }}
                style={{
                  minWidth: 120, height: 44, padding: "0 18px", borderRadius: 10,
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  background: "#434DFD", color: "#fff", border: "1px solid #434DFD"
                }}
              >
                수락하기
              </button>
            </footer>
          </section>
        </div>
      )}

      {/* 오르비에토 거절 확인 팝업 */}
      {rejectConfirmOpen && (
        <div className="popup-frame" role="dialog" aria-modal="true">
          <div className="popup-backdrop" onClick={() => setRejectConfirmOpen(false)} />
          <section
            className="popup-card"
            style={{
              position: "fixed",
              left: "50%", top: "50%", transform: "translate(-50%, -50%)",
              width: 538, borderRadius: 15, border: "1.5px solid #D9DAEC", background: "#FFFFFF", overflow: "hidden"
            }}
          >
            <header
              className="popup-header"
              style={{
                height: 56, display: "flex", alignItems: "center", justifyContent: "center",
                borderBottom: "1px solid #E7E8F2", background: "#FFFFFF"
              }}
            >
              <h4 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>제휴 거절하기</h4>
              <button
                onClick={() => setRejectConfirmOpen(false)}
                aria-label="닫기"
                style={{
                  position: "absolute", right: 14, top: "50%",
                  transform: "translateY(-50%)", border: 0,
                  background: "transparent", fontSize: 22, cursor: "pointer"
                }}
              >
                ×
              </button>
            </header>

            <div style={{ padding: 20, textAlign: "center" }}>
              <p><b>오르비에토의 제휴를 거절하시겠습니까?</b></p>
              <p style={{ marginTop: 6, color: "#6b6f82", fontSize: 13 }}>
                한 번 전송 시 취소가 불가능합니다.
              </p>
            </div>

            <footer
              className="popup-footer"
              style={{ padding: 16, borderTop: "none", display: "flex", gap: 12, justifyContent: "center" }}
            >
              <button
                type="button"
                onClick={() => setRejectConfirmOpen(false)}
                style={{
                  minWidth: 120, height: 44, padding: "0 18px", borderRadius: 10,
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  background: "#FFFFFF", color: "#4B4FD1", border: "1px solid #D9DAEC"
                }}
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => {
                  // 받은 문의함에서 오르비에토 삭제
                  setRecvList((prev) => prev.filter((it) => !it.name?.includes("오르비에토")));
                  setRejectConfirmOpen(false);
                }}
                style={{
                  minWidth: 120, height: 44, padding: "0 18px", borderRadius: 10,
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  background: "#434DFD", color: "#fff", border: "1px solid #434DFD"
                }}
              >
                전송하기
              </button>
            </footer>
          </section>
        </div>
      )}

      {/* 3) 기본 모달 */}
      {!isCafe && !isOrvieto && (
        <InquiryModal
          open={open}
          title={selected?.name ?? (openBox === "received" ? "업체" : "샤브온당")}
          mode={openBox === "received" ? "received" : "sent"}
          onClose={handleClose}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}