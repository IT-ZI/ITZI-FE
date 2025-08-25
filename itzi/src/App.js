import React from "react";
import { Routes, Route } from "react-router-dom"; // ✅ Router 제거
import RootLayout from "./layouts/RootLayout";
import Main from "./components/Main";
import Benefits from "./pages/home/Benefits";
import Cooperation from "./pages/home/Cooperation";
import Write from "./pages/write/Write";
import CooperationWrite from "./pages/write/CooperationWrite";
import Select from "./pages/partner/Select";
import PartneringPage from "./pages/partner/PartneringPage";
import AgreementPage from "./pages/partner/AgreementPage";
import ProfileEdit from "./pages/profile/ProfileEdit";
import StoreDetail from "./pages/detailpage/StoreDetail";
import AgreementCreatePage from "./pages/partner/AgreementCreate";
import ProfileHome from "./pages/profile/ProfileHome";

function App() {
  return (
    // ✅ <Router> 태그 제거
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Main />} />
        <Route path="benefits" element={<Benefits />} />
        <Route path="cooperation" element={<Cooperation />} />
        <Route path="write" element={<Write />} />
        <Route path="cooperation/write" element={<CooperationWrite />} />
        <Route path="select" element={<Select />} />
        <Route path="partner/partnering" element={<PartneringPage />} />
        <Route path="partner/agreement" element={<AgreementPage />} />
        <Route path="partner/agreement/create" element={<AgreementCreatePage />} />
        <Route path="profile/edit" element={<ProfileEdit />} />
        <Route path="detailpage/store" element={<StoreDetail />} />
        <Route path="profile/home" element={<ProfileHome />} />
      </Route>
    </Routes>
  );
}

export default App;