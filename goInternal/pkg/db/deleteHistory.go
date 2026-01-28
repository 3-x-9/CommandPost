package db

import "log"

func DeleteHistoryItem(dbChan chan<- DbQuery, id int) error {
	result := make(chan error, 1)
	dbChan <- DbQuery{
		Query:  `DELETE FROM history WHERE id = ?`,
		Args:   []any{id},
		Result: result,
	}
	log.Printf("Deleted history with id: %d", id)
	return <-result
}

func DeleteHistory(dbChan chan<- DbQuery) error {
	result := make(chan error, 1)
	dbChan <- DbQuery{
		Query:  `DELETE FROM history`,
		Result: result,
	}
	log.Printf("Deleted history")
	return <-result
}
