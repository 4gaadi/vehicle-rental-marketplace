package app

import (
	"errors"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func OpenDB(rawURL string) (*gorm.DB, error) {
	switch {
	case strings.HasPrefix(rawURL, "sqlite:///"):
		path := strings.TrimPrefix(rawURL, "sqlite:///")
		return gorm.Open(sqlite.Open(path), &gorm.Config{})
	case strings.HasPrefix(rawURL, "postgresql+psycopg2://"):
		return gorm.Open(postgres.Open(strings.TrimPrefix(rawURL, "postgresql+psycopg2://")), &gorm.Config{})
	case strings.HasPrefix(rawURL, "postgres://"), strings.HasPrefix(rawURL, "postgresql://"):
		return gorm.Open(postgres.Open(rawURL), &gorm.Config{})
	default:
		return nil, errors.New("unsupported DATABASE_URL")
	}
}

func MigrateAndSeed(db *gorm.DB, cfg Config) error {
	if err := db.AutoMigrate(&User{}, &Vehicle{}, &Booking{}); err != nil {
		return err
	}
	var existingCount int64
	if err := db.Model(&User{}).Where("email = ?", cfg.SeedAdminEmail).Count(&existingCount).Error; err != nil {
		return err
	}
	if existingCount > 0 {
		return nil
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(cfg.SeedAdminPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	admin := User{
		Email:          cfg.SeedAdminEmail,
		FullName:       "Platform Admin",
		HashedPassword: string(hash),
		Role:           RoleAdmin,
		IsActive:       true,
	}
	return db.Create(&admin).Error
}
