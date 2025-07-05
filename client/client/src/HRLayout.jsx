import { Outlet } from "react-router-dom";
import Sidebar from "./Components/shared/Sidebar";

export default function HRLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-900">
        <Outlet /> 
      </div>
    </div>
  );
}
