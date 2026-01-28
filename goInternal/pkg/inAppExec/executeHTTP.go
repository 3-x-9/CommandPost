package pkg

import (
	"bytes"
	"io"
	"mime/multipart"
	"net/http"
	"strings"
	"time"
)

type FormDataPart struct {
	Value  string `json:"value"`
	IsFile bool   `json:"isFile"`
}

type RequestData struct {
	Method   string                  `json:"method"`
	URL      string                  `json:"url"`
	Headers  map[string]string       `json:"headers"`
	Body     string                  `json:"body"`
	FormData map[string]FormDataPart `json:"formData"`
	Timeout  int                     `json:"timeout"`
}

type ResponseData struct {
	StatusCode int               `json:"statusCode"`
	Headers    map[string]string `json:"headers"`
	Body       string            `json:"body"`
	TimeMs     int64             `json:"timeMs"`
	Size       int               `json:"size"`
}

func ExecuteHTTP(reqDat RequestData) (ResponseData, error) {
	var bodyReader io.Reader
	if reqDat.Body != "" {
		bodyReader = bytes.NewBufferString(reqDat.Body)
	} else if len(reqDat.FormData) > 0 {
		mimeWriter := &bytes.Buffer{}
		multipartWriter := multipart.NewWriter(mimeWriter)
		for k, v := range reqDat.FormData {
			if v.IsFile {
				multipartWriter.CreateFormFile(k, v.Value)
			} else {
				multipartWriter.CreateFormField(k)
			}
		}
		multipartWriter.Close()
		bodyReader = mimeWriter
	}

	if reqDat.Method == "GET" {
		reqDat.Body = ""
		reqDat.FormData = nil
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
