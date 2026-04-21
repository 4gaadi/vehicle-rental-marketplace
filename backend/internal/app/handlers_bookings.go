package app

import (
	"math"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func (a *API) CreateBooking(c *gin.Context) {
	user := mustCurrentUser(c)
	var req CreateBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errorJSON(c, http.StatusBadRequest, err.Error())
		return
	}
	startAt, err := time.Parse(time.RFC3339, req.StartAt)
	if err != nil {
		errorJSON(c, http.StatusBadRequest, "Invalid start_at")
		return
	}
	endAt, err := time.Parse(time.RFC3339, req.EndAt)
	if err != nil {
		errorJSON(c, http.StatusBadRequest, "Invalid end_at")
		return
	}
	if !endAt.After(startAt) {
		errorJSON(c, http.StatusBadRequest, "end_at must be after start_at")
		return
	}
	var vehicle Vehicle
	if err := a.db.First(&vehicle, req.VehicleID).Error; err != nil {
		errorJSON(c, http.StatusBadRequest, "Vehicle not found")
		return
	}
	if vehicle.Status != VehicleStatusActive {
		errorJSON(c, http.StatusBadRequest, "Vehicle is not available for booking")
		return
	}
	if vehicle.OwnerID == user.ID {
		errorJSON(c, http.StatusBadRequest, "Cannot book your own vehicle")
		return
	}
	overlap, err := hasBookingOverlap(a.db, req.VehicleID, startAt, endAt)
	if err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to validate booking overlap")
		return
	}
	if overlap {
		errorJSON(c, http.StatusConflict, "Selected dates overlap an existing booking")
		return
	}

	days := ceilDaysBetween(startAt, endAt)
	total := math.Round(float64(days)*vehicle.DailyRate*100) / 100

	b := Booking{
		VehicleID:  req.VehicleID,
		RenterID:   user.ID,
		StartAt:    startAt,
		EndAt:      endAt,
		TotalPrice: total,
		Status:     BookingStatusConfirmed,
		Notes:      req.Notes,
	}
	if err := a.db.Create(&b).Error; err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to create booking")
		return
	}
	c.JSON(http.StatusOK, b)
}

func (a *API) MyBookings(c *gin.Context) {
	user := mustCurrentUser(c)
	var out []Booking
	if err := a.db.Where("renter_id = ?", user.ID).Order("created_at desc").Find(&out).Error; err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to list bookings")
		return
	}
	c.JSON(http.StatusOK, out)
}

func (a *API) OwnerBookings(c *gin.Context) {
	user := mustCurrentUser(c)
	if user.Role != RoleOwner && user.Role != RoleAdmin {
		errorJSON(c, http.StatusForbidden, "Owners only")
		return
	}
	var out []Booking
	err := a.db.Table("bookings").
		Select("bookings.*").
		Joins("JOIN vehicles ON vehicles.id = bookings.vehicle_id").
		Where("vehicles.owner_id = ?", user.ID).
		Order("bookings.created_at desc").
		Scan(&out).Error
	if err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to list bookings")
		return
	}
	c.JSON(http.StatusOK, out)
}

func (a *API) CancelBooking(c *gin.Context) {
	bookingID, err := parseUintPath(c, "booking_id")
	if err != nil {
		errorJSON(c, http.StatusNotFound, "Booking not found")
		return
	}
	user := mustCurrentUser(c)
	var b Booking
	if err := a.db.First(&b, bookingID).Error; err != nil {
		errorJSON(c, http.StatusNotFound, "Booking not found")
		return
	}
	if user.Role != RoleAdmin && user.ID != b.RenterID {
		errorJSON(c, http.StatusForbidden, "Not allowed")
		return
	}
	if b.Status == BookingStatusCancelled || b.Status == BookingStatusCompleted {
		errorJSON(c, http.StatusBadRequest, "Booking cannot be cancelled")
		return
	}
	b.Status = BookingStatusCancelled
	if err := a.db.Save(&b).Error; err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to cancel booking")
		return
	}
	c.JSON(http.StatusOK, b)
}

func (a *API) AdminSetBookingStatus(c *gin.Context) {
	bookingID, err := parseUintPath(c, "booking_id")
	if err != nil {
		errorJSON(c, http.StatusNotFound, "Booking not found")
		return
	}
	var req BookingStatusUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errorJSON(c, http.StatusBadRequest, err.Error())
		return
	}
	if !IsValidBookingStatus(req.Status) {
		errorJSON(c, http.StatusBadRequest, "Invalid booking status")
		return
	}
	var b Booking
	if err := a.db.First(&b, bookingID).Error; err != nil {
		errorJSON(c, http.StatusNotFound, "Booking not found")
		return
	}
	b.Status = req.Status
	if err := a.db.Save(&b).Error; err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to update booking")
		return
	}
	c.JSON(http.StatusOK, b)
}
