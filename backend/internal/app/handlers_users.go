package app

import "net/http"

import "github.com/gin-gonic/gin"

func (a *API) GetMe(c *gin.Context) {
	c.JSON(http.StatusOK, mustCurrentUser(c))
}

func (a *API) BecomeOwner(c *gin.Context) {
	user := mustCurrentUser(c)
	if user.Role == RoleRenter {
		user.Role = RoleOwner
		if err := a.db.Save(user).Error; err != nil {
			errorJSON(c, http.StatusInternalServerError, "Failed to update user")
			return
		}
	}
	c.JSON(http.StatusOK, user)
}
