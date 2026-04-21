import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { Shell } from "@/components/Shell";
import { AdminBookingsPage } from "@/pages/admin/AdminBookingsPage";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminVehiclesPage } from "@/pages/admin/AdminVehiclesPage";
import { BrowsePage } from "@/pages/BrowsePage";
import { HomePage } from "@/pages/HomePage";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { LoginPage } from "@/pages/LoginPage";
import { MyBookingsPage } from "@/pages/MyBookingsPage";
import { OwnerBookingsPage } from "@/pages/OwnerBookingsPage";
import { OwnerListingsPage } from "@/pages/OwnerListingsPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { VehicleDetailPage } from "@/pages/VehicleDetailPage";

function RequireAuth({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-slate-400 text-sm">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-slate-400 text-sm">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<HomePage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="vehicles/:id" element={<VehicleDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="bookings"
          element={
            <RequireAuth>
              <MyBookingsPage />
            </RequireAuth>
          }
        />
        <Route path="owner/listings" element={<OwnerListingsPage />} />
        <Route
          path="owner/incoming"
          element={
            <RequireAuth>
              <OwnerBookingsPage />
            </RequireAuth>
          }
        />
        <Route
          path="admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="vehicles" element={<AdminVehiclesPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
