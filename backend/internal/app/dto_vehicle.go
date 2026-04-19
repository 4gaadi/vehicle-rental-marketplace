package app

type CreateVehicleRequest struct {
	Title       string  `json:"title" binding:"required"`
	Description string  `json:"description"`
	Category    string  `json:"category" binding:"required"`
	City        string  `json:"city" binding:"required"`
	DailyRate   float64 `json:"daily_rate" binding:"required,gt=0"`
	ImageURL    *string `json:"image_url"`
}

type UpdateVehicleRequest struct {
	Title       *string  `json:"title"`
	Description *string  `json:"description"`
	Category    *string  `json:"category"`
	City        *string  `json:"city"`
	DailyRate   *float64 `json:"daily_rate"`
	ImageURL    *string  `json:"image_url"`
	Status      *string  `json:"status"`
}

type VehicleStatusUpdateRequest struct {
	Status string `json:"status" binding:"required"`
}
