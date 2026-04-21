import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { BrandLogo } from "@/components/BrandLogo";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
  }`;

export function Shell() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" aria-label="CROODX home">
            <BrandLogo dark />
          </Link>
          <nav className="hidden md:flex flex-wrap items-center gap-1">
            <NavLink to="/browse" className={linkClass}>
              Browse Vehicles
            </NavLink>
            <NavLink to="/how-it-works" className={linkClass}>
              How It Works
            </NavLink>
            {user && (
              <>
                <NavLink to="/bookings" className={linkClass}>
                  My Bookings
                </NavLink>
                <NavLink to="/owner/listings" className={linkClass}>
                  List Your Vehicle
                </NavLink>
                {(user.role === "owner" || user.role === "admin") && (
                  <NavLink to="/owner/incoming" className={linkClass}>
                    Owner Requests
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
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  to="/owner/listings"
                  className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  List Your Vehicle
                </Link>
              </>
            )}
          </div>
        </div>
        {user && (
          <div className="md:hidden border-t border-slate-200 px-2 py-2 flex flex-wrap gap-1">
            <NavLink to="/browse" className={linkClass}>
              Browse
            </NavLink>
            <NavLink to="/how-it-works" className={linkClass}>
              How
            </NavLink>
            <NavLink to="/bookings" className={linkClass}>
              Bookings
            </NavLink>
            <NavLink to="/owner/listings" className={linkClass}>
              List
            </NavLink>
            {(user.role === "owner" || user.role === "admin") && (
              <NavLink to="/owner/incoming" className={linkClass}>
                Requests
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
      <main className="flex-1">
        <Outlet />
      </main>
      <footer>
        <div className="bg-[#2055f7]">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-white md:grid-cols-2">
            <div>
              <h3 className="text-3xl font-display font-semibold">For Renters</h3>
              <ul className="mt-3 space-y-2 text-sm text-blue-100">
                <li>Perfect for tourists, students, and working professionals</li>
                <li>Flexible rentals from hourly to weekly</li>
                <li>Wide variety of vehicles at affordable rates</li>
                <li>24/7 customer support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-3xl font-display font-semibold">For Owners</h3>
              <ul className="mt-3 space-y-2 text-sm text-blue-100">
                <li>Earn extra income every month on average</li>
                <li>Set your own prices and availability</li>
                <li>Full control over who rents your vehicle</li>
                <li>Insurance coverage on all rentals</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-[#071531] text-slate-300">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-4">
            <div>
              <BrandLogo />
              <p className="mt-2 text-sm text-slate-400">Flexible, affordable mobility for everyone.</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-white">For Renters</p>
              <p>Browse Vehicles</p>
              <p>How It Works</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-white">For Owners</p>
              <p>List Your Vehicle</p>
              <p>Earn Income</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-white">Company</p>
              <p>About Us</p>
              <p>Contact</p>
            </div>
          </div>
          <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
            © 2026 CROODX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
