package pkg

import (
	"CommandPost/goInternal/pkg/generator"
	"net/url"
	"strings"

	"github.com/getkin/kin-openapi/openapi3"
)

func ParseSpec(specPath string) (SpecDetails, error) {
	loader := openapi3.NewLoader()

	var doc *openapi3.T
	var err error
	var op *openapi3.Operation
	var method string
	var endpointDefs []EndpointDef

	if generator.IsURL(specPath) {
		parsedURL, err := url.Parse(specPath)
		if err != nil {
			return SpecDetails{}, err
		}
		doc, err = loader.LoadFromURI(parsedURL)
	} else {
		doc, err = loader.LoadFromFile(specPath)
	}

	if err != nil {
		return SpecDetails{}, err
	}

	baseURL := ""
	if len(doc.Servers) > 0 {
		baseURL = doc.Servers[0].URL
	}

	if generator.IsURL(specPath) && !strings.HasPrefix(baseURL, "http") {
		if specURL, err := url.Parse(specPath); err == nil {
			if relURL, err := url.Parse(baseURL); err == nil {
				baseURL = specURL.ResolveReference(relURL).String()
			}
		}
	}

	for path, pathItem := range doc.Paths.Map() {
		ops := map[string]*openapi3.Operation{
			"get":    pathItem.Get,
			"post":   pathItem.Post,
			"put":    pathItem.Put,
			"delete": pathItem.Delete,
			"patch":  pathItem.Patch,
		}

		for method, op = range ops {
			if op == nil {
				continue
			}

			endpointDefs = append(endpointDefs, EndpointDef{
				Method:      strings.ToUpper(method),
				Path:        path,
				Summary:     op.Summary,
				Description: op.Description,
				Tags:        op.Tags,
			})
		}
	}
	return SpecDetails{
		BaseURL:   baseURL,
		Endpoints: endpointDefs,
	}, nil
}
