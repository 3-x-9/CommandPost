package db

import (
	"database/sql"
	"encoding/json"
)

func GetEnvironments(db *sql.DB) ([]Environment, error) {
	rows, err := db.Query(`SELECT name, base_url, access_token, refresh_token, expires_at, auth_url, token_url, client_id, client_secret, redirect_uri, scope, variables, created_at, last_used, oauth2_config FROM environments`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	environments := make([]Environment, 0)
	for rows.Next() {
		var environment Environment
		var variables []byte
		if err := rows.Scan(
			&environment.Name,
			&environment.BaseURL,
			&environment.AccessToken,
			&environment.RefreshToken,
			&environment.ExpiresAt,
			&environment.AuthURL,
			&environment.TokenURL,
			&environment.ClientID,
			&environment.ClientSecret,
			&environment.RedirectURI,
			&environment.Scope,
			&variables,
			&environment.CreatedAt,
			&environment.LastUsed,
			&environment.OAuth2Config,
		); err != nil {
			continue
		}
		if err := json.Unmarshal(variables, &environment.Variables); err != nil {
			continue
		}
		environments = append(environments, environment)
	}
	return environments, nil
}
