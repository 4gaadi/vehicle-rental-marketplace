package app

type PatchUserRequest struct {
	IsActive *bool   `json:"is_active"`
	Role     *string `json:"role"`
}
