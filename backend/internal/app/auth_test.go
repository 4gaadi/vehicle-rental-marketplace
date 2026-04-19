package app

import (
	"fmt"
	"testing"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", t.Name())
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("open db: %v", err)
	}
	if err := db.AutoMigrate(&User{}, &Vehicle{}, &Booking{}); err != nil {
		t.Fatalf("migrate db: %v", err)
	}
	return db
}

func TestCreateTokenAndResolveUserFromHeader(t *testing.T) {
	db := setupTestDB(t)
	hash, _ := bcrypt.GenerateFromPassword([]byte("pass12345"), bcrypt.DefaultCost)
	user := User{
		Email:          "u@example.com",
		FullName:       "User One",
		HashedPassword: string(hash),
		Role:           RoleRenter,
		IsActive:       true,
	}
	if err := db.Create(&user).Error; err != nil {
		t.Fatalf("create user: %v", err)
	}

	api := &API{db: db, cfg: Config{SecretKey: "test-secret", AccessTokenExpireMinutes: 60}}
	token, err := api.createToken(user.ID)
	if err != nil {
		t.Fatalf("create token: %v", err)
	}

	got, err := api.userFromAuthHeader("Bearer " + token)
	if err != nil {
		t.Fatalf("resolve user: %v", err)
	}
	if got.ID != user.ID {
		t.Fatalf("expected user %d, got %d", user.ID, got.ID)
	}
}

func TestUserFromAuthHeaderRejectsBadOrInactiveUser(t *testing.T) {
	db := setupTestDB(t)
	hash, _ := bcrypt.GenerateFromPassword([]byte("pass12345"), bcrypt.DefaultCost)
	user := User{
		Email:          "inactive@example.com",
		FullName:       "Inactive User",
		HashedPassword: string(hash),
		Role:           RoleRenter,
		IsActive:       true,
	}
	if err := db.Create(&user).Error; err != nil {
		t.Fatalf("create user: %v", err)
	}
	if err := db.Model(&user).Update("is_active", false).Error; err != nil {
		t.Fatalf("deactivate user: %v", err)
	}
	api := &API{db: db, cfg: Config{SecretKey: "test-secret", AccessTokenExpireMinutes: 60}}

	if _, err := api.userFromAuthHeader("bad-token"); err == nil {
		t.Fatalf("expected auth format error")
	}

	token, err := api.createToken(user.ID)
	if err != nil {
		t.Fatalf("create token: %v", err)
	}
	if _, err := api.userFromAuthHeader("Bearer " + token); err == nil {
		t.Fatalf("expected inactive-user auth error")
	}
}
