export type UserRole = "renter" | "owner" | "admin";

export type VehicleCategory =
  | "bike"
  | "scooter"
  | "car"
  | "premium_car"
  | "suv"
  | "cycle";

export type VehicleStatus =
  | "draft"
  | "pending_review"
  | "active"
  | "rejected"
  | "inactive";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type User = {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
};

export type Vehicle = {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  category: VehicleCategory;
  city: string;
  daily_rate: number;
  status: VehicleStatus;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: number;
  vehicle_id: number;
  renter_id: number;
  start_at: string;
  end_at: string;
  total_price: number;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
};
