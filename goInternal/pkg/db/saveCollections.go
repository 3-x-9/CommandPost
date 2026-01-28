package db

import (
	pkg "CommandPost/goInternal/pkg/inAppExec"
	"encoding/json"
)

func SaveCollection(dbChan chan<- DbQuery, name string, requests []pkg.RequestData) error {
	data, err := json.Marshal(requests)
	if err != nil {
		return err
	}
	result := make(chan error, 1)
	dbChan <- DbQuery{
		Query:  "INSERT OR REPLACE INTO collections (name, requests) VALUES (?, ?)",
		Args:   []any{name, string(data)},
		Result: result,
	}
	return <-result
}
