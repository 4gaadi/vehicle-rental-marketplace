export function HowItWorksPage() {
  const renterSteps = [
    { title: "Browse Vehicles", description: "Search for bikes, scooters, or cars in your area. Filter by type, price, and ratings." },
    { title: "Book Instantly", description: "Choose your pickup and return times. See total costs upfront with no hidden fees." },
    { title: "Pick Up & Ride", description: "Meet the owner, verify the vehicle, and hit the road. Enjoy your journey!" },
    { title: "Return & Pay", description: "Return the vehicle on time. Payment is processed securely through the platform." },
  ];

  const ownerSteps = [
    { title: "List Your Vehicle", description: "Create a listing with photos, pricing, and availability. It takes just 5 minutes." },
    { title: "Get Booking Requests", description: "Receive notifications when renters are interested. Accept or decline based on your schedule." },
    { title: "Hand Over Keys", description: "Meet the renter, verify their ID, and hand over your vehicle with peace of mind." },
    { title: "Earn Money", description: "Get paid automatically after each rental. Track your earnings in your dashboard." },
  ];

  return (
    <div className="bg-slate-100">
      <section className="bg-[#2055f7] py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h1 className="font-display text-6xl font-semibold text-white">How It Works</h1>
          <p className="mt-4 text-xl text-blue-100">Simple, secure, and flexible vehicle sharing for everyone</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center font-display text-5xl font-semibold text-slate-900">For Renters</h2>
        <p className="mt-2 text-center text-slate-500">Getting on the road is easy. Just follow these simple steps.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {renterSteps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white">
                {index + 1}
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-center font-display text-5xl font-semibold text-slate-900">For Vehicle Owners</h2>
        <p className="mt-2 text-center text-slate-500">Turn your idle vehicle into a money-making asset.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {ownerSteps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-xl font-semibold text-white">
                {index + 1}
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-center font-display text-5xl font-semibold text-slate-900">Safety & Trust</h2>
        <p className="mt-2 text-center text-slate-500">Your safety and security are our top priorities.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { title: "Verified Users", description: "All users are verified with government-issued IDs and phone numbers." },
            { title: "Rating System", description: "Two-way ratings help maintain quality and trust in the community." },
            { title: "Secure Payments", description: "Payments are processed securely. Owners get paid automatically." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
