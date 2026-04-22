import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "@/api";
import { useAuth } from "@/auth/AuthContext";
import type { Vehicle, VehicleCategory } from "@/types";

const categories: { value: VehicleCategory | ""; label: string }[] = [
  { value: "", label: "All categories" },
  { value: "bike", label: "Bike" },
  { value: "scooter", label: "Scooter" },
  { value: "car", label: "Car" },
  { value: "premium_car", label: "Premium car" },
  { value: "suv", label: "SUV" },
  { value: "cycle", label: "Cycle" },
];

const publicVehicles = [
  {
    title: "Honda City 2024",
    agency: "Mumbai Rentals",
    location: "Mumbai, Maharashtra",
    category: "Car",
    price: 2500,
    emoji: "🚗",
  },
  {
    title: "Royal Enfield Classic 350",
    agency: "Delhi Bike Rentals",
    location: "Delhi, Delhi",
    category: "Bike",
    price: 800,
    emoji: "🏍️",
  },
  {
    title: "Honda Activa 6G",
    agency: "Bangalore Scooty Hub",
    location: "Bangalore, Karnataka",
    category: "Scooter",
    price: 400,
    emoji: "🛵",
  },
  {
    title: "Hero Splendor Plus",
    agency: "Chennai Wheels",
    location: "Chennai, Tamil Nadu",
    category: "Bike",
    price: 500,
    emoji: "🏍️",
  },
];

function formatCategory(c: VehicleCategory) {
  return categories.find((x) => x.value === c)?.label ?? c;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(price);
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path
        d="M12 21s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle cx="12" cy="9" r="2.4" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
      <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function VehicleImage({ vehicle }: { vehicle: Pick<Vehicle, "title" | "image_url"> }) {
  return (
    <div className="flex h-[265px] items-center justify-center bg-[#182848]">
      {vehicle.image_url ? (
        <img src={vehicle.image_url} alt={vehicle.title} className="h-full w-full object-cover" />
      ) : (
        <span className="text-5xl" aria-hidden="true">
          🚘
        </span>
      )}
    </div>
  );
}

function PublicVehicleCard({ vehicle }: { vehicle: (typeof publicVehicles)[number] }) {
  return (
    <article className="overflow-hidden rounded-lg border border-white/12 bg-[#111217] shadow-[0_14px_45px_rgba(0,0,0,0.26)]">
      <div className="flex h-[265px] items-center justify-center bg-[#192848]">
        <span className="text-[4.5rem] leading-none" aria-hidden="true">
          {vehicle.emoji}
        </span>
      </div>
      <div className="p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-[-0.01em] text-white">{vehicle.title}</h2>
            <p className="mt-3 text-lg font-semibold text-[#9a9ba3]">{vehicle.agency}</p>
          </div>
          <span className="rounded-full border border-[#2256c9] bg-[#10204a] px-4 py-1.5 text-sm font-bold text-[#2f66f3]">
            {vehicle.category}
          </span>
        </div>
        <p className="mt-6 flex items-center gap-3 text-lg font-semibold text-[#9a9ba3]">
          <LocationIcon />
          {vehicle.location}
        </p>
        <div className="mt-7 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="font-display text-3xl font-bold tracking-wide text-white">₹{formatPrice(vehicle.price)}</p>
              <p className="mt-1 text-sm font-semibold text-[#9a9ba3]">per day</p>
            </div>
            <Link
              to="/login"
              className="inline-flex min-h-12 min-w-[138px] items-center justify-center rounded-lg bg-[#116bf6] px-6 text-lg font-bold text-white transition hover:bg-[#2f7dff]"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="overflow-hidden rounded-lg border border-white/12 bg-[#111217] shadow-[0_14px_45px_rgba(0,0,0,0.26)] transition hover:border-[#2f66f3]/70"
    >
      <VehicleImage vehicle={vehicle} />
      <div className="p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-[-0.01em] text-white">{vehicle.title}</h2>
            <p className="mt-3 text-lg font-semibold text-[#9a9ba3]">Verified Rental Agency</p>
          </div>
          <span className="rounded-full border border-[#2256c9] bg-[#10204a] px-4 py-1.5 text-sm font-bold text-[#2f66f3]">
            {formatCategory(vehicle.category)}
          </span>
        </div>
        <p className="mt-6 flex items-center gap-3 text-lg font-semibold text-[#9a9ba3]">
          <LocationIcon />
          {vehicle.city}
        </p>
        <div className="mt-7 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="font-display text-3xl font-bold tracking-wide text-white">₹{formatPrice(vehicle.daily_rate)}</p>
              <p className="mt-1 text-sm font-semibold text-[#9a9ba3]">per day</p>
            </div>
            <span className="inline-flex min-h-12 min-w-[138px] items-center justify-center rounded-lg bg-[#116bf6] px-6 text-lg font-bold text-white">
              Book Now
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
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

  return (
    <div className="min-h-screen bg-[#05060a] bg-[radial-gradient(circle_at_50%_0%,rgba(31,70,150,0.2)_0%,rgba(13,15,25,0.45)_23%,#05060a_55%)] text-white">
      <div className="mx-auto max-w-[1480px] px-6 py-16 sm:px-10 lg:px-16">
        <div>
          <h1 className="font-display text-5xl font-bold tracking-[-0.02em] text-white sm:text-6xl">Browse Vehicles</h1>
          <p className="mt-6 text-xl font-semibold text-[#9a9ba3] sm:text-2xl">
            Find your perfect ride from trusted rental agencies
          </p>
        </div>

        {!user && (
          <section className="mt-14 rounded-lg border border-[#204da9] bg-[#091227] p-7 shadow-[0_14px_45px_rgba(0,0,0,0.22)]">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-8">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#10204a] text-[#2f66f3]">
                  <LockIcon />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">Unlock Full Access</h2>
                  <p className="mt-3 text-base font-semibold text-[#9a9ba3] sm:text-lg">
                    Login to access filters, see all vehicles, and book instantly
                  </p>
                </div>
              </div>
              <Link
                to="/login"
                className="inline-flex min-h-[54px] items-center justify-center rounded-lg bg-[#2f66f3] px-8 text-lg font-bold text-white transition hover:bg-[#477aff]"
              >
                Login Now
              </Link>
            </div>
          </section>
        )}

        {user && (
          <form
            className="mt-12 grid gap-4 rounded-lg border border-white/12 bg-[#111217] p-5 md:grid-cols-[1fr_220px_auto]"
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
            <input
              name="city"
              defaultValue={city}
              placeholder="City"
              className="rounded-lg border border-white/10 bg-[#05060a] px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-[#777982] focus:border-[#2f66f3]"
            />
            <select
              name="category"
              defaultValue={category}
              className="rounded-lg border border-white/10 bg-[#05060a] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-[#2f66f3]"
            >
              {categories.map((c) => (
                <option key={c.label} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <button type="submit" className="rounded-lg bg-[#2f66f3] px-8 py-3 text-sm font-bold text-white hover:bg-[#477aff]">
              Apply Filters
            </button>
          </form>
        )}

        {q.isLoading && user && <p className="mt-8 text-sm font-semibold text-[#9a9ba3]">Loading listings...</p>}
        {q.isError && user && <p className="mt-8 text-sm font-semibold text-red-400">{(q.error as Error).message}</p>}

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {user ? vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />) : publicVehicles.map((v) => <PublicVehicleCard key={v.title} vehicle={v} />)}
        </div>

        {user && q.data && q.data.length === 0 && (
          <p className="mt-8 text-sm font-semibold text-[#9a9ba3]">No vehicles match your filters.</p>
        )}
      </div>
    </div>
  );
}
