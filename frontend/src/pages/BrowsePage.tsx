import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "@/api";
import { useAuth } from "@/auth/AuthContext";
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
  const { user } = useAuth();
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

  const vehicles = q.data ?? [];
  const visibleVehicles = user ? vehicles : vehicles.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-5xl font-semibold text-slate-900">Browse Vehicles</h1>
      <p className="mt-1 text-slate-500">Find the perfect ride for your needs</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
        <form
          className="h-fit rounded-xl border border-slate-200 bg-white p-4"
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
          <h2 className="text-2xl font-semibold text-slate-900">Filters</h2>
          <label className="mt-4 block text-sm text-slate-600">
            City
            <input
              name="city"
              defaultValue={city}
              placeholder="e.g. Whitefield"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="mt-3 block text-sm text-slate-600">
            Vehicle Type
            <select name="category" defaultValue={category} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
              {categories.map((c) => (
                <option key={c.label} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Apply Filters
          </button>
        </form>

        <div className="space-y-5">
          {!user && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <p className="text-lg font-semibold text-slate-900">Login to see all vehicles</p>
              <p className="mt-1 text-sm text-slate-600">
                You&apos;re viewing only 3 of {vehicles.length || 9} available vehicles. Login to browse our complete collection.
              </p>
              <Link to="/login" className="mt-3 inline-flex rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Login to View All
              </Link>
            </div>
          )}

          {q.isLoading && <p className="text-slate-500 text-sm">Loading listings...</p>}
          {q.isError && <p className="text-red-600 text-sm">{(q.error as Error).message}</p>}
          <p className="text-sm text-slate-600">
            {user ? `${vehicles.length} vehicles found` : `Showing ${visibleVehicles.length} of ${vehicles.length || 9} vehicles`}
          </p>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleVehicles.map((v) => (
              <Link key={v.id} to={`/vehicles/${v.id}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white hover:shadow-sm">
                <div className="relative aspect-[16/9] bg-slate-100">
                  {v.image_url ? (
                    <img src={v.image_url} alt={v.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
                  )}
                  <span className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-700">
                    ₹{Math.round(v.daily_rate / 8)}/hr
                  </span>
                </div>
                <div className="space-y-1 p-4">
                  <h2 className="text-2xl font-semibold text-slate-900">{v.title}</h2>
                  <p className="text-sm text-amber-500">★ 4.9 <span className="text-slate-400">(203)</span></p>
                  <p className="text-sm text-slate-500">{v.city}</p>
                  <p className="text-xs text-slate-400">Type: {formatCategory(v.category)}</p>
                </div>
              </Link>
            ))}
          </div>
          {q.data && q.data.length === 0 && <p className="text-slate-500 text-sm">No vehicles match your filters.</p>}
        </div>
      </div>
    </div>
  );
}
