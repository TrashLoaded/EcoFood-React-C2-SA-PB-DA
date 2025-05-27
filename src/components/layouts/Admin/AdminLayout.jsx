import { Outlet } from "react-router-dom";
import NavAdmin from "./NavAdmin";

export default function AdminLayout() {
  return (
    <div>
      <NavAdmin />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
