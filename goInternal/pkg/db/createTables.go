package db

import "database/sql"

func CreateCollectionsTable(db *sql.DB) error {
	if _, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS collections (
			name TEXT PRIMARY KEY,
			requests TEXT
		)
	`); err != nil {
		return err
	}
	return nil
}

func CreateHistoryTable(db *sql.DB) error {
	if _, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS history (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			request TEXT,
			response TEXT,
			timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
		)
	`); err != nil {
		return err
	}
	return nil
}

func CreateEnvironmentsTable(db *sql.DB) error {
	if _, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS environments (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			base_url TEXT,
			access_token TEXT,
			refresh_token TEXT,
			expires_at DATETIME,
			auth_url TEXT,
			token_url TEXT,
			client_id TEXT,
			client_secret TEXT,
			redirect_uri TEXT,
			scope TEXT,
			variables TEXT,
			created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_used DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
		)
	`); err != nil {
		return err
	}

	// Migrations for existing tables
	db.Exec("ALTER TABLE environments ADD COLUMN auth_url TEXT")
	db.Exec("ALTER TABLE environments ADD COLUMN token_url TEXT")
	db.Exec("ALTER TABLE environments ADD COLUMN client_id TEXT")
	db.Exec("ALTER TABLE environments ADD COLUMN client_secret TEXT")
	db.Exec("ALTER TABLE environments ADD COLUMN redirect_uri TEXT")
	db.Exec("ALTER TABLE environments ADD COLUMN scope TEXT")
	db.Exec("ALTER TABLE environments ADD COLUMN oauth2_config TEXT")

	return nil
}
