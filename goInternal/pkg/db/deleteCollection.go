package db

func DeleteCollection(dbChan chan<- DbQuery, name string) error {
	result := make(chan error, 1)
	dbChan <- DbQuery{
		Query:  `DELETE FROM collections WHERE name = ?`,
		Args:   []any{name},
		Result: result,
	}
	return <-result
}
