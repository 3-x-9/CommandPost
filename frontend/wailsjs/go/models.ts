export namespace db {
	
	export class Body {
	    mode: string;
	    raw?: string;
	
	    static createFrom(source: any = {}) {
	        return new Body(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mode = source["mode"];
	        this.raw = source["raw"];
	    }
	}
	export class Collection {
	    name: string;
	    requests: pkg.RequestData[];
	
	    static createFrom(source: any = {}) {
	        return new Collection(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.requests = this.convertValues(source["requests"], pkg.RequestData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Environment {
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
	    oauth2_config: string;
	
	    static createFrom(source: any = {}) {
	        return new Environment(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.base_url = source["base_url"];
	        this.access_token = source["access_token"];
	        this.refresh_token = source["refresh_token"];
	        this.expires_at = source["expires_at"];
	        this.auth_url = source["auth_url"];
	        this.token_url = source["token_url"];
	        this.client_id = source["client_id"];
	        this.client_secret = source["client_secret"];
	        this.redirect_uri = source["redirect_uri"];
	        this.scope = source["scope"];
	        this.variables = source["variables"];
	        this.created_at = source["created_at"];
	        this.last_used = source["last_used"];
	        this.oauth2_config = source["oauth2_config"];
	    }
	}
	export class HistoryRecord {
	    id: number;
	    request: string;
	    response: string;
	    timestamp: string;
	
	    static createFrom(source: any = {}) {
	        return new HistoryRecord(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.request = source["request"];
	        this.response = source["response"];
	        this.timestamp = source["timestamp"];
	    }
	}
	export class Info {
	    name: string;
	    description: string;
	    schema: string;
	
	    static createFrom(source: any = {}) {
	        return new Info(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.description = source["description"];
	        this.schema = source["schema"];
	    }
	}
	export class KV {
	    key: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new KV(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.value = source["value"];
	    }
	}
	export class URL {
	    raw: string;
	
	    static createFrom(source: any = {}) {
	        return new URL(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.raw = source["raw"];
	    }
	}
	export class Request {
	    method: string;
	    url: URL;
	    header: KV[];
	    body?: Body;
	    description: string;
	
	    static createFrom(source: any = {}) {
	        return new Request(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.method = source["method"];
	        this.url = this.convertValues(source["url"], URL);
	        this.header = this.convertValues(source["header"], KV);
	        this.body = this.convertValues(source["body"], Body);
	        this.description = source["description"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Item {
	    name: string;
	    request?: Request;
	    response: any[];
	    item?: Item[];
	
	    static createFrom(source: any = {}) {
	        return new Item(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.request = this.convertValues(source["request"], Request);
	        this.response = source["response"];
	        this.item = this.convertValues(source["item"], Item);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class PostmanCollection {
	    info: Info;
	    item: Item[];
	
	    static createFrom(source: any = {}) {
	        return new PostmanCollection(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.info = this.convertValues(source["info"], Info);
	        this.item = this.convertValues(source["item"], Item);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	

}

export namespace frontend {
	
	export class FileFilter {
	    DisplayName: string;
	    Pattern: string;
	
	    static createFrom(source: any = {}) {
	        return new FileFilter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.DisplayName = source["DisplayName"];
	        this.Pattern = source["Pattern"];
	    }
	}

}

export namespace generator {
	
	export class AuthScheme {
	    Name: string;
	    Type: string;
	    Scheme: string;
	    In: string;
	    HeaderName: string;
	
	    static createFrom(source: any = {}) {
	        return new AuthScheme(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Type = source["Type"];
	        this.Scheme = source["Scheme"];
	        this.In = source["In"];
	        this.HeaderName = source["HeaderName"];
	    }
	}

}

export namespace pkg {
	
	export class EndpointDef {
	    method: string;
	    path: string;
	    summary: string;
	    description: string;
	    tags: string[];
	
	    static createFrom(source: any = {}) {
	        return new EndpointDef(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.method = source["method"];
	        this.path = source["path"];
	        this.summary = source["summary"];
	        this.description = source["description"];
	        this.tags = source["tags"];
	    }
	}
	export class FormDataPart {
	    value: string;
	    isFile: boolean;
	
	    static createFrom(source: any = {}) {
	        return new FormDataPart(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.value = source["value"];
	        this.isFile = source["isFile"];
	    }
	}
	export class RequestData {
	    method: string;
	    url: string;
	    headers: Record<string, string>;
	    body: string;
	    formData: Record<string, FormDataPart>;
	    timeout: number;
	
	    static createFrom(source: any = {}) {
	        return new RequestData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.method = source["method"];
	        this.url = source["url"];
	        this.headers = source["headers"];
	        this.body = source["body"];
	        this.formData = this.convertValues(source["formData"], FormDataPart, true);
	        this.timeout = source["timeout"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ResponseData {
	    statusCode: number;
	    headers: Record<string, string>;
	    body: string;
	    timeMs: number;
	    size: number;
	
	    static createFrom(source: any = {}) {
	        return new ResponseData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.statusCode = source["statusCode"];
	        this.headers = source["headers"];
	        this.body = source["body"];
	        this.timeMs = source["timeMs"];
	        this.size = source["size"];
	    }
	}
	export class SpecDetails {
	    baseUrl: string;
	    endpoints: EndpointDef[];
	
	    static createFrom(source: any = {}) {
	        return new SpecDetails(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.baseUrl = source["baseUrl"];
	        this.endpoints = this.convertValues(source["endpoints"], EndpointDef);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

