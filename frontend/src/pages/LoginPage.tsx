import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const normalizedEmail = email.trim().toLowerCase();

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
        <form
          className="w-full max-w-[540px] overflow-hidden rounded-2xl border border-white/12 bg-[#121318] text-left shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            if (!normalizedEmail) {
              setErr("Please enter your email address.");
              return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
              setErr("Please enter a valid email address.");
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
                <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-white">Welcome Back</h1>
                <p className="mt-5 text-lg font-semibold text-[#a0a1a8]">Login to access all features</p>
              </div>
              <Link to="/" aria-label="Close login" className="text-3xl font-light leading-none text-white transition hover:text-[#2f66f3]">
                ×
              </Link>
            </div>

            <label className="mt-12 block text-base font-bold text-[#a0a1a8]">
              Email Address
              <span className="mt-3 flex min-h-[56px] items-center gap-4 rounded-lg border border-white/12 bg-[#1e1f28] px-4 text-[#a0a1a8] focus-within:border-[#2f66f3]">
                <MailIcon />
                <input
                  className="w-full bg-transparent text-lg font-semibold text-white outline-none placeholder:text-[#a0a1a8]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </span>
            </label>

            <label className="mt-7 block text-base font-bold text-[#a0a1a8]">
              Password
              <span className="mt-3 flex min-h-[56px] items-center gap-4 rounded-lg border border-white/12 bg-[#1e1f28] px-4 text-[#a0a1a8] focus-within:border-[#2f66f3]">
                <LockIcon />
                <input
                  className="w-full bg-transparent text-lg font-semibold text-white outline-none placeholder:text-[#a0a1a8]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </span>
            </label>

            <div className="mt-7 flex flex-col gap-4 text-lg font-semibold sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-3 text-[#a0a1a8]">
                <input type="checkbox" className="h-5 w-5 rounded border-white/20 accent-[#2f66f3]" />
                Remember me
              </label>
              <Link to="/login" className="text-[#087bff] transition hover:text-[#4f9cff]">
                Forgot password?
              </Link>
            </div>

            {err && <p className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">{err}</p>}

            <button
              disabled={busy}
              className="mt-7 min-h-[58px] w-full rounded-lg bg-[#116bf6] text-lg font-bold text-white transition hover:bg-[#2f7dff] disabled:opacity-60"
            >
              {busy ? "Logging in..." : "Login"}
            </button>

            <p className="mt-9 text-center text-base font-semibold text-[#a0a1a8]">
              Don&apos;t have an account?{" "}
              <Link className="font-bold text-[#087bff] hover:text-[#4f9cff]" to="/register">
                Sign up
              </Link>
            </p>
          </div>

          <div className="border-t border-white/10 bg-[#17181f] px-10 py-6 text-center text-sm font-semibold leading-6 text-[#a0a1a8]">
            This is a demo using mock authentication. By continuing, you agree to CROODZ&apos;s Terms of Service.
          </div>
        </form>
      </div>
    </div>
  );
}
