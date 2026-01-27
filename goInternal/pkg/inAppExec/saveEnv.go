package pkg

import (
	"database/sql"
	"encoding/json"
)

func SaveEnvironment(db *sql.DB, env Environment) error {
	data, err := json.Marshal(env.Variables)
	if err != nil {
		return err
	}
	_, err = db.Exec("INSERT OR REPLACE INTO environments (name, variables) VALUES (?, ?)", env.Name, string(data))
	if err != nil {
		return err
	}
	return nil
}
