package db

import (
	"database/sql"
)

type HistoryRecord struct {
	ID        int    `json:"id"`
	Request   string `json:"request"`
	Response  string `json:"response"`
	Timestamp string `json:"timestamp"`
}

func LoadHistory(db *sql.DB) ([]HistoryRecord, error) {
	rows, err := db.Query("SELECT id, request, response, timestamp FROM history ORDER BY id DESC LIMIT 15")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	history := []HistoryRecord{}
	for rows.Next() {
		var record HistoryRecord
		if err := rows.Scan(&record.ID, &record.Request, &record.Response, &record.Timestamp); err != nil {
			return nil, err
		}
		history = append(history, record)
	}
	return history, nil
}
