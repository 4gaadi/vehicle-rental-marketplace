package app

const (
	VehicleStatusDraft         = "draft"
	VehicleStatusPendingReview = "pending_review"
	VehicleStatusActive        = "active"
	VehicleStatusRejected      = "rejected"
	VehicleStatusInactive      = "inactive"
)

const (
	BookingStatusPending   = "pending"
	BookingStatusConfirmed = "confirmed"
	BookingStatusCancelled = "cancelled"
	BookingStatusCompleted = "completed"
)

var VehicleCategories = []string{
	"bike",
	"scooter",
	"car",
	"premium_car",
	"suv",
	"cycle",
}

var VehicleStatuses = []string{
	VehicleStatusDraft,
	VehicleStatusPendingReview,
	VehicleStatusActive,
	VehicleStatusRejected,
	VehicleStatusInactive,
}

var BookingStatuses = []string{
	BookingStatusPending,
	BookingStatusConfirmed,
	BookingStatusCancelled,
	BookingStatusCompleted,
}

func contains(values []string, target string) bool {
	for _, v := range values {
		if v == target {
			return true
		}
	}
	return false
}

func IsValidVehicleCategory(v string) bool {
	return contains(VehicleCategories, v)
}

func IsValidVehicleStatus(v string) bool {
	return contains(VehicleStatuses, v)
}

func IsValidBookingStatus(v string) bool {
	return contains(BookingStatuses, v)
}
