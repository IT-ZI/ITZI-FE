// src/App.jsx
import { Route, Routes, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";

// ✅ 실제로 존재하는 페이지들만 import
import Benefits from "./pages/home/Benefits";
import StoreDetail from "./pages/detailpage/StoreDetail";
import ProfileEdit from "./pages/profile/ProfileEdit";
import ProfileHome from "./pages/profile/ProfileHome"; // 제휴 대시보드(프로필 홈)
import PartneringPage from "./pages/partnering/PartneringPage"; // ✅ 임시 제휴맺기 페이지 (파일명과 경로 일치)
import Select from "./pages/partner/Select"; // 선택하기 페이지 (제휴 문의/스크랩 탭)

const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* 기본 진입은 혜택 탭으로 */}
        <Route index element={<Navigate to="/benefits" replace />} />

        {/* 혜택 탭 */}
        <Route path="benefits" element={<Benefits />} />

        {/* 제휴 탭: 기존 /cooperation 링크는 /profile/home 으로 안전 리다이렉트 */}
        <Route path="cooperation" element={<Navigate to="/profile/home" replace />} />
        <Route path="profile/home" element={<ProfileHome />} />

        {/* 상세/프로필 편집 */}
        <Route path="detail" element={<StoreDetail />} />
        <Route path="profile/edit" element={<ProfileEdit />} />

        <Route path="/select" element={<Select />} />

        {/* ✅ 임시 제휴맺기 */}
        <Route path="partnering" element={<PartneringPage />} />

        {/* 존재하지 않는 경로는 혜택 홈으로 회수 */}
        <Route path="*" element={<Navigate to="/benefits" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
