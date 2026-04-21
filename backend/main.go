package main

import (
	"log"

	"vehicle-rental-marketplace/backend/internal/app"
)

func main() {
	cfg := app.LoadConfig()
	db, err := app.OpenDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database connect error: %v", err)
	}
	if err := app.MigrateAndSeed(db, cfg); err != nil {
		log.Fatalf("database setup error: %v", err)
	}

	api := app.NewAPI(db, cfg)
	addr := ":" + cfg.Port
	log.Printf("starting %s on %s", cfg.AppName, addr)
	if err := api.Router().Run(addr); err != nil {
		log.Fatal(err)
	}
}
