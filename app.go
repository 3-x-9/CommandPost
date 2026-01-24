package main

import (
	"CommandPost/goInternal/pkg/db"
	"CommandPost/goInternal/pkg/generator"
	pkg "CommandPost/goInternal/pkg/inAppExec"
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/url"
	"os"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/wailsapp/wails/v2/pkg/runtime"

	_ "modernc.org/sqlite"
)

// App struct
type App struct {
	ctx context.Context
	db  *sql.DB
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	database, err := sql.Open("sqlite", "./commandpost.db")
	if err != nil {
		log.Fatal(err)
	}
	a.db = database
	db.CreateCollectionsTable(a.db)
	db.CreateHistoryTable(a.db)
}

func (a *App) SelectDirectory() (string, error) {
	return runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Output Directory",
	})
}

func (a *App) ValidateSpec(path string) (bool, error) {
	loader := openapi3.NewLoader()
	var err error
	if isURL(path) {
		u, _ := url.Parse(path)
		_, err = loader.LoadFromURI(u)
	} else {
		_, err = loader.LoadFromFile(path)
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

func (a *App) GetAuthInfo(path string) ([]generator.AuthScheme, error) {
	loader := openapi3.NewLoader()
	var doc *openapi3.T
	var err error
	if isURL(path) {
		u, _ := url.Parse(path)
		doc, err = loader.LoadFromURI(u)
	} else {
		doc, err = loader.LoadFromFile(path)
	}
	if err != nil {
		return nil, err
	}

	schemesMap := generator.DetectAuth(doc)
	schemes := make([]generator.AuthScheme, 0, len(schemesMap))
	for _, s := range schemesMap {
		schemes = append(schemes, s)
	}
	return schemes, nil
}

func (a *App) Generate(specPath, outputDir, moduleName string) error {
	gen := generator.NewGenerator()

	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return fmt.Errorf("failed to create output directory: %w", err)
	}

	return gen.Generate(specPath, outputDir, moduleName)
}

func isURL(s string) bool {
	u, err := url.Parse(s)
	return err == nil && u.Scheme != "" && u.Host != ""
}

func (a *App) ParseSpecDetails(path string) (pkg.SpecDetails, error) {
	specs, err := pkg.ParseSpec(path)
	if err != nil {
		return pkg.SpecDetails{}, err
	}
	return specs, nil
}

func (a *App) ExecuteRequest(req pkg.RequestData) (pkg.ResponseData, error) {
	response, err := pkg.ExecuteHTTP(req)
	if err != nil {
		return pkg.ResponseData{}, err
	}
	return response, nil
}

func (a *App) SaveCollection(name string, requests []pkg.RequestData) error {
	err := pkg.SaveCollection(a.db, name, requests)
	if err != nil {
		return err
	}
	return nil
}

func (a *App) LoadCollection() ([]pkg.Collection, error) {
	collections, err := pkg.LoadCollections(a.db)
	if err != nil {
		return nil, err
	}
	return collections, nil
}

func (a *App) DeleteCollection(name string) error {
	err := pkg.DeleteCollection(a.db, name)
	if err != nil {
		return err
	}
	return nil
}

func (a *App) SaveHistory(req pkg.RequestData, res pkg.ResponseData) error {
	err := pkg.SaveHistory(a.db, req, res)
	if err != nil {
		return err
	}
	return nil
}

func (a *App) LoadHistory() ([]pkg.HistoryRecord, error) {
	history, err := pkg.LoadHistory(a.db)
	if err != nil {
		return nil, err
	}
	return history, nil
}
