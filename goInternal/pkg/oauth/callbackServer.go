package oauth

import (
	"context"
	"fmt"
	"net"
	"net/http"
)

func StartCallbackServer(listenAddr string) (string, chan string, chan error, func(), error) {
	codeChan := make(chan string)
	errChan := make(chan error)

	mux := http.NewServeMux()
	mux.HandleFunc("/callback", func(w http.ResponseWriter, r *http.Request) {
		code := r.URL.Query().Get("code")
		if code == "" {
			http.Error(w, "No code received", http.StatusBadRequest)
			return
		}
		w.Header().Set("Content-Type", "text/html")
		w.Write([]byte("<html><body><h1>Authorization complete</h1><p>You may close this window and return to CommandPost.</p></body></html>"))
		codeChan <- code
	})

	ln, err := net.Listen("tcp", listenAddr)
	if err != nil {
		return "", nil, nil, nil, err
	}

	addr := fmt.Sprintf("http://%s/callback", ln.Addr().String())

	server := &http.Server{Handler: mux}
	go func() {
		if err := server.Serve(ln); err != nil && err != http.ErrServerClosed {
			errChan <- err
		}
	}()

	cleanup := func() {
		server.Shutdown(context.Background())
	}

	return addr, codeChan, errChan, cleanup, nil
}
