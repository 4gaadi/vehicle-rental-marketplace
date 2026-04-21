import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api";
import type { Booking, BookingStatus } from "@/types";

const statuses: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed"];

export function AdminBookingsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<BookingStatus | "">("");
  const q = useQuery({
    queryKey: ["admin-bookings", filter],
    queryFn: () => api.adminBookings(filter || undefined),
  });
  const setStatus = useMutation({
    mutationFn: (args: { id: number; status: BookingStatus }) => api.adminSetBookingStatus(args.id, args.status),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-white">Bookings</h2>
        <select
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          value={filter}
          onChange={(e) => setFilter((e.target.value as BookingStatus | "") || "")}
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {q.isLoading && <p className="text-slate-400 text-sm">Loading…</p>}
      {q.isError && <p className="text-red-400 text-sm">{(q.error as Error).message}</p>}
      <div className="space-y-3">
        {(q.data ?? []).map((b: Booking) => (
          <div
            key={b.id}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
          >
            <div>
              <p className="text-sm text-white">
                Booking #{b.id} · Renter {b.renter_id} ·{" "}
                <Link className="text-emerald-400 hover:underline" to={`/vehicles/${b.vehicle_id}`}>
                  Vehicle {b.vehicle_id}
                </Link>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(b.start_at).toLocaleString()} → {new Date(b.end_at).toLocaleString()}
              </p>
              <p className="text-xs text-emerald-300 mt-1">${b.total_price.toFixed(2)} · {b.status}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={setStatus.isPending || b.status === s}
                  onClick={() => setStatus.mutate({ id: b.id, status: s })}
                  className="rounded-md border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800 disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {q.data && q.data.length === 0 && <p className="text-slate-500 text-sm">No bookings.</p>}
    </div>
  );
}
