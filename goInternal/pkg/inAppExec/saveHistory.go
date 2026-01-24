package pkg

import (
	"database/sql"
	"encoding/json"
)

func SaveHistory(db *sql.DB, req RequestData, res ResponseData) error {
	reqJSON, err := json.Marshal(req)
	if err != nil {
		return err
	}
	resJSON, err := json.Marshal(res)
	if err != nil {
		return err
	}
	_, err = db.Exec(`INSERT INTO history (request, response) VALUES (?, ?)`, reqJSON, resJSON)
	if err != nil {
		return err
	}
	return nil
}
