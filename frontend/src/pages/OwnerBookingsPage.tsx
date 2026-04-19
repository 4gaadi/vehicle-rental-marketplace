import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/api";
import { useAuth } from "@/auth/AuthContext";

export function OwnerBookingsPage() {
  const { user } = useAuth();
  const q = useQuery({
    queryKey: ["owner-bookings"],
    queryFn: () => api.ownerBookings(),
    enabled: user?.role === "owner" || user?.role === "admin",
  });

  if (user?.role === "renter") {
    return (
      <div className="max-w-lg space-y-4">
        <h1 className="font-display text-3xl font-semibold text-white">Incoming bookings</h1>
        <p className="text-slate-400 text-sm">Upgrade to an owner account to see bookings on your vehicles.</p>
        <Link
          to="/owner/listings"
          className="inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Go to listings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold text-white">Incoming bookings</h1>
      {q.isLoading && <p className="text-slate-400 text-sm">Loading…</p>}
      {q.isError && <p className="text-red-400 text-sm">{(q.error as Error).message}</p>}
      <div className="space-y-3">
        {(q.data ?? []).map((b) => (
          <div key={b.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-sm text-slate-400">
              Booking #{b.id} · Renter #{b.renter_id} ·{" "}
              <Link className="text-emerald-400 hover:underline" to={`/vehicles/${b.vehicle_id}`}>
                Vehicle {b.vehicle_id}
              </Link>
            </p>
            <p className="text-white text-sm mt-1">
              {new Date(b.start_at).toLocaleString()} → {new Date(b.end_at).toLocaleString()}
            </p>
            <p className="text-emerald-400 text-sm font-semibold mt-1">${b.total_price.toFixed(2)}</p>
            <p className="text-xs text-slate-500 mt-1 capitalize">{b.status}</p>
          </div>
        ))}
      </div>
      {q.data && q.data.length === 0 && <p className="text-slate-500 text-sm">No bookings on your vehicles yet.</p>}
    </div>
  );
}
