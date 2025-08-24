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

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Routes>
        <Route element={<RootLayout/>}>
          <Route index element={<Navigate to="/benefits" replace />}/>
          <Route path="benefits" element={<Benefits/>}/>
          <Route path="cooperation" element={<Cooperation/>}/>
          <Route path="promotion/:postId" element={<BenefitList/>}/>
          <Route path="recruiting/:postId" element={<Cooperationlist/>}/>
          <Route path="cooperation/write" element={<CooperationWrite />}>
            <Route index element={<Navigate to="recruit" replace />} />
            <Route path="recruit" element={<RecruitTab />} />
            <Route path="benefit" element={<BenefitTab />} />
          </Route>
          <Route path="/cooperation/write/new" element={<Write />} />
        </Route>
      </Routes>
    </LocalizationProvider>
  )
}

export default App
