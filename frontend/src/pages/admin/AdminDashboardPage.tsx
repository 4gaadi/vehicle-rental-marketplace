import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/api";

export function AdminDashboardPage() {
  const q = useQuery({ queryKey: ["admin-stats"], queryFn: () => api.adminStats() });
  return (
    <div className="space-y-6">
      {q.isLoading && <p className="text-slate-400 text-sm">Loading metrics…</p>}
      {q.isError && <p className="text-red-400 text-sm">{(q.error as Error).message}</p>}
      {q.data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Users", q.data.users],
            ["Vehicles", q.data.vehicles],
            ["Bookings", q.data.bookings],
            ["Active vehicles", q.data.active_vehicles],
            ["Pending review", q.data.pending_vehicles],
          ].map(([label, val]) => (
            <div key={String(label)} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
              <p className="font-display text-3xl font-semibold text-white mt-2">{val}</p>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/vehicles"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Review vehicles
        </Link>
        <Link
          to="/admin/bookings"
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900"
        >
          View bookings
        </Link>
      </div>
    </div>
  );
}
