package oauth

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
)

func generateCodeVerifier() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func generateCodeChallenge(verifier string) string {
	hash := sha256.Sum256([]byte(verifier))
	return base64.RawURLEncoding.EncodeToString(hash[:])
}

func generatePKCE() (string, string, error) {
	verifier, err := generateCodeVerifier()
	if err != nil {
		return "", "", err
	}
	challenge := generateCodeChallenge(verifier)
	return verifier, challenge, nil
}
