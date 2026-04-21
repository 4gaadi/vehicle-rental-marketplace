package app

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type API struct {
	db  *gorm.DB
	cfg Config
}

func NewAPI(db *gorm.DB, cfg Config) *API {
	return &API{db: db, cfg: cfg}
}

func (a *API) Router() *gin.Engine {
	gin.SetMode(a.cfg.GinMode)
	r := gin.Default()
	_ = r.SetTrustedProxies(a.cfg.TrustedProxies)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     a.cfg.CORSOrigins,
		AllowMethods:     []string{"GET", "POST", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	v1 := r.Group("/api/v1")
	{
		auth := v1.Group("/auth")
		auth.POST("/register", a.Register)
		auth.POST("/login", a.Login)

		users := v1.Group("/users")
		users.Use(a.AuthRequired())
		users.GET("/me", a.GetMe)
		users.POST("/me/become-owner", a.BecomeOwner)

		vehicles := v1.Group("/vehicles")
		vehicles.GET("", a.ListVehicles)
		vehicles.GET("/:vehicle_id", a.GetVehicle)
		vehicles.Use(a.AuthRequired())
		vehicles.GET("/mine", a.MyVehicles)
		vehicles.POST("", a.CreateVehicle)
		vehicles.PATCH("/:vehicle_id", a.UpdateVehicle)
		vehicles.PATCH("/:vehicle_id/admin-status", a.AdminOnly(), a.AdminSetVehicleStatus)

		bookings := v1.Group("/bookings")
		bookings.Use(a.AuthRequired())
		bookings.POST("", a.CreateBooking)
		bookings.GET("/mine", a.MyBookings)
		bookings.GET("/owner", a.OwnerBookings)
		bookings.PATCH("/:booking_id/cancel", a.CancelBooking)
		bookings.PATCH("/:booking_id/admin-status", a.AdminOnly(), a.AdminSetBookingStatus)

		admin := v1.Group("/admin")
		admin.Use(a.AuthRequired(), a.AdminOnly())
		admin.GET("/stats", a.AdminStats)
		admin.GET("/users", a.AdminUsers)
		admin.PATCH("/users/:user_id", a.AdminPatchUser)
		admin.GET("/vehicles", a.AdminVehicles)
		admin.GET("/bookings", a.AdminBookings)
	}

	return r
}

func parseUintPath(c *gin.Context, key string) (uint, error) {
	v, err := strconv.ParseUint(c.Param(key), 10, 64)
	return uint(v), err
}

func parseIntDefault(v string, def int) int {
	n, err := strconv.Atoi(strings.TrimSpace(v))
	if err != nil {
		return def
	}
	return n
}

func errorJSON(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{"detail": message})
}
