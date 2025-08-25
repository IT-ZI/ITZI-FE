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

  // ✅ API 응답 형태의 더미 데이터 (안전한 연동을 위해)
  const [partnershipData, setPartnershipData] = useState({
    isSuccess: true,
    code: "COMMON200",
    message: "성공입니다.",
    result: [
      {
        partnershipId: 1,
        senderId: 1,
        senderDisplayName: "성신여대 총학생회",
        receiverId: 5,
        receiverDisplayName: "민호헤어샵",
        purpose: "성신여대 총학생회 X 민호헤어샵 제휴 문의",
        periodType: "SAME_AS_POST",
        periodValue: null,
        orgType: "AUTO",
        orgValue: null,
        detail: "안녕하세요, 성신여대 총학생회입니다. 학생들을 위한 미용 제휴를 문의드립니다.",
        content: "안녕하세요, 민호헤어샵 관계자님께. 성신여자대학교 총학생회입니다...",
        keywords: ["친절함", "학생할인", "제목필수"],
        sendStatus: "SEND",
        acceptedStatus: "WAITING"
      },
      {
        partnershipId: 2,
        senderId: 1,
        senderDisplayName: "성신여대 총학생회",
        receiverId: 2,
        receiverDisplayName: "부산대 뷰티동아리",
        purpose: "성신여대 총학 X 부산뷰티클럽 미용 행사 협업",
        periodType: "CUSTOM",
        periodValue: "2025-09-01 ~ 2025-09-30",
        orgType: "AUTO",
        orgValue: null,
        detail: "안녕하세요, 성신여대 총학생회입니다. 부산 뷰티클럽과 함께 교내 미용 박람회를 공동 개최하고자 합니다.",
        content: "안녕하세요, 부산뷰티클럽 담당자님께 편지를 드립니다...",
        keywords: ["친절함"],
        sendStatus: "SEND",
        acceptedStatus: "WAITING"
      }
    ]
  });
  // ✅ 받은 문의함 데이터 (초기값: 빈 목록)
  const [receivedData, setReceivedData] = useState({
    isSuccess: true,
    code: "COMMON200",
    message: "성공입니다.",
    result: [],
  });

  // ✅ 실제 API 호출 (마운트 시 1회)
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_BASE || 'https://api.onlyoneprivate.store';
        const sentUrl = `${API_BASE}/partnership/1?sent=${Date.now()}`;
        const receivedUrl = `${API_BASE}/partnership/1/received`;

        const [sentRes, receivedRes] = await Promise.all([
          fetch(sentUrl, { cache: 'no-store', headers: { Accept: 'application/json' } }),
          fetch(receivedUrl, { cache: 'no-store', headers: { Accept: 'application/json' } }),
        ]);

        if (!sentRes.ok) throw new Error('보낸 문의함 서버 오류');
        if (!receivedRes.ok) throw new Error('받은 문의함 서버 오류');

        const [sentData, receivedJson] = await Promise.all([
          sentRes.json(),
          receivedRes.json(),
        ]);

        if (!aborted) {
          if (sentData && sentData.isSuccess) {
            const normalizedSent = Array.isArray(sentData.result)
              ? sentData.result
              : (sentData.result ? [sentData.result] : []);
            setPartnershipData({ ...sentData, result: normalizedSent });
            console.log('API 응답(보낸, 성공):', { url: sentUrl, data: sentData });
          } else {
            console.warn('보낸 문의 응답 형식이 예상과 다릅니다:', { url: sentUrl, data: sentData });
          }

          if (receivedJson && receivedJson.isSuccess) {
            const normalizedReceived = Array.isArray(receivedJson.result)
              ? receivedJson.result
              : (receivedJson.result ? [receivedJson.result] : []);
            setReceivedData({ ...receivedJson, result: normalizedReceived });
            console.log('API 응답(받은, 성공):', { url: receivedUrl, data: receivedJson });
          } else if (Array.isArray(receivedJson)) {
            setReceivedData({ isSuccess: true, code: 'COMMON200', message: '성공입니다.', result: receivedJson });
            console.log('API 응답(받은, 배열 포맷):', { url: receivedUrl, data: receivedJson });
          } else {
            console.warn('받은 문의 응답 형식이 예상과 다릅니다:', { url: receivedUrl, data: receivedJson });
          }
        }
      } catch (e) {
        console.error('API 호출 실패:', e);
        // 실패 시 더미 데이터 유지 (UI 안정성 우선)
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  // ✅ 기존 혜택 데이터는 그대로 유지 (안전하게!)
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
              sent={partnershipData.result} // ✅ 보낸 문의
              received={receivedData.result} // ✅ 받은 문의
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