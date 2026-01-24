package pkg

import "database/sql"

func DeleteCollection(db *sql.DB, name string) error {
	_, err := db.Exec(`DELETE FROM collections WHERE name = ?`, name)
	if err != nil {
		return err
	}
	return nil
}
