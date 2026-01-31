package pkg

type EndpointDef struct {
	Method      string   `json:"method"`
	Path        string   `json:"path"`
	Summary     string   `json:"summary"`
	Description string   `json:"description"`
	Tags        []string `json:"tags"`
}

type SpecDetails struct {
	BaseURL   string        `json:"baseUrl"`
	Endpoints []EndpointDef `json:"endpoints"`
}

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
