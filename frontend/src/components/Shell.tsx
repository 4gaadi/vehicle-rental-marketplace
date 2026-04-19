import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-emerald-500/15 text-emerald-300" : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

export function Shell() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="font-display text-lg font-semibold tracking-tight text-white">
            Rent<span className="text-emerald-400">Ride</span>
          </Link>
          <nav className="hidden md:flex flex-wrap items-center gap-1">
            <NavLink to="/browse" className={linkClass}>
              Browse
            </NavLink>
            {user && (
              <>
                <NavLink to="/bookings" className={linkClass}>
                  My trips
                </NavLink>
                <NavLink to="/owner/listings" className={linkClass}>
                  List a vehicle
                </NavLink>
                {(user.role === "owner" || user.role === "admin") && (
                  <NavLink to="/owner/incoming" className={linkClass}>
                    Incoming bookings
                  </NavLink>
                )}
                {user.role === "admin" && (
                  <NavLink to="/admin" className={linkClass}>
                    Admin
                  </NavLink>
                )}
              </>
            )}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden sm:inline text-xs text-slate-400 max-w-[160px] truncate">
                  {user.full_name}
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
        {user && (
          <div className="md:hidden border-t border-slate-800 px-2 py-2 flex flex-wrap gap-1">
            <NavLink to="/browse" className={linkClass}>
              Browse
            </NavLink>
            <NavLink to="/bookings" className={linkClass}>
              Trips
            </NavLink>
            <NavLink to="/owner/listings" className={linkClass}>
              List
            </NavLink>
            {(user.role === "owner" || user.role === "admin") && (
              <NavLink to="/owner/incoming" className={linkClass}>
                Incoming
              </NavLink>
            )}
            {user.role === "admin" && (
              <NavLink to="/admin" className={linkClass}>
                Admin
              </NavLink>
            )}
          </div>
        )}
      </header>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Peer-to-peer rentals — bikes, scooters, cars, and more.
      </footer>
    </div>
  );
}
