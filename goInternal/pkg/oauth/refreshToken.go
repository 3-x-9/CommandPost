package oauth

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
)

func refresh_token(tokenEndpoint string, clientID string, refreshToken string) ([]byte, error) {
	data := url.Values{}
	data.Set("grant_type", "refresh_token")
	data.Set("client_id", clientID)
	data.Set("refresh_token", refreshToken)

	resp, err := http.PostForm(tokenEndpoint, data)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("refresh_token: %s", resp.Status)
	}

	return io.ReadAll(resp.Body)
}
