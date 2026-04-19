package app

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func (a *API) ListVehicles(c *gin.Context) {
	q := a.db.Model(&Vehicle{})
	status := strings.TrimSpace(c.Query("status"))
	if status == "" {
		status = VehicleStatusActive
	}
	if status != "all" && !IsValidVehicleStatus(status) {
		errorJSON(c, http.StatusBadRequest, "Invalid vehicle status")
		return
	}
	if status != "all" {
		q = q.Where("status = ?", status)
	}
	if city := strings.TrimSpace(c.Query("city")); city != "" {
		q = q.Where("lower(city) LIKE ?", "%"+strings.ToLower(city)+"%")
	}
	if category := strings.TrimSpace(c.Query("category")); category != "" {
		if !IsValidVehicleCategory(category) {
			errorJSON(c, http.StatusBadRequest, "Invalid category")
			return
		}
		q = q.Where("category = ?", category)
	}
	if minRate := strings.TrimSpace(c.Query("min_rate")); minRate != "" {
		if n, err := strconv.ParseFloat(minRate, 64); err == nil {
			q = q.Where("daily_rate >= ?", n)
		}
	}
	if maxRate := strings.TrimSpace(c.Query("max_rate")); maxRate != "" {
		if n, err := strconv.ParseFloat(maxRate, 64); err == nil {
			q = q.Where("daily_rate <= ?", n)
		}
	}
	var vehicles []Vehicle
	if err := q.Order("created_at desc").Find(&vehicles).Error; err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to list vehicles")
		return
	}
	c.JSON(http.StatusOK, vehicles)
}

func (a *API) GetVehicle(c *gin.Context) {
	vehicleID, err := parseUintPath(c, "vehicle_id")
	if err != nil {
		errorJSON(c, http.StatusNotFound, "Vehicle not found")
		return
	}
	var v Vehicle
	if err := a.db.First(&v, vehicleID).Error; err != nil {
		errorJSON(c, http.StatusNotFound, "Vehicle not found")
		return
	}
	if v.Status == VehicleStatusActive {
		c.JSON(http.StatusOK, v)
		return
	}
	user := a.OptionalUser(c)
	if user != nil && (user.Role == RoleAdmin || user.ID == v.OwnerID) {
		c.JSON(http.StatusOK, v)
		return
	}
	errorJSON(c, http.StatusNotFound, "Vehicle not found")
}

func (a *API) MyVehicles(c *gin.Context) {
	user := mustCurrentUser(c)
	if user.Role != RoleOwner && user.Role != RoleAdmin {
		c.JSON(http.StatusOK, []Vehicle{})
		return
	}
	var out []Vehicle
	if err := a.db.Where("owner_id = ?", user.ID).Order("created_at desc").Find(&out).Error; err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to list vehicles")
		return
	}
	c.JSON(http.StatusOK, out)
}

func (a *API) CreateVehicle(c *gin.Context) {
	user := mustCurrentUser(c)
	if user.Role != RoleOwner && user.Role != RoleAdmin {
		errorJSON(c, http.StatusForbidden, "Owners only")
		return
	}
	var req CreateVehicleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errorJSON(c, http.StatusBadRequest, err.Error())
		return
	}
	if !IsValidVehicleCategory(req.Category) {
		errorJSON(c, http.StatusBadRequest, "Invalid category")
		return
	}
	v := Vehicle{
		OwnerID:     user.ID,
		Title:       req.Title,
		Description: req.Description,
		Category:    req.Category,
		City:        req.City,
		DailyRate:   req.DailyRate,
		ImageURL:    req.ImageURL,
		Status:      VehicleStatusPendingReview,
	}
	if err := a.db.Create(&v).Error; err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to create vehicle")
		return
	}
	c.JSON(http.StatusOK, v)
}

func (a *API) UpdateVehicle(c *gin.Context) {
	vehicleID, err := parseUintPath(c, "vehicle_id")
	if err != nil {
		errorJSON(c, http.StatusNotFound, "Vehicle not found")
		return
	}
	user := mustCurrentUser(c)
	var v Vehicle
	if err := a.db.First(&v, vehicleID).Error; err != nil {
		errorJSON(c, http.StatusNotFound, "Vehicle not found")
		return
	}
	if user.Role != RoleAdmin && user.ID != v.OwnerID {
		errorJSON(c, http.StatusForbidden, "Not allowed")
		return
	}
	var req UpdateVehicleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errorJSON(c, http.StatusBadRequest, err.Error())
		return
	}
	if req.Title != nil {
		v.Title = *req.Title
	}
	if req.Description != nil {
		v.Description = *req.Description
	}
	if req.Category != nil {
		if !IsValidVehicleCategory(*req.Category) {
			errorJSON(c, http.StatusBadRequest, "Invalid category")
			return
		}
		v.Category = *req.Category
	}
	if req.City != nil {
		v.City = *req.City
	}
	if req.DailyRate != nil && *req.DailyRate > 0 {
		v.DailyRate = *req.DailyRate
	}
	if req.ImageURL != nil {
		v.ImageURL = req.ImageURL
	}
	if req.Status != nil && user.Role == RoleAdmin {
		if !IsValidVehicleStatus(*req.Status) {
			errorJSON(c, http.StatusBadRequest, "Invalid vehicle status")
			return
		}
		v.Status = *req.Status
	}
	if err := a.db.Save(&v).Error; err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to update vehicle")
		return
	}
	c.JSON(http.StatusOK, v)
}

func (a *API) AdminSetVehicleStatus(c *gin.Context) {
	vehicleID, err := parseUintPath(c, "vehicle_id")
	if err != nil {
		errorJSON(c, http.StatusNotFound, "Vehicle not found")
		return
	}
	var req VehicleStatusUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errorJSON(c, http.StatusBadRequest, err.Error())
		return
	}
	if !IsValidVehicleStatus(req.Status) {
		errorJSON(c, http.StatusBadRequest, "Invalid vehicle status")
		return
	}
	var v Vehicle
	if err := a.db.First(&v, vehicleID).Error; err != nil {
		errorJSON(c, http.StatusNotFound, "Vehicle not found")
		return
	}
	v.Status = req.Status
	if err := a.db.Save(&v).Error; err != nil {
		errorJSON(c, http.StatusInternalServerError, "Failed to update vehicle")
		return
	}
	c.JSON(http.StatusOK, v)
}
