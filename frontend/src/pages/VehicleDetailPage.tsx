import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/api";
import { useAuth } from "@/auth/AuthContext";

function toIsoFromLocalParts(date: string, time: string) {
  // Treat the user's date+time as local time and convert to ISO for backend.
  const [y, m, d] = date.split("-").map((x) => Number(x));
  const [hh, mm] = time.split(":").map((x) => Number(x));
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0);
  return dt.toISOString();
}

export function VehicleDetailPage() {
  const { id } = useParams();
  const vid = Number(id);
  const { user } = useAuth();
  const qc = useQueryClient();
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("12:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("12:00");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["vehicle", vid],
    queryFn: () => api.vehicle(vid),
    enabled: Number.isFinite(vid),
  });

  const book = useMutation({
    mutationFn: () =>
      api.createBooking({
        vehicle_id: vid,
        start_at: toIsoFromLocalParts(startDate, startTime),
        end_at: toIsoFromLocalParts(endDate, endTime),
        notes: notes || null,
      }),
    onSuccess: async () => {
      setMsg("Booking confirmed.");
      await qc.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: (e: Error) => setMsg(e.message),
  });

  if (!Number.isFinite(vid)) return <p className="text-slate-400">Invalid vehicle.</p>;
  if (q.isLoading) return <p className="text-slate-400">Loading…</p>;
  if (q.isError) return <p className="text-red-400">{(q.error as Error).message}</p>;
  const v = q.data!;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
          {v.image_url ? (
            <img src={v.image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">No image</div>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-400">{v.category.replace("_", " ")}</p>
          <h1 className="font-display text-3xl font-semibold text-white mt-1">{v.title}</h1>
          <p className="text-slate-400 mt-2">{v.city}</p>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{v.description || "No description."}</p>
        <p className="text-2xl font-semibold text-emerald-400">${v.daily_rate.toFixed(2)} <span className="text-sm text-slate-500">/ day</span></p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 h-fit">
        <h2 className="font-display text-lg font-semibold text-white">Book this vehicle</h2>
        {!user && (
          <p className="text-sm text-slate-400">
            <Link className="text-emerald-400 hover:underline" to="/login">
              Log in
            </Link>{" "}
            to book.
          </p>
        )}
        {user && v.owner_id === user.id && <p className="text-sm text-amber-300">This is your listing.</p>}
        {user && v.status !== "active" && (
          <p className="text-sm text-amber-300">This listing is not publicly bookable ({v.status}).</p>
        )}
        {user && v.owner_id !== user.id && v.status === "active" && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setMsg(null);
              if (!startDate || !endDate) {
                setMsg("Please select both start and end date.");
                return;
              }
              const startIso = toIsoFromLocalParts(startDate, startTime);
              const endIso = toIsoFromLocalParts(endDate, endTime);
              if (new Date(endIso).getTime() <= new Date(startIso).getTime()) {
                setMsg("End date/time must be after start date/time.");
                return;
              }
              book.mutate();
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs text-slate-400">
                Start date
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block text-xs text-slate-400">
                Start time
                <input
                  type="time"
                  required
                  step={60}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block text-xs text-slate-400">
                End date
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block text-xs text-slate-400">
                End time
                <input
                  type="time"
                  required
                  step={60}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </label>
            </div>
            <label className="block text-xs text-slate-400">
              Notes (optional)
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white min-h-[72px]"
              />
            </label>
            {msg && <p className="text-sm text-slate-300">{msg}</p>}
            <button
              type="submit"
              disabled={book.isPending}
              className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {book.isPending ? "Booking…" : "Confirm booking"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
