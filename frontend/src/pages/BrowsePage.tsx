import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "@/api";
import type { VehicleCategory } from "@/types";

const categories: { value: VehicleCategory | ""; label: string }[] = [
  { value: "", label: "All categories" },
  { value: "bike", label: "Bike" },
  { value: "scooter", label: "Scooter" },
  { value: "car", label: "Car" },
  { value: "premium_car", label: "Premium car" },
  { value: "suv", label: "SUV" },
  { value: "cycle", label: "Cycle" },
];

function formatCategory(c: VehicleCategory) {
  return categories.find((x) => x.value === c)?.label ?? c;
}

export function BrowsePage() {
  const [sp, setSp] = useSearchParams();
  const city = sp.get("city") ?? "";
  const category = (sp.get("category") as VehicleCategory | "") || "";

  const q = useQuery({
    queryKey: ["vehicles", city, category],
    queryFn: () =>
      api.vehicles({
        city: city || undefined,
        category: category || undefined,
      }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-white">Browse vehicles</h1>
        <p className="text-slate-400 mt-1 text-sm">Live inventory with instant booking.</p>
      </div>
      <form
        className="flex flex-wrap gap-3 items-end rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const c = String(fd.get("city") ?? "").trim();
          const cat = String(fd.get("category") ?? "");
          const next = new URLSearchParams();
          if (c) next.set("city", c);
          if (cat) next.set("category", cat);
          setSp(next);
        }}
      >
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          City
          <input
            name="city"
            defaultValue={city}
            placeholder="e.g. Austin"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Category
          <select
            name="category"
            defaultValue={category}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white min-w-[160px]"
          >
            {categories.map((c) => (
              <option key={c.label} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Apply
        </button>
      </form>
      {q.isLoading && <p className="text-slate-400 text-sm">Loading listings…</p>}
      {q.isError && <p className="text-red-400 text-sm">{(q.error as Error).message}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(q.data ?? []).map((v) => (
          <Link
            key={v.id}
            to={`/vehicles/${v.id}`}
            className="group rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden hover:border-emerald-500/40 transition"
          >
            <div className="aspect-video bg-slate-800 relative">
              {v.image_url ? (
                <img src={v.image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500 text-sm">No image</div>
              )}
              <span className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-2 py-0.5 text-[11px] text-emerald-300 border border-slate-700">
                {formatCategory(v.category)}
              </span>
            </div>
            <div className="p-4 space-y-1">
              <h2 className="font-medium text-white group-hover:text-emerald-300 transition">{v.title}</h2>
              <p className="text-xs text-slate-500">{v.city}</p>
              <p className="text-sm text-emerald-400 font-semibold">${v.daily_rate.toFixed(2)} / day</p>
            </div>
          </Link>
        ))}
      </div>
      {q.data && q.data.length === 0 && <p className="text-slate-500 text-sm">No vehicles match your filters.</p>}
    </div>
  );
}
