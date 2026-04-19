import { NavLink, Outlet } from "react-router-dom";

const tab = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-900"
  }`;

export function AdminLayout() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-white">Admin</h1>
        <p className="text-slate-400 text-sm mt-1">Operations console for users, listings, and bookings.</p>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <NavLink to="/admin" end className={tab}>
          Overview
        </NavLink>
        <NavLink to="/admin/users" className={tab}>
          Users
        </NavLink>
        <NavLink to="/admin/vehicles" className={tab}>
          Vehicles
        </NavLink>
        <NavLink to="/admin/bookings" className={tab}>
          Bookings
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
