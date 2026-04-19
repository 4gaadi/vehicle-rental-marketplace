package app

import (
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

type tokenClaims struct {
	Sub string `json:"sub"`
	jwt.RegisteredClaims
}

func (a *API) createToken(userID uint) (string, error) {
	exp := time.Now().Add(time.Duration(a.cfg.AccessTokenExpireMinutes) * time.Minute)
	claims := tokenClaims{
		Sub: strconv.FormatUint(uint64(userID), 10),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(exp),
		},
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(a.cfg.SecretKey))
}

func (a *API) userFromAuthHeader(header string) (*User, error) {
	const prefix = "Bearer "
	if !strings.HasPrefix(header, prefix) {
		return nil, errors.New("Not authenticated")
	}
	tokenStr := strings.TrimSpace(strings.TrimPrefix(header, prefix))
	token, err := jwt.ParseWithClaims(tokenStr, &tokenClaims{}, func(token *jwt.Token) (any, error) {
		return []byte(a.cfg.SecretKey), nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("Invalid or expired token")
	}
	claims, ok := token.Claims.(*tokenClaims)
	if !ok {
		return nil, errors.New("Invalid or expired token")
	}
	userID, err := strconv.ParseUint(claims.Sub, 10, 64)
	if err != nil {
		return nil, errors.New("Invalid or expired token")
	}
	var user User
	if err := a.db.First(&user, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("User not found or inactive")
		}
		return nil, errors.New("Invalid or expired token")
	}
	if !user.IsActive {
		return nil, errors.New("User not found or inactive")
	}
	return &user, nil
}
