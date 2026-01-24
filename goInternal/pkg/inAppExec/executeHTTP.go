package pkg

import (
	"bytes"
	"io"
	"net/http"
	"strings"
	"time"
)

type RequestData struct {
	Method  string            `json:"method"`
	URL     string            `json:"url"`
	Headers map[string]string `json:"headers"`
	Body    string            `json:"body"`
	Timeout int               `json:"timeout"`
}

type ResponseData struct {
	StatusCode int               `json:"statusCode"`
	Headers    map[string]string `json:"headers"`
	Body       string            `json:"body"`
	TimeMs     int64             `json:"timeMs"`
	Size       int               `json:"size"`
}

func ExecuteHTTP(reqDat RequestData) (ResponseData, error) {
	// 1. Handle Body
	var bodyReader io.Reader
	if reqDat.Body != "" {
		bodyReader = bytes.NewBufferString(reqDat.Body)
	}

	req, err := http.NewRequest(reqDat.Method, reqDat.URL, bodyReader)
	if err != nil {
		return ResponseData{
			StatusCode: 0,
			Body:       "Error creating request: " + err.Error(),
			Headers:    map[string]string{"Content-Type": "text/plain"},
			TimeMs:     0,
		}, nil
	}

	// 2. Handle Headers
	for k, v := range reqDat.Headers {
		req.Header.Set(k, v)
	}

	client := &http.Client{
		Timeout: time.Second * time.Duration(reqDat.Timeout),
	}

	start := time.Now()
	resp, err := client.Do(req)
	if err != nil {
		return ResponseData{
			StatusCode: 0,
			Body:       "Error executing request: " + err.Error(),
			Headers:    map[string]string{"Content-Type": "text/plain"},
			TimeMs:     0,
		}, nil
	}
	defer resp.Body.Close()

	duration := time.Since(start)

	// 3. Handle Response Headers
	resHeaders := make(map[string]string)
	for name, header := range resp.Header {
		if len(header) == 0 || name == "" {
			continue
		}
		resHeaders[name] = strings.Join(header, ", ")
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return ResponseData{}, err
	}

	return ResponseData{
		StatusCode: resp.StatusCode,
		Headers:    resHeaders,
		Body:       string(body),
		TimeMs:     duration.Milliseconds(),
		Size:       len(body),
	}, nil
}
