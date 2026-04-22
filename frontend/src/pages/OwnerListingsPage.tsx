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

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-11 w-11">
      <rect x="4.5" y="10" width="15" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

export function OwnerListingsPage() {
  const { user, refresh } = useAuth();
  const qc = useQueryClient();
  const [step, setStep] = useState(1);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [city, setCity] = useState("");
  const [daily, setDaily] = useState("20");
  const [description, setDescription] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [category, setCategory] = useState<VehicleCategory>("bike");
  const [imageUrl, setImageUrl] = useState("");
  const [formErr, setFormErr] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const featureOptions = [
    "Helmet Included",
    "GPS Navigation",
    "Bluetooth Audio",
    "USB Charging",
    "Air Conditioning",
    "Automatic Transmission",
    "Disc Brakes",
    "LED Lights",
  ];

  const q = useQuery({
    queryKey: ["my-vehicles"],
    queryFn: () => api.myVehicles(),
    enabled: Boolean(user),
  });
  const create = useMutation({
    mutationFn: () =>
      api.createVehicle({
        title: `${make} ${model}`.trim(),
        description: [description, `Year: ${year}`, selectedFeatures.length ? `Features: ${selectedFeatures.join(", ")}` : ""]
          .filter(Boolean)
          .join(" | "),
        city,
        daily_rate: Number(daily),
        category,
        image_url: imageUrl || null,
      }),
    onSuccess: async () => {
      setFormErr(null);
      setSuccessMessage("Listing submitted successfully for review.");
      setStep(1);
      setMake("");
      setModel("");
      setYear(String(new Date().getFullYear()));
      setDescription("");
      setCity("");
      setDaily("20");
      setSelectedFeatures([]);
      setImageUrl("");
      await qc.invalidateQueries({ queryKey: ["my-vehicles"] });
    },
    onError: (e: Error) => setFormErr(e.message),
  });

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#05060a] bg-[radial-gradient(circle_at_50%_0%,rgba(31,70,150,0.15)_0%,rgba(13,15,25,0.32)_20%,#05060a_52%)] text-white">
        <div className="mx-auto flex max-w-[1480px] justify-center px-6 py-16 sm:px-10 lg:px-16">
          <section className="mt-6 flex max-w-[850px] flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#204da9] bg-[#10204a] text-[#2f66f3]">
              <LockIcon />
            </div>
            <h1 className="mt-20 font-display text-5xl font-bold tracking-[-0.02em] text-white sm:text-6xl">
              List Your Fleet
            </h1>
            <p className="mt-6 max-w-[780px] text-xl font-semibold leading-9 text-[#9a9ba3] sm:text-2xl">
              Join hundreds of rental agencies growing their business through CROODZ.
              <span className="block">Please login to list your vehicles.</span>
            </p>
            <Link
              to="/login"
              className="mt-12 inline-flex min-h-[68px] min-w-[235px] items-center justify-center rounded-lg bg-[#116bf6] px-8 text-lg font-bold text-white transition hover:bg-[#2f7dff]"
            >
              Login to Continue
            </Link>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div className="text-center">
        <h1 className="font-display text-5xl font-semibold text-slate-900">List Your Vehicle</h1>
        <p className="mt-2 text-slate-500">Start earning passive income by sharing your idle vehicle</p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2 text-center">
        {[1, 2, 3].map((item) => (
          <div key={item} className="space-y-2">
            <div
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                step >= item ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              {item}
            </div>
            <p className="text-xs text-slate-600">
              {item === 1 ? "Vehicle Details" : item === 2 ? "Pricing & Features" : "Photos & Submit"}
            </p>
          </div>
        ))}
      </div>

      {user?.role === "renter" && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-amber-900">Switch to an owner profile to list vehicles and earn from rentals.</p>
          <button
            type="button"
            onClick={async () => {
              await api.becomeOwner();
              await refresh();
            }}
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Become an owner
          </button>
        </div>
      )}

      <form
        className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (user?.role === "renter") return;
          create.mutate();
        }}
      >
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-slate-900">Vehicle Details</h2>
            <div>
              <p className="mb-2 text-sm text-slate-600">Vehicle Type *</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {cats.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                      category === c.value ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-300 text-slate-700"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-700">
                Make/Brand *
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={make} onChange={(e) => setMake(e.target.value)} required />
              </label>
              <label className="text-sm text-slate-700">
                Model *
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={model} onChange={(e) => setModel(e.target.value)} required />
              </label>
            </div>
            <label className="block text-sm text-slate-700">
              Year *
              <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={year} onChange={(e) => setYear(e.target.value)} required />
            </label>
            <label className="block text-sm text-slate-700">
              Location *
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Koramangala, Bangalore"
                required
              />
            </label>
            <div className="flex justify-end pt-2">
              <button type="button" onClick={() => setStep(2)} className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-slate-900">Pricing & Features</h2>
            <label className="block text-sm text-slate-700">
              Price Per Hour (₹) *
              <input
                type="number"
                min={1}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={daily}
                onChange={(e) => setDaily(e.target.value)}
                placeholder="e.g., 20"
                required
              />
            </label>
            <label className="block text-sm text-slate-700">
              Description *
              <textarea
                className="mt-1 min-h-[100px] w-full rounded-lg border border-slate-300 px-3 py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your vehicle, its condition, and any special features..."
                required
              />
            </label>
            <div>
              <p className="mb-2 text-sm text-slate-700">Features (Select all that apply)</p>
              <div className="grid gap-3 md:grid-cols-3">
                {featureOptions.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() =>
                      setSelectedFeatures((prev) =>
                        prev.includes(feature) ? prev.filter((item) => item !== feature) : [...prev, feature],
                      )
                    }
                    className={`rounded-lg border px-3 py-2 text-left text-sm ${
                      selectedFeatures.includes(feature) ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-300 text-slate-700"
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <button type="button" onClick={() => setStep(1)} className="rounded-lg border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700">
                Back
              </button>
              <button type="button" onClick={() => setStep(3)} className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-slate-900">Photos</h2>
            <label className="block text-sm text-slate-700">
              Image URL
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </label>
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-slate-700">
              <p className="font-semibold">Tips for Great Photos:</p>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>- Take photos in good natural lighting</li>
                <li>- Show the vehicle from multiple angles</li>
                <li>- Include close-ups of special features</li>
              </ul>
            </div>
            {formErr && <p className="text-sm text-red-600">{formErr}</p>}
            {successMessage && <p className="text-sm text-emerald-700">{successMessage}</p>}
            <div className="flex justify-between pt-2">
              <button type="button" onClick={() => setStep(2)} className="rounded-lg border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700">
                Back
              </button>
              <button
                type="submit"
                disabled={create.isPending || user?.role === "renter"}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {create.isPending ? "Submitting..." : "Submit Listing"}
              </button>
            </div>
          </div>
        )}
      </form>

      <div className="mx-auto max-w-5xl space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Your Vehicles</h2>
        {q.isLoading && <p className="text-slate-500 text-sm">Loading...</p>}
        {(q.data ?? []).map((v) => (
          <div key={v.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <Link to={`/vehicles/${v.id}`} className="text-lg font-semibold text-slate-900 hover:text-blue-700">
              {v.title}
            </Link>
            <p className="text-sm text-slate-500 mt-1">
              {v.city} · ₹{v.daily_rate.toFixed(2)}/hr
            </p>
            <p className="text-xs text-amber-600 mt-1 capitalize">{v.status.replace("_", " ")}</p>
          </div>
        ))}
        {q.data && q.data.length === 0 && <p className="text-slate-500 text-sm">No vehicles yet.</p>}
      </div>
    </div>
  );
}
