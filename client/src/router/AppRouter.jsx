import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/customer/auth/Register";
import BarberLayout from "../layouts/BarberLayout";
import BarberDashboard from "../pages/barber/Dashboard";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<BarberLayout />}>
          <Route index element={<BarberDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
