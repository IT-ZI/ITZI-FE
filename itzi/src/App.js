// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Main from "./components/Main";
import Benefits from "./pages/home/Benefits";
import Cooperation from "./pages/home/Cooperation";
import Write from "./pages/write/Write";
import CooperationWrite from "./pages/write/CooperationWrite";
import Select from "./pages/Select";
import PartneringPage from "./pages/PartneringPage";
import AgreementsPage from "./pages/AgreementsPage";
import ProfileEdit from "./pages/profile/ProfileEdit";
import StoreDetail from "./pages/detailpage/StoreDetail";
import AgreementsCreatePage from "./pages/AgreementsCreate";
import ProfileHome from "./pages/profile/ProfileHome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Main />} />
        <Route path="benefits" element={<Benefits />} />
        <Route path="cooperation" element={<Cooperation />} />
        <Route path="write" element={<Write />} />
        <Route path="cooperation/write" element={<CooperationWrite />} />
        <Route path="select" element={<Select />} />
        <Route path="partnering" element={<PartneringPage />} />

        {/* 목록/생성 */}
        <Route path="agreements" element={<AgreementsPage />} />
        <Route path="agreements/create" element={<AgreementsCreatePage />} />

        {/* ✅ 단일 파트너십 ID로 진입하는 상세 */}
        <Route path="agreements/:partnerId" element={<AgreementsPage />} />

        {/* (선택) 예전에 쓰던 2-파라미터 경로 유지가 필요하면 남겨두기 */}
        <Route path="agreements/:postid/:partnerid" element={<AgreementsPage />} />

        {/* ✅ 단수 경로로 들어와도 열리도록 alias */}
        <Route path="agreement/:partnerId" element={<AgreementsPage />} />

        <Route path="profile/edit" element={<ProfileEdit />} />
        <Route path="detailpage/store" element={<StoreDetail />} />
        <Route path="profile/home" element={<ProfileHome />} />

        {/* 404 */}
        <Route path="*" element={<div style={{padding:24}}>404 Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
