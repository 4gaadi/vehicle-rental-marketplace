package app

import "time"

const (
	RoleRenter = "renter"
	RoleOwner  = "owner"
	RoleAdmin  = "admin"
)

type User struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	Email          string    `json:"email" gorm:"size:320;uniqueIndex;not null"`
	FullName       string    `json:"full_name" gorm:"size:200;not null"`
	HashedPassword string    `json:"-" gorm:"size:255;not null"`
	Role           string    `json:"role" gorm:"size:20;not null;default:renter"`
	IsActive       bool      `json:"is_active" gorm:"not null;default:true"`
	CreatedAt      time.Time `json:"created_at" gorm:"not null"`
}

type Vehicle struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	OwnerID     uint      `json:"owner_id" gorm:"index;not null"`
	Title       string    `json:"title" gorm:"size:200;not null"`
	Description string    `json:"description" gorm:"type:text;not null;default:''"`
	Category    string    `json:"category" gorm:"size:30;not null"`
	City        string    `json:"city" gorm:"size:120;index;not null"`
	DailyRate   float64   `json:"daily_rate" gorm:"not null"`
	Status      string    `json:"status" gorm:"size:30;index;not null;default:pending_review"`
	ImageURL    *string   `json:"image_url" gorm:"size:500"`
	CreatedAt   time.Time `json:"created_at" gorm:"not null"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"not null"`
}

type Booking struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	VehicleID  uint      `json:"vehicle_id" gorm:"index;not null"`
	RenterID   uint      `json:"renter_id" gorm:"index;not null"`
	StartAt    time.Time `json:"start_at" gorm:"not null"`
	EndAt      time.Time `json:"end_at" gorm:"not null"`
	TotalPrice float64   `json:"total_price" gorm:"not null"`
	Status     string    `json:"status" gorm:"size:20;index;not null;default:pending"`
	Notes      *string   `json:"notes" gorm:"size:500"`
	CreatedAt  time.Time `json:"created_at" gorm:"not null"`
}
