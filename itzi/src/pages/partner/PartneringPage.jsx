// src/pages/partnering/PartneringPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PartnerStartModal from "../../components/popup/PartnerStartModal";

export default function PartneringPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState("샤브온당");

  // 알림에서 넘어올 때: nav("/partnering", { state: { openStartModal: true, brand } })
  useEffect(() => {
    if (state?.openStartModal) {
      setBrand(state.brand ?? "샤브온당");
      setOpen(true);
    }
  }, [state]);

  return (
    <div className="partnering-page" style={{ padding: 24 }}>
      <h1>제휴맺기 (작업 예정 페이지)</h1>
      <p>알림의 “&gt;” 버튼에서 진입하면 팝업이 자동으로 열립니다.</p>

      <PartnerStartModal
        open={open}
        brand={brand}
        onClose={() => setOpen(false)}
        onGo={() => nav("/partnering")} // 나중에 실제 제휴 2단계 경로로 교체
      />
    </div>
  );
}