package app

import (
	"testing"
	"time"
)

func TestHasBookingOverlap(t *testing.T) {
	db := setupTestDB(t)
	baseStart := time.Date(2026, 4, 20, 10, 0, 0, 0, time.UTC)
	baseEnd := baseStart.Add(6 * time.Hour)

	confirmed := Booking{
		VehicleID:  1,
		RenterID:   2,
		StartAt:    baseStart,
		EndAt:      baseEnd,
		TotalPrice: 100,
		Status:     BookingStatusConfirmed,
	}
	if err := db.Create(&confirmed).Error; err != nil {
		t.Fatalf("create booking: %v", err)
	}

	tests := []struct {
		name    string
		start   time.Time
		end     time.Time
		wantHit bool
	}{
		{"overlap inside", baseStart.Add(1 * time.Hour), baseStart.Add(2 * time.Hour), true},
		{"overlap before-end", baseStart.Add(-1 * time.Hour), baseStart.Add(1 * time.Hour), true},
		{"touching edge no overlap", baseEnd, baseEnd.Add(1 * time.Hour), false},
		{"completely after", baseEnd.Add(1 * time.Hour), baseEnd.Add(2 * time.Hour), false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := hasBookingOverlap(db, 1, tt.start, tt.end)
			if err != nil {
				t.Fatalf("hasBookingOverlap error: %v", err)
			}
			if got != tt.wantHit {
				t.Fatalf("expected overlap=%v, got %v", tt.wantHit, got)
			}
		})
	}
}

func TestHasBookingOverlapIgnoresCancelledCompleted(t *testing.T) {
	db := setupTestDB(t)
	start := time.Date(2026, 4, 20, 10, 0, 0, 0, time.UTC)
	end := start.Add(4 * time.Hour)
	for _, status := range []string{BookingStatusCancelled, BookingStatusCompleted} {
		b := Booking{
			VehicleID:  1,
			RenterID:   2,
			StartAt:    start,
			EndAt:      end,
			TotalPrice: 40,
			Status:     status,
		}
		if err := db.Create(&b).Error; err != nil {
			t.Fatalf("create booking %s: %v", status, err)
		}
	}

	got, err := hasBookingOverlap(db, 1, start.Add(30*time.Minute), start.Add(1*time.Hour))
	if err != nil {
		t.Fatalf("hasBookingOverlap error: %v", err)
	}
	if got {
		t.Fatalf("expected no overlap for cancelled/completed bookings")
	}
}
