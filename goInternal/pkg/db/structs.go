package db

import pkg "CommandPost/goInternal/pkg/inAppExec"

type HistoryRecord struct {
	ID        int    `json:"id"`
	Request   string `json:"request"`
	Response  string `json:"response"`
	Timestamp string `json:"timestamp"`
}

type Collection struct {
	Name     string            `json:"name"`
	Requests []pkg.RequestData `json:"requests"`
}

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

type Environment struct {
	Name         string            `json:"name"`
	BaseURL      string            `json:"base_url"`
	AccessToken  string            `json:"access_token"`
	RefreshToken string            `json:"refresh_token"`
	ExpiresAt    string            `json:"expires_at"`
	AuthURL      string            `json:"auth_url"`
	TokenURL     string            `json:"token_url"`
	ClientID     string            `json:"client_id"`
	ClientSecret string            `json:"client_secret"`
	RedirectURI  string            `json:"redirect_uri"`
	Scope        string            `json:"scope"`
	Variables    map[string]string `json:"variables"`
	CreatedAt    string            `json:"created_at"`
	LastUsed     string            `json:"last_used"`
	OAuth2Config string            `json:"oauth2_config"`
}

type DbQuery struct {
	Query  string
	Args   []any
	Result chan error
}
