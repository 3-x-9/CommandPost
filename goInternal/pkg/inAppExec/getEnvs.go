package pkg

import (
	"database/sql"
	"encoding/json"
)

type Environment struct {
	Name      string            `json:"name"`
	Variables map[string]string `json:"variables"`
}

func GetEnvironments(db *sql.DB) ([]Environment, error) {

	rows, err := db.Query(`SELECT name, variables FROM environments`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	environments := make([]Environment, 0)
	for rows.Next() {
		var environment Environment
		var variables []byte
		if err := rows.Scan(&environment.Name, &variables); err != nil {
			continue
		}
		if err := json.Unmarshal(variables, &environment.Variables); err != nil {
			continue
		}
		environments = append(environments, environment)
	}
	return environments, nil
}
