import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api";
import type { Vehicle, VehicleStatus } from "@/types";

const statuses: VehicleStatus[] = [
  "draft",
  "pending_review",
  "active",
  "rejected",
  "inactive",
];

export function AdminVehiclesPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<VehicleStatus | "">("pending_review");
  const q = useQuery({
    queryKey: ["admin-vehicles", filter],
    queryFn: () => api.adminVehicles(filter || undefined),
  });
  const setStatus = useMutation({
    mutationFn: (args: { id: number; status: VehicleStatus }) => api.adminSetVehicleStatus(args.id, args.status),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-vehicles"] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-white">Vehicles</h2>
        <select
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          value={filter}
          onChange={(e) => setFilter((e.target.value as VehicleStatus | "") || "")}
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
        {(q.data ?? []).map((v: Vehicle) => (
          <div
            key={v.id}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
          >
            <div>
              <Link className="text-white font-medium hover:text-emerald-300" to={`/vehicles/${v.id}`}>
                {v.title}
              </Link>
              <p className="text-xs text-slate-500 mt-1">
                #{v.id} · Owner {v.owner_id} · {v.city} · ${v.daily_rate.toFixed(2)}/day
              </p>
              <p className="text-xs text-amber-200/90 mt-1 capitalize">{v.status.replace("_", " ")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={setStatus.isPending || v.status === s}
                  onClick={() => setStatus.mutate({ id: v.id, status: s })}
                  className="rounded-md border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800 disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {q.data && q.data.length === 0 && <p className="text-slate-500 text-sm">No vehicles.</p>}
    </div>
  );
}
