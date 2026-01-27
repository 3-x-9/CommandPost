export interface EndpointDef {
    method: string;
    path: string;
    summary: string;
    description: string;
    tags: string[];
}

export interface SpecDetails {
    baseUrl: string;
    endpoints: EndpointDef[];
}

export interface FormDataPart {
    value: string;
    isFile: boolean;
}

export interface RequestData {
    method: string;
    url: string;
    headers: Record<string, string>;
    body: string;
    formData?: Record<string, FormDataPart>;
    timeout: number;
}

export interface ResponseData {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
    timeMs: number;
    size: number;
}

export interface Collection {
    name: string;
    requests: RequestData[];
}

export interface KeyValueItem {
    id: string;
    key: string;
    value: string;
    description?: string;
    enabled: boolean;
    isFile?: boolean;
}

export interface AuthConfig {
    type: 'none' | 'bearer' | 'basic' | 'api_key' | 'oauth' | 'oauth2';
    bearerToken?: string;
    basicUsername?: string;
    basicPassword?: string;
    apiKey?: string;
    apiKeyKey?: string;
    apiKeyIn?: 'header' | 'query';
    oauthToken?: string;
    oauth2Token?: string;
}

export interface Environment {
    name: string;
    variables: Record<string, string>;
}
