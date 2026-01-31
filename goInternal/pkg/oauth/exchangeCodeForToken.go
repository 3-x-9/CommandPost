package oauth

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
)

func exchangeCodeForToken(params ExchangeCodeForTokenParams) ([]byte, error) {
	data := url.Values{}
	data.Set("grant_type", "authorization_code")
	data.Set("client_id", params.clientID)
	data.Set("code", params.code)
	data.Set("redirect_uri", params.redirectURI)
	data.Set("code_verifier", params.codeVerifier)

	req, err := http.NewRequest("POST", params.tokenEndpoint, strings.NewReader(data.Encode()))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("exchangeCodeForToken error: %s %s", resp.Status, string(body))
	}

	return io.ReadAll(resp.Body)
}
