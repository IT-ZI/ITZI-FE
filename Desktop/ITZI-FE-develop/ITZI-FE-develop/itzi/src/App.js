import { Route, Routes, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Benefits from "./pages/home/Benefits";
import Cooperation from "./pages/home/Cooperation";
import StoreDetail from "./pages/detailpage/StoreDetail";
import ProfileEdit from "./pages/profile/ProfileEdit"; // ✅ 추가

const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Navigate to="/benefits" replace />} />
        <Route path="benefits" element={<Benefits />} />
        <Route path="cooperation" element={<Cooperation />} />
        <Route path="detail" element={<StoreDetail />} />
        <Route path="profile/edit" element={<ProfileEdit />} /> {/* ✅ 추가 */}
      </Route>
    </Routes>
  );
};

export default App;
