package app

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func (a *API) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errorJSON(c, http.StatusBadRequest, err.Error())
		return
	}
	if req.Role != RoleRenter && req.Role != RoleOwner {
		errorJSON(c, http.StatusBadRequest, "Invalid role")
		return
	}
	var existing int64
	a.db.Model(&User{}).Where("email = ?", req.Email).Count(&existing)
	if existing > 0 {
		errorJSON(c, http.StatusBadRequest, "Email already registered")
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to hash password")
		return
	}
	user := User{
		Email:          req.Email,
		FullName:       req.FullName,
		HashedPassword: string(hash),
		Role:           req.Role,
		IsActive:       true,
	}
	if err := a.db.Create(&user).Error; err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to create user")
		return
	}
	c.JSON(http.StatusOK, user)
}

func (a *API) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errorJSON(c, http.StatusBadRequest, err.Error())
		return
	}
	var user User
	if err := a.db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		errorJSON(c, http.StatusUnauthorized, "Incorrect email or password")
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(req.Password)); err != nil {
		errorJSON(c, http.StatusUnauthorized, "Incorrect email or password")
		return
	}
	if !user.IsActive {
		errorJSON(c, http.StatusForbidden, "Account disabled")
		return
	}
	token, err := a.createToken(user.ID)
	if err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to create token")
		return
	}
	c.JSON(http.StatusOK, TokenResponse{AccessToken: token, TokenType: "bearer"})
}
