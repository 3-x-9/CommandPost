package oauth

type ExchangeCodeForTokenParams struct {
	tokenEndpoint string
	clientID      string
	redirectURI   string
	code          string
	codeVerifier  string
}

type AuthUrlParams struct {
	authEndpoint  string
	clientID      string
	redirectURI   string
	scope         string
	state         string
	codeChallenge string
}
