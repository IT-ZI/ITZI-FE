// src/pages/partnering/PartneringPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PartnerStartModal from "../../components/popup/PartnerStartModal";
import ProfileDropdown from "../../components/common/ProfileDropdown";
import InquiryModal from "../../components/profile/home/InquiryModal";
import step2 from "../../assets/img/step2.png"; // 타이틀의 스텝 아이콘
import partneringDone from "../../assets/img/Partnering_done.png";
import partnering from "../../assets/img/Partnering.png";

// 레이아웃/카드 그리드 스타일
import "../../assets/scss/pages/Partnering.scss";
// ✅ Select SCSS도 import (문의 관련 스타일용)
import "../../assets/scss/pages/select.scss";

export default function PartneringPage() {
  const nav = useNavigate();
  const { state } = useLocation();

  // 페이지 상태
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState("샤브온당");

  // ✅ InquiryModal용 상태 추가
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // 데모 데이터 (나중에 API 연동 시 교체)
  const [pendingList, setPendingList] = useState([
    { id: 1, name: "샤브온당" },
    { id: 2, name: "카페규밀" },
  ]);
  const [doneList, setDoneList] = useState([
    { id: 3, name: "라라캣카" },
    { id: 4, name: "요지뜨" },
  ]);

  // 알림에서 넘어올 때 자동으로 모달 오픈
  // 예: nav("/partnering", { state: { openStartModal: true, brand: "샤브온당" } })
  useEffect(() => {
    if (state?.openStartModal) {
      setBrand(state.brand ?? "샤브온당");
      setOpen(true);
    }
  }, [state]);

  // 완료 상태로 돌아온 경우: 보낸 문의함에서 협의완료 리스트로 이동
  useEffect(() => {
    const completedName = state?.completedPartnerName;
    if (!completedName) return;

    setPendingList(prev => prev.filter(item => item.name !== completedName));
    setDoneList(prev => {
      // 이미 존재하면 중복 추가 방지
      const exists = prev.some(item => item.name === completedName);
      return exists ? prev : [...prev, { id: Date.now(), name: completedName }];
    });
  }, [state]);

  const handleOpenDetail = (bname) => {
    setBrand(bname);
    setOpen(true);
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

  // ✅ 자세히 보기 클릭 시 AgreementPage로 이동 (보낸 문의함)
  const openAgreementPage = (partner) => {
    nav("/partner/agreement", { 
      state: { partnerName: partner.name } 
    });
  };

  // ✅ 간단한 문의 리스트 컴포넌트 (PartneringPage 전용)
  const InquiryList = ({ items = [], mode = "sent" }) => {
    // ✅ 이미지 변경: 보낸 문의함은 Partnering.png, 받은 문의함은 Partnering_done.png
    const icon = mode === "received" ? partneringDone : partnering;

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
                {/* ✅ 보낸 문의함일 때는 AgreementPage로 이동, 받은 문의함일 때는 InquiryModal */}
                <button 
                  type="button" 
                  className="detail-btn" 
                  onClick={() => {
                    if (mode === "sent") {
                      openAgreementPage(it); // 보낸 문의함 → 협약서 작성 페이지
                    } else {
                      openInquiryModal(it);   // 받은 문의함 → 문의 상세 모달
                    }
                  }}
                >
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
    <main className="partnering-page">
      <div className="container">
        {/* ───────── 좌측 사이드바 ───────── */}
        <aside className="left">
          <ProfileDropdown />
        </aside>

        {/* ───────── 우측 본문 ───────── */}
        <section className="right">
          {/* 페이지 타이틀 (요청 포맷) */}
          <header className="page-head">
            <div className="left-side">
              <div className="sub-title">제휴 맺기</div>
              <div className="title-row">
                <span className="step">
                  <img src={step2} alt="Step 2" />
                </span>
                <h2 className="title">제휴 맺기</h2>
              </div>
            </div>

            {/* 필요 시 오른쪽 액션들 배치 */}
            {/* <div className="right-side"><button className="btn">버튼</button></div> */}

            {/* 탭 (디자인 고정용) */}
            <div className="tabs">
              <button className="tab active" type="button">제휴 맺기</button>
            </div>
          </header>

          {/* ✅ 콘텐츠 박스를 Select와 동일한 구조로 변경 */}
          <div className="content">
            <div className="panel inquiry">
              {/* ✅ 새로운 구조: 왼쪽/오른쪽 섹션으로 분리 */}
              <div className="inquiry-container">
                {/* 왼쪽: 보낸 문의함 */}
                <div className="inquiry-section sent-section">
                  <h3 className="section-title">보낸 문의함</h3>
                  <InquiryList items={pendingList} mode="sent" />
                </div>

                {/* 중앙선 */}
                <div className="inquiry-divider"></div>

                {/* 오른쪽: 받은 문의함 */}
                <div className="inquiry-section received-section">
                  <h3 className="section-title">받은 문의함</h3>
                  <InquiryList items={doneList} mode="received" />
                </div>
              </div>
            </div>
          </div>
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

      {/* 시작 모달 */}
      <PartnerStartModal
        open={open}
        brand={brand}
        onClose={() => setOpen(false)}
        // TODO: 실제 2단계 경로로 연결하기 (예: /partnering/step2)
        onGo={() => nav("/partnering")}
      />
    </main>
  );
}