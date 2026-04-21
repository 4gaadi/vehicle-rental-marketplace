package app

import (
	"os"
	"strconv"
	"strings"
)

type Config struct {
	AppName                  string
	SecretKey                string
	AccessTokenExpireMinutes int
	DatabaseURL              string
	CORSOrigins              []string
	TrustedProxies           []string
	SeedAdminEmail           string
	SeedAdminPassword        string
	GinMode                  string
	Port                     string
}

func LoadConfig() Config {
	return Config{
		AppName:                  getEnv("APP_NAME", "Vehicle Rental Marketplace"),
		SecretKey:                getEnv("SECRET_KEY", "change-me-in-production-use-openssl-rand-hex-32"),
		AccessTokenExpireMinutes: getEnvInt("ACCESS_TOKEN_EXPIRE_MINUTES", 1440),
		DatabaseURL:              getEnv("DATABASE_URL", "sqlite:///./rental.db"),
		CORSOrigins:              splitCSV(getEnv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")),
		TrustedProxies:           splitCSV(getEnv("TRUSTED_PROXIES", "127.0.0.1,::1")),
		SeedAdminEmail:           getEnv("SEED_ADMIN_EMAIL", "admin@example.com"),
		SeedAdminPassword:        getEnv("SEED_ADMIN_PASSWORD", "ChangeMeAdmin123!"),
		GinMode:                  getEnv("GIN_MODE", "debug"),
		Port:                     getEnv("PORT", "8000"),
	}
}

func splitCSV(v string) []string {
	parts := strings.Split(v, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	if len(out) == 0 {
		return []string{"*"}
	}
	return out
}

func getEnv(k, def string) string {
	v := strings.TrimSpace(os.Getenv(k))
	if v == "" {
		return def
	}
	return v
}

func getEnvInt(k string, def int) int {
	v := strings.TrimSpace(os.Getenv(k))
	if v == "" {
		return def
	}
	i, err := strconv.Atoi(v)
	if err != nil {
		return def
	}
	return i
}
