import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useAuth } from "@/auth/AuthContext";
import { BrandLogo } from "@/components/BrandLogo";

export function RegisterPage() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<"renter" | "owner">("renter");
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(false);
  const normalizedEmail = email.trim().toLowerCase();

  if (step === "otp") {
    return (
      <div className="min-h-[70vh] bg-[#2055f7] px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <BrandLogo />
          <h1 className="mt-6 text-5xl font-display font-semibold text-white">Verify OTP</h1>
          <p className="mt-2 text-blue-100">Enter the 6-digit code sent to {normalizedEmail}</p>
          <form
            className="mx-auto mt-8 max-w-md rounded-xl bg-white p-6 text-left"
            onSubmit={async (e) => {
              e.preventDefault();
              setErr(null);
              if (!/^\d{6}$/.test(otp.trim())) {
                setErr("Enter a valid 6-digit OTP.");
                return;
              }
              setBusy(true);
              try {
                await login(normalizedEmail, password);
                nav("/browse");
              } catch (ex) {
                setErr((ex as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <label className="block text-sm text-slate-700">
              Enter OTP
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputMode="numeric"
                maxLength={6}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-xl tracking-[0.4em]"
                placeholder="000000"
              />
            </label>
            <p className="mt-4 rounded-lg bg-blue-50 px-3 py-2 text-sm text-slate-600">
              For demo purposes, use any 6-digit code to proceed.
            </p>
            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setStep("signup")} className="rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-700">
                Back
              </button>
              <button disabled={busy} className="rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                {busy ? "Verifying..." : "Verify & Sign Up"}
              </button>
            </div>
          </form>
          <Link to="/" className="mt-6 inline-block text-sm text-blue-100 hover:text-white">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#2055f7] px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <BrandLogo />
        <h1 className="mt-6 text-5xl font-display font-semibold text-white">Create Account</h1>
        <p className="mt-2 text-blue-100">Sign up to start renting or listing vehicles</p>
        <form
          className="mx-auto mt-8 max-w-md rounded-xl bg-white p-6 text-left"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
              setErr("Please enter a valid email address.");
              return;
            }
            setBusy(true);
            try {
              if (!created) {
                await api.register({ email: normalizedEmail, full_name: fullName, password, role });
                setCreated(true);
              }
              setStep("otp");
            } catch (ex) {
              setErr((ex as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="block text-sm text-slate-700">
            Full Name
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </label>
          <label className="mt-4 block text-sm text-slate-700">
            Email Address
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="mt-4 block text-sm text-slate-700">
            Password
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              minLength={8}
              placeholder="Minimum 8 characters"
              required
            />
          </label>
          <fieldset className="mt-4 space-y-2 text-sm text-slate-700">
            <legend className="mb-1 font-medium">I want to</legend>
            <label className="flex items-center gap-2">
              <input type="radio" name="role" checked={role === "renter"} onChange={() => setRole("renter")} />
              Rent vehicles
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="role" checked={role === "owner"} onChange={() => setRole("owner")} />
              List vehicles as an owner
            </label>
          </fieldset>
          {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
          <button disabled={busy} className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {busy ? "Please wait..." : "Continue to OTP"}
          </button>
          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-semibold text-blue-600 hover:underline" to="/login">
              Sign In
            </Link>
          </p>
        </form>
        <Link to="/" className="mt-6 inline-block text-sm text-blue-100 hover:text-white">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
