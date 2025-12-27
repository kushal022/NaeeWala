import { Outlet } from "react-router-dom";
// import Navbar from "../component/barber/Navabr";
import Sidebar from "../component/barber/Sidbar";
import Navbar from "../component/common/Navbar";

export default function BarberLayout() {
  return (
    <div className="min-h-screen bg-bg text-text">
     <Navbar/>

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}
