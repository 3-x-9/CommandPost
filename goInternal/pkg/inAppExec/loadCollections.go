package pkg

import (
	"database/sql"
	"encoding/json"
)

type Collection struct {
	Name     string        `json:"name"`
	Requests []RequestData `json:"requests"`
}

func LoadCollections(db *sql.DB) ([]Collection, error) {
	rows, err := db.Query(`SELECT name, requests FROM collections`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	collections := make([]Collection, 0)
	for rows.Next() {
		var collection Collection
		var requests []byte
		if err := rows.Scan(&collection.Name, &requests); err != nil {
			return nil, err
		}
		if err := json.Unmarshal(requests, &collection.Requests); err != nil {
			return nil, err
		}
		collections = append(collections, collection)
	}
	return collections, nil
}
