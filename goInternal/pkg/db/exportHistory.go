package db

import (
	"database/sql"
	"os"
)

func ExportHistory(db *sql.DB, path string) error {
	rows, err := db.Query(`SELECT request, response FROM history`)
	if err != nil {
		return err
	}
	defer rows.Close()

	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()

	for rows.Next() {
		var request string
		var response string
		if err := rows.Scan(&request, &response); err != nil {
			return err
		}
		file.WriteString(request + "\n" + response + "\n")
	}
	return nil
}
