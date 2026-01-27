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
	export class Collection {
	    name: string;
	    requests: RequestData[];
	
	    static createFrom(source: any = {}) {
	        return new Collection(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.requests = this.convertValues(source["requests"], RequestData);
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
	export class Environment {
	    name: string;
	    variables: Record<string, string>;
	
	    static createFrom(source: any = {}) {
	        return new Environment(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.variables = source["variables"];
	    }
	}
	
	export class HistoryRecord {
	    ID: number;
	    Request: string;
	    Response: string;
	    Timestamp: string;
	
	    static createFrom(source: any = {}) {
	        return new HistoryRecord(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Request = source["Request"];
	        this.Response = source["Response"];
	        this.Timestamp = source["Timestamp"];
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

