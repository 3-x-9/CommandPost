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
    oauth2Token?: string; // Legacy

    // Comprehensive OAuth2 fields
    oauth2Config?: {
        accessToken?: string;
        headerPrefix?: string;
        autoRefreshToken?: boolean;
        shareToken?: boolean;

        tokenName?: string;
        grantType?: string;
        callbackUrl?: string;
        authUrl?: string;
        accessTokenUrl?: string;
        clientId?: string;
        clientSecret?: string;
        scope?: string;
        state?: string;
        clientAuth?: 'basic' | 'body';
    }
}

export interface Environment {
    name: string;
    base_url: string;
    access_token: string;
    refresh_token: string;
    expires_at: string;
    auth_url: string;
    token_url: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    scope: string;
    variables: Record<string, string>;
    created_at: string;
    last_used: string;
    oauth2Config?: AuthConfig['oauth2Config'];
    oauth2_config: string;
}
