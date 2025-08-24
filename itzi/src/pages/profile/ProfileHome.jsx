// src/pages/profile/ProfileHome.jsx
import { useEffect, useMemo, useState } from "react";
import ProfileSidebar from "../../components/profile/home/ProfileSidebar";
import CalendarPanel from "../../components/profile/home/CalendarPanel";
import InquiryPanel from "../../components/profile/home/InquiryPanel";
import BenefitGrid from "../../components/profile/home/BenefitGrid";
import InquiryModal from "../../components/profile/home/InquiryModal";
import ConfirmModal from "../../components/profile/home/ConfirmModal";
import ToastModal from "../../components/profile/home/ToastModal";
import { notifyState, setNotify } from "../../state/notifyStore";
import "../../assets/scss/pages/ProfileHome.scss";

export default function ProfileHome() {
  const urlRole = new URLSearchParams(window.location.search).get("role");
  const readOnlyExploration =
    urlRole === "explorer" || localStorage.getItem("role") === "explorer";

  const [profile] = useState({
    name: "성신총학_소망이랑",
    org: "성신여자대학교 총학생회",
  });

  // ✅ 보여줄 순서: 스팟츠, 동방, 빈티지 -> (스크롤 아래) 쉬즈베이글, 코칠리, 산문집
  const [benefits, setBenefits] = useState([
    {
      id: "b1",
      title: "성신여대 X 카페 스팟츠 - 상권 제휴",
      target: "성신여대 재학생",
      startDate: "2025-09-01",
      endDate: "2025-09-30",
      benefit: "결제 시 10% 할인 / 매월 12,000원 이상 주문 시 추가혜택",
      summary: "결제 시 10% 할인 / 매월 12,000원 이상 주문 시 추가혜택",
      thumb: "cafe.png",
      scrap: 44,
      scrapped: false,
    },
    {
      id: "b2",
      title: "성신여대 X 동방 - 상권 제휴",
      target: "근교 대학(교직원 포함)",
      startDate: "2025-09-01",
      endDate: "2025-09-30",
      benefit: "일부 메뉴 할인, 할인쿠폰 및 묶음 특가 제공",
      summary: "일부 메뉴 할인, 할인쿠폰 및 묶음 특가 제공",
      thumb: "dongbang.png",
      scrap: 29,
      scrapped: true,
    },
    {
      id: "b3",
      title: "성신여대 X 제색장 빈티지샵 - 상권 제휴",
      target: "성신여대 재학생",
      startDate: "2025-09-01",
      endDate: "2025-10-01",
      benefit: "일부 상품 15% 할인",
      summary: "일부 상품 15% 할인",
      thumb: "vintage.png",
      scrap: 15,
      scrapped: false,
    },
    // ↓↓↓ 아래부터는 스크롤 해야 보이도록 (컨테이너 높이 288에서 가려짐)
    {
      id: "b-bagel-20250901",
      title: "성신여대 X 쉬즈베이글 - 상권 제휴",
      target: "성신여대 재적생 및 교직원 대상",
      startDate: "2025-09-01",
      endDate: "2025-10-20",
      benefit: "1만원 이상 구매 시 hot/ice 아메리카노 무료 제공",
      summary: "1만원 이상 구매 시 hot/ice 아메리카노 무료 제공",
      thumb: "left.png",
      scrap: 0,
      scrapped: false,
    },
    {
      id: "b-kochilli-20250901",
      title: "성신여대 X 코칠리파스타 - 상권 제휴",
      target: "성신여대 재적생 및 교직원 대상",
      startDate: "2025-09-01",
      endDate: "2025-10-21",
      benefit: "결제 시 10% 할인 / 제로콜라, 사이다, 콜라 중 1개 무료...",
      summary: "결제 시 10% 할인 / 제로콜라, 사이다, 콜라 중 1개 무료...",
      thumb: "center.png",
      scrap: 0,
      scrapped: false,
    },
    {
      id: "b-sanmoon-20250901",
      title: "성신여대 X 산문집 - 상권 제휴",
      target: "성신여대 재적생 및 교직원 대상",
      startDate: "2025-09-01",
      endDate: "2025-12-31",
      benefit: "도서 구입 시 산문집 연필 증정, 인스타그램 스토리 태그...",
      summary: "도서 구입 시 산문집 연필 증정, 인스타그램 스토리 태그...",
      thumb: "right.png",
      scrap: 0,
      scrapped: false,
    },
  ]);

  const calendarItems = useMemo(
    () =>
      benefits.map((b) => ({
        id: b.id,
        title: b.title,
        start: b.startDate,
        end: b.endDate,
        status: "진행중",
      })),
    [benefits]
  );

  const [inquiries, setInquiries] = useState({
    sent: [
      { id: "s1", name: "사브온당", status: "pending" },
      { id: "s2", name: "투고샐러드", status: "rejected" },
    ],
    received: [
      { id: "r1", name: "카페구월", status: "pending" },
      { id: "r2", name: "오르비에토", status: "pending" },
    ],
  });

  const toProceed = useMemo(
    () => inquiries.received.filter((x) => x.status === "pending").length,
    [inquiries]
  );
  useEffect(() => setNotify({ toProceedCount: toProceed }), [toProceed]);

  function pushRejectNotification(storeName) {
    setNotify({
      unread: notifyState.unread + 1,
      items: [
        { id: Date.now(), text: `[${storeName}] 에서 제휴를 거절했습니다.` },
        ...notifyState.items,
      ],
    });
  }

  function onReceivedAction(id, action) {
    const item = inquiries.received.find((x) => x.id === id);
    if (!item) return;

    if (action === "accept") {
      setConfirm({
        kind: "accept",
        data: { id, name: item.name },
        onConfirm: () => {
          setInquiries((prev) => ({
            ...prev,
            received: prev.received.map((x) =>
              x.id === id ? { ...x, status: "accepted" } : x
            ),
          }));
          setConfirm(null);
          setToast({ text: "제휴 맺기 모달이 열렸습니다. (임시)" });
        },
      });
    } else if (action === "reject") {
      setConfirm({
        kind: "reject",
        data: { id, name: item.name },
        onConfirm: () => {
          setInquiries((prev) => ({
            ...prev,
            received: prev.received.map((x) =>
              x.id === id ? { ...x, status: "rejected" } : x
            ),
          }));
          setConfirm(null);
          pushRejectNotification(item.name);
        },
      });
    }
  }

  function getSentModalFooter(item) {
    if (!item) return { type: "pending" };
    if (item.status === "pending") return { type: "pending" };
    if (item.status === "rejected") return { type: "delete" };
    return { type: "goto" };
  }

  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  return (
    <div className="page-outer">{/* ✅ 가운데 정렬용 래퍼(최소 수정) */}
      <div className={`profile-home ${readOnlyExploration ? "read-only" : ""}`}>
        <aside className="col-left">
          <ProfileSidebar profile={profile} toProceed={toProceed} />
        </aside>

        <main className="col-main">
          <section className="row-top">
            <CalendarPanel items={calendarItems} />
            <InquiryPanel
              sent={inquiries.sent}
              received={inquiries.received}
              onOpen={(type, id) => setModal({ type, id })}
            />
          </section>

          <section className="row-bottom">
            <BenefitGrid
              items={benefits}
              readOnly={readOnlyExploration}
              onToggleScrap={(id) => {
                if (readOnlyExploration) return;
                setBenefits((prev) =>
                  prev.map((b) =>
                    b.id === id
                      ? {
                          ...b,
                          scrapped: !b.scrapped,
                          scrap: b.scrap + (b.scrapped ? -1 : 1),
                        }
                      : b
                  )
                );
              }}
            />
          </section>
        </main>

        {modal && modal.type === "sent" && (
          <InquiryModal
            mode="sent"
            title={inquiries.sent.find((x) => x.id === modal.id)?.name || ""}
            footer={getSentModalFooter(inquiries.sent.find((x) => x.id === modal.id))}
            onClose={() => setModal(null)}
            onGoto={() => {
              setModal(null);
              setToast({ text: "제휴 맺기 모달이 열렸습니다. (임시)" });
            }}
            onDelete={() => {
              setInquiries((prev) => ({
                ...prev,
                sent: prev.sent.filter((x) => x.id !== modal.id),
              }));
              setModal(null);
            }}
          />
        )}

        {modal && modal.type === "received" && (
          <InquiryModal
            mode="received"
            title={inquiries.received.find((x) => x.id === modal.id)?.name || ""}
            onClose={() => setModal(null)}
            onAccept={() => {
              setModal(null);
              onReceivedAction(modal.id, "accept");
            }}
            onReject={() => {
              setModal(null);
              onReceivedAction(modal.id, "reject");
            }}
          />
        )}

        {confirm && (
          <ConfirmModal
            kind={confirm.kind}
            name={confirm.data.name}
            onCancel={() => setConfirm(null)}
            onConfirm={confirm.onConfirm}
          />
        )}

        {toast && <ToastModal text={toast.text} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}