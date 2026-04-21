import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useAuth } from "@/auth/AuthContext";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function AuthBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#05060a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(31,70,150,0.2)_0%,rgba(12,22,48,0.2)_22%,rgba(5,6,10,0.96)_62%)]" />
      <div className="absolute inset-0 opacity-25 blur-[9px]">
        <div className="mx-auto max-w-[1480px] px-6 py-28 sm:px-10 lg:px-16">
          <div className="max-w-[780px] pt-24">
            <div className="h-12 w-56 rounded-full border border-[#2355c7]/60 bg-[#10204a]/70" />
            <div className="mt-12 space-y-7">
              <div className="h-24 max-w-[520px] rounded bg-white/70" />
              <div className="h-24 max-w-[520px] rounded bg-[#2f66f3]/80" />
            </div>
            <div className="mt-11 h-20 max-w-[760px] rounded bg-white/25" />
            <div className="mt-12 flex gap-5">
              <div className="h-[70px] w-[235px] rounded-lg bg-[#2f66f3]" />
              <div className="h-[70px] w-[205px] rounded-lg border border-white/12 bg-[#0d0e14]" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/62" />
      <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[1480px] items-center justify-center px-6 py-16 sm:px-10 lg:px-16">
        {children}
      </div>
    </div>
  );
}

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
      <AuthBackdrop>
          <form
            className="w-full max-w-[540px] overflow-hidden rounded-2xl border border-white/12 bg-[#121318] text-left shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
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
            <div className="p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-white">Verify OTP</h1>
                  <p className="mt-5 text-lg font-semibold text-[#a0a1a8]">Enter the 6-digit code sent to {normalizedEmail}</p>
                </div>
                <Link to="/" aria-label="Close signup" className="text-3xl font-light leading-none text-white transition hover:text-[#2f66f3]">
                  ×
                </Link>
              </div>
              <label className="mt-12 block text-base font-bold text-[#a0a1a8]">
                Enter OTP
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  inputMode="numeric"
                  maxLength={6}
                  className="mt-3 min-h-[56px] w-full rounded-lg border border-white/12 bg-[#1e1f28] px-4 text-center text-xl font-semibold tracking-[0.4em] text-white outline-none placeholder:text-[#a0a1a8] focus:border-[#2f66f3]"
                  placeholder="000000"
                />
              </label>
              <p className="mt-5 rounded-lg border border-[#2f66f3]/20 bg-[#10204a]/70 px-4 py-3 text-sm font-semibold text-[#a0a1a8]">
                For demo purposes, use any 6-digit code to proceed.
              </p>
              {err && <p className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">{err}</p>}
              <div className="mt-7 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setStep("signup")} className="rounded-lg border border-white/12 py-3 text-sm font-bold text-white">
                  Back
                </button>
                <button disabled={busy} className="rounded-lg bg-[#116bf6] py-3 text-sm font-bold text-white hover:bg-[#2f7dff] disabled:opacity-60">
                  {busy ? "Verifying..." : "Verify & Sign Up"}
                </button>
              </div>
            </div>
            <div className="border-t border-white/10 bg-[#17181f] px-10 py-6 text-center text-sm font-semibold leading-6 text-[#a0a1a8]">
              This is a demo using mock authentication. By continuing, you agree to CROODZ&apos;s Terms of Service.
            </div>
          </form>
      </AuthBackdrop>
    );
  }

  return (
    <AuthBackdrop>
        <form
          className="w-full max-w-[680px] overflow-hidden rounded-2xl border border-white/12 bg-[#121318] text-left shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
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
          <div className="p-10 sm:p-12">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="font-display text-4xl font-bold tracking-[0.1em] text-white sm:text-5xl">Join CROODZ</h1>
                <p className="mt-7 text-xl font-semibold text-[#a0a1a8]">Create an account to get started</p>
              </div>
              <Link to="/" aria-label="Close signup" className="text-3xl font-light leading-none text-white transition hover:text-[#2f66f3]">
                ×
              </Link>
            </div>

            <label className="mt-14 block text-lg font-bold text-[#a0a1a8]">
              Email Address
              <span className="mt-4 flex min-h-[70px] items-center gap-5 rounded-lg border border-white/12 bg-[#1e1f28] px-5 text-[#a0a1a8] focus-within:border-[#2f66f3]">
                <MailIcon />
                <input
                  className="w-full bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-[#a0a1a8]"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (!fullName) setFullName(e.target.value.split("@")[0]);
                  }}
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </span>
            </label>

            <label className="mt-9 block text-lg font-bold text-[#a0a1a8]">
              Password
              <span className="mt-4 flex min-h-[70px] items-center gap-5 rounded-lg border border-white/12 bg-[#1e1f28] px-5 text-[#a0a1a8] focus-within:border-[#2f66f3]">
                <LockIcon />
                <input
                  className="w-full bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-[#a0a1a8]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  minLength={8}
                  placeholder="••••••••"
                  required
                />
              </span>
            </label>

            <div className="sr-only">
              <label>
                Full Name
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </label>
              <label>
                <input type="radio" name="role" checked={role === "renter"} onChange={() => setRole("renter")} />
                Rent vehicles
              </label>
            </div>

            {err && <p className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">{err}</p>}

            <button
              disabled={busy}
              className="mt-9 min-h-[74px] w-full rounded-lg bg-[#116bf6] text-2xl font-bold text-white transition hover:bg-[#2f7dff] disabled:opacity-60"
            >
              {busy ? "Please wait..." : "Create Account"}
            </button>

            <p className="mt-12 text-center text-xl font-semibold text-[#a0a1a8]">
              Already have an account?{" "}
              <Link className="font-bold text-[#087bff] hover:text-[#4f9cff]" to="/login">
                Login
              </Link>
            </p>
          </div>

          <div className="border-t border-white/10 bg-[#17181f] px-10 py-7 text-center text-lg font-semibold leading-7 text-[#a0a1a8]">
            This is a demo using mock authentication. By continuing, you agree to CROODZ&apos;s Terms of Service.
          </div>
        </form>
    </AuthBackdrop>
  );
}
