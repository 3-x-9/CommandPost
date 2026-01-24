package pkg

import (
	"database/sql"
	"encoding/json"
)

func SaveCollection(db *sql.DB, name string, requests []RequestData) error {
	data, err := json.Marshal(requests)
	if err != nil {
		return err
	}
	_, err = db.Exec("INSERT OR REPLACE INTO collections (name, requests) VALUES (?, ?)", name, string(data))
	if err != nil {
		return err
	}
	return nil
}
