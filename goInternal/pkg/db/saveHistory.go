package db

import (
	pkg "CommandPost/goInternal/pkg/inAppExec"
	"encoding/json"
)

func SaveHistory(dbChan chan<- DbQuery, req pkg.RequestData, res pkg.ResponseData) error {
	reqJSON, err := json.Marshal(req)
	if err != nil {
		return err
	}
	resJSON, err := json.Marshal(res)
	if err != nil {
		return err
	}
	result := make(chan error, 1)
	dbChan <- DbQuery{
		Query:  `INSERT INTO history (request, response) VALUES (?, ?)`,
		Args:   []any{reqJSON, resJSON},
		Result: result,
	}
	return <-result
}
