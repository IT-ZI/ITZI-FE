// src/pages/PartneringPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios"; // 현재 미사용이면 주석/삭제해도 됩니다.
import PartnerStartModal from "../components/popup/PartnerStartModal";
import ProfileDropdown from "../components/common/ProfileDropdown";
import InquiryModal from "../components/profile/home/InquiryModal";
import step2 from "../assets/img/step2.png";
import partneringDone from "../assets/img/Partnering_done.png";
import partnering from "../assets/img/Partnering.png";

import "../assets/scss/pages/Partnering.scss";
import "../assets/scss/pages/select.scss";

export default function PartneringPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const API_BASE = process.env.REACT_APP_API_BASE || "https://api.onlyoneprivate.store";

  // 페이지 상태
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState("샤브온당");

  // 문의 상세 모달
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // 데모 리스트 (협의 중 / 협의 완료)
  const [pendingList, setPendingList] = useState([
    { id: 1, name: "샤브온당" },
    { id: 2, name: "카페규밀" },
  ]);
  const [doneList, setDoneList] = useState([
    { id: 3, name: "라라캣카" },
    { id: 4, name: "요지뜨" },
  ]);

  // 알림에서 넘어오면 시작 모달 자동 오픈
  useEffect(() => {
    if (state?.openStartModal) {
      setBrand(state.brand ?? "샤브온당");
      setOpen(true);
    }
  }, [state]);

  // 완료 상태로 돌아온 경우: 협의 완료 리스트로 이동
  useEffect(() => {
    const completedName = state?.completedPartnerName;
    if (!completedName) return;

    setPendingList((prev) => prev.filter((item) => item.name !== completedName));
    setDoneList((prev) => {
      const exists = prev.some((item) => item.name === completedName);
      return exists ? prev : [...prev, { id: Date.now(), name: completedName }];
    });
  }, [state]);

  const handleOpenDetail = (bname) => {
    setBrand(bname);
    setOpen(true);
  };

  const openInquiryModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setInquiryModalOpen(true);
  };

  const closeInquiryModal = () => {
    setInquiryModalOpen(false);
    setSelectedInquiry(null);
  };

  const handleDeleteInquiry = async (inquiryId) => {
    console.log("삭제할 문의 ID:", inquiryId);
    closeInquiryModal();
  };

  // ✅ AgreementPage로 라우팅 (API는 AgreementsPage/AgreementPage에서 호출)
  const openAgreementPage = (partner) => {
    if (!partner?.id) {
      console.error("partner.id 없음");
      return;
    }
    // 권장: 복수형 경로 사용 (/agreements/:id)
    nav(`/agreements/${partner.id}`, {
      state: { partnerName: partner.name, partnershipId: partner.id },
    });
    // 만약 단수 경로 alias도 App.jsx에 추가했다면 아래도 동작함:
    // nav(`/agreement/${partner.id}`, { state: { partnerName: partner.name, partnershipId: partner.id } });
  };

  const InquiryList = ({ items = [], mode = "sent" }) => {
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
                <button
                  type="button"
                  className="detail-btn"
                  onClick={() => {
                    if (mode === "sent") {
                      openAgreementPage(it); // 보낸 문의함 → 협약서 페이지
                    } else {
                      openInquiryModal(it);  // 받은 문의함 → 문의 상세 모달
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
        {/* 좌측 사이드바 */}
        <aside className="left">
          <ProfileDropdown />
        </aside>

        {/* 우측 본문 */}
        <section className="right">
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
            <div className="tabs">
              <button className="tab active" type="button">
                제휴 맺기
              </button>
            </div>
          </header>

          {/* 콘텐츠 박스 */}
          <div className="content">
            <div className="panel inquiry">
              <div className="inquiry-container">
                <div className="inquiry-section sent-section">
                  <h3 className="section-title">협의 중</h3>
                  <InquiryList items={pendingList} mode="sent" />
                </div>

                <div className="inquiry-divider"></div>

                <div className="inquiry-section received-section">
                  <h3 className="section-title">협의 완료</h3>
                  <InquiryList items={doneList} mode="received" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 문의 상세 모달 */}
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
        onGo={() => nav("/partnering")}
      />
    </main>
  );
}
