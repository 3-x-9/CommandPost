package db

import (
	"encoding/json"
)

func SaveEnvironment(dbChan chan<- DbQuery, env Environment) error {
	data, err := json.Marshal(env.Variables)
	if err != nil {
		return err
	}
	result := make(chan error, 1)
	dbChan <- DbQuery{
		Query:  "INSERT OR REPLACE INTO environments (name, variables) VALUES (?, ?)",
		Args:   []any{env.Name, string(data)},
		Result: result,
	}
	return <-result
}
