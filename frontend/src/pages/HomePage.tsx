import { Link } from "react-router-dom";

const rideOptions = [
  { title: "Bikes", count: "1,200+ available", cta: "Browse Bikes ->" },
  { title: "Scooters", count: "800+ available", cta: "Browse Scooters ->" },
  { title: "Cars", count: "500+ available", cta: "Browse Cars ->" },
];

const features = [
  {
    title: "Affordable Rates",
    description: "Pay only for what you need. Flexible pricing for every budget.",
  },
  {
    title: "Instant Booking",
    description: "Book in seconds. Get on the road faster than ever.",
  },
  {
    title: "Secure & Safe",
    description: "Verified owners, insured vehicles, and 24/7 support.",
  },
];

export function HomePage() {
  return (
    <div className="bg-slate-100">
      <section className="bg-[#2055f7]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
          <div className="max-w-2xl space-y-5">
            <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight text-white">
              Your Ride, Your Way
            </h1>
            <p className="text-lg sm:text-2xl text-blue-100 leading-relaxed">
              Rent bikes, scooters, and cars from local owners. Or earn passive income by listing your idle vehicle.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/browse"
                className="inline-flex items-center justify-center rounded-lg bg-white px-7 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                Find a Vehicle
              </Link>
              <Link
                to="/owner/listings"
                className="inline-flex items-center justify-center rounded-lg border border-blue-300/70 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-600"
              >
                List Your Vehicle
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center font-display text-4xl font-semibold text-slate-900">Choose Your Ride</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {rideOptions.map((ride) => (
            <div key={ride.title} className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl">
                {ride.title === "Bikes" ? "B" : ride.title === "Scooters" ? "S" : "C"}
              </div>
              <h3 className="text-2xl font-semibold text-slate-900">{ride.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{ride.count}</p>
              <Link to="/browse" className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:text-blue-800">
                {ride.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center font-display text-4xl font-semibold text-slate-900">Why CROODX?</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  O
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#2055f7] py-14">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl font-display font-semibold text-white">Got an Idle Vehicle? Turn It Into Income</h2>
          <p className="mt-4 text-lg text-blue-100">
            Join thousands of owners earning passive income by sharing their vehicles.
          </p>
          <Link
            to="/owner/listings"
            className="mt-7 inline-flex items-center justify-center rounded-lg bg-white px-7 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            Start Earning Today
          </Link>
        </div>
      </section>
    </div>
  );
}
