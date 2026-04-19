import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
            Vehicle rental marketplace
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight text-white">
            Affordable mobility from people nearby.
          </h1>
          <p className="text-lg text-slate-300 max-w-xl">
            Rent bikes, scooters, and cars for short trips. Owners list idle vehicles; travelers and students book in
            minutes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/browse"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Browse vehicles
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-900"
            >
              Create an account
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl shadow-emerald-500/5">
          <h2 className="font-display text-lg font-semibold text-white mb-4">What we offer</h2>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span> High-demand: bikes, scooters, cars
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span> Premium cars, SUVs, cycles
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span> Built for everyday, high-frequency use
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span> Owners earn passive income on idle assets
            </li>
          </ul>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {[
          { t: "List in minutes", d: "Owners publish vehicles; we route them through review for quality." },
          { t: "Book instantly", d: "Renters search by city and category, then lock dates with clear pricing." },
          { t: "Admin oversight", d: "Operations can approve listings, manage users, and resolve bookings." },
        ].map((x) => (
          <div key={x.t} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="font-display text-base font-semibold text-white mb-2">{x.t}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{x.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
