package db

import (
	"database/sql"
	"os"
)

func ExportCollection(db *sql.DB, name string, path string) error {
	var requests []byte
	err := db.QueryRow("SELECT requests FROM collections WHERE name = ?", name).Scan(&requests)
	if err != nil {
		return err
	}

	return os.WriteFile(path, requests, 0644)
}
