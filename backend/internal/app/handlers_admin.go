package app

import "net/http"

import "github.com/gin-gonic/gin"

func (a *API) AdminStats(c *gin.Context) {
	var usersCount, vehiclesCount, bookingsCount, activeVehicles, pendingVehicles int64
	a.db.Model(&User{}).Count(&usersCount)
	a.db.Model(&Vehicle{}).Count(&vehiclesCount)
	a.db.Model(&Booking{}).Count(&bookingsCount)
	a.db.Model(&Vehicle{}).Where("status = ?", VehicleStatusActive).Count(&activeVehicles)
	a.db.Model(&Vehicle{}).Where("status = ?", VehicleStatusPendingReview).Count(&pendingVehicles)

	c.JSON(http.StatusOK, gin.H{
		"users":            usersCount,
		"vehicles":         vehiclesCount,
		"bookings":         bookingsCount,
		"active_vehicles":  activeVehicles,
		"pending_vehicles": pendingVehicles,
	})
}

func (a *API) AdminUsers(c *gin.Context) {
	skip := parseIntDefault(c.Query("skip"), 0)
	limit := parseIntDefault(c.Query("limit"), 50)
	if limit > 200 {
		limit = 200
	}
	var users []User
	if err := a.db.Order("created_at desc").Offset(skip).Limit(limit).Find(&users).Error; err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to list users")
		return
	}
	c.JSON(http.StatusOK, users)
}

func (a *API) AdminPatchUser(c *gin.Context) {
	admin := mustCurrentUser(c)
	userID, err := parseUintPath(c, "user_id")
	if err != nil {
		errorJSON(c, http.StatusNotFound, "User not found")
		return
	}
	var u User
	if err := a.db.First(&u, userID).Error; err != nil {
		errorJSON(c, http.StatusNotFound, "User not found")
		return
	}
	var req PatchUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errorJSON(c, http.StatusBadRequest, err.Error())
		return
	}
	if req.IsActive != nil {
		if admin.ID == u.ID && !*req.IsActive {
			errorJSON(c, http.StatusBadRequest, "Cannot deactivate yourself")
			return
		}
		u.IsActive = *req.IsActive
	}
	if req.Role != nil {
		if *req.Role != RoleRenter && *req.Role != RoleOwner && *req.Role != RoleAdmin {
			errorJSON(c, http.StatusBadRequest, "Invalid role")
			return
		}
		u.Role = *req.Role
	}
	if err := a.db.Save(&u).Error; err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to update user")
		return
	}
	c.JSON(http.StatusOK, u)
}

func (a *API) AdminVehicles(c *gin.Context) {
	skip := parseIntDefault(c.Query("skip"), 0)
	limit := parseIntDefault(c.Query("limit"), 100)
	if limit > 500 {
		limit = 500
	}
	status := c.Query("status")
	if status != "" && !IsValidVehicleStatus(status) {
		errorJSON(c, http.StatusBadRequest, "Invalid vehicle status")
		return
	}
	q := a.db.Model(&Vehicle{})
	if status != "" {
		q = q.Where("status = ?", status)
	}
	var vehicles []Vehicle
	if err := q.Order("created_at desc").Offset(skip).Limit(limit).Find(&vehicles).Error; err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to list vehicles")
		return
	}
	c.JSON(http.StatusOK, vehicles)
}

func (a *API) AdminBookings(c *gin.Context) {
	skip := parseIntDefault(c.Query("skip"), 0)
	limit := parseIntDefault(c.Query("limit"), 100)
	if limit > 500 {
		limit = 500
	}
	status := c.Query("status")
	if status != "" && !IsValidBookingStatus(status) {
		errorJSON(c, http.StatusBadRequest, "Invalid booking status")
		return
	}
	q := a.db.Model(&Booking{})
	if status != "" {
		q = q.Where("status = ?", status)
	}
	var bookings []Booking
	if err := q.Order("created_at desc").Offset(skip).Limit(limit).Find(&bookings).Error; err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to list bookings")
		return
	}
	c.JSON(http.StatusOK, bookings)
}
