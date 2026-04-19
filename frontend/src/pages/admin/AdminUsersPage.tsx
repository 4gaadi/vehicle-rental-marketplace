import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import type { User, UserRole } from "@/types";

export function AdminUsersPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-users"], queryFn: () => api.adminUsers() });
  const patch = useMutation({
    mutationFn: (args: { id: number; body: { is_active?: boolean; role?: UserRole } }) =>
      api.adminPatchUser(args.id, args.body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-white">Users</h2>
      {q.isLoading && <p className="text-slate-400 text-sm">Loading…</p>}
      {q.isError && <p className="text-red-400 text-sm">{(q.error as Error).message}</p>}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900/80 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {(q.data ?? []).map((u: User) => (
              <tr key={u.id} className="bg-slate-950/40">
                <td className="px-4 py-3 text-slate-400">{u.id}</td>
                <td className="px-4 py-3 text-white">{u.full_name}</td>
                <td className="px-4 py-3 text-slate-300">{u.email}</td>
                <td className="px-4 py-3 capitalize text-slate-300">{u.role}</td>
                <td className="px-4 py-3">{u.is_active ? "yes" : "no"}</td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    type="button"
                    className="text-xs text-emerald-400 hover:underline"
                    onClick={() => patch.mutate({ id: u.id, body: { is_active: !u.is_active } })}
                  >
                    Toggle active
                  </button>
                  {u.role !== "admin" && (
                    <button
                      type="button"
                      className="text-xs text-amber-300 hover:underline"
                      onClick={() =>
                        patch.mutate({ id: u.id, body: { role: u.role === "owner" ? "renter" : "owner" } })
                      }
                    >
                      Flip owner/renter
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
