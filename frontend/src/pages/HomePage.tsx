import { Link } from "react-router-dom";

const steps = [
  {
    title: "Browse & Filter",
    description: "Search through hundreds of verified rental agencies. Filter by location, vehicle type, and model.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
        <path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Book Securely",
    description: "All agencies are verified. Book with confidence knowing your reservation is protected.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
        <path d="M12 3 5 6v5c0 4.5 2.8 8.5 7 10 4.2-1.5 7-5.5 7-10V6l-7-3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Drive or Earn",
    description: "Renters hit the road. Agencies manage bookings, set pricing, and grow their business.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
        <path d="M12 2v20M17 6.5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
  },
];

export function HomePage() {
  return (
    <div className="bg-[#05060a] text-white">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_52%_54%,rgba(31,70,150,0.48)_0%,rgba(12,22,48,0.66)_24%,rgba(8,10,17,0.92)_49%,#05060a_78%)]">
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#05060a] to-transparent" />
        <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[1480px] items-center px-6 py-20 sm:px-10 lg:px-16">
          <div className="max-w-[780px] pt-8">
            <div className="inline-flex rounded-full border border-[#2355c7]/70 bg-[#10204a]/80 px-5 py-3 text-sm font-bold tracking-wide text-[#2f66f3] shadow-[0_0_30px_rgba(47,102,243,0.12)] sm:px-7 sm:text-base">
              Drive More. Worry Less.
            </div>
            <h1 className="mt-11 font-display text-[4rem] font-bold leading-[0.98] tracking-[-0.03em] text-white sm:text-[6rem] lg:text-[7rem]">
              Your Ride,
              <span className="block text-[#2f66f3]">Your Way</span>
            </h1>
            <p className="mt-10 max-w-[760px] text-xl font-semibold leading-9 text-[#96979f] sm:text-2xl">
              Connect with trusted vehicle rental agencies across the country. From bikes to buses, find your perfect ride or list your fleet.
            </p>
            <div className="mt-12 flex flex-wrap gap-5">
              <Link
                to="/browse"
                className="inline-flex min-h-[70px] min-w-[235px] items-center justify-center rounded-lg bg-[#2f66f3] px-9 text-lg font-bold text-white shadow-lg shadow-blue-950/25 transition hover:bg-[#477aff]"
              >
                Find a Vehicle
                <span className="ml-4 text-3xl leading-none">→</span>
              </Link>
              <Link
                to="/owner/listings"
                className="inline-flex min-h-[70px] min-w-[205px] items-center justify-center rounded-lg border border-white/12 bg-[#0d0e14]/80 px-9 text-lg font-bold text-white transition hover:border-white/25 hover:bg-white/5"
              >
                List Your Fleet
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#05060a] px-6 py-28 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="text-center">
            <h2 className="font-display text-4xl font-bold tracking-[-0.02em] text-white sm:text-5xl">How It Works</h2>
            <p className="mt-6 text-xl font-semibold text-[#96979f] sm:text-2xl">
              Three simple steps to get on the road or grow your rental business
            </p>
          </div>
          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.title}
                className="min-h-[310px] rounded-lg border border-white/12 bg-[#111217] px-10 py-10 shadow-[0_12px_50px_rgba(0,0,0,0.28)]"
              >
                <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-[#204da9] bg-[#10204a] text-[#2f66f3]">
                  {step.icon}
                </div>
                <h3 className="mt-9 font-display text-2xl font-bold text-white">{step.title}</h3>
                <p className="mt-5 max-w-[420px] text-lg font-semibold leading-8 text-[#96979f]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
