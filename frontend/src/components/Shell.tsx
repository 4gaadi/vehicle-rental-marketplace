import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { BrandLogo } from "@/components/BrandLogo";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-[0.95rem] font-semibold transition ${
    isActive ? "text-white" : "text-[#8f9098] hover:text-white"
  }`;

export function Shell() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#05060a] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0d0e14]">
        <div className="mx-auto flex h-[72px] max-w-[1480px] items-center justify-between gap-4 px-6 sm:px-10 lg:px-16">
          <Link to="/" aria-label="CROODX home">
            <BrandLogo dark />
          </Link>
          <nav className="hidden md:flex flex-wrap items-center gap-5">
            <NavLink to="/browse" className={linkClass}>
              Browse Vehicles
            </NavLink>
            <NavLink to="/owner/listings" className={linkClass}>
              List Your Fleet
            </NavLink>
            {user && (
              <>
                <NavLink to="/bookings" className={linkClass}>
                  My Bookings
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
                <span className="hidden max-w-[160px] truncate text-xs text-[#8f9098] sm:inline">
                  {user.full_name}
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-[#2f66f3] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-[#477aff]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
        {user && (
          <div className="flex flex-wrap gap-1 border-t border-white/10 px-2 py-2 md:hidden">
            <NavLink to="/browse" className={linkClass}>
              Browse
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
      <footer className="border-t border-white/10 bg-[#121318]">
        <div className="mx-auto max-w-[1480px] px-6 py-20 sm:px-10 lg:px-16">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-[-0.01em] text-white sm:text-4xl">Get in Touch</h2>
              <p className="mt-5 text-lg font-semibold text-[#96979f]">Questions? We're here to help you find your ride.</p>
            </div>
            <div className="text-left md:text-right">
              <a href="mailto:hello@croodz.com" className="font-display text-2xl font-bold text-[#2f66f3] sm:text-3xl">
                hello@croodz.com
              </a>
              <p className="mt-4 text-base font-semibold text-[#96979f]">Mumbai, India</p>
            </div>
          </div>
          <div className="mt-16 border-t border-white/10 pt-10">
            <div className="flex flex-col gap-6 text-sm font-semibold text-[#96979f] md:flex-row md:items-center md:justify-between">
              <p>© 2026 CROODZ. All rights reserved.</p>
              <p>DRIVE MORE. WORRY LESS.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
