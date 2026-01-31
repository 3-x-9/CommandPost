package oauth

import (
	"encoding/json"
	"fmt"
	"net/url"
)

func PerformOAuthFlow(clientID string, tokenEndpoint string, authEndpoint string, redirectURI string, scope string,
	openBrowser func(string)) (string, string, int, error) {
	verifier, challenge, err := generatePKCE()
	if err != nil {
		return "", "", 0, err
	}

	u, err := url.Parse(redirectURI)
	if err != nil {
		return "", "", 0, fmt.Errorf("invalid redirect URI: %w", err)
	}
	listenHost := u.Host
	if listenHost == "" {
		listenHost = "127.0.0.1:8090"
	}

	_, codeChan, errChan, cleanup, err := StartCallbackServer(listenHost)
	if err != nil {
		return "", "", 0, err
	}
	defer cleanup()

	authUrl := buildUrl(AuthUrlParams{
		authEndpoint:  authEndpoint,
		clientID:      clientID,
		redirectURI:   redirectURI,
		scope:         scope,
		state:         "random_state", // randomize for production
		codeChallenge: challenge,
	}, url.Values{})

	openBrowser(authUrl)

	var code string
	select {
	case code = <-codeChan:
		// Success
	case err := <-errChan:
		return "", "", 0, err
	}

	tokenBody, err := exchangeCodeForToken(ExchangeCodeForTokenParams{
		tokenEndpoint: tokenEndpoint,
		clientID:      clientID,
		redirectURI:   redirectURI,
		code:          code,
		codeVerifier:  verifier,
	})
	if err != nil {
		return "", "", 0, err
	}

	var tokenRes struct {
		AccessToken  string `json:"access_token"`
		RefreshToken string `json:"refresh_token"`
		ExpiresIn    int    `json:"expires_in"`
	}
	if err := json.Unmarshal(tokenBody, &tokenRes); err != nil {
		return "", "", 0, fmt.Errorf("failed to parse token response: %w", err)
	}

	return tokenRes.AccessToken, tokenRes.RefreshToken, tokenRes.ExpiresIn, nil
}
