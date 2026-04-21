import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { BrandLogo } from "@/components/BrandLogo";

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const normalizedEmail = email.trim().toLowerCase();

  return (
    <div className="min-h-[70vh] bg-[#2055f7] px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <BrandLogo />
        <h1 className="mt-6 text-5xl font-display font-semibold text-white">Welcome Back</h1>
        <p className="mt-2 text-blue-100">Sign in to your account</p>
        <form
          className="mx-auto mt-8 max-w-md rounded-xl bg-white p-6 text-left"
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
          <label className="block text-sm text-slate-700">
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
              placeholder="Enter your password"
              required
            />
          </label>
          {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
          <button disabled={busy} className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {busy ? "Signing in..." : "Sign In"}
          </button>
          <p className="mt-4 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link className="font-semibold text-blue-600 hover:underline" to="/register">
              Sign Up
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
