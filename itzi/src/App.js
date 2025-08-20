import { Route, Routes, Navigate} from "react-router-dom"
import RootLayout from "./layouts/RootLayout"
import Benefits from "./pages/home/Benefits"
import Cooperation from "./pages/home/Cooperation"
import StoreDetail from "./pages/detailpage/StoreDetail"
import CooperationWrite from "./pages/write/CooperationWrite"

const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout/>}>
        <Route index element={<Navigate to="/benefits" replace />}/>
        <Route path="benefits" element={<Benefits/>}/>
        <Route path="cooperation" element={<Cooperation/>}/>
        <Route path="detail" element={<StoreDetail/>}/>
        <Route path="cooperation/write" element={<CooperationWrite />} />
      </Route>
    </Routes>
  )
}

export default App
