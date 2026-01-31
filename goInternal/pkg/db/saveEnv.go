package db

import (
	"encoding/json"
)

func SaveEnvironment(dbChan chan<- DbQuery, env Environment) error {
	data, err := json.Marshal(env.Variables)
	if err != nil {
		return err
	}
	result := make(chan error, 1)
	dbChan <- DbQuery{
		Query: `INSERT OR REPLACE INTO environments (name, base_url, access_token, refresh_token, expires_at, 
		auth_url, token_url, client_id, client_secret, redirect_uri, scope, variables, created_at, last_used, oauth2_config) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		Args: []any{
			env.Name, env.BaseURL, env.AccessToken, env.RefreshToken, env.ExpiresAt,
			env.AuthURL, env.TokenURL, env.ClientID, env.ClientSecret, env.RedirectURI, env.Scope,
			string(data), env.CreatedAt, env.LastUsed, env.OAuth2Config,
		},
		Result: result,
	}
	return <-result
}
