package app

type CreateBookingRequest struct {
	VehicleID uint    `json:"vehicle_id" binding:"required"`
	StartAt   string  `json:"start_at" binding:"required"`
	EndAt     string  `json:"end_at" binding:"required"`
	Notes     *string `json:"notes"`
}

type BookingStatusUpdateRequest struct {
	Status string `json:"status" binding:"required"`
}
