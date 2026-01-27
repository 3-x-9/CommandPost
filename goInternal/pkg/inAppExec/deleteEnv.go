package pkg

import "database/sql"

func DeleteEnvironment(db *sql.DB, name string) error {
	_, err := db.Exec("DELETE FROM environments WHERE name = ?", name)
	if err != nil {
		return err
	}
	return nil
}
