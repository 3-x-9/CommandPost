package db

import (
	"database/sql"
)

type DbQuery struct {
	Query  string
	Args   []any
	Result chan error
}

func DbWorker(db *sql.DB, writeChan <-chan DbQuery) {
	for query := range writeChan {
		_, err := db.Exec(query.Query, query.Args...)
		if query.Result != nil {
			query.Result <- err
		}
	}
}
