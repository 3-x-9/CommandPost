package db

import (
	pkg "CommandPost/goInternal/pkg/inAppExec"
	"encoding/json"
	"log"
	"os"
)

type PostmanCollection struct {
	Info Info   `json:"info"`
	Item []Item `json:"item"`
}

type Info struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Schema      string `json:"schema"`
}

type Item struct {
	Name     string   `json:"name"`
	Request  *Request `json:"request,omitempty"`
	Response []any    `json:"response"`
	Item     []Item   `json:"item,omitempty"`
}

type Request struct {
	Method      string `json:"method"`
	URL         URL    `json:"url"`
	Header      []KV   `json:"header"`
	Body        *Body  `json:"body"`
	Description string `json:"description"`
}

type URL struct {
	Raw string `json:"raw"`
}

type KV struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type Body struct {
	Mode string `json:"mode"`
	Raw  string `json:"raw,omitempty"`
}

func ImportCollections(dbChan chan<- DbQuery, path string) (*PostmanCollection, error) {
	file, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var collection PostmanCollection
	if err := json.Unmarshal(file, &collection); err != nil {
		log.Println("Error unmarshaling Postman collection:", err)
		return nil, err
	}
	if err := SaveImportedCollections(dbChan, &collection); err != nil {
		return nil, err
	}
	return &collection, nil
}

// {"method":"GET","url":"","headers":{"Content-Type":"application/json"},"body":"{}","formData":{},"timeout":5000}

func SaveImportedCollections(dbChan chan<- DbQuery, collection *PostmanCollection) error {
	var allRequests []pkg.RequestData
	collectRequests(collection.Item, &allRequests)

	if len(allRequests) == 0 {
		return nil
	}

	data, err := json.Marshal(allRequests)
	if err != nil {
		return err
	}

	result := make(chan error, 1)
	dbChan <- DbQuery{
		Query:  "INSERT OR REPLACE INTO collections (name, requests) VALUES (?, ?)",
		Args:   []any{collection.Info.Name, string(data)},
		Result: result,
	}

	return <-result
}

func collectRequests(items []Item, allRequests *[]pkg.RequestData) {
	for _, item := range items {
		if item.Request != nil {
			var body string
			if item.Request.Body != nil {
				body = item.Request.Body.Raw
			}

			reqData := pkg.RequestData{
				Method:  item.Request.Method,
				URL:     item.Request.URL.Raw,
				Headers: headersToMap(item.Request.Header),
				Body:    body,
				Timeout: 5000,
			}
			*allRequests = append(*allRequests, reqData)
		}

		if len(item.Item) > 0 {
			collectRequests(item.Item, allRequests)
		}
	}
}

func headersToMap(headers []KV) map[string]string {
	headerMap := make(map[string]string)
	for _, header := range headers {
		headerMap[header.Key] = header.Value
	}
	return headerMap
}
