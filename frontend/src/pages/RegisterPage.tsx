import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useAuth } from "@/auth/AuthContext";

export function RegisterPage() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"renter" | "owner">("renter");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="font-display text-3xl font-semibold text-white">Create account</h1>
      <form
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(null);
          setBusy(true);
          try {
            await api.register({ email, full_name: fullName, password, role });
            await login(email, password);
            nav("/browse");
          } catch (ex) {
            setErr((ex as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="block text-sm text-slate-300">
          Full name
          <input
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm text-slate-300">
          Email
          <input
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label className="block text-sm text-slate-300">
          Password (min 8 characters)
          <input
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            minLength={8}
            required
          />
        </label>
        <fieldset className="text-sm text-slate-300 space-y-2">
          <legend className="mb-1">I want to</legend>
          <label className="flex items-center gap-2">
            <input type="radio" name="role" checked={role === "renter"} onChange={() => setRole("renter")} />
            Rent vehicles
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="role" checked={role === "owner"} onChange={() => setRole("owner")} />
            List vehicles as an owner
          </label>
        </fieldset>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button
          disabled={busy}
          className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>
      <p className="text-sm text-slate-400">
        Already registered?{" "}
        <Link className="text-emerald-400 hover:underline" to="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}
