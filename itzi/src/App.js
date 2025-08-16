import Main from "./components/Main"
import { Route, Routes, Navigate } from "react-router-dom"
import RootLayout from "./layouts/RootLayout"
import Benefits from "./pages/home/Benefits"
import Cooperation from "./pages/home/Cooperation"
import StoreDetail from "./pages/detailpage/StoreDetail"

const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout/>}>
        <Route index element={<Main/>}/>
        <Route path="benefits" element={<Benefits/>}/>
        <Route path="cooperation" element={<Cooperation/>}/>
        <Route path="detail" element={<StoreDetail/>}/>
      </Route>
    </Routes>
  )
}

export default App
