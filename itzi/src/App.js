import { Route, Routes, Navigate} from "react-router-dom"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import RootLayout from "./layouts/RootLayout"
import Benefits from "./pages/home/Benefits"
import Cooperation from "./pages/home/Cooperation"
import BenefitList from "./pages/detailpage/benefitList"
import Cooperationlist from "./pages/detailpage/cooperationlist"
import CooperationWrite, { BenefitTab, RecruitTab } from "./pages/write/CooperationWrite"
import Write from "./pages/write/Write"
// ✅ 새로운 페이지들 import
import StoreDetail from "./pages/detailpage/StoreDetail";
import ProfileEdit from "./pages/profile/ProfileEdit";
import ProfileHome from "./pages/profile/ProfileHome"; // 제휴 대시보드(프로필 홈)
import PartneringPage from "./pages/partner/PartneringPage";
import Select from "./pages/partner/Select"; // 선택하기 페이지 (제휴 문의/스크랩 탭)

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Routes>
        <Route element={<RootLayout/>}>
          {/* 기본 진입은 혜택 탭으로 */}
          <Route index element={<Navigate to="/benefits" replace />}/>
          
          {/* 혜택 탭 */}
          <Route path="benefits" element={<Benefits/>}/>
          
          {/* 제휴 탭: 기존 /cooperation 링크는 /profile/home 으로 안전 리다이렉트 */}
          {/* 제휴 탭: Cooperation.jsx로 직접 연결 */}
          <Route path="cooperation" element={<Cooperation/>}/>
          <Route path="profile/home" element={<ProfileHome />} />
          
          {/* 기존 상세 페이지들 */}
          <Route path="promotion/:postId" element={<BenefitList/>}/>
          <Route path="recruiting/:postId" element={<Cooperationlist/>}/>
          
          {/* 새로운 상세/프로필 편집 */}
          <Route path="detail" element={<StoreDetail />} />
          <Route path="profile/edit" element={<ProfileEdit />} />
          
          {/* 기존 작성 페이지들 */}
          <Route path="cooperation/write" element={<CooperationWrite />}>
            <Route index element={<Navigate to="recruit" replace />} />
            <Route path="recruit" element={<RecruitTab />} />
            <Route path="benefit" element={<BenefitTab />} />
          </Route>
          <Route path="/cooperation/write/new" element={<Write />} />
          
          {/* 새로운 페이지들 */}
          <Route path="/select" element={<Select />} />
          <Route path="partner/partnering" element={<PartneringPage />} />
          
          {/* 존재하지 않는 경로는 혜택 홈으로 회수 */}
          <Route path="*" element={<Navigate to="/benefits" replace />} />
        </Route>
      </Routes>
    </LocalizationProvider>
  )
}

export default App