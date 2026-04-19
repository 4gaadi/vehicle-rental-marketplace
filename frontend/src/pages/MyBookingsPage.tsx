import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/api";

export function MyBookingsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["my-bookings"], queryFn: () => api.myBookings() });
  const cancel = useMutation({
    mutationFn: (id: number) => api.cancelBooking(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["my-bookings"] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold text-white">My trips</h1>
      {q.isLoading && <p className="text-slate-400 text-sm">Loading…</p>}
      {q.isError && <p className="text-red-400 text-sm">{(q.error as Error).message}</p>}
      <div className="space-y-3">
        {(q.data ?? []).map((b) => (
          <div
            key={b.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
          >
            <div>
              <p className="text-sm text-slate-400">
                Booking #{b.id} ·{" "}
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
            {b.status !== "cancelled" && b.status !== "completed" && (
              <button
                type="button"
                onClick={() => cancel.mutate(b.id)}
                disabled={cancel.isPending}
                className="self-start rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
      {q.data && q.data.length === 0 && <p className="text-slate-500 text-sm">No bookings yet.</p>}
    </div>
  );
}
