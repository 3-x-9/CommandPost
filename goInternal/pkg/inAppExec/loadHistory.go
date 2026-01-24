package pkg

import "database/sql"

type HistoryRecord struct {
	ID        int
	Request   string
	Response  string
	Timestamp string
}

func LoadHistory(db *sql.DB) ([]HistoryRecord, error) {
	rows, err := db.Query("SELECT id, request, response, timestamp FROM history ORDER BY timestamp DESC LIMIT 15")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var history []HistoryRecord
	for rows.Next() {
		var record HistoryRecord
		if err := rows.Scan(&record.ID, &record.Request, &record.Response, &record.Timestamp); err != nil {
			return nil, err
		}
		history = append(history, record)
	}
	return history, nil
}
