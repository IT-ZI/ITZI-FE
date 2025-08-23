import { Route, Routes, Navigate} from "react-router-dom"
import RootLayout from "./layouts/RootLayout"
import Benefits from "./pages/home/Benefits"
import Cooperation from "./pages/home/Cooperation"
import BenefitList from "./pages/detailpage/benefitList"
import Cooperationlist from "./pages/detailpage/cooperationlist"

const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout/>}>
        <Route index element={<Navigate to="/benefits" replace />}/>
        <Route path="benefits" element={<Benefits/>}/>
        <Route path="cooperation" element={<Cooperation/>}/>
        <Route path="benefitlist" element={<BenefitList/>}/>
        <Route path="recruiting/:postId" element={<Cooperationlist/>}/>
      </Route>
    </Routes>
  )
}

export default App
