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
			name TEXT PRIMARY KEY,
			variables TEXT
		)
	`); err != nil {
		return err
	}
	return nil
}
