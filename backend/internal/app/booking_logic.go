package app

import (
	"math"
	"time"

	"gorm.io/gorm"
)

func ceilDaysBetween(start, end time.Time) int {
	seconds := end.Sub(start).Seconds()
	if seconds <= 0 {
		return 0
	}
	return int(math.Ceil(seconds / 86400.0))
}

func hasBookingOverlap(db *gorm.DB, vehicleID uint, startAt, endAt time.Time) (bool, error) {
	var overlap int64
	err := db.Model(&Booking{}).
		Where("vehicle_id = ? AND status IN ? AND start_at < ? AND end_at > ?",
			vehicleID, []string{BookingStatusPending, BookingStatusConfirmed}, endAt, startAt).
		Count(&overlap).Error
	if err != nil {
		return false, err
	}
	return overlap > 0, nil
}
