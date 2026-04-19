package app

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (a *API) AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := a.userFromAuthHeader(c.GetHeader("Authorization"))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"detail": err.Error()})
			c.Abort()
			return
		}
		c.Set("user", user)
		c.Next()
	}
}

func (a *API) AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		user := mustCurrentUser(c)
		if user.Role != RoleAdmin {
			c.JSON(http.StatusForbidden, gin.H{"detail": "Insufficient permissions"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func (a *API) OptionalUser(c *gin.Context) *User {
	user, err := a.userFromAuthHeader(c.GetHeader("Authorization"))
	if err != nil {
		return nil
	}
	return user
}

func mustCurrentUser(c *gin.Context) *User {
	v, ok := c.Get("user")
	if !ok {
		panic("missing auth user")
	}
	u, ok := v.(*User)
	if !ok {
		panic("invalid auth user type")
	}
	return u
}
