package oauth

import "net/url"

func buildUrl(params AuthUrlParams, additionalParams url.Values) string {
	q := url.Values{}
	q.Set("response_type", "code")
	q.Set("client_id", params.clientID)
	q.Set("redirect_uri", params.redirectURI)
	q.Set("scope", params.scope)
	q.Set("state", params.state)
	q.Set("code_challenge", params.codeChallenge)
	q.Set("code_challenge_method", "S256")
	for k, v := range additionalParams {
		q.Set(k, v[0])
	}
	return params.authEndpoint + "?" + q.Encode()
}
