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

export interface RequestData {
    method: string;
    url: string;
    headers: Record<string, string>;
    body: string;
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
}

export interface AuthConfig {
    type: 'none' | 'bearer' | 'basic';
    bearerToken?: string;
    basicUsername?: string;
    basicPassword?: string;
}
