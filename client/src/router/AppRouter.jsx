import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/customer/auth/Register";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
