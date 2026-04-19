import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api";
import { useAuth } from "@/auth/AuthContext";
import type { VehicleCategory } from "@/types";

const cats: { value: VehicleCategory; label: string }[] = [
  { value: "bike", label: "Bike" },
  { value: "scooter", label: "Scooter" },
  { value: "car", label: "Car" },
  { value: "premium_car", label: "Premium car" },
  { value: "suv", label: "SUV" },
  { value: "cycle", label: "Cycle" },
];

export function OwnerListingsPage() {
  const { user, refresh } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [daily, setDaily] = useState("25");
  const [category, setCategory] = useState<VehicleCategory>("bike");
  const [imageUrl, setImageUrl] = useState("");
  const [formErr, setFormErr] = useState<string | null>(null);

  const q = useQuery({ queryKey: ["my-vehicles"], queryFn: () => api.myVehicles() });
  const create = useMutation({
    mutationFn: () =>
      api.createVehicle({
        title,
        description,
        city,
        daily_rate: Number(daily),
        category,
        image_url: imageUrl || null,
      }),
    onSuccess: async () => {
      setFormErr(null);
      setTitle("");
      setDescription("");
      setCity("");
      setDaily("25");
      setImageUrl("");
      await qc.invalidateQueries({ queryKey: ["my-vehicles"] });
    },
    onError: (e: Error) => setFormErr(e.message),
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">My listings</h1>
          <p className="text-slate-400 text-sm mt-1">New listings go to admin review before they appear in browse.</p>
        </div>
      </div>
      {user?.role === "renter" && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-amber-100/90">Switch to an owner profile to list vehicles and earn from rentals.</p>
          <button
            type="button"
            onClick={async () => {
              await api.becomeOwner();
              await refresh();
            }}
            className="shrink-0 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Become an owner
          </button>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (user?.role === "renter") return;
            create.mutate();
          }}
        >
          <h2 className="font-display text-lg font-semibold text-white mb-2">Add vehicle</h2>
          <label className="block text-xs text-slate-400">
            Title
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label className="block text-xs text-slate-400">
            Description
            <textarea
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white min-h-[80px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="block text-xs text-slate-400">
            City
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </label>
          <label className="block text-xs text-slate-400">
            Daily rate (USD)
            <input
              type="number"
              min={0.01}
              step={0.01}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={daily}
              onChange={(e) => setDaily(e.target.value)}
              required
            />
          </label>
          <label className="block text-xs text-slate-400">
            Category
            <select
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value as VehicleCategory)}
            >
              {cats.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-slate-400">
            Image URL (optional)
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </label>
          {formErr && <p className="text-sm text-red-400">{formErr}</p>}
          <button
            type="submit"
            disabled={create.isPending || user?.role === "renter"}
            className="w-full rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {user?.role === "renter" ? "Become an owner to add vehicles" : create.isPending ? "Submitting…" : "Submit for review"}
          </button>
        </form>
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">Your vehicles</h2>
          {q.isLoading && <p className="text-slate-400 text-sm">Loading…</p>}
          {(q.data ?? []).map((v) => (
            <div key={v.id} className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 flex justify-between gap-3">
              <div>
                <Link to={`/vehicles/${v.id}`} className="text-white font-medium hover:text-emerald-300">
                  {v.title}
                </Link>
                <p className="text-xs text-slate-500 mt-1">
                  {v.city} · ${v.daily_rate.toFixed(2)}/day
                </p>
                <p className="text-xs text-amber-300 mt-1 capitalize">{v.status.replace("_", " ")}</p>
              </div>
            </div>
          ))}
          {q.data && q.data.length === 0 && <p className="text-slate-500 text-sm">No vehicles yet.</p>}
        </div>
      </div>
    </div>
  );
}
