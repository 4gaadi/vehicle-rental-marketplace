import type { Booking, BookingStatus, User, Vehicle, VehicleCategory, VehicleStatus } from "./types";

const base = () => import.meta.env.VITE_API_BASE ?? "/api/v1";

function authHeader(): HeadersInit {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function parseError(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { detail?: unknown };
    if (typeof j.detail === "string") return j.detail;
    if (Array.isArray(j.detail)) return j.detail.map((d) => JSON.stringify(d)).join("; ");
  } catch {
    /* ignore */
  }
  return res.statusText || "Request failed";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(await parseError(res));
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ access_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    }),
  register: (body: {
    email: string;
    full_name: string;
    password: string;
    role: "renter" | "owner";
  }) =>
    request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...body,
        email: body.email.trim().toLowerCase(),
      }),
    }),
  me: () => request<User>("/users/me"),
  becomeOwner: () => request<User>("/users/me/become-owner", { method: "POST" }),
  vehicles: (params?: {
    city?: string;
    category?: VehicleCategory;
    min_rate?: number;
    max_rate?: number;
    status?: VehicleStatus | null;
  }) => {
    const sp = new URLSearchParams();
    if (params?.city) sp.set("city", params.city);
    if (params?.category) sp.set("category", params.category);
    if (params?.min_rate != null) sp.set("min_rate", String(params.min_rate));
    if (params?.max_rate != null) sp.set("max_rate", String(params.max_rate));
    if (params?.status != null && params?.status !== undefined) sp.set("status", params.status);
    const q = sp.toString();
    return request<Vehicle[]>(`/vehicles${q ? `?${q}` : ""}`);
  },
  vehicle: (id: number) => request<Vehicle>(`/vehicles/${id}`),
  myVehicles: () => request<Vehicle[]>("/vehicles/mine"),
  createVehicle: (body: {
    title: string;
    description: string;
    category: VehicleCategory;
    city: string;
    daily_rate: number;
    image_url?: string | null;
  }) => request<Vehicle>("/vehicles", { method: "POST", body: JSON.stringify(body) }),
  updateVehicle: (id: number, body: Partial<{ title: string; description: string; city: string; daily_rate: number }>) =>
    request<Vehicle>(`/vehicles/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  createBooking: (body: { vehicle_id: number; start_at: string; end_at: string; notes?: string | null }) =>
    request<Booking>("/bookings", { method: "POST", body: JSON.stringify(body) }),
  myBookings: () => request<Booking[]>("/bookings/mine"),
  ownerBookings: () => request<Booking[]>("/bookings/owner"),
  cancelBooking: (id: number) =>
    request<Booking>(`/bookings/${id}/cancel`, { method: "PATCH", body: JSON.stringify({}) }),
  adminStats: () =>
    request<{
      users: number;
      vehicles: number;
      bookings: number;
      active_vehicles: number;
      pending_vehicles: number;
    }>("/admin/stats"),
  adminUsers: () => request<User[]>("/admin/users"),
  adminPatchUser: (id: number, body: { is_active?: boolean; role?: User["role"] }) =>
    request<User>(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  adminVehicles: (status?: VehicleStatus) => {
    const q = status ? `?status=${encodeURIComponent(status)}` : "";
    return request<Vehicle[]>(`/admin/vehicles${q}`);
  },
  adminSetVehicleStatus: (id: number, status: VehicleStatus) =>
    request<Vehicle>(`/vehicles/${id}/admin-status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  adminBookings: (status?: BookingStatus) => {
    const q = status ? `?status=${encodeURIComponent(status)}` : "";
    return request<Booking[]>(`/admin/bookings${q}`);
  },
  adminSetBookingStatus: (id: number, status: BookingStatus) =>
    request<Booking>(`/bookings/${id}/admin-status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
